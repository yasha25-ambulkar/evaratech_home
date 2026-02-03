import { create } from 'zustand';
import type { Asset } from '../types';

interface UIStore {
    isSidebarOpen: boolean;
    selectedAsset: Asset | null;
    openSidebar: (asset: Asset) => void;
    closeSidebar: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
    isSidebarOpen: false,
    selectedAsset: null,
    openSidebar: (asset) => set({ isSidebarOpen: true, selectedAsset: asset }),
    closeSidebar: () => set({ isSidebarOpen: false, selectedAsset: null }),
}));
