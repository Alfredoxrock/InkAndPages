'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getStoredPosts, deletePost } from '@/lib/dynamicPosts';
import { BlogPost } from '@/lib/types';

export default function AdminPage() {
  const { user, loading, isWriter, signOut } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [postsLoading, setPostsLoading] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isWriter)) {
      router.push('/login');
    }
  }, [user, loading, isWriter, router]);

  useEffect(() => {
    if (user && isWriter) {
      loadPosts();
    }
  }, [user, isWriter]);

  const loadPosts = () => {
    setPostsLoading(true);
    try {
      const userPosts = getStoredPosts();
      setPosts(userPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setPostsLoading(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      try {
        const success = deletePost(postId);
        if (success) {
          loadPosts(); // Reload posts
          alert('Post deleted successfully!');
        } else {
          alert('Failed to delete post. Post not found.');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post. Please try again.');
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isWriter) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
              Writer Dashboard
            </h1>
            <p className="text-muted">
              Welcome back, {user.email}! Ready to create your next story?
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/new"
              className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors duration-200 font-medium"
            >
              + New Story
            </Link>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm text-muted hover:text-red-500 transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-paper rounded-lg p-6 border border-border/20">
            <div className="text-2xl font-bold text-foreground mb-1">
              {posts.length}
            </div>
            <div className="text-sm text-muted">Total Stories</div>
          </div>
          <div className="bg-paper rounded-lg p-6 border border-border/20">
            <div className="text-2xl font-bold text-green-600 mb-1">
              {posts.filter(p => p.published).length}
            </div>
            <div className="text-sm text-muted">Published</div>
          </div>
          <div className="bg-paper rounded-lg p-6 border border-border/20">
            <div className="text-2xl font-bold text-orange-500 mb-1">
              {posts.filter(p => !p.published).length}
            </div>
            <div className="text-sm text-muted">Drafts</div>
          </div>
        </div>

        {/* Posts Management */}
        <div className="bg-paper rounded-lg border border-border/20">
          <div className="p-6 border-b border-border/20">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-bold text-foreground">
                Your Stories
              </h2>
              <div className="flex items-center space-x-4">
                <Link
                  href="/"
                  className="text-accent hover:text-accent-light text-sm font-medium transition-colors duration-200"
                >
                  View Blog
                </Link>
                <Link
                  href="/archive"
                  className="text-accent hover:text-accent-light text-sm font-medium transition-colors duration-200"
                >
                  View Archive
                </Link>
              </div>
            </div>
          </div>

          {postsLoading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted">Loading your stories...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 text-muted/30">
                <svg fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
                </svg>
              </div>
              <h3 className="text-lg font-serif font-bold text-foreground mb-2">
                No stories yet
              </h3>
              <p className="text-muted mb-4">
                Start writing your first story to see it here.
              </p>
              <Link
                href="/admin/new"
                className="inline-flex items-center px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors duration-200 font-medium"
              >
                Write Your First Story
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-border/20">
              {posts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-accent/5 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-serif font-bold text-foreground truncate">
                          {post.title}
                        </h3>
                        <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${post.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                          }`}>
                          <div className={`w-1.5 h-1.5 rounded-full mr-1 ${post.published ? 'bg-green-400' : 'bg-orange-400'
                            }`}></div>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>

                      {post.excerpt && (
                        <p className="text-muted text-sm mb-2 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}

                      <div className="flex items-center text-xs text-muted space-x-4">
                        <span>Created {formatDate(post.publishedAt)}</span>
                        {post.updatedAt !== post.publishedAt && (
                          <span>• Updated {formatDate(post.updatedAt)}</span>
                        )}
                        <span>• {post.readingTime} min read</span>
                        {post.tags.length > 0 && (
                          <span>• {post.tags.length} tags</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <Link
                        href={`/posts/${post.id}`}
                        className="px-3 py-2 text-sm text-accent hover:text-accent-light font-medium transition-colors duration-200"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="px-3 py-2 text-sm text-red-500 hover:text-red-700 font-medium transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}