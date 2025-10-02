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
            <div className="w-full mx-auto">
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
                    <div className="grid grid-cols-4 gap-8">
                        {posts.slice(0, 16).map((post) => (
                            <article
                                key={post.id}
                                className="bg-paper/60 backdrop-blur-sm rounded-lg border border-border/30 overflow-hidden hover:shadow-xl transition-all duration-300 group relative flex flex-col h-full"
                            >
                                <Link href={`/posts/${post.id}`}>
                                    {/* Image */}
                                    <div className="relative h-40 overflow-hidden">
                                        {post.coverImage ? (
                                            <img
                                                src={post.coverImage}
                                                alt={post.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        ) : (
                                            <div className="h-full bg-gradient-to-br from-accent/20 to-accent-light/20 flex items-center justify-center group-hover:from-accent/30 group-hover:to-accent-light/30 transition-all duration-300">
                                                <div className="w-12 h-12 bg-accent/30 rounded-full flex items-center justify-center group-hover:bg-accent/40 transition-all duration-300">
                                                    <svg className="w-6 h-6 text-accent" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    </div>

                                    <div className="p-6 flex flex-col h-full">
                                        <div className="flex items-center text-xs text-muted mb-2">
                                            <span>{formatDate(post.publishedAt)}</span>
                                            <span className="mx-2">•</span>
                                            <span>{post.readingTime ? `${post.readingTime} min read` : 'Story'}</span>
                                        </div>
                                        <h2 className="text-lg font-serif font-bold text-foreground mb-2 leading-tight group-hover:text-accent transition-colors line-clamp-2">
                                            {post.title}
                                        </h2>
                                        <p className="text-muted leading-relaxed mb-4 line-clamp-3">
                                            {post.excerpt || 'No excerpt available'}
                                        </p>
                                        <div className="flex gap-2 flex-wrap mt-auto">
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
                                    </div>
                                </Link>
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