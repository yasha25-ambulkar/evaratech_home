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

            let fetchedAssets: Asset[] = [];
            try {
                const data = await supabaseService.getAssets();
                fetchedAssets = data.map((item: any) => ({
                    id: item.id,
                    name: item.name,
                    type: item.type,
                    position: [item.latitude, item.longitude],
                    capacity: item.capacity || 'N/A',
                    specs: item.specifications || 'N/A',
                    status: item.status || 'Normal',
                    isCritical: item.is_critical || false,
                }));
            } catch (err) {
                console.warn('Supabase fetch failed, using mock data only', err);
            }

            // Always ensure mock data is present if fetched data is missing specific IDs
            // or just merge them for a rich experience as per user request
            const { assetDatabase, assetPositions } = await import('../data/assets.data');

            const mockAssets: Asset[] = Object.entries(assetDatabase).map(([name, dbEntry]) => {
                const pos = assetPositions[name]?.position || [17.445, 78.349];
                return {
                    id: dbEntry.id,
                    name: name,
                    type: dbEntry.type?.toLowerCase().includes('pump') ? 'pump' :
                        dbEntry.type?.toLowerCase().includes('sump') ? 'sump' :
                            dbEntry.type?.toLowerCase().includes('oht') ? 'tank' : 'bore' as any,
                    position: pos,
                    capacity: dbEntry.cap,
                    specs: dbEntry.maint,
                    status: dbEntry.status,
                    isCritical: dbEntry.status === 'Critical' || dbEntry.status === 'Warning',
                };
            });

            // Combine and de-duplicate by ID
            const combined = [...fetchedAssets];
            mockAssets.forEach(mock => {
                if (!combined.some(a => a.id === mock.id)) {
                    combined.push(mock);
                }
            });

            setAssets(combined);
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
        const subscription = supabaseService.subscribeToAssets((_payload) => {

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
