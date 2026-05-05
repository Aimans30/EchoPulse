'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import type { ServiceData } from '@/lib/serviceData';

gsap.registerPlugin(ScrollTrigger);

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as [number,number,number,number] } }),
};

export default function ServicePageClient({ service }: { service: ServiceData }) {
  const heroRef   = useRef<HTMLDivElement>(null);
  const titleRef  = useRef<HTMLHeadingElement>(null);
  const subRef    = useRef<HTMLParagraphElement>(null);
  const lineRef   = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.1 });
    tl.fromTo(lineRef.current,  { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: 'power3.out' })
      .fromTo(titleRef.current?.querySelectorAll('.word') ?? [],
        { y: '110%', opacity: 0 },
        { y: '0%', opacity: 1, duration: 0.9, ease: 'power3.out', stagger: 0.04 }, '-=0.4')
      .fromTo(subRef.current, { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }, '-=0.3');

    // Parallax on hero bg
    gsap.to('#sp-hero-bg', {
      yPercent: 30,
      ease: 'none',
      scrollTrigger: { trigger: heroRef.current, start: 'top top', end: 'bottom top', scrub: true },
    });

    return () => { tl.kill(); ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  const words = service.tagline.split(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
      style={{ background: '#F2EEE7', minHeight: '100vh' }}
    >
      {/* ── Nav ── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '20px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(242,238,231,0.85)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(12,12,11,0.06)' }}>
        <Link href="/" style={{ fontFamily: 'Inter,sans-serif', fontWeight: 900, fontSize: '18px', letterSpacing: '-0.8px', textDecoration: 'none', color: '#0C0C0B' }}>
          Echo<span style={{ color: '#E8541A' }}>Pulse</span>
        </Link>
        <Link href="/#services" style={{ fontSize: '13px', fontWeight: 600, color: '#6E6B63', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '6px', transition: 'color 0.2s' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          All Services
        </Link>
      </nav>

      {/* ── Hero ── */}
      <section ref={heroRef} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '0 56px 80px', position: 'relative', overflow: 'hidden', background: '#0C0C0B' }}>
        <div id="sp-hero-bg" style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 60% 60% at 70% 40%, ${service.accentColor}22 0%, transparent 65%)`, pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(242,238,231,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(242,238,231,0.025) 1px,transparent 1px)', backgroundSize: '64px 64px', pointerEvents: 'none' }} />

        <div style={{ maxWidth: '1280px', margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
          <div ref={lineRef} style={{ width: '48px', height: '3px', background: service.accentColor, borderRadius: '2px', marginBottom: '32px', transformOrigin: 'left' }} />
          <h1
            ref={titleRef}
            style={{ fontFamily: 'Inter,sans-serif', fontSize: 'clamp(52px,7.5vw,120px)', fontWeight: 900, letterSpacing: '-4px', lineHeight: 0.9, color: '#F2EEE7', margin: '0 0 36px', overflow: 'hidden' }}
          >
            {words.map((w, i) => (
              <span key={i} style={{ display: 'inline-block', overflow: 'hidden', marginRight: w === words[words.length - 1] ? 0 : '0.22em' }}>
                <span className="word" style={{ display: 'inline-block', color: i === words.length - 1 ? service.accentColor : '#F2EEE7' }}>{w}</span>
              </span>
            ))}
          </h1>
          <p ref={subRef} style={{ fontSize: 'clamp(16px,1.6vw,20px)', color: 'rgba(242,238,231,0.55)', maxWidth: '540px', lineHeight: 1.7, margin: 0, fontWeight: 400 }}>
            {service.heroSub}
          </p>
          <div style={{ marginTop: '48px', display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <a href="https://echopulse.media" target="_blank" rel="noopener noreferrer" style={{ background: service.accentColor, color: '#fff', padding: '16px 32px', borderRadius: '100px', fontSize: '14px', fontWeight: 700, textDecoration: 'none', fontFamily: 'Inter,sans-serif', display: 'inline-flex', alignItems: 'center', gap: '8px', boxShadow: `0 8px 32px ${service.accentColor}44`, transition: 'all 0.3s' }}>
              Book a Free Strategy Call
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>
            <a href="#how-it-works" style={{ background: 'rgba(255,255,255,0.08)', color: '#F2EEE7', padding: '16px 32px', borderRadius: '100px', fontSize: '14px', fontWeight: 700, textDecoration: 'none', fontFamily: 'Inter,sans-serif', border: '1px solid rgba(255,255,255,0.12)', transition: 'all 0.3s' }}>
              How It Works
            </a>
          </div>

          {/* Scroll cue */}
          <div style={{ position: 'absolute', bottom: '0', right: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', color: 'rgba(242,238,231,0.22)', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600 }}>
            <div style={{ width: '1px', height: '48px', background: `linear-gradient(to bottom,${service.accentColor},transparent)` }} />
            Scroll
          </div>
        </div>
      </section>

      {/* ── Problem ── */}
      <section style={{ padding: '120px 56px', background: '#F2EEE7' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }} className="sp-2col">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
            <motion.div variants={fadeUp} style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#A8A49B', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '22px', height: '1px', background: '#E8541A', display: 'block' }} />
              The Problem
            </motion.div>
            <motion.h2 variants={fadeUp} custom={1} style={{ fontFamily: 'Inter,sans-serif', fontSize: 'clamp(32px,4vw,56px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.05, color: '#0C0C0B', margin: '0 0 24px' }}>
              {service.problemHeadline}
            </motion.h2>
            <motion.p variants={fadeUp} custom={2} style={{ fontSize: '16px', color: '#6E6B63', lineHeight: 1.8, maxWidth: '480px' }}>
              {service.problemBody}
            </motion.p>
          </motion.div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {service.problemPoints.map((p, i) => (
              <motion.div key={i} variants={fadeUp} custom={i + 1}
                style={{ display: 'flex', alignItems: 'flex-start', gap: '14px', padding: '20px 22px', background: 'rgba(12,12,11,0.03)', border: '1px solid rgba(12,12,11,0.07)', borderRadius: '14px' }}
              >
                <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: '1px' }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
                </div>
                <span style={{ fontSize: '14px', color: '#3a3834', lineHeight: 1.55, fontWeight: 500 }}>{p}</span>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Solution Bridge ── */}
      <section style={{ padding: '100px 56px', background: '#0C0C0B', position: 'relative', overflow: 'hidden' }} data-dark-bg="true">
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 50% 80% at 80% 50%, ${service.accentColor}14 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(242,238,231,0.28)', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '22px', height: '1px', background: service.accentColor, display: 'block' }} />
              The Solution
            </div>
            <h2 style={{ fontFamily: 'Inter,sans-serif', fontSize: 'clamp(32px,4.5vw,68px)', fontWeight: 900, letterSpacing: '-2.5px', lineHeight: 1.02, color: '#F2EEE7', maxWidth: '820px', margin: '0 0 28px' }}>
              {service.solutionHeadline}
            </h2>
            <p style={{ fontSize: '17px', color: 'rgba(242,238,231,0.5)', lineHeight: 1.8, maxWidth: '580px' }}>
              {service.solutionBody}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" style={{ padding: '120px 56px', background: '#F2EEE7' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '72px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#A8A49B', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '22px', height: '1px', background: '#E8541A', display: 'block' }} />
              How It Works
            </div>
            <h2 style={{ fontFamily: 'Inter,sans-serif', fontSize: 'clamp(32px,4vw,60px)', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.05, color: '#0C0C0B', margin: 0 }}>
              Simple. Fast. <span style={{ color: service.accentColor }}>Effective.</span>
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }} className="sp-3col">
            {service.steps.map((step, i) => (
              <motion.div key={step.num}
                initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.7, delay: i * 0.15, ease: [0.16, 1, 0.3, 1] }}
                style={{ padding: '40px 36px', background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.9)', borderRadius: '20px', position: 'relative', overflow: 'hidden', boxShadow: '0 4px 24px rgba(12,12,11,0.05), inset 0 1px 0 rgba(255,255,255,0.95)' }}
              >
                <div style={{ position: 'absolute', bottom: '16px', right: '24px', fontFamily: 'Inter,sans-serif', fontSize: '72px', fontWeight: 900, color: `${service.accentColor}08`, letterSpacing: '-4px', lineHeight: 1, userSelect: 'none' }}>{i + 1}</div>
                <div style={{ fontSize: '11px', fontWeight: 800, color: service.accentColor, letterSpacing: '2px', marginBottom: '20px' }}>{step.num}</div>
                <h3 style={{ fontFamily: 'Inter,sans-serif', fontSize: '22px', fontWeight: 800, letterSpacing: '-0.6px', color: '#0C0C0B', margin: '0 0 14px' }}>{step.title}</h3>
                <p style={{ fontSize: '14px', color: '#6E6B63', lineHeight: 1.75, margin: 0 }}>{step.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What You Get ── */}
      <section style={{ padding: '120px 56px', background: '#EAE5DC' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '64px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#A8A49B', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '22px', height: '1px', background: '#E8541A', display: 'block' }} />
              What You Get
            </div>
            <h2 style={{ fontFamily: 'Inter,sans-serif', fontSize: 'clamp(32px,4vw,60px)', fontWeight: 900, letterSpacing: '-2px', color: '#0C0C0B', margin: 0 }}>
              Everything included.
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px' }} className="sp-3col">
            {service.deliverables.map((d, i) => (
              <motion.div key={d.title}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4, transition: { duration: 0.25 } }}
                style={{ padding: '32px 28px', background: 'rgba(255,255,255,0.68)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.88)', borderRadius: '18px', boxShadow: '0 2px 16px rgba(12,12,11,0.05), inset 0 1px 0 rgba(255,255,255,0.95)' }}
              >
                <div style={{ fontSize: '28px', marginBottom: '16px', lineHeight: 1 }}>{d.icon}</div>
                <h4 style={{ fontFamily: 'Inter,sans-serif', fontSize: '16px', fontWeight: 800, letterSpacing: '-0.3px', color: '#0C0C0B', margin: '0 0 10px' }}>{d.title}</h4>
                <p style={{ fontSize: '13px', color: '#6E6B63', lineHeight: 1.7, margin: 0 }}>{d.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Result ── */}
      <section style={{ padding: '120px 56px', background: '#0C0C0B', position: 'relative', overflow: 'hidden' }} data-dark-bg="true">
        <div style={{ position: 'absolute', top: '-20%', right: '-10%', width: '600px', height: '600px', borderRadius: '50%', background: `radial-gradient(circle, ${service.accentColor}18 0%, transparent 70%)`, filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1280px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '64px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(242,238,231,0.28)', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '22px', height: '1px', background: service.accentColor, display: 'block' }} />
              Client Result
            </div>
            <h2 style={{ fontFamily: 'Inter,sans-serif', fontSize: 'clamp(32px,4vw,60px)', fontWeight: 900, letterSpacing: '-2px', color: '#F2EEE7', margin: 0 }}>
              Real numbers. Real people.
            </h2>
          </motion.div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '64px', alignItems: 'center' }} className="sp-2col">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
              <div style={{ fontFamily: 'Inter,sans-serif', fontSize: 'clamp(72px,10vw,140px)', fontWeight: 900, letterSpacing: '-6px', lineHeight: 1, color: service.accentColor, marginBottom: '8px' }}>
                {service.result.stat}
              </div>
              <div style={{ fontSize: '16px', fontWeight: 600, color: 'rgba(242,238,231,0.55)', marginBottom: '24px' }}>{service.result.statLabel}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `${service.accentColor}22`, border: `1.5px solid ${service.accentColor}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: service.accentColor }}>
                  {service.result.client.split(' ').map(w => w[0]).join('')}
                </div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#F2EEE7' }}>{service.result.client}</div>
                  <div style={{ fontSize: '11px', color: 'rgba(242,238,231,0.35)' }}>{service.result.role}</div>
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{ background: 'rgba(255,255,255,0.05)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '48px 44px', position: 'relative', overflow: 'hidden', boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08)' }}
            >
              <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(90deg, ${service.accentColor}, transparent)` }} />
              <div style={{ fontSize: '40px', color: service.accentColor, lineHeight: 1, marginBottom: '24px', fontFamily: 'Georgia,serif' }}>"</div>
              <p style={{ fontSize: '17px', color: 'rgba(242,238,231,0.82)', lineHeight: 1.78, margin: '0 0 32px', fontStyle: 'italic', fontWeight: 400 }}>
                {service.result.body}
              </p>
              <div style={{ width: '40px', height: '1px', background: `${service.accentColor}60` }} />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Testimonial ── */}
      <section style={{ padding: '120px 56px', background: '#F2EEE7' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}>
            <div style={{ fontSize: '56px', color: service.accentColor, lineHeight: 1, marginBottom: '24px', fontFamily: 'Georgia,serif' }}>"</div>
            <p style={{ fontFamily: 'Inter,sans-serif', fontSize: 'clamp(20px,2.5vw,30px)', fontWeight: 700, letterSpacing: '-0.8px', color: '#0C0C0B', lineHeight: 1.45, margin: '0 0 40px' }}>
              {service.testimonial.quote}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: '#0C0C0B', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 800, color: '#F2EEE7' }}>
                {service.testimonial.name.split(' ').map(w => w[0]).join('')}
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#0C0C0B' }}>{service.testimonial.name}</div>
                <div style={{ fontSize: '11px', color: '#A8A49B' }}>{service.testimonial.role}</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: '120px 56px', background: '#EAE5DC' }}>
        <div style={{ maxWidth: '820px', margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} style={{ marginBottom: '64px' }}>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#A8A49B', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ width: '22px', height: '1px', background: '#E8541A', display: 'block' }} />
              Questions
            </div>
            <h2 style={{ fontFamily: 'Inter,sans-serif', fontSize: 'clamp(32px,4vw,56px)', fontWeight: 900, letterSpacing: '-2px', color: '#0C0C0B', margin: 0 }}>
              Quick <span style={{ color: service.accentColor }}>answers.</span>
            </h2>
          </motion.div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {service.faq.map((item, i) => (
              <FAQItem key={i} item={item} i={i} color={service.accentColor} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section style={{ padding: '120px 56px', background: '#0C0C0B', position: 'relative', overflow: 'hidden' }} data-dark-bg="true">
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${service.accentColor}12 0%, transparent 70%)`, pointerEvents: 'none' }} />
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: 'rgba(242,238,231,0.28)', marginBottom: '28px' }}>
              Ready to Start
            </div>
            <h2 style={{ fontFamily: 'Inter,sans-serif', fontSize: 'clamp(36px,5vw,72px)', fontWeight: 900, letterSpacing: '-3px', lineHeight: 1.0, color: '#F2EEE7', margin: '0 0 24px' }}>
              Let us build this<br /><span style={{ color: service.accentColor }}>for you.</span>
            </h2>
            <p style={{ fontSize: '16px', color: 'rgba(242,238,231,0.45)', lineHeight: 1.75, maxWidth: '480px', margin: '0 auto 48px' }}>
              Book a free 45-minute strategy call. We map out your entire {service.name.toLowerCase()} system, show you exactly what is missing, and give you a plan you can use immediately.
            </p>
            <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="https://echopulse.media" target="_blank" rel="noopener noreferrer"
                style={{ background: service.accentColor, color: '#fff', padding: '18px 40px', borderRadius: '100px', fontSize: '15px', fontWeight: 700, textDecoration: 'none', fontFamily: 'Inter,sans-serif', display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: `0 12px 40px ${service.accentColor}40`, transition: 'all 0.3s' }}>
                Book a Free Strategy Call
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </a>
              <Link href="/#services"
                style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(242,238,231,0.7)', padding: '18px 36px', borderRadius: '100px', fontSize: '15px', fontWeight: 600, textDecoration: 'none', fontFamily: 'Inter,sans-serif', border: '1px solid rgba(255,255,255,0.1)', transition: 'all 0.3s' }}>
                View All Services
              </Link>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '24px' }}>
              <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
              <span style={{ fontSize: '12px', color: 'rgba(242,238,231,0.32)', fontWeight: 500 }}>Free call. No commitment. No sales pitch.</span>
            </div>
          </motion.div>
        </div>
      </section>

      <style>{`
        .sp-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .sp-3col { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
        @media(max-width:900px) {
          .sp-2col { grid-template-columns: 1fr !important; gap: 48px !important; }
          .sp-3col { grid-template-columns: 1fr 1fr !important; }
        }
        @media(max-width:600px) {
          .sp-3col { grid-template-columns: 1fr !important; }
          section { padding-left: 24px !important; padding-right: 24px !important; }
          nav { padding: 16px 24px !important; }
        }
      `}</style>
    </motion.div>
  );
}

function FAQItem({ item, i, color }: { item: { q: string; a: string }; i: number; color: string }) {
  const [open, setOpen] = (require('react') as typeof import('react')).useState(i === 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.5, delay: i * 0.07 }}
      style={{ borderBottom: '1px solid rgba(12,12,11,0.09)' }}
    >
      <button
        onClick={() => setOpen((p: boolean) => !p)}
        style={{ width: '100%', textAlign: 'left', background: 'none', border: 'none', outline: 'none', padding: '24px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px', cursor: 'none', fontFamily: 'Inter,sans-serif', fontSize: '17px', fontWeight: 700, color: open ? color : '#0C0C0B', transition: 'color 0.25s', letterSpacing: '-0.3px' }}
      >
        {item.q}
        <motion.div animate={{ rotate: open ? 45 : 0, background: open ? color : 'rgba(255,255,255,0.5)' }} transition={{ duration: 0.3 }}
          style={{ width: '28px', height: '28px', borderRadius: '50%', border: '1.5px solid rgba(12,12,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <line x1="5.5" y1="0" x2="5.5" y2="11" stroke={open ? '#fff' : '#0C0C0B'} strokeWidth="1.8" strokeLinecap="round"/>
            <line x1="0" y1="5.5" x2="11" y2="5.5" stroke={open ? '#fff' : '#0C0C0B'} strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </motion.div>
      </button>
      <motion.div
        initial={false} animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
        style={{ overflow: 'hidden' }}
      >
        <p style={{ fontSize: '15px', color: '#6E6B63', lineHeight: 1.8, paddingBottom: '24px', margin: 0, maxWidth: '620px' }}>{item.a}</p>
      </motion.div>
    </motion.div>
  );
}
