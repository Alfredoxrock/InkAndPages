// Main posts interface - combines static and dynamic posts
import { getAllPosts as getStaticPosts, getPublishedPosts as getStaticPublishedPosts, getPostById as getStaticPostById } from './staticPosts';
import { getStoredPosts, getPostById as getDynamicPostById } from './dynamicPosts';
import { BlogPost } from './types';

// Get all posts (static + dynamic)
export function getAllPosts(): BlogPost[] {
    const staticPosts = getStaticPosts();
    const dynamicPosts = typeof window !== 'undefined' ? getStoredPosts() : [];
    
    // Combine and sort by publishedAt date (newest first)
    const allPosts = [...dynamicPosts, ...staticPosts];
    return allPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

// Get published posts only
export function getPublishedPosts(): BlogPost[] {
    return getAllPosts().filter(post => post.published);
}

// Get post by ID (check dynamic first, then static)
export function getPostById(id: string): BlogPost | null {
    // First check dynamic posts
    if (typeof window !== 'undefined') {
        const dynamicPost = getDynamicPostById(id);
        if (dynamicPost) return dynamicPost;
    }
    
    // Then check static posts
    return getStaticPostById(id);
}

export type { BlogPost, BlogPostMetadata } from './types';