import { useState, useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';

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
const ComponentShowcase = lazy(() => import('@pages/ComponentShowcase/ComponentShowcase'));
const AllComponentsShowcase = lazy(() => import('@pages/AllComponentsShowcase/AllComponentsShowcase'));
const UserManagement = lazy(() => import('@pages/UserManagement/UserManagement'));
const AuditLog = lazy(() => import('@components/admin/AuditLog/AuditLog'));
const SuperAdminPanel = lazy(() => import('@pages/Admin/SuperAdminPanel'));

import ErrorBoundary from './components/common/ErrorBoundary';
import Header from './components/layout/Header/Header';
import LoadingScreen from './components/ui/LoadingScreen/LoadingScreen';
import { ToastProvider } from './context/ToastContext';
import { notificationService } from './services/notification.service';
import { AnimatePresence, motion } from 'framer-motion';
import ProtectedRoute from './components/common/ProtectedRoute';

import { useAuthStore } from './store/authStore';

function AppContent() {
    const location = useLocation();
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        notificationService.requestPermission();
    }, []);

    return (
        <>
            {isAuthenticated && <Header />}
            <Suspense fallback={<div className="suspense-fallback" style={{ minHeight: '100vh', background: 'var(--color-background)' }} />}>
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        style={{ width: '100%', minHeight: isAuthenticated ? 'calc(100vh - 72px)' : '100vh' }}
                    >
                        <Routes location={location} key={location.pathname}>
                            <Route path="/login" element={<Login />} />

                            <Route path="/" element={isAuthenticated ? <AssetMap /> : <Navigate to="/login" replace />} />

                            <Route element={<ProtectedRoute />}>
                                <Route path="/map" element={<AssetMap />} />
                                <Route path="/home" element={<Home />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/nodes" element={<AllNodes />} />
                                <Route path="/status" element={<SystemStatus />} />
                                <Route path="/reports" element={<Reports />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/notifications" element={<AlertHistory />} />
                                <Route path="/settings" element={<Settings />} />
                                <Route path="/details" element={<StationDetails />} />
                                <Route path="/products/:productType" element={<ProductPage />} />
                                <Route path="/girls-hostel" element={<GirlsHostel />} />
                                <Route path="/users" element={<UserManagement />} />
                                <Route path="/components" element={<ComponentShowcase />} />
                                <Route path="/all-components" element={<AllComponentsShowcase />} />
                            </Route>

                            <Route element={<ProtectedRoute allowedRoles={['COMMAND', 'SUPER_ADMIN', 'ADMIN']} />}>
                                <Route path="/audit" element={<AuditLog />} />
                                <Route path="/admin" element={<SuperAdminPanel />} />
                            </Route>
                        </Routes>
                    </motion.div>
                </AnimatePresence>
            </Suspense>

        </>
    );
}



function App() {
    const [isLoading, setIsLoading] = useState(true);
    const { checkSession } = useAuthStore();

    useEffect(() => {
        let timerId: NodeJS.Timeout;

        const init = async () => {
            try {
                await checkSession();
            } finally {
                timerId = setTimeout(() => {
                    setIsLoading(false);
                }, 1000);
            }
        };

        init();

        return () => {
            if (timerId) clearTimeout(timerId);
        };
    }, [checkSession]);

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
