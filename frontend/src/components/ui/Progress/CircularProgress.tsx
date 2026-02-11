import styles from './CircularProgress.module.css';

/**
 * Circular Progress Component
 * Version: 1.0.0
 * 
 * Professional circular progress indicator
 * Integrated with EvaraTech Design System
 */

export interface CircularProgressProps {
    /** Progress value (0-100) */
    value?: number;

    /** Indeterminate mode (spinning) */
    indeterminate?: boolean;

    /** Size in pixels or preset */
    size?: number | 'sm' | 'md' | 'lg' | 'xl';

    /** Stroke width */
    thickness?: number;

    /** Color */
    color?: string;

    /** Show percentage in center */
    showLabel?: boolean;

    /** Custom label */
    label?: React.ReactNode;

    /** Custom className */
    className?: string;
}

/**
 * CircularProgress - Circular progress indicator
 * 
 * SVG-based circular progress with determinate and indeterminate modes
 * 
 * @example
 * ```tsx
 * // Simple spinner
 * <CircularProgress indeterminate size="md" />
 * 
 * // Progress with percentage
 * <CircularProgress value={60} showLabel size="lg" />
 * 
 * // Custom label
 * <CircularProgress value={85} label="85/100" />
 * ```
 */
export function CircularProgress({
    value = 0,
    indeterminate = false,
    size = 'md',
    thickness = 4,
    color = 'var(--color-primary-500)',
    showLabel = false,
    label,
    className = '',
}: CircularProgressProps) {
    // Size mapping
    const sizeMap = {
        sm: 24,
        md: 40,
        lg: 56,
        xl: 72,
    };

    const pixelSize = typeof size === 'number' ? size : sizeMap[size];
    const radius = (pixelSize - thickness) / 2;
    const circumference = 2 * Math.PI * radius;
    const clampedValue = Math.min(100, Math.max(0, value));
    const strokeDashoffset = circumference - (clampedValue / 100) * circumference;

    const containerClass = [
        styles.circularProgress,
        indeterminate && styles.indeterminate,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div
            className={containerClass}
            style={{ width: pixelSize, height: pixelSize }}
            role="progressbar"
            aria-valuenow={indeterminate ? undefined : clampedValue}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={indeterminate ? 'Loading' : `${clampedValue}% complete`}
        >
            <svg
                width={pixelSize}
                height={pixelSize}
                viewBox={`0 0 ${pixelSize} ${pixelSize}`}
                className={styles.svg}
            >
                {/* Background circle */}
                <circle
                    className={styles.track}
                    cx={pixelSize / 2}
                    cy={pixelSize / 2}
                    r={radius}
                    strokeWidth={thickness}
                />

                {/* Progress circle */}
                <circle
                    className={styles.progress}
                    cx={pixelSize / 2}
                    cy={pixelSize / 2}
                    r={radius}
                    strokeWidth={thickness}
                    stroke={color}
                    strokeDasharray={circumference}
                    strokeDashoffset={indeterminate ? circumference * 0.75 : strokeDashoffset}
                />
            </svg>

            {/* Center label */}
            {(showLabel || label) && !indeterminate && (
                <div className={styles.label}>
                    {label || `${clampedValue}%`}
                </div>
            )}
        </div>
    );
}

export default CircularProgress;
