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
 */
export default function PlanButton({ planKey, dark }: { planKey: BookablePlanKey; dark?: boolean }) {
  const [open, setOpen] = useState(0);
  return (
    <>
      <button
        type="button"
        data-cursor-hover
        className={`plan-btn${dark ? ' plan-btn-dark' : ''}`}
        onClick={() => { trackPlanSelect(planKey, 'pricing_page'); setOpen((n) => n + 1); }}
      >
        {LABEL[planKey]} <span aria-hidden="true">&rarr;</span>
      </button>
      {open > 0 && <PlanIntakeModal key={open} initialPlan={planKey} onClose={() => setOpen(0)} />}
      <style>{`
        .plan-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 8px; width: 100%; min-height: 50px;
          padding: 0 22px; border-radius: 100px; cursor: pointer; font: 700 14.5px Inter, sans-serif;
          background: #0C0C0B; color: #F2EEE7; border: 1px solid #0C0C0B;
          transition: background .2s ease, border-color .2s ease, transform .15s ease;
        }
        .plan-btn:hover { background: #E8541A; border-color: #E8541A; transform: translateY(-1px); }
        .plan-btn-dark { background: #E8541A; border-color: #E8541A; color: #fff; }
        .plan-btn-dark:hover { background: #FF6A2B; border-color: #FF6A2B; }
        .plan-btn:focus-visible { outline: 3px solid #E8541A; outline-offset: 3px; }
        @media (prefers-reduced-motion: reduce) { .plan-btn { transition: none; } }
      `}</style>
    </>
  );
}
