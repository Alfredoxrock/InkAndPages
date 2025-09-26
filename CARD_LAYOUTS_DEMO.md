# 🎨 Blog Post Card Layout Options

## 1. **Current Layout** (Single Column) ✅
```tsx
// Your current clean, readable single-column layout
<div className="space-y-12">
  {posts.map((post) => (
    <article className="bg-paper/60 backdrop-blur-sm rounded-lg border border-border/30 p-8 hover:shadow-xl transition-all duration-300 group">
      // Current content
    </article>
  ))}
</div>
```

## 2. **2-Column Grid** (Compact)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {posts.map((post) => (
    <article className="bg-paper/60 backdrop-blur-sm rounded-lg border border-border/30 p-6 hover:shadow-xl transition-all duration-300 group">
      <div className="flex items-center text-sm text-muted mb-3">
        <time>{format(new Date(post.publishedAt), 'MMM dd, yyyy')}</time>
        <span className="mx-2">•</span>
        <span>{post.readingTime} min read</span>
      </div>
      
      <h2 className="text-xl font-serif font-bold text-foreground mb-3 leading-tight group-hover:text-accent transition-colors">
        {post.title}
      </h2>
      
      <p className="text-muted leading-relaxed mb-4 line-clamp-3">
        {post.excerpt}
      </p>
      
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {post.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>
        <Link href={`/posts/${post.id}`} className="text-accent hover:text-accent-light text-sm font-medium">
          Read →
        </Link>
      </div>
    </article>
  ))}
</div>
```

## 3. **3-Column Grid** (Minimal Cards)
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {posts.map((post) => (
    <article className="bg-paper/60 backdrop-blur-sm rounded-lg border border-border/30 p-4 hover:shadow-xl transition-all duration-300 group cursor-pointer">
      <div className="mb-3">
        <span className="text-xs text-muted">{format(new Date(post.publishedAt), 'MMM dd')}</span>
      </div>
      
      <h3 className="text-lg font-serif font-bold text-foreground mb-2 leading-tight group-hover:text-accent transition-colors line-clamp-2">
        {post.title}
      </h3>
      
      <p className="text-sm text-muted leading-relaxed line-clamp-3 mb-3">
        {post.excerpt}
      </p>
      
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted">{post.readingTime} min</span>
        <div className="flex gap-1">
          {post.tags.slice(0, 1).map((tag) => (
            <span key={tag} className="px-2 py-1 bg-accent/10 text-accent rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  ))}
</div>
```

## 4. **Magazine Style** (Featured + Grid)
```tsx
<div>
  {/* Featured Post */}
  <article className="bg-paper/60 backdrop-blur-sm rounded-lg border border-border/30 p-8 mb-12 hover:shadow-xl transition-all duration-300 group">
    <div className="flex items-center text-sm text-muted mb-4">
      <span className="px-3 py-1 bg-accent text-white rounded-full text-xs font-medium">Featured</span>
      <span className="ml-3">{format(new Date(posts[0]?.publishedAt), 'MMMM dd, yyyy')}</span>
    </div>
    
    <h1 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4 leading-tight group-hover:text-accent transition-colors">
      {posts[0]?.title}
    </h1>
    
    <p className="text-lg text-muted leading-relaxed mb-6">
      {posts[0]?.excerpt}
    </p>
    
    <div className="flex items-center justify-between">
      <div className="flex gap-2">
        {posts[0]?.tags.map((tag) => (
          <span key={tag} className="px-3 py-1 bg-accent/10 text-accent rounded-full text-sm">
            #{tag}
          </span>
        ))}
      </div>
      <Link href={`/posts/${posts[0]?.id}`} className="text-accent hover:text-accent-light font-medium">
        Read Full Story →
      </Link>
    </div>
  </article>

  {/* Other Posts Grid */}
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {posts.slice(1).map((post) => (
      // Smaller card layout
    ))}
  </div>
</div>
```

## 5. **Horizontal Cards** (List Style)
```tsx
<div className="space-y-6">
  {posts.map((post) => (
    <article className="flex bg-paper/60 backdrop-blur-sm rounded-lg border border-border/30 p-6 hover:shadow-xl transition-all duration-300 group">
      <div className="flex-1">
        <div className="flex items-center text-sm text-muted mb-2">
          <time>{format(new Date(post.publishedAt), 'MMM dd')}</time>
          <span className="mx-2">•</span>
          <span>{post.readingTime} min</span>
        </div>
        
        <h2 className="text-xl font-serif font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
          {post.title}
        </h2>
        
        <p className="text-muted text-sm line-clamp-2 mb-3">
          {post.excerpt}
        </p>
        
        <div className="flex gap-2">
          {post.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
              #{tag}
            </span>
          ))}
        </div>
      </div>
      
      <div className="ml-6 flex items-center">
        <Link href={`/posts/${post.id}`} className="text-accent hover:text-accent-light">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>
    </article>
  ))}
</div>
```

## 6. **Masonry Layout** (Pinterest Style)
```tsx
// Requires CSS columns or a masonry library
<div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
  {posts.map((post) => (
    <article className="break-inside-avoid bg-paper/60 backdrop-blur-sm rounded-lg border border-border/30 p-4 hover:shadow-xl transition-all duration-300 group mb-6">
      <div className="mb-3">
        <span className="text-xs text-muted">{format(new Date(post.publishedAt), 'MMM dd')}</span>
      </div>
      
      <h3 className="text-lg font-serif font-bold text-foreground mb-2 leading-tight group-hover:text-accent transition-colors">
        {post.title}
      </h3>
      
      {/* Variable content height based on excerpt length */}
      <p className="text-sm text-muted leading-relaxed mb-3" style={{ 
        display: '-webkit-box',
        WebkitLineClamp: Math.floor(post.excerpt.length / 50) + 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
      }}>
        {post.excerpt}
      </p>
      
      <div className="flex flex-wrap gap-1 mb-3">
        {post.tags.map((tag) => (
          <span key={tag} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
            #{tag}
          </span>
        ))}
      </div>
      
      <Link href={`/posts/${post.id}`} className="text-accent hover:text-accent-light text-sm font-medium">
        Read Story →
      </Link>
    </article>
  ))}
</div>
```

## 7. **Card with Image Placeholders**
```tsx
<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
  {posts.map((post) => (
    <article className="bg-paper/60 backdrop-blur-sm rounded-lg border border-border/30 overflow-hidden hover:shadow-xl transition-all duration-300 group">
      {/* Image placeholder */}
      <div className="h-48 bg-gradient-to-br from-accent/20 to-accent-light/20 flex items-center justify-center">
        <div className="w-16 h-16 bg-accent/30 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-accent" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center text-sm text-muted mb-3">
          <time>{format(new Date(post.publishedAt), 'MMM dd, yyyy')}</time>
          <span className="mx-2">•</span>
          <span>{post.readingTime} min read</span>
        </div>
        
        <h2 className="text-xl font-serif font-bold text-foreground mb-3 leading-tight group-hover:text-accent transition-colors">
          {post.title}
        </h2>
        
        <p className="text-muted leading-relaxed mb-4 line-clamp-3">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            {post.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="px-2 py-1 bg-accent/10 text-accent text-xs rounded-full">
                #{tag}
              </span>
            ))}
          </div>
          <Link href={`/posts/${post.id}`} className="text-accent hover:text-accent-light text-sm font-medium">
            Read →
          </Link>
        </div>
      </div>
    </article>
  ))}
</div>
```

## 🎯 **My Recommendations:**

### **For Your Blog:**
1. **2-Column Grid** - Good balance of content and space efficiency
2. **Magazine Style** - Feature your best post, grid for others
3. **Current + Toggle** - Keep current, add view switcher

### **Interactive Features:**
- **View Toggle**: List ↔ Grid ↔ Compact
- **Filter by Tags**: Show only posts with selected tags
- **Sort Options**: Date, Reading Time, Title
- **Hover Effects**: Card lift, content preview