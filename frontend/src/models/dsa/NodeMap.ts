import { NodeEntity } from '../NodeEntity';

export class NodeMap {
    private map: Map<string, NodeEntity>;

    constructor(nodes?: NodeEntity[]) {
        this.map = new Map();
        if (nodes) {
            nodes.forEach(node => this.add(node));
        }
    }

    add(node: NodeEntity): void {
        this.map.set(node.id, node);
    }

    get(id: string): NodeEntity | undefined {
        return this.map.get(id);
    }

    has(id: string): boolean {
        return this.map.has(id);
    }

    getAll(): NodeEntity[] {
        return Array.from(this.map.values());
    }

    size(): number {
        return this.map.size;
    }

    clear(): void {
        this.map.clear();
    }
}
