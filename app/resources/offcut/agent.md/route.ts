import { OFFCUT_AGENT_PROMPT } from '@/lib/offcut';

/**
 * Plain-text install instructions for AI agents, at
 * /resources/offcut/agent.md. The one-line "install with your agent" pill on
 * /resources/offcut points agents here, so the full steps live in one place
 * (lib/offcut.ts) and stay current.
 */
export const dynamic = 'force-static';

export function GET() {
  const body = `# Install Offcut (for AI agents)

Offcut is a free Windows app from EchoPulse Media (https://echopulse.media/resources/offcut). You are helping a person install it on their own PC. Follow the steps below exactly.

${OFFCUT_AGENT_PROMPT}
`;
  return new Response(body, {
    headers: { 'Content-Type': 'text/markdown; charset=utf-8', 'Cache-Control': 'public, max-age=300' },
  });
}
