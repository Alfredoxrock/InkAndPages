'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function AdminPage() {
  const { user, loading, isWriter, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isWriter)) {
      router.push('/login');
    }
  }, [user, loading, isWriter, router]);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isWriter) {
    return null;
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif font-bold text-foreground mb-8">
          Writer Dashboard
        </h1>

        <div className="bg-paper rounded-lg p-8 border border-border/20">
          <div className="text-center">
            <h2 className="text-xl font-serif text-foreground mb-4">
              Welcome back, {user.email}!
            </h2>
            <p className="text-muted mb-6">Ready to create your next story?</p>

            <div className="flex justify-center space-x-4 mb-6">
              <Link
                href="/admin/new"
                className="px-6 py-3 bg-accent text-white rounded-lg hover:bg-accent-light transition-colors duration-200 font-medium"
              >
                Write New Story
              </Link>
              <Link
                href="/"
                className="px-6 py-3 border-2 border-muted text-muted hover:border-accent hover:text-accent rounded-lg transition-colors duration-200 font-medium"
              >
                View Blog
              </Link>
            </div>

            <button
              onClick={handleSignOut}
              className="text-sm text-muted hover:text-red-500 transition-colors duration-200"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}