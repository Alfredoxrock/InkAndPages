'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPostById } from '@/lib/posts';
import { BlogPost } from '@/lib/types';
import { formatDistanceToNow, format } from 'date-fns';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { trackPostView } from '@/lib/gtag';

interface PostPageClientProps {
    params: {
        id: string;
    };
}

export default function PostPageClient({ params }: PostPageClientProps) {
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

                // Track post view for analytics
                trackPostView(foundPost.id, foundPost.title);
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
            <div className="min-h-screen bg-gradient-to-br from-background via-paper to-background">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-4xl mx-auto">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded mb-4"></div>
                            <div className="h-4 bg-gray-200 rounded mb-8"></div>
                            <div className="space-y-3">
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded"></div>
                                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!post) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-paper to-background">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-4xl mx-auto">
                    {/* Back Navigation */}
                    <div className="mb-8">
                        <Link
                            href="/"
                            className="inline-flex items-center text-muted hover:text-foreground transition-colors group"
                        >
                            <svg className="w-4 h-4 mr-2 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to stories
                        </Link>
                    </div>

                    {/* Article Header */}
                    <header className="mb-12">
                        <div className="flex items-center text-sm text-muted mb-4">
                            <time className="font-medium">
                                <span>{format(new Date(post.publishedAt), 'MMMM dd, yyyy')}</span>
                            </time>
                            <span className="mx-3">•</span>
                            <span>{post.readingTime} min read</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                            <span>{formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}</span>
                        </div>

                        {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                            <div className="mt-8 pt-8 border-t border-border/30">
                                <div className="flex flex-wrap gap-2">
                                    {post.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm font-medium"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </header>

                    {/* Decorative separator */}
                    <div className="mb-12">
                        <div className="flex items-center justify-center">
                            <div className="w-16 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
                            <div className="mx-4 w-2 h-2 bg-accent rounded-full"></div>
                            <div className="w-16 h-px bg-gradient-to-l from-transparent via-accent/50 to-transparent"></div>
                        </div>
                    </div>

                    {/* Article Content */}
                    <article className="prose prose-lg prose-gray max-w-none">
                        <MarkdownRenderer content={post.content} />
                    </article>

                    {/* Bottom Navigation */}
                    <div className="mt-16 pt-8 border-t border-border/30">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="text-center sm:text-left">
                                <p className="text-muted mb-2">Thank you for reading</p>
                                <div className="flex items-center justify-center sm:justify-start gap-4">
                                    <Link
                                        href="/"
                                        className="text-accent hover:text-accent-light transition-colors"
                                    >
                                        ← More stories
                                    </Link>
                                    <Link
                                        href="/archive"
                                        className="text-accent hover:text-accent-light transition-colors"
                                    >
                                        Browse archive →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}