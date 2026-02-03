import type { NodeData, Alert, AlertType, AlertSeverity } from '../types/evaratech.types';

/**
 * Checks if a node is considered active (data within last 48 hours)
 */
export const isActiveNode = (node: NodeData): boolean => {
    const threshold = 48 * 60 * 60 * 1000; // 48 hours
    const now = new Date();
    return (now.getTime() - node.lastUpdated.getTime()) < threshold;
};

/**
 * Helper to get latest value from sensor array
 */
const getLatest = (readings: any[] | undefined): number => {
    if (!readings || readings.length === 0) return 0;
    return readings[readings.length - 1].value;
};

/**
 * Detect alerts based on node data
 */
export const detectAlerts = (node: NodeData): Alert[] => {
    const alerts: Alert[] = [];

    // 1. Inactive Check
    if (!isActiveNode(node)) {
        alerts.push(createAlert(node, 'inactive', 'high', 'No data received for > 48 hours'));
    }

    // 2. Type-specific checks
    if (node.type === 'pump') {
        const flow = getLatest(node.flowRate);

        // Pump running but no flow
        if (node.pumpStatus === 'Running' && flow < 10) {
            alerts.push(createAlert(node, 'pump-issue', 'critical', 'Pump running with zero flow detected'));
        }
    }
    else if (node.type === 'tank' || node.type === 'sump') {
        const level = getLatest(node.waterLevel);

        // Low water level (< 20%)
        if (level < 20) {
            alerts.push(createAlert(node, 'low-water', 'high', `Water level critically low (${level.toFixed(1)}%)`));
        }

        // Overflow risk (> 95%)
        if (level > 95) {
            alerts.push(createAlert(node, 'overflow-risk', 'medium', `Tank nearly full (${level.toFixed(1)}%) - Overflow risk`));
        }
    }

    return alerts;
};

/**
 * Factory for alert objects
 */
function createAlert(
    node: NodeData,
    type: AlertType,
    severity: AlertSeverity,
    message: string
): Alert {
    return {
        id: `${node.nodeId}-${type}-${Date.now()}`,
        nodeId: node.nodeId,
        nodeName: node.name,
        type,
        severity,
        message,
        timestamp: new Date(),
        acknowledged: false,
    };
}
