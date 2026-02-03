import { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabase.service';
import type { Asset } from '../types';

interface UseAssetsReturn {
    assets: Asset[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function useAssets(): UseAssetsReturn {
    const [assets, setAssets] = useState<Asset[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAssets = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await supabaseService.getAssets();

            // Transform Supabase data to Asset type
            const transformedAssets: Asset[] = data.map((item: any) => ({
                id: item.id,
                name: item.name,
                type: item.type,
                position: [item.latitude, item.longitude],
                capacity: item.capacity || 'N/A',
                specs: item.specifications || 'N/A',
                status: item.status || 'Normal',
                isCritical: item.is_critical || false,
            }));

            setAssets(transformedAssets);
        } catch (err) {
            console.error('Error fetching assets:', err);
            setError('Failed to load assets. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();

        // Set up real-time subscription
        const subscription = supabaseService.subscribeToAssets((payload) => {
            console.log('Asset update received:', payload);
            fetchAssets(); // Refetch on any change
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return {
        assets,
        loading,
        error,
        refetch: fetchAssets,
    };
}
