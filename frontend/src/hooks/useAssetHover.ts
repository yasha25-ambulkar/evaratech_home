import { useEffect, useCallback, useRef } from 'react';
import { useUIStore } from '../store/uiStore';
import { BaseAsset } from '../models/Asset';

/**
 * Custom hook for managing asset hover interactions with intelligent timing
 * 
 * Features:
 * - Debounced hover detection (50ms)
 * - Auto-close after 5 seconds of inactivity
 * - Panel locking on user interaction
 * - Memory leak prevention
 * 
 * @returns Hover management functions
 */
export function useAssetHover() {
    const {
        hoveredAsset,
        isPanelLocked,
        setHoveredAsset,
        lockPanel,
        unlockPanel,
        closeHoverPanel,
        setAutoCloseTimer,
        autoCloseTimer,
    } = useUIStore();

    // Debounce timer ref
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    /**
     * Handle asset hover with debouncing
     * Prevents jitter when mouse moves between close markers
     */
    const handleAssetHover = useCallback((asset: BaseAsset | null) => {
        // Clear debounce timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // If panel is locked, don't change on hover
        if (isPanelLocked && asset !== hoveredAsset) {
            return;
        }

        // Debounce hover detection (80ms - adjusted for sensitivity)
        debounceTimerRef.current = setTimeout(() => {
            setHoveredAsset(asset);

            // Start auto-close timer if asset is set and panel not locked
            if (asset && !isPanelLocked) {
                startAutoCloseTimer();
            }
        }, 80);
    }, [isPanelLocked, hoveredAsset, setHoveredAsset]);

    /**
     * Start 5-second auto-close timer
     */
    const startAutoCloseTimer = useCallback(() => {
        // Clear existing timer
        if (autoCloseTimer) {
            clearTimeout(autoCloseTimer);
        }

        // Set new timer
        const timer = setTimeout(() => {
            if (!isPanelLocked) {
                closeHoverPanel();
            }
        }, 5000); // 5 seconds

        setAutoCloseTimer(timer);
    }, [autoCloseTimer, isPanelLocked, closeHoverPanel, setAutoCloseTimer]);

    /**
     * Reset auto-close timer (called on panel interaction)
     */
    const resetAutoCloseTimer = useCallback(() => {
        if (!isPanelLocked && hoveredAsset) {
            startAutoCloseTimer();
        }
    }, [isPanelLocked, hoveredAsset, startAutoCloseTimer]);

    /**
     * Lock panel to prevent auto-close
     * Called when user clicks on panel
     */
    const handlePanelLock = useCallback(() => {
        lockPanel();
    }, [lockPanel]);

    /**
     * Unlock panel and restart auto-close
     */
    const handlePanelUnlock = useCallback(() => {
        unlockPanel();
        if (hoveredAsset) {
            startAutoCloseTimer();
        }
    }, [unlockPanel, hoveredAsset, startAutoCloseTimer]);

    /**
     * Force close panel
     * Called when user clicks background or close button
     */
    const handleForceClose = useCallback(() => {
        closeHoverPanel();
    }, [closeHoverPanel]);

    /**
     * Cleanup on unmount
     */
    useEffect(() => {
        return () => {
            // Clear debounce timer
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }

            // Clear auto-close timer
            if (autoCloseTimer) {
                clearTimeout(autoCloseTimer);
            }
        };
    }, [autoCloseTimer]);

    return {
        hoveredAsset,
        isPanelLocked,
        handleAssetHover,
        handlePanelLock,
        handlePanelUnlock,
        handleForceClose,
        resetAutoCloseTimer,
    };
}
