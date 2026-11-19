import { Rise } from './motion';

/**
 * The cost change on a rebuild, drawn as a year of bills. Twelve monthly
 * blocks on the old platform against one block, once, on the new site. The
 * figures are the confirmed engagement facts; the year view only multiplies
 * the stated monthly cost by twelve, which the page already states as roughly
 * $700 a year.
 */
export default function CostCompare() {
  const months = Array.from({ length: 12 }, (_, i) => i);
  return (
    <div className="cs-cost">
      <Rise className="cs-cost-col cs-cost-old">
        <p className="cs-cost-kicker">Before, on GoDaddy Airo</p>
        <p className="cs-cost-big">
          $50 to $60 <small>a month</small>
        </p>
        <p className="cs-cost-sub">In plugins and add-ons, every month. Roughly $700 a year.</p>
        <ol className="cs-cost-year" aria-label="Twelve monthly bills in a year">
          {months.map((m) => (
            <li key={m} style={{ transitionDelay: `${0.15 + m * 0.05}s` }}>
              <span className="cs-sr">Month {m + 1}: a bill</span>
            </li>
          ))}
        </ol>
        <p className="cs-cost-axis" aria-hidden="true">
          <span>Month 1</span>
          <span>Month 12</span>
        </p>
      </Rise>
      <Rise className="cs-cost-col cs-cost-new" delay={0.1}>
        <p className="cs-cost-kicker">After, workingwithgod.live</p>
        <p className="cs-cost-big">
          $0 <small>a month</small>
        </p>
        <p className="cs-cost-sub">No monthly platform bill. $599 once, for the redesign. Code and content handed over.</p>
        <ol className="cs-cost-year" aria-label="One payment, once">
          {months.map((m) => (
            <li key={m} className={m === 0 ? 'is-once' : 'is-empty'} style={{ transitionDelay: `${0.25 + m * 0.05}s` }}>
              <span className="cs-sr">{m === 0 ? 'Month 1: $599, one time' : `Month ${m + 1}: nothing`}</span>
            </li>
          ))}
        </ol>
        <p className="cs-cost-axis" aria-hidden="true">
          <span>$599 once</span>
          <span>then $0</span>
        </p>
      </Rise>
    </div>
  );
}
