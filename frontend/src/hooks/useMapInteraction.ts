import { useState, useCallback } from 'react';

interface UseMapInteractionReturn {
    zoom: number;
    center: [number, number];
    setZoom: (zoom: number) => void;
    setCenter: (center: [number, number]) => void;
    resetView: () => void;
}

export function useMapInteraction(
    initialCenter: [number, number] = [17.445, 78.348],
    initialZoom: number = 16
): UseMapInteractionReturn {
    const [zoom, setZoom] = useState(initialZoom);
    const [center, setCenter] = useState<[number, number]>(initialCenter);

    const resetView = useCallback(() => {
        setZoom(initialZoom);
        setCenter(initialCenter);
    }, [initialCenter, initialZoom]);

    return {
        zoom,
        center,
        setZoom,
        setCenter,
        resetView,
    };
}
