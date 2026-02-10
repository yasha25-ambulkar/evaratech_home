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
                style={{
                    width: 500,
                    height: 500,
                    background: 'var(--color-primary-500)',
                    opacity: 0.15,
                    top: '-10%',
                    right: '-10%'
                }}
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.1, 0.2, 0.1],
                }}
                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
                className={styles.bgCircle}
                style={{
                    width: 400,
                    height: 400,
                    background: 'var(--status-success)',
                    opacity: 0.1,
                    bottom: '-5%',
                    left: '-5%'
                }}
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.05, 0.15, 0.05],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            />

            <div className={styles.contentWrapper}>
                <motion.div
                    className={styles.logoWrapper}
                    initial={{ scale: 0.7, opacity: 0, y: 30, rotate: -5 }}
                    animate={{
                        scale: 1,
                        opacity: 1,
                        y: 0,
                        rotate: 0,
                        transition: {
                            duration: 1.4,
                            ease: [0.16, 1, 0.3, 1] // Apple-style ease-out
                        }
                    }}
                    exit={{
                        scale: 1.2,
                        opacity: 0,
                        filter: 'blur(30px)',
                        transition: { duration: 0.8, ease: "easeIn" }
                    }}
                >
                    <motion.img
                        src="/evaratech-logo-new.png"
                        alt="EvaraTech"
                        className={styles.logo}
                        animate={{
                            filter: [
                                'drop-shadow(0 4px 12px rgba(0,0,0,0.15))',
                                'drop-shadow(0 8px 24px rgba(0,0,0,0.25))',
                                'drop-shadow(0 4px 12px rgba(0,0,0,0.15))'
                            ]
                        }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                </motion.div>

                <motion.div
                    className={styles.textWrapper}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{
                        opacity: 1,
                        y: 0,
                        transition: { delay: 0.8, duration: 1 }
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
                        animate={{ width: 120 }}
                        transition={{ duration: 1.2, delay: 1, ease: "easeInOut" }}
                    />

                    <motion.p
                        className={styles.subtitle}
                        initial={{ opacity: 0, letterSpacing: '0.6em' }}
                        animate={{ opacity: 1, letterSpacing: '0.2em' }}
                        transition={{ duration: 1.8, delay: 0.6, ease: "easeOut" }}
                    >
                        INTELLIGENT WATER MANAGEMENT
                    </motion.p>
                </motion.div>
            </div>
        </motion.div>
    );
}
