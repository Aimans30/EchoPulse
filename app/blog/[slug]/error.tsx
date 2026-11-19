'use client';

import Link from 'next/link';
import Nav from '@/components/Nav';

/**
 * Error boundary for a single blog post.
 *
 * A post that is already cached keeps being served from that cache when a
 * refresh from Sanity fails. This page is for the other case: a post with no
 * cached copy yet (published after the last deploy) while Sanity cannot be
 * reached. Without it the visitor got Next's bare error screen with no nav.
 */
export default function BlogPostError({ unstable_retry }: { error: Error & { digest?: string }; unstable_retry: () => void }) {
  return (
    <>
      <Nav />
      <main
        id="main"
        style={{
          background: '#F2EEE7',
          color: '#0C0C0B',
          minHeight: '100vh',
          padding: '160px 24px 120px',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        <div style={{ maxWidth: 560, margin: '0 auto' }}>
          <h1 style={{ margin: '0 0 14px', fontSize: 'clamp(30px, 5vw, 44px)', fontWeight: 900, letterSpacing: '-1.4px', lineHeight: 1.08 }}>
            This article did not load.
          </h1>
          <p style={{ margin: '0 0 28px', fontSize: 17, lineHeight: 1.6, color: '#4A4740' }}>
            The article exists, but we could not fetch it just now. Try again in a moment, or go back to the blog.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 20 }}>
            <button
              type="button"
              onClick={() => unstable_retry()}
              style={{
                minHeight: 48,
                padding: '0 26px',
                borderRadius: 100,
                border: 'none',
                background: '#0C0C0B',
                color: '#F2EEE7',
                font: '700 15px Inter, sans-serif',
                cursor: 'pointer',
              }}
            >
              Try again
            </button>
            <Link href="/blog" style={{ fontSize: 15, fontWeight: 600, color: '#0C0C0B', textUnderlineOffset: 4 }}>
              All articles
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
