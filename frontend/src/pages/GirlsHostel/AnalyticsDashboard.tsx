import React from 'react';

const TS_CONFIG = {
    CHANNEL_ID: "3212670",
    READ_API_KEY: "UXORK5OUGJ2VK5PX"
};

interface Metrics {
    tankLevel: number;
    waterVolume: number;
    temperature: number;
    nextFillTime: string;
}

interface AnalyticsDashboardProps {
    metrics: Metrics;
}

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ metrics }) => {
    const data = metrics || { tankLevel: 0, temperature: 0, waterVolume: 0 };

    const getChartUrl = (chartId: number, title: string, color: string, type: string, yAxis: string) => {
        return `https://thingspeak.com/channels/${TS_CONFIG.CHANNEL_ID}/charts/${chartId}?bgcolor=%23ffffff&color=${color}&dynamic=true&results=60&title=${encodeURIComponent(title)}&type=${type}&yaxis=${encodeURIComponent(yAxis)}&api_key=${TS_CONFIG.READ_API_KEY}`;
    };

    return (
        <div className="analytics-page">
            <div className="analytics-container" style={{ maxWidth: '100%', padding: '0 20px' }}>

                <h2 className="analytics-heading">Live Telemetry & Analytics</h2>

                {/* --- 1. SUMMARY CARDS --- */}
                <div className="summary-cards">

                    {/* 🟢 CARD 1: TEMPERATURE (Field 1) */}
                    <div className="summary-card">
                        <div className="sc-icon" style={{ color: '#FF9800' }}>🌡️</div>
                        <div className="sc-info">
                            <h4>Temperature</h4>
                            <p>{data.temperature}°C</p>
                        </div>
                    </div>

                    {/* 🟢 CARD 2: CURRENT LEVEL (Field 2) */}
                    <div className="summary-card">
                        <div className="sc-icon" style={{ color: '#2196F3' }}>💧</div>
                        <div className="sc-info">
                            <h4>Current Water Level</h4>
                            <p>{Math.round(data.tankLevel)}%</p>
                        </div>
                    </div>

                    {/* CARD 3: VOLUME */}
                    <div className="summary-card">
                        <div className="sc-icon" style={{ color: '#4CAF50' }}>📦</div>
                        <div className="sc-info">
                            <h4>Volume</h4>
                            <p>{data.waterVolume} KL</p>
                        </div>
                    </div>
                </div>

                {/* --- 2. GRAPHS ROW --- */}
                <div style={{ width: '100%' }}>
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        gap: '20px',
                        justifyContent: 'space-between'
                    }}>

                        {/* 🟢 GRAPH 1 (LEFT): TEMPERATURE (Chart 1) */}
                        <div className="card" style={{ flex: 1, minWidth: 0 }}>
                            <div className="card-header">
                                <h3>Temperature Monitor</h3>
                            </div>
                            <div className="chart-area-large">
                                <iframe
                                    width="100%"
                                    height="300"
                                    style={{ border: "1px solid #e0e0e0", borderRadius: "4px" }}
                                    src={getChartUrl(1, "Temperature", "%23FF9800", "line", "Celsius")}
                                    title="Temperature Chart"
                                ></iframe>
                            </div>
                        </div>

                        {/* 🟢 GRAPH 2 (RIGHT): WATER LEVEL (Chart 2) */}
                        <div className="card" style={{ flex: 1, minWidth: 0 }}>
                            <div className="card-header">
                                <h3>Water Level History</h3>
                                <span className="badge">Real-Time</span>
                            </div>
                            <div className="chart-area-large">
                                <iframe
                                    width="100%"
                                    height="300"
                                    style={{ border: "1px solid #e0e0e0", borderRadius: "4px" }}
                                    src={getChartUrl(2, "Water Level", "%232196F3", "spline", "Percentage")}
                                    title="Water Level Chart"
                                ></iframe>
                            </div>
                        </div>

                        {/* CARD 3: LOG */}
                        <div className="card" style={{ flex: 1, minWidth: 0 }}>
                            <div className="card-header">
                                <h3>Pump Activity Log</h3>
                            </div>
                            <div className="timeline-list">
                                <div className="timeline-item">
                                    <span className="time">SYSTEM</span>
                                    <span className="event">Connected to Cloud</span>
                                </div>
                                <div className="timeline-item">
                                    <span className="time">DATA</span>
                                    <span className="event">Live Sync Active</span>
                                </div>
                                <div className="timeline-item warning">
                                    <span className="time">ALERT</span>
                                    <span className="event">Monitoring Active</span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsDashboard;
