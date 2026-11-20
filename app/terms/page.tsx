import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import Nav from '@/components/Nav';

/**
 * /terms: the Terms of Service.
 *
 * Every promise these terms define is one the site already makes. Check the
 * source before changing a number here:
 *   - lib/pricing.ts: price ladder, PROMISES, Pilot scope, 14 days notice.
 *   - app/free-edits/page.tsx: 2 free edits, 48 hours, no card, keep the files.
 *   - components/ServicePageClient.tsx: 8/10 brief fidelity, "not delighted"
 *     promise, revisions until right, 14 days of free fixes after launch,
 *     Build Blueprint and Automation Audit at the Pilot price.
 *   - lib/serviceData.ts: code on the client's GitHub at launch.
 *   - app/privacy/page.tsx: processors, retention (90 days for footage,
 *     engagement plus 3 years for client records), transfers.
 *   - lib/dodo.ts and app/api/razorpay: Dodo Payments (merchant of record,
 *     international) and Razorpay (India) take payments.
 * If one of those changes, change the matching section here.
 *
 * The operator is Lakshya Soni, sole proprietor, trading as EchoPulse Media,
 * Bhopal, Madhya Pradesh, India. Do not add registrations, numbers or an
 * address that do not exist.
 */

const SITE_URL = 'https://echopulse.media';
const CONTACT_EMAIL = 'lakshyasoni2703@gmail.com';
const EFFECTIVE_DATE = '20 November 2026';
const LAST_UPDATED = '20 November 2026';
const LAST_UPDATED_ISO = '2026-11-20';

const TITLE = 'Terms of Service | EchoPulse Media';
const DESCRIPTION =
  'Terms for EchoPulse Media clients: plans, payment, revisions, ownership, data and disputes, with regional terms for the US, EU, UK, Canada, Australia and India.';

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/terms` },
  robots: { index: true, follow: true },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/terms`,
    siteName: 'EchoPulse Media',
    type: 'website',
  },
};

/** Section ids and headings, in order. The table of contents and the numbers come from here. */
const SECTIONS = [
  { id: 'who-we-are', title: 'Who we are' },
  { id: 'definitions', title: 'Definitions' },
  { id: 'businesses-and-consumers', title: 'Businesses and consumers' },
  { id: 'scope', title: 'Scope and statements of work' },
  { id: 'free-sample', title: 'The free sample' },
  { id: 'pilot', title: 'Pilot, Build Blueprint and Automation Audit' },
  { id: 'plans', title: 'Monthly plans, renewal and cancellation' },
  { id: 'builds', title: 'Fixed-price builds' },
  { id: 'payment', title: 'Payment' },
  { id: 'taxes', title: 'Taxes' },
  { id: 'revisions', title: 'Revisions and our promises' },
  { id: 'turnaround', title: 'Turnaround times' },
  { id: 'client-responsibilities', title: 'Your responsibilities' },
  { id: 'client-materials', title: 'Your materials and your promises about them' },
  { id: 'acceptable-use', title: 'Work we will not do' },
  { id: 'ownership', title: 'Ownership and licences' },
  { id: 'portfolio', title: 'Portfolio and case studies' },
  { id: 'ai-tools', title: 'Software and AI tools' },
  { id: 'confidentiality', title: 'Confidentiality' },
  { id: 'data-protection', title: 'Data protection' },
  { id: 'accounts', title: 'Your accounts and access' },
  { id: 'team', title: 'Our team and subcontractors' },
  { id: 'non-solicitation', title: 'Non-solicitation' },
  { id: 'results', title: 'No guaranteed results' },
  { id: 'warranties', title: 'Our warranties and disclaimers' },
  { id: 'fraud', title: 'Fraud and payment abuse' },
  { id: 'reviews', title: 'Reviews, public statements and our name' },
  { id: 'indemnities', title: 'Indemnities' },
  { id: 'liability', title: 'Limitation of liability' },
  { id: 'termination', title: 'Suspension and termination' },
  { id: 'after-termination', title: 'What happens when work ends' },
  { id: 'force-majeure', title: 'Events outside our control' },
  { id: 'regions', title: 'Clients in other countries' },
  { id: 'disputes', title: 'Governing law and disputes' },
  { id: 'changes', title: 'Changes to these terms' },
  { id: 'notices', title: 'Notices' },
  { id: 'general', title: 'General legal terms' },
  { id: 'contact', title: 'Contact' },
] as const;

type SectionId = (typeof SECTIONS)[number]['id'];

function num(id: SectionId): number {
  return SECTIONS.findIndex((s) => s.id === id) + 1;
}

export default function TermsPage() {
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/terms#webpage`,
        url: `${SITE_URL}/terms`,
        name: TITLE,
        description: DESCRIPTION,
        datePublished: LAST_UPDATED_ISO,
        dateModified: LAST_UPDATED_ISO,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: { '@id': `${SITE_URL}/#organization` },
        publisher: { '@id': `${SITE_URL}/#organization` },
        inLanguage: 'en',
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_URL}/terms#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Terms of Service', item: `${SITE_URL}/terms` },
        ],
      },
    ],
  };

  return (
    <>
    <Nav />
    {/* id="main" is the target of the layout's skip-to-content link. */}
    <main
      id="main"
      data-dark-bg="true"
      className="tm-main"
      style={{
        background: '#0C0C0B',
        color: '#F2EEE7',
        minHeight: '100vh',
      }}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <div style={{ maxWidth: '760px', margin: '0 auto' }}>
        <Link
          href="/"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            fontSize: '12px', fontWeight: 600,
            color: 'rgba(242,238,231,0.6)',
            textDecoration: 'none',
            marginBottom: '32px',
          }}
        >
          <ArrowLeft size={14} strokeWidth={2.4} />
          Back to EchoPulse
        </Link>

        <div className="terms-label" style={{
          fontSize: '10px', fontWeight: 700, letterSpacing: '4px',
          textTransform: 'uppercase', color: 'rgba(232,84,26,0.85)',
          marginBottom: '12px',
        }}>
          Legal
        </div>
        <h1 style={{
          fontFamily: 'Inter, sans-serif',
          fontSize: 'clamp(32px, 4vw, 52px)',
          fontWeight: 900,
          letterSpacing: '-1.4px',
          lineHeight: 1.04,
          margin: '0 0 14px',
        }}>
          Terms of Service
        </h1>
        <p style={{ fontSize: '13px', color: 'rgba(242,238,231,0.5)', margin: '0 0 4px' }}>
          Effective date: {EFFECTIVE_DATE}
        </p>
        <p style={{ fontSize: '13px', color: 'rgba(242,238,231,0.5)', margin: '0 0 32px' }}>
          Last updated: {LAST_UPDATED}
        </p>

        {/* The short version */}
        <div className="tm-box" style={{ padding: '24px 26px', background: 'rgba(232,84,26,0.07)', border: '1px solid rgba(232,84,26,0.25)', borderRadius: '14px' }}>
          <h2 className="terms-label" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#E8541A', margin: '0 0 10px' }}>The short version</h2>
          <p className="terms-body" style={{ fontSize: '14px', color: 'rgba(242,238,231,0.82)', lineHeight: 1.75, margin: 0 }}>
            EchoPulse Media is run by Lakshya Soni, a sole proprietor in Bhopal, India, and works mainly for
            businesses in the United States, Europe, the United Kingdom, Canada, Australia, India and elsewhere.
            You pay up front, monthly plans run month to month and end with 14 days notice, and we keep working
            on a deliverable at no extra charge until it matches the brief you gave us. Once a deliverable is
            delivered and paid for, it is yours; until then you may review it but not publish it, and the 2 free
            sample edits are yours from the moment we send them. We do not promise views, rankings or sales,
            and our liability is capped at what you paid us in the 3 months before a claim (or the project fee
            for a fixed-price build), except where the law does not allow a cap. Card fraud, false chargebacks,
            fake accounts and publishing unpaid work are treated as a serious breach, and we will contest them
            with our records. You are always free to post an honest review, good or bad, and we will never
            penalise you for it; false statements of fact and misuse of our name are a different matter. If
            something goes wrong, we talk first, then use a neutral mediator, then online arbitration in
            English. Nobody has to travel, and your local consumer rights still apply.
          </p>
        </div>

        {/* Table of contents */}
        <nav aria-labelledby="toc-heading" style={{ marginTop: '40px' }}>
          <h2 id="toc-heading" className="terms-label" style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: 'rgba(242,238,231,0.55)', margin: '0 0 14px' }}>Contents</h2>
          <ol className="tm-toc">
            {SECTIONS.map((s, i) => (
              <li key={s.id}>
                <a href={`#${s.id}`}><span className="tm-toc-n">{i + 1}.</span>{s.title}</a>
              </li>
            ))}
          </ol>
        </nav>

        <Section id="who-we-are">
          <p>
            EchoPulse Media (&quot;<strong>EchoPulse</strong>&quot;, &quot;<strong>we</strong>&quot;, &quot;<strong>us</strong>&quot;) is the trading name of
            Lakshya Soni, an individual operating as a sole proprietor in Bhopal, Madhya Pradesh, India. EchoPulse is
            not a company, partnership or LLP. When these terms say &quot;we&quot;, the legal party to your contract is
            Lakshya Soni, trading as EchoPulse Media. He works with a small team, including Shaurya (design) and Aiman
            (delivery), and with vetted freelancers.
          </p>
          <p>
            We produce video editing, LinkedIn ghostwriting, blog production, ad creatives, websites and funnels,
            automations, apps and software, and SEO and AI search work for clients in many countries.
          </p>
          <p>
            EchoPulse Media operates openly under its own name, with its founder named on this page. Anyone with a
            concern about us, client or not, can contact us directly at <Mail />.
          </p>
          <p>
            These terms (the &quot;<strong>Terms</strong>&quot;) apply to every paid or free service we provide. Please read
            them before you order. They are written to be fair to both sides and readable without a lawyer.
          </p>
        </Section>

        <Section id="definitions">
          <p>These words have the meanings below wherever they start with a capital letter.</p>
          <List>
            <li><strong>Client</strong> or <strong>you</strong>: the person or business that orders Services from us. If you order for a business, you confirm you are allowed to bind it, and &quot;you&quot; means that business.</li>
            <li><strong>Services</strong>: the work we do for you, including any of the eight services listed in <Ref id="who-we-are" />, strategy calls, audits and support.</li>
            <li><strong>Order</strong>: any purchase of Services: a monthly Plan, the Pilot, the Build Blueprint or Automation Audit, a Fixed-Price Build, an invoice, or a one-off order on the website.</li>
            <li><strong>Statement of Work</strong> or <strong>SOW</strong>: a written scope, proposal or quote we send you that describes the deliverables, price and dates for an Order. An email can be an SOW if it sets out those things and you accept it.</li>
            <li><strong>Plan</strong>: a monthly subscription, such as Presence Engine, Growth or a custom monthly plan.</li>
            <li><strong>Fixed-Price Build</strong>: a one-off project with a fixed price in an SOW, such as a website, funnel, automation stack, app or other software.</li>
            <li><strong>Free Sample</strong>: the 2 free edited short-form videos described on our <Link href="/free-edits">free edits page</Link>.</li>
            <li><strong>Deliverable</strong>: a finished output of the Services, such as an edited video, a written post or blog, a design, a website, an automation or software code. A Deliverable is <strong>Delivered</strong> when we send it to you or make it available to you (for example by link, upload, publication to your account, or a push to your code repository).</li>
            <li><strong>Client Materials</strong>: anything you or people acting for you give us: footage, audio, images, logos, brand assets, copy, data, access and instructions.</li>
            <li><strong>EchoPulse Materials</strong>: tools, templates, presets, workflows, prompts, scripts, internal code libraries, components, methods and know-how that we owned or developed before or outside your Order.</li>
            <li><strong>Third-Party Assets</strong>: material owned by someone else and used under licence, such as stock footage, music, sound effects, fonts, plugins, themes, open-source code, software services and the output of AI models.</li>
            <li><strong>Fees</strong>: the amounts payable for an Order.</li>
            <li><strong>Business Day</strong>: Monday to Friday, excluding public holidays in India.</li>
            <li><strong>Consumer</strong>: an individual buying mainly for personal purposes outside their trade, business, craft or profession, as defined by the consumer law that applies to them.</li>
            <li><strong>Agreement</strong>: these Terms together with your Order and any SOW.</li>
          </List>
        </Section>

        <Section id="businesses-and-consumers">
          <p>
            Our Services are designed for and sold to businesses: founders, sole traders, companies, creators who
            work professionally, and organisations. By ordering, you confirm that you are buying for business
            purposes unless you tell us in writing that you are a Consumer.
          </p>
          <p>If you are a Consumer:</p>
          <List>
            <li>Any rights that the consumer law of your country gives you, and that cannot be removed by contract, still apply. Nothing in these Terms excludes or limits them.</li>
            <li>Where these Terms say something applies &quot;to the extent the law allows&quot;, that wording protects your statutory rights.</li>
            <li>The extra protections in <Ref id="regions" /> (for example the 14-day cancellation right in the EU and UK) apply to you.</li>
            <li>You keep any right your local law gives you to bring a claim in the courts where you live (see <Ref id="disputes" />).</li>
          </List>
        </Section>

        <Section id="scope">
          <List>
            <li>What we will deliver is set by your Order: the plan description on our <Link href="/pricing">pricing page</Link> at the time you buy, or the SOW we agree with you. Anything not listed there is outside the scope of that Order.</li>
            <li>For anything bigger than a listed plan, we agree a written SOW before you pay. It states the deliverables, the price, the payment schedule and the target dates.</li>
            <li>If you want more than the Order covers, we will tell you before doing it, quote it, and only start once you agree. We never add charges you have not approved.</li>
            <li>Plan descriptions list monthly volumes (for example a number of edited videos or posts). Those are the maximum we owe in a month, not a minimum you must use.</li>
          </List>
        </Section>

        <Section id="free-sample">
          <p>The Free Sample is offered as described on the free edits page. In short:</p>
          <List>
            <li>We edit 2 short-form videos from footage you already have and aim to send them back within 48 hours of receiving the footage. No card and no call are required.</li>
            <li>There is no obligation on either side. You do not have to buy anything, and we do not have to accept every request.</li>
            <li>We may decline a request, for example if the footage is unusable, the content falls under <Ref id="acceptable-use" />, the request comes from a business that has already had a Free Sample, or we are at capacity. If we decline, we will tell you.</li>
            <li><strong>You keep the files whether or not you hire us.</strong> Once we send the 2 sample videos, they are yours to use, including commercially, on the same basis as a paid Deliverable under <Ref id="ownership" />, subject to any Third-Party Asset licences we tell you about.</li>
            <li>The Free Sample is one per business. Requesting several samples through different names, emails or accounts for the same business is covered by <Ref id="fraud" />.</li>
            <li>The other parts of these Terms that make sense for free work (your promises about your footage, acceptable use, confidentiality and data protection) apply to the Free Sample too.</li>
          </List>
        </Section>

        <Section id="pilot">
          <p>
            The <Link href="/pilot">Pilot</Link> is a one-off payment of USD 299 for 14 days of work on your brand. It covers the
            items listed on our pricing page when you buy (currently an onboarding strategy session, 6 short-form
            video edits, 2 static or carousel posts, 1 long-form blog, a content audit and a 30-day plan).
          </p>
          <List>
            <li>The 14 days start when your payment has cleared and we have what we need to begin (usually the onboarding session and your first footage). Days spent waiting on you do not count (see <Ref id="turnaround" />).</li>
            <li>Nothing recurs after the Pilot. A monthly Plan starts only if you choose one.</li>
            <li>You keep everything made in the Pilot, whether or not you continue.</li>
            <li>If the Pilot cannot be finished within 14 days because we are waiting on you, we will hold the remaining items open for 30 days from your payment. After that, items still waiting on your material lapse, unless we agree otherwise. If the delay is ours, we finish everything regardless of the date.</li>
          </List>
          <p>
            The <strong>Build Blueprint</strong> (for apps and software) and the <strong>Automation Audit</strong> (for
            automations) are one-off payments at the Pilot price. The Build Blueprint includes a scoping call, a written
            fixed-price scope with a delivery date, and clickable prototype direction within 14 days. The Automation
            Audit maps your lead flow, shows where leads go cold, and puts your first automation live within 14 days.
            You keep the written scope, blueprint or plan whether or not you continue. If a custom build is not right
            for your stage, we will say so in the Blueprint. A Blueprint is not a commitment by either side to the
            build it describes; the build starts only under a signed or accepted SOW.
          </p>
          <p>
            Because the Pilot, Build Blueprint and Automation Audit start straight away and are short, they are not
            refundable once the onboarding or scoping session has taken place, except under the promises in{' '}
            <Ref id="revisions" />, if we fail to deliver, or where the law gives you a right to a refund.
          </p>
        </Section>

        <Section id="plans">
          <List>
            <li><strong>Month to month.</strong> Plans have no minimum term and no exit fee. Each Plan is billed in advance on the same date each month and renews automatically until cancelled.</li>
            <li><strong>Cancelling.</strong> To cancel, send written notice (email is fine) at least 14 days before your next billing date. The Plan then ends at the end of the current paid month and you are not charged again. If you give less than 14 days notice, the Plan ends at the end of the following paid month.</li>
            <li><strong>Work in progress.</strong> The month you have paid for is not refunded, and we finish the work for it. Deliverables for that month that are in progress when the Plan ends are completed and Delivered.</li>
            <li><strong>Unused volume.</strong> If we fall short of a month&apos;s volume because of us, we make it up in the next month or, if the Plan has ended, deliver it after the end date. If volume is unused because we did not receive footage, feedback or approvals from you, it carries over for one month and then lapses.</li>
            <li><strong>Changing plans.</strong> You can move up or down a Plan from your next billing date. Ask us at least 7 days before that date.</li>
            <li><strong>Price changes.</strong> We will give you at least 30 days notice by email before changing the price of your Plan. The new price applies from the first billing date after the notice period, and you may cancel before then.</li>
            <li><strong>Refunds.</strong> Delivered work is not refunded, except under the promises in <Ref id="revisions" />, where we fail to deliver what you paid for, or where the law requires it. If we end a Plan without cause, we refund any part of the current month that we have not delivered.</li>
          </List>
        </Section>

        <Section id="builds">
          <p>These terms apply to websites, funnels, automation stacks, apps and other Fixed-Price Builds.</p>
          <List>
            <li><strong>Fixed price.</strong> The price, scope, milestones and target delivery date are set in the SOW before you pay. The price does not change unless you approve a change request.</li>
            <li><strong>Milestones and payment.</strong> Payments follow the schedule in the SOW. If the SOW does not set one, 50% is due before work starts and 50% on acceptance of the final milestone, before launch or handover.</li>
            <li><strong>Change requests.</strong> A change request is anything that adds to or changes the agreed scope, such as new pages, features, integrations or platforms, or a change to something you have already approved. We will tell you in writing whether a request is a change, its price and its effect on the timeline. Nothing is charged until you approve it. Fixing something that does not meet the SOW is never a change request.</li>
            <li><strong>Acceptance.</strong> When we deliver a milestone, you have 10 Business Days to test it and either accept it or tell us, in writing, what does not meet the SOW. We fix those points and redeliver, and the same process repeats. If you do not respond within the 10 Business Days, we will send you a reminder; if you still do not respond within 5 Business Days of the reminder, the milestone is treated as accepted. Using a Deliverable live in your business (for example launching the site or switching on the automation for real customers) also counts as acceptance of it, without affecting the fix period below.</li>
            <li><strong>Revisions during the build.</strong> Within the agreed scope, there is no cap on revision rounds before acceptance, as stated on our service pages. The build is done when you accept it under the process above.</li>
            <li><strong>Free fixes after launch.</strong> For 14 days after launch or handover, we fix free of charge any bug or defect that stops the Deliverable working as the SOW describes. Some service pages also describe a longer monitoring period (for example 30 days of performance monitoring for websites and automations); that monitoring is part of the Order where stated. After the fix period, further fixes and changes are quoted or billed at the rate we agree with you. The fix period does not cover problems caused by changes made by someone other than us, by Third-Party Assets or platform changes, or by your hosting or accounts.</li>
            <li><strong>Hosting and accounts.</strong> We build in accounts you own wherever we can: your hosting, domain, code repository and software subscriptions are in your name and paid by you directly. We do not host your product on our own account unless the SOW says so.</li>
            <li><strong>Handover.</strong> On launch, and once the build is paid in full, we transfer the code to your code repository (for example GitHub), give you the documentation and a walkthrough, and hand back or transfer any credentials we created for the project. Ownership passes as set out in <Ref id="ownership" />.</li>
          </List>
        </Section>

        <Section id="payment">
          <List>
            <li><strong>Currency.</strong> Prices are in US dollars and the same worldwide unless your Order or SOW says otherwise. Your bank or card issuer converts at its own rate and may charge a fee. Clients in India may be charged in Indian rupees.</li>
            <li><strong>How payments are taken.</strong> Card payments are processed by Razorpay (mainly for India) or Dodo Payments (for clients outside India). We never see your full card details. Bank transfer is available on request against an invoice.</li>
            <li><strong>Pay before work.</strong> Plans, the Pilot, the Build Blueprint, the Automation Audit and one-off orders are paid in advance. For Fixed-Price Builds, each milestone payment is due on the date in the SOW. Work starts when payment has cleared.</li>
            <li><strong>Invoices.</strong> Invoices sent for bank transfer are due within 7 days of the invoice date unless the invoice states otherwise.</li>
            <li><strong>Late payment.</strong> If an amount is not paid when due, we will send a reminder. Overdue amounts carry simple interest of 1% per month from the due date until paid, or the maximum rate allowed by law if that is lower. If a statute in your country gives a business creditor a different rate or fixed recovery amount, we may claim that instead, but never both. We do not charge any other late fee.</li>
            <li><strong>Suspension.</strong> If an amount is still unpaid 7 days after our written reminder, we may pause work until it is paid. We will tell you before we pause. Delivery dates move by the length of the pause.</li>
            <li><strong>Chargebacks.</strong> If you have a problem with a charge, please contact us first: most issues are fixed within days. Filing a chargeback or payment dispute without first contacting us and giving us a reasonable chance (at least 10 Business Days) to resolve it is a breach of these Terms. A chargeback is not a way to get a refund for work that was Delivered and accepted, or that you have published or used. This does not affect your right to dispute a charge you did not authorise, or a charge for work we did not deliver. See also <Ref id="fraud" />.</li>
          </List>
        </Section>

        <Section id="taxes">
          <List>
            <li>Prices exclude taxes such as VAT, GST and sales tax. Any tax that applies is added to the price or shown at checkout.</li>
            <li><strong>Payments through Dodo Payments.</strong> For clients outside India, Dodo Payments acts as the merchant of record for the payment. It calculates and collects any VAT, GST or sales tax due in your country at checkout under its own terms, and the amount you are charged may include that tax.</li>
            <li><strong>Reverse charge.</strong> Where you pay us directly as a business and the reverse-charge rules of your country apply (for example VAT in the EU or UK, or GST in Australia), you are responsible for accounting for that tax. Give us your tax number if you want it on the invoice.</li>
            <li><strong>United States.</strong> Any sales or use tax that applies to your purchase in your state is your responsibility, unless collected at checkout.</li>
            <li><strong>India.</strong> Clients in India are charged GST at the applicable rate where EchoPulse is registered for or required to charge GST, shown separately on the invoice. Services supplied to clients outside India are generally treated as an export of services under Indian GST law when the legal conditions are met.</li>
            <li><strong>Withholding.</strong> If the law requires you to withhold tax from a payment to us, tell us before paying and send us the official withholding certificate or receipt promptly so we can claim the credit.</li>
          </List>
        </Section>

        <Section id="revisions">
          <p>Our site makes several promises about revisions. This section says exactly what they mean.</p>
          <List>
            <li><strong>&quot;Revised until right&quot;, &quot;re-done until you would ship it under your own name&quot;.</strong> For each Deliverable, we will keep revising, at no extra charge and with no cap on rounds, until it meets the brief and scope agreed for that Deliverable and you are willing to publish it under your name. This is a promise to bring the Deliverable to the agreed brief, not a promise to produce unlimited new work.</li>
            <li><strong>8 out of 10 brief fidelity.</strong> For content Deliverables, we score each piece against your brand brief before we send it. If it scores below 8 out of 10, we rewrite it at no charge before you see it. If you show us that a Delivered piece misses the brief, we rewrite it at no charge.</li>
            <li><strong>&quot;If you are not delighted, you do not pay for the rework.&quot;</strong> Any rework needed to bring a Deliverable to the agreed brief is never invoiced. If, after good-faith attempts, we cannot produce a version of a Deliverable that you are willing to use, you may ask us to replace it with a different piece of the same kind, or to credit it against your next month. If there is no next month, we refund the part of the Fee for that Deliverable.</li>
            <li><strong>What counts as a new request.</strong> These are new work, not a revision: a change to the brief, topic, angle or creative direction after you approved it (for example after you approved an outline, script, concept or design direction); new or different footage or source material; a different length, format, aspect ratio or platform; additional Deliverables; and features or pages not in the SOW. New work is counted against your Plan volume or quoted separately, and we always tell you which before starting.</li>
            <li><strong>How to ask.</strong> Please send revision notes for a Deliverable together, in writing, and be specific about what to change. Revision requests should reach us within 14 days of delivery. After that, the Deliverable is treated as approved, but we will still fix any genuine error we made.</li>
            <li><strong>Who decides.</strong> If we disagree about whether something is a revision or a new request, we will explain our view in writing and look for a fair answer. If we still disagree, the dispute process in <Ref id="disputes" /> applies.</li>
          </List>
        </Section>

        <Section id="turnaround">
          <List>
            <li>Turnaround times on our site, such as 48 hours for short-form edits, 14 days for the Pilot or 10 to 14 Business Days for an automation stack, are targets we work hard to meet, not guarantees. Fixed-Price Build dates are the target dates in the SOW.</li>
            <li>The clock starts when payment has cleared and we have everything we reasonably need: footage, brief, access and answers to our questions.</li>
            <li>The clock pauses while we are waiting on you, for example for footage, feedback, approvals, access, content or payment, and restarts when we receive it.</li>
            <li>If we expect to miss a target for a reason on our side, we will tell you as early as we can, with a new date. If we repeatedly miss targets on a monthly Plan, you may cancel with immediate effect and we will refund the undelivered part of the current month.</li>
          </List>
        </Section>

        <Section id="client-responsibilities">
          <p>To get good work on time, we need you to:</p>
          <List>
            <li>give us an accurate brief and tell us about any legal, regulatory or brand rules that apply to your content;</li>
            <li>send footage, materials, feedback and approvals promptly, and name one person who can approve work;</li>
            <li>give us the access we need (see <Ref id="accounts" />) and keep your own account security in place;</li>
            <li>check Deliverables before you publish them, including facts, prices, offers and any claims about your business, since you know your business best;</li>
            <li>make sure your use and publication of Deliverables complies with the law and the rules of the platforms you publish on; and</li>
            <li>treat our team with respect. We will do the same.</li>
          </List>
        </Section>

        <Section id="client-materials">
          <p>When you send us Client Materials, you promise that:</p>
          <List>
            <li>you own them, or have all the rights, licences and permissions needed for us to use them to produce the Deliverables, and for you to publish the Deliverables where you plan to;</li>
            <li>you have the consent of every identifiable person who appears in them (including employees, clients and members of the public) to be filmed, recorded or named and for the result to be published, and any release your local law requires;</li>
            <li>any music, logos, trademarks, images, fonts or other third-party material in them is licensed for the use you intend;</li>
            <li>any personal data in them was collected lawfully and you are allowed to share it with us for this purpose; and</li>
            <li>they are not unlawful, defamatory, or infringing, and were not obtained unlawfully.</li>
          </List>
          <p>
            You remain the owner of your Client Materials at all times. You give us a non-exclusive licence to use them
            only to provide the Services to you, and for portfolio use under <Ref id="portfolio" /> to the extent they
            appear in a Deliverable. Claims caused by Client Materials are covered by your indemnity in{' '}
            <Ref id="indemnities" />.
          </p>
        </Section>

        <Section id="acceptable-use">
          <p>We may refuse, pause or stop work on any request that, acting reasonably, we believe:</p>
          <List>
            <li>is unlawful, or promotes illegal goods, services or activity;</li>
            <li>is hateful, harassing, or encourages violence or discrimination against any person or group;</li>
            <li>is sexually explicit, or involves minors in any inappropriate way;</li>
            <li>is false, misleading or deceptive, including fake reviews, fake testimonials or impersonation;</li>
            <li>makes health, medical, financial, income or investment claims that you cannot substantiate with evidence, or that require a professional qualification or regulatory approval you do not have;</li>
            <li>infringes someone else&apos;s copyright, trademark, privacy or publicity rights, or defames anyone; or</li>
            <li>breaks the rules of the platform it is meant for, such as YouTube, Meta, TikTok, LinkedIn, X or Google.</li>
          </List>
          <p>
            We will tell you why and, where possible, suggest a change that would let us continue. If we refuse an
            Order on these grounds after you have paid, we refund the part of the Fee for work we have not done.
          </p>
        </Section>

        <Section id="ownership">
          <List>
            <li><strong>Your Client Materials</strong>, including raw footage, always remain yours.</li>
            <li><strong>Final Deliverables become yours once Delivered and paid for in full.</strong> At that moment, we assign to you, worldwide and for the full term of protection, all rights we hold in the final Deliverable, including copyright, for all media and uses: the edited video, the written content, the designs, the website and the code built for you. If an assignment is not possible under the law of your country, we instead grant you an exclusive, perpetual, worldwide, royalty-free licence to use, change and exploit it in any way. To the extent the law allows, we waive any moral rights in the final Deliverable, or agree not to assert them.</li>
            <li><strong>Before full payment</strong>, we keep ownership of the Deliverable. You have a limited licence to review it and give feedback only. Unpaid work must not be published, launched, used in ads, or shared outside your business. If an Order is paid in instalments, rights in a Deliverable pass when the instalment that covers it is paid, or, for a Fixed-Price Build, when the build is paid in full.</li>
            <li><strong>Working files.</strong> The final Deliverable is the finished output (for example the exported video, the final text, the deployed site and its source code). Project files such as editing timelines and design source files are not included unless your Order or SOW says so; we will provide them on request where we reasonably can.</li>
            <li><strong>EchoPulse Materials</strong> stay ours. To the extent any EchoPulse Materials are embedded in a Deliverable you have paid for, we grant you a perpetual, worldwide, royalty-free, non-exclusive licence to use, copy and modify them as part of that Deliverable. You may not extract and resell them on their own.</li>
            <li><strong>Third-Party Assets</strong> are licensed by their owners, not by us. We pass on to you the licence that applies, and tell you about any limits that matter to your use (for example music cleared only for certain platforms). Third-Party Assets we already hold under licences that cover your use are included in the Fee. Any paid licence bought specifically for your project, such as premium stock, a font licence for your website, a paid plugin or theme, or a paid software service, is paid by you, and we will ask you before buying it. Open-source code remains under its own licence, and we will tell you if a licence places obligations on how you distribute your software.</li>
            <li><strong>AI-generated elements.</strong> In some countries, material generated by AI tools without enough human creative input may not be protected by copyright. We assign whatever rights we hold in it, but cannot promise that it is protected.</li>
          </List>
        </Section>

        <Section id="portfolio">
          <List>
            <li>We may show Deliverables we made for you in our portfolio, case studies, showreel, website and social media, and name you as a client, unless you opt out in writing at any time. If you opt out, we stop new uses and remove the work from our website and channels within 14 days.</li>
            <li>We never show confidential material, unreleased work before you publish it, or anything you have asked us to keep private.</li>
            <li>Before publishing a case study that includes your results or numbers, we will ask for your approval.</li>
          </List>
        </Section>

        <Section id="ai-tools">
          <List>
            <li>We use professional software and AI tools in production, for example for transcription, captions, rough cuts, research, drafting, design and coding assistance. A person on our team directs and reviews every Deliverable before you see it.</li>
            <li>We do not use your Client Materials to train our own AI models, and we do not offer them to anyone else for training. Where an AI tool we use offers a setting or plan that stops the provider training its models on what we put in, we use it. We will not put your confidential material into a tool that trains on it.</li>
            <li>If you prefer that AI tools are not used on some or all of your work, tell us before we start. We will tell you if that changes the price or timeline.</li>
            <li>The tools we use to run the business and handle personal data are listed on our <Link href="/privacy">Privacy Policy</Link>.</li>
          </List>
        </Section>

        <Section id="confidentiality">
          <List>
            <li>Each side will keep the other&apos;s Confidential Information private and use it only for the Services. <strong>Confidential Information</strong> means non-public information shared in connection with the Services that a reasonable person would understand to be confidential, such as business plans, unreleased content, customer data, pricing, code and credentials.</li>
            <li>Each side may share Confidential Information only with people who need it for the Services (for us, our team members and contractors) and who are bound by similar confidentiality duties.</li>
            <li>This does not cover information that is or becomes public without a breach, that the receiving side already had or developed independently, or that it received lawfully from someone else. Either side may disclose information where the law, a court or a regulator requires, giving notice to the other where allowed.</li>
            <li>These duties last for 3 years after the last Services are delivered. For trade secrets and personal data, they last for as long as the information remains a trade secret or personal data.</li>
          </List>
        </Section>

        <Section id="data-protection">
          <List>
            <li>How we handle personal data about you as a client, and about visitors to our website, is described in our <Link href="/privacy">Privacy Policy</Link>.</li>
            <li>Where we handle personal data on your behalf as part of the Services (for example people appearing in your footage, your leads in an automation, or customer data in an app we build), you are the controller (or business) and we act as your processor (or service provider). We process that data only on your documented instructions and to provide the Services, keep it secure, make sure anyone who handles it is bound by confidentiality, help you respond to requests from individuals, tell you without undue delay about a personal data breach, and delete or return it when the Services end.</li>
            <li>A data processing addendum (&quot;<strong>DPA</strong>&quot;) is available on request at no charge. Regional details are in <Ref id="regions" />.</li>
          </List>
        </Section>

        <Section id="accounts">
          <List>
            <li>Your accounts (social media, advertising, website hosting, domain, code repository, CRM, email and others) remain yours at all times.</li>
            <li>Please give us access through the platform&apos;s own user or role system wherever possible, rather than sharing your password. We use the access only for the Services and keep any credentials secure.</li>
            <li>We do not change account ownership, billing details or security settings without your permission.</li>
            <li>When the Services end, or when you ask, we return or hand over access, give you any credentials we created for you, and stop using the access. You should then remove our access and change any shared passwords.</li>
            <li>We are not responsible for actions taken by platforms on your accounts (such as suspensions or reach changes) unless caused by our breach of these Terms.</li>
          </List>
        </Section>

        <Section id="team">
          <List>
            <li>We may use our team members and vetted freelance contractors to provide the Services. Everyone who works on your project is bound by confidentiality duties and sees only what the work needs.</li>
            <li>We remain responsible to you for their work as if it were our own.</li>
          </List>
        </Section>

        <Section id="non-solicitation">
          <p>
            While we work together and for 12 months after, please do not directly approach any member of our team or
            any contractor who worked on your project to hire or engage them, whether as an employee or freelancer,
            without first talking to us. This does not stop you hiring someone who answers a public job advertisement
            or approaches you on their own. We make the same promise about your staff who worked with us. This clause
            applies only to the extent the law of the relevant country allows it.
          </p>
        </Section>

        <Section id="results">
          <List>
            <li>We commit to the work: the Deliverables, the turnaround targets and the revisions. We do not guarantee any particular outcome, including views, reach, followers, engagement, leads, sales, revenue, search rankings, AI search citations, ad performance or return on investment.</li>
            <li>Results depend on things outside our control, including your offer, your market, your budget, and the platforms themselves. Google, Meta, LinkedIn, TikTok, YouTube and AI search tools change their algorithms and policies without notice.</li>
            <li>Results shown on our site and in case studies are what happened for that client. They are not a promise or a forecast for you.</li>
          </List>
        </Section>

        <Section id="warranties">
          <p>We promise that:</p>
          <List>
            <li>we will perform the Services with reasonable skill and care, in line with good industry practice;</li>
            <li>the Deliverables will materially match the Order or SOW;</li>
            <li>to our knowledge, material we create for you (excluding Client Materials and Third-Party Assets) will not infringe anyone else&apos;s intellectual property rights; and</li>
            <li>we will comply with the laws that apply to us in providing the Services.</li>
          </List>
          <p>
            Except for these promises, the promises in <Ref id="revisions" />, and any guarantee the law gives you that
            cannot be excluded, we do not give other warranties, for example that software will be completely free of
            bugs or that a Deliverable will suit a purpose you did not tell us about. Each side confirms it has the
            right to enter into this Agreement.
          </p>
        </Section>

        <Section id="fraud">
          <List>
            <li><strong>Verification.</strong> Before starting or delivering work, we may ask you to confirm your identity, your business details or your payment method, for example where a payment looks unusual. We may pause or decline work until we can verify these. We will only ask for what is reasonable and will handle it as described in our Privacy Policy.</li>
            <li><strong>What we treat as fraud.</strong> The following are fraud and a material breach of these Terms: paying with a stolen or unauthorised card or account; using a false identity or false business details; sending fake proof of payment; receiving work and then filing a chargeback or &quot;item not received&quot; claim that you know is false; requesting repeated Free Samples through fake or multiple accounts; and reselling, publishing or using work that has not been paid for.</li>
            <li><strong>What we may do.</strong> If we reasonably believe fraud has taken place, we may immediately suspend or cancel the affected Orders, withhold Deliverables that have not been paid for, and end the review licence for any unpaid Deliverable (so it may not be used at all). We may recover the amounts owed, plus reasonable collection costs where the law allows. We do not charge penalties or fixed fraud fees.</li>
            <li><strong>Our records.</strong> You agree that we may keep and use our records of the work, including briefs, messages, files, delivery and download logs, approvals and payment records, as evidence to contest chargebacks and payment disputes and to defend our legal rights, for as long as needed to resolve the matter.</li>
            <li><strong>Reporting.</strong> We may report suspected fraud to payment providers, card networks, the platforms involved and law enforcement.</li>
            <li>None of this affects your right to dispute a charge you genuinely did not authorise, or a charge for work we did not deliver.</li>
          </List>
        </Section>

        <Section id="reviews">
          <p>
            This section is in two parts. The first is our policy for everyone, client or not. The second is a term of
            our contract with clients.
          </p>
          <p><strong>Our policy for everyone</strong></p>
          <List>
            <li><strong>Honest reviews are welcome.</strong> Anyone, including clients and former clients, is free to post honest reviews, opinions and experiences of EchoPulse, including negative ones. We will never punish, penalise, charge, sue or threaten anyone for an honest review or opinion. These Terms contain no non-disparagement clause and no fee or penalty connected with reviews.</li>
            <li><strong>False statements are different.</strong> Statements of fact that are false and harm our reputation are not protected by this policy. Examples include falsely stating that EchoPulse is a scam or committed fraud, posting fake reviews, impersonating EchoPulse or any member of our team, and using our name, logo or work in a misleading way.</li>
            <li><strong>Our legal rights.</strong> Where that happens, we may ask for a correction or removal, send a legal notice, file takedown requests with platforms and hosts (including copyright notices, such as notices under the US Digital Millennium Copyright Act, for our work used without payment or permission), and pursue remedies for defamation, infringement or other claims in a court with jurisdiction. These rights come from the law, not from these Terms. This section reserves them; it does not create any new penalty.</li>
          </List>
          <p><strong>For clients</strong></p>
          <List>
            <li>If you have a problem with our work, we ask that you raise it with us first, using the first step in <Ref id="disputes" />, so we have a chance to fix it. This is a request, not a condition: it does not stop you posting an honest review at any time, and nothing in these Terms prevents you from doing so.</li>
            <li>Using our name, logo or Deliverables you have not paid for is covered by <Ref id="ownership" /> and <Ref id="fraud" />.</li>
          </List>
        </Section>

        <Section id="indemnities">
          <p>An indemnity is a promise to cover the other side&apos;s losses if a third party makes a claim. Ours are mutual and limited to what each side controls.</p>
          <List>
            <li><strong>You cover us</strong> against third-party claims, and the reasonable costs and losses that result, to the extent they are caused by: your Client Materials; claims about your products or services that you asked us to include or approved; your publication or use of Deliverables in breach of the law or platform rules; or your breach of <Ref id="client-materials" /> or <Ref id="acceptable-use" />.</li>
            <li><strong>We cover you</strong> against third-party claims, and the reasonable costs and losses that result, that a Deliverable as we Delivered it infringes someone&apos;s intellectual property rights, to the extent the claim is caused by material we created. This does not cover Client Materials, Third-Party Assets used within their licence terms, changes made by anyone other than us, or use of the Deliverable in a way the Agreement did not contemplate. If such a claim is made, we may, at our choice, get you the right to keep using the Deliverable, change it so it no longer infringes, or, if neither is reasonably possible, refund the Fee for that Deliverable.</li>
            <li><strong>How it works.</strong> The side asking to be covered must tell the other promptly in writing, let it control the defence and any settlement (no settlement may admit fault for the covered side without its consent), and give reasonable help at the other side&apos;s cost.</li>
            <li><strong>Limit.</strong> Each side&apos;s total liability under these indemnities is limited to the Fees paid and payable under the Agreement in the 12 months before the claim, except where the claim results from that side&apos;s fraud or deliberate wrongdoing.</li>
          </List>
        </Section>

        <Section id="liability">
          <List>
            <li><strong>No indirect losses.</strong> Neither side is liable to the other for indirect or consequential loss, or for loss of profit, revenue, business, goodwill, opportunity or data, or for loss of views, followers or engagement, whether arising in contract, negligence or otherwise.</li>
            <li><strong>Cap.</strong> Each side&apos;s total liability arising from or connected with the Agreement is limited to the Fees paid and payable by you in the 3 months before the event that gave rise to the claim or, for a claim about a Fixed-Price Build, the total Fee for that build.</li>
            <li><strong>Not limited.</strong> Nothing in these Terms limits or excludes: your obligation to pay Fees properly due; liability for fraud or fraudulent misrepresentation; liability for death or personal injury caused by negligence; the separate indemnity limit in <Ref id="indemnities" />; or any other liability that cannot be limited or excluded by law.</li>
            <li><strong>Consumers and mandatory law.</strong> If you are a Consumer, or if the law that applies to you does not allow a limit, these limits apply only as far as the law allows.</li>
            <li><strong>Back-ups.</strong> We keep project files for the period in <Ref id="after-termination" />. Please keep your own copies of your Client Materials and Deliverables.</li>
          </List>
        </Section>

        <Section id="termination">
          <List>
            <li><strong>Material breach.</strong> Either side may end the Agreement, or an Order, by written notice if the other side materially breaches it and does not fix the breach within 14 days of receiving written notice describing it.</li>
            <li><strong>Immediate termination.</strong> We may end the Agreement or an Order immediately by written notice if: an amount remains unpaid 7 days after our written reminder; continuing would require us to break the law; you or someone acting for you abuses, threatens or harasses our team; or <Ref id="fraud" /> applies. You may end the Agreement immediately if we break the law in providing the Services or if we become unable to continue the business.</li>
            <li><strong>Ending a Plan.</strong> You can always end a Plan with 14 days notice under <Ref id="plans" />. We may also end a Plan without giving a reason by giving you 30 days written notice; we then refund any prepaid Fees for work not yet delivered.</li>
            <li><strong>Ending a Fixed-Price Build early.</strong> You may end a build at any time by written notice. You then pay for the work done up to that date: completed milestones in full, and the milestone in progress in proportion to the work done on it. If we end a build without cause, we refund what you have paid for work not done.</li>
          </List>
        </Section>

        <Section id="after-termination">
          <List>
            <li>You pay for work done up to the end date, as set out above. Prepaid Fees for work we did not do are refunded where these Terms say so.</li>
            <li>We hand over all paid Deliverables, including any in progress that we finish under <Ref id="plans" />, and return access to your accounts under <Ref id="accounts" />.</li>
            <li>Deliverables not paid for stay ours and may not be used, and the review licence for them ends.</li>
            <li>We keep footage and project files for 90 days after final delivery, as our Privacy Policy states, and then delete them. Please download anything you need within that time. We keep business records, such as invoices, briefs and messages, for as long as the law and our Privacy Policy allow, and personal data we process for you is deleted or returned under <Ref id="data-protection" />.</li>
            <li>Sections that by their nature should continue after the end continue, as set out in <Ref id="general" />.</li>
          </List>
        </Section>

        <Section id="force-majeure">
          <p>
            Neither side is liable for a delay or failure caused by events outside its reasonable control, such as
            natural disasters, war, civil unrest, government action, epidemics, widespread internet, power or platform
            outages, or attacks on systems we rely on. The affected side must tell the other promptly and do what it
            reasonably can to limit the effect. If the event lasts more than 30 days, either side may end the affected
            Order by notice, and we refund prepaid Fees for work not done. This does not excuse paying for work already
            delivered.
          </p>
        </Section>

        <Section id="regions">
          <p>
            We work with clients in the United States, the European Union, the United Kingdom, Canada, Australia, India
            and elsewhere. The terms below apply in addition to the rest of these Terms for clients in those places. If
            the law of your country gives you mandatory protections, especially as a Consumer, those protections always
            apply and are never excluded by these Terms.
          </p>
          <h3 className="tm-h3">European Union and United Kingdom</h3>
          <List>
            <li><strong>Data protection.</strong> Where we handle personal data on your behalf, we act as your processor under the GDPR and the UK GDPR, and the terms in <Ref id="data-protection" /> apply as processor terms under Article 28. Our DPA is available on request. Because we work from India, transfers of personal data from the EEA are covered by the European Commission&apos;s Standard Contractual Clauses, and transfers from the UK by the UK International Data Transfer Agreement or the UK Addendum to those clauses.</li>
            <li><strong>Consumers: 14-day cancellation right.</strong> If you are a Consumer in the EU or UK, you may cancel an Order within 14 days of the day the contract was made, without giving a reason, by telling us clearly (an email is enough). We refund you within 14 days, using the same payment method.</li>
            <li><strong>If you ask us to start straight away.</strong> If you ask us to start work during the 14 days and then cancel, you pay a proportionate amount for the work done up to the time you tell us you are cancelling. If we have fully completed the service within the 14 days at your express request, and you acknowledged that you would lose the cancellation right once it was completed, the right no longer applies. For digital content supplied immediately with your express consent and acknowledgement, the right ends when supply begins.</li>
            <li><strong>Business clients</strong> in the EU and UK do not have this cancellation right, but keep any rights the law gives businesses that cannot be excluded.</li>
          </List>
          <h3 className="tm-h3">United States</h3>
          <List>
            <li><strong>Buying as a business.</strong> US clients confirm they are buying for business purposes.</li>
            <li><strong>Service provider.</strong> Where we receive personal information from you to provide the Services, we act as your service provider (or contractor) under the California Consumer Privacy Act as amended by the CPRA, and similar state laws. We process it only for the business purposes in the Agreement; we do not sell it or share it for cross-context behavioural advertising; we do not keep, use or disclose it outside our direct business relationship with you, or combine it with personal information from other sources except as those laws allow; we give it the same level of protection those laws require; and we will tell you if we can no longer meet these obligations. You may take reasonable steps to stop and fix any unauthorised use.</li>
            <li><strong>Sales tax</strong> is covered in <Ref id="taxes" />.</li>
          </List>
          <h3 className="tm-h3">Canada</h3>
          <List>
            <li>We handle personal information in line with the Personal Information Protection and Electronic Documents Act (PIPEDA), and, for clients in Quebec, the Act respecting the protection of personal information in the private sector as amended by Law 25. Where we process personal information for you, we act as your service provider and protect it as described in <Ref id="data-protection" />.</li>
            <li>Consumers in Quebec keep all rights under the Quebec Consumer Protection Act, including the right to go to court rather than arbitration. If you are in Quebec and would like these Terms in French, please ask us.</li>
          </List>
          <h3 className="tm-h3">Australia</h3>
          <List>
            <li>Our Services come with guarantees that cannot be excluded under the Australian Consumer Law. Nothing in these Terms excludes, restricts or changes those guarantees or your rights under them.</li>
            <li>Where the law allows us to limit our liability for a failure to meet a guarantee (for example for services not of a kind ordinarily acquired for personal or household use), our liability is limited, at our choice, to supplying the services again or paying the cost of having them supplied again. Any other limit in these Terms applies only as far as the law allows.</li>
          </List>
          <h3 className="tm-h3">India</h3>
          <List>
            <li>These Terms are governed by Indian law (see <Ref id="disputes" />).</li>
            <li>GST is covered in <Ref id="taxes" />.</li>
            <li>Consumers in India keep their rights under the Consumer Protection Act, 2019, including the right to file a complaint with the consumer commission where they live or work.</li>
          </List>
          <h3 className="tm-h3">Everywhere else</h3>
          <p>The same principle applies: any mandatory protection your local law gives you remains in place.</p>
        </Section>

        <Section id="disputes">
          <p>
            We want disputes to be rare, quick and cheap for both sides, wherever you are. Here is how we handle them.
          </p>
          <ol className="tm-steps">
            <li>
              <strong>Step 1: talk to us.</strong> Email <Mail /> with what went wrong and what you would like us to
              do. We reply within 2 Business Days, and both sides then try in good faith to resolve it for 30 days.
              Most issues are fixed here, for example through revisions or the refunds our promises cover.
            </li>
            <li>
              <strong>Step 2: online mediation.</strong> If Step 1 does not resolve it, either side may propose a
              neutral mediator. Mediation takes place by video call, in English, and its costs are shared equally.
              Nothing said in mediation is binding unless both sides agree to it in writing.
            </li>
            <li>
              <strong>Step 3: online arbitration.</strong> If the dispute is still not resolved 30 days after either
              side proposed mediation (or if the other side declines mediation), either side may refer it to final
              arbitration by a single neutral arbitrator, agreed by both sides or, if we cannot agree, appointed under
              the Arbitration and Conciliation Act, 1996. The arbitration is in English, with hearings by video and
              documents exchanged by email, so nobody has to travel to India. The legal seat is Bhopal, India, which
              means Indian arbitration law governs the process. Each side pays its own lawyers unless the arbitrator
              decides otherwise.
            </li>
          </ol>
          <p>
            <strong>Why this works for both sides.</strong> India is a party to the New York Convention, like the
            United States, the United Kingdom, the EU countries, Canada and Australia. That means an arbitration award
            can be enforced in your country as well as in India, so the result is real and final for both of us.
          </p>
          <p>
            <strong>Governing law.</strong> These Terms and any dispute about them are governed by the laws of India.
            If you are a Consumer, this does not take away the protection of the mandatory consumer laws of the country
            where you live.
          </p>
          <p><strong>When a court can be used.</strong> Despite the steps above:</p>
          <List>
            <li>either side may ask a court with jurisdiction for urgent interim relief, for example to stop unpaid work being published or confidential information being disclosed, and to enforce an arbitration award;</li>
            <li>either side may go to a court with jurisdiction to collect an invoice that is not disputed;</li>
            <li>Consumers keep any right their local law gives them to bring a claim in the courts where they live, and to use their local consumer bodies; and</li>
            <li>nothing here removes any right that the law of your country makes mandatory, including in the EU, the UK and Australia.</li>
          </List>
          <p>To the extent the law allows, disputes are resolved individually and not as class or representative actions.</p>
        </Section>

        <Section id="changes">
          <List>
            <li>We may update these Terms, for example when our services, prices or the law change. We will change the &quot;Last updated&quot; date at the top of this page.</li>
            <li>If a change materially affects existing clients, we will email you at least 30 days before it takes effect.</li>
            <li>A period you have already paid for stays on the Terms in force when you paid. For Plans, updated Terms apply from your first billing date after the notice period, and you may cancel before then. A Fixed-Price Build stays on the Terms in force when its SOW was accepted, unless both sides agree otherwise.</li>
            <li>Older versions are available on request.</li>
          </List>
        </Section>

        <Section id="notices">
          <List>
            <li>Notices to us must be sent by email to <Mail />, which is our official contact address.</li>
            <li>Notices to you are sent to the email address you gave us when ordering, or another you tell us to use.</li>
            <li>An email notice is treated as received when sent, unless the sender gets a delivery failure message. If sent outside 9:00 to 18:00 on a Business Day in the recipient&apos;s time zone, it is treated as received at the start of the next Business Day.</li>
          </List>
        </Section>

        <Section id="general">
          <List>
            <li><strong>Electronic acceptance.</strong> You accept these Terms by placing an Order, paying an invoice or checkout, accepting or signing an SOW or proposal (including by email), or, for the Free Sample, submitting the free edits form or email. Booking a free call alone does not create a contract for Services.</li>
            <li><strong>Order of precedence.</strong> If documents conflict, this order applies: (1) a signed or accepted SOW or proposal; (2) these Terms; (3) other terms or descriptions on our website. An SOW overrides these Terms only where it says so specifically, and cannot remove mandatory rights you have under the law.</li>
            <li><strong>Entire agreement.</strong> The Agreement is the whole agreement between us about the Services and replaces earlier discussions, except for anything either side said fraudulently. Plan descriptions and promises on our website at the time you ordered form part of the Agreement, as defined in these Terms.</li>
            <li><strong>Assignment.</strong> You may not transfer the Agreement without our written consent, which we will not unreasonably refuse. We may transfer it to a company or other business that takes over EchoPulse (for example if EchoPulse is incorporated), with notice to you, provided your rights under it are not reduced.</li>
            <li><strong>Independent contractor.</strong> We are an independent contractor. The Agreement does not create a partnership, joint venture, employment or agency relationship.</li>
            <li><strong>Severability.</strong> If a court or arbitrator finds part of these Terms invalid or unenforceable, that part is changed to the minimum extent needed to make it enforceable, or removed, and the rest continues to apply.</li>
            <li><strong>No waiver.</strong> If either side does not enforce a right straight away, it can still enforce it later. A waiver is only effective in writing.</li>
            <li><strong>Third parties.</strong> Only you and we can enforce the Agreement.</li>
            <li><strong>Survival.</strong> Sections that by their nature continue after the Agreement ends do so, including payment of amounts due, ownership and licences, portfolio use, confidentiality, data protection, non-solicitation, fraud, indemnities, limitation of liability, what happens when work ends, regional terms, and governing law and disputes.</li>
            <li><strong>Language.</strong> These Terms are written in English. If we provide a translation and it differs, the English version applies, unless your local law says otherwise.</li>
          </List>
        </Section>

        <Section id="contact">
          <p>
            Lakshya Soni, trading as EchoPulse Media
            <br />
            Bhopal, Madhya Pradesh, India
            <br />
            Email: <Mail />
          </p>
          <p>
            Related: <Link href="/privacy">Privacy Policy</Link>, <Link href="/pricing">Pricing</Link>, <Link href="/free-edits">Free edits</Link>.
          </p>
        </Section>

        <div className="tm-box" style={{ marginTop: '56px', padding: '22px 24px', background: 'rgba(242,238,231,0.04)', border: '1px solid rgba(242,238,231,0.12)', borderRadius: '14px' }}>
          <p className="terms-body" style={{ fontSize: '13px', color: 'rgba(242,238,231,0.7)', lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: '#F2EEE7' }}>A note on these terms.</strong> We wrote these terms ourselves to
            be clear and fair. They are the binding terms for our Services, but this page is also provided for general
            information and is not legal advice for your situation. If you have a question about any part of it, email{' '}
            <Mail /> before you order and we will answer it.
          </p>
        </div>

        <div style={{ marginTop: '40px', fontSize: '11.5px', color: 'rgba(242,238,231,0.4)', textAlign: 'center' }}>
          (C) {new Date().getFullYear()} EchoPulse Media. Operated by Lakshya Soni, sole proprietor, Bhopal, Madhya Pradesh, India.
        </div>
      </div>

      <style>{`
        .tm-main { padding: 120px 56px 96px; }
        .tm-main a { color: #F2EEE7; text-decoration: underline; text-decoration-color: rgba(232,84,26,0.7); text-underline-offset: 3px; overflow-wrap: anywhere; }
        .tm-main a:hover { color: #E8541A; }
        .tm-main section { scroll-margin-top: 96px; }
        .tm-main .terms-body p { margin: 0 0 12px; }
        .tm-main .terms-body p:last-child { margin-bottom: 0; }
        .tm-main .terms-body strong { color: #F2EEE7; }
        .tm-main .terms-body li { overflow-wrap: break-word; }
        .tm-h3 { font-family: Inter, sans-serif; font-size: 15px; font-weight: 800; color: #F2EEE7; margin: 22px 0 10px; letter-spacing: -0.2px; }
        .tm-toc { list-style: none; margin: 0; padding: 0; columns: 2; column-gap: 32px; }
        .tm-toc li { break-inside: avoid; padding: 3px 0; font-size: 13.5px; line-height: 1.5; }
        .tm-toc a { color: rgba(242,238,231,0.78) !important; text-decoration: none !important; display: inline-flex; gap: 8px; }
        .tm-toc a:hover { color: #E8541A !important; }
        .tm-toc-n { color: #E8541A; font-weight: 700; min-width: 22px; font-variant-numeric: tabular-nums; }
        .tm-steps { margin: 0 0 14px; padding-left: 20px; display: flex; flex-direction: column; gap: 10px; }
        @media (max-width: 640px) {
          .tm-main { padding: 104px 16px 72px; }
          .tm-toc { columns: 1; }
          .tm-box { padding: 18px 16px !important; }
        }
      `}</style>
    </main>
    </>
  );
}

function Mail() {
  return <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>;
}

/** In-page cross-reference: "section 9 (Payment)". */
function Ref({ id }: { id: SectionId }) {
  const s = SECTIONS.find((x) => x.id === id);
  return <a href={`#${id}`}>section {num(id)} ({s?.title})</a>;
}

function Section({ id, children }: { id: SectionId; children: React.ReactNode }) {
  const s = SECTIONS.find((x) => x.id === id);
  return (
    <section id={id} aria-labelledby={`${id}-h`} style={{ marginTop: '40px' }}>
      <h2 id={`${id}-h`} style={{ display: 'flex', alignItems: 'baseline', gap: '14px', fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.4px', lineHeight: 1.3, margin: '0 0 14px' }}>
        <span style={{ color: '#E8541A', fontSize: '13px', fontWeight: 800, letterSpacing: '1px' }}>{num(id)}.</span>
        {s?.title}
      </h2>
      <div className="terms-body" style={{ fontSize: '15px', color: 'rgba(242,238,231,0.74)', lineHeight: 1.75 }}>{children}</div>
    </section>
  );
}

function List({ children }: { children: React.ReactNode }) {
  return (
    <ul style={{ paddingLeft: '20px', margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: '8px', listStyle: 'disc' }}>
      {children}
    </ul>
  );
}
