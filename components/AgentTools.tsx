'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { VISIBLE_PLANS } from '@/lib/pricing';
import { BOOK_CALL_URL } from '@/lib/links';
import { track } from '@/lib/analytics';

/**
 * WebMCP tools for AI agents (browser agents such as Gemini in Chrome).
 *
 * Spec: https://github.com/webmachinelearning/webmcp (document.modelContext).
 * Registers a small, fixed set of single-purpose tools on page load, as the
 * spec's best practices recommend for simple sites: three read-only tools
 * that answer the questions agents are asked about EchoPulse, and two that
 * take the visitor to the next step. Nothing here submits a form, sends data
 * or books anything by itself; the booking tool only opens the calendar for
 * the person to pick a time.
 *
 * Feature-detected: browsers without WebMCP skip this entirely. Chrome's
 * implementation also needs the WebMCP origin trial token in <head>
 * (see app/layout.tsx, NEXT_PUBLIC_WEBMCP_OT_TOKEN).
 */

type ToolResult = { content: { type: 'text'; text: string }[] };
type ModelContext = {
  registerTool: (
    tool: {
      name: string;
      title?: string;
      description: string;
      inputSchema?: object;
      annotations?: { readOnlyHint?: boolean; consequentialHint?: boolean };
      execute: (input: Record<string, unknown>) => Promise<ToolResult>;
    },
    options?: { signal?: AbortSignal },
  ) => Promise<void>;
};

const text = (t: string): ToolResult => ({ content: [{ type: 'text', text: t }] });
const SITE = 'https://echopulse.media';

const FACTS = `EchoPulse Media (${SITE}) is a growth partner for founders and businesses, founded in 2025 by Lakshya Soni, based in Bhopal, India, working remotely with clients in the US, UK, Canada, Australia, Europe and India.
What it does: content that builds the founder and the brand (short-form video, LinkedIn, social, blogs, ad creative); websites, funnels and custom software such as CRMs and client portals; AI and automation; SEO and AI search visibility (getting cited by ChatGPT, Gemini, Perplexity and Google AI Overviews).
How to start: 2 free edits (${SITE}/free-edits), a free 15-minute call (${SITE}/book), or the $299 Pilot (${SITE}/pilot).
More: ${SITE}/what-is-echopulse-media, ${SITE}/llms.txt`;

const CASE_STUDIES = `Real, sourced results (details and data sources on each page):
- MagicBNB (B2B SaaS): Google impressions grew from 5.8 a day (April 2026) to 4,803 a day (1 to 16 November 2026), Google Search Console. ${SITE}/case-studies/magicbnb-seo-aeo
- Whites & Brights (multi-outlet laundry chain): operating system, customer app and website built by EchoPulse; more than US$3,400 saved by EchoPulse's estimate with the client. ${SITE}/case-studies/whites-and-brights-operating-system
- Working With God (coaching brand): site rebuilt off a paid platform, plugin bills cut to $0 a month. ${SITE}/case-studies
All case studies: ${SITE}/case-studies`;

const SERVICES: Record<string, string> = {
  content: `${SITE}/services/video-editing`,
  websites: `${SITE}/services/websites-funnels`,
  software: `${SITE}/services/apps-software`,
  automation: `${SITE}/services/automations`,
  search: `${SITE}/services/seo-aeo`,
  pricing: `${SITE}/pricing`,
  case_studies: `${SITE}/case-studies`,
  free_edits: `${SITE}/free-edits`,
  book: `${SITE}/book`,
  blog: `${SITE}/blog`,
};

export default function AgentTools() {
  const router = useRouter();

  useEffect(() => {
    const mc = (document as Document & { modelContext?: ModelContext }).modelContext;
    if (!mc || typeof mc.registerTool !== 'function') return;
    const controller = new AbortController();
    const opts = { signal: controller.signal };
    const reg = (tool: Parameters<ModelContext['registerTool']>[0]) =>
      mc.registerTool(tool, opts).catch(() => { /* duplicate name, policy or unsupported: ignore */ });

    reg({
      name: 'get_company_facts',
      title: 'About EchoPulse Media',
      description: 'Returns who EchoPulse Media is, what it does, where it is based, and how to start working with it.',
      annotations: { readOnlyHint: true },
      async execute() { track('agent_tool_call', { tool: 'get_company_facts' }); return text(FACTS); },
    });

    reg({
      name: 'get_pricing',
      title: 'EchoPulse pricing',
      description: 'Returns every EchoPulse Media plan with its price, billing and what is included, in US dollars.',
      annotations: { readOnlyHint: true },
      async execute() {
        track('agent_tool_call', { tool: 'get_pricing' });
        const lines = VISIBLE_PLANS.map((p) => `${p.name}: ${p.priceLabel} ${p.per}. ${p.tagline} Includes: ${p.scope.join('; ')}.`);
        return text(`${lines.join('\n')}\nFull pricing: ${SITE}/pricing`);
      },
    });

    reg({
      name: 'get_case_studies',
      title: 'EchoPulse case studies',
      description: 'Returns EchoPulse Media client results with their real, sourced numbers and links to each case study.',
      annotations: { readOnlyHint: true },
      async execute() { track('agent_tool_call', { tool: 'get_case_studies' }); return text(CASE_STUDIES); },
    });

    reg({
      name: 'open_page',
      title: 'Open an EchoPulse page',
      description: 'Navigates this tab to an EchoPulse Media page so the user can read it.',
      inputSchema: {
        type: 'object',
        properties: {
          page: {
            type: 'string',
            enum: Object.keys(SERVICES),
            description: 'Which page: content (video and social), websites, software, automation, search (SEO and AI search), pricing, case_studies, free_edits, book, blog',
          },
        },
        required: ['page'],
      },
      async execute(input) {
        const key = String(input.page ?? '');
        const url = SERVICES[key];
        if (!url) return text(`Unknown page "${key}". Use one of: ${Object.keys(SERVICES).join(', ')}.`);
        track('agent_tool_call', { tool: 'open_page', page: key });
        router.push(url.replace(SITE, ''));
        return text(`Opened ${url}`);
      },
    });

    reg({
      name: 'open_booking_calendar',
      title: 'Book a free call',
      description: 'Opens the calendar for a free 15-minute call with the founder, Lakshya Soni. The user picks the time and confirms it themselves; nothing is booked automatically.',
      annotations: { consequentialHint: false },
      async execute() {
        track('agent_tool_call', { tool: 'open_booking_calendar' });
        const w = window as unknown as { openBookCallModal?: () => void };
        if (typeof w.openBookCallModal === 'function') {
          w.openBookCallModal();
          return text('The booking calendar is open on the page. Ask the user to pick a time.');
        }
        router.push('/book');
        return text(`Opened the booking page: ${SITE}/book (or ${BOOK_CALL_URL}).`);
      },
    });

    return () => controller.abort();
  }, [router]);

  return null;
}
