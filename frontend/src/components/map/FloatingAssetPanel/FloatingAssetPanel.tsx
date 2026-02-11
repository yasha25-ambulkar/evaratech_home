import { motion } from 'framer-motion';
import { X, Box, Sliders, Activity } from 'lucide-react';
import { memo, useMemo, useEffect, useRef, useState } from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import type { Asset } from '../../../types';
import styles from './FloatingAssetPanel.module.css';

interface FloatingAssetPanelProps {
    asset: Asset;
    onClose: () => void;
}

// Mock Data for the performance chart (matching reference aesthetic)
const mockData = [
    { time: '00:00', value: 35 },
    { time: '04:00', value: 42 },
    { time: '08:00', value: 78 },
    { time: '12:00', value: 95 },
    { time: '16:00', value: 65 },
    { time: '20:00', value: 48 },
    { time: '23:59', value: 38 },
];

/**
 * FloatingAssetPanel - Refactored to be a 3-column detailed detailed view.
 * Matches the "Apple-level polish" and industrial aesthetic requested.
 */
const FloatingAssetPanel = memo(function FloatingAssetPanel({
    asset,
    onClose,
}: FloatingAssetPanelProps) {
    const panelRef = useRef<HTMLDivElement>(null);
    const [maintenanceMode, setMaintenanceMode] = useState(false);
    const [remoteOps, setRemoteOps] = useState(true);
    const [notifications, setNotifications] = useState(true);

    // Focus management and focus trap
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }

            if (e.key === 'Tab' && panelRef.current) {
                const focusableElements = panelRef.current.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                );
                const firstElement = focusableElements[0] as HTMLElement;
                const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

                if (e.shiftKey) { // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else { // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        };

        document.addEventListener('keydown', handleKeyDown);

        // Focus the close button or first element on mount
        const focusable = panelRef.current?.querySelector('button');
        if (focusable instanceof HTMLElement) {
            focusable.focus();
        }

        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [onClose]);

    const statusColor = useMemo(() => getStatusColor(asset.status), [asset.status]);

    return (
        <div className={styles.wrapper}>
            {/* Backdrop with Blur */}
            <motion.div
                className={styles.backdrop}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            />

            {/* Floating Panel (3-Column Layout) */}
            <motion.div
                ref={panelRef}
                className={styles.panel}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className={styles.header}>
                    <div className={styles.titleSection}>
                        <div className={styles.iconBox}>
                            <Box size={20} />
                        </div>
                        <h2 className={styles.title}>{asset.name}</h2>
                    </div>
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close panel">
                        <X size={20} />
                    </button>
                </div>

                {/* 3-Column Grid */}
                <div className={styles.grid}>
                    {/* Column 1: General Information */}
                    <div className={styles.column}>
                        <h3 className={styles.columnTitle}>
                            <Activity size={12} /> GENERAL INFORMATION
                        </h3>
                        <div className={styles.infoList}>
                            <InfoRow label="Asset ID" value={asset.id} />
                            <InfoRow label="Type" value={asset.type} />
                            <InfoRow label="Capacity" value={asset.capacity} />
                            <InfoRow label="Location / Specs" value={asset.specs || 'N/A'} />
                            <div className={styles.infoRow}>
                                <span className={styles.label}>Current Status</span>
                                <span className={styles.statusBadge} style={{ '--badge-color': statusColor } as any}>
                                    {asset.status.toUpperCase()}
                                </span>
                            </div>
                            <InfoRow label="Coordinates" value={`${asset.position[0].toFixed(4)}, ${asset.position[1].toFixed(4)}`} />
                        </div>
                    </div>

                    {/* Column 2: System Controls */}
                    <div className={styles.column}>
                        <h3 className={styles.columnTitle}>
                            <Sliders size={14} /> SYSTEM CONTROLS
                        </h3>
                        <div className={styles.controlsList}>
                            <ControlToggle
                                label="Remote Operation"
                                active={remoteOps}
                                onChange={setRemoteOps}
                            />
                            <ControlToggle
                                label="Maintenance Mode"
                                active={maintenanceMode}
                                onChange={setMaintenanceMode}
                            />
                            <ControlToggle
                                label="Alert Notifications"
                                active={notifications}
                                onChange={setNotifications}
                            />
                        </div>
                    </div>

                    {/* Column 3: Performance Metrics (Hero Column) */}
                    <div className={styles.columnWide}>
                        <h3 className={styles.columnTitle}>
                            <Activity size={12} className={styles.pulseIcon} /> PERFORMANCE METRICS (24H)
                        </h3>
                        <div className={styles.chartContainer}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={mockData}>
                                    <defs>
                                        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(0,0,0,0.05)" />
                                    <XAxis
                                        dataKey="time"
                                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 10, fill: '#94a3b8' }}
                                        axisLine={false}
                                        tickLine={false}
                                        domain={[0, 100]}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            borderRadius: '12px',
                                            border: 'none',
                                            background: 'rgba(255,255,255,0.95)',
                                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                            fontSize: '12px'
                                        }}
                                        cursor={{ stroke: '#0ea5e9', strokeWidth: 1 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="value"
                                        stroke="#0ea5e9"
                                        strokeWidth={3}
                                        fill="url(#chartGradient)"
                                        animationDuration={1500}
                                        activeDot={{ r: 6, strokeWidth: 0, fill: '#0ea5e9' }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
});

// Helper Components
const InfoRow = ({ label, value }: { label: string; value: string }) => (
    <div className={styles.infoRow}>
        <span className={styles.label}>{label}</span>
        <span className={styles.value}>{value}</span>
    </div>
);

const ControlToggle = ({ label, active, onChange }: { label: string, active: boolean, onChange: (v: boolean) => void }) => (
    <div className={styles.controlRow}>
        <span className={styles.controlLabel}>{label}</span>
        <button
            className={`${styles.toggle} ${active ? styles.toggleOn : ''}`}
            onClick={() => onChange(!active)}
        >
            <motion.div
                className={styles.toggleThumb}
                animate={{ x: active ? 20 : 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
        </button>
    </div>
);

function getStatusColor(status: string): string {
    const s = status.toLowerCase();
    if (s === 'normal' || s === 'working' || s === 'running' || s === 'active') return '#10b981';
    if (s === 'warning') return '#f59e0b';
    if (s === 'critical') return '#ef4444';
    return '#64748b';
}

export default FloatingAssetPanel;
