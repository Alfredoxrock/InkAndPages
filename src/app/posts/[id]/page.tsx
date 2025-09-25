'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPostById } from '@/lib/posts';
import { BlogPost } from '@/lib/types';
import { formatDistanceToNow, format } from 'date-fns';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface PostPageProps {
  params: {
    id: string;
  };
}

export default function PostPage({ params }: PostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadPost = () => {
      try {
        const foundPost = getPostById(params.id);
        
        if (!foundPost || !foundPost.published) {
          router.push('/404');
          return;
        }
        
        setPost(foundPost);
      } catch (error) {
        console.error('Error loading post:', error);
        router.push('/404');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [params.id, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading story...</p>
        </div>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <div className="relative min-h-screen">
      {/* Hero Section with Post Title */}
      <section className="relative py-16 px-6 bg-gradient-to-br from-paper via-background to-paper overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-gradient-to-tl from-accent-light/15 to-transparent rounded-full blur-2xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Back Navigation */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center text-muted hover:text-accent transition-colors duration-200 group"
            >
              <svg className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to stories
            </Link>
          </div>

          {/* Post Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted mb-6">
            <time className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>{format(new Date(post.publishedAt), 'MMMM dd, yyyy')}</span>
            </time>
            <span>•</span>
            <span className="flex items-center space-x-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{post.readingTime} minute read</span>
            </span>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-8 leading-tight">
            {post.title}
          </h1>

          {/* Excerpt */}
          <p className="text-xl text-muted leading-relaxed max-w-3xl mb-8">
            {post.excerpt}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Decorative divider */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
            <div className="mx-6 w-3 h-3 bg-accent rounded-full"></div>
            <div className="w-24 h-px bg-gradient-to-l from-transparent via-accent/50 to-transparent"></div>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="py-16 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="prose prose-lg prose-custom max-w-none">
            <MarkdownRenderer content={post.content} />
          </div>
        </div>
      </article>

      {/* Article Footer */}
      <section className="py-16 px-6 border-t border-border/30 bg-foreground/5">
        <div className="max-w-3xl mx-auto">
          <div className="text-center">
            <div className="inline-block p-6 bg-paper rounded-xl shadow-lg border border-border/20">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-light rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-2">
                Thank you for reading!
              </h3>
              <p className="text-muted mb-6">
                I hope this story resonated with you. Every word is written with intention and care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/"
                  className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors duration-200 font-medium"
                >
                  Read More Stories
                </Link>
                <Link
                  href="/about"
                  className="px-6 py-3 border-2 border-accent text-accent hover:bg-accent hover:text-white rounded-lg transition-all duration-200 font-medium"
                >
                  About the Writer
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}