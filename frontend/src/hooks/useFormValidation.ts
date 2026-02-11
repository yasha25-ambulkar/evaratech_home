import { useState, useCallback } from 'react';

/**
 * useFormValidation Hook
 * Version: 1.0.0
 * 
 * Form validation with built-in rules and error handling
 */

export interface ValidationRule {
    required?: boolean | string;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    email?: boolean;
    url?: boolean;
    phone?: boolean;
    min?: number;
    max?: number;
    custom?: (value: any) => string | undefined;
}

export interface FormValidation<T extends Record<string, any>> {
    values: T;
    errors: Record<keyof T, string>;
    touched: Record<keyof T, boolean>;
    isValid: boolean;
    validate: (field?: keyof T) => boolean;
    setFieldValue: (field: keyof T, value: any) => void;
    setFieldTouched: (field: keyof T, touched?: boolean) => void;
    setFieldError: (field: keyof T, error: string) => void;
    reset: () => void;
    handleSubmit: (onSubmit: (values: T) => void | Promise<void>) => (e?: React.FormEvent) => Promise<void>;
}

/**
 * Validation helper functions
 */
const validators = {
    email: (value: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? undefined : 'Invalid email address';
    },

    url: (value: string) => {
        try {
            new URL(value);
            return undefined;
        } catch {
            return 'Invalid URL';
        }
    },

    phone: (value: string) => {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(value) && value.replace(/\D/g, '').length >= 10
            ? undefined
            : 'Invalid phone number';
    },
};

/**
 * useFormValidation - Form validation hook
 * 
 * @example
 * ```tsx
 * const form = useFormValidation(
 *   { email: '', password: '' },
 *   {
 *     email: { required: true, email: true },
 *     password: { required: true, minLength: 8 },
 *   }
 * );
 * 
 * <Input
 *   value={form.values.email}
 *   onChange={(v) => form.setFieldValue('email', v)}
 *   error={form.touched.email ? form.errors.email : undefined}
 * />
 * ```
 */
export function useFormValidation<T extends Record<string, any>>(
    initialValues: T,
    rules: Partial<Record<keyof T, ValidationRule>>
): FormValidation<T> {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Record<keyof T, string>>({} as Record<keyof T, string>);
    const [touched, setTouched] = useState<Record<keyof T, boolean>>({} as Record<keyof T, boolean>);

    const validateField = useCallback(
        (field: keyof T, value: any): string => {
            const rule = rules[field];
            if (!rule) return '';

            // Required validation
            if (rule.required) {
                if (value === undefined || value === null || value === '') {
                    return typeof rule.required === 'string' ? rule.required : 'This field is required';
                }
            }

            // Skip other validations if empty and not required
            if (value === '' || value === undefined || value === null) {
                return '';
            }

            // Min length
            if (rule.minLength && String(value).length < rule.minLength) {
                return `Minimum length is ${rule.minLength} characters`;
            }

            // Max length
            if (rule.maxLength && String(value).length > rule.maxLength) {
                return `Maximum length is ${rule.maxLength} characters`;
            }

            // Min value (for numbers)
            if (rule.min !== undefined && Number(value) < rule.min) {
                return `Minimum value is ${rule.min}`;
            }

            // Max value (for numbers)
            if (rule.max !== undefined && Number(value) > rule.max) {
                return `Maximum value is ${rule.max}`;
            }

            // Email validation
            if (rule.email) {
                const error = validators.email(String(value));
                if (error) return error;
            }

            // URL validation
            if (rule.url) {
                const error = validators.url(String(value));
                if (error) return error;
            }

            // Phone validation
            if (rule.phone) {
                const error = validators.phone(String(value));
                if (error) return error;
            }

            // Pattern validation
            if (rule.pattern && !rule.pattern.test(String(value))) {
                return 'Invalid format';
            }

            // Custom validation
            if (rule.custom) {
                const error = rule.custom(value);
                if (error) return error;
            }

            return '';
        },
        [rules]
    );

    const validate = useCallback(
        (field?: keyof T): boolean => {
            if (field) {
                // Validate single field
                const error = validateField(field, values[field]);
                setErrors((prev) => ({ ...prev, [field]: error }));
                return !error;
            } else {
                // Validate all fields
                const newErrors: Record<keyof T, string> = {} as Record<keyof T, string>;
                let isValid = true;

                (Object.keys(rules) as Array<keyof T>).forEach((key) => {
                    const error = validateField(key, values[key]);
                    newErrors[key] = error;
                    if (error) isValid = false;
                });

                setErrors(newErrors);
                return isValid;
            }
        },
        [values, validateField, rules]
    );

    const setFieldValue = useCallback((field: keyof T, value: any) => {
        setValues((prev) => ({ ...prev, [field]: value }));

        // Auto-validate on change if field has been touched
        setTouched((prevTouched) => {
            if (prevTouched[field]) {
                const error = validateField(field, value);
                setErrors((prev) => ({ ...prev, [field]: error }));
            }
            return prevTouched;
        });
    }, [validateField]);

    const setFieldTouched = useCallback((field: keyof T, isTouched: boolean = true) => {
        setTouched((prev) => ({ ...prev, [field]: isTouched }));

        if (isTouched) {
            // Validate on touch
            const error = validateField(field, values[field]);
            setErrors((prev) => ({ ...prev, [field]: error }));
        }
    }, [values, validateField]);

    const setFieldError = useCallback((field: keyof T, error: string) => {
        setErrors((prev) => ({ ...prev, [field]: error }));
    }, []);

    const reset = useCallback(() => {
        setValues(initialValues);
        setErrors({} as Record<keyof T, string>);
        setTouched({} as Record<keyof T, boolean>);
    }, [initialValues]);

    const handleSubmit = useCallback(
        (onSubmit: (values: T) => void | Promise<void>) => {
            return async (e?: React.FormEvent) => {
                if (e) {
                    e.preventDefault();
                }

                // Mark all fields as touched
                const allTouched = Object.keys(rules).reduce((acc, key) => {
                    acc[key as keyof T] = true;
                    return acc;
                }, {} as Record<keyof T, boolean>);
                setTouched(allTouched);

                // Validate all fields
                if (validate()) {
                    await onSubmit(values);
                }
            };
        },
        [values, validate, rules]
    );

    const isValid = Object.values(errors).every((error) => !error);

    return {
        values,
        errors,
        touched,
        isValid,
        validate,
        setFieldValue,
        setFieldTouched,
        setFieldError,
        reset,
        handleSubmit,
    };
}

export default useFormValidation;
