'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPublishedPosts } from '@/lib/posts';
import { BlogPost } from '@/lib/types';

// Simple date formatting function
function formatDate(dateString: string | number): string {
    const date = typeof dateString === 'string' ? new Date(dateString) : new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
}

export default function ArchivePage() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load posts on client side
        const loadPosts = async () => {
            try {
                const allPosts = await getPublishedPosts();
                setPosts(allPosts);
            } catch (error) {
                console.error('Error loading posts:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPosts();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted">Loading stories...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-12 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
                        Story Archive
                    </h1>
                    <p className="text-lg text-muted max-w-2xl mx-auto">
                        A collection of all the stories, thoughts, and musings from Ink & Pages.
                        Explore the complete archive of creative writing and personal reflections.
                    </p>
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mb-8">
                    <Link
                        href="/"
                        className="inline-flex items-center text-accent hover:text-accent-light font-medium transition-colors duration-200"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Home
                    </Link>

                    <div className="text-sm text-muted">
                        {posts.length} {posts.length === 1 ? 'story' : 'stories'} published
                    </div>
                </div>

                {posts.length === 0 ? (
                    /* No posts state */
                    <div className="text-center py-16">
                        <div className="w-24 h-24 mx-auto mb-6 text-muted/30">
                            <svg fill="currentColor" viewBox="0 0 24 24">
                                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-serif font-bold text-foreground mb-2">
                            No Stories Yet
                        </h2>
                        <p className="text-muted mb-6">
                            The archive is waiting for the first story to be written.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors duration-200 font-medium"
                        >
                            Go Home
                        </Link>
                    </div>
                ) : (
                    /* Posts grid */
                    <div className="grid gap-8 grid-cols-4">
                        {posts.slice(0, 16).map((post) => (
                            <article
                                key={post.id}
                                className="bg-paper rounded-lg border border-border/20 p-8 hover:border-accent/30 transition-colors duration-200 flex flex-col h-full"
                            >
                                <div className="flex-1">
                                    <Link href={`/posts/${post.id}`}>
                                        <h2 className="text-2xl font-serif font-bold text-foreground hover:text-accent transition-colors duration-200 mb-2">
                                            {post.title}
                                        </h2>
                                    </Link>

                                    <div className="flex items-center text-sm text-muted mb-3">
                                        <span>{formatDate(post.publishedAt)}</span>
                                        <span className="mx-2">•</span>
                                        <span>by Dream Log Together</span>
                                        {post.tags.length > 0 && (
                                            <>
                                                <span className="mx-2">•</span>
                                                <div className="flex items-center space-x-2">
                                                    {post.tags.slice(0, 3).map((tag) => (
                                                        <span
                                                            key={tag}
                                                            className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {post.tags.length > 3 && (
                                                        <span className="text-xs text-muted">
                                                            +{post.tags.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    {post.excerpt && (
                                        <p className="text-muted leading-relaxed mb-4">
                                            {post.excerpt}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center justify-between mt-4">
                                    <Link
                                        href={`/posts/${post.id}`}
                                        className="inline-flex items-center text-accent hover:text-accent-light font-medium transition-colors duration-200"
                                    >
                                        Read Story
                                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                        </svg>
                                    </Link>

                                    {post.updatedAt && post.updatedAt !== post.publishedAt && (
                                        <span className="text-xs text-muted">
                                            Updated {formatDate(post.updatedAt)}
                                        </span>
                                    )}
                                </div>
                                {post.published && (
                                    <div className="flex-shrink-0 mt-4">
                                        <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                            <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                                            Published
                                        </span>
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                )}

                {/* Bottom navigation */}
                {posts.length > 0 && (
                    <div className="mt-16 text-center">
                        <Link
                            href="/"
                            className="inline-flex items-center px-6 py-3 border-2 border-accent text-accent hover:bg-accent hover:text-white rounded-lg transition-all duration-200 font-medium"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            Return Home
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}