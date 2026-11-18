import type { Metadata } from 'next';
import Link from 'next/link';
import BookedSignal from './BookedSignal';

export const metadata: Metadata = {
  title: 'You are booked',
  description: 'Your call with EchoPulse Media is confirmed.',
  robots: { index: false, follow: false },
};

/**
 * Where Cal.com sends people after a booking (set as the event's redirect
 * URL). It exists so a booking can be measured: BookedSignal records the
 * `booking_confirmed` event, attributed to the page the visitor booked from. It is
 * usually shown inside the booking modal's iframe, so it carries no nav and
 * stays short.
 */
export default function BookedPage() {
  return (
    <main
      id="main"
      style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#F2EEE7', color: '#0C0C0B', fontFamily: 'Inter, sans-serif', padding: '40px 24px',
      }}
    >
      <BookedSignal />
      <div style={{ maxWidth: 520, textAlign: 'center' }}>
        <p style={{ margin: '0 0 12px', fontSize: 11, fontWeight: 800, letterSpacing: 3, textTransform: 'uppercase', color: '#E8541A' }}>
          Confirmed
        </p>
        <h1 style={{ margin: '0 0 14px', fontSize: 'clamp(32px, 5vw, 48px)', fontWeight: 900, letterSpacing: '-1.6px', lineHeight: 1.05 }}>
          You&apos;re booked.
        </h1>
        <p style={{ margin: '0 0 22px', fontSize: 16, lineHeight: 1.65, color: '#6E6B63' }}>
          The calendar invite is in your inbox. To get the most from 15 minutes, have your website open and, if you
          have one, a video you would like edited. I will tell you the first three things I would fix.
        </p>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.6 }}>
          While you wait:{' '}
          <Link href="/case-studies/magicbnb-seo-aeo" target="_top" style={{ color: '#0C0C0B', fontWeight: 700 }}>
            the MagicBNB case study
          </Link>{' '}
          and{' '}
          <Link href="/work" target="_top" style={{ color: '#0C0C0B', fontWeight: 700 }}>
            the work wall
          </Link>
          .
        </p>
      </div>
    </main>
  );
}
