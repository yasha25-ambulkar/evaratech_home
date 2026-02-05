export type NodeType = 'pump' | 'sump' | 'tank' | 'bore' | 'govt';
export type NodeStatus = 'Normal' | 'Warning' | 'Critical';

export interface INodeData {
    id: string;
    name: string;
    type: NodeType;
    status: NodeStatus;
    location: string;
    lastUpdate: string;
}

export abstract class NodeEntity {
    constructor(public data: INodeData) { }

    get id() { return this.data.id; }
    get name() { return this.data.name; }
    get type() { return this.data.type; }
    get status() { return this.data.status; }
    get location() { return this.data.location; }
    get lastUpdate() { return this.data.lastUpdate; }

    abstract getTypeIcon(): string;
    abstract getTypeColor(): string;

    getStatusColor(): string {
        switch (this.data.status) {
            case 'Normal': return '#06d6a0';
            case 'Warning': return '#ffd60a';
            case 'Critical': return '#d62828';
            default: return '#6c757d';
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
