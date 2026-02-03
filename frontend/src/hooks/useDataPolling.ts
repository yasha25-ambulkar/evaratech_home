import { useEffect, useCallback, useRef } from 'react';
import { useEvaraTechDataStore } from '../store/evaratechDataStore';
import type { NodeData, SensorReading } from '../types/evaratech.types';

const POLLING_INTERVAL = 120000; // 2 minutes

/**
 * useDataPolling - Hook to simulate real-time data updates
 * Polls every 2 minutes for new sensor readings
 */
export function useDataPolling(enabled: boolean = true) {
    const {
        nodesData,
        updateNodeData,
    } = useEvaraTechDataStore();

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    /**
     * Generates a single new reading based on the last reading
     * Adds small random variation to simulate live sensor data
     */
    const generateNextReading = useCallback((lastReading: SensorReading | undefined, min: number, max: number): SensorReading => {
        const now = new Date();

        // If no previous reading (shouldn't happen with init data), generate fresh
        if (!lastReading) {
            return {
                timestamp: now,
                value: (min + max) / 2,
                unit: ''
            };
        }

        // Variation of +/- 5%
        const variation = (max - min) * 0.05;
        const change = (Math.random() - 0.5) * 2 * variation;
        let newValue = lastReading.value + change;

        // Clamp value
        newValue = Math.max(min, Math.min(max, newValue));

        return {
            timestamp: now,
            value: parseFloat(newValue.toFixed(2)),
            unit: lastReading.unit,
        };
    }, []);

    /**
     * Update a specific node with new readings
     */
    const updateNodeReadings = useCallback((node: NodeData) => {
        // Use type assertion to allow dynamic property assignment based on specific node type checks below
        const updates = {
            lastUpdated: new Date()
        } as any;

        // Helper to append new reading to array (keeping last 24h)
        const appendReading = (currentArray: SensorReading[], min: number, max: number): SensorReading[] => {
            const last = currentArray[currentArray.length - 1];
            const newReading = generateNextReading(last, min, max);

            // Keep only last 288 readings (24 hours approx)
            const newArray = [...currentArray, newReading];
            if (newArray.length > 288) {
                return newArray.slice(newArray.length - 288);
            }
            return newArray;
        };

        // Update based on node type
        if (node.type === 'pump') {
            updates.flowRate = appendReading(node.flowRate, 200, 500);
            updates.pressure = appendReading(node.pressure, 2.5, 4.5);
            updates.powerConsumption = appendReading(node.powerConsumption, 8, 15);

            // Randomly toggle status rarely
            if (Math.random() > 0.95) {
                updates.pumpStatus = node.pumpStatus === 'Running' ? 'Stopped' : 'Running';
            }
        }
        else if (node.type === 'sump') {
            updates.waterLevel = appendReading(node.waterLevel, 20, 95);
            updates.currentVolume = appendReading(node.currentVolume, node.capacity * 0.2, node.capacity * 0.95);
            updates.inletFlow = appendReading(node.inletFlow, 100, 300);
            updates.outletFlow = appendReading(node.outletFlow, 150, 350);
            updates.temperature = appendReading(node.temperature, 20, 28);
        }
        else if (node.type === 'tank') {
            updates.waterLevel = appendReading(node.waterLevel, 30, 90);
            updates.currentVolume = appendReading(node.currentVolume, node.capacity * 0.3, node.capacity * 0.9);
            updates.fillRate = appendReading(node.fillRate, 100, 250);
            updates.consumptionRate = appendReading(node.consumptionRate, 80, 200);
            updates.temperature = appendReading(node.temperature, 18, 26);
        }
        else if (node.type === 'bore' || node.type === 'govt') {
            updates.waterLevel = appendReading(node.waterLevel, 30, 60);
            updates.flowRate = appendReading(node.flowRate, 100, 200);
        }

        // Apply updates
        updateNodeData(node.nodeId, updates);
    }, [updateNodeData, generateNextReading]);

    /**
     * Poll cycle function
     */
    const poll = useCallback(() => {
        // Iterate all nodes and update them
        Object.values(nodesData).forEach(node => {
            updateNodeReadings(node);
        });
    }, [nodesData, updateNodeReadings]);

    // Effect to manage interval
    useEffect(() => {
        if (!enabled) {
            if (timerRef.current) clearInterval(timerRef.current);
            return;
        }

        // Initial poll
        // (Optional: usually we just wait for interval, but could trigger immediately if needed)

        timerRef.current = setInterval(poll, POLLING_INTERVAL);

        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [enabled, poll]);

    // Return manual refresh control
    return {
        forceRefresh: poll
    };
}
