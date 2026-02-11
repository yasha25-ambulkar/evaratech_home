import styles from './Badge.module.css';

/**
 * Badge Component
 * Version: 2.0.0
 * 
 * Notification, status, and text badges with positioning
 */

export interface BadgeProps {
    /** Notification count */
    count?: number;

    /** Status indicator */
    status?: 'online' | 'offline' | 'busy';

    /** Text content */
    text?: string;

    /** Badge variant */
    variant?: 'primary' | 'success' | 'warning' | 'error' | 'normal' | 'critical';

    /** Badge size */
    size?: 'sm' | 'md' | 'lg';

    /** Position (for wrapping children) */
    position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';

    /** Children to wrap */
    children?: React.ReactNode;

    /** Custom className */
    className?: string;
}

export function Badge({
    count,
    status,
    text,
    variant = 'primary',
    size = 'md',
    position = 'top-right',
    children,
    className = '',
}: BadgeProps) {
    // Determine badge type
    const isNotification = count !== undefined;
    const isStatus = status !== undefined;
    const isText = text !== undefined;

    // Format count
    const displayCount = count !== undefined && count > 99 ? '99+' : count;

    const badgeClass = [
        styles.badge,
        styles[variant],
        styles[size],
        isStatus && styles.status,
        isText && styles.text,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const badge = (
        <span className={badgeClass}>
            {isNotification && displayCount}
            {isStatus && <span className={styles.dot} />}
            {isText && text}
        </span>
    );

    // If no children, return standalone badge
    if (!children) {
        return badge;
    }

    // Wrap children with positioned badge
    const wrapperClass = [
        styles.wrapper,
        styles[`position_${position.replace('-', '_')}`],
    ].join(' ');

    return (
        <div className={wrapperClass}>
            {children}
            {badge}
        </div>
    );
}

export default Badge;
