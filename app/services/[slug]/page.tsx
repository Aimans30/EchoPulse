import { getService, services } from '@/lib/serviceData';
import { notFound } from 'next/navigation';
import ServicePageClient from '@/components/ServicePageClient';

export function generateStaticParams() {
  return services.map(s => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return {
    title: `${service.name} | EchoPulse`,
    description: service.heroSub,
  };
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();
  return <ServicePageClient service={service} />;
}
