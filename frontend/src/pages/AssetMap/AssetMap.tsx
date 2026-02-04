import { useState, useEffect, useMemo, useCallback } from 'react';

// ... (imports remain same, just update top line)

// ...

// Imports continued...
import { useNavigate, useLocation } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Tooltip, GeoJSON, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import { assetDatabase } from '@data/assets.data';
import { pipelineGeoJSON } from '@data/pipelines.data';
import { MAP_CONFIG, COLORS } from '@data/constants';
import { useUIStore, useMapLayersStore } from '../../store';
import Sidebar from '@components/layout/Sidebar/Sidebar';
import LayerControl from '@components/map/LayerControl/LayerControl';
import SystemDashboard from '@components/dashboard/SystemDashboard/SystemDashboard';
import StatusNode from '@components/dashboard/StatusNode/StatusNode';
import FilterPanel from '@components/filters/FilterPanel/FilterPanel'; // Import FilterPanel
import type { Asset, AssetType } from '../../types';
import styles from './AssetMap.module.css';

// Phase 12: Glass Components
import GlassMapControls from '@components/map/controls/GlassMapControls';
import GlassSearchBar from '@components/map/controls/GlassSearchBar';
import GlassPopupCard from '@components/map/GlassPopupCard/GlassPopupCard';
import NodeDetailModal from '@components/dashboard/NodeDetailModal/NodeDetailModal'; // Import Modal
import { motion, AnimatePresence } from 'framer-motion';

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


// Create custom marker icons with letters
function createCustomIcon(type: AssetType, status: string = 'Normal') {
    const colorMap: Record<AssetType, string> = {
        pump: COLORS.pump,
        sump: COLORS.sump,
        tank: COLORS.tank,
        bore: COLORS.bore,
        govt: COLORS.govt,
        sensor: COLORS.sensor,
    };

    // Map asset types to their initial letters
    const letterMap: Record<AssetType, string> = {
        pump: 'P',
        sump: 'S',
        tank: 'T',
        bore: 'B',
        govt: 'B',  // Changed from G to B to match all borewells
        sensor: 'S',
    };

    let color = colorMap[type];

    if (status === 'Not Working') {
        color = '#9e9e9e'; // Grey for non-working
    } else if (status === 'Critical' || status === 'Warning') {
        color = '#d32f2f'; // Red for critical/warning
    }

    const letter = letterMap[type];

    return L.divIcon({
        className: 'custom-marker',
        html: `<div class="${styles.glassMarker} ${status === 'Critical' ? styles.critical : ''}" style="--marker-color: ${color}">
            ${letter}
        </div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
    });
}


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
function MapController({ selectedAsset }: { selectedAsset: Asset | null | undefined }) {
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

import { useAssets } from '../../hooks/useAssets';

function AssetMap() {
    // Global UI State
    const { activePanel, setActivePanel, selectedAsset, openSidebar, closeAll } = useUIStore();
    const { assets } = useAssets();

    const showSystemDash = activePanel === 'system';
    const showStatusDash = activePanel === 'status';
    const isFilterPanelOpen = activePanel === 'filters';
    const selectedDetailNode = activePanel === 'nodeDetail' ? selectedAsset : null;

    const { visibleLayers } = useMapLayersStore();
    const location = useLocation();

    const handleDetailNode = (node: Asset | null) => {
        if (node) {
            openSidebar(node);
            setActivePanel('nodeDetail');
        } else {
            setActivePanel('none');
        }
    };

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
            const asset = assets.find(a => a.id === location.state.focusAsset.id);
            if (asset) {
                handleMarkerClick(asset);
            }
        }
    }, [location.state, assets]);

    const handleMarkerClick = useCallback((asset: Asset) => {
        openSidebar(asset);
    }, [openSidebar]);

    const handleSearch = useCallback((_query: string) => {
        // Implement search logic here
        // Example: filter assets based on query and update map view or highlight
    }, []);

    // Filter assets based on multiple criteria - MEMOIZED
    const filteredAssets = useMemo(() => {
        return assets.filter(asset => {
            // 1. Check Type Filter
            if (!filters.types[asset.type as keyof typeof filters.types]) return false;

            // 2. Check Status Filter
            const status = asset.status.toLowerCase();
            if (status === 'normal' || status === 'working') {
                if (!filters.status.active) return false;
            } else if (status === 'critical' || status === 'warning') {
                if (!filters.status.critical) return false;
            } else {
                if (!filters.status.inactive) return false;
            }

            // 3. Keep existing logic for specific layer visibility (LayerControl)
            if (asset.type === 'pump' && !visibleLayers.pumps) return false;
            if (asset.type === 'sump' && !visibleLayers.sumps) return false;
            if (asset.type === 'tank' && !visibleLayers.tanks) return false;

            if (asset.type === 'bore') {
                const isNotWorking = asset.status === 'Not Working';
                if (isNotWorking && !visibleLayers.nonWorkingBores) return false;
            }

            return true;
        });
    }, [assets, filters, visibleLayers]);

    return (
        <div className={styles.container}>
            {/* SEARCH BAR - Floating Top Left-Center */}
            <GlassSearchBar onSearch={handleSearch} />

            {/* Filter Toggle Button */}
            <motion.button
                className={styles.filterBtn}
                onClick={() => setActivePanel('filters')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Advanced Filters"
            >
                <i className="fas fa-filter"></i>
            </motion.button>

            {/* Filter Panel */}
            <FilterPanel
                isOpen={isFilterPanelOpen}
                onClose={() => setActivePanel('none')}
                filters={filters}
                onChange={setFilters}
            />

            {/* INDEX Panel (LayerControl) - Top Left Floating */}
            <LayerControl />

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

                {/* Handle map clicks to close sidebar */}
                <MapClickHandler onMapClick={closeAll} />

                {/* Water Supply Layer */}
                <WaterSupplyLayer isVisible={visibleLayers.mainPipelines && filters.showPipelines} />

                {/* Bore Supply Layer */}
                <BoreSupplyLayer isVisible={visibleLayers.borePipelines && filters.showPipelines} />

                {filteredAssets.map((asset) => {
                    const assetData = assetDatabase[asset.name];
                    const status = assetData?.status || 'Normal';
                    return (
                        <Marker
                            key={asset.id}
                            position={asset.position}
                            icon={createCustomIcon(asset.type, status)}
                            eventHandlers={{
                                click: () => handleMarkerClick(asset),
                            }}
                        >
                            <Tooltip direction="top" offset={[0, -10]} opacity={1} permanent={false}>
                                {asset.name}
                            </Tooltip>
                            <Popup className={styles.glassPopup}>
                                <GlassPopupCard
                                    name={asset.name}
                                    type={asset.type}
                                    status={asset.status}
                                    specs={asset.specs}
                                    onDetails={() => handleDetailNode(asset)}
                                />
                            </Popup>
                        </Marker>
                    );
                })}
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
                        <SystemDashboard onClose={() => setActivePanel('none')} />
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showStatusDash && (
                    <div className={`${styles.dashboardOverlay} animate-fade-in`}>
                        <StatusNode
                            onNodeSelect={(node) => {
                                // Find asset by node ID and select it
                                const asset = assets.find(a =>
                                    a.name.toLowerCase().replace(/\s+/g, '-') === (node as any).nodeId || a.id === node.id
                                );
                                if (asset) {
                                    handleMarkerClick(asset);
                                }
                            }}
                            onClose={() => setActivePanel('none')}
                        />
                    </div>
                )}
            </AnimatePresence>

            {/* Node Detail Modal */}
            <AnimatePresence>
                {selectedDetailNode && (
                    <NodeDetailModal
                        node={selectedDetailNode}
                        onClose={() => setActivePanel('sidebar')}
                    />
                )}
            </AnimatePresence>

            <Sidebar
                isOpen={activePanel === 'sidebar' || activePanel === 'nodeDetail'}
                onClose={closeAll}
                asset={selectedAsset}
            />
        </div>
    );
}

export default AssetMap;
