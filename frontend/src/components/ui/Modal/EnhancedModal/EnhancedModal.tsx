import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import styles from './EnhancedModal.module.css';

/**
 * EnhancedModal Component
 * Version: 1.0.0
 * 
 * Professional modal with animations, focus trap, and accessibility
 */

export interface EnhancedModalProps {
    /** Open state */
    open: boolean;

    /** Close handler */
    onClose: () => void;

    /** Size variant */
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';

    /** Title */
    title?: string;

    /** Custom header */
    header?: React.ReactNode;

    /** Custom footer */
    footer?: React.ReactNode;

    /** Children (modal content) */
    children: React.ReactNode;

    /** Show close button */
    showCloseButton?: boolean;

    /** Close on backdrop click */
    closeOnBackdropClick?: boolean;

    /** Close on Escape */
    closeOnEscape?: boolean;

    /** Prevent body scroll */
    preventScroll?: boolean;

    /** Custom className */
    className?: string;
}

export function EnhancedModal({
    open,
    onClose,
    size = 'md',
    title,
    header,
    footer,
    children,
    showCloseButton = true,
    closeOnBackdropClick = true,
    closeOnEscape = true,
    preventScroll = true,
    className = '',
}: EnhancedModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);
    const previousActiveElement = useRef<HTMLElement | null>(null);

    // Handle Escape key
    useEffect(() => {
        if (!open || !closeOnEscape) return;

        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [open, closeOnEscape, onClose]);

    // Prevent body scroll
    useEffect(() => {
        if (!open || !preventScroll) return;

        const originalOverflow = document.body.style.overflow;
        document.body.style.overflow = 'hidden';

        return () => {
            document.body.style.overflow = originalOverflow;
        };
    }, [open, preventScroll]);

    // Focus management
    useEffect(() => {
        if (open) {
            previousActiveElement.current = document.activeElement as HTMLElement;

            // Focus modal after animation
            setTimeout(() => {
                modalRef.current?.focus();
            }, 100);
        } else {
            // Restore focus
            previousActiveElement.current?.focus();
        }
    }, [open]);

    // Focus trap
    useEffect(() => {
        if (!open) return;

        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== 'Tab' || !modalRef.current) return;

            const focusableElements = modalRef.current.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            const firstElement = focusableElements[0] as HTMLElement;
            const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    lastElement?.focus();
                    e.preventDefault();
                }
            } else {
                if (document.activeElement === lastElement) {
                    firstElement?.focus();
                    e.preventDefault();
                }
            }
        };

        document.addEventListener('keydown', handleTab);
        return () => document.removeEventListener('keydown', handleTab);
    }, [open]);

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget && closeOnBackdropClick) {
            onClose();
        }
    };

    if (!open) return null;

    const modalClass = [
        styles.modal,
        styles[size],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const modalContent = (
        <div className={styles.backdrop} onClick={handleBackdropClick}>
            <div
                ref={modalRef}
                className={modalClass}
                role="dialog"
                aria-modal="true"
                aria-labelledby={title ? 'modal-title' : undefined}
                tabIndex={-1}
            >
                {(title || header || showCloseButton) && (
                    <div className={styles.header}>
                        {header || (
                            <>
                                {title && <h2 id="modal-title" className={styles.title}>{title}</h2>}
                                {showCloseButton && (
                                    <button
                                        type="button"
                                        className={styles.closeButton}
                                        onClick={onClose}
                                        aria-label="Close modal"
                                    >
                                        ✕
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                )}

                <div className={styles.content}>
                    {children}
                </div>

                {footer && (
                    <div className={styles.footer}>
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
}

export default EnhancedModal;
