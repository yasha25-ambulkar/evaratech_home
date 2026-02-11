import { forwardRef, ButtonHTMLAttributes } from 'react';
import { useRipple } from '@/hooks';
import { Spinner } from '@/components/ui/Spinner';
import styles from './IconButton.module.css';

/**
 * IconButton Component
 * Version: 1.0.0
 * 
 * Icon-only button with circular or square shape
 */

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
    /** Button variant */
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

    /** Button size */
    size?: 'xs' | 'sm' | 'md' | 'lg';

    /** Button shape */
    shape?: 'circular' | 'square';

    /** Loading state */
    loading?: boolean;

    /** Disable ripple effect */
    disableRipple?: boolean;

    /** Icon */
    children: React.ReactNode;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
    (
        {
            variant = 'ghost',
            size = 'md',
            shape = 'circular',
            loading = false,
            disableRipple = false,
            disabled = false,
            className = '',
            children,
            onClick,
            ...rest
        },
        ref
    ) => {
        const { createRipple } = useRipple({
            color: variant === 'primary' || variant === 'danger' ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.1)',
        });

        const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
            if (!disabled && !loading) {
                if (!disableRipple) {
                    createRipple(e);
                }
                onClick?.(e);
            }
        };

        const buttonClass = [
            styles.iconButton,
            styles[variant],
            styles[size],
            styles[shape],
            loading && styles.loading,
            disabled && styles.disabled,
            className,
        ]
            .filter(Boolean)
            .join(' ');

        const isDisabled = disabled || loading;

        return (
            <button
                ref={ref}
                className={buttonClass}
                disabled={isDisabled}
                onClick={handleClick}
                style={{ position: 'relative', overflow: 'hidden' }}
                {...rest}
            >
                {loading ? (
                    <Spinner size="sm" />
                ) : (
                    <span className={styles.icon}>{children}</span>
                )}
            </button>
        );
    }
);

IconButton.displayName = 'IconButton';

export default IconButton;
