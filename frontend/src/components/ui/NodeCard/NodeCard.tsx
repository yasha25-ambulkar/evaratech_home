import { Link } from 'react-router-dom';
import styles from './NodeCard.module.css';

interface NodeCardProps {
    id: string;
    name: string;
    type: 'pump' | 'sump' | 'tank' | 'bore' | 'govt';
    status: 'Normal' | 'Warning' | 'Critical';
    location: string;
    lastUpdate: string;
    // Visual helpers passed in for now (Phase 1)
    typeColor: string;
    typeIcon: string;
    statusColor: string;
    productBrand?: string;
    // EvaraTank Specifics
    tankCapacityLitres?: number;
    currentLevelMeters?: number;
    dailyUsage?: number;
}

function NodeCard({
    id,
    name,
    status,
    location,
    lastUpdate,
    typeColor,
    typeIcon,
    statusColor,
    productBrand,
    tankCapacityLitres,
    currentLevelMeters,
    dailyUsage
}: NodeCardProps) {
    return (
        <div className={styles.nodeCard}>
            <div className={styles.nodeHeader}>
                <div
                    className={styles.nodeIcon}
                    style={{ background: typeColor }}
                >
                    <i className={`fas ${typeIcon}`}></i>
                </div>
                <div
                    className={styles.statusBadge}
                    style={{ background: statusColor }}
                >
                    {status}
                </div>
            </div>

            <div className={styles.nodeMeta}>
                <h3 className={styles.nodeName}>{name}</h3>
                {productBrand && (
                    <span className={styles.productBadge}>{productBrand}</span>
                )}
            </div>
            <p className={styles.nodeLocation}>
                <i className="fas fa-map-marker-alt"></i> {location}
            </p>
            <p className={styles.nodeUpdate}>
                <i className="fas fa-clock"></i> {lastUpdate}
            </p>

            {/* EvaraTank Specific Metrics */}
            {productBrand === 'EvaraTank' && tankCapacityLitres && (
                <div className={styles.tankMetrics}>
                    <div className={styles.metricRow}>
                        <span className={styles.metricLabel}>Level:</span>
                        <span className={styles.metricValue}>{currentLevelMeters}m</span>
                    </div>
                    <div className={styles.metricRow}>
                        <span className={styles.metricLabel}>Volume:</span>
                        <span className={styles.metricValue}>{tankCapacityLitres.toLocaleString()} L</span>
                    </div>
                    <div className={styles.metricRow}>
                        <span className={styles.metricLabel}>Usage (Today):</span>
                        <span className={styles.metricValue}>{dailyUsage?.toLocaleString()} L</span>
                    </div>
                </div>
            )}

            <div className={styles.nodeActions}>
                <Link to={`/details?node=${id}`} className={styles.detailsBtn}>
                    <i className="fas fa-info-circle"></i> Details
                </Link>
                <Link to={`/map?node=${id}`} className={styles.mapLinkBtn}>
                    <i className="fas fa-map"></i> Map
                </Link>
            </div>
        </div>
    );
}

export default NodeCard;
