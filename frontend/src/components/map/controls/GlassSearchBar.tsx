import { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './GlassSearchBar.module.css';

interface GlassSearchBarProps {
    onSearch: (query: string) => void;
    placeholder?: string;
}

function GlassSearchBar({ onSearch, placeholder = "Search assets..." }: GlassSearchBarProps) {
    const [isFocused, setIsFocused] = useState(false);
    const [value, setValue] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(value);
    };

    return (
        <motion.form
            className={styles.container}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            onSubmit={handleSubmit}
        >
            <div className={`${styles.wrapper} ${isFocused ? styles.focused : ''}`}>
                <i className={`fas fa-search ${styles.icon}`}></i>
                <input
                    type="text"
                    className={styles.input}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                />
                <AnimatePresence>
                    {value && (
                        <motion.button
                            type="button"
                            className={styles.clearBtn}
                            onClick={() => { setValue(""); onSearch(""); }}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                        >
                            <i className="fas fa-times-circle"></i>
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
            {/* Optional: Add search button or results dropdown here */}
        </motion.form>
    );
}

export default memo(GlassSearchBar);
