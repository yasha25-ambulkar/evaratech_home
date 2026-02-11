import styles from './Pagination.module.css';

/**
 * Pagination Component
 * Version: 1.0.0
 * 
 * Pagination with page size selector
 */

export interface PaginationProps {
    /** Current page (1-indexed) */
    currentPage: number;

    /** Total pages */
    totalPages: number;

    /** Page change handler */
    onPageChange: (page: number) => void;

    /** Page size */
    pageSize?: number;

    /** Page size change handler */
    onPageSizeChange?: (size: number) => void;

    /** Page size options */
    pageSizeOptions?: number[];

    /** Total items */
    totalItems?: number;

    /** Show page size selector */
    showPageSize?: boolean;

    /** Custom className */
    className?: string;
}

export function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    pageSize = 10,
    onPageSizeChange,
    pageSizeOptions = [10, 25, 50, 100],
    totalItems,
    showPageSize = true,
    className = '',
}: PaginationProps) {
    const containerClass = [
        styles.pagination,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    // Generate page numbers to display
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 7;

        if (totalPages <= maxVisible) {
            // Show all pages
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            // Show first, last, current, and nearby pages
            pages.push(1);

            if (currentPage > 3) {
                pages.push('...');
            }

            for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
                pages.push(i);
            }

            if (currentPage < totalPages - 2) {
                pages.push('...');
            }

            pages.push(totalPages);
        }

        return pages;
    };

    const pages = getPageNumbers();
    const canGoPrevious = currentPage > 1;
    const canGoNext = currentPage < totalPages;

    return (
        <div className={containerClass}>
            {totalItems !== undefined && (
                <div className={styles.info}>
                    Showing {(currentPage - 1) * pageSize + 1} to {Math.min(currentPage * pageSize, totalItems)} of {totalItems}
                </div>
            )}

            <div className={styles.controls}>
                {/* Previous Button */}
                <button
                    className={`${styles.button} ${styles.navButton}`}
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={!canGoPrevious}
                    aria-label="Previous page"
                >
                    ‹
                </button>

                {/* Page Numbers */}
                {pages.map((page, index) => {
                    if (page === '...') {
                        return (
                            <span key={`ellipsis-${index}`} className={styles.ellipsis}>
                                ...
                            </span>
                        );
                    }

                    const pageNumber = page as number;
                    const isActive = pageNumber === currentPage;

                    return (
                        <button
                            key={pageNumber}
                            className={`${styles.button} ${styles.pageButton} ${isActive ? styles.active : ''}`}
                            onClick={() => onPageChange(pageNumber)}
                            aria-label={`Page ${pageNumber}`}
                            aria-current={isActive ? 'page' : undefined}
                        >
                            {pageNumber}
                        </button>
                    );
                })}

                {/* Next Button */}
                <button
                    className={`${styles.button} ${styles.navButton}`}
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={!canGoNext}
                    aria-label="Next page"
                >
                    ›
                </button>
            </div>

            {/* Page Size Selector */}
            {showPageSize && onPageSizeChange && (
                <div className={styles.pageSize}>
                    <label htmlFor="page-size" className={styles.pageSizeLabel}>
                        Per page:
                    </label>
                    <select
                        id="page-size"
                        className={styles.pageSizeSelect}
                        value={pageSize}
                        onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    >
                        {pageSizeOptions.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </div>
    );
}

export default Pagination;
