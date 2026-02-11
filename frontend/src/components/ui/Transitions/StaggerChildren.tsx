import { Children, cloneElement, isValidElement } from 'react';

/**
 * StaggerChildren Component
 * Version: 1.0.0
 */

export interface StaggerChildrenProps {
    /** Delay between each child (ms) */
    stagger?: number;

    /** Initial delay before first child (ms) */
    initialDelay?: number;

    /** Children to stagger */
    children: React.ReactNode;

    /** Custom className */
    className?: string;
}

/**
 * StaggerChildren - Staggers animation of child components
 * 
 * Adds incremental delays to children for staggered entrance animations
 * 
 * @example
 * ```tsx
 * <StaggerChildren stagger={50}>
 *   <div>Item 1</div> // Delay: 0ms
 *   <div>Item 2</div> // Delay: 50ms
 *   <div>Item 3</div> // Delay: 100ms
 * </StaggerChildren>
 * ```
 */
export function StaggerChildren({
    stagger = 50,
    initialDelay = 0,
    children,
    className = '',
}: StaggerChildrenProps) {
    const childArray = Children.toArray(children);

    return (
        <div className={className}>
            {childArray.map((child, index) => {
                const delay = initialDelay + index * stagger;

                if (isValidElement(child)) {
                    return cloneElement(child, {
                        ...child.props,
                        style: {
                            ...child.props.style,
                            animationDelay: `${delay}ms`,
                            transitionDelay: `${delay}ms`,
                        },
                        key: child.key || index,
                    } as any);
                }

                return child;
            })}
        </div>
    );
}

export default StaggerChildren;
