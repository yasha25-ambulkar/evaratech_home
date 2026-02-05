import { useState, useMemo } from 'react';
import { NodeEntity } from '../models/NodeEntity';

export function useNodeFiltering(nodes: NodeEntity[]) {
    const [filter, setFilter] = useState<string>('all');

    const filteredNodes = useMemo(() => {
        if (filter === 'all') return nodes;
        return nodes.filter(node => node.type === filter);
    }, [nodes, filter]);

    const statusCounts = useMemo(() => ({
        total: nodes.length,
        normal: nodes.filter(n => n.status === 'Normal').length,
        warning: nodes.filter(n => n.status === 'Warning').length,
        critical: nodes.filter(n => n.status === 'Critical').length,
    }), [nodes]);

    return { filter, setFilter, filteredNodes, statusCounts };
}
