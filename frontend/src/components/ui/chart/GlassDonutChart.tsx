import { useState, useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Sector } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import GlassChartTooltip from './GlassChartTooltip';
import styles from './GlassDonutChart.module.css';

interface DataItem {
    name: string;
    value: number;
    color: string;
}

interface GlassDonutChartProps {
    data: DataItem[];
    title?: string;
    centerLabel?: string;
}

// Custom Active Shape for "Glowing" effect
const renderActiveShape = (props: any) => {
    const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;

    return (
        <g>
            <Sector
                cx={cx}
                cy={cy}
                innerRadius={innerRadius}
                outerRadius={outerRadius + 6} // Grow outwards
                startAngle={startAngle}
                endAngle={endAngle}
                fill={fill}
                style={{ filter: `drop-shadow(0px 0px 8px ${fill})` }} // Glow
            />
            <Sector
                cx={cx}
                cy={cy}
                startAngle={startAngle}
                endAngle={endAngle}
                innerRadius={innerRadius - 2}
                outerRadius={outerRadius + 8}
                fill={fill}
                fillOpacity={0.2} // Halo
            />
        </g>
    );
};

export default function GlassDonutChart({ data, title, centerLabel = "Total" }: GlassDonutChartProps) {
    const [activeIndex, setActiveIndex] = useState<number | undefined>(undefined);
    const [hiddenKeys, setHiddenKeys] = useState<Set<string>>(new Set());

    // Calculate total based on visible data
    const total = useMemo(() => {
        return data
            .filter(item => !hiddenKeys.has(item.name))
            .reduce((acc, curr) => acc + curr.value, 0);
    }, [data, hiddenKeys]);

    const activeItem = activeIndex !== undefined ? data[activeIndex] : null;

    const toggleSeries = (name: string) => {
        const newHidden = new Set(hiddenKeys);
        if (newHidden.has(name)) {
            newHidden.delete(name);
        } else {
            newHidden.add(name);
        }
        setHiddenKeys(newHidden);
    };

    const visibleData = data.filter(item => !hiddenKeys.has(item.name));

    return (
        <div className={styles.container}>
            {title && <h3 className={styles.title}>{title}</h3>}

            <div className={styles.chartWrapper}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            activeIndex={activeIndex}
                            activeShape={renderActiveShape}
                            data={visibleData}
                            cx="50%"
                            cy="50%"
                            innerRadius={65}
                            outerRadius={85}
                            paddingAngle={4}
                            dataKey="value"
                            onMouseEnter={(_, index) => setActiveIndex(index)}
                            onMouseLeave={() => setActiveIndex(undefined)}
                            cornerRadius={6}
                            stroke="none"
                        >
                            {visibleData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                        <Tooltip content={<GlassChartTooltip unit="" />} />
                    </PieChart>
                </ResponsiveContainer>

                {/* Center Label */}
                <div className={styles.centerLabelContainer}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeItem ? activeItem.name : 'total'}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                            className={styles.centerContent}
                        >
                            <span className={styles.centerValue}>
                                {activeItem ? activeItem.value : total}
                            </span>
                            <span className={styles.centerSub}>
                                {activeItem ? activeItem.name : centerLabel}
                            </span>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Interactive Legend */}
            <div className={styles.legend}>
                {data.map((item) => {
                    const isHidden = hiddenKeys.has(item.name);
                    return (
                        <motion.button
                            key={item.name}
                            className={`${styles.legendItem} ${isHidden ? styles.hidden : ''}`}
                            onClick={() => toggleSeries(item.name)}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span
                                className={styles.dot}
                                style={{ backgroundColor: item.color }}
                            />
                            <span className={styles.label}>{item.name}</span>
                        </motion.button>
                    );
                })}
            </div>
        </div>
    );
}
