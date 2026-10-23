import React, { useEffect, useRef } from 'react';

export interface CharacterVideoProps {
  className?: string;
  style?: React.CSSProperties;
  src?: string;
  /** Sensitivity multiplier for horizontal cursor delta scrubbing (default: 1.0) */
  sensitivity?: number;
}

export const CharacterVideo: React.FC<CharacterVideoProps> = ({
  className,
  style,
  src = '/assets/character/me2.mp4',
  sensitivity = 1.0,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetTimeRef = useRef<number>(0);
  const isSeekingRef = useRef<boolean>(false);
  const pendingSeekRef = useRef<boolean>(false);
  const prevXRef = useRef<number | null>(null);
  const rafIdRef = useRef<number | null>(null);
  const seekTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure video is strictly paused (does not autoplay independently)
    video.pause();

    const dispatchSeek = () => {
      if (!video || !Number.isFinite(video.duration) || video.readyState < 1) return;

      // If the hardware/browser video decoder is actively executing a seek:
      if (video.seeking || isSeekingRef.current) {
        // Mark that a newer target is queued. The 'seeked' event will pick up the latest target!
        pendingSeekRef.current = true;
        return;
      }

      const target = Math.max(0, Math.min(video.duration, targetTimeRef.current));

      // Skip micro-seeks below half a frame (~0.02s at 24fps)
      if (Math.abs(video.currentTime - target) < 0.02) {
        pendingSeekRef.current = false;
        return;
      }

      isSeekingRef.current = true;
      pendingSeekRef.current = false;

      // Safety timeout in case a browser drops the 'seeked' event
      if (seekTimeoutRef.current) window.clearTimeout(seekTimeoutRef.current);
      seekTimeoutRef.current = window.setTimeout(() => {
        if (isSeekingRef.current) {
          isSeekingRef.current = false;
          if (pendingSeekRef.current) {
            dispatchSeek();
          }
        }
      }, 200);

      try {
        video.currentTime = target;
      } catch {
        isSeekingRef.current = false;
      }
    };

    const onSeeked = () => {
      isSeekingRef.current = false;
      if (seekTimeoutRef.current) {
        window.clearTimeout(seekTimeoutRef.current);
        seekTimeoutRef.current = null;
      }

      if (!video || !Number.isFinite(video.duration)) return;

      // Prioritize the LATEST cursor target, discarding all intermediate queued points
      const latest = Math.max(0, Math.min(video.duration, targetTimeRef.current));
      if (pendingSeekRef.current || Math.abs(video.currentTime - latest) >= 0.02) {
        if (!rafIdRef.current) {
          rafIdRef.current = requestAnimationFrame(() => {
            rafIdRef.current = null;
            dispatchSeek();
          });
        }
      }
    };

    const onMetadata = () => {
      video.pause();
      targetTimeRef.current = Math.max(0, Math.min(video.duration || 0, video.currentTime || 0));
    };

    if (video.readyState >= 1 && video.duration) {
      onMetadata();
    }

    const onMouseMove = (event: MouseEvent) => {
      if (prevXRef.current === null) {
        prevXRef.current = event.clientX;
        return;
      }

      const delta = event.clientX - prevXRef.current;
      prevXRef.current = event.clientX;

      // Filter out large unexpected pointer jumps (e.g. window re-entry or tab switches)
      if (Math.abs(delta) > 250) return;
      if (!video.duration || !Number.isFinite(video.duration)) return;

      // Viewport-relative delta mapped to video duration
      const viewportWidth = Math.max(window.innerWidth, 1);
      const timeDelta = (delta / viewportWidth) * sensitivity * video.duration;

      targetTimeRef.current = Math.max(0, Math.min(video.duration, targetTimeRef.current + timeDelta));

      // Coalesce pointer events to at most one seek dispatch per display refresh frame
      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = null;
          dispatchSeek();
        });
      }
    };

    const onMouseLeave = () => {
      prevXRef.current = null;
    };

    const onMouseEnter = (e: MouseEvent) => {
      prevXRef.current = e.clientX;
    };

    const onBlur = () => {
      prevXRef.current = null;
    };

    // Mobile touch support
    let touchStartX: number | null = null;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        touchStartX = e.touches[0].clientX;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 0 || touchStartX === null) return;
      const currentX = e.touches[0].clientX;
      const delta = currentX - touchStartX;
      touchStartX = currentX;

      if (Math.abs(delta) > 250) return;
      if (!video.duration || !Number.isFinite(video.duration)) return;

      const viewportWidth = Math.max(window.innerWidth, 1);
      const timeDelta = (delta / viewportWidth) * sensitivity * video.duration;

      targetTimeRef.current = Math.max(0, Math.min(video.duration, targetTimeRef.current + timeDelta));

      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(() => {
          rafIdRef.current = null;
          dispatchSeek();
        });
      }
    };

    const onTouchEnd = () => {
      touchStartX = null;
    };

    video.addEventListener('seeked', onSeeked);
    video.addEventListener('loadedmetadata', onMetadata);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('blur', onBlur);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      if (seekTimeoutRef.current) {
        window.clearTimeout(seekTimeoutRef.current);
        seekTimeoutRef.current = null;
      }
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('loadedmetadata', onMetadata);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('blur', onBlur);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      isSeekingRef.current = false;
      pendingSeekRef.current = false;
      prevXRef.current = null;
    };
  }, [sensitivity]);

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
