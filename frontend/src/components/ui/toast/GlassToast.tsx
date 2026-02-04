import { motion } from 'framer-motion';
import { useEffect } from 'react';
import styles from './GlassToast.module.css';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
    id: string;
    type: ToastType;
    message: string;
    duration?: number;
    onClose: (id: string) => void;
}

const icons = {
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
    warning: 'fas fa-exclamation-triangle',
    info: 'fas fa-info-circle',
};

export default function GlassToast({ id, type, message, duration = 5000, onClose }: ToastProps) {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(id);
        }, duration);

        return () => clearTimeout(timer);
    }, [id, duration, onClose]);

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
            className={`${styles.toast} ${styles[type]}`}
        >
            <div className={styles.iconWrapper}>
                <i className={icons[type]}></i>
            </div>
            <div className={styles.content}>
                <p className={styles.message}>{message}</p>
            </div>
            <button className={styles.closeBtn} onClick={() => onClose(id)}>
                <i className="fas fa-times"></i>
            </button>

            {/* Progress Bar */}
            <motion.div
                className={styles.progressBar}
                initial={{ width: '100%' }}
                animate={{ width: '0%' }}
                transition={{ duration: duration / 1000, ease: 'linear' }}
            />
        </motion.div>
    );
}
