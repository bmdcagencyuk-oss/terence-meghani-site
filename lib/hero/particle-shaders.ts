/**
 * Vertex shader runs in two modes:
 *
 * NORMAL MODE (uStage3Mode = 0):
 *   Each particle interpolates aSourcePos → aTargetPos over uMorphProgress
 *   with a per-particle aDelay inside a 30% stagger window. Easing is
 *   selected per-transition by uEasingMode (5 functions). Mid-flight wobble
 *   peaks at the midpoint and fades at endpoints. Hold-drift overlay is
 *   always present, scaled by uHoldDrift.
 *
 * SPIRAL MODE (uStage3Mode = 1):
 *   Replaces the Stage 2 → Stage 4 transition. Particles compute their
 *   position procedurally as a function of uStage3Time ∈ [0, 3] seconds,
 *   running through five sub-phases:
 *
 *     0.0–0.4s  Disperse outward (ease-out cubic radial expansion)
 *     0.4–1.0s  Orbit at expanded radius (Keplerian ω = ω₀/r)
 *     1.0–2.0s  Spiral inward (radius shrinks, rotation accelerates)
 *     2.0–2.5s  Vortex collapse (radius → 0, glow ramps up)
 *     2.5–3.0s  Explode outward to wireframe target (ease-out expo)
 *
 *   Angular position is integrated analytically per sub-phase: closed-form
 *   for constant r (sub-phase 2), log for linear r-decrease (sub-phase 3),
 *   and a fast-spin term for the collapse (sub-phase 4). The spiral centre
 *   is the scene origin (Stage 2's gorilla is normalized around (0,0)).
 *
 *   Colour and glow are procedural functions of uStage3Time — orange →
 *   white-violet → bright orange (singularity) → fading white. Hold-drift
 *   is suppressed during the spiral since the motion is already complex.
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
  uniform float uEasingMode;
  uniform float uStage3Mode;
  uniform float uStage3Time;

  varying vec3 vColor;
  varying float vGlow;

  float easeInOutCubic(float x) {
    return x < 0.5
      ? 4.0 * x * x * x
      : 1.0 - pow(-2.0 * x + 2.0, 3.0) * 0.5;
  }
  float easeInExpo(float x) {
    return x <= 0.0 ? 0.0 : pow(2.0, 10.0 * x - 10.0);
  }
  float easeOutCubic(float x) {
    return 1.0 - pow(1.0 - x, 3.0);
  }
  float easeInCubic(float x) {
    return x * x * x;
  }
  float easeOutExpo(float x) {
    return x >= 1.0 ? 1.0 : 1.0 - pow(2.0, -10.0 * x);
  }
  float applyEase(float x) {
    if (uEasingMode < 0.5) return easeInOutCubic(x);
    if (uEasingMode < 1.5) return easeInExpo(x);
    if (uEasingMode < 2.5) return easeOutCubic(x);
    if (uEasingMode < 3.5) return easeInCubic(x);
    return x;
  }

  // ---- Spiral mode helpers -----------------------------------------------
  vec3 stage3Position(float t, vec3 source, vec3 target) {
    vec2 sp = source.xy;
    float r0 = length(sp);
    float theta0 = atan(sp.y, sp.x);
    // Floor on r0 prevents particles at the gorilla's centre of mass from
    // spinning at infinite angular velocity.
    float r0safe = max(r0, 0.18);
    float omega0 = 3.2;

    // Sub-phase 5 (explode to target) has no spiral content — handle first
    // so we can early-return.
    if (t >= 2.5) {
      float p5 = clamp((t - 2.5) / 0.5, 0.0, 1.0);
      return mix(vec3(0.0), target, easeOutExpo(p5));
    }

    // Radius profile. Continuous at sub-phase boundaries.
    float r;
    if (t < 0.4) {
      // Disperse outward — 1.0×r0 → 1.4×r0
      float k = easeOutCubic(t / 0.4);
      r = r0 * (1.0 + 0.4 * k);
    } else if (t < 1.0) {
      // Orbit at expanded radius — slight breathe (1.4×r0 constant)
      r = r0 * 1.4;
    } else if (t < 2.0) {
      // Spiral inward — 1.4×r0 → 0.3×r0 with cubic acceleration
      float k = easeInCubic((t - 1.0) / 1.0);
      r = r0 * (1.4 - 1.1 * k);
    } else {
      // Vortex collapse — 0.3×r0 → ~0 with exponential acceleration
      float k = easeInExpo((t - 2.0) / 0.5);
      r = r0 * 0.3 * (1.0 - k);
    }

    // Angle accumulation. Each sub-phase contributes its rotational integral.
    float theta = theta0;
    if (t >= 0.4) {
      // Sub-phase 2: r is constant at 1.4×r0safe over [0.4, 1.0].
      float endT = min(t, 1.0);
      theta += omega0 * (endT - 0.4) / (1.4 * r0safe);
    }
    if (t >= 1.0) {
      // Sub-phase 3: r linear from 1.4×r0safe to 0.3×r0safe over [1.0, 2.0].
      // ∫ ω₀/(r1+(r2-r1)u) du from 0 to s = ω₀ * ln(r(s)/r1) / (r2-r1)
      float endT = min(t, 2.0);
      float r1 = 1.4 * r0safe;
      float r2 = 0.3 * r0safe;
      float s = endT - 1.0;
      float r_at_s = r1 + (r2 - r1) * s;
      theta += omega0 * log(r_at_s / r1) / (r2 - r1);
    }
    if (t >= 2.0) {
      // Sub-phase 4: r → 0. Use a fast-spin term proportional to 1/r0safe;
      // analytic integration here would diverge, so we approximate with a
      // 6× scaling factor that produces visually convincing whip-up.
      float endT = min(t, 2.5);
      theta += omega0 * (endT - 2.0) * 6.0 / r0safe;
    }

    // Z preserved at half magnitude for a touch of depth without breaking
    // the 2D-spiral read.
    return vec3(cos(theta) * r, sin(theta) * r, source.z * 0.5);
  }

  vec3 stage3Color(float t) {
    vec3 orange = vec3(1.0, 0.302, 0.090) * 0.9;
    vec3 violet = vec3(0.608, 0.239, 1.0);
    vec3 white = vec3(1.0);
    vec3 whiteViolet = mix(violet, white, 0.5);
    vec3 brightOrange = vec3(1.0, 0.302, 0.090) * 1.4;
    vec3 finalWhite = white * 0.8;

    if (t < 1.0) return mix(orange, whiteViolet, t);
    if (t < 2.0) return whiteViolet;
    if (t < 2.5) return mix(whiteViolet, brightOrange, (t - 2.0) / 0.5);
    return mix(brightOrange, finalWhite, (t - 2.5) / 0.5);
  }

  float stage3Glow(float t) {
    if (t < 2.0) return 0.2;
    if (t < 2.5) {
      float p = (t - 2.0) / 0.5;
      return 0.2 + p * 1.6;
    }
    if (t < 2.85) {
      float p = (t - 2.5) / 0.35;
      return mix(1.8, 0.5, p);
    }
    float p = (t - 2.85) / 0.15;
    return mix(0.5, 0.0, p);
  }

  void main() {
    vec3 pos;
    vec3 baseColor;
    float glow;

    if (uStage3Mode > 0.5) {
      pos = stage3Position(uStage3Time, aSourcePos, aTargetPos);
      baseColor = stage3Color(uStage3Time);
      glow = stage3Glow(uStage3Time);
    } else {
      // Normal interpolation mode.
      float window = 0.30;
      float startT = aDelay * window;
      float span = 1.0 - window;
      float local = clamp((uMorphProgress - startT) / max(span, 1e-4), 0.0, 1.0);
      float eased = applyEase(local);

      pos = mix(aSourcePos, aTargetPos, eased);

      float midFactor = 4.0 * eased * (1.0 - eased);
      pos += vec3(
        sin(uTime * 2.2 + aWobblePhase)        * 0.05,
        cos(uTime * 1.8 + aWobblePhase * 1.3)  * 0.05,
        sin(uTime * 1.5 + aWobblePhase * 2.1)  * 0.03
      ) * midFactor;

      baseColor = mix(aSourceColor, aTargetColor, eased);
      glow = midFactor;
    }

    // Hold-drift overlay — suppressed during the spiral (where motion is
    // already procedural and would conflict with the spiral path).
    float driftAmt = (uStage3Mode > 0.5) ? 0.0 : uHoldDrift;
    pos += vec3(
      sin(uTime * 0.7 + aWobblePhase)        * 0.025,
      cos(uTime * 0.6 + aWobblePhase * 1.4)  * 0.025,
      sin(uTime * 0.4 + aWobblePhase * 1.7)  * 0.012
    ) * driftAmt;

    vColor = baseColor;
    vGlow = glow;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio;
  }
`;

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
