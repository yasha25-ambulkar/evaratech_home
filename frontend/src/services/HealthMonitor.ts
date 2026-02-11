import { BaseAsset } from '../models/Asset';

export enum AssetHealth {
    Healthy = 'Healthy',
    Flapping = 'Flapping',
    Degraded = 'Degraded',
    Anomalous = 'Anomalous'
}

/**
 * HealthMonitor Service - Analyzes asset telemetry for anomalies.
 * Specifically detects "Flapping" assets (status toggling too frequently).
 */
class HealthMonitor {
    private static instance: HealthMonitor;
    private statusHistory: Map<string, Array<{ status: string, timestamp: number }>> = new Map();
    private readonly FLAPPING_THRESHOLD = 3; // Minimum transitions to flag as flapping
    private readonly ANALYSIS_WINDOW = 5 * 60 * 1000; // 5 minute window

    static getInstance(): HealthMonitor {
        if (!HealthMonitor.instance) {
            HealthMonitor.instance = new HealthMonitor();
        }
        return HealthMonitor.instance;
    }

    /**
     * Records a status update and analyzes for anomalies.
     */
    recordUpdate(asset: { id: string, status: string }): void {
        let history = this.statusHistory.get(asset.id) || [];
        const lastEntry = history[history.length - 1];

        // Only record if status changed
        if (!lastEntry || lastEntry.status !== asset.status) {
            history.push({ status: asset.status, timestamp: Date.now() });
        }

        // Prune entries outside the analysis window
        const now = Date.now();
        history = history.filter(h => now - h.timestamp < this.ANALYSIS_WINDOW);

        this.statusHistory.set(asset.id, history);
    }

    /**
     * Calculates the health status based on historical behavior.
     */
    getHealth(assetId: string): AssetHealth {
        const history = this.statusHistory.get(assetId) || [];

        if (history.length >= this.FLAPPING_THRESHOLD) {
            return AssetHealth.Flapping;
        }

        return AssetHealth.Healthy;
    }
}

export const healthMonitor = HealthMonitor.getInstance();
