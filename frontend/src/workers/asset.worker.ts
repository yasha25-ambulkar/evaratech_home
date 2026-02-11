/* eslint-disable no-restricted-globals */
import type { Asset as IAsset } from '../types';

interface SyncPayload {
    supabaseData: any[];
    mockData: IAsset[];
    excludedIds: string[];
}

self.onmessage = (e: MessageEvent) => {
    const { type, payload } = e.data;

    if (type === 'SYNC_ASSETS') {
        const { supabaseData, mockData, excludedIds } = payload as SyncPayload;
        const exclusionSet = new Set(excludedIds);
        const finalMap: Record<string, IAsset> = {};

        // 1. Process Supabase Data
        supabaseData.forEach((item: any) => {
            const asset: IAsset = {
                id: item.id,
                name: item.name,
                type: item.type,
                position: [item.latitude, item.longitude],
                capacity: item.capacity || 'N/A',
                specs: item.specifications || 'N/A',
                status: item.status || 'Normal',
                isCritical: item.is_critical || false,
            };
            if (!exclusionSet.has(asset.id) && !exclusionSet.has(asset.name)) {
                finalMap[asset.id] = asset;
            }
        });

        // 2. Process Mock Data
        mockData.forEach(mock => {
            if (!finalMap[mock.id] && !exclusionSet.has(mock.id) && !exclusionSet.has(mock.name)) {
                finalMap[mock.id] = mock;
            }
        });

        const assetsArr = Object.values(finalMap);

        self.postMessage({
            type: 'SYNC_COMPLETE',
            payload: {
                assets: assetsArr,
                assetMap: finalMap
            }
        });
    }
};

export { };
