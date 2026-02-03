// Pipeline Types
export interface PipelineSegment {
    id: string;
    name: string;
    type: 'Main Line' | 'Dist Line' | 'Bore Line' | 'Pipeline Segment';
    capacity: string;
    maintenance: string;
    status: string;
    color?: string;
    coordinates: [number, number][];
}

export interface PipelineFeature {
    type: 'Feature';
    properties: {
        name?: string;
        id?: string;
        type?: string;
        color?: string;
        cap?: string;
        maint?: string;
        status?: string;
    };
    geometry: {
        type: 'LineString';
        coordinates: number[][];
    };
}

export interface PipelineGeoJSON {
    type: 'FeatureCollection';
    features: PipelineFeature[];
}
