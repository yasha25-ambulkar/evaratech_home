import { useState } from 'react';
import { EnhancedModal } from '../EnhancedModal';
import styles from './ConfirmDialog.module.css';

/**
 * ConfirmDialog Component
 * Version: 1.0.0
 * 
 * Confirmation dialog with promise-based API
 */

export interface ConfirmDialogProps {
    /** Open state */
    open: boolean;

    /** Title */
    title: string;

    /** Message */
    message: string;

    /** Variant */
    variant?: 'info' | 'warning' | 'danger';

    /** Confirm button text */
    confirmText?: string;

    /** Cancel button text */
    cancelText?: string;

    /** Confirm handler */
    onConfirm: () => void | Promise<void>;

    /** Cancel handler */
    onCancel: () => void;

    /** Custom icon */
    icon?: React.ReactNode;
}

export function ConfirmDialog({
    open,
    title,
    message,
    variant = 'info',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    icon,
}: ConfirmDialogProps) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        setLoading(true);
        try {
            await onConfirm();
        } finally {
            setLoading(false);
        }
    };

    const variantIcons = {
        info: (
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
        warning: (
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none">
                <path d="M12 9v4m0 4h.01M5 19h14a2 2 0 001.84-2.76l-7-14a2 2 0 00-3.68 0l-7 14A2 2 0 005 19z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        danger: (
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                <path d="M15 9l-6 6M9 9l6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
        ),
    };

    const iconClass = [
        styles.iconWrapper,
        styles[variant],
    ]
        .filter(Boolean)
        .join(' ');

    const confirmButtonClass = [
        styles.button,
        styles.confirmButton,
        styles[`${variant}Button`],
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <EnhancedModal
            open={open}
            onClose={onCancel}
            size="sm"
            showCloseButton={false}
            closeOnBackdropClick={!loading}
            closeOnEscape={!loading}
        >
            <div className={styles.container}>
                <div className={iconClass}>
                    {icon || variantIcons[variant]}
                </div>

                <div className={styles.content}>
                    <h3 className={styles.title}>{title}</h3>
                    <p className={styles.message}>{message}</p>
                </div>

                <div className={styles.actions}>
                    <button
                        type="button"
                        className={`${styles.button} ${styles.cancelButton}`}
                        onClick={onCancel}
                        disabled={loading}
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        className={confirmButtonClass}
                        onClick={handleConfirm}
                        disabled={loading}
                        autoFocus
                    >
                        {loading ? 'Loading...' : confirmText}
                    </button>
                </div>
            </div>
        </EnhancedModal>
    );
}

export default ConfirmDialog;
