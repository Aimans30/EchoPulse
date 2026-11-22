import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Check, ChevronDown, Clock, Globe, Puzzle, RefreshCw, Trash2 } from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import CopyText from '@/components/CopyText';
import { OFFCUT } from '@/lib/offcut';
import { ogImages } from '@/lib/ogImages';

/**
 * /resources/offcut/extension: how to add the optional Offcut browser
 * extension. Source: OFFCUT-EXTENSION-GUIDE.md. Button labels and the Edge
 * layout have not been checked on a clean PC yet, so screenshots must be real
 * captures and the wording should be re-checked against them.
 *
 * Same design language as /resources/offcut: ink header band, numbered step
 * cards, accordions for Edge and Brave and for troubleshooting. Styles are
 * scoped under .ex-page; app/globals.css forces padding on every <section>
 * and sizes on h1 to h3 on phones, so those few rules use !important.
 */

const SITE_URL = 'https://echopulse.media';
const canonical = `${SITE_URL}/resources/offcut/extension`;
const TITLE = 'Offcut Extension for Chrome, Edge and Brave';
const DESCRIPTION =
  'Six short steps, about a minute, once: add the free Offcut extension to Chrome, Edge or Brave so a Transcribe button appears on the video you are watching.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical },
  robots: { index: true, follow: true },
  openGraph: { title: `${TITLE} | EchoPulse Media`, description: DESCRIPTION, url: canonical, siteName: 'EchoPulse Media', type: 'article', images: ogImages() },
};

type Step = { key: '1' | '2' | '3' | '4' | '5' | '6'; name: string; text: string };
const STEPS: Step[] = [
  { key: '1', name: 'Open the extensions page', text: 'Paste chrome://extensions into the address bar and press Enter. Shortcut: on the last page of the installer, tick "Add the browser extension now". It opens this page and copies the folder path for you.' },
  { key: '2', name: 'Turn on Developer mode', text: 'The switch is at the top right. Switch it on. Three new buttons appear.' },
  { key: '3', name: 'Click "Load unpacked"', text: 'A folder picker opens.' },
  { key: '4', name: 'Choose the Offcut extension folder', text: "Paste the folder path into the picker's address bar, press Enter, then click Select Folder. If the installer already copied the path, just paste it." },
  { key: '5', name: 'Pin it', text: 'Click the puzzle-piece icon in the toolbar, then the pin next to Offcut, so the button is always visible.' },
  { key: '6', name: 'Test the connection', text: 'A welcome page opens. Press Test the connection. You should see "Working. Chrome started Offcut and it is connected."' },
];

const TROUBLE = [
  { p: '"Offcut isn\'t installed on this PC yet" on the welcome page', f: 'Run the installer. If you already did, open the Offcut app once, then press Test the connection again. Still failing: run the installer again. It keeps your data and re-registers the browser connection.' },
  { p: 'Load unpacked says "Manifest file is missing"', f: 'You picked the wrong folder. Pick the folder named extension itself, the one that contains manifest.json.' },
  { p: 'The extension turned itself off after a restart', f: 'You clicked Disable on the developer mode prompt. Open chrome://extensions and switch Offcut back on.' },
  { p: 'No button on a page that was already open', f: 'Reload that tab.' },
  { p: '"Linked to another copy of this extension"', f: 'You loaded a second copy from another folder. Remove it on chrome://extensions and keep the one in the Offcut install folder.' },
  { p: 'The extension disappeared after moving or deleting the Offcut folder', f: 'The extension reads its files from the install folder. Do not move it by hand. Run the installer again, then repeat the steps above.' },
  { p: 'Opening chrome://extensions from a link does nothing', f: 'Browsers block links to those pages. Copy the address and paste it into the address bar.' },
];

function Shot({ k }: { k: keyof typeof OFFCUT.extensionShots }) {
  const s = OFFCUT.extensionShots[k];
  if (!s) return null;
  return <Image className="ex-shot" src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="(max-width: 900px) 100vw, 760px" />;
}

export default function OffcutExtensionPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'HowTo',
        '@id': `${canonical}#howto`,
        name: TITLE,
        description: DESCRIPTION,
        totalTime: 'PT1M',
        tool: [{ '@type': 'HowToTool', name: 'Chrome, Edge or Brave on Windows 10 or 11' }],
        supply: [{ '@type': 'HowToSupply', name: 'Offcut installed on the PC' }],
        step: STEPS.map((s, i) => ({
          '@type': 'HowToStep',
          position: i + 1,
          name: s.name,
          text: s.key === '4' ? `${s.text} Folder: ${OFFCUT.extensionFolder}` : s.text,
          url: `${canonical}#step-${s.key}`,
          ...(OFFCUT.extensionShots[s.key] ? { image: `${SITE_URL}${OFFCUT.extensionShots[s.key]!.src}` } : {}),
        })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Resources', item: `${SITE_URL}/resources` },
          { '@type': 'ListItem', position: 3, name: 'Offcut', item: `${SITE_URL}/resources/offcut` },
          { '@type': 'ListItem', position: 4, name: 'Browser extension', item: canonical },
        ],
      },
    ],
  };

  return (
    <>
      <Nav />
      <main id="main" className="ex-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />

        {/* ── Header band ─────────────────────────────────────────────── */}
        <header className="ex-hero" data-dark-bg="true">
          <div className="ex-wrap ex-hero-grid">
            <div>
              <nav className="ex-crumbs" aria-label="Breadcrumb">
                <Link href="/resources">Resources</Link> <span aria-hidden="true">/</span> <Link href="/resources/offcut">Offcut</Link> <span aria-hidden="true">/</span> <span aria-current="page">Browser extension</span>
              </nav>
              <p className="ex-eyebrow">Offcut guide</p>
              <h1 className="ex-h1">Add the Offcut extension to your browser</h1>
              <p className="ex-lead">
                The Offcut app works without the extension. The extension adds a Transcribe button right on the video or reel you are watching, so you never paste a link. It takes about a minute, once.
              </p>
              <ul className="ex-facts" aria-label="At a glance">
                <li><Clock size={16} strokeWidth={2} aria-hidden="true" />About a minute, once</li>
                <li><Globe size={16} strokeWidth={2} aria-hidden="true" />Chrome, Edge or Brave</li>
                <li><Puzzle size={16} strokeWidth={2} aria-hidden="true" />Optional</li>
              </ul>
            </div>
            <nav className="ex-toc" aria-label="The six steps">
              <p className="ex-toc-h">Six steps</p>
              <ol>
                {STEPS.map((s) => (
                  <li key={s.key}>
                    <a href={`#step-${s.key}`}>
                      <span className="ex-toc-n" aria-hidden="true">{s.key}</span>
                      <span>{s.name}</span>
                      <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>
        </header>

        <div className="ex-wrap ex-body">
          {/* ── Before you start ───────────────────────────────────────── */}
          <section className="ex-sec" aria-labelledby="ex-before">
            <h2 id="ex-before" className="ex-h2">Before you start</h2>
            <ul className="ex-before">
              <li>
                <span className="ex-ico" aria-hidden="true"><Check size={18} strokeWidth={2} /></span>
                <p>Install Offcut first (run {OFFCUT.installerName}). The extension&apos;s files are installed with it. <Link href="/resources/offcut">Get Offcut</Link></p>
              </li>
              <li>
                <span className="ex-ico" aria-hidden="true"><Globe size={18} strokeWidth={1.75} /></span>
                <p>Works in Chrome, Edge and Brave. The steps are the same; only the address differs (see below).</p>
              </li>
            </ul>
          </section>

          {OFFCUT.extensionVideo && (
            <video className="ex-video" src={OFFCUT.extensionVideo} controls muted playsInline preload="metadata" aria-label="The six steps in about 20 seconds" />
          )}

          {/* ── Steps ──────────────────────────────────────────────────── */}
          <section className="ex-sec" aria-labelledby="ex-steps">
            <h2 id="ex-steps" className="ex-h2">Steps in Chrome</h2>
            <ol className="ex-steps">
              {STEPS.map((s) => (
                <li key={s.key} id={`step-${s.key}`}>
                  <span className="ex-n" aria-hidden="true">{s.key}</span>
                  <div className="ex-step-body">
                    <p className="ex-step-of" aria-hidden="true">Step {s.key} of 6</p>
                    <h3>{s.name}</h3>
                    <p>{s.text}</p>
                    {s.key === '1' && <CopyText value="chrome://extensions" />}
                    {s.key === '4' && <CopyText value={OFFCUT.extensionFolder} label="Copy path" />}
                    <Shot k={s.key} />
                  </div>
                </li>
              ))}
            </ol>
            <p className="ex-done">
              <span className="ex-done-ico" aria-hidden="true"><Check size={16} strokeWidth={2.4} /></span>
              Done. Open any video and click Transcribe.
            </p>

            <details className="ex-acc ex-alt">
              <summary>
                <span>Using Edge or Brave?</span>
                <ChevronDown size={20} strokeWidth={1.75} aria-hidden="true" />
              </summary>
              <div className="ex-acc-body">
                <p><strong>Edge:</strong> open edge://extensions. The Developer mode switch is in the left sidebar. Then click Load unpacked and pick the same folder.</p>
                <p><strong>Brave:</strong> open brave://extensions. Everything else is the same as Chrome.</p>
              </div>
            </details>
          </section>

          {/* ── Why + the prompt ───────────────────────────────────────── */}
          <div className="ex-pair">
            <section className="ex-card" aria-labelledby="ex-why">
              <h2 id="ex-why">Why is this step needed?</h2>
              <p>
                Browsers only allow one-click installs from their own extension stores. Offcut is not in a store yet, so the browser asks you to add it once yourself with Developer mode. Nothing is hidden: the extension is plain, readable code in the folder above.
              </p>
            </section>
            <section className="ex-card" aria-labelledby="ex-prompt">
              <h2 id="ex-prompt">The &quot;Disable developer mode extensions&quot; message</h2>
              <p>
                When the browser starts, Chrome may show this message. It is normal for any extension added this way, not just Offcut. Close it or click the X. Do not click Disable, or the extension turns off.
              </p>
              <Shot k="prompt" />
            </section>
          </div>

          {/* ── Troubleshooting ────────────────────────────────────────── */}
          <section className="ex-sec" aria-labelledby="ex-trouble">
            <h2 id="ex-trouble" className="ex-h2">If something does not work</h2>
            <div className="ex-trouble">
              {TROUBLE.map((t) => (
                <details key={t.p} className="ex-acc">
                  <summary>
                    <span>{t.p}</span>
                    <ChevronDown size={20} strokeWidth={1.75} aria-hidden="true" />
                  </summary>
                  <div className="ex-acc-body"><p>{t.f}</p></div>
                </details>
              ))}
            </div>
          </section>

          {/* ── Updates + remove ───────────────────────────────────────── */}
          <div className="ex-pair">
            <section className="ex-card" aria-labelledby="ex-updates">
              <span className="ex-ico" aria-hidden="true"><RefreshCw size={18} strokeWidth={1.75} /></span>
              <h2 id="ex-updates">Updates</h2>
              <p>Updates arrive on their own and are signed. The extension reloads itself afterwards, so you do not repeat these steps. Open tabs may need one refresh to show new buttons.</p>
            </section>
            <section className="ex-card" aria-labelledby="ex-remove">
              <span className="ex-ico" aria-hidden="true"><Trash2 size={18} strokeWidth={1.75} /></span>
              <h2 id="ex-remove">Remove it</h2>
              <p>Open chrome://extensions and click Remove on Offcut. Uninstalling the app (Windows Settings, Apps, Offcut) does not remove the extension from the browser, so do both.</p>
            </section>
          </div>

          {/* ── Agent ──────────────────────────────────────────────────── */}
          <section className="ex-agent" aria-labelledby="ex-agent">
            <div>
              <h2 id="ex-agent">Prefer an AI agent to guide you?</h2>
              <p>Paste this into Claude or any assistant that can run commands on your PC. It copies the folder path for you and walks you through each click.</p>
            </div>
            <CopyText block label="Copy prompt" title="Prompt" value={`Help me add the Offcut browser extension (from EchoPulse Media) to my browser on this Windows PC. Offcut is already installed. Follow https://echopulse.media/resources/offcut/extension one step at a time and wait for me after each step. Copy this folder path to my clipboard with Set-Clipboard when I reach the folder step: ${OFFCUT.extensionFolder}. If something fails, use the troubleshooting table on that page. Never change security settings or browser settings for me, and never install anything else.`} />
          </section>

          <p className="ex-back">
            <Link href="/resources/offcut"><ArrowLeft size={16} strokeWidth={2} aria-hidden="true" /> Back to Offcut</Link>
          </p>
        </div>
      </main>
      <Footer />
      <style>{`
        .ex-page {
          --ink: #0C0C0B; --paper: #F2EEE7; --card: #FBF9F5; --white: #FFFFFF;
          --text: #3E3D3A; --muted: #625E56; --line: rgba(12,12,11,0.1); --line-2: rgba(12,12,11,0.16);
          --orange: #E8541A; --orange-2: #D14812;
          --on-ink: #F2EEE7; --on-ink-2: rgba(242,238,231,0.7); --on-ink-3: rgba(242,238,231,0.5); --ink-line: rgba(242,238,231,0.12);
          --gutter: 40px;
          background: var(--paper); color: var(--ink);
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-feature-settings: 'cv11', 'ss01';
          -webkit-font-smoothing: antialiased;
        }
        .ex-page *, .ex-page *::before, .ex-page *::after { box-sizing: border-box; }
        .ex-page p, .ex-page h1, .ex-page h2, .ex-page h3, .ex-page ul, .ex-page ol { margin: 0; }
        .ex-page ul, .ex-page ol { list-style: none !important; padding: 0 !important; }
        .ex-page li { display: block; }
        .ex-page [id] { scroll-margin-top: 112px; }
        .ex-page a:focus-visible, .ex-page summary:focus-visible { outline: 3px solid var(--orange); outline-offset: 3px; border-radius: 8px; }
        .ex-wrap { width: 100%; max-width: calc(1040px + var(--gutter) * 2); margin: 0 auto; padding: 0 var(--gutter); }
        .ex-page p a, .ex-back a { color: var(--ink); font-weight: 600; text-decoration: underline; text-decoration-color: var(--orange); text-decoration-thickness: 2px; text-underline-offset: 4px; }
        .ex-ico { flex: none; display: inline-grid; place-items: center; width: 40px; height: 40px; border-radius: 10px; border: 1px solid var(--line-2); background: var(--white); color: var(--ink); }

        /* Header band */
        .ex-hero { position: relative; background: var(--ink); color: var(--on-ink); overflow: hidden; }
        .ex-hero::after { content: ""; position: absolute; inset: 0; background-image: linear-gradient(var(--ink-line) 1px, transparent 1px), linear-gradient(90deg, var(--ink-line) 1px, transparent 1px); background-size: 64px 64px; opacity: 0.28; -webkit-mask-image: radial-gradient(70% 70% at 80% 40%, #000 0%, transparent 75%); mask-image: radial-gradient(70% 70% at 80% 40%, #000 0%, transparent 75%); pointer-events: none; }
        .ex-hero-grid { position: relative; z-index: 1; display: grid; grid-template-columns: minmax(0, 7fr) minmax(0, 5fr); gap: 64px; align-items: end; padding-top: 160px; padding-bottom: 80px; }
        .ex-crumbs { margin-bottom: 32px; font-size: 14px; color: var(--on-ink-3); }
        .ex-crumbs a { color: var(--on-ink-2); text-decoration: underline; text-decoration-color: rgba(232,84,26,0.8); text-underline-offset: 4px; }
        .ex-crumbs a:hover { color: var(--on-ink); }
        .ex-eyebrow { display: inline-flex; align-items: center; gap: 8px; height: 32px; padding: 0 14px; margin-bottom: 24px !important; border: 1px solid var(--ink-line); border-radius: 999px; font-size: 13px; font-weight: 500; color: var(--on-ink-2); }
        .ex-eyebrow::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--orange); }
        .ex-page .ex-h1 { font-size: clamp(40px, 4.6vw, 60px) !important; font-weight: 700; line-height: 1.04 !important; letter-spacing: -0.04em !important; color: var(--on-ink); text-wrap: balance; max-width: 640px; }
        .ex-lead { margin-top: 24px !important; font-size: 18px; line-height: 1.65; color: var(--on-ink-2); max-width: 580px; }
        .ex-facts { display: flex; flex-wrap: wrap; gap: 8px 24px; margin-top: 32px !important; }
        .ex-facts li { display: inline-flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 500; color: var(--on-ink); }
        .ex-facts svg { color: var(--orange); }
        .ex-toc { padding: 8px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); background: #161513; box-shadow: 0 32px 64px -32px rgba(0,0,0,0.8); }
        .ex-toc-h { padding: 12px 12px 8px; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--on-ink-3); }
        .ex-toc a { display: grid; grid-template-columns: 28px minmax(0, 1fr) 16px; align-items: center; gap: 12px; min-height: 44px; padding: 6px 12px; border-radius: 10px; font-size: 15px; font-weight: 500; color: var(--on-ink); text-decoration: none; transition: background-color .2s ease; }
        .ex-toc a:hover { background: rgba(255,255,255,0.05); }
        .ex-toc a svg { color: var(--on-ink-3); }
        .ex-toc-n { display: grid; place-items: center; width: 28px; height: 28px; border-radius: 50%; border: 1px solid rgba(242,238,231,0.2); font-size: 13px; font-weight: 600; color: var(--on-ink-2); }

        /* Body */
        .ex-body { padding-top: 96px; padding-bottom: 112px; }
        .ex-page .ex-sec { padding: 0 !important; margin: 0 0 96px !important; }
        .ex-page .ex-h2 { margin-bottom: 32px !important; font-size: clamp(28px, 3vw, 40px) !important; font-weight: 700; line-height: 1.1 !important; letter-spacing: -0.035em !important; color: var(--ink); }
        .ex-before { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; }
        .ex-before li { display: grid; grid-template-columns: 40px minmax(0, 1fr); gap: 16px; align-items: start; padding: 24px; border-radius: 16px; border: 1px solid var(--line); background: var(--card); }
        .ex-before p { padding-top: 8px; font-size: 16px; line-height: 1.6; color: var(--text); }
        .ex-video { display: block; width: 100%; border-radius: 16px; margin: 0 0 96px; background: var(--ink); }

        .ex-steps { position: relative; display: grid; gap: 16px; }
        .ex-steps li { position: relative; display: grid; grid-template-columns: 40px minmax(0, 1fr); gap: 24px; padding: 32px; border-radius: 16px; border: 1px solid var(--line); background: var(--card); }
        .ex-n { position: relative; display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; background: var(--ink); color: var(--on-ink); font-size: 15px; font-weight: 700; }
        .ex-step-of { font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
        .ex-page .ex-steps h3 { margin-top: 4px !important; font-size: 21px !important; font-weight: 700; line-height: 1.25 !important; letter-spacing: -0.02em; }
        .ex-step-body > p:not(.ex-step-of) { margin-top: 8px !important; font-size: 16px; line-height: 1.65; color: var(--text); max-width: 680px; }
        .ex-step-body .ct { max-width: 620px; }
        .ex-shot { display: block; width: 100%; height: auto; margin-top: 16px; border-radius: 12px; border: 1px solid var(--line); }
        .ex-done { display: flex; align-items: center; gap: 12px; margin-top: 24px !important; padding: 16px 20px; border-radius: 12px; border: 1px solid rgba(12,12,11,0.9); background: var(--ink); font-size: 16px; font-weight: 600; color: var(--on-ink); }
        .ex-done-ico { display: grid; place-items: center; flex: none; width: 24px; height: 24px; border-radius: 50%; background: var(--orange); color: #fff; }

        .ex-acc summary { display: flex; align-items: center; justify-content: space-between; gap: 24px; min-height: 64px; padding: 16px 0; cursor: pointer; list-style: none; font-size: 17px; font-weight: 600; line-height: 1.4; letter-spacing: -0.01em; color: var(--ink); }
        .ex-acc summary::-webkit-details-marker { display: none; }
        .ex-acc summary svg { flex: none; color: var(--muted); transition: transform .2s ease; }
        .ex-acc[open] summary svg { transform: rotate(180deg); color: var(--ink); }
        .ex-acc summary:hover span { color: var(--orange-2); }
        .ex-acc-body { padding: 0 48px 24px 0; }
        .ex-acc-body p { font-size: 16px; line-height: 1.65; color: var(--text); }
        .ex-acc-body p + p { margin-top: 12px !important; }
        .ex-alt { margin-top: 16px; padding: 0 24px; border-radius: 16px; border: 1px solid var(--line); background: var(--card); }
        .ex-alt .ex-acc-body { padding-right: 0; }
        .ex-trouble { border-top: 1px solid var(--line-2); }
        .ex-trouble .ex-acc { border-bottom: 1px solid var(--line-2); }

        .ex-pair { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 16px; margin-bottom: 96px; }
        .ex-page .ex-card { padding: 32px !important; border-radius: 16px; border: 1px solid var(--line); background: var(--card); }
        .ex-page .ex-card h2 { font-size: 22px !important; font-weight: 700; line-height: 1.25 !important; letter-spacing: -0.02em !important; color: var(--ink); }
        .ex-card .ex-ico + h2 { margin-top: 24px !important; }
        .ex-card > p { margin-top: 12px !important; font-size: 16px; line-height: 1.65; color: var(--text); }

        .ex-page .ex-agent { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 48px; align-items: start; padding: 40px !important; border-radius: 16px; background: var(--ink); color: var(--on-ink); }
        .ex-page .ex-agent h2 { font-size: 26px !important; font-weight: 700; line-height: 1.2 !important; letter-spacing: -0.02em !important; color: var(--on-ink); }
        .ex-agent p { margin-top: 12px !important; font-size: 16px; line-height: 1.65; color: var(--on-ink-2); }
        .ex-agent .ct { margin-top: 0; }
        .ex-back { margin-top: 40px !important; }
        .ex-back a { display: inline-flex; align-items: center; gap: 8px; min-height: 44px; }

        @media (max-width: 1024px) {
          .ex-page { --gutter: 32px; }
          .ex-hero-grid { grid-template-columns: minmax(0, 1fr); gap: 48px; align-items: start; padding-top: 152px; }
          .ex-toc { max-width: 560px; }
          .ex-page .ex-agent { grid-template-columns: minmax(0, 1fr); gap: 24px; }
        }
        @media (max-width: 768px) {
          .ex-page { --gutter: 20px; }
          .ex-hero-grid { padding-top: 120px; padding-bottom: 56px; gap: 40px; }
          .ex-page .ex-h1 { font-size: 36px !important; line-height: 1.08 !important; letter-spacing: -0.03em !important; }
          .ex-lead { font-size: 17px; }
          .ex-facts { gap: 8px 16px; }
          .ex-facts li { font-size: 14px; }
          .ex-body { padding-top: 64px; padding-bottom: 80px; }
          .ex-page .ex-sec { margin-bottom: 72px !important; }
          .ex-page .ex-h2 { margin-bottom: 24px !important; font-size: 30px !important; }
          .ex-before, .ex-pair { grid-template-columns: minmax(0, 1fr); }
          .ex-pair { margin-bottom: 72px; }
          .ex-before li { padding: 20px; }
          .ex-steps { gap: 12px; }
          .ex-steps li { grid-template-columns: 32px minmax(0, 1fr); gap: 16px; padding: 20px 16px; }
          .ex-n { width: 32px; height: 32px; font-size: 14px; }
          .ex-page .ex-steps h3 { font-size: 18px !important; }
          .ex-alt { padding: 0 16px; }
          .ex-acc summary { font-size: 16px; gap: 16px; }
          .ex-acc-body { padding-right: 0; }
          .ex-page .ex-card { padding: 24px 20px !important; }
          .ex-page .ex-agent { padding: 24px 20px !important; }
          .ex-page .ex-agent h2 { font-size: 22px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .ex-page *, .ex-page *::before, .ex-page *::after { transition: none !important; }
        }
      `}</style>
    </>
  );
}
