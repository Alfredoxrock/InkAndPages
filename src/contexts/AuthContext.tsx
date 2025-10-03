'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
    User,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextType {
    user: User | null;
    loading: boolean;
    isWriter: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // Make every authenticated user a writer
    const isWriter = !!user;


    // Log setup on initial render
    console.log('AuthProvider setup:', {
        userEmail: user?.email,
        isWriter,
        loading
    });

    // Log whenever user or isWriter changes
    useEffect(() => {
        console.log('AuthProvider state update:', {
            userEmail: user?.email,
            isWriter,
            loading
        });
    }, [user, isWriter, loading]);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            console.log('Auth state changed:', user?.email || 'No user');
            setUser(user);
            setLoading(false);

            // Log the updated auth state after user is set
            const updatedIsWriter = !!user;
            console.log('AuthProvider updated state:', {
                userEmail: user?.email,
                isWriter: updatedIsWriter,
                loading: false
            });
        });

        return () => unsubscribe();
    }, []);

    const signIn = async (email: string, password: string) => {
        console.log('AuthContext signIn called with email:', email);
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            console.log('Firebase signIn successful:', result.user.email);
        } catch (error) {
            console.error('Firebase signIn error:', error);
            throw error;
        }
    };

    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
        } catch (error) {
            console.error('Sign out error:', error);
            throw error;
        }
    };

    const value = {
        user,
        loading,
        isWriter,
        signIn,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}