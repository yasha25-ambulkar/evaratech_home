import { useEffect } from 'react';
import { useEvaraTechDataStore } from '../store/evaratechDataStore';
import { generateAllMockNodeData } from '../utils/mockDataGenerator';
import { useDataPolling } from './useDataPolling';

/**
 * Hook to initialize and manage IoT data
 * Loads mock data on mount and sets up polling
 */
export function useIoTData() {
    const {
        nodesData,
        isLoading,
        setLoading,
    } = useEvaraTechDataStore();

    // Enable active polling (2 min interval)
    useDataPolling(true);

    // Initialize mock data on mount
    useEffect(() => {
        const initializeData = async () => {
            // Only initialize if empty to prevent overwrite
            if (Object.keys(useEvaraTechDataStore.getState().nodesData).length > 0) return;

            setLoading(true);

            try {
                // Generate mock data for all nodes
                const mockData = generateAllMockNodeData();

                // Update store with mock data
                Object.entries(mockData).forEach(([nodeId, nodeData]) => {
                    useEvaraTechDataStore.getState().updateNodeData(nodeId, nodeData);
                });

                setLoading(false);
            } catch (error) {
                console.error('Failed to initialize IoT data:', error);
                setLoading(false);
            }
        };

        initializeData();
    }, []);

    return {
        nodesData,
        isLoading,
    };
}
