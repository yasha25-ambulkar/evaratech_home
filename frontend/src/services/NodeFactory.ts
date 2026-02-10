import { NodeEntity, PumpNode, SumpNode, TankNode, BoreNode, GovtNode, INodeData } from '../models/NodeEntity';
import { NodeMap } from '../models/dsa/NodeMap';
import { SimulationService } from './SimulationService';
import { NodeType, NodeStatus, ProductType } from '../models/enums';

const rawData: INodeData[] = [
    { id: 'PH1', name: 'Pump House 1', type: NodeType.Pump, status: NodeStatus.Normal, location: 'Main Campus', lastUpdate: '2 mins ago', product: ProductType.EvaraFlow },
    { id: 'PH2', name: 'Pump House 2', type: NodeType.Pump, status: NodeStatus.Normal, location: 'Main Campus', lastUpdate: '2 mins ago', product: ProductType.EvaraFlow },
    { id: 'PH3', name: 'Pump House 3', type: NodeType.Pump, status: NodeStatus.Warning, location: 'Main Campus', lastUpdate: '5 mins ago', product: ProductType.EvaraFlow },
    { id: 'PH4', name: 'Pump House 4', type: NodeType.Pump, status: NodeStatus.Normal, location: 'Main Campus', lastUpdate: '1 min ago', product: ProductType.EvaraFlow },
    { id: 'S1', name: 'Sump S1', type: NodeType.Sump, status: NodeStatus.Normal, location: 'Main Campus', lastUpdate: '3 mins ago', product: ProductType.EvaraTank },
    { id: 'S2', name: 'Sump S2', type: NodeType.Sump, status: NodeStatus.Normal, location: 'Main Campus', lastUpdate: '2 mins ago', product: ProductType.EvaraTank },
    { id: 'S3', name: 'Sump S3', type: NodeType.Sump, status: NodeStatus.Normal, location: 'Main Campus', lastUpdate: '4 mins ago', product: ProductType.EvaraTank },
    { id: 'S4', name: 'Sump S4 (Main Sump)', type: NodeType.Sump, status: NodeStatus.Normal, location: 'Main Campus', lastUpdate: '1 min ago', product: ProductType.EvaraTank },
    { id: 'OHT1', name: 'Bakul OHT', type: NodeType.Tank, status: NodeStatus.Normal, location: 'Bakul Block', lastUpdate: '2 mins ago', product: ProductType.EvaraTank },
    { id: 'OHT2', name: 'Parijat OHT', type: NodeType.Tank, status: NodeStatus.Normal, location: 'Parijat Block', lastUpdate: '3 mins ago', product: ProductType.EvaraTank },
    { id: 'OHT3', name: 'Kadamba OHT', type: NodeType.Tank, status: NodeStatus.Normal, location: 'Kadamba Block', lastUpdate: '2 mins ago', product: ProductType.EvaraTank },
    { id: 'B1', name: 'Borewell P1', type: NodeType.Bore, status: NodeStatus.Normal, location: 'Campus Area', lastUpdate: '5 mins ago', product: ProductType.EvaraFlow },
    { id: 'B2', name: 'Borewell P2', type: NodeType.Bore, status: NodeStatus.Normal, location: 'Campus Area', lastUpdate: '4 mins ago', product: ProductType.EvaraFlow },
    { id: 'GB1', name: 'Govt Borewell 1', type: NodeType.Govt, status: NodeStatus.Normal, location: 'External', lastUpdate: '10 mins ago', product: ProductType.EvaraFlow },
    { id: 'SW1', name: 'Deep Well A', type: NodeType.Bore, status: NodeStatus.Normal, location: 'Control Room', lastUpdate: '1 min ago', product: ProductType.EvaraDeep },
];

// ... (rawData remains same but we will use it as base)

class NodeFactory {
    static createNode(data: INodeData): NodeEntity {
        // Create a copy to avoid mutating rawData permanently (or simulate fresh every time)
        const nodeData = { ...data };
        const now = Date.now();

        // Inject Physics-based simulation data
        switch (data.type) {
            case NodeType.Pump:
                nodeData.flowRate = Number(SimulationService.generateFlowRate(now).toFixed(1));
                nodeData.voltage = Math.floor(220 + (Math.random() * 10 - 5));
                nodeData.pressure = Number((2.5 + Math.random() * 0.5).toFixed(1));
                break;
            case NodeType.Sump:
            case NodeType.Tank:
                // Simulate level with a slow sine wave based on hour
                nodeData.level = Math.floor(SimulationService.generateSineValue(now / 3600000, 60, 30, 0.5, 2));
                // Clamp level 0-100
                if (nodeData.level > 100) nodeData.level = 100;
                if (nodeData.level < 0) nodeData.level = 0;

                // EvaraTank Specifics Mock Data
                nodeData.tankCapacityLitres = data.type === NodeType.Sump ? 50000 : 25000;
                nodeData.tankDepth = data.type === NodeType.Sump ? 5 : 3;
                nodeData.currentLevelMeters = Number(((nodeData.level / 100) * nodeData.tankDepth).toFixed(2));
                nodeData.dailyUsage = Math.floor(2000 + Math.random() * 1000); // 2000-3000L daily
                nodeData.refillCycles = Math.floor(1 + Math.random() * 2); // 1-3 cycles

                // Generate 30 days of consumption history
                nodeData.consumptionHistory = Array.from({ length: 30 }, (_, i) => {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    return {
                        date: date.toISOString().split('T')[0],
                        value: Math.floor(2000 + Math.random() * 1000 + (Math.random() > 0.9 ? 2000 : 0)) // Occasional spike
                    };
                }).reverse();
                break;
            case NodeType.Bore:
                nodeData.flowRate = Number((SimulationService.generateFlowRate(now) * 0.8).toFixed(1)); // Bores have less flow
                nodeData.voltage = Math.floor(415 + (Math.random() * 15 - 7)); // 3-phase
                break;
            case NodeType.Govt:
                nodeData.pressure = Number((1.5 + Math.random() * 0.2).toFixed(1));
                break;
        }

        switch (data.type) {
            case NodeType.Pump: return new PumpNode(nodeData);
            case NodeType.Sump: return new SumpNode(nodeData);
            case NodeType.Tank: return new TankNode(nodeData);
            case NodeType.Bore: return new BoreNode(nodeData);
            case NodeType.Govt: return new GovtNode(nodeData);
            default: return new PumpNode(nodeData);
        }
    }

    static getAllNodes(): NodeEntity[] {
        return rawData.map(data => this.createNode(data));
    }

    static getNodesByType(type: string): NodeEntity[] {
        const allNodes = this.getAllNodes();
        if (type === 'all') return allNodes;
        return allNodes.filter(node => node.type === type);
    }

    static getNodeMap(): NodeMap {
        return new NodeMap(this.getAllNodes());
    }
}

export default NodeFactory;
