/**
 * Single shared scroll/resize loop for every curtain section.
 *
 * - One passive scroll listener and one requestAnimationFrame for the whole page.
 * - Layout is measured only on resize / size change (never inside the scroll frame),
 *   so a scroll frame is pure arithmetic on `window.scrollY` plus style writes.
 */

export interface ScrollSubscriber {
  /** Re-measure cached geometry (called on resize / layout change). */
  measure: () => void;
  /** Apply visuals for the current scroll position (called at most once per frame). */
  update: (scrollY: number, viewportH: number) => void;
}

const subscribers = new Set<ScrollSubscriber>();
let rafId: number | null = null;
let attached = false;
let remeasure = true;
let resizeObserver: ResizeObserver | null = null;

const frame = () => {
  rafId = null;
  const viewportH = window.innerHeight;
  const scrollY = window.scrollY;
  if (remeasure) {
    remeasure = false;
    // All reads first, then all writes (inside update) — no read/write interleaving.
    subscribers.forEach((s) => s.measure());
  }
  subscribers.forEach((s) => s.update(scrollY, viewportH));
};

const request = () => {
  if (rafId === null) rafId = requestAnimationFrame(frame);
};

const onScroll = () => request();
const onResize = () => {
  remeasure = true;
  request();
};

function attach() {
  if (attached) return;
  attached = true;
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize, { passive: true });
  window.addEventListener('load', onResize);
  // Layout changes that are not window resizes (fonts, images) also invalidate measurements.
  resizeObserver = new ResizeObserver(onResize);
  resizeObserver.observe(document.documentElement);
}

function detach() {
  if (!attached) return;
  attached = false;
  window.removeEventListener('scroll', onScroll);
  window.removeEventListener('resize', onResize);
  window.removeEventListener('load', onResize);
  resizeObserver?.disconnect();
  resizeObserver = null;
  if (rafId !== null) cancelAnimationFrame(rafId);
  rafId = null;
}

export function subscribeScroll(subscriber: ScrollSubscriber): () => void {
  subscribers.add(subscriber);
  attach();
  remeasure = true;
  request();
  return () => {
    subscribers.delete(subscriber);
    if (subscribers.size === 0) detach();
  };
}
