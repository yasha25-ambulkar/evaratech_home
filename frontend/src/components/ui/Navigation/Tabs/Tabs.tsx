import { useState, useRef, useEffect } from 'react';
import styles from './Tabs.module.css';

/**
 * Tabs Component
 * Version: 1.0.0
 * 
 * Tabs with animated indicator
 */

export interface Tab {
    /** Tab label */
    label: string;

    /** Tab value */
    value: string;

    /** Icon */
    icon?: React.ReactNode;

    /** Disabled */
    disabled?: boolean;
}

export interface TabsProps {
    /** Active tab value */
    value: string;

    /** Change handler */
    onChange: (value: string) => void;

    /** Tabs */
    tabs: Tab[];

    /** Orientation */
    orientation?: 'horizontal' | 'vertical';

    /** Custom className */
    className?: string;
}

export function Tabs({
    value,
    onChange,
    tabs,
    orientation = 'horizontal',
    className = '',
}: TabsProps) {
    const [indicatorStyle, setIndicatorStyle] = useState<React.CSSProperties>({});
    const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

    // Update indicator position
    useEffect(() => {
        const activeIndex = tabs.findIndex((tab) => tab.value === value);
        const activeTab = tabsRef.current[activeIndex];

        if (activeTab) {
            if (orientation === 'horizontal') {
                setIndicatorStyle({
                    left: activeTab.offsetLeft,
                    width: activeTab.offsetWidth,
                });
            } else {
                setIndicatorStyle({
                    top: activeTab.offsetTop,
                    height: activeTab.offsetHeight,
                });
            }
        }
    }, [value, tabs, orientation]);

    const containerClass = [
        styles.tabs,
        styles[orientation],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={containerClass} role="tablist">
            <div className={styles.tabList}>
                {tabs.map((tab, index) => {
                    const isActive = tab.value === value;

                    return (
                        <button
                            key={tab.value}
                            ref={(el) => (tabsRef.current[index] = el)}
                            role="tab"
                            aria-selected={isActive}
                            aria-disabled={tab.disabled}
                            className={`${styles.tab} ${isActive ? styles.active : ''} ${tab.disabled ? styles.disabled : ''}`}
                            onClick={() => !tab.disabled && onChange(tab.value)}
                            disabled={tab.disabled}
                            tabIndex={isActive ? 0 : -1}
                        >
                            {tab.icon && <span className={styles.icon}>{tab.icon}</span>}
                            <span className={styles.label}>{tab.label}</span>
                        </button>
                    );
                })}

                <span className={styles.indicator} style={indicatorStyle} />
            </div>
        </div>
    );
}

export default Tabs;
