import { motion, AnimatePresence } from 'framer-motion';
import styles from './FilterPanel.module.css';

interface FilterState {
    types: {
        tank: boolean;
        pump: boolean;
        bore: boolean;
        govt: boolean;
        sump: boolean;
    };
    status: {
        active: boolean;
        inactive: boolean;
        critical: boolean;
    };
    showPipelines: boolean;
}

interface FilterPanelProps {
    filters: FilterState;
    onChange: (filters: FilterState) => void;
    isOpen: boolean;
    onClose: () => void;
}

export default function FilterPanel({ filters, onChange, isOpen, onClose }: FilterPanelProps) {
    const toggleType = (type: keyof FilterState['types']) => {
        onChange({
            ...filters,
            types: { ...filters.types, [type]: !filters.types[type] }
        });
    };

    const toggleStatus = (status: keyof FilterState['status']) => {
        onChange({
            ...filters,
            status: { ...filters.status, [status]: !filters.status[status] }
        });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className={styles.panel}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                    <div className={styles.header}>
                        <h3>Filters</h3>
                        <button className={styles.closeBtn} onClick={onClose}>
                            <i className="fas fa-times"></i>
                        </button>
                    </div>

                    <div className={styles.section}>
                        <h4>Asset Type</h4>
                        <div className={styles.tags}>
                            {Object.entries(filters.types).map(([type, isActive]) => (
                                <button
                                    key={type}
                                    className={`${styles.tag} ${isActive ? styles.active : ''}`}
                                    onClick={() => toggleType(type as keyof FilterState['types'])}
                                >
                                    <span className={styles.checkIcon}>
                                        {isActive && <i className="fas fa-check"></i>}
                                    </span>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.section}>
                        <h4>Status</h4>
                        <div className={styles.tags}>
                            {Object.entries(filters.status).map(([status, isActive]) => (
                                <button
                                    key={status}
                                    className={`${styles.tag} ${isActive ? styles.active : ''}`}
                                    onClick={() => toggleStatus(status as keyof FilterState['status'])}
                                >
                                    <span className={styles.checkIcon}>
                                        {isActive && <i className="fas fa-check"></i>}
                                    </span>
                                    {status.charAt(0).toUpperCase() + status.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.divider} />

                    <div className={styles.section}>
                        <div className={styles.toggleRow}>
                            <span>Show Pipelines</span>
                            <div
                                className={`${styles.toggle} ${filters.showPipelines ? styles.on : ''}`}
                                onClick={() => onChange({ ...filters, showPipelines: !filters.showPipelines })}
                            >
                                <motion.div
                                    className={styles.handle}
                                    layout
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
