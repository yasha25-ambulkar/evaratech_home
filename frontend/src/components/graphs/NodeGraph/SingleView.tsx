import { useState, useMemo } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    ReferenceLine,
} from 'recharts';
import type { NodeData, SensorReading } from '../../../types/evaratech.types';
import { filterReadingsByTimeRange } from '../../../utils/mockDataGenerator';
import styles from './NodeGraph.module.css';

interface SingleViewProps {
    node: NodeData;
    metric: string;
    allNodesData: Record<string, NodeData>;
}

type TimeRange = '24h' | '7d' | '30d';

function SingleView({ node, metric }: SingleViewProps) {
    const [timeRange, setTimeRange] = useState<TimeRange>('24h');

    // Get data for selected metric
    const metricData = useMemo(() => {
        // access property dynamically - simple cast or switch
        const key = metric as keyof typeof node;
        // @ts-ignore
        const data = node[key];
        return Array.isArray(data) ? data : [];
    }, [node, metric]);

    // Filter data by time range
    const filteredData = useMemo(() => {
        const now = new Date();
        let startDate = new Date();

        switch (timeRange) {
            case '24h':
                startDate.setTime(now.getTime() - 24 * 60 * 60 * 1000);
                break;
            case '7d':
                startDate.setTime(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                break;
            case '30d':
                startDate.setTime(now.getTime() - 30 * 24 * 60 * 60 * 1000);
                break;
        }

        return filterReadingsByTimeRange((metricData || []) as SensorReading[], startDate, now);
    }, [metricData, timeRange]);

    // Get unit from first data point
    const unit = filteredData[0]?.unit || '';

    // Calculate statistics
    const stats = useMemo(() => {
        if (!filteredData.length) return { avg: 0, min: 0, max: 0 };
        const values = filteredData.map(d => d.value);
        const sum = values.reduce((a, b) => a + b, 0);
        return {
            avg: sum / values.length,
            min: Math.min(...values),
            max: Math.max(...values),
        };
    }, [filteredData]);

    // Formatting
    const formatTime = (time: Date) => {
        const date = new Date(time);
        if (timeRange === '24h') {
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className={styles.chartTooltip}>
                    <p className={styles.tooltipTime}>{new Date(label).toLocaleString()}</p>
                    <p className={styles.tooltipValue} style={{ color: '#2196F3' }}>
                        {payload[0].value.toFixed(2)} {unit}
                    </p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className={styles.singleViewContainer}>
            <div className={styles.singleViewControls}>
                <div className={styles.timeRangeSelector}>
                    {(['24h', '7d', '30d'] as TimeRange[]).map((range) => (
                        <button
                            key={range}
                            className={`${styles.rangeBtn} ${timeRange === range ? styles.active : ''}`}
                            onClick={() => setTimeRange(range)}
                        >
                            {range}
                        </button>
                    ))}
                </div>
                <div className={styles.statsRow}>
                    <div className={styles.statItem}>
                        <span>Avg:</span>
                        <strong>{stats.avg.toFixed(1)}</strong>
                    </div>
                    <div className={styles.statItem}>
                        <span>Min:</span>
                        <strong>{stats.min.toFixed(1)}</strong>
                    </div>
                    <div className={styles.statItem}>
                        <span>Max:</span>
                        <strong>{stats.max.toFixed(1)}</strong>
                    </div>
                </div>
            </div>

            <div className={styles.largeChart}>
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={filteredData}>
                        <defs>
                            <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#2196F3" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#2196F3" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                        <XAxis
                            dataKey="timestamp"
                            tickFormatter={formatTime}
                            stroke="var(--text-muted)"
                            fontSize={11}
                            minTickGap={50}
                        />
                        <YAxis
                            stroke="var(--text-muted)"
                            fontSize={11}
                            domain={['auto', 'auto']}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <ReferenceLine y={stats.avg} label="Avg" stroke="#FF9800" strokeDasharray="3 3" />
                        <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#2196F3"
                            fillOpacity={1}
                            fill="url(#colorMetric)"
                            strokeWidth={2}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default SingleView;
