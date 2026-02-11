import { CSSProperties } from 'react';
import styles from './Skeleton.module.css';

/**
 * Skeleton Loader Component
 * Version: 1.0.0
 * 
 * Professional skeleton screen for loading states
 * Integrated with EvaraTech Design System
 */

export interface SkeletonProps {
    /** Shape variant */
    variant?: 'text' | 'circular' | 'rectangular' | 'rounded';

    /** Width (px, %, or CSS value) */
    width?: string | number;

    /** Height (px, %, or CSS value) */
    height?: string | number;

    /** Animation type */
    animation?: 'pulse' | 'wave' | 'none';

    /** Number of skeleton elements to render */
    count?: number;

    /** Custom className */
    className?: string;
}

/**
 * Skeleton - Loading placeholder component
 * 
 * Provides visual feedback during content loading with smooth animations
 * 
 * @example
 * ```tsx
 * // Single text line
 * <Skeleton variant="text" width="60%" />
 * 
 * // Avatar
 * <Skeleton variant="circular" width={40} height={40} />
 * 
 * // Card placeholder
 * <Skeleton variant="rounded" width="100%" height={200} animation="wave" />
 * 
 * // Multiple lines
 * <Skeleton variant="text" count={3} />
 * ```
 */
export function Skeleton({
    variant = 'text',
    width,
    height,
    animation = 'pulse',
    count = 1,
    className = '',
}: SkeletonProps) {
    // Convert numeric values to px
    const getSize = (value?: string | number): string | undefined => {
        if (value === undefined) return undefined;
        return typeof value === 'number' ? `${value}px` : value;
    };

    // Build style object
    const style: CSSProperties = {
        width: getSize(width),
        height: getSize(height),
    };

    // Build className
    const skeletonClass = [
        styles.skeleton,
        styles[variant],
        animation !== 'none' && styles[animation],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    // Render single skeleton
    if (count === 1) {
        return <span className={skeletonClass} style={style} />;
    }

    // Render multiple skeletons
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <span
                    key={index}
                    className={skeletonClass}
                    style={{
                        ...style,
                        display: 'block',
                        marginBottom: index < count - 1 ? 'var(--space-2)' : undefined,
                    }}
                />
            ))}
        </>
    );
}

export default Skeleton;
