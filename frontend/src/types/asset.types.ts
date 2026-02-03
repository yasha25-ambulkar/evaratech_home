// Asset Types
export type AssetType = 'pump' | 'sump' | 'tank' | 'bore' | 'govt' | 'sensor';

export type AssetStatus =
    | 'Normal'
    | 'Running'
    | 'Working'
    | 'Not Working'
    | 'Warning'
    | 'Critical'
    | 'Flowing'
    | 'Active';

export interface Asset {
    id: string;
    name: string;
    type: AssetType;
    position: [number, number]; // [lat, lng]
    capacity: string;
    specs: string;
    status: AssetStatus;
    isCritical?: boolean;
}

export interface AssetDatabaseEntry {
    id: string;
    type: string;
    cap: string;
    maint: string;
    status: AssetStatus;
}

export interface AssetDatabase {
    [key: string]: AssetDatabaseEntry;
}

export interface AssetMarkerData {
    asset: Asset;
    icon: string;
    color: string;
}
