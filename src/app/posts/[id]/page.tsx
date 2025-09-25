import { getAllPosts as getStaticPosts } from '@/lib/staticPosts';
import PostPageClient from './PostPageClient';

// Generate static params for all known posts at build time
// Note: This only includes static posts. Dynamic posts created through admin
// will be handled client-side in PostPageClient
export async function generateStaticParams() {
  const staticPosts = getStaticPosts();
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