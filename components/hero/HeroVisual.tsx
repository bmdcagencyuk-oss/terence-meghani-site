'use client';

import { useSyncExternalStore } from 'react';
import { HeroLogoDisplace } from './HeroLogoDisplace';

const DESKTOP_QUERY = '(min-width: 720px)';
const MOTION_QUERY = '(prefers-reduced-motion: reduce)';

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

const subscribeNoop = () => () => {};
const getNoMorph = () =>
  new URLSearchParams(window.location.search).get('nomorph') === '1';
const getForceMorph = () =>
  new URLSearchParams(window.location.search).get('forcemorph') === '1';

const getServerFalse = () => false;

function StaticLogo() {
  return (
    <div className="hero-morph-canvas hero-morph-canvas--static" aria-hidden="true">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/brand/emblem-gorilla.svg"
        alt=""
        loading="lazy"
        decoding="async"
      />
    </div>
  );
}

/**
 * Right-side hero visual.
 *   - Desktop with motion allowed → cursor-driven SVG displacement on the logo.
 *   - Mobile, reduced-motion, or `?nomorph=1` → static logo, no filter mounted.
 *   - `?forcemorph=1` forces the displacement variant (mobile testing).
 *   - SSR snapshot is `false` for both media queries, so the server renders
 *     the static branch and hydration swaps in the displacement on desktop.
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

  if (forceFallback) return <StaticLogo />;
  if (forceWebGL) return <HeroLogoDisplace />;
  if (!isDesktop || reducedMotion) return <StaticLogo />;
  return <HeroLogoDisplace />;
}

export default HeroVisual;
