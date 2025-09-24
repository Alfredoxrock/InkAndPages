export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="relative bg-foreground/5 border-t border-border/30 mt-20">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-accent/30 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-accent-light/20 to-transparent rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto px-6 py-12">
        <div className="text-center">
          {/* Quote or tagline */}
          <blockquote className="text-lg font-serif italic text-muted mb-6 max-w-2xl mx-auto leading-relaxed">
            "The pen is mightier than the sword, and considerably easier to write with."
            <cite className="block text-sm font-sans not-italic mt-2 text-muted/80">
              — Marty Feldman
            </cite>
          </blockquote>
          
          {/* Divider */}
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
            <div className="mx-4 w-2 h-2 bg-accent rounded-full"></div>
            <div className="w-16 h-px bg-gradient-to-l from-transparent via-accent/50 to-transparent"></div>
          </div>
          
          {/* Footer content */}
          <div className="space-y-4">
            <div className="flex items-center justify-center space-x-2 text-sm text-muted">
              <span>Made with</span>
              <svg className="w-4 h-4 text-accent fill-current" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
              </svg>
              <span>and lots of</span>
              <svg className="w-4 h-4 text-accent-light" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <span>ink</span>
            </div>
            
            <p className="text-sm text-muted/80">
              © {currentYear} Ink & Pages. All stories and thoughts reserved.
            </p>
            
            {/* Social links or additional info could go here */}
            <div className="flex justify-center space-x-6 text-sm">
              <a href="/rss" className="text-muted hover:text-accent transition-colors duration-200">
                RSS
              </a>
              <a href="/archive" className="text-muted hover:text-accent transition-colors duration-200">
                Archive
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}