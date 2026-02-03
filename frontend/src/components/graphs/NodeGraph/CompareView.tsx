import { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import type { NodeData } from '../../../types/evaratech.types';
import styles from './NodeGraph.module.css';

interface CompareViewProps {
    nodes: NodeData[];
    metric: string;
    currentNode: NodeData;
}

const COLORS = ['#2196F3', '#4CAF50', '#FF9800', '#F44336', '#9C27B0'];

function CompareView({ nodes, metric, currentNode }: CompareViewProps) {
    // Ensure current node is included and unique
    const comparisonNodes = useMemo(() => {
        const all = [currentNode, ...nodes.filter(n => n.nodeId !== currentNode.nodeId)];
        // Deduplicate just in case
        return Array.from(new Map(all.map(n => [n.nodeId, n])).values());
    }, [nodes, currentNode]);

    // Merge data for chart
    const mergedData = useMemo(() => {
        if (comparisonNodes.length === 0) return [];

        // Get base timestamps from the first node (assuming roughly aligned intervals)
        // In a real app, we'd align properly by time. For mock data, they are generated same way.
        // @ts-ignore
        const baseData = comparisonNodes[0][metric as keyof typeof comparisonNodes[0]] || [];

        // Create map of timestamp -> data object
        return (baseData as any[]).map((point: any, index: number) => {
            const item: any = { timestamp: point.timestamp };

            comparisonNodes.forEach((node) => {
                const nodeData = (node as any)[metric];
                if (nodeData && nodeData[index]) {
                    item[node.nodeId] = nodeData[index].value;
                }
            });

            return item;
        });
    }, [comparisonNodes, metric]);

    const unit = (comparisonNodes[0] as any)?.[metric]?.[0]?.unit || '';

    const formatTime = (time: Date) => {
        return new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className={styles.chartTooltip}>
                    <p className={styles.tooltipTime}>{new Date(label).toLocaleString()}</p>
                    {payload.map((entry: any) => {
                        const node = comparisonNodes.find(n => n.nodeId === entry.dataKey);
                        return (
                            <p key={entry.dataKey} style={{ color: entry.color, margin: 0 }}>
                                {node?.name}: {entry.value.toFixed(2)} {unit}
                            </p>
                        );
                    })}
                </div>
            );
        }
        return null;
    };

    if (comparisonNodes.length === 0) {
        return <div className={styles.noData}>No nodes selected for comparison</div>;
    }

    return (
        <div className={styles.singleViewContainer}>
            <div className={styles.compareHeader}>
                <span className={styles.compareLabel}>Comparing {comparisonNodes.length} nodes</span>
            </div>

            <div className={styles.largeChart}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mergedData}>
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
                        <Legend />
                        {comparisonNodes.map((node, index) => (
                            <Line
                                key={node.nodeId}
                                type="monotone"
                                dataKey={node.nodeId}
                                name={node.name}
                                stroke={COLORS[index % COLORS.length]}
                                strokeWidth={2}
                                dot={false}
                            />
                        ))}
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default CompareView;
