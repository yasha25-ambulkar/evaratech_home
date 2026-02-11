import { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabase.service';
import { AssetRepository } from '../repositories/AssetRepository';
import { BaseAsset } from '../models/Asset';

interface UseAssetsReturn {
    assets: BaseAsset[];
    assetMap: Record<string, BaseAsset>;
    loading: boolean;
    error: string | null;
    dataSource: 'Real-time' | 'Mock' | 'Hybrid';
    refetch: () => Promise<void>;
}

export function useAssets(): UseAssetsReturn {
    const [assets, setAssets] = useState<BaseAsset[]>([]);
    const [assetMap, setAssetMap] = useState<Record<string, BaseAsset>>({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [dataSource, setDataSource] = useState<'Real-time' | 'Mock' | 'Hybrid'>('Real-time');

    const fetchAssets = async () => {
        try {
            setLoading(true);
            setError(null);

            const { assets: fetchedAssets, assetMap: fetchedMap, source } = await AssetRepository.getAllAssets();

            setAssets(fetchedAssets);
            setAssetMap(fetchedMap);
            setDataSource(source);
        } catch (err) {
            console.error('Error fetching assets via Repository:', err);
            setError('Failed to load assets. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssets();

        const subscription = supabaseService.subscribeToAssets(() => {
            fetchAssets();
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return {
        assets,
        assetMap,
        loading,
        error,
        dataSource,
        refetch: fetchAssets,
    };
}
