import { useState, useEffect } from 'react';
import { assetDatabase } from '@data/assets.data';
import type { Asset, AssetType } from '../types';

export function useAssetData(assetName?: string) {
    const [asset, setAsset] = useState<Asset | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!assetName) {
            setAsset(null);
            return;
        }

        setLoading(true);

        // Simulate async data fetch
        setTimeout(() => {
            const dbEntry = assetDatabase[assetName];
            if (dbEntry) {
                // In a real app, this would fetch from API
                setAsset({
                    id: dbEntry.id,
                    name: assetName,
                    type: 'pump' as AssetType, // Default type
                    position: [17.445, 78.348],
                    capacity: dbEntry.cap,
                    specs: dbEntry.maint,
                    status: dbEntry.status,
                });
            } else {
                setAsset(null);
            }
            setLoading(false);
        }, 100);
    }, [assetName]);

    return { asset, loading };
}
