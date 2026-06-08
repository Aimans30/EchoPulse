import type { Metadata } from 'next';
import OnboardingClient from './OnboardingClient';

export const metadata: Metadata = {
  title: 'Welcome to EchoPulse — Kickoff Brief',
  description: 'Your order is in. Fill the kickoff brief so production can start within 24 hours.',
  robots: { index: false, follow: false }, // private — only for paying clients
};

export default function OnboardPage() {
  return <OnboardingClient />;
}
