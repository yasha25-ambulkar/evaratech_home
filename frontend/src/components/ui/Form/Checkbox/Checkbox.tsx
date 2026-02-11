import { forwardRef } from 'react';
import styles from './Checkbox.module.css';

/**
 * Checkbox Component
 * Version: 1.0.0
 * 
 * Checkbox with custom styling and animations
 */

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
    /** Checked state */
    checked?: boolean;

    /** Change handler */
    onChange?: (checked: boolean) => void;

    /** Label text */
    label?: string;

    /** Size variant */
    size?: 'sm' | 'md' | 'lg';

    /** Indeterminate state */
    indeterminate?: boolean;

    /** Error state */
    error?: boolean;

    /** Helper text */
    helperText?: string;

    /** Custom className */
    className?: string;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    (
        {
            checked = false,
            onChange,
            label,
            size = 'md',
            indeterminate = false,
            error = false,
            helperText,
            disabled = false,
            className = '',
            ...rest
        },
        ref
    ) => {
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(e.target.checked);
        };

        const containerClass = [
            styles.container,
            className,
        ]
            .filter(Boolean)
            .join(' ');

        const checkboxClass = [
            styles.checkbox,
            styles[size],
            checked && styles.checked,
            indeterminate && styles.indeterminate,
            error && styles.error,
            disabled && styles.disabled,
        ]
            .filter(Boolean)
            .join(' ');

        const labelClass = [
            styles.label,
            disabled && styles.disabled,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div className={containerClass}>
                <label className={styles.wrapper}>
                    <input
                        ref={ref}
                        type="checkbox"
                        checked={checked}
                        onChange={handleChange}
                        disabled={disabled}
                        className={styles.input}
                        aria-invalid={error}
                        {...rest}
                    />

                    <span className={checkboxClass}>
                        {indeterminate ? (
                            <svg className={styles.icon} viewBox="0 0 16 16" fill="none">
                                <path d="M4 8h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        ) : checked ? (
                            <svg className={styles.icon} viewBox="0 0 16 16" fill="none">
                                <path d="M3 8l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        ) : null}
                    </span>

                    {label && <span className={labelClass}>{label}</span>}
                </label>

                {helperText && (
                    <span className={`${styles.helperText} ${error ? styles.errorText : ''}`}>
                        {helperText}
                    </span>
                )}
            </div>
        );
    }
);

Checkbox.displayName = 'Checkbox';

export default Checkbox;
