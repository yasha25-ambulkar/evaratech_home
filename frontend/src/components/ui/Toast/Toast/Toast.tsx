import { useEffect } from 'react';
import styles from './Toast.module.css';

/**
 * Toast Component
 * Version: 1.0.0
 * 
 * Individual toast notification with auto-dismiss
 */

export interface ToastAction {
    label: string;
    onClick: () => void;
}

export interface ToastProps {
    /** Toast ID */
    id: string;

    /** Toast type */
    type: 'success' | 'error' | 'warning' | 'info';

    /** Message */
    message: string;

    /** Auto-dismiss duration in ms (0 = no auto-dismiss) */
    duration?: number;

    /** Dismiss callback */
    onDismiss: (id: string) => void;

    /** Optional action */
    action?: ToastAction;
}

const icons = {
    success: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM8 15L3 10L4.41 8.59L8 12.17L15.59 4.58L17 6L8 15Z" fill="currentColor" />
        </svg>
    ),
    error: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="currentColor" />
        </svg>
    ),
    warning: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M1 17H19L10 1L1 17ZM11 14H9V12H11V14ZM11 10H9V6H11V10Z" fill="currentColor" />
        </svg>
    ),
    info: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V9H11V15ZM11 7H9V5H11V7Z" fill="currentColor" />
        </svg>
    ),
};

export function Toast({
    id,
    type,
    message,
    duration = 5000,
    onDismiss,
    action,
}: ToastProps) {
    useEffect(() => {
        if (duration > 0) {
            const timer = setTimeout(() => {
                onDismiss(id);
            }, duration);

            return () => clearTimeout(timer);
        }
    }, [id, duration, onDismiss]);

    const toastClass = [
        styles.toast,
        styles[type],
    ].join(' ');

    return (
        <div className={toastClass} role="alert" aria-live="polite">
            <div className={styles.icon}>
                {icons[type]}
            </div>

            <div className={styles.content}>
                <p className={styles.message}>{message}</p>

                {action && (
                    <button
                        className={styles.action}
                        onClick={() => {
                            action.onClick();
                            onDismiss(id);
                        }}
                    >
                        {action.label}
                    </button>
                )}
            </div>

            <button
                className={styles.close}
                onClick={() => onDismiss(id)}
                aria-label="Dismiss notification"
            >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" fill="currentColor" />
                </svg>
            </button>
        </div>
    );
}

export default Toast;
