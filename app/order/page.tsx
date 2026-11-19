import type { Metadata } from 'next';
import OrderFlow from '@/components/OrderFlow';
import Nav from '@/components/Nav';

// /order — McDonald's-style à la carte ordering for clients who don't want
// a retainer. Sits alongside the $299 Pilot, the $399/month Presence Engine
// and the $1,997/month Growth plan (see lib/pricing.ts).
//
// Phase 1 ships the UI only. Phase 2 will add /api/checkout for Dodo
// Payments, webhook handlers for Asana + Resend + Supabase persistence,
// and the /order/success confirmation page.

export const metadata: Metadata = {
  // Was 'Custom Order', which rendered as "Custom Order | EchoPulse Media" and
  // told a searcher nothing about video, content or editing. Out of context it
  // read like a generic e-commerce cart page, which is the weakest possible
  // title on a site whose problem is a 0.24% CTR from US impressions.
  title: { absolute: 'Order Video Editing and Content, No Retainer | EchoPulse' },
  description:
    'Order a one-off edit from EchoPulse. Reels, long-form YouTube, podcast edits, and content repurposing. No retainer required. Pay only for what you need.',
  alternates: { canonical: '/order' },
  openGraph: {
    title: 'EchoPulse: Custom Edit Order',
    description:
      'À la carte editing. Reels, long-form, podcast, repurpose. Pay only for what you need.',
    url: 'https://echopulse.media/order',
    type: 'website',
  },
};

export default function OrderPage() {
  // <main id="main"> so the root layout's skip-to-content link has a target
  // here. /order previously rendered no landmark element at all.
  return (
    <>
      <Nav />
      <main id="main">
        <OrderFlow />
      </main>
    </>
  );
}
