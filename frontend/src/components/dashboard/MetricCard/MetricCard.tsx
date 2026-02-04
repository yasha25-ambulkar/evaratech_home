import { useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import GlassCard from '../../ui/card/GlassCard';
import styles from './MetricCard.module.css';

interface MetricCardProps {
    title: string;
    value: number;
    unit?: string; // e.g. "k L", "%"
    subtext?: string;
    icon: string; // FontAwesome class
    color: string; // Hex or CSS var
    trend?: {
        value: number;
        isUp: boolean;
    };
    progress?: number; // 0-100
    onClick?: () => void;
}

function NumberCounter({ value }: { value: number }) {
    const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
    const display = useTransform(spring, (current) => Math.round(current).toLocaleString());

    useEffect(() => {
        spring.set(value);
    }, [value, spring]);

    return <motion.span>{display}</motion.span>;
}

export default function MetricCard({
    title,
    value,
    unit,
    subtext,
    icon,
    color,
    trend,
    progress,
    onClick
}: MetricCardProps) {

    // Determine background color for icon bubble based on prop color
    // We assume color is like var(--color-primary-500) or a hex
    // For simplicity, we'll use inline styles with opacity for bg

    return (
        <GlassCard
            variant="interactive"
            className={styles.card}
            onClick={onClick}
        >
            <div className={styles.header}>
                <div
                    className={styles.iconBubble}
                    style={{
                        color: color,
                        backgroundColor: `${color} 15` // 10% opacity roughly if hex, might fail if var. 
                        // Better approach: use a mapping or specific prop. 
                        // For now, let's assume we pass full style or just use 'color' for text and a generic light bg 
                    }}
                >
                    {/* If color starts with var, we can't easily add opacity. We'll use a trick or just simple bg */}
                    <i className={icon} style={{ color }}></i>
                    {/* Background layer */}
                    <div className={styles.iconBg} style={{ background: color, opacity: 0.1 }} />
                </div>

                {trend && (
                    <div className={`${styles.trend} ${trend.isUp ? styles.up : styles.down} `}>
                        <i className={`fas fa - arrow - ${trend.isUp ? 'up' : 'down'} `}></i>
                        {trend.value}%
                    </div>
                )}
            </div>

            <div className={styles.content}>
                <h3 className={styles.title}>{title}</h3>
                <div className={styles.valueRow}>
                    <div className={styles.value}>
                        <NumberCounter value={value} />
                        {unit && <span className={styles.unit}>{unit}</span>}
                    </div>
                </div>

                {progress !== undefined && (
                    <div className={styles.progressContainer}>
                        <motion.div
                            className={styles.progressBar}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}% ` }}
                            transition={{ duration: 1, ease: "easeOut" }}
                            style={{ background: color }}
                        />
                    </div>
                )}

                {subtext && <p className={styles.subtext}>{subtext}</p>}
            </div>
        </GlassCard>
    );
}
