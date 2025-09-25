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
            className={`prose prose-lg prose-gray max-w-none ${className}`}
            dangerouslySetInnerHTML={{ __html: sanitizedContent }}
            style={{
                // Custom styles for rich content
                lineHeight: '1.7',
            }}
        />
    );
}