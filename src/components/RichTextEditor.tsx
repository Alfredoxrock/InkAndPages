'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import { useCallback, useRef, useEffect } from 'react';
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
                paragraph: {
                    HTMLAttributes: {
                        class: 'mb-4 text-foreground leading-relaxed',
                    },
                },
                hardBreak: {
                    keepMarks: true,
                    HTMLAttributes: {
                        class: 'block mb-2',
                    },
                },
                heading: {
                    HTMLAttributes: {
                        class: 'font-serif font-bold text-foreground',
                    },
                },
                bulletList: {
                    HTMLAttributes: {
                        class: 'list-disc list-inside space-y-1 mb-4 ml-4',
                    },
                },
                orderedList: {
                    HTMLAttributes: {
                        class: 'list-decimal list-inside space-y-1 mb-4 ml-4',
                    },
                },
                listItem: {
                    HTMLAttributes: {
                        class: 'text-foreground leading-relaxed',
                    },
                },
                blockquote: {
                    HTMLAttributes: {
                        class: 'border-l-4 border-accent pl-6 italic text-muted my-6 text-lg leading-relaxed',
                    },
                },
                bold: {
                    HTMLAttributes: {
                        class: 'font-semibold',
                    },
                },
                italic: {
                    HTMLAttributes: {
                        class: 'italic',
                    },
                },
            }),
            Image.configure({
                inline: false,
                allowBase64: false,
                HTMLAttributes: {
                    class: 'rounded-lg my-6 max-w-full h-auto',
                },
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-accent underline hover:text-accent-light transition-colors',
                },
            }),
        ],
        content,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'prose prose-lg max-w-none min-h-[300px] p-6 border-0 outline-none text-foreground leading-relaxed focus:outline-none',
                spellcheck: 'true',
            },
            handleKeyDown: (view, event) => {
                // Handle Enter key for line breaks vs paragraphs
                if (event.key === 'Enter' && event.shiftKey) {
                    // Shift+Enter = line break
                    event.preventDefault();
                    editor?.chain().focus().setHardBreak().run();
                    return true;
                }
                return false;
            },
        },
        immediatelyRender: false,
    });

    // Sync content when prop changes
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content);
        }
    }, [editor, content]);

    const handleImageUpload = useCallback(async (file: File) => {
        if (!editor) return;

        try {
            // Validate the image
            isValidImage(file);

            // Show loading state
            editor.chain().focus().insertContent('<p class="text-muted italic">Uploading image...</p>').run();

            // Upload the image
            const imageUrl = await uploadImage(file);

            // Remove loading text and insert image
            editor.chain().focus().undo().insertContent(`<img src="${imageUrl}" alt="Uploaded image" class="rounded-lg my-6 max-w-full h-auto" />`).run();

        } catch (error) {
            console.error('Image upload failed:', error);
            editor.chain().focus().undo().run(); // Remove loading text
            alert(error instanceof Error ? error.message : 'Failed to upload image');
        }
    }, [editor]);

    const handleImageButtonClick = useCallback(() => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    }, []);

    const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleImageUpload(file);
            // Reset the input
            event.target.value = '';
        }
    }, [handleImageUpload]);

    // Toolbar button component for consistency
    const ToolbarButton = useCallback(({
        onClick,
        isActive = false,
        title,
        children,
        disabled = false
    }: {
        onClick: () => void;
        isActive?: boolean;
        title: string;
        children: React.ReactNode;
        disabled?: boolean;
    }) => (
        <button
            type="button"
            onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!disabled && editor) {
                    onClick();
                }
            }}
            disabled={disabled || !editor}
            className={`
                p-2 rounded transition-all duration-200 font-medium text-sm
                ${isActive
                    ? 'bg-accent text-white shadow-sm'
                    : 'bg-paper text-foreground border border-border/30 hover:bg-accent/10 hover:border-accent/50'
                }
                ${disabled || !editor ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                focus:outline-none focus:ring-2 focus:ring-accent/50 focus:ring-offset-2
            `}
            title={title}
        >
            {children}
        </button>
    ), [editor]);

    if (!editor) {
        return (
            <div className="border border-border/30 rounded-lg p-4 bg-paper/50">
                <div className="animate-pulse">
                    <div className="h-10 bg-muted/20 rounded mb-4"></div>
                    <div className="h-4 bg-muted/20 rounded mb-2"></div>
                    <div className="h-4 bg-muted/20 rounded mb-2"></div>
                    <div className="h-4 bg-muted/20 rounded w-3/4"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="border border-border/30 rounded-lg overflow-hidden bg-paper shadow-sm">
            {/* Enhanced Toolbar */}
            <div className="border-b border-border/30 p-3 bg-background/50">
                <div className="flex flex-wrap gap-2">
                    {/* Text Formatting Group */}
                    <div className="flex gap-1 bg-background p-1 rounded border border-border/20">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBold().run()}
                            isActive={editor.isActive('bold')}
                            title="Bold (Ctrl+B)"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 000 2h1.5a.5.5 0 01.5.5v7a.5.5 0 01-.5.5H3a1 1 0 100 2h7a3 3 0 003-3v-.5a2.5 2.5 0 000-5V7a3 3 0 00-3-3H3zM8 7h2a1 1 0 110 2H8V7zm0 4h3a1 1 0 110 2H8v-2z" />
                            </svg>
                        </ToolbarButton>

                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleItalic().run()}
                            isActive={editor.isActive('italic')}
                            title="Italic (Ctrl+I)"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M8.5 3a1 1 0 000 2H10l-2 8H6.5a1 1 0 100 2h3a1 1 0 100-2H8l2-8h1.5a1 1 0 100-2h-3z" />
                            </svg>
                        </ToolbarButton>

                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleStrike().run()}
                            isActive={editor.isActive('strike')}
                            title="Strikethrough"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm0 8a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" />
                            </svg>
                        </ToolbarButton>
                    </div>

                    {/* Headings Group */}
                    <div className="flex gap-1 bg-background p-1 rounded border border-border/20">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                            isActive={editor.isActive('heading', { level: 1 })}
                            title="Heading 1"
                        >
                            H1
                        </ToolbarButton>

                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                            isActive={editor.isActive('heading', { level: 2 })}
                            title="Heading 2"
                        >
                            H2
                        </ToolbarButton>

                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                            isActive={editor.isActive('heading', { level: 3 })}
                            title="Heading 3"
                        >
                            H3
                        </ToolbarButton>
                    </div>

                    {/* Lists Group */}
                    <div className="flex gap-1 bg-background p-1 rounded border border-border/20">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBulletList().run()}
                            isActive={editor.isActive('bulletList')}
                            title="Bullet List"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 16a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                            </svg>
                        </ToolbarButton>

                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleOrderedList().run()}
                            isActive={editor.isActive('orderedList')}
                            title="Numbered List"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 4a1 1 0 000 2h1v1a1 1 0 102 0V5a1 1 0 00-1-1H3zM3 13v-1a1 1 0 112 0v1a1 1 0 11-2 0zM4 17a1 1 0 100-2 1 1 0 000 2zM7 4a1 1 0 011-1h9a1 1 0 110 2H8a1 1 0 01-1-1zM8 13a1 1 0 100 2h9a1 1 0 100-2H8z" />
                            </svg>
                        </ToolbarButton>
                    </div>

                    {/* Special Actions Group */}
                    <div className="flex gap-1 bg-background p-1 rounded border border-border/20">
                        <ToolbarButton
                            onClick={() => editor.chain().focus().setHardBreak().run()}
                            title="Insert Line Break (Shift+Enter)"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                            </svg>
                        </ToolbarButton>

                        <ToolbarButton
                            onClick={() => editor.chain().focus().toggleBlockquote().run()}
                            isActive={editor.isActive('blockquote')}
                            title="Quote"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3 10a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4zm8 0a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 01-2-2v-4z" />
                            </svg>
                        </ToolbarButton>

                        <ToolbarButton
                            onClick={handleImageButtonClick}
                            title="Insert Image"
                        >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                            </svg>
                        </ToolbarButton>
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-2 text-xs text-muted">
                    Tip: Press <kbd className="px-1 py-0.5 bg-background border border-border/30 rounded text-xs">Shift+Enter</kbd> for line breaks, <kbd className="px-1 py-0.5 bg-background border border-border/30 rounded text-xs">Enter</kbd> for new paragraphs
                </div>
            </div>

            {/* Editor Area */}
            <div className="min-h-[400px] relative bg-paper">
                <EditorContent
                    editor={editor}
                    className="h-full"
                />

                {/* Placeholder when empty */}
                {editor.isEmpty && (
                    <div className="absolute top-6 left-6 text-muted pointer-events-none text-lg">
                        {placeholder}
                    </div>
                )}
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