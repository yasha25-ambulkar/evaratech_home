import React from 'react';
import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg';
    color?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ size = 'md', color = 'var(--accent-blue)' }) => {
    return (
        <div className={`${styles.spinnerContainer} ${styles[size]}`}>
            <div
                className={styles.spinner}
                style={{ borderTopColor: color, borderLeftColor: color }}
            />
        </div>
    );
};

export default LoadingSpinner;
