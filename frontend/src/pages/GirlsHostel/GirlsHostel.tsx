import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './GirlsHostel.css';
import AnalyticsDashboard from './AnalyticsDashboard';
import evaraLogo from '../../assets/girlshostel/logo1.png';
import iiitLogo from '../../assets/girlshostel/logo2.png';
import motorImg from '../../assets/girlshostel/motor.jpg';

interface Metrics {
    tankLevel: number;
    waterVolume: number;
    temperature: number;
    nextFillTime: string;
}

function GirlsHostel() {
    const navigate = useNavigate();
    const [isOn, setIsOn] = useState(false);
    const [drainageOn, setDrainageOn] = useState(false);
    const [currentView, setCurrentView] = useState('home');
    const [metrics, setMetrics] = useState<Metrics>({
        tankLevel: 0,
        waterVolume: 0,
        temperature: 0.0,
        nextFillTime: "--:--"
    });

    // --- CONNECT TO BACKEND ---
    useEffect(() => {
        const fetchStatus = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/status');
                const data = await response.json();
                setIsOn(data.motorOn);
                setDrainageOn(data.drainageOn);
                setMetrics({
                    tankLevel: data.tankLevel,
                    waterVolume: data.waterVolume,
                    temperature: data.temperature,
                    nextFillTime: "AUTO"
                });
            } catch (error) { }
        };

        const interval = setInterval(fetchStatus, 200);
        return () => clearInterval(interval);
    }, []);

    const toggleSwitch = async () => {
        try { await fetch('http://localhost:5000/api/motor/toggle', { method: 'POST' }); }
        catch (error) { alert("Backend not connected"); }
    };

    const toggleDrainage = async () => {
        try { await fetch('http://localhost:5000/api/drainage/toggle', { method: 'POST' }); }
        catch (error) { alert("Backend not connected"); }
    };

    const TOP_FEED_PATH = "M 480,150 L 480,110 Q 480,90 460,90 L 320,90 Q 300,90 300,110 L 300,160";
    const DELIVERY_PATH = "M 560,390 L 500,390 Q 480,390 480,370 L 480,150";
    const SUCTION_PATH = "M 900,390 L 680,390";
    const DRAINAGE_PATH = "M 270,414 L 270,444 L 170,444";

    return (
        <div className="app-container">
            <header className="app-header">
                <div className="header-content">
                    <div className="logo-row">
                        <img src={evaraLogo} alt="EvaraTech" className="evara-logo" />
                        <img src={iiitLogo} alt="IIIT Hyderabad" className="iiit-logo" />
                    </div>
                    {currentView === 'home' ? (
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button className="back-btn" onClick={() => navigate('/')}>Home</button>
                            <button className="analytics-btn" onClick={() => setCurrentView('analytics')}>Analytics</button>
                        </div>
                    ) : (
                        <button className="back-btn" onClick={() => setCurrentView('home')}>&larr; Back to Dashboard</button>
                    )}
                </div>
            </header>

            {currentView === 'home' && (
                <div className="app-main">
                    <h2 className="main-title">GIRLS HOSTEL BLOCK C</h2>
                    <div className={`diagram-wrapper ${isOn ? 'flow-active' : ''}`}>
                        <div className="dashboard-info-panel">
                            <div className="info-row">
                                <span className="info-label">Water Level:</span>
                                <span className="info-value highlight">{Math.round(metrics.tankLevel)}%</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Volume:</span>
                                <span className="info-value">{metrics.waterVolume} KL</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Temperature:</span>
                                <span className="info-value">{metrics.temperature}°C</span>
                            </div>
                            <div className="info-row">
                                <span className="info-label">Est. Next Fill:</span>
                                <span className="info-value">{metrics.nextFillTime}</span>
                            </div>
                        </div>

                        <svg className="pipeline-svg-layer" viewBox="0 0 1200 550" preserveAspectRatio="none">
                            <defs>
                                <linearGradient id="glassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
                                    <stop offset="50%" stopColor="rgba(255,255,255,0.1)" />
                                    <stop offset="100%" stopColor="rgba(255,255,255,0.6)" />
                                </linearGradient>
                            </defs>
                            <g className="layer-water-flow">
                                <motion.path
                                    d={SUCTION_PATH}
                                    className="pipe-water-inner"
                                    animate={{
                                        opacity: isOn ? 1 : 0
                                    }}
                                    style={{ pathLength: 1, strokeDashoffset: 0 }}
                                />
                                {/* Overlay for animation */}
                                {isOn && <motion.path
                                    d={SUCTION_PATH}
                                    className="pipe-water-inner"
                                    initial={{ strokeDashoffset: 0 }}
                                    animate={{ strokeDashoffset: -30 }} // Forward flow
                                    transition={{ duration: 0.8, ease: "linear", repeat: Infinity }}
                                />}

                                {/* DELIVERY PATH */}
                                <motion.path
                                    d={DELIVERY_PATH}
                                    className="pipe-water-inner"
                                    animate={{ opacity: isOn ? 1 : 0 }}
                                />
                                {isOn && <motion.path
                                    d={DELIVERY_PATH}
                                    className="pipe-water-inner"
                                    initial={{ strokeDashoffset: 0 }}
                                    animate={{ strokeDashoffset: -30 }}
                                    transition={{ duration: 0.8, ease: "linear", repeat: Infinity }}
                                />}

                                {/* TOP FEED PATH */}
                                <motion.path
                                    d={TOP_FEED_PATH}
                                    className="pipe-water-inner"
                                    animate={{ opacity: isOn ? 1 : 0 }}
                                />
                                {isOn && <motion.path
                                    d={TOP_FEED_PATH}
                                    className="pipe-water-inner"
                                    initial={{ strokeDashoffset: 0 }}
                                    animate={{ strokeDashoffset: -30 }}
                                    transition={{ duration: 0.8, ease: "linear", repeat: Infinity }}
                                />}

                                {/* DRAINAGE PATH */}
                                <motion.path
                                    d={DRAINAGE_PATH}
                                    className="pipe-water-inner"
                                    animate={{ opacity: drainageOn ? 1 : 0 }}
                                />
                                {drainageOn && <motion.path
                                    d={DRAINAGE_PATH}
                                    className="pipe-water-inner"
                                    initial={{ strokeDashoffset: 0 }}
                                    animate={{ strokeDashoffset: -30 }}
                                    transition={{ duration: 0.8, ease: "linear", repeat: Infinity }}
                                />}
                            </g>
                            <g className="layer-glass-body">
                                <path d={SUCTION_PATH} className="pipe-glass-tube" />
                                <path d={DELIVERY_PATH} className="pipe-glass-tube" />
                                <path d={TOP_FEED_PATH} className="pipe-glass-tube" />
                                <path d={DRAINAGE_PATH} className="pipe-glass-tube" />
                            </g>
                            <g className="layer-pipe-borders">
                                <path d={SUCTION_PATH} className="pipe-border-lines" />
                                <path d={DELIVERY_PATH} className="pipe-border-lines" />
                                <path d={TOP_FEED_PATH} className="pipe-border-lines" />
                                <path d={DRAINAGE_PATH} className="pipe-border-lines" />
                            </g>
                            <g className="layer-couplers" fill="#546e7a" stroke="#37474f" strokeWidth="1">
                                <rect x="680" y="382" width="12" height="16" rx="2" />
                                <rect x="560" y="382" width="12" height="16" rx="2" />
                                <rect x="472" y="388" width="16" height="12" rx="2" />
                                <rect x="890" y="382" width="12" height="16" rx="2" />
                                <rect x="472" y="142" width="16" height="12" rx="2" />
                                <rect x="292" y="122" width="16" height="12" rx="2" transform="rotate(90 300 128)" />
                                <rect x="262" y="406" width="16" height="12" rx="2" transform="rotate(90 270 412)" />
                            </g>
                            <g transform="translate(480, 280)">
                                <circle cx="0" cy="0" r="12" fill="#78909c" stroke="#37474f" strokeWidth="2" />
                                <rect x="-6" y="-18" width="12" height="10" fill="#78909c" stroke="#37474f" />
                                <motion.g
                                    className="valve-lever"
                                    animate={{ rotate: isOn ? 90 : 0 }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                >
                                    <rect x="-35" y="-4" width="70" height="8" rx="4" fill="#ef5350" stroke="#b71c1c" />
                                </motion.g>
                            </g>
                            <g transform="translate(270, 434)">
                                <circle cx="0" cy="0" r="12" fill="#78909c" stroke="#37474f" strokeWidth="2" />
                                <rect x="-6" y="-18" width="12" height="10" fill="#78909c" stroke="#37474f" />
                                <motion.g
                                    className="valve-lever"
                                    animate={{ rotate: drainageOn ? 90 : 0 }}
                                    transition={{ duration: 0.8, ease: "easeInOut" }}
                                >
                                    <rect x="-35" y="-4" width="70" height="8" rx="4" fill="#ff9800" stroke="#e65100" />
                                </motion.g>
                            </g>
                        </svg>

                        <div className="assembly-building repositioned-tank">
                            <div className="tank-wrapper">
                                <div className="level-indicator-box">
                                    <span className="level-label">LEVEL</span>
                                    <span className="level-value">{metrics.tankLevel < 99 ? 'RISING' : 'DRAINING'}</span>
                                    <div className="level-bar-bg">
                                        <div className="level-bar-fill" style={{ height: `${metrics.tankLevel}%` }}></div>
                                    </div>
                                </div>
                                <div className="css-tank-glass enlarged-tank">
                                    <div className="glass-tank-water" style={{ height: `${metrics.tankLevel}%` }}></div>
                                    <div className="measure-lines">
                                        <div className="m-line"></div><div className="m-line"></div>
                                        <div className="m-line"></div><div className="m-line"></div>
                                        <div className="m-line"></div><div className="m-line"></div>
                                    </div>
                                    <div className="glass-shine"></div>
                                </div>
                            </div>
                        </div>

                        <div className="motor-group-container">
                            <div className="control-Header">
                                <div className="led-indicators">
                                    <div className={`led-light green-led ${isOn ? 'glow-green' : ''}`}></div>
                                    <div className={`led-light red-led ${!isOn ? 'glow-red' : ''}`}></div>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" checked={isOn} onChange={toggleSwitch} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            <div className="assembly-motor">
                                <img src={motorImg} alt="Motor" className="img-motor" />
                                <div className="label-motor">MOTOR</div>
                            </div>
                        </div>

                        <div className="assembly-pump-house">
                            <div className="css-pump-house">
                                <div className="ph-roof"></div>
                                <div className="ph-body">
                                    <div className="ph-water-window">
                                        <div className="ph-water-level" style={{ height: `${metrics.tankLevel}%` }}></div>
                                        <span className="ph-level-text">{Math.round(metrics.tankLevel)}%</span>
                                    </div>
                                    <div className="ph-door"></div>
                                </div>
                                <div className="ph-base"></div>
                            </div>
                            <div className="label-tank">PUMP HOUSE 2</div>
                        </div>

                        <div className="drainage-control external-drainage">
                            <div className="drainage-header">
                                <div className="led-indicators">
                                    <div className={`led-light green-led ${drainageOn ? 'glow-green' : ''}`}></div>
                                    <div className={`led-light red-led ${!drainageOn ? 'glow-red' : ''}`}></div>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" checked={drainageOn} onChange={toggleDrainage} />
                                    <span className="slider round"></span>
                                </label>
                            </div>
                            <div className="label-drainage">DRAINAGE</div>
                        </div>
                    </div>
                </div>
            )}

            {currentView === 'analytics' && (
                <AnalyticsDashboard metrics={metrics} />
            )}
        </div>
    );
}

export default GirlsHostel;
