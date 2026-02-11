import { HTMLMotionProps, motion } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';
import styles from './EnhancedCard.module.css';

export interface EnhancedCardProps extends HTMLMotionProps<"div"> {
    /** Card content */
    children: ReactNode;

    /** Visual variant */
    variant?: 'base' | 'elevated' | 'interactive' | 'glass' | 'solid' | 'outlined';

    /** Padding size */
    size?: 'sm' | 'md' | 'lg' | 'xl';

    /** Custom className */
    className?: string;

    /** Remove padding */
    noPadding?: boolean;

    /** Enable hover effect */
    hover?: boolean;

    /** Make clickable */
    clickable?: boolean;

    /** Loading state */
    loading?: boolean;

    /** Disabled state */
    disabled?: boolean;

    /** Optional header content */
    header?: ReactNode;

    /** Optional footer content */
    footer?: ReactNode;

    /** ARIA label for accessibility */
    'aria-label'?: string;

    /** Click handler */
    onClick?: () => void;
}

/**
 * EnhancedCard - Premium card component with design system integration
 * 
 * Features:
 * - Multiple visual variants (base, elevated, interactive, glass, solid, outlined)
 * - Loading states with shimmer effect
 * - Smooth animations with framer-motion
 * - Full accessibility support
 * - Header and footer sections
 * - Dark mode support
 * 
 * @example
 * ```tsx
 * <EnhancedCard variant="elevated" size="lg" header={<h3>Title</h3>}>
 *   <p>Card content</p>
 * </EnhancedCard>
 * ```
 */
const EnhancedCard = forwardRef<HTMLDivElement, EnhancedCardProps>(({
    children,
    variant = 'base',
    size = 'md',
    className = '',
    noPadding = false,
    hover = true,
    clickable = false,
    loading = false,
    disabled = false,
    header,
    footer,
    'aria-label': ariaLabel,
    onClick,
    ...props
}, ref) => {
    const cardClasses = [
        styles.card,
        styles[variant],
        styles[size],
        hover && !disabled && styles.hoverable,
        clickable && !disabled && styles.clickable,
        loading && styles.loading,
        disabled && styles.disabled,
        className
    ].filter(Boolean).join(' ');

    const paddingMap = {
        sm: 'var(--space-3)',
        md: 'var(--space-6)',
        lg: 'var(--space-8)',
        xl: 'var(--space-10)'
    };

    const handleClick = () => {
        if (!disabled && !loading && clickable && onClick) {
            onClick();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (clickable && !disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            handleClick();
        }
    };

    return (
        <motion.div
            ref={ref}
            className={cardClasses}
            style={{
                padding: noPadding ? '0' : paddingMap[size],
            }}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            role={clickable ? 'button' : undefined}
            tabIndex={clickable && !disabled ? 0 : undefined}
            aria-label={ariaLabel}
            aria-disabled={disabled}
            aria-busy={loading}
            whileHover={hover && !disabled ? {
                y: -2,
                transition: { duration: 0.2, ease: [0.16, 1, 0.3, 1] }
            } : undefined}
            whileTap={clickable && !disabled ? {
                scale: 0.98,
                transition: { duration: 0.1 }
            } : undefined}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            {...props}
        >
            {/* Loading overlay */}
            {loading && (
                <div className={styles.loadingOverlay} data-testid="loading-overlay">
                    <div className={styles.shimmer} />
                </div>
            )}

            {/* Premium highlight effect */}
            <div className={styles.highlight} />

            {/* Header section */}
            {header && <div className={styles.header}>{header}</div>}

            {/* Main content */}
            <div className={styles.content}>{children}</div>

            {/* Footer section */}
            {footer && <div className={styles.footer}>{footer}</div>}
        </motion.div>
    );
});

EnhancedCard.displayName = 'EnhancedCard';

export default EnhancedCard;
export { EnhancedCard };
