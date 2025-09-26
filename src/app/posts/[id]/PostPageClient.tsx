'use client';

import { useState, useEffect } from 'react';
import { notFound, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getPostByIdAsync, getPostById } from '@/lib/posts';
import { BlogPost } from '@/lib/types';
import { formatDistanceToNow, format } from 'date-fns';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import HtmlContentRenderer from '@/components/HtmlContentRenderer';
import StructuredData from '@/components/StructuredData';
import { trackPostView } from '@/lib/gtag';
import { useAuth } from '@/contexts/AuthContext';

interface PostPageClientProps {
    params: Promise<{
        id: string;
    }>;
}

export default function PostPageClient({ params }: PostPageClientProps) {
    console.log('=== PostPageClient COMPONENT INSTANTIATED ===');
    console.log('PostPageClient received params:', params);

    const { user, isWriter } = useAuth();
    const [post, setPost] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [postId, setPostId] = useState<string | null>(null);
    const router = useRouter();

    console.log('PostPageClient component rendered');
    console.log('Current URL:', typeof window !== 'undefined' ? window.location.href : 'SSR');

    useEffect(() => {
        const getParams = async () => {
            const resolvedParams = await params;
            console.log('Resolved params:', resolvedParams);
            setPostId(resolvedParams.id);
        };
        getParams();
    }, [params]);

    useEffect(() => {
        if (!postId) return;
        const loadPost = async () => {
            try {
                console.log('PostPageClient: Loading post with ID:', postId);

                // First try synchronous version (for static posts)
                const syncPost = getPostById(postId);
                console.log('PostPageClient: Sync post result:', syncPost);
                if (syncPost) {
                    console.log('PostPageClient: Found post synchronously:', {
                        id: syncPost.id,
                        title: syncPost.title,
                        published: syncPost.published,
                        type: typeof syncPost.published
                    });

                    if (!syncPost.published) {
                        console.log('PostPageClient: Post not published (sync). User isWriter:', isWriter);
                        // Only allow writers to view unpublished posts
                        if (!isWriter) {
                            console.log('PostPageClient: Non-writer trying to access draft, redirecting');
                            router.push('/');
                            return;
                        }
                        console.log('PostPageClient: Writer accessing draft post');
                    }

                    setPost(syncPost);
                    setLoading(false);
                    console.log('PostPageClient: Post content preview:', syncPost.content.substring(0, 200));
                    trackPostView(syncPost.id, syncPost.title);
                    return;
                }

                // If not found synchronously, try async version (for Firestore)
                console.log('PostPageClient: Trying async lookup...');
                const foundPost = await getPostByIdAsync(postId);
                console.log('PostPageClient: Async result:', foundPost);

                if (!foundPost) {
                    console.log('PostPageClient: Post not found anywhere, redirecting to homepage');
                    router.push('/');
                    return;
                }

                if (!foundPost.published) {
                    console.log('PostPageClient: Post not published (async). User isWriter:', isWriter);
                    // Only allow writers to view unpublished posts
                    if (!isWriter) {
                        console.log('PostPageClient: Non-writer trying to access draft, redirecting');
                        router.push('/');
                        return;
                    }
                    console.log('PostPageClient: Writer accessing draft post');
                }

                setPost(foundPost);
                trackPostView(foundPost.id, foundPost.title);
            } catch (error) {
                console.error('PostPageClient: Error loading post:', error);
                router.push('/');
            } finally {
                setLoading(false);
            }
        };

        loadPost();
    }, [postId, router]);

    if (loading) {
        return (
            <div className="bg-gradient-to-br from-background via-paper to-background">
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
        return null; // Component will redirect via useEffect
    }

    return (
        <div className="bg-gradient-to-br from-background via-paper to-background">
            <StructuredData post={post} />

            {/* Draft Banner */}
            {!post.published && isWriter && (
                <div className="bg-orange-100 border-l-4 border-orange-500 p-4">
                    <div className="max-w-4xl mx-auto px-4">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 text-orange-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                            <p className="text-orange-700 font-medium">
                                📝 This is a draft post - only visible to you as the writer
                            </p>
                            <Link
                                href={`/admin/edit/${postId}`}
                                className="ml-auto text-orange-600 hover:text-orange-800 underline text-sm"
                            >
                                Edit Post
                            </Link>
                        </div>
                    </div>
                </div>
            )}

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
                        {/* Writer Controls - Only show for writers */}
                        {isWriter && (
                            <div className="mb-6 pb-4 border-b border-border/20">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <Link
                                            href={`/admin/edit/${postId}`}
                                            className="inline-flex items-center px-4 py-2 bg-accent text-white hover:bg-accent-light rounded-lg transition-colors duration-200 font-medium"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                            </svg>
                                            Edit Post
                                        </Link>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${post.published
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-orange-100 text-orange-800'
                                            }`}>
                                            {post.published ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                    <div className="text-sm text-muted">
                                        {post.updatedAt && (
                                            <span>Last updated: {format(new Date(post.updatedAt), 'MMM dd, yyyy')}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex items-center text-sm text-muted mb-4">
                            <time className="font-medium">
                                <span>
                                    {(() => {
                                        try {
                                            return format(new Date(post.publishedAt), 'MMMM dd, yyyy');
                                        } catch (error) {
                                            console.error('Date formatting error:', error, 'publishedAt:', post.publishedAt);
                                            return 'Date unavailable';
                                        }
                                    })()}
                                </span>
                            </time>
                            <span className="mx-3">•</span>
                            <span>{post.readingTime} min read</span>
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-foreground mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                            <span>
                                {(() => {
                                    try {
                                        return formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true });
                                    } catch (error) {
                                        console.error('formatDistanceToNow error:', error);
                                        return 'Recently published';
                                    }
                                })()}
                            </span>
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
                        {/* Check if content contains HTML tags, if so use HTML renderer, otherwise use Markdown */}
                        {(() => {
                            console.log('Rendering content for post:', post.title, 'Content type:', typeof post.content, 'Length:', post.content.length);
                            return post.content.includes('<') && post.content.includes('>') ? (
                                <HtmlContentRenderer content={post.content} />
                            ) : (
                                <MarkdownRenderer content={post.content} />
                            );
                        })()}
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

                            {/* Writer Actions */}
                            {isWriter && (
                                <div className="flex items-center space-x-3">
                                    <Link
                                        href={`/admin/edit/${postId}`}
                                        className="inline-flex items-center px-4 py-2 border border-accent text-accent hover:bg-accent hover:text-white rounded-lg transition-colors duration-200"
                                    >
                                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                    </Link>
                                    <Link
                                        href="/admin"
                                        className="text-muted hover:text-accent transition-colors"
                                    >
                                        Dashboard
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}