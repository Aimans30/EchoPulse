/**
 * Razorpay key probe.
 *
 * Why this exists: when /api/razorpay/order returns 401 we cannot tell from
 * the symptom alone whether the test keys are revoked or the Next dev server
 * is running with a stale env (started before .env.local was last edited).
 *
 * This script reads .env.local DIRECTLY and hits Razorpay's order API once.
 * It runs OUTSIDE Next, so a clean exit-0 means the keys themselves are
 * valid — the problem is then dev server cache (fix: Ctrl-C and restart).
 *
 * Run from repo root:
 *   node scripts/probe-razorpay.mjs
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const envFile = resolve(process.cwd(), '.env.local');
const env = Object.fromEntries(
  readFileSync(envFile, 'utf-8')
    .split('\n')
    .filter(l => l && !l.startsWith('#') && l.includes('='))
    .map(l => {
      const eq = l.indexOf('=');
      return [l.slice(0, eq).trim(), l.slice(eq + 1).trim()];
    })
);

const KEY = env.RAZORPAY_KEY_ID;
const SECRET = env.RAZORPAY_KEY_SECRET;

if (!KEY || !SECRET) {
  console.error('✗ Missing RAZORPAY_KEY_ID or RAZORPAY_KEY_SECRET in .env.local');
  process.exit(1);
}

console.log(`Probing with key: ${KEY.slice(0, 14)}…  (secret length: ${SECRET.length})`);

const auth = Buffer.from(`${KEY}:${SECRET}`).toString('base64');
const body = JSON.stringify({
  amount: 999900,                          // ₹9,999 in paise — matches the test flow
  currency: 'INR',
  receipt: `probe_${Date.now()}`,
  notes: { source: 'probe-razorpay.mjs' },
});

try {
  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body,
  });
  const text = await res.text();
  console.log(`HTTP ${res.status}`);
  console.log(text.slice(0, 600));

  if (res.status === 200) {
    console.log('\n✓ KEYS ARE ALIVE. Next dev server is stale — Ctrl-C it and `npm run dev` again.');
    process.exit(0);
  }
  if (res.status === 401) {
    console.log('\n✗ KEYS ARE REVOKED OR WRONG. Generate fresh test keys in Razorpay Dashboard → API Keys.');
    process.exit(2);
  }
  console.log('\n? Unexpected status — copy the body above and share it.');
  process.exit(3);
} catch (err) {
  console.error('✗ Network error:', err.message);
  process.exit(4);
}
