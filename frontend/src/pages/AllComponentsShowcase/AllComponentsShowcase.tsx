import { useState } from 'react';
import { ToastProvider, useToast } from '../../hooks/useToast';
import {
    // Sprint 1
    EnhancedCard,
    EnhancedStatCard,
    // Sprint 3
    Skeleton,
    SkeletonCard,
    LinearProgress,
    CircularProgress,
    Spinner,
    Fade,
    Slide,
    Scale,
    // Sprint 4
    Input,
    TextArea,
    Checkbox,
    Radio,
    FormField,
    EnhancedModal,
    ConfirmDialog,
    // Sprint 5
    EnhancedButton,
    IconButton,
    ButtonGroup,
    Breadcrumbs,
    Tabs,
    Pagination,
    // Sprint 6
    Badge,
    Tag,
} from '@components/ui';
import styles from './AllComponentsShowcase.module.css';

function ShowcaseContent() {
    const toast = useToast();
    const [showModal, setShowModal] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [inputValue, setInputValue] = useState('');
    const [textareaValue, setTextareaValue] = useState('');
    const [checkboxValue, setCheckboxValue] = useState(false);
    const [radioValue, setRadioValue] = useState('option1');
    const [tags, setTags] = useState([
        { id: 1, label: 'React', variant: 'primary' as const },
        { id: 2, label: 'TypeScript', variant: 'success' as const },
    ]);

    const breadcrumbItems = [
        { label: 'Home', href: '/' },
        { label: 'Components', href: '/components' },
        { label: 'Showcase' },
    ];

    const tabItems = [
        { id: 'sprint1', label: 'Sprint 1-3' },
        { id: 'sprint4', label: 'Sprint 4' },
        { id: 'sprint5', label: 'Sprint 5' },
        { id: 'sprint6', label: 'Sprint 6' },
    ];

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Complete Component Showcase</h1>
                <p className={styles.subtitle}>All Sprint 1-6 Components in One Place</p>
                <Breadcrumbs items={breadcrumbItems} />
            </header>

            <Tabs
                tabs={tabItems}
                activeTab={activeTab}
                onChange={setActiveTab}
                className={styles.tabs}
            />

            {/* Sprint 1-3: Cards, Loading, Transitions */}
            {activeTab === 0 && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Sprint 1: Enhanced Cards</h2>
                    <div className={styles.grid}>
                        <EnhancedCard
                            title="Enhanced Card"
                            subtitle="With hover effects and animations"
                            variant="elevated"
                        >
                            <p>This is an enhanced card with beautiful styling and smooth animations.</p>
                        </EnhancedCard>

                        <EnhancedStatCard
                            title="Total Users"
                            value="1,234"
                            change={12.5}
                            trend="up"
                            icon={
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 12C14.21 12 16 10.21 16 8C16 5.79 14.21 4 12 4C9.79 4 8 5.79 8 8C8 10.21 9.79 12 12 12ZM12 14C9.33 14 4 15.34 4 18V20H20V18C20 15.34 14.67 14 12 14Z" fill="currentColor" />
                                </svg>
                            }
                        />
                    </div>

                    <h2 className={styles.sectionTitle}>Sprint 3: Loading States</h2>
                    <div className={styles.grid}>
                        <div className={styles.demo}>
                            <h3>Skeleton</h3>
                            <Skeleton width="100%" height={20} />
                            <Skeleton width="80%" height={20} />
                            <Skeleton width="60%" height={20} />
                        </div>

                        <div className={styles.demo}>
                            <h3>Progress Bars</h3>
                            <LinearProgress value={65} />
                            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
                                <CircularProgress value={75} size={60} />
                                <Spinner size="md" />
                            </div>
                        </div>
                    </div>

                    <h2 className={styles.sectionTitle}>Sprint 3: Transitions</h2>
                    <div className={styles.grid}>
                        <Fade in={true}>
                            <div className={styles.transitionBox}>Fade In</div>
                        </Fade>
                        <Slide in={true} direction="left">
                            <div className={styles.transitionBox}>Slide In</div>
                        </Slide>
                        <Scale in={true}>
                            <div className={styles.transitionBox}>Scale In</div>
                        </Scale>
                    </div>
                </div>
            )}

            {/* Sprint 4: Forms & Modals */}
            {activeTab === 1 && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Sprint 4: Form Components</h2>
                    <div className={styles.formGrid}>
                        <FormField label="Text Input" required>
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder="Enter text..."
                            />
                        </FormField>

                        <FormField label="Text Area">
                            <TextArea
                                value={textareaValue}
                                onChange={(e) => setTextareaValue(e.target.value)}
                                placeholder="Enter longer text..."
                                rows={4}
                            />
                        </FormField>

                        <FormField label="Checkbox">
                            <Checkbox
                                checked={checkboxValue}
                                onChange={(e) => setCheckboxValue(e.target.checked)}
                                label="I agree to the terms"
                            />
                        </FormField>

                        <FormField label="Radio Buttons">
                            <Radio
                                name="demo-radio"
                                value="option1"
                                checked={radioValue === 'option1'}
                                onChange={(e) => setRadioValue(e.target.value)}
                                label="Option 1"
                            />
                            <Radio
                                name="demo-radio"
                                value="option2"
                                checked={radioValue === 'option2'}
                                onChange={(e) => setRadioValue(e.target.value)}
                                label="Option 2"
                            />
                        </FormField>
                    </div>

                    <h2 className={styles.sectionTitle}>Sprint 4: Modals</h2>
                    <div className={styles.buttonRow}>
                        <EnhancedButton onClick={() => setShowModal(true)}>
                            Open Modal
                        </EnhancedButton>
                        <EnhancedButton variant="danger" onClick={() => setShowConfirm(true)}>
                            Open Confirm Dialog
                        </EnhancedButton>
                    </div>

                    <EnhancedModal
                        isOpen={showModal}
                        onClose={() => setShowModal(false)}
                        title="Enhanced Modal"
                    >
                        <p>This is a modal with smooth animations and backdrop blur.</p>
                        <EnhancedButton onClick={() => setShowModal(false)}>Close</EnhancedButton>
                    </EnhancedModal>

                    <ConfirmDialog
                        isOpen={showConfirm}
                        onClose={() => setShowConfirm(false)}
                        onConfirm={() => {
                            toast.success('Action confirmed!');
                            setShowConfirm(false);
                        }}
                        title="Confirm Action"
                        message="Are you sure you want to proceed?"
                    />
                </div>
            )}

            {/* Sprint 5: Buttons & Navigation */}
            {activeTab === 2 && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Sprint 5: Buttons</h2>
                    <div className={styles.buttonShowcase}>
                        <ButtonGroup>
                            <EnhancedButton variant="primary">Primary</EnhancedButton>
                            <EnhancedButton variant="secondary">Secondary</EnhancedButton>
                            <EnhancedButton variant="ghost">Ghost</EnhancedButton>
                        </ButtonGroup>

                        <div className={styles.iconButtons}>
                            <IconButton variant="primary" aria-label="Heart">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 17.5L8.825 16.45C4.4 12.475 1.5 9.875 1.5 6.75C1.5 4.15 3.525 2.125 6.125 2.125C7.6 2.125 9.025 2.8 10 3.875C10.975 2.8 12.4 2.125 13.875 2.125C16.475 2.125 18.5 4.15 18.5 6.75C18.5 9.875 15.6 12.475 11.175 16.45L10 17.5Z" fill="currentColor" />
                                </svg>
                            </IconButton>
                            <IconButton variant="secondary" aria-label="Star">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M10 15L4.122 18.09L5.245 11.545L0.489 6.91L7.061 5.955L10 0L12.939 5.955L19.511 6.91L14.755 11.545L15.878 18.09L10 15Z" fill="currentColor" />
                                </svg>
                            </IconButton>
                        </div>
                    </div>

                    <h2 className={styles.sectionTitle}>Sprint 5: Pagination</h2>
                    <Pagination
                        currentPage={currentPage}
                        totalPages={10}
                        onPageChange={setCurrentPage}
                        pageSize={10}
                        onPageSizeChange={() => { }}
                    />
                </div>
            )}

            {/* Sprint 6: Notifications & Tags */}
            {activeTab === 3 && (
                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>Sprint 6: Toast Notifications</h2>
                    <div className={styles.buttonRow}>
                        <EnhancedButton
                            variant="primary"
                            onClick={() => toast.success('Success!')}
                        >
                            Success Toast
                        </EnhancedButton>
                        <EnhancedButton
                            variant="danger"
                            onClick={() => toast.error('Error occurred!')}
                        >
                            Error Toast
                        </EnhancedButton>
                        <EnhancedButton
                            variant="secondary"
                            onClick={() => toast.warning('Warning message')}
                        >
                            Warning Toast
                        </EnhancedButton>
                        <EnhancedButton
                            variant="ghost"
                            onClick={() => toast.info('Info message')}
                        >
                            Info Toast
                        </EnhancedButton>
                    </div>

                    <h2 className={styles.sectionTitle}>Sprint 6: Badges</h2>
                    <div className={styles.badgeGrid}>
                        <Badge count={5} variant="error">
                            <IconButton variant="ghost" aria-label="Notifications">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                                    <path d="M12 22C13.1 22 14 21.1 14 20H10C10 21.1 10.9 22 12 22ZM18 16V11C18 7.93 16.37 5.36 13.5 4.68V4C13.5 3.17 12.83 2.5 12 2.5C11.17 2.5 10.5 3.17 10.5 4V4.68C7.64 5.36 6 7.92 6 11V16L4 18V19H20V18L18 16Z" fill="currentColor" />
                                </svg>
                            </IconButton>
                        </Badge>

                        <div className={styles.badgeList}>
                            <Badge text="New" variant="primary" />
                            <Badge text="Pro" variant="success" />
                            <Badge text="Beta" variant="warning" />
                        </div>
                    </div>

                    <h2 className={styles.sectionTitle}>Sprint 6: Tags</h2>
                    <div className={styles.tagContainer}>
                        {tags.map(tag => (
                            <Tag
                                key={tag.id}
                                variant={tag.variant}
                                onRemove={() => setTags(tags.filter(t => t.id !== tag.id))}
                            >
                                {tag.label}
                            </Tag>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export function AllComponentsShowcase() {
    return (
        <ToastProvider position="top-right">
            <ShowcaseContent />
        </ToastProvider>
    );
}

export default AllComponentsShowcase;
