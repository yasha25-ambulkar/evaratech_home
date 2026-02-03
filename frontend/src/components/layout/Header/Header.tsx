import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

import { useAuthStore } from '../../../store/authStore';
import styles from './Header.module.css';

function Header() {
    const location = useLocation();
    // Theme toggle removed

    const { logout, user } = useAuthStore();
    const [showNotifications, setShowNotifications] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);

    const isActive = (path: string) => {
        if (path === '/' || path === '/map') {
            return (location.pathname === '/' || location.pathname === '/map') ? styles.active : '';
        }
        return location.pathname === path ? styles.active : '';
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                {/* Logo */}
                <Link to="/" className={styles.brand}>
                    <img
                        src="/evaratech-logo.png"
                        alt="EvaraTech Logo"
                        className={styles.logoImg}
                    />
                </Link>

                {/* Navigation Menu */}
                <nav className={styles.nav}>
                    <Link to="/" className={`${styles.navLink} ${isActive('/')}`}>
                        <i className="fas fa-home"></i>
                        Home
                    </Link>
                    <Link to="/dashboard" className={`${styles.navLink} ${isActive('/dashboard')}`}>
                        Dashboard
                    </Link>
                    <Link to="/nodes" className={`${styles.navLink} ${isActive('/nodes')}`}>
                        All Nodes
                    </Link>
                    <Link to="/status" className={`${styles.navLink} ${isActive('/status')}`}>
                        Status
                    </Link>
                    <Link to="/reports" className={`${styles.navLink} ${isActive('/reports')}`}>
                        Reports
                    </Link>
                </nav>

                {/* Search Bar */}
                <div className={styles.searchBar}>
                    <i className="fas fa-search"></i>
                    <input
                        type="text"
                        placeholder="Search sensors, stations, reports..."
                        className={styles.searchInput}
                    />
                </div>

                {/* Right Side Actions */}
                <div className={styles.actions}>

                    {/* Notifications */}
                    <div className={styles.iconWrapper}>
                        <button
                            className={styles.iconBtn}
                            onClick={() => setShowNotifications(!showNotifications)}
                            title="Notifications"
                        >
                            <i className="fas fa-bell"></i>
                            <span className={styles.badge}>3</span>
                        </button>

                        {showNotifications && (
                            <div className={styles.dropdown}>
                                <div className={styles.dropdownHeader}>
                                    <h3>Notifications</h3>
                                    <button className={styles.closeBtn} onClick={() => setShowNotifications(false)}>×</button>
                                </div>
                                <div className={styles.notificationList}>
                                    <div className={styles.notificationItem}>
                                        <i className="fas fa-exclamation-triangle" style={{ color: '#ffd60a' }}></i>
                                        <div>
                                            <p className={styles.notificationTitle}>High Water Usage</p>
                                            <p className={styles.notificationTime}>5 minutes ago</p>
                                        </div>
                                    </div>
                                    <div className={styles.notificationItem}>
                                        <i className="fas fa-info-circle" style={{ color: '#4361ee' }}></i>
                                        <div>
                                            <p className={styles.notificationTitle}>System Update Available</p>
                                            <p className={styles.notificationTime}>1 hour ago</p>
                                        </div>
                                    </div>
                                    <div className={styles.notificationItem}>
                                        <i className="fas fa-check-circle" style={{ color: '#06d6a0' }}></i>
                                        <div>
                                            <p className={styles.notificationTitle}>Maintenance Completed</p>
                                            <p className={styles.notificationTime}>2 hours ago</p>
                                        </div>
                                    </div>
                                </div>
                                <Link to="/notifications" className={styles.viewAll} onClick={() => setShowNotifications(false)}>
                                    View All Notifications
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* User Profile */}
                    <div className={styles.iconWrapper}>
                        <button
                            className={styles.iconBtn}
                            onClick={() => setShowUserMenu(!showUserMenu)}
                            title="User Menu"
                        >
                            <i className="fas fa-user-circle"></i>
                        </button>

                        {showUserMenu && (
                            <div className={styles.dropdown}>
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
                                <Link to="/profile" className={styles.menuItem} onClick={() => setShowUserMenu(false)}>
                                    <i className="fas fa-user"></i> Profile
                                </Link>
                                <Link to="/settings" className={styles.menuItem} onClick={() => setShowUserMenu(false)}>
                                    <i className="fas fa-cog"></i> Settings
                                </Link>
                                <div className={styles.divider}></div>
                                <button className={styles.menuItem} onClick={() => {
                                    logout();
                                    setShowUserMenu(false);
                                }}>
                                    <i className="fas fa-sign-out-alt"></i> Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Toggle */}
                <button className={styles.mobileMenuBtn}>
                    <i className="fas fa-bars"></i>
                </button>
            </div>
        </header>
    );
}

export default Header;
