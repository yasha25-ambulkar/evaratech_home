import { useState, useRef, forwardRef, useEffect } from 'react';
import styles from './TextArea.module.css';

/**
 * TextArea Component
 * Version: 1.0.0
 * 
 * Auto-resizing textarea with character counter
 */

export interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
    /** Value */
    value?: string;

    /** Change handler */
    onChange?: (value: string) => void;

    /** Label */
    label?: string;

    /** Helper text */
    helperText?: string;

    /** Error message */
    error?: string;

    /** Validation state */
    state?: 'default' | 'error' | 'success' | 'warning';

    /** Auto-resize */
    autoResize?: boolean;

    /** Min height (px) */
    minHeight?: number;

    /** Max height (px) */
    maxHeight?: number;

    /** Show character count */
    showCount?: boolean;

    /** Resize handle */
    resize?: 'none' | 'vertical' | 'both';

    /** Custom className */
    className?: string;
}

export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
    (
        {
            value = '',
            onChange,
            label,
            helperText,
            error,
            state = 'default',
            autoResize = false,
            minHeight = 80,
            maxHeight,
            showCount = false,
            resize = 'vertical',
            maxLength,
            disabled = false,
            readOnly = false,
            required = false,
            rows = 3,
            className = '',
            ...rest
        },
        ref
    ) => {
        const [isFocused, setIsFocused] = useState(false);
        const textareaRef = useRef<HTMLTextAreaElement>(null);

        // Combine refs
        useEffect(() => {
            if (ref) {
                if (typeof ref === 'function') {
                    ref(textareaRef.current);
                } else {
                    ref.current = textareaRef.current;
                }
            }
        }, [ref]);

        // Auto-resize functionality
        useEffect(() => {
            if (autoResize && textareaRef.current) {
                const textarea = textareaRef.current;
                textarea.style.height = 'auto';
                const scrollHeight = textarea.scrollHeight;

                let newHeight = scrollHeight;
                if (minHeight) newHeight = Math.max(newHeight, minHeight);
                if (maxHeight) newHeight = Math.min(newHeight, maxHeight);

                textarea.style.height = `${newHeight}px`;
            }
        }, [value, autoResize, minHeight, maxHeight]);

        const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            onChange?.(e.target.value);
        };

        const actualState = error ? 'error' : state;
        const displayMessage = error || helperText;

        const containerClass = [
            styles.container,
            className,
        ]
            .filter(Boolean)
            .join(' ');

        const textareaWrapperClass = [
            styles.textareaWrapper,
            styles[actualState],
            isFocused && styles.focused,
            disabled && styles.disabled,
            readOnly && styles.readonly,
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

        const textareaStyle: React.CSSProperties = {
            minHeight: autoResize ? `${minHeight}px` : undefined,
            maxHeight: maxHeight ? `${maxHeight}px` : undefined,
            resize: autoResize ? 'none' : resize,
        };

        return (
            <div className={containerClass}>
                {label && (
                    <label className={labelClass}>
                        {label}
                        {required && <span className={styles.asterisk}>*</span>}
                    </label>
                )}

                <div className={textareaWrapperClass}>
                    <textarea
                        ref={textareaRef}
                        value={value}
                        onChange={handleChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        disabled={disabled}
                        readOnly={readOnly}
                        maxLength={maxLength}
                        rows={rows}
                        className={styles.textarea}
                        style={textareaStyle}
                        aria-invalid={actualState === 'error'}
                        aria-describedby={displayMessage ? `${rest.id}-message` : undefined}
                        {...rest}
                    />
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

TextArea.displayName = 'TextArea';

export default TextArea;
