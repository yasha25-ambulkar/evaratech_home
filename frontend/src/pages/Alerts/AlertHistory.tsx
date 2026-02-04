import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAlertStore } from '../../store/alertStore';
import styles from './AlertHistory.module.css';

export default function AlertHistory() {
    const { alerts, markAsRead, markAllAsRead, clearAlerts } = useAlertStore();
    const [filter, setFilter] = useState<'all' | 'unread' | 'critical'>('all');

    const filteredAlerts = alerts.filter(alert => {
        if (filter === 'unread') return !alert.isRead;
        if (filter === 'critical') return alert.severity === 'critical';
        return true;
    });

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'critical': return 'fa-exclamation-circle';
            case 'warning': return 'fa-exclamation-triangle';
            case 'info': return 'fa-info-circle';
            case 'success': return 'fa-check-circle';
            default: return 'fa-bell';
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleInfo}>
                    <h2><i className="fas fa-history"></i> Alert History</h2>
                    <span className={styles.count}>{alerts.length} Total</span>
                </div>
                <div className={styles.actions}>
                    <button className={styles.actionBtn} onClick={markAllAsRead} title="Mark all as read">
                        <i className="fas fa-check-double"></i> Mark All Read
                    </button>
                    <button className={`${styles.actionBtn} ${styles.danger}`} onClick={clearAlerts} title="Clear history">
                        <i className="fas fa-trash-alt"></i> Clear
                    </button>
                </div>
            </div>

            <div className={styles.controls}>
                <div className={styles.filters}>
                    <button
                        className={`${styles.filterTab} ${filter === 'all' ? styles.active : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`${styles.filterTab} ${filter === 'unread' ? styles.active : ''}`}
                        onClick={() => setFilter('unread')}
                    >
                        Unread
                    </button>
                    <button
                        className={`${styles.filterTab} ${filter === 'critical' ? styles.active : ''}`}
                        onClick={() => setFilter('critical')}
                    >
                        Critical
                    </button>
                </div>
            </div>

            <div className={styles.list}>
                <AnimatePresence initial={false}>
                    {filteredAlerts.length > 0 ? (
                        filteredAlerts.map((alert) => (
                            <motion.div
                                key={alert.id}
                                className={`${styles.alertItem} ${styles[alert.severity]} ${alert.isRead ? styles.read : ''}`}
                                onClick={() => markAsRead(alert.id)}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                layout
                            >
                                <div className={styles.alertIcon}>
                                    <i className={`fas ${getSeverityIcon(alert.severity)}`}></i>
                                </div>
                                <div className={styles.alertContent}>
                                    <div className={styles.alertHeader}>
                                        <span className={styles.source}>{alert.source || 'System'}</span>
                                        <span className={styles.time}>
                                            {new Date(alert.timestamp).toLocaleString()}
                                        </span>
                                    </div>
                                    <p className={styles.message}>{alert.message}</p>
                                </div>
                                {!alert.isRead && <div className={styles.unreadDot} />}
                            </motion.div>
                        ))
                    ) : (
                        <motion.div className={styles.emptyState} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                            <i className="fas fa-check-circle"></i>
                            <p>No alerts found</p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
