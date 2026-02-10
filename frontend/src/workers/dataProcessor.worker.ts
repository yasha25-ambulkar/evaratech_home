/* eslint-disable no-restricted-globals */
import { INodeData } from '../models/NodeEntity';
import { NodeStatus } from '../models/enums';

interface FilterPayload {
    nodes: INodeData[];
    filter: string;
}

self.onmessage = (e: MessageEvent) => {
    const { type, payload } = e.data;

    if (type === 'FILTER_NODES') {
        const { nodes, filter } = payload as FilterPayload;
        // Simulate heavy work
        const start = performance.now();

        let filtered = nodes;
        if (filter !== 'all') {
            filtered = nodes.filter((n: INodeData) => n.type === filter);
        }

        // Count stats
        const stats = {
            total: nodes.length,
            normal: nodes.filter((n: INodeData) => n.status === NodeStatus.Normal).length,
            warning: nodes.filter((n: INodeData) => n.status === NodeStatus.Warning).length,
            critical: nodes.filter((n: INodeData) => n.status === NodeStatus.Critical).length,
        };

        const end = performance.now();

        self.postMessage({
            type: 'FILTER_COMPLETE',
            payload: {
                filteredNodes: filtered,
                statusCounts: stats,
                processingTime: end - start
            }
        });
    } else if (type === 'CALCULATE_FLOW_DYNAMICS') {
        // Placeholder for complex math
        const { flowRate } = payload;
        // Simulate heavy calculation
        let result = flowRate;
        for (let i = 0; i < 1000000; i++) {
            result = result * 1.000001;
        }
        self.postMessage({ type: 'FLOW_CALCULATED', payload: result });
    }
};

export { };
