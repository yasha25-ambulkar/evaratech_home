// Color Constants
export const COLORS = {
    primary: '#0077b6',
    secondary: '#00b4d8',
    accent: '#0096c7',
    background: '#f4f7f6',
    text: '#333',
    white: '#ffffff',

    // Asset Type Colors
    pump: '#6f42c1',
    tank: '#0077b6',
    bore: '#d62828',
    govt: '#212529',
    sensor: '#e63946',
    sump: '#2a9d8f',

    // Status Colors
    normal: '#d4edda',
    normalText: '#155724',
    critical: '#f8d7da',
    criticalText: '#721c24',
    warning: '#fff3cd',
    warningText: '#856404',
};

// Map Configuration
export const MAP_CONFIG = {
    center: [17.445, 78.348] as [number, number],
    defaultZoom: 16,
    minZoom: 15,
    maxZoom: 20,
    tileLayer: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '© OpenStreetMap',
};

// Asset Icons (FontAwesome classes)
export const ASSET_ICONS = {
    pump: 'fa-square',
    tank: 'fa-tint',
    bore: 'fa-arrow-down',
    govt: 'fa-arrow-down',
    sensor: 'fa-wifi',
    sump: 'fa-square',
};

// Pipeline Colors
export const PIPELINE_COLORS = {
    main: '#00b4d8',
    distribution: '#0096c7',
    bore: '#d62828',
};
