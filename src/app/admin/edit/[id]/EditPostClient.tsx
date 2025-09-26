"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getPostByIdAsync, updatePost } from '@/lib/posts';
import { BlogPost } from '@/lib/types';
import RichTextEditor from '@/components/RichTextEditor';
import { compressImage, validateImageFile, formatFileSize } from '@/lib/imageUtils';

interface EditPostClientProps {
  postId: string;
}

export default function EditPostClient({ postId }: EditPostClientProps) {
  const { user, loading, isWriter } = useAuth();
  const router = useRouter();
  const [originalPost, setOriginalPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [tags, setTags] = useState('');
  const [coverImage, setCoverImage] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [compressionProgress, setCompressionProgress] = useState('');
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [autoSaving, setAutoSaving] = useState(false);
  const [loadingPost, setLoadingPost] = useState(true);

  // Authentication check
  useEffect(() => {
    if (!loading && (!user || !isWriter)) {
      router.push('/login');
    }
  }, [user, loading, isWriter, router]);

  // Load existing post
  useEffect(() => {
    if (!postId || !user || !isWriter) return;
    
    const loadPost = async () => {
      try {
        setLoadingPost(true);
        const post = await getPostByIdAsync(postId);
        
        if (!post) {
          alert('Post not found');
          router.push('/admin');
          return;
        }

        setOriginalPost(post);
        setTitle(post.title);
        setContent(post.content);
        setExcerpt(post.excerpt || '');
        setTags(post.tags.join(', '));
        setCoverImage(post.coverImage || '');
        if (post.coverImage) {
          setImagePreview(post.coverImage);
        }
      } catch (error) {
        console.error('Error loading post:', error);
        alert('Error loading post');
        router.push('/admin');
      } finally {
        setLoadingPost(false);
      }
    };

    loadPost();
  }, [postId, user, isWriter, router]);

  // Auto-save functionality
  const saveToLocalStorage = useCallback(() => {
    if (typeof window !== 'undefined' && postId && (title.trim() || content.trim() || excerpt.trim() || tags.trim())) {
      const draftData = {
        postId,
        title: title.trim(),
        content,
        excerpt: excerpt.trim(),
        tags: tags.trim(),
        coverImage,
        imagePreview,
        lastSaved: new Date().toISOString()
      };
      localStorage.setItem(`blog_post_edit_${postId}`, JSON.stringify(draftData));
      setLastSaved(new Date());
    }
  }, [postId, title, content, excerpt, tags, coverImage, imagePreview]);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (loadingPost) return;
    
    const autoSaveInterval = setInterval(() => {
      if (!saving && !autoSaving && (title.trim() || content.trim() || excerpt.trim() || tags.trim())) {
        setAutoSaving(true);
        saveToLocalStorage();
        setTimeout(() => setAutoSaving(false), 1000);
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [saving, autoSaving, title, content, excerpt, tags, saveToLocalStorage, loadingPost]);

  // Save on input change (debounced)
  useEffect(() => {
    if (loadingPost) return;
    
    const saveTimeout = setTimeout(() => {
      if (!saving && !autoSaving) {
        saveToLocalStorage();
      }
    }, 5000);

    return () => clearTimeout(saveTimeout);
  }, [title, content, excerpt, tags, coverImage, saving, autoSaving, saveToLocalStorage, loadingPost]);

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      setImageFile(file);
      setCompressionProgress(`Processing ${formatFileSize(file.size)} image...`);

      try {
        const reader = new FileReader();
        reader.onload = (e) => {
          setImagePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        setCompressionProgress('Image loaded successfully!');
      } catch (error) {
        console.error('Error processing image:', error);
        alert('Failed to process image. Please try again.');
        setCompressionProgress('');
      }
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;

    setUploadingImage(true);
    setCompressionProgress('Compressing image for optimal storage...');

    try {
      const compressedImage = await compressImage(imageFile, {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 0.8,
        maxSizeKB: 500
      });

      setCompressionProgress('Image compressed successfully!');
      setUploadingImage(false);
      return compressedImage;
    } catch (error) {
      console.error('Error compressing image:', error);
      setUploadingImage(false);
      setCompressionProgress('');
      throw new Error('Failed to compress image. Please try a smaller image.');
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview('');
    setCoverImage('');
    setCompressionProgress('');
    saveToLocalStorage();
  };

  const handleManualSave = () => {
    if (title.trim() || content.trim() || excerpt.trim() || tags.trim()) {
      saveToLocalStorage();
    }
  };

  const clearDraft = () => {
    if (typeof window !== 'undefined' && postId) {
      localStorage.removeItem(`blog_post_edit_${postId}`);
      setLastSaved(null);
    }
  };

  const handleSave = async (published?: boolean) => {
    if (!originalPost) return;
    
    if (!title.trim() || !content.replace(/<[^>]*>/g, '').trim()) {
      alert('Please fill in both title and content');
      return;
    }

    setSaving(true);

    try {
      // Upload image if selected
      let imageUrl = coverImage;
      if (imageFile && coverImage !== originalPost.coverImage) {
        try {
          imageUrl = await uploadImage() || '';
          setCoverImage(imageUrl);
        } catch (imageError) {
          alert(`Image upload failed: ${imageError instanceof Error ? imageError.message : 'Unknown error'}`);
          setSaving(false);
          return;
        }
      }

      // Calculate reading time
      const wordCount = content.trim().split(/\s+/).length;
      const readingTime = Math.max(1, Math.ceil(wordCount / 250));

      // Parse tags
      const tagList = tags.trim() ? tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0) : [];

      // Update the post
      const updatedData: Partial<BlogPost> = {
        title: title.trim(),
        content: content,
        excerpt: excerpt.trim() || '',
        tags: tagList,
        readingTime,
        coverImage: imageUrl,
        updatedAt: Date.now()
      };

      // Only update published status if explicitly provided
      if (published !== undefined) {
        updatedData.published = published;
        if (published && !originalPost.published) {
          updatedData.publishedAt = Date.now();
        }
      }

      await updatePost(postId, updatedData);

      const action = published === true ? 'published' : published === false ? 'unpublished' : 'updated';
      alert(`Post "${title.trim()}" ${action} successfully!`);

      // Clear the draft from localStorage after successful save
      clearDraft();

      // Redirect based on action
      if (published === true) {
        router.push(`/posts/${postId}`);
      } else {
        router.push('/admin');
      }
    } catch (error) {
      console.error('Error updating post:', error);
      alert('Failed to update post. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading || loadingPost) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading post...</p>
        </div>
      </div>
    );
  }

  if (!user || !isWriter || !originalPost) {
    return null;
  }

  return (
    <div className="min-h-screen py-8 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
              Edit Story
            </h1>
            <p className="text-muted">Update your masterpiece</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href={`/posts/${postId}`}
              className="px-4 py-2 border border-muted text-muted hover:border-accent hover:text-accent rounded-lg transition-colors duration-200 font-medium"
            >
              View Post
            </Link>
            <Link
              href="/admin"
              className="px-4 py-2 border-2 border-muted text-muted hover:border-accent hover:text-accent rounded-lg transition-colors duration-200 font-medium"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>

        {/* Draft Recovery Notification */}
        {lastSaved && (
          <div className="mb-6 p-4 bg-accent/10 border border-accent/20 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-accent mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-accent font-medium">Changes saved locally at {lastSaved.toLocaleTimeString()}</span>
              <button
                onClick={clearDraft}
                className="ml-auto text-sm text-accent hover:text-accent-light underline"
              >
                Clear
              </button>
            </div>
          </div>
        )}

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

          {/* Featured Image Upload */}
          <div className="p-6 border-b border-border/20">
            <label className="block text-sm font-medium text-foreground mb-3">
              Featured Image
            </label>

            {!imagePreview ? (
              <div className="border-2 border-dashed border-border/40 rounded-lg p-6 text-center hover:border-accent/40 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <svg className="w-12 h-12 text-muted mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-muted mb-1">Click to upload an image</p>
                  <p className="text-xs text-muted">PNG, JPG, GIF up to 10MB (will be optimized)</p>
                </label>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Cover preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="absolute top-2 right-2">
                  <button
                    type="button"
                    onClick={removeImage}
                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                {imageFile && (
                  <div className="mt-2">
                    <p className="text-xs text-muted">Image: {imageFile.name} ({formatFileSize(imageFile.size)})</p>
                    {compressionProgress && (
                      <p className="text-xs text-accent mt-1">{compressionProgress}</p>
                    )}
                  </div>
                )}
              </div>
            )}
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
              placeholder="Continue writing your story here..."
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-8">
          <div className="text-sm text-muted space-y-1">
            <div>
              {title.trim() && (
                <span>Title: "{title}"  </span>
              )}
              {content.replace(/<[^>]*>/g, '').trim() && (
                <span>{content.length} characters</span>
              )}
            </div>
            <div className="flex items-center space-x-3">
              {autoSaving && (
                <div className="flex items-center text-accent">
                  <div className="w-3 h-3 border border-accent border-t-transparent rounded-full animate-spin mr-2"></div>
                  <span className="text-xs">Auto-saving...</span>
                </div>
              )}
              {lastSaved && !autoSaving && (
                <div className="flex items-center text-muted/70">
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs">Changes saved {lastSaved.toLocaleTimeString()}</span>
                </div>
              )}
              {!lastSaved && !autoSaving && (title.trim() || content.trim() || excerpt.trim() || tags.trim()) && (
                <div className="text-xs text-muted/50">Changes not saved</div>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {lastSaved && (
              <button
                onClick={clearDraft}
                className="px-4 py-2 text-sm text-red-500 hover:text-red-600 border border-red-200 hover:border-red-300 rounded-lg transition-colors duration-200"
                title="Clear saved changes"
              >
                Clear Changes
              </button>
            )}
            <button
              onClick={handleManualSave}
              disabled={!title.trim() && !content.trim() && !excerpt.trim() && !tags.trim()}
              className="px-4 py-2 text-sm border border-accent text-accent hover:bg-accent hover:text-white rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              title="Save changes to local storage"
            >
              Save Now
            </button>
            {originalPost.published && (
              <button
                onClick={() => handleSave(false)}
                disabled={saving || uploadingImage || !title.trim() || !content.replace(/<[^>]*>/g, '').trim()}
                className="px-6 py-3 border-2 border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadingImage ? 'Optimizing Image...' : saving ? 'Unpublishing...' : 'Unpublish'}
              </button>
            )}
            <button
              onClick={() => handleSave()}
              disabled={saving || uploadingImage || !title.trim() || !content.replace(/<[^>]*>/g, '').trim()}
              className="px-6 py-3 border-2 border-muted text-muted hover:border-accent hover:text-accent rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingImage ? 'Optimizing Image...' : saving ? 'Updating...' : 'Update'}
            </button>
            {!originalPost.published && (
              <button
                onClick={() => handleSave(true)}
                disabled={saving || uploadingImage || !title.trim() || !content.replace(/<[^>]*>/g, '').trim()}
                className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploadingImage ? 'Optimizing Image...' : saving ? 'Publishing...' : 'Publish Story'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}