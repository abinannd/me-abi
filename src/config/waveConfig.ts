/**
 * Wave Shader Configuration
 * 
 * Centralized configuration for all procedural wave shader parameters.
 * Modify these values in code to adjust the rendered wave.
 */
export interface WaveConfig {
  /** Amplitude multiplier for the wave crests (Default: 1.55) */
  waveHeight: number;
  /** Multiplier for line density / count of contour lines (Default: 1.10) */
  lineDensity: number;
  /** Flow animation speed multiplier (Default: 1.10) */
  speed: number;
  /** Cyan highlight specular and ambient glow intensity (Default: 1.70) */
  glow: number;
  /** GPU rendering quality tier ('high' for desktop, 'medium', or 'low') */
  quality: 'high' | 'medium' | 'low';
  /** Periodic harmonic cycle duration in seconds for a seamless loop (Default: 16.0) */
  loopDuration: number;
  /**
   * Explicit reduced-motion override:
   * - false: normal wave animation uses configured speed (Default: 1.10).
   * - true: forces reduced motion (gentle ambient drift at 0.08 speed).
   */
  reducedMotion: boolean;
  /**
   * When true, automatically honors the operating system 'prefers-reduced-motion'
   * media query, slowing down animation if the user has requested reduced motion in their OS.
   */
  respectSystemReducedMotion: boolean;
}

export const INITIAL_WAVE_CONFIG: WaveConfig = {
  waveHeight: 1.55,
  lineDensity: 1.10,
  speed: 1.10,
  glow: 1.70,
  quality: 'high',
  reducedMotion: false, // Normal wave animation uses configured speed (1.10)
  respectSystemReducedMotion: true, // Respects OS prefers-reduced-motion appropriately
  loopDuration: 16.0,
};
