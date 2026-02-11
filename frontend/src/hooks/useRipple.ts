import { useCallback } from 'react';

/**
 * useRipple Hook
 * Version: 1.0.0
 * 
 * Material Design ripple effect for interactive elements
 */

export interface RippleOptions {
    /** Ripple color (CSS color value) */
    color?: string;

    /** Duration in milliseconds */
    duration?: number;

    /** Ripple size multiplier */
    size?: number;
}

/**
 * useRipple - Material Design ripple effect hook
 * 
 * Creates a ripple animation on click, starting from the click position
 * 
 * @example
 * ```tsx
 * function MyButton() {
 *   const { createRipple } = useRipple({ color: 'rgba(255,255,255,0.3)' });
 *   
 *   return (
 *     <button onClick={createRipple} style={{ position: 'relative', overflow: 'hidden' }}>
 *       Click Me
 *     </button>
 *   );
 * }
 * ```
 */
export function useRipple(options: RippleOptions = {}) {
    const {
        color = 'rgba(255, 255, 255, 0.3)',
        duration = 600,
        size = 1,
    } = options;

    const createRipple = useCallback(
        (event: React.MouseEvent<HTMLElement>) => {
            const button = event.currentTarget;

            // Get button dimensions and position
            const rect = button.getBoundingClientRect();
            const rippleSize = Math.max(rect.width, rect.height) * size;

            // Calculate ripple position (centered on click)
            const x = event.clientX - rect.left - rippleSize / 2;
            const y = event.clientY - rect.top - rippleSize / 2;

            // Create ripple element
            const ripple = document.createElement('span');
            ripple.style.position = 'absolute';
            ripple.style.width = `${rippleSize}px`;
            ripple.style.height = `${rippleSize}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.style.borderRadius = '50%';
            ripple.style.background = color;
            ripple.style.transform = 'scale(0)';
            ripple.style.opacity = '1';
            ripple.style.pointerEvents = 'none';
            ripple.style.transition = `transform ${duration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${duration}ms cubic-bezier(0.4, 0, 0.2, 1)`;

            // Add ripple to button
            button.appendChild(ripple);

            // Trigger animation
            requestAnimationFrame(() => {
                ripple.style.transform = 'scale(2)';
                ripple.style.opacity = '0';
            });

            // Remove ripple after animation
            setTimeout(() => {
                ripple.remove();
            }, duration);
        },
        [color, duration, size]
    );

    return { createRipple };
}

export default useRipple;
