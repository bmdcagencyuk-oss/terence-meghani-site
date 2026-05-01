'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import data from '@/data/nav-indicators.json';

export type NavIndicator = {
  label: string;
  href?: string;
  /** Only emit this entry when NEXT_PUBLIC_NOTES_VISIBLE is on. */
  requiresNotes?: boolean;
};

type Props = {
  /** Notes-visible flag — caller passes the resolved boolean. */
  notesVisible: boolean;
  /** "desktop" sizes the dot small (6px); "mobile" larger (8px) and 13px text. */
  variant?: 'desktop' | 'mobile';
  className?: string;
};

const ALL = (data.indicators as NavIndicator[]) ?? [];

/**
 * Renders a single live indicator picked at random from data/nav-indicators.json
 * on each mount. The pick is wrapped in useMemo with a per-mount seed so the
 * same value sticks for the lifetime of the component (no re-roll on re-render).
 *
 * Notes-gated entries are filtered out unless the caller passes notesVisible.
 * Entries with an href become clickable links UNLESS the current path already
 * matches that href — in which case the same indicator renders as static text.
 */
export function LiveIndicator({ notesVisible, variant = 'desktop', className }: Props) {
  const pathname = usePathname();

  const pool = useMemo(
    () => ALL.filter((i) => (i.requiresNotes ? notesVisible : true)),
    [notesVisible],
  );

  // Random pick happens on the client only — keeps render pure and avoids the
  // SSR/CSR mismatch you'd get from rolling Math.random during render. The
  // setState fires inside a rAF callback to keep the effect body free of
  // direct state updates.
  const [pickIdx, setPickIdx] = useState<number | null>(null);
  useEffect(() => {
    if (pool.length === 0) return;
    const id = requestAnimationFrame(() => {
      setPickIdx(Math.floor(Math.random() * pool.length));
    });
    return () => cancelAnimationFrame(id);
  }, [pool]);

  const pick = pickIdx !== null && pool[pickIdx] ? pool[pickIdx] : null;
  if (!pick) return null;

  const isOnTarget =
    pick.href !== undefined &&
    pathname !== undefined &&
    (pathname === pick.href || pathname === pick.href.replace(/\/$/, ''));

  const dotCls = variant === 'mobile' ? 'live-dot live-dot--lg' : 'live-dot';
  const wrapCls = ['live-indicator', `live-indicator--${variant}`, className]
    .filter(Boolean)
    .join(' ');

  const inner = (
    <>
      <span className={dotCls} aria-hidden="true" />
      <span className="live-text">{pick.label}</span>
    </>
  );

  return (
    <div className={wrapCls} aria-live="polite">
      {pick.href && !isOnTarget ? (
        <Link href={pick.href} className="live-link">
          {inner}
        </Link>
      ) : (
        inner
      )}
    </div>
  );
}
