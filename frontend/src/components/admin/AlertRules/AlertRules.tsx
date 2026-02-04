import { useState } from 'react';
import { motion } from 'framer-motion';
import styles from './AlertRules.module.css';

interface Rule {
    id: string;
    assetType: 'tank' | 'pump' | 'quality';
    metric: string;
    condition: '>' | '<' | '=' | '!=';
    threshold: number;
    severity: 'critical' | 'warning' | 'info';
    enabled: boolean;
}

export default function AlertRules() {
    const [rules, setRules] = useState<Rule[]>([
        { id: '1', assetType: 'tank', metric: 'level', condition: '<', threshold: 10, severity: 'critical', enabled: true },
        { id: '2', assetType: 'tank', metric: 'level', condition: '>', threshold: 90, severity: 'warning', enabled: true },
        { id: '3', assetType: 'pump', metric: 'vibration', condition: '>', threshold: 5, severity: 'critical', enabled: false },
        { id: '4', assetType: 'quality', metric: 'ph', condition: '>', threshold: 8.5, severity: 'warning', enabled: true },
    ]);

    const toggleRule = (id: string) => {
        setRules(rules.map(r => r.id === id ? { ...r, enabled: !r.enabled } : r));
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div className={styles.titleInfo}>
                    <h2><i className="fas fa-sliders-h"></i> Alert Rules</h2>
                    <p>Configure automatic alert thresholds</p>
                </div>
                <button className={styles.addBtn}>
                    <i className="fas fa-plus"></i> New Rule
                </button>
            </div>

            <div className={styles.rulesGrid}>
                {rules.map((rule) => (
                    <motion.div
                        key={rule.id}
                        className={`${styles.ruleCard} ${!rule.enabled ? styles.disabled : ''}`}
                        whileHover={{ y: -2 }}
                    >
                        <div className={styles.ruleHeader}>
                            <div className={styles.metric}>
                                <i className={`fas ${getAssetIcon(rule.assetType)}`}></i>
                                <span>{rule.assetType.toUpperCase()} • {rule.metric}</span>
                            </div>
                            <div className={styles.switch}>
                                <input
                                    type="checkbox"
                                    checked={rule.enabled}
                                    onChange={() => toggleRule(rule.id)}
                                    id={`rule-${rule.id}`}
                                />
                                <label htmlFor={`rule-${rule.id}`}></label>
                            </div>
                        </div>

                        <div className={styles.conditionRow}>
                            <span className={styles.operator}>{getConditionText(rule.condition)}</span>
                            <span className={styles.threshold}>{rule.threshold}</span>
                            <span className={styles.unit}>{getUnit(rule.metric)}</span>
                        </div>

                        <div className={styles.severityTag + ' ' + styles[rule.severity]}>
                            {rule.severity.toUpperCase()} ALERT
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

function getAssetIcon(type: string) {
    if (type === 'tank') return 'fa-database';
    if (type === 'pump') return 'fa-cogs';
    return 'fa-flask';
}

function getConditionText(condition: string) {
    if (condition === '>') return 'Greater than';
    if (condition === '<') return 'Less than';
    return 'Equal to';
}

function getUnit(metric: string) {
    if (metric === 'level') return '%';
    if (metric === 'vibration') return 'mm/s';
    return '';
}
