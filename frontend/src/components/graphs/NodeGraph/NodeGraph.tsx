import { useState, useMemo } from 'react';
import type { NodeData } from '../../../types/evaratech.types';
import { useComparisonStore } from '../../../store/comparisonStore';
import AllView from './AllView';
import SingleView from './SingleView';
import CompareView from './CompareView';
import UsageAnalytics from '../UsageAnalytics/UsageAnalytics';
import styles from './NodeGraph.module.css';

// View modes
type ViewMode = 'all' | 'single' | 'compare';

interface NodeGraphProps {
    node: NodeData;
    allNodesData: Record<string, NodeData>;
    onClose: () => void;
}

/**
 * NodeGraph - Main graph component with 3 view modes
 * - ALL: Display all metrics for selected node
 * - SINGLE: Display one metric with time range selection
 * - COMPARE: Compare same metric across multiple nodes
 */
function NodeGraph({ node, allNodesData, onClose }: NodeGraphProps) {
    const [viewMode, setViewMode] = useState<ViewMode>('all');
    const [selectedMetric, setSelectedMetric] = useState<string>('flowRate');
    const { selectedNodes } = useComparisonStore();

    // Get available metrics based on node type
    const availableMetrics = useMemo(() => {
        if (node.type === 'pump') {
            return [
                { value: 'flowRate', label: 'Flow Rate' },
                { value: 'pressure', label: 'Pressure' },
                { value: 'powerConsumption', label: 'Power Consumption' },
            ];
        } else if (node.type === 'sump') {
            return [
                { value: 'waterLevel', label: 'Water Level' },
                { value: 'currentVolume', label: 'Current Volume' },
                { value: 'inletFlow', label: 'Inlet Flow' },
                { value: 'outletFlow', label: 'Outlet Flow' },
                { value: 'temperature', label: 'Temperature' },
            ];
        } else if (node.type === 'tank') {
            return [
                { value: 'waterLevel', label: 'Water Level' },
                { value: 'currentVolume', label: 'Current Volume' },
                { value: 'fillRate', label: 'Fill Rate' },
                { value: 'consumptionRate', label: 'Consumption Rate' },
                { value: 'temperature', label: 'Temperature' },
            ];
        } else {
            // Borewell
            return [
                { value: 'waterLevel', label: 'Water Level' },
                { value: 'flowRate', label: 'Flow Rate' },
            ];
        }
    }, [node.type]);

    // Control buttons for view switching
    const renderControls = () => (
        <div className={styles.controls}>
            <div className={styles.viewModeButtons}>
                <button
                    className={`${styles.viewBtn} ${viewMode === 'all' ? styles.active : ''}`}
                    onClick={() => setViewMode('all')}
                >
                    <i className="fas fa-chart-line"></i>
                    All Metrics
                </button>
                <button
                    className={`${styles.viewBtn} ${viewMode === 'single' ? styles.active : ''}`}
                    onClick={() => setViewMode('single')}
                >
                    <i className="fas fa-chart-area"></i>
                    Single View
                </button>
                <button
                    className={`${styles.viewBtn} ${viewMode === 'compare' ? styles.active : ''}`}
                    onClick={() => setViewMode('compare')}
                >
                    <i className="fas fa-balance-scale"></i>
                    Compare
                </button>
            </div>

            {/* Metric selector for Single and Compare views */}
            {(viewMode === 'single' || viewMode === 'compare') && (
                <div className={styles.metricSelector}>
                    <label htmlFor="metric-select">Metric:</label>
                    <select
                        id="metric-select"
                        value={selectedMetric}
                        onChange={(e) => setSelectedMetric(e.target.value)}
                        className={styles.select}
                    >
                        {availableMetrics.map((metric) => (
                            <option key={metric.value} value={metric.value}>
                                {metric.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.headerLeft}>
                    <h2 className={styles.title}>{node.name}</h2>
                    <span className={styles.nodeType}>
                        {node.type.toUpperCase()}
                    </span>
                </div>
                <button className={styles.closeBtn} onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            {/* Controls */}
            {renderControls()}

            {/* Content based on view mode */}
            <div className={styles.content}>
                {viewMode === 'all' && (
                    <AllView node={node} />
                )}

                {viewMode === 'single' && (
                    <SingleView
                        node={node}
                        metric={selectedMetric}
                        allNodesData={allNodesData}
                    />
                )}

                {viewMode === 'compare' && (
                    <CompareView
                        nodes={selectedNodes.map(id => allNodesData[id]).filter(Boolean)}
                        metric={selectedMetric}
                        currentNode={node}
                    />
                )}
            </div>

            {/* Usage Analytics */}
            {viewMode === 'all' && (
                <UsageAnalytics node={node} />
            )}
        </div>
    );
}

export default NodeGraph;
