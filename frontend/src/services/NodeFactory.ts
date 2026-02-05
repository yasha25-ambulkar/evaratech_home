import { NodeEntity, PumpNode, SumpNode, TankNode, BoreNode, GovtNode, INodeData } from '../models/NodeEntity';
import { NodeMap } from '../models/dsa/NodeMap';

const rawData: INodeData[] = [
    { id: 'PH1', name: 'Pump House 1', type: 'pump', status: 'Normal', location: 'Main Campus', lastUpdate: '2 mins ago' },
    { id: 'PH2', name: 'Pump House 2', type: 'pump', status: 'Normal', location: 'Main Campus', lastUpdate: '2 mins ago' },
    { id: 'PH3', name: 'Pump House 3', type: 'pump', status: 'Warning', location: 'Main Campus', lastUpdate: '5 mins ago' },
    { id: 'PH4', name: 'Pump House 4', type: 'pump', status: 'Normal', location: 'Main Campus', lastUpdate: '1 min ago' },
    { id: 'S1', name: 'Sump S1', type: 'sump', status: 'Normal', location: 'Main Campus', lastUpdate: '3 mins ago' },
    { id: 'S2', name: 'Sump S2', type: 'sump', status: 'Normal', location: 'Main Campus', lastUpdate: '2 mins ago' },
    { id: 'S3', name: 'Sump S3', type: 'sump', status: 'Normal', location: 'Main Campus', lastUpdate: '4 mins ago' },
    { id: 'S4', name: 'Sump S4 (Main Sump)', type: 'sump', status: 'Normal', location: 'Main Campus', lastUpdate: '1 min ago' },
    { id: 'OHT1', name: 'Bakul OHT', type: 'tank', status: 'Normal', location: 'Bakul Block', lastUpdate: '2 mins ago' },
    { id: 'OHT2', name: 'Parijat OHT', type: 'tank', status: 'Normal', location: 'Parijat Block', lastUpdate: '3 mins ago' },
    { id: 'OHT3', name: 'Kadamba OHT', type: 'tank', status: 'Normal', location: 'Kadamba Block', lastUpdate: '2 mins ago' },
    { id: 'B1', name: 'Borewell P1', type: 'bore', status: 'Normal', location: 'Campus Area', lastUpdate: '5 mins ago' },
    { id: 'B2', name: 'Borewell P2', type: 'bore', status: 'Normal', location: 'Campus Area', lastUpdate: '4 mins ago' },
    { id: 'GB1', name: 'Govt Borewell 1', type: 'govt', status: 'Normal', location: 'External', lastUpdate: '10 mins ago' },
];

class NodeFactory {
    static createNode(data: INodeData): NodeEntity {
        switch (data.type) {
            case 'pump': return new PumpNode(data);
            case 'sump': return new SumpNode(data);
            case 'tank': return new TankNode(data);
            case 'bore': return new BoreNode(data);
            case 'govt': return new GovtNode(data);
            default: return new PumpNode(data); // Fallback
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
