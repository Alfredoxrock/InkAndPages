import {
    getFirestore,
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    getDoc,
    query,
    orderBy,
    where,
    DocumentData,
    QueryDocumentSnapshot,
    serverTimestamp,
    Timestamp
} from 'firebase/firestore';
import app from '@/lib/firebase';
import { BlogPost } from '@/lib/types';

// Initialize Firestore
const db = getFirestore(app);

// Collection reference
const POSTS_COLLECTION = 'posts';

// Helper function to convert Firestore document to BlogPost
const docToPost = (doc: QueryDocumentSnapshot<DocumentData>): BlogPost => {
    const data = doc.data();
    return {
        id: doc.id,
        title: data.title,
        excerpt: data.excerpt || '',
        content: data.content,
        publishedAt: data.publishedAt?.toDate?.()?.getTime() || data.publishedAt,
        published: data.published,
        readingTime: data.readingTime,
        tags: data.tags || [],
        createdAt: data.createdAt?.toDate?.()?.getTime() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.getTime() || data.updatedAt,
        coverImage: data.coverImage || undefined,
    };
};

// Create a new post
export const createPost = async (post: Omit<BlogPost, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> => {
    try {
        const now = serverTimestamp();
        const postData = {
            ...post,
            createdAt: now,
            updatedAt: now,
            publishedAt: post.published ? (post.publishedAt ? new Date(post.publishedAt) : now) : null
        };

        const docRef = await addDoc(collection(db, POSTS_COLLECTION), postData);
        console.log('Post created with ID:', docRef.id);
        return docRef.id;
    } catch (error) {
        console.error('Error creating post:', error);
        throw error;
    }
};

// Update an existing post
export const updatePost = async (id: string, updates: Partial<BlogPost>): Promise<void> => {
    try {
        const docRef = doc(db, POSTS_COLLECTION, id);
        const updateData: any = {
            ...updates,
            updatedAt: serverTimestamp(),
        };

        // Handle publishedAt timestamp
        if (updates.published && updates.publishedAt) {
            updateData.publishedAt = new Date(updates.publishedAt);
        } else if (updates.published && !updates.publishedAt) {
            updateData.publishedAt = serverTimestamp();
        } else if (updates.published === false) {
            updateData.publishedAt = null;
        }

        await updateDoc(docRef, updateData);
        console.log('Post updated:', id);
    } catch (error) {
        console.error('Error updating post:', error);
        throw error;
    }
};

// Delete a post
export const deletePost = async (id: string): Promise<void> => {
    try {
        const docRef = doc(db, POSTS_COLLECTION, id);
        await deleteDoc(docRef);
        console.log('Post deleted:', id);
    } catch (error) {
        console.error('Error deleting post:', error);
        throw error;
    }
};

// Get all posts
export const getAllPosts = async (): Promise<BlogPost[]> => {
    try {
        const q = query(
            collection(db, POSTS_COLLECTION),
            orderBy('createdAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map(docToPost);
        console.log(`Retrieved ${posts.length} posts from Firestore`);
        return posts;
    } catch (error) {
        console.error('Error getting all posts:', error);
        // Return empty array instead of throwing error to allow fallback to work
        return [];
    }
};

// Get published posts only
export const getPublishedPosts = async (): Promise<BlogPost[]> => {
    try {
        const q = query(
            collection(db, POSTS_COLLECTION),
            where('published', '==', true),
            orderBy('publishedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map(docToPost);
        console.log(`Retrieved ${posts.length} published posts from Firestore`);
        return posts;
    } catch (error) {
        console.error('Error getting published posts:', error);
        // Return empty array instead of throwing error to allow fallback to work
        return [];
    }
};

// Get a single post by ID
export const getPostById = async (id: string): Promise<BlogPost | null> => {
    try {
        // Validate the ID
        if (!id || typeof id !== 'string' || id.trim() === '') {
            console.log('[Firestore:getPostById] Invalid post ID provided:', id);
            return null;
        }

        // Clean the ID (Firestore doesn't like certain characters)
        const cleanId = id.trim();
        console.log(`[Firestore:getPostById] Querying Firestore for post ID: '${cleanId}'`);

        const docRef = doc(db, POSTS_COLLECTION, cleanId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const post = docToPost(docSnap as QueryDocumentSnapshot<DocumentData>);
            console.log('[Firestore:getPostById] Retrieved post:', {
                id: post.id,
                title: post.title,
                published: post.published,
                publishedAt: post.publishedAt,
                tags: post.tags,
                coverImage: post.coverImage,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt
            });
            return post;
        } else {
            console.log(`[Firestore:getPostById] No post found with ID: '${cleanId}'`);
            return null;
        }
    } catch (error) {
        console.error('[Firestore:getPostById] Error getting post by ID:', error, 'Queried ID:', id);
        return null; // Return null instead of throwing to allow fallback
    }
};

// Get posts by tag
export const getPostsByTag = async (tag: string): Promise<BlogPost[]> => {
    try {
        const q = query(
            collection(db, POSTS_COLLECTION),
            where('tags', 'array-contains', tag),
            where('published', '==', true),
            orderBy('publishedAt', 'desc')
        );
        const querySnapshot = await getDocs(q);
        const posts = querySnapshot.docs.map(docToPost);
        console.log(`Retrieved ${posts.length} posts with tag "${tag}" from Firestore`);
        return posts;
    } catch (error) {
        console.error('Error getting posts by tag:', error);
        throw error;
    }
};

// Search posts by title or content
export const searchPosts = async (searchTerm: string): Promise<BlogPost[]> => {
    try {
        // Note: Firestore doesn't have full-text search built-in
        // This is a simple implementation that gets all posts and filters client-side
        // For production, consider using Algolia or Firebase's full-text search extensions
        const allPosts = await getPublishedPosts();
        const searchTermLower = searchTerm.toLowerCase();

        const filteredPosts = allPosts.filter(post =>
            post.title.toLowerCase().includes(searchTermLower) ||
            post.content.toLowerCase().includes(searchTermLower) ||
            post.tags.some(tag => tag.toLowerCase().includes(searchTermLower))
        );

        console.log(`Found ${filteredPosts.length} posts matching "${searchTerm}"`);
        return filteredPosts;
    } catch (error) {
        console.error('Error searching posts:', error);
        throw error;
    }
};

// Migration helper: Save existing localStorage posts to Firestore
export const migrateLocalStoragePosts = async (): Promise<void> => {
    try {
        // Get posts from localStorage
        const localPosts = localStorage.getItem('blog_posts');
        if (!localPosts) {
            console.log('No posts found in localStorage');
            return;
        }

        const posts: BlogPost[] = JSON.parse(localPosts);
        console.log(`Found ${posts.length} posts in localStorage, migrating to Firestore...`);

        // Save each post to Firestore
        const migrationPromises = posts.map(async (post) => {
            try {
                // Use the original post data but let Firestore generate new IDs
                const { id, ...postData } = post;
                const newId = await createPost(postData);
                console.log(`Migrated post "${post.title}" with new ID: ${newId}`);
                return newId;
            } catch (error) {
                console.error(`Failed to migrate post "${post.title}":`, error);
                return null;
            }
        });

        const results = await Promise.all(migrationPromises);
        const successful = results.filter(id => id !== null).length;

        console.log(`Migration complete: ${successful}/${posts.length} posts migrated successfully`);

        // Optionally clear localStorage after successful migration
        if (successful === posts.length) {
            localStorage.removeItem('blog_posts');
            console.log('Cleared localStorage after successful migration');
        }
    } catch (error) {
        console.error('Error during migration:', error);
        throw error;
    }
};

// Clear all posts from Firestore
export const clearAllPosts = async (): Promise<void> => {
    try {
        console.log('Starting to clear all posts from Firestore...');

        const q = query(collection(db, POSTS_COLLECTION));
        const querySnapshot = await getDocs(q);

        console.log(`Found ${querySnapshot.docs.length} posts to delete`);

        // Delete all posts
        const deletePromises = querySnapshot.docs.map(async (docSnapshot) => {
            try {
                await deleteDoc(docSnapshot.ref);
                console.log(`Deleted post: ${docSnapshot.data().title}`);
            } catch (error) {
                console.error(`Failed to delete post ${docSnapshot.id}:`, error);
            }
        });

        await Promise.all(deletePromises);
        console.log('All Firestore posts have been cleared');
    } catch (error) {
        console.error('Error clearing all posts:', error);
        throw error;
    }
};