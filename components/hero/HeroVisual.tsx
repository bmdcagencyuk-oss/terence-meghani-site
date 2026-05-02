'use client';

import { useSyncExternalStore } from 'react';
import dynamic from 'next/dynamic';
import { MorphingGorillaFallback } from './MorphingGorillaFallback';

/* The Three.js chunk is only imported when this branch renders. On
   mobile we never reach it, so phones never download or execute the
   WebGL bundle. ssr: false also prevents Three.js from running during
   SSR. While the chunk is in flight, the fallback shows via `loading`. */
const MorphingGorilla = dynamic(
  () => import('./MorphingGorilla').then((m) => m.MorphingGorilla),
  {
    ssr: false,
    loading: () => <MorphingGorillaFallback />,
  },
);

const DESKTOP_QUERY = '(min-width: 720px)';
const MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/* Stable module-scoped subscribe + snapshot functions. useSyncExternalStore
   requires referential stability — it's the React 18+ canonical bridge
   between an external API (matchMedia) and React's render model, and
   handles SSR/hydration without the synchronous setState-in-effect
   cascade that React 19's lint rule (correctly) flags. */
const subscribeDesktop = (cb: () => void) => {
  const mq = window.matchMedia(DESKTOP_QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const getDesktopClient = () => window.matchMedia(DESKTOP_QUERY).matches;

const subscribeMotion = (cb: () => void) => {
  const mq = window.matchMedia(MOTION_QUERY);
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
};
const getMotionClient = () => window.matchMedia(MOTION_QUERY).matches;

/* URL overrides don't change at runtime (a navigation re-mounts the
   tree), so the subscribe is a no-op and we just read the param once
   on mount via the snapshot. */
const subscribeNoop = () => () => {};
const getNoMorph = () =>
  new URLSearchParams(window.location.search).get('nomorph') === '1';
const getForceMorph = () =>
  new URLSearchParams(window.location.search).get('forcemorph') === '1';

const getServerFalse = () => false;

/**
 * Decides between the WebGL particle morph and the static fallback.
 *
 *   - SSR + first client paint render the fallback (server snapshot is
 *     `false` for both media queries). On mobile the fallback stays put;
 *     on desktop, hydration swaps in the WebGL component. Mobile never
 *     mounts the Three.js chunk.
 *   - `prefers-reduced-motion: reduce` keeps the fallback on any width.
 *   - `?nomorph=1` forces the fallback (debugging on desktop).
 *   - `?forcemorph=1` forces WebGL (testing on mobile emulation).
 */
export function HeroVisual() {
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    getDesktopClient,
    getServerFalse,
  );
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    getMotionClient,
    getServerFalse,
  );
  const forceFallback = useSyncExternalStore(
    subscribeNoop,
    getNoMorph,
    getServerFalse,
  );
  const forceWebGL = useSyncExternalStore(
    subscribeNoop,
    getForceMorph,
    getServerFalse,
  );

  if (forceFallback) return <MorphingGorillaFallback />;
  if (forceWebGL) return <MorphingGorilla />;
  if (!isDesktop || reducedMotion) return <MorphingGorillaFallback />;
  return <MorphingGorilla />;
}

export default HeroVisual;
