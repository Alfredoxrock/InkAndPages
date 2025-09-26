'use client';

import { useMemo } from 'react';
import DOMPurify from 'isomorphic-dompurify';

interface HtmlContentRendererProps {
    content: string;
    className?: string;
}

export default function HtmlContentRenderer({ content, className = '' }: HtmlContentRendererProps) {
    const sanitizedContent = useMemo(() => {
        // Sanitize HTML to prevent XSS attacks while allowing safe HTML tags
        return DOMPurify.sanitize(content, {
            ALLOWED_TAGS: [
                'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'ul', 'ol', 'li',
                'blockquote', 'q',
                'a', 'img',
                'div', 'span'
            ],
            ALLOWED_ATTR: [
                'href', 'target', 'rel',
                'src', 'alt', 'width', 'height',
                'class', 'style'
            ],
            ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.-]+(?:[^a-z+.\-:]|$))/i
        });
    }, [content]);

    if (!content) {
        return null;
    }

    return (
        <div
            className={`prose prose-lg prose-gray max-w-none 
            [&_p]:mb-6 [&_p]:text-lg [&_p]:leading-relaxed [&_p]:text-foreground
            [&_br]:block [&_br]:mb-2
            [&_h1]:text-4xl [&_h1]:mb-8 [&_h1]:mt-12 [&_h1]:font-serif [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:leading-tight
            [&_h2]:text-3xl [&_h2]:mb-6 [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:leading-tight  
            [&_h3]:text-2xl [&_h3]:mb-4 [&_h3]:mt-8 [&_h3]:font-serif [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:leading-tight
            [&_h4]:text-xl [&_h4]:mb-4 [&_h4]:mt-6 [&_h4]:font-serif [&_h4]:font-bold [&_h4]:text-foreground [&_h4]:leading-tight
            [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-muted [&_blockquote]:my-8 [&_blockquote]:text-lg [&_blockquote]:leading-relaxed
            [&_a]:text-accent [&_a]:underline [&_a]:font-medium [&_a]:transition-colors [&_a]:duration-200 hover:[&_a]:text-accent-light
            [&_pre]:bg-foreground/5 [&_pre]:border [&_pre]:border-border/20 [&_pre]:p-6 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-8 [&_pre]:text-sm
            [&_code]:bg-foreground/10 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
            [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-2 [&_ul]:mb-6 [&_ul]:ml-4
            [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-2 [&_ol]:mb-6 [&_ol]:ml-4
            [&_li]:text-lg [&_li]:leading-relaxed
            [&_strong]:font-semibold
            [&_em]:italic
            ${className}`}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            style={{
                // Custom styles for rich content
                lineHeight: '1.7',
                whiteSpace: 'pre-wrap', // Preserve whitespace and line breaks
            }}
        />
    );
}