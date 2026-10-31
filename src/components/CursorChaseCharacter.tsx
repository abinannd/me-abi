import React, { useEffect, useRef, useState } from 'react';

/**
 * Cursor-chase character, ported from github.com/abinannd/abinannd (tracker.js).
 *
 * 240 pre-rendered WebP frames are drawn to a canvas. The pointer is normalised around the
 * character's face, damped, mapped to a frame number (perimeter keyframes blended with
 * neutral anchors by distance), and the displayed frame steps toward it each animation frame.
 * Pointer events only write to plain variables; there is no React state per move.
 */

const TOTAL_FRAMES = 240;
const NEUTRAL_FRAME = 220;
const FRAME_WIDTH = 960;
const FRAME_HEIGHT = 540;
const DAMPING_FACTOR = 0.14;
const MAX_FRAME_SPEED = 3.5;
const DEADZONE_RADIUS = 0.08;
const IDLE_TIMEOUT_MS = 3500;

// Directional keyframes around the perimeter (angle in degrees -> frame number).
const PERIMETER_MAP = [
  { deg: -180, frame: 162 }, // Left
  { deg: -135, frame: 145 }, // Upper-Left
  { deg: -90, frame: 114 }, // Up
  { deg: -45, frame: 85 }, // Upper-Right
  { deg: 0, frame: 60 }, // Right
  { deg: 45, frame: 52 }, // Lower-Right
  { deg: 90, frame: 185 }, // Down
  { deg: 135, frame: 172 }, // Lower-Left
  { deg: 180, frame: 162 }, // Left
];

// Matching neutral anchors per angle so radial transitions look natural.
const NEUTRAL_ANCHORS = [
  { deg: -180, frame: 120 },
  { deg: -135, frame: 120 },
  { deg: -90, frame: 120 },
  { deg: -45, frame: 1 },
  { deg: 0, frame: 1 },
  { deg: 45, frame: 1 },
  { deg: 90, frame: 215 },
  { deg: 135, frame: 215 },
  { deg: 180, frame: 120 },
];

// Loaded first so every direction has coverage almost immediately.
const PRIORITY_FRAMES = [
  220, 1, 60, 85, 114, 145, 162, 172, 185, 52, 120, 215,
  25, 45, 75, 100, 130, 155, 166, 195, 205,
];

function calculateFrame(u: number, v: number): number {
  const r = Math.hypot(u, v);
  if (r < DEADZONE_RADIUS) return NEUTRAL_FRAME;

  const rNorm = Math.min(1.0, (r - DEADZONE_RADIUS) / (0.9 - DEADZONE_RADIUS));
  const deg = Math.atan2(v, u) * (180 / Math.PI);

  let perimeterFrame = 60;
  let neutralAnchor = 1;
  for (let k = 0; k < PERIMETER_MAP.length - 1; k++) {
    const p1 = PERIMETER_MAP[k];
    const p2 = PERIMETER_MAP[k + 1];
    if (deg >= p1.deg && deg <= p2.deg) {
      const t = (deg - p1.deg) / (p2.deg - p1.deg);
      perimeterFrame = p1.frame + t * (p2.frame - p1.frame);
      const n1 = NEUTRAL_ANCHORS[k];
      const n2 = NEUTRAL_ANCHORS[k + 1];
      neutralAnchor = n1.frame + t * (n2.frame - n1.frame);
      break;
    }
  }
  return neutralAnchor + rNorm * (perimeterFrame - neutralAnchor);
}

export const CursorChaseCharacter: React.FC<{ className?: string }> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !ctx) return;

    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = reducedMotionQuery.matches;
    const onMotionChange = (e: MediaQueryListEvent) => { prefersReducedMotion = e.matches; };
    reducedMotionQuery.addEventListener('change', onMotionChange);

    const images: (HTMLImageElement | null)[] = new Array(TOTAL_FRAMES + 1).fill(null);
    const loaded = new Set<number>();
    let disposed = false;

    const raw = { x: 0, y: 0, active: false };
    const smoothed = { x: 0, y: 0 };
    let currentFrame = NEUTRAL_FRAME;
    let drawnFrame = -1;
    let lastInteraction = performance.now();
    let rafId: number | null = null;
    let inView = true;
    let started = false;
    let touchTimer: number | undefined;

    // Cached canvas rect: refreshed on resize / scroll, never inside the pointer handler.
    let rect = canvas.getBoundingClientRect();
    let rectDirty = false;
    const markRectDirty = () => { rectDirty = true; };

    const framePath = (idx: number) =>
      `${import.meta.env.BASE_URL}assets/character/frames/frame_${String(idx).padStart(5, '0')}.webp`;

    const preload = (idx: number) =>
      new Promise<void>((resolve) => {
        if (disposed || images[idx]) { resolve(); return; }
        const img = new Image();
        const store = () => {
          if (!disposed) { images[idx] = img; loaded.add(idx); }
          resolve();
        };
        img.onload = () => {
          if ('decode' in img) img.decode().then(store, store);
          else store();
        };
        img.onerror = () => resolve(); // a single missing frame must not break the experience
        img.src = framePath(idx);
      });

    const closestLoaded = (target: number) => {
      const rounded = Math.round(target);
      if (loaded.has(rounded)) return rounded;
      let best = NEUTRAL_FRAME;
      let min = Infinity;
      for (const f of loaded) {
        const d = Math.abs(f - rounded);
        if (d < min) { min = d; best = f; }
      }
      return best;
    };

    const draw = (frame: number) => {
      const idx = closestLoaded(frame);
      if (idx === drawnFrame) return; // nothing new to paint
      const img = images[idx];
      if (img && img.complete) {
        ctx.drawImage(img, 0, 0, FRAME_WIDTH, FRAME_HEIGHT);
        drawnFrame = idx;
      }
    };

    const idlePointer = (now: number) => {
      const elapsed = (now - lastInteraction) / 1000;
      if (elapsed < IDLE_TIMEOUT_MS / 1000 || prefersReducedMotion) return { x: 0, y: 0 };
      const t = elapsed - IDLE_TIMEOUT_MS / 1000;
      const breath = Math.max(0, Math.sin(t * 0.3));
      return { x: Math.sin(t * 0.7) * 0.45 * breath, y: Math.cos(t * 0.5) * 0.25 * breath };
    };

    const tick = (now: number) => {
      rafId = null;
      if (disposed || !inView) return;

      const target = raw.active ? { x: raw.x, y: raw.y } : idlePointer(now);
      if (prefersReducedMotion) {
        smoothed.x = 0;
        smoothed.y = 0;
      } else {
        smoothed.x += (target.x - smoothed.x) * DAMPING_FACTOR;
        smoothed.y += (target.y - smoothed.y) * DAMPING_FACTOR;
      }

      const goal = calculateFrame(smoothed.x, smoothed.y);
      let delta = goal - currentFrame;
      if (delta > TOTAL_FRAMES / 2) delta -= TOTAL_FRAMES;
      else if (delta < -TOTAL_FRAMES / 2) delta += TOTAL_FRAMES;

      if (Math.abs(delta) > 0.05) {
        currentFrame += Math.sign(delta) * Math.min(MAX_FRAME_SPEED, Math.abs(delta) * 0.4);
        if (currentFrame > TOTAL_FRAMES) currentFrame -= TOTAL_FRAMES;
        else if (currentFrame < 1) currentFrame += TOTAL_FRAMES;
      } else {
        currentFrame = goal;
      }

      draw(currentFrame);
      rafId = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (rafId === null && started && inView && !disposed) rafId = requestAnimationFrame(tick);
    };

    // ---- pointer input ----------------------------------------------------------------
    const updatePointer = (clientX: number, clientY: number) => {
      if (rectDirty) {
        rect = canvas.getBoundingClientRect();
        rectDirty = false;
      }
      // Face sits slightly above the centre of the 16:9 frame.
      const cx = rect.left + rect.width * 0.5;
      const cy = rect.top + rect.height * 0.46;
      const rx = Math.max(120, rect.width * 0.48);
      const ry = Math.max(100, rect.height * 0.48);
      const nx = (clientX - cx) / rx;
      const ny = (clientY - cy) / ry;
      const dist = Math.hypot(nx, ny);
      if (dist > 1.0) {
        raw.x = (nx / dist) * Math.min(1.4, dist);
        raw.y = (ny / dist) * Math.min(1.4, dist);
      } else {
        raw.x = nx;
        raw.y = ny;
      }
      raw.active = true;
      lastInteraction = performance.now();
    };

    const onPointerMove = (e: PointerEvent) => updatePointer(e.clientX, e.clientY);
    const onPointerDown = (e: PointerEvent) => updatePointer(e.clientX, e.clientY);
    const onPointerLeave = () => { raw.active = false; };
    const onPointerUp = () => {
      // On touch screens, ease back to neutral shortly after the finger lifts.
      if (window.matchMedia('(hover: none)').matches) {
        window.clearTimeout(touchTimer);
        touchTimer = window.setTimeout(onPointerLeave, 1200);
      }
    };

    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('pointerdown', onPointerDown, { passive: true });
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerLeave);
    document.addEventListener('mouseleave', onPointerLeave);
    window.addEventListener('scroll', markRectDirty, { passive: true });
    window.addEventListener('resize', markRectDirty, { passive: true });
    const resizeObserver = new ResizeObserver(markRectDirty);
    resizeObserver.observe(canvas);

    // No frame work while the hero is scrolled out of view.
    const intersectionObserver = new IntersectionObserver((entries) => {
      inView = entries[entries.length - 1].isIntersecting;
      if (inView) { markRectDirty(); startLoop(); }
    });
    intersectionObserver.observe(canvas);

    // ---- bootstrap --------------------------------------------------------------------
    const init = async () => {
      await preload(NEUTRAL_FRAME);
      if (disposed) return;
      draw(NEUTRAL_FRAME);
      setReady(true);
      started = true;
      startLoop();

      for (const f of PRIORITY_FRAMES) {
        await preload(f);
        if (disposed) return;
      }

      // Remaining frames load progressively in the background, a few per idle slot.
      let next = 1;
      const loadBatch = () => {
        if (disposed) return;
        let count = 0;
        while (next <= TOTAL_FRAMES && count < 4) {
          if (!loaded.has(next)) { void preload(next); count++; }
          next++;
        }
        if (next <= TOTAL_FRAMES) {
          if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(loadBatch, { timeout: 250 });
          else setTimeout(loadBatch, 30);
        }
      };
      loadBatch();
    };
    void init();

    return () => {
      disposed = true;
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.clearTimeout(touchTimer);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('pointercancel', onPointerLeave);
      document.removeEventListener('mouseleave', onPointerLeave);
      window.removeEventListener('scroll', markRectDirty);
      window.removeEventListener('resize', markRectDirty);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      reducedMotionQuery.removeEventListener('change', onMotionChange);
      images.fill(null);
      loaded.clear();
    };
  }, []);

  return (
    <div className={`doodle-hero-container ${className}`} aria-label="Cursor-reactive doodle character">
      <canvas
        ref={canvasRef}
        width={FRAME_WIDTH}
        height={FRAME_HEIGHT}
        className="doodle-hero-media"
        aria-hidden="true"
      />
      {!ready && <span className="doodle-hero-loading" aria-hidden="true">Loading character…</span>}
    </div>
  );
};

export default CursorChaseCharacter;
