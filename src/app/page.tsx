'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import { BlogPost } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import PostPageClient from "@/app/posts/[id]/PostPageClient";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { isWriter } = useAuth();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPostRoute, setIsPostRoute] = useState(false);
  const [postId, setPostId] = useState<string | null>(null);

  useEffect(() => {
    console.log('Homepage component loaded');
    console.log('Current URL:', window.location.href);
    console.log('Current pathname:', window.location.pathname);

    // Check if we're actually on a post URL
    const pathname = window.location.pathname;
    const postMatch = pathname.match(/^\/posts\/(.+)$/);

    if (postMatch) {
      console.log('Detected post URL, extracting post ID:', postMatch[1]);
      setIsPostRoute(true);
      setPostId(postMatch[1]);
      return; // Don't load homepage posts if we're on a post route
    }

    const loadPosts = async () => {
      try {
        const publishedPosts = await getPublishedPosts();
        console.log('Loaded posts on homepage:', publishedPosts);
        console.log('Number of posts:', publishedPosts.length);
        publishedPosts.forEach(post => {
          console.log(`Post: ${post.title} - ID: ${post.id} - Published: ${post.published}`);
        });
        setPosts(publishedPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  // If we detected a post URL, render the PostPageClient instead of homepage
  if (isPostRoute && postId) {
    console.log('Rendering PostPageClient for post ID:', postId);
    const mockParams = Promise.resolve({ id: postId });
    return <PostPageClient params={mockParams} />;
  }

  return (
    <div className="relative min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-6 bg-gradient-to-br from-background via-paper to-background overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-accent/30 to-transparent rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-gradient-to-tl from-accent-light/25 to-transparent rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-foreground mb-6 leading-tight">
            Where Words
            <span className="relative inline-block mx-4">
              <span className="relative z-10 text-accent">Dance</span>
              <div className="absolute inset-0 bg-accent/20 rounded-lg transform -rotate-1 scale-110"></div>
            </span>
            on Paper
          </h1>

          <p className="text-xl text-muted mb-8 max-w-2xl mx-auto leading-relaxed">
            Welcome to a sanctuary of stories, thoughts, and creative musings.
            Every word here is crafted with intention, every story told with heart.
          </p>

          <div className="flex items-center justify-center space-x-4 text-sm text-muted">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
              <span>{posts.length} stories shared</span>
            </div>
            <span>•</span>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>Written with passion</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-serif font-bold text-foreground mb-4">
              Recent Stories
            </h2>
            <div className="flex items-center justify-center">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
              <div className="mx-4 w-2 h-2 bg-accent rounded-full"></div>
              <div className="w-16 h-px bg-gradient-to-l from-transparent via-accent/50 to-transparent"></div>
            </div>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-accent/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 19.5A2.5 2.5 0 0 0 6.5 22H20a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H6.5A2.5 2.5 0 0 0 4 4.5v15z M9 2v20" />
                </svg>
              </div>
              <h3 className="text-xl font-serif text-muted mb-2">New stories coming soon</h3>
              <p className="text-muted/80">Check back for fresh tales and thoughts.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {posts.map((post) => (
                <article key={post.id} className="bg-paper/60 backdrop-blur-sm rounded-lg border border-border/30 overflow-hidden hover:shadow-xl transition-all duration-300 group relative">
                  {/* Writer Controls - Only show for writers */}
                  {isWriter && (
                    <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Link
                        href={`/admin/edit/${post.id}`}
                        className="inline-flex items-center px-3 py-1 bg-white/90 backdrop-blur-sm text-accent hover:text-accent-light border border-accent/20 rounded-full text-sm font-medium shadow-sm transition-all duration-200"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </Link>
                    </div>
                  )}
                  
                  <Link href={`/posts/${post.id}`}>
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden">
                      {post.coverImage ? (
                        <img
                          src={post.coverImage}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="h-full bg-gradient-to-br from-accent/20 to-accent-light/20 flex items-center justify-center group-hover:from-accent/30 group-hover:to-accent-light/30 transition-all duration-300">
                          <div className="w-16 h-16 bg-accent/30 rounded-full flex items-center justify-center group-hover:bg-accent/40 transition-all duration-300">
                            <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center text-sm text-muted mb-3">
                        <time className="font-medium">
                          {(() => {
                            try {
                              return formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true });
                            } catch (error) {
                              return 'Recently published';
                            }
                          })()}
                        </time>
                        <span className="mx-2">•</span>
                        <span>{post.readingTime} min read</span>
                      </div>

                      <h2 className="text-xl font-serif font-bold text-foreground mb-3 leading-tight group-hover:text-accent transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      <p className="text-muted leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt || 'No excerpt available'}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex gap-2 flex-wrap">
                          {post.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                              #{tag}
                            </span>
                          ))}
                          {post.tags.length > 2 && (
                            <span className="px-2 py-1 bg-muted/10 text-muted text-xs rounded-full">
                              +{post.tags.length - 2}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center text-accent hover:text-accent-light text-sm font-medium">
                          Read →
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          )}

          {posts.length > 0 && (
            <div className="text-center mt-16">
              <Link
                href="/archive"
                className="inline-flex items-center px-6 py-3 border-2 border-accent text-accent hover:bg-accent hover:text-white font-medium rounded-lg transition-all duration-200 group"
              >
                <svg className="w-5 h-5 mr-2 transition-transform duration-200 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2v0M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                </svg>
                View All Stories
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
