import { create } from 'zustand';
import type { TimeRange } from '../types/evaratech.types';

// ============================================================================
// COMPARISON STORE
// ============================================================================

export type ComparisonMetric =
    | 'flowRate'
    | 'waterLevel'
    | 'consumption'
    | 'pressure'
    | 'temperature';

interface ComparisonStore {
    // ========== STATE ==========

    // Selected nodes for comparison (max 5)
    selectedNodes: string[]; // Node IDs

    // Metric to compare
    comparisonMetric: ComparisonMetric;

    // Time range for comparison
    timeRange: TimeRange;

    // Comparison mode active
    isComparing: boolean;

    // ========== ACTIONS ==========

    // Node selection
    addNode: (nodeId: string) => void;
    removeNode: (nodeId: string) => void;
    toggleNode: (nodeId: string) => void;
    clearNodes: () => void;

    // Metric selection
    setMetric: (metric: ComparisonMetric) => void;

    // Time range
    setTimeRange: (range: TimeRange) => void;

    // Comparison mode
    startComparison: () => void;
    stopComparison: () => void;

    // Utility
    canAddNode: () => boolean;
    getSelectedNodesCount: () => number;
    reset: () => void;
}

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

const MAX_NODES = 5;

export const useComparisonStore = create<ComparisonStore>((set, get) => ({
    // ========== INITIAL STATE ==========
    selectedNodes: [],
    comparisonMetric: 'flowRate',
    timeRange: {
        start: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
        end: new Date(),
        label: '24h',
    },
    isComparing: false,

    // ========== NODE SELECTION ==========

    addNode: (nodeId: string) => {
        const { selectedNodes, canAddNode } = get();

        if (!canAddNode()) {
            console.warn(`Cannot add more than ${MAX_NODES} nodes for comparison`);
            return;
        }

        if (selectedNodes.includes(nodeId)) {
            console.warn(`Node ${nodeId} is already selected`);
            return;
        }

        set((state) => ({
            selectedNodes: [...state.selectedNodes, nodeId],
        }));
    },

    removeNode: (nodeId: string) => {
        set((state) => ({
            selectedNodes: state.selectedNodes.filter((id) => id !== nodeId),
        }));
    },

    toggleNode: (nodeId: string) => {
        const { selectedNodes, addNode, removeNode } = get();

        if (selectedNodes.includes(nodeId)) {
            removeNode(nodeId);
        } else {
            addNode(nodeId);
        }
    },

    clearNodes: () => {
        set({ selectedNodes: [] });
    },

    // ========== METRIC SELECTION ==========

    setMetric: (metric: ComparisonMetric) => {
        set({ comparisonMetric: metric });
    },

    // ========== TIME RANGE ==========

    setTimeRange: (range: TimeRange) => {
        set({ timeRange: range });
    },

    // ========== COMPARISON MODE ==========

    startComparison: () => {
        const { selectedNodes } = get();

        if (selectedNodes.length < 2) {
            console.warn('Need at least 2 nodes to start comparison');
            return;
        }

        set({ isComparing: true });
    },

    stopComparison: () => {
        set({ isComparing: false });
    },

    // ========== UTILITY ==========

    canAddNode: () => {
        const { selectedNodes } = get();
        return selectedNodes.length < MAX_NODES;
    },

    getSelectedNodesCount: () => {
        const { selectedNodes } = get();
        return selectedNodes.length;
    },

    reset: () => {
        set({
            selectedNodes: [],
            comparisonMetric: 'flowRate',
            timeRange: {
                start: new Date(Date.now() - 24 * 60 * 60 * 1000),
                end: new Date(),
                label: '24h',
            },
            isComparing: false,
        });
    },
}));
