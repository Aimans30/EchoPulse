'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { trackLeadMagnetSubmit } from '@/lib/analytics';

/**
 * Lead magnet — email capture for the LinkedIn Playbook PDF.
 * Posts to /api/lead-magnet which currently console.logs the email.
 * Wire to Mailerlite / ConvertKit / your ESP when ready (see .env.example).
 */
export default function LeadMagnet() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'sent' | 'error'>('idle');

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'submitting') return;
    setStatus('submitting');
    try {
      const res = await fetch('/api/lead-magnet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'homepage_lead_magnet' }),
      });
      if (!res.ok) throw new Error('submit failed');
      trackLeadMagnetSubmit('homepage_lead_magnet');
      setStatus('sent');
    } catch {
      setStatus('error');
    }
  };

  // Teaser hooks above the form — blurred to hint at "more inside"
  const teaserHooks = [
    'Most LinkedIn ghostwriters can\'t name your last 10 stories.',
    'I cut video professionally at a production studio before going independent.',
    'Property reels are 90% formula. Three patterns most editors miss:',
  ];

  return (
    <section
      data-dark-bg="true"
      style={{
        padding: '128px 56px',
        background: '#0C0C0B',
        color: '#F2EEE7',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            fontSize: '10px',
            fontWeight: 700,
            letterSpacing: '4px',
            textTransform: 'uppercase',
            color: 'rgba(242,238,231,0.45)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
          }}
        >
          <span style={{ width: '22px', height: '1px', background: '#E8541A', display: 'block' }} />
          Free playbook
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(34px, 4.6vw, 60px)',
            fontWeight: 900,
            letterSpacing: 'clamp(-1px, -0.04em, -2.4px)',
            lineHeight: 1.06,
            color: '#F2EEE7',
            margin: '0 0 14px',
            maxWidth: '780px',
          }}
        >
          The LinkedIn Playbook we use for{' '}
          <span style={{ color: '#E8541A' }}>every client.</span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{
            fontSize: '15px',
            color: 'rgba(242,238,231,0.55)',
            maxWidth: '620px',
            lineHeight: 1.7,
            margin: '0 0 36px',
          }}
        >
          40 pages. Every hook formula, framework, and post structure. Free.
        </motion.p>

        {/* Blurred teaser hooks */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.25 }}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginBottom: '20px',
          }}
        >
          {teaserHooks.map((h, i) => (
            <div
              key={i}
              style={{
                padding: '12px 16px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '10px',
                fontSize: '13px',
                color: 'rgba(242,238,231,0.7)',
                fontStyle: 'italic',
                filter: 'blur(3px)',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              {h}
            </div>
          ))}
          <div
            style={{
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.3px',
              color: '#E8541A',
              marginTop: '4px',
            }}
          >
            37 more inside →
          </div>
        </motion.div>

        {/* Email form */}
        <motion.form
          onSubmit={onSubmit}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{
            display: 'flex',
            gap: '8px',
            flexWrap: 'wrap',
            maxWidth: '560px',
          }}
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="founder@yourcompany.com"
            disabled={status === 'submitting' || status === 'sent'}
            style={{
              flex: '1 1 240px',
              minHeight: '48px',
              padding: '14px 16px',
              borderRadius: '12px',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#F2EEE7',
              fontSize: '14px',
              fontFamily: 'Inter, sans-serif',
              outline: 'none',
            }}
          />
          <button
            type="submit"
            disabled={status === 'submitting' || status === 'sent'}
            style={{
              minHeight: '48px',
              padding: '14px 22px',
              borderRadius: '12px',
              background: '#E8541A',
              border: 'none',
              color: '#fff',
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: 'Inter, sans-serif',
              cursor: status === 'submitting' || status === 'sent' ? 'default' : 'pointer',
              opacity: status === 'submitting' ? 0.6 : 1,
              boxShadow: '0 6px 20px rgba(232,84,26,0.32)',
              whiteSpace: 'nowrap',
            }}
          >
            {status === 'sent' ? 'Sent ✓' : status === 'submitting' ? 'Sending…' : 'Send me the playbook'}
          </button>
        </motion.form>

        {status === 'error' && (
          <p style={{ marginTop: '12px', fontSize: '12px', color: '#ff8a80' }}>
            Something went wrong. Try again, or DM Lakshya on LinkedIn.
          </p>
        )}
        {status === 'sent' && (
          <p style={{ marginTop: '12px', fontSize: '12px', color: '#10b981' }}>
            Check your inbox in the next few minutes.
          </p>
        )}
      </div>
    </section>
  );
}
