import { motion, HTMLMotionProps } from 'framer-motion';
import { ReactNode } from 'react';

interface GlassButtonProps extends HTMLMotionProps<"button"> {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    icon?: ReactNode;
    className?: string;
}

export default function GlassButton({
    children,
    variant = 'secondary',
    size = 'md',
    isLoading = false,
    icon,
    className = '',
    disabled,
    ...props
}: GlassButtonProps) {

    // Map props to CSS classes
    const variantClass = variant === 'primary' ? 'primary' : '';
    // Note: We use the existing .glass-button CSS class structure 
    // but augment it with Framer Motion interaction

    return (
        <motion.button
            className={`glass-button ${variantClass} ${className}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span style={{ marginRight: 8, display: 'inline-block', animation: 'spin 1s linear infinite' }}>
                    <i className="fas fa-spinner"></i>
                </span>
            ) : icon ? (
                <span style={{ marginRight: 8, display: 'inline-flex', alignItems: 'center' }}>
                    {icon}
                </span>
            ) : null}

            {children}

            {/* Inner Shine for that 'Licked Candy' iOS look */}
            {variant === 'primary' && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '50%',
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%)',
                    borderRadius: 'inherit',
                    pointerEvents: 'none'
                }} />
            )}
        </motion.button>
    );
}

// Add global spin keyframe if not present
// We assume animations.css handles this, or we add it globally.
