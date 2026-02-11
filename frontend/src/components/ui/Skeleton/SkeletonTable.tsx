import Skeleton from './Skeleton';
import styles from './SkeletonTable.module.css';

/**
 * SkeletonTable - Preset skeleton for table layouts
 * 
 * @example
 * ```tsx
 * <SkeletonTable rows={5} columns={4} />
 * ```
 */

export interface SkeletonTableProps {
    /** Number of rows */
    rows?: number;

    /** Number of columns */
    columns?: number;

    /** Show header row */
    showHeader?: boolean;

    /** Custom className */
    className?: string;
}

export function SkeletonTable({
    rows = 5,
    columns = 4,
    showHeader = true,
    className = '',
}: SkeletonTableProps) {
    return (
        <div className={`${styles.skeletonTable} ${className}`}>
            {showHeader && (
                <div className={styles.header}>
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <div key={colIndex} className={styles.cell}>
                            <Skeleton variant="text" width="80%" height={16} />
                        </div>
                    ))}
                </div>
            )}
            <div className={styles.body}>
                {Array.from({ length: rows }).map((_, rowIndex) => (
                    <div key={rowIndex} className={styles.row}>
                        {Array.from({ length: columns }).map((_, colIndex) => (
                            <div key={colIndex} className={styles.cell}>
                                <Skeleton variant="text" width="90%" />
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SkeletonTable;
