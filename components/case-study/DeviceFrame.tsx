/**
 * DeviceFrame — case study image treatment convention
 *
 * Wraps establishing shots in subtle realistic device chrome.
 * MacBook silhouette for desktop variant, iPhone for mobile.
 *
 * Use for:
 *   - Hero / establishing shots (full-page captures of public surfaces)
 *   - Mobile views of public surfaces
 *
 * Do NOT use for:
 *   - Admin dashboards, internal tools, backend surfaces
 *   - Form flows, error states, confirmation screens
 *   - Detail shots (zoomed-in feature slices)
 *   - Card preview thumbnails on /work index or service pages
 *
 * The rule: establishing shots get framed (frame provides "this is a website on a screen"
 * context that flat content can't). Detail shots stay flat (data is the focus, frame would
 * overpower it).
 */
import type { ReactNode } from 'react';

type Variant = 'desktop' | 'mobile';

type Props = {
  variant: Variant;
  children: ReactNode;
  className?: string;
};

export function DeviceFrame({ variant, children, className = '' }: Props) {
  return (
    <div className={`device-frame device-frame--${variant} ${className}`.trim()}>
      <div className="device-frame__screen">{children}</div>
    </div>
  );
}
