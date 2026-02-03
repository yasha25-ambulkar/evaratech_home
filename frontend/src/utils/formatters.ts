// Format numbers with commas
export function formatNumber(num: number): string {
    return num.toLocaleString();
}

// Format date to readable string
export function formatDate(date: Date | string): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });
}

// Format TDS value with unit
export function formatTDS(value: number): string {
    return `${value} ppm`;
}

// Format pH value
export function formatPH(value: number): string {
    return value.toFixed(1);
}

// Format flow rate with unit
export function formatFlowRate(value: number): string {
    return `${value.toFixed(1)} L/min`;
}

// Format temperature with unit
export function formatTemperature(value: number): string {
    return `${value.toFixed(1)}°C`;
}
