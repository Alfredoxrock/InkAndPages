'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/posts";
import { BlogPost } from "@/lib/types";
import { formatDistanceToNow, format } from "date-fns";

type LayoutType = 'current' | 'grid-2' | 'grid-3' | 'magazine' | 'horizontal' | 'masonry' | 'card-image';

export default function CardLayoutsDemo() {
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentLayout, setCurrentLayout] = useState<LayoutType>('current');

    useEffect(() => {
        const loadPosts = async () => {
            try {
                const publishedPosts = await getPublishedPosts();
                setPosts(publishedPosts);
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
            <div className="min-h-screen bg-gradient-to-br from-background via-paper to-background">
                <div className="container mx-auto px-4 py-16">
                    <div className="max-w-6xl mx-auto">
                        <div className="animate-pulse text-center">
                            <div className="h-8 bg-gray-200 rounded mb-8 max-w-md mx-auto"></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="h-48 bg-gray-200 rounded"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const layouts = [
        { key: 'current', name: 'Current (Single Column)', icon: '📝' },
        { key: 'grid-2', name: '2-Column Grid', icon: '📊' },
        { key: 'grid-3', name: '3-Column Grid', icon: '🎯' },
        { key: 'magazine', name: 'Magazine Style', icon: '📰' },
        { key: 'horizontal', name: 'Horizontal Cards', icon: '📋' },
        { key: 'masonry', name: 'Masonry Layout', icon: '🧱' },
        { key: 'card-image', name: 'Cards with Images', icon: '🖼️' }
    ];

    const renderCurrentLayout = () => (
        <div className="space-y-12">
            {posts.slice(0, 3).map((post) => (
                <article key={post.id} className="bg-paper/60 backdrop-blur-sm rounded-lg border border-border/30 p-8 hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-center text-sm text-muted mb-4">
                        <time className="font-medium">
                            {format(new Date(post.publishedAt), 'MMMM dd, yyyy')}
                        </time>
                        <span className="mx-3">•</span>
                        <span>{post.readingTime} min read</span>
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
                                <span key={tag} className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm rounded-full hover:bg-accent/20 transition-colors duration-200">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        <Link href={`/posts/${post.id}`} className="inline-flex items-center text-accent hover:text-accent-light font-medium transition-colors duration-200 group/link">
                            Read Story
                            <svg className="w-4 h-4 ml-2 transition-transform duration-200 group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </article>
            ))}
        </div>
    );

    const renderGrid2Layout = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.slice(0, 6).map((post) => (
                <article key={post.id} className="bg-paper/60 backdrop-blur-sm rounded-lg border border-border/30 p-6 hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-center text-sm text-muted mb-3">
                        <time>{format(new Date(post.publishedAt), 'MMM dd, yyyy')}</time>
                        <span className="mx-2">•</span>
                        <span>{post.readingTime} min</span>
                    </div>

                    <Link href={`/posts/${post.id}`}>
                        <h2 className="text-xl font-serif font-bold text-foreground mb-3 leading-tight group-hover:text-accent transition-colors cursor-pointer">
                            {post.title}
                        </h2>
                    </Link>

                    <p className="text-muted leading-relaxed mb-4 line-clamp-3">
                        {post.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex gap-1">
                            {post.tags.slice(0, 2).map((tag) => (
                                <span key={tag} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        <Link href={`/posts/${post.id}`} className="text-accent hover:text-accent-light text-sm font-medium">
                            Read →
                        </Link>
                    </div>
                </article>
            ))}
        </div>
    );

    const renderGrid3Layout = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.slice(0, 9).map((post) => (
                <article key={post.id} className="bg-paper/60 backdrop-blur-sm rounded-lg border border-border/30 p-4 hover:shadow-xl transition-all duration-300 group cursor-pointer">
                    <Link href={`/posts/${post.id}`}>
                        <div className="mb-3">
                            <span className="text-xs text-muted">{format(new Date(post.publishedAt), 'MMM dd')}</span>
                        </div>

                        <h3 className="text-lg font-serif font-bold text-foreground mb-2 leading-tight group-hover:text-accent transition-colors line-clamp-2">
                            {post.title}
                        </h3>

                        <p className="text-sm text-muted leading-relaxed line-clamp-3 mb-3">
                            {post.excerpt}
                        </p>

                        <div className="flex items-center justify-between text-xs">
                            <span className="text-muted">{post.readingTime} min</span>
                            <div className="flex gap-1">
                                {post.tags.slice(0, 1).map((tag) => (
                                    <span key={tag} className="px-2 py-1 bg-accent/10 text-accent rounded-full">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </Link>
                </article>
            ))}
        </div>
    );

    const renderMagazineLayout = () => (
        <div>
            {/* Featured Post */}
            {posts[0] && (
                <article className="bg-paper/60 backdrop-blur-sm rounded-lg border border-border/30 p-8 mb-12 hover:shadow-xl transition-all duration-300 group">
                    <div className="flex items-center text-sm text-muted mb-4">
                        <span className="px-3 py-1 bg-accent text-white rounded-full text-xs font-medium">Featured</span>
                        <span className="ml-3">{format(new Date(posts[0].publishedAt), 'MMMM dd, yyyy')}</span>
                    </div>

                    <Link href={`/posts/${posts[0].id}`}>
                        <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 leading-tight group-hover:text-accent transition-colors cursor-pointer">
                            {posts[0].title}
                        </h1>
                    </Link>

                    <p className="text-lg text-muted leading-relaxed mb-6">
                        {posts[0].excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex gap-2">
                            {posts[0].tags.map((tag) => (
                                <span key={tag} className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                        <Link href={`/posts/${posts[0].id}`} className="text-accent hover:text-accent-light font-medium">
                            Read Full Story →
                        </Link>
                    </div>
                </article>
            )}

            {/* Other Posts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.slice(1, 7).map((post) => (
                    <article key={post.id} className="bg-paper/60 backdrop-blur-sm rounded-lg border border-border/30 p-4 hover:shadow-xl transition-all duration-300 group">
                        <Link href={`/posts/${post.id}`}>
                            <div className="mb-2">
                                <span className="text-xs text-muted">{format(new Date(post.publishedAt), 'MMM dd')}</span>
                            </div>

                            <h3 className="text-base font-serif font-bold text-foreground mb-2 leading-tight group-hover:text-accent transition-colors line-clamp-2">
                                {post.title}
                            </h3>

                            <p className="text-sm text-muted line-clamp-2 mb-3">
                                {post.excerpt}
                            </p>

                            <div className="flex gap-1">
                                {post.tags.slice(0, 2).map((tag) => (
                                    <span key={tag} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </Link>
                    </article>
                ))}
            </div>
        </div>
    );

    const renderHorizontalLayout = () => (
        <div className="space-y-6">
            {posts.slice(0, 5).map((post) => (
                <article key={post.id} className="flex bg-paper/60 backdrop-blur-sm rounded-lg border border-border/30 p-6 hover:shadow-xl transition-all duration-300 group">
                    <div className="flex-1">
                        <div className="flex items-center text-sm text-muted mb-2">
                            <time>{format(new Date(post.publishedAt), 'MMM dd')}</time>
                            <span className="mx-2">•</span>
                            <span>{post.readingTime} min</span>
                        </div>

                        <Link href={`/posts/${post.id}`}>
                            <h2 className="text-xl font-serif font-bold text-foreground mb-2 group-hover:text-accent transition-colors cursor-pointer">
                                {post.title}
                            </h2>
                        </Link>

                        <p className="text-muted text-sm line-clamp-2 mb-3">
                            {post.excerpt}
                        </p>

                        <div className="flex gap-2">
                            {post.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    <div className="ml-6 flex items-center">
                        <Link href={`/posts/${post.id}`} className="text-accent hover:text-accent-light">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                        </Link>
                    </div>
                </article>
            ))}
        </div>
    );

    const renderMasonryLayout = () => (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
            {posts.slice(0, 8).map((post, index) => (
                <article key={post.id} className="break-inside-avoid bg-paper/60 backdrop-blur-sm rounded-lg border border-border/30 p-4 hover:shadow-xl transition-all duration-300 group mb-6">
                    <Link href={`/posts/${post.id}`}>
                        <div className="mb-3">
                            <span className="text-xs text-muted">{format(new Date(post.publishedAt), 'MMM dd')}</span>
                        </div>

                        <h3 className="text-lg font-serif font-bold text-foreground mb-2 leading-tight group-hover:text-accent transition-colors">
                            {post.title}
                        </h3>

                        <p className="text-sm text-muted leading-relaxed mb-3" style={{
                            display: '-webkit-box',
                            WebkitLineClamp: Math.floor((post.excerpt || '').length / 80) + 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                        }}>
                            {post.excerpt}
                        </p>

                        <div className="flex flex-wrap gap-1 mb-3">
                            {post.tags.map((tag) => (
                                <span key={tag} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                                    #{tag}
                                </span>
                            ))}
                        </div>

                        <div className="text-accent hover:text-accent-light text-sm font-medium">
                            Read Story →
                        </div>
                    </Link>
                </article>
            ))}
        </div>
    );

    const renderCardImageLayout = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.slice(0, 6).map((post) => (
                <article key={post.id} className="bg-paper/60 backdrop-blur-sm rounded-lg border border-border/30 overflow-hidden hover:shadow-xl transition-all duration-300 group">
                    <Link href={`/posts/${post.id}`}>
                        {/* Image placeholder */}
                        <div className="h-48 bg-gradient-to-br from-accent/20 to-accent-light/20 flex items-center justify-center group-hover:from-accent/30 group-hover:to-accent-light/30 transition-all duration-300">
                            <div className="w-16 h-16 bg-accent/30 rounded-full flex items-center justify-center group-hover:bg-accent/40 transition-all duration-300">
                                <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                            </div>
                        </div>

                        <div className="p-6">
                            <div className="flex items-center text-sm text-muted mb-3">
                                <time>{format(new Date(post.publishedAt), 'MMM dd, yyyy')}</time>
                                <span className="mx-2">•</span>
                                <span>{post.readingTime} min</span>
                            </div>

                            <h2 className="text-xl font-serif font-bold text-foreground mb-3 leading-tight group-hover:text-accent transition-colors">
                                {post.title}
                            </h2>

                            <p className="text-muted leading-relaxed mb-4 line-clamp-3">
                                {post.excerpt}
                            </p>

                            <div className="flex items-center justify-between">
                                <div className="flex gap-2">
                                    {post.tags.slice(0, 2).map((tag) => (
                                        <span key={tag} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                                <div className="text-accent hover:text-accent-light text-sm font-medium">
                                    Read →
                                </div>
                            </div>
                        </div>
                    </Link>
                </article>
            ))}
        </div>
    );

    const renderLayout = () => {
        switch (currentLayout) {
            case 'current': return renderCurrentLayout();
            case 'grid-2': return renderGrid2Layout();
            case 'grid-3': return renderGrid3Layout();
            case 'magazine': return renderMagazineLayout();
            case 'horizontal': return renderHorizontalLayout();
            case 'masonry': return renderMasonryLayout();
            case 'card-image': return renderCardImageLayout();
            default: return renderCurrentLayout();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-paper to-background">
            <div className="container mx-auto px-4 py-16">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12">
                        <Link href="/" className="text-accent hover:text-accent-light mb-4 inline-block">
                            ← Back to Blog
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
                            Card Layout Showcase
                        </h1>
                        <p className="text-lg text-muted max-w-2xl mx-auto">
                            Explore different ways to display your blog posts. Click on any layout to see it in action!
                        </p>
                    </div>

                    {/* Layout Switcher */}
                    <div className="mb-12">
                        <div className="flex flex-wrap gap-3 justify-center">
                            {layouts.map((layout) => (
                                <button
                                    key={layout.key}
                                    onClick={() => setCurrentLayout(layout.key as LayoutType)}
                                    className={`px-4 py-2 rounded-lg border transition-all duration-200 flex items-center gap-2 ${currentLayout === layout.key
                                            ? 'bg-accent text-white border-accent shadow-lg'
                                            : 'bg-paper/60 text-foreground border-border/30 hover:border-accent hover:shadow-md'
                                        }`}
                                >
                                    <span>{layout.icon}</span>
                                    <span className="text-sm font-medium">{layout.name}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Current Layout Display */}
                    <div className="mb-8">
                        <div className="flex items-center justify-center mb-6">
                            <div className="px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium">
                                Currently viewing: {layouts.find(l => l.key === currentLayout)?.name}
                            </div>
                        </div>

                        {renderLayout()}
                    </div>

                    {/* Layout Info */}
                    <div className="mt-16 bg-paper/40 backdrop-blur-sm rounded-lg border border-border/30 p-6">
                        <h3 className="text-xl font-serif font-bold text-foreground mb-4">Layout Details:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted">
                            <div>
                                <strong>Best for:</strong> {
                                    {
                                        'current': 'Reading focus, detailed content',
                                        'grid-2': 'Balanced view, good for most blogs',
                                        'grid-3': 'Quick browsing, many posts',
                                        'magazine': 'Featured content, professional look',
                                        'horizontal': 'Clean lists, easy scanning',
                                        'masonry': 'Visual variety, content discovery',
                                        'card-image': 'Visual appeal, modern design'
                                    }[currentLayout]
                                }
                            </div>
                            <div>
                                <strong>Mobile friendly:</strong> {
                                    ['current', 'grid-2', 'magazine', 'horizontal', 'card-image'].includes(currentLayout) ? '✅ Excellent' :
                                        ['grid-3'].includes(currentLayout) ? '⚠️ Good' : '⚠️ Compact'
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}