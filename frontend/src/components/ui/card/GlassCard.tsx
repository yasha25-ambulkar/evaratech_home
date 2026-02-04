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
                padding: noPadding ? '0' : 'var(--space-6)',
                position: 'relative',
                overflow: 'hidden'
            }}
            whileHover={hoverAnimation}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            {...props}
        >
            {/* Specular Highlight / Shine Effect */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.6) 50%, transparent 100%)',
                    opacity: 0.5,
                    pointerEvents: 'none'
                }}
            />

            {children}
        </motion.div>
    );
}
