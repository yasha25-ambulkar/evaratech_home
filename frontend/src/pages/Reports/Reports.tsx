import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import ReportBuilder from './ReportBuilder';
import styles from './Reports.module.css';

function Reports() {
    const [showBuilder, setShowBuilder] = useState(false);

    const reportTemplates = [
        { id: 'consumption', name: 'Water Consumption Report', icon: 'fa-tint', description: 'Daily/weekly/monthly consumption analysis' },
        { id: 'efficiency', name: 'System Efficiency Report', icon: 'fa-chart-line', description: 'Performance metrics and efficiency trends' },
        { id: 'maintenance', name: 'Maintenance Log Report', icon: 'fa-wrench', description: 'Maintenance history and schedules' },
        { id: 'alerts', name: 'Alerts & Incidents Report', icon: 'fa-exclamation-triangle', description: 'System alerts and incident tracking' },
        { id: 'cost', name: 'Cost Analysis Report', icon: 'fa-dollar-sign', description: 'Operational costs and budget analysis' },
        { id: 'custom', name: 'Custom Report', icon: 'fa-cog', description: 'Build your own custom report' },
    ];

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <AnimatePresence>
                    {showBuilder && <ReportBuilder onClose={() => setShowBuilder(false)} />}
                </AnimatePresence>

                <div className={styles.header}>
                    <div>
                        <h1 className={styles.title}>Reports</h1>
                        <p className={styles.subtitle}>Generate and export system reports</p>
                    </div>
                    <button onClick={() => setShowBuilder(true)} className={styles.newBtn}>
                        <i className="fas fa-plus"></i> New Report
                    </button>
                </div>

                <div className={styles.grid}>
                    {reportTemplates.map((template) => (
                        <div
                            key={template.id}
                            className={styles.card}
                        >
                            <div className={styles.cardIcon}>
                                <i className={`fas ${template.icon}`}></i>
                            </div>
                            <h3 className={styles.cardTitle}>{template.name}</h3>
                            <p className={styles.cardDescription}>{template.description}</p>
                            <button onClick={() => setShowBuilder(true)} className={styles.generateBtn}>
                                <i className="fas fa-file-export"></i> Generate
                            </button>
                        </div>
                    ))}
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Recent Reports</h2>
                    <div className={styles.list}>
                        <div className={styles.reportItem}>
                            <div className={styles.reportIcon}>
                                <i className="fas fa-file-pdf"></i>
                            </div>
                            <div className={styles.reportInfo}>
                                <h4>Monthly Consumption Report - January 2026</h4>
                                <p>Generated on Jan 27, 2026 at 10:30 AM</p>
                            </div>
                            <button className={styles.downloadBtn}>
                                <i className="fas fa-download"></i> Download
                            </button>
                        </div>

                        <div className={styles.reportItem}>
                            <div className={styles.reportIcon}>
                                <i className="fas fa-file-excel"></i>
                            </div>
                            <div className={styles.reportInfo}>
                                <h4>System Efficiency Report - Q4 2025</h4>
                                <p>Generated on Jan 15, 2026 at 2:15 PM</p>
                            </div>
                            <button className={styles.downloadBtn}>
                                <i className="fas fa-download"></i> Download
                            </button>
                        </div>

                        <div className={styles.reportItem}>
                            <div className={styles.reportIcon}>
                                <i className="fas fa-file-pdf"></i>
                            </div>
                            <div className={styles.reportInfo}>
                                <h4>Maintenance Log Report - December 2025</h4>
                                <p>Generated on Jan 5, 2026 at 9:00 AM</p>
                            </div>
                            <button className={styles.downloadBtn}>
                                <i className="fas fa-download"></i> Download
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Reports;
