// Sensor Data Types
export interface SensorReading {
    timestamp: string;
    tds: number;
    ph: number;
    temperature: number;
    flowRate: number;
}

export interface SensorData {
    sensorId: string;
    location: string;
    currentReading: SensorReading;
    history: SensorReading[];
}
