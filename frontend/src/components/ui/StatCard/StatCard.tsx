import styles from './StatCard.module.css';

interface StatCardProps {
    icon: string;
    value: string | number;
    label: string;
    percentage?: number;
    trendText?: string;
    trend?: 'up' | 'down' | 'neutral';
    color?: 'blue' | 'green' | 'orange' | 'red';
}

function StatCard({ icon, value, label, percentage, trendText, trend = 'neutral', color = 'blue' }: StatCardProps) {
    const getTrendIcon = () => {
        if (trend === 'up') return '↑';
        if (trend === 'down') return '↓';
        return '→';
    };

    const getTrendClass = () => {
        if (trend === 'up') return styles.trendUp;
        if (trend === 'down') return styles.trendDown;
        return styles.trendNeutral;
    };

    return (
        <div className={`${styles.card} ${styles[color]}`}>
            <div className={styles.icon}>{icon}</div>
            <div className={styles.content}>
                <div className={styles.value}>{value}</div>
                <div className={styles.label}>{label}</div>
                {percentage !== undefined ? (
                    <div className={`${styles.percentage} ${getTrendClass()}`}>
                        <span className={styles.trendIcon}>{getTrendIcon()}</span>
                        {percentage}%
                    </div>
                ) : (
                    trendText && (
                        <div className={`${styles.percentage} ${getTrendClass()}`}>
                            {trendText}
                        </div>
                    )
                )}
            </div>
        </div>
    );
}

export default StatCard;
