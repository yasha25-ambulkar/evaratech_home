import styles from './Notifications.module.css';
import { useState } from 'react';

interface Notification {
    id: string;
    type: 'info' | 'warning' | 'critical';
    title: string;
    message: string;
    time: string;
    read: boolean;
}

const mockNotifications: Notification[] = [
    { id: '1', type: 'warning', title: 'High Water Usage Detected', message: 'Tank OHT-3 showing unusual consumption patterns', time: '5 mins ago', read: false },
    { id: '2', type: 'critical', title: 'Pump Failure Alert', message: 'Pump House 2 has stopped responding', time: '15 mins ago', read: false },
    { id: '3', type: 'info', title: 'Maintenance Scheduled', message: 'Routine maintenance for Sump S4 tomorrow at 10 AM', time: '1 hour ago', read: false },
    { id: '4', type: 'info', title: 'System Update Complete', message: 'Dashboard updated to version 2.1.0', time: '2 hours ago', read: true },
    { id: '5', type: 'warning', title: 'Low Water Level', message: 'Sump S2 water level below threshold', time: '3 hours ago', read: true },
];

function Notifications() {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [filter, setFilter] = useState<'all' | 'info' | 'warning' | 'critical'>('all');

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'info': return '#4361ee';
            case 'warning': return '#ffd60a';
            case 'critical': return '#d62828';
            default: return '#6c757d';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'info': return 'fa-info-circle';
            case 'warning': return 'fa-exclamation-triangle';
            case 'critical': return 'fa-times-circle';
            default: return 'fa-bell';
        }
    };

    const markAsRead = (id: string) => {
        setNotifications(notifications.map(n =>
            n.id === id ? { ...n, read: true } : n
        ));
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };

    const deleteNotification = (id: string) => {
        setNotifications(notifications.filter(n => n.id !== id));
    };

    const filteredNotifications = notifications.filter(n =>
        filter === 'all' || n.type === filter
    );

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Notifications</h1>
                    <p className={styles.subtitle}>{unreadCount} unread notifications</p>
                </div>
                <button className={styles.markAllBtn} onClick={markAllAsRead}>
                    <i className="fas fa-check-double"></i> Mark All as Read
                </button>
            </div>

            <div className={styles.filters}>
                <button
                    className={filter === 'all' ? styles.filterActive : styles.filterBtn}
                    onClick={() => setFilter('all')}
                >
                    All ({notifications.length})
                </button>
                <button
                    className={filter === 'info' ? styles.filterActive : styles.filterBtn}
                    onClick={() => setFilter('info')}
                >
                    <i className="fas fa-info-circle"></i> Info
                </button>
                <button
                    className={filter === 'warning' ? styles.filterActive : styles.filterBtn}
                    onClick={() => setFilter('warning')}
                >
                    <i className="fas fa-exclamation-triangle"></i> Warning
                </button>
                <button
                    className={filter === 'critical' ? styles.filterActive : styles.filterBtn}
                    onClick={() => setFilter('critical')}
                >
                    <i className="fas fa-times-circle"></i> Critical
                </button>
            </div>

            <div className={styles.list}>
                {filteredNotifications.map((notification) => (
                    <div
                        key={notification.id}
                        className={`${styles.notification} ${!notification.read ? styles.unread : ''}`}
                    >
                        <div
                            className={styles.icon}
                            style={{ background: getTypeColor(notification.type) }}
                        >
                            <i className={`fas ${getTypeIcon(notification.type)}`}></i>
                        </div>

                        <div className={styles.content}>
                            <h3 className={styles.notificationTitle}>{notification.title}</h3>
                            <p className={styles.message}>{notification.message}</p>
                            <p className={styles.time}>
                                <i className="fas fa-clock"></i> {notification.time}
                            </p>
                        </div>

                        <div className={styles.actions}>
                            {!notification.read && (
                                <button
                                    className={styles.actionBtn}
                                    onClick={() => markAsRead(notification.id)}
                                    title="Mark as read"
                                >
                                    <i className="fas fa-check"></i>
                                </button>
                            )}
                            <button
                                className={styles.actionBtn}
                                onClick={() => deleteNotification(notification.id)}
                                title="Delete"
                            >
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {filteredNotifications.length === 0 && (
                <div className={styles.empty}>
                    <i className="fas fa-bell-slash"></i>
                    <p>No notifications</p>
                </div>
            )}
        </div>
    );
}

export default Notifications;
