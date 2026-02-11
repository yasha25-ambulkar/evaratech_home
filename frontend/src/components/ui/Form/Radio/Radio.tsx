import { forwardRef } from 'react';
import styles from './Radio.module.css';

/**
 * Radio Component
 * Version: 1.0.0
 * 
 * Radio button with custom styling and animations
 */

export interface RadioProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
    /** Selected value */
    value?: string;

    /** Change handler */
    onChange?: (value: string) => void;

    /** Radio value */
    radioValue: string;

    /** Label */
    label?: string;

    /** Size */
    size?: 'sm' | 'md' | 'lg';

    /** Error state */
    error?: boolean;

    /** Helper text */
    helperText?: string;

    /** Custom className */
    className?: string;
}

export const Radio = forwardRef<HTMLInputElement, RadioProps>(
    (
        {
            value,
            onChange,
            radioValue,
            label,
            size = 'md',
            error = false,
            helperText,
            disabled = false,
            className = '',
            ...rest
        },
        ref
    ) => {
        const checked = value === radioValue;

        const handleChange = () => {
            if (!disabled) {
                onChange?.(radioValue);
            }
        };

        const containerClass = [
            styles.container,
            className,
        ]
            .filter(Boolean)
            .join(' ');

        const radioClass = [
            styles.radio,
            styles[size],
            checked && styles.checked,
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
                        type="radio"
                        checked={checked}
                        onChange={handleChange}
                        disabled={disabled}
                        value={radioValue}
                        className={styles.input}
                        aria-invalid={error}
                        {...rest}
                    />

                    <span className={radioClass}>
                        {checked && <span className={styles.dot} />}
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

Radio.displayName = 'Radio';

export default Radio;
