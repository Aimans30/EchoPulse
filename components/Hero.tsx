'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';

/* ─── Stats ─── */
const stats = [
  { num: '500', suffix: '+', label: 'Videos Produced' },
  { num: '10',  suffix: 'M+', label: 'Total Views' },
  { num: '98',  suffix: '%',  label: 'Satisfaction' },
  { num: '7',   suffix: '',   label: 'Countries' },
];

/* ─── Right Panel ─── */
const TABS = ['Services', 'Results', 'Automation'];
const TAB_DURATION = 5000;

const services = [
  { icon: '🎬', name: 'Video Editing',  tag: 'Short & Long-form', color: '#E8541A' },
  { icon: '🤖', name: 'Automations',    tag: 'ManyChat · CRM',    color: '#8b5cf6' },
  { icon: '✨', name: 'Personal Brand', tag: 'Strategy + Identity',color: '#f59e0b' },
  { icon: '🌐', name: 'Websites',       tag: 'Funnels + Lead Pages',color: '#3b82f6' },
  { icon: '👥', name: 'Community',      tag: 'Engagement + Retention',color: '#10b981' },
  { icon: '🎯', name: 'Lead Gen',       tag: 'Organic + Inbound',  color: '#E8541A' },
];

const results = [
  { name: 'Jake M.',   handle: 'Personal Brand', stat: '2K → 22K', label: 'followers', pct: 91,  color: '#E8541A' },
  { name: 'Amira R.',  handle: 'Course Creator', stat: '$80K',      label: 'in 7 days', pct: 78,  color: '#10b981' },
  { name: 'Laura B.',  handle: 'Business Coach', stat: '30 leads',  label: 'per week',  pct: 65,  color: '#8b5cf6' },
  { name: 'Daniel K.', handle: 'Fitness Coach',  stat: '180K',      label: 'views/reel',pct: 84,  color: '#f59e0b' },
];

const flow = [
  { n: '01', icon: '📲', label: 'Content Drops',     sub: 'Reels, clips & long-form',      color: '#E8541A' },
  { n: '02', icon: '📈', label: 'Audience Grows',    sub: '180K+ avg views per reel',      color: '#f59e0b' },
  { n: '03', icon: '💬', label: 'DMs Auto-Handled',  sub: 'ManyChat + email sequences',    color: '#8b5cf6' },
  { n: '04', icon: '📅', label: 'Calls Auto-Booked', sub: 'Calendar fills while you sleep',color: '#3b82f6' },
  { n: '05', icon: '💰', label: 'Revenue Comes In',  sub: 'Zero paid ads required',        color: '#10b981' },
];

function ServicesTab() {
  return (
    <motion.div key="s" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}>
      <p style={{ fontSize:'11px', fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:'#A8A49B', margin:'0 0 18px' }}>Everything included</p>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px' }}>
        {services.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
            transition={{ delay: i*0.055, duration:0.35, ease:[0.16,1,0.3,1] }}
            style={{ display:'flex', alignItems:'center', gap:'11px', padding:'13px 14px', background:`${s.color}08`, border:`1px solid ${s.color}18`, borderRadius:'14px' }}
          >
            <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:`${s.color}14`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'16px', flexShrink:0 }}>
              {s.icon}
            </div>
            <div>
              <div style={{ fontSize:'12px', fontWeight:800, color:'#0C0C0B', letterSpacing:'-0.2px', lineHeight:1.2 }}>{s.name}</div>
              <div style={{ fontSize:'9.5px', color:'#A8A49B', marginTop:'2px', fontWeight:500 }}>{s.tag}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function ResultsTab() {
  return (
    <motion.div key="r" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}>
      <p style={{ fontSize:'11px', fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:'#A8A49B', margin:'0 0 18px' }}>Real client results</p>
      <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
        {results.map((r, i) => (
          <motion.div
            key={r.name}
            initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
            transition={{ delay: i*0.07, duration:0.4, ease:[0.16,1,0.3,1] }}
            style={{ display:'flex', alignItems:'center', gap:'12px' }}
          >
            <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:`${r.color}18`, border:`1.5px solid ${r.color}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:800, color:r.color, flexShrink:0 }}>
              {r.name.split(' ').map(w=>w[0]).join('')}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:'5px' }}>
                <span style={{ fontSize:'11px', fontWeight:700, color:'#0C0C0B' }}>{r.name} <span style={{ fontWeight:400, color:'#A8A49B' }}>· {r.handle}</span></span>
                <span style={{ fontSize:'12px', fontWeight:900, color:r.color, letterSpacing:'-0.4px' }}>{r.stat} <span style={{ fontSize:'9px', fontWeight:500, color:'#A8A49B' }}>{r.label}</span></span>
              </div>
              <div style={{ height:'3px', background:'rgba(12,12,11,0.07)', borderRadius:'2px', overflow:'hidden' }}>
                <motion.div initial={{ width:0 }} animate={{ width:`${r.pct}%` }} transition={{ duration:0.8, delay:i*0.09, ease:[0.16,1,0.3,1] }}
                  style={{ height:'100%', background:`linear-gradient(90deg,${r.color},${r.color}99)`, borderRadius:'2px' }} />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

function AutomationTab() {
  return (
    <motion.div key="a" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} transition={{ duration:0.3 }}>
      <p style={{ fontSize:'11px', fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:'#A8A49B', margin:'0 0 16px' }}>Your funnel on autopilot</p>
      <div style={{ position:'relative' }}>
        {/* Vertical connector */}
        <div style={{ position:'absolute', left:'17px', top:'18px', bottom:'18px', width:'1.5px', background:'linear-gradient(to bottom,#E8541A22,#10b98122)', borderRadius:'2px' }} />
        <div style={{ display:'flex', flexDirection:'column', gap:'4px' }}>
          {flow.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity:0, x:-10 }} animate={{ opacity:1, x:0 }}
              transition={{ delay:i*0.08, duration:0.38, ease:[0.16,1,0.3,1] }}
              style={{ display:'flex', alignItems:'center', gap:'14px', padding:'9px 10px', borderRadius:'12px', background: i===0 ? `${step.color}08` : 'transparent', transition:'background 0.2s' }}
            >
              <div style={{ width:'34px', height:'34px', borderRadius:'10px', background:`${step.color}14`, border:`1px solid ${step.color}25`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'15px', flexShrink:0, position:'relative', zIndex:1 }}>
                {step.icon}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'12px', fontWeight:800, color:'#0C0C0B', letterSpacing:'-0.2px' }}>{step.label}</div>
                <div style={{ fontSize:'10px', color:'#A8A49B', marginTop:'1px' }}>{step.sub}</div>
              </div>
              <div style={{ fontSize:'9px', fontWeight:800, color:`${step.color}`, background:`${step.color}12`, padding:'3px 8px', borderRadius:'100px', flexShrink:0 }}>{step.n}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function RightPanel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(() => setActive(p => (p + 1) % TABS.length), TAB_DURATION);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [paused, active]);

  const handleTab = (i: number) => {
    setActive(i);
    if (timerRef.current) clearInterval(timerRef.current);
    setPaused(false);
  };

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} style={{ width:'100%' }}>
      {/* Segmented tab selector */}
      <div style={{ display:'inline-flex', background:'rgba(12,12,11,0.06)', borderRadius:'100px', padding:'3px', gap:'2px', marginBottom:'16px' }}>
        {TABS.map((tab, i) => (
          <button key={tab} onClick={() => handleTab(i)} style={{
            padding:'7px 18px', borderRadius:'100px', fontSize:'11px', fontWeight:700,
            border:'none', outline:'none', cursor:'none', fontFamily:'Inter,sans-serif',
            transition:'all 0.28s cubic-bezier(0.16,1,0.3,1)',
            background: active===i ? '#0C0C0B' : 'transparent',
            color: active===i ? '#F2EEE7' : '#6E6B63',
            boxShadow: active===i ? '0 2px 10px rgba(12,12,11,0.18)' : 'none',
          }}>{tab}</button>
        ))}
      </div>

      {/* Card */}
      <div style={{
        background:'rgba(255,255,255,0.82)',
        backdropFilter:'blur(36px) saturate(180%)',
        WebkitBackdropFilter:'blur(36px) saturate(180%)',
        border:'1px solid rgba(255,255,255,0.96)',
        borderRadius:'22px',
        padding:'26px',
        boxShadow:'0 12px 56px rgba(12,12,11,0.10), inset 0 1px 0 rgba(255,255,255,1)',
        position:'relative',
        overflow:'hidden',
        minHeight:'330px',
      }}>
        {/* Progress bar */}
        {!paused && (
          <motion.div key={active} initial={{ scaleX:0 }} animate={{ scaleX:1 }}
            transition={{ duration:TAB_DURATION/1000, ease:'linear' }}
            style={{ position:'absolute', top:0, left:0, right:0, height:'2px', background:'linear-gradient(90deg,#E8541A,#ff8c5a)', transformOrigin:'left' }}
          />
        )}
        <AnimatePresence mode="wait">
          {active===0 && <ServicesTab />}
          {active===1 && <ResultsTab />}
          {active===2 && <AutomationTab />}
        </AnimatePresence>
      </div>

      {/* Pill indicators */}
      <div style={{ display:'flex', justifyContent:'center', gap:'5px', marginTop:'12px' }}>
        {TABS.map((_, i) => (
          <button key={i} onClick={() => handleTab(i)} style={{
            width: active===i ? '22px' : '5px', height:'5px', borderRadius:'3px', padding:0, border:'none', outline:'none', cursor:'none',
            background: active===i ? '#E8541A' : 'rgba(12,12,11,0.12)',
            transition:'all 0.35s cubic-bezier(0.16,1,0.3,1)',
          }} />
        ))}
      </div>
    </div>
  );
}

/* ─── Hero ─── */
export default function Hero() {
  const wrapRef      = useRef<HTMLDivElement>(null);
  const eyebrowRef   = useRef<HTMLDivElement>(null);
  const headlineRef  = useRef<HTMLHeadingElement>(null);
  const subRef       = useRef<HTMLParagraphElement>(null);
  const actionsRef   = useRef<HTMLDivElement>(null);
  const statsRef     = useRef<HTMLDivElement>(null);
  const rightRef     = useRef<HTMLDivElement>(null);

  /* GSAP entry animation */
  useEffect(() => {
    const lines = headlineRef.current?.querySelectorAll('.hl-inner');
    const tl = gsap.timeline({ delay: 1.2 });
    tl.fromTo('#grid-bg',      { opacity: 0 }, { opacity: 1, duration: 1.5 })
      .fromTo(eyebrowRef.current,  { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.9')
      .fromTo(lines ?? [],         { y: '110%' },          { y: '0%', duration: 0.95, ease: 'power3.out', stagger: 0.1 }, '-=0.4')
      .fromTo([subRef.current, actionsRef.current], { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', stagger: 0.12 }, '-=0.4')
      .fromTo(statsRef.current,    { y: 12, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' }, '-=0.4')
      .fromTo(rightRef.current,    { x: 24, opacity: 0 }, { x: 0, opacity: 1, duration: 0.9, ease: 'power3.out' }, '-=0.9');
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
        .hero-badge { display:inline-flex;align-items:center;gap:7px;padding:5px 14px 5px 8px;background:rgba(232,84,26,0.09);border:1px solid rgba(232,84,26,0.22);border-radius:100px;font-size:11px;font-weight:700;color:#E8541A; }
        .badge-dot  { width:6px;height:6px;border-radius:50%;background:#E8541A;animation:bdot 2s ease-in-out infinite; }
        @keyframes bdot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.6)}}

        /* hl-wrap: extra room so ascenders and descenders aren't clipped */
        .hl-wrap  { display:block; overflow:hidden; padding-top:0.12em; margin-top:-0.12em; padding-bottom:0.18em; margin-bottom:-0.18em; }
        .hl-inner { display:block; }

        .btn-p { background:#0C0C0B;color:#F2EEE7;border:none;padding:15px 28px;border-radius:100px;font-size:13px;font-weight:700;cursor:none;text-decoration:none;display:inline-flex;align-items:center;gap:8px;font-family:Inter,sans-serif;transition:all 0.3s cubic-bezier(0.16,1,0.3,1);position:relative;overflow:hidden; }
        .btn-p::before{content:'';position:absolute;inset:0;background:#E8541A;transform:translateX(-101%);transition:transform 0.4s cubic-bezier(0.16,1,0.3,1);z-index:0;}
        .btn-p:hover::before{transform:translateX(0);}
        .btn-p:hover{transform:scale(1.03);box-shadow:0 8px 30px rgba(232,84,26,0.28);}
        .btn-p span,.btn-p svg{position:relative;z-index:1;}
        .btn-o{background:rgba(255,255,255,0.55);backdrop-filter:blur(12px);color:#0C0C0B;border:1px solid rgba(12,12,11,0.13);padding:15px 28px;border-radius:100px;font-size:13px;font-weight:700;cursor:none;text-decoration:none;display:inline-block;font-family:Inter,sans-serif;transition:all 0.3s;}
        .btn-o:hover{background:#0C0C0B;color:#F2EEE7;border-color:#0C0C0B;}
        .stat-sep{width:1px;height:32px;background:rgba(12,12,11,0.09);flex-shrink:0;}
        .scroll-hint{position:absolute;bottom:24px;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:6px;color:#A8A49B;font-size:9px;letter-spacing:3px;text-transform:uppercase;font-weight:600;}
        .scroll-line{width:1px;height:28px;background:linear-gradient(to bottom,#E8541A,transparent);animation:sline 1.8s ease-in-out infinite;}
        @keyframes sline{0%{transform:scaleY(0);transform-origin:top}50%{transform:scaleY(1);transform-origin:top}51%{transform-origin:bottom}100%{transform:scaleY(0);transform-origin:bottom}}
        @media(max-width:860px){.hero-right{display:none!important;}.hero-inner{gap:0!important;}}
        @media(max-width:640px){
          .hero-inner{padding:100px 24px 60px!important;}
          .stat-sep{display:none;}
          .hero-stats{flex-wrap:wrap!important;gap:20px!important;}
          .hero-stat-item{padding:0!important;border-left:none!important;}
        }
      `}</style>

      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', position: 'relative', overflowX: 'clip' }}>
        <div id="grid-bg" />

        <div
          ref={wrapRef}
          className="hero-inner"
          style={{ width: '100%', maxWidth: '1280px', margin: '0 auto', padding: '120px 56px 80px', display: 'flex', alignItems: 'center', gap: '64px', position: 'relative', zIndex: 1 }}
        >
          {/* LEFT */}
          <div style={{ flex: '1 1 0', minWidth: 0 }}>
            <div ref={eyebrowRef} />

            <h1
              ref={headlineRef}
              style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(48px, 6.5vw, 96px)', fontWeight: 900, lineHeight: 0.92, letterSpacing: '-3.5px', margin: '0 0 36px' }}
            >
              {[
                <>Your brand.</>,
                <><span style={{ color: '#E8541A', fontStyle: 'italic' }}>Seen</span> by</>,
                <>everyone.</>,
              ].map((line, i) => (
                <span key={i} className="hl-wrap">
                  <span className="hl-inner">{line}</span>
                </span>
              ))}
            </h1>

            <p ref={subRef} style={{ fontSize: '16px', color: '#6E6B63', maxWidth: '400px', lineHeight: 1.75, fontWeight: 400, margin: '0 0 36px', opacity: 0 }}>
              Video editing, automations, funnels, and brand strategy —{' '}
              <strong style={{ color: '#0C0C0B', fontWeight: 600 }}>done for you, end to end.</strong>{' '}
              No hiring. No managing. Just growth.
            </p>

            <div ref={actionsRef} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '52px', opacity: 0, alignItems: 'center' }}>
              <a href="https://echopulse.media" target="_blank" rel="noopener noreferrer" className="btn-p">
                <span>Book a Free Strategy Call</span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <a href="#work" className="btn-o">See Our Work</a>
              <span style={{ fontSize: '11px', color: '#A8A49B', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981', display: 'inline-block', flexShrink: 0 }} />
                3 spots left this month
              </span>
            </div>

            <div ref={statsRef} style={{ opacity: 0 }}>
              <div className="hero-stats" style={{ display: 'flex', gap: '0', flexWrap: 'wrap' }}>
                {stats.map((s, i) => (
                  <div key={s.label} style={{ display: 'flex', alignItems: 'center' }}>
                    <div className="hero-stat-item" style={{ padding: i === 0 ? '0 32px 0 0' : '0 32px', borderLeft: i > 0 ? '1px solid rgba(12,12,11,0.08)' : 'none' }}>
                      <div style={{ fontFamily: 'Inter', fontSize: 'clamp(24px, 2.6vw, 40px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1 }}>
                        {s.num}<span style={{ color: '#E8541A' }}>{s.suffix}</span>
                      </div>
                      <div style={{ fontSize: '11px', color: '#A8A49B', marginTop: '5px', fontWeight: 500, letterSpacing: '0.2px' }}>{s.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div ref={rightRef} className="hero-right" style={{ flexShrink: 0, width: '420px', opacity: 0 }}>
            <RightPanel />
          </div>
        </div>

        <div className="scroll-hint">
          <div className="scroll-line" />
          Scroll
        </div>
      </section>
    </>
  );
}
