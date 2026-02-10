import { useParams, Link } from 'react-router-dom';
import { useMemo } from 'react';
import NodeFactory from '../../services/NodeFactory';
import { ProductType } from '../../models/enums';
import { useNodeFiltering } from '../../hooks/useNodeFiltering';
import { GridViewStrategy } from '../../strategies/NodeViewStrategy';
import StatCard from '../../components/ui/StatCard/StatCard';
import EvaraTankDashboard from './EvaraTankDashboard';
import styles from './ProductPage.module.css';

// Product Configuration
const PRODUCT_CONFIG: Record<string, { title: string; subtitle: string; color: string; icon: string }> = {
    'evaratank': {
        title: 'EvaraTank™',
        subtitle: 'Advanced Smart Water Storage Solutions',
        color: 'var(--color-primary-500)',
        icon: 'fas fa-database'
    },
    'evaraflow': {
        title: 'EvaraFlow™',
        subtitle: 'Precision Flow Monitoring Systems',
        color: 'var(--color-primary-500)', // Or different brand color
        icon: 'fas fa-water'
    },
    'evaradeep': {
        title: 'EvaraDeep™',
        subtitle: 'Deep Well & Borewell Management',
        color: 'var(--color-primary-500)', // Or different brand color
        icon: 'fas fa-arrow-down'
    }
};

function ProductPage() {
    const { productType } = useParams<{ productType: string }>();
    const config = PRODUCT_CONFIG[productType || ''] || { title: 'Product', subtitle: 'Monitoring', color: '#333', icon: 'fas fa-box' };

    // Fetch all nodes and filter by this product type
    const allNodes = useMemo(() => NodeFactory.getAllNodes(), []);
    const productNodes = useMemo(() => {
        if (!productType) return [];
        // Map URL param to Enum
        const typeEnum = Object.values(ProductType).find(t => t === productType) || ProductType.None;
        return allNodes.filter(n => n.product === typeEnum);
    }, [allNodes, productType]);

    // Reuse existing hook for status counts within this product line
    const { statusCounts } = useNodeFiltering(productNodes);

    // Calculate aggregate metrics (e.g. Total Volume for Tanks)
    const aggregateMetrics = useMemo(() => {
        if (productType === 'evaratank') {
            const totalVolume = productNodes.reduce((acc, n) => acc + (n.tankCapacityLitres || 0), 0);
            const totalUsage = productNodes.reduce((acc, n) => acc + (n.dailyUsage || 0), 0);
            return [
                { label: 'Total Capacity', value: `${(totalVolume / 1000).toFixed(1)}k L`, icon: 'fas fa-fill-drip' },
                { label: 'Total Usage', value: `${(totalUsage / 1000).toFixed(1)}k L`, icon: 'fas fa-tint' }
            ];
        }
        return [];
    }, [productNodes, productType]);

    const gridStrategy = new GridViewStrategy();

    return (
        <div className={productType === 'evaratank' ? styles.containerCompact : styles.container}>
            {productType !== 'evaratank' && (
                <div className={styles.header}>
                    <div className={styles.breadcrumbs}>
                        <Link to="/nodes">All Nodes</Link> / <span>{config.title}</span>
                    </div>
                    <div className={styles.titleRow}>
                        <div className={styles.iconBox} style={{ color: config.color }}>
                            <i className={config.icon}></i>
                        </div>
                        <div>
                            <h1>{config.title}</h1>
                            <p className={styles.subtitle}>{config.subtitle}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Dashboard View for EvaraTank */}
            {productType === 'evaratank' ? (
                <EvaraTankDashboard nodes={productNodes} />
            ) : (
                <>
                    {/* Stats Row */}
                    <div className={styles.stats}>
                        <StatCard
                            icon={<i className="fas fa-server"></i>}
                            label="Active Units"
                            value={statusCounts.total}
                            trend="neutral"
                            color="blue"
                        />
                        <StatCard
                            icon={<i className="fas fa-check-circle"></i>}
                            label="Operational"
                            value={statusCounts.normal}
                            trend="up"
                            color="green"
                        />

                        {/* Dynamic Product Metrics */}
                        {aggregateMetrics.map((metric, idx) => (
                            <StatCard
                                key={idx}
                                icon={<i className={metric.icon}></i>}
                                label={metric.label}
                                value={metric.value}
                                trend="neutral"
                                color="blue"
                            />
                        ))}
                    </div>

                    {/* Nodes Grid */}
                    <div className={styles.gridContainer}>
                        {gridStrategy.render(productNodes)}
                    </div>
                </>
            )}

            {productNodes.length === 0 && (
                <div className={styles.empty}>
                    <p>No {config.title} units found.</p>
                </div>
            )}
        </div>
    );
}

export default ProductPage;
