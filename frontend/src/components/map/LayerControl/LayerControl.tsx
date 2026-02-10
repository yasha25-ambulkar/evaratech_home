import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMapLayersStore, type LayerType } from '../../../store/mapLayersStore';
import { GlassMenu, GlassMenuItem, GlassMenuSection } from '../../ui/GlassMenu/GlassMenu';
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

    return (
        <div className={styles.container}>
            {/* Circular Trigger Button */}
            {/* Circular Trigger Button */}
            <motion.button
                className={styles.triggerBtn}
                onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <img
                    src="/assets/index-pin.png"
                    alt="Index"
                    style={{
                        width: '24px',
                        height: '24px',
                        objectFit: 'contain',
                        // Filter for drop shadow optional, maybe keep subtle
                    }}
                />
                <span className={styles.triggerText}>
                    Index
                </span>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <div onClick={(e) => e.stopPropagation()}>
                        <GlassMenu
                            title="LAYERS"
                            style={{
                                position: 'absolute',
                                top: 'auto', // Override CSS default
                                right: 'auto', // Override CSS default
                                bottom: '80px', // Correct position above button
                                left: '0',
                                width: '270px', // Increased by 5%
                                transformOrigin: 'bottom left',
                                zIndex: 1000,
                                padding: '8px',
                                fontSize: '0.600rem' // ~10px font
                            }}
                            contentStyle={{
                                maxHeight: 'none',
                                overflow: 'visible',
                                padding: '0'
                            }}
                            initial={{ opacity: 0, scale: 0.2, y: 50 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.2, y: 50 }}
                        >
                            {/* Two Column Grid for Assets */}
                            <div style={{ marginBottom: '12px' }}>
                                <GlassMenuSection title="ASSETS" />
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '8px'
                                }}>
                                    {assetLayers.map(layer => (
                                        <GlassMenuItem
                                            key={layer.id}
                                            text={layer.label}
                                            badgeColor={layer.color}
                                            badgeText={layer.type === 'point' ? layer.icon : undefined}
                                            icon={layer.type === 'line' ? 'fas fa-minus' : undefined}
                                            isActive={visibleLayers[layer.id]}
                                            onClick={() => toggleLayer(layer.id)}
                                        />
                                    ))}
                                </div>
                            </div>

                            {/* Pipelines Pipeline (Full width or Grid?) -> Grid looks cleaner */}
                            <div>
                                <GlassMenuSection title="PIPELINES" />
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '8px'
                                }}>
                                    {pipelineLayers.map(layer => (
                                        <GlassMenuItem
                                            key={layer.id}
                                            text={layer.label}
                                            badgeColor={layer.color}
                                            icon="fas fa-minus"
                                            isActive={visibleLayers[layer.id]}
                                            onClick={() => toggleLayer(layer.id)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </GlassMenu>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default LayerControl;
