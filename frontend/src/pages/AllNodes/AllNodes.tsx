import { useState } from 'react';
import { Link } from 'react-router-dom';

import styles from './AllNodes.module.css';
import NodeFactory from '../../services/NodeFactory';
import { NodeEntity } from '../../models/NodeEntity';
import { useNodeFiltering } from '../../hooks/useNodeFiltering';
import { GridViewStrategy } from '../../strategies/NodeViewStrategy';
import StatCard from '../../components/ui/StatCard/StatCard';

function AllNodes() {
    const [nodes] = useState<NodeEntity[]>(NodeFactory.getAllNodes());
    const { filters, setFilters, filteredNodes, statusCounts } = useNodeFiltering(nodes);

    const gridStrategy = new GridViewStrategy();

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>All Nodes</h1>
                        <p className={styles.subtitle}>Monitor all water infrastructure nodes</p>
                    </div>

                </div>

                {/* Stats */}
                <div className={styles.stats}>
                    <StatCard
                        icon={<i className="fas fa-circle-nodes"></i>}
                        label="Total Nodes"
                        value={statusCounts.total}
                        trend="neutral"
                        color="blue"
                    />
                    <StatCard
                        icon={<i className="fas fa-check-circle"></i>}
                        label="Normal"
                        value={statusCounts.normal}
                        trend="neutral"
                        color="green"
                    />
                    <StatCard
                        icon={<i className="fas fa-exclamation-triangle"></i>}
                        label="Warning"
                        value={statusCounts.warning}
                        trend="down"
                        color="orange"
                    />
                    <StatCard
                        icon={<i className="fas fa-times-circle"></i>}
                        label="Critical"
                        value={statusCounts.critical}
                        trend="down"
                        color="red"
                    />
                </div>

                <div className={styles.controls}>
                    <div className={styles.filters}>
                        <button
                            className={filters.includes('all') ? styles.filterActive : styles.filterBtn}
                            onClick={() => setFilters(['all'])}
                        >
                            All

                        </button>
                        <Link
                            to="/products/evaratank"
                            className={styles.productFilterBtn}
                        >
                            EvaraTank
                        </Link>
                        <Link
                            to="/products/evaraflow"
                            className={styles.productFilterBtn}
                        >
                            EvaraFlow
                        </Link>
                        <Link
                            to="/products/evaradeep"
                            className={styles.productFilterBtn}
                        >
                            EvaraDeep
                        </Link>
                        <div className={styles.filterDivider} />
                        <button
                            className={filters.includes('pump') ? styles.filterActive : styles.filterBtn}
                            onClick={() => {
                                if (filters.includes('pump')) {
                                    const newFilters = filters.filter(f => f !== 'pump');
                                    setFilters(newFilters.length ? newFilters : ['all']);
                                } else {
                                    const newFilters = filters.filter(f => f !== 'all');
                                    setFilters([...newFilters, 'pump']);
                                }
                            }}
                        >
                            Pumps
                        </button>
                        <button
                            className={filters.includes('sump') ? styles.filterActive : styles.filterBtn}
                            onClick={() => {
                                if (filters.includes('sump')) {
                                    const newFilters = filters.filter(f => f !== 'sump');
                                    setFilters(newFilters.length ? newFilters : ['all']);
                                } else {
                                    const newFilters = filters.filter(f => f !== 'all');
                                    setFilters([...newFilters, 'sump']);
                                }
                            }}
                        >
                            Sumps
                        </button>
                        <button
                            className={filters.includes('tank') ? styles.filterActive : styles.filterBtn}
                            onClick={() => {
                                if (filters.includes('tank')) {
                                    const newFilters = filters.filter(f => f !== 'tank');
                                    setFilters(newFilters.length ? newFilters : ['all']);
                                } else {
                                    const newFilters = filters.filter(f => f !== 'all');
                                    setFilters([...newFilters, 'tank']);
                                }
                            }}
                        >
                            Tanks
                        </button>
                        <button
                            className={filters.includes('bore') ? styles.filterActive : styles.filterBtn}
                            onClick={() => {
                                if (filters.includes('bore')) {
                                    const newFilters = filters.filter(f => f !== 'bore');
                                    setFilters(newFilters.length ? newFilters : ['all']);
                                } else {
                                    const newFilters = filters.filter(f => f !== 'all');
                                    setFilters([...newFilters, 'bore']);
                                }
                            }}
                        >
                            Borewells
                        </button>
                    </div>

                </div>

                {/* Nodes Grid rendered by default */}
                {gridStrategy.render(filteredNodes)}

                {filteredNodes.length === 0 && (
                    <div className={styles.empty}>
                        <i className="fas fa-search"></i>
                        <p>No nodes found matching your criteria</p>
                    </div>
                )}
            </div>
        </div >
    );
}

export default AllNodes;
