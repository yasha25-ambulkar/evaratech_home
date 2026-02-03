import type { Alert } from '../../../types/evaratech.types';
import styles from './AlertPanel.module.css';

// Mock alerts for now
const MOCK_ALERTS: Alert[] = [
    {
        id: '1',
        nodeId: 'pump-house-2',
        nodeName: 'Pump House 2',
        type: 'pump-issue',
        severity: 'critical',
        message: 'Pump running but zero flow detected',
        timestamp: new Date(Date.now() - 15 * 60000), // 15 mins ago
        acknowledged: false,
    },
    {
        id: '2',
        nodeId: 'bakul-oht',
        nodeName: 'Bakul OHT',
        type: 'low-water',
        severity: 'high',
        message: 'Water level below 20% (18%)',
        timestamp: new Date(Date.now() - 45 * 60000),
        acknowledged: false,
    },
    {
        id: '3',
        nodeId: 'sump-s4',
        nodeName: 'Sump S4 (Main)',
        type: 'maintenance-due',
        severity: 'medium',
        message: 'Routine maintenance scheduled for tomorrow',
        timestamp: new Date(Date.now() - 120 * 60000),
        acknowledged: true,
    },
];

function AlertPanel() {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3 className={styles.title}>System Alerts</h3>
                <span className={styles.badge}>{MOCK_ALERTS.filter(a => !a.acknowledged).length} Active</span>
            </div>

            <div className={styles.list}>
                {MOCK_ALERTS.map((alert) => (
                    <div key={alert.id} className={`${styles.alertItem} ${styles[alert.severity]}`}>
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

                        <div className={styles.actions}>
                            {!alert.acknowledged && (
                                <button className={styles.ackBtn}>Ack</button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AlertPanel;
