/**
 * Wave Shader Configuration
 * 
 * Centralized internal configuration preserving the wave shader's parameters
 * without requiring a visible user-facing control panel.
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
  /** Reduced motion flag. When true, produces a serene, tranquil ambient drift */
  reducedMotion: boolean;
  /** Periodic harmonic cycle duration in seconds for a seamless loop (Default: 16.0) */
  loopDuration: number;
}

export const INITIAL_WAVE_CONFIG: WaveConfig = {
  waveHeight: 1.55,
  lineDensity: 1.10,
  speed: 1.10,
  glow: 1.70,
  quality: 'high',
  reducedMotion: true, // Enabled as the initial setting per specification
  loopDuration: 16.0,
};
