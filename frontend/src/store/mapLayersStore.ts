import { create } from 'zustand';

export type LayerType =
    | 'pumps'
    | 'sumps'
    | 'tanks'
    | 'iiitBores'
    | 'govtBores'
    | 'nonWorkingBores'
    | 'mainPipelines'
    | 'distPipelines'
    | 'borePipelines';

interface MapLayersStore {
    visibleLayers: Record<LayerType, boolean>;
    toggleLayer: (layer: LayerType) => void;
    setLayerVisibility: (layer: LayerType, visible: boolean) => void;
    resetToDefaults: () => void;
}

// Default visibility
const defaultVisibility: Record<LayerType, boolean> = {
    pumps: true,
    sumps: true,
    tanks: true,
    iiitBores: true,
    govtBores: true,
    nonWorkingBores: true,
    mainPipelines: true,
    distPipelines: true,
    borePipelines: true,
};

export const useMapLayersStore = create<MapLayersStore>((set) => ({
    visibleLayers: defaultVisibility,

    toggleLayer: (layer) =>
        set((state) => ({
            visibleLayers: {
                ...state.visibleLayers,
                [layer]: !state.visibleLayers[layer],
            },
        })),

    setLayerVisibility: (layer, visible) =>
        set((state) => ({
            visibleLayers: {
                ...state.visibleLayers,
                [layer]: visible,
            },
        })),

    resetToDefaults: () =>
        set({ visibleLayers: defaultVisibility }),
}));
