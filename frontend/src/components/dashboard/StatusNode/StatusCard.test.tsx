import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StatusCard from './StatusCard';
import type { PumpHouseData } from '../../../types/evaratech.types';

describe('StatusCard', () => {
    const mockPump: PumpHouseData = {
        nodeId: 'test-pump',
        name: 'Test Pump',
        type: 'pump',
        status: 'active',
        isActive: true,
        lastUpdated: new Date(),
        location: [0, 0],
        flowRate: [{ timestamp: new Date(), value: 300, unit: 'L/min' }],
        pressure: [{ timestamp: new Date(), value: 3.5, unit: 'bar' }],
        powerConsumption: [],
        pumpStatus: 'Running',
        runningHours: 100,
        lastMaintenance: new Date(),
        capacity: 1000,
        motorPower: 10,
        pumpModel: 'Test Model'
    };

    it('renders correct node information', () => {
        render(<StatusCard node={mockPump} onClick={() => { }} />);

        expect(screen.getByText('Test Pump')).toBeInTheDocument();
        // expect(screen.getByText(/pump/i)).toBeInTheDocument(); // Case insensitive check
        expect(screen.getByText('300')).toBeInTheDocument(); // Flow value
        expect(screen.getByText('L/min')).toBeInTheDocument();
    });

    it('calls onClick handler when clicked', () => {
        const handleClick = vi.fn();
        render(<StatusCard node={mockPump} onClick={handleClick} />);

        fireEvent.click(screen.getByText('Test Pump'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });
});
