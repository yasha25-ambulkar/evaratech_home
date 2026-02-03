import { useSearchParams, Link } from 'react-router-dom';
import { assetDatabase } from '@data/assets.data';
import styles from './StationDetails.module.css';

function StationDetails() {
    const [searchParams] = useSearchParams();
    const locationName = searchParams.get('loc') || 'Unknown Location';
    const stationId = `EV-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;

    const assetData = assetDatabase[locationName];

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <span className={styles.stationIdLabel}>STATION ID: <span className={styles.stationId}>{stationId}</span></span>
                    <h1>{locationName}</h1>
                </div>
                <Link to="/map" className={styles.backBtn}>
                    Back to Map
                </Link>
            </div>

            <div className={styles.gridContainer}>
                <div className={styles.card}>
                    <h2>📍 Demographics & Info</h2>
                    <div className={styles.dataRow}>
                        <span className={styles.label}>Building Type</span>
                        <span className={styles.value}>Academic Block</span>
                    </div>
                    <div className={styles.dataRow}>
                        <span className={styles.label}>Est. Population</span>
                        <span className={styles.value}>~450 Students</span>
                    </div>
                    <div className={styles.dataRow}>
                        <span className={styles.label}>Pipe Diameter</span>
                        <span className={styles.value}>4.5 inches</span>
                    </div>
                    <div className={styles.dataRow}>
                        <span className={styles.label}>Install Date</span>
                        <span className={styles.value}>Dec 12, 2025</span>
                    </div>
                </div>

                <div className={styles.card}>
                    <h2>💧 Live Water Quality</h2>
                    <div className={styles.dataRow}>
                        <span className={styles.label}>Current Status</span>
                        <span className={styles.statusBadge}>{assetData?.status || 'Normal'}</span>
                    </div>
                    <div className={styles.dataRow}>
                        <span className={styles.label}>TDS Level</span>
                        <span className={styles.value}>142 ppm</span>
                    </div>
                    <div className={styles.dataRow}>
                        <span className={styles.label}>pH Level</span>
                        <span className={styles.value}>7.2</span>
                    </div>
                    <div className={styles.dataRow}>
                        <span className={styles.label}>Flow Rate</span>
                        <span className={styles.value}>12.5 L/min</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default StationDetails;
