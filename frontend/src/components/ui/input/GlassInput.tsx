import { InputHTMLAttributes } from 'react';
import styles from './GlassInput.module.css';

interface GlassInputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: string;
    label?: string;
}

export default function GlassInput({ icon, label, className = '', ...props }: GlassInputProps) {
    return (
        <div className={styles.wrapper}>
            {label && <label className={styles.label}>{label}</label>}
            <div className={styles.inputContainer}>
                {icon && <i className={`${icon} ${styles.icon}`}></i>}
                <input
                    className={`${styles.input} ${icon ? styles.hasIcon : ''} ${className}`}
                    {...props}
                />
            </div>
        </div>
    );
}
