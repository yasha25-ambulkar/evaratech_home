import { useState, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Lazy loading components
const Home = lazy(() => import('@pages/Home/Home'));
const AssetMap = lazy(() => import('@pages/AssetMap/AssetMap'));
const StationDetails = lazy(() => import('@pages/StationDetails/StationDetails'));
const Dashboard = lazy(() => import('@pages/Dashboard/Dashboard'));
const About = lazy(() => import('@pages/About/About'));
const SystemStatus = lazy(() => import('@pages/SystemStatus/SystemStatus'));
const AllNodes = lazy(() => import('@pages/AllNodes/AllNodes'));
const AlertHistory = lazy(() => import('@pages/Alerts/AlertHistory'));
const Settings = lazy(() => import('@pages/Settings/Settings'));
const Reports = lazy(() => import('@pages/Reports/Reports'));
const Login = lazy(() => import('@pages/Login/Login'));
const GirlsHostel = lazy(() => import('@pages/GirlsHostel/GirlsHostel'));
const UserManagement = lazy(() => import('@pages/UserManagement/UserManagement'));
const AuditLog = lazy(() => import('@components/admin/AuditLog/AuditLog'));

import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Header from './components/layout/Header/Header';
import LoadingScreen from './components/ui/LoadingScreen/LoadingScreen';
import { ToastProvider } from './context/ToastContext'; // Added import

import { useEffect } from 'react'; // Add import
import { notificationService } from './services/notification.service'; // Add service

function AppContent() {
    // const location = useLocation();
    // const isGirlsHostel = location.pathname === '/girls-hostel';

    useEffect(() => {
        notificationService.requestPermission();
    }, []);

    return (
        <>

            <Header />
            <Suspense fallback={<div className="suspense-fallback" style={{ height: '100vh', background: 'var(--color-background)' }} />}>
                <Routes>
                    <Route path="/" element={<AssetMap />} />
                    <Route path="/map" element={<AssetMap />} />
                    <Route path="/home" element={<Home />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/nodes" element={<AllNodes />} />
                    <Route path="/status" element={<SystemStatus />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/notifications" element={<AlertHistory />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/details" element={<StationDetails />} />
                    <Route path="/girls-hostel" element={<GirlsHostel />} />
                    <Route path="/users" element={<UserManagement />} />
                    <Route path="/audit" element={<AuditLog />} />
                </Routes>
            </Suspense>
        </>
    );
}

import { AnimatePresence } from 'framer-motion';

function App() {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <ErrorBoundary>
            <AnimatePresence mode='wait'>
                {isLoading && <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />}
            </AnimatePresence>

            {!isLoading && (
                <Router>
                    <ToastProvider>
                        <AppContent />
                    </ToastProvider>
                </Router>
            )}
        </ErrorBoundary>
    );
}

export default App;
