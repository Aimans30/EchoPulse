'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

const services = [
  { num: '01', name: 'Video Editing', slug: 'video-editing', pills: ['Short Form', 'Long Form', 'Speed Ramps'] },
  { num: '02', name: 'Automations', slug: 'automations', pills: ['ManyChat', 'Email Flows', 'CRM'] },
  { num: '03', name: 'Personal Branding', slug: 'personal-branding', pills: ['Strategy', 'Identity', 'Positioning'] },
  { num: '04', name: 'Websites & Funnels', slug: 'websites-funnels', pills: ['Websites', 'Sales Funnels', 'Lead Pages'] },
  { num: '05', name: 'Community Management', slug: 'community-management', pills: ['Engagement', 'Retention'] },
  { num: '06', name: 'Lead Generation', slug: 'lead-generation', pills: ['Organic', 'Inbound', 'Content-Led'] },
];

export default function Services() {
  return (
    <section id="services" data-dark-bg="true" style={{ padding: '128px 56px', background: '#0C0C0B', position: 'relative' }}>
      <style>{`
        .service-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 30px 28px;
          position: relative;
          overflow: hidden;
          cursor: none;
          gap: 24px;
          border-top: 1px solid rgba(255,255,255,0.06);
        }
        .service-row:last-child {
          border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .service-row-fill {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #E8541A, #d94a14);
          transform: translateX(-101%);
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 0;
        }
        .service-row:hover .service-row-fill {
          transform: translateX(0);
        }
        .service-row-num {
          font-size: 11px;
          color: rgba(242,238,231,0.25);
          font-weight: 700;
          letter-spacing: 2px;
          min-width: 40px;
          position: relative;
          z-index: 1;
          transition: color 0.3s;
        }
        .service-row:hover .service-row-num {
          color: rgba(255,255,255,0.55);
        }
        .service-row-name {
          font-family: Inter, sans-serif;
          font-size: clamp(24px, 3.2vw, 44px);
          font-weight: 900;
          letter-spacing: -1px;
          color: #F2EEE7;
          flex: 1;
          position: relative;
          z-index: 1;
        }
        .service-pills {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
          position: relative;
          z-index: 1;
        }
        .service-pill {
          padding: 5px 13px;
          background: rgba(255,255,255,0.07);
          border-radius: 100px;
          font-size: 12px;
          color: rgba(242,238,231,0.45);
          transition: background 0.3s, color 0.3s;
        }
        .service-row:hover .service-pill {
          background: rgba(255,255,255,0.18);
          color: #fff;
        }
        .service-arrow {
          width: 40px; height: 40px;
          border-radius: 50%;
          border: 1px solid rgba(255,255,255,0.12);
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: all 0.35s cubic-bezier(0.16,1,0.3,1);
          position: relative; z-index: 1;
          overflow: hidden;
        }
        .service-row:hover .service-arrow {
          background: rgba(255,255,255,0.15);
          border-color: rgba(255,255,255,0.3);
          transform: rotate(-45deg);
        }
        @media(max-width:640px) {
          .service-pills { display:none !important; }
          .service-row { padding:20px 0 !important; gap:12px !important; }
          .service-row-name { font-size:24px !important; }
        }
      `}</style>

      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          marginBottom: '72px',
          gap: '40px',
          flexWrap: 'wrap',
        }}
      >
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: '10px',
              fontWeight: 600,
              letterSpacing: '4px',
              textTransform: 'uppercase',
              color: 'rgba(242,238,231,0.28)',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
            }}
          >
            <span style={{ width: '22px', height: '1px', background: '#E8541A', display: 'block' }} />
            What We Do
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(40px, 5.5vw, 84px)',
              fontWeight: 900,
              letterSpacing: '-2.5px',
              lineHeight: 0.95,
              color: '#F2EEE7',
              maxWidth: '580px',
              margin: 0,
            }}
          >
            Every service<br />
            your brand<br />
            <span style={{ color: '#E8541A' }}>actually</span> needs.
          </motion.h2>
        </div>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          style={{ maxWidth: '280px', color: 'rgba(242,238,231,0.38)', fontSize: '15px', lineHeight: 1.7, margin: 0 }}
        >
          One team. Everything covered. From the first video edit to a full growth system running on autopilot.
        </motion.p>
      </div>

      <div>
        {services.map((service, i) => (
          <motion.div
            key={service.num}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.08 }}
          >
            <Link href={`/services/${service.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
              <div className="service-row">
                <div className="service-row-fill" />
                <span className="service-row-num">{service.num}</span>
                <span className="service-row-name">{service.name}</span>
                <div className="service-pills">
                  {service.pills.map((pill) => (
                    <span key={pill} className="service-pill">{pill}</span>
                  ))}
                </div>
                <div className="service-arrow">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(242,238,231,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 17L17 7M7 7h10v10"/>
                  </svg>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
