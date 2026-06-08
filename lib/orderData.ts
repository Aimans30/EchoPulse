// Single source of truth for the custom ordering system.
//
// Powers:
//   * components/OrderFlow.tsx — the /order page itself
//   * lib/orderTotal.ts (future) — server-side price recompute when
//     the checkout webhook fires, so the client can't tamper with totals
//   * Pricing.tsx — the "Order a Custom Edit" promo card pulls
//     "starting at" prices from here so they never drift out of sync
//
// PHASE 1 (this file + UI): everything below is read-only — pricing,
// deliverables, turnaround. PHASE 2 (backend): /api/checkout will read this
// same module and recompute the total from the order shape it receives.

export type TierId = 'essential' | 'signature' | 'elite';

export type Deliverable = string;

// ── Sample showcase ───────────────────────────────────────────────────────
// Per-tier video samples shown when the buyer clicks "See samples" on a
// tier card. Mirrors the Cloudinary pattern used by components/OurWork.tsx.
//
// To add a sample: upload to Cloudinary at the path implied by `publicId`
// (e.g. `echopulse/samples/reels-elite-real-estate`), then drop a row here.
// `orientation` decides whether the player renders 9:16 (vertical, reels /
// shorts) or 16:9 (horizontal, long-form / podcast). The carousel handles
// either gracefully.
export interface SampleVideo {
  id: string;
  publicId: string;       // Cloudinary public ID, e.g. 'echopulse/samples/foo'
  brand: string;          // Client / channel name shown as caption
  label: string;          // Short descriptor — "Real Estate Reel", "SaaS Vlog"
  orientation: 'vertical' | 'horizontal';
}

export const CLOUDINARY_CLOUD = 'echopulse';  // matches OurWork.tsx

export function cloudinaryUrl(publicId: string, kind: 'mp4' | 'thumb' = 'mp4', orientation: 'vertical' | 'horizontal' = 'vertical'): string {
  const base = `https://res.cloudinary.com/${CLOUDINARY_CLOUD}`;
  // Width tuned per orientation — same logic as OurWork to keep previews crisp
  // on phones without blowing the bundle size.
  const w = orientation === 'vertical' ? 700 : 1500;
  if (kind === 'thumb') {
    return `${base}/video/upload/c_scale,w_${w},so_1/${publicId}.jpg`;
  }
  return `${base}/video/upload/c_scale,w_${w}/${publicId}.mp4`;
}

export interface ReelsService {
  id: 'reels';
  name: 'Reels & Shorts';
  blurb: string;
  startingAt: number;
  turnaround: string;
  /**
   * Service-level delivery promise in HOURS — used by the order pipeline to
   * compute the Asana due_at on each order and to label the buyer-facing
   * "Estimated delivery" in step 4 of OrderFlow.
   */
  deliveryHours: number;
  tiers: {
    id: TierId;
    name: string;
    price: number;
    /**
     * Maximum quantity of this tier the buyer can put on a single order.
     * Cheaper tiers allow stacking (a creator might order 10 Essentials);
     * the premium tier is 1-per-order so production attention stays focused.
     */
    maxQuantity: number;
    deliverables: Deliverable[];
    samples: SampleVideo[];
  }[];
}

export interface LongformService {
  id: 'longform';
  name: 'Long-form YouTube';
  blurb: string;
  startingAt: number;
  turnaround: string;
  durations: { id: '10' | '15' | '30'; label: string }[];
  // Price matrix is duration → tier
  tiers: {
    id: TierId;
    name: string;
    /**
     * Per-tier delivery promise in DAYS. Long-form takes longer for the
     * cinematic/Elite cut because of motion graphics + finishing passes.
     */
    deliveryDays: number;
    deliverables: Deliverable[];
    pricing: Record<'10' | '15' | '30', number>;
    samples: SampleVideo[];
  }[];
}

export interface PodcastService {
  id: 'podcast';
  name: 'Podcast Editing';
  blurb: string;
  startingAt: number;
  turnaround: string;
  /** Service-level delivery promise in DAYS (no tier breakdown). */
  deliveryDays: number;
  base: { name: string; price: number; deliverables: Deliverable[] };
  addons: { id: 'trailer' | 'clips' | 'bundle'; name: string; price: number; saves?: number; replaces?: string[] }[];
  samples: SampleVideo[];
}

export interface RepurposeService {
  id: 'repurpose';
  name: 'Repurpose Existing Content';
  blurb: string;
  startingAt: number;
  turnaround: string;
  /** Service-level delivery promise in DAYS (no tier breakdown). */
  deliveryDays: number;
  fixed: { name: string; price: number; deliverables: Deliverable[] };
  samples: SampleVideo[];
}

export type ServiceData = ReelsService | LongformService | PodcastService | RepurposeService;

export const services: ServiceData[] = [
  {
    id: 'reels',
    name: 'Reels & Shorts',
    blurb: 'Vertical edits up to 60 seconds. Reels, TikToks, Shorts, listing cuts.',
    startingAt: 15,
    turnaround: '48 hours',
    deliveryHours: 48,
    tiers: [
      {
        id: 'essential',
        name: 'Essential',
        price: 15,
        // Cheapest tier — buyer can stack up to 10 in one order. The 48-hour
        // clock is per-order (not per-clip), so production batches them.
        maxQuantity: 10,
        deliverables: [
          'Clean cut from your raw footage',
          'Tasteful background music',
          'Hard-burned captions',
          'Scroll-stopping hook + caption',
          'Optimized description copy',
        ],
        // To add a sample: upload to Cloudinary as e.g.
        // `echopulse/samples/reels-essential-01` then push a row here.
        samples: [],
      },
      {
        id: 'signature',
        name: 'Signature',
        price: 80,
        // Mid tier — up to 4 per order keeps quality high while still bundling.
        maxQuantity: 4,
        deliverables: [
          'Everything in Essential',
          'B-roll layered for pacing',
          'Motion graphics + lower thirds',
          'Sound design + SFX',
          'Color grade for mood',
        ],
        samples: [],
      },
      {
        id: 'elite',
        name: 'Elite',
        price: 100,
        // Premium tier — strictly 1 per order so attention stays focused.
        maxQuantity: 1,
        deliverables: [
          'Everything in Signature',
          'Heavy motion graphics + transitions',
          'Animated captions + kinetic type',
          'Premium VFX + finishing pass',
        ],
        samples: [],
      },
    ],
  },

  {
    id: 'longform',
    name: 'Long-form YouTube',
    blurb: 'YouTube long-form, vlogs, educational, sponsored, and brand-film edits.',
    startingAt: 49,
    // Service-level surface label — tiers below break down per-tier days.
    turnaround: '3 to 5 days',
    durations: [
      { id: '10', label: '10 minutes' },
      { id: '15', label: '15 minutes' },
      { id: '30', label: '30 minutes' },
    ],
    tiers: [
      {
        id: 'essential',
        name: 'Essential',
        // 3-day cut — clean retention edit without heavy graphics.
        deliveryDays: 3,
        deliverables: [
          'Clean retention-first cut',
          'Background music + chapter markers',
          'Hard-burned captions',
        ],
        pricing: { '10': 49, '15': 69, '30': 99 },
        samples: [],
      },
      {
        id: 'signature',
        name: 'Signature',
        // 3-day cut — graphics + sound design layered, still on the fast lane.
        deliveryDays: 3,
        deliverables: [
          'B-roll integrated for pacing',
          'Motion graphics + lower thirds',
          'Sound design + SFX',
          'Cinematic color grade',
        ],
        pricing: { '10': 149, '15': 199, '30': 299 },
        samples: [],
      },
      {
        id: 'elite',
        name: 'Elite',
        // 5-day cut — broadcast-grade finishing needs the extra time.
        deliveryDays: 5,
        deliverables: [
          'Full broadcast-grade production',
          'Heavy motion graphics + transitions',
          'Animated captions + kinetic type',
          'Premium color grade + finishing',
        ],
        pricing: { '10': 349, '15': 499, '30': 749 },
        samples: [],
      },
    ],
  },

  {
    id: 'podcast',
    name: 'Podcast Editing',
    blurb: 'Full episodes up to 2 hours. Multicam, color, studio-grade audio.',
    startingAt: 450,
    turnaround: '4 days',
    deliveryDays: 4,
    base: {
      name: 'Full episode edit',
      price: 450,
      deliverables: [
        'Up to 2-hour episode',
        'Multicam intercut + framing',
        'Cinematic color grade',
        'Studio-grade audio cleanup + leveling',
        'Chapter markers + intro / outro polish',
      ],
    },
    addons: [
      // Note: bundle "replaces" trailer + clips so the UI knows to deselect them
      // if the user picks Bundle, and to recommend Bundle when both are picked.
      { id: 'trailer', name: 'Episode trailer', price: 99 },
      { id: 'clips',   name: 'Up to 14 short-form clips', price: 249 },
      { id: 'bundle',  name: 'Trailer + 14 clips (bundle)', price: 299, saves: 49, replaces: ['trailer', 'clips'] },
    ],
    samples: [],
  },

  {
    id: 'repurpose',
    name: 'Repurpose Existing Content',
    blurb: 'Send any long-form footage. We deliver 15 short-form cuts engineered for reach.',
    startingAt: 349,
    turnaround: '3 days',
    deliveryDays: 3,
    fixed: {
      name: 'Repurpose pack',
      price: 349,
      deliverables: [
        'Up to 15 hook-engineered short-form cuts',
        'Optimized for retention and reach',
        'Captions burned in, mobile-first framing',
        'Multi-platform exports (Reels / TikTok / Shorts)',
        'Delivered ready-to-publish',
      ],
    },
    samples: [],
  },
];

// Quick accessor used by Pricing.tsx so the "starting at" banner price never
// drifts from the truth here.
export function getCheapestStartingPrice(): number {
  return Math.min(...services.map(s => s.startingAt));
}

// ── Order shape ────────────────────────────────────────────────────────────
// What the client builds up while moving through the flow. Passed to the
// checkout API in Phase 2.

export type OrderSelection =
  // Reels: buyer picks tier AND quantity (capped by tier.maxQuantity).
  | { serviceId: 'reels'; tier: TierId; quantity: number }
  | { serviceId: 'longform'; tier: TierId; duration: '10' | '15' | '30' }
  | { serviceId: 'podcast'; addons: ('trailer' | 'clips' | 'bundle')[] }
  | { serviceId: 'repurpose' };

// Convenience accessor — returns the maxQuantity for a given Reels tier.
// Used by the OrderFlow stepper to clamp at the tier ceiling.
export function getReelsTierMaxQuantity(tierId: TierId): number {
  const svc = services.find(s => s.id === 'reels') as ReelsService;
  return svc.tiers.find(t => t.id === tierId)?.maxQuantity ?? 1;
}

export interface ClientDetails {
  // ── Required ──
  fullName: string;
  email: string;
  fileLink: string;       // Google Drive / Dropbox link to footage

  // ── Optional context ──
  brand: string;
  niche: string;
  // Optional direct line — phone (WhatsApp-compatible) so we can ping the
  // client instantly for blocking questions during the edit. Never used for
  // marketing; clearly labeled optional in the form.
  phone: string;

  // ── Optional project direction (NEW) ──
  // All three fields below are 100% optional. The form section that holds
  // them ("Your direction") is explicitly labeled optional so clients can
  // skip ahead without friction. They exist because better briefs produce
  // better edits — and because clients often want to share these things
  // but didn't realize they could.
  inspiration: string;    // Links to videos/edits they want their work to feel like
  brandAssets: string;    // Logo, brand colors, brand guide, hex codes — pasted or linked
  editDirection: string;  // Free-form: how they want the edit to feel
}

// Default empty client object — used to initialize the form. Helps avoid
// scattering empty strings across the component.
export const emptyClient: ClientDetails = {
  fullName: '',
  email: '',
  fileLink: '',
  brand: '',
  niche: '',
  phone: '',
  inspiration: '',
  brandAssets: '',
  editDirection: '',
};

export interface Order {
  selection: OrderSelection;
  client: ClientDetails;
  total: number;
  createdAt: string;
}

// ── Delivery promise ───────────────────────────────────────────────────────
// Resolve the order's full delivery promise (in HOURS) from the selection.
// The same value powers Asana's due_at clock, the Slack "starts now" copy,
// and the buyer-facing "Estimated delivery" line in step 4 of the form.
//
//   Reels      → service-level deliveryHours (48h flat)
//   Longform   → tier-level deliveryDays (Essential/Signature 3d, Elite 5d)
//   Podcast    → service-level deliveryDays (4d)
//   Repurpose  → service-level deliveryDays (3d)
export function getDeliveryHours(selection: OrderSelection): number {
  switch (selection.serviceId) {
    case 'reels': {
      const svc = services.find(s => s.id === 'reels') as ReelsService;
      return svc.deliveryHours;
    }
    case 'longform': {
      const svc = services.find(s => s.id === 'longform') as LongformService;
      const tier = svc.tiers.find(t => t.id === selection.tier);
      return (tier?.deliveryDays ?? 5) * 24;
    }
    case 'podcast': {
      const svc = services.find(s => s.id === 'podcast') as PodcastService;
      return svc.deliveryDays * 24;
    }
    case 'repurpose': {
      const svc = services.find(s => s.id === 'repurpose') as RepurposeService;
      return svc.deliveryDays * 24;
    }
  }
}

// Human-friendly label — used in Slack/Asana copy + the OrderFlow review step.
//   48  → "48 hours"
//   72  → "3 days"
//   120 → "5 days"
export function getDeliveryLabel(selection: OrderSelection): string {
  const hours = getDeliveryHours(selection);
  if (hours < 72) return `${hours} hours`;
  return `${Math.round(hours / 24)} days`;
}

// ── Pure pricing function ─────────────────────────────────────────────────
// Used by both the UI (to render live total) and the server (Phase 2, to
// re-verify the price before charging — never trust the client's total).
export function computeTotal(selection: OrderSelection): number {
  switch (selection.serviceId) {
    case 'reels': {
      const svc = services.find(s => s.id === 'reels') as ReelsService;
      const tier = svc.tiers.find(t => t.id === selection.tier);
      // Clamp quantity to [1 .. tier.maxQuantity] before charging.
      const max = tier?.maxQuantity ?? 1;
      const qty = Math.max(1, Math.min(max, selection.quantity ?? 1));
      return (tier?.price ?? 0) * qty;
    }
    case 'longform': {
      const svc = services.find(s => s.id === 'longform') as LongformService;
      const tier = svc.tiers.find(t => t.id === selection.tier);
      return tier?.pricing[selection.duration] ?? 0;
    }
    case 'podcast': {
      const svc = services.find(s => s.id === 'podcast') as PodcastService;
      let total = svc.base.price;
      if (selection.addons.includes('bundle')) {
        const bundle = svc.addons.find(a => a.id === 'bundle');
        total += bundle?.price ?? 0;
      } else {
        for (const addonId of selection.addons) {
          const a = svc.addons.find(x => x.id === addonId);
          if (a && a.id !== 'bundle') total += a.price;
        }
      }
      return total;
    }
    case 'repurpose': {
      const svc = services.find(s => s.id === 'repurpose') as RepurposeService;
      return svc.fixed.price;
    }
  }
}
