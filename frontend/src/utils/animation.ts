import { Variants } from "framer-motion";

/**
 * Standard iOS Spring Physics
 * Based on Apple's Core Animation defaults
 */
export const SPRING_TRANSITION = {
    type: "spring",
    stiffness: 300,
    damping: 30,
    mass: 1,
};

export const BOUNCY_SPRING = {
    type: "spring",
    stiffness: 400,
    damping: 15, // Lower damping = more bounce
};

export const SLOW_SPRING = {
    type: "spring",
    stiffness: 100,
    damping: 20,
};

/**
 * Reusable Animation Variants
 */

// 1. Fade In (Simple Opacity)
export const fadeIn: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
};

// 2. Scale In (Pop up effect for Modals/Cards)
export const scaleIn: Variants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: {
        opacity: 1,
        scale: 1,
        transition: SPRING_TRANSITION
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        transition: { duration: 0.2 }
    },
};

// 3. Slide Up (Bottom Sheets / Lists)
export const slideUp: Variants = {
    initial: { opacity: 0, y: 20 },
    animate: {
        opacity: 1,
        y: 0,
        transition: SPRING_TRANSITION
    },
    exit: {
        opacity: 0,
        y: 20,
        transition: { duration: 0.2 }
    },
};

// 4. Stagger Container (For Lists/Grids)
export const staggerContainer = (staggerChildren = 0.05): Variants => ({
    animate: {
        transition: {
            staggerChildren
        }
    }
});
