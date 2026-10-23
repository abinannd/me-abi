import React, { useEffect, useRef } from 'react';

export interface CharacterVideoProps {
  className?: string;
  style?: React.CSSProperties;
  src?: string;
  /** Width/height of the central dead zone as a fraction of the viewport. */
  deadZone?: number;
}

type GazeState = 'straight' | 'top-left' | 'bottom-left' | 'bottom-right' | 'top-right';

const GAZE_TIMES: Record<GazeState, number> = {
  straight: 1,
  'top-left': 3,
  'bottom-left': 5,
  'bottom-right': 7,
  'top-right': 9,
};

export const CharacterVideo: React.FC<CharacterVideoProps> = ({
  className,
  style,
  src = '/assets/character/me2.mp4',
  deadZone = 0.3,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const activeGazeRef = useRef<GazeState>('straight');
  const pendingGazeRef = useRef<GazeState | null>(null);
  const isSeekingRef = useRef(false);
  const resetTimerRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.pause();
    video.muted = true;

    const clearResetTimer = () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
        resetTimerRef.current = null;
      }
    };

    const seekToGaze = (gaze: GazeState) => {
      activeGazeRef.current = gaze;
      if (video.readyState < HTMLMediaElement.HAVE_METADATA || !Number.isFinite(video.duration)) {
        pendingGazeRef.current = gaze;
        return;
      }

      if (video.seeking || isSeekingRef.current) {
        pendingGazeRef.current = gaze;
        return;
      }

      const target = Math.min(GAZE_TIMES[gaze], Math.max(0, video.duration - 0.05));
      // Avoid decoder work when the requested pose is already displayed.
      if (Math.abs(video.currentTime - target) < 0.08) return;

      isSeekingRef.current = true;
      try {
        video.currentTime = target;
      } catch {
        isSeekingRef.current = false;
      }
    };

    const gazeFromPoint = (x: number, y: number): GazeState => {
      const width = Math.max(window.innerWidth, 1);
      const height = Math.max(window.innerHeight, 1);
      const nx = x / width;
      const ny = y / height;
      const zone = Math.min(Math.max(deadZone, 0.1), 0.6);

      // Keep the middle of the viewport as a deliberate no-change/default zone.
      if (Math.abs(nx - 0.5) <= zone / 2 && Math.abs(ny - 0.5) <= zone / 2) {
        return 'straight';
      }

      if (nx < 0.5 && ny < 0.5) return 'top-left';
      if (nx < 0.5 && ny >= 0.5) return 'bottom-left';
      if (nx >= 0.5 && ny >= 0.5) return 'bottom-right';
      return 'top-right';
    };

    const onPointerMove = (x: number, y: number) => {
      clearResetTimer();
      const gaze = gazeFromPoint(x, y);
      if (gaze !== activeGazeRef.current) seekToGaze(gaze);
    };

    const onMouseMove = (event: MouseEvent) => onPointerMove(event.clientX, event.clientY);
    const onTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0];
      if (touch) onPointerMove(touch.clientX, touch.clientY);
    };

    const returnToStraight = () => {
      clearResetTimer();
      resetTimerRef.current = window.setTimeout(() => seekToGaze('straight'), 80);
    };

    const onSeeked = () => {
      isSeekingRef.current = false;
      const pending = pendingGazeRef.current;
      pendingGazeRef.current = null;
      if (pending && pending !== activeGazeRef.current) {
        seekToGaze(pending);
      }
    };

    const onMetadata = () => {
      video.pause();
      const pending = pendingGazeRef.current;
      if (pending) {
        pendingGazeRef.current = null;
        seekToGaze(pending);
      } else {
        seekToGaze('straight');
      }
    };

    video.addEventListener('seeked', onSeeked);
    video.addEventListener('loadedmetadata', onMetadata);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('mouseleave', returnToStraight);
    window.addEventListener('blur', returnToStraight);

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) onMetadata();

    return () => {
      clearResetTimer();
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('loadedmetadata', onMetadata);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('mouseleave', returnToStraight);
      window.removeEventListener('blur', returnToStraight);
      pendingGazeRef.current = null;
      isSeekingRef.current = false;
    };
  }, [deadZone]);

  return (
    <div className={`character-container ${className || ''}`} style={style}>
      <video
        ref={videoRef}
        src={src}
        muted
        playsInline
        preload="auto"
        className="character-media"
      />
    </div>
  );
};
