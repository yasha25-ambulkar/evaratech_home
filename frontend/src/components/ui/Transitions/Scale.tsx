import { useEffect, useState, useRef } from 'react';
import styles from './Scale.module.css';

/**
 * Scale Transition Component
 * Version: 1.0.0
 */

export interface ScaleProps {
    /** Whether the component should be visible */
    in: boolean;

    /** Duration in milliseconds */
    duration?: number;

    /** Delay before animation starts */
    delay?: number;

    /** Initial scale value (0-1) */
    initialScale?: number;

    /** Children to animate */
    children: React.ReactNode;

    /** Unmount children when not visible */
    unmountOnExit?: boolean;

    /** Custom className */
    className?: string;
}

/**
 * Scale - Scale in/out transition component
 * 
 * @example
 * ```tsx
 * <Scale in={isVisible}>
 *   <div>Scales in</div>
 * </Scale>
 * ```
 */
export function Scale({
    in: inProp,
    duration = 300,
    delay = 0,
    initialScale = 0.9,
    children,
    unmountOnExit = false,
    className = '',
}: ScaleProps) {
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

    return (
        <div
            className={`${styles.scale} ${className}`}
            style={{
                transform: isVisible ? 'scale(1)' : `scale(${initialScale})`,
                opacity: isVisible ? 1 : 0,
                transitionDuration: `${duration}ms`,
                transitionDelay: `${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}

export default Scale;
