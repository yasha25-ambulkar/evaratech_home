import { useMap } from 'react-leaflet';
import { motion } from 'framer-motion';
import styles from './GlassMapControls.module.css';

export default function GlassMapControls() {
    const map = useMap();

    const handleZoomIn = () => map.zoomIn();
    const handleZoomOut = () => map.zoomOut();


    return (
        <div className={styles.container}>
            <div className={styles.group}>
                <motion.button
                    className={styles.btn}
                    onClick={handleZoomIn}
                    whileTap={{ scale: 0.95 }}
                >
                    <i className="fas fa-plus"></i>
                </motion.button>
                <div className={styles.divider} />
                <motion.button
                    className={styles.btn}
                    onClick={handleZoomOut}
                    whileTap={{ scale: 0.95 }}
                >
                    <i className="fas fa-minus"></i>
                </motion.button>
            </div>
        </div>
    );
}
