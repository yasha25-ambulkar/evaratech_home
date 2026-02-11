import { useState, useEffect, useCallback, memo, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, GeoJSON, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import { pipelineGeoJSON } from '@data/pipelines.data';
import { iiitBoundaryGeoJSON } from '@data/iiit_boundary.data';
import { MAP_CONFIG } from '@data/constants';
import { useUIStore, useMapLayersStore } from '../../store';
import LayerControl from '@components/map/LayerControl/LayerControl';
import SystemDashboard from '@components/dashboard/SystemDashboard/SystemDashboard';
import StatusNode from '@components/dashboard/StatusNode/StatusNode';
import FilterPanel from '@components/filters/FilterPanel/FilterPanel';

import styles from './AssetMap.module.css';

// Phase 2: OOP Principles
import { AssetRenderer } from '../../strategies/AssetRenderer';

// Components
import GlassMapControls from '@components/map/controls/GlassMapControls';
import Compass from '@components/map/Compass/Compass';
import FloatingAssetPanel from '@components/map/FloatingAssetPanel/FloatingAssetPanel';
import AssetHoverPreview from '@components/map/AssetHoverPreview/AssetHoverPreview';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssets } from '../../hooks/useAssets';
import { useAssetHover } from '../../hooks/useAssetHover';

// Fix Leaflet default icon issue
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Component to handle map clicks for closing sidebar
function MapClickHandler({ onMapClick }: { onMapClick: () => void }) {
    const map = useMap();

    useEffect(() => {
        const handleClick = () => {
            onMapClick();
        };
        map.on('click', handleClick);
        return () => {
            map.off('click', handleClick);
        };
    }, [map, onMapClick]);

    return null;
}

// Map Controller for Search Navigation
function MapController({ selectedAsset }: { selectedAsset: BaseAsset | null | undefined }) {
    const map = useMap();

    useEffect(() => {
        if (selectedAsset) {
            map.flyTo(selectedAsset.position, 18, {
                duration: 1.5,
                easeLinearity: 0.25
            });
        }
    }, [selectedAsset, map]);

    return null;
}

// Shared styling function
function getPipelineStyle(type: string, zoom: number, isHovered: boolean = false) {
    const baseWeight = Math.max(2, 4 * Math.pow(1.4, zoom - 15));
    const weight = isHovered ? baseWeight + 3 : baseWeight;

    let color = '#0077b6'; // Default Blue
    if (type === 'Bore Line') color = '#d62828'; // Red

    return {
        color,
        weight,
        opacity: 0.8,
    };
}

// ---------------------------------------------------------
// 💧 WATER SUPPLY LAYER (Blue Lines)
// ---------------------------------------------------------
function WaterSupplyLayer({ isVisible }: { isVisible: boolean }) {
    const map = useMap();
    const [zoom, setZoom] = useState(map.getZoom());
    const navigate = useNavigate();

    useEffect(() => {
        const handleZoom = () => setZoom(map.getZoom());
        map.on('zoomend', handleZoom);
        return () => { map.off('zoomend', handleZoom); };
    }, [map]);

    // Show ONLY if enabled
    if (!isVisible) return null;

    const waterFeatures = pipelineGeoJSON.features.filter(f =>
        f.properties.type === 'Main Line' || f.properties.type === 'Dist Line'
    );

    const geoJsonData = { ...pipelineGeoJSON, features: waterFeatures };

    return (
        <GeoJSON
            key={`water-${zoom}`}
            data={geoJsonData}
            style={(feature: any) => {
                const isHovered = false; // Initial state
                return {
                    ...getPipelineStyle(feature?.properties.type, zoom, isHovered),
                    className: 'liquid-pipeline-glow', // Add liquid class
                } as any;
            }}
            onEachFeature={(feature, layer) => {
                // Click Handler
                layer.on('click', () => {
                    const name = feature.properties.name || '';
                    if (name === 'PH4 - NWH Block C') {
                        navigate('/girls-hostel');
                    }
                });

                // Hover Effects
                layer.on('mouseover', (e: any) => {
                    const currentZoom = e.target._map.getZoom();
                    e.target.setStyle({
                        ...getPipelineStyle(feature.properties.type, currentZoom, true),
                        weight: Math.max(2, 4 * Math.pow(1.4, currentZoom - 15)) + 4 // Expand more
                    });
                });

                layer.on('mouseout', (e: any) => {
                    const currentZoom = e.target._map.getZoom();
                    e.target.setStyle(getPipelineStyle(feature.properties.type, currentZoom, false));
                });
            }}
        />
    );
}

// ---------------------------------------------------------
// 🔴 BORE SUPPLY LAYER (Red Lines)
// ---------------------------------------------------------
function BoreSupplyLayer({ isVisible }: { isVisible: boolean }) {
    const map = useMap();
    const [zoom, setZoom] = useState(map.getZoom());

    useEffect(() => {
        const handleZoom = () => setZoom(map.getZoom());
        map.on('zoomend', handleZoom);
        return () => { map.off('zoomend', handleZoom); };
    }, [map]);

    if (!isVisible) return null;

    const boreFeatures = pipelineGeoJSON.features.filter(f =>
        f.properties.type === 'Bore Line'
    );

    const geoJsonData = { ...pipelineGeoJSON, features: boreFeatures };
    return (
        <GeoJSON
            key={`bore-${zoom}`}
            data={geoJsonData}
            style={(_feature: any) => ({
                ...getPipelineStyle('Bore Line', zoom, false),
                className: 'liquid-bore-glow',
            } as any)}
            onEachFeature={(_feature, layer) => {
                layer.on('mouseover', (e: any) => {
                    const currentZoom = e.target._map.getZoom();
                    // Enhance hover
                    const style = getPipelineStyle('Bore Line', currentZoom, true);
                    e.target.setStyle({ ...style, weight: style.weight + 2 });
                });

                layer.on('mouseout', (e: any) => {
                    const currentZoom = e.target._map.getZoom();
                    e.target.setStyle(getPipelineStyle('Bore Line', currentZoom, false));
                });
            }}
        />
    );
}

// ---------------------------------------------------------
// 🏢 CAMPUS BOUNDARY LAYER (Black Line)
// ---------------------------------------------------------
function CampusBoundaryLayer() {
    return (
        <GeoJSON
            data={iiitBoundaryGeoJSON as any}
            style={() => ({
                color: '#000000',
                weight: 3,
                dashArray: '5, 10', // Dashed line for boundary feel
                fillColor: 'transparent',
                fillOpacity: 0
            })}
            interactive={false}
        />
    );
}

// Component to monitor map bounds for spatial optimization
function MapBoundsMonitor({ onBoundsChange }: { onBoundsChange: (bounds: L.LatLngBounds) => void }) {
    const map = useMap();

    useEffect(() => {
        const handleMove = () => {
            onBoundsChange(map.getBounds());
        };
        map.on('moveend', handleMove);
        // Initial bounds
        handleMove();
        return () => { map.off('moveend', handleMove); };
    }, [map, onBoundsChange]);

    return null;
}

// ---------------------------------------------------------
// 🏗️ MEMOIZED ASSET LAYERS (Refactored for Spatial Optimization)
// ---------------------------------------------------------

const PumpLayer = memo(({ assets, bounds, onHover }: {
    assets: BaseAsset[],
    bounds: L.LatLngBounds | null,
    onHover: (asset: BaseAsset) => void
}) => {
    const visibleAssets = useMemo(() => {
        return assets.filter(asset =>
            asset.type === 'pump' &&
            (!bounds || bounds.contains(L.latLng(asset.position[0], asset.position[1])))
        );
    }, [assets, bounds]);

    return (
        <>
            {visibleAssets.map((asset) => (
                <Marker
                    key={asset.id}
                    position={asset.position}
                    icon={AssetRenderer.createIcon(asset)}
                    eventHandlers={{ mouseover: () => onHover(asset) }}
                />
            ))}
        </>
    );
});

const SumpLayer = memo(({ assets, bounds, onHover }: {
    assets: BaseAsset[],
    bounds: L.LatLngBounds | null,
    onHover: (asset: BaseAsset) => void
}) => {
    const visibleAssets = useMemo(() => {
        return assets.filter(asset =>
            asset.type === 'sump' &&
            (!bounds || bounds.contains(L.latLng(asset.position[0], asset.position[1])))
        );
    }, [assets, bounds]);

    return (
        <>
            {visibleAssets.map((asset) => (
                <Marker
                    key={asset.id}
                    position={asset.position}
                    icon={AssetRenderer.createIcon(asset)}
                    eventHandlers={{ mouseover: () => onHover(asset) }}
                />
            ))}
        </>
    );
});

const TankLayer = memo(({ assets, bounds, onHover }: {
    assets: BaseAsset[],
    bounds: L.LatLngBounds | null,
    onHover: (asset: BaseAsset) => void
}) => {
    const visibleAssets = useMemo(() => {
        return assets.filter(asset =>
            asset.type === 'tank' &&
            (!bounds || bounds.contains(L.latLng(asset.position[0], asset.position[1])))
        );
    }, [assets, bounds]);

    return (
        <>
            {visibleAssets.map((asset) => (
                <Marker
                    key={asset.id}
                    position={asset.position}
                    icon={AssetRenderer.createIcon(asset)}
                    eventHandlers={{ mouseover: () => onHover(asset) }}
                />
            ))}
        </>
    );
});

const BoreLayer = memo(({ assets, bounds, onHover }: {
    assets: BaseAsset[],
    bounds: L.LatLngBounds | null,
    onHover: (asset: BaseAsset) => void
}) => {
    const visibleAssets = useMemo(() => {
        return assets.filter(asset =>
            (asset.type === 'bore' || asset.type === 'govt') &&
            (!bounds || bounds.contains(L.latLng(asset.position[0], asset.position[1])))
        );
    }, [assets, bounds]);

    return (
        <>
            {visibleAssets.map((asset) => (
                <Marker
                    key={asset.id}
                    position={asset.position}
                    icon={AssetRenderer.createIcon(asset)}
                    eventHandlers={{ mouseover: () => onHover(asset) }}
                />
            ))}
        </>
    );
});

// Component to show data source status (Phase 3: Reliability)
function ConnectionBadge({ source }: { source: 'Real-time' | 'Mock' | 'Hybrid' }) {
    const isOffline = source === 'Mock';
    return (
        <motion.div
            className={styles.connectionBadge}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
                backgroundColor: isOffline ? 'rgba(239, 68, 68, 0.9)' : 'rgba(16, 185, 129, 0.9)',
                color: '#fff'
            }}
        >
            <i className={`fas ${isOffline ? 'fa-triangle-exclamation' : 'fa-signal'}`}></i>
            <span>{isOffline ? 'Offline Mode (Mock)' : 'Real-time Sync'}</span>
        </motion.div>
    );
}

function AssetMap() {
    // Global UI State
    const { activePanel, setActivePanel, selectedAsset, openSidebar, closeAll } = useUIStore();
    const { assets, assetMap, dataSource } = useAssets();

    // Phase 1: Hover System Integration
    const {
        hoveredAsset,
        handleAssetHover,
        handleForceClose,
        resetAutoCloseTimer,
    } = useAssetHover();

    const showSystemDash = activePanel === 'system';
    const showStatusDash = activePanel === 'status';
    const isFilterPanelOpen = activePanel === 'filters';

    const { visibleLayers } = useMapLayersStore();
    const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
    const location = useLocation();


    // Phase 1: Testing - Log hover state changes
    useEffect(() => {
        if (hoveredAsset) {
            console.log('🎯 Asset Hovered:', hoveredAsset.name, '| Type:', hoveredAsset.type);
        } else {
            console.log('❌ Hover cleared');
        }
    }, [hoveredAsset]);

    const [filters, setFilters] = useState({
        types: {
            tank: true,
            pump: true,
            bore: true,
            govt: true,
            sump: true,
        },
        status: {
            active: true,
            inactive: true,
            critical: true,
        },
        showPipelines: true,
    });


    // Handle Search Navigation (Phase 24.3)
    useEffect(() => {
        if (location.state?.focusAsset) {
            const asset = assetMap[location.state.focusAsset.id];
            if (asset) {
                handleMarkerClick(asset);
            }
        }
    }, [location.state, assetMap]);

    const handleMarkerClick = useCallback((asset: BaseAsset) => {
        openSidebar(asset);
    }, [openSidebar]);


    // Filter assets based on multiple criteria - MEMOIZED

    return (
        <div className={styles.container}>



            {/* Filter Panel */}
            <FilterPanel
                isOpen={isFilterPanelOpen}
                onClose={() => setActivePanel('none')}
                filters={filters}
                onChange={setFilters}
            />

            {/* INDEX Panel (LayerControl) - Top Left Floating */}
            <LayerControl />

            {/* Connection Health Indicator */}
            <ConnectionBadge source={dataSource} />

            <MapContainer
                center={MAP_CONFIG.center}
                zoom={MAP_CONFIG.defaultZoom}
                minZoom={MAP_CONFIG.minZoom}
                maxZoom={MAP_CONFIG.maxZoom}
                className={styles.map}
                zoomControl={false} // Disable default zoom
            >
                <TileLayer
                    url={MAP_CONFIG.tileLayer}
                    attribution={MAP_CONFIG.attribution}
                />

                {/* Map Controller for Programmatic Navigation */}
                <MapController selectedAsset={selectedAsset} />

                {/* Custom Glass Controls */}
                <GlassMapControls />

                {/* Compass Control */}
                <Compass />

                {/* Handle map clicks to close sidebar */}
                <MapClickHandler onMapClick={closeAll} />

                {/* Water Supply Layer */}
                <WaterSupplyLayer isVisible={visibleLayers.mainPipelines && filters.showPipelines} />

                {/* Bore Supply Layer */}
                <BoreSupplyLayer isVisible={visibleLayers.borePipelines && filters.showPipelines} />

                {/* IIIT Campus Boundary */}
                <CampusBoundaryLayer />

                {/* Optimized Asset Layers */}
                <MapBoundsMonitor onBoundsChange={setMapBounds} />
                <PumpLayer assets={assets} bounds={mapBounds} onHover={handleAssetHover} />
                <SumpLayer assets={assets} bounds={mapBounds} onHover={handleAssetHover} />
                <TankLayer assets={assets} bounds={mapBounds} onHover={handleAssetHover} />
                <BoreLayer assets={assets} bounds={mapBounds} onHover={handleAssetHover} />

                {/* Phase 1: Map-Anchored Asset Hover Preview (Tooltip) */}
                {hoveredAsset && !selectedAsset && (
                    <Popup
                        position={hoveredAsset.position}
                        closeButton={false}
                        autoPan={false}
                        className={styles.hoverPopup}
                        offset={[0, -20]}
                    >
                        <AssetHoverPreview
                            asset={hoveredAsset}
                            onClose={handleForceClose}
                            onViewDetails={(asset) => {
                                handleMarkerClick(asset);
                                handleForceClose();
                            }}
                            onMouseEnter={resetAutoCloseTimer}
                            onMouseLeave={resetAutoCloseTimer}
                        />
                    </Popup>
                )}
            </MapContainer>

            {/* Dashboard Controls - Updated Style */}
            <div className={styles.dashboardControls}>
                <motion.button
                    className={styles.dashboardBtn}
                    onClick={() => setActivePanel('system')}
                    title="System Overview"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <i className="fas fa-chart-pie"></i>
                </motion.button>
                <motion.button
                    className={styles.dashboardBtn}
                    onClick={() => setActivePanel('status')}
                    title="Status Dashboard"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <i className="fas fa-th-large"></i>
                </motion.button>
            </div>

            {/* Dashboards Overlays */}
            <AnimatePresence>
                {showSystemDash && (
                    <div className={`${styles.dashboardOverlay} animate-fade-in`}>
                        <SystemDashboard />
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showStatusDash && (
                    <div className={`${styles.dashboardOverlay} animate-fade-in`}>
                        <StatusNode
                            onNodeSelect={(node) => {
                                // Find asset by ID (O(1)) or name search (O(N))
                                let asset: BaseAsset | undefined = assetMap[node.id];
                                if (!asset) {
                                    asset = assets.find(a =>
                                        a.name.toLowerCase().replace(/\s+/g, '-') === (node as any).nodeId
                                    );
                                }
                                if (asset) {
                                    handleMarkerClick(asset);
                                }
                            }}
                        />
                    </div>
                )}
            </AnimatePresence>


            {/* Phase 2: Detailed Asset Panel (Click-based) */}
            <AnimatePresence>
                {selectedAsset && (
                    <FloatingAssetPanel
                        asset={selectedAsset}
                        onClose={closeAll}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}

export default AssetMap;
