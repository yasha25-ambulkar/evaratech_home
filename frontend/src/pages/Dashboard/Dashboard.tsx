import { useState } from 'react';
import TDSChart from '@components/charts/TDSChart/TDSChart';
import FlowRateChart from '@components/charts/FlowRateChart/FlowRateChart';
import AssetStatusPieChart from '@components/charts/AssetStatusPieChart/AssetStatusPieChart';
import AssetTypeBarChart from '@components/charts/AssetTypeBarChart/AssetTypeBarChart';
import WaterFlowCanvas from '@components/3d/WaterFlowVisualization/WaterFlowCanvas';
import Footer from '@components/layout/Footer/Footer';
import EnhancedStatCard from '@components/ui/EnhancedStatCard/EnhancedStatCard';
import { Grid, StatsGrid, ChartGrid } from '@components/layout/GridSystem/GridSystem';
import { CircularBuffer } from '../../models/dsa/CircularBuffer';
import { Factory, CheckCircle, AlertTriangle, Brain } from 'lucide-react';
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
                        {/* Enhanced Stats Cards */}
                        <StatsGrid>
                            <EnhancedStatCard
                                title="Total Assets"
                                value={70}
                                icon={<Factory size={24} />}
                                trend={{ value: 2, isUp: true, text: "+2 this month" }}
                                color="blue"
                                variant="elevated"
                                progress={85}
                            />
                            <EnhancedStatCard
                                title="Active Assets"
                                value={60}
                                subtitle="85.7% uptime"
                                icon={<CheckCircle size={24} />}
                                trend={{ value: 85.7, isUp: true }}
                                color="green"
                                variant="elevated"
                                progress={85.7}
                            />
                            <EnhancedStatCard
                                title="System Warnings"
                                value={5}
                                icon={<AlertTriangle size={24} />}
                                trend={{ value: 1, isUp: false, text: "-1 from last week" }}
                                color="orange"
                                variant="elevated"
                                progress={12}
                            />
                            <EnhancedStatCard
                                title="AI Intelligence"
                                value="OPTIMAL"
                                subtitle="Predictive analysis active"
                                icon={<Brain size={24} />}
                                trend={{ value: 98, isUp: true, text: "Efficiency score" }}
                                color="purple"
                                variant="elevated"
                                progress={98}
                            />
                        </StatsGrid>

                        {/* Intelligence Insights Section */}
                        <div className={styles.intelligenceBanner}>
                            <div className={styles.bannerInfo}>
                                <h2><i className="fas fa-microchip"></i> AI Predictive Insights</h2>
                                <p>System predicts normal operations for the next 24 hours. No critical anomalies detected.</p>
                            </div>
                            <div className={styles.bannerStats}>
                                <div className={styles.bannerStatItem}>
                                    <span className={styles.statLabel}>Efficiency Score</span>
                                    <span className={styles.statVal}>98%</span>
                                </div>
                                <div className={styles.bannerStatItem}>
                                    <span className={styles.statLabel}>Next Tank Empty (Est.)</span>
                                    <span className={styles.statVal}>14h 22m</span>
                                </div>
                            </div>
                        </div>

                        {/* Enhanced Charts Grid */}
                        <ChartGrid>
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
                        </ChartGrid>
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
