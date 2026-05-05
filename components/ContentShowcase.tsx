'use client';

import { motion } from 'framer-motion';

const painPoints = [
  { before: 'Posting consistently but getting no traction', after: 'Content that compounds views every week' },
  { before: 'Spending hours editing with no results', after: 'Done-for-you in 48 hrs, you just approve' },
  { before: 'Chasing clients with paid ads', after: 'Inbound leads while you sleep via automation' },
  { before: 'Launching to crickets every time', after: 'Pre-built audience ready to buy on day one' },
];

const proofStats = [
  { value: '$4.2M+', label: 'Revenue generated' },
  { value: '200+', label: 'Brands scaled' },
  { value: '22 days', label: 'Avg. time to results' },
];

export default function ContentShowcase() {
  return (
    <section className="showcase-section" style={{ padding: '120px 56px', background: 'var(--cream)', position: 'relative', overflow: 'hidden' }}>
      <style>{`
        .showcase-wrap { display:flex; align-items:stretch; gap:56px; max-width:1280px; margin:0 auto; }
        .showcase-right-panel { flex-shrink:0; width:440px; display:flex; flex-direction:column; gap:16px; }
        @media(max-width:1060px){ .showcase-right-panel{ width:380px; } }
        @media(max-width:900px){ .showcase-right-panel{ display:none!important; } }
        @media(max-width:640px){ .showcase-wrap{ padding:0!important; } .showcase-section{ padding:80px 24px!important; } }

        .pain-row { display:flex; align-items:flex-start; gap:14px; padding:16px 0; border-bottom:1px solid rgba(12,12,11,0.07); }
        .pain-row:last-child { border-bottom:none; }

        .cta-primary {
          background:#0C0C0B; color:#F2EEE7;
          border:none; padding:17px 32px; border-radius:100px;
          font-size:14px; font-weight:700; cursor:none;
          text-decoration:none; display:inline-flex; align-items:center; gap:10px;
          font-family:Inter,sans-serif; transition:all 0.35s cubic-bezier(0.16,1,0.3,1);
          position:relative; overflow:hidden;
        }
        .cta-primary::before { content:''; position:absolute; inset:0; background:#E8541A; transform:translateX(-101%); transition:transform 0.4s cubic-bezier(0.16,1,0.3,1); z-index:0; }
        .cta-primary:hover::before { transform:translateX(0); }
        .cta-primary:hover { transform:scale(1.03); box-shadow:0 8px 32px rgba(232,84,26,0.28); }
        .cta-primary span, .cta-primary svg { position:relative; z-index:1; }

        .cta-secondary {
          background:transparent; color:#0C0C0B;
          border:1.5px solid rgba(12,12,11,0.14); padding:17px 28px; border-radius:100px;
          font-size:14px; font-weight:700; cursor:none;
          text-decoration:none; display:inline-flex; align-items:center; gap:8px;
          font-family:Inter,sans-serif; transition:all 0.3s;
        }
        .cta-secondary:hover { background:#0C0C0B; color:#F2EEE7; border-color:#0C0C0B; }

        .stat-card {
          background:rgba(255,255,255,0.72);
          backdropFilter:blur(24px);
          -webkit-backdrop-filter:blur(24px);
          border:1px solid rgba(255,255,255,0.9);
          border-radius:18px;
          padding:28px 32px;
          box-shadow:0 4px 24px rgba(12,12,11,0.06), inset 0 1px 0 rgba(255,255,255,0.95);
        }
      `}</style>

      {/* Subtle bg bloom */}
      <div style={{ position:'absolute', top:'10%', right:'5%', width:'560px', height:'400px', borderRadius:'50%', background:'radial-gradient(ellipse, rgba(232,84,26,0.07) 0%, transparent 70%)', filter:'blur(70px)', pointerEvents:'none' }} />

      <div className="showcase-wrap">

        {/* ── LEFT ── */}
        <div style={{ flex:'1 1 0', minWidth:0, position:'relative', zIndex:1 }}>

          {/* Eyebrow */}
          <motion.div
            initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'28px' }}
          >
            <span style={{ width:'22px', height:'1px', background:'#E8541A', display:'block' }} />
            <span style={{ fontSize:'10px', fontWeight:700, letterSpacing:'4px', textTransform:'uppercase', color:'#A8A49B' }}>
              Stop Guessing. Start Growing.
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h2
            initial={{ opacity:0, y:28 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ duration:0.8, ease:[0.16,1,0.3,1] }}
            style={{ fontFamily:'Inter,sans-serif', fontSize:'clamp(38px,5vw,72px)', fontWeight:900, letterSpacing:'-2.5px', lineHeight:0.96, color:'#0C0C0B', margin:'0 0 24px' }}
          >
            Your brand deserves<br />
            a team that<br />
            <span style={{ color:'#E8541A', fontStyle:'italic' }}>actually delivers.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ delay:0.15, duration:0.7 }}
            style={{ fontSize:'16px', color:'#6E6B63', lineHeight:1.75, maxWidth:'440px', margin:'0 0 40px' }}
          >
            One free strategy call. We map out your entire content and growth system — no fluff, no sales pitch. Just a clear plan you can use whether you work with us or not.
          </motion.p>

          {/* Pain → Gain rows */}
          <motion.div
            initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            transition={{ delay:0.2 }}
            style={{ marginBottom:'44px' }}
          >
            {painPoints.map((p, i) => (
              <motion.div
                key={i}
                className="pain-row"
                initial={{ opacity:0, x:-12 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                transition={{ delay:0.25 + i*0.08, duration:0.5, ease:[0.16,1,0.3,1] }}
              >
                {/* Before */}
                <div style={{ flex:1, fontSize:'13px', color:'#A8A49B', textDecoration:'line-through', lineHeight:1.5, paddingTop:'2px' }}>
                  {p.before}
                </div>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink:0, marginTop:'2px' }}>
                  <path d="M5 12h14M13 6l6 6-6 6" stroke="#E8541A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {/* After */}
                <div style={{ flex:1, fontSize:'13px', color:'#0C0C0B', fontWeight:600, lineHeight:1.5, paddingTop:'2px' }}>
                  {p.after}
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ delay:0.5 }}
            style={{ display:'flex', gap:'12px', flexWrap:'wrap', alignItems:'center' }}
          >
            <a href="https://echopulse.media" target="_blank" rel="noopener noreferrer" className="cta-primary">
              <span>Book a Free Strategy Call</span>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="#work" className="cta-secondary">
              See Our Work
            </a>
          </motion.div>

          {/* Availability nudge */}
          <motion.div
            initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }}
            transition={{ delay:0.62 }}
            style={{ display:'flex', alignItems:'center', gap:'8px', marginTop:'20px' }}
          >
            <div style={{ width:'7px', height:'7px', borderRadius:'50%', background:'#10b981', animation:'bdot 2s ease-in-out infinite', flexShrink:0 }} />
            <span style={{ fontSize:'12px', color:'#A8A49B', fontWeight:500 }}>
              Only <strong style={{ color:'#0C0C0B' }}>3 client spots</strong> available this month — strategy calls are free, but limited.
            </span>
          </motion.div>
        </div>

        {/* ── RIGHT ── */}
        <motion.div
          className="showcase-right-panel"
          initial={{ opacity:0, x:28 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
          transition={{ duration:0.9, ease:[0.16,1,0.3,1] }}
          style={{ position:'relative', zIndex:1 }}
        >
          {/* Proof stats */}
          <div style={{ background:'#0C0C0B', borderRadius:'22px', padding:'36px 32px', boxShadow:'0 20px 60px rgba(12,12,11,0.18)' }}>
            <div style={{ fontSize:'10px', fontWeight:700, letterSpacing:'3px', textTransform:'uppercase', color:'rgba(242,238,231,0.32)', marginBottom:'24px' }}>
              Client Results
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'8px', marginBottom:'32px' }}>
              {proofStats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity:0, y:12 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
                  transition={{ delay:0.3 + i*0.1 }}
                  style={{ textAlign:'center', padding:'16px 8px', background:'rgba(255,255,255,0.04)', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.06)' }}
                >
                  <div style={{ fontFamily:'Inter,sans-serif', fontSize:'20px', fontWeight:900, letterSpacing:'-1px', color:'#F2EEE7', lineHeight:1 }}>{s.value}</div>
                  <div style={{ fontSize:'9px', color:'rgba(242,238,231,0.32)', marginTop:'6px', fontWeight:500, lineHeight:1.4 }}>{s.label}</div>
                </motion.div>
              ))}
            </div>

            {/* Transformation examples */}
            <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
              {[
                { name:'Jake M.', result:'2K → 22K followers', time:'90 days', color:'#E8541A' },
                { name:'Amira R.', result:'$80K course launch', time:'7 days', color:'#10b981' },
                { name:'Laura B.', result:'20–30 leads/week', time:'60 days', color:'#8b5cf6' },
              ].map((c, i) => (
                <motion.div
                  key={c.name}
                  initial={{ opacity:0, x:10 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }}
                  transition={{ delay:0.4 + i*0.1 }}
                  style={{ display:'flex', alignItems:'center', gap:'12px', padding:'12px 14px', background:'rgba(255,255,255,0.04)', borderRadius:'12px', border:'1px solid rgba(255,255,255,0.05)' }}
                >
                  <div style={{ width:'32px', height:'32px', borderRadius:'50%', background:`${c.color}22`, border:`1px solid ${c.color}44`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:800, color:c.color, flexShrink:0 }}>
                    {c.name[0]}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:'12px', fontWeight:700, color:'#F2EEE7', letterSpacing:'-0.2px' }}>{c.result}</div>
                    <div style={{ fontSize:'10px', color:'rgba(242,238,231,0.32)', marginTop:'2px' }}>{c.name} · {c.time}</div>
                  </div>
                  <div style={{ fontSize:'10px', fontWeight:700, color:c.color, flexShrink:0 }}>✓</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* CTA card */}
          <motion.div
            initial={{ opacity:0, y:16 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }}
            transition={{ delay:0.55 }}
            style={{
              background:'rgba(255,255,255,0.75)',
              backdropFilter:'blur(28px) saturate(160%)',
              WebkitBackdropFilter:'blur(28px) saturate(160%)',
              border:'1px solid rgba(255,255,255,0.92)',
              borderRadius:'22px',
              padding:'32px',
              boxShadow:'0 8px 40px rgba(12,12,11,0.08), inset 0 1px 0 rgba(255,255,255,1)',
            }}
          >
            <div style={{ fontSize:'16px', fontWeight:800, color:'#0C0C0B', letterSpacing:'-0.4px', marginBottom:'8px', fontFamily:'Inter,sans-serif' }}>
              Ready to stop guessing?
            </div>
            <div style={{ fontSize:'13px', color:'#6E6B63', lineHeight:1.65, marginBottom:'22px' }}>
              45-minute call. We audit your content, show you exactly what's missing, and give you a growth plan — free.
            </div>
            <a
              href="https://echopulse.media"
              target="_blank"
              rel="noopener noreferrer"
              style={{ display:'block', textAlign:'center', background:'#E8541A', color:'#fff', padding:'14px 24px', borderRadius:'100px', fontSize:'13px', fontWeight:700, textDecoration:'none', fontFamily:'Inter,sans-serif', cursor:'none', transition:'all 0.3s', boxShadow:'0 6px 24px rgba(232,84,26,0.3)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background='#d94a14'; (e.currentTarget as HTMLElement).style.transform='scale(1.02)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background='#E8541A'; (e.currentTarget as HTMLElement).style.transform='scale(1)'; }}
            >
              Book My Free Strategy Call →
            </a>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'center', gap:'6px', marginTop:'14px' }}>
              <div style={{ width:'5px', height:'5px', borderRadius:'50%', background:'#10b981' }} />
              <span style={{ fontSize:'10px', color:'#A8A49B', fontWeight:500 }}>No commitment. No pitch. Just clarity.</span>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}
