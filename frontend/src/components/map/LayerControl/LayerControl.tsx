import { useMapLayersStore, type LayerType } from '../../../store/mapLayersStore';
import styles from './LayerControl.module.css';

interface LayerConfig {
    id: LayerType;
    label: string;
    color: string;
    icon?: string; // FontAwesome class or text
    iconType?: 'icon' | 'text';
    type: 'point' | 'line';
}

const assetLayers: LayerConfig[] = [
    { id: 'pumps', label: 'Pump House', color: '#6A1B9A', icon: 'P', iconType: 'text', type: 'point' }, // Purple
    { id: 'sumps', label: 'Sump', color: '#43A047', icon: 'S', iconType: 'text', type: 'point' }, // Green
    { id: 'tanks', label: 'OHT', color: '#1565C0', icon: 'T', iconType: 'text', type: 'point' }, // Blue
    { id: 'iiitBores', label: 'Borewell (IIIT)', color: '#D32F2F', icon: 'B', iconType: 'text', type: 'point' }, // Red
    { id: 'govtBores', label: 'Borewell (Govt)', color: '#000000', icon: 'B', iconType: 'text', type: 'point' }, // Black
    { id: 'nonWorkingBores', label: 'Borewell (Non-Working)', color: '#9E9E9E', icon: 'B', iconType: 'text', type: 'point' }, // Gray
];

const pipelineLayers: LayerConfig[] = [
    { id: 'mainPipelines', label: 'Water Supply', color: '#039BE5', type: 'line' },
    { id: 'borePipelines', label: 'Borewell Water', color: '#D32F2F', type: 'line' },
];

function LayerControl() {
    const { visibleLayers, toggleLayer } = useMapLayersStore();

    const renderLayerItem = (layer: LayerConfig) => {
        const isVisible = visibleLayers[layer.id];

        return (
            <div
                key={layer.id}
                className={`${styles.layerItem} ${isVisible ? styles.active : ''}`}
                onClick={() => toggleLayer(layer.id)}
            >
                {/* Indicator */}
                <div className={styles.indicatorWrapper}>
                    {layer.type === 'point' ? (
                        <div
                            className={styles.pointIndicator}
                            style={{ backgroundColor: layer.color }}
                        >
                            {layer.iconType === 'icon' ? (
                                <i className={`fas ${layer.icon}`}></i>
                            ) : (
                                <span className={styles.textIcon}>{layer.icon}</span>
                            )}
                        </div>
                    ) : (
                        <div
                            className={styles.lineIndicator}
                            style={{ backgroundColor: layer.color }}
                        />
                    )}
                </div>

                <span className={styles.layerLabel}>
                    {layer.label}
                </span>

                {/* Hidden real checkbox for accessibility/state */}
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
        <div className={styles.container}>
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
        </div>
    );
}

export default LayerControl;
