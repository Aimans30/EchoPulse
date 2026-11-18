'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { BOOK_CALL_LABEL, FREE_EDITS_LABEL, FREE_EDITS_URL } from '@/lib/links';
import { PRESENCE } from '@/lib/pricing';
import HeroReel from '@/components/HeroReel';
import { trackPilotClick, trackCallClick } from '@/lib/analytics';

/* ──────────────────────────────────────────────────────────
   StatsBand — full-width ticker that lives BELOW the hero flex,
   not inside the orbital panel. All four stats are visible at once
   with a subtle "active" highlight that cycles through them.
   ────────────────────────────────────────────────────────── */
// Two of these were replaced after buyer research. "∞ revisions until
// satisfied" was called out by a precision-minded buyer as an unquantified
// flourish that made her distrust the numbers either side of it, and the real
// policy (redone until you would post it under your own name) is a standard,
// not a quantity, so it does not belong in a numeric ticker. "20-30h back to
// you every week" is not on the verified-facts list and cannot be evidenced.
// Both swapped for figures that are true and checkable. "7 services" is
// correct and stays: lib/serviceData.ts defines seven.
const BAND_STATS = [
  { value: '48h',   label: 'turnaround per deliverable' },
  { value: '3h',    label: 'reply window every workday' },
  { value: '2',     label: 'free edits to start, no card' },
  { value: '$299',  label: 'Pilot, keep everything made' },
];

function StatsBand() {
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setActiveIdx((i) => (i + 1) % BAND_STATS.length), 2400);
    return () => clearInterval(id);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="stats-band"
      style={{
        width: '100%',
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '0 56px 64px',
        position: 'relative',
        zIndex: 1,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0',
          padding: '14px 28px',
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(20px) saturate(180%)',
          WebkitBackdropFilter: 'blur(20px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.85)',
          borderRadius: '100px',
          boxShadow: '0 8px 32px rgba(12,12,11,0.06), inset 0 1px 0 rgba(255,255,255,0.95)',
          flexWrap: 'wrap',
          // Centered: the "By the numbers" eyebrow + green dot were removed,
          // so the four remaining stats are the only thing in this pill.
          justifyContent: 'center',
        }}
      >
        <div className="stats-band-items" style={{ display: 'flex', alignItems: 'center', gap: '36px', flexWrap: 'wrap', justifyContent: 'center', width: '100%' }}>
          {BAND_STATS.map((s, i) => {
            const isActive = i === activeIdx;
            return (
              <motion.div
                key={s.label}
                animate={{
                  opacity: isActive ? 1 : 0.82,
                  scale: isActive ? 1.04 : 1,
                }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  display: 'flex',
                  alignItems: 'baseline',
                  gap: '7px',
                  whiteSpace: 'nowrap',
                  transformOrigin: 'center',
                }}
              >
                <span
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '17px',
                    fontWeight: 900,
                    letterSpacing: '-0.5px',
                    color: isActive ? '#E8541A' : '#0C0C0B',
                    transition: 'color 0.4s ease',
                  }}
                >
                  {s.value}
                </span>
                <span style={{ fontSize: '11px', color: '#6E6B63', fontWeight: 500 }}>
                  {s.label}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .stats-band { padding: 0 24px 48px !important; }
          .stats-band > div { flex-direction: column; gap: 14px; padding: 18px 22px !important; border-radius: 24px !important; align-items: flex-start !important; }
          .stats-band-items { gap: 14px 22px !important; justify-content: flex-start !important; width: 100%; }
        }
        /* Hidden on phone — the hero stays clean. The stats reappear inside
           dedicated sections lower on the page anyway. */
        @media (max-width: 640px) {
          .stats-band { display: none !important; }
        }
      `}</style>
    </motion.div>
  );
}

export default function Hero() {
  const wrapRef      = useRef<HTMLDivElement>(null);
  const eyebrowRef   = useRef<HTMLDivElement>(null);
  const headlineRef  = useRef<HTMLHeadingElement>(null);
  // Was HTMLParagraphElement. The hero subline is now an <h2> (it carries the
  // homepage's only keyword-bearing heading), so the ref type follows the tag.
  const subRef       = useRef<HTMLHeadingElement>(null);
  const actionsRef   = useRef<HTMLDivElement>(null);
  const rightRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // PHONES SKIP THE TIMELINE ENTIRELY.
    // globals.css pins .hero-sub / .hero-actions / .hero-right / .hl-inner to
    // their finished values under the same (max-width: 767.98px) query, and the
    // rule below pins #grid-bg, so every element the timeline touches is already
    // in its end state before hydration. Running the tween anyway cost ~0.85s of
    // main-thread and compositor work at exactly the moment a phone is busiest,
    // and bought nothing visible. Desktop is untouched.
    if (typeof window !== 'undefined' && window.matchMedia('(max-width: 767.98px)').matches) return;

    const lines = headlineRef.current?.querySelectorAll('.hl-inner');
    // SHORT timeline — total play time ~0.85s. Starts immediately on mount
    // so by the time the loader (1.4s) is done, the Hero animation has
    // finished. The page is in its final settled state when revealed.
    const tl = gsap.timeline();
    tl.fromTo('#grid-bg',      { opacity: 0 }, { opacity: 1, duration: 0.6 })
      .fromTo(eyebrowRef.current,  { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: 'power2.out' }, '-=0.5')
      .fromTo(lines ?? [],         { y: '105%' },          { y: '0%', duration: 0.5, ease: 'power3.out', stagger: 0.05 }, '-=0.25')
      .fromTo([subRef.current, actionsRef.current], { y: 10, opacity: 0 }, { y: 0, opacity: 1, duration: 0.4, ease: 'power2.out', stagger: 0.06 }, '-=0.25')
      .fromTo(rightRef.current,    { x: 16, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: 'power2.out' }, '-=0.55');
    return () => { tl.kill(); };
  }, []);

  return (
    <>
      <style>{`
        #grid-bg {
          position: absolute; inset: 0; opacity: 0; pointer-events: none;
          background-image: linear-gradient(rgba(12,12,11,0.03) 1px,transparent 1px),
                            linear-gradient(90deg,rgba(12,12,11,0.03) 1px,transparent 1px);
          background-size: 68px 68px;
          mask-image: radial-gradient(ellipse 80% 80% at 50% 0%,black 20%,transparent 100%);
          -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 0%,black 20%,transparent 100%);
        }
        /* The entrance timeline is skipped on phones (see the effect below), and
           it was the only thing that faded the grid in. Pin its end value here
           or the backdrop would simply never appear on mobile. */
        @media (max-width: 767.98px) {
          #grid-bg { opacity: 1; }
        }
        .hero-badge { display:inline-flex;align-items:center;gap:7px;padding:5px 14px 5px 8px;background:rgba(232,84,26,0.09);border:1px solid rgba(232,84,26,0.22);border-radius:100px;font-size:11px;font-weight:700;color:#E8541A; }
        .badge-dot  { width:6px;height:6px;border-radius:50%;background:#E8541A;animation:bdot 2s ease-in-out infinite; }
        @keyframes bdot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.6)}}

        .hl-wrap  { display:block; overflow:hidden; padding-top:0.12em; margin-top:-0.12em; padding-bottom:0.18em; margin-bottom:-0.18em; }
        .hl-inner { display:block; }

        .btn-p { background:#0C0C0B;color:#F2EEE7;border:none;padding:15px 28px;border-radius:100px;font-size:13px;font-weight:700;cursor:pointer;text-decoration:none;display:inline-flex;align-items:center;gap:8px;font-family:Inter,sans-serif;transition:all 0.3s cubic-bezier(0.16,1,0.3,1);position:relative;overflow:hidden; }
        .btn-p::before{content:'';position:absolute;inset:0;background:#E8541A;transform:translateX(-101%);transition:transform 0.4s cubic-bezier(0.16,1,0.3,1);z-index:0;}
        .btn-p:hover::before{transform:translateX(0);}
        .btn-p:hover{transform:scale(1.03);box-shadow:0 8px 30px rgba(232,84,26,0.28);}
        .btn-p span,.btn-p svg{position:relative;z-index:1;}
        .btn-o{background:rgba(255,255,255,0.55);backdrop-filter:blur(12px);color:#0C0C0B;border:1px solid rgba(12,12,11,0.13);padding:15px 28px;border-radius:100px;font-size:13px;font-weight:700;cursor:pointer;text-decoration:none;display:inline-block;font-family:Inter,sans-serif;transition:all 0.3s;}
        .btn-o:hover{background:#0C0C0B;color:#F2EEE7;border-color:#0C0C0B;}
        /* The custom cursor replaces the native one, so hiding it is only ever
           correct on a device that has one. Touch keeps a normal affordance. */
        @media (hover: hover) and (pointer: fine) {
          .btn-p, .btn-o { cursor: none; }
        }
        .hero-proof{margin:22px 0 0;max-width:520px;font-family:Inter,sans-serif;font-size:13.5px;line-height:1.6;color:#6E6B63;}
        .hero-proof a{color:inherit;text-decoration:underline;text-decoration-color:rgba(232,84,26,0.55);text-underline-offset:3px;transition:color 0.2s;}
        .hero-proof a:hover{color:#0C0C0B;}
        .scroll-hint{position:absolute;bottom:24px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:6px;color:#A8A49B;font-size:9px;letter-spacing:3px;text-transform:uppercase;font-weight:600;}
        .scroll-line{width:1px;height:28px;background:linear-gradient(to bottom,#E8541A,transparent);animation:sline 1.8s ease-in-out infinite;}
        @keyframes sline{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
        /* Mobile-only elements are hidden on desktop by default */
        .hero-mobile-only { display: none; }
        /* Tablet: stack vertically — text on top, orbital graphic below, both centered */
        @media(max-width:860px){
          .hero-inner{flex-direction:column!important;gap:36px!important;align-items:stretch!important;}
          .hero-right{width:100%!important;display:flex!important;justify-content:center!important;}
        }
        /* ── Phone redesign ──
           Below 640px the hero is rebuilt for portrait-touch context. We tighten
           the type stack, restructure the headline into clean 2-line form, swap
           the orbital graphic for a native mobile service grid + trust strip,
           and give CTAs full-width tap targets. */
        @media(max-width:640px){
          /* Kill the 100vh stretch on phone — with the orbital hidden there was
             nothing to fill it, leaving a big dead gap above the stats band.
             Let the hero size to its content + comfortable breathing room. */
          .hero-section{
            min-height: auto !important;
            justify-content: center !important;
          }
          .hero-inner{
            /* Center-aligned mobile hero. Tighter vertical rhythm now that the
               section no longer forces full-viewport height. */
            padding: 100px 24px 40px !important;
            gap: 0 !important;
            text-align: center !important;
            align-items: center !important;
            justify-content: center !important;
            min-height: auto !important;
          }
          /* The text column inside .hero-inner — center its children too */
          .hero-inner > div:first-child{
            display: flex !important;
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            width: 100% !important;
          }
          .hero-eyebrow-m{
            display:inline-flex !important;
            align-items:center;
            gap:8px;
            padding:6px 14px 6px 10px;
            background:rgba(12,12,11,0.05);
            border:1px solid rgba(12,12,11,0.10);
            border-radius:100px;
            font-family:Inter,sans-serif;
            font-size:11px;
            font-weight:600;
            letter-spacing:0.2px;
            color:rgba(12,12,11,0.65);
            margin: 0 auto 24px !important;
          }
          .hero-eyebrow-m .ep-pulse{
            width:6px;height:6px;border-radius:50%;background:#10b981;
            box-shadow:0 0 8px rgba(16,185,129,0.6);
            animation:bdot 2s ease-in-out infinite;
          }
          /* Restructure h1 into a clean 2-line stack: we hide the original
             3-span layout and render a mobile-native 2-line version inside
             .hero-h1-mobile (just below). */
          .hero-h1-desktop{ display:none !important; }
          .hero-h1-mobile{
            display:block !important;
            font-family:Inter,sans-serif;
            font-weight:800;
            font-size: clamp(28px, 8vw, 38px) !important;
            line-height: 1.12 !important;
            letter-spacing: -0.6px !important;
            color:#0C0C0B;
            margin: 0 auto 20px !important;
            max-width: 340px !important;
            text-align: center !important;
          }
          .hero-h1-mobile .accent{
            color:#E8541A;
            font-style:italic;
          }
          .hero-sub{
            /* 15px floor: this is the first block of body copy a phone visitor
               reads, and it was landing under it. Line-height goes looser than
               desktop, not tighter, because the measure is narrower. */
            font-size: 15.5px !important;
            line-height: 1.62 !important;
            color:#6B675E !important;
            margin: 0 auto 28px !important;
            max-width: 320px !important;
            text-align: center !important;
            font-weight: 400 !important;
          }
          .hero-sub strong{
            font-weight: 600 !important;
            color: #0C0C0B !important;
          }
          .hero-sub .desktop-only{ display:none; }
          /* CTA stack — centered as a row on phone, both buttons compact
             pills. Primary stays solid black, secondary is a clean text
             link with subtle underline-on-hover (less visual weight than
             the old outlined pill — keeps the focus on the primary). */
          /* CTA stack — both buttons full-width and identical size, stacked
             vertically. Equal width = clean, intentional look (no more one
             pill wider than the other). */
          .hero-actions{
            gap:12px !important;
            margin: 0 auto !important;
            width:100% !important;
            max-width:340px !important;
            flex-direction:column !important;
            align-items:stretch !important;
            justify-content:center !important;
            flex-wrap:nowrap !important;
          }
          .hero-actions .btn-p{
            width:100% !important;
            flex:0 0 auto !important;
            justify-content:center !important;
            padding:15px 26px !important;
            font-size:14px !important;
            min-height:50px !important;
            box-sizing:border-box !important;
            border-radius:100px !important;
            display:inline-flex !important;
            align-items:center !important;
            gap:8px !important;
            font-weight:700 !important;
          }
          .hero-actions .btn-o{
            width:100% !important;
            box-sizing:border-box !important;
            background: transparent !important;
            border: 1px solid rgba(12,12,11,0.16) !important;
            color: #0C0C0B !important;
            padding:15px 26px !important;
            font-size:14px !important;
            font-weight:600 !important;
            min-height:50px !important;
            border-radius:100px !important;
            display:inline-flex !important;
            align-items:center !important;
            justify-content:center !important;
            gap:6px !important;
          }
          .hero-proof{ margin:20px auto 0 !important; max-width:340px !important; font-size:14px !important; text-align:center !important; }
          .scroll-hint{ display:none !important; }
          /* Hide the orbital entirely — replaced by mobile service grid below */
          .hero-right{ display:none !important; }

          /* Mobile-only blocks: service chips + trust strip */
          .hero-mobile-only{ display:block; }

          .hero-trust-strip{
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:8px;
            margin-top:24px;
            padding:14px 14px;
            background:rgba(255,255,255,0.55);
            backdrop-filter: blur(14px) saturate(180%);
            -webkit-backdrop-filter: blur(14px) saturate(180%);
            border:1px solid rgba(12,12,11,0.08);
            border-radius:14px;
            box-shadow:0 4px 18px rgba(12,12,11,0.04), inset 0 1px 0 rgba(255,255,255,0.9);
          }
          .hero-trust-item{
            display:flex; flex-direction:column; align-items:center; gap:2px;
            flex:1 1 0;
            min-width:0;
            text-align:center;
          }
          .hero-trust-item .v{
            font-family:Inter,sans-serif;
            font-size:15px;
            font-weight:900;
            letter-spacing:-0.4px;
            color:#0C0C0B;
          }
          .hero-trust-item .v.accent{ color:#E8541A; }
          .hero-trust-item .k{
            font-size:9.5px;
            font-weight:700;
            letter-spacing:0.8px;
            text-transform:uppercase;
            color:#8A857B;
            white-space:nowrap;
          }
          .hero-trust-sep{
            width:1px;
            height:28px;
            background:rgba(12,12,11,0.08);
            flex-shrink:0;
          }

          /* Service grid — 2 columns × 3 rows of premium-feeling chips */
          .hero-services-label{
            display:flex;
            align-items:center;
            gap:10px;
            margin: 28px 0 12px;
            font-family:Inter,sans-serif;
            font-size:10px;
            font-weight:800;
            letter-spacing:2.5px;
            text-transform:uppercase;
            color:#8A857B;
          }
          .hero-services-label::before{
            content:'';
            width:18px; height:1px; background:#E8541A;
            display:block;
          }
          .hero-services-grid{
            display:grid;
            grid-template-columns: repeat(2, 1fr);
            gap:10px;
          }
          .hero-svc-chip{
            display:flex;
            align-items:center;
            gap:10px;
            padding:13px 12px;
            background:rgba(255,255,255,0.5);
            border:1px solid rgba(12,12,11,0.08);
            border-radius:14px;
            transition: transform 0.2s, border-color 0.2s, background 0.2s;
          }
          .hero-svc-chip:active{
            transform: scale(0.98);
            background:rgba(255,255,255,0.75);
            border-color: rgba(232,84,26,0.30);
          }
          .hero-svc-chip .svc-ico{
            width:34px; height:34px; border-radius:10px;
            display:flex; align-items:center; justify-content:center;
            flex-shrink:0;
          }
          .hero-svc-chip .svc-text{
            display:flex; flex-direction:column; gap:1px;
            min-width:0; flex:1;
          }
          .hero-svc-chip .svc-name{
            font-family:Inter,sans-serif;
            font-size:12.5px;
            font-weight:800;
            color:#0C0C0B;
            letter-spacing:-0.2px;
            line-height:1.1;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
          }
          .hero-svc-chip .svc-tag{
            font-size:10px;
            color:#8A857B;
            font-weight:500;
            line-height:1.2;
            white-space:nowrap;
            overflow:hidden;
            text-overflow:ellipsis;
          }
        }
        @media(max-width:380px){
          /* Top padding must clear the fixed nav pill, which sits at top:20px
             and is ~56px tall on phone. 76px put the headline directly under it
             on first paint at 320px. */
          .hero-inner{ padding:94px 20px 40px !important; }
          .hero-h1-mobile{
            font-size: 27px !important;
            letter-spacing: -0.5px !important;
            line-height: 1.14 !important;
            max-width: 290px !important;
          }
          .hero-sub{
            /* Still at the 15px legibility floor on a 320px screen. */
            font-size: 15px !important;
            line-height: 1.6 !important;
            margin: 0 auto 24px !important;
            max-width: 285px !important;
          }
          .hero-actions{ gap: 12px !important; }
          /* Keep both pills at 48px on the smallest phones: the label shrinking
             below 14px was making the primary CTA read as secondary. */
          .hero-actions .btn-p{ padding: 13px 22px !important; font-size: 14px !important; min-height: 48px !important; }
          .hero-actions .btn-o{ padding: 13px 18px !important; font-size: 14px !important; min-height: 48px !important; }
          .hero-trust-item .v{ font-size:13.5px !important; }
          .hero-trust-item .k{ font-size:8.5px !important; letter-spacing:0.6px !important; }
          .hero-services-grid{ gap:8px !important; }
          .hero-svc-chip{ padding:11px 10px !important; }
          .hero-svc-chip .svc-ico{ width:30px; height:30px; }
          .hero-svc-chip .svc-name{ font-size:11.5px !important; }
          .hero-svc-chip .svc-tag{ font-size:9.5px !important; }
        }
      `}</style>

      <section className="hero-section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', overflowX: 'clip' }}>
        <div id="grid-bg" />

        <div
          ref={wrapRef}
          className="hero-inner"
          style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '120px 56px 72px', display: 'flex', alignItems: 'center', gap: '64px', position: 'relative', zIndex: 1, flex: '1 1 auto' }}
        >
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <div ref={eyebrowRef} />

            {/* Desktop headline — original 3-line stacked structure. Hidden on phone. */}
            <h1
              ref={headlineRef}
              className="hero-h1 hero-h1-desktop"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(36px, 4.4vw, 64px)', fontWeight: 900, lineHeight: 1.04, letterSpacing: 'clamp(-1px, -0.035em, -2.4px)', margin: '0 0 24px' }}
            >
              {[
                <>You run the business.</>,
                <>We run <span style={{ color: '#E8541A', fontStyle: 'italic' }}>the content.</span></>,
              ].map((line, i) => (
                <span key={i} className="hl-wrap">
                  <span className="hl-inner">{line}</span>
                </span>
              ))}
            </h1>

            {/* Mobile headline — clean 2-line structure that reads naturally at 375px.
                Each line is its own block so the italic accent on line 2 doesn't
                pull the baseline of line 1, which made the headline look slightly
                misaligned at the 375px viewport.

                NOTE: this is a <div>, not an <h1>. It used to be a second <h1>,
                which meant every crawler saw TWO H1s on the homepage (CSS hides
                one visually, but the DOM still carries both). One H1 per page. */}
            <div className="hero-h1-mobile hero-mobile-only" role="presentation" aria-hidden="true">
              <span style={{ display: 'block' }}>You run the business.</span>
              <span style={{ display: 'block' }}>We run <span className="accent">the content.</span></span>
            </div>

            {/* Keyword-bearing H2. The H1 above is pure brand copy — great for
                humans, but it gives Google nothing to rank the homepage for.
                This line states plainly what we sell and who we sell it to, in
                the words buyers actually search. Doubles as the sentence AI
                assistants extract when asked "what is EchoPulse Media". */}
            <h2 ref={subRef} className="hero-sub" style={{ fontSize: '16px', color: '#6E6B63', maxWidth: '540px', lineHeight: 1.7, fontWeight: 400, margin: '0 0 36px' }}>
              {/* Offer line: what the weekly plan covers and what it costs (read
                  from lib/pricing.ts so it cannot drift), then the free start.
                  The same h2 serves phone and desktop; there is no separate
                  mobile subheading. */}
              <span>
                Videos, posts and your website, run every week from {PRESENCE.priceLabel} a month.
                No contract.
              </span>{' '}
              <strong style={{ color: '#0C0C0B', fontWeight: 600 }}>Start with 2 free edits.</strong>
            </h2>

            <div ref={actionsRef} className="hero-actions" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '0', alignItems: 'center' }}>
              {/* PRIMARY — opens the BookCallModal (Calendly iframe) so visitors
                 stay on the page instead of getting yanked to a new tab. */}
              <button
                type="button"
                className="btn-p"
                // No aria-label. It previously carried BOOK_CALL_LABEL_LONG
                // while the visible span said something else entirely, so a
                // screen-reader or voice-control user was told a different
                // value proposition than the one on screen, and "click Book a
                // free 15-minute call" would not match the accessible name (WCAG
                // 2.5.3 Label in Name). The visible text is a perfectly good
                // accessible name on its own, so let it be the name.
                data-cursor-hover
                onClick={() => {
                  trackCallClick('hero_primary');
                  (window as unknown as { openBookCallModal?: () => void }).openBookCallModal?.();
                }}
                // Cursor is left to the .btn-p rule so the hover-device gate
                // there can do its job (an inline value would always win).
                style={{ border: 'none' }}
              >
                <span>{BOOK_CALL_LABEL}</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </button>
              {/* WARM — explore packages */}
              <a
                href={FREE_EDITS_URL}
                className="btn-o"
                data-cursor-hover
                onClick={() => trackPilotClick('hero_secondary_free_edits')}
              >
                {FREE_EDITS_LABEL}
              </a>
            </div>

            {/* The one published result, straight under the buttons on both
                sizes. Figures are the ones on the case study page. */}
            <p className="hero-proof">
              <Link href="/case-studies/magicbnb-seo-aeo" data-cursor-hover>
                MagicBNB went from 5.8 to 4,859 Google impressions a day in seven months. See the
                Search Console export, including what is still not working.
              </Link>
            </p>

          </div>

          <div ref={rightRef} className="hero-right" style={{ flexShrink: 0, width: '420px' }}>
            <HeroReel />
          </div>
        </div>

        {/* Full-width stats band */}
        <StatsBand />
      </section>

    </>
  );
}
