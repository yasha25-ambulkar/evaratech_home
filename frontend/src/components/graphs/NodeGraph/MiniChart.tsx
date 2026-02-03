import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    AreaChart,
    Area,
} from 'recharts';
import type { SensorReading } from '../../../types/evaratech.types';
import styles from './NodeGraph.module.css';

interface MiniChartProps {
    title: string;
    data: SensorReading[];
    dataKey?: string;
    color: string;
    unit: string;
    type?: 'line' | 'area';
    syncId?: string;
    domain?: [number, number];
}

function MiniChart({
    title,
    data,
    dataKey = 'value',
    color,
    unit,
    type = 'area',
    syncId = 'all-view',
    domain
}: MiniChartProps) {
    // Format timestamp for X axis
    const formatTime = (time: Date) => {
        return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    // Custom tooltip
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className={styles.chartTooltip}>
                    <p className={styles.tooltipTime}>{new Date(label).toLocaleString()}</p>
                    <p className={styles.tooltipValue} style={{ color }}>
                        {payload[0].value.toFixed(1)} {unit}
                    </p>
                </div>
            );
        }
        return null;
    };

    // Safe data check
    if (!data || data.length === 0) {
        return (
            <div className={styles.miniChartCard}>
                <h4 className={styles.chartTitle}>{title}</h4>
                <div className={styles.noData}>No Data Available</div>
            </div>
        );
    }

    // Calculate min/max for domain if not provided
    const autoDomain = domain || [
        'auto',
        'auto'
    ];

    return (
        <div className={styles.miniChartCard}>
            <h4 className={styles.chartTitle}>
                {title}
                <span className={styles.currentValue} style={{ color }}>
                    {data[data.length - 1]?.value.toFixed(1)} {unit}
                </span>
            </h4>
            <div className={styles.chartContent}>
                <ResponsiveContainer width="100%" height="100%">
                    {type === 'area' ? (
                        <AreaChart data={data} syncId={syncId}>
                            <defs>
                                <linearGradient id={`color-${title}`} x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor={color} stopOpacity={0.3} />
                                    <stop offset="95%" stopColor={color} stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                            <XAxis
                                dataKey="timestamp"
                                tickFormatter={formatTime}
                                stroke="var(--text-muted)"
                                fontSize={10}
                                tick={{ fill: 'var(--text-muted)' }}
                                minTickGap={30}
                            />
                            <YAxis
                                hide={false}
                                stroke="var(--text-muted)"
                                fontSize={10}
                                tick={{ fill: 'var(--text-muted)' }}
                                domain={autoDomain}
                                width={30}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Area
                                type="monotone"
                                dataKey={dataKey}
                                stroke={color}
                                fillOpacity={1}
                                fill={`url(#color-${title})`}
                                strokeWidth={2}
                                isAnimationActive={false}
                            />
                        </AreaChart>
                    ) : (
                        <LineChart data={data} syncId={syncId}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.1)" />
                            <XAxis
                                dataKey="timestamp"
                                tickFormatter={formatTime}
                                stroke="var(--text-muted)"
                                fontSize={10}
                                minTickGap={30}
                            />
                            <YAxis
                                stroke="var(--text-muted)"
                                fontSize={10}
                                domain={autoDomain}
                                width={30}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Line
                                type="monotone"
                                dataKey={dataKey}
                                stroke={color}
                                dot={false}
                                strokeWidth={2}
                                isAnimationActive={false}
                            />
                        </LineChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default MiniChart;
