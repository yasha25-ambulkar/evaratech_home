import { motion } from 'framer-motion';
import styles from './SegmentedControl.module.css';

interface SegmentedControlProps {
    options: string[];
    value: string;
    onChange: (value: string) => void;
}

export default function SegmentedControl({ options, value, onChange }: SegmentedControlProps) {
    // We need to calculate the position of the slider based on the selected index
    const selectedIndex = options.indexOf(value);

    return (
        <div className={styles.container}>
            <div className={styles.background}>
                {options.map((option) => (
                    <button
                        key={option}
                        className={`${styles.segment} ${value === option ? styles.selectedText : ''}`}
                        onClick={() => onChange(option)}
                    >
                        {option}
                    </button>
                ))}
            </div>
            {/* The sliding pill */}
            <motion.div
                className={styles.pill}
                initial={false}
                animate={{
                    x: `calc(${selectedIndex * 100}% + ${selectedIndex * 2}px)`, // Adjust for gap if any
                }}
                style={{ width: `calc((100% - 4px) / ${options.length})` }} // Simplified width calc
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
        </div>
    );
}
