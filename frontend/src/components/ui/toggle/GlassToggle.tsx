import { motion } from 'framer-motion';
import styles from './GlassToggle.module.css';

interface GlassToggleProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

export default function GlassToggle({ checked, onChange, disabled = false }: GlassToggleProps) {
    return (
        <div
            className={`${styles.container} ${checked ? styles.checked : ''} ${disabled ? styles.disabled : ''}`}
            onClick={() => !disabled && onChange(!checked)}
        >
            <motion.div
                className={styles.knob}
                layout
                transition={{
                    type: "spring",
                    stiffness: 700,
                    damping: 30
                }}
            />
        </div>
    );
}
