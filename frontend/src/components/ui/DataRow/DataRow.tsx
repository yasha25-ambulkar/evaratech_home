import { ReactNode } from 'react';
import styles from './DataRow.module.css';

interface DataRowProps {
    label: string;
    value: ReactNode;
}

function DataRow({ label, value }: DataRowProps) {
    return (
        <div className={styles.dataRow}>
            <span className={styles.label}>{label}</span>
            <span className={styles.value}>{value}</span>
        </div>
    );
}

export default DataRow;
