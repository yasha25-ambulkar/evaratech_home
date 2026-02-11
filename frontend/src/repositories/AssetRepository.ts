import { BaseAsset, AssetFactory } from '../models/Asset';
import { supabaseService } from '../services/supabase.service';
import type { Asset as IAsset } from '../types';

/**
 * Repository Pattern: Centralizes data access logic and abstracts the underlying
 * sources (Supabase + Mock Data).
 */
export class AssetRepository {
    private static cachedMockAssets: IAsset[] | null = null;
    private static EXCLUDED_IDS = ['pipe-p10-s5', 'pipe-p9-s3', 'Borewell P8', 'PIPE-P10-S5', 'PIPE-P9-S3', 'BW-P8'];
    private static worker: Worker | null = null;

    private static getWorker(): Worker {
        if (!this.worker) {
            this.worker = new Worker(new URL('../workers/asset.worker.ts', import.meta.url), { type: 'module' });
        }
        return this.worker;
    }

    /**
     * Fetches and merges assets using a Web Worker for off-main-thread processing.
     * Hydrates plain objects into BaseAsset instances after merging.
     */
    static async getAllAssets(): Promise<{
        assets: BaseAsset[],
        assetMap: Record<string, BaseAsset>,
        source: 'Real-time' | 'Mock' | 'Hybrid'
    }> {
        // 1. Parallel Fetch/Import
        let supabaseData: any[] = [];
        let source: 'Real-time' | 'Mock' | 'Hybrid' = 'Real-time';

        try {
            supabaseData = await supabaseService.getAssets();
            if (supabaseData.length === 0) source = 'Mock';
        } catch (err) {
            console.warn('Supabase fetch failed, falling back to Mock', err);
            source = 'Mock';
        }

        if (!this.cachedMockAssets) {
            const { assetDatabase, assetPositions } = await import('../data/assets.data');
            this.cachedMockAssets = Object.entries(assetDatabase).map(([name, dbEntry]) => {
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
        }

        // 2. Delegate Heavy Merging to Worker
        const worker = this.getWorker();
        const workerResult = await new Promise<{ assets: IAsset[], assetMap: Record<string, IAsset> }>((resolve) => {
            const handler = (e: MessageEvent) => {
                if (e.data.type === 'SYNC_COMPLETE') {
                    worker.removeEventListener('message', handler);
                    resolve(e.data.payload);
                }
            };
            worker.addEventListener('message', handler);
            worker.postMessage({
                type: 'SYNC_ASSETS',
                payload: {
                    supabaseData,
                    mockData: this.cachedMockAssets,
                    excludedIds: this.EXCLUDED_IDS
                }
            });
        });

        // 3. Hydrate into BaseAsset instances (Fast on Main Thread)
        const assets: BaseAsset[] = [];
        const assetMap: Record<string, BaseAsset> = {};

        workerResult.assets.forEach(raw => {
            const asset = AssetFactory.create(raw);
            assets.push(asset);
            assetMap[asset.id] = asset;
        });

        return { assets, assetMap, source };
    }
}
