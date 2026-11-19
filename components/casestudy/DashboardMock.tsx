'use client';

import { useState } from 'react';

type Row = { source: string; tracked: string; decision: string };

/**
 * A styled picture of the dashboard, built only from the capability table.
 *
 * It shows the shape of the thing (one source per tab, what is collected,
 * the decision it feeds) and nothing else. There are no figures in it because
 * the real figures are the client's, and a mock-up with made-up numbers would
 * be exactly the kind of fabrication the rest of the page refuses. The real
 * table sits next to it in the HTML for anyone who wants the plain version.
 */
export default function DashboardMock({ rows, client }: { rows: Row[]; client: string }) {
  const [i, setI] = useState(0);
  const r = rows[i];
  const tracked = r.tracked
    .split(/,\s*(?:and\s+)?|\s+and\s+(?=[a-z])/i)
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="cs-dash" aria-label={`Illustration of the ${client} dashboard layout, built from the capability table`}>
      <div className="cs-dash-top" aria-hidden="true">
        <span className="cs-browser-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="cs-dash-title">{client} marketing dashboard</span>
        <span className="cs-dash-pill">Collected daily</span>
      </div>
      <div className="cs-dash-body">
        <div className="cs-dash-nav" role="tablist" aria-label="Data sources">
          {rows.map((row, k) => (
            <button
              key={row.source}
              type="button"
              role="tab"
              id={`cs-dash-tab-${k}`}
              aria-selected={k === i}
              aria-controls="cs-dash-panel"
              tabIndex={k === i ? 0 : -1}
              className={`cs-dash-tab${k === i ? ' is-on' : ''}`}
              onClick={() => setI(k)}
              onKeyDown={(e) => {
                if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp' && e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
                e.preventDefault();
                const next = (k + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1) + rows.length) % rows.length;
                setI(next);
                document.getElementById(`cs-dash-tab-${next}`)?.focus();
              }}
            >
              <span className="cs-dash-dot" aria-hidden="true" />
              {row.source}
            </button>
          ))}
        </div>
        <div className="cs-dash-panel" role="tabpanel" id="cs-dash-panel" aria-labelledby={`cs-dash-tab-${i}`} key={r.source}>
          <p className="cs-dash-kicker">Source</p>
          <p className="cs-dash-source">{r.source}</p>
          <p className="cs-dash-kicker">What is tracked</p>
          <ul className="cs-dash-chips">
            {tracked.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
          <p className="cs-dash-kicker">Decision it drives</p>
          <p className="cs-dash-decision">{r.decision}</p>
          <p className="cs-dash-foot">
            {`${i + 1} of ${rows.length} sources. Figures are the client's and are not shown.`}
          </p>
        </div>
      </div>
    </div>
  );
}
