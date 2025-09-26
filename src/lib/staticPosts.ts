// Static posts for server-side generation
import { BlogPost } from './types';

// Static posts - currently empty (all posts removed)
// Note: We keep one dummy post to satisfy Next.js export requirements
// This post will not be displayed since it's marked as unpublished
export const STATIC_POSTS: BlogPost[] = [
    {
        id: "dummy-post-for-build",
        title: "Build Placeholder",
        excerpt: "This is a placeholder post required for Next.js static export builds.",
        content: "This post should never be displayed.",
        publishedAt: new Date().toISOString(),
        tags: [],
        readingTime: 1,
        published: false, // Important: not published so it won't show
    }
];

// Helper function to calculate reading time
function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}

// Get all posts
export function getAllPosts(): BlogPost[] {
    return STATIC_POSTS;
}

// Get published posts only
export function getPublishedPosts(): BlogPost[] {
    return STATIC_POSTS
        .filter(post => post.published)
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

// Get post by ID
export function getPostById(id: string): BlogPost | null {
    return STATIC_POSTS.find(post => post.id === id) || null;
}