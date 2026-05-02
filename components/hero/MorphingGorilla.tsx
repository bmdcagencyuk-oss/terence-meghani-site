'use client';

import { useEffect, useRef } from 'react';
import type * as THREE_NS from 'three';

/**
 * Phase 1 — scene foundation. Renders a transparent Three.js canvas with
 * a placeholder rotating icosahedron lit by a violet/orange/magenta rig and
 * post-processed with bloom + a subtle chromatic aberration. The placeholder
 * is replaced by the morphing particle system in Phase 2.
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

      if (cancelled || !containerRef.current) return;

      const width = container.clientWidth;
      const height = container.clientHeight;

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
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(width, height, false);
      renderer.setClearColor(0x000000, 0);
      container.appendChild(renderer.domElement);

      const hemi = new THREE.HemisphereLight(0x4a0fd4, 0x16181a, 0.6);
      scene.add(hemi);

      const dir = new THREE.DirectionalLight(0xff4d17, 0.8);
      dir.position.set(4, 5, 3);
      scene.add(dir);

      const point = new THREE.PointLight(0x9b3dff, 0.4, 12);
      point.position.set(0, 0, 0);
      scene.add(point);

      const placeholderGeo = new THREE.IcosahedronGeometry(1.4, 1);
      const placeholderMat = new THREE.MeshStandardMaterial({
        color: 0xff4d17,
        emissive: 0xff4d17,
        emissiveIntensity: 0.6,
        roughness: 0.35,
        metalness: 0.1,
        flatShading: true,
      });
      const placeholder = new THREE.Mesh(placeholderGeo, placeholderMat);
      scene.add(placeholder);

      const composer = new EffectComposer(renderer);
      composer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
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

      const clock = new THREE.Clock();
      let raf = 0;
      const tick = () => {
        const dt = clock.getDelta();
        placeholder.rotation.x += dt * 0.25;
        placeholder.rotation.y += dt * 0.4;
        composer.render(dt);
        raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);

      cleanup = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', handleResize);
        ro.disconnect();
        placeholderGeo.dispose();
        placeholderMat.dispose();
        composer.dispose();
        renderer.dispose();
        if (renderer.domElement.parentNode) {
          renderer.domElement.parentNode.removeChild(renderer.domElement);
        }
      };
    })().catch((err) => {
      // Phase 5 adds a graceful static fallback; for Phase 1 we just warn.
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
