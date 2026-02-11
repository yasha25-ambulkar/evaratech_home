import { forwardRef, ButtonHTMLAttributes } from 'react';
import { useRipple } from '@/hooks';
import { Spinner } from '@/components/ui/Spinner';
import styles from './EnhancedButton.module.css';

/**
 * EnhancedButton Component
 * Version: 1.0.0
 * 
 * Professional button with variants, sizes, loading states, and icons
 */

export interface EnhancedButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'size'> {
    /** Button variant */
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

    /** Button size */
    size?: 'xs' | 'sm' | 'md' | 'lg';

    /** Left icon */
    leftIcon?: React.ReactNode;

    /** Right icon */
    rightIcon?: React.ReactNode;

    /** Loading state */
    loading?: boolean;

    /** Full width */
    fullWidth?: boolean;

    /** Disable ripple effect */
    disableRipple?: boolean;

    /** Children */
    children?: React.ReactNode;
}

export const EnhancedButton = forwardRef<HTMLButtonElement, EnhancedButtonProps>(
    (
        {
            variant = 'primary',
            size = 'md',
            leftIcon,
            rightIcon,
            loading = false,
            fullWidth = false,
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
            styles.button,
            styles[variant],
            styles[size],
            fullWidth && styles.fullWidth,
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
                {loading && (
                    <span className={styles.spinner}>
                        <Spinner size="sm" />
                    </span>
                )}

                {leftIcon && !loading && (
                    <span className={styles.leftIcon}>{leftIcon}</span>
                )}

                {children && (
                    <span className={styles.content}>{children}</span>
                )}

                {rightIcon && !loading && (
                    <span className={styles.rightIcon}>{rightIcon}</span>
                )}
            </button>
        );
    }
);

EnhancedButton.displayName = 'EnhancedButton';

export default EnhancedButton;
