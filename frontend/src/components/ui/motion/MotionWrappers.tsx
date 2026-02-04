import { motion, MotionProps } from "framer-motion";
import { ReactNode } from "react";
import { fadeIn, scaleIn, slideUp, staggerContainer } from "../../../utils/animation";

interface MotionWrapperProps extends MotionProps {
    children: ReactNode;
    className?: string;
    delay?: number;
}

export const FadeIn = ({ children, className, delay = 0, ...props }: MotionWrapperProps) => (
    <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ delay }}
        className={className}
        {...props}
    >
        {children}
    </motion.div>
);

export const ScaleIn = ({ children, className, delay = 0, ...props }: MotionWrapperProps) => (
    <motion.div
        variants={scaleIn}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ delay }} // Note: transition is also defined in variants, this might override just delay
        className={className}
        {...props}
    >
        {children}
    </motion.div>
);

export const SlideUp = ({ children, className, delay = 0, ...props }: MotionWrapperProps) => (
    <motion.div
        variants={slideUp}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ delay }}
        className={className}
        {...props}
    >
        {children}
    </motion.div>
);

export const StaggerContainer = ({ children, className, ...props }: MotionWrapperProps) => (
    <motion.div
        variants={staggerContainer()}
        initial="initial"
        animate="animate"
        exit="exit"
        className={className}
        {...props}
    >
        {children}
    </motion.div>
);
