# Ink & Pages

> A personal writing app that works like a lightweight blog. Users can write and save posts, organize them by categories or tags, and revisit them anytime. The goal is to create a simple, distraction-free space to practice writing, share ideas, and track progress over time.

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?logo=next.js)](https://nextjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-Hosting%20%26%20Firestore-orange?logo=firebase)](https://firebase.google.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

## 🌟 Features

### ✨ Core Features
- **📝 Rich Text Editor** - Advanced writing experience with TipTap editor
- **💾 Auto-Save System** - Automatic draft saving every 30 seconds with localStorage backup
- **🖼️ Image Management** - Upload, compress, and optimize images with automatic resizing
- **🔐 Authentication** - Writer-only access with email-based authentication
- **📱 Responsive Design** - Beautiful, mobile-first design that works on all devices
- **⚡ Static Site Generation** - Fast loading with Next.js static export
- **🔍 SEO Optimized** - Meta tags, OpenGraph, and structured data for better discoverability

### 📚 Content Management
- **✏️ Post Creation & Editing** - Intuitive interface for writing and editing posts
- **📋 Draft System** - Save drafts locally and recover unsaved changes
- **🏷️ Tags System** - Organize posts with custom tags
- **📊 Reading Time** - Automatic reading time calculation
- **🎯 Publish/Unpublish** - Control post visibility with draft/published states
- **🖼️ Featured Images** - Add cover images to posts with automatic optimization

### 🎨 User Experience
- **📖 Archive View** - Browse all published posts in a clean layout
- **🏠 Homepage Cards** - Beautiful image-based post previews
- **⚙️ Admin Dashboard** - Comprehensive post management interface
- **🔄 Auto-Save Indicators** - Visual feedback for save status
- **📱 Mobile-First** - Optimized for mobile reading and writing

## 🛠️ Technology Stack

### Frontend
- **[Next.js 15.5.4](https://nextjs.org/)** - React framework with App Router
- **[React 19.1.0](https://react.dev/)** - UI library
- **[TypeScript 5.x](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS 4.x](https://tailwindcss.com/)** - Utility-first CSS framework
- **[TipTap](https://tiptap.dev/)** - Rich text editor based on ProseMirror

### Backend & Database
- **[Firebase Firestore](https://firebase.google.com/products/firestore)** - NoSQL database for dynamic content
- **[Firebase Hosting](https://firebase.google.com/products/hosting)** - Static site hosting
- **[Firebase Authentication](https://firebase.google.com/products/auth)** - Email-based authentication

### Development & Build Tools
- **[Turbopack](https://turbo.build/pack)** - Fast bundler for development
- **[ESLint](https://eslint.org/)** - Code linting and formatting
- **[Firebase CLI](https://firebase.google.com/docs/cli)** - Deployment and project management

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Firebase CLI** (`npm install -g firebase-tools`)
- **Firebase Project** with Firestore and Hosting enabled

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Alfredoxrock/InkAndPages.git
   cd InkAndPages
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Firebase Configuration
   NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

   # Writer Authentication
   NEXT_PUBLIC_WRITER_EMAIL=your_email@example.com

   # Analytics (Optional)
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

4. **Configure Firebase**
   ```bash
   firebase login
   firebase init
   # Select Firestore and Hosting
   # Choose your Firebase project
   # Use default settings or customize as needed
   ```

5. **Set up Firestore Rules**
   Update `firestore.rules`:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Allow read access to published posts
       match /posts/{postId} {
         allow read: if resource.data.published == true;
         allow read, write: if request.auth != null && 
           request.auth.token.email == 'your_email@example.com';
       }
     }
   }
   ```

### Development

1. **Start the development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the app.

2. **Login as Writer**
   - Navigate to `/login`
   - Sign in with your configured writer email
   - Access admin features at `/admin`

### Building & Deployment

1. **Build for production**
   ```bash
   npm run build
   ```

2. **Deploy to Firebase**
   ```bash
   firebase deploy
   ```

## 📁 Project Structure

```
InkAndPages/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── (routes)/
│   │   │   ├── page.tsx       # Homepage with post cards
│   │   │   ├── about/         # About page
│   │   │   ├── archive/       # All posts archive
│   │   │   ├── posts/[id]/    # Individual post pages
│   │   │   └── login/         # Authentication page
│   │   ├── admin/             # Admin interface (writer-only)
│   │   │   ├── page.tsx       # Admin dashboard
│   │   │   ├── new/           # Create new posts
│   │   │   └── edit/[id]/     # Edit existing posts
│   │   ├── layout.tsx         # Root layout
│   │   ├── globals.css        # Global styles
│   │   └── sitemap.ts         # Dynamic sitemap generation
│   ├── components/            # Reusable UI components
│   │   ├── Header.tsx         # Navigation header
│   │   ├── Footer.tsx         # Site footer
│   │   ├── RichTextEditor.tsx # TipTap rich text editor
│   │   ├── MarkdownRenderer.tsx # Markdown content renderer
│   │   ├── HtmlContentRenderer.tsx # HTML content renderer
│   │   ├── LoginForm.tsx      # Authentication form
│   │   └── StructuredData.tsx # SEO structured data
│   ├── contexts/              # React contexts
│   │   └── AuthContext.tsx    # Authentication context
│   ├── lib/                   # Utility functions and configurations
│   │   ├── firebase.ts        # Firebase configuration
│   │   ├── firestore.ts       # Firestore database operations
│   │   ├── posts.ts           # Post management utilities
│   │   ├── staticPosts.ts     # Static post handling
│   │   ├── types.ts           # TypeScript type definitions
│   │   ├── imageUtils.ts      # Image compression and optimization
│   │   └── gtag.ts            # Google Analytics integration
│   └── styles/                # Additional stylesheets
├── content/                   # Static content files
│   └── posts/                 # Static post JSON files
├── public/                    # Static assets
├── out/                       # Built static site (generated)
├── firebase.json              # Firebase hosting configuration
├── firestore.rules           # Firestore security rules
├── firestore.indexes.json    # Firestore database indexes
├── next.config.ts            # Next.js configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── tsconfig.json             # TypeScript configuration
```

## 🔧 Configuration

### Firebase Setup
1. Create a new Firebase project
2. Enable Firestore Database
3. Enable Firebase Hosting  
4. Enable Authentication (Email/Password)
5. Configure security rules in `firestore.rules`

### Environment Variables
All environment variables should be prefixed with `NEXT_PUBLIC_` for client-side access:

- `NEXT_PUBLIC_FIREBASE_*` - Firebase configuration
- `NEXT_PUBLIC_WRITER_EMAIL` - Email address for writer authentication
- `NEXT_PUBLIC_GA_ID` - Google Analytics ID (optional)

### Next.js Configuration
The project uses static export mode for optimal performance:
- `output: 'export'` - Generates static HTML files
- `trailingSlash: true` - Ensures consistent URLs
- `images.unoptimized: true` - Required for static export

## 📝 Content Management

### Post Structure
Posts are stored as `BlogPost` objects with the following schema:

```typescript
interface BlogPost {
  id: string;              // Unique post identifier
  title: string;           // Post title
  excerpt?: string;        // Short description
  content: string;         // Full post content (HTML)
  publishedAt: string;     // Publication timestamp
  updatedAt?: string;      // Last update timestamp
  tags: string[];          // Array of tags
  readingTime: number;     // Estimated reading time (minutes)
  published: boolean;      // Publication status
  coverImage?: string;     // Base64 encoded cover image
}
```

### Writing Workflow
1. **Create** - Use `/admin/new` to create new posts
2. **Auto-Save** - Drafts are automatically saved every 30 seconds
3. **Edit** - Use `/admin/edit/[id]` to modify existing posts
4. **Publish** - Toggle between draft and published states
5. **Manage** - View all posts in `/admin` dashboard

### Image Handling
- **Upload** - Drag & drop or click to upload images
- **Compression** - Automatic compression to optimize file size
- **Optimization** - Images resized to max 1200x800px
- **Storage** - Images stored as base64 in Firestore

## 🔐 Authentication & Security

### Writer Authentication
- **Email-based** - Only the configured writer email can access admin features
- **Context-driven** - Authentication state managed via React Context
- **Route protection** - Admin routes redirect non-writers
- **Firestore rules** - Database-level security for write operations

### Security Features
- **Input sanitization** - HTML content is sanitized before rendering
- **XSS protection** - DOMPurify integration for safe HTML rendering
- **CSRF protection** - Firebase Authentication handles token validation
- **Content security** - Only writers can create/edit/delete posts

## 🎨 Styling & Design

### Design System
- **Color scheme** - Warm, paper-inspired color palette
- **Typography** - Serif fonts for readability and elegance
- **Spacing** - Consistent spacing using Tailwind's spacing scale
- **Components** - Reusable component architecture

### Responsive Design
- **Mobile-first** - Designed for mobile devices first
- **Breakpoints** - Responsive breakpoints for all screen sizes
- **Touch-friendly** - Large tap targets and gesture support
- **Performance** - Optimized for fast loading on all devices

### Key Design Elements
- **Cards** - Image-based post cards with hover effects
- **Editor** - Clean, distraction-free writing interface
- **Navigation** - Intuitive navigation with breadcrumbs
- **Feedback** - Visual indicators for save status and actions

## ⚡ Performance & SEO

### Performance Optimization
- **Static Generation** - Pre-built pages for fast loading
- **Image Optimization** - Automatic image compression and resizing
- **Code Splitting** - Automatic code splitting with Next.js
- **Caching** - Aggressive caching with Firebase Hosting
- **Lazy Loading** - Components and images load on demand

### SEO Features
- **Meta Tags** - Dynamic meta tags for each page/post
- **Open Graph** - Social media sharing optimization
- **Structured Data** - JSON-LD structured data for search engines
- **Sitemap** - Dynamic sitemap generation
- **Canonical URLs** - Proper canonical URL handling

### Analytics
- **Google Analytics** - Optional GA4 integration
- **Performance Metrics** - Core Web Vitals optimization
- **User Experience** - Focus on user engagement metrics

## 🧪 Development Workflow

### Code Quality
- **TypeScript** - Full type safety throughout the codebase
- **ESLint** - Code linting and style enforcement
- **Git Hooks** - Pre-commit hooks for code quality
- **Component Architecture** - Clean, reusable component design

### Testing Strategy
- **Type Safety** - TypeScript provides compile-time error checking
- **Manual Testing** - Comprehensive manual testing workflow
- **Build Validation** - Static analysis during build process

### Deployment Pipeline
1. **Development** - Local development with hot reload
2. **Build** - Static site generation with Next.js
3. **Validation** - Type checking and linting
4. **Deploy** - Automatic deployment to Firebase Hosting

## 📚 API Reference

### Core Functions

#### Post Management
```typescript
// Get all posts (published and drafts for writers)
async function getAllPosts(): Promise<BlogPost[]>

// Get post by ID
async function getPostByIdAsync(id: string): Promise<BlogPost | null>

// Create new post
async function createPost(postData: Partial<BlogPost>): Promise<string>

// Update existing post
async function updatePost(id: string, updates: Partial<BlogPost>): Promise<void>

// Delete post
async function deletePost(id: string): Promise<void>
```

#### Image Utilities
```typescript
// Compress and optimize image
async function compressImage(
  file: File, 
  options: CompressionOptions
): Promise<string>

// Validate image file
function validateImageFile(file: File): ValidationResult
```

#### Authentication
```typescript
// Authentication context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  isWriter: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Coding Standards
- Use TypeScript for all new code
- Follow the existing component architecture
- Write descriptive commit messages
- Test your changes thoroughly
- Update documentation as needed

### Feature Requests
- Open an issue with the "enhancement" label
- Describe the feature and its benefits
- Provide examples or mockups if possible
- Discuss implementation approach

## 📋 Roadmap

### Current Features ✅
- [x] Rich text editor with auto-save
- [x] Post creation and editing
- [x] Image upload with compression
- [x] Authentication system
- [x] Responsive design
- [x] SEO optimization
- [x] Firebase deployment

### Planned Features 🚧
- [ ] **Post Scheduling** - Schedule posts for future publication
- [ ] **Bulk Operations** - Manage multiple posts at once
- [ ] **Search Functionality** - Full-text search across posts
- [ ] **Categories System** - Organize posts by categories
- [ ] **Related Posts** - Show related content based on tags
- [ ] **Dark/Light Mode** - Theme toggle with user preference
- [ ] **Comment System** - Reader engagement features
- [ ] **Analytics Dashboard** - Post performance metrics

## 🐛 Troubleshooting

### Common Issues

#### Build Errors
- **generateStaticParams missing**: Ensure all dynamic routes have `generateStaticParams` functions
- **Environment variables**: Check that all required `NEXT_PUBLIC_` variables are set
- **Firebase configuration**: Verify Firebase project setup and credentials

#### Authentication Issues
- **Writer access denied**: Verify `NEXT_PUBLIC_WRITER_EMAIL` matches your Firebase account
- **Login failures**: Check Firebase Authentication is enabled and configured
- **Firestore permissions**: Ensure Firestore rules allow your writer email

#### Development Problems
- **Hot reload not working**: Restart the development server
- **Style not updating**: Clear `.next` cache and restart
- **Turbopack errors**: Try running without `--turbopack` flag

### Getting Help
- Check the [Issues](https://github.com/Alfredoxrock/InkAndPages/issues) for similar problems
- Create a new issue with detailed error information
- Include your environment details and reproduction steps

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Firebase](https://firebase.google.com/) for backend services
- [TipTap](https://tiptap.dev/) for the rich text editor
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Lucide React](https://lucide.dev/) for beautiful icons

---

**Built with ❤️ by [Alfredoxrock](https://github.com/Alfredoxrock)**

**Live Demo**: [https://inkandpages-6d158.web.app](https://inkandpages-6d158.web.app)
