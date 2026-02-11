import { createPortal } from 'react-dom';
import { Toast, ToastProps } from '../Toast';
import styles from './ToastContainer.module.css';

/**
 * ToastContainer Component
 * Version: 1.0.0
 * 
 * Container for displaying multiple toasts with positioning
 */

export interface ToastContainerProps {
    /** Toast position */
    position?: 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

    /** Active toasts */
    toasts: ToastProps[];

    /** Dismiss callback */
    onDismiss: (id: string) => void;
}

export function ToastContainer({
    position = 'top-right',
    toasts,
    onDismiss,
}: ToastContainerProps) {
    if (toasts.length === 0) {
        return null;
    }

    const containerClass = [
        styles.container,
        styles[position.replace('-', '_')],
    ].join(' ');

    const content = (
        <div className={containerClass}>
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    {...toast}
                    onDismiss={onDismiss}
                />
            ))}
        </div>
    );

    // Render to body using portal
    return createPortal(content, document.body);
}

export default ToastContainer;
