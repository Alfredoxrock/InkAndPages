// Main posts interface - combines static, Firestore, and localStorage posts
import { getAllPosts as getStaticPosts, getPublishedPosts as getStaticPublishedPosts, getPostById as getStaticPostById } from './staticPosts';
import { getStoredPosts, getPostById as getDynamicPostById } from './dynamicPosts';
import {
    getAllPosts as getFirestorePosts,
    getPublishedPosts as getFirestorePublishedPosts,
    getPostById as getFirestorePostById,
    createPost as createFirestorePost,
    updatePost as updateFirestorePost,
    deletePost as deleteFirestorePost,
    migrateLocalStoragePosts,
    clearAllPosts as clearAllFirestorePosts
} from './firestore';
import { BlogPost } from './types';

// Get all posts (Firestore + static + localStorage fallback)
export async function getAllPosts(): Promise<BlogPost[]> {
    try {
        // Try to get posts from Firestore first
        const firestorePosts = await getFirestorePosts();

        // Also get static posts
        const staticPosts = getStaticPosts();

        // Get localStorage posts as fallback
        const dynamicPosts = typeof window !== 'undefined' ? getStoredPosts() : [];

        // Combine all posts (Firestore takes priority, then static, then localStorage)
        const allPosts = [...firestorePosts];

        // Add static posts that aren't already in Firestore
        for (const staticPost of staticPosts) {
            if (!allPosts.find(post => post.id === staticPost.id)) {
                allPosts.push(staticPost);
            }
        }

        // Add localStorage posts that aren't in Firestore or static
        for (const dynamicPost of dynamicPosts) {
            if (!allPosts.find(post => post.id === dynamicPost.id)) {
                allPosts.push(dynamicPost);
            }
        }

        // Sort by publishedAt date (newest first)
        return allPosts.sort((a, b) => {
            const aTime = typeof a.publishedAt === 'string' ? new Date(a.publishedAt).getTime() : a.publishedAt;
            const bTime = typeof b.publishedAt === 'string' ? new Date(b.publishedAt).getTime() : b.publishedAt;
            return bTime - aTime;
        });
    } catch (error) {
        console.error('Error fetching posts from Firestore, falling back to local data:', error);
        // Fallback to original behavior
        const staticPosts = getStaticPosts();
        const dynamicPosts = typeof window !== 'undefined' ? getStoredPosts() : [];
        const allPosts = [...dynamicPosts, ...staticPosts];
        return allPosts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }
}

// Get published posts only
export async function getPublishedPosts(): Promise<BlogPost[]> {
    const allPosts = await getAllPosts();
    return allPosts.filter(post => post.published);
}

// Get post by ID (check Firestore first, then static, then localStorage)
export async function getPostByIdAsync(id: string): Promise<BlogPost | null> {
    try {
        console.log('getPostByIdAsync called with ID:', id);

        // Validate ID
        if (!id || typeof id !== 'string') {
            console.log('Invalid ID provided to getPostByIdAsync:', id);
            return null;
        }

        // First check Firestore
        console.log('Checking Firestore for post ID:', id);
        const firestorePost = await getFirestorePostById(id);
        if (firestorePost) {
            console.log('Found post in Firestore:', firestorePost.title);
            return firestorePost;
        }

        // Then check static posts
        console.log('Checking static posts for ID:', id);
        const staticPost = getStaticPostById(id);
        if (staticPost) {
            console.log('Found post in static posts:', staticPost.title);
            return staticPost;
        }

        // Finally check localStorage
        if (typeof window !== 'undefined') {
            console.log('Checking localStorage for ID:', id);
            const localPost = getDynamicPostById(id);
            if (localPost) {
                console.log('Found post in localStorage:', localPost.title);
                return localPost;
            }
        }

        console.log('Post not found anywhere for ID:', id);
        return null;
    } catch (error) {
        console.error('Error in getPostByIdAsync:', error);
        // Fallback to synchronous version
        console.log('Falling back to synchronous getPostById');
        return getPostById(id);
    }
}

// Synchronous version for compatibility (uses cached/local data only)
export function getPostById(id: string): BlogPost | null {
    // First check static posts (always available)
    const staticPost = getStaticPostById(id);
    if (staticPost) return staticPost;

    // Then check localStorage
    if (typeof window !== 'undefined') {
        const dynamicPost = getDynamicPostById(id);
        if (dynamicPost) return dynamicPost;
    }

    return null;
}

// Create a new post (saves to Firestore)
export async function createPost(post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
        return await createFirestorePost(post);
    } catch (error) {
        console.error('Error creating post in Firestore:', error);
        throw error;
    }
}

// Update a post
export async function updatePost(id: string, updates: Partial<BlogPost>): Promise<void> {
    try {
        await updateFirestorePost(id, updates);
    } catch (error) {
        console.error('Error updating post in Firestore:', error);
        throw error;
    }
}

// Delete a post
export async function deletePost(id: string): Promise<void> {
    try {
        await deleteFirestorePost(id);
    } catch (error) {
        console.error('Error deleting post in Firestore:', error);
        throw error;
    }
}

// Migration function
export async function migratePosts(): Promise<void> {
    if (typeof window === 'undefined') return;

    try {
        await migrateLocalStoragePosts();
    } catch (error) {
        console.error('Error during migration:', error);
    }
}

// Clear all posts from all sources
export async function clearAllPosts(): Promise<void> {
    try {
        console.log('🧹 Starting to clear all posts from all sources...');

        // Clear Firestore posts
        await clearAllFirestorePosts();

        // Clear localStorage posts
        if (typeof window !== 'undefined') {
            localStorage.removeItem('blog_posts');
            console.log('✅ Cleared localStorage posts');
        }

        console.log('🎉 All posts have been cleared from all sources!');
    } catch (error) {
        console.error('❌ Error clearing posts:', error);
        throw error;
    }
}

export type { BlogPost, BlogPostMetadata } from './types';