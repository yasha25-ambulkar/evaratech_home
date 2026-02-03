import { useState, useMemo } from 'react';
import type { NodeData } from '../../../types/evaratech.types';
import { useEvaraTechDataStore } from '../../../store/evaratechDataStore';
import styles from './StatusNode.module.css';

// Components (will be extracted later if needed)
import StatusCard from './StatusCard';

type FilterType = 'all' | 'active' | 'inactive' | 'alert';
type TabType = 'all' | 'pump' | 'sump' | 'tank' | 'bore';

interface StatusNodeProps {
    onNodeSelect: (node: NodeData) => void;
    onClose: () => void;
}

/**
 * StatusNode - Dashboard for monitoring all node statuses
 * Features: Tab filtering, Status filtering, Grid view of nodes
 */
function StatusNode({ onNodeSelect, onClose }: StatusNodeProps) {
    const [activeTab, setActiveTab] = useState<TabType>('all');
    const [filter, setFilter] = useState<FilterType>('all');
    const { nodesData } = useEvaraTechDataStore();

    const allNodes = Object.values(nodesData);

    // Filter nodes based on tab and status filter
    const filteredNodes = useMemo(() => {
        return allNodes.filter((node) => {
            // 1. Filter by Tab (Type)
            if (activeTab !== 'all') {
                if (activeTab === 'bore') {
                    if (node.type !== 'bore' && node.type !== 'govt') return false;
                } else if (node.type !== activeTab) {
                    return false;
                }
            }

            // 2. Filter by Status
            if (filter === 'active' && !node.isActive) return false;
            if (filter === 'inactive' && node.isActive) return false;
            // TODO: Implement alert filter logic

            return true;
        });
    }, [allNodes, activeTab, filter]);

    // Counts for tabs
    const counts = useMemo(() => {
        const c = {
            all: allNodes.length,
            pump: allNodes.filter(n => n.type === 'pump').length,
            sump: allNodes.filter(n => n.type === 'sump').length,
            tank: allNodes.filter(n => n.type === 'tank').length,
            bore: allNodes.filter(n => n.type === 'bore' || n.type === 'govt').length,
        };
        return c;
    }, [allNodes]);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.headerTitle}>
                    <h2>System Status</h2>
                    <span className={styles.totalCount}>{filteredNodes.length} Nodes</span>
                </div>
                <button className={styles.closeBtn} onClick={onClose}>
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className={styles.controls}>
                {/* Tabs */}
                <div className={styles.tabs}>
                    <button
                        className={`${styles.tab} ${activeTab === 'all' ? styles.active : ''}`}
                        onClick={() => setActiveTab('all')}
                    >
                        All <span className={styles.count}>{counts.all}</span>
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'pump' ? styles.active : ''}`}
                        onClick={() => setActiveTab('pump')}
                    >
                        Pumps <span className={styles.count}>{counts.pump}</span>
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'sump' ? styles.active : ''}`}
                        onClick={() => setActiveTab('sump')}
                    >
                        Sumps <span className={styles.count}>{counts.sump}</span>
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'tank' ? styles.active : ''}`}
                        onClick={() => setActiveTab('tank')}
                    >
                        Tanks <span className={styles.count}>{counts.tank}</span>
                    </button>
                    <button
                        className={`${styles.tab} ${activeTab === 'bore' ? styles.active : ''}`}
                        onClick={() => setActiveTab('bore')}
                    >
                        Borewells <span className={styles.count}>{counts.bore}</span>
                    </button>
                </div>

                {/* Filter Dropdown */}
                <div className={styles.filter}>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value as FilterType)}
                        className={styles.select}
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active Only</option>
                        <option value="inactive">Inactive Only</option>
                        <option value="alert">Alerts</option>
                    </select>
                </div>
            </div>

            <div className={styles.grid}>
                {filteredNodes.map((node) => (
                    <StatusCard
                        key={node.nodeId}
                        node={node}
                        onClick={() => onNodeSelect(node)}
                    />
                ))}

                {filteredNodes.length === 0 && (
                    <div className={styles.emptyState}>
                        <i className="fas fa-search"></i>
                        <p>No nodes found matching filters</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default StatusNode;
