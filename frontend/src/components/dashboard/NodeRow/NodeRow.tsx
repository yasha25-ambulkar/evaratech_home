import { motion } from 'framer-motion';
import styles from './NodeRow.module.css';

interface NodeRowProps {
    name: string;
    type: string;
    status: 'active' | 'inactive' | 'warning' | 'error';
    value?: string;
    subValue?: string;
    onClick?: () => void;
}

export default function NodeRow({ name, type, status, value, subValue, onClick }: NodeRowProps) {
    return (
        <motion.div
            className={styles.row}
            whileHover={{ scale: 1.01, backgroundColor: 'rgba(255, 255, 255, 0.6)' }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
        >
            <div className={styles.left}>
                <div className={`${styles.statusDot} ${styles[status]}`} />
                <div className={styles.iconBox}>
                    <i className={`fas fa-${getIconForType(type)}`}></i>
                </div>
                <div className={styles.info}>
                    <div className={styles.name}>{name}</div>
                    <div className={styles.type}>{type}</div>
                </div>
            </div>

            <div className={styles.right}>
                {value && <div className={styles.value}>{value}</div>}
                {subValue && <div className={styles.subValue}>{subValue}</div>}
                <i className={`fas fa-chevron-right ${styles.arrow}`}></i>
            </div>
        </motion.div>
    );
}

function getIconForType(type: string): string {
    switch (type.toLowerCase()) {
        case 'pump': return 'cogs';
        case 'tank': return 'database';
        case 'sump': return 'water';
        case 'bore': return 'arrow-circle-down';
        default: return 'circle';
    }
}
