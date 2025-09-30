// ...existing code...
import PostPageClient from './PostPageClient';

export default function PostPage({ params }: { params: { id: string } }) {
  // Directly pass the dynamic params to the client component
  return <PostPageClient params={Promise.resolve(params)} />;
}