import React from 'react';
import { NodeEntity } from '../models/NodeEntity';
import NodeCard from '../components/ui/NodeCard/NodeCard';
import styles from './NodeViews.module.css';

// Fix imports for Vite/CJS compatibility with robust fallbacks
import * as ReactWindow from 'react-window';
// @ts-ignore
const FixedSizeList = ReactWindow.FixedSizeList || ReactWindow.default?.FixedSizeList || ReactWindow.default || ReactWindow;

import * as AutoSizerPkg from 'react-virtualized-auto-sizer';
// @ts-ignore
const AutoSizer = AutoSizerPkg.AutoSizer || AutoSizerPkg.default?.AutoSizer || AutoSizerPkg.default || AutoSizerPkg;

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
                        productBrand={node.getProductBrand()}
                        tankCapacityLitres={node.tankCapacityLitres}
                        currentLevelMeters={node.currentLevelMeters}
                        dailyUsage={node.dailyUsage}
                    />
                ))}
            </div>
        );
    }
}

// Extract Row component to avoid re-definition on every render
const NodeRow = ({ index, style, data }: { index: number; style: React.CSSProperties; data: NodeEntity[] }) => {
    const node = data[index];
    if (!node) return null;
    return (
        <div style={{ ...style, paddingBottom: '10px' }}>
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
                    productBrand={node.getProductBrand()}
                    tankCapacityLitres={node.tankCapacityLitres}
                    currentLevelMeters={node.currentLevelMeters}
                    dailyUsage={node.dailyUsage}
                />
            </div>
        </div>
    );
};

export class VirtualListViewStrategy implements NodeViewStrategy {
    id: 'list' = 'list';
    label = 'Virtual List';
    icon = 'fas fa-stream';

    render(nodes: NodeEntity[]): React.ReactNode {
        return (
            <div style={{ height: '600px', width: '100%' }}>
                {/* @ts-ignore */}
                <AutoSizer>
                    {({ height, width }: { height: number; width: number }) => (
                        <FixedSizeList
                            height={height}
                            itemCount={nodes.length}
                            itemSize={220}
                            width={width}
                            itemData={nodes} // Pass data to Row
                        >
                            {NodeRow}
                        </FixedSizeList>
                    )}
                </AutoSizer>
            </div>
        );
    }
}
