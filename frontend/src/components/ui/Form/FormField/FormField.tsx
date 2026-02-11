import styles from './FormField.module.css';

/**
 * FormField Component
 * Version: 1.0.0
 * 
 * Wrapper component for form inputs with label, error, and helper text
 */

export interface FormFieldProps {
    /** Label text */
    label?: string;

    /** Required indicator */
    required?: boolean;

    /** Error message */
    error?: string;

    /** Helper text */
    helperText?: string;

    /** Field ID for label association */
    htmlFor?: string;

    /** Children (input component) */
    children: React.ReactNode;

    /** Custom className */
    className?: string;
}

export function FormField({
    label,
    required = false,
    error,
    helperText,
    htmlFor,
    children,
    className = '',
}: FormFieldProps) {
    const displayMessage = error || helperText;

    const containerClass = [
        styles.container,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    const labelClass = [
        styles.label,
        required && styles.required,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={containerClass}>
            {label && (
                <label htmlFor={htmlFor} className={labelClass}>
                    {label}
                    {required && <span className={styles.asterisk}>*</span>}
                </label>
            )}

            {children}

            {displayMessage && (
                <span className={`${styles.message} ${error ? styles.errorMessage : styles.helperMessage}`}>
                    {displayMessage}
                </span>
            )}
        </div>
    );
}

export default FormField;
