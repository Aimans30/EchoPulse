import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// /terms — Comprehensive Terms of Service.
// EchoPulse is currently a sole proprietorship operated by Lakshya Soni
// from Bhopal, with co-founders Shaurya and Aiman. Planned registered
// office on incorporation: Gurgaon. Jurisdiction + arbitration seat are
// Bhopal now, automatically shift to Gurgaon on incorporation.

export const metadata: Metadata = {
  title: 'Terms of Service',
  description:
    'Terms of Service for EchoPulse. Governs all custom-order edits, retainer engagements, and software builds. Indian law and exclusive jurisdiction.',
  alternates: { canonical: '/terms' },
  robots: { index: true, follow: false },
};

const EFFECTIVE_DATE = 'May 28, 2026';
const OPERATING_CITY = 'Bhopal';
const FUTURE_REGISTERED_OFFICE = 'Gurgaon';

export default function TermsPage() {
  return (
    // id="main" is the target of the layout's skip-to-content link.
    <main
      id="main"
      data-dark-bg="true"
      style={{
        background: '#0C0C0B',
        color: '#F2EEE7',
        minHeight: '100vh',
        padding: '120px 56px 96px',
      }}
    >
      <div style={{ maxWidth: '880px', margin: '0 auto' }}>
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

        <div style={{
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
        <p style={{ fontSize: '13px', color: 'rgba(242,238,231,0.5)', marginBottom: '8px' }}>
          Effective date: {EFFECTIVE_DATE}
        </p>
        <p style={{ fontSize: '13px', color: 'rgba(242,238,231,0.5)', marginBottom: '40px', lineHeight: 1.6 }}>
          These Terms constitute a binding legal agreement between you (&quot;Client&quot;, &quot;You&quot;) and Lakshya Soni, an Indian individual operating as a sole proprietor under the trade name &quot;EchoPulse&quot; (&quot;EchoPulse&quot;, &quot;We&quot;, &quot;Us&quot;, &quot;Our&quot;), based in {OPERATING_CITY}, India, working together with co-founders Shaurya and Aiman as a remote-first studio team. By placing any order, paying any invoice, accessing our website, or otherwise engaging Our services, You expressly accept these Terms in full. If You do not agree, do not place an order or use Our services. When EchoPulse incorporates as a registered entity (planned registered office: {FUTURE_REGISTERED_OFFICE}, India), contracts in force at that time will be deemed novated to the successor entity automatically, without need for re-acceptance, and jurisdiction will shift accordingly per Section 17.
        </p>

        <Section n="1" title="Definitions">
          <p><strong>Services</strong> means the editing, content production, design, software, automation, advisory, and any other deliverable provided by EchoPulse, whether ordered on a one-off (a la carte) basis via the /order page or on a recurring retainer basis.</p>
          <p><strong>Order</strong> means any purchase placed via the website, an invoice, a written engagement, or a verbal confirmation followed by payment.</p>
          <p><strong>Deliverable</strong> means the final output of an Order, for example an edited video file, a written document, a designed asset, a software build, or source files.</p>
          <p><strong>Source Material</strong> means any footage, audio, image, document, brand asset, or other input provided by the Client to EchoPulse for use in producing a Deliverable.</p>
          <p><strong>Status of EchoPulse.</strong> EchoPulse is currently a sole proprietorship operated by Lakshya Soni in his individual capacity in {OPERATING_CITY}, India, together with co-founders Shaurya and Aiman who collaborate on the studio&apos;s work on a remote, ongoing basis. EchoPulse is not registered as a private limited company, LLP, or partnership at this time, and is not GST-registered (operating below the statutory threshold under the Central Goods and Services Tax Act, 2017). EchoPulse will incorporate (planned registered office: {FUTURE_REGISTERED_OFFICE}, India) and obtain GSTIN as and when statutory thresholds are crossed. All rights, obligations, indemnities, limitations of liability, and dispute-resolution clauses set out in these Terms apply to Lakshya Soni in his capacity as proprietor of EchoPulse, to the co-founders and other team members, and to any successor entity formed upon future incorporation.</p>
          <p><strong>Production team.</strong> EchoPulse&apos;s core team consists of Lakshya Soni, Shaurya, and Aiman, working remotely as co-founders. We may also engage independent contractors and freelance specialists to deliver Services. All work is supervised by the founding team and delivered to You under the EchoPulse brand. All warranties, limitations, and indemnities in these Terms cover the founding team, contractors, and freelancers collectively as &quot;Indemnified Parties&quot; under Section 5.</p>
        </Section>

        <Section n="2" title="Eligibility and authority">
          <p>You represent and warrant that:</p>
          <List>
            <li>You are at least 18 years of age and legally capable of entering into a binding contract under the laws of Your jurisdiction.</li>
            <li>If You are placing an Order on behalf of a company, organization, or other entity, You have the full authority to bind that entity to these Terms, and references to &quot;You&quot; include that entity.</li>
            <li>Your acceptance of these Terms and the placement of any Order has not been induced by any misrepresentation by EchoPulse, and You have made an independent decision to engage Our Services.</li>
          </List>
        </Section>

        <Section n="3" title="Orders, pricing, taxes, and payment">
          <List>
            <li>All prices displayed on the website are exclusive of any applicable taxes, levies, or governmental charges. As of the Effective Date, EchoPulse is below the GST registration threshold and does not charge GST on Indian invoices. If GST or any equivalent indirect tax (VAT, Sales Tax, withholding) later becomes applicable due to crossing statutory thresholds, cross-border supply rules, or any change in law, that tax will be added to the invoice without altering the underlying price agreed at checkout. Client is solely responsible for any withholding obligations under their local tax law.</li>
            <li>Pricing is dynamic and may change at any time. The price displayed at the moment of checkout is the price You agree to pay.</li>
            <li>All payments must be made in full and cleared before production begins. EchoPulse is under no obligation to start work until payment is cleared in Our designated account.</li>
            <li>For a la carte Orders, all sales are <strong>final and non-refundable</strong> once production has commenced. Production is deemed to have commenced when EchoPulse confirms receipt of the Order and assigns it to a production queue, whichever is earlier.</li>
            <li>For retainer engagements, monthly fees are due in advance and are non-refundable. Cancellation requires fourteen (14) calendar days written notice; the current month&apos;s fee is not refunded upon cancellation.</li>
            <li>Late payment on retainer engagements accrues interest at the rate of two percent (2%) per month, compounded monthly, or the maximum permitted by applicable law, whichever is lower. We may suspend ongoing Services without notice for non-payment.</li>
          </List>
        </Section>

        <Section n="4" title="Client warranties regarding Source Material">
          <p>You expressly warrant and represent, on a continuing basis, that with respect to any Source Material You provide to EchoPulse:</p>
          <List>
            <li>You own all rights in the Source Material, or You hold a valid, paid-up, transferable license sufficient to permit the use We will make of it.</li>
            <li>You have obtained written consent and any required model releases from every identifiable person appearing in the Source Material, including consent to be filmed and consent for the resulting Deliverable to be commercially exploited on any platform.</li>
            <li>All music, sound effects, fonts, stock footage, photography, and third-party assets in the Source Material are properly licensed for the intended commercial use, and the license permits sub-licensing to EchoPulse for production purposes.</li>
            <li>The Source Material does not contain content that is defamatory, obscene, hateful, harassing, infringing, fraudulent, deceptive, or otherwise unlawful under the laws of India or any other jurisdiction in which the Deliverable may be published.</li>
            <li>The Source Material was not obtained through any unlawful means, including but not limited to hacking, hidden recording where prohibited, breach of confidentiality, or breach of any contract.</li>
            <li>You will promptly inform EchoPulse in writing if any of the above warranties cease to be true.</li>
          </List>
        </Section>

        <Section n="5" title="Indemnification by Client">
          <p><strong>You agree to indemnify, defend, and hold harmless EchoPulse, its founders (Lakshya Soni, Shaurya, Aiman), team members, contractors, freelancers, vendors, agents, and successors</strong> (the &quot;Indemnified Parties&quot;) from and against any and all claims, demands, suits, actions, proceedings, losses, damages, liabilities, judgments, settlements, fines, penalties, costs, and expenses, including reasonable legal fees and costs of investigation, arising from or related to:</p>
          <List>
            <li>Any breach of Your warranties in Section 4;</li>
            <li>Any claim by a third party that the Source Material or the Deliverable infringes intellectual property rights, rights of publicity or privacy, or any other rights;</li>
            <li>Any claim arising from the use, publication, or distribution of the Deliverable by You or anyone authorized by You;</li>
            <li>Any breach of these Terms by You or anyone acting on Your behalf;</li>
            <li>Any violation by You of any law or regulation;</li>
            <li>Any allegation of defamation, libel, slander, false light, intentional infliction of emotional distress, or similar tort arising from the Source Material or the Deliverable.</li>
          </List>
          <p>This indemnification obligation survives termination of these Terms indefinitely. EchoPulse reserves the right, at Your expense, to assume the exclusive defense and control of any matter for which You are required to indemnify Us, in which case You agree to cooperate fully with Our defense.</p>
        </Section>

        <Section n="6" title="Intellectual property and ownership">
          <List>
            <li>You retain ownership of Your Source Material at all times.</li>
            <li>Upon full and final clearance of payment for the relevant Order, EchoPulse assigns to You all transferable rights in the final Deliverable for that Order. Until that moment, EchoPulse retains all rights in the Deliverable, including the right to refuse delivery for non-payment.</li>
            <li>EchoPulse retains a perpetual, worldwide, royalty-free, non-exclusive license to use the Deliverable and excerpts of it in Our portfolio, marketing materials, case studies, social media, and pitch decks, with attribution to You unless You request anonymization in writing.</li>
            <li>EchoPulse retains all rights in Our pre-existing tools, templates, processes, scripts, software, project files, presets, color profiles, motion graphics templates, fonts (subject to font licensing), and methodologies. These are not transferred to You.</li>
            <li>For software and application builds, ownership of the final compiled product transfers to You upon full payment. EchoPulse retains rights to any reusable libraries, frameworks, or components We have developed independently of Your Order.</li>
          </List>
        </Section>

        <Section n="7" title="Revisions, scope, and out-of-scope requests">
          <List>
            <li>Each Order entitles You to revisions only within the scope as defined for the tier purchased. &quot;Scope&quot; means adjustments to the existing edit or Deliverable; it does not mean fundamental re-direction, change of subject, change of format, or addition of new footage.</li>
            <li>Out-of-scope requests, including but not limited to switching to different Source Material after production has begun, adding additional run-time beyond what was ordered, fundamental changes to the creative direction, or requesting deliverables not specified in the Order, constitute a new Order and are billed separately at Our prevailing rates.</li>
            <li>EchoPulse, acting reasonably and in good faith, is the sole arbiter of whether a revision request is in-scope or out-of-scope.</li>
            <li>If You do not respond to a draft Deliverable within fourteen (14) calendar days of delivery, the Deliverable will be deemed accepted in full, and the Order will be considered complete with no further revisions due.</li>
          </List>
        </Section>

        <Section n="8" title="Delivery, turnaround, and force majeure">
          <List>
            <li>Stated turnaround times are estimates based on receipt of complete and usable Source Material. Turnaround does not begin until We have everything We reasonably need to start work.</li>
            <li>EchoPulse is not liable for any delay caused in whole or in part by: incomplete Source Material; the Client&apos;s failure to respond, approve, or provide feedback; force majeure events (defined below); third-party platform outages; internet or hosting outages; payment processor delays; or any other cause beyond Our reasonable control.</li>
            <li>&quot;Force majeure&quot; includes but is not limited to: acts of God, fire, flood, earthquake, war, riot, civil disturbance, government action, lockdowns, pandemic, epidemic, strikes, telecommunications failure, cyberattack, and failure of utility services.</li>
            <li>Time is not of the essence in these Terms. Delays in delivery do not entitle You to any refund or compensation, and do not constitute a material breach.</li>
          </List>
        </Section>

        <Section n="9" title="Refunds, chargebacks, and disputes">
          <List>
            <li>All payments are non-refundable once production has commenced. We have no obligation to refund any amount on the basis of subjective dissatisfaction, change of mind, change of business plan, or any other reason not amounting to material breach by EchoPulse.</li>
            <li>If You believe a refund is genuinely warranted, You must contact us at the support email shown in Your confirmation receipt within seven (7) calendar days of the issue arising. We will investigate in good faith and respond in writing. Any refund actually issued is at Our sole discretion.</li>
            <li><strong>You agree not to initiate any chargeback, payment reversal, or dispute with Your bank, card issuer, or payment processor</strong> without first exhausting the dispute process in this Section. A chargeback initiated in breach of this clause is itself a material breach of these Terms.</li>
            <li>If You initiate a chargeback in breach of this Section, You agree to pay EchoPulse: (a) the full disputed amount; (b) an administrative fee of USD 250 (or INR equivalent); (c) all costs and fees charged to Us by the payment processor; and (d) all reasonable legal and collection costs We incur. EchoPulse reserves the right to report fraudulent chargebacks to credit bureaus, payment networks, and law enforcement.</li>
            <li>EchoPulse retains, in perpetuity, the right to refuse future Service to any Client who has initiated a chargeback against Us.</li>
          </List>
        </Section>

        <Section n="10" title="Acceptable use and content we will not produce">
          <p>EchoPulse reserves the right, in Our sole and absolute discretion, to refuse, pause, or terminate any Order whose Source Material or requested Deliverable:</p>
          <List>
            <li>Promotes hatred, discrimination, harassment, or violence against any individual or group;</li>
            <li>Involves sexually explicit material, content involving minors, or any content that may constitute child sexual abuse material (CSAM) under any applicable law;</li>
            <li>Is fraudulent, deceptive, misleading, or designed to mislead viewers;</li>
            <li>Promotes illegal goods, services, or activities;</li>
            <li>Defames any identifiable person or entity;</li>
            <li>Violates the platform policies of YouTube, Meta, TikTok, X, LinkedIn, or any other platform on which it is intended to be published;</li>
            <li>Constitutes financial advice, medical advice, or legal advice without proper professional qualification on Your part;</li>
            <li>Is, in Our reasonable judgment, contrary to Our values or commercial interests.</li>
          </List>
          <p>If We refuse an Order on these grounds after payment, We will refund the amount paid less any work already performed in good faith and the actual costs incurred. No further liability attaches to Us for such refusal.</p>
        </Section>

        <Section n="11" title="Confidentiality">
          <List>
            <li>Each party agrees to keep confidential any non-public information of the other party disclosed in the course of an Order, and to use that information only for purposes of performing or receiving the Services.</li>
            <li>This obligation does not apply to information that: (a) is or becomes public through no fault of the receiving party; (b) was already known to the receiving party without confidentiality obligation; (c) is independently developed; or (d) is required to be disclosed by law or court order.</li>
            <li>For clarity, EchoPulse may identify You as a client and may use Deliverables in Our portfolio per Section 6.</li>
          </List>
        </Section>

        <Section n="12" title="Data retention and storage">
          <List>
            <li>EchoPulse stores Source Material and project files for a period of ninety (90) days following delivery of the final Deliverable. After that period, files may be permanently deleted at Our discretion without further notice.</li>
            <li>You are solely responsible for maintaining Your own backups of Your Source Material and the Deliverable.</li>
            <li>EchoPulse is not liable for any loss, corruption, or deletion of files, including loss caused by hosting provider failure, cyberattack, or human error.</li>
          </List>
        </Section>

        <Section n="13" title="No performance guarantees">
          <p>EchoPulse makes no representations, warranties, or guarantees, whether express, implied, or statutory, with respect to any specific business or marketing outcome, including without limitation: views, impressions, reach, engagement, follower growth, click-through rate, conversion rate, revenue, leads, sales, return on ad spend, return on investment, search engine ranking, platform algorithm performance, monetization eligibility, brand reputation outcomes, or any similar metric.</p>
          <p>Any examples of past performance shown on our website or in our marketing materials are illustrative and are not a guarantee or projection of future results. Marketing outcomes depend on countless factors outside Our control.</p>
        </Section>

        <Section n="14" title="Disclaimer of warranties">
          <p>To the maximum extent permitted by applicable law, the Services and all Deliverables are provided <strong>&quot;AS IS&quot;</strong> and <strong>&quot;AS AVAILABLE&quot;</strong>, without warranty of any kind, whether express, implied, statutory, or otherwise. EchoPulse expressly disclaims all warranties of merchantability, fitness for a particular purpose, non-infringement, accuracy, completeness, and quality.</p>
          <p>Without limiting the foregoing, EchoPulse does not warrant that the Services will be uninterrupted, error-free, or completely secure, that defects will be corrected, or that Deliverables will meet Your subjective expectations.</p>
        </Section>

        <Section n="15" title="Limitation of liability">
          <p><strong>To the maximum extent permitted by applicable law, the total cumulative liability of EchoPulse for any and all claims, losses, costs, and damages of any kind, however arising, in connection with the Services or these Terms, shall not exceed the amount actually paid by You to EchoPulse for the specific Order out of which the claim arose, in the three (3) months preceding the event giving rise to the claim.</strong></p>
          <p>In no event shall EchoPulse be liable for any indirect, incidental, consequential, special, punitive, or exemplary damages, including but not limited to lost profits, lost revenue, lost business opportunity, loss of goodwill, loss of data, loss of views or engagement, or substitute service costs, even if EchoPulse has been advised of the possibility of such damages.</p>
          <p>The limitations of liability in this Section apply regardless of the legal theory on which the claim is based, including contract, tort (including negligence), strict liability, statute, or otherwise, and apply even if any limited remedy fails of its essential purpose. To the extent any portion of this limitation is held unenforceable under applicable law, the remainder remains in full force.</p>
        </Section>

        <Section n="16" title="Termination">
          <List>
            <li>EchoPulse may terminate or suspend any Order or engagement immediately, upon written notice, if You: (a) materially breach these Terms; (b) fail to pay any amount when due; (c) engage in abusive, threatening, or harassing communication; (d) request work that violates Section 10; (e) initiate a chargeback or payment dispute in breach of Section 9; or (f) take any action that exposes EchoPulse to legal, financial, or reputational risk.</li>
            <li>Upon termination by Us under this Section, all amounts paid by You are forfeited as liquidated damages and not as a penalty. EchoPulse retains the right to retain or destroy any work-to-date, at Our discretion.</li>
            <li>You may terminate at any time, but no refund is owed for work in progress or completed.</li>
            <li>Sections 4, 5, 6, 9, 11, 13, 14, 15, 17, 18, and 19 survive termination indefinitely.</li>
          </List>
        </Section>

        <Section n="17" title="Governing law and exclusive jurisdiction">
          <p>These Terms and any dispute arising out of or relating to these Terms or the Services shall be governed by and construed in accordance with the laws of India, including without limitation the Indian Contract Act, 1872, the Information Technology Act, 2000, and the Specific Relief Act, 1963, without regard to its conflict-of-laws rules.</p>
          <p>Subject to Section 18 (Arbitration), the courts at {OPERATING_CITY}, India shall have <strong>exclusive jurisdiction</strong> over any dispute arising out of or relating to these Terms during the period EchoPulse operates as a sole proprietorship. Upon EchoPulse&apos;s future incorporation and the establishment of its registered office at {FUTURE_REGISTERED_OFFICE}, India, exclusive jurisdiction shall automatically shift to the courts at {FUTURE_REGISTERED_OFFICE}, India for any dispute arising thereafter, without need for these Terms to be re-executed. You expressly consent to the personal jurisdiction of either set of courts and waive any objection based on forum non conveniens, inconvenience of venue, or absence of personal jurisdiction.</p>
          <p>For the avoidance of doubt: if You are located outside India and a dispute arises, You expressly agree to be bound by Indian law and to litigate (or arbitrate) exclusively in India. You waive any right to bring proceedings in any other court or under any other legal system.</p>
        </Section>

        <Section n="18" title="Mandatory arbitration and class action waiver">
          <p>Any dispute, controversy, or claim arising out of or in connection with these Terms, including any question regarding their existence, validity, breach, or termination, shall first be addressed by good-faith negotiation between the parties for a period of thirty (30) calendar days from written notice of the dispute.</p>
          <p>If the dispute is not resolved through negotiation, it shall be referred to and finally resolved by arbitration administered under the Arbitration and Conciliation Act, 1996 (as amended), by a sole arbitrator appointed by EchoPulse. The seat and venue of arbitration shall be {OPERATING_CITY}, India while EchoPulse remains a sole proprietorship, and shall automatically shift to {FUTURE_REGISTERED_OFFICE}, India upon EchoPulse&apos;s incorporation and establishment of its registered office there. The language of the arbitration shall be English. The award shall be final and binding on the parties.</p>
          <p><strong>You expressly waive any right to participate in a class action, collective action, or any other representative proceeding against EchoPulse.</strong> All disputes must be brought in Your individual capacity only. The arbitrator may not consolidate more than one person&apos;s claims and may not preside over any form of representative proceeding.</p>
          <p>Notwithstanding the foregoing, EchoPulse may seek injunctive or equitable relief in any court of competent jurisdiction to protect its intellectual property rights or to enforce confidentiality obligations.</p>
        </Section>

        <Section n="19" title="Modifications and notices">
          <List>
            <li>EchoPulse may modify these Terms at any time by posting an updated version on this page. The version in effect at the time You place an Order governs that Order. Continued use of Our Services after modification constitutes acceptance of the updated Terms.</li>
            <li>You agree to receive notices from Us at the email address You provide at checkout. Notices are deemed received twenty-four (24) hours after sending.</li>
            <li>You may contact us at the support email shown on Your confirmation receipt for any inquiries regarding these Terms.</li>
          </List>
        </Section>

        <Section n="20" title="Miscellaneous">
          <List>
            <li><strong>Entire agreement.</strong> These Terms, together with the Order confirmation, constitute the entire agreement between You and EchoPulse and supersede all prior or contemporaneous communications, proposals, and understandings, whether written or oral.</li>
            <li><strong>Severability.</strong> If any provision of these Terms is held to be invalid, illegal, or unenforceable, that provision shall be severed and the remaining provisions shall remain in full force and effect.</li>
            <li><strong>No waiver.</strong> The failure of EchoPulse to enforce any right or provision shall not be deemed a waiver of that right or provision.</li>
            <li><strong>No partnership.</strong> Nothing in these Terms creates a partnership, joint venture, agency, employment, or fiduciary relationship between the parties.</li>
            <li><strong>Assignment.</strong> You may not assign or transfer these Terms or any rights or obligations hereunder without Our prior written consent. We may assign these Terms freely, including to any successor entity formed upon EchoPulse&apos;s future incorporation.</li>
            <li><strong>Headings.</strong> Headings are for convenience only and shall not affect interpretation.</li>
            <li><strong>Independent advice.</strong> You acknowledge that You have had the opportunity to seek independent legal advice before accepting these Terms.</li>
          </List>
        </Section>

        <div style={{ marginTop: '60px', padding: '24px 26px', background: 'rgba(232,84,26,0.07)', border: '1px solid rgba(232,84,26,0.25)', borderRadius: '14px' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#E8541A', marginBottom: '8px' }}>Acknowledgement</div>
          <p style={{ fontSize: '13px', color: 'rgba(242,238,231,0.78)', lineHeight: 1.7, margin: 0 }}>
            By placing an Order with EchoPulse, You confirm that You have read, understood, and accept these Terms of Service in full, and that You are entering into a binding legal contract on the terms set out above.
          </p>
        </div>

        <div style={{ marginTop: '40px', fontSize: '11.5px', color: 'rgba(242,238,231,0.4)', textAlign: 'center' }}>
          (C) {new Date().getFullYear()} EchoPulse (Lakshya Soni, sole proprietor, Bhopal, India). Co-founders: Shaurya, Aiman. All rights reserved.
        </div>
      </div>
    </main>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: '36px' }}>
      <h2 style={{ display: 'flex', alignItems: 'baseline', gap: '14px', fontFamily: 'Inter, sans-serif', fontSize: '20px', fontWeight: 800, letterSpacing: '-0.4px', margin: '0 0 14px' }}>
        <span style={{ color: '#E8541A', fontSize: '13px', fontWeight: 800, letterSpacing: '1px' }}>{n}.</span>
        {title}
      </h2>
      <div style={{ fontSize: '14px', color: 'rgba(242,238,231,0.72)', lineHeight: 1.75 }}>{children}</div>
    </section>
  );
}

function List({ children }: { children: React.ReactNode }) {
  return (
    <ul style={{ paddingLeft: '20px', margin: '0 0 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {children}
    </ul>
  );
}
