import { useState } from 'react';
import { motion } from 'framer-motion';
import { migrateAssets, migratePipelines } from '../../../scripts/migrateToSupabase';
import styles from './MigrationPanel.module.css';

export default function MigrationPanel() {
    const [status, setStatus] = useState<'idle' | 'migrating' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleMigrate = async () => {
        setStatus('migrating');
        setMessage('Starting migration...');

        try {
            // Migrate Assets
            setMessage('Migrating assets...');
            await migrateAssets();

            // Migrate Pipelines
            setMessage('Migrating pipelines...');
            await migratePipelines();

            setStatus('success');
            setMessage('✅ Migration completed successfully!');
        } catch (error) {
            setStatus('error');
            setMessage(`❌ Migration failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    };

    return (
        <motion.div
            className={styles.panel}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        >
            <div className={styles.header}>
                <i className="fas fa-database"></i>
                <h3>Data Migration</h3>
            </div>

            <p className={styles.description}>
                Push local asset and pipeline data to Supabase. This will overwrite existing data.
            </p>

            <button
                className={styles.migrateBtn}
                onClick={handleMigrate}
                disabled={status === 'migrating'}
            >
                {status === 'migrating' ? (
                    <>
                        <i className="fas fa-spinner fa-spin"></i>
                        Migrating...
                    </>
                ) : (
                    <>
                        <i className="fas fa-upload"></i>
                        Start Migration
                    </>
                )}
            </button>

            {message && (
                <motion.div
                    className={`${styles.message} ${styles[status]}`}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    {message}
                </motion.div>
            )}
        </motion.div>
    );
}
