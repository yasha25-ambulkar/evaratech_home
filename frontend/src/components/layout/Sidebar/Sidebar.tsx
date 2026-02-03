import { useState } from 'react';
import type { Asset } from '../../../types';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import styles from './Sidebar.module.css';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
    asset: Asset | null;
}

// Mock Data for the chart
const mockData = [
    { time: '00:00', value: 30 },
    { time: '04:00', value: 45 },
    { time: '08:00', value: 80 },
    { time: '12:00', value: 95 },
    { time: '16:00', value: 70 },
    { time: '20:00', value: 50 },
    { time: '23:59', value: 40 },
];

function Sidebar({ isOpen, onClose, asset }: SidebarProps) {
    // Mock states for controls
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [remoteOps, setRemoteOps] = useState(true);
    const [notifications, setNotifications] = useState(true);

    if (!asset) return null;

    const isNormalStatus = ['Normal', 'Working', 'Running', 'Flowing', 'Active'].includes(asset.status);

    return (
        <div className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
            <div className={styles.header}>
                <h2>
                    <i className="fas fa-cube"></i>
                    {asset.name}
                </h2>
                <button className={styles.closeBtn} onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className={styles.content}>

                {/* 1. General Info Card */}
                <div className={styles.infoCard}>
                    <h3>General Information</h3>
                    <div className={styles.dataRow}>
                        <span className={styles.label}>Asset ID</span>
                        <span className={styles.value}>{asset.id}</span>
                    </div>
                    <div className={styles.dataRow}>
                        <span className={styles.label}>Type</span>
                        <span className={styles.value} style={{ textTransform: 'capitalize' }}>{asset.type}</span>
                    </div>
                    <div className={styles.dataRow}>
                        <span className={styles.label}>Capacity</span>
                        <span className={styles.value}>{asset.capacity}</span>
                    </div>
                    <div className={styles.dataRow}>
                        <span className={styles.label}>Maintenance</span>
                        <span className={styles.value}>{asset.specs}</span>
                    </div>

                    <div className={styles.dataRow}>
                        <span className={styles.label}>Current Status</span>
                        <span className={`${styles.statusBadge} ${isNormalStatus ? styles.statusNormal : styles.statusCritical}`}>
                            {asset.status}
                        </span>
                    </div>
                </div>

                {/* 2. Controls Card */}
                <div className={styles.infoCard}>
                    <h3>System Controls</h3>
                    <div className={styles.controlsGrid}>
                        <div className={styles.controlItem}>
                            <span className={styles.controlLabel}>Remote Operation</span>
                            <label className={styles.switch}>
                                <input
                                    type="checkbox"
                                    checked={remoteOps}
                                    onChange={(e) => setRemoteOps(e.target.checked)}
                                />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                        <div className={styles.controlItem}>
                            <span className={styles.controlLabel}>Maintenance Mode</span>
                            <label className={styles.switch}>
                                <input
                                    type="checkbox"
                                    checked={maintenanceMode}
                                    onChange={(e) => setMaintenanceMode(e.target.checked)}
                                />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                        <div className={styles.controlItem}>
                            <span className={styles.controlLabel}>Alert Notifications</span>
                            <label className={styles.switch}>
                                <input
                                    type="checkbox"
                                    checked={notifications}
                                    onChange={(e) => setNotifications(e.target.checked)}
                                />
                                <span className={styles.slider}></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* 3. Performance Metrics Card (Graph) */}
                <div className={styles.infoCard}>
                    <h3>Performance Metrics (24h)</h3>
                    <div className={styles.graphContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={mockData}>
                                <defs>
                                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0288d1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0288d1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                                <XAxis
                                    dataKey="time"
                                    tick={{ fontSize: 10, fill: '#6c757d' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fontSize: 10, fill: '#6c757d' }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <Tooltip
                                    contentStyle={{
                                        borderRadius: '8px',
                                        border: 'none',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#0288d1"
                                    strokeWidth={2}
                                    fillOpacity={1}
                                    fill="url(#colorValue)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Sidebar;
