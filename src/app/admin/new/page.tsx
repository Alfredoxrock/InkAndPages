'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { createPost } from '@/lib/posts';
import RichTextEditor from '@/components/RichTextEditor';

export default function NewPostPage() {
  const { user, loading, isWriter } = useAuth();
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !isWriter)) {
      router.push('/login');
    }
  }, [user, loading, isWriter, router]);

  const handleSave = async (published: boolean = false) => {
    if (!title.trim() || !content.replace(/<[^>]*>/g, '').trim()) {
      alert('Please fill in both title and content');
      return;
    }

    setSaving(true);

    try {
      // Calculate reading time (rough estimate: 250 words per minute)
      const wordCount = content.trim().split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 250));

      // Parse tags
      const tagList = tags.trim() ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];

      // Create the post using Firestore
      const postId = await createPost({
        title: title.trim(),
        content: content, // Don't trim content to preserve formatting and line breaks
        excerpt: excerpt.trim() || '',
        tags: tagList,
        published,
        readingTime,
        publishedAt: published ? Date.now() : 0
      });

      const action = published ? 'published' : 'saved as draft';
      alert(`Post "${title.trim()}" ${action} successfully!`);

      // Redirect to the new post or admin dashboard
      if (published) {
        router.push(`/posts/${postId}`);
      } else {
        router.push('/admin');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('Failed to save post. Please try again.');
    } finally {
      setSaving(false);
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
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
              Write New Story
            </h1>
            <p className="text-muted">Create your next masterpiece</p>
          </div>
          <Link
            href="/admin"
            className="px-4 py-2 border-2 border-muted text-muted hover:border-accent hover:text-accent rounded-lg transition-colors duration-200 font-medium"
          >
            Back to Dashboard
          </Link>
        </div>

        <div className="bg-paper rounded-lg border border-border/20 overflow-hidden">
          <div className="p-6 border-b border-border/20">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter your story title..."
              className="w-full text-2xl font-serif font-bold bg-transparent border-none outline-none text-foreground placeholder-muted"
            />
          </div>

          <div className="p-6 border-b border-border/20">
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Write a brief excerpt or summary..."
              rows={2}
              className="w-full bg-transparent border-none outline-none text-foreground placeholder-muted resize-none"
            />
          </div>

          <div className="p-6 border-b border-border/20">
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Add tags separated by commas"
              className="w-full bg-transparent border-none outline-none text-foreground placeholder-muted"
            />
          </div>

          <div className="p-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-foreground mb-2">
                Story Content
              </label>
            </div>
            <RichTextEditor
              content={content}
              onChange={setContent}
              placeholder="Begin writing your story here... Use the toolbar above to format text, add images, and more!"
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-muted">
            {title.trim() && (
              <span>Title: "{title}"  </span>
            )}
            {content.replace(/<[^>]*>/g, '').trim() && (
              <span>{content.length} characters</span>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => handleSave(false)}
              disabled={saving || !title.trim() || !content.replace(/<[^>]*>/g, '').trim()}
              className="px-6 py-3 border-2 border-muted text-muted hover:border-accent hover:text-accent rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving || !title.trim() || !content.replace(/<[^>]*>/g, '').trim()}
              className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Publishing...' : 'Publish Story'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
