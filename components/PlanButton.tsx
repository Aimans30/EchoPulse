'use client';

import { useState } from 'react';
import PlanIntakeModal from './PlanIntakeModal';
import type { BookablePlanKey } from '@/lib/links';
import { trackPlanSelect } from '@/lib/analytics';

const LABEL: Record<BookablePlanKey, string> = {
  pilot: 'Choose the Pilot',
  presence: 'Choose Presence Engine',
  growth: 'Choose Growth',
  full: 'Scope a custom build',
};

/**
 * A plan button for server-rendered pages (/pricing). Opens the same intake
 * modal the homepage pricing cards use, with this plan already selected.
 *
 * `variant="primary"` is the filled accent button (one per row of cards);
 * `secondary` is the outlined ink button. `dark` is the older name for
 * primary and still works.
 *
 * data-track-location / data-plan name the button for analytics and tests;
 * the click itself is recorded by trackPlanSelect below.
 */
export default function PlanButton({
  planKey,
  dark,
  variant,
  location = 'pricing_page',
}: {
  planKey: BookablePlanKey;
  dark?: boolean;
  variant?: 'primary' | 'secondary';
  location?: string;
}) {
  const [open, setOpen] = useState(0);
  const primary = variant ? variant === 'primary' : dark === true;
  return (
    <>
      <button
        type="button"
        data-cursor-hover
        data-plan={planKey}
        data-track-location={`${location}_plan_${planKey}`}
        className={`plan-btn${primary ? ' plan-btn-primary' : ''}`}
        onClick={() => { trackPlanSelect(planKey, location); setOpen((n) => n + 1); }}
      >
        <span>{LABEL[planKey]}</span>
        <svg className="plan-btn-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M5 12h14M13 6l6 6-6 6" />
        </svg>
      </button>
      {open > 0 && <PlanIntakeModal key={open} initialPlan={planKey} onClose={() => setOpen(0)} />}
      <style>{`
        .plan-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px;
          width: 100%; min-height: 48px; padding: 0 24px; border-radius: 999px;
          cursor: pointer; touch-action: manipulation;
          font: 600 15px/1 var(--font-inter), Inter, system-ui, sans-serif; letter-spacing: -0.005em;
          background: transparent; color: #0C0C0B; border: 1px solid rgba(12,12,11,0.28);
          transition: background-color .2s ease, border-color .2s ease, color .2s ease;
        }
        .plan-btn-arrow { transition: transform .2s ease; }
        .plan-btn:hover { background: #0C0C0B; border-color: #0C0C0B; color: #F2EEE7; }
        .plan-btn:hover .plan-btn-arrow { transform: translateX(2px); }
        .plan-btn-primary { background: #E8541A; border-color: #E8541A; color: #fff; }
        .plan-btn-primary:hover { background: #D14812; border-color: #D14812; color: #fff; }
        .plan-btn:focus-visible { outline: 2px solid #0C0C0B; outline-offset: 3px; }
        @media (prefers-reduced-motion: reduce) { .plan-btn, .plan-btn-arrow { transition: none; } }
      `}</style>
    </>
  );
}
