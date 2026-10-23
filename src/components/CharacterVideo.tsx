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
  const seekingRef = useRef<boolean>(false);
  const prevXRef = useRef<number | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Ensure video is strictly paused (does not autoplay independently)
    video.pause();

    const seekToTarget = () => {
      if (!video.duration || !Number.isFinite(video.duration) || seekingRef.current) return;
      const target = Math.max(0, Math.min(video.duration, targetTimeRef.current));
      
      // Threshold to avoid redundant micro-seeks
      if (Math.abs(video.currentTime - target) < 0.015) return;

      seekingRef.current = true;
      try {
        video.currentTime = target;
      } catch {
        seekingRef.current = false;
      }
    };

    const onSeeked = () => {
      seekingRef.current = false;
      // Seek to target if cursor moved while previous seek was resolving
      seekToTarget();
    };

    const onMetadata = () => {
      video.pause();
      targetTimeRef.current = Math.max(0, Math.min(video.duration || 0, video.currentTime || 0));
    };

    // If metadata was already cached by the browser
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

      // Filter out large unexpected pointer jumps (e.g. tab switches or cursor teleportation)
      if (Math.abs(delta) > 250) return;

      if (!video.duration || !Number.isFinite(video.duration)) return;

      // Delta mapped across the viewport width and scaled to video duration
      const viewportWidth = Math.max(window.innerWidth, 1);
      const timeDelta = (delta / viewportWidth) * sensitivity * video.duration;

      targetTimeRef.current = Math.max(0, Math.min(video.duration, targetTimeRef.current + timeDelta));
      seekToTarget();
    };

    const onMouseLeave = () => {
      prevXRef.current = null;
    };

    const onMouseEnter = (e: MouseEvent) => {
      prevXRef.current = e.clientX;
    };

    // Touch support for mobile devices
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
      seekToTarget();
    };

    const onTouchEnd = () => {
      touchStartX = null;
    };

    video.addEventListener('seeked', onSeeked);
    video.addEventListener('loadedmetadata', onMetadata);
    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mouseleave', onMouseLeave);
    window.addEventListener('mouseenter', onMouseEnter);
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('loadedmetadata', onMetadata);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      window.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      seekingRef.current = false;
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
