import { useMemo } from 'react';
import type { NodeData } from '../../../types/evaratech.types';
import { getLatestReading } from '../../../utils/mockDataGenerator';
import styles from './LiveTooltip.module.css';

interface LiveTooltipProps {
    node: NodeData;
    isActive: boolean;
}

/**
 * LiveTooltip - Displays real-time sensor data for map markers
 * Shows different metrics based on node type (pump, sump, tank, borewell)
 */
function LiveTooltip({ node, isActive }: LiveTooltipProps) {
    // Get latest readings for each metric
    const latestData = useMemo(() => {
        if (node.type === 'pump') {
            return {
                flowRate: getLatestReading(node.flowRate),
                pressure: getLatestReading(node.pressure),
                powerConsumption: getLatestReading(node.powerConsumption),
            };
        } else if (node.type === 'sump') {
            return {
                waterLevel: getLatestReading(node.waterLevel),
                currentVolume: getLatestReading(node.currentVolume),
                inletFlow: getLatestReading(node.inletFlow),
                outletFlow: getLatestReading(node.outletFlow),
                temperature: getLatestReading(node.temperature),
            };
        } else if (node.type === 'tank') {
            return {
                waterLevel: getLatestReading(node.waterLevel),
                currentVolume: getLatestReading(node.currentVolume),
                fillRate: getLatestReading(node.fillRate),
                consumptionRate: getLatestReading(node.consumptionRate),
                temperature: getLatestReading(node.temperature),
            };
        } else {
            // Borewell
            return {
                waterLevel: getLatestReading(node.waterLevel),
                flowRate: getLatestReading(node.flowRate),
            };
        }
    }, [node]);

    // Format time ago
    const timeAgo = useMemo(() => {
        const now = new Date();
        const diff = now.getTime() - node.lastUpdated.getTime();
        const minutes = Math.floor(diff / 60000);

        if (minutes < 1) return 'Just now';
        if (minutes === 1) return '1 min ago';
        if (minutes < 60) return `${minutes} mins ago`;

        const hours = Math.floor(minutes / 60);
        if (hours === 1) return '1 hour ago';
        if (hours < 24) return `${hours} hours ago`;

        const days = Math.floor(hours / 24);
        return `${days} day${days > 1 ? 's' : ''} ago`;
    }, [node.lastUpdated]);

    // Render based on node type
    const renderContent = () => {
        if (node.type === 'pump') {
            return (
                <>
                    <div className={styles.row}>
                        <span className={styles.label}>Status:</span>
                        <span className={`${styles.value} ${styles.statusBadge} ${node.pumpStatus === 'Running' ? styles.statusRunning : styles.statusStopped
                            }`}>
                            {node.pumpStatus}
                        </span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>Flow Rate:</span>
                        <span className={styles.value}>
                            {latestData.flowRate?.value.toFixed(1)} {latestData.flowRate?.unit}
                            <span className={styles.trend}>↑</span>
                        </span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>Pressure:</span>
                        <span className={styles.value}>
                            {latestData.pressure?.value.toFixed(2)} {latestData.pressure?.unit}
                        </span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>Power:</span>
                        <span className={styles.value}>
                            {latestData.powerConsumption?.value.toFixed(1)} {latestData.powerConsumption?.unit}
                        </span>
                    </div>
                </>
            );
        }

        if (node.type === 'sump') {
            return (
                <>
                    <div className={styles.row}>
                        <span className={styles.label}>Water Level:</span>
                        <span className={styles.value}>
                            {latestData.waterLevel?.value.toFixed(1)} {latestData.waterLevel?.unit}
                            <span className={styles.trend}>↓</span>
                        </span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>Volume:</span>
                        <span className={styles.value}>
                            {((latestData as any).currentVolume?.value / 1000).toFixed(0)}k / {(node.capacity / 1000).toFixed(0)}k L
                        </span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>Inlet:</span>
                        <span className={styles.value}>
                            {latestData.inletFlow?.value.toFixed(0)} {latestData.inletFlow?.unit}
                        </span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>Outlet:</span>
                        <span className={styles.value}>
                            {latestData.outletFlow?.value.toFixed(0)} {latestData.outletFlow?.unit}
                        </span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>Temp:</span>
                        <span className={styles.value}>
                            {latestData.temperature?.value.toFixed(1)} {latestData.temperature?.unit}
                        </span>
                    </div>
                </>
            );
        }

        if (node.type === 'tank') {
            return (
                <>
                    <div className={styles.row}>
                        <span className={styles.label}>Water Level:</span>
                        <span className={styles.value}>
                            {latestData.waterLevel?.value.toFixed(1)} {latestData.waterLevel?.unit}
                            <span className={styles.trend}>↑</span>
                        </span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>Volume:</span>
                        <span className={styles.value}>
                            {((latestData as any).currentVolume?.value / 1000).toFixed(0)}k / {(node.capacity / 1000).toFixed(0)}k L
                        </span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>Fill Rate:</span>
                        <span className={styles.value}>
                            {latestData.fillRate?.value.toFixed(0)} {latestData.fillRate?.unit}
                        </span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>Consumption:</span>
                        <span className={styles.value}>
                            {latestData.consumptionRate?.value.toFixed(0)} {latestData.consumptionRate?.unit}
                        </span>
                    </div>
                    <div className={styles.row}>
                        <span className={styles.label}>Temp:</span>
                        <span className={styles.value}>
                            {latestData.temperature?.value.toFixed(1)} {latestData.temperature?.unit}
                        </span>
                    </div>
                </>
            );
        }

        // Borewell
        return (
            <>
                <div className={styles.row}>
                    <span className={styles.label}>Water Level:</span>
                    <span className={styles.value}>
                        {latestData.waterLevel?.value.toFixed(1)} {latestData.waterLevel?.unit}
                        <span className={styles.trend}>↓</span>
                    </span>
                </div>
                <div className={styles.row}>
                    <span className={styles.label}>Pump Status:</span>
                    <span className={`${styles.value} ${styles.statusBadge} ${node.pumpStatus === 'Working' ? styles.statusRunning : styles.statusStopped
                        }`}>
                        {node.pumpStatus}
                    </span>
                </div>
                {latestData.flowRate && (
                    <div className={styles.row}>
                        <span className={styles.label}>Flow Rate:</span>
                        <span className={styles.value}>
                            {latestData.flowRate.value.toFixed(0)} {latestData.flowRate.unit}
                        </span>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className={styles.tooltip}>
            <div className={styles.header}>
                <h4 className={styles.title}>{node.name}</h4>
                <span className={`${styles.statusDot} ${isActive ? styles.active : styles.inactive}`} />
            </div>

            <div className={styles.content}>
                {renderContent()}
            </div>

            <div className={styles.footer}>
                <span className={styles.timestamp}>
                    <i className="fas fa-clock"></i> {timeAgo}
                </span>
            </div>
        </div>
    );
}

export default LiveTooltip;
