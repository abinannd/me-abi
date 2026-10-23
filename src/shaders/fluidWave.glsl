precision highp float;

uniform float uTime;
uniform vec2 uResolution;
uniform float uWaveHeight;
uniform float uLineDensity;
uniform float uSpeed;
uniform float uGlow;
uniform float uQuality;
uniform float uReducedMotion;

varying vec2 vUv;

#define PI 3.141592653589793
#define TWO_PI 6.283185307179586
#define LOOP_PERIOD 16.0

// Color Palette
// Deep shadow: #07131B
const vec3 C_SHADOW    = vec3(0.0275, 0.0745, 0.1059);
// Dark teal: #06434A
const vec3 C_DARK_TEAL = vec3(0.0235, 0.2627, 0.2902);
// Main teal: #087F8C
const vec3 C_TEAL      = vec3(0.0314, 0.4980, 0.5490);
// Turquoise: #18B8B5
const vec3 C_TURQUOISE = vec3(0.0941, 0.7216, 0.7098);
// Cyan highlight: #65F0E0
const vec3 C_CYAN      = vec3(0.3961, 0.9412, 0.8784);

// Smooth color map transition through the palette based on scalar t in [0, 1]
vec3 getWaveColor(float t) {
  t = clamp(t, 0.0, 1.0);
  if (t < 0.25) {
    return mix(C_SHADOW, C_DARK_TEAL, t / 0.25);
  } else if (t < 0.55) {
    return mix(C_DARK_TEAL, C_TEAL, (t - 0.25) / 0.30);
  } else if (t < 0.82) {
    return mix(C_TEAL, C_TURQUOISE, (t - 0.55) / 0.27);
  } else {
    return mix(C_TURQUOISE, C_CYAN, (t - 0.82) / 0.18);
  }
}

// Directional light vector (simulating elegant lighting from upper-left)
const vec2 LIGHT_DIR = vec2(-0.5547, 0.8320); // normalized vec2(-0.6, 0.9)

// -------------------------------------------------------------
// Wave 1: Dominant Primary Wave
// Composed of dense, fine flowing contour lines with rich peaks
// -------------------------------------------------------------
float evalDominantWave(float x, float z, float tau) {
  // Envelope ensures the wave stays mostly in bottom 25-42%
  // Gently swells towards the center/right, keeping upper-left calm
  float env = 0.85 + 0.35 * sin(x * PI * 0.9 + 0.4);

  // Periodic harmonic terms with integer time multipliers for a seamless loop
  float w1 = sin(x * 3.14159 * 1.2 - 1.0 * tau + z * 1.1);
  float w2 = 0.42 * sin(x * 3.14159 * 2.4 + 2.0 * tau - z * 1.5 + 1.2);
  float w3 = 0.22 * cos(x * 3.14159 * 3.6 - 1.0 * tau + z * 2.2 + 2.4);
  float w4 = 0.10 * sin(x * 3.14159 * 5.0 + 3.0 * tau + z * 0.8);

  // Depth baseline: layers stack gracefully from z=0 (foreground) to z=1 (background)
  float base = 0.16 + z * 0.13;
  float amp = (0.11 + z * 0.035) * uWaveHeight * env;

  return base + amp * (w1 + w2 + w3 + w4);
}

// -------------------------------------------------------------
// Wave 2: Secondary Midground Wave
// Weaves behind and beneath the main wave
// -------------------------------------------------------------
float evalSecondaryWaveA(float x, float z, float tau) {
  float env = 0.75 + 0.25 * cos(x * PI * 1.1 + 0.8);

  // Different phase, harmonic cadence, and integer time multipliers
  float w1 = sin(x * 3.14159 * 1.6 + 1.0 * tau + z * 1.4 + 2.0);
  float w2 = 0.45 * cos(x * 3.14159 * 2.8 - 2.0 * tau - z * 1.8 + 0.6);
  float w3 = 0.20 * sin(x * 3.14159 * 4.4 + 1.0 * tau + z * 1.0 + 3.1);

  float base = 0.13 + z * 0.11;
  float amp = (0.09 + z * 0.025) * uWaveHeight * env;

  return base + amp * (w1 + w2 + w3);
}

// -------------------------------------------------------------
// Wave 3: Secondary Background Counter-Wave
// Deep, subtle counter-flow in the background
// -------------------------------------------------------------
float evalSecondaryWaveB(float x, float z, float tau) {
  float env = 0.65 + 0.35 * sin(x * PI * 1.4 + 1.8);

  float w1 = cos(x * 3.14159 * 1.4 - 1.0 * tau + z * 1.6 + 4.2);
  float w2 = 0.40 * sin(x * 3.14159 * 2.6 + 1.0 * tau - z * 1.2 + 1.8);
  float w3 = 0.18 * cos(x * 3.14159 * 3.8 - 2.0 * tau + z * 2.0);

  float base = 0.18 + z * 0.09;
  float amp = (0.07 + z * 0.02) * uWaveHeight * env;

  return base + amp * (w1 + w2 + w3);
}

void main() {
  vec2 uv = vUv;
  float aspect = uResolution.x / max(uResolution.y, 1.0);

  // Periodic time phase tau in [0, TWO_PI)
  float effectiveSpeed = uReducedMotion > 0.5 ? 0.08 : uSpeed;
  float tNorm = mod(uTime * effectiveSpeed, LOOP_PERIOD) / LOOP_PERIOD;
  float tau = tNorm * TWO_PI;

  // Normalized coordinate for horizontal evaluation
  float x = uv.x;
  float y = uv.y;

  // Screen-space pixel resolution parameters for crisp anti-aliasing
  float pixelSize = 1.0 / max(uResolution.y, 1.0);
  float eps = 0.0025; // Finite difference step for tangent/normal estimation

  // Accumulators for color and alpha
  vec3 accumColor = vec3(0.0);
  float accumAlpha = 0.0;

  // Number of contour lines determined by quality & line density
  int countSecB = int(clamp(floor(6.0 * uLineDensity * uQuality), 3.0, 10.0));
  int countSecA = int(clamp(floor(10.0 * uLineDensity * uQuality), 5.0, 16.0));
  int countDom  = int(clamp(floor(24.0 * uLineDensity * uQuality), 12.0, 36.0));

  // =========================================================
  // 1. RENDER BACKGROUND SECONDARY COUNTER-WAVE (Tertiary Layer)
  // Deep shadow and dark teal lines weaving far behind
  // =========================================================
  for (int i = 0; i < 10; i++) {
    if (i >= countSecB) break;
    float z = float(i) / float(max(countSecB - 1, 1));

    float yCenter = evalSecondaryWaveB(x, z, tau);
    float yNext   = evalSecondaryWaveB(x + eps, z, tau);
    float slope   = (yNext - yCenter) / eps;

    // Normal distance to the curve tangent in UV units
    float dist = abs(y - yCenter) / sqrt(1.0 + slope * slope * (aspect * aspect));
    float distPx = dist / pixelSize;

    // Thinner, subtle lines for background
    float halfWidth = 0.85;
    float lineAlpha = smoothstep(halfWidth + 0.8, halfWidth - 0.4, distPx) * 0.55;

    if (lineAlpha > 0.001) {
      // Normal vector & simulated directional lighting
      vec2 normal = normalize(vec2(-slope * aspect, 1.0));
      float diffuse = clamp(dot(normal, LIGHT_DIR), 0.0, 1.0);

      // Deep color mapping (shadow to dark teal)
      float colorT = mix(0.05, 0.38, diffuse * 0.7 + z * 0.3);
      vec3 col = getWaveColor(colorT);

      // Blend into accumulator
      accumColor += col * lineAlpha * (1.0 - accumAlpha);
      accumAlpha += lineAlpha * (1.0 - accumAlpha);
    }
  }

  // =========================================================
  // 2. RENDER MIDGROUND SECONDARY WAVE
  // Weaving behind and around the dominant wave
  // =========================================================
  for (int i = 0; i < 16; i++) {
    if (i >= countSecA) break;
    float z = float(i) / float(max(countSecA - 1, 1));

    float yCenter = evalSecondaryWaveA(x, z, tau);
    float yNext   = evalSecondaryWaveA(x + eps, z, tau);
    float slope   = (yNext - yCenter) / eps;

    float dist = abs(y - yCenter) / sqrt(1.0 + slope * slope * (aspect * aspect));
    float distPx = dist / pixelSize;

    float halfWidth = 1.0;
    float lineAlpha = smoothstep(halfWidth + 0.9, halfWidth - 0.4, distPx) * 0.72;

    if (lineAlpha > 0.001) {
      vec2 normal = normalize(vec2(-slope * aspect, 1.0));
      float diffuse = clamp(dot(normal, LIGHT_DIR), 0.0, 1.0);
      float crestBonus = smoothstep(0.18, 0.34, yCenter);

      // Gradient through dark teal, teal, and turquoise
      float colorT = mix(0.15, 0.72, diffuse * 0.65 + crestBonus * 0.35);
      vec3 col = getWaveColor(colorT);

      accumColor += col * lineAlpha * (1.0 - accumAlpha);
      accumAlpha += lineAlpha * (1.0 - accumAlpha);
    }
  }

  // =========================================================
  // 3. RENDER DOMINANT PRIMARY WAVE
  // Rich, fine, flowing contour lines with luminous cyan highlights
  // =========================================================
  for (int i = 0; i < 36; i++) {
    if (i >= countDom) break;
    float z = float(i) / float(max(countDom - 1, 1));

    float yCenter = evalDominantWave(x, z, tau);
    float yNext   = evalDominantWave(x + eps, z, tau);
    float slope   = (yNext - yCenter) / eps;

    float dist = abs(y - yCenter) / sqrt(1.0 + slope * slope * (aspect * aspect));
    float distPx = dist / pixelSize;

    // Line width is finely tuned: 1.1px to 1.5px depending on crest
    float crestBonus = smoothstep(0.20, 0.42, yCenter);
    float halfWidth = 1.1 + crestBonus * 0.35;
    float lineAlpha = smoothstep(halfWidth + 1.0, halfWidth - 0.5, distPx);

    // Directional lighting and specular highlight
    vec2 normal = normalize(vec2(-slope * aspect, 1.0));
    float diffuse = clamp(dot(normal, LIGHT_DIR), 0.0, 1.0);
    float highlight = pow(diffuse, 7.0) * crestBonus;

    // Subtle luminous glow for cyan highlights
    float glowDist = distPx;
    float glowAlpha = exp(-glowDist * 0.38) * highlight * uGlow * 0.75;

    float effectiveAlpha = max(lineAlpha, glowAlpha);

    if (effectiveAlpha > 0.001) {
      // Color progression: from teal in shadows to turquoise and cyan on lit crests
      float colorT = mix(0.28, 1.0, diffuse * 0.55 + crestBonus * 0.30 + highlight * 0.25);
      vec3 col = getWaveColor(colorT);

      // Add extra luminous boost from highlight
      col += C_CYAN * highlight * 0.65 * uGlow;

      float aContrib = clamp(lineAlpha + glowAlpha * 0.6, 0.0, 1.0);
      accumColor += col * aContrib * (1.0 - accumAlpha * 0.65);
      accumAlpha += aContrib * (1.0 - accumAlpha);
    }
  }

  // Ensure fully transparent background where there are no waves
  if (accumAlpha <= 0.0001) {
    gl_FragColor = vec4(0.0);
    return;
  }

  // Smooth final alpha clamping to preserve crisp transparency
  gl_FragColor = vec4(accumColor, clamp(accumAlpha, 0.0, 1.0));
}
