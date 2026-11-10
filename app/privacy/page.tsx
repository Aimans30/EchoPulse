import type { Metadata } from 'next';
import Link from 'next/link';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

/**
 * /privacy: the privacy policy.
 *
 * Search Console had been showing /privacy at position ~2 for 27 impressions
 * while the URL returned a 404, and the consent banner linked to /terms
 * because there was nothing else to link to. This page is the document the
 * banner, the forms and the checkout should point at.
 *
 * Everything stated here is checked against the code that does it:
 *   - components/ConsentGate.tsx: GA4 and Clarity load only after "Allow".
 *   - lib/consent.ts: the choice is stored in localStorage, not a cookie.
 *   - middleware.ts: ep_geo cookie, 30 days, country and city only.
 *   - app/api/*: forms go to Asana, Slack and Resend; payments to Razorpay
 *     or Dodo Payments; bookings to Cal.com.
 * If one of those changes, change the matching section here.
 *
 * Server component, plain CSS, no client code. Same page shell as /about.
 */

const SITE_URL = 'https://echopulse.media';
const CONTACT_EMAIL = 'lakshya@echopulse.media';
const LAST_UPDATED = '10 November 2026';
const LAST_UPDATED_ISO = '2026-11-10';

export const metadata: Metadata = {
  title: { absolute: 'Privacy Policy | EchoPulse Media' },
  description:
    'What EchoPulse Media collects when you visit, book or buy, which tools process it, how long it is kept, and your rights under GDPR, CCPA and PIPEDA.',
  alternates: { canonical: `${SITE_URL}/privacy` },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Privacy Policy | EchoPulse Media',
    description:
      'What we collect, which tools process it, how long it is kept, and your rights.',
    url: `${SITE_URL}/privacy`,
    type: 'website',
  },
};

/** The services that touch visitor or client data, stated once and reused. */
const PROCESSORS: { name: string; role: string; where: string }[] = [
  { name: 'Vercel and Netlify', role: 'Hosting and server logs for this website', where: 'United States' },
  { name: 'Google Analytics 4', role: 'Page and event analytics, only after you allow it', where: 'United States' },
  { name: 'Microsoft Clarity', role: 'Session recording and heatmaps, only after you allow it', where: 'United States' },
  { name: 'Cal.com', role: 'Booking the strategy call', where: 'United States' },
  { name: 'Razorpay', role: 'Card and bank payments', where: 'India' },
  { name: 'Dodo Payments', role: 'Card payments on the order page', where: 'United States' },
  { name: 'Asana', role: 'Our task and client records, where form submissions become tasks', where: 'United States' },
  { name: 'Slack', role: 'Internal alerts when a form or payment comes in', where: 'United States' },
  { name: 'Resend', role: 'Transactional email such as order confirmations', where: 'United States' },
  { name: 'Cloudinary', role: 'Hosting for the showcase videos on the site', where: 'United States' },
  { name: 'Sanity', role: 'Content management for the blog. It holds no visitor data.', where: 'United States and EU' },
];

export default function PrivacyPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/privacy#webpage`,
        url: `${SITE_URL}/privacy`,
        name: 'Privacy Policy | EchoPulse Media',
        description:
          'What EchoPulse Media collects, which tools process it, how long it is kept, and your rights.',
        dateModified: LAST_UPDATED_ISO,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/privacy#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Privacy Policy', item: `${SITE_URL}/privacy` },
        ],
      },
    ],
  };

  return (
    <>
      <Nav />

      <main id="main" className="pp-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />

        <section className="pp-hero">
          <nav aria-label="Breadcrumb" className="pp-crumb">
            <Link href="/">Home</Link>
            <span aria-hidden="true">/</span>
            <span>Privacy Policy</span>
          </nav>
          <p className="pp-eyebrow">Legal</p>
          <h1 className="pp-h1">Privacy Policy</h1>
          <p className="pp-meta">Last updated: {LAST_UPDATED}</p>
          <p className="pp-lede">
            This page says what we collect when you use echopulse.media, why, which tools
            process it, how long we keep it, and what you can ask us to do with it. It is
            written in plain language on purpose. If anything is unclear, email{' '}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
          </p>
        </section>

        <div className="pp-body">
          <Section id="who" title="1. Who we are">
            <p>
              EchoPulse Media is a content studio operated by Lakshya Soni as a sole proprietor
              from Bhopal, India, with Shaurya on design and Aiman on delivery. We serve clients
              in the United States, the United Kingdom, Canada, Australia and the European Union.
            </p>
            <p>
              For the purposes of the GDPR and the UK GDPR, Lakshya Soni is the data controller
              for the personal data described on this page. Contact:{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. We have not appointed an EU or
              UK representative because our processing is occasional and low risk.
            </p>
          </Section>

          <Section id="collect" title="2. What we collect, and when">
            <p>We only collect what a given step needs. In practice that is:</p>
            <ul>
              <li>
                <strong>Contact and lead forms.</strong> Your name, email, company or website, and
                whatever you type in the message box. Lead magnet forms collect your email and the
                resource you asked for.
              </li>
              <li>
                <strong>Booking a call.</strong> Cal.com collects your name, email, time zone and any
                notes you add, and sends them to us. Cal.com has its own privacy policy for the
                booking page itself.
              </li>
              <li>
                <strong>The order form.</strong> What you ordered, your name, email, and the brief
                you give us. Payment details go straight to the payment processor (section 6).
              </li>
              <li>
                <strong>The onboarding form.</strong> Brand details, links to your accounts and
                footage, goals, and the people we should talk to on your side.
              </li>
              <li>
                <strong>Email.</strong> Anything you send us, and our replies, stays in our mailbox
                and in the task record for your project.
              </li>
              <li>
                <strong>Technical data.</strong> Our hosting provider logs IP address, browser type
                and the page requested for security and error tracking. See section 3 for analytics,
                which is separate and optional.
              </li>
            </ul>
            <p>
              We do not buy data about you, and we do not combine what you give us with data from
              brokers.
            </p>
          </Section>

          <Section id="analytics" title="3. Analytics and session recording">
            <p>
              We use two analytics tools: Google Analytics 4 and Microsoft Clarity. Clarity records
              how you move through a page (scrolling, clicks, where you hesitate) and replays it to
              us. <strong>If you are visiting from the United Kingdom or the European Economic
              Area, neither tool loads at all</strong>: we do not track those visits, so there is
              nothing to consent to and no banner. For visitors elsewhere both tools load on page
              view.
            </p>
            <p>
              To opt out from anywhere: turn on Global Privacy Control in your browser (we honour
              it and load nothing), block the domains googletagmanager.com and clarity.ms, or email
              us and we will delete any session recordings tied to your visit. Your region is read
              from the <code>ep_geo</code> cookie described below, never from your identity.
            </p>
            <p>
              Google and Microsoft process this data on their own terms, with IP anonymisation
              enabled where the tool offers it. We use the reports to see which pages people read
              and where they get stuck. We do not use them for advertising or to build profiles
              of named people.
            </p>
          </Section>

          <Section id="cookies" title="4. Cookies and similar storage">
            <table className="pp-table">
              <thead>
                <tr>
                  <th scope="col">Name</th>
                  <th scope="col">Set by</th>
                  <th scope="col">Purpose</th>
                  <th scope="col">Lasts</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><code>ep_geo</code></td>
                  <td>echopulse.media</td>
                  <td>
                    Stores your country and city as detected from your IP by the hosting platform,
                    so pages can show the right region without detecting it again. It holds no
                    identifier.
                  </td>
                  <td>30 days</td>
                </tr>
                <tr>
                  <td><code>_ga</code>, <code>_ga_*</code></td>
                  <td>Google Analytics</td>
                  <td>Tells repeat visits apart. Only set after you allow analytics.</td>
                  <td>Up to 2 years</td>
                </tr>
                <tr>
                  <td><code>_clck</code>, <code>_clsk</code></td>
                  <td>Microsoft Clarity</td>
                  <td>Links page views into one session for the recording. Only set after you allow analytics.</td>
                  <td>Up to 1 year</td>
                </tr>
                <tr>
                  <td>Cal.com cookies</td>
                  <td>Cal.com</td>
                  <td>Only set inside the booking window after you open it.</td>
                  <td>Per Cal.com&apos;s policy</td>
                </tr>
              </tbody>
            </table>
            <p>
              The showcase videos are streamed from Cloudinary. Playing one sends your IP address
              to Cloudinary, as any video host requires. No video plays until you press play.
            </p>
          </Section>

          <Section id="use" title="5. Why we use your data, and the legal basis">
            <ul>
              <li>
                <strong>To reply to you and deliver the work</strong> (performance of a contract, or
                steps you asked for before one). Forms, bookings, orders, onboarding, email.
              </li>
              <li>
                <strong>To run the business</strong> (legitimate interests). Keeping project records
                in Asana, getting a Slack alert when a form arrives, hosting the site securely,
                sending an order confirmation, keeping accounts.
              </li>
              <li>
                <strong>Analytics and session recording</strong> (legitimate interests, outside
                the UK and EEA only). Not used for UK or EEA visitors. You can opt out at any time
                as described above.
              </li>
              <li>
                <strong>Marketing email</strong> (consent, or an existing client relationship where
                the law allows). Every message has an unsubscribe link.
              </li>
              <li>
                <strong>Legal obligations.</strong> Tax and accounting records we are required to
                keep under Indian law.
              </li>
            </ul>
            <p>We do not sell personal data and we do not share it for cross-context behavioural advertising.</p>
          </Section>

          <Section id="payments" title="6. Payments">
            <p>
              Payments are taken by Razorpay or Dodo Payments, depending on how you check out. You
              enter your card details in their checkout, and they send us a confirmation that the
              payment succeeded along with your name, email and the amount. Your card number never
              reaches our servers and we cannot see it. Both processors are PCI DSS certified and
              have their own privacy policies.
            </p>
          </Section>

          <Section id="third" title="7. Who else sees your data">
            <p>
              We use a small set of tools to run the studio. Each one processes data on our
              instructions, under its own terms, and only for the job listed.
            </p>
            <table className="pp-table">
              <thead>
                <tr>
                  <th scope="col">Service</th>
                  <th scope="col">What it does for us</th>
                  <th scope="col">Where it runs</th>
                </tr>
              </thead>
              <tbody>
                {PROCESSORS.map((p) => (
                  <tr key={p.name}>
                    <td>{p.name}</td>
                    <td>{p.role}</td>
                    <td>{p.where}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p>
              We may also engage freelance editors or writers on a specific project. They see only
              the footage, brief and brand assets that project needs, under a confidentiality
              agreement. We will share data with a regulator, court or law enforcement if the law
              requires it, and with a buyer if the business is ever sold, in which case this policy
              still applies.
            </p>
          </Section>

          <Section id="transfers" title="8. International transfers">
            <p>
              We work from India, and most of the tools above run in the United States. If you are
              in the EU, the UK or Canada, your data leaves your region when you contact us. For
              EU and UK data we rely on the processors&apos; Standard Contractual Clauses (and the UK
              Addendum) and, where a US provider is certified, the EU-US Data Privacy Framework.
              For our own access from India we rely on the same Standard Contractual Clauses plus
              the technical measures below. Ask us if you want a copy of the clauses we rely on.
            </p>
          </Section>

          <Section id="retention" title="9. How long we keep it">
            <ul>
              <li><strong>Enquiries that do not become clients:</strong> 24 months after the last message, then deleted.</li>
              <li><strong>Client records</strong> (briefs, emails, task history): for the engagement plus 3 years, in case a question comes up.</li>
              <li><strong>Footage and project files:</strong> 90 days after final delivery, as stated in our <Link href="/terms">Terms</Link>, then deleted.</li>
              <li><strong>Invoices and payment records:</strong> for as long as Indian tax law requires, currently up to 8 years.</li>
              <li><strong>Analytics data:</strong> Google Analytics is set to 14-month retention. Clarity keeps recordings for 30 days and aggregate data for 13 months.</li>
              <li><strong>Server logs:</strong> rotated by the hosting provider, typically within 30 days.</li>
            </ul>
          </Section>

          <Section id="rights" title="10. Your rights">
            <p>
              Wherever you are, you can ask us what we hold about you, ask us to correct it, ask us
              to delete it, or object to how we use it. Email{' '}
              <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> and we will answer within 30
              days. We may ask you to confirm it is really you first. There is no charge.
            </p>
            <ul>
              <li>
                <strong>EU and UK (GDPR, UK GDPR):</strong> access, rectification, erasure,
                restriction, portability, objection, and the right to withdraw consent at any time.
                You can also complain to your local supervisory authority, or to the ICO in the UK.
              </li>
              <li>
                <strong>California (CCPA/CPRA):</strong> the right to know, delete and correct, and to
                opt out of sale or sharing. We do not sell or share personal information as the
                CPRA defines those terms, and we will not treat you differently for using your
                rights.
              </li>
              <li>
                <strong>Canada (PIPEDA):</strong> access and correction, and the right to withdraw
                consent subject to legal or contractual limits. You may complain to the Office of
                the Privacy Commissioner of Canada.
              </li>
              <li>
                <strong>Other US states</strong> with privacy laws: the same access, correction,
                deletion and opt-out rights apply, and we honour them regardless of state.
              </li>
            </ul>
            <p>
              <strong>Email you did not ask for.</strong> If we email you for marketing, the message
              will say who it is from and include a working unsubscribe link, as the CAN-SPAM Act
              and Canada&apos;s CASL require. Unsubscribes are processed within 10 business days,
              usually the same day. Replying &quot;unsubscribe&quot; works too.
            </p>
          </Section>

          <Section id="security" title="11. Security">
            <p>
              The site is served over HTTPS only. Form submissions are rate limited and validated
              before they reach our systems. Access to Asana, Slack, the mailbox and the payment
              dashboards is limited to the three of us. Footage
              is stored in shared folders with access limited to the people editing it. No system
              is perfectly secure, and if a breach affects you we will tell you without undue delay
              and, where the law requires it, within 72 hours.
            </p>
          </Section>

          <Section id="children" title="12. Children">
            <p>
              Our services are for businesses. The site is not aimed at anyone under 18 and we do
              not knowingly collect data from children. If you believe a child has sent us
              personal data, email us and we will delete it.
            </p>
          </Section>

          <Section id="changes" title="13. Changes to this policy">
            <p>
              When we change this page we update the date at the top. If a change affects how we
              use data you have already given us, we will email you before it takes effect. Older
              versions are available on request.
            </p>
          </Section>

          <Section id="contact" title="14. Contact">
            <p>
              Lakshya Soni, EchoPulse Media, Bhopal, Madhya Pradesh, India.
              <br />
              Email: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
            </p>
            <p>
              Related: <Link href="/terms">Terms of Service</Link>.
            </p>
          </Section>
        </div>

        <style>{`
          .pp-page { background: #F2EEE7; color: #0C0C0B; font-family: Inter, sans-serif; }
          .pp-hero, .pp-body { max-width: 860px; margin: 0 auto; padding: 0 24px; }
          .pp-page p, .pp-page li { line-height: 1.75; color: #4A4740; font-size: 16px; }
          .pp-page a { color: #0C0C0B; font-weight: 600; text-decoration: underline; text-decoration-color: #E8541A; text-underline-offset: 3px; }
          .pp-page a:hover { color: #E8541A; }
          .pp-page code { font-size: 14px; background: rgba(12,12,11,0.06); padding: 2px 6px; border-radius: 6px; }
          .pp-page strong { color: #0C0C0B; }

          .pp-hero { padding-top: 140px !important; padding-bottom: 40px !important; }
          .pp-crumb { display: flex; gap: 10px; font-size: 13px; color: #A8A49B; margin-bottom: 32px; }
          .pp-crumb a { color: #6E6B63; text-decoration: none; font-weight: 500; }
          .pp-crumb a:hover { color: #E8541A; }
          .pp-eyebrow { font-size: 10px !important; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: #A8A49B !important; margin: 0 0 12px; }
          .pp-h1 { font-size: clamp(34px, 5vw, 56px); font-weight: 900; letter-spacing: -0.04em; line-height: 1.05; margin: 0 0 14px; }
          .pp-meta { font-size: 13.5px !important; color: #A8A49B !important; margin: 0 0 24px; }
          .pp-lede { font-size: 18px !important; color: #2E2C28 !important; max-width: 700px; }

          .pp-body { padding-bottom: 128px !important; }
          .pp-section { padding: 36px 0; border-top: 1px solid rgba(12,12,11,0.08); scroll-margin-top: 96px; }
          .pp-h2 { font-size: 22px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 16px; }
          .pp-section p + p, .pp-section ul + p, .pp-section table + p, .pp-section p + table, .pp-section p + ul { margin-top: 14px; }
          .pp-section ul { padding-left: 20px; margin: 0; display: flex; flex-direction: column; gap: 10px; }

          .pp-table { width: 100%; border-collapse: collapse; text-align: left; font-size: 15px; }
          .pp-table th, .pp-table td { padding: 12px 12px 12px 0; border-bottom: 1px solid rgba(12,12,11,0.08); vertical-align: top; line-height: 1.55; color: #4A4740; }
          .pp-table th { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: #A8A49B; font-weight: 700; }
          .pp-table td:first-child { color: #0C0C0B; font-weight: 600; white-space: nowrap; }

          @media (max-width: 760px) {
            .pp-hero { padding-top: 110px !important; }
            .pp-table thead { display: none; }
            .pp-table, .pp-table tbody, .pp-table tr, .pp-table td { display: block; width: auto; }
            .pp-table tr { padding: 12px 0; border-bottom: 1px solid rgba(12,12,11,0.08); }
            .pp-table td { padding: 2px 0; border-bottom: none; }
            .pp-table td:first-child { white-space: normal; padding-bottom: 4px; }
          }
        `}</style>
      </main>

      <Footer />
    </>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="pp-section" aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} className="pp-h2">{title}</h2>
      {children}
    </section>
  );
}
