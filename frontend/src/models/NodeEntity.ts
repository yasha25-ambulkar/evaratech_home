import { NodeType, NodeStatus, ProductType } from './enums';

export interface INodeData {
    id: string;
    name: string;
    type: NodeType;
    status: NodeStatus;
    location: string;
    lastUpdate: string;
    // Metrics
    pressure?: number; // bar
    flowRate?: number; // m3/h
    level?: number; // percentage
    voltage?: number; // V
    product?: ProductType;
    // EvaraTank Specifics
    tankDepth?: number; // meters
    tankCapacityLitres?: number;
    currentLevelMeters?: number;
    dailyUsage?: number; // Litres today
    refillCycles?: number;
    consumptionHistory?: { date: string; value: number }[];
}

export abstract class NodeEntity {
    constructor(public data: INodeData) { }

    get id() { return this.data.id; }
    get name() { return this.data.name; }
    get type() { return this.data.type; }
    get status() { return this.data.status; }
    get location() { return this.data.location; }
    get lastUpdate() { return this.data.lastUpdate; }

    // Metrics getters
    get pressure() { return this.data.pressure; }
    get flowRate() { return this.data.flowRate; }
    get level() { return this.data.level; }
    get voltage() { return this.data.voltage; }
    get product() { return this.data.product || ProductType.None; }

    // EvaraTank Getters
    get tankDepth() { return this.data.tankDepth; }
    get tankCapacityLitres() { return this.data.tankCapacityLitres; }
    get currentLevelMeters() { return this.data.currentLevelMeters; }
    get dailyUsage() { return this.data.dailyUsage; }
    get refillCycles() { return this.data.refillCycles; }

    abstract getTypeIcon(): string;
    abstract getTypeColor(): string;

    getStatusColor(): string {
        switch (this.data.status) {
            case NodeStatus.Normal: return '#06d6a0';
            case NodeStatus.Warning: return '#ffd60a';
            case NodeStatus.Critical: return '#d62828';
            default: return '#6c757d';
        }
    }

    getProductBrand(): string {
        switch (this.product) {
            case ProductType.EvaraTank: return 'EvaraTank';
            case ProductType.EvaraFlow: return 'EvaraFlow';
            case ProductType.EvaraDeep: return 'EvaraDeep';
            default: return '';
        }
    }
}

export class PumpNode extends NodeEntity {
    getTypeIcon(): string {
        return 'fa-water';
    }
    getTypeColor(): string {
        return '#6f42c1';
    }
}

export class SumpNode extends NodeEntity {
    getTypeIcon(): string {
        return 'fa-tint';
    }
    getTypeColor(): string {
        return '#20c997';
    }
}

export class TankNode extends NodeEntity {
    getTypeIcon(): string {
        return 'fa-database';
    }
    getTypeColor(): string {
        return '#0dcaf0';
    }
}

export class BoreNode extends NodeEntity {
    getTypeIcon(): string {
        return 'fa-circle';
    }
    getTypeColor(): string {
        return '#fd7e14';
    }
}

export class GovtNode extends NodeEntity {
    getTypeIcon(): string {
        return 'fa-circle';
    }
    getTypeColor(): string {
        return '#212529';
    }
}
