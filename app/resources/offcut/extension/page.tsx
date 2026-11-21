import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
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
 */

const SITE_URL = 'https://echopulse.media';
const canonical = `${SITE_URL}/resources/offcut/extension`;
const TITLE = 'Add the Offcut Extension to Chrome, Edge or Brave';
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
        <div className="ex-wrap">
          <nav className="ex-crumbs" aria-label="Breadcrumb">
            <Link href="/resources">Resources</Link> <span aria-hidden="true">/</span> <Link href="/resources/offcut">Offcut</Link> <span aria-hidden="true">/</span> <span>Browser extension</span>
          </nav>

          <h1 className="ex-h1">Add the Offcut extension to your browser</h1>
          <p className="ex-lead">
            The Offcut app works without the extension. The extension adds a Transcribe button right on the video or reel you are watching, so you never paste a link. It takes about a minute, once.
          </p>

          <section className="ex-sec" aria-labelledby="ex-before">
            <h2 id="ex-before">Before you start</h2>
            <ul className="ex-list">
              <li>Install Offcut first (run {OFFCUT.installerName}). The extension&apos;s files are installed with it. <Link href="/resources/offcut">Get Offcut</Link></li>
              <li>Works in Chrome, Edge and Brave. The steps are the same; only the address differs (see below).</li>
            </ul>
          </section>

          {OFFCUT.extensionVideo && (
            <video className="ex-video" src={OFFCUT.extensionVideo} controls muted playsInline preload="metadata" aria-label="The six steps in about 20 seconds" />
          )}

          <section className="ex-sec" aria-labelledby="ex-steps">
            <h2 id="ex-steps">Steps in Chrome</h2>
            <ol className="ex-steps">
              {STEPS.map((s) => (
                <li key={s.key} id={`step-${s.key}`}>
                  <h3>{s.name}</h3>
                  <p>{s.text}</p>
                  {s.key === '1' && <CopyText value="chrome://extensions" />}
                  {s.key === '4' && <CopyText value={OFFCUT.extensionFolder} label="Copy path" />}
                  <Shot k={s.key} />
                </li>
              ))}
            </ol>
            <p className="ex-done">Done. Open any video and click Transcribe.</p>

            <details className="ex-alt">
              <summary>Using Edge or Brave?</summary>
              <p><strong>Edge:</strong> open edge://extensions. The Developer mode switch is in the left sidebar. Then click Load unpacked and pick the same folder.</p>
              <p><strong>Brave:</strong> open brave://extensions. Everything else is the same as Chrome.</p>
            </details>
          </section>

          <section className="ex-sec" aria-labelledby="ex-why">
            <h2 id="ex-why">Why is this step needed?</h2>
            <p>
              Browsers only allow one-click installs from their own extension stores. Offcut is not in a store yet, so the browser asks you to add it once yourself with Developer mode. Nothing is hidden: the extension is plain, readable code in the folder above.
            </p>
          </section>

          <section className="ex-sec" aria-labelledby="ex-prompt">
            <h2 id="ex-prompt">The &quot;Disable developer mode extensions&quot; message</h2>
            <p>
              When the browser starts, Chrome may show this message. It is normal for any extension added this way, not just Offcut. Close it or click the X. Do not click Disable, or the extension turns off.
            </p>
            <Shot k="prompt" />
          </section>

          <section className="ex-sec" aria-labelledby="ex-trouble">
            <h2 id="ex-trouble">If something does not work</h2>
            <dl className="ex-trouble">
              {TROUBLE.map((t) => (
                <div key={t.p}>
                  <dt>{t.p}</dt>
                  <dd>{t.f}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="ex-sec" aria-labelledby="ex-updates">
            <h2 id="ex-updates">Updates</h2>
            <p>Updates arrive on their own and are signed. The extension reloads itself afterwards, so you do not repeat these steps. Open tabs may need one refresh to show new buttons.</p>
          </section>

          <section className="ex-sec" aria-labelledby="ex-remove">
            <h2 id="ex-remove">Remove it</h2>
            <p>Open chrome://extensions and click Remove on Offcut. Uninstalling the app (Windows Settings, Apps, Offcut) does not remove the extension from the browser, so do both.</p>
          </section>

          <section className="ex-sec" aria-labelledby="ex-agent">
            <h2 id="ex-agent">Prefer an AI agent to guide you?</h2>
            <p>Paste this into Claude or any assistant that can run commands on your PC. It copies the folder path for you and walks you through each click.</p>
            <CopyText block label="Copy prompt" value={`Help me add the Offcut browser extension (from EchoPulse Media) to my browser on this Windows PC. Offcut is already installed. Follow https://echopulse.media/resources/offcut/extension one step at a time and wait for me after each step. Copy this folder path to my clipboard with Set-Clipboard when I reach the folder step: ${OFFCUT.extensionFolder}. If something fails, use the troubleshooting table on that page. Never change security settings or browser settings for me, and never install anything else.`} />
          </section>

          <p className="ex-back"><Link href="/resources/offcut">Back to Offcut</Link></p>
        </div>
      </main>
      <Footer />
      <style>{`
        .ex-page { background: #F2EEE7; color: #0C0C0B; font-family: Inter, sans-serif; }
        .ex-wrap { max-width: 820px; margin: 0 auto; padding: 150px 24px 112px; }
        .ex-crumbs { font-size: 14px; color: #6E6B63; margin-bottom: 24px; }
        .ex-crumbs a, .ex-page p a, .ex-list a { color: #0C0C0B; font-weight: 700; text-decoration: underline; text-decoration-color: #E8541A; text-underline-offset: 3px; }
        .ex-h1 { margin: 0 0 20px; font-size: clamp(34px, 5vw, 54px); font-weight: 900; letter-spacing: -0.035em; line-height: 1.05; text-wrap: balance; }
        .ex-lead { margin: 0 0 48px; font-size: 19px; line-height: 1.6; color: #3E3D3A; }
        .ex-sec { margin: 0 0 52px !important; padding: 0 !important; }
        .ex-sec h2 { margin: 0 0 16px; font-size: clamp(24px, 3vw, 30px); font-weight: 800; letter-spacing: -0.02em; line-height: 1.2; }
        .ex-sec p { margin: 0 0 14px; font-size: 17px; line-height: 1.65; color: #3E3D3A; }
        .ex-list li { display: list-item !important; }
        .ex-list { list-style: disc outside !important; margin: 0; padding: 0 0 0 20px !important; display: grid; gap: 10px; font-size: 17px; line-height: 1.6; color: #3E3D3A; }
        .ex-steps { list-style: none !important; counter-reset: s; margin: 0; padding: 0 !important; display: grid; gap: 16px; }
        .ex-steps li { counter-increment: s; position: relative; padding: 20px 20px 20px 72px; background: #FBF9F5; border: 1px solid rgba(12,12,11,0.08); border-radius: 16px; scroll-margin-top: 110px; }
        .ex-steps li::before { content: counter(s); position: absolute; left: 20px; top: 20px; width: 34px; height: 34px; border-radius: 50%; background: #0C0C0B; color: #F2EEE7; font-weight: 800; font-size: 15px; display: flex; align-items: center; justify-content: center; }
        .ex-steps h3 { margin: 5px 0 6px; font-size: 18px; font-weight: 800; }
        .ex-steps p { margin: 0; font-size: 16px; }
        .ex-shot { display: block; width: 100%; height: auto; margin-top: 14px; border-radius: 12px; border: 1px solid rgba(12,12,11,0.1); }
        .ex-video { display: block; width: 100%; border-radius: 16px; margin: 0 0 48px; background: #0C0C0B; }
        .ex-done { margin-top: 18px !important; font-weight: 700; color: #0C0C0B !important; }
        .ex-alt { margin-top: 20px; padding: 16px 20px; border: 1px solid rgba(12,12,11,0.12); border-radius: 14px; background: #FBF9F5; }
        .ex-alt summary { cursor: pointer; font-weight: 800; font-size: 16px; min-height: 28px; }
        .ex-alt p { margin: 12px 0 0; font-size: 16px; }
        .ex-trouble { margin: 0; }
        .ex-trouble > div { padding: 16px 0; border-bottom: 1px solid rgba(12,12,11,0.1); }
        .ex-trouble dt { font-weight: 800; font-size: 16px; margin: 0 0 6px; }
        .ex-trouble dd { margin: 0; font-size: 16px; line-height: 1.6; color: #3E3D3A; }
        .ex-back { margin-top: 24px; }
        @media (max-width: 768px) {
          .ex-wrap { padding: 112px 18px 80px !important; }
          .ex-lead { font-size: 17px; }
          .ex-steps li { padding: 18px 16px 18px 62px; }
          .ex-steps li::before { left: 16px; top: 18px; }
        }
      `}</style>
    </>
  );
}
