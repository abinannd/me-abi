import React, { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';

type Point = { x: number; y: number };
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

// These timestamps select the authored poses in the original Experiment 6 MP4.
const POSES: Record<string, number> = {
  right: 1.78,
  downRight: 2.75,
  down: 5.92,
  downLeft: 4.72,
  left: 4.15,
  upLeft: 3.55,
  up: 7.72,
  upRight: 1.05,
  neutral: 7.72,
};

function poseFor({ x, y }: Point): number {
  if (Math.hypot(x, y) < 0.16) return POSES.neutral;

  const degrees = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  if (degrees >= 337.5 || degrees < 22.5) return POSES.right;
  if (degrees < 67.5) return POSES.downRight;
  if (degrees < 112.5) return POSES.down;
  if (degrees < 157.5) return POSES.downLeft;
  if (degrees < 202.5) return POSES.left;
  if (degrees < 247.5) return POSES.upLeft;
  if (degrees < 292.5) return POSES.up;
  return POSES.upRight;
}

export const DoodleHeroVideo: React.FC<{ className?: string }> = ({ className = '' }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<number | null>(null);
  const targetRef = useRef(POSES.neutral);
  const pendingPointRef = useRef<Point>({ x: 0, y: 0 });
  const seekingRef = useRef(false);
  const readyRef = useRef(false);
  const [ready, setReady] = useState(false);

  const seekLatest = useCallback(() => {
    const video = videoRef.current;
    if (!video || !readyRef.current || seekingRef.current ||
        video.readyState < HTMLMediaElement.HAVE_METADATA ||
        !Number.isFinite(video.duration)) return;

    const target = clamp(targetRef.current, 0, Math.max(0, video.duration - 0.04));
    if (Math.abs(video.currentTime - target) < 0.04) return;

    seekingRef.current = true;
    try {
      video.currentTime = target;
    } catch {
      seekingRef.current = false;
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onMetadata = () => {
      video.pause();
      readyRef.current = true;
      setReady(true);
      targetRef.current = Math.min(POSES.neutral, Math.max(0, video.duration - 0.04));
      // Treat the initial pose as a seek too, so later pointer targets are serialized.
      seekingRef.current = true;
      try {
        video.currentTime = targetRef.current;
      } catch {
        seekingRef.current = false;
      }
    };

    const onSeeked = () => {
      seekingRef.current = false;
      // If the pointer moved during a seek, immediately service the newest target.
      if (Math.abs(video.currentTime - targetRef.current) > 0.12) seekLatest();
    };

    const onError = () => {
      readyRef.current = false;
      seekingRef.current = false;
      setReady(false);
    };

    video.addEventListener('loadedmetadata', onMetadata);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onError);
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) onMetadata();

    return () => {
      video.removeEventListener('loadedmetadata', onMetadata);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      readyRef.current = false;
      seekingRef.current = false;
    };
  }, [seekLatest]);

  const scheduleTarget = (point: Point) => {
    pendingPointRef.current = point;
    targetRef.current = poseFor(point);

    // Coalesce fast pointer movement into one seek request per animation frame.
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      seekLatest();
    });
  };

  const updatePointer = (event: PointerEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    scheduleTarget({
      x: clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1),
      y: clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1),
    });
  };

  const reset = () => scheduleTarget({ x: 0, y: 0 });

  return (
    <div
      className={`doodle-hero-container ${className}`}
      onPointerMove={updatePointer}
      onPointerLeave={reset}
      aria-label="Cursor-reactive doodle character"
    >
      <video
        ref={videoRef}
        src={`${import.meta.env.BASE_URL}assets/character/me-doodle.mp4`}
        muted
        playsInline
        preload="auto"
        className="doodle-hero-media"
        aria-hidden="true"
        tabIndex={-1}
      />
      {!ready && <span className="doodle-hero-loading" aria-hidden="true">Loading character…</span>}
    </div>
  );
};
