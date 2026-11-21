// Renders every page in pages.json to public/og/<name>.png (1200 x 627).
// Usage (from the repo root):
//   NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt node scripts/og/render.mjs [name ...]
// Edit copy in scripts/og/pages.json, layout in scripts/og/template.html.
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync, statSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const require = createRequire(import.meta.url);
const { chromium } = require('/opt/node-tools/node_modules/playwright');
const here = path.dirname(fileURLToPath(import.meta.url));
const out = path.resolve(here, '../../public/og');
mkdirSync(out, { recursive: true });
const pages = JSON.parse(readFileSync(path.join(here, 'pages.json'), 'utf8'));
const only = process.argv.slice(2);
const br = await chromium.launch();
const pg = await br.newPage({ viewport: { width: 1200, height: 627 }, deviceScaleFactor: 1 });
for (const p of pages) {
  if (only.length && !only.includes(p.name)) continue;
  await pg.goto('file://' + path.join(here, 'template.html'));
  const m = await pg.evaluate((d) => window.render(d), p);
  const file = path.join(out, p.name + '.png');
  await pg.screenshot({ path: file });
  const warn = (m.top < 100 ? ' TOO HIGH (hits lockup)' : '') + (m.lines > 3 ? ' >3 lines' : '');
  console.log(p.name.padEnd(42), Math.round(statSync(file).size / 1024) + ' KB', 'text top', m.top, 'lines', m.lines, warn);
}
await br.close();
