'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function WritePage() {
    const { user, isWriter, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || !isWriter)) {
            router.push('/login');
        }
    }, [user, isWriter, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-background via-paper to-background flex items-center justify-center">
                <div className="text-center">
                    <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-muted">Loading writer dashboard...</p>
                </div>
            </div>
        );
    }

    if (!user || !isWriter) {
        return null; // Will redirect to login
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-paper to-background">
            <div className="container mx-auto px-6 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-foreground mb-4">Writer Dashboard</h1>
                    <p className="text-xl text-muted max-w-2xl mx-auto">
                        Welcome back, writer. Create, edit, and manage your stories from here.
                    </p>
                    <div className="flex items-center justify-center mt-6">
                        <div className="w-16 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"></div>
                        <div className="mx-4 w-2 h-2 bg-accent rounded-full"></div>
                        <div className="w-16 h-px bg-gradient-to-l from-transparent via-accent/50 to-transparent"></div>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {/* Create New Post */}
                    <Link
                        href="/admin/new"
                        className="group bg-paper/60 backdrop-blur-sm rounded-lg border border-border/30 p-8 hover:shadow-xl transition-all duration-300 hover:border-accent/30"
                    >
                        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-serif font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                            Create New Post
                        </h3>
                        <p className="text-muted group-hover:text-foreground/80 transition-colors">
                            Start writing a new story or article
                        </p>
                    </Link>

                    {/* Manage Posts */}
                    <Link
                        href="/admin"
                        className="group bg-paper/60 backdrop-blur-sm rounded-lg border border-border/30 p-8 hover:shadow-xl transition-all duration-300 hover:border-accent/30"
                    >
                        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-serif font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                            Manage Posts
                        </h3>
                        <p className="text-muted group-hover:text-foreground/80 transition-colors">
                            Edit existing posts and drafts
                        </p>
                    </Link>

                    {/* View Site */}
                    <Link
                        href="/"
                        className="group bg-paper/60 backdrop-blur-sm rounded-lg border border-border/30 p-8 hover:shadow-xl transition-all duration-300 hover:border-accent/30"
                    >
                        <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
                            <svg className="w-8 h-8 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-serif font-bold text-foreground mb-3 group-hover:text-accent transition-colors">
                            View Site
                        </h3>
                        <p className="text-muted group-hover:text-foreground/80 transition-colors">
                            See how your stories appear to readers
                        </p>
                    </Link>
                </div>

                {/* Writer Info */}
                <div className="bg-paper/40 backdrop-blur-sm rounded-lg border border-border/20 p-8 text-center">
                    <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-10 h-10 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">Signed in as Writer</h3>
                    <p className="text-muted">{user?.email}</p>
                </div>
            </div>
        </div>
    );
}