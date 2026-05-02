/**
 * Vertex shader runs in two modes:
 *
 * NORMAL MODE (uStage3Mode = 0):
 *   Each particle interpolates aSourcePos → aTargetPos over uMorphProgress
 *   with a per-particle aDelay inside a 30% stagger window. Easing is
 *   selected by uEasingMode unless uUseRocketEasing is set, in which case
 *   particles split: aIsRocket=1 use ease-in cubic (slow ascent), aIsRocket=0
 *   use ease-out cubic (fast burst, settle). Mid-flight wobble peaks at the
 *   midpoint; hold-drift overlay always present, scaled by uHoldDrift.
 *
 *   Pre-transition envelope (uPreTransitionAmp, set by CPU during the last
 *   400 ms of hold and the first 400 ms of transition):
 *     - Adds a small outward radial bias so particles "want to break formation"
 *     - Multiplies hold-drift by 1.5x for amplified shimmer
 *
 *   Ignition boost (uIgnitionBoost, set by CPU during the first 1 s of the
 *   launch ascent transition): multiplies vColor by (1 + uIgnitionBoost) for
 *   a brighter trail at the moment of release.
 *
 * SPIRAL MODE (uStage3Mode = 1):
 *   Replaces the Stage 2 → Stage 4 transition. Particles compute their
 *   position procedurally as a function of uStage3Time ∈ [0, 3] seconds
 *   through five sub-phases. Sub-phase 5 (explosion to wireframe) is now
 *   front-loaded: 70% of the journey in the first 0.15 s with ease-out expo,
 *   the remaining 30% over 0.35 s with ease-out cubic. Colour briefly flashes
 *   to pure white at the moment of explosion.
 */
export const particleVertexShader = /* glsl */ `
  attribute vec3 aSourcePos;
  attribute vec3 aTargetPos;
  attribute vec3 aSourceColor;
  attribute vec3 aTargetColor;
  attribute float aSize;
  attribute float aDelay;
  attribute float aWobblePhase;
  attribute float aIsRocket;

  uniform float uMorphProgress;
  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uHoldDrift;
  uniform float uEasingMode;
  uniform float uStage3Mode;
  uniform float uStage3Time;
  uniform float uPreTransitionAmp;
  uniform float uIgnitionBoost;
  uniform float uUseRocketEasing;

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
    float r0safe = max(r0, 0.18);
    float omega0 = 3.2;

    // Sub-phase 5 (explode to target) — front-loaded burst.
    if (t >= 2.5) {
      float pTotal = clamp((t - 2.5) / 0.5, 0.0, 1.0);
      float k;
      if (t < 2.65) {
        // First 0.15 s: 0 → 0.7 with ease-out expo (rapid burst).
        float p = (t - 2.5) / 0.15;
        k = 0.7 * easeOutExpo(p);
      } else {
        // Next 0.35 s: 0.7 → 1.0 with ease-out cubic (settle).
        float p = (t - 2.65) / 0.35;
        k = 0.7 + 0.3 * easeOutCubic(p);
      }
      // Suppress sub-phase 5 progress warning by referencing pTotal.
      k = max(k, 0.0) * (pTotal > 0.0 ? 1.0 : 0.0);
      return mix(vec3(0.0), target, k);
    }

    float r;
    if (t < 0.4) {
      float k = easeOutCubic(t / 0.4);
      r = r0 * (1.0 + 0.4 * k);
    } else if (t < 1.0) {
      r = r0 * 1.4;
    } else if (t < 2.0) {
      float k = easeInCubic((t - 1.0) / 1.0);
      r = r0 * (1.4 - 1.1 * k);
    } else {
      float k = easeInExpo((t - 2.0) / 0.5);
      r = r0 * 0.3 * (1.0 - k);
    }

    float theta = theta0;
    if (t >= 0.4) {
      float endT = min(t, 1.0);
      theta += omega0 * (endT - 0.4) / (1.4 * r0safe);
    }
    if (t >= 1.0) {
      float endT = min(t, 2.0);
      float r1 = 1.4 * r0safe;
      float r2 = 0.3 * r0safe;
      float s = endT - 1.0;
      float r_at_s = r1 + (r2 - r1) * s;
      theta += omega0 * log(r_at_s / r1) / (r2 - r1);
    }
    if (t >= 2.0) {
      float endT = min(t, 2.5);
      theta += omega0 * (endT - 2.0) * 6.0 / r0safe;
    }

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
    // Sub-phase 5: brief pure-white flash, then settle to wireframe-white.
    if (t < 2.6) return white;
    return mix(white, finalWhite, (t - 2.6) / 0.4);
  }

  float stage3Glow(float t) {
    if (t < 2.0) return 0.2;
    if (t < 2.5) {
      float p = (t - 2.0) / 0.5;
      return 0.2 + p * 1.6;
    }
    if (t < 2.65) {
      // Sub-phase 5 explosion glow: hold near peak briefly.
      return 1.8;
    }
    if (t < 2.85) {
      float p = (t - 2.65) / 0.20;
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
      // Normal interpolation mode with optional rocket-vs-dispersed easing.
      float window = 0.30;
      float startT = aDelay * window;
      float span = 1.0 - window;
      float local = clamp((uMorphProgress - startT) / max(span, 1e-4), 0.0, 1.0);

      float eased;
      if (uUseRocketEasing > 0.5) {
        // Launch ascent: rocket cluster slow-starts (ease-in cubic), the
        // dispersing site particles burst out fast (ease-out cubic).
        eased = aIsRocket > 0.5 ? easeInCubic(local) : easeOutCubic(local);
      } else {
        eased = applyEase(local);
      }

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

    // Pre-transition outward bias — particles "want to leave formation"
    // during the last 400 ms of a hold and gradually settle in the first
    // 400 ms of the transition. Suppressed during the spiral.
    if (uStage3Mode < 0.5 && uPreTransitionAmp > 0.0) {
      vec2 outDir = length(pos.xy) > 0.05 ? normalize(pos.xy) : vec2(0.0);
      pos.xy += outDir * 0.04 * uPreTransitionAmp;
    }

    // Hold-drift overlay — suppressed during the spiral. Pre-transition amp
    // amplifies it 1.5x for the same-window tighter shimmer.
    float driftAmt = (uStage3Mode > 0.5)
      ? 0.0
      : uHoldDrift * (1.0 + 0.5 * uPreTransitionAmp);
    pos += vec3(
      sin(uTime * 0.7 + aWobblePhase)        * 0.025,
      cos(uTime * 0.6 + aWobblePhase * 1.4)  * 0.025,
      sin(uTime * 0.4 + aWobblePhase * 1.7)  * 0.012
    ) * driftAmt;

    // Ignition boost — brightens the rocket trail during the first ~1 s
    // of the launch ascent.
    vColor = baseColor * (1.0 + uIgnitionBoost);
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
