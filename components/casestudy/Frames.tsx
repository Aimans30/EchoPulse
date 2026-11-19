import Image from 'next/image';
import type { CaseStudyMedia } from '@/lib/caseStudyData';

/**
 * Device frames for real screenshots. Pure markup, no client code.
 *
 * The browser chrome is deliberately quiet: three dots, an address pill with
 * the real domain, no fake tabs or toolbar icons. It is there to say "this is
 * a live website", not to decorate.
 */

export function BrowserFrame({
  url,
  children,
  tone = 'light',
  className,
}: {
  url: string;
  children: React.ReactNode;
  tone?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <div className={`cs-browser cs-browser-${tone}${className ? ` ${className}` : ''}`}>
      <div className="cs-browser-bar" aria-hidden="true">
        <span className="cs-browser-dots">
          <i />
          <i />
          <i />
        </span>
        <span className="cs-browser-url">
          <svg viewBox="0 0 12 12" width="10" height="10" aria-hidden="true">
            <path d="M3.5 5V3.8a2.5 2.5 0 0 1 5 0V5M2.8 5h6.4v4.6H2.8z" fill="none" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          {url}
        </span>
      </div>
      <div className="cs-browser-view">{children}</div>
    </div>
  );
}

export function PhoneFrame({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`cs-phone${className ? ` ${className}` : ''}`}>
      <div className="cs-phone-screen">{children}</div>
    </div>
  );
}

/** Screenshot that fills its frame, cropped from the top. */
export function Shot({
  media,
  sizes,
  priority = false,
  position = 'top center',
}: {
  media: CaseStudyMedia;
  sizes: string;
  priority?: boolean;
  position?: string;
}) {
  return (
    <Image
      src={media.src}
      alt={media.alt}
      width={media.width}
      height={media.height}
      sizes={sizes}
      className="cs-shot"
      style={{ objectPosition: position }}
      {...(priority ? { loading: 'eager' as const, fetchPriority: 'high' as const } : {})}
    />
  );
}
