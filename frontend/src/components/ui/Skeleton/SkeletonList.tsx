import Skeleton from './Skeleton';
import styles from './SkeletonList.module.css';

/**
 * SkeletonList - Preset skeleton for list layouts
 * 
 * @example
 * ```tsx
 * <SkeletonList items={5} />
 * <SkeletonList items={3} showAvatar={false} />
 * ```
 */

export interface SkeletonListProps {
    /** Number of list items */
    items?: number;

    /** Show avatar/icon */
    showAvatar?: boolean;

    /** Avatar size */
    avatarSize?: number;

    /** Number of text lines per item */
    lines?: number;

    /** Custom className */
    className?: string;
}

export function SkeletonList({
    items = 3,
    showAvatar = true,
    avatarSize = 48,
    lines = 2,
    className = '',
}: SkeletonListProps) {
    return (
        <div className={`${styles.skeletonList} ${className}`}>
            {Array.from({ length: items }).map((_, index) => (
                <div key={index} className={styles.listItem}>
                    {showAvatar && (
                        <Skeleton
                            variant="circular"
                            width={avatarSize}
                            height={avatarSize}
                            animation="wave"
                        />
                    )}
                    <div className={styles.content}>
                        <Skeleton variant="text" width="70%" height={16} />
                        {lines > 1 && (
                            <Skeleton variant="text" width="50%" height={14} />
                        )}
                        {lines > 2 && (
                            <Skeleton variant="text" width="60%" height={14} />
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}

export default SkeletonList;
