import type { Metadata } from 'next';
import OrderFlow from '@/components/OrderFlow';

// /order — McDonald's-style à la carte ordering for clients who don't want
// a retainer. Sits alongside the existing $299 Pilot / $1,997 Growth /
// $4,997 Full System retainers on the homepage pricing section.
//
// Phase 1 ships the UI only. Phase 2 will add /api/checkout for Dodo
// Payments, webhook handlers for Asana + Resend + Supabase persistence,
// and the /order/success confirmation page.

export const metadata: Metadata = {
  title: 'Custom Order',
  description:
    'Order a one-off edit from EchoPulse. Reels, long-form YouTube, podcast edits, and content repurposing. No retainer required. Pay only for what you need.',
  alternates: { canonical: '/order' },
  openGraph: {
    title: 'EchoPulse — Custom Edit Order',
    description:
      'À la carte editing. Reels, long-form, podcast, repurpose. Pay only for what you need.',
    url: 'https://echopulse.media/order',
    type: 'website',
  },
};

export default function OrderPage() {
  return <OrderFlow />;
}
