import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
    Home,
    LayoutDashboard,
    Cpu,
    ShieldCheck,
    Bell,
    UserCircle,
    Menu,
    Activity,
    Info,
} from 'lucide-react';

import { useAuthStore } from '../../../store/authStore';
import { useAlertStore, Alert } from '../../../store/alertStore';
import styles from './Header.module.css';

import { useUIStore } from '../../../store/uiStore';
import { GlassMenu, GlassMenuItem, GlassMenuSection } from '../../ui/GlassMenu/GlassMenu';

function Header() {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuthStore();
    const { alerts, unreadCount, markAsRead }: { alerts: Alert[], unreadCount: number, markAsRead: (id: string) => void } = useAlertStore();

    // Global UI State
    const { activePanel, setActivePanel } = useUIStore();
    const showNotifications = activePanel === 'notifications';
    const showUserMenu = activePanel === 'userMenu';

    // Mouse Tracking for Liquid Glass Effect
    const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
        e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
    };

    const isActive = (path: string) => {
        if (path === '/' || path === '/map') {
            return (location.pathname === '/' || location.pathname === '/map') ? styles.active : '';
        }
        return location.pathname === path ? styles.active : '';
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'critical': return { icon: <Info size={16} color="#dc2626" />, color: '#dc2626' };
            case 'warning': return { icon: <Info size={16} color="#d97706" />, color: '#d97706' };
            case 'success': return { icon: <Info size={16} color="#16a34a" />, color: '#16a34a' };
            default: return { icon: <Info size={16} color="#0284c7" />, color: '#0284c7' };
        }
    };

    return (
        <motion.header
            className={styles.header}
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 120, damping: 20, delay: 0.2 }}
            onMouseMove={handleMouseMove}
        >
            <div className={styles.container}>
                {/* Logo */}
                <Link to="/" className={styles.brand}>
                    <img
                        src="/evaratech-logo-v2.png"
                        alt="EvaraTech Logo"
                        className={styles.logoImg}
                    />
                    <img
                        src="/evaratech-text-logo.png"
                        alt="EvaraTech Name"
                        className={styles.textLogo}
                    />
                </Link>

                {/* Navigation Menu */}
                <nav className={styles.nav}>
                    <Link to="/" className={`${styles.navLink} ${isActive('/')}`}>
                        <Home size={18} strokeWidth={2} />
                        {t('nav.home')}
                    </Link>
                    <Link to="/dashboard" className={`${styles.navLink} ${isActive('/dashboard')}`}>
                        <LayoutDashboard size={18} strokeWidth={2} />
                        {t('nav.dashboard')}
                    </Link>
                    <Link to="/nodes" className={`${styles.navLink} ${isActive('/nodes')}`}>
                        <Cpu size={18} strokeWidth={2} />
                        {t('nav.allNodes') || 'All Nodes'}
                    </Link>
                    <Link to="/users" className={`${styles.navLink} ${isActive('/users')}`}>
                        <ShieldCheck size={18} strokeWidth={2} />
                        {t('nav.admin')}
                    </Link>
                    {(user?.role === 'COMMAND' || user?.role === 'SUPER_ADMIN') && (
                        <Link to="/admin" className={`${styles.navLink} ${isActive('/admin')}`}>
                            <Activity size={18} strokeWidth={2} />
                            Command
                        </Link>
                    )}
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
                            <Bell size={20} />
                            {unreadCount > 0 && <span className={styles.badge}>{unreadCount}</span>}
                        </motion.button>

                        <AnimatePresence>
                            {showNotifications && (
                                <GlassMenu
                                    title="Notifications"
                                    onClose={() => setActivePanel('none')}
                                    className={styles.dropdown}
                                >
                                    <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                        {alerts.slice(0, 5).map(alert => {
                                            const { color } = getSeverityIcon(alert.severity);
                                            return (
                                                <GlassMenuItem
                                                    key={alert.id}
                                                    icon={undefined} // handled by custom element in text if needed, or update GlassMenu to accept nodes
                                                    // Since GlassMenu expects string icon, we might need to adjust it later.
                                                    // For now, passing null/undefined to avoid FA string errors.
                                                    // Ideally GlassMenu should accept ReactNode for icon.
                                                    badgeColor={color}
                                                    text={alert.message}
                                                    description={new Date(alert.timestamp).toLocaleTimeString()}
                                                    onClick={() => {
                                                        markAsRead(alert.id);
                                                        navigate('/notifications');
                                                        setActivePanel('none');
                                                    }}
                                                />
                                            );
                                        })}
                                        {alerts.length === 0 && (
                                            <div style={{ padding: '20px', textAlign: 'center', opacity: 0.7 }}>
                                                No notifications
                                            </div>
                                        )}
                                    </div>
                                    <GlassMenuItem
                                        text="View All Notifications"
                                        icon="fas fa-arrow-right" // Keeping FA here for now if GlassMenuItem strictly needs string
                                        onClick={() => {
                                            navigate('/notifications');
                                            setActivePanel('none');
                                        }}
                                    />
                                </GlassMenu>
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
                            <UserCircle size={22} />
                        </motion.button>

                        <AnimatePresence>
                            {showUserMenu && (
                                <GlassMenu
                                    title="User Menu"
                                    onClose={() => setActivePanel('none')}
                                >
                                    <GlassMenuSection title="Account" />
                                    <GlassMenuItem
                                        text={user?.name || 'Admin User'}
                                        description={user?.email || 'admin@evaratech.com'}
                                        badgeColor="#4f46e5"
                                        badgeText={user?.name?.[0] || 'A'}
                                        onClick={() => { }}
                                    />

                                    <GlassMenuSection title="Navigation" />
                                    <GlassMenuItem icon="fas fa-user-circle" text="Profile" onClick={() => { navigate('/profile'); setActivePanel('none'); }} />
                                    <GlassMenuItem icon="fas fa-signal" text={t('nav.status')} onClick={() => { navigate('/status'); setActivePanel('none'); }} />
                                    <GlassMenuItem icon="fas fa-file-alt" text={t('nav.reports')} onClick={() => { navigate('/reports'); setActivePanel('none'); }} />
                                    <GlassMenuItem icon="fas fa-cog" text={t('nav.settings')} onClick={() => { navigate('/settings'); setActivePanel('none'); }} />

                                    <GlassMenuSection title="System" />
                                    <GlassMenuItem icon="fas fa-info-circle" text={t('nav.about')} onClick={() => { window.open('http://evaratech.com', '_blank'); setActivePanel('none'); }} />
                                    <GlassMenuItem
                                        icon="fas fa-sign-out-alt"
                                        text="Logout"
                                        onClick={() => {
                                            logout();
                                            setActivePanel('none');
                                        }}
                                        badgeColor="#ef4444"
                                    />
                                </GlassMenu>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* More Menu (3-dots) */}
                    <div className={styles.iconWrapper}>
                        <motion.button
                            className={styles.mobileMenuBtn}
                            onClick={() => setActivePanel('more')}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="More"
                        >
                            <Menu size={20} />
                        </motion.button>

                        <AnimatePresence>
                            {activePanel === 'more' && (
                                <GlassMenu
                                    title="Quick Access"
                                    onClose={() => setActivePanel('none')}
                                >
                                    <GlassMenuSection title="Shortcuts" />
                                    <GlassMenuItem icon="fas fa-signal" text={t('nav.status')} onClick={() => { navigate('/status'); setActivePanel('none'); }} />
                                    <GlassMenuItem icon="fas fa-file-alt" text={t('nav.reports')} onClick={() => { navigate('/reports'); setActivePanel('none'); }} />
                                    <GlassMenuItem icon="fas fa-history" text="Audit Logs" onClick={() => { navigate('/audit'); setActivePanel('none'); }} />
                                    <GlassMenuItem icon="fas fa-info-circle" text={t('nav.about')} onClick={() => { window.open('http://evaratech.com', '_blank'); setActivePanel('none'); }} />
                                </GlassMenu>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}

export default Header;
