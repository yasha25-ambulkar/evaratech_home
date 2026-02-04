import type { Asset } from '../../../types';
import styles from './StatusNode.module.css';

interface StatusCardProps {
    node: Asset;
    onClick: () => void;
}

/**
 * StatusCard - Individual node card showing key metric and status
 */
function StatusCard({ node, onClick }: StatusCardProps) {
    // Get primary metric based on type
    const getPrimaryMetric = () => {
        // Since Asset type is simplified, we use mock values or capacity for now
        switch (node.type) {
            case 'pump':
                return { value: '450', unit: 'LPM', label: 'Flow Rate' };
            case 'sump':
            case 'tank':
                return { value: '85', unit: '%', label: 'Water Level' };
            case 'bore':
            case 'govt':
                return { value: '120', unit: 'LPM', label: 'Yield' };
            default:
                return { value: '-', unit: '', label: '-' };
        }
    };

    // Get secondary details
    const getSecondaryDetails = () => {
        switch (node.type) {
            case 'pump':
                return [
                    { label: 'Pressure', value: '4.2 Bar' },
                    { label: 'Status', value: node.status }
                ];
            case 'sump':
            case 'tank':
                return [
                    { label: 'Capacity', value: node.capacity },
                    { label: 'Condition', value: 'Excellent' }
                ];
            case 'bore':
            case 'govt':
                return [
                    { label: 'Depth', value: '450 ft' },
                    { label: 'Status', value: node.status }
                ];
            default:
                return [];
        }
    };

    const primary = getPrimaryMetric();
    const details = getSecondaryDetails();

    // Status color mapping
    const s = node.status.toLowerCase();
    const isActive = s === 'running' || s === 'active' || s === 'working' || s === 'flowing' || s === 'normal';

    const statusClass = isActive
        ? (node.isCritical ? styles.warning : styles.active)
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
