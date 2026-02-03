import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import { assetDatabase } from '@data/assets.data';
import { pipelineGeoJSON } from '@data/pipelines.data';
import { MAP_CONFIG, COLORS } from '@data/constants';
import { useUIStore, useMapLayersStore } from '../../store';
import Sidebar from '@components/layout/Sidebar/Sidebar';
import LayerControl from '@components/map/LayerControl/LayerControl';
import SystemDashboard from '@components/dashboard/SystemDashboard/SystemDashboard';
import StatusNode from '@components/dashboard/StatusNode/StatusNode';
import type { Asset, AssetType, PipelineFeature } from '../../types';
import styles from './AssetMap.module.css';

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

// Asset marker positions (NO SENSORS - completely removed)
const assetPositions: Record<string, { position: [number, number]; type: AssetType }> = {
    'Pump House 1': { position: [17.4456, 78.3516], type: 'pump' },
    'Pump House 2': { position: [17.44608, 78.34925], type: 'pump' },
    'Pump House 3': { position: [17.4430, 78.3487], type: 'pump' },
    'Pump House 4': { position: [17.4481, 78.3489], type: 'pump' },

    'Sump S1': { position: [17.448097, 78.349060], type: 'sump' },
    'Sump S2': { position: [17.444919, 78.346195], type: 'sump' },
    'Sump S3': { position: [17.446779, 78.346996], type: 'sump' },
    'Sump S4 (Main Sump)': { position: [17.445630, 78.351593], type: 'sump' },
    'Sump S5': { position: [17.444766, 78.350087], type: 'sump' },
    'Sump S6': { position: [17.445498, 78.350202], type: 'sump' },
    'Sump S7': { position: [17.44597, 78.34906], type: 'sump' },
    'Sump S8': { position: [17.446683, 78.348995], type: 'sump' },
    'Sump S9': { position: [17.446613, 78.346487], type: 'sump' },
    'Sump S10': { position: [17.443076, 78.348737], type: 'sump' },
    'Sump S11': { position: [17.444773, 78.347797], type: 'sump' },

    'Bakul OHT': { position: [17.448045, 78.348438], type: 'tank' },
    'Parijat OHT': { position: [17.447547, 78.347752], type: 'tank' },
    'Kadamba OHT': { position: [17.446907, 78.347178], type: 'tank' },
    'NWH Block C OHT': { position: [17.447675, 78.347430], type: 'tank' },
    'NWH Block B OHT': { position: [17.447391, 78.347172], type: 'tank' },
    'NWH Block A OHT': { position: [17.447081, 78.346884], type: 'tank' },
    'Palash Nivas OHT 7': { position: [17.445096, 78.345966], type: 'tank' },
    'Anand Nivas OHT 8': { position: [17.443976, 78.348432], type: 'tank' },
    'Budha Nivas OHT 9': { position: [17.443396, 78.348500], type: 'tank' },
    'C Block OHT 10': { position: [17.443387, 78.347834], type: 'tank' },
    'D Block OHT 11': { position: [17.443914, 78.347773], type: 'tank' },
    'E Block OHT 12': { position: [17.444391, 78.347958], type: 'tank' },
    'Vindhya OHT': { position: [17.44568, 78.34973], type: 'tank' },
    'Himalaya OHT (KRB)': { position: [17.44525, 78.34966], type: 'tank' },

    'Borewell P1': { position: [17.443394, 78.348117], type: 'bore' },
    'Borewell P2': { position: [17.443093, 78.348936], type: 'bore' },
    'Borewell P3': { position: [17.444678, 78.347234], type: 'bore' },
    'Borewell P4': { position: [17.446649, 78.350578], type: 'bore' },
    'Borewell P5': { position: [17.447783, 78.349040], type: 'bore' },
    'Borewell P6': { position: [17.448335, 78.348594], type: 'bore' },
    'Borewell P7': { position: [17.445847, 78.346416], type: 'bore' },
    'Borewell P8': { position: [17.445139, 78.345277], type: 'bore' },
    'Borewell P9': { position: [17.446922, 78.346699], type: 'bore' },
    'Borewell P10': { position: [17.443947, 78.350139], type: 'bore' },
    'Borewell P10A': { position: [17.443451, 78.349635], type: 'bore' },
    'Borewell P11': { position: [17.444431, 78.347649], type: 'bore' },

    'Borewell 1': { position: [17.444601, 78.345459], type: 'govt' },
    'Borewell 2': { position: [17.445490, 78.346838], type: 'govt' },
    'Borewell 3': { position: [17.446188, 78.350067], type: 'govt' },
    'Borewell 4': { position: [17.447111, 78.350151], type: 'govt' },
    'Borewell 5': { position: [17.446311, 78.351042], type: 'govt' },
    'Borewell 6': { position: [17.445584, 78.347148], type: 'govt' },
    'Borewell 7': { position: [17.446115, 78.348536], type: 'govt' },
};

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
        html: `<div style="
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      background-color: ${color};
      border: 2px solid white;
      border-radius: 50%;
      box-shadow: 0 4px 8px rgba(0,0,0,0.25);
      color: white;
      font-size: 16px;
      font-weight: 700;
      font-family: 'Inter', sans-serif;
      transition: all 0.2s ease;
    ">
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

// Dynamic width function for pipelines based on zoom
function getWeight(zoom: number): number {
    return Math.max(2, 4 * Math.pow(1.4, zoom - 15));
}

// Component to handle zoom-based pipeline width updates
// Component to handle zoom-based pipeline width updates
function PipelineLayer() {
    const map = useMap();
    const [zoom, setZoom] = useState(map.getZoom());
    const { visibleLayers } = useMapLayersStore();
    const navigate = useNavigate();

    useEffect(() => {
        const handleZoom = () => {
            setZoom(map.getZoom());
        };
        map.on('zoomend', handleZoom);
        return () => {
            map.off('zoomend', handleZoom);
        };
    }, [map]);

    const handlePipelineClick = (feature: PipelineFeature) => {
        const name = feature.properties.name || feature.properties.id || '';

        // Check if NWH Block C pipeline was clicked
        if (name === 'PH4 - NWH Block C') {
            // Navigate to the integrated Girls Hostel page
            navigate('/girls-hostel');
            console.log('Navigating to NWH Block C website:', name);
        } else {
            // Basic interactivity for other pipelines
            console.log('Clicked pipeline:', name);
        }
    };

    // Filter pipelines based on visibility
    const filteredFeatures = pipelineGeoJSON.features.filter((feature) => {
        const pipeType = feature.properties?.type || '';

        if (pipeType === 'Main Line') {
            return visibleLayers.mainPipelines;
        }
        if (pipeType === 'Dist Line') {
            return visibleLayers.distPipelines;
        }
        if (pipeType === 'Bore Line') {
            return visibleLayers.borePipelines;
        }
        return false;
    });

    const filteredGeoJSON = {
        ...pipelineGeoJSON,
        features: filteredFeatures,
    };

    if (filteredFeatures.length === 0) return null;

    return (
        <GeoJSON
            key={JSON.stringify(visibleLayers)}
            data={filteredGeoJSON}
            style={(feature) => {
                const pipeType = feature?.properties?.type;
                let color = '#0077b6'; // Default Blue

                // All non-borewell pipelines use the same blue shade
                if (pipeType === 'Main Line') color = '#0077b6'; // Blue
                if (pipeType === 'Dist Line') color = '#0077b6'; // Blue (same as Main Line)
                if (pipeType === 'Bore Line') color = '#d62828'; // Red for Borewell pipelines

                return {
                    color,
                    weight: getWeight(zoom),
                    opacity: 0.8,
                };
            }}
            onEachFeature={(feature, layer) => {
                layer.on('click', () => handlePipelineClick(feature as PipelineFeature));
                layer.on('mouseover', function (this: L.Path) {
                    this.setStyle({ weight: getWeight(zoom) + 2 });
                });
                layer.on('mouseout', function (this: L.Path) {
                    this.setStyle({ weight: getWeight(zoom) });
                });
            }}
        />
    );
}

function AssetMap() {
    const { isSidebarOpen, selectedAsset, openSidebar, closeSidebar } = useUIStore();
    const { visibleLayers } = useMapLayersStore();
    const [assets, setAssets] = useState<Asset[]>([]);

    // Dashboard States
    const [showSystemDash, setShowSystemDash] = useState(false);
    const [showStatusDash, setShowStatusDash] = useState(false);

    useEffect(() => {
        // Build assets array from database and positions
        const assetList: Asset[] = Object.entries(assetPositions).map(([name, data]) => {
            const dbEntry = assetDatabase[name];
            return {
                id: dbEntry?.id || 'N/A',
                name,
                type: data.type,
                position: data.position,
                capacity: dbEntry?.cap || 'N/A',
                specs: dbEntry?.maint || 'N/A',
                status: dbEntry?.status || 'Normal',
                isCritical: dbEntry?.status === 'Critical' || dbEntry?.status === 'Warning',
            };
        });
        setAssets(assetList);
    }, []);

    const handleMarkerClick = (asset: Asset) => {
        openSidebar(asset);
    };

    // Filter assets based on layer visibility and status
    const filteredAssets = assets.filter(asset => {
        if (asset.type === 'pump') return visibleLayers.pumps;
        if (asset.type === 'sump') return visibleLayers.sumps;
        if (asset.type === 'tank') return visibleLayers.tanks;

        // For borewells, check both IIIT and Govt layers
        if (asset.type === 'bore') {
            // Check if this is a non-working borewell
            const assetData = assetDatabase[asset.name];
            const isNotWorking = assetData?.status === 'Not Working';

            // Show if nonWorkingBores is enabled and it's not working
            if (visibleLayers.nonWorkingBores && isNotWorking) {
                return true;
            }

            // Show if iiitBores is enabled and it's working
            if (visibleLayers.iiitBores && !isNotWorking) {
                return true;
            }

            return false;
        }

        if (asset.type === 'govt') {
            // Check if this is a non-working govt borewell
            const assetData = assetDatabase[asset.name];
            const isNotWorking = assetData?.status === 'Not Working';

            // Show if nonWorkingBores is enabled and it's not working
            if (visibleLayers.nonWorkingBores && isNotWorking) {
                return true;
            }

            // Show if govtBores is enabled and it's working
            if (visibleLayers.govtBores && !isNotWorking) {
                return true;
            }

            return false;
        }

        return false; // Don't show sensors or unknown types
    });

    return (
        <div className={styles.container}>
            {/* INDEX Panel (LayerControl) - Top Left Floating */}
            <LayerControl />

            <MapContainer
                center={MAP_CONFIG.center}
                zoom={MAP_CONFIG.defaultZoom}
                minZoom={MAP_CONFIG.minZoom}
                maxZoom={MAP_CONFIG.maxZoom}
                className={styles.map}
            >
                <TileLayer
                    url={MAP_CONFIG.tileLayer}
                    attribution={MAP_CONFIG.attribution}
                />

                {/* Handle map clicks to close sidebar */}
                <MapClickHandler onMapClick={closeSidebar} />

                {/* Pipeline layers */}
                <PipelineLayer />

                {/* Asset markers */}
                {filteredAssets.map((asset) => {
                    return (
                        <Marker
                            key={asset.id}
                            position={asset.position}
                            icon={createCustomIcon(asset.type, asset.status)}
                            eventHandlers={{
                                click: () => handleMarkerClick(asset),
                            }}
                        />
                    );
                })}
            </MapContainer>

            {/* Dashboard Controls */}
            <div className={styles.dashboardControls}>
                <button
                    className={styles.dashboardBtn}
                    onClick={() => setShowSystemDash(true)}
                    title="System Overview"
                >
                    <i className="fas fa-chart-pie"></i>
                </button>
                <button
                    className={styles.dashboardBtn}
                    onClick={() => setShowStatusDash(true)}
                    title="Status Dashboard"
                >
                    <i className="fas fa-th-large"></i>
                </button>
            </div>

            {/* Dashboards Overlays */}
            {showSystemDash && (
                <div className={`${styles.dashboardOverlay} animate-fade-in`}>
                    <SystemDashboard onClose={() => setShowSystemDash(false)} />
                </div>
            )}

            {showStatusDash && (
                <div className={`${styles.dashboardOverlay} animate-fade-in`}>
                    <StatusNode
                        onNodeSelect={(node) => {
                            // Find asset by node ID and select it
                            const asset = assets.find(a =>
                                a.name.toLowerCase().replace(/\s+/g, '-') === node.nodeId
                            );
                            if (asset) {
                                setShowStatusDash(false);
                                handleMarkerClick(asset);
                            }
                        }}
                        onClose={() => setShowStatusDash(false)}
                    />
                </div>
            )}

            <Sidebar
                isOpen={isSidebarOpen}
                onClose={closeSidebar}
                asset={selectedAsset}
            />
        </div>
    );
}

export default AssetMap;
