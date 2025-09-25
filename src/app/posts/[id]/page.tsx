import { getAllPosts as getStaticPosts } from '@/lib/staticPosts';
import PostPageClient from './PostPageClient';

// Generate static params for all known posts
export async function generateStaticParams() {
  const staticPosts = getStaticPosts();
  return staticPosts.map((post) => ({
    id: post.id,
  }));
}

interface PostPageProps {
  params: {
    id: string;
  };
}

export default function PostPage({ params }: PostPageProps) {
  return <PostPageClient params={params} />;
}