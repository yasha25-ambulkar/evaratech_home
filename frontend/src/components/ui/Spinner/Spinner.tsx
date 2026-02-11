import { CircularProgress } from '../Progress/CircularProgress';
import styles from './Spinner.module.css';

/**
 * Spinner Component
 * Version: 1.0.0
 * 
 * Professional loading spinner
 * Integrated with EvaraTech Design System
 */

export interface SpinnerProps {
    /** Size variant */
    size?: 'sm' | 'md' | 'lg';

    /** Color */
    color?: string;

    /** Loading text */
    text?: string;

    /** Full-page overlay */
    overlay?: boolean;

    /** Custom className */
    className?: string;
}

/**
 * Spinner - Loading spinner component
 * 
 * Simple loading indicator with optional overlay mode
 * 
 * @example
 * ```tsx
 * // Inline spinner
 * <Spinner size="sm" />
 * 
 * // With text
 * <Spinner size="md" text="Loading data..." />
 * 
 * // Full-page overlay
 * <Spinner overlay text="Please wait..." />
 * ```
 */
export function Spinner({
    size = 'md',
    color = 'var(--color-primary-500)',
    text,
    overlay = false,
    className = '',
}: SpinnerProps) {
    const sizeMap = {
        sm: 16,
        md: 24,
        lg: 40,
    };

    const spinnerContent = (
        <div className={`${styles.spinner} ${className}`}>
            <CircularProgress
                indeterminate
                size={sizeMap[size]}
                thickness={3}
                color={color}
            />
            {text && <span className={styles.text}>{text}</span>}
        </div>
    );

    if (overlay) {
        return (
            <div className={styles.overlay} role="alert" aria-busy="true" aria-live="polite">
                {spinnerContent}
            </div>
        );
    }

    return spinnerContent;
}

export default Spinner;
