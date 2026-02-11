import { Fragment } from 'react';
import styles from './Breadcrumbs.module.css';

/**
 * Breadcrumbs Component
 * Version: 1.0.0
 * 
 * Navigation breadcrumbs with auto-collapse
 */

export interface BreadcrumbItem {
    /** Label text */
    label: string;

    /** Link href (optional for current page) */
    href?: string;

    /** Click handler */
    onClick?: () => void;
}

export interface BreadcrumbsProps {
    /** Breadcrumb items */
    items: BreadcrumbItem[];

    /** Separator */
    separator?: React.ReactNode;

    /** Max items before collapse */
    maxItems?: number;

    /** Custom className */
    className?: string;
}

export function Breadcrumbs({
    items,
    separator = '/',
    maxItems = 5,
    className = '',
}: BreadcrumbsProps) {
    const containerClass = [
        styles.breadcrumbs,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    // Auto-collapse logic
    const shouldCollapse = items.length > maxItems;
    let displayItems = items;

    if (shouldCollapse) {
        // Show first, ellipsis, and last items
        const firstItem = items[0];
        const lastItems = items.slice(-(maxItems - 2));
        displayItems = [firstItem, { label: '...', href: undefined }, ...lastItems];
    }

    return (
        <nav aria-label="Breadcrumb" className={containerClass}>
            <ol className={styles.list}>
                {displayItems.map((item, index) => {
                    const isLast = index === displayItems.length - 1;
                    const isEllipsis = item.label === '...';

                    return (
                        <Fragment key={index}>
                            <li className={styles.item}>
                                {isEllipsis ? (
                                    <span className={styles.ellipsis}>{item.label}</span>
                                ) : isLast ? (
                                    <span className={styles.current} aria-current="page">
                                        {item.label}
                                    </span>
                                ) : item.href ? (
                                    <a
                                        href={item.href}
                                        className={styles.link}
                                        onClick={(e) => {
                                            if (item.onClick) {
                                                e.preventDefault();
                                                item.onClick();
                                            }
                                        }}
                                    >
                                        {item.label}
                                    </a>
                                ) : (
                                    <button
                                        type="button"
                                        className={styles.button}
                                        onClick={item.onClick}
                                    >
                                        {item.label}
                                    </button>
                                )}
                            </li>

                            {!isLast && (
                                <li className={styles.separator} aria-hidden="true">
                                    {separator}
                                </li>
                            )}
                        </Fragment>
                    );
                })}
            </ol>
        </nav>
    );
}

export default Breadcrumbs;
