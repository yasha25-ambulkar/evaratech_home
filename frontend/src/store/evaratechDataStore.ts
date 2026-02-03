import { create } from 'zustand';
import type {
    NodeData,
    PipelineData,
    Alert,
    SystemAnalytics,
    DailyAnalytics,
    NodeType,
} from '../types/evaratech.types';

// ============================================================================
// EVARATECH DATA STORE
// ============================================================================

interface EvaraTechDataStore {
    // ========== STATE ==========

    // All nodes data (keyed by nodeId)
    nodesData: Record<string, NodeData>;

    // All pipelines data (keyed by pipelineId)
    pipelinesData: Record<string, PipelineData>;

    // Active alerts
    alerts: Alert[];

    // System-wide analytics
    systemAnalytics: SystemAnalytics | null;

    // Daily analytics per node
    dailyAnalytics: Record<string, DailyAnalytics>;

    // Loading states
    isLoading: boolean;
    isPolling: boolean;
    lastUpdate: Date | null;

    // Error state
    error: string | null;

    // ========== ACTIONS ==========

    // Data fetching
    fetchAllNodesData: () => Promise<void>;
    fetchNodeData: (nodeId: string) => Promise<void>;
    fetchPipelinesData: () => Promise<void>;

    // Data updates
    updateNodeData: (nodeId: string, data: Partial<NodeData>) => void;
    updatePipelineData: (pipelineId: string, data: Partial<PipelineData>) => void;

    // Polling control
    startPolling: (interval?: number) => void;
    stopPolling: () => void;

    // Node filtering
    getActiveNodes: () => NodeData[];
    getInactiveNodes: () => NodeData[];
    getNodesByType: (type: NodeType) => NodeData[];
    getNodeById: (nodeId: string) => NodeData | undefined;

    // Alert management
    addAlert: (alert: Alert) => void;
    acknowledgeAlert: (alertId: string) => void;
    clearAlerts: () => void;
    getAlertsByNode: (nodeId: string) => Alert[];

    // Analytics
    calculateSystemAnalytics: () => void;
    calculateNodeAnalytics: (nodeId: string) => DailyAnalytics | null;

    // Utility
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    reset: () => void;
}

// ============================================================================
// STORE IMPLEMENTATION
// ============================================================================

export const useEvaraTechDataStore = create<EvaraTechDataStore>((set, get) => ({
    // ========== INITIAL STATE ==========
    nodesData: {},
    pipelinesData: {},
    alerts: [],
    systemAnalytics: null,
    dailyAnalytics: {},
    isLoading: false,
    isPolling: false,
    lastUpdate: null,
    error: null,

    // ========== DATA FETCHING ==========

    fetchAllNodesData: async () => {
        set({ isLoading: true, error: null });
        try {
            // TODO: Replace with actual API call
            // For now, this will be implemented with mock data
            const mockData = {}; // Will be populated by mock generator

            set({
                nodesData: mockData,
                lastUpdate: new Date(),
                isLoading: false,
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch nodes data',
                isLoading: false,
            });
        }
    },

    fetchNodeData: async (nodeId: string) => {
        try {
            // TODO: Replace with actual API call
            // Fetch specific node data
            const mockNodeData = {}; // Will be populated by mock generator

            set((state) => ({
                nodesData: {
                    ...state.nodesData,
                    [nodeId]: mockNodeData as NodeData,
                },
                lastUpdate: new Date(),
            }));
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : `Failed to fetch node ${nodeId}`,
            });
        }
    },

    fetchPipelinesData: async () => {
        try {
            // TODO: Replace with actual API call
            const mockPipelinesData = {}; // Will be populated by mock generator

            set({
                pipelinesData: mockPipelinesData,
                lastUpdate: new Date(),
            });
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : 'Failed to fetch pipelines data',
            });
        }
    },

    // ========== DATA UPDATES ==========

    updateNodeData: (nodeId: string, data: Partial<NodeData>) => {
        // 1. Update data
        set((state) => {
            const updatedNode = {
                ...state.nodesData[nodeId],
                ...data,
            } as NodeData;

            // 2. Run Alert Detection
            // Optimization: Only run every X updates or check significant changes
            // For now, simpler implementation:

            // Note: In a real app we would want to avoid creating duplicate alerts constantly
            // This logic would need debouncing or state checking

            return {
                nodesData: {
                    ...state.nodesData,
                    [nodeId]: updatedNode,
                },
                lastUpdate: new Date(),
            };
        });
    },

    updatePipelineData: (pipelineId: string, data: Partial<PipelineData>) => {
        set((state) => ({
            pipelinesData: {
                ...state.pipelinesData,
                [pipelineId]: {
                    ...state.pipelinesData[pipelineId],
                    ...data,
                },
            },
            lastUpdate: new Date(),
        }));
    },

    // ========== POLLING CONTROL ==========

    startPolling: () => {
        // 2 minutes default
        set({ isPolling: true });

        // TODO: Implement actual polling mechanism
        // This will be done in Phase 5
    },

    stopPolling: () => {
        set({ isPolling: false });
    },

    // ========== NODE FILTERING ==========

    getActiveNodes: () => {
        const { nodesData } = get();
        return Object.values(nodesData).filter((node) => node.isActive);
    },

    getInactiveNodes: () => {
        const { nodesData } = get();
        return Object.values(nodesData).filter((node) => !node.isActive);
    },

    getNodesByType: (type: NodeType) => {
        const { nodesData } = get();
        return Object.values(nodesData).filter((node) => node.type === type);
    },

    getNodeById: (nodeId: string) => {
        const { nodesData } = get();
        return nodesData[nodeId];
    },

    // ========== ALERT MANAGEMENT ==========

    addAlert: (alert: Alert) => {
        set((state) => ({
            alerts: [...state.alerts, alert],
        }));
    },

    acknowledgeAlert: (alertId: string) => {
        set((state) => ({
            alerts: state.alerts.map((alert) =>
                alert.id === alertId ? { ...alert, acknowledged: true } : alert
            ),
        }));
    },

    clearAlerts: () => {
        set({ alerts: [] });
    },

    getAlertsByNode: (nodeId: string) => {
        const { alerts } = get();
        return alerts.filter((alert) => alert.nodeId === nodeId);
    },

    // ========== ANALYTICS ==========

    calculateSystemAnalytics: () => {
        const { nodesData } = get();
        const nodes = Object.values(nodesData);

        // Calculate system-wide metrics
        const totalWaterInSystem = nodes
            .filter((node) => node.type === 'tank' || node.type === 'sump')
            .reduce((sum, node) => {
                const latestVolume = node.currentVolume?.[node.currentVolume.length - 1]?.value || 0;
                return sum + latestVolume;
            }, 0);

        const activePumpsCount = nodes.filter(
            (node) => node.type === 'pump' && node.pumpStatus === 'Running'
        ).length;

        const workingBorewellsCount = nodes.filter(
            (node) => (node.type === 'bore' || node.type === 'govt') && node.pumpStatus === 'Working'
        ).length;

        // TODO: Implement more sophisticated analytics
        const systemAnalytics: SystemAnalytics = {
            totalWaterInSystem,
            totalDailyConsumption: 0, // To be calculated
            activePumpsCount,
            workingBorewellsCount,
            systemEfficiency: 0, // To be calculated
            alertsCount: {
                critical: 0,
                high: 0,
                medium: 0,
                low: 0,
            },
        };

        set({ systemAnalytics });
    },

    calculateNodeAnalytics: (nodeId: string) => {
        const { nodesData } = get();
        const node = nodesData[nodeId];

        if (!node) return null;

        // TODO: Implement node-specific analytics
        const analytics: DailyAnalytics = {
            nodeId,
            date: new Date(),
            totalConsumption: 0,
            peakUsageTime: '00:00',
            averageFlowRate: 0,
            efficiency: 0,
            anomaliesDetected: 0,
        };

        return analytics;
    },

    // ========== UTILITY ==========

    setLoading: (loading: boolean) => {
        set({ isLoading: loading });
    },

    setError: (error: string | null) => {
        set({ error });
    },

    reset: () => {
        set({
            nodesData: {},
            pipelinesData: {},
            alerts: [],
            systemAnalytics: null,
            dailyAnalytics: {},
            isLoading: false,
            isPolling: false,
            lastUpdate: null,
            error: null,
        });
    },
}));
