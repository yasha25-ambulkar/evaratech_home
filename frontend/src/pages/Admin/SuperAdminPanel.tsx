import React from 'react';
import { motion } from 'framer-motion';
import styles from './SuperAdminPanel.module.css';

const SuperAdminPanel: React.FC = () => {
    const stats = [
        { label: 'Total Nodes', value: '1,284', change: '+12%', icon: '🌐' },
        { label: 'Active Admins', value: '42', change: '+5%', icon: '👤' },
        { label: 'System Health', value: '99.9%', change: 'Stable', icon: '⚡' },
        { label: 'Pending Alerts', value: '3', change: '-20%', icon: '🔔' }
    ];

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <h1 className={styles.title}>COMMAND CENTER</h1>
                <p className={styles.subtitle}>SuperAdmin Intelligence Dashboard</p>
            </header>

            <div className={styles.statsGrid}>
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        className={styles.statCard}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                    >
                        <div className={styles.statIcon}>{stat.icon}</div>
                        <div className={styles.statInfo}>
                            <span className={styles.statLabel}>{stat.label}</span>
                            <h2 className={styles.statValue}>{stat.value}</h2>
                            <span className={styles.statChange}>{stat.change}</span>
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className={styles.mainContent}>
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Regional Activity</h3>
                    <div className={styles.placeholderMap}>
                        {/* High-level visualization placeholder */}
                        <div className={styles.dataPoint} style={{ top: '20%', left: '30%' }}></div>
                        <div className={styles.dataPoint} style={{ top: '60%', left: '70%' }}></div>
                        <div className={styles.dataPoint} style={{ top: '40%', left: '50%' }}></div>
                    </div>
                </div>

                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Recent Operations Audit</h3>
                    <div className={styles.auditList}>
                        {[1, 2, 3, 4, 5].map(i => (
                            <div key={i} className={styles.auditItem}>
                                <div className={styles.itemDot}></div>
                                <div className={styles.itemText}>
                                    <strong>Admin_{i + 100}</strong> toggled main pump at Station Alpha
                                    <span className={styles.itemTime}>2 mins ago</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SuperAdminPanel;
