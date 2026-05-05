'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';

const cards = [
  {
    num: '01', icon: '⚡', title: 'Personal Brands',
    desc: 'Founders, speakers, and consultants building authority through video and content that commands premium rates.',
    tag: 'Our Specialty', tagColor: '#E8541A',
    gradient: 'radial-gradient(circle at 80% 20%, rgba(232,84,26,0.12) 0%, transparent 60%)',
    accentLine: '#E8541A',
  },
  {
    num: '02', icon: '🎓', title: 'Course Creators',
    desc: 'Educators who need content that pre-sells, launches, and fills their courses on repeat without burnout.',
    tag: 'High ROI', tagColor: '#8b5cf6',
    gradient: 'radial-gradient(circle at 80% 20%, rgba(139,92,246,0.10) 0%, transparent 60%)',
    accentLine: '#8b5cf6',
  },
  {
    num: '03', icon: '🏋️', title: 'Online Coaches',
    desc: 'Fitness, business, and mindset coaches who need a system that brings in new clients every single month.',
    tag: 'Fast Results', tagColor: '#10b981',
    gradient: 'radial-gradient(circle at 80% 20%, rgba(16,185,129,0.10) 0%, transparent 60%)',
    accentLine: '#10b981',
  },
  {
    num: '04', icon: '🏠', title: 'Real Estate Agents',
    desc: 'Agents who know that personal branding is the unfair advantage where trust wins deals and referrals multiply.',
    tag: 'Growing Fast', tagColor: '#f59e0b',
    gradient: 'radial-gradient(circle at 80% 20%, rgba(245,158,11,0.10) 0%, transparent 60%)',
    accentLine: '#f59e0b',
  },
  {
    num: '05', icon: '🚀', title: 'Agencies & Service Biz',
    desc: 'Agency owners who want inbound leads from content instead of burning budget on cold outreach.',
    tag: 'Scaling', tagColor: '#3b82f6',
    gradient: 'radial-gradient(circle at 80% 20%, rgba(59,130,246,0.10) 0%, transparent 60%)',
    accentLine: '#3b82f6',
  },
  {
    num: '?', icon: '💬', title: 'Sound Like You?',
    desc: 'Building a brand online and need a team that handles content so you can focus on what you do best?',
    tag: null, tagColor: '#E8541A',
    gradient: null,
    accentLine: '#E8541A',
    dark: true, cta: true,
  },
];

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } },
};

export default function WhoWeWorkWith() {
  return (
    <section style={{ padding: '128px 56px', position: 'relative', overflow: 'hidden' }}>
      {/* Subtle background gradient */}
      <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(232,84,26,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

      <style>{`
        .wwww-card {
          position: relative;
          border-radius: 20px;
          padding: 40px 36px;
          overflow: hidden;
          cursor: none;
          transition: box-shadow 0.4s cubic-bezier(0.16,1,0.3,1);
        }
        .wwww-card-light {
          background: rgba(255,255,255,0.58);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(255,255,255,0.82);
          box-shadow: 0 4px 24px rgba(12,12,11,0.06), 0 1px 0 rgba(255,255,255,0.95) inset;
        }
        .wwww-card-light:hover {
          box-shadow: 0 20px 60px rgba(12,12,11,0.11), 0 1px 0 rgba(255,255,255,0.95) inset;
        }
        .wwww-card-dark {
          background: rgba(12,12,11,0.88);
          backdrop-filter: blur(28px);
          -webkit-backdrop-filter: blur(28px);
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0 4px 32px rgba(12,12,11,0.28);
        }
        .wwww-card-dark:hover {
          box-shadow: 0 20px 60px rgba(12,12,11,0.4);
        }
        /* shimmer sweep */
        .wwww-card-light::after {
          content: '';
          position: absolute;
          top: 0; left: -100%; width: 60%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
          transition: left 0.7s ease;
          pointer-events: none;
        }
        .wwww-card-light:hover::after { left: 150%; }

        /* accent bottom bar */
        .wwww-accent-bar {
          position: absolute;
          bottom: 0; left: 0; right: 0; height: 3px;
          transform: scaleX(0);
          transform-origin: left;
          border-radius: 0 0 20px 20px;
          transition: transform 0.45s cubic-bezier(0.16,1,0.3,1);
        }
        .wwww-card:hover .wwww-accent-bar { transform: scaleX(1); }

        /* floating animation */
        @keyframes float-a { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-8px)} }
        @keyframes float-b { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .float-a { animation: float-a 5s ease-in-out infinite; }
        .float-b { animation: float-b 6.5s ease-in-out 1s infinite; }

        .icp-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 18px;
          margin-top: 64px;
        }
        @media(max-width:1200px){ .icp-grid{ grid-template-columns:repeat(2,1fr)!important; } }
        @media(max-width:640px){ .icp-grid{ grid-template-columns:1fr!important; } }
        @media(max-width:768px){ section{ padding:80px 28px!important; } }
      `}</style>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '4px', textTransform: 'uppercase', color: '#6E6B63', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '14px' }}
      >
        <span style={{ width: '22px', height: '1px', background: '#E8541A', display: 'block' }} />
        Who We Work With
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}
      >
        <h2 style={{ fontFamily: 'Inter, sans-serif', fontSize: 'clamp(36px, 4.5vw, 64px)', fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 1.02, margin: 0 }}>
          Built for people<br />
          who <span style={{ color: '#E8541A' }}>create online.</span>
        </h2>
        <p style={{ maxWidth: '280px', color: '#6E6B63', fontSize: '14px', lineHeight: 1.75, margin: 0 }}>
          One agency. Every type of creator. We specialise in turning expertise into content that compounds.
        </p>
      </motion.div>

      {/* Grid */}
      <motion.div
        className="icp-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-60px' }}
      >
        {cards.map((card, i) => (
          <motion.div
            key={card.num}
            variants={cardVariants}
            className={`wwww-card ${card.dark ? 'wwww-card-dark float-b' : 'wwww-card-light float-a'}`}
            style={{ animationDelay: `${i * 0.3}s` }}
            whileHover={{ y: -8 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            data-cursor-hover
          >
            {/* Inner gradient radial */}
            {card.gradient && (
              <div style={{ position: 'absolute', inset: 0, background: card.gradient, pointerEvents: 'none', borderRadius: '20px' }} />
            )}
            {card.dark && (
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at 80% 20%, rgba(232,84,26,0.08) 0%, transparent 60%)', pointerEvents: 'none', borderRadius: '20px' }} />
            )}

            {/* Accent bar */}
            <div className="wwww-accent-bar" style={{ background: `linear-gradient(90deg, ${card.accentLine}, ${card.accentLine}99)` }} />

            {/* Corner decoration */}
            <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '120px', height: '120px', borderRadius: '50%', background: `${card.accentLine}10`, filter: 'blur(30px)', pointerEvents: 'none' }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '3px', color: card.dark ? `${card.accentLine}60` : '#A8A49B', marginBottom: '24px', textTransform: 'uppercase' }}>
                {card.num}
              </div>
              <div style={{ fontSize: '30px', marginBottom: '14px', lineHeight: 1 }}>{card.icon}</div>
              <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: 800, marginBottom: '10px', letterSpacing: '-0.3px', color: card.dark ? '#F2EEE7' : '#0C0C0B' }}>
                {card.title}
              </div>
              <div style={{ fontSize: '13px', color: card.dark ? 'rgba(242,238,231,0.45)' : '#6E6B63', lineHeight: 1.7 }}>
                {card.desc}
              </div>

              {card.tag && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginTop: '24px', padding: '5px 14px', background: `${card.tagColor}15`, border: `1px solid ${card.tagColor}30`, borderRadius: '100px', fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: card.tagColor }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: card.tagColor }} />
                  {card.tag}
                </div>
              )}

              {card.cta && (
                <a
                  href="https://echopulse.media"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-block', marginTop: '24px', background: '#E8541A', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '100px', fontSize: '13px', fontWeight: 700, cursor: 'none', transition: 'all 0.3s', textDecoration: 'none', fontFamily: 'Inter, sans-serif', boxShadow: '0 4px 20px rgba(232,84,26,0.3)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#d94a14'; (e.currentTarget as HTMLElement).style.transform = 'scale(1.03)'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = '#E8541A'; (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
                >
                  Book a Free Call →
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
