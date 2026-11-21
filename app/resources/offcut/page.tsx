import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import OffcutUpdatesCapture from '@/components/OffcutUpdatesCapture';
import { OFFCUT, OFFCUT_READY } from '@/lib/offcut';
import { ogImages } from '@/lib/ogImages';

/**
 * /resources/offcut: the free Offcut tool for editors and creators.
 *
 * Every claim here comes from the Offcut briefs. Things the briefs mark as not
 * done or not measured (code signing, per-site browser tests, speech-to-text
 * speed) are stated as limits, never as features. The installer is linked from
 * an outside host (see lib/offcut.ts); it is never served from this domain.
 */

const SITE_URL = 'https://echopulse.media';
const canonical = `${SITE_URL}/resources/offcut`;
const TITLE = 'Offcut: Free Script Saver for Video Editors';
const DESCRIPTION =
  'Offcut is a free Windows tool from EchoPulse Media that saves the transcript of videos you study and splits each script into hook, body and call to action. Runs on your PC, no account.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical },
  robots: { index: true, follow: true },
  openGraph: {
    title: `${TITLE} | EchoPulse Media`,
    description: DESCRIPTION,
    url: canonical,
    siteName: 'EchoPulse Media',
    type: 'website',
    images: ogImages(),
  },
  twitter: { card: 'summary_large_image', title: TITLE, description: DESCRIPTION, images: ogImages().map((i) => i.url) },
};

const DOES = [
  'Saves the transcript of a video you choose, so you can read and reuse what was said.',
  'Splits each saved script into hook, body and call to action, so you can see how it is built.',
  'Keeps everything on your own PC.',
];

const DOES_NOT = [
  'No account and no sign-in.',
  'Nothing is uploaded. Your transcripts stay on your PC.',
  'No startup entry and no background process. Nothing runs when Offcut is idle.',
  'No AI model writes the breakdown. Hook, body and call to action are marked by simple, fixed rules.',
];

const NEEDS = [
  { k: 'System', v: 'Windows 10 or 11, 64-bit' },
  { k: 'Admin rights', v: 'Not needed' },
  { k: 'Download', v: OFFCUT.downloadSizeLabel },
  { k: 'Disk space after install', v: OFFCUT.installedSizeLabel },
  { k: 'Speech model', v: OFFCUT.speechModelLabel },
  { k: 'Memory while working', v: 'About 50 MB for the helper, about 300 MB while turning speech into text' },
  { k: 'Other software', v: 'None to install first' },
];

const FAQ = [
  {
    q: 'Is Offcut really free?',
    a: 'Yes. It is a free tool from EchoPulse Media. There is no account, no trial and no payment.',
  },
  {
    q: 'Why does Windows show "Windows protected your PC"?',
    a: 'The installer is not code-signed yet, so Windows SmartScreen does not recognise the publisher and shows a warning. Click "More info", then "Run anyway". If you prefer to check the file first, compare its SHA-256 with the one on this page.',
  },
  {
    q: 'Does Offcut upload my videos or transcripts?',
    a: 'No. Everything stays on your PC. Only the transcripts you choose to save are kept.',
  },
  {
    q: 'Does it run in the background?',
    a: 'No. It adds no startup entry and nothing runs when it is idle. The helper starts only when you use it.',
  },
  {
    q: 'Is the hook, body and call to action split done by AI?',
    a: 'No. It uses simple, fixed rules, so the same script always gets the same breakdown.',
  },
  {
    q: 'Do I need the browser extension?',
    a: 'No, it is optional. The app works on its own; the extension makes saving from your browser quicker.',
  },
  {
    q: 'Who made Offcut?',
    a: 'EchoPulse Media, a small studio in Bhopal, India, founded by Lakshya Soni. We edit video, build websites and custom software for founders and small businesses.',
  },
];

export default function OffcutPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        '@id': `${canonical}#app`,
        name: OFFCUT.name,
        url: canonical,
        description: DESCRIPTION,
        applicationCategory: 'MultimediaApplication',
        operatingSystem: 'Windows 10, Windows 11 (64-bit)',
        isAccessibleForFree: true,
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        publisher: { '@id': 'https://echopulse.media/#organization' },
        ...(OFFCUT.version ? { softwareVersion: OFFCUT.version } : {}),
        ...(OFFCUT_READY ? { downloadUrl: OFFCUT.downloadUrl } : {}),
        ...(OFFCUT.releasedISO ? { datePublished: OFFCUT.releasedISO } : {}),
      },
      {
        '@type': 'FAQPage',
        '@id': `${canonical}#faq`,
        mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${canonical}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Resources', item: `${SITE_URL}/resources` },
          { '@type': 'ListItem', position: 3, name: 'Offcut', item: canonical },
        ],
      },
    ],
  };

  return (
    <>
      <Nav />
      <main id="main" className="oc-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
        <div className="oc-wrap">
          <nav className="oc-crumbs" aria-label="Breadcrumb">
            <Link href="/resources">Resources</Link> <span aria-hidden="true">/</span> <span>Offcut</span>
          </nav>

          <header className="oc-head">
            <h1 className="oc-h1">Offcut: save and study the scripts behind videos</h1>
            <p className="oc-lead">
              A free Windows tool for video editors, content creators and scriptwriters. Save the transcript of a video you want to learn from, and see it split into hook, body and call to action. It runs on your PC, with no account and no uploads.
            </p>
            <div className="oc-cta">
              {OFFCUT_READY ? (
                <>
                  <a href={OFFCUT.downloadUrl} className="oc-btn" rel="noopener" data-track="offcut_download_click" data-track-location="offcut_hero">
                    Download for Windows
                  </a>
                  <p className="oc-meta">
                    {OFFCUT.version && <>Version {OFFCUT.version}. </>}Windows 10 or 11, 64-bit. Download {OFFCUT.downloadSizeLabel}. Free.
                  </p>
                </>
              ) : (
                <p className="oc-soon">The download is being prepared. Leave your email below and we will tell you when it is live.</p>
              )}
            </div>
          </header>

          {OFFCUT.screenshots.length > 0 && (
            <section className="oc-shots" aria-label="Screenshots">
              {OFFCUT.screenshots.map((s) => (
                <figure key={s.src}>
                  <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="(max-width: 900px) 100vw, 860px" />
                  <figcaption>{s.caption}</figcaption>
                </figure>
              ))}
            </section>
          )}

          <section className="oc-sec" aria-labelledby="oc-what">
            <h2 id="oc-what">What it does</h2>
            <ul className="oc-list">{DOES.map((d) => <li key={d}>{d}</li>)}</ul>
            <h3>What it does not do</h3>
            <ul className="oc-list oc-not">{DOES_NOT.map((d) => <li key={d}>{d}</li>)}</ul>
          </section>

          <section className="oc-sec" aria-labelledby="oc-how">
            <h2 id="oc-how">How it works</h2>
            <p>
              Offcut has three parts. The app is where you read and organise saved scripts. A small helper starts only when you need it, for example to turn speech into text, and stops afterwards. An optional browser extension lets you send a video to Offcut while you watch. Updates are signed.
            </p>
          </section>

          <section className="oc-sec" aria-labelledby="oc-install">
            <h2 id="oc-install">Install in three steps</h2>
            <ol className="oc-steps">
              <li>
                <strong>Run the installer.</strong> No admin rights needed and nothing else to install first.
              </li>
              <li>
                <strong>If Windows shows &quot;Windows protected your PC&quot;, click &quot;More info&quot;, then &quot;Run anyway&quot;.</strong> It appears because the installer is not code-signed yet. You can check the file yourself first (see below).
              </li>
              <li>
                <strong>Optional: add the browser extension.</strong> It takes four clicks.
              </li>
            </ol>
          </section>

          <section className="oc-sec" aria-labelledby="oc-needs">
            <h2 id="oc-needs">What your PC needs</h2>
            <dl className="oc-table">
              {NEEDS.map((n) => (
                <div key={n.k}>
                  <dt>{n.k}</dt>
                  <dd>{n.v}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="oc-sec" aria-labelledby="oc-verify">
            <h2 id="oc-verify">Check the file yourself</h2>
            {OFFCUT_READY ? (
              <>
                <p>In PowerShell, run this in the folder where you saved the installer, then compare the result with the SHA-256 below. If they match, the file is exactly the one we published.</p>
                <pre className="oc-code"><code>Get-FileHash .\{OFFCUT.downloadUrl.split('/').pop()} -Algorithm SHA256</code></pre>
                <p className="oc-hash"><span>SHA-256</span><code>{OFFCUT.sha256}</code></p>
              </>
            ) : (
              <p>The SHA-256 checksum will be published here with the download, so you can confirm the file has not been changed.</p>
            )}
          </section>

          <section className="oc-sec" aria-labelledby="oc-limits">
            <h2 id="oc-limits">Honest limits</h2>
            <ul className="oc-list">
              <li>The installer is not code-signed yet, which is why Windows shows a warning.</li>
              <li>The browser extension has not yet been tested on every video site.</li>
              <li>We have not measured speech-to-text speed on a typical laptop yet, so we do not quote one.</li>
              <li>Windows only for now.</li>
            </ul>
          </section>

          <section className="oc-sec" aria-labelledby="oc-faq">
            <h2 id="oc-faq">Questions</h2>
            <dl className="oc-faq">
              {FAQ.map((f) => (
                <div key={f.q}>
                  <dt>{f.q}</dt>
                  <dd>{f.a}</dd>
                </div>
              ))}
            </dl>
          </section>

          <OffcutUpdatesCapture ready={OFFCUT_READY} />

          <section className="oc-sec oc-by" aria-labelledby="oc-by">
            <h2 id="oc-by">Made by EchoPulse Media</h2>
            <p>
              We are a small studio that edits short-form and podcast video, builds fast websites and custom business software, and helps businesses get found on Google and in AI answers. Offcut is free to use.
            </p>
            <p className="oc-links">
              <Link href="/work">See our video work</Link>
              <Link href="/free-edits">Get 2 free edits</Link>
              <Link href="/book">Book a free 15-minute call</Link>
            </p>
          </section>
        </div>
      </main>
      <Footer />
      <style>{`
        .oc-page { background: #F2EEE7; color: #0C0C0B; font-family: Inter, sans-serif; }
        .oc-wrap { max-width: 860px; margin: 0 auto; padding: 150px 24px 112px; }
        .oc-crumbs { font-size: 14px; color: #6E6B63; margin-bottom: 24px; }
        .oc-crumbs a { color: #0C0C0B; text-decoration: underline; text-decoration-color: #E8541A; text-underline-offset: 3px; }
        .oc-h1 { margin: 0 0 20px; font-size: clamp(36px, 5.2vw, 58px); font-weight: 900; letter-spacing: -0.035em; line-height: 1.04; text-wrap: balance; }
        .oc-lead { margin: 0 0 32px; font-size: 19px; line-height: 1.6; color: #3E3D3A; max-width: 680px; }
        .oc-cta { margin-bottom: 64px; }
        .oc-btn { display: inline-flex; align-items: center; min-height: 52px; padding: 0 28px; border-radius: 100px; background: #0C0C0B; color: #F2EEE7; font-weight: 800; font-size: 16px; text-decoration: none; }
        .oc-btn:hover { background: #E8541A; }
        .oc-btn:focus-visible, .oc-page a:focus-visible { outline: 3px solid #E8541A; outline-offset: 3px; }
        .oc-meta { margin: 12px 0 0; font-size: 14px; color: #6E6B63; }
        .oc-soon { margin: 0; padding: 16px 20px; border-left: 3px solid #E8541A; background: rgba(232,84,26,0.07); border-radius: 0 12px 12px 0; font-size: 16px; line-height: 1.55; max-width: 640px; }
        .oc-shots { display: grid; gap: 24px; margin-bottom: 64px; }
        .oc-shots figure { margin: 0; }
        .oc-shots img { width: 100%; height: auto; border-radius: 16px; border: 1px solid rgba(12,12,11,0.1); }
        .oc-shots figcaption { margin-top: 8px; font-size: 14px; color: #6E6B63; }
        .oc-sec, .oc-shots { margin: 0 0 56px !important; padding: 0 !important; }
        .oc-sec h2 { margin: 0 0 16px; font-size: clamp(24px, 3vw, 30px); font-weight: 800; letter-spacing: -0.02em; line-height: 1.2; }
        .oc-sec h3 { margin: 32px 0 12px; font-size: 18px; font-weight: 800; }
        .oc-sec p { margin: 0 0 16px; font-size: 17px; line-height: 1.65; color: #3E3D3A; }
        .oc-list li, .oc-steps li { display: list-item !important; }
        .oc-list { list-style: disc outside !important; margin: 0; padding: 0 0 0 20px !important; display: grid; gap: 10px; font-size: 17px; line-height: 1.6; color: #3E3D3A; }
        .oc-steps { list-style: decimal outside !important; margin: 0; padding: 0 0 0 22px !important; display: grid; gap: 16px; font-size: 17px; line-height: 1.6; color: #3E3D3A; }
        .oc-steps strong { color: #0C0C0B; }
        .oc-table, .oc-faq { margin: 0; }
        .oc-table > div { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 16px; padding: 14px 0; border-bottom: 1px solid rgba(12,12,11,0.1); }
        .oc-table dt { font-weight: 700; font-size: 16px; }
        .oc-table dd { margin: 0; font-size: 16px; color: #3E3D3A; }
        .oc-code { margin: 0 0 16px; padding: 16px 18px; border-radius: 12px; background: #0C0C0B; color: #F2EEE7; font-size: 14px; overflow-x: auto; }
        .oc-hash { display: grid; gap: 6px; }
        .oc-hash span { font-size: 13px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; color: #6E6B63; }
        .oc-hash code { font-size: 14px; overflow-wrap: anywhere; color: #0C0C0B; }
        .oc-faq > div { padding: 18px 0; border-bottom: 1px solid rgba(12,12,11,0.1); }
        .oc-faq dt { margin: 0 0 8px; font-size: 17px; font-weight: 800; }
        .oc-faq dd { margin: 0; font-size: 16px; line-height: 1.6; color: #3E3D3A; }
        .oc-by { margin-top: 64px !important; padding-top: 40px !important; border-top: 1px solid rgba(12,12,11,0.12); }
        .oc-links { display: flex; flex-wrap: wrap; gap: 24px; }
        .oc-links a { color: #0C0C0B; font-weight: 700; text-decoration: underline; text-decoration-color: #E8541A; text-underline-offset: 4px; }
        @media (max-width: 768px) {
          .oc-wrap { padding: 112px 18px 80px !important; }
          .oc-lead { font-size: 17px; }
          .oc-table > div { grid-template-columns: 1fr; gap: 4px; }
        }
      `}</style>
    </>
  );
}
