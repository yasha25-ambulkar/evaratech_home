import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import styles from './NodeDetailModal.module.css';

interface NodeDetailModalProps {
    node: any;
    onClose: () => void;
}

// Mock Data Generator
const generateMockHistory = (type: string) => {
    const data = [];
    const now = new Date();
    for (let i = 24; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000); // Past 24 hours
        data.push({
            time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            value: type === 'tank'
                ? 60 + Math.random() * 30 - i * 0.5 // Simulated drain/fill
                : Math.random() > 0.3 ? 80 + Math.random() * 20 : 0, // Pump running or off
        });
    }
    return data;
};

export default function NodeDetailModal({ node, onClose }: NodeDetailModalProps) {
    const [viewMode, setViewMode] = useState<'live' | 'history'>('live');

    if (!node) return null;

    const isPump = node.type === 'pump';
    const isTank = node.type === 'tank' || node.type === 'sump';

    // Calculate fill percentage for visuals
    const fillPercentage = isTank
        ? Math.min(100, Math.max(0, (node.currentVolume?.[node.currentVolume?.length - 1]?.value || 0) / (node.capacity || 1) * 100))
        : 0;

    const historyData = generateMockHistory(node.type);

    return (
        <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
        >
            <motion.div
                className={styles.modal}
                initial={{ scale: 0.9, y: 20, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.9, y: 20, opacity: 0 }}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
            >
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <div className={styles.typeBadge}>{node.type}</div>
                        <h2 className={styles.title}>{node.name}</h2>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                {/* Content Area - Toggle between Live and History */}
                <div className={styles.contentArea}>
                    <AnimatePresence mode="wait">
                        {viewMode === 'live' ? (
                            <motion.div
                                key="live"
                                className={styles.visualContainer}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {isTank && (
                                    <div className={styles.liquidContainer}>
                                        <div className={styles.liquidFill} style={{ height: `${fillPercentage}%` }}>
                                            <div className={styles.liquidSurface}></div>
                                        </div>
                                        <div className={styles.liquidValue}>
                                            {Math.round(fillPercentage)}%
                                        </div>
                                    </div>
                                )}

                                {isPump && (
                                    <div className={`${styles.pumpContainer} ${node.status === 'active' ? styles.pumpActive : ''}`}>
                                        <div className={styles.fan}>
                                            <i className="fas fa-cog fa-3x"></i>
                                        </div>
                                        {node.status === 'active' && (
                                            <motion.div
                                                className={styles.flowParticles}
                                                animate={{ x: [0, 100], opacity: [0, 1, 0] }}
                                                transition={{ repeat: Infinity, duration: 1.5 }}
                                            >
                                                <i className="fas fa-chevron-right"></i>
                                                <i className="fas fa-chevron-right"></i>
                                                <i className="fas fa-chevron-right"></i>
                                            </motion.div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        ) : (
                            <motion.div
                                key="history"
                                className={styles.chartContainer}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={historyData}>
                                        <defs>
                                            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#eee" />
                                        <XAxis dataKey="time" hide />
                                        <Tooltip
                                            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            itemStyle={{ color: '#0ea5e9', fontWeight: 600 }}
                                        />
                                        <Area
                                            type="monotone"
                                            dataKey="value"
                                            stroke="#0ea5e9"
                                            strokeWidth={3}
                                            fillOpacity={1}
                                            fill="url(#colorValue)"
                                        />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Metadata Grid */}
                <div className={styles.grid}>
                    <div className={styles.gridItem}>
                        <span className={styles.label}>Status</span>
                        <span className={`${styles.value} ${node.status === 'active' ? styles.ok : styles.issue}`}>
                            {node.status || 'Unknown'}
                        </span>
                    </div>
                    <div className={styles.gridItem}>
                        <span className={styles.label}>{isTank ? 'Capacity' : 'Power'}</span>
                        <span className={styles.value}>
                            {isTank ? `${(node.capacity / 1000).toFixed(1)}k L` : 'Unknown'}
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className={styles.actions}>
                    <button
                        className={`${styles.actionBtn} ${viewMode === 'history' ? styles.activeTab : ''}`}
                        onClick={() => setViewMode(viewMode === 'live' ? 'history' : 'live')}
                    >
                        {viewMode === 'live' ? 'View History' : 'Back to Live'}
                    </button>
                    <button className={`${styles.actionBtn} ${styles.primary}`}>Control Panel</button>
                </div>

            </motion.div>
        </motion.div>
    );
}
