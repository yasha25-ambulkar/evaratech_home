import { useState, useEffect } from 'react';
import { thingSpeakService, SENSOR_CHANNELS } from '@services/thingspeak.service';
import type { SensorReading } from '../types';

export function useSensorData(sensorId: 'himalaya' | 'ghc', autoRefresh: boolean = true) {
    const [data, setData] = useState<SensorReading | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const channel = SENSOR_CHANNELS[sensorId];
                const reading = await thingSpeakService.getLatestReading(channel);
                setData(reading);
                setError(null);
            } catch (err) {
                setError('Failed to fetch sensor data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        // Auto-refresh every 30 seconds if enabled
        if (autoRefresh) {
            const interval = setInterval(fetchData, 30000);
            return () => clearInterval(interval);
        }
    }, [sensorId, autoRefresh]);

    return { data, loading, error };
}
