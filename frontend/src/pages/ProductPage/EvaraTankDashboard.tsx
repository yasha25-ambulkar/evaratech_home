import React from 'react';
import { NodeEntity } from '../../models/NodeEntity';

interface EvaraTankDashboardProps {
    nodes?: NodeEntity[];
}

const EvaraTankDashboard: React.FC<EvaraTankDashboardProps> = () => {
    return (
        <div style={{ width: '100%', height: 'calc(100vh - 72px)', overflow: 'hidden', border: 'none' }}>
            {/* 
                Embedding the legacy evaratank.html file. 
                Ideally this should be ported to React components in the future.
            */}
            <iframe
                src="/evaratank.html"
                style={{ width: '100%', height: '100%', border: 'none' }}
                title="EvaraTank Dashboard"
            />
        </div>
    );
};

export default EvaraTankDashboard;
