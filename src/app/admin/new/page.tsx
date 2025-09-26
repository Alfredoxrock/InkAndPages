'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { createPost } from '@/lib/posts';
import RichTextEditor from '@/components/RichTextEditor';
import { compressImage, validateImageFile, formatFileSize } from '@/lib/imageUtils';

export default function NewPostPage() {
  const { user, loading, isWriter } = useAuth();
  const router = useRouter();
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

  useEffect(() => {
    if (!loading && (!user || !isWriter)) {
      router.push('/login');
    }
  }, [user, loading, isWriter, router]);

  const handleImageSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate the image file
      const validation = validateImageFile(file);
      if (!validation.valid) {
        alert(validation.error);
        return;
      }

      setImageFile(file);
      setCompressionProgress(`Processing ${formatFileSize(file.size)} image...`);

      try {
        // Create preview with original image
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
      // Compress the image to ensure it fits in Firestore's 1MB limit
      const compressedImage = await compressImage(imageFile, {
        maxWidth: 1200,
        maxHeight: 800,
        quality: 0.8,
        maxSizeKB: 500 // Target 500KB to leave room for other document data
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
  };

  const handleSave = async (published: boolean = false) => {
    if (!title.trim() || !content.replace(/<[^>]*>/g, '').trim()) {
      alert('Please fill in both title and content');
      return;
    }

    setSaving(true);

    try {
      // Upload image if selected
      let imageUrl = coverImage;
      if (imageFile && !coverImage) {
        try {
          imageUrl = await uploadImage() || '';
          setCoverImage(imageUrl);
        } catch (imageError) {
          alert(`Image upload failed: ${imageError instanceof Error ? imageError.message : 'Unknown error'}`);
          setSaving(false);
          return;
        }
      }

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
        publishedAt: published ? Date.now() : 0,
        coverImage: imageUrl
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
              disabled={saving || uploadingImage || !title.trim() || !content.replace(/<[^>]*>/g, '').trim()}
              className="px-6 py-3 border-2 border-muted text-muted hover:border-accent hover:text-accent rounded-lg transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingImage ? 'Optimizing Image...' : saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={() => handleSave(true)}
              disabled={saving || uploadingImage || !title.trim() || !content.replace(/<[^>]*>/g, '').trim()}
              className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadingImage ? 'Optimizing Image...' : saving ? 'Publishing...' : 'Publish Story'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
