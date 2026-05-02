/**
 * Vertex shader: each particle interpolates from aSourcePos → aTargetPos
 * over uMorphProgress, with a per-particle aDelay that staggers the start
 * so the morph reads as a swarm rather than a synchronised slide. Mid-flight
 * a small wobble adds organic character; it peaks at the half-way point.
 *
 * Easing: ease-in-out cubic. Particles arriving early hold steady at the
 * target while late particles complete their flights.
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
  uniform float uSizeScale;

  varying vec3 vColor;
  varying float vGlow;

  float easeInOutCubic(float x) {
    return x < 0.5
      ? 4.0 * x * x * x
      : 1.0 - pow(-2.0 * x + 2.0, 3.0) * 0.5;
  }

  void main() {
    // Stagger window: 45% of the cycle is dedicated to start-time spread.
    // A particle with delay=0 starts immediately and finishes at
    // progress=0.55; a particle with delay=1 starts at progress=0.45 and
    // finishes at progress=1.0. All particles arrive by progress=1.
    float window = 0.45;
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

    vColor = mix(aSourceColor, aTargetColor, eased);
    vGlow = midFactor;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    // Perspective-aware sizing — particles further from the camera shrink.
    gl_PointSize = aSize * uPixelRatio * uSizeScale * (300.0 / max(-mv.z, 0.1));
  }
`;

/**
 * Fragment shader: render each point as a soft circular sprite. Mid-transition
 * particles get a small additive boost (vGlow) so the swarm reads as alive
 * during the morph itself, then settles into clean dots while held.
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
