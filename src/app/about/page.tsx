import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About the Writer - Ink & Pages',
  description: 'Learn about the creative mind behind Ink & Pages. Discover my writing philosophy, inspirations, and the stories that shape my creative journey.',
  keywords: ['writer', 'author', 'about', 'writing philosophy', 'creative process', 'storytelling'],
  alternates: {
    canonical: '/about',
  },
  openGraph: {
    title: 'About the Writer - Ink & Pages',
    description: 'Learn about the creative mind behind Ink & Pages. Discover my writing philosophy, inspirations, and the stories that shape my creative journey.',
    type: 'profile',
    url: 'https://inkandpages-6d158.web.app/about',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'About the Writer - Ink & Pages',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About the Writer - Ink & Pages',
    description: 'Learn about the creative mind behind Ink & Pages. Discover my writing philosophy, inspirations, and the stories that shape my creative journey.',
    images: ['/og-image.jpg'],
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-serif font-bold text-foreground mb-6">
            About the Writer
          </h1>
          <div className="flex items-center justify-center">
            <div className="w-24 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
            <div className="mx-6 w-3 h-3 bg-accent rounded-full"></div>
            <div className="w-24 h-px bg-gradient-to-l from-transparent via-accent/50 to-transparent"></div>
          </div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="text-center mb-12">
            <div className="w-32 h-32 bg-gradient-to-br from-accent to-accent-light rounded-full mx-auto mb-6 flex items-center justify-center shadow-2xl">
              <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </div>
          </div>

          <div className="text-lg leading-relaxed text-foreground space-y-8">
            <p className="text-2xl font-serif leading-relaxed text-center text-muted italic mb-12">
              "Words are the brushstrokes of the soul, painting stories that connect us across time and space."
            </p>

            <div className="bg-paper rounded-xl p-8 border border-border/20 shadow-lg">
              <h2 className="text-3xl font-serif font-bold text-foreground mb-6">Welcome to My Creative Space</h2>

              <p className="mb-6">
                This is more than just a blog—it's a sanctuary where thoughts transform into stories,
                where everyday moments become extraordinary narratives, and where the art of writing
                is celebrated in all its forms.
              </p>

              <p className="mb-6">
                I believe that every person has stories worth telling, experiences worth sharing,
                and perspectives that can illuminate the world in new ways. Through my writing,
                I explore the beauty in the mundane, the wisdom in struggle, and the connections
                that bind us all together.
              </p>

              <p className="mb-6">
                Whether it's a reflection on the morning ritual that grounds my day, thoughts on
                overcoming creative challenges, or musings on the craft of storytelling itself,
                each piece here is written with intention and care.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-accent/5 rounded-lg p-6 border border-accent/20">
                <h3 className="text-xl font-serif font-bold text-foreground mb-4 flex items-center">
                  <svg className="w-6 h-6 text-accent mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  What Inspires Me
                </h3>
                <ul className="space-y-2 text-muted">
                  <li>• The quiet moments before dawn</li>
                  <li>• Stories that change perspectives</li>
                  <li>• The rhythm of words on a page</li>
                  <li>• Conversations that spark new ideas</li>
                  <li>• The journey of creative growth</li>
                </ul>
              </div>

              <div className="bg-accent-light/5 rounded-lg p-6 border border-accent-light/20">
                <h3 className="text-xl font-serif font-bold text-foreground mb-4 flex items-center">
                  <svg className="w-6 h-6 text-accent-light mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                  Writing Philosophy
                </h3>
                <ul className="space-y-2 text-muted">
                  <li>• Authenticity over perfection</li>
                  <li>• Stories that serve and connect</li>
                  <li>• Embrace the messy first draft</li>
                  <li>• Write with courage and vulnerability</li>
                  <li>• Honor the reader's time and attention</li>
                </ul>
              </div>
            </div>

            <div className="text-center bg-gradient-to-br from-background via-paper to-background rounded-xl p-8 border border-border/20">
              <h3 className="text-2xl font-serif font-bold text-foreground mb-4">
                Let's Connect Through Stories
              </h3>
              <p className="text-muted mb-6">
                Writing is a conversation between writer and reader. I hope these stories
                resonate with you, spark your own creativity, or simply provide a moment
                of reflection in your busy day.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:hello@inkandpages.com"
                  className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors duration-200 font-medium"
                >
                  Share Your Thoughts
                </a>
                <a
                  href="/"
                  className="px-6 py-3 border-2 border-accent text-accent hover:bg-accent hover:text-white rounded-lg transition-all duration-200 font-medium"
                >
                  Read My Stories
                </a>
              </div>
            </div>

            <div className="text-center text-muted italic">
              <p>
                "Every story we tell becomes part of the larger human story.
                Thank you for being part of mine."
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}