// Link preview images: a real screenshot of the top of each page.
//
// For every entry in scripts/og/pages.json this opens the page on a running dev
// server, hides everything that is not the page itself (consent banner, sticky
// bars, the Next.js dev badge, the custom cursor, scroll hints), waits for
// fonts, images and hero videos to settle, captures a 1200 x 627 viewport at 2x
// and downsizes it to exactly 1200 x 627 with sharp.
//
// Usage (from the repo root, with `next dev -p 3472` already running):
//   NODE_USE_ENV_PROXY=1 NODE_EXTRA_CA_CERTS=/root/.ccr/ca-bundle.crt node scripts/og/screenshot.mjs [name ...]
// Options (environment):
//   OG_BASE  server to capture, default http://localhost:3472
//   OG_OUT   output folder, default public/og
//
// pages.json fields: name (file name and ogImages() key), path (route),
// alt (alt text for the image), scroll (optional, px to scroll before the
// capture, to frame the strongest part of the hero), settle (optional, extra
// ms to wait for an animated hero to finish building), reducedMotion (optional,
// true to capture with prefers-reduced-motion, which shows an animated hero in
// its finished, fully built state).
import { createRequire } from 'node:module';
import { readFileSync, mkdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const require = createRequire(import.meta.url);
const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');
const sharp = require(path.join(root, 'node_modules/sharp'));
let chromium;
try { ({ chromium } = require('playwright')); } catch { ({ chromium } = require('/opt/node-tools/node_modules/playwright')); }

const BASE = process.env.OG_BASE || 'http://localhost:3472';
const OUT = path.resolve(root, process.env.OG_OUT || 'public/og');
const W = 1200, H = 627;
const pages = JSON.parse(readFileSync(path.join(here, 'pages.json'), 'utf8'));
const only = process.argv.slice(2);
mkdirSync(OUT, { recursive: true });

// Everything that floats over the page rather than being part of it.
const HIDE = `
  nextjs-portal, [data-nextjs-toast], [data-next-badge-root],
  .ep-cur-d, .ep-cur-r, .ww-cursor, .ww-cta, .ww-hint,
  .consent, .svc-sticky-cta, .blog-bar, .scroll-hint,
  .ep-bottom-blur-2, div:has(> .ep-bottom-blur-2), .skip-to-content
  { display: none !important; }
  html { scroll-behavior: auto !important; }
`;

const br = await chromium.launch();
const ctx = await br.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 2 });
// A stored choice keeps the consent banner from mounting at all.
await ctx.addInitScript(() => {
  try { localStorage.setItem('ep-analytics-consent', 'denied'); } catch {}
});
const pg = await ctx.newPage();

for (const p of pages) {
  if (only.length && !only.includes(p.name)) continue;
  await pg.emulateMedia({ reducedMotion: p.reducedMotion ? 'reduce' : 'no-preference' });
  await pg.goto(BASE + p.path, { waitUntil: 'networkidle', timeout: 180000 }).catch(() => {});
  await pg.addStyleTag({ content: HIDE });
  await pg.mouse.move(W - 2, H - 2);
  if (p.scroll) await pg.evaluate((y) => window.scrollTo(0, y), p.scroll);
  await pg.evaluate(async () => {
    await document.fonts.ready;
    const inView = (el) => { const r = el.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight; };
    const imgs = [...document.images].filter(inView);
    imgs.forEach((i) => { i.loading = 'eager'; });
    await Promise.all(imgs.map((i) => (i.complete ? 1 : new Promise((r) => { i.onload = i.onerror = r; setTimeout(r, 15000); }))));
    const vids = [...document.querySelectorAll('video')].filter(inView);
    await Promise.all(vids.map((v) => (v.readyState >= 2 ? 1 : new Promise((r) => { v.addEventListener('loadeddata', r, { once: true }); setTimeout(r, 15000); }))));
  });
  await pg.waitForLoadState('networkidle').catch(() => {});
  await pg.waitForTimeout(p.settle ?? 3500);
  const shot = await pg.screenshot({ type: 'png' });
  const file = path.join(OUT, `${p.name}.png`);
  const buf = await sharp(shot).resize(W, H, { kernel: 'lanczos3' }).png({ compressionLevel: 9, palette: true, quality: 95, effort: 10, dither: 0.6 }).toBuffer();
  writeFileSync(file, buf);
  console.log(p.name.padEnd(42), p.path.padEnd(48), Math.round(buf.length / 1024) + ' KB');
}
await br.close();
