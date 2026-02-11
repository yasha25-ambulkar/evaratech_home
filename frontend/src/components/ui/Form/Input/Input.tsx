import { useState, useRef, forwardRef, useEffect } from 'react';
import styles from './Input.module.css';

/**
 * Input Component
 * Version: 1.0.0
 * 
 * Professional input field with validation, icons, and animations
 */

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'onChange'> {
    /** Input type */
    type?: 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';

    /** Size variant */
    size?: 'sm' | 'md' | 'lg';

    /** Validation state */
    state?: 'default' | 'error' | 'success' | 'warning';

    /** Input value */
    value?: string;

    /** Change handler */
    onChange?: (value: string) => void;

    /** Label text */
    label?: string;

    /** Helper text */
    helperText?: string;

    /** Error message */
    error?: string;

    /** Prefix icon */
    prefixIcon?: React.ReactNode;

    /** Suffix icon */
    suffixIcon?: React.ReactNode;

    /** Show clear button */
    clearable?: boolean;

    /** Show character count */
    showCount?: boolean;

    /** Custom className */
    className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    (
        {
            type = 'text',
            size = 'md',
            state = 'default',
            value = '',
            onChange,
            label,
            helperText,
            error,
            prefixIcon,
            suffixIcon,
            clearable = false,
            showCount = false,
            maxLength,
            disabled = false,
            readOnly = false,
            required = false,
            className = '',
            ...rest
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const [showPassword, setShowPassword] = useState(false);
        const inputRef = useRef<HTMLInputElement>(null);

        // Combine refs
        useEffect(() => {
            if (ref) {
                if (typeof ref === 'function') {
                    ref(inputRef.current);
                } else {
                    ref.current = inputRef.current;
                }
            }
        }, [ref]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            onChange?.(e.target.value);
        };

        const handleClear = () => {
            onChange?.('');
            inputRef.current?.focus();
        };

        const togglePasswordVisibility = () => {
            setShowPassword(!showPassword);
        };

        const actualState = error ? 'error' : state;
        const displayMessage = error || helperText;
        const hasValue = value.length > 0;
        const showClearButton = clearable && hasValue && !disabled && !readOnly;
        const inputType = type === 'password' && showPassword ? 'text' : type;

        const containerClass = [
            styles.container,
            className,
        ]
            .filter(Boolean)
            .join(' ');

        const inputWrapperClass = [
            styles.inputWrapper,
            styles[size],
            styles[actualState],
            isFocused && styles.focused,
            disabled && styles.disabled,
            readOnly && styles.readonly,
            prefixIcon && styles.hasPrefix,
            (suffixIcon || showClearButton || type === 'password') && styles.hasSuffix,
        ]
            .filter(Boolean)
            .join(' ');

        const labelClass = [
            styles.label,
            required && styles.required,
            disabled && styles.disabled,
        ]
            .filter(Boolean)
            .join(' ');

        return (
            <div className={containerClass}>
                {label && (
                    <label className={labelClass}>
                        {label}
                        {required && <span className={styles.asterisk}>*</span>}
                    </label>
                )}

                <div className={inputWrapperClass}>
                    {prefixIcon && (
                        <span className={styles.prefixIcon}>{prefixIcon}</span>
                    )}

                    <input
                        ref={inputRef}
                        type={inputType}
                        value={value}
                        onChange={handleChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        disabled={disabled}
                        readOnly={readOnly}
                        maxLength={maxLength}
                        className={styles.input}
                        aria-invalid={actualState === 'error'}
                        aria-describedby={displayMessage ? `${rest.id}-message` : undefined}
                        {...rest}
                    />

                    <div className={styles.suffixContainer}>
                        {showClearButton && (
                            <button
                                type="button"
                                className={styles.clearButton}
                                onClick={handleClear}
                                tabIndex={-1}
                                aria-label="Clear input"
                            >
                                ✕
                            </button>
                        )}

                        {type === 'password' && (
                            <button
                                type="button"
                                className={styles.passwordToggle}
                                onClick={togglePasswordVisibility}
                                tabIndex={-1}
                                aria-label={showPassword ? 'Hide password' : 'Show password'}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        )}

                        {suffixIcon && (
                            <span className={styles.suffixIcon}>{suffixIcon}</span>
                        )}
                    </div>
                </div>

                {(displayMessage || showCount) && (
                    <div className={styles.footer}>
                        {displayMessage && (
                            <span
                                id={`${rest.id}-message`}
                                className={`${styles.message} ${actualState === 'error' ? styles.errorMessage : styles.helperMessage}`}
                            >
                                {displayMessage}
                            </span>
                        )}

                        {showCount && maxLength && (
                            <span className={styles.counter}>
                                {value.length}/{maxLength}
                            </span>
                        )}
                    </div>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export default Input;
