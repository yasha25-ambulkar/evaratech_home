import { useState } from 'react';
import { ToastProvider, useToast } from '../../hooks/useToast';
import { Badge, Tag, EnhancedButton, IconButton } from '@components/ui';
import styles from './ComponentShowcase.module.css';

/**
 * ComponentShowcase
 * Version: 1.0.0
 * 
 * Demo page showcasing Sprint 6 components
 */

function ShowcaseContent() {
    const toast = useToast();
    const [notificationCount, setNotificationCount] = useState(5);
    const [tags, setTags] = useState([
        { id: 1, label: 'React', variant: 'primary' as const },
        { id: 2, label: 'TypeScript', variant: 'success' as const },
        { id: 3, label: 'CSS', variant: 'warning' as const },
    ]);

    const handleToastDemo = (type: 'success' | 'error' | 'warning' | 'info') => {
        const messages = {
            success: 'Operation completed successfully!',
            error: 'An error occurred. Please try again.',
            warning: 'This action requires confirmation.',
            info: 'New updates are available.',
        };

        if (type === 'error') {
            toast.error(messages[type], {
                duration: 7000,
                action: {
                    label: 'Retry',
                    onClick: () => toast.info('Retrying...'),
                },
            });
        } else {
            toast[type](messages[type]);
        }
    };

    const removeTag = (id: number) => {
        setTags(tags.filter(tag => tag.id !== id));
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Sprint 6 Component Showcase</h1>
            <p className={styles.subtitle}>
                Toast Notifications, Badges, and Tags
            </p>

            {/* Toast Notifications */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Toast Notifications</h2>
                <p className={styles.description}>
                    Click the buttons below to see different toast notification types
                </p>

                <div className={styles.buttonGroup}>
                    <EnhancedButton
                        variant="primary"
                        onClick={() => handleToastDemo('success')}
                    >
                        Success Toast
                    </EnhancedButton>

                    <EnhancedButton
                        variant="danger"
                        onClick={() => handleToastDemo('error')}
                    >
                        Error Toast (with Action)
                    </EnhancedButton>

                    <EnhancedButton
                        variant="secondary"
                        onClick={() => handleToastDemo('warning')}
                    >
                        Warning Toast
                    </EnhancedButton>

                    <EnhancedButton
                        variant="ghost"
                        onClick={() => handleToastDemo('info')}
                    >
                        Info Toast
                    </EnhancedButton>
                </div>
            </section>

            {/* Badges */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Badges</h2>
                <p className={styles.description}>
                    Notification, status, and text badges
                </p>

                <div className={styles.badgeGrid}>
                    {/* Notification Badge */}
                    <div className={styles.badgeDemo}>
                        <h3>Notification Badge</h3>
                        <Badge count={notificationCount} variant="error" position="top-right">
                            <IconButton
                                variant="ghost"
                                aria-label={`${notificationCount} notifications`}
                                onClick={() => setNotificationCount(0)}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="currentColor" />
                                </svg>
                            </IconButton>
                        </Badge>
                    </div>

                    {/* Status Badge */}
                    <div className={styles.badgeDemo}>
                        <h3>Status Badge</h3>
                        <Badge status="online" variant="success" position="bottom-right">
                            <div className={styles.avatar}>
                                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                                    <circle cx="20" cy="20" r="20" fill="#E5E7EB" />
                                    <path d="M20 20C22.7614 20 25 17.7614 25 15C25 12.2386 22.7614 10 20 10C17.2386 10 15 12.2386 15 15C15 17.7614 17.2386 20 20 20Z" fill="#9CA3AF" />
                                    <path d="M20 22.5C14.1667 22.5 9.16667 25.4167 9.16667 29.1667V32.5H30.8333V29.1667C30.8333 25.4167 25.8333 22.5 20 22.5Z" fill="#9CA3AF" />
                                </svg>
                            </div>
                        </Badge>
                    </div>

                    {/* Text Badges */}
                    <div className={styles.badgeDemo}>
                        <h3>Text Badges</h3>
                        <div className={styles.badgeList}>
                            <Badge text="New" variant="primary" size="sm" />
                            <Badge text="Pro" variant="success" size="md" />
                            <Badge text="Beta" variant="warning" size="lg" />
                            <Badge text="Hot" variant="error" size="md" />
                        </div>
                    </div>

                    {/* High Count */}
                    <div className={styles.badgeDemo}>
                        <h3>High Count (99+)</h3>
                        <Badge count={150} variant="error" position="top-right">
                            <IconButton variant="ghost" aria-label="150 messages">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" fill="currentColor" />
                                </svg>
                            </IconButton>
                        </Badge>
                    </div>
                </div>
            </section>

            {/* Tags */}
            <section className={styles.section}>
                <h2 className={styles.sectionTitle}>Tags</h2>
                <p className={styles.description}>
                    Removable tags with different variants
                </p>

                <div className={styles.tagContainer}>
                    {tags.map(tag => (
                        <Tag
                            key={tag.id}
                            variant={tag.variant}
                            onRemove={() => removeTag(tag.id)}
                        >
                            {tag.label}
                        </Tag>
                    ))}

                    {tags.length === 0 && (
                        <p className={styles.emptyMessage}>
                            All tags removed! Refresh to reset.
                        </p>
                    )}
                </div>

                <div className={styles.tagExamples}>
                    <h3>Tag Variants</h3>
                    <div className={styles.tagList}>
                        <Tag variant="primary">Primary</Tag>
                        <Tag variant="success">Success</Tag>
                        <Tag variant="warning">Warning</Tag>
                        <Tag variant="error">Error</Tag>
                    </div>

                    <h3>Tag Sizes</h3>
                    <div className={styles.tagList}>
                        <Tag variant="primary" size="sm">Small</Tag>
                        <Tag variant="primary" size="md">Medium</Tag>
                        <Tag variant="primary" size="lg">Large</Tag>
                    </div>

                    <h3>Tag with Icon</h3>
                    <div className={styles.tagList}>
                        <Tag
                            variant="warning"
                            icon={
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M7 0L8.5 5.5L14 7L8.5 8.5L7 14L5.5 8.5L0 7L5.5 5.5L7 0Z" fill="currentColor" />
                                </svg>
                            }
                        >
                            Featured
                        </Tag>
                    </div>
                </div>
            </section>
        </div>
    );
}

export function ComponentShowcase() {
    return (
        <ToastProvider position="top-right">
            <ShowcaseContent />
        </ToastProvider>
    );
}

export default ComponentShowcase;
