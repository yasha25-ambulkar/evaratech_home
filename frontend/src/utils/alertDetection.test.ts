import { describe, it, expect } from 'vitest';
import { detectAlerts } from '../utils/alertDetection';
import type { PumpHouseData, TankData } from '../types/evaratech.types';

describe('alertDetection', () => {

    it('should detect inactive nodes', () => {
        // Mock inactive node
        const inactiveNode: PumpHouseData = {
            nodeId: 'test-pump',
            name: 'Test Pump',
            type: 'pump',
            status: 'active',
            isActive: false, // Explicitly false
            lastUpdated: new Date(Date.now() - 50 * 60 * 60 * 1000), // 50 hours ago
            location: [0, 0],
            flowRate: [],
            pressure: [],
            powerConsumption: [],
            pumpStatus: 'Stopped',
            runningHours: 0,
            lastMaintenance: new Date(),
            capacity: 1000,
            motorPower: 10,
            pumpModel: 'Test'
        };

        const alerts = detectAlerts(inactiveNode);
        expect(alerts).toHaveLength(1);
        expect(alerts[0].type).toBe('inactive');
    });

    it('should detect low water level in tanks', () => {
        const lowWaterTank: TankData = {
            nodeId: 'test-tank',
            name: 'Test Tank',
            type: 'tank',
            status: 'active',
            isActive: true,
            lastUpdated: new Date(),
            location: [0, 0],
            waterLevel: [{ timestamp: new Date(), value: 15, unit: '%' }], // 15% < 20%
            currentVolume: [],
            fillRate: [],
            consumptionRate: [],
            temperature: [],
            capacity: 10000,
            height: 10,
            diameter: 5,
            tankType: 'OHT',
            servingArea: 'Test'
        };

        const alerts = detectAlerts(lowWaterTank);
        const lowWaterAlert = alerts.find(a => a.type === 'low-water');
        expect(lowWaterAlert).toBeDefined();
    });

    it('should detect pump running with zero flow', () => {
        const faultyPump: PumpHouseData = {
            nodeId: 'faulty-pump',
            name: 'Faulty Pump',
            type: 'pump',
            status: 'active',
            isActive: true,
            lastUpdated: new Date(),
            location: [0, 0],
            flowRate: [{ timestamp: new Date(), value: 0, unit: 'L/min' }],
            pressure: [],
            powerConsumption: [],
            pumpStatus: 'Running',
            runningHours: 0,
            lastMaintenance: new Date(),
            capacity: 1000,
            motorPower: 10,
            pumpModel: 'Test'
        };

        const alerts = detectAlerts(faultyPump);
        const pumpIssue = alerts.find(a => a.type === 'pump-issue');
        expect(pumpIssue).toBeDefined();
        expect(pumpIssue?.severity).toBe('critical');
    });
});
