/**
 * Vertex shader runs in two modes.
 *
 * NORMAL MODE (uStage3Mode = 0):
 *   Each particle interpolates aSourcePos → aTargetPos over uMorphProgress
 *   with a per-particle aDelay inside a 30% stagger window. The active
 *   easing function is selected by uEasingMode (six functions including the
 *   Phase 4.6 aggressiveSnap — smoothstep applied twice for an anticipation/
 *   peak/settle profile). When uUseRocketEasing is set, particles split:
 *   aIsRocket=1 use ease-in cubic (slow ascent), aIsRocket=0 use ease-out
 *   cubic (fast burst, settle).
 *
 *   Mid-flight wobble peaks at the morph midpoint and fades to zero at the
 *   endpoints. Hold-drift overlay is always present, scaled by uHoldDrift.
 *
 *   LEAN-IN ENVELOPE (uLeanInAmount, set by CPU during the last 400 ms of
 *   each hold and the first 200 ms of each non-spiral transition):
 *     - effectiveSource = mix(aSourcePos, aTargetPos, 0.08 * uLeanInAmount):
 *       particles drift up to 8% of the way to their next-stage target
 *       before the formal transition begins
 *     - hold-drift multiplied by 3× for amplified shimmer
 *     - colour multiplied by 1.15× for a brightness pulse
 *
 *   IGNITION BOOST (uIgnitionBoost, set during the first 1 s of the launch
 *   ascent transition): multiplies vColor by (1 + uIgnitionBoost) for a
 *   brighter trail at the moment of release.
 *
 * SPIRAL MODE (uStage3Mode = 1):
 *   Replaces the Stage 2 → Stage 4 transition. Three beats over 2.4 s:
 *
 *     BEAT 1 — Vortex pull (0.0–0.9 s)
 *       Immediate simultaneous rotation + radial inward motion.
 *       r(t) = r0 * 0.3^(t/0.9)  → ends at 30% of starting radius.
 *       ω(r) = baseRotation / max(r, 0.5)  → Keplerian feel.
 *
 *     BEAT 2 — Singularity (0.9–1.4 s)
 *       r(t) compresses to 5% of starting radius over 0.4 s, then pauses.
 *       Rotation continues at high angular velocity (small r → fast ω).
 *
 *     BEAT 3 — Explosion (1.4–2.4 s)
 *       Position = mix(origin, aTargetPos, distanceCovered).
 *       Burst: 75% in first 0.3 s. Settle: remaining 25% over 0.7 s with
 *       ease-out cubic. The mid-compression gorilla silhouette is dropped.
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
  uniform float uLeanInAmount;
  uniform float uIgnitionBoost;
  uniform float uUseRocketEasing;

  varying vec3 vColor;
  varying float vGlow;

  float easeInOutCubic(float x) {
    return x < 0.5
      ? 4.0 * x * x * x
      : 1.0 - pow(-2.0 * x + 2.0, 3.0) * 0.5;
  }
  float easeInExpo(float x) { return x <= 0.0 ? 0.0 : pow(2.0, 10.0 * x - 10.0); }
  float easeOutCubic(float x) { return 1.0 - pow(1.0 - x, 3.0); }
  float easeInCubic(float x) { return x * x * x; }
  float easeOutExpo(float x) { return x >= 1.0 ? 1.0 : 1.0 - pow(2.0, -10.0 * x); }
  float aggressiveSnap(float x) {
    // Smoothstep applied twice — anticipation, fast mid, fast settle.
    float s = x * x * (3.0 - 2.0 * x);
    return s * s * (3.0 - 2.0 * s);
  }
  float applyEase(float x) {
    if (uEasingMode < 0.5) return easeInOutCubic(x);
    if (uEasingMode < 1.5) return easeInExpo(x);
    if (uEasingMode < 2.5) return easeOutCubic(x);
    if (uEasingMode < 3.5) return easeInCubic(x);
    if (uEasingMode < 4.5) return x;            // linear
    return aggressiveSnap(x);                    // 5
  }

  // ---- Spiral mode helpers -----------------------------------------------
  vec3 stage3Position(float t, vec3 source, vec3 target) {
    // BEAT 3 — explosion outward (1.4–2.4 s).
    if (t >= 1.4) {
      float beatProgress = clamp((t - 1.4) / 1.0, 0.0, 1.0);
      float distanceCovered;
      if (beatProgress < 0.3) {
        // Burst — 75% in first 0.3 s.
        float burstT = beatProgress / 0.3;
        distanceCovered = 0.75 * burstT;
      } else {
        // Settle — remaining 25% over 0.7 s with ease-out cubic.
        float settleT = (beatProgress - 0.3) / 0.7;
        float settleEased = 1.0 - pow(1.0 - settleT, 3.0);
        distanceCovered = 0.75 + 0.25 * settleEased;
      }
      return mix(vec3(0.0), target, distanceCovered);
    }

    // BEAT 1 + BEAT 2 — rotation + radial collapse.
    vec2 sp = source.xy;
    float r0 = length(sp);
    float theta0 = atan(sp.y, sp.x);
    float baseRotation = 4.0;

    // Radius profile.
    float r;
    if (t < 0.9) {
      // BEAT 1: r(t) = r0 * 0.3^(t/0.9) — exponential decay to 30% at 0.9 s.
      r = r0 * pow(0.3, t / 0.9);
    } else if (t < 1.3) {
      // BEAT 2 part A (0.4 s): r0*0.3 → r0*0.05 — exponential decay.
      float p = (t - 0.9) / 0.4;
      r = r0 * 0.3 * pow(0.05 / 0.3, p);
    } else {
      // BEAT 2 part B (0.1 s): pause at singularity radius.
      r = r0 * 0.05;
    }

    // Angular accumulation. Closed-form is messy across regimes; use
    // average-radius approximations per beat — visually the rotation
    // reads correctly.
    float theta = theta0;
    float r_avg_b1 = max(r0 * 0.6, 0.5); // mean r across BEAT 1
    if (t < 0.9) {
      theta += baseRotation * t / r_avg_b1;
    } else {
      theta += baseRotation * 0.9 / r_avg_b1;
      // BEAT 2 — radius is small, so floor at 0.5 dominates.
      float r_avg_b2 = max(r0 * 0.15, 0.5);
      theta += baseRotation * (t - 0.9) / r_avg_b2;
    }

    return vec3(cos(theta) * r, sin(theta) * r, source.z * 0.5);
  }

  vec3 stage3Color(float t) {
    vec3 orange = vec3(1.0, 0.302, 0.090) * 0.9;
    vec3 violet = vec3(0.608, 0.239, 1.0);
    vec3 white = vec3(1.0);
    vec3 whiteViolet = mix(violet, white, 0.5);              // 50/50
    vec3 wireframeWV = mix(white, violet, 0.3);              // 70% white, 30% violet
    vec3 brightOrange = vec3(1.0, 0.302, 0.090);             // full saturation

    if (t < 0.9) {
      // BEAT 1 — orange → white-violet across 0.9 s.
      return mix(orange, whiteViolet, t / 0.9);
    }
    if (t < 1.3) {
      // BEAT 2 first part — hold white-violet.
      return whiteViolet;
    }
    if (t < 1.35) {
      // BEAT 2 — brief pure-white moment at 1.3 s.
      float p = (t - 1.3) / 0.05;
      return mix(whiteViolet, white, p);
    }
    if (t < 1.4) {
      // BEAT 2 → BEAT 3 — pure white shifts to bright rocket-orange.
      float p = (t - 1.35) / 0.05;
      return mix(white, brightOrange, p);
    }
    if (t < 1.55) {
      // BEAT 3 burst — orange → pure white (energy release).
      float p = (t - 1.4) / 0.15;
      return mix(brightOrange, white, p);
    }
    if (t < 2.0) {
      // BEAT 3 settle — white → wireframe white-violet.
      float p = (t - 1.55) / 0.45;
      return mix(white, wireframeWV, p);
    }
    return wireframeWV;
  }

  float stage3Glow(float t) {
    if (t < 0.9) return 0.2;
    if (t < 1.3) {
      float p = (t - 0.9) / 0.4;
      return 0.2 + p * 1.6;
    }
    if (t < 1.4) {
      return 1.8;
    }
    if (t < 1.55) {
      return 1.5;
    }
    if (t < 2.0) {
      float p = (t - 1.55) / 0.45;
      return mix(1.5, 0.0, p);
    }
    return 0.0;
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
      // Lean-in: effective source drifts up to 8% toward the next-stage
      // target so the boundary between hold and transition dissolves.
      vec3 effectiveSource = mix(aSourcePos, aTargetPos, 0.08 * uLeanInAmount);

      float window = 0.30;
      float startT = aDelay * window;
      float span = 1.0 - window;
      float local = clamp((uMorphProgress - startT) / max(span, 1e-4), 0.0, 1.0);

      float eased;
      if (uUseRocketEasing > 0.5) {
        // Launch ascent: rocket cluster eases-in, dispersing particles
        // ease-out for the radial burst.
        eased = aIsRocket > 0.5 ? easeInCubic(local) : easeOutCubic(local);
      } else {
        eased = applyEase(local);
      }

      pos = mix(effectiveSource, aTargetPos, eased);

      float midFactor = 4.0 * eased * (1.0 - eased);
      pos += vec3(
        sin(uTime * 2.2 + aWobblePhase)        * 0.05,
        cos(uTime * 1.8 + aWobblePhase * 1.3)  * 0.05,
        sin(uTime * 1.5 + aWobblePhase * 2.1)  * 0.03
      ) * midFactor;

      baseColor = mix(aSourceColor, aTargetColor, eased);
      glow = midFactor;
    }

    // Hold-drift overlay — suppressed during the spiral. Lean-in tripled
    // the drift amplitude (3×) for amplified shimmer in the bridge window.
    float driftAmt = (uStage3Mode > 0.5)
      ? 0.0
      : uHoldDrift * (1.0 + 2.0 * uLeanInAmount);
    pos += vec3(
      sin(uTime * 0.7 + aWobblePhase)        * 0.025,
      cos(uTime * 0.6 + aWobblePhase * 1.4)  * 0.025,
      sin(uTime * 0.4 + aWobblePhase * 1.7)  * 0.012
    ) * driftAmt;

    // Colour: ignition boost (launch trail) + lean-in brightness pulse (1.15×).
    vColor = baseColor
      * (1.0 + uIgnitionBoost)
      * (1.0 + 0.15 * uLeanInAmount);
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
