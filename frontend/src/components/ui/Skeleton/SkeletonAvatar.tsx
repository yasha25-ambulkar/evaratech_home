import Skeleton from './Skeleton';
import styles from './SkeletonAvatar.module.css';

/**
 * SkeletonAvatar - Preset skeleton for avatar with text
 * 
 * @example
 * ```tsx
 * <SkeletonAvatar />
 * <SkeletonAvatar size={64} showSubtext />
 * ```
 */

export interface SkeletonAvatarProps {
    /** Avatar size */
    size?: number;

    /** Show subtext line */
    showSubtext?: boolean;

    /** Layout direction */
    direction?: 'horizontal' | 'vertical';

    /** Custom className */
    className?: string;
}

export function SkeletonAvatar({
    size = 48,
    showSubtext = false,
    direction = 'horizontal',
    className = '',
}: SkeletonAvatarProps) {
    const containerClass = [
        styles.skeletonAvatar,
        styles[direction],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={containerClass}>
            <Skeleton
                variant="circular"
                width={size}
                height={size}
                animation="wave"
            />
            <div className={styles.text}>
                <Skeleton variant="text" width="120px" height={16} />
                {showSubtext && (
                    <Skeleton variant="text" width="80px" height={14} />
                )}
            </div>
        </div>
    );
}

export default SkeletonAvatar;
