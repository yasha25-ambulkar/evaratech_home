import styles from './Tag.module.css';

/**
 * Tag Component
 * Version: 1.0.0
 * 
 * Removable tags with icon support
 */

export interface TagProps {
    /** Tag variant */
    variant?: 'primary' | 'success' | 'warning' | 'error';

    /** Tag size */
    size?: 'sm' | 'md' | 'lg';

    /** Left icon */
    icon?: React.ReactNode;

    /** Remove callback */
    onRemove?: () => void;

    /** Children */
    children: React.ReactNode;

    /** Custom className */
    className?: string;
}

export function Tag({
    variant = 'primary',
    size = 'md',
    icon,
    onRemove,
    children,
    className = '',
}: TagProps) {
    const tagClass = [
        styles.tag,
        styles[variant],
        styles[size],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <span className={tagClass}>
            {icon && <span className={styles.icon}>{icon}</span>}

            <span className={styles.label}>{children}</span>

            {onRemove && (
                <button
                    className={styles.remove}
                    onClick={onRemove}
                    aria-label="Remove tag"
                    type="button"
                >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M12 1.2L10.8 0L6 4.8L1.2 0L0 1.2L4.8 6L0 10.8L1.2 12L6 7.2L10.8 12L12 10.8L7.2 6L12 1.2Z" fill="currentColor" />
                    </svg>
                </button>
            )}
        </span>
    );
}

export default Tag;
