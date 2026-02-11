import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, X } from 'lucide-react';
import type { Asset } from '../../../types';
import styles from './AssetHoverPreview.module.css';

interface AssetHoverPreviewProps {
    asset: Asset;
    onClose: () => void;
    onViewDetails: (asset: Asset) => void;
    onMouseEnter?: () => void;
    onMouseLeave?: () => void;
}

/**
 * AssetHoverPreview - A lightweight hover tooltip for assets.
 * Designed to match the minimalist industrial aesthetic of the reference images.
 */
const AssetHoverPreview = memo(function AssetHoverPreview({
    asset,
    onClose,
    onViewDetails,
    onMouseEnter,
    onMouseLeave,
}: AssetHoverPreviewProps) {
    // Determine status badge color
    const getStatusClass = (status: string) => {
        const lowerStatus = status.toLowerCase();
        if (lowerStatus === 'active' || lowerStatus === 'running' || lowerStatus === 'normal' || lowerStatus === 'working') return styles.statusActive;
        if (lowerStatus === 'warning') return styles.statusWarning;
        if (lowerStatus === 'critical') return styles.statusCritical;
        return styles.statusInactive;
    };

    const handleViewDetails = (e: React.MouseEvent) => {
        e.stopPropagation();
        onViewDetails(asset);
    };

    return (
        <motion.div
            className={styles.container}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <div className={styles.header}>
                <span className={styles.type}>{asset.type.toUpperCase()}</span>
                <div className={styles.headerRight}>
                    <span className={`${styles.statusBadge} ${getStatusClass(asset.status)}`}>
                        {asset.status}
                    </span>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close preview">
                        <X size={14} />
                    </button>
                </div>
            </div>

            <div className={styles.body}>
                <h3 className={styles.name}>{asset.id}</h3>
                <p className={styles.description}>{asset.name}</p>
                <div className={styles.metadata}>
                    <span className={styles.metadataLabel}>Location:</span>
                    <span className={styles.metadataValue}>{asset.specs || 'IIIT Campus'}</span>
                </div>
            </div>

            <button className={styles.cta} onClick={handleViewDetails}>
                View Details <ChevronRight size={16} />
            </button>

            {/* Directional Arrow / Caret */}
            <div className={styles.arrow} />
        </motion.div>
    );
});

export default AssetHoverPreview;
