import styles from './Settings.module.css';
import { useState } from 'react';

function Settings() {
    const [activeTab, setActiveTab] = useState<'user' | 'system' | 'appearance' | 'integrations'>('user');
    const [theme, setTheme] = useState('light');
    const [notifications, setNotifications] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(true);

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>Settings</h1>
                <p className={styles.subtitle}>Manage your preferences and system configuration</p>
            </div>

            <div className={styles.content}>
                <div className={styles.tabs}>
                    <button
                        className={activeTab === 'user' ? styles.tabActive : styles.tab}
                        onClick={() => setActiveTab('user')}
                    >
                        <i className="fas fa-user"></i> User Settings
                    </button>
                    <button
                        className={activeTab === 'system' ? styles.tabActive : styles.tab}
                        onClick={() => setActiveTab('system')}
                    >
                        <i className="fas fa-cog"></i> System
                    </button>
                    <button
                        className={activeTab === 'appearance' ? styles.tabActive : styles.tab}
                        onClick={() => setActiveTab('appearance')}
                    >
                        <i className="fas fa-palette"></i> Appearance
                    </button>
                    <button
                        className={activeTab === 'integrations' ? styles.tabActive : styles.tab}
                        onClick={() => setActiveTab('integrations')}
                    >
                        <i className="fas fa-plug"></i> Integrations
                    </button>
                </div>

                <div className={styles.panel}>
                    {activeTab === 'user' && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>User Profile</h2>
                            <div className={styles.formGroup}>
                                <label>Full Name</label>
                                <input type="text" defaultValue="Admin User" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Email</label>
                                <input type="email" defaultValue="admin@evaratech.com" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Role</label>
                                <input type="text" defaultValue="Administrator" disabled />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.checkbox}>
                                    <input
                                        type="checkbox"
                                        checked={notifications}
                                        onChange={(e) => setNotifications(e.target.checked)}
                                    />
                                    <span>Enable notifications</span>
                                </label>
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.checkbox}>
                                    <input
                                        type="checkbox"
                                        checked={emailAlerts}
                                        onChange={(e) => setEmailAlerts(e.target.checked)}
                                    />
                                    <span>Email alerts for critical events</span>
                                </label>
                            </div>
                            <button className={styles.saveBtn}>Save Changes</button>
                        </div>
                    )}

                    {activeTab === 'system' && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>System Configuration</h2>
                            <div className={styles.formGroup}>
                                <label>Data Retention (days)</label>
                                <input type="number" defaultValue="90" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Backup Frequency</label>
                                <select>
                                    <option>Daily</option>
                                    <option>Weekly</option>
                                    <option>Monthly</option>
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Alert Threshold (%)</label>
                                <input type="number" defaultValue="80" />
                            </div>
                            <button className={styles.saveBtn}>Save Changes</button>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Appearance</h2>
                            <div className={styles.formGroup}>
                                <label>Theme</label>
                                <div className={styles.themeOptions}>
                                    <button
                                        className={theme === 'light' ? styles.themeActive : styles.themeBtn}
                                        onClick={() => setTheme('light')}
                                    >
                                        <i className="fas fa-sun"></i> Light
                                    </button>
                                    <button
                                        className={theme === 'dark' ? styles.themeActive : styles.themeBtn}
                                        onClick={() => setTheme('dark')}
                                    >
                                        <i className="fas fa-moon"></i> Dark
                                    </button>
                                    <button
                                        className={theme === 'auto' ? styles.themeActive : styles.themeBtn}
                                        onClick={() => setTheme('auto')}
                                    >
                                        <i className="fas fa-adjust"></i> Auto
                                    </button>
                                </div>
                            </div>
                            <div className={styles.formGroup}>
                                <label>Primary Color</label>
                                <input type="color" defaultValue="#0077b6" />
                            </div>
                            <button className={styles.saveBtn}>Save Changes</button>
                        </div>
                    )}

                    {activeTab === 'integrations' && (
                        <div className={styles.section}>
                            <h2 className={styles.sectionTitle}>Integrations</h2>
                            <div className={styles.formGroup}>
                                <label>Supabase URL</label>
                                <input type="text" defaultValue="https://your-project.supabase.co" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Supabase Anon Key</label>
                                <input type="password" defaultValue="••••••••••••••••" />
                            </div>
                            <div className={styles.formGroup}>
                                <label>ThingSpeak API Key</label>
                                <input type="password" defaultValue="••••••••••••••••" />
                            </div>
                            <button className={styles.saveBtn}>Save Changes</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Settings;
