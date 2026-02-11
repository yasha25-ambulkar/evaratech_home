import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import styles from './FuturisticBackground.module.css';

const FuturisticBackground: React.FC = () => {
    // Generate static positions for particles to avoid hydration mismatch
    const particles = useMemo(() => {
        return Array.from({ length: 20 }).map((_, i) => ({
            id: i,
            size: Math.random() * 4 + 2,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            duration: Math.random() * 20 + 10,
            delay: Math.random() * 5
        }));
    }, []);

    return (
        <div className={styles.bgContainer}>
            <div className={styles.meshGradient}></div>

            {/* Animated Orbs */}
            <motion.div
                className={styles.orb}
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -100, 50, 0],
                    scale: [1, 1.2, 0.8, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ top: '20%', left: '30%', backgroundColor: 'rgba(6, 182, 212, 0.3)' }}
            />
            <motion.div
                className={styles.orb}
                animate={{
                    x: [0, -120, 80, 0],
                    y: [0, 90, -110, 0],
                    scale: [1, 0.9, 1.3, 1],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                style={{ bottom: '15%', right: '25%', backgroundColor: 'rgba(59, 130, 246, 0.25)' }}
            />

            {/* Particle Layer */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className={styles.particle}
                    style={{
                        width: p.size,
                        height: p.size,
                        left: p.left,
                        top: p.top,
                    }}
                    animate={{
                        y: [-20, 20],
                        opacity: [0.2, 0.8, 0.2],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "easeInOut"
                    }}
                />
            ))}

            <div className={styles.vignette}></div>
        </div>
    );
};

export default FuturisticBackground;
