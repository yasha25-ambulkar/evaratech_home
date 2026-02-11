import { useEffect, useState, useRef } from 'react';
import styles from './Fade.module.css';

/**
 * Fade Transition Component
 * Version: 1.0.0
 */

export interface FadeProps {
    /** Whether the component should be visible */
    in: boolean;

    /** Duration in milliseconds */
    duration?: number;

    /** Delay before animation starts */
    delay?: number;

    /** Children to animate */
    children: React.ReactNode;

    /** Unmount children when not visible */
    unmountOnExit?: boolean;

    /** Custom className */
    className?: string;
}

/**
 * Fade - Fade in/out transition component
 * 
 * @example
 * ```tsx
 * <Fade in={isVisible} duration={300}>
 *   <div>Content</div>
 * </Fade>
 * ```
 */
export function Fade({
    in: inProp,
    duration = 300,
    delay = 0,
    children,
    unmountOnExit = false,
    className = '',
}: FadeProps) {
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
            className={`${styles.fade} ${isVisible ? styles.visible : ''} ${className}`}
            style={{
                transitionDuration: `${duration}ms`,
                transitionDelay: `${delay}ms`,
            }}
        >
            {children}
        </div>
    );
}

export default Fade;
