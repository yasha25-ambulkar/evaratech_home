
export class SimulationService {
    /**
     * Generates a value based on a sine wave pattern + random noise.
     * @param time The current timestamp or counter.
     * @param base The baseline value (e.g. 120 for TDS).
     * @param amplitude The height of the wave (e.g. 20).
     * @param frequency How fast the wave oscillates.
     * @param noiseLevel Randomness factor.
     */
    static generateSineValue(time: number, base: number, amplitude: number, frequency: number, noiseLevel: number): number {
        const wave = Math.sin(time * frequency) * amplitude;
        const noise = (Math.random() - 0.5) * 2 * noiseLevel;
        return base + wave + noise;
    }

    /**
     * Simulates realistic water flow data.
     * Flow rate often peaks during the day and drops at night.
     */
    static generateFlowRate(timestamp: number): number {
        const hour = new Date(timestamp).getHours();
        // Peak usage at 8 AM and 7 PM
        const morningPeak = Math.exp(-Math.pow(hour - 8, 2) / 8) * 10;
        const eveningPeak = Math.exp(-Math.pow(hour - 19, 2) / 8) * 15;

        const baseFlow = 5;
        const noise = Math.random() * 2;

        return baseFlow + morningPeak + eveningPeak + noise;
    }

    /**
     * Simulates TDS (Total Dissolved Solids) which is relatively stable but fluctuates slightly.
     */
    static generateTDS(timestamp: number): number {
        // Slow oscillation over long periods
        return this.generateSineValue(timestamp / 3600000, 140, 15, 0.5, 5);
    }
}
