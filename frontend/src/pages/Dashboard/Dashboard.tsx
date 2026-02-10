import { useState } from 'react';
import TDSChart from '@components/charts/TDSChart/TDSChart';
import FlowRateChart from '@components/charts/FlowRateChart/FlowRateChart';
import AssetStatusPieChart from '@components/charts/AssetStatusPieChart/AssetStatusPieChart';
import AssetTypeBarChart from '@components/charts/AssetTypeBarChart/AssetTypeBarChart';
import WaterFlowCanvas from '@components/3d/WaterFlowVisualization/WaterFlowCanvas';
import Footer from '@components/layout/Footer/Footer';
import StatCard from '@components/ui/StatCard/StatCard';
import { CircularBuffer } from '../../models/dsa/CircularBuffer';
import styles from './Dashboard.module.css';

// Sample data for charts
const assetStatusData = [
    { name: 'Running', value: 15, color: '#28a745' },
    { name: 'Normal', value: 45, color: '#17a2b8' },
    { name: 'Warning', value: 5, color: '#ffc107' },
    { name: 'Not Working', value: 5, color: '#dc3545' },
];

const assetTypeData = [
    { type: 'Pumps', count: 4 },
    { type: 'Sumps', count: 11 },
    { type: 'Tanks', count: 14 },
    { type: 'Borewells', count: 19 },
    { type: 'Sensors', count: 2 },
];

import { SimulationService } from '../../services/SimulationService';

interface TDSDataPoint { timestamp: string; tds: number; }
interface FlowDataPoint { timestamp: string; flowRate: number; }

function generateInitialTDSData(capacity: number): CircularBuffer<TDSDataPoint> {
    const buffer = new CircularBuffer<TDSDataPoint>(capacity);
    const now = Date.now();
    for (let i = 0; i < capacity; i++) {
        const time = now - (capacity - 1 - i) * 3600000;
        buffer.push({
            timestamp: new Date(time).toISOString(),
            tds: Math.round(SimulationService.generateTDS(time)),
        });
    }
    return buffer;
}

function generateInitialFlowData(capacity: number): CircularBuffer<FlowDataPoint> {
    const buffer = new CircularBuffer<FlowDataPoint>(capacity);
    const now = Date.now();
    for (let i = 0; i < capacity; i++) {
        const time = now - (capacity - 1 - i) * 3600000;
        buffer.push({
            timestamp: new Date(time).toISOString(),
            flowRate: Number(SimulationService.generateFlowRate(time).toFixed(1)),
        });
    }
    return buffer;
}

function Dashboard() {
    const [selectedView] = useState<'overview' | '3d'>('overview');

    // Initialize buffers (using useState to keep instance)
    const [tdsBuffer] = useState(() => generateInitialTDSData(24));
    const [flowBuffer] = useState(() => generateInitialFlowData(24));

    const tdsHistoricalData = tdsBuffer.toArray();
    const flowRateHistoricalData = flowBuffer.toArray();

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1>Dashboard Analytics</h1>

                </div>

                {selectedView === 'overview' ? (
                    <>
                        {/* Stats Cards */}
                        <div className={styles.statsGrid}>
                            <StatCard
                                icon="🏭"
                                label="Total Assets"
                                value={70}
                                trendText="+2 this month"
                                trend="up"
                                color="blue"
                            />
                            <StatCard
                                icon="✅"
                                label="Active Assets"
                                value={60}
                                percentage={85.7}
                                trend="neutral"
                                color="green"
                            />
                            <StatCard
                                icon="⚠️"
                                label="Warnings"
                                value={5}
                                trendText="-1 from last week"
                                trend="down"
                                color="orange"
                            />
                            <StatCard
                                icon="💧"
                                label="Avg TDS"
                                value="142 ppm"
                                trendText="Normal"
                                trend="neutral"
                                color="blue"
                            />
                        </div>

                        {/* Charts Grid */}
                        <div className={styles.chartsGrid}>
                            <div className={styles.chartCard}>
                                <h2>Asset Status Distribution</h2>
                                <AssetStatusPieChart data={assetStatusData} />
                            </div>

                            <div className={styles.chartCard}>
                                <h2>Assets by Type</h2>
                                <AssetTypeBarChart data={assetTypeData} />
                            </div>

                            <div className={styles.chartCard}>
                                <h2>TDS Levels (24 Hours)</h2>
                                <TDSChart data={tdsHistoricalData} />
                            </div>

                            <div className={styles.chartCard}>
                                <h2>Flow Rate (24 Hours)</h2>
                                <FlowRateChart data={flowRateHistoricalData} />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className={styles.visualization3D}>
                        <h2>3D Water Flow Visualization</h2>
                        <p>Interactive 3D visualization of water flow through the pipeline network</p>
                        <WaterFlowCanvas flowRate={12.5} pipelineId="main-line" />
                        <div className={styles.controls}>
                            <p><strong>Controls:</strong></p>
                            <ul>
                                <li>Left click + drag: Rotate view</li>
                                <li>Right click + drag: Pan view</li>
                                <li>Scroll: Zoom in/out</li>
                            </ul>
                        </div>
                    </div>
                )}
            </div>

            <Footer />
        </div>
    );
}

export default Dashboard;
