import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../services/supabase.service';

interface User {
    id: string;
    email: string;
    fullName: string;
    role: 'admin' | 'manager' | 'operator' | 'viewer';
    avatarUrl?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    signUp: (email: string, password: string, fullName: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session with Supabase
        const checkSession = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();

                if (session?.user) {
                    setUser({
                        id: session.user.id,
                        email: session.user.email || '',
                        fullName: session.user.user_metadata?.full_name || 'User',
                        role: session.user.user_metadata?.role || 'viewer',
                        avatarUrl: session.user.user_metadata?.avatar_url,
                    });
                }
            } catch (error) {
                console.error('Session check failed:', error);
            } finally {
                setLoading(false);
            }
        };

        checkSession();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email || '',
                    fullName: session.user.user_metadata?.full_name || 'User',
                    role: session.user.user_metadata?.role || 'viewer',
                    avatarUrl: session.user.user_metadata?.avatar_url,
                });
            } else {
                setUser(null);
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const signIn = async (email: string, password: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                setUser({
                    id: data.user.id,
                    email: data.user.email || '',
                    fullName: data.user.user_metadata?.full_name || 'User',
                    role: data.user.user_metadata?.role || 'viewer',
                    avatarUrl: data.user.user_metadata?.avatar_url,
                });
            }
        } catch (error) {
            console.error('Sign in failed:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        setLoading(true);
        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;
            setUser(null);
        } catch (error) {
            console.error('Sign out failed:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, password: string, fullName: string) => {
        setLoading(true);
        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName,
                        role: 'viewer',
                    },
                },
            });

            if (error) throw error;

            if (data.user) {
                setUser({
                    id: data.user.id,
                    email: data.user.email || '',
                    fullName,
                    role: 'viewer',
                });
            }
        } catch (error) {
            console.error('Sign up failed:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signOut, signUp }}>
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
