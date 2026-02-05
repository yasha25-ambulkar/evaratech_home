import React from 'react';
import { NodeEntity } from '../models/NodeEntity';
import NodeCard from '../components/ui/NodeCard/NodeCard';
// We'll import specific styles or use inline/utility if generic, 
// strictly reusing NodeCard which has its own styles.
// But we need the layout styles (grid vs list).
// For now let's assume we pass a className or style object, or import a shared CSS module for views.
// To avoid importing AllNodes.module.css (circular/messy), let's create NodeViews.module.css or similar? 
// Or just accept that these strategies are tightly coupled to the AllNodes page for now. 
// For "Architecture Upgrade", I should decouple. 
// I will create `NodeViews.module.css` for the grid/list layouts.

import styles from './NodeViews.module.css';

export interface NodeViewStrategy {
    id: 'grid' | 'list';
    label: string;
    icon: string;
    render(nodes: NodeEntity[]): React.ReactNode;
}

export class GridViewStrategy implements NodeViewStrategy {
    id: 'grid' = 'grid';
    label = 'Grid View';
    icon = 'fas fa-th';

    render(nodes: NodeEntity[]): React.ReactNode {
        return (
            <div className={styles.grid}>
                {nodes.map(node => (
                    <NodeCard
                        key={node.id}
                        id={node.id}
                        name={node.name}
                        type={node.type}
                        status={node.status}
                        location={node.location}
                        lastUpdate={node.lastUpdate}
                        typeColor={node.getTypeColor()}
                        typeIcon={node.getTypeIcon()}
                        statusColor={node.getStatusColor()}
                    />
                ))}
            </div>
        );
    }
}

import { FixedSizeList } from 'react-window';
import { AutoSizer } from 'react-virtualized-auto-sizer';

export class VirtualListViewStrategy implements NodeViewStrategy {
    id: 'list' = 'list';
    label = 'Virtual List';
    icon = 'fas fa-stream';

    render(nodes: NodeEntity[]): React.ReactNode {
        const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
            const node = nodes[index];
            return (
                <div style={{ ...style, paddingBottom: '10px' }}> {/* Add padding inside the row item for spacing */}
                    <div style={{ height: '100%' }}>
                        <NodeCard
                            id={node.id}
                            name={node.name}
                            type={node.type}
                            status={node.status}
                            location={node.location}
                            lastUpdate={node.lastUpdate}
                            typeColor={node.getTypeColor()}
                            typeIcon={node.getTypeIcon()}
                            statusColor={node.getStatusColor()}
                        />
                    </div>
                </div>
            );
        };

        return (
            <div style={{ height: '600px', width: '100%' }}>
                <AutoSizer>
                    {({ height, width }: { height: number; width: number }) => (
                        <FixedSizeList
                            height={height}
                            itemCount={nodes.length}
                            itemSize={220} // Approximate height of NodeCard
                            width={width}
                        >
                            {Row}
                        </FixedSizeList>
                    )}
                </AutoSizer>
            </div>
        );
    }
}
