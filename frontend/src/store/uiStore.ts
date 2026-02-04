import { create } from 'zustand';
import type { Asset } from '../types';

interface UIStore {
    // Shared state
    activePanel: 'none' | 'sidebar' | 'system' | 'status' | 'filters' | 'notifications' | 'userMenu' | 'nodeDetail' | 'more';
    selectedAsset: Asset | null;

    // Actions
    setActivePanel: (panel: UIStore['activePanel']) => void;
    openSidebar: (asset: Asset) => void;
    closeAll: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
    activePanel: 'none',
    selectedAsset: null,

    setActivePanel: (panel) => set((state) => ({
        activePanel: state.activePanel === panel ? 'none' : panel
    })),

    openSidebar: (asset) => set({
        activePanel: 'sidebar',
        selectedAsset: asset
    }),

    closeAll: () => set({
        activePanel: 'none',
        selectedAsset: null
    }),
}));
