import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import TDSChart from '@components/charts/TDSChart/TDSChart';
import FlowRateChart from '@components/charts/FlowRateChart/FlowRateChart';
import WaterFlowCanvas from '@components/3d/WaterFlowVisualization/WaterFlowCanvas';
import Footer from '@components/layout/Footer/Footer';
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

const tdsHistoricalData = Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
    tds: 120 + Math.random() * 50,
}));

const flowRateHistoricalData = Array.from({ length: 24 }, (_, i) => ({
    timestamp: new Date(Date.now() - (23 - i) * 3600000).toISOString(),
    flowRate: 10 + Math.random() * 5,
}));

function Dashboard() {
    const [selectedView, setSelectedView] = useState<'overview' | '3d'>('overview');

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <h1>Dashboard Analytics</h1>
                    <div className={styles.viewToggle}>
                        <button
                            className={selectedView === 'overview' ? styles.active : ''}
                            onClick={() => setSelectedView('overview')}
                        >
                            Overview
                        </button>
                        <button
                            className={selectedView === '3d' ? styles.active : ''}
                            onClick={() => setSelectedView('3d')}
                        >
                            3D Visualization
                        </button>
                    </div>
                </div>

                {selectedView === 'overview' ? (
                    <>
                        {/* Stats Cards */}
                        <div className={styles.statsGrid}>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>🏭</div>
                                <div className={styles.statInfo}>
                                    <h3>Total Assets</h3>
                                    <p className={styles.statValue}>70</p>
                                    <span className={styles.statChange}>+2 this month</span>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>✅</div>
                                <div className={styles.statInfo}>
                                    <h3>Active Assets</h3>
                                    <p className={styles.statValue}>60</p>
                                    <span className={styles.statChange}>85.7%</span>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>⚠️</div>
                                <div className={styles.statInfo}>
                                    <h3>Warnings</h3>
                                    <p className={styles.statValue}>5</p>
                                    <span className={styles.statChange}>-1 from last week</span>
                                </div>
                            </div>
                            <div className={styles.statCard}>
                                <div className={styles.statIcon}>💧</div>
                                <div className={styles.statInfo}>
                                    <h3>Avg TDS</h3>
                                    <p className={styles.statValue}>142 ppm</p>
                                    <span className={styles.statChange}>Normal</span>
                                </div>
                            </div>
                        </div>

                        {/* Charts Grid */}
                        <div className={styles.chartsGrid}>
                            <div className={styles.chartCard}>
                                <h2>Asset Status Distribution</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={assetStatusData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                            outerRadius={100}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {assetStatusData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className={styles.chartCard}>
                                <h2>Assets by Type</h2>
                                <ResponsiveContainer width="100%" height={300}>
                                    <BarChart data={assetTypeData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="type" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="count" fill="#0077b6" />
                                    </BarChart>
                                </ResponsiveContainer>
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
