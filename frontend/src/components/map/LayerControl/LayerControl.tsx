import { useState } from 'react';
import { motion } from 'framer-motion';
import { useMapLayersStore, type LayerType } from '../../../store/mapLayersStore';
import styles from './LayerControl.module.css';

interface LayerConfig {
    id: LayerType;
    label: string;
    color: string;
    icon?: string;
    iconType?: 'icon' | 'text';
    type: 'point' | 'line';
}

const assetLayers: LayerConfig[] = [
    { id: 'pumps', label: 'Pump House', color: '#6A1B9A', icon: 'P', iconType: 'text', type: 'point' },
    { id: 'sumps', label: 'Sump', color: '#43A047', icon: 'S', iconType: 'text', type: 'point' },
    { id: 'tanks', label: 'OHT', color: '#1565C0', icon: 'T', iconType: 'text', type: 'point' },
    { id: 'iiitBores', label: 'Borewell (IIIT)', color: '#D32F2F', icon: 'B', iconType: 'text', type: 'point' },
    { id: 'govtBores', label: 'Borewell (Govt)', color: '#000000', icon: 'B', iconType: 'text', type: 'point' },
    { id: 'nonWorkingBores', label: 'Borewell (Non-Working)', color: '#9E9E9E', icon: 'B', iconType: 'text', type: 'point' },
];

const pipelineLayers: LayerConfig[] = [
    { id: 'mainPipelines', label: 'Water Supply', color: '#039BE5', type: 'line' },
    { id: 'borePipelines', label: 'Borewell Water', color: '#D32F2F', type: 'line' },
];

function LayerControl() {
    const { visibleLayers, toggleLayer } = useMapLayersStore();
    const [isOpen, setIsOpen] = useState(false);

    const containerVariants = {
        closed: {
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            transition: { type: 'spring', stiffness: 300, damping: 30 }
        },
        open: {
            width: '260px',
            height: 'auto',
            minHeight: '400px',
            borderRadius: '16px',
            transition: { type: 'spring', stiffness: 300, damping: 30 }
        }
    };

    const contentVariants = {
        closed: { opacity: 0, y: 20, display: 'none' },
        open: {
            opacity: 1,
            y: 0,
            display: 'flex',
            transition: { delay: 0.2, duration: 0.4 }
        }
    };

    const buttonVariants = {
        closed: { opacity: 1, scale: 1, transition: { delay: 0.2 } },
        open: { opacity: 0, scale: 0, transition: { duration: 0.2 } }
    };

    const renderLayerItem = (layer: LayerConfig) => {
        const isVisible = visibleLayers[layer.id];

        return (
            <div
                key={layer.id}
                className={`${styles.layerItem} ${isVisible ? styles.active : ''}`}
                onClick={() => toggleLayer(layer.id)}
            >
                <div className={styles.indicatorWrapper}>
                    {layer.type === 'point' ? (
                        <div className={styles.pointIndicator} style={{ backgroundColor: layer.color }}>
                            {layer.iconType === 'icon' ? (
                                <i className={`fas ${layer.icon}`}></i>
                            ) : (
                                <span className={styles.textIcon}>{layer.icon}</span>
                            )}
                        </div>
                    ) : (
                        <div className={styles.lineIndicator} style={{ backgroundColor: layer.color }} />
                    )}
                </div>
                <span className={styles.layerLabel}>{layer.label}</span>
                <input
                    type="checkbox"
                    checked={isVisible}
                    onChange={() => { }}
                    className={styles.hiddenCheckbox}
                />
            </div>
        );
    };

    return (
        <motion.div
            className={styles.container}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            variants={containerVariants}
        >
            {/* Circular Trigger Button */}
            <motion.button
                className={styles.triggerBtn}
                onClick={() => setIsOpen(true)}
                variants={buttonVariants}
                style={{ position: 'absolute', inset: 0, margin: 'auto' }}
            >
                <i className="fas fa-layer-group"></i>
                <span className={styles.triggerText}>INDEX</span>
            </motion.button>

            {/* Expandable Content */}
            <motion.div
                className={styles.contentContainer}
                variants={contentVariants}
            >
                <div className={styles.header}>
                    <h3 className={styles.title}>Map Layers</h3>
                    <button
                        className={styles.closeBtn}
                        onClick={(e) => { e.stopPropagation(); setIsOpen(false); }}
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>ASSETS</h4>
                    <div className={styles.layerList}>
                        {assetLayers.map(renderLayerItem)}
                    </div>
                </div>

                <div className={styles.divider} />

                <div className={styles.section}>
                    <h4 className={styles.sectionTitle}>PIPELINES</h4>
                    <div className={styles.layerList}>
                        {pipelineLayers.map(renderLayerItem)}
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default LayerControl;
