import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ReportBuilder.module.css';

interface ReportBuilderProps {
    onClose: () => void;
}

export default function ReportBuilder({ onClose }: ReportBuilderProps) {
    const [step, setStep] = useState(1);
    const [config, setConfig] = useState({
        type: '',
        dateRange: 'last7days',
        format: 'pdf',
        metrics: [] as string[]
    });

    const reportTypes = [
        { id: 'consumption', name: 'Consumption Analysis', icon: 'fa-tint' },
        { id: 'efficiency', name: 'System Efficiency', icon: 'fa-chart-line' },
        { id: 'maintenance', name: 'Maintenance Log', icon: 'fa-wrench' },
        { id: 'alerts', name: 'Alert History', icon: 'fa-exclamation-triangle' }
    ];

    const metrics = [
        { id: 'total_flow', name: 'Total Flow Volume' },
        { id: 'peak_usage', name: 'Peak Usage Times' },
        { id: 'avg_pressure', name: 'Average Pressure' },
        { id: 'energy_usage', name: 'Energy Consumption' },
        { id: 'downtime', name: 'System Downtime' }
    ];

    const handleGenerate = () => {
        // Mock generation process
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${config.type}-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        onClose();
    };

    return (
        <motion.div
            className={styles.overlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className={styles.modal}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                <div className={styles.header}>
                    <h2>Generate Custom Report</h2>
                    <button onClick={onClose} className={styles.closeBtn}>
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className={styles.body}>
                    <div className={styles.steps}>
                        <div className={`${styles.step} ${step >= 1 ? styles.active : ''}`}>1. Type</div>
                        <div className={`${styles.line} ${step >= 2 ? styles.active : ''}`}></div>
                        <div className={`${styles.step} ${step >= 2 ? styles.active : ''}`}>2. Range</div>
                        <div className={`${styles.line} ${step >= 3 ? styles.active : ''}`}></div>
                        <div className={`${styles.step} ${step >= 3 ? styles.active : ''}`}>3. Content</div>
                    </div>

                    <AnimatePresence mode='wait'>
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className={styles.stepContent}
                            >
                                <h3>Select Report Type</h3>
                                <div className={styles.optionsGrid}>
                                    {reportTypes.map(type => (
                                        <div
                                            key={type.id}
                                            className={`${styles.optionCard} ${config.type === type.id ? styles.selected : ''}`}
                                            onClick={() => setConfig({ ...config, type: type.id })}
                                        >
                                            <i className={`fas ${type.icon}`}></i>
                                            <span>{type.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className={styles.stepContent}
                            >
                                <h3>Select Time Range</h3>
                                <select
                                    className={styles.select}
                                    value={config.dateRange}
                                    onChange={(e) => setConfig({ ...config, dateRange: e.target.value })}
                                >
                                    <option value="today">Today</option>
                                    <option value="last7days">Last 7 Days</option>
                                    <option value="last30days">Last 30 Days</option>
                                    <option value="thisMonth">This Month</option>
                                    <option value="lastMonth">Last Month</option>
                                    <option value="custom">Custom Range</option>
                                </select>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ x: 20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                exit={{ x: -20, opacity: 0 }}
                                className={styles.stepContent}
                            >
                                <h3>Select Metrics & Format</h3>
                                <div className={styles.metricsList}>
                                    {metrics.map(metric => (
                                        <label key={metric.id} className={styles.checkboxLabel}>
                                            <input
                                                type="checkbox"
                                                checked={config.metrics.includes(metric.id)}
                                                onChange={(e) => {
                                                    if (e.target.checked) {
                                                        setConfig({ ...config, metrics: [...config.metrics, metric.id] });
                                                    } else {
                                                        setConfig({ ...config, metrics: config.metrics.filter(m => m !== metric.id) });
                                                    }
                                                }}
                                            />
                                            {metric.name}
                                        </label>
                                    ))}
                                </div>
                                <div className={styles.formatSelect}>
                                    <label>Export Format:</label>
                                    <div className={styles.radioGroup}>
                                        <label>
                                            <input
                                                type="radio"
                                                name="format"
                                                value="pdf"
                                                checked={config.format === 'pdf'}
                                                onChange={(e) => setConfig({ ...config, format: e.target.value })}
                                            />
                                            PDF
                                        </label>
                                        <label>
                                            <input
                                                type="radio"
                                                name="format"
                                                value="csv"
                                                checked={config.format === 'csv'}
                                                onChange={(e) => setConfig({ ...config, format: e.target.value })}
                                            />
                                            CSV
                                        </label>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <div className={styles.footer}>
                    {step > 1 && (
                        <button onClick={() => setStep(step - 1)} className={styles.secondaryBtn}>
                            Back
                        </button>
                    )}
                    {step < 3 ? (
                        <button
                            onClick={() => setStep(step + 1)}
                            className={styles.primaryBtn}
                            disabled={step === 1 && !config.type}
                        >
                            Next
                        </button>
                    ) : (
                        <button onClick={handleGenerate} className={styles.primaryBtn}>
                            Generate Report
                        </button>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}
