import { useState, useEffect } from 'react';
import { supabaseService } from '../services/supabase.service';
import type { PipelineFeature } from '../types';

interface UsePipelinesReturn {
    pipelines: PipelineFeature[];
    loading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

export function usePipelines(): UsePipelinesReturn {
    const [pipelines, setPipelines] = useState<PipelineFeature[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchPipelines = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await supabaseService.getPipelines();

            // Transform Supabase data to GeoJSON Feature format
            const transformedPipelines: PipelineFeature[] = data.map((item: any) => ({
                type: 'Feature',
                properties: {
                    id: item.id,
                    name: item.name,
                    type: item.type === 'main' ? 'Main Line' : item.type === 'distribution' ? 'Dist Line' : 'Bore Line',
                    cap: item.capacity || 'N/A',
                    maint: item.maintenance_info || 'N/A',
                    status: item.status || 'Normal',
                    color: item.color || '#00b4d8',
                },
                geometry: {
                    type: 'LineString',
                    coordinates: item.coordinates,
                },
            }));

            setPipelines(transformedPipelines);
        } catch (err) {
            console.error('Error fetching pipelines:', err);
            setError('Failed to load pipelines. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPipelines();

        // Set up real-time subscription
        const subscription = supabaseService.subscribeToPipelines((_payload) => {

            fetchPipelines(); // Refetch on any change
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    return {
        pipelines,
        loading,
        error,
        refetch: fetchPipelines,
    };
}
