// Validate TDS value (0-1000 ppm typical range)
export function isValidTDS(value: number): boolean {
    return value >= 0 && value <= 2000;
}

// Validate pH value (0-14 scale)
export function isValidPH(value: number): boolean {
    return value >= 0 && value <= 14;
}

// Validate flow rate (positive number)
export function isValidFlowRate(value: number): boolean {
    return value >= 0;
}

// Validate temperature (-50 to 100°C)
export function isValidTemperature(value: number): boolean {
    return value >= -50 && value <= 100;
}

// Check if TDS is in acceptable range (50-500 ppm)
export function isAcceptableTDS(value: number): boolean {
    return value >= 50 && value <= 500;
}

// Check if pH is in acceptable range (6.5-8.5)
export function isAcceptablePH(value: number): boolean {
    return value >= 6.5 && value <= 8.5;
}
