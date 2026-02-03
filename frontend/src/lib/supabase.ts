import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth Service
export class AuthService {
    async signIn(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data;
    }

    async signUp(email: string, password: string, metadata: Record<string, any>) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: metadata },
        });
        if (error) throw error;
        return data;
    }

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    }

    async resetPassword(email: string) {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
    }

    async updatePassword(newPassword: string) {
        const { error } = await supabase.auth.updateUser({
            password: newPassword,
        });
        if (error) throw error;
    }

    onAuthStateChange(callback: (session: any) => void) {
        return supabase.auth.onAuthStateChange((_event, session) => {
            callback(session);
        });
    }

    async getSession() {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return data.session;
    }
}

export const authService = new AuthService();

// Audit Logger with batch inserts
export class AuditLogger {
    private logQueue: Array<any> = [];
    private batchSize = 10;
    private flushInterval = 5000; // 5 seconds
    private timer: NodeJS.Timeout | null = null;

    constructor() {
        this.startTimer();
    }

    private startTimer() {
        this.timer = setInterval(() => this.flush(), this.flushInterval);
    }

    async log(action: string, resource: string, details: any = {}) {
        const log = {
            id: crypto.randomUUID(),
            action,
            resource,
            details,
            created_at: new Date().toISOString(),
        };

        this.logQueue.push(log);

        if (this.logQueue.length >= this.batchSize) {
            await this.flush();
        }
    }

    private async flush() {
        if (this.logQueue.length === 0) return;

        const logs = [...this.logQueue];
        this.logQueue = [];

        try {
            const { error } = await supabase.from('audit_logs').insert(logs);
            if (error) console.error('Audit log error:', error);
        } catch (error) {
            console.error('Audit log flush error:', error);
        }
    }

    destroy() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
        this.flush();
    }
}

export const auditLogger = new AuditLogger();
