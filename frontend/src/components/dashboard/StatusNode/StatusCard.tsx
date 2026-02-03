import type { NodeData } from '../../../types/evaratech.types';
import { getLatestReading } from '../../../utils/mockDataGenerator';
import styles from './StatusNode.module.css';

interface StatusCardProps {
    node: NodeData;
    onClick: () => void;
}

/**
 * StatusCard - Individual node card showing key metric and status
 */
function StatusCard({ node, onClick }: StatusCardProps) {
    // Get primary metric based on type
    const getPrimaryMetric = () => {
        switch (node.type) {
            case 'pump':
                const flow = getLatestReading(node.flowRate);
                return { value: flow?.value.toFixed(0), unit: flow?.unit, label: 'Flow Rate' };
            case 'sump':
            case 'tank':
                const level = getLatestReading(node.waterLevel);
                return { value: level?.value.toFixed(1), unit: level?.unit, label: 'Water Level' };
            case 'bore':
            case 'govt':
                const bLevel = getLatestReading(node.waterLevel);
                return { value: bLevel?.value.toFixed(1), unit: bLevel?.unit, label: 'Water Level' };
            default:
                return { value: '-', unit: '', label: '-' };
        }
    };

    // Get secondary details
    const getSecondaryDetails = () => {
        switch (node.type) {
            case 'pump':
                const pressure = getLatestReading(node.pressure);
                return [
                    { label: 'Pressure', value: `${pressure?.value.toFixed(1)} ${pressure?.unit}` },
                    { label: 'Status', value: node.pumpStatus }
                ];
            case 'sump':
            case 'tank':
                const vol = getLatestReading(node.currentVolume);
                return [
                    { label: 'Volume', value: `${(vol?.value ? vol.value / 1000 : 0).toFixed(1)}k L` },
                    { label: 'Capacity', value: `${(node.capacity / 1000).toFixed(0)}k L` }
                ];
            case 'bore':
            case 'govt':
                const flow = getLatestReading(node.flowRate);
                return [
                    { label: 'Flow', value: `${flow?.value.toFixed(0)} ${flow?.unit}` },
                    { label: 'Pump', value: node.pumpStatus }
                ];
            default:
                return [];
        }
    };

    const primary = getPrimaryMetric();
    const details = getSecondaryDetails();

    // Status color logic
    const statusClass = node.isActive
        ? (node.status === 'active' ? styles.active : styles.warning)
        : styles.inactive;

    return (
        <div className={styles.card} onClick={onClick}>
            <div className={styles.cardHeader}>
                <div>
                    <div className={styles.nodeType}>{node.type}</div>
                    <h3 className={styles.nodeName}>{node.name}</h3>
                </div>
                <div className={`${styles.statusIndicator} ${statusClass}`} />
            </div>

            <div className={styles.mainMetric}>
                <span className={styles.metricValue}>{primary.value}</span>
                <span className={styles.metricUnit}>{primary.unit}</span>
            </div>

            <div className={styles.details}>
                {details.map((detail, idx) => (
                    <div key={idx} className={styles.detailItem}>
                        <span className={styles.detailLabel}>{detail.label}</span>
                        <span className={styles.detailValue}>{detail.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StatusCard;
