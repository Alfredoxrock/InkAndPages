'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { BlogPost } from '@/lib/types';
import { getPostById, savePost, getAllPosts } from '@/lib/clientPosts';
import MarkdownRenderer from '@/components/MarkdownRenderer';

// Generate static params for all posts
export function generateStaticParams() {
  try {
    // We'll import the static posts here for build-time generation
    const { getAllPosts: getStaticPosts } = require('@/lib/staticPosts');
    const posts = getStaticPosts();
    return posts.map((post: any) => ({
      id: post.id,
    }));
  } catch {
    return [];
  }
}

export default function EditPostPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [originalPost, setOriginalPost] = useState<BlogPost | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    tags: '',
    published: false
  });

  useEffect(() => {
    loadPost();
  }, [id]);

  const loadPost = () => {
    try {
      const post = getPostById(id);
      if (!post) {
        setError('Post not found');
        setIsLoading(false);
        return;
      }

      setOriginalPost(post);
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        tags: post.tags.join(', '),
        published: post.published
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSave = (publish = false) => {
    if (!formData.title.trim() || !formData.content.trim()) {
      alert('Please fill in the title and content fields.');
      return;
    }

    if (!originalPost) {
      alert('Original post not found');
      return;
    }

    setIsSaving(true);

    try {
      const updatedPost: BlogPost = {
        ...originalPost,
        title: formData.title.trim(),
        excerpt: formData.excerpt.trim() || formData.content.substring(0, 200) + '...',
        content: formData.content.trim(),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        published: publish || formData.published,
        updatedAt: new Date().toISOString()
      };

      savePost(updatedPost);

      if (publish || formData.published) {
        router.push(`/posts/${updatedPost.id}`);
      } else {
        router.push('/admin');
      }
    } catch (error) {
      alert('Error saving post: ' + (error instanceof Error ? error.message : 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading post...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-600">
          <p className="text-xl mb-4">Error: {error}</p>
          <Link
            href="/admin"
            className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors duration-200"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin"
              className="p-2 text-muted hover:text-accent transition-colors duration-200 rounded-lg hover:bg-foreground/5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Link>
            <div>
              <h1 className="text-3xl font-serif font-bold text-foreground">
                Edit Story
              </h1>
              <p className="text-muted">Refine your thoughts and words</p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="px-4 py-2 border-2 border-border text-muted hover:border-accent hover:text-accent transition-colors duration-200 rounded-lg font-medium"
            >
              {isPreview ? 'Edit' : 'Preview'}
            </button>

            <button
              onClick={() => handleSave(false)}
              disabled={isSaving}
              className="px-4 py-2 bg-muted text-white rounded-lg hover:bg-muted/80 transition-colors duration-200 font-medium disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Draft'}
            </button>

            <button
              onClick={() => handleSave(true)}
              disabled={isSaving}
              className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors duration-200 font-medium disabled:opacity-50"
            >
              {isSaving ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div className={`space-y-6 ${isPreview ? 'hidden lg:block' : ''}`}>
            <div className="bg-paper rounded-lg border border-border/20 overflow-hidden">
              <div className="px-6 py-4 border-b border-border/20 bg-foreground/5">
                <h2 className="font-serif font-bold text-foreground">Story Details</h2>
              </div>

              <div className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-background text-foreground text-lg font-serif"
                    placeholder="Enter your story title..."
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label htmlFor="excerpt" className="block text-sm font-medium text-foreground mb-2">
                    Excerpt
                  </label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-background text-foreground resize-none"
                    placeholder="A brief description of your story..."
                  />
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-foreground mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent bg-background text-foreground"
                    placeholder="writing, inspiration, creativity (comma separated)"
                  />
                  <p className="mt-1 text-sm text-muted">Separate tags with commas</p>
                </div>

                {/* Published Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="published"
                    name="published"
                    checked={formData.published}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-accent bg-background border-border rounded focus:ring-accent focus:ring-2"
                  />
                  <label htmlFor="published" className="ml-2 text-sm font-medium text-foreground">
                    Published
                  </label>
                </div>
              </div>
            </div>

            {/* Content Editor */}
            <div className="bg-paper rounded-lg border border-border/20 overflow-hidden flex-1">
              <div className="px-6 py-4 border-b border-border/20 bg-foreground/5">
                <h2 className="font-serif font-bold text-foreground">Content</h2>
                <p className="text-sm text-muted">Write in Markdown format</p>
              </div>

              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="w-full h-96 px-6 py-4 border-none focus:ring-0 bg-background text-foreground resize-none font-mono text-sm leading-relaxed"
                placeholder="# Start writing your story..."
              />
            </div>
          </div>

          {/* Preview */}
          <div className={`${isPreview ? '' : 'hidden lg:block'}`}>
            <div className="bg-paper rounded-lg border border-border/20 overflow-hidden sticky top-8">
              <div className="px-6 py-4 border-b border-border/20 bg-foreground/5">
                <h2 className="font-serif font-bold text-foreground">Preview</h2>
              </div>

              <div className="p-6 max-h-96 overflow-y-auto">
                {formData.title && (
                  <h1 className="text-3xl font-serif font-bold text-foreground mb-4 leading-tight">
                    {formData.title}
                  </h1>
                )}

                {formData.excerpt && (
                  <p className="text-lg text-muted leading-relaxed mb-6 italic">
                    {formData.excerpt}
                  </p>
                )}

                {formData.tags && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {formData.tags.split(',').map((tag, index) => (
                      <span
                        key={index}
                        className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm rounded-full"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}

                {formData.content ? (
                  <div className="prose-content">
                    <MarkdownRenderer content={formData.content} />
                  </div>
                ) : (
                  <p className="text-muted italic">Start writing to see the preview...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}