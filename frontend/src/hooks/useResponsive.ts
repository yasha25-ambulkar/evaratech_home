import { useState, useEffect } from 'react';

/**
 * Responsive Hooks - Professional breakpoint detection
 * Version: 2.0.0
 * 
 * Integrated with EvaraTech Design System
 */

// ============================================
// BREAKPOINT CONSTANTS
// ============================================

export const BREAKPOINTS = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

// ============================================
// useResponsive Hook
// ============================================

export interface ResponsiveState {
    /** Is mobile device (< 768px) */
    isMobile: boolean;

    /** Is tablet device (768px - 1023px) */
    isTablet: boolean;

    /** Is desktop device (>= 1024px) */
    isDesktop: boolean;

    /** Current breakpoint name */
    currentBreakpoint: Breakpoint | 'xs';

    /** Window width */
    width: number;

    /** Window height */
    height: number;
}

/**
 * useResponsive - Hook for responsive device detection
 * 
 * Returns device type and current breakpoint information
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const { isMobile, isTablet, isDesktop, currentBreakpoint } = useResponsive();
 *   
 *   return (
 *     <div>
 *       {isMobile && <MobileView />}
 *       {isTablet && <TabletView />}
 *       {isDesktop && <DesktopView />}
 *       <p>Current breakpoint: {currentBreakpoint}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useResponsive(): ResponsiveState {
    const [state, setState] = useState<ResponsiveState>(() => {
        // SSR-safe initialization
        if (typeof window === 'undefined') {
            return {
                isMobile: false,
                isTablet: false,
                isDesktop: true,
                currentBreakpoint: 'lg',
                width: 1024,
                height: 768,
            };
        }

        const width = window.innerWidth;
        const height = window.innerHeight;

        return {
            isMobile: width < BREAKPOINTS.md,
            isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
            isDesktop: width >= BREAKPOINTS.lg,
            currentBreakpoint: getCurrentBreakpoint(width),
            width,
            height,
        };
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            const width = window.innerWidth;
            const height = window.innerHeight;

            setState({
                isMobile: width < BREAKPOINTS.md,
                isTablet: width >= BREAKPOINTS.md && width < BREAKPOINTS.lg,
                isDesktop: width >= BREAKPOINTS.lg,
                currentBreakpoint: getCurrentBreakpoint(width),
                width,
                height,
            });
        };

        // Use ResizeObserver if available, otherwise fallback to resize event
        let resizeObserver: ResizeObserver | null = null;

        if ('ResizeObserver' in window) {
            resizeObserver = new ResizeObserver(handleResize);
            resizeObserver.observe(document.documentElement);
        } else {
            window.addEventListener('resize', handleResize);
        }

        return () => {
            if (resizeObserver) {
                resizeObserver.disconnect();
            } else {
                window.removeEventListener('resize', handleResize);
            }
        };
    }, []);

    return state;
}

// ============================================
// useBreakpoint Hook
// ============================================

/**
 * useBreakpoint - Hook for current breakpoint name
 * 
 * Returns the current breakpoint name (xs, sm, md, lg, xl, 2xl)
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const breakpoint = useBreakpoint();
 *   
 *   return <div>Current breakpoint: {breakpoint}</div>;
 * }
 * ```
 */
export function useBreakpoint(): Breakpoint | 'xs' {
    const [breakpoint, setBreakpoint] = useState<Breakpoint | 'xs'>(() => {
        if (typeof window === 'undefined') return 'lg';
        return getCurrentBreakpoint(window.innerWidth);
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const handleResize = () => {
            setBreakpoint(getCurrentBreakpoint(window.innerWidth));
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return breakpoint;
}

// ============================================
// useMediaQuery Hook
// ============================================

/**
 * useMediaQuery - Generic media query hook
 * 
 * Accepts a media query string and returns boolean match
 * 
 * @param query - Media query string (e.g., "(min-width: 768px)")
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const isLargeScreen = useMediaQuery('(min-width: 1024px)');
 *   const prefersReducedMotion = useMediaQuery('(prefers-reduced-motion: reduce)');
 *   
 *   return (
 *     <div>
 *       {isLargeScreen && <LargeScreenContent />}
 *       {!prefersReducedMotion && <AnimatedContent />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia(query).matches;
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const mediaQuery = window.matchMedia(query);

        // Update state if query match changes
        const handleChange = (e: MediaQueryListEvent) => {
            setMatches(e.matches);
        };

        // Modern browsers
        if (mediaQuery.addEventListener) {
            mediaQuery.addEventListener('change', handleChange);
            return () => mediaQuery.removeEventListener('change', handleChange);
        }
        // Legacy browsers
        else {
            mediaQuery.addListener(handleChange);
            return () => mediaQuery.removeListener(handleChange);
        }
    }, [query]);

    return matches;
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get current breakpoint name based on width
 */
function getCurrentBreakpoint(width: number): Breakpoint | 'xs' {
    if (width >= BREAKPOINTS['2xl']) return '2xl';
    if (width >= BREAKPOINTS.xl) return 'xl';
    if (width >= BREAKPOINTS.lg) return 'lg';
    if (width >= BREAKPOINTS.md) return 'md';
    if (width >= BREAKPOINTS.sm) return 'sm';
    return 'xs';
}

/**
 * Check if current width is at or above a breakpoint
 */
export function isBreakpoint(width: number, breakpoint: Breakpoint): boolean {
    return width >= BREAKPOINTS[breakpoint];
}

/**
 * Get breakpoint value in pixels
 */
export function getBreakpointValue(breakpoint: Breakpoint): number {
    return BREAKPOINTS[breakpoint];
}
