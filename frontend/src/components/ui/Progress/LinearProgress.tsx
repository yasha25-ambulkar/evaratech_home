import styles from './LinearProgress.module.css';

/**
 * Linear Progress Component
 * Version: 1.0.0
 * 
 * Professional linear progress indicator
 * Integrated with EvaraTech Design System
 */

export interface LinearProgressProps {
    /** Progress value (0-100) */
    value?: number;

    /** Indeterminate mode (animated) */
    indeterminate?: boolean;

    /** Color variant */
    color?: 'primary' | 'success' | 'warning' | 'error';

    /** Size variant */
    size?: 'sm' | 'md' | 'lg';

    /** Show percentage label */
    showLabel?: boolean;

    /** Custom className */
    className?: string;
}

/**
 * LinearProgress - Horizontal progress bar
 * 
 * Shows progress for determinate tasks or animated loading for indeterminate tasks
 * 
 * @example
 * ```tsx
 * // Determinate progress
 * <LinearProgress value={75} color="primary" showLabel />
 * 
 * // Indeterminate loading
 * <LinearProgress indeterminate color="success" />
 * 
 * // File upload
 * <LinearProgress value={uploadProgress} size="lg" />
 * ```
 */
export function LinearProgress({
    value = 0,
    indeterminate = false,
    color = 'primary',
    size = 'md',
    showLabel = false,
    className = '',
}: LinearProgressProps) {
    // Clamp value between 0 and 100
    const clampedValue = Math.min(100, Math.max(0, value));

    // Build className
    const progressClass = [
        styles.linearProgress,
        styles[size],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const barClass = [
        styles.bar,
        styles[color],
        indeterminate && styles.indeterminate,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={styles.container}>
            <div
                className={progressClass}
                role="progressbar"
                aria-valuenow={indeterminate ? undefined : clampedValue}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={indeterminate ? 'Loading' : `${clampedValue}% complete`}
            >
                <div
                    className={barClass}
                    style={{
                        width: indeterminate ? '100%' : `${clampedValue}%`,
                    }}
                />
            </div>
            {showLabel && !indeterminate && (
                <span className={styles.label}>{clampedValue}%</span>
            )}
        </div>
    );
}

export default LinearProgress;
