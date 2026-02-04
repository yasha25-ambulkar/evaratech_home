import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './AuditLog.module.css';

interface LogEntry {
    id: string;
    action: string;
    user: string;
    target: string;
    timestamp: string;
    details: string;
    status: 'success' | 'failure';
}

const MOCK_LOGS: LogEntry[] = [
    {
        id: '1',
        action: 'User Login',
        user: 'Test User',
        target: 'System',
        timestamp: '2023-10-25 09:30:15',
        details: 'Successful login active session',
        status: 'success'
    },
    {
        id: '2',
        action: 'Update Asset',
        user: 'Sarah Engineer',
        target: 'Pump House 1',
        timestamp: '2023-10-25 10:15:22',
        details: 'Changed status to Maintenance',
        status: 'success'
    },
    {
        id: '3',
        action: 'Delete User',
        user: 'Test User',
        target: 'John Doe',
        timestamp: '2023-10-24 16:45:00',
        details: 'Removed user account',
        status: 'success'
    },
    {
        id: '4',
        action: 'Failed Login',
        user: 'Unknown',
        target: 'System',
        timestamp: '2023-10-24 14:20:11',
        details: 'Invalid password attempt',
        status: 'failure'
    }
];

export default function AuditLog() {
    const [logs] = useState<LogEntry[]>(MOCK_LOGS);
    const [filter, setFilter] = useState('');

    const filteredLogs = logs.filter(log =>
        log.action.toLowerCase().includes(filter.toLowerCase()) ||
        log.user.toLowerCase().includes(filter.toLowerCase()) ||
        log.target.toLowerCase().includes(filter.toLowerCase())
    );

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleInfo}>
                    <h2><i className="fas fa-history"></i> Audit Log</h2>
                    <p>Track system activities and security events</p>
                </div>
                <button className={styles.exportBtn}>
                    <i className="fas fa-download"></i> Export CSV
                </button>
            </div>

            <div className={styles.controls}>
                <div className={styles.searchBar}>
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder="Search logs..."
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                    />
                </div>
            </div>

            <div className={styles.tableContainer}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Action</th>
                            <th>User</th>
                            <th>Target</th>
                            <th>Details</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <AnimatePresence>
                            {filteredLogs.map((log) => (
                                <motion.tr
                                    key={log.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    layout
                                >
                                    <td className={styles.timestamp}>{log.timestamp}</td>
                                    <td className={styles.action}>{log.action}</td>
                                    <td className={styles.user}>
                                        <i className="fas fa-user-circle"></i> {log.user}
                                    </td>
                                    <td className={styles.target}>{log.target}</td>
                                    <td className={styles.details}>{log.details}</td>
                                    <td>
                                        <span className={`${styles.statusBadge} ${log.status === 'success' ? styles.success : styles.failure}`}>
                                            {log.status.toUpperCase()}
                                        </span>
                                    </td>
                                </motion.tr>
                            ))}
                        </AnimatePresence>
                    </tbody>
                </table>
            </div>
        </div>
    );
}
