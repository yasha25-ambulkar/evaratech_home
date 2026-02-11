import { ReactNode } from 'react';
import styles from './GridSystem.module.css';

/**
 * Grid System - Professional responsive grid components
 * Version: 2.0.0
 * 
 * Integrated with EvaraTech Design System
 */

// ============================================
// BASE GRID COMPONENT
// ============================================

export interface GridSystemProps {
    /** Grid children */
    children: ReactNode;

    /** Default number of columns */
    cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

    /** Columns at sm breakpoint (640px+) */
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

    /** Columns at md breakpoint (768px+) */
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

    /** Columns at lg breakpoint (1024px+) */
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

    /** Columns at xl breakpoint (1280px+) */
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

    /** Gap between grid items */
    gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';

    /** Custom className */
    className?: string;
}

/**
 * Grid - Base responsive grid component
 * 
 * Features:
 * - 12-column grid system
 * - Responsive breakpoints (sm, md, lg, xl)
 * - Configurable gaps
 * - Mobile-first design
 * 
 * @example
 * ```tsx
 * <Grid cols={1} sm={2} lg={3} xl={4} gap="lg">
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 *   <div>Item 3</div>
 * </Grid>
 * ```
 */
export function Grid({
    children,
    cols = 12,
    sm,
    md,
    lg,
    xl,
    gap = 'md',
    className = ''
}: GridSystemProps) {
    const gridClasses = [
        styles.grid,
        styles[`cols-${cols}`],
        sm && styles[`sm-cols-${sm}`],
        md && styles[`md-cols-${md}`],
        lg && styles[`lg-cols-${lg}`],
        xl && styles[`xl-cols-${xl}`],
        styles[`gap-${gap}`],
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={gridClasses}>
            {children}
        </div>
    );
}

// ============================================
// GRID ITEM COMPONENT
// ============================================

export interface GridItemProps {
    /** Grid item children */
    children: ReactNode;

    /** Column span (default) */
    span?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

    /** Column span at sm breakpoint */
    sm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

    /** Column span at md breakpoint */
    md?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

    /** Column span at lg breakpoint */
    lg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

    /** Column span at xl breakpoint */
    xl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;

    /** Custom className */
    className?: string;
}

/**
 * GridItem - Individual grid item with responsive spans
 * 
 * @example
 * ```tsx
 * <Grid cols={12}>
 *   <GridItem span={12} md={6} lg={4}>Full on mobile, half on tablet, third on desktop</GridItem>
 *   <GridItem span={12} md={6} lg={8}>Full on mobile, half on tablet, two-thirds on desktop</GridItem>
 * </Grid>
 * ```
 */
export function GridItem({
    children,
    span = 12,
    sm,
    md,
    lg,
    xl,
    className = ''
}: GridItemProps) {
    const itemClasses = [
        styles.gridItem,
        styles[`span-${span}`],
        sm && styles[`sm-span-${sm}`],
        md && styles[`md-span-${md}`],
        lg && styles[`lg-span-${lg}`],
        xl && styles[`xl-span-${xl}`],
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={itemClasses}>
            {children}
        </div>
    );
}

// ============================================
// SPECIALIZED GRID COMPONENTS
// ============================================

export interface StatsGridProps {
    /** Grid children (typically stat cards) */
    children: ReactNode;

    /** Custom className */
    className?: string;

    /** Use auto-fit for dynamic columns */
    autoFit?: boolean;

    /** Minimum card width for auto-fit */
    minWidth?: string;
}

/**
 * StatsGrid - Optimized grid for stat cards
 * 
 * Default: 1 col mobile, 2 cols tablet, 4 cols desktop
 * 
 * @example
 * ```tsx
 * <StatsGrid>
 *   <EnhancedStatCard title="Revenue" value="$45,231" />
 *   <EnhancedStatCard title="Users" value="1,234" />
 * </StatsGrid>
 * ```
 */
export function StatsGrid({ children, className = '', autoFit = false, minWidth = '280px' }: StatsGridProps) {
    if (autoFit) {
        return (
            <div
                className={`${styles.statsGrid} ${styles.autoFit} ${className}`}
                style={{ '--min-width': minWidth } as React.CSSProperties}
            >
                {children}
            </div>
        );
    }

    return (
        <Grid cols={1} sm={2} lg={4} gap="lg" className={`${styles.statsGrid} ${className}`}>
            {children}
        </Grid>
    );
}

export interface ChartGridProps {
    /** Grid children (typically charts) */
    children: ReactNode;

    /** Custom className */
    className?: string;
}

/**
 * ChartGrid - Optimized grid for charts
 * 
 * Default: 1 col mobile, 2 cols desktop
 * 
 * @example
 * ```tsx
 * <ChartGrid>
 *   <LineChart />
 *   <BarChart />
 * </ChartGrid>
 * ```
 */
export function ChartGrid({ children, className = '' }: ChartGridProps) {
    return (
        <Grid cols={1} lg={2} gap="lg" className={`${styles.chartGrid} ${className}`}>
            {children}
        </Grid>
    );
}

export interface DashboardGridProps {
    /** Grid children */
    children: ReactNode;

    /** Custom className */
    className?: string;

    /** Layout variant */
    variant?: 'default' | 'dense' | 'spacious';
}

/**
 * DashboardGrid - Main dashboard layout grid
 * 
 * Default: 1 col mobile, 2 cols tablet, 3 cols laptop, 4 cols desktop
 * 
 * @example
 * ```tsx
 * <DashboardGrid variant="spacious">
 *   <Widget />
 *   <Widget />
 *   <Widget />
 * </DashboardGrid>
 * ```
 */
export function DashboardGrid({ children, className = '', variant = 'default' }: DashboardGridProps) {
    const gap = variant === 'dense' ? 'md' : variant === 'spacious' ? 'xl' : 'lg';

    return (
        <Grid cols={1} md={2} lg={3} xl={4} gap={gap} className={`${styles.dashboardGrid} ${styles[`variant-${variant}`]} ${className}`}>
            {children}
        </Grid>
    );
}

export interface AnalyticsGridProps {
    /** Grid children */
    children: ReactNode;

    /** Custom className */
    className?: string;
}

/**
 * AnalyticsGrid - Grid for analytics widgets
 * 
 * Default: 1 col mobile, 2 cols desktop
 * 
 * @example
 * ```tsx
 * <AnalyticsGrid>
 *   <AnalyticsCard />
 *   <AnalyticsCard />
 * </AnalyticsGrid>
 * ```
 */
export function AnalyticsGrid({ children, className = '' }: AnalyticsGridProps) {
    return (
        <Grid cols={1} lg={2} xl={3} gap="lg" className={`${styles.analyticsGrid} ${className}`}>
            {children}
        </Grid>
    );
}

export default Grid;

