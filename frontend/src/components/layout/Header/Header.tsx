import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next'; // Import useTranslation

import { useAuthStore } from '../../../store/authStore';
import { useAlertStore } from '../../../store/alertStore';
// import GlobalSearch from '../../search/GlobalSearch/GlobalSearch';
import styles from './Header.module.css';

import { useUIStore } from '../../../store/uiStore';

function Header() {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const { logout, user } = useAuthStore();
    const { alerts, unreadCount, markAsRead } = useAlertStore();

    // Global UI State
    const { activePanel, setActivePanel } = useUIStore();
    const showNotifications = activePanel === 'notifications';
    const showUserMenu = activePanel === 'userMenu';

    const changeLanguage = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    const isActive = (path: string) => {
        if (path === '/' || path === '/map') {
            return (location.pathname === '/' || location.pathname === '/map') ? styles.active : '';
        }
        return location.pathname === path ? styles.active : '';
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'critical': return { icon: 'fa-exclamation-circle', color: '#dc2626' };
            case 'warning': return { icon: 'fa-exclamation-triangle', color: '#d97706' };
            case 'success': return { icon: 'fa-check-circle', color: '#16a34a' };
            default: return { icon: 'fa-info-circle', color: '#0284c7' };
        }
    };

    return (
        <motion.header
            className={styles.header}
            initial={{ y: -100, x: '-50%', opacity: 0 }}
            animate={{ y: 12, x: '-50%', opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.5 }}
        >
            <div className={styles.container}>
                {/* Logo */}
                <Link to="/" className={styles.brand}>
                    <img
                        src="/evaratech-logo-new.png"
                        alt="EvaraTech Logo"
                        className={styles.logoImg}
                    />
                </Link>

                {/* Navigation Menu */}
                <nav className={styles.nav}>
                    <Link to="/" className={`${styles.navLink} ${isActive('/')}`}>
                        <i className="fas fa-home"></i>
                        {t('nav.home')}
                    </Link>
                    <Link to="/dashboard" className={`${styles.navLink} ${isActive('/dashboard')}`}>
                        <i className="fas fa-chart-pie"></i>
                        {t('nav.dashboard')}
                    </Link>
                    <Link to="/nodes" className={`${styles.navLink} ${isActive('/nodes')}`}>
                        <i className="fas fa-microchip"></i>
                        {t('nav.allNodes') || 'All Nodes'}
                    </Link>
                    <Link to="/users" className={`${styles.navLink} ${isActive('/users')}`}>
                        <i className="fas fa-user-shield"></i>
                        {t('nav.admin')}
                    </Link>
                </nav>

                {/* Right Side Actions */}
                <div className={styles.actions}>

                    {/* Notifications */}
                    <div className={styles.iconWrapper}>
                        <motion.button
                            className={styles.iconBtn}
                            onClick={() => setActivePanel('notifications')}
                            title="Notifications"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <i className="fas fa-bell"></i>
                            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
                        </motion.button>

                        <AnimatePresence>
                            {showNotifications && (
                                <motion.div
                                    className={styles.dropdown}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className={styles.dropdownHeader}>
                                        <h3>Notifications</h3>
                                        <button className={styles.closeBtn} onClick={() => setActivePanel('none')}>×</button>
                                    </div>
                                    <div className={styles.notificationList}>
                                        {alerts.slice(0, 5).map(alert => {
                                            const { icon, color } = getSeverityIcon(alert.severity);
                                            return (
                                                <Link
                                                    key={alert.id}
                                                    to="/notifications"
                                                    className={styles.notificationItem}
                                                    onClick={() => {
                                                        markAsRead(alert.id);
                                                        setActivePanel('none');
                                                    }}
                                                    style={{ opacity: alert.isRead ? 0.6 : 1 }}
                                                >
                                                    <i className={`fas ${icon}`} style={{ color }}></i>
                                                    <div>
                                                        <p className={styles.notificationTitle}>{alert.message}</p>
                                                        <p className={styles.notificationTime}>
                                                            {new Date(alert.timestamp).toLocaleTimeString()}
                                                        </p>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                        {alerts.length === 0 && (
                                            <div className={styles.emptyNav}>
                                                No notifications
                                            </div>
                                        )}
                                    </div>
                                    <Link to="/notifications" className={styles.viewAll} onClick={() => setActivePanel('none')}>
                                        View All Notifications
                                    </Link>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* User Profile */}
                    <div className={styles.iconWrapper}>
                        <motion.button
                            className={styles.iconBtn}
                            onClick={() => setActivePanel('userMenu')}
                            title="User Menu"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <i className="fas fa-user-circle"></i>
                        </motion.button>

                        <AnimatePresence>
                            {showUserMenu && (
                                <motion.div
                                    className={styles.dropdown}
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <div className={styles.userInfo}>
                                        <div className={styles.avatar}>
                                            <i className="fas fa-user"></i>
                                        </div>
                                        <div>
                                            <p className={styles.userName}>{user?.name || 'Admin User'}</p>
                                            <p className={styles.userEmail}>{user?.email || 'admin@evaratech.com'}</p>
                                        </div>
                                    </div>
                                    <div className={styles.divider}></div>
                                    <Link to="/profile" className={styles.menuItem} onClick={() => setActivePanel('none')}>
                                        <i className="fas fa-user-circle"></i> Profile
                                    </Link>
                                    <Link to="/status" className={styles.menuItem} onClick={() => setActivePanel('none')}>
                                        <i className="fas fa-signal"></i> {t('nav.status')}
                                    </Link>
                                    <Link to="/reports" className={styles.menuItem} onClick={() => setActivePanel('none')}>
                                        <i className="fas fa-file-alt"></i> {t('nav.reports')}
                                    </Link>
                                    <Link to="/about" className={styles.menuItem} onClick={() => setActivePanel('none')}>
                                        <i className="fas fa-info-circle"></i> {t('nav.about')}
                                    </Link>
                                    <Link to="/settings" className={styles.menuItem} onClick={() => setActivePanel('none')}>
                                        <i className="fas fa-cog"></i> {t('nav.settings')}
                                    </Link>
                                    <div className={styles.divider}></div>
                                    <div className={styles.langSwitch}>
                                        <button onClick={() => changeLanguage('en')} className={`${styles.langBtn} ${i18n.language === 'en' ? styles.activeLang : ''}`}>English</button>
                                        <button onClick={() => changeLanguage('hi')} className={`${styles.langBtn} ${i18n.language === 'hi' ? styles.activeLang : ''}`}>हिंदी</button>
                                    </div>
                                    <div className={styles.divider}></div>
                                    <button className={styles.menuItem} onClick={() => {
                                        logout();
                                        setActivePanel('none');
                                    }}>
                                        <i className="fas fa-sign-out-alt"></i> Logout
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* More Menu */}
                <div className={styles.iconWrapper}>
                    <motion.button
                        className={styles.mobileMenuBtn}
                        onClick={() => setActivePanel('more')}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        title="More"
                    >
                        <i className="fas fa-bars"></i>
                    </motion.button>

                    <AnimatePresence>
                        {activePanel === 'more' && (
                            <motion.div
                                className={styles.dropdown}
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className={styles.dropdownHeader}>
                                    <h3>Quick Access</h3>
                                    <button className={styles.closeBtn} onClick={() => setActivePanel('none')}>×</button>
                                </div>
                                <Link to="/status" className={styles.menuItem} onClick={() => setActivePanel('none')}>
                                    <i className="fas fa-signal"></i> {t('nav.status')}
                                </Link>
                                <Link to="/reports" className={styles.menuItem} onClick={() => setActivePanel('none')}>
                                    <i className="fas fa-file-alt"></i> {t('nav.reports')}
                                </Link>
                                <div className={styles.divider}></div>
                                <Link to="/about" className={styles.menuItem} onClick={() => setActivePanel('none')}>
                                    <i className="fas fa-info-circle"></i> {t('nav.about')}
                                </Link>
                                <Link to="/audit" className={styles.menuItem} onClick={() => setActivePanel('none')}>
                                    <i className="fas fa-history"></i> Audit Logs
                                </Link>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.header>
    );
}

export default Header;
