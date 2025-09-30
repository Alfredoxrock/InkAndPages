// ...existing code...
import EditPostClient from './EditPostClient';

export default function EditPostPage({ params }: { params: { id: string } }) {
  // Directly pass the dynamic params to the client component
  return <EditPostClient postId={params.id} />;
}