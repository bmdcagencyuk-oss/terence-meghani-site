'use client';

import { useEffect, useRef } from 'react';
import type * as THREE_NS from 'three';
import { buildAllStages, type StageData } from '@/lib/hero/morphing-stages';
import {
  particleFragmentShader,
  particleVertexShader,
} from '@/lib/hero/particle-shaders';

const PARTICLE_COUNT = 4000;
const ROCKET_PARTICLES = 800;
const GORILLA_SVG_URL = '/brand/emblem-gorilla.svg';

// Easing IDs match the shader's uEasingMode switch.
const EASE_IN_OUT_CUBIC = 0;
const EASE_IN_EXPO = 1;
const EASE_OUT_CUBIC = 2;
const EASE_IN_CUBIC = 3;
const EASE_AGGRESSIVE_SNAP = 5;

const SPIRAL_DURATION_MS = 2400; // Phase 4.6 — 3 beats × shorter beats.
const LEAN_IN_PHASE_MS = 400;
const LEAN_OUT_PHASE_MS = 200;
const IGNITION_DURATION_MS = 1000;
const DETACH_FLASH_MS = 200;

const BLOOM_BASE = 0.6;
const BLOOM_PEAK_SINGULARITY = 1.6; // Phase 4.6 — louder spiral peak.
const BLOOM_PEAK_DETACH = 1.0;

type StageEntry = {
  name: string;
  data: StageData;
  holdMs: number;
  outMs: number;
  outEase: number;
  outMode: 'normal' | 'spiral';
};

/**
 * Phase 4.6 — three coordinated continuity fixes:
 *
 *   1. Faster, event-like transitions: 0.7 s with aggressiveSnap easing
 *      (smoothstep applied twice) for a clear anticipation/peak/settle
 *      profile. Applies to sketch→refined, wireframe→rendered, launch
 *      drift-back. The launch ascent and rendered→launchStart retain
 *      their existing pacing.
 *
 *   2. Dissolved hold/transition boundary via a lean-in envelope. During
 *      the last 400 ms of every hold and the first 200 ms of every
 *      non-spiral transition, particles drift up to 8% toward their
 *      next-stage target with a 3× wobble multiplier and 1.15× brightness
 *      pulse. The transition then completes the remaining 92%.
 *
 *   3. Spiral rebuilt as 3 beats over 2.4 s — vortex pull (immediate
 *      rotation + radial collapse), singularity (compress + pause), and
 *      explosion (75% in 0.3 s, 25% over 0.7 s). Bloom peaks at 1.6 across
 *      [0.9–1.4] s; a 10% screen-flash brightness lift across [1.4–1.55] s
 *      reinforces the energy release.
 *
 * Total loop ≈ 28.8 s.
 */
export function MorphingGorilla() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let cleanup: (() => void) | null = null;

    (async () => {
      const THREE = await import('three');
      const { EffectComposer } = await import(
        'three/examples/jsm/postprocessing/EffectComposer.js'
      );
      const { RenderPass } = await import(
        'three/examples/jsm/postprocessing/RenderPass.js'
      );
      const { UnrealBloomPass } = await import(
        'three/examples/jsm/postprocessing/UnrealBloomPass.js'
      );
      const { ShaderPass } = await import(
        'three/examples/jsm/postprocessing/ShaderPass.js'
      );
      const { OutputPass } = await import(
        'three/examples/jsm/postprocessing/OutputPass.js'
      );

      const all = await buildAllStages(GORILLA_SVG_URL, PARTICLE_COUNT);

      // 6-entry table. outMs is the duration of the transition LEAVING this
      // stage; outEase / outMode select the mechanic. The spiral lives on
      // the refined entry (outMode='spiral', outMs=2400).
      const stages: StageEntry[] = [
        { name: 'sketch',      data: all.sketch,      holdMs: 4000, outMs:  700,                outEase: EASE_AGGRESSIVE_SNAP, outMode: 'normal' },
        { name: 'refined',     data: all.refined,     holdMs: 5000, outMs: SPIRAL_DURATION_MS,  outEase: 0,                     outMode: 'spiral' },
        { name: 'wireframe',   data: all.wireframe,   holdMs: 4000, outMs:  700,                outEase: EASE_AGGRESSIVE_SNAP, outMode: 'normal' },
        { name: 'rendered',    data: all.rendered,    holdMs: 6000, outMs: 1000,                outEase: EASE_IN_CUBIC,         outMode: 'normal' },
        { name: 'launchStart', data: all.launchStart, holdMs:    0, outMs: 3000,                outEase: EASE_IN_CUBIC,         outMode: 'normal' },
        { name: 'launchEnd',   data: all.launchEnd,   holdMs:  500, outMs: 1500,                outEase: EASE_AGGRESSIVE_SNAP, outMode: 'normal' },
      ];

      if (cancelled || !containerRef.current) return;

      const width = container.clientWidth;
      const height = container.clientHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      const scene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(
        45,
        Math.max(width, 1) / Math.max(height, 1),
        0.1,
        100,
      );
      camera.position.set(0, 0, 8);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      scene.add(new THREE.HemisphereLight(0x4a0fd4, 0x16181a, 0.6));
      const dir = new THREE.DirectionalLight(0xff4d17, 0.8);
      dir.position.set(4, 5, 3);
      scene.add(dir);
      const point = new THREE.PointLight(0x9b3dff, 0.4, 12);
      point.position.set(0, 0, 0);
      scene.add(point);

      // ---- Particle system ----------------------------------------------------
      const geometry = new THREE.BufferGeometry();

      const sourcePositions = new Float32Array(stages[0].data.positions);
      const targetPositions = new Float32Array(stages[1].data.positions);
      const sourceColors = new Float32Array(stages[0].data.colors);
      const targetColors = new Float32Array(stages[1].data.colors);
      const sizes = new Float32Array(PARTICLE_COUNT);
      const delays = new Float32Array(PARTICLE_COUNT);
      const wobblePhases = new Float32Array(PARTICLE_COUNT);
      const isRocket = new Float32Array(PARTICLE_COUNT);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        sizes[i] = 1.5 + Math.random() * 2.0;
        delays[i] = Math.random();
        wobblePhases[i] = Math.random() * Math.PI * 2;
        isRocket[i] = i < ROCKET_PARTICLES ? 1.0 : 0.0;
      }

      geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(new Float32Array(sourcePositions), 3),
      );
      const aSourcePos = new THREE.BufferAttribute(sourcePositions, 3);
      const aTargetPos = new THREE.BufferAttribute(targetPositions, 3);
      const aSourceColor = new THREE.BufferAttribute(sourceColors, 3);
      const aTargetColor = new THREE.BufferAttribute(targetColors, 3);
      geometry.setAttribute('aSourcePos', aSourcePos);
      geometry.setAttribute('aTargetPos', aTargetPos);
      geometry.setAttribute('aSourceColor', aSourceColor);
      geometry.setAttribute('aTargetColor', aTargetColor);
      geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
      geometry.setAttribute('aDelay', new THREE.BufferAttribute(delays, 1));
      geometry.setAttribute(
        'aWobblePhase',
        new THREE.BufferAttribute(wobblePhases, 1),
      );
      geometry.setAttribute('aIsRocket', new THREE.BufferAttribute(isRocket, 1));
      geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 12);

      const material = new THREE.ShaderMaterial({
        vertexShader: particleVertexShader,
        fragmentShader: particleFragmentShader,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uMorphProgress: { value: 0 },
          uTime: { value: 0 },
          uPixelRatio: { value: pixelRatio },
          uHoldDrift: { value: stages[0].data.holdDrift },
          uEasingMode: { value: stages[0].outEase },
          uStage3Mode: { value: 0 },
          uStage3Time: { value: 0 },
          uLeanInAmount: { value: 0 },
          uIgnitionBoost: { value: 0 },
          uUseRocketEasing: { value: 0 },
        },
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      // ---- Post-processing ---------------------------------------------------
      const composer = new EffectComposer(renderer);
      composer.setPixelRatio(pixelRatio);
      composer.setSize(width, height);
      composer.addPass(new RenderPass(scene, camera));
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(width, height),
        BLOOM_BASE,
        0.4,
        0.85,
      );
      composer.addPass(bloomPass);

      // Brightness pass — global multiplier driven by the spiral's BEAT 3
      // onset for the 10% screen-flash energy release. Default 1.0.
      const BrightnessShader = {
        uniforms: {
          tDiffuse: { value: null as THREE_NS.Texture | null },
          multiplier: { value: 1.0 },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform sampler2D tDiffuse;
          uniform float multiplier;
          varying vec2 vUv;
          void main() {
            vec4 c = texture2D(tDiffuse, vUv);
            gl_FragColor = vec4(c.rgb * multiplier, c.a);
          }
        `,
      };
      const brightnessPass = new ShaderPass(BrightnessShader);
      composer.addPass(brightnessPass);

      const ChromaticAberrationShader = {
        uniforms: {
          tDiffuse: { value: null as THREE_NS.Texture | null },
          strength: { value: 0.002 },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform sampler2D tDiffuse;
          uniform float strength;
          varying vec2 vUv;
          void main() {
            vec2 dir = vUv - 0.5;
            float r = texture2D(tDiffuse, vUv + dir * strength).r;
            vec4 c = texture2D(tDiffuse, vUv);
            float b = texture2D(tDiffuse, vUv - dir * strength).b;
            gl_FragColor = vec4(r, c.g, b, c.a);
          }
        `,
      };
      composer.addPass(new ShaderPass(ChromaticAberrationShader));
      composer.addPass(new OutputPass());

      // ---- Resize handling ---------------------------------------------------
      const handleResize = () => {
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w === 0 || h === 0) return;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h, false);
        composer.setSize(w, h);
      };
      window.addEventListener('resize', handleResize);
      const ro = new ResizeObserver(handleResize);
      ro.observe(container);

      // ---- Morph cycle state machine ----------------------------------------
      let stageIdx = 0;
      let mode: 'hold' | 'transition' = 'hold';
      let modeStart = performance.now();
      let driftFrom = stages[stageIdx].data.holdDrift;
      let driftTo = driftFrom;
      // True once the lean-in window has preloaded next-stage data into
      // aTargetPos (or, for spiral, deliberately not preloaded).
      let leanInActive = false;

      const preloadNext = () => {
        const nextIdx = (stageIdx + 1) % stages.length;
        aTargetPos.array.set(stages[nextIdx].data.positions);
        aTargetPos.needsUpdate = true;
        aTargetColor.array.set(stages[nextIdx].data.colors);
        aTargetColor.needsUpdate = true;
        driftFrom = stages[stageIdx].data.holdDrift;
        driftTo = stages[nextIdx].data.holdDrift;
        material.uniforms.uEasingMode.value = stages[stageIdx].outEase;
      };

      const finalizeTransition = () => {
        aSourcePos.array.set(aTargetPos.array as Float32Array);
        aSourcePos.needsUpdate = true;
        aSourceColor.array.set(aTargetColor.array as Float32Array);
        aSourceColor.needsUpdate = true;
      };

      const beginTransition = (now: number) => {
        // Always reload next stage at transition start. For non-spiral
        // stages this is harmless (lean-in already loaded the same data);
        // for spiral it loads wireframe (which lean-in skipped).
        preloadNext();
        leanInActive = false;
        mode = 'transition';
        modeStart = now;
        const stage = stages[stageIdx];
        if (stage.outMode === 'spiral') {
          material.uniforms.uStage3Mode.value = 1;
          material.uniforms.uStage3Time.value = 0;
        }
        material.uniforms.uUseRocketEasing.value =
          stage.name === 'launchStart' ? 1 : 0;
      };

      const enterHoldOrSkip = (now: number) => {
        const stage = stages[stageIdx];
        if (stage.holdMs <= 0) {
          beginTransition(now);
        } else {
          mode = 'hold';
          modeStart = now;
          material.uniforms.uHoldDrift.value = stage.data.holdDrift;
          driftFrom = stage.data.holdDrift;
          driftTo = driftFrom;
          leanInActive = false;
        }
      };

      // Bloom envelope over the spiral.
      const computeSpiralBloom = (t: number): number => {
        if (t < 0.9) return BLOOM_BASE;
        if (t < 1.3) {
          // BEAT 2 buildup — linear ramp to peak.
          const k = (t - 0.9) / 0.4;
          return BLOOM_BASE + (BLOOM_PEAK_SINGULARITY - BLOOM_BASE) * k;
        }
        if (t < 1.4) {
          return BLOOM_PEAK_SINGULARITY;
        }
        if (t < 1.55) {
          // BEAT 3 onset — bloom drops back to base over 0.15 s.
          const k = 1 - (t - 1.4) / 0.15;
          return BLOOM_BASE + (BLOOM_PEAK_SINGULARITY - BLOOM_BASE) * Math.max(0, k);
        }
        return BLOOM_BASE;
      };

      // Detach flash at the rendered → launchStart transition onset.
      const computeDetachBloom = (tMs: number): number => {
        if (tMs >= DETACH_FLASH_MS) return BLOOM_BASE;
        const k = Math.sin((tMs / DETACH_FLASH_MS) * Math.PI);
        return BLOOM_BASE + (BLOOM_PEAK_DETACH - BLOOM_BASE) * k;
      };

      // 10% screen-flash brightness lift across [1.4, 1.55] s of the spiral
      // — 0.05 s ramp up, 0.05 s hold at 1.10×, 0.05 s ramp down.
      const computeFlashMultiplier = (t: number): number => {
        if (t < 1.4) return 1.0;
        if (t < 1.45) return 1.0 + 0.10 * ((t - 1.4) / 0.05);
        if (t < 1.50) return 1.10;
        if (t < 1.55) return 1.0 + 0.10 * (1 - (t - 1.50) / 0.05);
        return 1.0;
      };

      const clock = new THREE.Clock();
      let raf = 0;
      const tick = () => {
        const dt = clock.getDelta();
        const now = performance.now();
        const elapsed = now - modeStart;

        material.uniforms.uTime.value += dt;

        // Lean-in envelope — last 400 ms of hold, first 200 ms of any
        // non-spiral transition. Spiral skips lean-in entirely.
        let leanInAmount = 0;
        if (mode === 'hold') {
          const remaining = stages[stageIdx].holdMs - elapsed;
          if (remaining < LEAN_IN_PHASE_MS) {
            // First entry into the lean-in window: preload next-stage data
            // (skip for spiral so the position lean is a no-op via
            // mix(source, source, 0.08*amount) = source).
            if (!leanInActive) {
              if (stages[stageIdx].outMode !== 'spiral') {
                preloadNext();
              }
              leanInActive = true;
            }
            leanInAmount = Math.max(0, 1 - remaining / LEAN_IN_PHASE_MS);
          }
        } else if (stages[stageIdx].outMode !== 'spiral') {
          if (elapsed < LEAN_OUT_PHASE_MS) {
            leanInAmount = Math.max(0, 1 - elapsed / LEAN_OUT_PHASE_MS);
          }
        }
        material.uniforms.uLeanInAmount.value = leanInAmount;

        // Ignition boost — first 1 s of the launch ascent (launchStart out).
        let ignition = 0;
        if (mode === 'transition' && stages[stageIdx].name === 'launchStart') {
          if (elapsed < IGNITION_DURATION_MS) {
            ignition = 0.5 * (1 - elapsed / IGNITION_DURATION_MS);
          }
        }
        material.uniforms.uIgnitionBoost.value = ignition;

        let bloomTarget = BLOOM_BASE;
        let flashMult = 1.0;

        if (mode === 'hold') {
          material.uniforms.uMorphProgress.value = 0;
          material.uniforms.uHoldDrift.value = driftTo;
          if (elapsed >= stages[stageIdx].holdMs) {
            beginTransition(now);
          }
        } else {
          const stage = stages[stageIdx];
          if (stage.outMode === 'spiral') {
            const tSec = elapsed / 1000;
            material.uniforms.uStage3Time.value = Math.min(2.4, tSec);
            bloomTarget = computeSpiralBloom(tSec);
            flashMult = computeFlashMultiplier(tSec);

            if (tSec >= SPIRAL_DURATION_MS / 1000) {
              material.uniforms.uStage3Mode.value = 0;
              material.uniforms.uStage3Time.value = 0;
              material.uniforms.uMorphProgress.value = 0;
              stageIdx = (stageIdx + 1) % stages.length;
              finalizeTransition();
              enterHoldOrSkip(now);
            }
          } else {
            const t = Math.min(1, elapsed / stage.outMs);
            material.uniforms.uMorphProgress.value = t;
            material.uniforms.uHoldDrift.value =
              driftFrom + (driftTo - driftFrom) * t;

            if (stage.name === 'rendered') {
              bloomTarget = computeDetachBloom(elapsed);
            }

            if (t >= 1) {
              stageIdx = (stageIdx + 1) % stages.length;
              finalizeTransition();
              material.uniforms.uMorphProgress.value = 0;
              material.uniforms.uUseRocketEasing.value = 0;
              enterHoldOrSkip(now);
            }
          }
        }

        bloomPass.strength = bloomTarget;
        brightnessPass.uniforms.multiplier.value = flashMult;

        composer.render(dt);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', handleResize);
        ro.disconnect();
        geometry.dispose();
        material.dispose();
        composer.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      };
    })().catch((err) => {
      console.warn('[MorphingGorilla] init failed', err);
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="hero-morph-canvas"
      aria-hidden="true"
    />
  );
}
