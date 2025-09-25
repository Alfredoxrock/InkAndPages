'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import LoginForm from '@/components/LoginForm';

export default function LoginPage() {
    const { user, loading, isWriter } = useAuth();
    const router = useRouter();

    console.log('LoginPage state:', {
        userEmail: user?.email,
        loading,
        isWriter,
        writerEmailFromEnv: process.env.NEXT_PUBLIC_WRITER_EMAIL
    });

    useEffect(() => {
        console.log('LoginPage useEffect:', { user: user?.email, isWriter });
        if (user && isWriter) {
            console.log('Redirecting to admin...');
            router.push('/admin');
        } else if (user && !isWriter) {
            console.log('User logged in but is not the writer');
        }
    }, [user, isWriter, router]);

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

    return (
        <div className="min-h-screen py-12 px-6">
            <div className="max-w-2xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
                        Welcome Back
                    </h1>
                    <p className="text-lg text-muted">
                        Sign in to access your writing dashboard and manage your blog posts.
                    </p>
                </div>

                <LoginForm />

                <div className="text-center mt-8">
                    <p className="text-muted">
                        Want to go back to the blog?{' '}
                        <a href="/" className="text-accent hover:text-accent-light transition-colors duration-200">
                            Visit Blog
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}