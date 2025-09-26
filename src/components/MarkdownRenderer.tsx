'use client';

import { useMemo } from 'react';
import { marked } from 'marked';

interface MarkdownRendererProps {
  content: string;
}

export default function MarkdownRenderer({ content }: MarkdownRendererProps) {
  const htmlContent = useMemo(() => {
    // Configure marked options for better rendering
    marked.setOptions({
      breaks: true, // Convert \n to <br>
      gfm: true,    // GitHub Flavored Markdown
      pedantic: false,
    });

    // Convert markdown to HTML - ensure it returns a string
    const result = marked.parse(content);
    return typeof result === 'string' ? result : '';
  }, [content]);

  return (
    <div
      className="prose-content max-w-none 
      [&_h1]:text-4xl [&_h1]:mb-8 [&_h1]:mt-12 [&_h1]:font-serif [&_h1]:font-bold [&_h1]:text-foreground [&_h1]:leading-tight
      [&_h2]:text-3xl [&_h2]:mb-6 [&_h2]:mt-10 [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-foreground [&_h2]:leading-tight  
      [&_h3]:text-2xl [&_h3]:mb-4 [&_h3]:mt-8 [&_h3]:font-serif [&_h3]:font-bold [&_h3]:text-foreground [&_h3]:leading-tight
      [&_h4]:text-xl [&_h4]:mb-4 [&_h4]:mt-6 [&_h4]:font-serif [&_h4]:font-bold [&_h4]:text-foreground [&_h4]:leading-tight
      [&_p]:mb-6 [&_p]:text-lg [&_p]:leading-relaxed [&_p]:text-foreground
      [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-6 [&_blockquote]:italic [&_blockquote]:text-muted [&_blockquote]:my-8 [&_blockquote]:text-lg [&_blockquote]:leading-relaxed
      [&_a]:text-accent [&_a]:underline [&_a]:font-medium [&_a]:transition-colors [&_a]:duration-200 hover:[&_a]:text-accent-light
      [&_pre]:bg-foreground/5 [&_pre]:border [&_pre]:border-border/20 [&_pre]:p-6 [&_pre]:rounded-lg [&_pre]:overflow-x-auto [&_pre]:my-8 [&_pre]:text-sm
      [&_code]:bg-foreground/10 [&_code]:px-2 [&_code]:py-1 [&_code]:rounded [&_code]:text-sm [&_code]:font-mono
      [&_ul]:list-disc [&_ul]:list-inside [&_ul]:space-y-2 [&_ul]:mb-6 [&_ul]:ml-4
      [&_ol]:list-decimal [&_ol]:list-inside [&_ol]:space-y-2 [&_ol]:mb-6 [&_ol]:ml-4
      [&_li]:text-lg [&_li]:leading-relaxed
      [&_strong]:font-semibold
      [&_em]:italic"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}