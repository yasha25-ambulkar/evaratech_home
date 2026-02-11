import { useEffect, useState, useRef } from 'react';
import styles from './Slide.module.css';

/**
 * Slide Transition Component
 * Version: 1.0.0
 */

export interface SlideProps {
    /** Whether the component should be visible */
    in: boolean;

    /** Slide direction */
    direction?: 'up' | 'down' | 'left' | 'right';

    /** Duration in milliseconds */
    duration?: number;

    /** Delay before animation starts */
    delay?: number;

    /** Distance to slide (px) */
    distance?: number;

    /** Children to animate */
    children: React.ReactNode;

    /** Unmount children when not visible */
    unmountOnExit?: boolean;

    /** Custom className */
    className?: string;
}

/**
 * Slide - Slide in/out transition component
 * 
 * @example
 * ```tsx
 * <Slide direction="up" in={isVisible}>
 *   <div>Slides up</div>
 * </Slide>
 * ```
 */
export function Slide({
    in: inProp,
    direction = 'up',
    duration = 300,
    delay = 0,
    distance = 20,
    children,
    unmountOnExit = false,
    className = '',
}: SlideProps) {
    const [shouldRender, setShouldRender] = useState(inProp);
    const [isVisible, setIsVisible] = useState(false);
    const timeoutRef = useRef<NodeJS.Timeout>();

    useEffect(() => {
        if (inProp) {
            setShouldRender(true);
            timeoutRef.current = setTimeout(() => {
                setIsVisible(true);
            }, delay);
        } else {
            setIsVisible(false);
            if (unmountOnExit) {
                timeoutRef.current = setTimeout(() => {
                    setShouldRender(false);
                }, duration);
            }
        }

        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [inProp, duration, delay, unmountOnExit]);

    if (!shouldRender && unmountOnExit) {
        return null;
    }

    const getTransform = () => {
        if (isVisible) return 'translate(0, 0)';

        switch (direction) {
            case 'up':
                return `translate(0, ${distance}px)`;
            case 'down':
                return `translate(0, -${distance}px)`;
            case 'left':
                return `translate(${distance}px, 0)`;
            case 'right':
                return `translate(-${distance}px, 0)`;
            default:
                return 'translate(0, 0)';
        }
    };

    return (
        <div
            className={`${styles.slide} ${className}`}
            style={{
                transform: getTransform(),
                opacity: isVisible ? 1 : 0,
                transitionDuration: `${duration}ms`,
                transitionDelay: `${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}

export default Slide;
