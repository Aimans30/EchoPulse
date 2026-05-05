'use client';

import { motion } from 'framer-motion';

const posts = [
  {
    tag: 'Video Strategy',
    title: 'How Coaches Can Get 10 New Clients Using Instagram Reels in 2026',
    excerpt: 'Short-form video is the fastest way for coaches to attract new clients. Here is the exact system EchoPulse uses to turn views into booked calls.',
    readTime: '8 min read',
    date: 'Apr 18, 2026',
    color: '#1c0e00',
    accent: '#E8541A',
  },
  {
    tag: 'Lead Generation',
    title: 'How to Build a Lead Generation System for Your Coaching Business Without Running Ads',
    excerpt: 'Paid ads are expensive and unpredictable. The coaches winning in 2026 are doing it with content-led inbound systems — here\'s the blueprint.',
    readTime: '11 min read',
    date: 'Apr 15, 2026',
    color: '#001408',
    accent: '#22c55e',
  },
  {
    tag: 'Personal Branding',
    title: 'The Personal Brand System That Helped a Business Coach Go From 500 to 50,000 Followers',
    excerpt: 'It wasn\'t luck. It was a repeatable system built on positioning, content architecture, and the right production workflow.',
    readTime: '9 min read',
    date: 'Apr 10, 2026',
    color: '#100012',
    accent: '#a855f7',
  },
  {
    tag: 'Automation',
    title: 'The 5 Automations Every Coaching Business Should Set Up in 2026',
    excerpt: 'Stop manually following up. These five automation workflows will book more calls, nurture leads, and save you 15+ hours a week.',
    readTime: '7 min read',
    date: 'Apr 5, 2026',
    color: '#001520',
    accent: '#3b82f6',
  },
];

export default function Blog() {
  return (
    <section id="blog" style={{ padding: '128px 56px', background: '#F2EEE7' }}>
      <style>{`
        .blog-card {
          background: rgba(255,255,255,0.65);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.8);
          border-radius: 20px;
          overflow: hidden;
          transition: transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s;
          box-shadow: 0 4px 24px rgba(12,12,11,0.06), inset 0 1px 0 rgba(255,255,255,0.9);
          cursor: none;
          display: flex;
          flex-direction: column;
        }
        .blog-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 24px 64px rgba(12,12,11,0.13), inset 0 1px 0 rgba(255,255,255,0.9);
        }
        .blog-card-thumb {
          height: 180px;
          position: relative;
          overflow: hidden;
        }
        .blog-card-thumb-inner {
          position: absolute;
          inset: 0;
          transition: transform 0.6s cubic-bezier(0.16,1,0.3,1);
        }
        .blog-card:hover .blog-card-thumb-inner {
          transform: scale(1.05);
        }
        .blog-card-body {
          padding: 28px 32px 32px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .blog-tag {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 100px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 16px;
        }
        .blog-card-title {
          font-family: Inter, sans-serif;
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -0.4px;
          line-height: 1.35;
          color: #0C0C0B;
          margin: 0 0 12px;
        }
        .blog-card-excerpt {
          font-size: 13px;
          color: #6E6B63;
          line-height: 1.7;
          margin: 0 0 24px;
          flex: 1;
        }
        .blog-card-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 11px;
          color: #A8A49B;
          font-weight: 500;
          letter-spacing: 0.3px;
          border-top: 1px solid rgba(12,12,11,0.07);
          padding-top: 16px;
        }
        .blog-read-more {
          font-size: 12px;
          font-weight: 700;
          color: #E8541A;
          display: flex;
          align-items: center;
          gap: 4px;
          transition: gap 0.2s;
        }
        .blog-card:hover .blog-read-more { gap: 8px; }
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin-top: 64px;
        }
        @media (max-width: 1200px) { .blog-grid { grid-template-columns: repeat(2, 1fr) !important; } }
        @media (max-width: 640px) { .blog-grid { grid-template-columns: 1fr !important; } }
      `}</style>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{
              fontSize: '10px', fontWeight: 600, letterSpacing: '4px',
              textTransform: 'uppercase', color: '#6E6B63', marginBottom: '20px',
              display: 'flex', alignItems: 'center', gap: '14px',
            }}
          >
            <span style={{ width: '22px', height: '1px', background: '#E8541A', display: 'block' }} />
            From the Blog
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(36px, 4.5vw, 72px)',
              fontWeight: 900,
              letterSpacing: '-3px',
              lineHeight: 1.02,
              margin: 0,
            }}
          >
            Insights that <span style={{ color: '#E8541A' }}>actually</span><br />grow your brand.
          </motion.h2>
        </div>
        <motion.a
          href="/blog"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '13px',
            fontWeight: 700,
            color: '#0C0C0B',
            textDecoration: 'none',
            padding: '12px 24px',
            borderRadius: '100px',
            border: '1.5px solid rgba(12,12,11,0.15)',
            background: 'rgba(255,255,255,0.6)',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.3s',
            cursor: 'none',
          }}
          whileHover={{ background: '#0C0C0B', color: '#F2EEE7', borderColor: '#0C0C0B' } as any}
        >
          View All Posts →
        </motion.a>
      </div>

      {/* Cards */}
      <div className="blog-grid">
        {posts.map((post, i) => (
          <motion.article
            key={post.title}
            className="blog-card"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            data-cursor-hover
          >
            {/* Thumb */}
            <div className="blog-card-thumb">
              <div
                className="blog-card-thumb-inner"
                style={{ background: `linear-gradient(145deg, ${post.color} 0%, ${post.color}dd 100%)` }}
              >
                {/* Decorative pattern */}
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: 'radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)',
                  backgroundSize: '24px 24px',
                }} />
                <div style={{
                  position: 'absolute', bottom: '16px', left: '20px', right: '20px',
                  fontFamily: 'Inter, sans-serif', fontSize: '13px', fontWeight: 700,
                  color: 'rgba(255,255,255,0.35)', lineHeight: 1.4, letterSpacing: '-0.2px',
                }}>
                  {post.title.substring(0, 50)}...
                </div>
                {/* Accent orb */}
                <div style={{
                  position: 'absolute', top: '-20px', right: '-20px',
                  width: '100px', height: '100px', borderRadius: '50%',
                  background: `radial-gradient(circle, ${post.accent}33 0%, transparent 70%)`,
                  filter: 'blur(20px)',
                }} />
              </div>
            </div>

            {/* Body */}
            <div className="blog-card-body">
              <span
                className="blog-tag"
                style={{ background: `${post.accent}18`, color: post.accent }}
              >
                {post.tag}
              </span>
              <h3 className="blog-card-title">{post.title}</h3>
              <p className="blog-card-excerpt">{post.excerpt}</p>
              <div className="blog-card-meta">
                <span>{post.date} · {post.readTime}</span>
                <span className="blog-read-more">
                  Read
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          </motion.article>
        ))}
      </div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        style={{ marginTop: '56px', display: 'flex', justifyContent: 'center' }}
      >
        <div style={{
          background: 'rgba(255,255,255,0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.8)',
          borderRadius: '16px',
          padding: '32px 48px',
          display: 'flex',
          alignItems: 'center',
          gap: '32px',
          flexWrap: 'wrap',
          justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(12,12,11,0.06)',
          textAlign: 'center',
        }}>
          <div>
            <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '18px', fontWeight: 800, letterSpacing: '-0.3px', marginBottom: '4px' }}>
              Get our weekly growth playbook.
            </div>
            <div style={{ fontSize: '13px', color: '#6E6B63' }}>
              Actionable strategies for coaches and personal brands. No fluff.
            </div>
          </div>
          <div style={{ display: 'flex', gap: '10px', flexShrink: 0 }}>
            <input
              type="email"
              placeholder="your@email.com"
              style={{
                padding: '12px 20px',
                borderRadius: '100px',
                border: '1px solid rgba(12,12,11,0.15)',
                background: 'rgba(255,255,255,0.8)',
                fontSize: '13px',
                fontFamily: 'Inter, sans-serif',
                outline: 'none',
                width: '220px',
                color: '#0C0C0B',
              }}
            />
            <button
              style={{
                padding: '12px 24px',
                borderRadius: '100px',
                background: '#E8541A',
                color: '#fff',
                border: 'none',
                fontSize: '13px',
                fontWeight: 700,
                cursor: 'none',
                fontFamily: 'Inter, sans-serif',
                transition: 'background 0.3s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#d94a14')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#E8541A')}
            >
              Subscribe Free
            </button>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
