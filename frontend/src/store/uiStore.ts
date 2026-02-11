import { create } from 'zustand';
import { BaseAsset } from '../models/Asset';

interface UIStore {
    // Shared state
    activePanel: 'none' | 'sidebar' | 'system' | 'status' | 'filters' | 'notifications' | 'userMenu' | 'nodeDetail' | 'more';
    selectedAsset: BaseAsset | null;

    // Hover state management (Phase 1)
    hoveredAsset: BaseAsset | null;
    hoverStartTime: number | null;
    isPanelLocked: boolean;
    autoCloseTimer: NodeJS.Timeout | null;

    // Actions
    setActivePanel: (panel: UIStore['activePanel']) => void;
    openSidebar: (asset: BaseAsset) => void;
    closeAll: () => void;

    // Hover actions (Phase 1)
    setHoveredAsset: (asset: BaseAsset | null) => void;
    lockPanel: () => void;
    unlockPanel: () => void;
    closeHoverPanel: () => void;
    setAutoCloseTimer: (timer: NodeJS.Timeout | null) => void;
}

export const useUIStore = create<UIStore>((set, get) => ({
    activePanel: 'none',
    selectedAsset: null,

    // Hover state (Phase 1)
    hoveredAsset: null,
    hoverStartTime: null,
    isPanelLocked: false,
    autoCloseTimer: null,

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

    // Hover actions (Phase 1)
    setHoveredAsset: (asset) => {
        const state = get();

        // Clear existing timer
        if (state.autoCloseTimer) {
            clearTimeout(state.autoCloseTimer);
        }

        set({
            hoveredAsset: asset,
            hoverStartTime: asset ? Date.now() : null,
            autoCloseTimer: null,
        });
    },

    lockPanel: () => {
        const state = get();

        // Clear auto-close timer when locking
        if (state.autoCloseTimer) {
            clearTimeout(state.autoCloseTimer);
        }

        set({
            isPanelLocked: true,
            autoCloseTimer: null,
        });
    },

    unlockPanel: () => set({
        isPanelLocked: false,
    }),

    closeHoverPanel: () => {
        const state = get();

        // Clear timer
        if (state.autoCloseTimer) {
            clearTimeout(state.autoCloseTimer);
        }

        set({
            hoveredAsset: null,
            hoverStartTime: null,
            isPanelLocked: false,
            autoCloseTimer: null,
        });
    },

    setAutoCloseTimer: (timer) => set({
        autoCloseTimer: timer,
    }),
}));
