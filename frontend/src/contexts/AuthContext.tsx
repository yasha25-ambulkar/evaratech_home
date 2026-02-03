import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

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
        // TODO: Check for existing session with Supabase
        // For now, simulate checking session
        const checkSession = async () => {
            try {
                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 500));
                // Mock user for development
                setUser({
                    id: '1',
                    email: 'admin@evaratech.com',
                    fullName: 'Admin User',
                    role: 'admin',
                });
            } catch (error) {
                console.error('Session check failed:', error);
            } finally {
                setLoading(false);
            }
        };

        checkSession();
    }, []);

    const signIn = async (email: string, _password: string) => {
        setLoading(true);
        try {
            // TODO: Implement Supabase signIn with password
            console.log('Signing in with password');
            await new Promise(resolve => setTimeout(resolve, 1000));
            setUser({
                id: '1',
                email,
                fullName: 'Admin User',
                role: 'admin',
            });
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
            // TODO: Implement Supabase signOut
            await new Promise(resolve => setTimeout(resolve, 500));
            setUser(null);
        } catch (error) {
            console.error('Sign out failed:', error);
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (email: string, _password: string, fullName: string) => {
        setLoading(true);
        try {
            // TODO: Implement Supabase signUp with password
            console.log('Signing up with password');
            await new Promise(resolve => setTimeout(resolve, 1000));
            setUser({
                id: '1',
                email,
                fullName,
                role: 'viewer',
            });
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
