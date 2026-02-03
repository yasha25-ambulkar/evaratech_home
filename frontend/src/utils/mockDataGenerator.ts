import type {
    SensorReading,
    PumpHouseData,
    SumpData,
    TankData,
    BorewellData,
    NodeData,
    NodeType,
} from '../types/evaratech.types';
// import { assetDatabase } from '../data/assets.data';

// ============================================================================
// MOCK DATA CONFIGURATION
// ============================================================================

const MOCK_CONFIG = {
    // Time intervals
    INTERVAL_MINUTES: 5, // 5-minute intervals (like ThingSpeak)
    HOURS_OF_DATA: 24,   // Generate 24 hours of historical data

    // Realistic ranges for each metric
    PUMP: {
        flowRate: { min: 200, max: 500, unit: 'L/min' },
        pressure: { min: 2.5, max: 4.5, unit: 'bar' },
        powerConsumption: { min: 8, max: 15, unit: 'kW' },
    },
    SUMP: {
        waterLevel: { min: 20, max: 95, unit: '%' },
        inletFlow: { min: 100, max: 300, unit: 'L/min' },
        outletFlow: { min: 150, max: 350, unit: 'L/min' },
        temperature: { min: 20, max: 28, unit: '°C' },
    },
    TANK: {
        waterLevel: { min: 30, max: 90, unit: '%' },
        fillRate: { min: 100, max: 250, unit: 'L/min' },
        consumptionRate: { min: 80, max: 200, unit: 'L/min' },
        temperature: { min: 18, max: 26, unit: '°C' },
    },
    BOREWELL: {
        waterLevel: { min: 30, max: 60, unit: 'meters' },
        flowRate: { min: 100, max: 200, unit: 'L/min' },
    },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Generate random value within range with optional variation
 */
function randomInRange(min: number, max: number, variation: number = 0.1): number {
    const base = min + Math.random() * (max - min);
    const vary = base * variation * (Math.random() - 0.5);
    return Math.max(min, Math.min(max, base + vary));
}

/**
 * Add day/night usage pattern (higher during day, lower at night)
 */
function applyDayNightPattern(value: number, hour: number): number {
    // Peak usage: 6 AM - 10 PM
    // Low usage: 10 PM - 6 AM
    const isDaytime = hour >= 6 && hour < 22;
    const factor = isDaytime ? 1.0 : 0.6; // 60% at night
    return value * factor;
}

/**
 * Add weekly pattern (higher on weekdays)
 */
function applyWeeklyPattern(value: number, date: Date): number {
    const day = date.getDay();
    const isWeekend = day === 0 || day === 6;
    const factor = isWeekend ? 0.8 : 1.0; // 80% on weekends
    return value * factor;
}

// ============================================================================
// SENSOR DATA GENERATION
// ============================================================================

/**
 * Generate time-series sensor readings
 */
export function generateSensorReadings(
    config: { min: number; max: number; unit: string },
    hours: number = MOCK_CONFIG.HOURS_OF_DATA,
    applyPatterns: boolean = true
): SensorReading[] {
    const readings: SensorReading[] = [];
    const now = new Date();
    const intervalMs = MOCK_CONFIG.INTERVAL_MINUTES * 60 * 1000;
    const totalReadings = (hours * 60) / MOCK_CONFIG.INTERVAL_MINUTES;

    for (let i = 0; i < totalReadings; i++) {
        const timestamp = new Date(now.getTime() - (totalReadings - i) * intervalMs);
        let value = randomInRange(config.min, config.max);

        if (applyPatterns) {
            value = applyDayNightPattern(value, timestamp.getHours());
            value = applyWeeklyPattern(value, timestamp);
        }

        readings.push({
            timestamp,
            value: Math.round(value * 100) / 100, // Round to 2 decimals
            unit: config.unit,
        });
    }

    return readings;
}

// ============================================================================
// NODE DATA GENERATION
// ============================================================================

/**
 * Generate mock Pump House data
 */
function generatePumpHouseData(nodeId: string, name: string, location: [number, number]): PumpHouseData {
    const isRunning = Math.random() > 0.2; // 80% chance running
    const lastUpdated = new Date(Date.now() - Math.random() * 10 * 60 * 1000); // Within last 10 mins

    return {
        nodeId,
        name,
        type: 'pump',
        location,
        lastUpdated,
        status: isRunning ? 'active' : 'inactive',
        isActive: true,

        flowRate: generateSensorReadings(MOCK_CONFIG.PUMP.flowRate),
        pressure: generateSensorReadings(MOCK_CONFIG.PUMP.pressure),
        powerConsumption: generateSensorReadings(MOCK_CONFIG.PUMP.powerConsumption),

        pumpStatus: isRunning ? 'Running' : 'Stopped',
        runningHours: Math.floor(Math.random() * 5000),
        lastMaintenance: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000), // Within 90 days

        capacity: 500,
        motorPower: 15,
        pumpModel: 'Kirloskar KDS-200',
    };
}

/**
 * Generate mock Sump data
 */
function generateSumpData(nodeId: string, name: string, location: [number, number]): SumpData {
    const capacity = 200000; // 200,000 liters
    const lastUpdated = new Date(Date.now() - Math.random() * 10 * 60 * 1000);

    return {
        nodeId,
        name,
        type: 'sump',
        location,
        lastUpdated,
        status: 'active',
        isActive: true,

        waterLevel: generateSensorReadings(MOCK_CONFIG.SUMP.waterLevel),
        currentVolume: generateSensorReadings({ min: capacity * 0.2, max: capacity * 0.95, unit: 'L' }),
        inletFlow: generateSensorReadings(MOCK_CONFIG.SUMP.inletFlow),
        outletFlow: generateSensorReadings(MOCK_CONFIG.SUMP.outletFlow),
        temperature: generateSensorReadings(MOCK_CONFIG.SUMP.temperature),

        capacity,
        dimensions: {
            length: 10,
            width: 8,
            depth: 2.5,
        },
    };
}

/**
 * Generate mock Tank data
 */
function generateTankData(nodeId: string, name: string, location: [number, number]): TankData {
    const capacity = 200000; // 200,000 liters
    const lastUpdated = new Date(Date.now() - Math.random() * 10 * 60 * 1000);

    return {
        nodeId,
        name,
        type: 'tank',
        location,
        lastUpdated,
        status: 'active',
        isActive: true,

        waterLevel: generateSensorReadings(MOCK_CONFIG.TANK.waterLevel),
        currentVolume: generateSensorReadings({ min: capacity * 0.3, max: capacity * 0.9, unit: 'L' }),
        fillRate: generateSensorReadings(MOCK_CONFIG.TANK.fillRate),
        consumptionRate: generateSensorReadings(MOCK_CONFIG.TANK.consumptionRate),
        temperature: generateSensorReadings(MOCK_CONFIG.TANK.temperature),

        capacity,
        height: 15,
        diameter: 12,
        tankType: 'OHT',
        servingArea: name.includes('Bakul') ? 'Bakul Hostel' : 'Campus',
    };
}

/**
 * Generate mock Borewell data
 */
function generateBorewellData(
    nodeId: string,
    name: string,
    location: [number, number],
    type: 'bore' | 'govt'
): BorewellData {
    const isWorking = Math.random() > 0.4; // 60% working
    const lastUpdated = new Date(Date.now() - Math.random() * 30 * 60 * 1000);

    return {
        nodeId,
        name,
        type,
        location,
        lastUpdated,
        status: isWorking ? 'active' : 'inactive',
        isActive: isWorking,

        waterLevel: generateSensorReadings(MOCK_CONFIG.BOREWELL.waterLevel, 24, false),
        flowRate: generateSensorReadings(MOCK_CONFIG.BOREWELL.flowRate),
        dailyOutput: generateSensorReadings({ min: 100000, max: 300000, unit: 'L' }, 24, false),

        pumpStatus: isWorking ? 'Working' : 'Not Working',
        motorPower: 5,

        depth: 100,
        diameter: 6,
        yearDrilled: 2010 + Math.floor(Math.random() * 14),
        waterQuality: 'Good',
    };
}

// ============================================================================
// MAIN GENERATION FUNCTION
// ============================================================================

/**
 * Generate mock data for all existing assets
 */
export function generateAllMockNodeData(): Record<string, NodeData> {
    const mockData: Record<string, NodeData> = {};

    // Map existing assets to mock data
    const assetPositions = {
        // Pump Houses
        'Pump House 1': { position: [17.4456, 78.3516], type: 'pump' as NodeType },
        'Pump House 2': { position: [17.44608, 78.34925], type: 'pump' as NodeType },
        'Pump House 3': { position: [17.4430, 78.3487], type: 'pump' as NodeType },
        'Pump House 4': { position: [17.4481, 78.3489], type: 'pump' as NodeType },

        // Sumps
        'Sump S1': { position: [17.448097, 78.349060], type: 'sump' as NodeType },
        'Sump S2': { position: [17.444919, 78.346195], type: 'sump' as NodeType },
        'Sump S3': { position: [17.446779, 78.346996], type: 'sump' as NodeType },
        'Sump S4 (Main Sump)': { position: [17.445630, 78.351593], type: 'sump' as NodeType },
        'Sump S5': { position: [17.444766, 78.350087], type: 'sump' as NodeType },

        // Tanks
        'Bakul OHT': { position: [17.448045, 78.348438], type: 'tank' as NodeType },
        'Parijat OHT': { position: [17.447547, 78.347752], type: 'tank' as NodeType },
        'Kadamba OHT': { position: [17.446907, 78.347178], type: 'tank' as NodeType },

        // Borewells
        'Borewell P5': { position: [17.447783, 78.349040], type: 'bore' as NodeType },
        'Borewell P8': { position: [17.445139, 78.345277], type: 'bore' as NodeType },
        'Borewell P9': { position: [17.446922, 78.346699], type: 'bore' as NodeType },
    };

    Object.entries(assetPositions).forEach(([name, data]) => {
        const nodeId = name.toLowerCase().replace(/\s+/g, '-');
        const location = data.position as [number, number];

        let nodeData: NodeData;

        switch (data.type) {
            case 'pump':
                nodeData = generatePumpHouseData(nodeId, name, location);
                break;
            case 'sump':
                nodeData = generateSumpData(nodeId, name, location);
                break;
            case 'tank':
                nodeData = generateTankData(nodeId, name, location);
                break;
            case 'bore':
            case 'govt':
                nodeData = generateBorewellData(nodeId, name, location, data.type);
                break;
            default:
                return;
        }

        mockData[nodeId] = nodeData;
    });

    return mockData;
}

/**
 * Get latest reading from sensor data
 */
export function getLatestReading(readings: SensorReading[]): SensorReading | null {
    if (readings.length === 0) return null;
    return readings[readings.length - 1];
}

/**
 * Filter readings by time range
 */
export function filterReadingsByTimeRange(
    readings: SensorReading[],
    startDate: Date,
    endDate: Date
): SensorReading[] {
    return readings.filter(
        (reading) => reading.timestamp >= startDate && reading.timestamp <= endDate
    );
}
