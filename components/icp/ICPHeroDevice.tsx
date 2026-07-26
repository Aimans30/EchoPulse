import ICPPipelineAnimation, { type PipelineConfig } from './ICPPipelineAnimation';

/**
 * Per-segment hero visual.
 *
 * This used to render a different static CSS/SVG "device" per audience — a
 * phone reel for real estate, a LinkedIn skeleton card for founders, a funnel
 * diagram for coaches, and so on. They looked fine but sold nothing: a grey
 * mockup tells a cold visitor neither what we do nor what they get.
 *
 * Every segment now gets the same animated pipeline explainer, configured from
 * lib/icpData.ts. One consistent, premium visual language across all five
 * outreach pages, and each one still speaks in its own audience's nouns
 * (listings vs cohorts vs ad variants) because the config differs.
 *
 * `alt` is a plain descriptive string used as the group aria-label so the
 * decorative animation still carries meaning for assistive tech and crawlers.
 */
export default function ICPHeroDevice({
  accent,
  alt,
  pipeline,
}: {
  accent: string;
  alt: string;
  pipeline: PipelineConfig;
}) {
  return <ICPPipelineAnimation accent={accent} config={pipeline} alt={alt} />;
}
