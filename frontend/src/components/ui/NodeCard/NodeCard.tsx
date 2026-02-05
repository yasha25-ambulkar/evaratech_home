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
}

function NodeCard({
    id,
    name,
    type,
    status,
    location,
    lastUpdate,
    typeColor,
    typeIcon,
    statusColor
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

            <h3 className={styles.nodeName}>{name}</h3>
            <p className={styles.nodeLocation}>
                <i className="fas fa-map-marker-alt"></i> {location}
            </p>
            <p className={styles.nodeUpdate}>
                <i className="fas fa-clock"></i> {lastUpdate}
            </p>

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
