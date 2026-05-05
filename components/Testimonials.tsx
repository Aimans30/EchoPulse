'use client';

import { useRef, useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const testimonials = [
  { text: '"EchoPulse turned my raw footage into scroll-stopping content. Within 60 days my DMs were full of people asking how to work with me. Best investment I\'ve made in my brand."', initials: 'JM', name: 'Jake Morrison', role: 'Personal Brand, USA', stars: 5 },
  { text: '"The automation system they built saves 15 hours a week and books discovery calls while I sleep. I went from chasing clients to turning them away."', initials: 'SC', name: 'Sarah Chen', role: 'Course Creator, Singapore', stars: 5 },
  { text: '"My course launch made $80K in 7 days. I\'d tried twice before and barely hit $10K. The pre-launch content system EchoPulse built was the entire difference."', initials: 'AR', name: 'Amira Rahman', role: 'Course Creator, UAE', stars: 5 },
  { text: '"I went from 3K to 41K Instagram followers in 4 months. EchoPulse\'s content strategy is unlike anything I\'ve seen from other agencies. They actually understand creators."', initials: 'DK', name: 'Daniel Kim', role: 'Fitness Coach, Australia', stars: 5 },
  { text: '"They rebuilt my entire funnel and lead gen system. I\'m now getting 20-30 qualified leads per week without running a single ad. The ROI is insane."', initials: 'LB', name: 'Laura Bennett', role: 'Business Coach, UK', stars: 5 },
  { text: '"EchoPulse manages my community of 8,000 members and handles all my short-form content. My engagement went up 340% in the first 6 weeks."', initials: 'RO', name: 'Ryan O\'Brien', role: 'Online Coach, Canada', stars: 5 },
  { text: '"As a real estate agent, personal branding felt overwhelming. EchoPulse made it simple. I\'ve closed 4 deals this quarter directly from content they produced."', initials: 'MS', name: 'Marcus Silva', role: 'Real Estate Agent, USA', stars: 5 },
  { text: '"The speed ramp edits they produce are on a completely different level. My Reels went from 2K average views to 180K+ consistently. Clients are already messaging."', initials: 'PT', name: 'Priya Thakur', role: 'Mindset Coach, UK', stars: 5 },
  { text: '"I was skeptical about outsourcing content but EchoPulse changed everything. They understand my voice better than I do. My audience genuinely can\'t tell the difference."', initials: 'CM', name: 'Chris Mackay', role: 'Agency Owner, Australia', stars: 5 },
  { text: '"Worth every penny. We launched a podcast clip strategy and within 3 months had two brand partnership offers and a sold-out live event. Absolute game changer."', initials: 'NW', name: 'Nina Walsh', role: 'Speaker & Author, USA', stars: 5 },
];

// Split into two rows for the dual marquee
const row1 = testimonials.slice(0, 5);
const row2 = testimonials.slice(5, 10);

function TestiCard({ t }: { t: typeof testimonials[0] }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.07)',
      backdropFilter: 'blur(28px) saturate(180%)',
      WebkitBackdropFilter: 'blur(28px) saturate(180%)',
      border: '1px solid rgba(255,255,255,0.13)',
      borderRadius: '20px',
      padding: '32px 28px',
      boxShadow: '0 8px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.18)',
      width: '360px',
      flexShrink: 0,
      userSelect: 'none',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* subtle inner shine */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.22), transparent)', pointerEvents: 'none' }} />
      <div style={{ color: '#E8541A', fontSize: '13px', marginBottom: '18px', letterSpacing: '3px' }}>
        {'★'.repeat(t.stars)}
      </div>
      <p style={{ fontSize: '14px', lineHeight: 1.78, color: 'rgba(242,238,231,0.88)', margin: '0 0 28px', fontWeight: 400 }}>
        {t.text}
      </p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '18px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, color: '#F2EEE7', flexShrink: 0 }}>
          {t.initials}
        </div>
        <div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: '13px', color: '#F2EEE7', letterSpacing: '-0.2px' }}>{t.name}</div>
          <div style={{ fontSize: '11px', color: 'rgba(242,238,231,0.38)', marginTop: '2px' }}>{t.role}</div>
        </div>
      </div>
    </div>
  );
}

function TestimarqueeRow({ items, reverse = false }: { items: typeof testimonials; reverse?: boolean }) {
  const doubled = [...items, ...items];
  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <div
        style={{
          display: 'flex',
          gap: '16px',
          width: 'max-content',
          animation: `tscroll${reverse ? 'Rev' : ''} 40s linear infinite`,
        }}
      >
        {doubled.map((t, i) => (
          <TestiCard key={i} t={t} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section data-dark-bg="true" style={{ padding: '128px 0', background: 'linear-gradient(160deg, #111110 0%, #0d0c0a 50%, #160e07 100%)', overflow: 'hidden', position: 'relative' }}>
      {/* Ambient blobs */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-5%',  left: '-5%',  width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(232,84,26,0.15) 0%, transparent 70%)', filter: 'blur(70px)' }} />
        <div style={{ position: 'absolute', bottom: '-10%', right: '5%',  width: '460px', height: '460px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.12) 0%, transparent 70%)', filter: 'blur(70px)' }} />
        <div style={{ position: 'absolute', top: '40%',  right: '30%', width: '320px', height: '320px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      </div>

      <style>{`
        @keyframes tscroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes tscrollRev {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .testi-row-wrap:hover div { animation-play-state: paused; }
        @media(max-width:640px) {
          .testi-header { padding: 0 24px !important; }
          .testi-footer { padding: 40px 24px 0 !important; }
        }
      `}</style>

      {/* Header */}
      <div className="testi-header" style={{ padding: '0 56px', marginBottom: '64px', position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(242,238,231,0.35)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}
        >
          <span style={{ width: '22px', height: '1px', background: '#E8541A', display: 'block' }} />
          Client Love
        </motion.div>

        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(36px, 4.5vw, 72px)', fontWeight: 900, letterSpacing: '-3px', lineHeight: 1.02, margin: 0, color: '#F2EEE7' }}
          >
            What clients say.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ display: 'flex', gap: '32px', flexShrink: 0 }}
          >
            {[{ n: '98%', l: 'Client satisfaction' }, { n: '200+', l: 'Happy clients' }, { n: '4.9★', l: 'Average rating' }].map(s => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'Inter', fontSize: '24px', fontWeight: 900, letterSpacing: '-1px', color: '#F2EEE7' }}>
                  {s.n.includes('★')
                    ? <>{s.n.replace('★', '')}<span style={{ color: '#E8541A' }}>★</span></>
                    : <>{s.n.replace('%', '')}<span style={{ color: '#E8541A' }}>{s.n.includes('%') ? '%' : '+'}</span></>
                  }
                </div>
                <div style={{ fontSize: '10px', color: 'rgba(242,238,231,0.35)', marginTop: '3px', fontWeight: 500, whiteSpace: 'nowrap' }}>{s.l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Row 1 — left to right */}
      <div className="testi-row-wrap" style={{ marginBottom: '16px', position: 'relative', zIndex: 1 }}>
        <TestimarqueeRow items={row1} />
      </div>

      {/* Row 2 — right to left */}
      <div className="testi-row-wrap" style={{ position: 'relative', zIndex: 1 }}>
        <TestimarqueeRow items={row2} reverse />
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="testi-footer"
        style={{ padding: '56px 56px 0', display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 1 }}
      >
        <a
          href="https://echopulse.media"
          target="_blank"
          rel="noopener noreferrer"
          style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.15)', color: '#F2EEE7', padding: '15px 32px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, textDecoration: 'none', fontFamily: 'Inter, sans-serif', display: 'inline-flex', alignItems: 'center', gap: '8px', cursor: 'none', transition: 'all 0.3s' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#E8541A'; (e.currentTarget as HTMLElement).style.borderColor = '#E8541A'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.15)'; }}
        >
          Read More Client Stories
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </a>
      </motion.div>
    </section>
  );
}
