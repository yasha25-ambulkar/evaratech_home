import { useState } from 'react';
import { Link } from 'react-router-dom';
import styles from './AllNodes.module.css';

interface Node {
    id: string;
    name: string;
    type: 'pump' | 'sump' | 'tank' | 'bore' | 'govt';
    status: 'Normal' | 'Warning' | 'Critical';
    location: string;
    lastUpdate: string;
}

const mockNodes: Node[] = [
    { id: 'PH1', name: 'Pump House 1', type: 'pump', status: 'Normal', location: 'Main Campus', lastUpdate: '2 mins ago' },
    { id: 'PH2', name: 'Pump House 2', type: 'pump', status: 'Normal', location: 'Main Campus', lastUpdate: '2 mins ago' },
    { id: 'PH3', name: 'Pump House 3', type: 'pump', status: 'Warning', location: 'Main Campus', lastUpdate: '5 mins ago' },
    { id: 'PH4', name: 'Pump House 4', type: 'pump', status: 'Normal', location: 'Main Campus', lastUpdate: '1 min ago' },
    { id: 'S1', name: 'Sump S1', type: 'sump', status: 'Normal', location: 'Main Campus', lastUpdate: '3 mins ago' },
    { id: 'S2', name: 'Sump S2', type: 'sump', status: 'Normal', location: 'Main Campus', lastUpdate: '2 mins ago' },
    { id: 'S3', name: 'Sump S3', type: 'sump', status: 'Normal', location: 'Main Campus', lastUpdate: '4 mins ago' },
    { id: 'S4', name: 'Sump S4 (Main Sump)', type: 'sump', status: 'Normal', location: 'Main Campus', lastUpdate: '1 min ago' },
    { id: 'OHT1', name: 'Bakul OHT', type: 'tank', status: 'Normal', location: 'Bakul Block', lastUpdate: '2 mins ago' },
    { id: 'OHT2', name: 'Parijat OHT', type: 'tank', status: 'Normal', location: 'Parijat Block', lastUpdate: '3 mins ago' },
    { id: 'OHT3', name: 'Kadamba OHT', type: 'tank', status: 'Normal', location: 'Kadamba Block', lastUpdate: '2 mins ago' },
    { id: 'B1', name: 'Borewell P1', type: 'bore', status: 'Normal', location: 'Campus Area', lastUpdate: '5 mins ago' },
    { id: 'B2', name: 'Borewell P2', type: 'bore', status: 'Normal', location: 'Campus Area', lastUpdate: '4 mins ago' },
    { id: 'GB1', name: 'Govt Borewell 1', type: 'govt', status: 'Normal', location: 'External', lastUpdate: '10 mins ago' },
];

function AllNodes() {
    const [nodes] = useState<Node[]>(mockNodes);
    const [filter, setFilter] = useState<string>('all');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Normal': return '#06d6a0';
            case 'Warning': return '#ffd60a';
            case 'Critical': return '#d62828';
            default: return '#6c757d';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'pump': return 'fa-water';
            case 'sump': return 'fa-tint';
            case 'tank': return 'fa-database';
            case 'bore': return 'fa-circle';
            case 'govt': return 'fa-circle';
            default: return 'fa-question';
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'pump': return '#6f42c1';
            case 'sump': return '#20c997';
            case 'tank': return '#0dcaf0';
            case 'bore': return '#fd7e14';
            case 'govt': return '#212529';
            default: return '#6c757d';
        }
    };

    const filteredNodes = nodes.filter(node => {
        return filter === 'all' || node.type === filter;
    });

    const statusCounts = {
        total: nodes.length,
        normal: nodes.filter(n => n.status === 'Normal').length,
        warning: nodes.filter(n => n.status === 'Warning').length,
        critical: nodes.filter(n => n.status === 'Critical').length,
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
                    <div className={styles.statCard}>
                        <i className="fas fa-circle-nodes"></i>
                        <div>
                            <p className={styles.statValue}>{statusCounts.total}</p>
                            <p className={styles.statLabel}>Total Nodes</p>
                        </div>
                    </div>
                    <div className={styles.statCard} style={{ borderLeft: `4px solid ${getStatusColor('Normal')}` }}>
                        <i className="fas fa-check-circle" style={{ color: getStatusColor('Normal') }}></i>
                        <div>
                            <p className={styles.statValue}>{statusCounts.normal}</p>
                            <p className={styles.statLabel}>Normal</p>
                        </div>
                    </div>
                    <div className={styles.statCard} style={{ borderLeft: `4px solid ${getStatusColor('Warning')}` }}>
                        <i className="fas fa-exclamation-triangle" style={{ color: getStatusColor('Warning') }}></i>
                        <div>
                            <p className={styles.statValue}>{statusCounts.warning}</p>
                            <p className={styles.statLabel}>Warning</p>
                        </div>
                    </div>
                    <div className={styles.statCard} style={{ borderLeft: `4px solid ${getStatusColor('Critical')}` }}>
                        <i className="fas fa-times-circle" style={{ color: getStatusColor('Critical') }}></i>
                        <div>
                            <p className={styles.statValue}>{statusCounts.critical}</p>
                            <p className={styles.statLabel}>Critical</p>
                        </div>
                    </div>
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
                        <button
                            className={viewMode === 'grid' ? styles.viewActive : styles.viewBtn}
                            onClick={() => setViewMode('grid')}
                            title="Grid view"
                        >
                            <i className="fas fa-th"></i>
                        </button>
                        <button
                            className={viewMode === 'list' ? styles.viewActive : styles.viewBtn}
                            onClick={() => setViewMode('list')}
                            title="List view"
                        >
                            <i className="fas fa-list"></i>
                        </button>
                    </div>
                </div>

                {/* Nodes Grid/List */}
                <div className={viewMode === 'grid' ? styles.grid : styles.list}>
                    {filteredNodes.map((node) => (
                        <div key={node.id} className={styles.nodeCard}>
                            <div className={styles.nodeHeader}>
                                <div
                                    className={styles.nodeIcon}
                                    style={{ background: getTypeColor(node.type) }}
                                >
                                    <i className={`fas ${getTypeIcon(node.type)}`}></i>
                                </div>
                                <div
                                    className={styles.statusBadge}
                                    style={{ background: getStatusColor(node.status) }}
                                >
                                    {node.status}
                                </div>
                            </div>

                            <h3 className={styles.nodeName}>{node.name}</h3>
                            <p className={styles.nodeLocation}>
                                <i className="fas fa-map-marker-alt"></i> {node.location}
                            </p>
                            <p className={styles.nodeUpdate}>
                                <i className="fas fa-clock"></i> {node.lastUpdate}
                            </p>

                            <div className={styles.nodeActions}>
                                <Link to={`/details?node=${node.id}`} className={styles.detailsBtn}>
                                    <i className="fas fa-info-circle"></i> Details
                                </Link>
                                <Link to={`/map?node=${node.id}`} className={styles.mapLinkBtn}>
                                    <i className="fas fa-map"></i> Map
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>

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
