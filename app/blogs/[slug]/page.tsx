'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { PortableText } from '@portabletext/react';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { client, urlFor, BlogPost } from '@/lib/sanity';

const portableTextComponents = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset?._ref) return null;
      return (
        <div style={{ margin: '32px 0' }}>
          <img
            src={urlFor(value).width(1200).url()}
            alt={value.alt || 'Blog image'}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(12,12,11,0.1)'
            }}
          />
          {value.caption && (
            <p style={{
              fontSize: '13px',
              color: '#6E6B63',
              textAlign: 'center',
              marginTop: '12px',
              fontStyle: 'italic'
            }}>
              {value.caption}
            </p>
          )}
        </div>
      );
    },
    imageUrl: ({ value }: any) => {
      if (!value?.url) return null;
      return (
        <div style={{ margin: '32px 0' }}>
          <img
            src={value.url}
            alt={value.alt || 'Blog image'}
            style={{
              width: '100%',
              height: 'auto',
              borderRadius: '12px',
              boxShadow: '0 8px 32px rgba(12,12,11,0.1)'
            }}
          />
          {value.caption && (
            <p style={{
              fontSize: '13px',
              color: '#6E6B63',
              textAlign: 'center',
              marginTop: '12px',
              fontStyle: 'italic'
            }}>
              {value.caption}
            </p>
          )}
        </div>
      );
    },
    video: ({ value }: any) => {
      if (!value?.url) return null;
      return (
        <div style={{ margin: '32px 0' }}>
          <div style={{
            position: 'relative',
            paddingBottom: '56.25%',
            height: 0,
            overflow: 'hidden',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(12,12,11,0.1)'
          }}>
            <iframe
              src={value.url}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                border: 'none'
              }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
          {value.caption && (
            <p style={{
              fontSize: '13px',
              color: '#6E6B63',
              textAlign: 'center',
              marginTop: '12px',
              fontStyle: 'italic'
            }}>
              {value.caption}
            </p>
          )}
        </div>
      );
    },
  },
  block: {
    h1: ({ children }: any) => (
      <h1 style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: 'clamp(32px, 4vw, 48px)',
        fontWeight: 900,
        lineHeight: 1.2,
        letterSpacing: '-1.5px',
        margin: '48px 0 24px',
        color: '#0C0C0B'
      }}>
        {children}
      </h1>
    ),
    h2: ({ children }: any) => (
      <h2 style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: 'clamp(26px, 3.5vw, 38px)',
        fontWeight: 800,
        lineHeight: 1.3,
        letterSpacing: '-1px',
        margin: '40px 0 20px',
        color: '#0C0C0B'
      }}>
        {children}
      </h2>
    ),
    h3: ({ children }: any) => (
      <h3 style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: 'clamp(22px, 3vw, 30px)',
        fontWeight: 700,
        lineHeight: 1.4,
        letterSpacing: '-0.5px',
        margin: '32px 0 16px',
        color: '#0C0C0B'
      }}>
        {children}
      </h3>
    ),
    h4: ({ children }: any) => (
      <h4 style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '20px',
        fontWeight: 700,
        lineHeight: 1.5,
        margin: '28px 0 14px',
        color: '#0C0C0B'
      }}>
        {children}
      </h4>
    ),
    normal: ({ children }: any) => (
      <p style={{
        fontSize: '17px',
        lineHeight: 1.8,
        color: '#0C0C0B',
        margin: '0 0 24px',
        fontWeight: 400
      }}>
        {children}
      </p>
    ),
    blockquote: ({ children }: any) => (
      <blockquote style={{
        borderLeft: '4px solid #E8541A',
        paddingLeft: '24px',
        margin: '32px 0',
        fontStyle: 'italic',
        fontSize: '19px',
        lineHeight: 1.7,
        color: '#6E6B63'
      }}>
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul style={{
        margin: '24px 0',
        paddingLeft: '28px',
        listStyle: 'none'
      }}>
        {children}
      </ul>
    ),
    number: ({ children }: any) => (
      <ol style={{
        margin: '24px 0',
        paddingLeft: '28px',
        counterReset: 'item'
      }}>
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => (
      <li style={{
        fontSize: '17px',
        lineHeight: 1.8,
        color: '#0C0C0B',
        marginBottom: '12px',
        paddingLeft: '12px',
        position: 'relative'
      }}>
        <span style={{
          position: 'absolute',
          left: '-16px',
          color: '#E8541A',
          fontWeight: 700
        }}>•</span>
        {children}
      </li>
    ),
    number: ({ children }: any) => (
      <li style={{
        fontSize: '17px',
        lineHeight: 1.8,
        color: '#0C0C0B',
        marginBottom: '12px',
        paddingLeft: '12px',
        counterIncrement: 'item',
        display: 'flex',
        gap: '12px'
      }}>
        <span style={{
          color: '#E8541A',
          fontWeight: 700,
          minWidth: '24px'
        }}>
          <span style={{ content: 'counter(item) "."' }} />
        </span>
        <span>{children}</span>
      </li>
    ),
  },
  marks: {
    strong: ({ children }: any) => (
      <strong style={{ fontWeight: 700, color: '#0C0C0B' }}>{children}</strong>
    ),
    em: ({ children }: any) => (
      <em style={{ fontStyle: 'italic' }}>{children}</em>
    ),
    link: ({ value, children }: any) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === '_blank' ? 'noopener noreferrer' : undefined}
          style={{
            color: '#E8541A',
            textDecoration: 'underline',
            fontWeight: 600,
            transition: 'opacity 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.7'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          {children}
        </a>
      );
    },
    code: ({ children }: any) => (
      <code style={{
        background: 'rgba(232,84,26,0.1)',
        padding: '2px 6px',
        borderRadius: '4px',
        fontSize: '0.9em',
        fontFamily: 'monospace',
        color: '#E8541A'
      }}>
        {children}
      </code>
    ),
  },
};

export default function BlogPostPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchPost = async () => {
      try {
        const query = `*[_type == "blog" && slug.current == $slug][0] {
          _id,
          title,
          slug,
          publishedAt,
          excerpt,
          author,
          readTime,
          mainImage,
          mainImageUrl,
          content
        }`;
        const data = await client.fetch(query, { slug });
        setPost(data);
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);

  const getImageUrl = (post: BlogPost) => {
    if (post.mainImageUrl) return post.mainImageUrl;
    if (post.mainImage) return urlFor(post.mainImage).width(1200).height(600).url();
    return null;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <>
        <Nav />
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F2EEE7'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid rgba(232,84,26,0.2)',
            borderTopColor: '#E8541A',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite'
          }} />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
        <Footer />
      </>
    );
  }

  if (!post) {
    return (
      <>
        <Nav />
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F2EEE7',
          padding: '40px 20px'
        }}>
          <h1 style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '48px',
            fontWeight: 900,
            color: '#0C0C0B',
            marginBottom: '16px'
          }}>
            Post Not Found
          </h1>
          <p style={{
            fontSize: '18px',
            color: '#6E6B63',
            marginBottom: '32px'
          }}>
            The blog post you're looking for doesn't exist.
          </p>
          <Link
            href="/blogs"
            style={{
              background: '#0C0C0B',
              color: '#F2EEE7',
              padding: '15px 28px',
              borderRadius: '100px',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s'
            }}
          >
            ← Back to Blog
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const imageUrl = getImageUrl(post);

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .blog-post-header {
            padding: 120px 24px 40px !important;
          }
          .blog-post-content {
            padding: 40px 24px 80px !important;
          }
        }
      `}</style>

      <Nav />

      <article style={{ background: '#F2EEE7', minHeight: '100vh' }}>
        <motion.header
          className="blog-post-header"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7 }}
          style={{
            padding: '140px 56px 60px',
            maxWidth: '900px',
            margin: '0 auto'
          }}
        >
          <Link
            href="/blogs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 700,
              color: '#6E6B63',
              textDecoration: 'none',
              marginBottom: '32px',
              transition: 'color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#E8541A'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#6E6B63'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Blog
          </Link>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            fontSize: '11px',
            color: '#6E6B63',
            fontWeight: 600,
            marginBottom: '20px',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>
            {post.publishedAt && (
              <span>{formatDate(post.publishedAt)}</span>
            )}
            {post.readTime && (
              <>
                <span>•</span>
                <span>{post.readTime} min read</span>
              </>
            )}
            {post.author && (
              <>
                <span>•</span>
                <span>By {post.author}</span>
              </>
            )}
          </div>

          <h1 style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: 'clamp(36px, 5vw, 64px)',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-2px',
            margin: '0 0 24px',
            color: '#0C0C0B'
          }}>
            {post.title}
          </h1>

          {post.excerpt && (
            <p style={{
              fontSize: '20px',
              lineHeight: 1.6,
              color: '#6E6B63',
              margin: '0 0 40px',
              fontWeight: 400
            }}>
              {post.excerpt}
            </p>
          )}

          {imageUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <img
                src={imageUrl}
                alt={post.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '16px',
                  boxShadow: '0 20px 60px rgba(12,12,11,0.15)'
                }}
              />
            </motion.div>
          )}
        </motion.header>

        <motion.div
          className="blog-post-content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          style={{
            padding: '40px 56px 120px',
            maxWidth: '800px',
            margin: '0 auto'
          }}
        >
          {post.content && (
            <PortableText 
              value={post.content} 
              components={portableTextComponents}
            />
          )}
        </motion.div>

        <div style={{
          maxWidth: '800px',
          margin: '0 auto',
          padding: '0 56px 80px',
          borderTop: '1px solid rgba(12,12,11,0.1)',
          paddingTop: '40px'
        }}>
          <Link
            href="/blogs"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#0C0C0B',
              color: '#F2EEE7',
              padding: '15px 28px',
              borderRadius: '100px',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
              transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.03)';
              e.currentTarget.style.boxShadow = '0 8px 30px rgba(232,84,26,0.28)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            View All Posts
          </Link>
        </div>
      </article>

      <Footer />
    </>
  );
}
