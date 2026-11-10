/**
 * Blog thumbnail / OG image generator (1200x630 PNG), no browser needed.
 *
 * Builds an SVG in the EchoPulse brand (dark background, orange glow, subtle
 * cream grid, bold title, category pill, EchoPulse mark + echopulse.media) and
 * rasterises it with sharp (librsvg). No external fonts are referenced: the
 * SVG asks for "Inter, Arial, Helvetica, sans-serif" and librsvg falls back to
 * whatever is installed, so the layout uses a conservative width heuristic.
 *
 * Importable:
 *   import { renderThumbnail } from './render-thumbnail.mjs';
 *   const png = await renderThumbnail({ title, category });   // Buffer
 *
 * Standalone:
 *   node scripts/render-thumbnail.mjs "Title of the post" out.png [Category]
 */

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

export const WIDTH = 1200;
export const HEIGHT = 630;

const COLORS = {
  bg: '#0C0C0B',
  orange: '#E8541A',
  cream: '#F2EEE7',
  muted: '#6E6B63',
  white: '#FFFFFF',
};

const FONT = 'Inter, Arial, Helvetica, sans-serif';

/** Average glyph width as a fraction of font size for bold Inter-ish sans. */
const AVG_CHAR_W = 0.56;

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Greedy word wrap using the char-width heuristic. Returns at most `maxLines`
 * lines; the last line is ellipsised if the text does not fit.
 */
export function wrapText(text, fontSize, maxWidth, maxLines) {
  const maxChars = Math.max(8, Math.floor(maxWidth / (fontSize * AVG_CHAR_W)));
  const words = String(text).trim().split(/\s+/);
  const lines = [];
  let cur = '';
  for (const w of words) {
    const candidate = cur ? `${cur} ${w}` : w;
    if (candidate.length <= maxChars) {
      cur = candidate;
    } else {
      if (cur) lines.push(cur);
      // A single word longer than the line gets hard-broken.
      cur = w.length > maxChars ? w.slice(0, maxChars - 1) + '-' : w;
    }
  }
  if (cur) lines.push(cur);
  if (lines.length > maxLines) {
    const kept = lines.slice(0, maxLines);
    let last = kept[maxLines - 1];
    last = last.slice(0, Math.max(0, maxChars - 1)).replace(/[\s,.;:-]+$/, '') + '…';
    kept[maxLines - 1] = last;
    return { lines: kept, truncated: true };
  }
  return { lines, truncated: false };
}

/** Pick a font size so the title fits in 3 lines; shrink for long titles. */
export function fitTitle(title, maxWidth) {
  const len = title.trim().length;
  let size = len > 90 ? 48 : len > 60 ? 54 : 64;
  // Step down until it wraps into <= 3 lines without truncation.
  for (; size >= 36; size -= 4) {
    const r = wrapText(title, size, maxWidth, 3);
    if (!r.truncated) return { size, lines: r.lines };
  }
  return { size: 36, lines: wrapText(title, 36, maxWidth, 3).lines };
}

/** The EchoPulse mark: three orange bars on a dark rounded square. */
function markSvg(x, y, size) {
  const r = size * 0.22;
  const barH = size * 0.11;
  const gap = size * 0.09;
  const pad = size * 0.2;
  const barW = size - pad * 2;
  const bars = [0, 1, 2]
    .map((i) => {
      const w = i === 1 ? barW : barW * 0.7;
      const by = y + pad + i * (barH + gap);
      return `<rect x="${x + pad}" y="${by}" width="${w}" height="${barH}" rx="${barH / 2}" fill="${COLORS.orange}"/>`;
    })
    .join('');
  return `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${r}" fill="#1A1917" stroke="rgba(242,238,231,0.14)" stroke-width="2"/>${bars}`;
}

/**
 * @param {{ title: string, category?: string, site?: string }} opts
 * @returns {string} SVG markup
 */
export function buildThumbnailSvg({ title, category = '', site = 'echopulse.media' }) {
  const padX = 80;
  const contentW = WIDTH - padX * 2;
  const { size, lines } = fitTitle(title, contentW);
  const lineH = Math.round(size * 1.12);

  // Vertical layout: pill above the title, title block vertically centred in
  // the space above the footer.
  const footerY = HEIGHT - 76;
  const pillH = 40;
  const titleBlockH = lines.length * lineH;
  const groupH = (category ? pillH + 28 : 0) + titleBlockH;
  const groupTop = Math.max(90, Math.round((footerY - 40 - groupH) / 2));

  let y = groupTop;
  let pill = '';
  if (category) {
    const label = category.toUpperCase();
    const pillW = Math.round(label.length * 15 * 0.68 + 44);
    pill = `
      <rect x="${padX}" y="${y}" width="${pillW}" height="${pillH}" rx="${pillH / 2}" fill="rgba(232,84,26,0.16)" stroke="${COLORS.orange}" stroke-width="1.5"/>
      <text x="${padX + pillW / 2}" y="${y + pillH / 2 + 5.5}" text-anchor="middle" font-family="${FONT}" font-size="15" font-weight="700" letter-spacing="2" fill="${COLORS.orange}">${escapeXml(label)}</text>`;
    y += pillH + 28;
  }

  const titleText = lines
    .map((ln, i) => `<tspan x="${padX}" y="${y + size + i * lineH}">${escapeXml(ln)}</tspan>`)
    .join('');

  const grid = `
    <defs>
      <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="${COLORS.cream}" stroke-opacity="0.05" stroke-width="1"/>
      </pattern>
      <radialGradient id="glow" cx="0.88" cy="0.12" r="0.75">
        <stop offset="0" stop-color="${COLORS.orange}" stop-opacity="0.42"/>
        <stop offset="0.45" stop-color="${COLORS.orange}" stop-opacity="0.10"/>
        <stop offset="1" stop-color="${COLORS.orange}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="bottom" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="${COLORS.bg}" stop-opacity="0"/>
        <stop offset="1" stop-color="${COLORS.bg}" stop-opacity="0.9"/>
      </linearGradient>
    </defs>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  ${grid}
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${COLORS.bg}"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#grid)"/>
  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#glow)"/>
  <rect x="0" y="${HEIGHT - 160}" width="${WIDTH}" height="160" fill="url(#bottom)"/>
  <rect x="0" y="0" width="${WIDTH}" height="6" fill="${COLORS.orange}"/>
  ${pill}
  <text font-family="${FONT}" font-size="${size}" font-weight="800" fill="${COLORS.white}" letter-spacing="${-(size * 0.025).toFixed(1)}">${titleText}</text>
  ${markSvg(padX, footerY - 22, 44)}
  <text x="${padX + 60}" y="${footerY + 8}" font-family="${FONT}" font-size="22" font-weight="700" fill="${COLORS.cream}">${escapeXml(site)}</text>
  <text x="${WIDTH - padX}" y="${footerY + 8}" text-anchor="end" font-family="${FONT}" font-size="16" font-weight="600" letter-spacing="1.5" fill="${COLORS.muted}">ECHOPULSE BLOG</text>
</svg>`;
}

/**
 * Render the PNG buffer.
 * @param {{ title: string, category?: string, site?: string }} opts
 * @returns {Promise<Buffer>}
 */
export async function renderThumbnail(opts) {
  if (!opts || !opts.title || !String(opts.title).trim()) {
    throw new Error('renderThumbnail: title is required');
  }
  const svg = buildThumbnailSvg(opts);
  return sharp(Buffer.from(svg), { density: 96 })
    .resize(WIDTH, HEIGHT)
    .png({ compressionLevel: 9 })
    .toBuffer();
}

// ─── CLI ─────────────────────────────────────────────────────────────────────

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const [title, out, category] = process.argv.slice(2);
  if (!title || !out) {
    console.error('Usage: node scripts/render-thumbnail.mjs "Title" out.png [Category]');
    process.exit(1);
  }
  const png = await renderThumbnail({ title, category: category || '' });
  writeFileSync(out, png);
  console.log(`Wrote ${out} (${(png.length / 1024).toFixed(0)} KB)`);
}
