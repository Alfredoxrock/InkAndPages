import { getAllPosts as getStaticPosts } from '@/lib/staticPosts';
import EditPostClient from './EditPostClient';

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

// Generate static params for all known posts at build time
// This includes both static posts and known Firestore post IDs
export async function generateStaticParams() {
  const staticPosts = getStaticPosts();

  // Add known Firestore post IDs that should be available for editing
  const knownFirestorePostIds = [
    'Iu4HU74UtKp7GsYZGGAL', // Driving into the Sunset
    'mNhsogx7T6vdzvR6cqUT', // The Mirror of Ashes
    'SEEVBkBUKtebJdch031K', // The Crown and the Mirror
    '1758773878909-the-library-of-forgotten-dreams' // The Library of Forgotten Dreams
  ];

  // Combine static posts with known Firestore IDs
  const allPostIds = [
    ...staticPosts.map((post) => ({ id: post.id })),
    ...knownFirestorePostIds.map((id) => ({ id }))
  ];

  console.log('generateStaticParams for edit pages:', allPostIds);

  return allPostIds;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  console.log('=== EditPostPage SERVER COMPONENT CALLED ===');
  const { id } = await params;
  console.log('EditPostPage: Resolved post ID:', id);

  return <EditPostClient postId={id} />;
}