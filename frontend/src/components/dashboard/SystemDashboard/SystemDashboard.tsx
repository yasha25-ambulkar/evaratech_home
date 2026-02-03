import { useMemo } from 'react';
import { useEvaraTechDataStore } from '../../../store/evaratechDataStore';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import styles from './SystemDashboard.module.css';

// Components
import AlertPanel from '../../alerts/AlertPanel/AlertPanel';

function SystemDashboard({ onClose }: { onClose: () => void }) {
    const { nodesData } = useEvaraTechDataStore();
    const nodes = Object.values(nodesData);

    // Calculate System Metrics
    const metrics = useMemo(() => {
        // Total Water Stored
        const totalStored = nodes
            .filter(n => n.type === 'tank' || n.type === 'sump')
            // @ts-ignore
            .reduce((sum, node) => sum + (node.currentVolume?.[node.currentVolume?.length - 1]?.value || 0), 0);

        // Active Pumps
        const activePumps = nodes.filter(n => n.type === 'pump' && n.status === 'active').length;
        const totalPumps = nodes.filter(n => n.type === 'pump').length;

        // Working Borewells
        const workingBores = nodes.filter(
            n => (n.type === 'bore' || n.type === 'govt') && n.isActive
        ).length;

        // Total Capacity
        const totalCapacity = nodes
            .filter(n => n.type === 'tank' || n.type === 'sump')
            // @ts-ignore
            .reduce((sum, n) => sum + (n.capacity || 0), 0);

        const storagePercentage = totalCapacity > 0 ? (totalStored / totalCapacity) * 100 : 0;

        return {
            totalStored,
            storagePercentage,
            activePumps,
            totalPumps,
            workingBores,
            efficiency: 92, // Mock system efficiency
        };
    }, [nodes]);

    // Mock Consumption Trend Data
    const trendData = [
        { time: '00:00', value: 120 }, { time: '04:00', value: 80 },
        { time: '08:00', value: 450 }, { time: '12:00', value: 380 },
        { time: '16:00', value: 410 }, { time: '20:00', value: 520 },
        { time: '23:59', value: 240 },
    ];

    // Distribution Data for Pie Chart
    const distributionData = [
        { name: 'Hostels', value: 45, color: '#2196F3' },
        { name: 'Academic', value: 30, color: '#4CAF50' },
        { name: 'Housing', value: 15, color: '#FF9800' },
        { name: 'Gardening', value: 10, color: '#9C27B0' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>System Overview</h2>
                <button className={styles.closeBtn} onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className={styles.grid}>
                {/* Key Metrics Row */}
                <div className={styles.metricCard}>
                    <div className={styles.metricIcon} style={{ background: 'rgba(33, 150, 243, 0.1)', color: '#2196F3' }}>
                        <i className="fas fa-database"></i>
                    </div>
                    <div>
                        <div className={styles.metricLabel}>Total Storage</div>
                        <div className={styles.metricValue}>{(metrics.totalStored / 1000).toFixed(0)}k L</div>
                        <div className={styles.metricSub}>{metrics.storagePercentage.toFixed(1)}% Full</div>
                    </div>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricIcon} style={{ background: 'rgba(76, 175, 80, 0.1)', color: '#4CAF50' }}>
                        <i className="fas fa-cogs"></i>
                    </div>
                    <div>
                        <div className={styles.metricLabel}>Active Pumps</div>
                        <div className={styles.metricValue}>{metrics.activePumps} / {metrics.totalPumps}</div>
                        <div className={styles.metricSub}>Operational</div>
                    </div>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricIcon} style={{ background: 'rgba(255, 152, 0, 0.1)', color: '#FF9800' }}>
                        <i className="fas fa-arrow-circle-down"></i>
                    </div>
                    <div>
                        <div className={styles.metricLabel}>Working Borewells</div>
                        <div className={styles.metricValue}>{metrics.workingBores}</div>
                        <div className={styles.metricSub}>Contributing</div>
                    </div>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricIcon} style={{ background: 'rgba(156, 39, 176, 0.1)', color: '#9C27B0' }}>
                        <i className="fas fa-leaf"></i>
                    </div>
                    <div>
                        <div className={styles.metricLabel}>System Efficiency</div>
                        <div className={styles.metricValue}>{metrics.efficiency}%</div>
                        <div className={styles.metricSub}>Optimal</div>
                    </div>
                </div>

                {/* Charts Row */}
                <div className={`${styles.chartCard} ${styles.wide}`}>
                    <h3 className={styles.cardTitle}>24h Consumption Trend</h3>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={trendData}>
                                <defs>
                                    <linearGradient id="colorTrend" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#2196F3" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#2196F3" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis dataKey="time" stroke="var(--text-muted)" fontSize={12} tickLine={false} axisLine={false} />
                                <Tooltip
                                    contentStyle={{ background: 'rgba(0,0,0,0.8)', border: 'none', borderRadius: '8px' }}
                                    itemStyle={{ color: '#fff' }}
                                />
                                <Area type="monotone" dataKey="value" stroke="#2196F3" fillOpacity={1} fill="url(#colorTrend)" strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className={`${styles.chartCard}`}>
                    <h3 className={styles.cardTitle}>Water Distribution</h3>
                    <div className={styles.chartContainer}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={distributionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {distributionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>

                        <div className={styles.legend}>
                            {distributionData.map((item) => (
                                <div key={item.name} className={styles.legendItem}>
                                    <span className={styles.legendDot} style={{ background: item.color }} />
                                    <span>{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Alerts Panel */}
                <div className={`${styles.alertContainer} ${styles.wide}`}>
                    <AlertPanel />
                </div>
            </div>
        </div>
    );
}

export default SystemDashboard;
