import React, { useEffect, useRef, useState } from 'react';

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

// Distinct pose frames to pre-decode. The neutral pose goes first so the character
// appears as soon as possible; the rest follow in timeline order.
const CAPTURE_ORDER: number[] = [
  POSES.neutral,
  ...[...new Set(Object.values(POSES))].filter((t) => t !== POSES.neutral).sort((a, b) => a - b),
];

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

/**
 * The source MP4 has a single keyframe (t = 0) for 192 frames, so every `currentTime`
 * seek has to decode forward from the start of the clip. Seeking per gaze change is
 * therefore slow and serialized behind `seeked` events.
 *
 * Instead, each distinct pose frame is decoded ONCE at load into a canvas. A gaze change
 * is then a single synchronous `drawImage` from the pointer handler: no seek, no
 * decode wait, no React render and no animation loop.
 */
export const DoodleHeroVideo: React.FC<{ className?: string }> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!container || !video || !canvas || !ctx) return;

    const frames = new Map<number, HTMLCanvasElement>();
    let disposed = false;
    let framesReady = false;
    let captureFailed = false;
    let targetPose = POSES.neutral;
    let drawnPose: number | null = null;

    // Cached hero rect: refreshed lazily after scroll/resize instead of on every pointer event.
    let rect = container.getBoundingClientRect();
    let rectDirty = false;
    const markRectDirty = () => { rectDirty = true; };

    const draw = () => {
      if (drawnPose === targetPose) return;
      const frame = frames.get(targetPose);
      if (!frame) return;
      ctx.drawImage(frame, 0, 0);
      drawnPose = targetPose;
    };

    // Only used if frame capture fails: degrade to a single guarded seek per change.
    const seekFallback = () => {
      if (video.seeking || !Number.isFinite(video.duration)) return;
      const target = clamp(targetPose, 0, Math.max(0, video.duration - 0.04));
      if (Math.abs(video.currentTime - target) >= 0.04) video.currentTime = target;
    };
    const onFallbackSeeked = () => seekFallback();

    const setPose = (pose: number) => {
      if (pose === targetPose) return;
      targetPose = pose;
      if (framesReady) draw();
      else if (captureFailed) seekFallback();
    };

    const onPointerMove = (event: PointerEvent) => {
      if (rectDirty) {
        rect = container.getBoundingClientRect();
        rectDirty = false;
      }
      if (!rect.width || !rect.height) return;
      setPose(poseFor({
        x: clamp(((event.clientX - rect.left) / rect.width - 0.5) * 2, -1, 1),
        y: clamp(((event.clientY - rect.top) / rect.height - 0.5) * 2, -1, 1),
      }));
    };
    const onPointerLeave = () => setPose(POSES.neutral);

    container.addEventListener('pointermove', onPointerMove, { passive: true });
    container.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('scroll', markRectDirty, { passive: true });
    window.addEventListener('resize', markRectDirty, { passive: true });
    const resizeObserver = new ResizeObserver(markRectDirty);
    resizeObserver.observe(container);

    // ---- one-time pose frame capture -------------------------------------------------
    const once = (type: string, timeoutMs: number) =>
      new Promise<void>((resolve, reject) => {
        const done = (ok: boolean) => {
          window.clearTimeout(timer);
          video.removeEventListener(type, onEvent);
          video.removeEventListener('error', onError);
          if (ok) resolve(); else reject(new Error(`video ${type} timed out or errored`));
        };
        const onEvent = () => done(true);
        const onError = () => done(false);
        const timer = window.setTimeout(() => done(false), timeoutMs);
        video.addEventListener(type, onEvent);
        video.addEventListener('error', onError);
      });

    // Wait until the seeked frame has actually been presented (not merely "seeked").
    const framePresented = () =>
      new Promise<void>((resolve) => {
        let finished = false;
        const finish = () => {
          if (finished) return;
          finished = true;
          resolve();
        };
        if ('requestVideoFrameCallback' in video) {
          (video as HTMLVideoElement).requestVideoFrameCallback(finish);
          window.setTimeout(finish, 250); // frame callbacks do not fire in background tabs
        } else {
          requestAnimationFrame(() => requestAnimationFrame(finish));
        }
      });

    const capture = async () => {
      const w = video.videoWidth;
      const h = video.videoHeight;
      if (!w || !h) throw new Error('video has no dimensions');
      canvas.width = w;
      canvas.height = h;
      video.pause();

      for (const time of CAPTURE_ORDER) {
        if (disposed) return;
        const target = clamp(time, 0, Math.max(0, video.duration - 0.04));
        const seeked = once('seeked', 4000);
        video.currentTime = target;
        await seeked;
        await framePresented();
        if (disposed) return;

        const frame = document.createElement('canvas');
        frame.width = w;
        frame.height = h;
        frame.getContext('2d')!.drawImage(video, 0, 0, w, h);
        frames.set(time, frame);

        if (time === POSES.neutral) {
          // Show the character immediately; remaining poses finish in the background.
          framesReady = true;
          setReady(true);
        }
        // If the pointer already asked for this pose while it was still decoding, show it now.
        if (framesReady && time === targetPose) draw();
      }

      // Every pose is cached: the video decoder is no longer needed.
      video.removeAttribute('src');
      video.load();
    };

    const start = () => {
      capture().catch(() => {
        if (disposed) return;
        // Capture failed: show the live video and fall back to guarded seeking.
        captureFailed = true;
        framesReady = false;
        video.style.opacity = '1';
        video.addEventListener('seeked', onFallbackSeeked);
        setReady(true);
        seekFallback();
      });
    };

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) start();
    else video.addEventListener('loadedmetadata', start, { once: true });

    return () => {
      disposed = true;
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('scroll', markRectDirty);
      window.removeEventListener('resize', markRectDirty);
      resizeObserver.disconnect();
      video.removeEventListener('loadedmetadata', start);
      video.removeEventListener('seeked', onFallbackSeeked);
      frames.clear();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`doodle-hero-container ${className}`}
      aria-label="Cursor-reactive doodle character"
    >
      {/* Source video: only used to decode the pose frames (hidden), or as a fallback. */}
      <video
        ref={videoRef}
        src={`${import.meta.env.BASE_URL}assets/character/me-doodle.mp4`}
        muted
        playsInline
        preload="auto"
        className="doodle-hero-media"
        style={{ opacity: 0 }}
        aria-hidden="true"
        tabIndex={-1}
      />
      <canvas ref={canvasRef} className="doodle-hero-media doodle-hero-canvas" aria-hidden="true" />
      {!ready && <span className="doodle-hero-loading" aria-hidden="true">Loading character…</span>}
    </div>
  );
};
