import { getPublishedPosts } from '@/lib/firestore';
import { BlogPost } from '@/lib/types';
import { getAllPosts as getStaticPosts } from '@/lib/staticPosts';

export const dynamic = 'force-static';

export default async function sitemap() {
    const baseUrl = 'https://inkandpages-6d158.web.app';

    // For static export, we'll use static posts only
    // Dynamic posts from Firestore won't be available at build time
    let posts: BlogPost[] = [];
    try {
        // Use static posts for build time
        posts = getStaticPosts().filter(post => post.published);
    } catch (error) {
        console.error('Error fetching posts for sitemap:', error);
        posts = [];
    }

    // Static pages
    const staticPages = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 1,
        },
        {
            url: `${baseUrl}/about`,
            lastModified: new Date(),
            changeFrequency: 'monthly' as const,
            priority: 0.8,
        },
        {
            url: `${baseUrl}/archive`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.7,
        },
    ];

    // Dynamic post pages
    const postPages = posts.map((post: BlogPost) => ({
        url: `${baseUrl}/posts/${post.id}`,
        lastModified: new Date(post.updatedAt || post.publishedAt),
        changeFrequency: 'monthly' as const,
        priority: 0.9,
    }));

    return [...staticPages, ...postPages];
}