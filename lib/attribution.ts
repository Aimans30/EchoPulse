/**
 * Where a visitor came from, kept on the visitor's own device and attached to
 * every lead and every booking link. Full write-up: docs/tracking.md.
 *
 * This file has no 'use client' directive on purpose: the sanitiser and the
 * formatters at the bottom run on the server (app/api/lead/route.ts), and
 * every function that reads the browser guards for `window` itself.
 *
 * WHAT IS STORED
 *   sessionStorage  ep_attr_session  this visit: the touch that started it and
 *                                    the last few page paths
 *   localStorage    ep_attr          { first, last }: the first touch ever
 *                                    (never overwritten, dropped after 90
 *                                    days) and the latest non-direct touch
 *   both            ep_book_click    the last booking button clicked (which
 *                                    button, on which page), read by /booked
 *
 * Nothing here is personal data: paths, a referrer HOST (never the full URL),
 * UTM values and a timestamp. No names, emails, IP addresses or query strings.
 */

export interface Touch {
  landing_path: string;
  referrer_host: string;
  /** ai | search | social | email | paid | referral | campaign (UTM, no referrer) | direct */
  referrer_type: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  /** ISO timestamp of the page view that created this touch. */
  first_seen_at: string;
}

/** What a form sends to /api/lead as `attribution`. First touch, flat. */
export interface LeadAttribution extends Touch {
  /** Latest non-direct touch, only when it differs from the first. */
  last_touch?: Touch;
  /** Page paths seen this visit, oldest first, capped. */
  pages?: string[];
  /** The page the form was submitted from. */
  submit_path?: string;
}

const SESSION_KEY = 'ep_attr_session';
const STORE_KEY = 'ep_attr';
const CLICK_KEY = 'ep_book_click';
const NINETY_DAYS = 90 * 24 * 60 * 60 * 1000;
/** A booking click older than this no longer explains a /booked page view. */
const CLICK_TTL = 6 * 60 * 60 * 1000;
const MAX_PAGES = 8;

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const;

/** Assistants that send visitors. Matched against the host and its parents. */
export const AI_REFERRER_HOSTS = [
  'chatgpt.com',
  'chat.openai.com',
  'perplexity.ai',
  'gemini.google.com',
  'copilot.microsoft.com',
  'claude.ai',
];

const SEARCH_RE = /(^|\.)(google|bing|duckduckgo|yahoo|yandex|baidu|ecosia|startpage|kagi)\.[a-z.]+$|(^|\.)search\.brave\.com$/;
const SOCIAL_RE = /(^|\.)(linkedin\.com|lnkd\.in|facebook\.com|instagram\.com|t\.co|twitter\.com|x\.com|youtube\.com|youtu\.be|reddit\.com|tiktok\.com|pinterest\.[a-z.]+|threads\.net|whatsapp\.com|wa\.me)$/;
const EMAIL_RE = /(^|\.)(mail\.google\.com|outlook\.live\.com|outlook\.office\.com|mail\.yahoo\.com|mail\.proton\.me)$/;
const PAID_MEDIUM_RE = /^(cpc|ppc|paid|paidsocial|paid_social|paid-social|display|cpm|ads?)$/i;
/** Hosts that are part of our own funnel and must never count as a source. */
const FUNNEL_HOSTS = /(^|\.)cal\.com$/;

function hostMatches(host: string, list: string[]): boolean {
  return list.some((h) => host === h || host.endsWith(`.${h}`));
}

/** True when the host, or the utm_source ChatGPT and friends append, is an AI assistant. */
export function isAiReferrer(host: string, utmSource = ''): boolean {
  const h = host.toLowerCase().replace(/^www\./, '');
  const s = utmSource.toLowerCase().replace(/^www\./, '');
  return (!!h && hostMatches(h, AI_REFERRER_HOSTS)) || (!!s && hostMatches(s, AI_REFERRER_HOSTS));
}

export function classifyReferrer(host: string, utmSource = '', utmMedium = '', paidClick = false): string {
  const h = host.toLowerCase().replace(/^www\./, '');
  if (isAiReferrer(h, utmSource)) return 'ai';
  if (paidClick || PAID_MEDIUM_RE.test(utmMedium)) return 'paid';
  if (/^e-?mail$|^newsletter$/i.test(utmMedium) || EMAIL_RE.test(h)) return 'email';
  if (SEARCH_RE.test(h)) return 'search';
  if (SOCIAL_RE.test(h)) return 'social';
  if (h) return 'referral';
  if (utmSource) return 'campaign';
  return 'direct';
}

const clip = (v: unknown, max: number): string => (typeof v === 'string' ? v.trim().slice(0, max) : '');

/* ── Browser storage (all guarded) ─────────────────────────────────────── */

/** Last-resort copy for browsers with storage blocked: survives client-side navigation only. */
let memorySession: { touch: Touch; pages: string[] } | null = null;
let memoryClick: BookingClick | null = null;
/** Set by components/AttributionTracker: may the 90-day copy be written? */
let persistAllowed = false;

function readJson<T>(kind: 'session' | 'local', key: string): T | null {
  try {
    const store = kind === 'session' ? window.sessionStorage : window.localStorage;
    const raw = store.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function writeJson(kind: 'session' | 'local', key: string, value: unknown): void {
  try {
    const store = kind === 'session' ? window.sessionStorage : window.localStorage;
    store.setItem(key, JSON.stringify(value));
  } catch {
    /* private mode or storage disabled: the in-memory copy still works */
  }
}

function isTouch(v: unknown): v is Touch {
  return !!v && typeof v === 'object' && typeof (v as Touch).landing_path === 'string' && typeof (v as Touch).first_seen_at === 'string';
}

interface Stored { first?: Touch; last?: Touch }

function readStore(): Stored {
  const s = readJson<Stored>('local', STORE_KEY) ?? {};
  const out: Stored = {};
  if (isTouch(s.first)) {
    const age = Date.now() - Date.parse(s.first.first_seen_at);
    if (Number.isFinite(age) && age >= 0 && age < NINETY_DAYS) out.first = s.first;
  }
  if (isTouch(s.last)) out.last = s.last;
  return out;
}

function touchFromLocation(): Touch {
  const params = new URLSearchParams(window.location.search);
  let host = '';
  try {
    if (document.referrer) host = new URL(document.referrer).hostname.toLowerCase().replace(/^www\./, '');
  } catch { /* unparseable referrer: treat as none */ }
  const own = window.location.hostname.toLowerCase().replace(/^www\./, '');
  const internal = !!host && (host === own || FUNNEL_HOSTS.test(host));
  if (internal) host = '';
  const utm = Object.fromEntries(UTM_KEYS.map((k) => [k, clip(params.get(k), 120)])) as Record<(typeof UTM_KEYS)[number], string>;
  // Ad click ids only. fbclid is left out: Facebook adds it to unpaid links too.
  const paidClick = ['gclid', 'gbraid', 'wbraid', 'msclkid'].some((k) => params.has(k));
  let type = classifyReferrer(host, utm.utm_source, utm.utm_medium, paidClick);
  if (type === 'direct' && internal) type = 'internal';
  return {
    landing_path: window.location.pathname.slice(0, 200),
    referrer_host: host.slice(0, 120),
    referrer_type: type,
    ...utm,
    first_seen_at: new Date().toISOString(),
  };
}

const isDirect = (t: Touch) => t.referrer_type === 'direct' || t.referrer_type === 'internal';

/**
 * Record this page view. Called by components/AttributionTracker on every
 * route change. The first call of a visit creates the touch; later calls only
 * add the path to the trail.
 *
 * `persist` says whether the 90-day localStorage copy may be written (the
 * tracker decides from the visitor's analytics choice). The per-visit
 * sessionStorage copy is always written: it disappears with the tab and is
 * only ever sent with a form the visitor submits themselves.
 */
export function captureAttribution(persist: boolean): void {
  if (typeof window === 'undefined') return;
  persistAllowed = persist;
  const path = window.location.pathname;
  // /booked is where Cal.com sends people back (often in a new tab, or inside
  // the booking iframe). It is the end of a visit, never the start of one.
  if (path.startsWith('/booked') || window.parent !== window) return;

  let session = readJson<{ touch: Touch; pages: string[] }>('session', SESSION_KEY) ?? memorySession;
  if (!session || !isTouch(session.touch)) {
    let touch = touchFromLocation();
    // A new tab opened from our own pages (or back from Cal.com) is the same
    // visit, not a new "direct" one: carry the stored touch over.
    if (touch.referrer_type === 'internal') {
      const s = readStore();
      const inherited = s.last ?? s.first;
      touch = inherited ? { ...inherited } : { ...touch, referrer_type: 'direct' };
    }
    session = { touch, pages: [] };
  }
  if (session.pages[session.pages.length - 1] !== path) {
    session.pages = [...session.pages, path.slice(0, 120)].slice(-MAX_PAGES);
  }
  memorySession = session;
  writeJson('session', SESSION_KEY, session);

  if (persist) {
    const store = readStore();
    const next: Stored = { first: store.first ?? session.touch, last: store.last };
    // Last touch follows the usual rule: a direct visit never replaces a
    // known source, so "came from Google, returned by typing the URL" still
    // reads as Google.
    if (!next.last || !isDirect(session.touch)) next.last = session.touch;
    writeJson('local', STORE_KEY, next);
  }
}

function currentSession(): { touch: Touch; pages: string[] } | null {
  if (typeof window === 'undefined') return null;
  const s = readJson<{ touch: Touch; pages: string[] }>('session', SESSION_KEY) ?? memorySession;
  return s && isTouch(s.touch) ? s : null;
}

/** First touch: the 90-day copy when there is one, else this visit's touch. */
export function getFirstTouch(): Touch | null {
  if (typeof window === 'undefined') return null;
  return readStore().first ?? currentSession()?.touch ?? null;
}

/**
 * Everything a lead form should send. Usage:
 *
 *   body: JSON.stringify({ ...fields, attribution: getAttribution() })
 *
 * Returns null on the server or when nothing could be captured; /api/lead
 * accepts null and simply omits the "Came from" line.
 */
export function getAttribution(): LeadAttribution | null {
  if (typeof window === 'undefined') return null;
  const session = currentSession();
  const store = readStore();
  const first = store.first ?? session?.touch;
  if (!first) return null;
  const last = session && !isDirect(session.touch) ? session.touch : store.last;
  const out: LeadAttribution = { ...first, submit_path: window.location.pathname.slice(0, 200) };
  if (last && last.first_seen_at !== first.first_seen_at) out.last_touch = last;
  if (session?.pages.length) out.pages = session.pages;
  return out;
}

/**
 * Small, non-personal first-touch fields for analytics events
 * (`booking_confirmed` and the form submits).
 */
export function firstTouchParams(): Record<string, string> {
  const t = getFirstTouch();
  if (!t) return {};
  return {
    ft_source: sourceOf(t),
    ft_medium: mediumOf(t),
    ft_landing: t.landing_path.slice(0, 100),
    ...(t.utm_campaign ? { ft_campaign: t.utm_campaign.slice(0, 100) } : {}),
    ft_ref_type: t.referrer_type,
  };
}

/** "google.com", the visitor's utm_source, or "direct". */
export function sourceOf(t: Touch): string {
  return t.utm_source || t.referrer_host || 'direct';
}
/** The visitor's utm_medium, else the referrer type (search, ai, social...). */
export function mediumOf(t: Touch): string {
  return t.utm_medium || (t.referrer_type === 'internal' ? 'direct' : t.referrer_type) || 'direct';
}

/* ── Booking click breadcrumb ──────────────────────────────────────────── */

export interface BookingClick { location: string; page: string; at: number }

/**
 * Remember which booking button was clicked and on which page. /booked reads
 * it so a booking made in a new tab is credited to the page that earned it,
 * not to /booked.
 */
export function rememberBookingClick(location: string): void {
  if (typeof window === 'undefined') return;
  const click: BookingClick = { location: location.slice(0, 80), page: window.location.pathname.slice(0, 200), at: Date.now() };
  memoryClick = click;
  writeJson('session', CLICK_KEY, click);
  // The new Cal.com tab has its own sessionStorage, so the copy it can read
  // has to be in localStorage.
  if (persistAllowed) writeJson('local', CLICK_KEY, click);
}

export function lastBookingClick(): BookingClick | null {
  if (typeof window === 'undefined') return null;
  const candidates = [readJson<BookingClick>('session', CLICK_KEY), readJson<BookingClick>('local', CLICK_KEY), memoryClick]
    .filter((c): c is BookingClick => !!c && typeof c.location === 'string' && typeof c.page === 'string' && typeof c.at === 'number')
    .filter((c) => Date.now() - c.at < CLICK_TTL)
    .sort((a, b) => b.at - a.at);
  return candidates[0] ?? null;
}

/* ── Server side: validate what a form sent, and print it ──────────────── */

const TOUCH_CAPS: Record<keyof Touch, number> = {
  landing_path: 200,
  referrer_host: 120,
  referrer_type: 20,
  utm_source: 120,
  utm_medium: 120,
  utm_campaign: 120,
  utm_content: 120,
  utm_term: 120,
  first_seen_at: 40,
};

/** Control characters out, Slack markup characters out, length capped. */
function cleanText(v: unknown, max: number): string {
  if (typeof v !== 'string') return '';
  return v
    .replace(/[\u0000-\u001f\u007f]+/g, ' ')
    .replace(/[<>*`~]/g, '')
    .trim()
    .slice(0, max);
}

/** A site path only: must start with "/", and never carries a query string or fragment. */
function cleanPath(v: unknown, max: number): string {
  const p = cleanText(v, 600).split(/[?#]/)[0].slice(0, max);
  return p.startsWith('/') ? p : '';
}

function cleanTouch(input: unknown): Touch | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const src = input as Record<string, unknown>;
  const out = {} as Touch;
  (Object.keys(TOUCH_CAPS) as Array<keyof Touch>).forEach((k) => {
    out[k] = cleanText(src[k], TOUCH_CAPS[k]);
  });
  out.landing_path = cleanPath(src.landing_path, TOUCH_CAPS.landing_path);
  out.referrer_host = /^[a-z0-9.-]+$/i.test(out.referrer_host) ? out.referrer_host.toLowerCase() : '';
  out.referrer_type = /^[a-z]+$/.test(out.referrer_type) ? out.referrer_type : '';
  if (out.first_seen_at && Number.isNaN(Date.parse(out.first_seen_at))) out.first_seen_at = '';
  const hasAny = (Object.keys(TOUCH_CAPS) as Array<keyof Touch>).some((k) => k !== 'first_seen_at' && k !== 'referrer_type' && out[k]);
  return hasAny ? out : null;
}

/**
 * Validate the `attribution` object a form posted. Unknown keys are dropped,
 * non-strings are dropped, every value is length-capped. Returns null when
 * nothing usable was sent, so callers can skip the line entirely.
 */
export function sanitizeAttribution(input: unknown): LeadAttribution | null {
  const first = cleanTouch(input);
  if (!first) return null;
  const src = input as Record<string, unknown>;
  const out: LeadAttribution = { ...first };
  const last = cleanTouch(src.last_touch);
  if (last) out.last_touch = last;
  if (Array.isArray(src.pages)) {
    const pages = src.pages
      .slice(0, MAX_PAGES)
      .map((p) => cleanPath(p, 120))
      .filter(Boolean);
    if (pages.length) out.pages = pages;
  }
  const submit = cleanPath(src.submit_path, 200);
  if (submit) out.submit_path = submit;
  return out;
}

/** Two-letter country from the platform's geo header. Never the IP address. */
export function countryFromHeaders(headers: Headers): string {
  const c = (headers.get('x-vercel-ip-country') || headers.get('cf-ipcountry') || '').trim().toUpperCase();
  return /^[A-Z]{2}$/.test(c) && c !== 'XX' ? c : '';
}

function utmSummary(t: Touch): string {
  const parts = UTM_KEYS.filter((k) => t[k]).map((k) => `${k.replace('utm_', '')}=${t[k]}`);
  return parts.join(', ');
}

function referrerSummary(t: Touch): string {
  if (!t.referrer_host) return t.referrer_type && t.referrer_type !== 'direct' ? `none (${t.referrer_type})` : 'none (direct)';
  return `${t.referrer_host}${t.referrer_type ? ` (${t.referrer_type})` : ''}`;
}

const aiFlag = (t: Touch) => (isAiReferrer(t.referrer_host, t.utm_source) ? `yes (${t.referrer_host || t.utm_source})` : 'no');

/**
 * One compact line for Slack, e.g.
 *   landed on /blog/x · referrer google.com (search) · utm source=test, campaign=x · AI referrer: no · country US · pages / > /pricing
 */
export function formatCameFromLine(attr: LeadAttribution | null, country = ''): string {
  const bits: string[] = [];
  if (attr) {
    bits.push(`landed on ${attr.landing_path || 'unknown page'}`);
    bits.push(`referrer ${referrerSummary(attr)}`);
    const utm = utmSummary(attr);
    if (utm) bits.push(`utm ${utm}`);
    bits.push(`AI referrer: ${aiFlag(attr)}`);
  }
  if (country) bits.push(`country ${country}`);
  if (attr?.pages && attr.pages.length > 1) bits.push(`pages ${attr.pages.join(' > ')}`);
  if (attr?.last_touch) {
    const l = attr.last_touch;
    bits.push(`latest visit via ${sourceOf(l)} (${mediumOf(l)})`);
  }
  return bits.join(' · ');
}

/** The same facts, one per line, for the Asana task notes. */
export function formatOriginNotes(attr: LeadAttribution | null, country = ''): string {
  if (!attr && !country) return '';
  const lines = ['Where this lead came from'];
  if (attr) {
    lines.push(`Landing page: ${attr.landing_path || 'unknown'}`);
    lines.push(`Referrer: ${referrerSummary(attr)}`);
    lines.push(`UTM: ${utmSummary(attr) || 'none'}`);
    lines.push(`AI referrer: ${aiFlag(attr)}`);
    if (attr.first_seen_at) lines.push(`First seen: ${attr.first_seen_at}`);
    if (attr.pages?.length) lines.push(`Pages this visit: ${attr.pages.join(' > ')}`);
    if (attr.submit_path) lines.push(`Submitted from: ${attr.submit_path}`);
    if (attr.last_touch) {
      const l = attr.last_touch;
      lines.push(`Latest visit: ${sourceOf(l)} (${mediumOf(l)}), landed on ${l.landing_path || 'unknown'}${utmSummary(l) ? `, utm ${utmSummary(l)}` : ''}`);
    }
  }
  if (country) lines.push(`Country: ${country}`);
  return lines.join('\n');
}

/**
 * "Came from" line for a Cal.com booking, read from the booking's metadata
 * (the metadata[ep_*] parameters bookingUrl() in lib/links.ts puts on every
 * booking link). Returns '' when the booking carries none, e.g. a link shared
 * by hand. Used by app/api/cal-webhook/route.ts.
 *
 * UNVERIFIED against a live booking: that Cal.com copies metadata[...] URL
 * parameters into the webhook payload's `metadata` object.
 */
export function formatBookingOrigin(metadata: unknown): string {
  if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return '';
  const m = metadata as Record<string, unknown>;
  const get = (k: string) => cleanText(m[k], 160);
  const source = get('ep_source');
  const medium = get('ep_medium');
  const landing = get('ep_landing');
  const page = get('ep_page');
  const location = get('ep_location');
  const plan = get('ep_plan');
  const bits: string[] = [];
  if (source) bits.push(`${source}${medium ? ` (${medium})` : ''}`);
  if (landing) bits.push(`landed on ${landing}`);
  if (location || page) bits.push(`booked with ${location || 'a button'}${page ? ` on ${page}` : ''}`);
  if (plan) bits.push(`plan ${plan}`);
  if (source) bits.push(`AI referrer: ${isAiReferrer(source, source) ? 'yes' : 'no'}`);
  return bits.join(' · ');
}
