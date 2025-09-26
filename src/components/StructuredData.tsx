import { BlogPost } from '@/lib/types';

interface StructuredDataProps {
    post: BlogPost;
}

export default function StructuredData({ post }: StructuredDataProps) {
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        "headline": post.title,
        "description": post.excerpt || post.content.substring(0, 160).replace(/<[^>]*>/g, ''),
        "author": {
            "@type": "Person",
            "name": "Ink & Pages Writer",
            "url": "https://inkandpages-6d158.web.app/about"
        },
        "publisher": {
            "@type": "Organization",
            "name": "Ink & Pages",
            "url": "https://inkandpages-6d158.web.app",
            "logo": {
                "@type": "ImageObject",
                "url": "https://inkandpages-6d158.web.app/logo.png"
            }
        },
        "datePublished": new Date(post.publishedAt).toISOString(),
        "dateModified": new Date(post.updatedAt || post.publishedAt).toISOString(),
        "mainEntityOfPage": {
            "@type": "WebPage",
            "@id": `https://inkandpages-6d158.web.app/posts/${post.id}`
        },
        "url": `https://inkandpages-6d158.web.app/posts/${post.id}`,
        "keywords": post.tags,
        "wordCount": post.content.replace(/<[^>]*>/g, '').split(/\s+/).length,
        "timeRequired": `PT${post.readingTime}M`,
        "articleSection": "Blog",
        "inLanguage": "en-US"
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}