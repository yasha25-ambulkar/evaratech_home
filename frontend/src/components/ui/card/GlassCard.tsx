import { HTMLMotionProps, motion } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassCardProps extends HTMLMotionProps<"div"> {
    children: ReactNode;
    variant?: 'base' | 'heavy' | 'interactive';
    className?: string;
    noPadding?: boolean;
}

export default function GlassCard({
    children,
    variant = 'base',
    className = '',
    noPadding = false,
    ...props
}: GlassCardProps) {

    // Determine class based on variant
    const baseClass = variant === 'heavy' ? 'glass-panel-heavy' : 'glass-panel';

    // Interactive Hover State
    const hoverAnimation = variant === 'interactive' ? {
        y: -4,
        boxShadow: "0 12px 24px -4px rgba(0, 0, 0, 0.12)",
        transition: { type: "spring", stiffness: 300, damping: 20 }
    } : {};

    return (
        <motion.div
            className={`${baseClass} ${className}`}
            style={{
                padding: noPadding ? '0' : 'var(--space-5)',
                position: 'relative',
                overflow: 'hidden'
            }}
            whileHover={hoverAnimation}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            {...props}
        >
            {children}
        </motion.div>
    );
}
