'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Film,
  Youtube,
  Mic,
  Repeat,
  Check,
  ArrowLeft,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import {
  services,
  computeTotal,
  emptyClient,
  getReelsTierMaxQuantity,
  getDeliveryHours,
  getDeliveryLabel,
  type ServiceData,
  type TierId,
  type OrderSelection,
  type ReelsService,
  type LongformService,
  type PodcastService,
  type RepurposeService,
  type ClientDetails,
} from '@/lib/orderData';
import { useGeoPrice, localizeOrderPrice } from '@/lib/useGeoPrice';

/**
 * Tiny hook — returns a memoized formatter that converts a USD-anchored
 * number into the local sales-friendly string ($15 / ₹1,499 / £14 / CHF 19).
 * Wraps localizeOrderPrice with current region/country so every sub-component
 * gets consistent formatting without re-running geo detection.
 */
function useFmtPrice() {
  const { region, country } = useGeoPrice();
  return useMemo(() => {
    return {
      display: (usd: number) => localizeOrderPrice(usd, region, country).display,
      raw: (usd: number) => localizeOrderPrice(usd, region, country).raw,
      currency: localizeOrderPrice(0, region, country).currency,
    };
  }, [region, country]);
}

// ── Step model ────────────────────────────────────────────────────────────
type Step = 1 | 2 | 3 | 4;
const STEP_LABELS: Record<Step, string> = {
  1: 'Pick a service',
  2: 'Configure',
  3: 'Your details',
  4: 'Review & checkout',
};

// Per-service icon used on step 1's selection cards
const SERVICE_ICONS: Record<string, LucideIcon> = {
  reels: Film,
  longform: Youtube,
  podcast: Mic,
  repurpose: Repeat,
};

// ── Component ──────────────────────────────────────────────────────────────
export default function OrderFlow() {
  const [step, setStep] = useState<Step>(1);
  const [serviceId, setServiceId] = useState<ServiceData['id'] | null>(null);

  // Service-specific config — only the field for the active service is read
  const [reelsTier, setReelsTier] = useState<TierId>('signature');
  // Quantity stepper for Reels (Essential: 10 max, Signature: 4 max, Elite: 1 max).
  // When the buyer switches tier, the effect below clamps the quantity to that
  // tier's ceiling so we never overcharge or send an over-cap order to production.
  const [reelsQuantity, setReelsQuantity] = useState<number>(1);
  useEffect(() => {
    const max = getReelsTierMaxQuantity(reelsTier);
    setReelsQuantity(q => Math.max(1, Math.min(max, q)));
  }, [reelsTier]);
  const [longTier, setLongTier] = useState<TierId>('signature');
  const [longDuration, setLongDuration] = useState<'10' | '15' | '30'>('15');
  const [podcastAddons, setPodcastAddons] = useState<('trailer' | 'clips' | 'bundle')[]>([]);

  const [client, setClient] = useState<ClientDetails>(emptyClient);

  // Geo-aware price formatter — every USD anchor flows through this so a
  // user in India sees ₹X,XXX, US sees $X, Zurich sees CHF X (with premium).
  const fmt = useFmtPrice();
  // Region + country pulled out so the sub-blocks below (StepPickService
  // cards, Step 4 review, etc.) can call localizeOrderPrice() directly
  // without redoing the hook.
  const { region: geoRegion, country: geoCountry } = useGeoPrice();
  const region = geoRegion;
  const country = geoCountry;

  // Hide the custom dot/ring cursor only while the mouse is HOVERING an
  // input/textarea — not while it merely has focus. Earlier behavior used
  // focus events, which left the cursor hidden everywhere on the page once
  // a field was focused (even when the mouse left the field). The fix is
  // to track hover via pointerover/pointerout so the brand cursor returns
  // the moment the mouse leaves the input.
  useEffect(() => {
    const isFormField = (t: EventTarget | null) => {
      const el = t as HTMLElement | null;
      return !!el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA');
    };
    const onPointerOver = (e: PointerEvent) => {
      if (isFormField(e.target)) document.body.classList.add('orderflow-input-focused');
    };
    const onPointerOut = (e: PointerEvent) => {
      if (isFormField(e.target)) document.body.classList.remove('orderflow-input-focused');
    };
    document.addEventListener('pointerover', onPointerOver, { passive: true });
    document.addEventListener('pointerout', onPointerOut, { passive: true });
    return () => {
      document.removeEventListener('pointerover', onPointerOver);
      document.removeEventListener('pointerout', onPointerOut);
      document.body.classList.remove('orderflow-input-focused');
    };
  }, []);

  // ── Derived: current selection + total ──────────────────────────────────
  const selection: OrderSelection | null = useMemo(() => {
    if (!serviceId) return null;
    if (serviceId === 'reels') return { serviceId: 'reels', tier: reelsTier, quantity: reelsQuantity };
    if (serviceId === 'longform') return { serviceId: 'longform', tier: longTier, duration: longDuration };
    if (serviceId === 'podcast') return { serviceId: 'podcast', addons: podcastAddons };
    if (serviceId === 'repurpose') return { serviceId: 'repurpose' };
    return null;
  }, [serviceId, reelsTier, reelsQuantity, longTier, longDuration, podcastAddons]);

  const total = useMemo(() => (selection ? computeTotal(selection) : 0), [selection]);

  const service = useMemo<ServiceData | null>(
    () => services.find(s => s.id === serviceId) ?? null,
    [serviceId]
  );

  /**
   * Region-aware running total.
   *
   * We do NOT localize the USD `total` — that would compress non-linearly
   * for India (e.g. $30 of two $15 reels would map to ₹1,499 even though
   * each reel reads as ₹1,199). Instead we localize PER LINE ITEM, then
   * sum in the LOCAL currency. That guarantees the side-panel total
   * always equals (visible unit price × quantity) for every region.
   *
   * For US/OTHER the math is identical to `total` USD; for IN/UK/EU/CA
   * it produces a clean, multiply-friendly figure.
   */
  const localizedTotal = useMemo<{ display: string; raw: number; currencyCode: string }>(() => {
    if (!selection || !service) {
      return { display: fmt.display(0), raw: 0, currencyCode: 'USD' };
    }

    // Sum localized line items in local currency
    let rawSum = 0;
    let currencyPrefix = '$';
    let currencyCode: string = 'USD';

    const add = (usd: number, qty = 1) => {
      const p = localizeOrderPrice(usd, region, country);
      rawSum += p.raw * qty;
      currencyPrefix = p.currency;
      currencyCode = p.currencyCode;
    };

    switch (selection.serviceId) {
      case 'reels': {
        const svc = service as Extract<ServiceData, { id: 'reels' }>;
        const tier = svc.tiers.find(t => t.id === selection.tier);
        const max = tier?.maxQuantity ?? 1;
        const qty = Math.max(1, Math.min(max, selection.quantity ?? 1));
        add(tier?.price ?? 0, qty);
        break;
      }
      case 'longform': {
        const svc = service as Extract<ServiceData, { id: 'longform' }>;
        const tier = svc.tiers.find(t => t.id === selection.tier);
        add(tier?.pricing[selection.duration] ?? 0);
        break;
      }
      case 'podcast': {
        const svc = service as Extract<ServiceData, { id: 'podcast' }>;
        add(svc.base.price);
        if (selection.addons.includes('bundle')) {
          const bundle = svc.addons.find(a => a.id === 'bundle');
          if (bundle) add(bundle.price);
        } else {
          for (const addonId of selection.addons) {
            const a = svc.addons.find(x => x.id === addonId);
            if (a && a.id !== 'bundle') add(a.price);
          }
        }
        break;
      }
      case 'repurpose': {
        const svc = service as Extract<ServiceData, { id: 'repurpose' }>;
        add(svc.fixed.price);
        break;
      }
    }

    // Re-format the summed raw in the local currency style. The INR branch
    // (lakh-grouped en-IN formatting) was removed with the India rate card.
    const display = `${currencyPrefix}${rawSum}`;

    return { display, raw: rawSum, currencyCode };
  }, [selection, service, region, country, fmt]);

  // ── Validation per step ────────────────────────────────────────────────
  const canContinue = useMemo(() => {
    if (step === 1) return serviceId !== null;
    if (step === 2) return selection !== null;
    if (step === 3) {
      return (
        client.fullName.trim().length > 1 &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email) &&
        client.fileLink.trim().length > 5
      );
    }
    return true;
  }, [step, serviceId, selection, client]);

  const onNext = () => setStep(s => (Math.min(4, s + 1) as Step));
  const onBack = () => setStep(s => (Math.max(1, s - 1) as Step));

  // Real submit — Dodo Payments hosted checkout.
  //
  //   1. POST /api/dodo/checkout → server creates the session, returns paymentLink
  //   2. Redirect to Dodo's hosted page
  //   3. On success Dodo bounces back to /onboard?from=dodo
  //   4. /api/dodo/webhook fires server-side → Asana order card + Slack #orders
  //
  // The Razorpay flow that used to live here (India / INR only) was removed
  // with the India rate card in July 2026, along with its checkout.js loader.
  //
  // Clicking "Proceed" is the recorded act of agreement to /terms (the same
  // implicit-acceptance pattern Stripe/Amazon/Shopify use everywhere).
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onCheckout = async () => {
    if (!service || !selection) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      // Build a human-readable service descriptor for the Asana card title
      let serviceLabel: string = service.name;
      let tier: string | undefined;
      if (selection.serviceId === 'reels') {
        // Include the quantity in the label so production sees "× 5" at a glance.
        const qty = selection.quantity ?? 1;
        const qtySuffix = qty > 1 ? ` × ${qty}` : '';
        serviceLabel = `Reels · ${selection.tier}${qtySuffix}`;
        tier = selection.tier;
      }
      else if (selection.serviceId === 'longform') { serviceLabel = `Long-form · ${selection.tier} · ${selection.duration}m`; tier = selection.tier; }
      else if (selection.serviceId === 'podcast') { serviceLabel = `Podcast${selection.addons.length ? ` + ${selection.addons.join(', ')}` : ''}`; }
      else if (selection.serviceId === 'repurpose') { serviceLabel = 'Repurpose pack'; }

      // Resolve the order's delivery promise from the selection — drives the
      // 48h / 3d / 4d / 5d Asana due_at clock + the "starts now" Slack copy.
      const deliveryHours = getDeliveryHours(selection);
      const deliveryLabel = getDeliveryLabel(selection);

      // ─────────────────────────────────────────────────────────────────
      // PAYMENT — Dodo Payments hosted checkout, for everyone.
      //
      // There used to be a gateway router here: region 'IN' went to Razorpay
      // (INR-only), everyone else to Dodo. The India rate card was removed in
      // July 2026, so there is no INR flow left to route to and every buyer is
      // charged in a Dodo-supported currency (USD/EUR/GBP/CAD/AUD).
      //
      // The Razorpay API routes (/api/razorpay/*) still exist but nothing calls
      // them. Delete them once you're sure the INR rail isn't coming back.
      // ─────────────────────────────────────────────────────────────────
      const dodoRes = await fetch('/api/dodo/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Charge the LOCALIZED, SUMMED amount — what the right-side TOTAL
          // shows. Built by summing line-item-localized values so per-unit ×
          // quantity always equals the running total in the local currency.
          amountSmallest: Math.round(localizedTotal.raw * 100),
          currency: localizedTotal.currencyCode,           // USD / EUR / GBP / CAD / AUD
          service: serviceLabel,
          tier,
          client: {
            fullName: client.fullName,
            email: client.email,
            country: country ?? undefined,
          },
          returnUrl: `${window.location.origin}/onboard?from=dodo&service=${encodeURIComponent(serviceLabel)}`,
          cancelUrl: `${window.location.origin}/order?cancelled=1`,
          metadata: {
            deliveryHours: String(deliveryHours),
            deliveryLabel,
            fileLink: client.fileLink ?? '',
          },
        }),
      });
      const dodoData = await dodoRes.json().catch(() => ({ ok: false }));
      if (!dodoRes.ok || !dodoData.ok || !dodoData.paymentLink) {
        throw new Error(dodoData.error ?? 'Could not start checkout. Please try again or email lakshya@echopulse.media.');
      }
      // Redirect to Dodo's hosted payment page. After success they bounce
      // back to /onboard?from=dodo, and the Asana+Slack pipeline fires
      // server-side from the Dodo webhook → /api/dodo/webhook.
      window.location.href = dodoData.paymentLink;
      return;
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong.');
      setSubmitting(false);
    }
  };

  return (
    <section
      data-dark-bg="true"
      className="orderflow-section"
      style={{
        background: 'linear-gradient(180deg, #0C0C0B 0%, #100d09 60%, #160e07 100%)',
        minHeight: '100vh',
        padding: '128px 56px 96px',
        color: '#F2EEE7',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '600px', height: '600px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,84,26,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />
      </div>

      <div className="orderflow-wrap" style={{ maxWidth: '1180px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* Header */}
        <div className="orderflow-head" style={{ marginBottom: '32px' }}>
          <Link href="/#pricing" data-cursor-hover style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '12px', fontWeight: 600, color: 'rgba(242,238,231,0.55)',
            textDecoration: 'none', marginBottom: '20px',
            transition: 'color 0.2s',
          }}>
            <ArrowLeft size={14} strokeWidth={2.4} />
            Back to retainer plans
          </Link>
          <div style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '4px',
            textTransform: 'uppercase', color: 'rgba(232,84,26,0.85)',
            marginBottom: '12px',
          }}>
            À la carte studio
          </div>
          <h1 className="orderflow-h1" style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(32px, 4.4vw, 56px)',
            fontWeight: 900,
            letterSpacing: '-1.6px',
            lineHeight: 1.04,
            margin: 0,
          }}>
            Commission a single edit.<br />
            <span style={{ color: '#E8541A' }}>On your terms.</span>
          </h1>
          <p className="orderflow-sub" style={{
            marginTop: '14px',
            fontSize: '15px',
            color: 'rgba(242,238,231,0.55)',
            maxWidth: '620px',
            lineHeight: 1.6,
          }}>
            No retainer. No contract. Choose the format, select a production tier, send a Drive link to your footage. We deliver within turnaround. See real work at each tier before you commit.
          </p>
        </div>

        {/* Progress bar */}
        <ProgressBar step={step} />

        {/* Main grid — left: step content, right: sticky order summary */}
        <div className="orderflow-grid" style={{
          display: 'grid',
          gridTemplateColumns: '1fr 360px',
          gap: '32px',
          alignItems: 'start',
          marginTop: '40px',
        }}>
          {/* LEFT — step content */}
          <div className="orderflow-main">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="s1" {...stepMotion}>
                  <StepService onPick={(id) => { setServiceId(id); setStep(2); }} active={serviceId} />
                </motion.div>
              )}
              {step === 2 && service && (
                <motion.div key="s2" {...stepMotion}>
                  <StepConfigure
                    service={service}
                    reelsTier={reelsTier} setReelsTier={setReelsTier}
                    reelsQuantity={reelsQuantity} setReelsQuantity={setReelsQuantity}
                    longTier={longTier} setLongTier={setLongTier}
                    longDuration={longDuration} setLongDuration={setLongDuration}
                    podcastAddons={podcastAddons} setPodcastAddons={setPodcastAddons}
                  />
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="s3" {...stepMotion}>
                  <StepDetails client={client} setClient={setClient} />
                </motion.div>
              )}
              {step === 4 && service && selection && (
                <motion.div key="s4" {...stepMotion}>
                  <StepReview
                    service={service}
                    selection={selection}
                    client={client}
                  />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Step nav buttons */}
            <div className="orderflow-nav" style={{
              marginTop: '32px',
              display: 'flex',
              gap: '12px',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
              <button
                type="button"
                onClick={onBack}
                disabled={step === 1}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(255,255,255,0.14)',
                  color: step === 1 ? 'rgba(242,238,231,0.25)' : '#F2EEE7',
                  padding: '12px 22px',
                  borderRadius: '100px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: step === 1 ? 'not-allowed' : 'pointer',
                  fontFamily: 'Inter, sans-serif',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  minHeight: '44px',
                  opacity: step === 1 ? 0.4 : 1,
                  transition: 'all 0.2s',
                }}
              >
                <ArrowLeft size={14} />
                Back
              </button>

              {step < 4 ? (
                <button
                  type="button"
                  onClick={onNext}
                  disabled={!canContinue}
                  style={{
                    background: canContinue ? '#E8541A' : 'rgba(232,84,26,0.3)',
                    border: 'none',
                    color: '#fff',
                    padding: '13px 28px',
                    borderRadius: '100px',
                    fontSize: '13px',
                    fontWeight: 700,
                    cursor: canContinue ? 'pointer' : 'not-allowed',
                    fontFamily: 'Inter, sans-serif',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    minHeight: '44px',
                    boxShadow: canContinue ? '0 6px 24px rgba(232,84,26,0.35)' : 'none',
                    transition: 'all 0.2s',
                  }}
                >
                  Continue
                  <ArrowRight size={14} strokeWidth={2.4} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onCheckout}
                  disabled={submitting}
                  style={{
                    background: submitting ? 'rgba(232,84,26,0.55)' : '#E8541A',
                    border: 'none',
                    color: '#fff',
                    cursor: submitting ? 'wait' : 'pointer',
                    padding: '14px 32px',
                    borderRadius: '100px',
                    fontSize: '13px',
                    fontWeight: 700,
                    fontFamily: 'Inter, sans-serif',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    minHeight: '48px',
                    boxShadow: '0 8px 32px rgba(232,84,26,0.42)',
                    transition: 'all 0.2s',
                  }}
                >
                  {submitting ? 'Sending order…' : `Proceed · ${localizedTotal.display}`}
                  {!submitting && <ArrowRight size={14} strokeWidth={2.4} />}
                </button>
              )}
            </div>
            {submitError && (
              <div role="alert" style={{ marginTop: 12, padding: '10px 14px', background: 'rgba(179,58,58,0.12)', border: '1px solid rgba(179,58,58,0.32)', borderRadius: 10, color: '#FFB3B3', fontSize: 13, lineHeight: 1.5 }}>
                {submitError}
              </div>
            )}
          </div>

          {/* RIGHT — order summary sidebar (sticks on desktop, collapses to bottom card on mobile) */}
          <OrderSummary
            service={service}
            selection={selection}
            totalDisplay={localizedTotal.display}
            step={step}
          />
        </div>
      </div>

      <style>{`
        .orderflow-section a:hover { color: #F2EEE7 !important; }

        /* ── Cursor handling on the order page ──────────────────────────
           The site uses a custom dot/ring cursor (.cursor-dot + .cursor-ring).
           That cursor is great over hero buttons, terrible when the user is
           trying to type into a form field — the orange dot sits on top of
           the text caret and feels broken. So:
             1. Force the standard text caret on every input + textarea
             2. Hide the custom cursor while the user is focused inside a
                form input (we add the orderflow-input-focused class to body
                via JS focus/blur hooks below)
           Buttons and links elsewhere on the page still get the orange
           hover treatment because Cursor.tsx scans for them via
           data-cursor-hover / <a> / <button>. */
        .orderflow-section input,
        .orderflow-section textarea {
          cursor: text !important;
          caret-color: #E8541A;
        }
        body.orderflow-input-focused .cursor-dot,
        body.orderflow-input-focused .cursor-ring {
          opacity: 0 !important;
        }

        @media (max-width: 960px) {
          .orderflow-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 640px) {
          .orderflow-section { padding: 88px 18px 64px !important; }
          .orderflow-h1 { font-size: 28px !important; letter-spacing: -1px !important; }
          .orderflow-sub { font-size: 14px !important; }
          .orderflow-nav button { padding: 12px 18px !important; font-size: 12.5px !important; }
        }
      `}</style>
    </section>
  );
}

// ── Shared motion preset ──────────────────────────────────────────────────
const stepMotion = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
};

// ── Progress bar ──────────────────────────────────────────────────────────
function ProgressBar({ step }: { step: Step }) {
  return (
    <div className="orderflow-progress" style={{
      display: 'flex', alignItems: 'center', gap: '12px',
      padding: '14px 22px',
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '100px',
      flexWrap: 'wrap',
    }}>
      {([1, 2, 3, 4] as Step[]).map((s) => {
        const isActive = step === s;
        const isDone = step > s;
        return (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: '0 0 auto' }}>
            <div style={{
              width: '24px', height: '24px',
              borderRadius: '50%',
              background: isActive ? '#E8541A' : isDone ? 'rgba(232,84,26,0.25)' : 'rgba(255,255,255,0.06)',
              border: `1.5px solid ${isActive || isDone ? '#E8541A' : 'rgba(255,255,255,0.12)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '10.5px', fontWeight: 800,
              color: isActive ? '#fff' : isDone ? '#E8541A' : 'rgba(242,238,231,0.5)',
              transition: 'all 0.3s',
              flexShrink: 0,
            }}>
              {isDone ? <Check size={12} strokeWidth={3} /> : s}
            </div>
            <span style={{
              fontSize: '11.5px',
              fontWeight: 700,
              letterSpacing: '0.2px',
              color: isActive ? '#F2EEE7' : isDone ? 'rgba(242,238,231,0.7)' : 'rgba(242,238,231,0.35)',
              whiteSpace: 'nowrap',
            }}>
              {STEP_LABELS[s]}
            </span>
            {s < 4 && (
              <span style={{
                width: '20px', height: '1px',
                background: isDone ? '#E8541A' : 'rgba(255,255,255,0.1)',
                marginLeft: '4px',
                transition: 'background 0.3s',
              }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Step 1: pick a service ────────────────────────────────────────────────
function StepService({ onPick, active }: { onPick: (id: ServiceData['id']) => void; active: ServiceData['id'] | null }) {
  // Geo for the "from ₹X,XXX" starting price on each service card
  const { region, country } = useGeoPrice();
  return (
    <div>
      <SectionTitle eyebrow="Step 1" title="What do you need edited?" />
      <div className="orderflow-svc-grid" style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '14px',
        marginTop: '28px',
      }}>
        {services.map((svc) => {
          const Icon = SERVICE_ICONS[svc.id] ?? Film;
          const isActive = active === svc.id;
          return (
            <button
              key={svc.id}
              type="button"
              onClick={() => onPick(svc.id)}
              style={{
                textAlign: 'left',
                background: isActive ? 'rgba(232,84,26,0.10)' : 'rgba(255,255,255,0.035)',
                border: `1px solid ${isActive ? '#E8541A' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '16px',
                padding: '22px 22px 18px',
                color: '#F2EEE7',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                transition: 'all 0.25s',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.06)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.18)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.035)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
                }
              }}
            >
              <div style={{
                width: '40px', height: '40px',
                borderRadius: '10px',
                background: 'rgba(232,84,26,0.12)',
                border: '1px solid rgba(232,84,26,0.3)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: '14px',
              }}>
                <Icon size={20} color="#E8541A" strokeWidth={1.8} />
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, letterSpacing: '-0.2px', marginBottom: '4px' }}>
                {svc.name}
              </div>
              <div style={{ fontSize: '12.5px', color: 'rgba(242,238,231,0.55)', lineHeight: 1.5, marginBottom: '14px' }}>
                {svc.blurb}
              </div>
              <div style={{
                display: 'inline-flex', alignItems: 'baseline', gap: '4px',
                padding: '4px 10px',
                background: 'rgba(232,84,26,0.12)',
                border: '1px solid rgba(232,84,26,0.28)',
                borderRadius: '100px',
                fontSize: '11px',
                fontWeight: 700,
                color: '#E8541A',
              }}>
                from {localizeOrderPrice(svc.startingAt, region, country).display}
              </div>
            </button>
          );
        })}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .orderflow-svc-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// Shared button style for the +/− steppers inside Step 2 (Reels quantity).
// Pulled out so adding more steppers later (podcast clip-count, repurpose-pack
// count) stays consistent without restyling at each call site.
function qtyBtnStyle(disabled: boolean): React.CSSProperties {
  return {
    width: 36, height: 36, borderRadius: 100,
    border: 'none',
    background: disabled ? 'transparent' : 'rgba(232,84,26,0.18)',
    color: disabled ? 'rgba(242,238,231,0.28)' : '#F2EEE7',
    fontSize: 20, fontWeight: 700, lineHeight: 1,
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Inter, sans-serif',
    transition: 'background 0.18s',
  };
}

// ── Step 2: configure ─────────────────────────────────────────────────────
function StepConfigure({
  service,
  reelsTier, setReelsTier,
  reelsQuantity, setReelsQuantity,
  longTier, setLongTier,
  longDuration, setLongDuration,
  podcastAddons, setPodcastAddons,
}: {
  service: ServiceData;
  reelsTier: TierId; setReelsTier: (t: TierId) => void;
  reelsQuantity: number; setReelsQuantity: (q: number | ((prev: number) => number)) => void;
  longTier: TierId; setLongTier: (t: TierId) => void;
  longDuration: '10' | '15' | '30'; setLongDuration: (d: '10' | '15' | '30') => void;
  podcastAddons: ('trailer' | 'clips' | 'bundle')[]; setPodcastAddons: (a: ('trailer' | 'clips' | 'bundle')[]) => void;
}) {
  // Geo for localized prices inside Step 2 sub-content
  const { region, country } = useGeoPrice();
  // Resolve the active Reels tier's quantity cap so the stepper buttons can
  // disable cleanly at the ceiling.
  const reelsMaxQty = service.id === 'reels' ? getReelsTierMaxQuantity(reelsTier) : 1;
  const reelsTierObj = service.id === 'reels'
    ? (service as ReelsService).tiers.find(t => t.id === reelsTier)
    : undefined;
  const reelsUnitPrice = reelsTierObj?.price ?? 0;

  return (
    <div>
      <SectionTitle eyebrow="Step 2" title={`Configure your ${service.name}`} />

      <div style={{ marginTop: '24px' }}>
        {service.id === 'reels' && (
          <>
            <TierPicker
              tiers={(service as ReelsService).tiers.map(t => ({ id: t.id, name: t.name, price: t.price, deliverables: t.deliverables }))}
              value={reelsTier}
              onChange={setReelsTier}
            />

            {/* Quantity stepper — clamped to the active tier's maxQuantity.
                Essential lets buyers stack 10; Signature 4; Elite 1 (locked). */}
            <div style={{ marginTop: 28 }}>
              <SubLabel>{`How many ${reelsTierObj?.name ?? ''} cuts in this order?`}</SubLabel>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: 100,
                  padding: '4px',
                  gap: 4,
                }}>
                  <button
                    type="button"
                    onClick={() => setReelsQuantity(q => Math.max(1, q - 1))}
                    disabled={reelsQuantity <= 1}
                    aria-label="Decrease quantity"
                    style={qtyBtnStyle(reelsQuantity <= 1)}
                  >−</button>
                  <div style={{
                    minWidth: 36, textAlign: 'center', color: '#F2EEE7',
                    fontWeight: 700, fontSize: 16, fontVariantNumeric: 'tabular-nums',
                  }}>{reelsQuantity}</div>
                  <button
                    type="button"
                    onClick={() => setReelsQuantity(q => Math.min(reelsMaxQty, q + 1))}
                    disabled={reelsQuantity >= reelsMaxQty}
                    aria-label="Increase quantity"
                    style={qtyBtnStyle(reelsQuantity >= reelsMaxQty)}
                  >+</button>
                </div>

                <div style={{ color: 'rgba(242,238,231,0.62)', fontSize: 13, lineHeight: 1.4 }}>
                  {reelsMaxQty === 1
                    ? <>1 cut per order on this tier, which keeps production attention focused.</>
                    : <>Up to <strong style={{ color: '#F2EEE7' }}>{reelsMaxQty}</strong> per order on this tier.{' '}
                        <span style={{ color: 'rgba(242,238,231,0.45)' }}>
                          {(() => {
                            // Localize the UNIT price, then multiply by quantity
                            // in local-currency space so unit × qty ALWAYS lines
                            // up with the running total in the sidebar.
                            const unit = localizeOrderPrice(reelsUnitPrice, region, country);
                            const totalRaw = unit.raw * reelsQuantity;
                            // The INR branch here (en-IN lakh grouping) went with
                            // the India rate card — no currency we serve now needs
                            // special grouping at these amounts.
                            const totalDisplay = `${unit.currency}${totalRaw}`;
                            return <>{unit.display} each · {totalDisplay} total</>;
                          })()}
                        </span>
                      </>}
                </div>
              </div>
            </div>
          </>
        )}

        {service.id === 'longform' && (
          <>
            <SubLabel>Duration</SubLabel>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {(service as LongformService).durations.map(d => {
                const isActive = longDuration === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setLongDuration(d.id)}
                    style={{
                      background: isActive ? '#E8541A' : 'rgba(255,255,255,0.04)',
                      border: `1px solid ${isActive ? '#E8541A' : 'rgba(255,255,255,0.12)'}`,
                      color: isActive ? '#fff' : '#F2EEE7',
                      padding: '10px 20px',
                      borderRadius: '100px',
                      fontSize: '13px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'all 0.2s',
                    }}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>

            <SubLabel>Tier</SubLabel>
            <TierPicker
              tiers={(service as LongformService).tiers.map(t => ({
                id: t.id,
                name: t.name,
                price: t.pricing[longDuration],
                deliverables: t.deliverables,
              }))}
              value={longTier}
              onChange={setLongTier}
            />
          </>
        )}

        {service.id === 'podcast' && (
          <PodcastConfig
            service={service as PodcastService}
            addons={podcastAddons}
            setAddons={setPodcastAddons}
          />
        )}

        {service.id === 'repurpose' && (
          <RepurposeConfig service={service as RepurposeService} />
        )}
      </div>
    </div>
  );
}

// Reusable tier card grid used by Reels + Long-form (with computed price)
function TierPicker({
  tiers,
  value,
  onChange,
}: {
  tiers: { id: TierId; name: string; price: number; deliverables: string[] }[];
  value: TierId;
  onChange: (t: TierId) => void;
}) {
  // Geo so each tier card shows the localized price (₹6,499 vs $80)
  const { region, country } = useGeoPrice();
  return (
    <div className="orderflow-tier-grid" style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: '12px',
    }}>
      {tiers.map(t => {
        const isActive = value === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            style={{
              textAlign: 'left',
              background: isActive ? 'rgba(232,84,26,0.10)' : 'rgba(255,255,255,0.035)',
              border: `1px solid ${isActive ? '#E8541A' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '14px',
              padding: '18px 18px 16px',
              color: '#F2EEE7',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              transition: 'all 0.2s',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.18)';
            }}
            onMouseLeave={(e) => {
              if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.08)';
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#E8541A' }}>
                {t.name}
              </span>
              {isActive && (
                <span style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  background: '#E8541A', display: 'inline-flex',
                  alignItems: 'center', justifyContent: 'center',
                }}>
                  <Check size={11} color="#fff" strokeWidth={3} />
                </span>
              )}
            </div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '26px', fontWeight: 900, letterSpacing: '-0.8px', marginBottom: '12px' }}>
              {localizeOrderPrice(t.price, region, country).display}
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {t.deliverables.map((d) => (
                <li key={d} style={{ fontSize: '11.5px', color: 'rgba(242,238,231,0.65)', lineHeight: 1.45, display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                  <span style={{ color: '#E8541A', fontSize: '10px', flexShrink: 0, marginTop: '1px' }}>✓</span>
                  {d}
                </li>
              ))}
            </ul>
          </button>
        );
      })}
      <style>{`
        @media (max-width: 720px) {
          .orderflow-tier-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

function PodcastConfig({
  service,
  addons,
  setAddons,
}: {
  service: PodcastService;
  addons: ('trailer' | 'clips' | 'bundle')[];
  setAddons: (a: ('trailer' | 'clips' | 'bundle')[]) => void;
}) {
  // Geo for localized base + addon prices (₹X,XXX vs $X)
  const { region, country } = useGeoPrice();
  const toggleAddon = (id: 'trailer' | 'clips' | 'bundle') => {
    if (id === 'bundle') {
      // Toggle bundle — if turning on, clear trailer & clips
      if (addons.includes('bundle')) {
        setAddons(addons.filter(a => a !== 'bundle'));
      } else {
        setAddons(['bundle']);
      }
      return;
    }
    // Toggling trailer or clips — drop bundle if it was on
    const without = addons.filter(a => a !== 'bundle');
    if (without.includes(id)) {
      setAddons(without.filter(a => a !== id));
    } else {
      setAddons([...without, id]);
    }
  };

  return (
    <div>
      {/* Base — always included */}
      <div style={{
        background: 'rgba(232,84,26,0.07)',
        border: '1px solid rgba(232,84,26,0.28)',
        borderRadius: '14px',
        padding: '20px 22px',
        marginBottom: '22px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#E8541A', marginBottom: '4px' }}>
              Always included
            </div>
            <div style={{ fontSize: '17px', fontWeight: 800, letterSpacing: '-0.2px' }}>
              {service.base.name}
            </div>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 900, color: '#E8541A', letterSpacing: '-0.5px' }}>
            {localizeOrderPrice(service.base.price, region, country).display}
          </div>
        </div>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {service.base.deliverables.map(d => (
            <li key={d} style={{ fontSize: '12px', color: 'rgba(242,238,231,0.7)', display: 'flex', gap: '6px' }}>
              <span style={{ color: '#E8541A', fontSize: '10px' }}>✓</span>
              {d}
            </li>
          ))}
        </ul>
      </div>

      <SubLabel>Add-ons (optional)</SubLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {service.addons.map(a => {
          const isActive = addons.includes(a.id);
          const isBundle = a.id === 'bundle';
          return (
            <button
              key={a.id}
              type="button"
              onClick={() => toggleAddon(a.id)}
              style={{
                background: isActive ? 'rgba(232,84,26,0.10)' : 'rgba(255,255,255,0.035)',
                border: `1px solid ${isActive ? '#E8541A' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '12px',
                padding: '14px 18px',
                color: '#F2EEE7',
                cursor: 'pointer',
                fontFamily: 'Inter, sans-serif',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '14px',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                <span style={{
                  width: '22px', height: '22px',
                  borderRadius: '50%',
                  border: `1.5px solid ${isActive ? '#E8541A' : 'rgba(255,255,255,0.2)'}`,
                  background: isActive ? '#E8541A' : 'transparent',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.2s',
                }}>
                  {isActive && <Check size={12} color="#fff" strokeWidth={3} />}
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                  <span style={{ fontSize: '13.5px', fontWeight: 700, letterSpacing: '-0.1px' }}>
                    {a.name}
                  </span>
                  {isBundle && (
                    <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, marginTop: '2px' }}>
                      Save {a.saves ? localizeOrderPrice(a.saves, region, country).display : ''}
                    </span>
                  )}
                </div>
              </div>
              <span style={{ fontSize: '15px', fontWeight: 800, color: isActive ? '#E8541A' : 'rgba(242,238,231,0.85)', flexShrink: 0 }}>
                +{localizeOrderPrice(a.price, region, country).display}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function RepurposeConfig({ service }: { service: RepurposeService }) {
  return (
    <div style={{
      background: 'rgba(232,84,26,0.07)',
      border: '1px solid rgba(232,84,26,0.28)',
      borderRadius: '14px',
      padding: '24px',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '18px', gap: '20px' }}>
        <div>
          <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#E8541A', marginBottom: '6px' }}>
            Fixed package
          </div>
          <div style={{ fontSize: '20px', fontWeight: 800, letterSpacing: '-0.3px' }}>
            {service.fixed.name}
          </div>
        </div>
        <div style={{ fontSize: '32px', fontWeight: 900, color: '#E8541A', letterSpacing: '-1px' }}>
          ${service.fixed.price}
        </div>
      </div>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {service.fixed.deliverables.map(d => (
          <li key={d} style={{ fontSize: '13px', color: 'rgba(242,238,231,0.75)', display: 'flex', gap: '8px' }}>
            <span style={{ color: '#E8541A' }}>✓</span>
            {d}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ── Step 3: client details ────────────────────────────────────────────────
// Three visually grouped sections so the buyer is never staring at a wall of
// fields:
//   1. Contact — required for us to reach them
//   2. Footage — the one link we can't ship without
//   3. Direction (optional) — inspiration, brand assets, edit notes. All
//      explicitly optional; better briefs make better edits, but we never
//      gate the order behind them.
function StepDetails({ client, setClient }: { client: ClientDetails; setClient: (c: ClientDetails) => void }) {
  const upd = (k: keyof ClientDetails) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setClient({ ...client, [k]: e.target.value });

  return (
    <div>
      <SectionTitle eyebrow="Step 3" title="Project brief" />
      <p style={{ marginTop: '8px', fontSize: '13px', color: 'rgba(242,238,231,0.5)', lineHeight: 1.55, maxWidth: '560px' }}>
        Only your name, email, and footage link are required. The direction section is optional — every detail makes the edit sharper, but skip anything you don&apos;t need.
      </p>

      {/* ── Group 1 — Contact ── */}
      <FormGroup title="Your details" required>
        <div className="orderflow-form-grid">
          <Field label="Full name" required>
            <input value={client.fullName} onChange={upd('fullName')} placeholder="e.g. Lakshya Soni" />
          </Field>
          <Field label="Email" required>
            <input type="email" value={client.email} onChange={upd('email')} placeholder="you@brand.com" />
          </Field>
          <Field label="Brand or channel name">
            <input value={client.brand} onChange={upd('brand')} placeholder="EchoPulse Studio" />
          </Field>
          <Field label="Niche or industry">
            <input value={client.niche} onChange={upd('niche')} placeholder="Real estate, SaaS, coaching, e-comm..." />
          </Field>
          <Field
            label="Phone (optional)"
            full
            hint="WhatsApp-friendly. Sharing this gives us a direct line for delivery updates and the fastest reach if we hit a blocking question. Never used for marketing."
          >
            <input
              type="tel"
              value={client.phone}
              onChange={upd('phone')}
              placeholder="+91 9XXXX XXXXX  /  +1 555 1234567"
              autoComplete="tel"
            />
          </Field>
        </div>
      </FormGroup>

      {/* ── Group 2 — Footage ── */}
      <FormGroup title="Your footage" required>
        <div className="orderflow-form-grid">
          <Field label="Google Drive or Dropbox link" required full>
            <input
              value={client.fileLink}
              onChange={upd('fileLink')}
              placeholder="https://drive.google.com/... &nbsp; make sure sharing is set to 'Anyone with the link'"
            />
          </Field>
        </div>
      </FormGroup>

      {/* ── Group 3 — Optional direction ── */}
      <FormGroup title="Your direction" optional>
        <p className="orderflow-group-hint">
          Anything you share here helps us nail the edit on the first pass. All fields below are optional.
        </p>
        <div className="orderflow-form-grid">
          <Field label="Sample edits you love" full hint="Paste links to Reels, Shorts, YouTube videos, or TikToks whose feel you want to reference. We'll study the pacing, motion, and color.">
            <textarea
              value={client.inspiration}
              onChange={upd('inspiration')}
              rows={3}
              placeholder="https://youtu.be/...&#10;https://instagram.com/reel/...&#10;https://tiktok.com/@..."
            />
          </Field>
          <Field label="Brand assets" full hint="Logo, brand colors, fonts, brand guide PDF. Paste hex codes, drop a Drive folder link, or just describe your palette in a sentence.">
            <textarea
              value={client.brandAssets}
              onChange={upd('brandAssets')}
              rows={3}
              placeholder="Primary color: #E8541A&#10;Logo + brand guide: https://drive.google.com/...&#10;Font: Inter"
            />
          </Field>
          <Field label="How should this edit feel?" full hint="Tell us about pacing, tone, music style, key moments to emphasize, anything to avoid. Talk like a director, not a brief.">
            <textarea
              value={client.editDirection}
              onChange={upd('editDirection')}
              rows={5}
              placeholder="Fast-paced with cinematic color. Punchy cuts on beat drops. Lead with the hook at 0:00 — the moment I say 'most agents miss this'. Avoid corporate-stock music."
            />
          </Field>
        </div>
      </FormGroup>

      <style>{`
        .orderflow-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }
        .orderflow-form-grid input,
        .orderflow-form-grid textarea {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: #F2EEE7;
          font-family: Inter, sans-serif;
          font-size: 14px;
          padding: 12px 14px;
          border-radius: 10px;
          outline: none;
          transition: border-color 0.2s, background 0.2s;
          resize: vertical;
          cursor: text;
          /* Phone-tap friendliness: 44px floor, iOS 16px font to defeat
             focus-zoom, and touch-action so taps register instantly. */
          min-height: 44px;
          touch-action: manipulation;
        }
        @media (max-width: 768px) {
          .orderflow-form-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          .orderflow-form-grid input,
          .orderflow-form-grid textarea {
            font-size: 16px !important;
            padding: 14px 14px !important;
            min-height: 48px;
            border-radius: 12px;
          }
          .orderflow-form-grid textarea { min-height: 112px; }
        }
        .orderflow-form-grid input::placeholder,
        .orderflow-form-grid textarea::placeholder {
          color: rgba(242,238,231,0.28);
        }
        .orderflow-form-grid input:focus,
        .orderflow-form-grid textarea:focus {
          border-color: rgba(232,84,26,0.6);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 0 0 3px rgba(232,84,26,0.10);
        }
        .orderflow-group-hint {
          margin: 0 0 14px;
          font-size: 12.5px;
          color: rgba(242,238,231,0.5);
          line-height: 1.55;
        }
        @media (max-width: 640px) {
          .orderflow-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

// ── Grouped section wrapper used in Step 3 ────────────────────────────────
function FormGroup({
  title,
  required,
  optional,
  children,
}: {
  title: string;
  required?: boolean;
  optional?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section style={{
      marginTop: '28px',
      padding: '22px 22px 22px',
      background: 'rgba(255,255,255,0.025)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: '14px',
    }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
        <h3 style={{
          margin: 0,
          fontFamily: 'Inter, sans-serif',
          fontSize: '14px',
          fontWeight: 800,
          letterSpacing: '-0.1px',
          color: '#F2EEE7',
        }}>
          {title}
        </h3>
        {required && (
          <span style={{
            fontSize: '9px',
            fontWeight: 800,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: '#E8541A',
            padding: '2px 8px',
            background: 'rgba(232,84,26,0.12)',
            border: '1px solid rgba(232,84,26,0.3)',
            borderRadius: '100px',
          }}>
            Required
          </span>
        )}
        {optional && (
          <span style={{
            fontSize: '9px',
            fontWeight: 700,
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            color: 'rgba(242,238,231,0.45)',
            padding: '2px 8px',
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.10)',
            borderRadius: '100px',
          }}>
            Optional
          </span>
        )}
      </header>
      {children}
    </section>
  );
}

function Field({
  label,
  required,
  full,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  full?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '6px',
      gridColumn: full ? '1 / -1' : 'auto',
    }}>
      <span style={{ fontSize: '11.5px', fontWeight: 700, color: 'rgba(242,238,231,0.78)', letterSpacing: '0.2px' }}>
        {label}
        {required && <span style={{ color: '#E8541A', marginLeft: '4px' }}>*</span>}
      </span>
      {hint && (
        <span style={{
          fontSize: '11px',
          color: 'rgba(242,238,231,0.42)',
          lineHeight: 1.5,
          marginBottom: '2px',
          fontWeight: 400,
        }}>
          {hint}
        </span>
      )}
      {children}
    </label>
  );
}

// ── Step 4: review ────────────────────────────────────────────────────────
function StepReview({
  service,
  selection,
  client,
}: {
  service: ServiceData;
  selection: OrderSelection;
  client: ClientDetails;
}) {
  const summary = describeSelection(service, selection);
  return (
    <div>
      <SectionTitle eyebrow="Step 4" title="Review and confirm" />

      <div style={{
        marginTop: '24px',
        background: 'rgba(255,255,255,0.035)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '16px',
        padding: '24px 26px',
      }}>
        <ReviewRow label="Service">{service.name}</ReviewRow>
        <ReviewRow label="Configuration">{summary.config}</ReviewRow>
        <ReviewRow label="Turnaround">{service.turnaround}</ReviewRow>
        <ReviewRow label="Deliverables">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
            {summary.deliverables.map(d => (
              <li key={d} style={{ display: 'flex', gap: '8px', fontSize: '13px', color: 'rgba(242,238,231,0.78)' }}>
                <span style={{ color: '#E8541A' }}>✓</span>{d}
              </li>
            ))}
          </ul>
        </ReviewRow>
        <ReviewRow label="Client">
          {client.fullName || 'unnamed'} · {client.email || 'no email'}
          {client.brand && <> · {client.brand}</>}
        </ReviewRow>
        <ReviewRow label="Footage">
          <a href={client.fileLink} target="_blank" rel="noopener noreferrer" style={{ color: '#E8541A', textDecoration: 'underline', wordBreak: 'break-all', fontSize: '13px' }}>
            {client.fileLink || '—'}
          </a>
        </ReviewRow>
        {client.brandAssets && <ReviewRow label="Brand assets">{client.brandAssets}</ReviewRow>}
        {client.editDirection && <ReviewRow label="Direction">{client.editDirection}</ReviewRow>}
      </div>

      {/* The big total lives in the sticky sidebar — no need to repeat it
          here. Total is removed from the main review card to stop the
          duplicate-price awkwardness.

          Note on the Terms gate: we used to render a prominent checkbox here.
          That created friction at the highest-intent moment in the flow. The
          standard checkout pattern (Stripe, Amazon, Shopify, every SaaS) is
          implicit acceptance via the CTA itself — a small "By placing this
          order you agree to our Terms" line directly under the button. The
          legal weight stays the same: clicking "Proceed to payment" is the
          recorded act of acceptance. The full Terms doc still binds the
          buyer in court. */}
      <p style={{ marginTop: '18px', fontSize: '12px', color: 'rgba(242,238,231,0.45)', lineHeight: 1.6 }}>
        You will be redirected to a secure checkout. After payment we email a confirmation and start work inside 24 hours.
        By placing this order you agree to our{' '}
        <a
          href="/terms"
          target="_blank"
          rel="noopener noreferrer"
          data-cursor-hover
          style={{ color: '#E8541A', textDecoration: 'underline', fontWeight: 600 }}
        >
          Terms of Service
        </a>.
      </p>
    </div>
  );
}

function ReviewRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', gap: '20px', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <div style={{
        fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px',
        textTransform: 'uppercase', color: 'rgba(242,238,231,0.45)',
        flex: '0 0 120px', paddingTop: '2px',
      }}>{label}</div>
      <div style={{ fontSize: '13.5px', color: 'rgba(242,238,231,0.92)', flex: 1, minWidth: 0, lineHeight: 1.5 }}>
        {children}
      </div>
    </div>
  );
}

// ── Order summary sidebar (sticky on desktop) ─────────────────────────────
function OrderSummary({
  service,
  selection,
  totalDisplay,
  step,
}: {
  service: ServiceData | null;
  selection: OrderSelection | null;
  totalDisplay: string;
  step: Step;
}) {
  const summary = service && selection ? describeSelection(service, selection) : null;

  return (
    <aside className="orderflow-summary" style={{
      background: 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: '18px',
      padding: '22px 22px 20px',
      position: 'sticky',
      top: '100px',
    }}>
      <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(232,84,26,0.85)', marginBottom: '14px' }}>
        Your order
      </div>

      {!service ? (
        <p style={{ fontSize: '13px', color: 'rgba(242,238,231,0.45)', lineHeight: 1.55, margin: 0 }}>
          Pick a service to get started. Your total appears here as you configure.
        </p>
      ) : (
        <>
          <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '6px', letterSpacing: '-0.2px' }}>
            {service.name}
          </div>
          <div style={{ fontSize: '12.5px', color: 'rgba(242,238,231,0.55)', marginBottom: '14px', lineHeight: 1.5 }}>
            {summary?.config}
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px', marginBottom: '14px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(242,238,231,0.4)', marginBottom: '8px' }}>
              You get
            </div>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {summary?.deliverables.slice(0, 5).map(d => (
                <li key={d} style={{ fontSize: '11.5px', color: 'rgba(242,238,231,0.65)', display: 'flex', gap: '6px', lineHeight: 1.4 }}>
                  <span style={{ color: '#E8541A', fontSize: '10px', flexShrink: 0, marginTop: '1px' }}>✓</span>{d}
                </li>
              ))}
              {summary && summary.deliverables.length > 5 && (
                <li style={{ fontSize: '11px', color: 'rgba(242,238,231,0.4)', fontStyle: 'italic' }}>
                  +{summary.deliverables.length - 5} more
                </li>
              )}
            </ul>
          </div>

          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(242,238,231,0.5)' }}>
              Total
            </span>
            <motion.span
              key={totalDisplay}
              initial={{ scale: 1.08, opacity: 0.6 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '28px', fontWeight: 900, color: '#E8541A', letterSpacing: '-0.8px' }}
            >
              {totalDisplay}
            </motion.span>
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(242,238,231,0.4)', lineHeight: 1.5 }}>
            Turnaround: <strong style={{ color: 'rgba(242,238,231,0.78)', fontWeight: 700 }}>{service.turnaround}</strong>
            {step < 4 && <><br />Charged at checkout. No retainer.</>}
          </div>
        </>
      )}

      <style>{`
        @media (max-width: 960px) {
          .orderflow-summary {
            position: static !important;
            top: auto !important;
          }
        }
      `}</style>
    </aside>
  );
}

// ── Helpers ──────────────────────────────────────────────────────────────
function describeSelection(service: ServiceData, selection: OrderSelection): { config: string; deliverables: string[] } {
  if (selection.serviceId === 'reels') {
    const svc = service as ReelsService;
    const tier = svc.tiers.find(t => t.id === selection.tier);
    return { config: `${tier?.name} tier`, deliverables: tier?.deliverables ?? [] };
  }
  if (selection.serviceId === 'longform') {
    const svc = service as LongformService;
    const tier = svc.tiers.find(t => t.id === selection.tier);
    const dur = svc.durations.find(d => d.id === selection.duration);
    return { config: `${dur?.label} · ${tier?.name} tier`, deliverables: tier?.deliverables ?? [] };
  }
  if (selection.serviceId === 'podcast') {
    const svc = service as PodcastService;
    const lines = [svc.base.name];
    const extras: string[] = [];
    if (selection.addons.includes('bundle')) {
      extras.push('Trailer + 14 clips (bundle)');
    } else {
      for (const a of selection.addons) {
        const addon = svc.addons.find(x => x.id === a);
        if (addon) extras.push(addon.name);
      }
    }
    const config = extras.length ? `${lines[0]} + ${extras.join(', ')}` : lines[0];
    const deliverables = [
      ...svc.base.deliverables,
      ...extras.map(e => `Add-on: ${e}`),
    ];
    return { config, deliverables };
  }
  const svc = service as RepurposeService;
  return { config: svc.fixed.name, deliverables: svc.fixed.deliverables };
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', color: 'rgba(232,84,26,0.85)', marginBottom: '8px' }}>
        {eyebrow}
      </div>
      <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(22px, 2.4vw, 30px)', fontWeight: 800, letterSpacing: '-0.6px', lineHeight: 1.1, margin: 0 }}>
        {title}
      </h2>
    </div>
  );
}

function SubLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(242,238,231,0.5)', marginBottom: '12px' }}>
      {children}
    </div>
  );
}
