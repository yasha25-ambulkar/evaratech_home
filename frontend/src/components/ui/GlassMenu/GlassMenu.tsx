import { ReactNode } from 'react';
import styles from './GlassMenu.module.css';
import GlassBase from '../GlassBase/GlassBase';

// --- GlassMenu Container ---
interface GlassMenuProps {
    title: string;
    onClose?: () => void;
    children: ReactNode;
    className?: string; // For positioning override
    style?: React.CSSProperties;
    // Animation overrides
    variants?: any;
    initial?: any;
    animate?: any;
    exit?: any;
    // Layout
    contentStyle?: React.CSSProperties;
}

export const GlassMenu = ({
    title,
    onClose,
    children,
    className,
    style,
    variants,
    initial,
    animate,
    exit,
    contentStyle
}: GlassMenuProps) => {
    return (
        <GlassBase
            className={`${styles.glassPanel} ${className || ''}`}
            style={style}
            initial={initial || { opacity: 0, scale: 0.9, y: 10 }}
            animate={animate || { opacity: 1, scale: 1, y: 0 }}
            exit={exit || { opacity: 0, scale: 0.9, y: 10 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.3 }}
            variants={variants}
        >
            <div className={styles.header}>
                <h3 className={styles.title}>{title}</h3>
                {onClose && (
                    <button className={styles.closeBtn} onClick={onClose} aria-label="Close">
                        <i className="fas fa-times"></i>
                    </button>
                )}
            </div>
            <div className={styles.content} style={contentStyle}>
                {children}
            </div>
        </GlassBase>
    );
};

// --- GlassMenu Section ---
interface GlassMenuSectionProps {
    title: string;
}

export const GlassMenuSection = ({ title }: GlassMenuSectionProps) => {
    return <h4 className={styles.sectionTitle}>{title}</h4>;
};

// --- GlassMenu Item ---
interface GlassMenuItemProps {
    icon?: string | ReactNode; // FontAwesome class OR React Component
    text: string; // Add text here
    description?: string; // Optional subtitle
    onClick?: () => void;
    badgeColor?: string; // Hex or CSS var
    badgeText?: string; // Example: "P" inside the circle
    isActive?: boolean;
    to?: string; // If it's a link (handled by wrapper usually but let's make it flexible)
}

// We can support Link if passed as component or just generic div/button
export const GlassMenuItem = ({
    icon,
    text,
    onClick,
    badgeColor,
    badgeText,
    description,
    isActive
}: GlassMenuItemProps) => {
    return (
        <button className={`${styles.menuItem} ${isActive ? styles.active : ''}`} onClick={onClick}>
            {/* Render Badge or Icon */}
            {(badgeColor || icon) && (
                <div
                    className={styles.iconBadge}
                    style={{
                        background: badgeColor ? badgeColor : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', // Default gradient
                        opacity: isActive === false ? 0.5 : 1 // Dim if explicitly false
                    }}
                >
                    {badgeText ? badgeText : (
                        typeof icon === 'string' ? <i className={icon}></i> : icon
                    )}
                </div>
            )}

            <div style={{ textAlign: 'left', flex: 1 }}>
                <p className={styles.itemText} style={{ fontWeight: isActive ? 600 : 500 }}>{text}</p>
                {description && <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{description}</p>}
            </div>

            {isActive && (
                <i className="fas fa-check" style={{ marginLeft: '12px', color: '#10b981' }}></i>
            )}
        </button>
    );
};
