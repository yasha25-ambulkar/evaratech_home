import { create } from 'zustand';
import type { AssetType } from '../types';

interface AssetStore {
    filteredAssetType: AssetType | null;
    setFilteredAssetType: (type: AssetType | null) => void;
}

export const useAssetStore = create<AssetStore>((set) => ({
    filteredAssetType: null,
    setFilteredAssetType: (type) => set({ filteredAssetType: type }),
}));
