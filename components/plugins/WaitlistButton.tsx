'use client';

import { useState } from 'react';
import { LeadCaptureForm } from './LeadCaptureForm';

type Props = {
  /** Plugin name — used as the lead source string. */
  pluginName: string;
  label?: string;
};

export function WaitlistButton({ pluginName, label = 'Join waitlist' }: Props) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {!open && (
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setOpen(true)}
        >
          {label}
        </button>
      )}
      {open && (
        <div
          style={{
            background: 'var(--color-char-3, var(--color-char))',
            border: '1px solid var(--color-hairline)',
            padding: 14,
            borderRadius: 6,
          }}
        >
          <LeadCaptureForm
            source={`${pluginName} waitlist`}
            withName
            submitLabel="Join waitlist"
            successMessage="You're on the list. I'll email when access opens."
            variant="inline"
          />
        </div>
      )}
    </div>
  );
}
