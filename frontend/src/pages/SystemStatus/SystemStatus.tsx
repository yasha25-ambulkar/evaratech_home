import { useState } from 'react';
import styles from './SystemStatus.module.css';

interface StatusMetric {
    name: string;
    value: string;
    status: 'good' | 'warning' | 'critical';
    icon: string;
}

function SystemStatus() {
    const [metrics] = useState<StatusMetric[]>([
        { name: 'API Response Time', value: '45ms', status: 'good', icon: 'fa-clock' },
        { name: 'Database Performance', value: '98%', status: 'good', icon: 'fa-database' },
        { name: 'Server Uptime', value: '99.9%', status: 'good', icon: 'fa-server' },
        { name: 'Active Connections', value: '1,234', status: 'good', icon: 'fa-plug' },
        { name: 'Error Rate', value: '0.1%', status: 'good', icon: 'fa-exclamation-triangle' },
        { name: 'Data Sync Status', value: 'Synced', status: 'good', icon: 'fa-sync' },
    ]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'good': return '#06d6a0';
            case 'warning': return '#ffd60a';
            case 'critical': return '#d62828';
            default: return '#6c757d';
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>System Status</h1>
                <p className={styles.subtitle}>Real-time system health monitoring</p>
            </div>

            <div className={styles.content}>
                <div className={styles.metricsGrid}>
                    {metrics.map((metric, index) => (
                        <div key={index} className={`${styles.metricCard} ${styles[metric.status]}`}>
                            <div className={styles.metricHeader}>
                                <h3 className={styles.metricTitle}>{metric.name}</h3>
                                <span className={`${styles.statusBadge} ${styles[metric.status]}`}>
                                    {metric.status}
                                </span>
                            </div>
                            <p className={styles.metricValue}>{metric.value}</p>
                            <div className={styles.metricFooter}>
                                <i className={`fas ${metric.icon}`} style={{ color: getStatusColor(metric.status) }}></i>
                                <span className={styles.metricLabel}>Last updated: Just now</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.activitySection}>
                    <h2>Recent Activity</h2>
                    <div className={styles.activityList}>
                        <div className={styles.activityItem}>
                            <div className={`${styles.activityIcon} ${styles.success}`}>
                                <i className="fas fa-check"></i>
                            </div>
                            <div className={styles.activityContent}>
                                <p className={styles.activityTitle}>System backup completed</p>
                                <p className={styles.activityTime}>2 minutes ago</p>
                            </div>
                        </div>
                        <div className={styles.activityItem}>
                            <div className={`${styles.activityIcon} ${styles.info}`}>
                                <i className="fas fa-info"></i>
                            </div>
                            <div className={styles.activityContent}>
                                <p className={styles.activityTitle}>Database optimization started</p>
                                <p className={styles.activityTime}>15 minutes ago</p>
                            </div>
                        </div>
                        <div className={styles.activityItem}>
                            <div className={`${styles.activityIcon} ${styles.warning}`}>
                                <i className="fas fa-exclamation"></i>
                            </div>
                            <div className={styles.activityContent}>
                                <p className={styles.activityTitle}>High memory usage detected</p>
                                <p className={styles.activityTime}>1 hour ago</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SystemStatus;
