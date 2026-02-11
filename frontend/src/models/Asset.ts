import { healthMonitor, AssetHealth } from '../services/HealthMonitor';
import type { Asset as IAsset, AssetType, AssetStatus } from '../types';
import { COLORS } from '../data/constants';

/**
 * Base abstract class representing an Asset in the industrial monitoring system.
 * Implements the Four Pillars of OOP:
 * - Abstraction: Shared properties and abstract methods for rendering.
 * - Encapsulation: Status-to-color mapping and metadata logic.
 * - Inheritance: Subclasses like PumpAsset, TankAsset.
 */
export abstract class BaseAsset implements IAsset {
    readonly id: string;
    readonly name: string;
    readonly type: AssetType;
    readonly position: [number, number];
    readonly status: AssetStatus;
    readonly capacity: string;
    readonly specs: string;
    readonly isCritical: boolean;

    constructor(data: IAsset) {
        this.id = data.id;
        this.name = data.name;
        this.type = data.type;
        this.position = data.position;
        this.status = data.status || 'Normal';
        this.capacity = data.capacity || 'N/A';
        this.specs = data.specs || 'N/A';
        this.isCritical = this.status === 'Critical' || this.status === 'Warning';

        // Register with Health Monitor
        healthMonitor.recordUpdate({ id: this.id, status: this.status });
    }

    /**
     * Get the analyzed health status from the HealthMonitor service.
     */
    getHealth(): AssetHealth {
        return healthMonitor.getHealth(this.id);
    }

    /**
     * Encapsulation: Logic to determine the display color based on status and type.
     */
    getDisplayColor(): string {
        if (this.status === 'Not Working') return '#9e9e9e';

        // Use Health Indicator for color priority (Flapping assets get red)
        const health = this.getHealth();
        if (health === AssetHealth.Flapping) return '#f44336'; // Bright Red for flapping

        if (this.status === 'Critical' || this.status === 'Warning') return '#d32f2f';

        const colorMap: Record<AssetType, string> = {
            pump: COLORS.pump,
            sump: COLORS.sump,
            tank: COLORS.tank,
            bore: COLORS.bore,
            govt: COLORS.govt,
            sensor: COLORS.sensor,
        };
        return colorMap[this.type] || '#0088cc';
    }

    /**
     * Polymorphism: Each subclass defines its own initial/letter for the map marker.
     */
    abstract getIndicatorLetter(): string;

    /**
     * Formats metadata for displays.
     */
    getFormattedLocation(): string {
        return this.specs || 'IIIT Campus';
    }
}

export class PumpAsset extends BaseAsset {
    getIndicatorLetter(): string { return 'P'; }
}

export class SumpAsset extends BaseAsset {
    getIndicatorLetter(): string { return 'S'; }
}

export class TankAsset extends BaseAsset {
    getIndicatorLetter(): string { return 'T'; }
}

export class BoreAsset extends BaseAsset {
    getIndicatorLetter(): string { return 'B'; }
}

export class GovtBoreAsset extends BaseAsset {
    getIndicatorLetter(): string { return 'B'; }
}

export class SensorAsset extends BaseAsset {
    getIndicatorLetter(): string { return 'S'; }
}

/**
 * Strategy/Factory Pattern: Static method to create the appropriate asset instance.
 */
export class AssetFactory {
    static create(data: IAsset): BaseAsset {
        switch (data.type) {
            case 'pump': return new PumpAsset(data);
            case 'sump': return new SumpAsset(data);
            case 'tank': return new TankAsset(data);
            case 'bore': return new BoreAsset(data);
            case 'govt': return new GovtBoreAsset(data);
            case 'sensor': return new SensorAsset(data);
            default: return new PumpAsset(data);
        }
    }
}
