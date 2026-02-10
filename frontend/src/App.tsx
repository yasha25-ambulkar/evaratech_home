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
const ProductPage = lazy(() => import('@pages/ProductPage/ProductPage'));
const Login = lazy(() => import('@pages/Login/Login'));
const GirlsHostel = lazy(() => import('@pages/GirlsHostel/GirlsHostel'));
const UserManagement = lazy(() => import('@pages/UserManagement/UserManagement'));
const AuditLog = lazy(() => import('@components/admin/AuditLog/AuditLog'));

import ErrorBoundary from './components/common/ErrorBoundary';
import Header from './components/layout/Header/Header';
import LoadingScreen from './components/ui/LoadingScreen/LoadingScreen';
import { ToastProvider } from './context/ToastContext'; // Added import

import { useEffect } from 'react'; // Add import
import { notificationService } from './services/notification.service'; // Add service

import { AnimatePresence, motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

function AppContent() {
    const location = useLocation();
    // const isGirlsHostel = location.pathname === '/girls-hostel';

    useEffect(() => {
        notificationService.requestPermission();
    }, []);

    return (
        <>
            <Header />
            <Suspense fallback={<div className="suspense-fallback" style={{ height: '100vh', background: 'var(--color-background)' }} />}>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.98, filter: 'blur(4px)' }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        style={{ width: '100%', height: '100%' }}
                    >
                        <Routes location={location} key={location.pathname}>
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
                            <Route path="/products/:productType" element={<ProductPage />} />
                            <Route path="/girls-hostel" element={<GirlsHostel />} />
                            <Route path="/users" element={<UserManagement />} />
                            <Route path="/audit" element={<AuditLog />} />
                        </Routes>
                    </motion.div>
                </AnimatePresence>
            </Suspense>
        </>
    );
}



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
