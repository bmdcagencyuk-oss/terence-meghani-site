'use client';

import { useEffect, useRef } from 'react';
import type * as THREE_NS from 'three';
import { buildGorillaStages, type StageData } from '@/lib/hero/morphing-stages';
import {
  particleFragmentShader,
  particleVertexShader,
} from '@/lib/hero/particle-shaders';

const PARTICLE_COUNT = 4000;
const HOLD_MS = 5000;
const TRANSITION_MS = 1500;
const GORILLA_SVG_URL = '/brand/emblem-gorilla.svg';

/**
 * Phase 2 — particle system foundation. 4,000 GPU-driven points morph
 * between Stage 1 (sketch — faint white outline with random perpendicular
 * jitter, gently breathing while held) and Stage 2 (refined — clean
 * rocket-orange silhouette, static while held). The transition is a swarm:
 * each particle starts at a staggered time inside a 30% window, eases via
 * cubic, and arrives at its destination with a brief mid-flight glow.
 *
 * Phase 3 will extend `buildGorillaStages` to six stages and lengthen the
 * cycle. The transition mechanic and shader don't change.
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

      const stagesObj = await buildGorillaStages(GORILLA_SVG_URL, PARTICLE_COUNT);
      const stages: StageData[] = [stagesObj.sketch, stagesObj.refined];

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

      // Lighting rig from Phase 1 — particles use ShaderMaterial (unlit) but
      // these are retained for stage 3+ where lit meshes may join the scene.
      const hemi = new THREE.HemisphereLight(0x4a0fd4, 0x16181a, 0.6);
      scene.add(hemi);
      const dir = new THREE.DirectionalLight(0xff4d17, 0.8);
      dir.position.set(4, 5, 3);
      scene.add(dir);
      const point = new THREE.PointLight(0x9b3dff, 0.4, 12);
      point.position.set(0, 0, 0);
      scene.add(point);

      // ---- Particle system ----------------------------------------------------
      const geometry = new THREE.BufferGeometry();

      const sourcePositions = new Float32Array(stages[0].positions); // mutable copy
      const targetPositions = new Float32Array(stages[1].positions);
      const sourceColors = new Float32Array(stages[0].colors);
      const targetColors = new Float32Array(stages[1].colors);
      const sizes = new Float32Array(PARTICLE_COUNT);
      const delays = new Float32Array(PARTICLE_COUNT);
      const wobblePhases = new Float32Array(PARTICLE_COUNT);
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        // Spec: 1.5–3.5 CSS px, varied randomly per particle.
        sizes[i] = 1.5 + Math.random() * 2.0;
        delays[i] = Math.random();
        wobblePhases[i] = Math.random() * Math.PI * 2;
      }

      // `position` is required by Three.js; set to the source for sane
      // bounds. The vertex shader reads aSource/aTarget directly.
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
      // Generous bounding sphere — cheaper than per-frame recomputation.
      geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(0, 0, 0), 8);

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
          uHoldDrift: { value: stages[0].holdDrift }, // start in Stage 1 hold
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
      // Start at stage 0 (sketch). source already holds it. The first
      // transition will reach for stage 1 (refined).
      let stageIdx = 0;
      let mode: 'hold' | 'transition' = 'hold';
      let modeStart = performance.now();
      // Hold-drift values track the current and incoming stages so we can
      // smoothly lerp through the transition.
      let driftFrom = stages[stageIdx].holdDrift;
      let driftTo = driftFrom;

      const advanceTarget = (nextIdx: number) => {
        aTargetPos.array.set(stages[nextIdx].positions);
        aTargetPos.needsUpdate = true;
        aTargetColor.array.set(stages[nextIdx].colors);
        aTargetColor.needsUpdate = true;
        driftFrom = stages[stageIdx].holdDrift;
        driftTo = stages[nextIdx].holdDrift;
      };

      const finalizeTransition = () => {
        aSourcePos.array.set(aTargetPos.array as Float32Array);
        aSourcePos.needsUpdate = true;
        aSourceColor.array.set(aTargetColor.array as Float32Array);
        aSourceColor.needsUpdate = true;
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
          if (elapsed >= HOLD_MS) {
            const nextIdx = (stageIdx + 1) % stages.length;
            advanceTarget(nextIdx);
            mode = 'transition';
            modeStart = now;
          }
        } else {
          const t = Math.min(1, elapsed / TRANSITION_MS);
          material.uniforms.uMorphProgress.value = t;
          material.uniforms.uHoldDrift.value =
            driftFrom + (driftTo - driftFrom) * t;
          if (t >= 1) {
            stageIdx = (stageIdx + 1) % stages.length;
            finalizeTransition();
            material.uniforms.uMorphProgress.value = 0;
            material.uniforms.uHoldDrift.value = stages[stageIdx].holdDrift;
            driftFrom = stages[stageIdx].holdDrift;
            driftTo = driftFrom;
            mode = 'hold';
            modeStart = now;
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
