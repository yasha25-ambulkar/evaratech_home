import type { NodeData } from '../../../types/evaratech.types';
import styles from './UsageAnalytics.module.css';

interface UsageAnalyticsProps {
    node: NodeData;
}

/**
 * UsageAnalytics - Displays calculated metrics and insights
 * (Daily consumption, peak usage, warnings)
 */
function UsageAnalytics({ node }: UsageAnalyticsProps) {
    // Mock calculations for now (replace with real logic later)
    const stats = {
        dailyTotal: node.type === 'pump' ? '650 kL' : '230 kL',
        peakTime: '08:00 AM',
        efficiency: '94%',
        avgRate: node.type === 'pump' ? '420 L/min' : '150 L/min',
    };

    return (
        <div className={styles.analyticsContainer}>
            <h3 className={styles.title}>Usage Analytics (Last 24h)</h3>

            <div className={styles.grid}>
                <div className={styles.card}>
                    <div className={styles.icon}>
                        <i className="fas fa-water"></i>
                    </div>
                    <div className={styles.info}>
                        <span className={styles.label}>Total Volume</span>
                        <span className={styles.value}>{stats.dailyTotal}</span>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.icon}>
                        <i className="fas fa-clock"></i>
                    </div>
                    <div className={styles.info}>
                        <span className={styles.label}>Peak Usage</span>
                        <span className={styles.value}>{stats.peakTime}</span>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.icon}>
                        <i className="fas fa-tachometer-alt"></i>
                    </div>
                    <div className={styles.info}>
                        <span className={styles.label}>Avg Rate</span>
                        <span className={styles.value}>{stats.avgRate}</span>
                    </div>
                </div>

                <div className={styles.card}>
                    <div className={styles.icon}>
                        <i className="fas fa-check-circle"></i>
                    </div>
                    <div className={styles.info}>
                        <span className={styles.label}>Efficiency</span>
                        <span className={styles.value}>{stats.efficiency}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UsageAnalytics;
