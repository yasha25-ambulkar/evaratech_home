import { ReactNode, CSSProperties } from 'react';
import styles from './GlassBase.module.css';
import { motion, HTMLMotionProps } from 'framer-motion';

interface GlassBaseProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    className?: string;
    style?: CSSProperties;
}

/**
 * GlassBase Component (HOC/Wrapper)
 * 
 * Provides standard glassmorphism styles (blur, transparency, border, shadow).
 * Inherit this visual style by wrapping your content.
 */
export default function GlassBase({ children, className = '', style, ...props }: GlassBaseProps) {
    return (
        <motion.div
            className={`${styles.container} ${className}`}
            style={style}
            {...props}
        >
            {children}
        </motion.div>
    );
}
