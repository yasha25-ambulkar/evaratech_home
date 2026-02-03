import { describe, it, expect } from 'vitest';
import { generateSensorReadings, generateAllMockNodeData } from '../utils/mockDataGenerator';

describe('mockDataGenerator', () => {

    it('should generate sensor readings within range', () => {
        const config = { min: 10, max: 20, unit: 'unit' };
        const readings = generateSensorReadings(config, 24);

        expect(readings).toHaveLength(288); // 24h / 5min = 288 readings
        readings.forEach(r => {
            // Allow small margin for variation
            expect(r.value).toBeGreaterThanOrEqual(config.min * 0.5);
            expect(r.value).toBeLessThanOrEqual(config.max * 1.5);
            expect(r.unit).toBe('unit');
        });
    });

    it('should generate valid node data', () => {
        const allNodes = generateAllMockNodeData();
        const pumpNode = Object.values(allNodes).find(n => n.type === 'pump');

        expect(pumpNode).toBeDefined();
        if (pumpNode) {
            expect(pumpNode.type).toBe('pump');
            expect(pumpNode.isActive).toBe(true);

            // Check if sensor arrays are populated
            // @ts-ignore
            expect(pumpNode.flowRate.length).toBeGreaterThan(0);
        }
    });
});
