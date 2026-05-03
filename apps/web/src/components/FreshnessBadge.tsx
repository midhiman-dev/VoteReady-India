import React from 'react';

export const FRESHNESS_LABEL: Record<string, { icon: string; label: string; className: string }> = {
  verified:   { icon: '✓',  label: 'Verified',   className: 'freshness-verified' },
  review_due: { icon: '⚠️', label: 'Review due', className: 'freshness-review_due' },
  stale:      { icon: '❌', label: 'Stale',       className: 'freshness-stale' },
  archived:   { icon: '📦', label: 'Archived',    className: 'freshness-archived' },
  unverified: { icon: '❓', label: 'Unverified',  className: 'freshness-unverified' },
};

export function getFreshness(status: string) {
  return FRESHNESS_LABEL[status] ?? { icon: '❓', label: status, className: '' };
}

interface FreshnessBadgeProps {
  status: string;
  className?: string;
}

export default function FreshnessBadge({ status, className = '' }: FreshnessBadgeProps) {
  const sf = getFreshness(status);
  return (
    <span
      className={`source-freshness-badge ${sf.className} ${className}`}
      aria-label={`Source freshness: ${sf.icon} ${sf.label}`}
    >
      {sf.icon} {sf.label}
    </span>
  );
}
