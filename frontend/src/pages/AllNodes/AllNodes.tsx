import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './AllNodes.module.css';
import NodeFactory from '../../services/NodeFactory';
import { NodeEntity } from '../../models/NodeEntity';
import { useNodeFiltering } from '../../hooks/useNodeFiltering';
import { NodeViewStrategy, GridViewStrategy, VirtualListViewStrategy } from '../../strategies/NodeViewStrategy';
import StatCard from '../../components/ui/StatCard/StatCard';

function AllNodes() {
    const [nodes] = useState<NodeEntity[]>(NodeFactory.getAllNodes());
    const { filter, setFilter, filteredNodes, statusCounts } = useNodeFiltering(nodes);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const strategies: Record<string, NodeViewStrategy> = {
        grid: new GridViewStrategy(),
        list: new VirtualListViewStrategy() // Replacing standard list with virtual list as per task
    };


    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>All Nodes</h1>
                        <p className={styles.subtitle}>Monitor all water infrastructure nodes</p>
                    </div>
                    <Link to="/map" className={styles.mapBtn}>
                        <i className="fas fa-map-marked-alt"></i> View on Map
                    </Link>
                </div>

                {/* Stats */}
                <div className={styles.stats}>
                    <StatCard
                        icon="fas fa-circle-nodes"
                        label="Total Nodes"
                        value={statusCounts.total}
                        trend="neutral"
                        color="blue"
                    />
                    <StatCard
                        icon="fas fa-check-circle"
                        label="Normal"
                        value={statusCounts.normal}
                        trend="neutral"
                        color="green"
                    />
                    <StatCard
                        icon="fas fa-exclamation-triangle"
                        label="Warning"
                        value={statusCounts.warning}
                        trend="down" // assuming warning is bad if present? or just neutral.
                        color="orange"
                    />
                    <StatCard
                        icon="fas fa-times-circle"
                        label="Critical"
                        value={statusCounts.critical}
                        trend="down"
                        color="red"
                    />
                </div>

                <div className={styles.controls}>
                    <div className={styles.filters}>
                        <button
                            className={filter === 'all' ? styles.filterActive : styles.filterBtn}
                            onClick={() => setFilter('all')}
                        >
                            All
                        </button>
                        <button
                            className={filter === 'pump' ? styles.filterActive : styles.filterBtn}
                            onClick={() => setFilter('pump')}
                        >
                            Pumps
                        </button>
                        <button
                            className={filter === 'sump' ? styles.filterActive : styles.filterBtn}
                            onClick={() => setFilter('sump')}
                        >
                            Sumps
                        </button>
                        <button
                            className={filter === 'tank' ? styles.filterActive : styles.filterBtn}
                            onClick={() => setFilter('tank')}
                        >
                            Tanks
                        </button>
                        <button
                            className={filter === 'bore' ? styles.filterActive : styles.filterBtn}
                            onClick={() => setFilter('bore')}
                        >
                            Borewells
                        </button>
                    </div>

                    <div className={styles.viewToggle}>
                        {Object.values(strategies).map(strategy => (
                            <button
                                key={strategy.id}
                                className={viewMode === strategy.id ? styles.viewActive : styles.viewBtn}
                                onClick={() => setViewMode(strategy.id as 'grid' | 'list')}
                                title={strategy.label}
                            >
                                <i className={strategy.icon}></i>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Nodes Grid/List Rendered by Strategy */}
                {strategies[viewMode].render(filteredNodes)}

                {filteredNodes.length === 0 && (
                    <div className={styles.empty}>
                        <i className="fas fa-search"></i>
                        <p>No nodes found matching your criteria</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default AllNodes;
