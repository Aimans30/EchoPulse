import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import {
  AppWindow,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Cpu,
  CloudOff,
  Download,
  FileText,
  HardDrive,
  Info,
  ListChecks,
  PowerOff,
  Puzzle,
  Rows3,
  ShieldCheck,
  UserX,
} from 'lucide-react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import OffcutUpdatesCapture from '@/components/OffcutUpdatesCapture';
import { OFFCUT, OFFCUT_READY, OFFCUT_AGENT_PROMPT } from '@/lib/offcut';
import CopyText from '@/components/CopyText';
import AgentCopyPill from '@/components/AgentCopyPill';
import Reveal from '@/components/offcut/Reveal';
import ShotFrame, { type FrameKind } from '@/components/offcut/ShotFrame';
import { ogImages } from '@/lib/ogImages';

/**
 * /resources/offcut: the free Offcut tool for editors and creators.
 *
 * Every claim here comes from the Offcut briefs. Things the briefs mark as not
 * done or not measured (code signing, per-site browser tests, speech-to-text
 * speed) are stated as limits, never as features. The installer is linked from
 * an outside host (see lib/offcut.ts); it is never served from this domain.
 *
 * Layout: ink hero (promise, agent pill, download or "being prepared", and an
 * HTML example of the hook / body / call to action split, labelled as an
 * example), a "does not" trust band, then what it does, how it works, install,
 * PC needs, checksum, limits, FAQ and an ink closing band. Styles are scoped
 * under .oc-page; app/globals.css forces padding on every <section> and sizes
 * on h1 to h3 on phones, so those few rules use !important on purpose.
 */

const SITE_URL = 'https://echopulse.media';
const canonical = `${SITE_URL}/resources/offcut`;
const TITLE = 'Offcut: Free Video Transcript Tool for Reels and YouTube';
const DESCRIPTION =
  'Free Windows app that saves the transcript of any Instagram Reel, YouTube or TikTok video and splits the script into hook, body and CTA. No account.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
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
  { icon: FileText, text: 'Saves the transcript of a video you choose, so you can read and reuse what was said.' },
  { icon: Rows3, text: 'Splits each saved script into hook, body and call to action, so you can see how it is built.' },
  { icon: HardDrive, text: 'Keeps everything on your own PC.' },
];

const DOES_NOT = [
  { icon: UserX, title: 'No account', text: 'No account and no sign-in.' },
  { icon: CloudOff, title: 'No uploads', text: 'Nothing is uploaded. Your transcripts stay on your PC.' },
  { icon: PowerOff, title: 'Nothing runs when idle', text: 'No startup entry and no background process. Nothing runs when Offcut is idle.' },
  { icon: ListChecks, title: 'Fixed rules, not AI', text: 'No AI model writes the breakdown. Hook, body and call to action are marked by simple, fixed rules.' },
];

const PARTS = [
  { icon: Puzzle, name: 'Browser extension', tag: 'Optional', text: 'An optional browser extension (Chrome, Edge or Brave) adds a Transcribe button on the video you are watching.' },
  { icon: Cpu, name: 'Helper', tag: 'Only when needed', text: 'A small helper starts only when you need it, for example to turn speech into text, and stops afterwards.' },
  { icon: AppWindow, name: 'App', tag: 'Your scripts', text: 'The app is where you read and organise saved scripts.' },
];

/**
 * Use cases the owner has stated. Phrase "Teach your AI writer" as using saved
 * scripts as examples: there is no built-in export or integration.
 */
const USE_CASES: { key: keyof typeof OFFCUT.useCaseShots; frame: FrameKind; tag: string; title: string; text: string }[] = [
  { key: 'instagram', frame: 'split', tag: 'Instagram Reels', title: 'Save Instagram Reels for inspiration', text: 'Keep the reels you want to learn from in one place on your PC, with their scripts.' },
  { key: 'youtube', frame: 'split', tag: 'YouTube', title: "Read any YouTube video's script", text: 'See the transcript laid out so you can read how the creator wrote it.' },
  { key: 'breakdown', frame: 'split', tag: 'Hook, body, call to action', title: "Learn from other creators' scripts", text: 'See each script split into hook, body and call to action.' },
  { key: 'library', frame: 'library', tag: 'Your saved scripts', title: 'Teach your AI writer', text: 'Use your saved scripts as examples when you ask Claude, ChatGPT or your own writing agent to write scripts in a style you like.' },
];

const NEEDS = [
  { k: 'System', v: 'Windows 10 or 11, 64-bit' },
  { k: 'Admin rights', v: 'Not needed' },
  { k: 'Download', v: OFFCUT.downloadSizeLabel },
  { k: 'Disk space after install', v: OFFCUT.installedSizeLabel },
  { k: 'Speech model', v: OFFCUT.speechModelLabel },
  { k: 'Memory while working', v: 'About 50 MB for the helper, about 300 MB while turning speech into text', wide: true },
  { k: 'Other software', v: 'None to install first' },
];

const LIMITS = [
  'The installer is not code-signed yet, which is why Windows shows a warning.',
  'The browser extension has not yet been tested on every video site.',
  'We have not measured speech-to-text speed on a typical laptop yet, so we do not quote one.',
  'Windows only for now.',
];

/** Made-up sample text for the hero example. Not from any real video. */
const SAMPLE = [
  { part: 'Hook', cls: 'hook', text: 'I stopped checking my phone for the first hour of the day. Here is what changed.' },
  {
    part: 'Body',
    cls: 'body',
    text: 'For two weeks the phone stayed in another room until breakfast. I wrote down three things to get done, went for a short walk, and only then opened my messages. The mornings felt slower, and the rest of the day felt clearer.',
  },
  { part: 'Call to action', cls: 'cta', text: 'Try it for one week, then tell me in the comments what you noticed.' },
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
    a: 'No, it is optional. The app works on its own. The extension adds a Transcribe button on the video you are watching, so you never paste a link.',
  },
  {
    q: 'How do I add the extension?',
    a: 'Open your browser\'s extensions page, turn on Developer mode, click Load unpacked and choose the Offcut extension folder. It takes about a minute, once. The full guide is at echopulse.media/resources/offcut/extension.',
  },
  {
    q: 'What is the "Disable developer mode extensions" message?',
    a: 'Chrome shows it at startup for any extension added with Developer mode, not just Offcut. Close it or click the X. Do not click Disable, or the extension turns off.',
  },
  {
    q: 'Can an AI agent install Offcut for me?',
    a: 'Yes. Copy the prompt in the "Install it with Claude or another AI agent" section into any assistant that can run commands on your PC. It downloads only from this page, checks the SHA-256 first and never changes security settings.',
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
        alternateName: ['Offcut by EchoPulse Media', 'Offcut transcript app', 'Offcut video transcript tool'],
        url: canonical,
        description: DESCRIPTION,
        applicationCategory: 'MultimediaApplication',
        keywords: 'video transcript, Instagram Reels transcript, YouTube transcript, TikTok transcript, script breakdown, hook body call to action, free Windows app',
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

  const installerFile = OFFCUT.installerName;
  const shots = OFFCUT.screenshots;

  return (
    <>
      <Nav />
      <main id="main" className="oc-page">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }} />
        <noscript>
          <style>{'.rv, .rv .sf-line, .rv .sf-panel { opacity: 1 !important; transform: none !important; animation: none !important; }'}</style>
        </noscript>

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <header className="oc-hero" data-dark-bg="true">
          <div className="oc-wrap oc-hero-grid">
            <div className="oc-hero-copy">
              <nav className="oc-crumbs" aria-label="Breadcrumb">
                <Link href="/resources">Resources</Link> <span aria-hidden="true">/</span> <span aria-current="page">Offcut</span>
              </nav>
              <p className="oc-eyebrow">A free tool from EchoPulse Media</p>
              <h1 className="oc-h1">
                <span className="oc-name">Offcut</span>
                <span className="oc-sr">: </span>
                <span className="oc-promise">Save and study the scripts behind videos.</span>
              </h1>
              <p className="oc-lead">
                A free Windows tool for video editors, content creators and scriptwriters. Save the transcript of a video you want to learn from, and see it split into hook, body and call to action. It runs on your PC, with no account and no uploads.
              </p>

              <div className="oc-actions">
                <AgentCopyPill
                  tone="dark"
                  label="Install Offcut with your AI agent"
                  instruction="Read https://echopulse.media/resources/offcut/agent.md and follow it to install Offcut on this Windows PC. Walk me through anything I need to click."
                  fileLabel="echopulse.media/resources/offcut/agent.md"
                />
                <div className="oc-cta">
                  {OFFCUT_READY ? (
                    <>
                      <a href={OFFCUT.downloadUrl} className="oc-dl" target="_blank" rel="noopener noreferrer" data-track="offcut_download_click" data-track-location="offcut_hero">
                        <Download size={18} strokeWidth={2} aria-hidden="true" />
                        Download for Windows
                      </a>
                      <p className="oc-meta">
                        {OFFCUT.version && <>Version {OFFCUT.version}. </>}Windows 10 or 11, 64-bit. Download {OFFCUT.downloadSizeLabel}. Free. Opens {OFFCUT.hostLabel}; if it says it can&apos;t scan the file for viruses (normal for large files), click &quot;Download anyway&quot;.
                      </p>
                    </>
                  ) : (
                    <div className="oc-soon">
                      <span className="oc-soon-dot" aria-hidden="true" />
                      <div>
                        <p>
                          <strong>The download is being prepared.</strong> Leave your email below and we will tell you when it is live.
                        </p>
                        <a href="#oc-updates" className="oc-soon-link">
                          Get the email
                          <ArrowRight size={16} strokeWidth={2} aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <ul className="oc-facts" aria-label="At a glance">
                {['Free', 'Runs on your PC', 'No account'].map((f) => (
                  <li key={f}>
                    <Check size={16} strokeWidth={2.4} aria-hidden="true" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            <figure className="oc-demo">
              <div className="oc-demo-win">
                <div className="oc-demo-chrome" aria-hidden="true">
                  <span className="oc-demo-dots"><i /><i /><i /></span>
                  <span className="oc-demo-title">Offcut</span>
                  <span className="oc-demo-tag">Example</span>
                </div>
                <div className="oc-demo-body">
                  <p className="oc-demo-kicker">Sample transcript</p>
                  <p className="oc-demo-head">Why I stopped checking my phone first thing</p>
                  <div className="oc-demo-bar" aria-hidden="true">
                    <span className="oc-k-hook" style={{ flexGrow: 1 }} />
                    <span className="oc-k-body" style={{ flexGrow: 3 }} />
                    <span className="oc-k-cta" style={{ flexGrow: 1 }} />
                  </div>
                  <ol className="oc-demo-parts">
                    {SAMPLE.map((s) => (
                      <li key={s.part} className={`oc-part oc-part-${s.cls}`}>
                        <span className="oc-part-label">{s.part}</span>
                        <p>{s.text}</p>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
              <figcaption>Example with made-up sample text, to show how a script is split. Not a screenshot of the app.</figcaption>
            </figure>
          </div>
        </header>

        {/* ── Trust band: what it does not do ─────────────────────────── */}
        <section className="oc-band oc-trust" aria-labelledby="oc-not">
          <div className="oc-wrap">
            <h2 id="oc-not" className="oc-trust-h">What it does not do</h2>
            <ul className="oc-trust-row">
              {DOES_NOT.map(({ icon: Icon, title, text }, i) => (
                <li key={title}>
                  <Reveal className="oc-trust-in" delay={i * 80}>
                    <span className="oc-ico" aria-hidden="true"><Icon size={20} strokeWidth={1.75} /></span>
                    <p className="oc-trust-t">{title}</p>
                    <p className="oc-trust-d">{text}</p>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* ── Use cases ───────────────────────────────────────────────── */}
        <section className="oc-band" aria-labelledby="oc-uses">
          <div className="oc-wrap">
            <Reveal className="oc-head">
              <p className="oc-kicker">Use cases</p>
              <h2 id="oc-uses" className="oc-h2">What people use it for</h2>
            </Reveal>
            <ul className="oc-uses">
              {USE_CASES.map((u, i) => (
                <li key={u.key}>
                  <Reveal className="oc-use" delay={(i % 2) * 100} track>
                    <ShotFrame kind={u.frame} shot={OFFCUT.useCaseShots[u.key]} />
                    <div className="oc-use-copy">
                      <span className="oc-chip">{u.tag}</span>
                      <h3>{u.title}</h3>
                      <p>{u.text}</p>
                    </div>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {shots.length > 0 && (
          <section className="oc-band oc-shots" aria-labelledby="oc-shots-h">
            <div className="oc-wrap">
              <div className="oc-head">
                <p className="oc-kicker">Screenshots</p>
                <h2 id="oc-shots-h" className="oc-h2">See Offcut on a Windows PC</h2>
              </div>
              <div className={shots.length === 1 ? 'oc-shot-grid oc-shot-one' : 'oc-shot-grid'}>
                {shots.map((s) => (
                  <figure key={s.src}>
                    <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="(max-width: 900px) 100vw, 600px" />
                    <figcaption>{s.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── What it does ────────────────────────────────────────────── */}
        <section className="oc-band" aria-labelledby="oc-what">
          <div className="oc-wrap oc-split">
            <Reveal className="oc-split-head">
              <p className="oc-kicker">Overview</p>
              <h2 id="oc-what" className="oc-h2">What it does</h2>
              <p className="oc-sub">For video editors, content creators and scriptwriters.</p>
            </Reveal>
            <Reveal delay={100}>
            <ol className="oc-does">
              {DOES.map(({ icon: Icon, text }, i) => (
                <li key={text}>
                  <span className="oc-does-n" aria-hidden="true">0{i + 1}</span>
                  <span className="oc-ico oc-ico-soft" aria-hidden="true"><Icon size={20} strokeWidth={1.75} /></span>
                  <p>{text}</p>
                </li>
              ))}
            </ol>
            </Reveal>
          </div>
        </section>

        {/* ── How it works ────────────────────────────────────────────── */}
        <section className="oc-band oc-band-line" aria-labelledby="oc-how">
          <div className="oc-wrap">
            <Reveal className="oc-head">
              <p className="oc-kicker">Three parts</p>
              <h2 id="oc-how" className="oc-h2">How it works</h2>
              <p className="oc-sub">Offcut has three parts.</p>
            </Reveal>
            <ol className="oc-parts">
              {PARTS.map(({ icon: Icon, name, tag, text }, i) => (
                <li key={name}>
                  <Reveal className="oc-part-card" delay={i * 100}>
                  <div className="oc-part-top">
                    <span className="oc-ico" aria-hidden="true"><Icon size={20} strokeWidth={1.75} /></span>
                    <span className="oc-chip">{tag}</span>
                  </div>
                  <h3>{name}</h3>
                  <p>{text}</p>
                  {i < PARTS.length - 1 && (
                    <span className="oc-link-arrow" aria-hidden="true"><ArrowRight size={16} strokeWidth={2} /></span>
                  )}
                  </Reveal>
                </li>
              ))}
            </ol>
            <div className="oc-how-foot">
              <p><ShieldCheck size={18} strokeWidth={1.75} aria-hidden="true" /> Updates are signed.</p>
              <Link href="/resources/offcut/extension" className="oc-arrow-link">
                Extension guide <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        {/* ── Install + agent prompt ──────────────────────────────────── */}
        <section className="oc-band oc-band-line" aria-labelledby="oc-install">
          <div className="oc-wrap oc-install">
            <div>
              <Reveal className="oc-head">
                <p className="oc-kicker">Setup</p>
                <h2 id="oc-install" className="oc-h2">Install in three steps</h2>
              </Reveal>
              <Reveal delay={80}>
              <ol className="oc-steps">
                <li>
                  <span className="oc-step-n" aria-hidden="true">1</span>
                  <div>
                    <p className="oc-step-t">Open {OFFCUT.installerName}.</p>
                    <p className="oc-step-d">If Chrome says the file isn&apos;t commonly downloaded, open the menu on the download and click &quot;Keep&quot;. No admin rights needed and nothing else to install first.</p>
                  </div>
                </li>
                <li>
                  <span className="oc-step-n" aria-hidden="true">2</span>
                  <div>
                    <p className="oc-step-t">If Windows shows &quot;Windows protected your PC&quot;, click &quot;More info&quot;, then &quot;Run anyway&quot;.</p>
                    <div className="oc-callout">
                      <Info size={18} strokeWidth={1.75} aria-hidden="true" />
                      <p>
                        It appears because the installer is not code-signed yet. You can check the file yourself first (<a href="#oc-verify">see below</a>).
                      </p>
                    </div>
                  </div>
                </li>
                <li>
                  <span className="oc-step-n" aria-hidden="true">3</span>
                  <div>
                    <p className="oc-step-t">Optional: add the browser extension.</p>
                    <p className="oc-step-d">
                      It takes about a minute, once. <Link href="/resources/offcut/extension">Follow the extension guide</Link>.
                    </p>
                  </div>
                </li>
              </ol>
              </Reveal>
            </div>

            <Reveal delay={160}>
            <div className="oc-agent" aria-labelledby="oc-agent" role="region">
              <h2 id="oc-agent">Install it with Claude or another AI agent</h2>
              <p>
                The one-line instruction at the top of this page is all most agents need. If your assistant cannot open web pages, paste this full prompt instead. It downloads Offcut only from this page, checks the file against our SHA-256 before running it, and never touches your security settings.
              </p>
              <CopyText value={OFFCUT_AGENT_PROMPT} label="Copy prompt" title="Full prompt" block />
            </div>
            </Reveal>
          </div>
        </section>

        {/* ── PC needs ────────────────────────────────────────────────── */}
        <section className="oc-band oc-band-line" aria-labelledby="oc-needs">
          <div className="oc-wrap">
            <Reveal className="oc-head">
              <p className="oc-kicker">Specs</p>
              <h2 id="oc-needs" className="oc-h2">What your PC needs</h2>
            </Reveal>
            <Reveal delay={80}>
            <dl className="oc-spec">
              {NEEDS.map((n) => (
                <div key={n.k} className={n.wide ? 'oc-spec-wide' : undefined}>
                  <dt>{n.k}</dt>
                  <dd>{n.v}</dd>
                </div>
              ))}
            </dl>
            </Reveal>
          </div>
        </section>

        {/* ── Verify ──────────────────────────────────────────────────── */}
        <section className="oc-band oc-band-line" aria-labelledby="oc-verify">
          <div className="oc-wrap oc-split">
            <Reveal className="oc-split-head">
              <p className="oc-kicker">Checksum</p>
              <h2 id="oc-verify" className="oc-h2">Check the file yourself</h2>
              {OFFCUT_READY ? (
                <p className="oc-sub">In PowerShell, run this in the folder where you saved the installer, then compare the result with the SHA-256 below. If they match, the file is exactly the one we published.</p>
              ) : (
                <p className="oc-sub">The SHA-256 checksum will be published here with the download, so you can confirm the file has not been changed.</p>
              )}
            </Reveal>
            <Reveal delay={100}>
            <div className="oc-term">
              <div className="oc-term-bar" aria-hidden="true">
                <span className="oc-demo-dots"><i /><i /><i /></span>
                <span>Windows PowerShell</span>
              </div>
              {OFFCUT_READY ? (
                <div className="oc-term-body">
                  <p className="oc-term-label">Command</p>
                  <CopyText value={`Get-FileHash .\\${installerFile} -Algorithm SHA256`} />
                  <p className="oc-term-label">SHA-256</p>
                  <CopyText value={OFFCUT.sha256} />
                </div>
              ) : (
                <div className="oc-term-body oc-term-wait">
                  <ShieldCheck size={22} strokeWidth={1.5} aria-hidden="true" />
                  <p>SHA-256</p>
                  <span className="oc-term-line" aria-hidden="true" />
                </div>
              )}
            </div>
            </Reveal>
          </div>
        </section>

        {/* ── Limits ──────────────────────────────────────────────────── */}
        <section className="oc-band oc-band-tight" aria-labelledby="oc-limits">
          <div className="oc-wrap">
            <Reveal className="oc-limits">
              <div className="oc-limits-head">
                <p className="oc-kicker">Honest limits</p>
                <h2 id="oc-limits">Honest limits</h2>
              </div>
              <ul>
                {LIMITS.map((l) => <li key={l}>{l}</li>)}
              </ul>
            </Reveal>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────── */}
        <section className="oc-band oc-band-line" aria-labelledby="oc-faq">
          <div className="oc-wrap oc-split">
            <Reveal className="oc-split-head">
              <p className="oc-kicker">FAQ</p>
              <h2 id="oc-faq" className="oc-h2">Questions</h2>
            </Reveal>
            <Reveal className="oc-faq" delay={100}>
              {FAQ.map((f) => (
                <details key={f.q}>
                  <summary>
                    <span>{f.q}</span>
                    <ChevronDown size={20} strokeWidth={1.75} aria-hidden="true" />
                  </summary>
                  <p>{f.a}</p>
                </details>
              ))}
            </Reveal>
          </div>
        </section>

        {/* ── Closing band ────────────────────────────────────────────── */}
        <div className="oc-close" data-dark-bg="true">
          <div className="oc-wrap oc-close-grid">
            <div id="oc-updates" className="oc-close-form">
              <Reveal>
                <OffcutUpdatesCapture ready={OFFCUT_READY} />
              </Reveal>
            </div>
            <section className="oc-by" aria-labelledby="oc-by">
              <p className="oc-kicker oc-kicker-dark">The studio</p>
              <h2 id="oc-by">Made by EchoPulse Media</h2>
              <p>
                We are a small studio that edits short-form and podcast video, builds fast websites and custom business software, and helps businesses get found on Google and in AI answers. Offcut is free to use.
              </p>
              <ul className="oc-links">
                <li><Link href="/work">See our video work <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" /></Link></li>
                <li><Link href="/free-edits">Get 2 free edits <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" /></Link></li>
                <li><Link href="/book">Book a free 15-minute call <ArrowUpRight size={16} strokeWidth={2} aria-hidden="true" /></Link></li>
              </ul>
            </section>
          </div>
        </div>
      </main>
      <Footer />
      <style>{`
        .oc-page {
          --ink: #0C0C0B; --ink-2: #161513; --paper: #F2EEE7; --card: #FBF9F5; --white: #FFFFFF;
          --text: #3E3D3A; --muted: #625E56; --line: rgba(12,12,11,0.1); --line-2: rgba(12,12,11,0.16);
          --orange: #E8541A; --orange-2: #D14812;
          --on-ink: #F2EEE7; --on-ink-2: rgba(242,238,231,0.7); --on-ink-3: rgba(242,238,231,0.5); --ink-line: rgba(242,238,231,0.12);
          --gutter: 40px;
          background: var(--paper); color: var(--ink);
          font-family: var(--font-inter), Inter, system-ui, sans-serif;
          font-feature-settings: 'cv11', 'ss01';
          -webkit-font-smoothing: antialiased;
        }
        .oc-page *, .oc-page *::before, .oc-page *::after { box-sizing: border-box; }
        .oc-page p, .oc-page h1, .oc-page h2, .oc-page h3, .oc-page ul, .oc-page ol, .oc-page dl, .oc-page dd, .oc-page figure { margin: 0; }
        .oc-page ul, .oc-page ol { list-style: none !important; padding: 0 !important; }
        .oc-page li { display: block; }
        .oc-page [id] { scroll-margin-top: 112px; }
        .oc-page a:focus-visible, .oc-page summary:focus-visible { outline: 3px solid var(--orange); outline-offset: 3px; border-radius: 8px; }
        .oc-sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); white-space: nowrap; }

        .oc-wrap { width: 100%; max-width: calc(1200px + var(--gutter) * 2); margin: 0 auto; padding: 0 var(--gutter); }
        .oc-page .oc-band { padding: 96px 0 !important; }
        .oc-page .oc-band-tight { padding: 0 0 96px !important; }
        .oc-band-line .oc-wrap { position: relative; }
        .oc-band-line > .oc-wrap::before { content: ""; position: absolute; top: -96px; left: var(--gutter); right: var(--gutter); height: 1px; background: var(--line); }

        .oc-head { max-width: 720px; margin-bottom: 48px; }
        .oc-kicker { display: inline-flex; align-items: center; gap: 8px; margin-bottom: 16px !important; font-size: 13px; font-weight: 600; line-height: 16px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }
        .oc-kicker::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--orange); }
        .oc-page .oc-h2 { font-size: clamp(32px, 3.4vw, 44px); font-weight: 700; line-height: 1.08; letter-spacing: -0.035em; color: var(--ink); text-wrap: balance; }
        .oc-sub { margin-top: 16px !important; font-size: 18px; line-height: 1.6; color: var(--text); max-width: 560px; }
        .oc-split { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 64px; align-items: start; }
        .oc-split-head { position: sticky; top: 128px; }
        .oc-ico { flex: none; display: inline-grid; place-items: center; width: 44px; height: 44px; border-radius: 12px; border: 1px solid var(--line-2); background: var(--white); color: var(--ink); }
        .oc-ico-soft { background: var(--paper); }
        .oc-chip { display: inline-flex; align-items: center; height: 28px; padding: 0 12px; border-radius: 999px; border: 1px solid var(--line-2); font-size: 12px; font-weight: 600; color: var(--muted); white-space: nowrap; }
        .oc-arrow-link { display: inline-flex; align-items: center; gap: 6px; min-height: 44px; font-size: 16px; font-weight: 600; color: var(--ink); text-decoration: underline; text-decoration-color: var(--orange); text-decoration-thickness: 2px; text-underline-offset: 6px; }
        .oc-arrow-link:hover { color: var(--orange-2); }

        /* Hero */
        .oc-hero { position: relative; background: var(--ink); color: var(--on-ink); overflow: hidden; border-bottom: 1px solid var(--ink); }
        .oc-hero::after { content: ""; position: absolute; inset: 0; background-image: linear-gradient(var(--ink-line) 1px, transparent 1px), linear-gradient(90deg, var(--ink-line) 1px, transparent 1px); background-size: 64px 64px; opacity: 0.28; -webkit-mask-image: radial-gradient(80% 70% at 75% 40%, #000 0%, transparent 75%); mask-image: radial-gradient(80% 70% at 75% 40%, #000 0%, transparent 75%); pointer-events: none; }
        .oc-hero-grid { position: relative; z-index: 1; display: grid; grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); gap: 72px; align-items: center; padding-top: 160px; padding-bottom: 96px; }
        .oc-crumbs { margin-bottom: 32px; font-size: 14px; color: var(--on-ink-3); }
        .oc-crumbs a { color: var(--on-ink-2); text-decoration: underline; text-decoration-color: rgba(232,84,26,0.8); text-underline-offset: 4px; }
        .oc-crumbs a:hover { color: var(--on-ink); }
        .oc-eyebrow { display: inline-flex; align-items: center; gap: 8px; height: 32px; padding: 0 14px; margin-bottom: 24px !important; border: 1px solid var(--ink-line); border-radius: 999px; font-size: 13px; font-weight: 500; color: var(--on-ink-2); }
        .oc-eyebrow::before { content: ""; width: 6px; height: 6px; border-radius: 50%; background: var(--orange); }
        .oc-page .oc-h1 { display: block; font-size: inherit !important; letter-spacing: normal !important; line-height: normal !important; }
        .oc-name { display: block; font-size: clamp(72px, 8.4vw, 120px); font-weight: 800; line-height: 0.92; letter-spacing: -0.055em; color: var(--on-ink); }
        .oc-promise { display: block; margin-top: 20px; font-size: clamp(26px, 2.5vw, 34px); font-weight: 600; line-height: 1.18; letter-spacing: -0.025em; color: var(--on-ink); text-wrap: balance; max-width: 560px; }
        .oc-lead { margin-top: 24px !important; font-size: 18px; line-height: 1.65; color: var(--on-ink-2); max-width: 560px; }
        .oc-actions { margin-top: 40px; display: grid; gap: 24px; max-width: 560px; }
        .oc-actions .acp { margin: 0; }
        .oc-cta { display: grid; gap: 12px; }
        .oc-dl { display: inline-flex; align-items: center; justify-content: center; gap: 10px; justify-self: start; min-height: 52px; padding: 0 24px; border-radius: 999px; border: 1px solid rgba(242,238,231,0.32); color: var(--on-ink); font-size: 16px; font-weight: 600; text-decoration: none; transition: background-color .2s ease, border-color .2s ease; }
        .oc-dl:hover { background: rgba(242,238,231,0.08); border-color: rgba(242,238,231,0.6); }
        .oc-meta { font-size: 14px; line-height: 1.5; color: var(--on-ink-3); }
        .oc-soon { display: grid; grid-template-columns: 8px minmax(0, 1fr); gap: 16px; padding: 16px 20px; border: 1px solid var(--ink-line); border-radius: 16px; background: rgba(255,255,255,0.03); }
        .oc-soon-dot { width: 8px; height: 8px; margin-top: 8px; border-radius: 50%; background: var(--orange); box-shadow: 0 0 0 4px rgba(232,84,26,0.18); }
        .oc-soon p { font-size: 15px; line-height: 1.6; color: var(--on-ink-2); }
        .oc-soon strong { color: var(--on-ink); font-weight: 600; }
        .oc-soon-link { display: inline-flex; align-items: center; gap: 6px; min-height: 44px; margin-top: 4px; font-size: 15px; font-weight: 600; color: var(--on-ink); text-decoration: underline; text-decoration-color: var(--orange); text-decoration-thickness: 2px; text-underline-offset: 5px; }
        .oc-soon-link:hover { color: #FFFFFF; }
        .oc-facts { display: flex; flex-wrap: wrap; gap: 8px 24px; margin-top: 40px !important; padding-top: 24px !important; border-top: 1px solid var(--ink-line); max-width: 560px; }
        .oc-facts li { display: inline-flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 500; color: var(--on-ink); }
        .oc-facts svg { color: var(--orange); }

        /* Hero example card */
        .oc-demo { position: relative; }
        .oc-demo-win { border-radius: 16px; border: 1px solid rgba(255,255,255,0.1); background: var(--ink-2); box-shadow: 0 40px 80px -32px rgba(0,0,0,0.8), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05); overflow: hidden; }
        .oc-demo-chrome { display: flex; align-items: center; gap: 16px; height: 44px; padding: 0 16px; border-bottom: 1px solid rgba(255,255,255,0.06); background: rgba(255,255,255,0.02); }
        .oc-demo-dots { display: flex; gap: 6px; flex: none; }
        .oc-demo-dots i { width: 10px; height: 10px; border-radius: 50%; background: rgba(255,255,255,0.12); }
        .oc-demo-title { flex: 1; min-width: 0; font-size: 13px; font-weight: 600; color: var(--on-ink-2); }
        .oc-demo-tag { flex: none; display: inline-flex; align-items: center; height: 24px; padding: 0 10px; border-radius: 999px; border: 1px solid rgba(242,238,231,0.22); font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--on-ink); }
        .oc-demo-body { padding: 24px; }
        .oc-demo-kicker { font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--on-ink-3); }
        .oc-demo-head { margin-top: 8px !important; font-size: 18px; font-weight: 600; line-height: 1.35; letter-spacing: -0.01em; color: var(--on-ink); }
        .oc-demo-bar { display: flex; gap: 4px; height: 6px; margin: 20px 0 16px; }
        .oc-demo-bar span { border-radius: 999px; }
        .oc-k-hook { background: var(--orange); }
        .oc-k-body { background: rgba(242,238,231,0.3); }
        .oc-k-cta { background: #F2EEE7; }
        .oc-demo-parts { display: grid; gap: 8px; }
        .oc-part { position: relative; padding: 16px 16px 16px 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.07); background: rgba(255,255,255,0.03); }
        .oc-part::before { content: ""; position: absolute; left: 0; top: 16px; bottom: 16px; width: 3px; border-radius: 0 3px 3px 0; }
        .oc-part-hook::before { background: var(--orange); }
        .oc-part-body::before { background: rgba(242,238,231,0.3); }
        .oc-part-cta::before { background: #F2EEE7; }
        .oc-part-label { display: block; margin-bottom: 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--on-ink-3); }
        .oc-part-hook .oc-part-label { color: #F08A5D; }
        .oc-part p { font-size: 14px; line-height: 1.6; color: rgba(242,238,231,0.86); }
        /* Hero example: segments arrive in order on load. CSS only, so it runs
           without waiting for hydration; reduced motion shows the end state. */
        .oc-demo-win { animation: oc-rise .8s cubic-bezier(0.16, 1, 0.3, 1) .1s both; }
        .oc-demo-bar span { transform-origin: left center; animation: oc-grow .7s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .oc-demo-bar span:nth-child(1), .oc-part-hook { animation-delay: .45s; }
        .oc-demo-bar span:nth-child(2), .oc-part-body { animation-delay: .8s; }
        .oc-demo-bar span:nth-child(3), .oc-part-cta { animation-delay: 1.15s; }
        .oc-part { animation: oc-seg .7s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .oc-part::before { transform-origin: center top; animation: oc-mark .6s cubic-bezier(0.16, 1, 0.3, 1) both; animation-delay: inherit; }
        @keyframes oc-rise { from { opacity: 0; transform: translate3d(0, 24px, 0); } to { opacity: 1; transform: none; } }
        @keyframes oc-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes oc-seg { from { opacity: 0; transform: translate3d(0, 10px, 0); } to { opacity: 1; transform: none; } }
        @keyframes oc-mark { from { transform: scaleY(0); } to { transform: scaleY(1); } }
        .oc-demo figcaption { margin-top: 16px; font-size: 13px; line-height: 1.5; color: var(--on-ink-3); text-align: center; }

        /* Trust band */
        .oc-page .oc-trust { padding: 0 !important; background: var(--card); border-bottom: 1px solid var(--line); }
        .oc-page .oc-trust-h { padding: 32px 0 0; font-size: 13px !important; font-weight: 600; line-height: 16px !important; letter-spacing: 0.08em !important; text-transform: uppercase; color: var(--muted); }
        .oc-trust-row { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .oc-trust-row li { padding: 24px 32px 40px; border-left: 1px solid var(--line); }
        .oc-trust-row li:first-child { padding-left: 0; border-left: 0; }
        .oc-trust-row .oc-ico { width: 40px; height: 40px; border-radius: 10px; }
        .oc-trust-t { margin-top: 16px !important; font-size: 17px; font-weight: 700; letter-spacing: -0.01em; color: var(--ink); }
        .oc-trust-d { margin-top: 8px !important; font-size: 15px; line-height: 1.55; color: var(--muted); }

        /* Screenshots */
        .oc-shot-grid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
        .oc-shot-one { grid-template-columns: minmax(0, 1fr); max-width: 960px; }
        .oc-shot-grid img { display: block; width: 100%; height: auto; border-radius: 16px; border: 1px solid var(--line); background: var(--white); }
        .oc-shot-grid figcaption { margin-top: 12px; font-size: 14px; color: var(--muted); }

        /* Use cases */
        .oc-uses { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 24px; }
        .oc-uses > li { display: flex; }
        .oc-use { flex: 1; display: flex; flex-direction: column; padding: 16px; border-radius: 16px; border: 1px solid var(--line); background: var(--card); transition: transform .3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow .3s ease, border-color .3s ease, opacity .7s cubic-bezier(0.16, 1, 0.3, 1); }
        .oc-use-copy { padding: 24px 8px 8px; }
        .oc-page .oc-use h3 { margin-top: 16px !important; font-size: 22px !important; font-weight: 700; line-height: 1.25 !important; letter-spacing: -0.02em; color: var(--ink); }
        .oc-use p { margin-top: 8px !important; font-size: 16px; line-height: 1.6; color: var(--text); max-width: 480px; }

        /* What it does */
        .oc-does { display: grid; }
        .oc-does li { display: grid; grid-template-columns: 40px 44px minmax(0, 1fr); gap: 24px; align-items: center; padding: 32px 0; border-top: 1px solid var(--line); }
                .oc-does-n { font-size: 14px; font-weight: 600; color: var(--muted); font-variant-numeric: tabular-nums; }
        .oc-does p { font-size: 22px; font-weight: 500; line-height: 1.4; letter-spacing: -0.015em; color: var(--ink); }

        /* How it works */
        .oc-parts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 24px; }
        .oc-parts > li { display: flex; }
        .oc-part-card { position: relative; flex: 1; padding: 32px; border-radius: 16px; border: 1px solid var(--line); background: var(--card); transition: transform .3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow .3s ease, border-color .3s ease, opacity .7s cubic-bezier(0.16, 1, 0.3, 1); }
        @media (hover: hover) {
          .oc-part-card.is-in:hover, .oc-use.is-in:hover { transform: translate3d(0, -4px, 0); border-color: var(--line-2); box-shadow: 0 24px 48px -28px rgba(12,12,11,0.35); }
          .oc-use.is-in:hover .sf { border-color: rgba(12,12,11,0.16); }
        }
        .oc-part-top { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 32px; }
        .oc-page .oc-part-card h3 { font-size: 22px !important; font-weight: 700; line-height: 1.2 !important; letter-spacing: -0.02em; }
        .oc-part-card p { margin-top: 8px !important; font-size: 16px; line-height: 1.6; color: var(--text); }
        .oc-link-arrow { position: absolute; z-index: 1; top: 50%; right: -20px; display: grid; place-items: center; width: 32px; height: 32px; margin-top: -16px; border-radius: 50%; border: 1px solid var(--line-2); background: var(--paper); color: var(--ink); }
        .oc-how-foot { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 16px; margin-top: 32px; }
        .oc-how-foot p { display: inline-flex; align-items: center; gap: 8px; font-size: 15px; font-weight: 500; color: var(--text); }
        .oc-how-foot p svg { color: var(--ink); }

        /* Install */
        .oc-install { display: grid; grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); gap: 64px; align-items: start; }
        .oc-steps { position: relative; display: grid; gap: 8px; }
        .oc-steps::before { content: ""; position: absolute; left: 19px; top: 40px; bottom: 40px; width: 1px; background: var(--line-2); }
        .oc-steps li { position: relative; display: grid; grid-template-columns: 40px minmax(0, 1fr); gap: 24px; padding: 0 0 32px; }
        .oc-steps li:last-child { padding-bottom: 0; }
        .oc-step-n { position: relative; display: grid; place-items: center; width: 40px; height: 40px; border-radius: 50%; background: var(--ink); color: var(--on-ink); font-size: 15px; font-weight: 700; box-shadow: 0 0 0 6px var(--paper); }
        .oc-step-t { padding-top: 8px; font-size: 19px; font-weight: 700; line-height: 1.35; letter-spacing: -0.015em; color: var(--ink); }
        .oc-step-d { margin-top: 8px !important; font-size: 16px; line-height: 1.6; color: var(--text); }
        .oc-step-d a, .oc-callout a { color: var(--ink); font-weight: 600; text-decoration: underline; text-decoration-color: var(--orange); text-decoration-thickness: 2px; text-underline-offset: 4px; }
        .oc-callout { display: grid; grid-template-columns: 18px minmax(0, 1fr); gap: 12px; margin-top: 16px; padding: 16px 20px; border-radius: 12px; border: 1px solid var(--line); background: var(--card); }
        .oc-callout svg { margin-top: 3px; color: var(--muted); }
        .oc-callout p { font-size: 15px; line-height: 1.6; color: var(--text); }
        .oc-agent { padding: 32px; border-radius: 16px; background: var(--ink); color: var(--on-ink); }
        .oc-page .oc-agent h2 { font-size: 24px !important; font-weight: 700; line-height: 1.2 !important; letter-spacing: -0.02em !important; color: var(--on-ink); }
        .oc-agent > p { margin-top: 12px !important; font-size: 15px; line-height: 1.65; color: var(--on-ink-2); }
        .oc-agent .ct { margin-top: 24px; }

        /* Spec grid */
        .oc-spec { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 1px; border-radius: 16px; border: 1px solid var(--line); background: var(--line); overflow: hidden; }
        .oc-spec > div { padding: 24px; background: var(--card); }
        .oc-spec .oc-spec-wide { grid-column: span 2; }
        .oc-spec dt { font-size: 13px; font-weight: 600; letter-spacing: 0.04em; text-transform: uppercase; color: var(--muted); }
        .oc-spec dd { margin-top: 8px !important; font-size: 18px; font-weight: 600; line-height: 1.4; letter-spacing: -0.01em; color: var(--ink); }

        /* Terminal */
        .oc-term { border-radius: 16px; border: 1px solid rgba(12,12,11,0.9); background: var(--ink); color: var(--on-ink); overflow: hidden; box-shadow: 0 32px 64px -32px rgba(12,12,11,0.45); }
        .oc-term-bar { display: flex; align-items: center; gap: 16px; height: 44px; padding: 0 16px; border-bottom: 1px solid rgba(255,255,255,0.06); font-size: 13px; font-weight: 500; color: var(--on-ink-3); }
        .oc-term-body { padding: 24px; }
        .oc-term-label { margin-top: 24px !important; font-size: 12px; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--on-ink-3); }
        .oc-term-label:first-child { margin-top: 0 !important; }
        .oc-term .ct { margin-top: 8px; }
        .oc-term-wait { display: grid; grid-template-columns: 22px auto minmax(0, 1fr); align-items: center; gap: 12px; min-height: 120px; }
        .oc-term-wait svg { color: var(--on-ink-3); }
        .oc-term-wait p { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 14px; color: var(--on-ink-2); }
        .oc-term-line { height: 1px; background: repeating-linear-gradient(90deg, rgba(242,238,231,0.3) 0 6px, transparent 6px 12px); }

        /* Limits */
        .oc-limits { display: grid; grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); gap: 64px; padding: 40px; border-radius: 16px; border: 1px solid var(--line); background: rgba(12,12,11,0.025); }
        .oc-limits-head .oc-kicker { display: none; }
        .oc-page .oc-limits h2 { font-size: 24px !important; font-weight: 700; line-height: 1.2 !important; letter-spacing: -0.02em !important; }
        .oc-limits ul { display: grid; gap: 16px; }
        .oc-limits li { position: relative; padding-left: 24px; font-size: 16px; line-height: 1.6; color: var(--text); }
        .oc-limits li::before { content: ""; position: absolute; left: 2px; top: 10px; width: 6px; height: 6px; border-radius: 50%; border: 1.5px solid var(--muted); }

        /* FAQ */
        .oc-faq { border-top: 1px solid var(--line-2); }
        .oc-faq details { border-bottom: 1px solid var(--line-2); }
        .oc-faq summary { display: flex; align-items: center; justify-content: space-between; gap: 24px; min-height: 64px; padding: 20px 0; cursor: pointer; list-style: none; font-size: 18px; font-weight: 600; line-height: 1.4; letter-spacing: -0.01em; color: var(--ink); }
        .oc-faq summary::-webkit-details-marker { display: none; }
        .oc-faq summary svg { flex: none; color: var(--muted); transition: transform .2s ease; }
        .oc-faq details[open] summary svg { transform: rotate(180deg); color: var(--ink); }
        .oc-faq summary:hover span { color: var(--orange-2); }
        .oc-faq details p { padding: 0 48px 24px 0; font-size: 16px; line-height: 1.65; color: var(--text); }

        /* Closing band */
        .oc-close { background: var(--ink); color: var(--on-ink); }
        .oc-close-grid { display: grid; grid-template-columns: minmax(0, 6fr) minmax(0, 5fr); gap: 64px; align-items: center; padding-top: 96px; padding-bottom: 96px; }
        .oc-page .oc-by { padding: 0 !important; }
        .oc-kicker-dark { color: var(--on-ink-3); }
        .oc-page .oc-by h2 { font-size: clamp(28px, 2.8vw, 36px) !important; font-weight: 700; line-height: 1.12 !important; letter-spacing: -0.03em !important; color: var(--on-ink); }
        .oc-by > p:not(.oc-kicker) { margin-top: 16px !important; font-size: 16px; line-height: 1.65; color: var(--on-ink-2); }
        .oc-links { display: grid; margin-top: 24px !important; border-top: 1px solid var(--ink-line); }
        .oc-links li { border-bottom: 1px solid var(--ink-line); }
        .oc-links a { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 56px; font-size: 16px; font-weight: 600; color: var(--on-ink); text-decoration: none; transition: color .2s ease, padding .2s ease; }
        .oc-links a svg { color: var(--orange); transition: transform .2s ease; }
        .oc-links a:hover { color: #FFFFFF; }
        .oc-links a:hover svg { transform: translate(2px, -2px); }

        @media (max-width: 1100px) {
          .oc-page { --gutter: 32px; }
          .oc-hero-grid { grid-template-columns: minmax(0, 1fr); gap: 64px; padding-top: 152px; padding-bottom: 96px; }
          .oc-hero-copy, .oc-demo { max-width: 640px; }
          .oc-actions, .oc-lead, .oc-facts { max-width: 600px; }
          .oc-install { grid-template-columns: minmax(0, 1fr); gap: 56px; }
          .oc-spec { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .oc-split { grid-template-columns: minmax(0, 4fr) minmax(0, 6fr); gap: 48px; }
          .oc-trust-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .oc-trust-row li { padding: 24px 32px 32px; }
          .oc-trust-row li:nth-child(odd) { padding-left: 0; border-left: 0; }
          .oc-trust-row li:nth-child(n+3) { border-top: 1px solid var(--line); }
          .oc-close-grid { gap: 48px; }
        }
        @media (max-width: 860px) {
          .oc-split, .oc-limits, .oc-close-grid { grid-template-columns: minmax(0, 1fr); }
          .oc-split { gap: 40px; }
          .oc-split-head { position: static; }
          .oc-limits { gap: 24px; }
          .oc-parts { grid-template-columns: minmax(0, 1fr); gap: 16px; }
          .oc-uses { grid-template-columns: minmax(0, 1fr); gap: 16px; }
          .oc-link-arrow { top: auto; right: auto; bottom: -24px; left: 32px; margin-top: 0; transform: rotate(90deg); }
          .oc-part-top { margin-bottom: 24px; }
        }
        @media (max-width: 768px) {
          .oc-page { --gutter: 20px; }
          .oc-page .oc-band { padding: 72px 0 !important; }
          .oc-page .oc-band-tight { padding: 0 0 72px !important; }
          .oc-band-line > .oc-wrap::before { top: -72px; }
          .oc-page .oc-trust { padding: 0 !important; }
          .oc-hero-grid { padding-top: 120px; padding-bottom: 72px; gap: 48px; }
          .oc-crumbs { margin-bottom: 32px; }
          .oc-name { font-size: 72px; }
          .oc-promise { margin-top: 16px; font-size: 26px; }
          .oc-lead { font-size: 17px; }
          .oc-actions { margin-top: 32px; }
          .oc-facts { margin-top: 32px !important; gap: 8px 16px; }
          .oc-facts li { font-size: 14px; }
          .oc-head { margin-bottom: 32px; }
          .oc-page .oc-h2 { font-size: 32px !important; line-height: 1.1 !important; letter-spacing: -0.03em !important; }
          .oc-sub { font-size: 17px; }
          .oc-does li { grid-template-columns: 44px minmax(0, 1fr); gap: 16px; padding: 24px 0; align-items: start; }
          .oc-does-n { display: none; }
          .oc-does p { font-size: 18px; padding-top: 8px; }
          .oc-part-card { padding: 24px; }
          .oc-use { padding: 12px; }
          .oc-use-copy { padding: 20px 8px 8px; }
          .oc-page .oc-use h3 { font-size: 20px !important; }
          .oc-steps li { gap: 16px; }
          .oc-step-t { font-size: 17px; }
          .oc-agent { padding: 24px 20px; }
          .oc-limits { padding: 24px 20px; }
          .oc-faq summary { font-size: 17px; padding: 16px 0; gap: 16px; }
          .oc-faq details p { padding-right: 0; font-size: 16px; }
          .oc-close-grid { padding-top: 72px; padding-bottom: 72px; gap: 56px; }
          .oc-close-grid { padding-bottom: 72px !important; }
        }
        @media (max-width: 560px) {
          .oc-trust-row { grid-template-columns: minmax(0, 1fr); }
          .oc-trust-row li, .oc-trust-row li:nth-child(odd) { padding: 20px 0; border-left: 0; border-top: 1px solid var(--line); }
          .oc-trust-in { display: grid; grid-template-columns: 40px minmax(0, 1fr); column-gap: 16px; }
          .oc-trust-row li:first-child { border-top: 0; }
          .oc-trust-row .oc-ico { grid-row: span 2; }
          .oc-trust-t { margin-top: 0 !important; font-size: 16px; }
          .oc-trust-d { margin-top: 4px !important; font-size: 15px; }
          .oc-page .oc-trust-h { padding-top: 24px; }
          .oc-trust-row { padding-bottom: 8px !important; }
          .oc-spec { grid-template-columns: minmax(0, 1fr); }
          .oc-spec .oc-spec-wide { grid-column: auto; }
          .oc-spec > div { display: grid; grid-template-columns: minmax(0, 2fr) minmax(0, 3fr); gap: 16px; padding: 16px 20px; align-items: baseline; }
          .oc-spec dt { font-size: 12px; }
          .oc-spec dd { margin-top: 0 !important; font-size: 15px; }
          .oc-demo-body { padding: 20px 16px; }
          .oc-term-body { padding: 20px 16px; }
          .oc-how-foot { flex-direction: column; align-items: flex-start; gap: 8px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .oc-page *, .oc-page *::before, .oc-page *::after { transition: none !important; }
          .oc-demo-win, .oc-demo-bar span, .oc-part, .oc-part::before { animation: none !important; }
          .oc-part-card.is-in:hover, .oc-use.is-in:hover { transform: none !important; }
        }
      `}</style>
    </>
  );
}
