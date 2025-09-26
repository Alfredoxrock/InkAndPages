'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useCallback, useRef } from 'react';
import { uploadImage, isValidImage } from '@/lib/imageUpload';

interface RichTextEditorProps {
    content: string;
    onChange: (content: string) => void;
    placeholder?: string;
}

export default function RichTextEditor({ content, onChange, placeholder = "Start writing your story..." }: RichTextEditorProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                // Configure paragraph handling for better line breaks
                paragraph: {
                    HTMLAttributes: {
                        class: 'mb-4',
                    },
                },
                // Configure hard break for line breaks
                hardBreak: {
                    keepMarks: false,
                    HTMLAttributes: {
                        class: 'block mb-2',
                    },
                },
            }),
            Image.configure({
                inline: false,
                allowBase64: false,
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-accent underline',
                },
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none min-h-[300px] p-4 border-0 outline-none',
            },
        },
    });

    const handleImageUpload = useCallback(async (file: File) => {
        if (!editor) return;

        try {
            // Validate the image
            isValidImage(file);

            // Show loading state
            const loadingNode = editor.chain().focus().insertContent('<p>Uploading image...</p>').run();

            // Upload the image
            const imageUrl = await uploadImage(file);

            // Remove loading text and insert image
            editor.chain().focus().undo().insertContent(`<img src="${imageUrl}" alt="Uploaded image" />`).run();

        } catch (error) {
            console.error('Image upload failed:', error);
            editor.chain().focus().undo().run(); // Remove loading text
            alert(error instanceof Error ? error.message : 'Failed to upload image');
        }
    }, [editor]);

    const handleImageButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleImageUpload(file);
            // Reset the input
            event.target.value = '';
        }
    };

    if (!editor) {
        return (
            <div className="border border-border/30 rounded-lg p-4 bg-paper/50">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="border border-border/30 rounded-lg overflow-hidden bg-paper">
            {/* Toolbar */}
            <div className="border-b border-border/30 p-3 bg-background/50">
                <div className="flex flex-wrap gap-2">
                    {/* Text Formatting */}
                    <div className="flex gap-1">
                        <button
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            className={`p-2 rounded hover:bg-accent/10 transition-colors ${editor.isActive('bold') ? 'bg-accent/20 text-accent' : 'text-muted hover:text-foreground'
                                }`}
                            title="Bold"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 000 2h1.5a.5.5 0 01.5.5v7a.5.5 0 01-.5.5H3a1 1 0 100 2h7a3 3 0 003-3v-.5a2.5 2.5 0 000-5V7a3 3 0 00-3-3H3zM8 7h2a1 1 0 110 2H8V7zm0 4h3a1 1 0 110 2H8v-2z" />
                            </svg>
                        </button>

                        <button
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            className={`p-2 rounded hover:bg-accent/10 transition-colors ${editor.isActive('italic') ? 'bg-accent/20 text-accent' : 'text-muted hover:text-foreground'
                                }`}
                            title="Italic"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8.5 3a1 1 0 000 2H10l-2 8H6.5a1 1 0 100 2h3a1 1 0 100-2H8l2-8h1.5a1 1 0 100-2h-3z" />
                            </svg>
                        </button>

                        <button
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            className={`p-2 rounded hover:bg-accent/10 transition-colors ${editor.isActive('strike') ? 'bg-accent/20 text-accent' : 'text-muted hover:text-foreground'
                                }`}
                            title="Strikethrough"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 8a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" />
                            </svg>
                        </button>
                    </div>

                    <div className="w-px bg-border/30 mx-1"></div>

                    {/* Headings */}
                    <div className="flex gap-1">
                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            className={`px-2 py-1 rounded text-sm font-semibold hover:bg-accent/10 transition-colors ${editor.isActive('heading', { level: 1 }) ? 'bg-accent/20 text-accent' : 'text-muted hover:text-foreground'
                                }`}
                            title="Heading 1"
                        >
                            H1
                        </button>

                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            className={`px-2 py-1 rounded text-sm font-semibold hover:bg-accent/10 transition-colors ${editor.isActive('heading', { level: 2 }) ? 'bg-accent/20 text-accent' : 'text-muted hover:text-foreground'
                                }`}
                            title="Heading 2"
                        >
                            H2
                        </button>

                        <button
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            className={`px-2 py-1 rounded text-sm font-semibold hover:bg-accent/10 transition-colors ${editor.isActive('heading', { level: 3 }) ? 'bg-accent/20 text-accent' : 'text-muted hover:text-foreground'
                                }`}
                            title="Heading 3"
                        >
                            H3
                        </button>
                    </div>

                    <div className="w-px bg-border/30 mx-1"></div>

                    {/* Lists */}
                    <div className="flex gap-1">
                        <button
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            className={`p-2 rounded hover:bg-accent/10 transition-colors ${editor.isActive('bulletList') ? 'bg-accent/20 text-accent' : 'text-muted hover:text-foreground'
                                }`}
                            title="Bullet List"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                            </svg>
                        </button>

                        <button
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            className={`p-2 rounded hover:bg-accent/10 transition-colors ${editor.isActive('orderedList') ? 'bg-accent/20 text-accent' : 'text-muted hover:text-foreground'
                                }`}
                            title="Numbered List"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 000 2h1v1a1 1 0 102 0V5a1 1 0 00-1-1H3zM3 13v-1a1 1 0 112 0v1a1 1 0 11-2 0zM4 17a1 1 0 100-2 1 1 0 000 2zM7 4a1 1 0 011-1h9a1 1 0 110 2H8a1 1 0 01-1-1zM8 13a1 1 0 100 2h9a1 1 0 100-2H8z" />
                            </svg>
                        </button>
                    </div>

                    <div className="w-px bg-border/30 mx-1"></div>

                    {/* Line Break */}
                    <button
                        onClick={() => editor.chain().focus().setHardBreak().run()}
                        className="p-2 rounded hover:bg-accent/10 transition-colors text-muted hover:text-foreground"
                        title="Insert Line Break"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                        </svg>
                    </button>

                    <div className="w-px bg-border/30 mx-1"></div>

                    {/* Quote */}
                    <button
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={`p-2 rounded hover:bg-accent/10 transition-colors ${editor.isActive('blockquote') ? 'bg-accent/20 text-accent' : 'text-muted hover:text-foreground'
                            }`}
                        title="Quote"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M3 10a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4zm8 0a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                        </svg>
                    </button>

                    <div className="w-px bg-border/30 mx-1"></div>

                    {/* Image Upload */}
                    <button
                        onClick={handleImageButtonClick}
                        className="p-2 rounded hover:bg-accent/10 transition-colors text-muted hover:text-foreground"
                        title="Insert Image"
                    >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Editor */}
            <div className="min-h-[300px]">
                <EditorContent
                    editor={editor}
                    placeholder={placeholder}
                />
            </div>

            {/* Hidden file input */}
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
        </div>
    );
}