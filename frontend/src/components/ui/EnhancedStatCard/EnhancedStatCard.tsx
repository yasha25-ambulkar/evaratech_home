import { motion } from 'framer-motion';
import { ReactNode, useMemo } from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import EnhancedCard from '../EnhancedCard/EnhancedCard';
import styles from './EnhancedStatCard.module.css';

export interface TrendData {
    /** Trend value (percentage) */
    value: number;
    /** Is trend positive */
    isUp: boolean;
    /** Optional comparison text */
    text?: string;
}

export interface EnhancedStatCardProps {
    /** Stat title/label */
    title: string;

    /** Primary value to display */
    value: string | number;

    /** Optional icon component */
    icon?: ReactNode;

    /** Trend data for comparison */
    trend?: TrendData;

    /** Optional subtitle */
    subtitle?: string;

    /** Color theme */
    color?: 'blue' | 'green' | 'orange' | 'red' | 'purple' | 'gray' | 'primary' | 'success' | 'warning' | 'error';

    /** Card size */
    size?: 'sm' | 'md' | 'lg';

    /** Card variant */
    variant?: 'base' | 'elevated' | 'glass' | 'solid';

    /** Loading state */
    loading?: boolean;

    /** Progress bar (0-100) */
    progress?: number;

    /** Click handler */
    onClick?: () => void;

    /** Custom className */
    className?: string;

    /** Sparkline data for mini chart */
    sparklineData?: number[];

    /** Format function for value */
    formatValue?: (value: string | number) => string;
}

/**
 * EnhancedStatCard - Premium card component for displaying metrics
 * 
 * Features:
 * - Trend indicators with up/down/neutral states
 * - Animated value changes
 * - Optional sparkline charts
 * - Color-coded themes
 * - Progress bars
 * - Icon support
 * - Loading states
 * - Fully accessible
 * 
 * @example
 * ```tsx
 * <EnhancedStatCard
 *   title="Total Revenue"
 *   value="$45,231"
 *   trend={{ value: 12.5, isUp: true, text: 'vs last month' }}
 *   color="success"
 *   icon={<DollarIcon />}
 *   sparklineData={[10, 20, 15, 30, 25, 40, 35]}
 * />
 * ```
 */
function EnhancedStatCard({
    title,
    value,
    icon,
    trend,
    subtitle,
    color = 'blue',
    size = 'md',
    variant = 'elevated',
    loading = false,
    progress,
    onClick,
    className = '',
    sparklineData,
    formatValue
}: EnhancedStatCardProps) {
    const formattedValue = formatValue ? formatValue(value) : value;

    const trendIcon = useMemo(() => {
        if (!trend) return null;
        if (trend.isUp) return <TrendingUp size={16} />;
        if (trend.value < 0) return <TrendingDown size={16} />;
        return <Minus size={16} />;
    }, [trend]);

    const trendClass = useMemo(() => {
        if (!trend) return '';
        if (trend.isUp) return styles.trendUp;
        if (trend.value < 0) return styles.trendDown;
        return styles.trendNeutral;
    }, [trend]);

    return (
        <EnhancedCard
            variant={variant}
            size={size}
            className={`${styles.statCard} ${styles[color]} ${onClick ? styles.clickable : ''} ${className}`}
            loading={loading}
            clickable={!!onClick}
            onClick={onClick}
            aria-label={`${title}: ${formattedValue}`}
        >
            {/* Progress Bar Background */}
            {progress !== undefined && (
                <div className={styles.progressBackground}>
                    <motion.div
                        className={styles.progressBar}
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                    />
                </div>
            )}

            {/* Card Content */}
            <div className={styles.content}>
                {/* Header with Icon */}
                <div className={styles.header}>
                    {icon && (
                        <div className={styles.iconContainer}>
                            {icon}
                        </div>
                    )}
                    {trend && (
                        <div className={`${styles.trend} ${trendClass}`}>
                            {trendIcon}
                            <span className={styles.trendValue}>
                                {Math.abs(trend.value)}%
                            </span>
                        </div>
                    )}
                </div>

                {/* Main Content */}
                <div className={styles.main}>
                    <div className={styles.valueContainer}>
                        <motion.div
                            className={styles.value}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            key={formattedValue.toString()}
                        >
                            {formattedValue}
                        </motion.div>
                        {subtitle && (
                            <div className={styles.subtitle}>{subtitle}</div>
                        )}
                    </div>

                    <div className={styles.title}>{title}</div>
                </div>

                {/* Additional Info */}
                {trend?.text && (
                    <div className={styles.trendText}>{trend.text}</div>
                )}

                {/* Sparkline Chart */}
                {sparklineData && sparklineData.length > 0 && (
                    <div className={styles.sparkline}>
                        <svg
                            viewBox="0 0 100 30"
                            preserveAspectRatio="none"
                            className={styles.sparklineSvg}
                            aria-hidden="true"
                        >
                            <polyline
                                points={sparklineData
                                    .map((val, index) => {
                                        const x = (index / (sparklineData.length - 1)) * 100;
                                        const max = Math.max(...sparklineData);
                                        const min = Math.min(...sparklineData);
                                        const y = 30 - ((val - min) / (max - min)) * 30;
                                        return `${x},${y}`;
                                    })
                                    .join(' ')}
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                )}
            </div>

            {/* Animated Background Effect */}
            <div className={styles.backgroundEffect} />
        </EnhancedCard>
    );
}

export default EnhancedStatCard;
export { EnhancedStatCard };

