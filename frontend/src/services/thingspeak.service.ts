import { api } from './api';
import type { SensorReading } from '../types';

const THINGSPEAK_BASE_URL = 'https://api.thingspeak.com';

interface ThingSpeakChannel {
    channelId: string;
    readApiKey: string;
}

// ThingSpeak service for real-time sensor data
export const thingSpeakService = {
    /**
     * Fetch latest sensor reading from ThingSpeak channel
     */
    async getLatestReading(channel: ThingSpeakChannel): Promise<any | null> {
        try {
            const url = `${THINGSPEAK_BASE_URL}/channels/${channel.channelId}/feeds/last.json?api_key=${channel.readApiKey}`;
            const response = await api.get<any>(url);

            if (!response) return null;

            return {
                timestamp: response.created_at,
                tds: parseFloat(response.field1) || 0,
                ph: parseFloat(response.field2) || 0,
                temperature: parseFloat(response.field3) || 0,
                flowRate: parseFloat(response.field4) || 0,
            };
        } catch (error) {
            console.error('Error fetching ThingSpeak data:', error);
            return null;
        }
    },

    /**
     * Fetch historical sensor readings
     */
    async getHistoricalReadings(
        channel: ThingSpeakChannel,
        results: number = 100
    ): Promise<SensorReading[]> {
        try {
            const url = `${THINGSPEAK_BASE_URL}/channels/${channel.channelId}/feeds.json?api_key=${channel.readApiKey}&results=${results}`;
            const response = await api.get<any>(url);

            if (!response?.feeds) return [];

            return response.feeds.map((feed: any) => ({
                timestamp: feed.created_at,
                tds: parseFloat(feed.field1) || 0,
                ph: parseFloat(feed.field2) || 0,
                temperature: parseFloat(feed.field3) || 0,
                flowRate: parseFloat(feed.field4) || 0,
            }));
        } catch (error) {
            console.error('Error fetching ThingSpeak historical data:', error);
            return [];
        }
    },
};

// Example channel configuration (replace with actual values)
export const SENSOR_CHANNELS = {
    himalaya: {
        channelId: 'YOUR_CHANNEL_ID',
        readApiKey: 'YOUR_READ_API_KEY',
    },
    ghc: {
        channelId: 'YOUR_CHANNEL_ID',
        readApiKey: 'YOUR_READ_API_KEY',
    },
};
