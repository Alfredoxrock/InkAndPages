'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/lib/types';
import { getAllPosts, deletePost, savePost } from '@/lib/clientPosts';
import { formatDistanceToNow } from 'date-fns';

export default function AdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = () => {
    try {
      const allPosts = getAllPosts();
      setPosts(allPosts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()));
    } catch (error) {
      console.error('Error loading posts:', error);
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: string) => {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    try {
      const success = deletePost(id);
      if (success) {
        setPosts(posts.filter(post => post.id !== id));
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      alert('Failed to delete post: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  const togglePublish = (id: string, currentStatus: boolean) => {
    try {
      const post = posts.find(p => p.id === id);
      if (!post) return;

      const updatedPost = { ...post, published: !currentStatus };
      savePost(updatedPost);

      setPosts(posts.map(p =>
        p.id === id ? updatedPost : p
      ));
    } catch (error) {
      alert('Failed to update post: ' + (error instanceof Error ? error.message : 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading your stories...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-foreground mb-2">
              Writer's Dashboard
            </h1>
            <p className="text-muted">Manage your stories and create new ones</p>
          </div>

          <Link
            href="/admin/new"
            className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors duration-200 font-medium shadow-lg hover:shadow-xl flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>New Story</span>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-paper rounded-lg p-6 border border-border/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted">Published Stories</p>
                <p className="text-2xl font-bold text-foreground">
                  {posts.filter(post => post.published).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-paper rounded-lg p-6 border border-border/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-accent-light/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-accent-light" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted">Draft Stories</p>
                <p className="text-2xl font-bold text-foreground">
                  {posts.filter(post => !post.published).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-paper rounded-lg p-6 border border-border/20">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted/10 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-muted" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 102 0V3h4v1a1 1 0 102 0V3a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-muted">Total Stories</p>
                <p className="text-2xl font-bold text-foreground">{posts.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Posts List */}
        {posts.length === 0 ? (
          <div className="bg-paper rounded-lg p-12 border border-border/20 text-center">
            <div className="w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-12 h-12 text-accent/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
            </div>
            <h3 className="text-xl font-serif text-foreground mb-2">No stories yet</h3>
            <p className="text-muted mb-6">Ready to start writing? Create your first story!</p>
            <Link
              href="/admin/new"
              className="inline-block px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors duration-200 font-medium"
            >
              Write Your First Story
            </Link>
          </div>
        ) : (
          <div className="bg-paper rounded-lg border border-border/20 overflow-hidden">
            <div className="px-6 py-4 border-b border-border/20">
              <h2 className="text-xl font-serif font-bold text-foreground">Your Stories</h2>
            </div>

            <div className="divide-y divide-border/20">
              {posts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-foreground/5 transition-colors duration-200">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-serif font-bold text-foreground truncate">
                          {post.title}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${post.published
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                          }`}>
                          {post.published ? 'Published' : 'Draft'}
                        </span>
                      </div>

                      <p className="text-muted line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>

                      <div className="flex items-center space-x-4 text-sm text-muted">
                        <span>
                          Updated {formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}
                        </span>
                        <span>•</span>
                        <span>{post.readingTime} min read</span>
                        <span>•</span>
                        <span>{post.tags.length} tags</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {post.published && (
                        <Link
                          href={`/posts/${post.id}`}
                          target="_blank"
                          className="p-2 text-muted hover:text-accent transition-colors duration-200"
                          title="View post"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </Link>
                      )}

                      <Link
                        href={`/admin/edit/${post.id}`}
                        className="p-2 text-muted hover:text-accent transition-colors duration-200"
                        title="Edit post"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </Link>

                      <button
                        onClick={() => togglePublish(post.id, post.published)}
                        className="p-2 text-muted hover:text-accent transition-colors duration-200"
                        title={post.published ? 'Unpublish' : 'Publish'}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {post.published ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          )}
                        </svg>
                      </button>

                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-muted hover:text-red-500 transition-colors duration-200"
                        title="Delete post"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}