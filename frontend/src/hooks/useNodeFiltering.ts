import { useState, useMemo } from 'react';
import { NodeEntity } from '../models/NodeEntity';
import { NodeStatus } from '../models/enums';

export function useNodeFiltering(nodes: NodeEntity[]) {
    const [filters, setFilters] = useState<string[]>(['all']);

    const filteredNodes = useMemo(() => {
        if (filters.includes('all') || filters.length === 0) return nodes;
        return nodes.filter(node =>
            filters.includes(node.type) ||
            filters.includes(node.product)
        );
    }, [nodes, filters]);

    const statusCounts = useMemo(() => ({
        total: nodes.length,
        normal: nodes.filter(n => n.status === NodeStatus.Normal).length,
        warning: nodes.filter(n => n.status === NodeStatus.Warning).length,
        critical: nodes.filter(n => n.status === NodeStatus.Critical).length,
    }), [nodes]);

    return { filters, setFilters, filteredNodes, statusCounts };
}
