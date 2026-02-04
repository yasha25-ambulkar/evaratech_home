import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './UserManagement.module.css';

interface UserData {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'editor' | 'viewer';
    status: 'active' | 'inactive';
    lastActive: string;
    avatar: string;
}

const MOCK_USERS: UserData[] = [
    {
        id: '1',
        name: 'Test User',
        email: 'user@test.com',
        role: 'admin',
        status: 'active',
        lastActive: 'Just now',
        avatar: 'https://ui-avatars.com/api/?name=Test+User&background=0ea5e9&color=fff'
    },
    {
        id: '2',
        name: 'Sarah Engineer',
        email: 'sarah@evaratech.com',
        role: 'editor',
        status: 'active',
        lastActive: '2 hours ago',
        avatar: 'https://ui-avatars.com/api/?name=Sarah+Engineer&background=8b5cf6&color=fff'
    },
    {
        id: '3',
        name: 'John Operator',
        email: 'john@evaratech.com',
        role: 'viewer',
        status: 'inactive',
        lastActive: '2 days ago',
        avatar: 'https://ui-avatars.com/api/?name=John+Operator&background=10b981&color=fff'
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
            case 'admin': return styles.adminBadge;
            case 'editor': return styles.editorBadge;
            default: return styles.viewerBadge;
        }
    };

    return (
        <div className={styles.container}>
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
                                        <span className={`${styles.badge} ${getRoleBadgeClass(user.role)}`}>
                                            {user.role}
                                        </span>
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
                                    <option value="admin">Admin</option>
                                    <option value="editor">Editor</option>
                                    <option value="viewer">Viewer</option>
                                </select>
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
