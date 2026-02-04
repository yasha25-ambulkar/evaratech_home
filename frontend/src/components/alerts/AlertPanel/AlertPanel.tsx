import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlassCard from '../../ui/card/GlassCard';
import { useToast } from '../../../context/ToastContext';
import styles from './AlertPanel.module.css';

// Mock alerts
const INITIAL_ALERTS = [
    {
        id: '1',
        nodeId: 'pump-house-2',
        nodeName: 'Pump House 2',
        type: 'pump-issue',
        severity: 'critical',
        message: 'Pump running but zero flow detected',
        timestamp: new Date(Date.now() - 15 * 60000), // 15 mins ago
    },
    {
        id: '2',
        nodeId: 'bakul-oht',
        nodeName: 'Bakul OHT',
        type: 'low-water',
        severity: 'high',
        message: 'Water level below 20% (18%)',
        timestamp: new Date(Date.now() - 45 * 60000),
    },
    {
        id: '3',
        nodeId: 'sump-s4',
        nodeName: 'Sump S4 (Main)',
        type: 'maintenance-due',
        severity: 'medium',
        message: 'Routine maintenance scheduled for tomorrow',
        timestamp: new Date(Date.now() - 120 * 60000),
    },
];

export default function AlertPanel() {
    const [alerts, setAlerts] = useState(INITIAL_ALERTS);
    const { addToast } = useToast();

    const handleAck = (id: string) => {
        setAlerts(prev => prev.filter(a => a.id !== id));
        addToast('success', 'Alert acknowledged successfully');
    };

    return (
        <GlassCard className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>System Alerts</h3>
                <span className={styles.badge}>{alerts.length} Active</span>
            </div>

            <div className={styles.list}>
                <AnimatePresence mode="popLayout">
                    {alerts.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={styles.emptyState}
                        >
                            <i className="fas fa-check-circle"></i>
                            <p>All systems normal</p>
                        </motion.div>
                    ) : (
                        alerts.map((alert) => (
                            <motion.div
                                key={alert.id}
                                className={`${styles.alertItem} ${styles[alert.severity]}`}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                            >
                                <div className={styles.alertIcon}>
                                    {alert.severity === 'critical' && <i className="fas fa-exclamation-circle" />}
                                    {alert.severity === 'high' && <i className="fas fa-exclamation-triangle" />}
                                    {alert.severity === 'medium' && <i className="fas fa-info-circle" />}
                                </div>

                                <div className={styles.alertContent}>
                                    <div className={styles.alertHeader}>
                                        <span className={styles.nodeName}>{alert.nodeName}</span>
                                        <span className={styles.time}>
                                            {alert.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </span>
                                    </div>
                                    <p className={styles.message}>{alert.message}</p>
                                </div>

                                <button
                                    className={styles.ackBtn}
                                    onClick={() => handleAck(alert.id)}
                                    title="Acknowledge"
                                >
                                    <i className="fas fa-check"></i>
                                </button>
                            </motion.div>
                        ))
                    )}
                </AnimatePresence>
            </div>
        </GlassCard>
    );
}
