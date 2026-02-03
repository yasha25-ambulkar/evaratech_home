import type { NodeData } from '../../../types/evaratech.types';
import MiniChart from './MiniChart';
import styles from './NodeGraph.module.css';

interface AllViewProps {
    node: NodeData;
}

/**
 * AllView - Displays grid of mini charts for all metrics of a node
 */
function AllView({ node }: AllViewProps) {
    // Render charts based on node type
    const renderCharts = () => {
        if (node.type === 'pump') {
            return (
                <>
                    <MiniChart
                        title="Flow Rate"
                        data={node.flowRate}
                        color="#4CAF50"
                        unit="L/min"
                    />
                    <MiniChart
                        title="Pressure"
                        data={node.pressure}
                        color="#FF9800"
                        unit="bar"
                    />
                    <MiniChart
                        title="Power"
                        data={node.powerConsumption}
                        color="#F44336"
                        unit="kW"
                    />
                </>
            );
        }

        if (node.type === 'sump') {
            return (
                <>
                    <MiniChart
                        title="Water Level"
                        data={node.waterLevel}
                        color="#2196F3"
                        unit="%"
                    />
                    <MiniChart
                        title="Volume"
                        data={node.currentVolume}
                        color="#3F51B5"
                        unit="L"
                    />
                    <MiniChart
                        title="Inlet Flow"
                        data={node.inletFlow}
                        color="#00BCD4"
                        unit="L/min"
                    />
                    <MiniChart
                        title="Outlet Flow"
                        data={node.outletFlow}
                        color="#4CAF50"
                        unit="L/min"
                    />
                </>
            );
        }

        if (node.type === 'tank') {
            return (
                <>
                    <MiniChart
                        title="Water Level"
                        data={node.waterLevel}
                        color="#2196F3"
                        unit="%"
                    />
                    <MiniChart
                        title="Volume"
                        data={node.currentVolume}
                        color="#3F51B5"
                        unit="L"
                    />
                    <MiniChart
                        title="Fill Rate"
                        data={node.fillRate}
                        color="#00BCD4"
                        unit="L/min"
                    />
                    <MiniChart
                        title="Consumption"
                        data={node.consumptionRate}
                        color="#FF9800"
                        unit="L/min"
                    />
                </>
            );
        }

        // Borewell
        return (
            <>
                <MiniChart
                    title="Water Level"
                    data={node.waterLevel}
                    color="#2196F3"
                    unit="m"
                />
                <MiniChart
                    title="Flow Rate"
                    data={node.flowRate}
                    color="#4CAF50"
                    unit="L/min"
                />
                {/* Daily output would typically be a bar chart, using line for now or we can add Bar support to MiniChart */}
                <MiniChart
                    title="Daily Output"
                    data={node.dailyOutput}
                    color="#9C27B0"
                    unit="L"
                    type="line"
                />
            </>
        );
    };

    return (
        <div className={styles.chartsGrid}>
            {renderCharts()}
        </div>
    );
}

export default AllView;
