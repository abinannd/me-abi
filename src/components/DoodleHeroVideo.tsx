import React, { useCallback, useEffect, useRef, useState } from 'react';

type Direction = { x: number; y: number };
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const POSES = { right: 1.78, downRight: 2.75, down: 5.92, downLeft: 4.72, left: 4.15, upLeft: 3.55, up: 7.72, upRight: 1.05, neutral: 7.72 } as const;
function poseFor({ x, y }: Direction) {
  if (Math.hypot(x, y) < 0.16) return POSES.neutral;
  const angle = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
  if (angle >= 337.5 || angle < 22.5) return POSES.right;
  if (angle < 67.5) return POSES.downRight;
  if (angle < 112.5) return POSES.down;
  if (angle < 157.5) return POSES.downLeft;
  if (angle < 202.5) return POSES.left;
  if (angle < 247.5) return POSES.upLeft;
  if (angle < 292.5) return POSES.up;
  return POSES.upRight;
}

export const DoodleHeroVideo: React.FC<{ className?: string }> = ({ className = '' }) => {
  const stageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const targetRef = useRef(POSES.neutral);
  const rafRef = useRef<number | null>(null);
  const seekingRef = useRef(false);
  const readyRef = useRef(false);
  const [ready, setReady] = useState(false);

  const seekLatest = useCallback(() => {
    const video = videoRef.current;
    if (!video || !readyRef.current || seekingRef.current || video.readyState < 1 || !Number.isFinite(video.duration)) return;
    const target = clamp(targetRef.current, 0, Math.max(0, video.duration - 0.04));
    if (Math.abs(video.currentTime - target) < 0.04) return;
    seekingRef.current = true;
    try { video.currentTime = target; } catch { seekingRef.current = false; }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    const stage = stageRef.current;
    if (!video || !stage) return;
    const onMetadata = () => {
      video.pause();
      readyRef.current = true;
      setReady(true);
      targetRef.current = Math.min(POSES.neutral, Math.max(0, video.duration - 0.04));
      try { video.currentTime = targetRef.current; } catch { /* wait for media to become seekable */ }
    };
    const onSeeked = () => {
      seekingRef.current = false;
      if (Math.abs(video.currentTime - targetRef.current) > 0.12) seekLatest();
    };
    const onError = () => { readyRef.current = false; setReady(false); };
    const queueSeek = () => {
      if (rafRef.current !== null) return;
      rafRef.current = requestAnimationFrame(() => { rafRef.current = null; seekLatest(); });
    };
    const onPointerMove = (event: PointerEvent) => {
      const rect = stage.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      targetRef.current = poseFor({
        x: clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1),
        y: clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1),
      });
      queueSeek();
    };
    const onPointerLeave = () => { targetRef.current = POSES.neutral; queueSeek(); };

    video.addEventListener('loadedmetadata', onMetadata);
    video.addEventListener('seeked', onSeeked);
    video.addEventListener('error', onError);
    stage.addEventListener('pointermove', onPointerMove, { passive: true });
    stage.addEventListener('pointerleave', onPointerLeave, { passive: true });
    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) onMetadata();
    return () => {
      video.removeEventListener('loadedmetadata', onMetadata);
      video.removeEventListener('seeked', onSeeked);
      video.removeEventListener('error', onError);
      stage.removeEventListener('pointermove', onPointerMove);
      stage.removeEventListener('pointerleave', onPointerLeave);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      readyRef.current = false;
      seekingRef.current = false;
    };
  }, [seekLatest]);

  return <div ref={stageRef} className={`doodle-hero-container ${className}`} aria-label="Cursor-reactive doodle character">
    <video ref={videoRef} src={`${import.meta.env.BASE_URL}assets/character/me-doodle.mp4`} muted playsInline preload="auto" className="doodle-hero-media" aria-hidden="true" tabIndex={-1} />
    {!ready && <span className="doodle-hero-loading" aria-hidden="true">Loading character…</span>}
  </div>;
};
