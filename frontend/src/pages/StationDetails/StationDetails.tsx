import { useSearchParams, Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import NodeFactory from '../../services/NodeFactory';
import { ProductType } from '../../models/enums';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import styles from './StationDetails.module.css';

function StationDetails() {
    const [searchParams] = useSearchParams();
    const nodeId = searchParams.get('node');

    // In a real app, this would come from a store or API
    // For now, we fetch from factory (which returns new instances, so mock data might shift on reload)
    const node = useMemo(() => {
        if (!nodeId) return null;
        return NodeFactory.getAllNodes().find(n => n.id === nodeId);
    }, [nodeId]);

    const [timeRange, setTimeRange] = useState<'30d' | '7d'>('30d');

    if (!node) {
        return (
            <div className={styles.container}>
                <div className={styles.error}>
                    <h2>Node Not Found</h2>
                    <Link to="/nodes" className={styles.backBtn}>Back to All Nodes</Link>
                </div>
            </div>
        );
    }

    const isEvaraTank = node.product === ProductType.EvaraTank;

    // Prepare chart data
    const chartData = useMemo(() => {
        if (!node.consumptionHistory) return [];
        return timeRange === '7d' ? node.consumptionHistory.slice(0, 7) : node.consumptionHistory;
    }, [node, timeRange]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <div className={styles.breadcrumbs}>
                        <Link to="/nodes">All Nodes</Link> / <span>{node.name}</span>
                    </div>
                    <h1>{node.name}</h1>
                    <div className={styles.meta}>
                        <span className={styles.tag}>{node.location}</span>
                        <span className={styles.tag} style={{ background: node.getStatusColor(), color: 'white' }}>{node.status}</span>
                        {isEvaraTank && <span className={styles.productTag}>EvaraTank™</span>}
                    </div>
                </div>
                <Link to="/nodes" className={styles.backBtn}>
                    <i className="fas fa-arrow-left"></i> Back
                </Link>
            </div>

            {isEvaraTank ? (
                <div className={styles.tankDashboard}>
                    {/* Top Stats Row */}
                    <div className={styles.statsRow}>
                        <div className={styles.statCard}>
                            <h3>Live Level</h3>
                            <div className={styles.hugeValue} style={{ color: '#0ea5e9' }}>
                                {node.level}%
                                <span className={styles.subValue}> / {node.currentLevelMeters}m</span>
                            </div>
                            <div className={styles.levelBar}>
                                <div className={styles.levelFill} style={{ width: `${node.level}%` }}></div>
                            </div>
                        </div>
                        <div className={styles.statCard}>
                            <h3>Total Volume</h3>
                            <div className={styles.hugeValue}>
                                {(node.tankCapacityLitres || 0).toLocaleString()}
                                <span className={styles.unit}> L</span>
                            </div>
                            <p className={styles.statMeta}>Tank Depth: {node.tankDepth}m</p>
                        </div>
                        <div className={styles.statCard}>
                            <h3>Today's Consumption</h3>
                            <div className={styles.hugeValue}>
                                {(node.dailyUsage || 0).toLocaleString()}
                                <span className={styles.unit}> L</span>
                            </div>
                            <p className={styles.statMeta}>Est. Refill Cycles: {node.refillCycles}</p>
                        </div>
                    </div>

                    {/* Analytics Section */}
                    <div className={styles.analyticsSection}>
                        <div className={styles.chartHeader}>
                            <h2>Consumption Trends</h2>
                            <div className={styles.rangeControls}>
                                <button
                                    className={`${styles.rangeBtn} ${timeRange === '7d' ? styles.active : ''}`}
                                    onClick={() => setTimeRange('7d')}
                                >
                                    Last 7 Days
                                </button>
                                <button
                                    className={`${styles.rangeBtn} ${timeRange === '30d' ? styles.active : ''}`}
                                    onClick={() => setTimeRange('30d')}
                                >
                                    Last 30 Days
                                </button>
                            </div>
                        </div>

                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                                    <XAxis
                                        dataKey="date"
                                        tickFormatter={(str) => {
                                            const d = new Date(str);
                                            return `${d.getMonth() + 1}/${d.getDate()}`;
                                        }}
                                        stroke="#888"
                                    />
                                    <YAxis stroke="#888" />
                                    <Tooltip
                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#0ea5e9"
                                        fillOpacity={1}
                                        fill="url(#colorUsage)"
                                        name="Consumption (L)"
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.genericView}>
                    <p>Detailed analytics for {node.type} nodes are coming soon.</p>
                </div>
            )}
        </div>
    );
}

export default StationDetails;
