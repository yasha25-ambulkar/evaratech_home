import { motion } from 'framer-motion';
import { useMap } from 'react-leaflet';
import { MAP_CONFIG } from '../../../data/constants';
import styles from './Compass.module.css';

const Compass = () => {
    const map = useMap();

    const handleResetView = () => {
        map.flyTo(MAP_CONFIG.center, MAP_CONFIG.defaultZoom, {
            duration: 1.5,
            easeLinearity: 0.25
        });
    };

    return (
        <div className={styles.compassContainer}>
            <motion.div
                className={styles.compassBody}
                onClick={handleResetView}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.5, rotate: -45 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
                {/* Outer Ring */}
                <div className={styles.ring} />

                {/* Markers */}
                <div className={styles.markers}>
                    <span className={`${styles.marker} ${styles.north}`}>N</span>
                    <span className={`${styles.marker} ${styles.south}`}>S</span>
                    <span className={`${styles.marker} ${styles.east}`}>E</span>
                    <span className={`${styles.marker} ${styles.west}`}>W</span>
                </div>

                {/* Needle */}
                <div className={styles.needle}>
                    <div className={styles.needleTop} />
                    <div className={styles.needleBottom} />
                </div>

                {/* Center Point */}
                <div className={styles.centerPoint} />
            </motion.div>
        </div>
    );
};

export default Compass;
