import styles from './GlassPopupCard.module.css';

interface GlassPopupCardProps {
    name: string;
    type: string;
    status: string;
    specs?: string;
    onDetails: () => void;
}

export default function GlassPopupCard({ name, type, status, specs, onDetails }: GlassPopupCardProps) {
    const isWorking = status === 'Normal' || status === 'active';


    return (
        <div className={styles.card}>
            <div className={styles.header}>
                <span className={styles.type}>{type}</span>
                <span className={`${styles.status} ${isWorking ? styles.ok : styles.issue}`}>
                    {status}
                </span>
            </div>
            <h4 className={styles.title}>{name}</h4>
            {specs && specs !== 'N/A' && <p className={styles.specs}>{specs}</p>}

            <button className={styles.detailsBtn} onClick={onDetails}>
                View Details <i className="fas fa-chevron-right"></i>
            </button>
        </div>
    );
}
