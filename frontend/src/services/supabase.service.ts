import { createClient } from '@supabase/supabase-js';

// Supabase configuration with real credentials
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://vrijzzzjeshbhkikvdfx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZyaWp6enpqZXNoYmhraWt2ZGZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk1MjkxMDMsImV4cCI6MjA4NTEwNTEwM30.VnIVTlwQMa1jw3e0HRfmqVHPPvTlnOl0BdUc-XshiZI';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Supabase service for database operations
export const supabaseService = {
    /**
     * Fetch all assets from database
     */
    async getAssets() {
        const { data, error } = await supabase
            .from('assets')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching assets:', error);
            return [];
        }

        return data || [];
    },

    /**
     * Fetch asset by ID
     */
    async getAssetById(id: string) {
        const { data, error } = await supabase
            .from('assets')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching asset:', error);
            return null;
        }

        return data;
    },

    /**
     * Fetch all pipelines from database
     */
    async getPipelines() {
        const { data, error } = await supabase
            .from('pipelines')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Error fetching pipelines:', error);
            return [];
        }

        return data || [];
    },

    /**
     * Fetch pipeline by ID
     */
    async getPipelineById(id: string) {
        const { data, error } = await supabase
            .from('pipelines')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Error fetching pipeline:', error);
            return null;
        }

        return data;
    },

    /**
     * Insert or update an asset
     */
    async upsertAsset(asset: any) {
        const { data, error } = await supabase
            .from('assets')
            .upsert(asset)
            .select()
            .single();

        if (error) {
            console.error('Error upserting asset:', error);
            return null;
        }

        return data;
    },

    /**
     * Insert or update a pipeline
     */
    async upsertPipeline(pipeline: any) {
        const { data, error } = await supabase
            .from('pipelines')
            .upsert(pipeline)
            .select()
            .single();

        if (error) {
            console.error('Error upserting pipeline:', error);
            return null;
        }

        return data;
    },

    /**
     * Subscribe to real-time asset updates
     */
    subscribeToAssets(callback: (payload: any) => void) {
        return supabase
            .channel('assets_channel')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'assets',
                },
                callback
            )
            .subscribe();
    },

    /**
     * Subscribe to real-time pipeline updates
     */
    subscribeToPipelines(callback: (payload: any) => void) {
        return supabase
            .channel('pipelines_channel')
            .on(
                'postgres_changes',
                {
                    event: '*',
                    schema: 'public',
                    table: 'pipelines',
                },
                callback
            )
            .subscribe();
    },
};
