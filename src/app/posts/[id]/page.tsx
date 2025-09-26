import { getAllPosts as getStaticPosts } from '@/lib/staticPosts';
import { getPostById } from '@/lib/firestore';
import { BlogPost } from '@/lib/types';
import { Metadata } from 'next';
import PostPageClient from './PostPageClient';

// Generate metadata for individual posts
export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params;

  let post: BlogPost | null = null;

  // Try to get the post from Firestore first
  try {
    post = await getPostById(id);
  } catch (error) {
    console.log('Post not found in Firestore, checking static posts');
  }

  // Fallback to static posts if not found in Firestore
  if (!post) {
    const staticPosts = getStaticPosts();
    post = staticPosts.find(p => p.id === id) || null;
  }

  if (!post) {
    return {
      title: 'Post Not Found - Ink & Pages',
      description: 'The requested post could not be found.',
    };
  }

  // If post is not published, return generic metadata for non-writers
  if (!post.published) {
    return {
      title: 'Draft Post - Ink & Pages',
      description: 'This post is currently in draft mode.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const postDescription = post.excerpt ||
    post.content.replace(/<[^>]*>/g, '').substring(0, 160) + '...';

  return {
    title: `${post.title} - Ink & Pages`,
    description: postDescription,
    keywords: [...post.tags, 'writing', 'blog', 'story'],
    authors: [{ name: 'Ink & Pages' }],
    alternates: {
      canonical: `/posts/${post.id}`,
    },
    openGraph: {
      title: post.title,
      description: postDescription,
      type: 'article',
      publishedTime: new Date(post.publishedAt).toISOString(),
      modifiedTime: new Date(post.updatedAt || post.publishedAt).toISOString(),
      authors: ['Ink & Pages'],
      tags: post.tags,
      url: `https://inkandpages-6d158.web.app/posts/${post.id}`,
      siteName: 'Ink & Pages',
      locale: 'en_US',
      images: [
        {
          url: '/og-image.jpg',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: postDescription,
      creator: '@inkandpages',
      images: ['/og-image.jpg'],
    },
    robots: {
      index: post.published,
      follow: true,
    },
  };
}

// Generate static params for all known posts at build time
// Note: This only includes static posts. Dynamic posts created through admin
// will be handled client-side in PostPageClient
export async function generateStaticParams() {
  const staticPosts = getStaticPosts();

  // If no static posts exist, return an empty array
  if (staticPosts.length === 0) {
    return [];
  }

  return staticPosts.map((post) => ({
    id: post.id,
  }));
}

interface PostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function PostPage({ params }: PostPageProps) {
  console.log('=== PostPage WRAPPER COMPONENT CALLED ===');
  console.log('PostPage received params:', params);
  return <PostPageClient params={params} />;
}