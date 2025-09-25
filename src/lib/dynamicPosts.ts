// Client-side post management for dynamic posts
import { BlogPost } from './types';

const POSTS_STORAGE_KEY = 'inkandpages_posts';

// Generate a unique post ID
export function generatePostId(title: string): string {
    const timestamp = Date.now();
    const slug = title
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-')
        .trim();
    return `${timestamp}-${slug}`;
}

// Get all posts from localStorage
export function getStoredPosts(): BlogPost[] {
    if (typeof window === 'undefined') return [];
    
    try {
        const stored = localStorage.getItem(POSTS_STORAGE_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error('Error reading posts from localStorage:', error);
        return [];
    }
}

// Save posts to localStorage
export function savePostsToStorage(posts: BlogPost[]): void {
    if (typeof window === 'undefined') return;
    
    try {
        localStorage.setItem(POSTS_STORAGE_KEY, JSON.stringify(posts));
    } catch (error) {
        console.error('Error saving posts to localStorage:', error);
        throw new Error('Failed to save posts');
    }
}

// Save a single post
export function savePost(postData: {
    title: string;
    content: string;
    excerpt: string;
    tags: string;
    published: boolean;
}): BlogPost {
    const now = new Date().toISOString();
    const tagArray = postData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);

    const newPost: BlogPost = {
        id: generatePostId(postData.title),
        title: postData.title.trim(),
        excerpt: postData.excerpt.trim() || generateExcerpt(postData.content),
        content: postData.content.trim(),
        publishedAt: now,
        updatedAt: now,
        tags: tagArray,
        readingTime: calculateReadingTime(postData.content),
        published: postData.published,
    };

    const existingPosts = getStoredPosts();
    const updatedPosts = [newPost, ...existingPosts];
    savePostsToStorage(updatedPosts);

    return newPost;
}

// Update an existing post
export function updatePost(id: string, postData: {
    title: string;
    content: string;
    excerpt: string;
    tags: string;
    published: boolean;
}): BlogPost | null {
    const existingPosts = getStoredPosts();
    const postIndex = existingPosts.findIndex(post => post.id === id);
    
    if (postIndex === -1) {
        return null;
    }

    const now = new Date().toISOString();
    const tagArray = postData.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean);

    const updatedPost: BlogPost = {
        ...existingPosts[postIndex],
        title: postData.title.trim(),
        excerpt: postData.excerpt.trim() || generateExcerpt(postData.content),
        content: postData.content.trim(),
        updatedAt: now,
        tags: tagArray,
        readingTime: calculateReadingTime(postData.content),
        published: postData.published,
    };

    existingPosts[postIndex] = updatedPost;
    savePostsToStorage(existingPosts);

    return updatedPost;
}

// Delete a post
export function deletePost(id: string): boolean {
    const existingPosts = getStoredPosts();
    const filteredPosts = existingPosts.filter(post => post.id !== id);
    
    if (filteredPosts.length === existingPosts.length) {
        return false; // Post not found
    }

    savePostsToStorage(filteredPosts);
    return true;
}

// Get a single post by ID
export function getPostById(id: string): BlogPost | null {
    const posts = getStoredPosts();
    return posts.find(post => post.id === id) || null;
}

// Helper function to generate excerpt from content
function generateExcerpt(content: string, maxLength: number = 150): string {
    const plainText = content
        .replace(/#{1,6}\s+/g, '') // Remove markdown headers
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
        .replace(/\*(.*?)\*/g, '$1') // Remove italic
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links
        .replace(/`([^`]+)`/g, '$1') // Remove code
        .trim();

    if (plainText.length <= maxLength) {
        return plainText;
    }

    return plainText.substring(0, maxLength).replace(/\s+\S*$/, '') + '...';
}

// Helper function to calculate reading time
function calculateReadingTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.trim().split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}