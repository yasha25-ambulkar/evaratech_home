import { useEffect } from 'react';
import { motion } from 'framer-motion';
import styles from './LoadingScreen.module.css';

interface LoadingScreenProps {
    onComplete: () => void;
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
    useEffect(() => {
        // Trigger completion after the initial animations are established
        // This allows the loading screen to show for a minimum "premium" duration
        const timer = setTimeout(() => {
            onComplete();
        }, 2500);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <motion.div
            className={styles.loadingContainer}
            initial={{ opacity: 1 }}
            exit={{
                opacity: 0,
                transition: { duration: 1.5, ease: "easeInOut" }
            }}
        >
            {/* Animated Background Elements */}
            <motion.div
                className={styles.bgCircle}
                style={{ width: 500, height: 500, background: '#e0f2fe', top: '-10%', right: '-10%' }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className={styles.bgCircle}
                style={{ width: 400, height: 400, background: '#f0fdf4', bottom: '-5%', left: '-5%' }}
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />

            <div className={styles.contentWrapper}>
                <motion.div
                    className={styles.logoWrapper}
                    initial={{ scale: 0.8, opacity: 0, y: 20 }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        y: 0,
                        transition: {
                            duration: 1.2,
                            ease: [0.22, 1, 0.36, 1] // Custom easeOutQuint
                        }
                    }}
                    exit={{
                        scale: 1.5,
                        opacity: 0,
                        filter: 'blur(20px)',
                        transition: { duration: 0.8, ease: "easeIn" }
                    }}
                >
                    <img
                        src="/evaratech-logo-new.png"
                        alt="EvaraTech"
                        className={styles.logo}
                    />
                </motion.div>

                <motion.div
                    className={styles.textWrapper}
                    initial={{ opacity: 0 }}
                    animate={{
                        opacity: 1,
                        transition: { delay: 0.6, duration: 0.8 }
                    }}
                    exit={{
                        opacity: 0,
                        scale: 0.9,
                        transition: { duration: 0.6 }
                    }}
                >
                    <motion.div
                        className={styles.loaderLine}
                        initial={{ width: 0 }}
                        animate={{ width: 80 }}
                        transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                    />

                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0, letterSpacing: '0.5em' }}
                        animate={{ opacity: 1, letterSpacing: '0.15em' }}
                        transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
                    >
                        Intelligent Water Management
                    </motion.p>
                </motion.div>
            </div>
        </motion.div>
    );
}
