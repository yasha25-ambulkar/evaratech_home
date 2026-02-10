import { useState, useMemo } from 'react';
import { useAssets } from '../../../hooks/useAssets';
import { useNodeFiltering } from '../../../hooks/useNodeFiltering';
import NodeFactory from '../../../services/NodeFactory';
import { INodeData } from '../../../models/NodeEntity';
import type { Asset } from '../../../types';
import styles from './StatusNode.module.css';
import SquareStatusCard from './SquareStatusCard';

interface StatusNodeProps {
    onNodeSelect: (node: Asset) => void;
}

function StatusNode({ onNodeSelect }: StatusNodeProps) {
    const { assets: allNodes } = useAssets();

    // Convert Assets to NodeEntities for the hook use
    const nodeEntities = useMemo(() => {
        return allNodes.map(asset => {
            const nodeData: INodeData = {
                id: asset.id,
                name: asset.name,
                type: asset.type as any,
                status: asset.status === 'running' || asset.status === 'active' || asset.status === 'working' ? 'Normal' :
                    asset.status === 'alert' || asset.isCritical ? 'Critical' : 'Normal',
                location: 'Main Campus',
                lastUpdate: 'Just now'
            };
            return NodeFactory.createNode(nodeData);
        });
    }, [allNodes]);

    // REUSABLE LOGIC: using the same hook as AllNodes page
    const {
        filter: typeFilter,
        setFilter: setTypeFilter,
        filteredNodes: typeFilteredNodes
    } = useNodeFiltering(nodeEntities);

    // Calculate Type Counts manually for the tabs
    const typeCounts = useMemo(() => ({
        all: allNodes.length,
        pump: allNodes.filter(n => n.type === 'pump').length,
        sump: allNodes.filter(n => n.type === 'sump').length,
        tank: allNodes.filter(n => n.type === 'tank').length,
        bore: allNodes.filter(n => n.type === 'bore' || n.type === 'govt').length,
    }), [allNodes]);

    // Additional Status Filter for this Dashboard
    const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

    const finalNodes = typeFilteredNodes.filter(node => {
        if (statusFilter === 'all') return true;

        const isActive = node.status === 'Normal';

        if (statusFilter === 'active') return isActive;
        if (statusFilter === 'inactive') return !isActive;
        return true;
    });

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerTitle}>
                    <h2><i className="fas fa-th-large"></i> System Dashboard</h2>
                    <span className={styles.nodeCount}>{finalNodes.length} Nodes</span>
                </div>

                <div className={styles.statusFilter}>
                    <button
                        className={`${styles.statusBtn} ${statusFilter === 'all' ? styles.active : ''}`}
                        onClick={() => setStatusFilter('all')}
                    >All</button>
                    <button
                        className={`${styles.statusBtn} ${statusFilter === 'active' ? styles.active : ''}`}
                        onClick={() => setStatusFilter('active')}
                    >Active</button>
                    <button
                        className={`${styles.statusBtn} ${statusFilter === 'inactive' ? styles.active : ''}`}
                        onClick={() => setStatusFilter('inactive')}
                    >Inactive</button>
                </div>
            </div>

            <div className={styles.controls}>
                <div className={styles.tabs}>
                    <button onClick={() => setTypeFilter('all')} className={typeFilter === 'all' ? styles.tabActive : styles.tab}>
                        All <span className={styles.count}>{typeCounts.all}</span>
                    </button>
                    <button onClick={() => setTypeFilter('pump')} className={typeFilter === 'pump' ? styles.tabActive : styles.tab}>
                        Pumps <span className={styles.count}>{typeCounts.pump}</span>
                    </button>
                    <button onClick={() => setTypeFilter('sump')} className={typeFilter === 'sump' ? styles.tabActive : styles.tab}>
                        Sumps <span className={styles.count}>{typeCounts.sump}</span>
                    </button>
                    <button onClick={() => setTypeFilter('tank')} className={typeFilter === 'tank' ? styles.tabActive : styles.tab}>
                        Tanks <span className={styles.count}>{typeCounts.tank}</span>
                    </button>
                    <button onClick={() => setTypeFilter('bore')} className={typeFilter === 'bore' ? styles.tabActive : styles.tab}>
                        Borewells <span className={styles.count}>{typeCounts.bore}</span>
                    </button>
                </div>
            </div>

            <div className={styles.grid}>
                {finalNodes.map((node) => {
                    // Create a plain object for the card props
                    const cardProps: any = {
                        id: node.id,
                        name: node.name,
                        type: node.type,
                        status: node.status === 'Normal' ? 'active' : 'alert',
                        location: node.location
                    };

                    return (
                        <SquareStatusCard
                            key={node.id}
                            node={cardProps}
                            onClick={() => {
                                const original = allNodes.find(n => n.id === node.id);
                                if (original) onNodeSelect(original);
                            }}
                        />
                    );
                })}

                {finalNodes.length === 0 && (
                    <div className={styles.emptyState}>
                        <i className="fas fa-search"></i>
                        <p>No nodes found</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StatusNode;
