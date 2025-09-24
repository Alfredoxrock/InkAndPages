export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  readingTime: number; // in minutes
  published: boolean;
  coverImage?: string;
}

export interface BlogPostMetadata {
  id: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  tags: string[];
  readingTime: number;
  published: boolean;
  coverImage?: string;
}