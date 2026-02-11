import { Children, cloneElement, isValidElement } from 'react';
import styles from './ButtonGroup.module.css';

/**
 * ButtonGroup Component
 * Version: 1.0.0
 * 
 * Groups buttons together with connected styling
 */

export interface ButtonGroupProps {
    /** Orientation */
    orientation?: 'horizontal' | 'vertical';

    /** Size to pass to children */
    size?: 'xs' | 'sm' | 'md' | 'lg';

    /** Variant to pass to children */
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';

    /** Full width */
    fullWidth?: boolean;

    /** Children (buttons) */
    children: React.ReactNode;

    /** Custom className */
    className?: string;
}

export function ButtonGroup({
    orientation = 'horizontal',
    size,
    variant,
    fullWidth = false,
    children,
    className = '',
}: ButtonGroupProps) {
    const groupClass = [
        styles.buttonGroup,
        styles[orientation],
        fullWidth && styles.fullWidth,
        className,
    ]
        .filter(Boolean)
        .join(' ');

    // Clone children and pass size/variant props
    const childrenArray = Children.toArray(children);
    const enhancedChildren = childrenArray.map((child, index) => {
        if (isValidElement(child)) {
            const isFirst = index === 0;
            const isLast = index === childrenArray.length - 1;

            const childClass = [
                child.props.className,
                isFirst && styles.first,
                isLast && styles.last,
                !isFirst && !isLast && styles.middle,
            ]
                .filter(Boolean)
                .join(' ');

            return cloneElement(child as React.ReactElement<any>, {
                size: size || child.props.size,
                variant: variant || child.props.variant,
                className: childClass,
            });
        }
        return child;
    });

    return (
        <div className={groupClass} role="group">
            {enhancedChildren}
        </div>
    );
}

export default ButtonGroup;
