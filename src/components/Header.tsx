'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="relative bg-paper/80 backdrop-blur-sm border-b border-border/30">
      {/* Decorative ink splash background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-32 h-32 bg-gradient-to-br from-accent/20 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute bottom-0 right-1/3 w-24 h-24 bg-gradient-to-tl from-accent-light/15 to-transparent rounded-full blur-xl"></div>
      </div>
      
      <div className="relative max-w-4xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between">
          {/* Logo / Brand */}
          <Link href="/" className="group">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent-light rounded-lg shadow-lg flex items-center justify-center group-hover:shadow-xl transition-shadow duration-300">
                  <svg 
                    className="w-6 h-6 text-white" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-accent-light rounded-full opacity-60 animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-serif font-bold text-foreground group-hover:text-accent transition-colors duration-300">
                  Ink & Pages
                </h1>
                <p className="text-sm text-muted italic">Where stories come to life</p>
              </div>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="text-foreground hover:text-accent transition-colors duration-200 font-medium"
            >
              Home
            </Link>
            <Link 
              href="/about" 
              className="text-foreground hover:text-accent transition-colors duration-200 font-medium"
            >
              About
            </Link>
            <Link 
              href="/admin" 
              className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors duration-200 font-medium shadow-lg hover:shadow-xl"
            >
              Write
            </Link>
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden w-8 h-8 flex items-center justify-center text-foreground"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-6 py-4 border-t border-border/30">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/" 
                className="text-foreground hover:text-accent transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/about" 
                className="text-foreground hover:text-accent transition-colors duration-200 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                href="/admin" 
                className="inline-block px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors duration-200 font-medium shadow-lg w-fit"
                onClick={() => setIsMenuOpen(false)}
              >
                Write
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}