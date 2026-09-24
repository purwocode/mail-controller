import { supabase } from './supabase';
import { Session } from '@supabase/supabase-js';

const AUTH_COOKIE = 'sb-logged-in';

// Non-sensitive presence flag only (no token/session data) - lets proxy.ts gate /dashboard
// server-side. The actual security boundary remains the Bearer-token check in API routes.
export function setAuthCookie() {
    if (typeof document === 'undefined') return;
    const secure = window.location.protocol === 'https:' ? '; Secure' : '';
    document.cookie = `${AUTH_COOKIE}=1; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax${secure}`;
}

export function clearAuthCookie() {
    if (typeof document === 'undefined') return;
    document.cookie = `${AUTH_COOKIE}=; path=/; max-age=0`;
}

export async function getCurrentUser() {
    try {
        const {
            data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
            return null;
        }

        return session.user;
    } catch (error) {
        console.error('Error fetching current user:', error);
        return null;
    }
}

export async function getCurrentSession(): Promise<Session | null> {
    try {
        const {
            data: { session },
        } = await supabase.auth.getSession();
        return session;
    } catch (error) {
        console.error('Error fetching session:', error);
        return null;
    }
}

export async function signUp(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            throw error;
        }

        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function signIn(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            throw error;
        }

        return { data, error: null };
    } catch (error) {
        return { data: null, error };
    }
}

export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw error;
        }
        return { error: null };
    } catch (error) {
        return { error };
    }
}

export async function resetPassword(email: string) {
    try {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
        });

        if (error) {
            throw error;
        }

        return { error: null };
    } catch (error) {
        return { error };
    }
}
