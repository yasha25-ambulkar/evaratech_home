import Skeleton from './Skeleton';
import styles from './SkeletonCard.module.css';

/**
 * SkeletonCard - Preset skeleton for card layouts
 * 
 * @example
 * ```tsx
 * <SkeletonCard />
 * <SkeletonCard showImage={false} />
 * ```
 */

export interface SkeletonCardProps {
    /** Show image skeleton */
    showImage?: boolean;

    /** Number of description lines */
    lines?: number;

    /** Custom className */
    className?: string;
}

export function SkeletonCard({
    showImage = true,
    lines = 2,
    className = '',
}: SkeletonCardProps) {
    return (
        <div className={`${styles.skeletonCard} ${className}`}>
            {showImage && (
                <Skeleton variant="rounded" width="100%" height={200} animation="wave" />
            )}
            <div className={styles.content}>
                <Skeleton variant="text" width="80%" height={24} />
                <Skeleton variant="text" width="60%" height={16} />
                <Skeleton variant="text" count={lines} />
            </div>
        </div>
    );
}

export default SkeletonCard;
