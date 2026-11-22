'use client';

import Link from 'next/link';
import Script from 'next/script';
import { useSyncExternalStore } from 'react';
import { GoogleAnalytics } from '@next/third-parties/google';
import { useGeoPrice } from '@/lib/useGeoPrice';
import { useConsent, setConsent } from '@/lib/consent';

/**
 * Analytics tags, and the consent banner that gates them where the law
 * requires one.
 *
 *   - UK and EU/EEA visitors: a small banner, in their browser's language.
 *     Google Analytics and Microsoft Clarity load only after "Allow". UK PECR
 *     and the ePrivacy rules require prior consent for both.
 *   - Everyone else (US, Canada, India, rest of world): no banner. The tags
 *     are on by default. /privacy explains how to opt out.
 *   - Global Privacy Control, where the browser sends it, turns the tags off
 *     everywhere and suppresses the banner (the visitor has already answered).
 *
 * Region comes from useGeoPrice (ep_geo cookie from the edge middleware, then
 * a timezone fallback, then an IP lookup). Nothing loads while it is still
 * resolving, so a UK visitor is never tracked in the gap. Nothing renders on
 * the server.
 */
const CONSENT_REGIONS = new Set(['UK', 'EU']);

type Copy = { text: string; privacy: string; decline: string; allow: string };

/** Banner copy by browser language. Unlisted languages fall back to English. */
const COPY: Record<string, Copy> = {
  en: {
    text: 'We use Google Analytics and Microsoft Clarity to see which pages are working. Clarity records how you move through the page. Nothing loads unless you allow it.',
    privacy: 'Privacy',
    decline: 'Decline',
    allow: 'Allow',
  },
  de: {
    text: 'Wir nutzen Google Analytics und Microsoft Clarity, um zu sehen, welche Seiten funktionieren. Clarity zeichnet auf, wie Sie sich auf der Seite bewegen. Ohne Ihre Zustimmung wird nichts geladen.',
    privacy: 'Datenschutz',
    decline: 'Ablehnen',
    allow: 'Zulassen',
  },
  fr: {
    text: 'Nous utilisons Google Analytics et Microsoft Clarity pour voir quelles pages fonctionnent. Clarity enregistre votre navigation sur la page. Rien ne se charge sans votre accord.',
    privacy: 'Confidentialité',
    decline: 'Refuser',
    allow: 'Autoriser',
  },
  es: {
    text: 'Usamos Google Analytics y Microsoft Clarity para ver qué páginas funcionan. Clarity registra cómo te mueves por la página. No se carga nada sin tu permiso.',
    privacy: 'Privacidad',
    decline: 'Rechazar',
    allow: 'Permitir',
  },
  it: {
    text: 'Usiamo Google Analytics e Microsoft Clarity per capire quali pagine funzionano. Clarity registra come ti muovi nella pagina. Non viene caricato nulla senza il tuo consenso.',
    privacy: 'Privacy',
    decline: 'Rifiuta',
    allow: 'Consenti',
  },
  nl: {
    text: 'We gebruiken Google Analytics en Microsoft Clarity om te zien welke pagina’s werken. Clarity legt vast hoe je door de pagina beweegt. Er wordt niets geladen zonder jouw toestemming.',
    privacy: 'Privacy',
    decline: 'Weigeren',
    allow: 'Toestaan',
  },
  pt: {
    text: 'Usamos o Google Analytics e o Microsoft Clarity para ver quais páginas funcionam. O Clarity regista a forma como navega na página. Nada é carregado sem a sua autorização.',
    privacy: 'Privacidade',
    decline: 'Recusar',
    allow: 'Permitir',
  },
  pl: {
    text: 'Używamy Google Analytics i Microsoft Clarity, aby sprawdzić, które strony działają. Clarity rejestruje sposób poruszania się po stronie. Nic nie zostanie załadowane bez Twojej zgody.',
    privacy: 'Prywatność',
    decline: 'Odrzuć',
    allow: 'Zezwól',
  },
  sv: {
    text: 'Vi använder Google Analytics och Microsoft Clarity för att se vilka sidor som fungerar. Clarity spelar in hur du rör dig på sidan. Inget laddas utan ditt godkännande.',
    privacy: 'Integritet',
    decline: 'Neka',
    allow: 'Tillåt',
  },
  da: {
    text: 'Vi bruger Google Analytics og Microsoft Clarity til at se, hvilke sider der virker. Clarity optager, hvordan du bevæger dig på siden. Intet indlæses uden dit samtykke.',
    privacy: 'Privatliv',
    decline: 'Afvis',
    allow: 'Tillad',
  },
};

/** Browser language (two-letter), read after hydration. 'en' on the server. */
function useBrowserLang(): string {
  return useSyncExternalStore(
    () => () => {},
    () => (navigator.language || 'en').slice(0, 2).toLowerCase(),
    () => 'en',
  );
}

function useGpc(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true,
    () => false,
  );
}

export default function ConsentGate({
  gaId,
  clarityId,
}: {
  gaId: string;
  /** Clarity project id. Pass an empty string to disable Clarity entirely. */
  clarityId: string;
}) {
  const { region, ready } = useGeoPrice();
  const choice = useConsent();
  const lang = useBrowserLang();
  const gpc = useGpc();

  if (!ready || gpc) return null;
  // Only the live site reports to GA4 and Clarity: local dev, Vercel previews
  // and other hosts were inflating sessions (localhost showed up in Clarity).
  if (typeof window !== 'undefined' && !/^(www\.)?echopulse\.media$/.test(window.location.hostname)) return null;

  const needsConsent = CONSENT_REGIONS.has(region);
  const load = needsConsent ? choice === 'granted' : choice !== 'denied';
  const showBanner = needsConsent && choice === 'unknown';
  const t = COPY[lang] ?? COPY.en;

  return (
    <>
      {load && (
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

      {showBanner && (
        <div className="consent" role="region" aria-label={t.privacy} lang={COPY[lang] ? lang : 'en'}>
          <p className="consent-text">
            {t.text} <Link href="/privacy">{t.privacy}</Link>
          </p>
          <div className="consent-actions">
            <button type="button" className="consent-btn consent-no" onClick={() => setConsent('denied')}>
              {t.decline}
            </button>
            <button type="button" className="consent-btn consent-yes" onClick={() => setConsent('granted')}>
              {t.allow}
            </button>
          </div>

          <style>{`
            /* Bottom-left card, never a full-width bar, never traps focus. */
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
              /* 96px clears the mobile sticky CTA at the bottom of the viewport. */
              .consent { left: 12px; right: 12px; bottom: 96px; max-width: none; padding: 16px; }
              .consent-btn { flex: 1; padding: 12px 16px; }
            }
            @media (prefers-reduced-motion: reduce) { .consent-btn { transition: none; } }
          `}</style>
        </div>
      )}
    </>
  );
}
