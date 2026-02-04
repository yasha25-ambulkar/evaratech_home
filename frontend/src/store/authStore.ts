import { create } from 'zustand';
import { supabase } from '../services/supabase.service';

interface User {
    id: string;
    email: string;
    name?: string;
    role: 'admin' | 'editor' | 'viewer';
    avatar?: string;
}

interface AuthState {
    user: User | null;
    session: any | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;

    // Actions
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    checkSession: () => Promise<void>;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    session: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,

    login: async (email, password) => {
        set({ isLoading: true, error: null });

        // Dummy credentials check for testing
        if (email === 'user' && password === 'user@123') {
            const dummyUser: User = {
                id: 'dummy-user-123',
                email: 'user@test.com',
                name: 'Test User',
                role: 'admin',
                avatar: 'https://ui-avatars.com/api/?name=Test+User&background=0ea5e9&color=fff'
            };

            // Set dummy session in local storage to persist verify check
            localStorage.setItem('evara_dummy_auth', 'true');

            set({
                user: dummyUser,
                isAuthenticated: true,
                isLoading: false,
                session: { user: dummyUser }
            });
            return true;
        }

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            if (data.user) {
                const user: User = {
                    id: data.user.id,
                    email: data.user.email || '',
                    name: data.user.user_metadata?.full_name,
                    role: data.user.user_metadata?.role || 'viewer',
                    avatar: data.user.user_metadata?.avatar_url
                };

                set({
                    user,
                    session: data.session,
                    isAuthenticated: true,
                    isLoading: false
                });
                return true;
            }

            return false;
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Login failed',
                isLoading: false,
                isAuthenticated: false
            });
            return false;
        }
    },

    logout: async () => {
        set({ isLoading: true });

        // Check for dummy auth
        if (localStorage.getItem('evara_dummy_auth')) {
            localStorage.removeItem('evara_dummy_auth');
            set({
                user: null,
                session: null,
                isAuthenticated: false,
                isLoading: false
            });
            return;
        }

        try {
            const { error } = await supabase.auth.signOut();
            if (error) throw error;

            set({
                user: null,
                session: null,
                isAuthenticated: false,
                isLoading: false
            });
        } catch (error) {
            console.error('Logout error:', error);
            // Force logout state even if API fails
            set({
                user: null,
                session: null,
                isAuthenticated: false,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Logout failed'
            });
        }
    },

    checkSession: async () => {
        set({ isLoading: true });

        // Check for dummy auth persistence
        if (localStorage.getItem('evara_dummy_auth')) {
            const dummyUser: User = {
                id: 'dummy-user-123',
                email: 'user@test.com',
                name: 'Test User',
                role: 'admin',
                avatar: 'https://ui-avatars.com/api/?name=Test+User&background=0ea5e9&color=fff'
            };

            set({
                user: dummyUser,
                isAuthenticated: true,
                isLoading: false,
                session: { user: { id: 'dummy-user-123' } }
            });
            return;
        }

        try {
            const { data: { session } } = await supabase.auth.getSession();

            if (session?.user) {
                set({
                    user: {
                        id: session.user.id,
                        email: session.user.email || '',
                        name: session.user.user_metadata?.full_name,
                        role: session.user.user_metadata?.role || 'viewer',
                        avatar: session.user.user_metadata?.avatar_url
                    },
                    session: session,
                    isAuthenticated: true,
                    isLoading: false
                });
            } else {
                set({
                    user: null,
                    session: null,
                    isAuthenticated: false,
                    isLoading: false
                });
            }
        } catch (error) {
            set({
                user: null,
                session: null,
                isAuthenticated: false,
                isLoading: false,
                error: error instanceof Error ? error.message : 'Session check failed'
            });
        }
    },

    setUser: (user) => set({ user, isAuthenticated: !!user })
}));
