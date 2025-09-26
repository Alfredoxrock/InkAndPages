import { getAllPosts as getStaticPosts } from '@/lib/staticPosts';
import EditPostClient from './EditPostClient';

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

// Generate static params for all known posts at build time
// Note: This only includes static posts. Dynamic posts created through admin
// will be handled client-side in EditPostClient
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

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;

  return <EditPostClient postId={id} />;
}