import styles from './LoadingSpinner.module.css';

interface LoadingSpinnerProps {
    message?: string;
    size?: 'small' | 'medium' | 'large';
}

function LoadingSpinner({ message = 'Loading...', size = 'medium' }: LoadingSpinnerProps) {
    return (
        <div className={styles.container}>
            <div className={`${styles.spinner} ${styles[size]}`}></div>
            {message && <p className={styles.message}>{message}</p>}
        </div>
    );
}

export default LoadingSpinner;
