// EvaraTech IoT Data Types
// Comprehensive type definitions for all water infrastructure nodes

// ============================================================================
// BASE TYPES
// ============================================================================

/**
 * Base sensor reading with timestamp, value, and unit
 */
export interface SensorReading {
    timestamp: Date;
    value: number;
    unit: string;
}

/**
 * Node status types
 */
export type NodeStatus = 'active' | 'inactive' | 'warning' | 'critical';

/**
 * Common node properties
 */
export interface BaseNodeData {
    nodeId: string;
    name: string;
    location: [number, number]; // [latitude, longitude]
    lastUpdated: Date;
    status: NodeStatus;
    isActive: boolean;
}

// ============================================================================
// PUMP HOUSE DATA
// ============================================================================

export interface PumpHouseData extends BaseNodeData {
    type: 'pump';

    // Real-time metrics
    flowRate: SensorReading[];        // L/min
    pressure: SensorReading[];         // bar
    powerConsumption: SensorReading[]; // kW

    // Operational data
    pumpStatus: 'Running' | 'Stopped' | 'Maintenance';
    runningHours: number;              // Total hours
    lastMaintenance: Date;

    // Static info
    capacity: number;                  // L/min (max flow rate)
    motorPower: number;                // kW
    pumpModel: string;
}

// ============================================================================
// SUMP DATA
// ============================================================================

export interface SumpData extends BaseNodeData {
    type: 'sump';

    // Water level metrics
    waterLevel: SensorReading[];       // cm or %
    currentVolume: SensorReading[];    // liters

    // Flow metrics
    inletFlow: SensorReading[];        // L/min
    outletFlow: SensorReading[];       // L/min

    // Environmental
    temperature: SensorReading[];      // °C

    // Static info
    capacity: number;                  // liters (total capacity)
    dimensions: {
        length: number;                  // meters
        width: number;                   // meters
        depth: number;                   // meters
    };
    location: [number, number];
}

// ============================================================================
// OVERHEAD TANK DATA
// ============================================================================

export interface TankData extends BaseNodeData {
    type: 'tank';

    // Water level metrics
    waterLevel: SensorReading[];       // cm or %
    currentVolume: SensorReading[];    // liters

    // Flow metrics
    fillRate: SensorReading[];         // L/min (incoming)
    consumptionRate: SensorReading[];  // L/min (outgoing)

    // Environmental
    temperature: SensorReading[];      // °C

    // Static info
    capacity: number;                  // liters (total capacity)
    height: number;                    // meters
    diameter: number;                  // meters
    tankType: 'OHT' | 'Ground' | 'Underground';
    servingArea: string;               // e.g., "Bakul Hostel"
}

// ============================================================================
// BOREWELL DATA
// ============================================================================

export interface BorewellData extends BaseNodeData {
    type: 'bore' | 'govt';

    // Water level metrics
    waterLevel: SensorReading[];       // meters (depth from surface)

    // Flow metrics
    flowRate: SensorReading[];         // L/min
    dailyOutput: SensorReading[];      // liters per day

    // Pump status
    pumpStatus: 'Working' | 'Not Working' | 'Maintenance';
    motorPower: number;                // HP

    // Static info
    depth: number;                     // meters (total depth)
    diameter: number;                  // inches
    yearDrilled: number;
    waterQuality: 'Good' | 'Moderate' | 'Poor';
}

// ============================================================================
// PIPELINE DATA
// ============================================================================

export interface PipelineData {
    pipelineId: string;
    name: string;                      // e.g., "PH1 - PH2"
    type: 'water' | 'bore';

    // Flow metrics
    flowRate: SensorReading[];         // L/min
    pressure: SensorReading[];         // bar

    // Status
    status: 'Flowing' | 'Blocked' | 'Maintenance' | 'Leak Detected';
    leakDetection: boolean;

    // Static info
    length: number;                    // meters
    diameter: number;                  // inches
    material: 'PVC' | 'GI' | 'HDPE';

    // Connections
    fromNode: string;                  // Node ID
    toNode: string;                    // Node ID
    coordinates: [number, number][];   // Path coordinates
}

// ============================================================================
// UNIFIED NODE DATA TYPE
// ============================================================================

export type NodeData = PumpHouseData | SumpData | TankData | BorewellData;

export type NodeType = 'pump' | 'sump' | 'tank' | 'bore' | 'govt';

// ============================================================================
// ALERT TYPES
// ============================================================================

export type AlertType =
    | 'inactive'           // No data > 48 hours
    | 'low-water'          // Water level < 20%
    | 'overflow-risk'      // Water level > 95%
    | 'pump-issue'         // Pump running but no flow
    | 'leak-detected'      // Pipeline leak
    | 'anomaly'            // Unusual pattern
    | 'maintenance-due';   // Maintenance overdue

export type AlertSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface Alert {
    id: string;
    nodeId: string;
    nodeName: string;
    type: AlertType;
    severity: AlertSeverity;
    message: string;
    timestamp: Date;
    acknowledged: boolean;
}

// ============================================================================
// TIME SERIES DATA HELPERS
// ============================================================================

export interface TimeRange {
    start: Date;
    end: Date;
    label: '24h' | '7d' | '30d' | 'custom';
}

export interface DataPoint {
    x: Date;
    y: number;
}

// ============================================================================
// ANALYTICS TYPES
// ============================================================================

export interface DailyAnalytics {
    nodeId: string;
    date: Date;
    totalConsumption: number;      // liters
    peakUsageTime: string;         // HH:MM
    averageFlowRate: number;       // L/min
    efficiency: number;            // percentage
    anomaliesDetected: number;
}

export interface SystemAnalytics {
    totalWaterInSystem: number;    // liters (all tanks + sumps)
    totalDailyConsumption: number; // liters
    activePumpsCount: number;
    workingBorewellsCount: number;
    systemEfficiency: number;      // percentage
    alertsCount: {
        critical: number;
        high: number;
        medium: number;
        low: number;
    };
}

// ============================================================================
// COMPARISON TYPES
// ============================================================================

export interface ComparisonData {
    nodes: NodeData[];
    metric: 'flowRate' | 'waterLevel' | 'consumption' | 'pressure';
    timeRange: TimeRange;
    statistics: {
        nodeId: string;
        average: number;
        min: number;
        max: number;
        trend: 'increasing' | 'decreasing' | 'stable';
    }[];
}

// ============================================================================
// EXPORT TYPES
// ============================================================================

export interface ExportOptions {
    format: 'png' | 'svg' | 'csv' | 'excel' | 'pdf';
    includeGraphs: boolean;
    includeData: boolean;
    timeRange: TimeRange;
    nodes: string[]; // Node IDs
}
