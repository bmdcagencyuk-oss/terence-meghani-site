'use client';

import { useEffect, useRef } from 'react';
import type * as THREE_NS from 'three';
import { buildAllStages, type StageData } from '@/lib/hero/morphing-stages';
import {
  particleFragmentShader,
  particleVertexShader,
} from '@/lib/hero/particle-shaders';

const PARTICLE_COUNT = 4000;
const GORILLA_SVG_URL = '/brand/emblem-gorilla.svg';

/** Easing IDs match the shader's uEasingMode switch. */
const EASE_IN_OUT_CUBIC = 0;
const EASE_IN_EXPO = 1;
const EASE_OUT_CUBIC = 2;
const EASE_IN_CUBIC = 3;

type StageEntry = {
  name: string;
  data: StageData;
  /** ms held at this stage before transitioning out. 0 = skip hold. */
  holdMs: number;
  /** ms for the transition LEAVING this stage to the next. */
  outMs: number;
  /** Easing applied to the outgoing transition. */
  outEase: number;
};

/**
 * Phase 3 — full 6-stage morphing loop. The 7-entry stages array models the
 * loop as: sketch → emblem → code → wireframe → rendered → launchStart
 * (rocket forms) → launchEnd (rocket gone, particles dispersed) → sketch.
 * launchStart has holdMs=0 — the rocket forms and immediately ascends.
 *
 * Per-transition timings + easings come from the spec's stage table.
 * Total cycle is ~37 seconds: 4 + 1.2 + 5 + 1.2 + 5 + 1.2 + 4 + 1.2 + 6 +
 * 1 + (0 + 3) + (0.5 + 3).
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

      // Stage table — outEase applies to the transition LEAVING this entry.
      const stages: StageEntry[] = [
        { name: 'sketch',      data: all.sketch,      holdMs: 4000, outMs: 1200, outEase: EASE_IN_OUT_CUBIC },
        { name: 'refined',     data: all.refined,     holdMs: 5000, outMs: 1200, outEase: EASE_IN_EXPO },
        { name: 'code',        data: all.code,        holdMs: 5000, outMs: 1200, outEase: EASE_OUT_CUBIC },
        { name: 'wireframe',   data: all.wireframe,   holdMs: 4000, outMs: 1200, outEase: EASE_IN_OUT_CUBIC },
        { name: 'rendered',    data: all.rendered,    holdMs: 6000, outMs: 1000, outEase: EASE_IN_CUBIC },
        { name: 'launchStart', data: all.launchStart, holdMs:    0, outMs: 3000, outEase: EASE_IN_CUBIC },
        { name: 'launchEnd',   data: all.launchEnd,   holdMs:  500, outMs: 3000, outEase: EASE_OUT_CUBIC },
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

      // Lighting rig (ShaderMaterial particles ignore these — kept for any
      // lit meshes we may add later).
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
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        sizes[i] = 1.5 + Math.random() * 2.0; // spec: 1.5–3.5 CSS px
        delays[i] = Math.random();
        wobblePhases[i] = Math.random() * Math.PI * 2;
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
      // Generous bounding sphere — Stage 6 dispersal pushes some particles
      // out to ~3.5 from origin, plus ascending rocket reaches y=4.5.
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
        },
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);

      // ---- Post-processing ---------------------------------------------------
      const composer = new EffectComposer(renderer);
      composer.setPixelRatio(pixelRatio);
      composer.setSize(width, height);
      composer.addPass(new RenderPass(scene, camera));
      composer.addPass(
        new UnrealBloomPass(new THREE.Vector2(width, height), 0.6, 0.4, 0.85),
      );

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
      // First transition will be sketch → refined; queue refined as the
      // initial target attribute (already done via initial buffer copy).
      // After the initial hold, we'll rebuild the target from the next stage.

      const advanceTarget = (nextIdx: number) => {
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
        const nextIdx = (stageIdx + 1) % stages.length;
        advanceTarget(nextIdx);
        mode = 'transition';
        modeStart = now;
      };

      const enterHoldOrSkip = (now: number) => {
        const stage = stages[stageIdx];
        if (stage.holdMs <= 0) {
          // Skip hold and chain straight into the next transition.
          beginTransition(now);
        } else {
          mode = 'hold';
          modeStart = now;
          material.uniforms.uHoldDrift.value = stage.data.holdDrift;
          driftFrom = stage.data.holdDrift;
          driftTo = driftFrom;
        }
      };

      const clock = new THREE.Clock();
      let raf = 0;
      const tick = () => {
        const dt = clock.getDelta();
        const now = performance.now();
        const elapsed = now - modeStart;

        material.uniforms.uTime.value += dt;

        if (mode === 'hold') {
          material.uniforms.uMorphProgress.value = 0;
          material.uniforms.uHoldDrift.value = driftTo;
          if (elapsed >= stages[stageIdx].holdMs) {
            beginTransition(now);
          }
        } else {
          const t = Math.min(1, elapsed / stages[stageIdx].outMs);
          material.uniforms.uMorphProgress.value = t;
          material.uniforms.uHoldDrift.value =
            driftFrom + (driftTo - driftFrom) * t;
          if (t >= 1) {
            stageIdx = (stageIdx + 1) % stages.length;
            finalizeTransition();
            material.uniforms.uMorphProgress.value = 0;
            enterHoldOrSkip(now);
          }
        }

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
      // Phase 5 adds a graceful static fallback; for now we just warn.
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
