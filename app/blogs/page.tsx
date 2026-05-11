'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { client, urlFor, BlogPost } from '@/lib/sanity';

export default function BlogsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const query = `*[_type == "blog"] | order(publishedAt desc) {
          _id,
          title,
          slug,
          publishedAt,
          excerpt,
          author,
          readTime,
          mainImage,
          mainImageUrl
        }`;
        const data = await client.fetch(query);
        setPosts(data);
      } catch (error) {
        console.error('Error fetching posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const getImageUrl = (post: BlogPost) => {
    if (post.mainImageUrl) return post.mainImageUrl;
    if (post.mainImage) return urlFor(post.mainImage).width(800).height(500).url();
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

  return (
    <>
      <style>{`
        .blog-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 32px;
          width: 100%;
        }
        .blog-card {
          background: rgba(255,255,255,0.55);
          backdrop-filter: blur(20px) saturate(180%);
          -webkit-backdrop-filter: blur(20px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.85);
          border-radius: 20px;
          overflow: hidden;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1);
          box-shadow: 0 8px 32px rgba(12,12,11,0.06), inset 0 1px 0 rgba(255,255,255,0.95);
        }
        .blog-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 60px rgba(232,84,26,0.15), inset 0 1px 0 rgba(255,255,255,0.95);
          border-color: rgba(232,84,26,0.3);
        }
        .blog-card-image {
          width: 100%;
          height: 240px;
          object-fit: cover;
          background: linear-gradient(135deg, #E8541A 0%, #f59e0b 100%);
        }
        .blog-card-content {
          padding: 24px;
        }
        .blog-card-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 11px;
          color: #6E6B63;
          font-weight: 600;
          margin-bottom: 12px;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .blog-card-title {
          font-family: Inter, sans-serif;
          font-size: 22px;
          font-weight: 800;
          line-height: 1.3;
          color: #0C0C0B;
          margin: 0 0 12px;
          letter-spacing: -0.5px;
        }
        .blog-card-excerpt {
          font-size: 14px;
          line-height: 1.6;
          color: #6E6B63;
          margin: 0 0 16px;
        }
        .blog-card-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 700;
          color: #E8541A;
          text-decoration: none;
          letter-spacing: 0.5px;
          transition: gap 0.3s ease;
        }
        .blog-card-link:hover {
          gap: 10px;
        }
        .skeleton {
          background: linear-gradient(90deg, rgba(12,12,11,0.05) 25%, rgba(12,12,11,0.08) 50%, rgba(12,12,11,0.05) 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
          border-radius: 8px;
        }
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @media (max-width: 768px) {
          .blog-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
        }
      `}</style>

      <Nav />

      <section style={{ 
        minHeight: '100vh', 
        padding: '140px 56px 80px',
        position: 'relative',
        background: '#F2EEE7'
      }}>
        <div style={{ 
          maxWidth: '1280px', 
          margin: '0 auto',
          position: 'relative',
          zIndex: 1
        }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            style={{ marginBottom: '64px' }}
          >
            <div style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
              padding: '5px 14px 5px 8px',
              background: 'rgba(232,84,26,0.09)',
              border: '1px solid rgba(232,84,26,0.22)',
              borderRadius: '100px',
              fontSize: '11px',
              fontWeight: 700,
              color: '#E8541A',
              marginBottom: '20px'
            }}>
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#E8541A'
              }} />
              INSIGHTS & STORIES
            </div>

            <h1 style={{
              fontFamily: 'Inter, sans-serif',
              fontSize: 'clamp(40px, 5vw, 72px)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-2px',
              margin: '0 0 20px',
              color: '#0C0C0B'
            }}>
              The EchoPulse <span style={{ color: '#E8541A', fontStyle: 'italic' }}>Blog</span>
            </h1>

            <p style={{
              fontSize: '18px',
              lineHeight: 1.7,
              color: '#6E6B63',
              maxWidth: '640px',
              margin: 0
            }}>
              Deep dives into content strategy, founder-led marketing, and the craft of authentic storytelling.
            </p>
          </motion.div>

          {loading ? (
            <div className="blog-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="blog-card">
                  <div className="skeleton" style={{ height: '240px' }} />
                  <div className="blog-card-content">
                    <div className="skeleton" style={{ height: '14px', width: '60%', marginBottom: '12px' }} />
                    <div className="skeleton" style={{ height: '28px', width: '90%', marginBottom: '12px' }} />
                    <div className="skeleton" style={{ height: '60px', width: '100%', marginBottom: '16px' }} />
                    <div className="skeleton" style={{ height: '14px', width: '30%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                textAlign: 'center',
                padding: '80px 20px',
                color: '#6E6B63'
              }}
            >
              <p style={{ fontSize: '18px', marginBottom: '12px' }}>No blog posts yet.</p>
              <p style={{ fontSize: '14px' }}>Check back soon for insights and stories.</p>
            </motion.div>
          ) : (
            <motion.div
              className="blog-grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {posts.map((post, index) => {
                const imageUrl = getImageUrl(post);
                return (
                  <motion.article
                    key={post._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: 0.1 * index,
                      ease: [0.16, 1, 0.3, 1]
                    }}
                  >
                    <Link 
                      href={`/blogs/${post.slug.current}`}
                      className="blog-card"
                      style={{ display: 'block', textDecoration: 'none' }}
                    >
                      {imageUrl && (
                        <img 
                          src={imageUrl} 
                          alt={post.title}
                          className="blog-card-image"
                        />
                      )}
                      <div className="blog-card-content">
                        <div className="blog-card-meta">
                          {post.publishedAt && (
                            <span>{formatDate(post.publishedAt)}</span>
                          )}
                          {post.readTime && (
                            <>
                              <span>•</span>
                              <span>{post.readTime} min read</span>
                            </>
                          )}
                        </div>
                        <h2 className="blog-card-title">{post.title}</h2>
                        {post.excerpt && (
                          <p className="blog-card-excerpt">{post.excerpt}</p>
                        )}
                        <span className="blog-card-link">
                          Read Article
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M5 12h14M12 5l7 7-7 7"/>
                          </svg>
                        </span>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}
