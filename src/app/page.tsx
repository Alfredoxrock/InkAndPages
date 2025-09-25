'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import { BlogPost } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPosts = () => {
      try {
        const publishedPosts = getPublishedPosts();
        setPosts(publishedPosts);
      } catch (error) {
        console.error('Error loading posts:', error);
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

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
            <div className="space-y-12">
              {posts.map((post, index) => (
                <article
                  key={post.id}
                  className={`group relative fade-in hover-lift ${index === 0 ? 'border-2 border-accent/20 rounded-lg p-8 bg-gradient-to-br from-paper to-background ink-splash' : 'border-b border-border/30 pb-12'}`}
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div className="flex items-center space-x-4 text-sm text-muted mb-2 md:mb-0">
                      <time className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}</span>
                      </time>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{post.readingTime} min read</span>
                      </span>
                    </div>

                    {index === 0 && (
                      <span className="inline-block px-3 py-1 bg-accent text-white text-xs font-medium rounded-full">
                        Featured
                      </span>
                    )}
                  </div>

                  <Link href={`/posts/${post.id}`} className="block group-hover:text-accent transition-colors duration-200">
                    <h2 className="text-2xl md:text-3xl font-serif font-bold text-foreground mb-4 leading-tight group-hover:text-accent transition-colors duration-200">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-lg text-muted leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm rounded-full hover:bg-accent/20 transition-colors duration-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <Link
                      href={`/posts/${post.id}`}
                      className="inline-flex items-center text-accent hover:text-accent-light font-medium transition-colors duration-200 group/link"
                    >
                      Read Story
                      <svg className="w-4 h-4 ml-2 transition-transform duration-200 group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
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
