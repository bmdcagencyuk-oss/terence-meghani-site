/**
 * Vertex shader: each particle interpolates aSourcePos → aTargetPos over
 * uMorphProgress with a per-particle aDelay (0..1) inside a 30% stagger
 * window — early particles finish before late particles start. Easing is
 * ease-in-out cubic. Two motion overlays:
 *   - Mid-flight wobble: peaks at the midpoint of the eased journey, fades
 *     to zero at the endpoints. Reads as organic drift during the morph.
 *   - Hold drift: a slow continuous wander applied at all times, scaled by
 *     uHoldDrift. Stage 1 sets this to ~1 (sketch breathes); Stage 2 to 0
 *     (refined sits still). The CPU lerps uHoldDrift across transitions.
 *
 * Particle size is in CSS pixels — simple, predictable, no perspective
 * attenuation since particles all sit near z=0.
 */
export const particleVertexShader = /* glsl */ `
  attribute vec3 aSourcePos;
  attribute vec3 aTargetPos;
  attribute vec3 aSourceColor;
  attribute vec3 aTargetColor;
  attribute float aSize;
  attribute float aDelay;
  attribute float aWobblePhase;

  uniform float uMorphProgress;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uHoldDrift;

  varying vec3 vColor;
  varying float vGlow;

  float easeInOutCubic(float x) {
    return x < 0.5
      ? 4.0 * x * x * x
      : 1.0 - pow(-2.0 * x + 2.0, 3.0) * 0.5;
  }

  void main() {
    // 30% of the cycle is start-time spread. Particle 0 (delay=0) runs from
    // progress 0.0 → 0.7; particle ∞ (delay=1) runs from 0.3 → 1.0. All
    // particles arrive by progress=1.0.
    float window = 0.30;
    float startT = aDelay * window;
    float span = 1.0 - window;
    float local = clamp((uMorphProgress - startT) / max(span, 1e-4), 0.0, 1.0);
    float eased = easeInOutCubic(local);

    vec3 pos = mix(aSourcePos, aTargetPos, eased);

    // Mid-flight wobble — peaks at eased=0.5, vanishes at endpoints.
    float midFactor = 4.0 * eased * (1.0 - eased);
    pos += vec3(
      sin(uTime * 2.2 + aWobblePhase)        * 0.05,
      cos(uTime * 1.8 + aWobblePhase * 1.3)  * 0.05,
      sin(uTime * 1.5 + aWobblePhase * 2.1)  * 0.03
    ) * midFactor;

    // Hold drift — slow, low-amplitude wander. Always on, scaled by
    // uHoldDrift which CPU lerps between stage drift values.
    pos += vec3(
      sin(uTime * 0.7 + aWobblePhase)        * 0.025,
      cos(uTime * 0.6 + aWobblePhase * 1.4)  * 0.025,
      sin(uTime * 0.4 + aWobblePhase * 1.7)  * 0.012
    ) * uHoldDrift;

    vColor = mix(aSourceColor, aTargetColor, eased);
    vGlow = midFactor;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    // Direct CSS-pixel sizing (multiplied by DPR for retina).
    gl_PointSize = aSize * uPixelRatio;
  }
`;

/**
 * Fragment shader: render each point as a soft circular sprite. Mid-transition
 * particles get a small additive boost (vGlow) so the swarm reads as alive
 * during the morph itself; held particles render as clean uniform dots.
 */
export const particleFragmentShader = /* glsl */ `
  precision mediump float;

  varying vec3 vColor;
  varying float vGlow;

  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float d = length(c);
    if (d > 0.5) discard;
    float alpha = smoothstep(0.5, 0.05, d);
    vec3 col = vColor * (1.0 + vGlow * 0.9);
    gl_FragColor = vec4(col, alpha);
  }
`;
