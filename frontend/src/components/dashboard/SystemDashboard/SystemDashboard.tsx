import { useMemo, useState } from 'react';
// import { useEvaraTechDataStore } from '../../../store/evaratechDataStore';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './SystemDashboard.module.css';
import { motion } from 'framer-motion';
import { useAuth } from '../../../contexts/AuthContext';

// Design System Components
import GlassCard from '../../ui/card/GlassCard';
import { StaggerContainer, ScaleIn } from '../../ui/motion/MotionWrappers';
import MetricCard from '../MetricCard/MetricCard';
import GlassChartTooltip from '../../ui/chart/GlassChartTooltip';
import GlassDonutChart from '../../ui/chart/GlassDonutChart';
import NodeRow from '../NodeRow/NodeRow';
import SegmentedControl from '../../ui/segmented-control/SegmentedControl';

// Components
import AlertPanel from '../../alerts/AlertPanel/AlertPanel';
import MigrationPanel from '../../admin/MigrationPanel/MigrationPanel';

// Generate mock trend data based on time range
const generateTrendData = (range: '24h' | '7d' | '30d') => {
    const data = [];

    if (range === '24h') {
        for (let i = 0; i < 24; i += 4) {
            data.push({
                time: `${i.toString().padStart(2, '0')}:00`,
                value: 200 + Math.random() * 300 + Math.sin(i / 4) * 100,
            });
        }
    } else if (range === '7d') {
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        days.forEach((day, i) => {
            data.push({
                time: day,
                value: 2500 + Math.random() * 1500 + Math.sin(i) * 500,
            });
        });
    } else {
        for (let i = 0; i < 30; i += 5) {
            data.push({
                time: `Day ${i + 1}`,
                value: 15000 + Math.random() * 5000 + Math.sin(i / 5) * 2000,
            });
        }
    }

    return data;
};

import { useAssets } from '../../../hooks/useAssets';

// ... imports

function SystemDashboard() {
    const { assets: nodes } = useAssets();
    const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
    const { user } = useAuth();

    // Calculate System Metrics
    const metrics = useMemo(() => {
        const parseCapacity = (cap: string) => {
            if (!cap) return 0;
            const match = cap.match(/(\d+)/);
            return match ? parseInt(match[0], 10) : 0;
        };

        const totalCapacity = nodes
            .filter(n => n.type === 'tank' || n.type === 'sump')
            .reduce((sum, n) => sum + parseCapacity(n.capacity), 0);

        // Simulated stored amount since we don't have real-time volume data yet
        const totalStored = totalCapacity * 0.72;

        const activePumps = nodes.filter(n =>
            n.type === 'pump' && (n.status === 'Running' || n.status === 'Active')
        ).length;

        const totalPumps = nodes.filter(n => n.type === 'pump').length;

        const workingBores = nodes.filter(
            n => (n.type === 'bore' || n.type === 'govt') && (n.status === 'Running' || n.status === 'Working' || n.status === 'Active' || n.status === 'Flowing')
        ).length;

        const storagePercentage = totalCapacity > 0 ? (totalStored / totalCapacity) * 100 : 0;

        return { totalStored, storagePercentage, activePumps, totalPumps, workingBores, efficiency: 92 };
    }, [nodes]);

    // Dynamic trend data based on selected range
    const trendData = useMemo(() => generateTrendData(timeRange), [timeRange]);

    // Updated Professional Palette
    const distributionData = [
        { name: 'Hostels', value: 45, color: '#0ea5e9' }, // Primary Blue
        { name: 'Academic', value: 30, color: '#22c55e' }, // Success Green
        { name: 'Housing', value: 15, color: '#f59e0b' }, // Warning Amber
        { name: 'Gardening', value: 10, color: '#8b5cf6' }, // Purple
    ];

    return (
        <StaggerContainer className={styles.container}>
            {/* Header Section */}
            <div className={styles.header}>
                <div>
                    <h2 className={styles.welcomeTitle}>System Overview</h2>
                    <p className={styles.welcomeSubtitle}>Live monitoring across {nodes.length} active nodes</p>
                </div>
            </div>

            {/* Quick Actions */}
            <div className={styles.quickActions}>
                <ScaleIn delay={0.1}>
                    <button className={styles.actionBtn}>
                        <div className={`${styles.actionIcon} ${styles.blue} `}><i className="fas fa-plus"></i></div>
                        <span>Add Node</span>
                    </button>
                </ScaleIn>
                <ScaleIn delay={0.15}>
                    <button className={styles.actionBtn}>
                        <div className={`${styles.actionIcon} ${styles.green} `}><i className="fas fa-file-export"></i></div>
                        <span>Export Report</span>
                    </button>
                </ScaleIn>
                <ScaleIn delay={0.2}>
                    <button className={styles.actionBtn}>
                        <div className={`${styles.actionIcon} ${styles.purple} `}><i className="fas fa-cog"></i></div>
                        <span>Configure</span>
                    </button>
                </ScaleIn>
            </div>

            <div className={styles.grid}>
                {/* 1. Total Storage */}
                <MetricCard
                    title="Total Storage"
                    value={metrics.totalStored / 1000}
                    unit="k L"
                    icon="fas fa-database"
                    color="#0ea5e9"
                    trend={{ value: 12, isUp: true }}
                    progress={metrics.storagePercentage}
                />

                {/* 2. Active Pumps */}
                <MetricCard
                    title="Pumps Running"
                    value={metrics.activePumps}
                    unit={`/ ${metrics.totalPumps} `}
                    icon="fas fa-cogs"
                    color="#22c55e"
                    subtext="Optimal Operation"
                />

                {/* 3. Borewells */}
                <MetricCard
                    title="Borewells"
                    value={metrics.workingBores}
                    unit="Active"
                    icon="fas fa-arrow-circle-down"
                    color="#f59e0b"
                    subtext="Groundwater Source"
                />

                {/* 4. Efficiency */}
                <MetricCard
                    title="Efficiency"
                    value={metrics.efficiency}
                    unit="%"
                    icon="fas fa-leaf"
                    color="#8b5cf6"
                    trend={{ value: 2, isUp: true }}
                    subtext="System Health"
                />

                {/* Charts Row */}
                <GlassCard className={`${styles.chartCard} ${styles.wide} `} variant="base">
                    <div className={styles.chartHeader}>
                        <h3 className={styles.cardTitle}>Consumption Trend</h3>
                        <SegmentedControl
                            options={['24h', '7d', '30d']}
                            value={timeRange}
                            onChange={(val) => setTimeRange(val as '24h' | '7d' | '30d')}
                        />
                    </div>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="time"
                                    stroke="var(--gray-400)"
                                    fontSize={12}
                                    tickLine={false}
                                    axisLine={false}
                                    dy={10}
                                />
                                <Tooltip content={<GlassChartTooltip unit="L" />} />
                                <Area
                                    type="monotone"
                                    dataKey="value"
                                    stroke="#0ea5e9"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorTrend)"
                                    animationDuration={2000}
                                    animationEasing="ease-out"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>

                <GlassCard className={styles.chartCard} variant="base">
                    <GlassDonutChart
                        data={distributionData}
                        title="Distribution"
                        centerLabel="Total"
                    />
                </GlassCard>

                {/* Alerts Panel - Consumes full width or specific col span */}
                <div className={styles.alertContainer}>
                    <AlertPanel />
                </div>

                {/* Admin Migration Panel - Only for admin users */}
                {user?.role === 'admin' && (
                    <div className={styles.migrationContainer}>
                        <MigrationPanel />
                    </div>
                )}

                {/* Node Status List - Full Width */}
                <div className={styles.nodeListContainer}>
                    <GlassCard className={styles.nodeListCard} variant="base">
                        <div className={styles.cardHeader}>
                            <h3 className={styles.cardTitle}>Live Status</h3>
                            <button className={styles.viewAllBtn}>View All</button>
                        </div>
                        <div className={styles.nodeList}>
                            {nodes.slice(0, 5).map((node) => (
                                <NodeRow
                                    key={node.id}
                                    name={node.name}
                                    type={node.type}
                                    status={(() => {
                                        const s = (node.status || 'inactive').toLowerCase();
                                        if (['running', 'active', 'working', 'flowing', 'normal'].includes(s)) return 'active';
                                        if (s === 'warning') return 'warning';
                                        if (['critical', 'not working', 'error'].includes(s)) return 'error';
                                        return 'inactive';
                                    })()}
                                    value={node.type === 'pump' ? (node.status === 'Running' ? 'Running' : 'Off') : `${node.capacity}`}
                                    subValue="Updated just now"
                                />
                            ))}
                        </div>
                    </GlassCard>
                </div>
            </div>
        </StaggerContainer>
    );
}

export default SystemDashboard;
