import React from 'react';
import type { Asset } from '../../../types';
import styles from './SquareStatusCard.module.css';

interface SquareStatusCardProps {
    node: Asset;
    onClick: () => void;
}

const SquareStatusCard: React.FC<SquareStatusCardProps> = ({ node, onClick }) => {
    // Determine icon and color based on type
    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'pump': return <i className="fas fa-water"></i>;
            case 'sump': return <i className="fas fa-database"></i>;
            case 'tank': return <i className="fas fa-layer-group"></i>;
            case 'bore': return <i className="fas fa-arrow-circle-down"></i>;
            default: return <i className="fas fa-cube"></i>;
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'pump': return 'blue';
            case 'sump': return 'purple';
            case 'tank': return 'cyan';
            case 'bore': return 'orange';
            default: return 'gray';
        }
    };

    const statusColor = node.status === 'active' || node.status === 'running' ? 'green' :
        node.status === 'alert' || node.isCritical ? 'red' : 'gray';

    return (
        <div className={`${styles.card} ${styles[getTypeColor(node.type)]}`} onClick={onClick}>
            <div className={styles.header}>
                <div className={styles.icon}>
                    {getTypeIcon(node.type)}
                </div>
                <div className={`${styles.statusDot} ${styles[statusColor]}`}></div>
            </div>

            <div className={styles.info}>
                <h3 className={styles.name}>{node.name}</h3>
                <div className={styles.meta}>
                    <span className={styles.type}>{node.type}</span>
                    <span className={styles.location}>{node.location || 'Main Campus'}</span>
                </div>
            </div>

            <div className={styles.footer}>
                <button className={styles.actionBtn}>View Details</button>
            </div>
        </div>
    );
};

export default SquareStatusCard;
