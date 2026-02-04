import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Fuse from 'fuse.js';
import styles from './GlobalSearch.module.css';

interface SearchResult {
    id: string;
    type: 'asset' | 'pipeline' | 'alert';
    title: string;
    subtitle: string;
    icon: string;
    data: any;
}

interface GlobalSearchProps {
    assets: any[];
    pipelines: any[];
    alerts: any[];
    onResultClick: (result: SearchResult) => void;
}

export default function GlobalSearch({ assets, pipelines, alerts, onResultClick }: GlobalSearchProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const inputRef = useRef<HTMLInputElement>(null);

    // Prepare searchable data
    const searchData: SearchResult[] = [
        ...assets.map(asset => ({
            id: asset.id,
            type: 'asset' as const,
            title: asset.name || asset.id,
            subtitle: `${asset.type} • ${asset.status || 'Unknown'}`,
            icon: getAssetIcon(asset.type),
            data: asset,
        })),
        ...pipelines.map(pipeline => ({
            id: pipeline.properties.id,
            type: 'pipeline' as const,
            title: pipeline.properties.name,
            subtitle: `${pipeline.properties.type} • ${pipeline.properties.status}`,
            icon: 'fa-pipe',
            data: pipeline,
        })),
        ...alerts.map(alert => ({
            id: alert.id,
            type: 'alert' as const,
            title: alert.message,
            subtitle: `${alert.severity} • ${alert.timestamp}`,
            icon: 'fa-exclamation-triangle',
            data: alert,
        })),
    ];

    // Fuse.js configuration
    const fuse = new Fuse(searchData, {
        keys: ['title', 'subtitle', 'type'],
        threshold: 0.3,
        includeScore: true,
    });

    // Keyboard shortcut (Cmd/Ctrl + K)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
                setTimeout(() => inputRef.current?.focus(), 100);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
                setQuery('');
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Search with debouncing
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const timer = setTimeout(() => {
            const searchResults = fuse.search(query).slice(0, 8);
            setResults(searchResults.map(r => r.item));
            setSelectedIndex(0);
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Keyboard navigation
    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % results.length);
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + results.length) % results.length);
        } else if (e.key === 'Enter' && results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
        }
    };

    const handleResultClick = (result: SearchResult) => {
        onResultClick(result);
        setIsOpen(false);
        setQuery('');
    };

    return (
        <>
            {/* Search Trigger Button */}
            <button className={styles.trigger} onClick={() => setIsOpen(true)}>
                <i className="fas fa-search"></i>
                <span>Search...</span>
                <kbd>⌘K</kbd>
            </button>

            {/* Search Modal */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            className={styles.backdrop}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Search Panel */}
                        <motion.div
                            className={styles.panel}
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                        >
                            {/* Search Input */}
                            <div className={styles.inputWrapper}>
                                <i className="fas fa-search"></i>
                                <input
                                    ref={inputRef}
                                    type="text"
                                    placeholder="Search assets, pipelines, alerts..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className={styles.input}
                                />
                                {query && (
                                    <button className={styles.clear} onClick={() => setQuery('')}>
                                        <i className="fas fa-times"></i>
                                    </button>
                                )}
                            </div>

                            {/* Results */}
                            {results.length > 0 && (
                                <div className={styles.results}>
                                    {results.map((result, index) => (
                                        <motion.div
                                            key={result.id}
                                            className={`${styles.result} ${index === selectedIndex ? styles.selected : ''}`}
                                            onClick={() => handleResultClick(result)}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <div className={styles.resultIcon}>
                                                <i className={`fas ${result.icon}`}></i>
                                            </div>
                                            <div className={styles.resultContent}>
                                                <div className={styles.resultTitle}>{result.title}</div>
                                                <div className={styles.resultSubtitle}>{result.subtitle}</div>
                                            </div>
                                            <div className={styles.resultType}>{result.type}</div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Empty State */}
                            {query && results.length === 0 && (
                                <div className={styles.empty}>
                                    <i className="fas fa-search"></i>
                                    <p>No results found for "{query}"</p>
                                </div>
                            )}

                            {/* Footer */}
                            <div className={styles.footer}>
                                <div className={styles.hint}>
                                    <kbd>↑</kbd><kbd>↓</kbd> Navigate
                                </div>
                                <div className={styles.hint}>
                                    <kbd>↵</kbd> Select
                                </div>
                                <div className={styles.hint}>
                                    <kbd>ESC</kbd> Close
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

function getAssetIcon(type: string): string {
    const icons: Record<string, string> = {
        tank: 'fa-database',
        pump: 'fa-cogs',
        bore: 'fa-arrow-circle-down',
        govt: 'fa-building',
        sump: 'fa-water',
    };
    return icons[type] || 'fa-map-marker';
}
