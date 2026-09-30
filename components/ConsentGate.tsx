'use client';

import Link from 'next/link';
import Script from 'next/script';
import { GoogleAnalytics } from '@next/third-parties/google';
import { useConsent, setConsent } from '@/lib/consent';

/**
 * Consent banner, and the analytics tags it gates.
 *
 * Both live in one component on purpose: the tags render as siblings of the
 * banner from the same `choice` value, so there is no way to ship a state
 * where the banner says "declined" and a tag is still mounted somewhere else
 * in the tree. Previously GA sat in app/layout.tsx and Clarity in two
 * different files, which is how one of them kept firing.
 *
 * Nothing renders on the server. `useConsent` returns 'unknown' during SSR, so
 * the banner appears only after hydration and the tags only after a click.
 */
export default function ConsentGate({
  gaId,
  clarityId,
}: {
  gaId: string;
  /** Clarity project id. Pass an empty string to disable Clarity entirely. */
  clarityId: string;
}) {
  const choice = useConsent();

  return (
    <>
      {choice === 'granted' && (
        <>
          <GoogleAnalytics gaId={gaId} />
          {clarityId && (
            <Script id="clarity-init" strategy="lazyOnload">{`
              (function(c,l,a,r,i,t,y){
                if(c[a])return;
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "${clarityId}");
            `}</Script>
          )}
        </>
      )}

      {choice === 'unknown' && (
        <div className="consent" role="region" aria-label="Analytics consent">
          <p className="consent-text">
            We use Google Analytics and Microsoft Clarity to see which pages are working. Clarity records
            how you move through the page. Nothing loads until you choose.{' '}
            <Link href="/terms">Terms</Link>
          </p>
          <div className="consent-actions">
            <button type="button" className="consent-btn consent-no" onClick={() => setConsent('denied')}>
              Decline
            </button>
            <button type="button" className="consent-btn consent-yes" onClick={() => setConsent('granted')}>
              Allow
            </button>
          </div>

          <style>{`
            /* Bottom-left, above the mobile sticky CTA's reserved space but
               never across the middle of the page. The brief is explicit that
               this must not block content or CTAs, so it is a card rather than
               a full-width bar and it does not trap focus. */
            .consent {
              position: fixed;
              left: 16px;
              bottom: 16px;
              z-index: 90;
              max-width: 420px;
              display: flex;
              flex-direction: column;
              gap: 14px;
              padding: 18px 20px;
              border-radius: 16px;
              background: #0C0C0B;
              color: #F2EEE7;
              border: 1px solid rgba(242,238,231,0.16);
              box-shadow: 0 18px 46px rgba(12,12,11,0.34);
            }
            .consent-text { margin: 0; font-size: 13px; line-height: 1.6; color: rgba(242,238,231,0.78); }
            .consent-text a { color: #E8541A; text-decoration: underline; }
            .consent-actions { display: flex; gap: 10px; }
            .consent-btn {
              font-family: Inter, sans-serif; font-size: 13px; font-weight: 700;
              border-radius: 100px; padding: 10px 20px; cursor: pointer;
              border: 1px solid transparent; transition: opacity 0.2s ease;
            }
            .consent-btn:hover { opacity: 0.86; }
            .consent-btn:focus-visible { outline: 2px solid #E8541A; outline-offset: 2px; }
            .consent-no { background: transparent; color: rgba(242,238,231,0.8); border-color: rgba(242,238,231,0.28); }
            .consent-yes { background: #E8541A; color: #fff; }

            @media (max-width: 640px) {
              /* 96px clears the mobile sticky CTA, which owns the bottom of
                 the viewport on phones. */
              .consent { left: 12px; right: 12px; bottom: 96px; max-width: none; padding: 16px; }
              .consent-actions { justify-content: stretch; }
              .consent-btn { flex: 1; padding: 12px 16px; }
            }

            @media (prefers-reduced-motion: reduce) {
              .consent-btn { transition: none; }
            }
          `}</style>
        </div>
      )}
    </>
  );
}
