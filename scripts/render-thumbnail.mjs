/**
 * Blog thumbnail / OG image generator (1200x630 PNG), no browser needed.
 *
 * Layout: near-black left panel (pill, title, subtitle, wordmark footer) and an
 * orange gradient right panel with concentric rings and a white line icon.
 *
 * Fonts: every piece of text is converted to SVG <path> outlines with
 * opentype.js using the Poppins TTFs bundled in scripts/fonts/ (SIL OFL). The
 * SVG therefore contains no <text>, needs no installed fonts, and renders
 * identically on any machine.
 *
 * Importable:
 *   import { renderThumbnail, pickIcon } from './render-thumbnail.mjs';
 *   const png = await renderThumbnail({ title, category, subtitle, icon });
 *
 * Standalone:
 *   node scripts/render-thumbnail.mjs "Title" out.png [Category] [Subtitle] [icon]
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import opentype from 'opentype.js';
import sharp from 'sharp';

export const WIDTH = 1200;
export const HEIGHT = 630;

const COLORS = {
  bg: '#0C0C0B',
  orange: '#E8541A',
  cream: '#F2EEE7',
  muted: '#8A867E',
};

// Layout constants (px)
const PANEL_W = 674;
const MARGIN = 62;
const TITLE_MAX_W = 540; // ends at x=602, 72px from the panel edge (min 40)
const PANEL_EDGE_GAP = 40;
const TITLE_SIZES = [72, 66, 60, 54, 48, 44, 40, 36, 32];
const MAX_LINES = 4;
const LINE_HEIGHT = 1.1;

// ─── fonts ───────────────────────────────────────────────────────────────────

const FONT_DIR = join(dirname(fileURLToPath(import.meta.url)), 'fonts');
const fontCache = new Map();

function loadFont(file) {
  if (!fontCache.has(file)) {
    const buf = readFileSync(join(FONT_DIR, file));
    const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
    fontCache.set(file, opentype.parse(ab));
  }
  return fontCache.get(file);
}

const FONTS = {
  extra: () => loadFont('Poppins-ExtraBold.ttf'),
  bold: () => loadFont('Poppins-Bold.ttf'),
  semi: () => loadFont('Poppins-SemiBold.ttf'),
  regular: () => loadFont('Poppins-Regular.ttf'),
};

function capHeight(font, size) {
  const c = font.tables?.os2?.sCapHeight;
  return ((c || 0.7 * font.unitsPerEm) / font.unitsPerEm) * size;
}

/** Advance width of a string, with optional manual letter-spacing. */
function textWidth(font, text, size, spacing = 0) {
  if (!spacing) return font.getAdvanceWidth(text, size);
  let w = 0;
  for (const ch of text) w += font.getAdvanceWidth(ch, size) + spacing;
  return w - spacing;
}

/**
 * Serialise an opentype.js path to SVG path data. opentype.js 2.0's own
 * toPathData() can emit "NaN" for some glyph runs, so write the commands out
 * directly (same output format, 2 decimals).
 */
function pathData(path) {
  const n = (v) => {
    if (!Number.isFinite(v)) throw new Error('render-thumbnail: non-finite glyph coordinate');
    return String(+v.toFixed(2));
  };
  let d = '';
  for (const c of path.commands) {
    if (c.type === 'M' || c.type === 'L') d += `${c.type}${n(c.x)} ${n(c.y)}`;
    else if (c.type === 'Q') d += `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`;
    else if (c.type === 'C') d += `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`;
    else if (c.type === 'Z') d += 'Z';
  }
  return d;
}

/** SVG path data for text with its baseline-left at (x, y). */
function textPath(font, text, x, y, size, spacing = 0) {
  if (!spacing) return pathData(font.getPath(text, x, y, size));
  let cx = x;
  const parts = [];
  for (const ch of text) {
    parts.push(pathData(font.getPath(ch, cx, y, size)));
    cx += font.getAdvanceWidth(ch, size) + spacing;
  }
  return parts.join(' ');
}

// ─── wrapping + title fitting ────────────────────────────────────────────────

/** Greedy wrap on real advance widths. Returns null if a word is too wide. */
function greedyWrap(font, words, size, maxW) {
  const lines = [];
  let cur = [];
  for (const w of words) {
    if (font.getAdvanceWidth(w, size) > maxW) return null;
    const cand = [...cur, w].join(' ');
    if (!cur.length || font.getAdvanceWidth(cand, size) <= maxW) cur.push(w);
    else {
      lines.push(cur);
      cur = [w];
    }
  }
  if (cur.length) lines.push(cur);
  return lines;
}

/** Pull the last word of the previous line down so the last line is not an orphan. */
function rebalance(font, lines, size, maxW) {
  const n = lines.length;
  if (n < 2 || lines[n - 1].length !== 1 || lines[n - 2].length < 2) return lines;
  const out = lines.map((l) => [...l]);
  const moved = out[n - 2].pop();
  out[n - 1].unshift(moved);
  const ok = font.getAdvanceWidth(out[n - 1].join(' '), size) <= maxW;
  return ok ? out : lines;
}

/**
 * Largest size from the ladder whose wrap fits in <= 4 lines. Never truncates.
 * @returns {{ size: number, lines: string[] }}
 */
export function fitTitle(title, maxW = TITLE_MAX_W, font = FONTS.extra()) {
  const words = String(title).trim().split(/\s+/).filter(Boolean);
  const limit = Math.min(maxW, PANEL_W - MARGIN - PANEL_EDGE_GAP);
  for (const size of TITLE_SIZES) {
    const lines = greedyWrap(font, words, size, limit);
    if (lines && lines.length <= MAX_LINES) {
      return { size, lines: rebalance(font, lines, size, limit).map((l) => l.join(' ')) };
    }
  }
  // Extreme input: keep shrinking (never ellipsise).
  for (let size = 28; size >= 12; size -= 2) {
    const lines = greedyWrap(font, words, size, limit);
    if (lines && lines.length <= MAX_LINES) return { size, lines: lines.map((l) => l.join(' ')) };
  }
  return { size: 12, lines: [words.join(' ')] };
}

// ─── icons (200x200 box, stroke only, round caps/joins) ──────────────────────

const f = (n) => +n.toFixed(2);

function arcPoint(cx, cy, r, deg) {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function gearPath() {
  const teeth = 8;
  const rOut = 68;
  const rIn = 52;
  const pts = [];
  const step = 360 / teeth;
  for (let i = 0; i < teeth; i++) {
    const a = i * step - 90;
    // tooth: inner, outer, outer, inner
    for (const [da, r] of [[-0.3, rIn], [-0.17, rOut], [0.17, rOut], [0.3, rIn]]) {
      pts.push(arcPoint(100, 100, r, a + da * step));
    }
  }
  return 'M' + pts.map(([x, y]) => `${f(x)} ${f(y)}`).join(' L') + ' Z';
}

function playIcon() {
  // circular refresh arrow (open at the upper right) around a play triangle
  const r = 88;
  const startDeg = 0;
  const endDeg = -40;
  const [sx, sy] = arcPoint(100, 100, r, startDeg);
  const [ex, ey] = arcPoint(100, 100, r, endDeg);
  // clockwise on screen from 0deg round to -40deg (320deg sweep)
  const arc = `M${f(sx)} ${f(sy)} A${r} ${r} 0 1 1 ${f(ex)} ${f(ey)}`;
  // arrow head at the end, pointing along the clockwise tangent
  const t = (endDeg * Math.PI) / 180;
  const dir = [-Math.sin(t), Math.cos(t)];
  const back = (ang) => {
    const c = Math.cos(ang);
    const s = Math.sin(ang);
    const bx = -dir[0] * c + dir[1] * s;
    const by = -dir[0] * s - dir[1] * c;
    return [ex + bx * 20, ey + by * 20];
  };
  const [h1x, h1y] = back(0.62);
  const [h2x, h2y] = back(-0.62);
  const head = `M${f(h1x)} ${f(h1y)} L${f(ex)} ${f(ey)} L${f(h2x)} ${f(h2y)}`;
  return (
    `<path d="${arc}"/><path d="${head}"/>` +
    `<path d="M80 62 L80 138 L144 100 Z" fill="#fff" fill-opacity="0.35"/>`
  );
}

export const ICONS = {
  play: playIcon(),
  video:
    '<rect x="26" y="62" width="104" height="76" rx="14"/>' +
    '<path d="M130 90 L172 66 L172 134 L130 110"/>',
  house:
    '<path d="M28 98 L100 36 L172 98"/>' +
    '<path d="M46 84 V162 H154 V84"/>' +
    '<path d="M84 162 V116 H116 V162"/>',
  chart:
    '<path d="M36 34 V164 H172"/>' +
    '<path d="M56 136 L88 104 L112 124 L160 68"/>' +
    '<path d="M134 66 H160 V92"/>',
  megaphone:
    '<path d="M36 82 H78 L148 42 V138 L78 98 H36 Z"/>' +
    '<path d="M56 98 V142 H82 V102"/>' +
    '<path d="M166 80 Q176 90 166 100"/>',
  document:
    '<path d="M54 30 H118 L152 64 V170 H54 Z"/>' +
    '<path d="M118 30 V64 H152"/>' +
    '<path d="M74 98 H132 M74 122 H132 M74 146 H110"/>',
  search:
    '<circle cx="86" cy="86" r="50"/>' +
    '<path d="M122 122 L168 168"/>',
  chat:
    '<path d="M34 54 Q34 38 50 38 H150 Q166 38 166 54 V112 Q166 128 150 128 H92 L58 162 V128 H50 Q34 128 34 112 Z"/>' +
    '<path d="M64 74 H136 M64 96 H112"/>',
  gear: `<path d="${gearPath()}"/><circle cx="100" cy="100" r="24"/>`,
  cart:
    '<path d="M22 40 H48 L68 128 H154 L170 72 H56"/>' +
    '<circle cx="82" cy="154" r="10"/><circle cx="142" cy="154" r="10"/>',
  wrench:
    '<g transform="rotate(40 100 100)">' +
    '<path d="M90 80 C68 76 64 52 70 34 L88 40 L88 58 L112 58 L112 40 L130 34 C136 52 132 76 110 80 V160 Q110 172 100 172 Q90 172 90 160 Z"/>' +
    '</g>',
  dollar:
    '<circle cx="100" cy="100" r="70"/>' +
    '<path d="M100 54 V146"/>' +
    '<path d="M122 78 C122 62 78 62 78 84 C78 106 122 96 122 118 C122 140 78 140 78 122"/>',
  mic:
    '<rect x="78" y="28" width="44" height="82" rx="22"/>' +
    '<path d="M58 94 V102 A42 42 0 0 0 142 102 V94"/>' +
    '<path d="M100 144 V170 M74 170 H126"/>',
  sparkle:
    '<path d="M96 30 Q104 92 166 100 Q104 108 96 170 Q88 108 26 100 Q88 92 96 30 Z"/>' +
    '<path d="M160 22 V50 M146 36 H174"/>' +
    '<path d="M162 144 V164 M152 154 H172"/>',
};

export const ICON_NAMES = Object.keys(ICONS);

const SERVICE_ICON = {
  'video-editing': 'video',
  'linkedin-ghostwriting': 'chat',
  'blog-production': 'document',
  'ad-creatives': 'megaphone',
  'websites-funnels': 'chart',
  automations: 'gear',
  'apps-software': 'gear',
};
const ICP_ICON = {
  'real-estate': 'house',
  dtc: 'cart',
  'business-owners': 'wrench',
  'home-services': 'wrench',
  coaches: 'play',
  founders: 'chart',
};
const CATEGORY_ICON = {
  'real estate': 'house',
  'ai marketing': 'sparkle',
  funnels: 'chart',
  video: 'video',
  authority: 'mic',
  'content ops': 'document',
  seo: 'search',
  social: 'chat',
  automation: 'gear',
  strategy: 'chart',
  company: 'play',
  insights: 'document',
  guide: 'document',
};

/** Choose an icon: service, then ICP, then title keywords, then category, else document. */
export function pickIcon({ category, icp, service, title } = {}) {
  if (service && SERVICE_ICON[service]) return SERVICE_ICON[service];
  if (icp && ICP_ICON[icp]) return ICP_ICON[icp];
  const t = String(title || '').toLowerCase();
  if (/\b(cost|costs|price|prices|pricing)\b/.test(t)) return 'dollar';
  if (/\b(ai|chatgpt)\b/.test(t)) return 'sparkle';
  if (/\bpodcasts?\b/.test(t)) return 'mic';
  if (/\b(seo|google|search)\b/.test(t)) return 'search';
  const c = CATEGORY_ICON[String(category || '').toLowerCase()];
  return c || 'document';
}

// ─── SVG ─────────────────────────────────────────────────────────────────────

/**
 * @param {{ title: string, category?: string, subtitle?: string, icon?: string }} opts
 * @returns {string} SVG markup
 */
export function buildThumbnailSvg({ title, category = '', subtitle = '', icon } = {}) {
  const extra = FONTS.extra();
  const bold = FONTS.bold();
  const semi = FONTS.semi();
  const regular = FONTS.regular();

  const parts = [];

  // --- title block geometry
  const { size, lines } = fitTitle(title, TITLE_MAX_W, extra);
  const lineH = size * LINE_HEIGHT;
  const capH = capHeight(extra, size);
  const titleH = (lines.length - 1) * lineH + capH; // cap-top of line 1 to last baseline

  const subText = String(subtitle || '').trim();
  let subSize = 17;
  if (subText) {
    while (subSize > 12 && textWidth(bold, subText, subSize) > TITLE_MAX_W - 14) subSize -= 1;
  }
  const subCap = subText ? capHeight(bold, subSize) : 0;
  const GAP = 24; // last title baseline to subtitle cap-top
  const groupH = titleH + (subText ? GAP + subCap : 0);
  const CENTER_Y = 326;
  let top = CENTER_Y - groupH / 2;
  // keep clear of pill (bottom 96) and divider (526)
  top = Math.max(top, 96 + 28);
  const firstBase = top + capH;

  // --- category pill
  if (category && String(category).trim()) {
    const label = String(category).trim().toUpperCase();
    const pSize = 14.5;
    const spacing = 0.4;
    const tw = textWidth(bold, label, pSize, spacing);
    const pad = 17;
    const pw = Math.round(tw + pad * 2);
    const ph = 34;
    const py = 62;
    const base = py + ph / 2 + capHeight(bold, pSize) / 2;
    parts.push(
      `<rect x="${MARGIN}" y="${py}" width="${pw}" height="${ph}" rx="${ph / 2}" fill="${COLORS.orange}"/>`,
      `<path d="${textPath(bold, label, MARGIN + (pw - tw) / 2, base, pSize, spacing)}" fill="#fff"/>`,
    );
  }

  // --- title
  lines.forEach((ln, i) => {
    parts.push(`<path d="${textPath(extra, ln, MARGIN, firstBase + i * lineH, size)}" fill="${COLORS.cream}"/>`);
  });

  // --- subtitle with bar
  if (subText) {
    const lastBase = firstBase + (lines.length - 1) * lineH;
    const capTop = lastBase + GAP;
    const base = capTop + subCap;
    parts.push(
      `<rect x="${MARGIN}" y="${f(capTop - 1)}" width="3" height="${f(subCap + 2)}" fill="${COLORS.orange}"/>`,
      `<path d="${textPath(bold, subText, MARGIN + 16, base, subSize)}" fill="${COLORS.orange}"/>`,
    );
  }

  // --- footer
  const rightEdge = PANEL_W - MARGIN;
  const rowCenter = HEIGHT - 68;
  parts.push(
    `<rect x="${MARGIN}" y="526" width="${rightEdge - MARGIN}" height="1" fill="${COLORS.cream}" fill-opacity="0.14"/>`,
  );
  const wmSize = 22;
  const wmBase = rowCenter + capHeight(bold, wmSize) / 2;
  const wmW = textWidth(bold, 'EchoPulse', wmSize);
  parts.push(
    `<path d="${textPath(bold, 'EchoPulse', MARGIN, wmBase, wmSize)}" fill="${COLORS.cream}"/>`,
    `<circle cx="${f(MARGIN + wmW + 9)}" cy="${f(wmBase - 4)}" r="3.6" fill="${COLORS.orange}"/>`,
  );
  const siteSize = 16;
  const site = 'echopulse.media';
  const siteW = textWidth(regular, site, siteSize);
  parts.push(
    `<path d="${textPath(regular, site, rightEdge - siteW, rowCenter + capHeight(regular, siteSize) / 2, siteSize)}" fill="${COLORS.muted}"/>`,
  );
  void semi; // SemiBold is bundled for future use (kept loaded for parity)

  // --- right panel art
  const cx = PANEL_W + (WIDTH - PANEL_W) / 2;
  const cy = 315;
  const iconKey = ICONS[icon] ? icon : 'play';
  const dots = [0.95, 0.6, 0.35]
    .map((o, i) => `<circle cx="${f(cx - 35 + i * 35)}" cy="${cy + 107}" r="6" fill="none" stroke="#fff" stroke-opacity="${o}" stroke-width="3"/>`)
    .join('');

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <defs>
    <radialGradient id="warm" cx="0" cy="0" r="520" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#3A2112" stop-opacity="0.95"/>
      <stop offset="0.5" stop-color="#26150B" stop-opacity="0.45"/>
      <stop offset="1" stop-color="#26150B" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="orange" gradientUnits="userSpaceOnUse" x1="${PANEL_W}" y1="0" x2="${WIDTH}" y2="${HEIGHT}">
      <stop offset="0" stop-color="#F27B45"/>
      <stop offset="0.55" stop-color="#C9440F"/>
      <stop offset="1" stop-color="#7E2A0B"/>
    </linearGradient>
    <radialGradient id="hi" cx="780" cy="150" r="260" gradientUnits="userSpaceOnUse">
      <stop offset="0" stop-color="#fff" stop-opacity="0.2"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <clipPath id="right"><rect x="${PANEL_W}" y="0" width="${WIDTH - PANEL_W}" height="${HEIGHT}"/></clipPath>
  </defs>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${COLORS.bg}"/>
  <rect width="${PANEL_W}" height="${HEIGHT}" fill="url(#warm)"/>
  <rect x="${PANEL_W}" width="${WIDTH - PANEL_W}" height="${HEIGHT}" fill="url(#orange)"/>
  <rect x="${PANEL_W}" width="${WIDTH - PANEL_W}" height="${HEIGHT}" fill="url(#hi)"/>
  <g clip-path="url(#right)">
    <circle cx="${cx}" cy="${cy}" r="200" fill="none" stroke="#fff" stroke-opacity="0.16" stroke-width="1.5"/>
    <circle cx="${cx}" cy="${cy}" r="143" fill="none" stroke="#fff" stroke-opacity="0.24" stroke-width="1.5"/>
    <g transform="translate(${cx - 100} ${cy - 100})" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" stroke-opacity="0.95">${ICONS[iconKey]}</g>
    ${dots}
  </g>
  ${parts.join('\n  ')}
</svg>`;
}

/**
 * Render the PNG buffer.
 * @param {{ title: string, category?: string, subtitle?: string, icon?: string }} opts
 * @returns {Promise<Buffer>}
 */
export async function renderThumbnail({ title, category, subtitle, icon } = {}) {
  if (!title || !String(title).trim()) {
    throw new Error('renderThumbnail: title is required');
  }
  const svg = buildThumbnailSvg({ title, category, subtitle, icon });
  return sharp(Buffer.from(svg), { density: 96 })
    .resize(WIDTH, HEIGHT)
    .png({ compressionLevel: 9 })
    .toBuffer();
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [title, out, category, subtitle, icon] = process.argv.slice(2);
  if (!title || !out) {
    console.error('Usage: node scripts/render-thumbnail.mjs "Title" out.png [Category] [Subtitle] [icon]');
    console.error(`Icons: ${ICON_NAMES.join(', ')}`);
    process.exit(1);
  }
  const png = await renderThumbnail({
    title,
    category: category || '',
    subtitle: subtitle || '',
    icon: icon || pickIcon({ category, title }),
  });
  writeFileSync(out, png);
  console.log(`Wrote ${out} (${(png.length / 1024).toFixed(0)} KB)`);
}
