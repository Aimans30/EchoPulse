/**
 * Add Aiman + Shaurya as members on every Asana project in the workspace.
 *
 * The Asana MCP we use from inside our agent doesn't expose project-member
 * management, AND the sandbox proxy blocks api.asana.com. So this script
 * runs on YOUR machine where Asana is reachable and uses ASANA_TOKEN from
 * .env.local to call the REST API directly.
 *
 *   node scripts/add-team-to-all-projects.mjs
 *
 * Idempotent: re-running just no-ops on projects where they're already members.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const env = Object.fromEntries(
  readFileSync(resolve(process.cwd(), '.env.local'), 'utf-8')
    .split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => {
      const i = l.indexOf('=');
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()];
    })
);

const TOKEN = env.ASANA_TOKEN;
if (!TOKEN) {
  console.error('✗ ASANA_TOKEN missing in .env.local');
  process.exit(1);
}

// Both team members, by GID (looked up earlier from get_projects)
const AIMAN = '1215286062920238';
const SHAURYA = '1215286062920241';

// All 10 projects in the EchoPulse workspace
const PROJECTS = [
  { gid: '1215260367025465', name: '5. Leads · Sales Pipeline' },
  { gid: '1215260367103645', name: '6. Internal · Team Tasks' },
  { gid: '1215260397743607', name: '7. Templates · Onboarding Playbooks' },
  { gid: '1215260397806423', name: '3. Daily Board · Retainer Deliverables' },
  { gid: '1215260397847745', name: '10. Tooling, Subscriptions & Renewals' },
  { gid: '1215260545915794', name: '9. Knowledge Base · SOPs & Playbooks' },
  { gid: '1215260649701497', name: '2. Clients · Profile Cards' },
  { gid: '1215260649748169', name: '8. Renewals & Churn Watch' },
  { gid: '1215260649768375', name: '1. Clients · Retainer Pipeline' },
  { gid: '1215260649804865', name: '4. ⏱ One-Off Orders (48h Clock)' },
];

const MEMBERS = `${AIMAN},${SHAURYA}`;

console.log(`Adding ${MEMBERS} to ${PROJECTS.length} projects…\n`);

let ok = 0, skipped = 0, failed = 0;
for (const p of PROJECTS) {
  process.stdout.write(`  → ${p.name.padEnd(48)} `);
  try {
    const res = await fetch(`https://app.asana.com/api/1.0/projects/${p.gid}/addMembers`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ data: { members: MEMBERS } }),
    });
    const json = await res.json().catch(() => ({}));
    if (res.ok) {
      console.log('✓ added');
      ok += 1;
    } else if (res.status === 400 && /already/i.test(JSON.stringify(json))) {
      console.log('· already member');
      skipped += 1;
    } else {
      console.log(`✗ ${res.status}: ${JSON.stringify(json).slice(0, 120)}`);
      failed += 1;
    }
  } catch (err) {
    console.log(`✗ ${err.message}`);
    failed += 1;
  }
}

console.log(`\n${ok} added · ${skipped} already member · ${failed} failed`);
process.exit(failed > 0 ? 2 : 0);
