import { ReactNode } from 'react';
import styles from './Badge.module.css';

interface BadgeProps {
    variant?: 'normal' | 'critical' | 'warning';
    children: ReactNode;
}

function Badge({ variant = 'normal', children }: BadgeProps) {
    return (
        <span className={`${styles.badge} ${styles[variant]}`}>
            {children}
        </span>
    );
}

export default Badge;
