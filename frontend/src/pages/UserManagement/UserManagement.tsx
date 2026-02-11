import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './UserManagement.module.css';

interface UserData {
    id: string;
    name: string;
    email: string;
    role: 'COMMAND' | 'SUPER_ADMIN' | 'ADMIN' | 'DISTRIBUTOR' | 'CUSTOMER';
    status: 'active' | 'inactive';
    lastActive: string;
    avatar: string;
    description?: string;
}

const MOCK_USERS: UserData[] = [
    {
        id: '1',
        name: 'Command Terminal',
        email: 'command@evaratech.com',
        role: 'COMMAND',
        status: 'active',
        lastActive: 'Just now',
        avatar: 'https://ui-avatars.com/api/?name=Command&background=0ea5e9&color=fff',
        description: "Evaratech internal command authority - Full system access."
    },
    {
        id: '2',
        name: 'Regional SuperAdmin',
        email: 'superadmin@evaratech.com',
        role: 'SUPER_ADMIN',
        status: 'active',
        lastActive: '2 hours ago',
        avatar: 'https://ui-avatars.com/api/?name=Super&background=8b5cf6&color=fff',
        description: "Governance & Regional oversight."
    },
    {
        id: '3',
        name: 'Distributor Primary',
        email: 'distributor@evaratech.com',
        role: 'DISTRIBUTOR',
        status: 'active',
        lastActive: '5 hours ago',
        avatar: 'https://ui-avatars.com/api/?name=Dist&background=10b981&color=fff',
        description: "Product distributor & deployment partners."
    }
];

export default function UserManagement() {
    const [users, setUsers] = useState<UserData[]>(MOCK_USERS);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Filter users
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u.id !== id));
        }
    };

    const handleEdit = (user: UserData) => {
        setSelectedUser(user);
        setIsEditModalOpen(true);
    };

    const getRoleBadgeClass = (role: string) => {
        switch (role) {
            case 'COMMAND': return styles.commandBadge;
            case 'SUPER_ADMIN': return styles.superAdminBadge;
            case 'ADMIN': return styles.adminBadge;
            case 'DISTRIBUTOR': return styles.distributorBadge;
            default: return styles.customerBadge;
        }
    };

    const getRoleLabel = (role: string) => {
        switch (role) {
            case 'COMMAND': return 'COMMAND (INTERNAL)';
            case 'SUPER_ADMIN': return 'SUPER ADMIN (REGIONAL)';
            case 'ADMIN': return 'ADMIN';
            case 'DISTRIBUTOR': return 'DISTRIBUTOR';
            case 'CUSTOMER': return 'CUSTOMER';
            default: return role;
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <div className={styles.header}>
                    <div className={styles.titleInfo}>
                        <h2><i className="fas fa-users-cog"></i> User Management</h2>
                        <p>Manage system access and permissions</p>
                    </div>
                    <button className={styles.addBtn} onClick={() => alert('Add User feature would open a form here')}>
                        <i className="fas fa-plus"></i> Add User
                    </button>
                </div>

                <div className={styles.controls}>
                    <div className={styles.searchBar}>
                        <i className="fas fa-search"></i>
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className={styles.tableContainer}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Role</th>
                                <th>Access Scope</th>
                                <th>Status</th>
                                <th>Last Active</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <AnimatePresence>
                                {filteredUsers.map((user) => (
                                    <motion.tr
                                        key={user.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        layout
                                    >
                                        <td>
                                            <div className={styles.userInfo}>
                                                <img src={user.avatar} alt={user.name} className={styles.avatar} />
                                                <div>
                                                    <div className={styles.userName}>{user.name}</div>
                                                    <div className={styles.userEmail}>{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.roleContainer}>
                                                <span className={`${styles.badge} ${getRoleBadgeClass(user.role)}`}>
                                                    {getRoleLabel(user.role)}
                                                </span>
                                                {user.role === 'COMMAND' && (
                                                    <span className={styles.systemAuthorityBadge} title="Full Internal Command Authority">
                                                        <i className="fas fa-crown"></i>
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <div className={styles.accessScope}>
                                                {user.role === 'COMMAND' ? 'Full Authority' :
                                                    user.role === 'SUPER_ADMIN' ? 'Regional Oversight' :
                                                        user.role === 'DISTRIBUTOR' ? 'Operational Access' : 'Device-Specific'}
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`${styles.statusDot} ${user.status === 'active' ? styles.active : styles.inactive}`}></span>
                                            {user.status}
                                        </td>
                                        <td>{user.lastActive}</td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button className={styles.iconBtn} onClick={() => handleEdit(user)} title="Edit">
                                                    <i className="fas fa-pen"></i>
                                                </button>
                                                <button className={`${styles.iconBtn} ${styles.danger}`} onClick={() => handleDelete(user.id)} title="Delete">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal (Simplified) */}
            <AnimatePresence>
                {isEditModalOpen && selectedUser && (
                    <motion.div
                        className={styles.modalOverlay}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className={styles.modal}
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                        >
                            <h3>Edit User</h3>
                            <div className={styles.formGroup}>
                                <label>Name</label>
                                <input type="text" defaultValue={selectedUser.name} />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Role</label>
                                <select defaultValue={selectedUser.role}>
                                    <option value="COMMAND">Command (Internal)</option>
                                    <option value="SUPER_ADMIN">SuperAdmin (Regional)</option>
                                    <option value="DISTRIBUTOR">Distributor</option>
                                    <option value="CUSTOMER">Customer</option>
                                </select>
                            </div>

                            <div className={styles.authorityNotice}>
                                <div className={styles.authorityLabel}>Governance & System Authority</div>
                                <p className={styles.authorityDescription}>
                                    {selectedUser.role === 'COMMAND'
                                        ? "Evaratech internal command authority - Full system access across all users, devices, and deployments."
                                        : (selectedUser.role === 'SUPER_ADMIN')
                                            ? "Regional governance & oversight authority."
                                            : (selectedUser.role === 'DISTRIBUTOR')
                                                ? "Product distributor & deployment partners."
                                                : "End consumer or organization - Device-specific access."
                                    }
                                </p>

                                {selectedUser.role === 'COMMAND' && (
                                    <div className={styles.capabilitiesGrid}>
                                        <div className={styles.capabilitySection}>
                                            <div className={styles.sectionTitle}>Global Management</div>
                                            <ul>
                                                <li>Create/Suspend Distributors & Customers</li>
                                                <li>Device Provisioning & Lifecycle Management</li>
                                                <li>Cross-City Resource Allocation</li>
                                            </ul>
                                        </div>
                                        <div className={styles.capabilitySection}>
                                            <div className={styles.sectionTitle}>System Configuration</div>
                                            <ul>
                                                <li>Alert Thresholds & Sampling Intervals</li>
                                                <li>Firmware Update Policies & Control</li>
                                                <li>System-Wide Health Analytics</li>
                                            </ul>
                                        </div>
                                        <div className={styles.capabilitySection}>
                                            <div className={styles.sectionTitle}>Command Visibility</div>
                                            <ul>
                                                <li>Full Login & Connectivity Logs</li>
                                                <li>Deployment-Wise Statistics</li>
                                                <li>Audit History Across All Locations</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {selectedUser.role === 'DISTRIBUTOR' && (
                                    <div className={styles.capabilitiesGrid}>
                                        <div className={styles.capabilitySection}>
                                            <div className={styles.sectionTitle}>Partner Operations</div>
                                            <ul>
                                                <li>Add/Manage Customers & Techs</li>
                                                <li>Manage Deployment Locations</li>
                                                <li>Track Installation Status</li>
                                            </ul>
                                        </div>
                                        <div className={styles.capabilitySection}>
                                            <div className={styles.sectionTitle}>Device Management</div>
                                            <ul>
                                                <li>QR/ID Device Registration</li>
                                                <li>Assign Devices to Customers</li>
                                                <li>Real-time Abnormal Alerts</li>
                                            </ul>
                                        </div>
                                        <div className={styles.capabilitySection}>
                                            <div className={styles.sectionTitle}>Analytics & Reporting</div>
                                            <ul>
                                                <li>Performance Tracking (Fleet)</li>
                                                <li>Generate Client Export Reports</li>
                                                <li>Operational Alert Governance</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {selectedUser.role === 'CUSTOMER' && (
                                    <div className={styles.capabilitiesGrid}>
                                        <div className={styles.capabilitySection}>
                                            <div className={styles.sectionTitle}>My Monitoring</div>
                                            <ul>
                                                <li>Real-time Water Levels</li>
                                                <li>View All Registered Devices</li>
                                                <li>Historical Usage Trends</li>
                                            </ul>
                                        </div>
                                        <div className={styles.capabilitySection}>
                                            <div className={styles.sectionTitle}>Alerts & Notifications</div>
                                            <ul>
                                                <li>Leakage Detection Alerts</li>
                                                <li>Low Water Level Warnings</li>
                                                <li>Abnormal Consumption Notices</li>
                                            </ul>
                                        </div>
                                        <div className={styles.capabilitySection}>
                                            <div className={styles.sectionTitle}>Account Access</div>
                                            <ul>
                                                <li>Mobile/Email Login Support</li>
                                                <li>Download PDF/Excel Reports</li>
                                                <li>Personal Consumption Analytics</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {selectedUser.role === 'COMMAND' && (
                                    <div className={styles.fullAccessBadge}>
                                        <i className="fas fa-shield-alt"></i> UNRESTRICTED COMMAND AUTHORITY
                                    </div>
                                )}

                                {selectedUser.role === 'DISTRIBUTOR' && (
                                    <div className={styles.partnerAccessBadge}>
                                        <i className="fas fa-handshake"></i> LIMITED OPERATIONAL ACCESS
                                    </div>
                                )}

                                {selectedUser.role === 'CUSTOMER' && (
                                    <div className={styles.customerAccessBadge}>
                                        <i className="fas fa-house-user"></i> DEVICE-SPECIFIC ACCESS
                                    </div>
                                )}
                            </div>
                            <div className={styles.modalActions}>
                                <button className={styles.cancelBtn} onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                                <button className={styles.saveBtn} onClick={() => setIsEditModalOpen(false)}>Save Changes</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
