import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from '@pages/Home/Home';
import AssetMap from '@pages/AssetMap/AssetMap';
import StationDetails from '@pages/StationDetails/StationDetails';
import Dashboard from '@pages/Dashboard/Dashboard';
import About from '@pages/About/About';
import SystemStatus from '@pages/SystemStatus/SystemStatus';
import AllNodes from '@pages/AllNodes/AllNodes';
import Notifications from '@pages/Notifications/Notifications';
import Settings from '@pages/Settings/Settings';
import Reports from '@pages/Reports/Reports';
import Login from '@pages/Login/Login';
import GirlsHostel from '@pages/GirlsHostel/GirlsHostel';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import Header from './components/layout/Header/Header';

function AppContent() {
    const location = useLocation();
    const isGirlsHostel = location.pathname === '/girls-hostel';

    return (
        <>
            {!isGirlsHostel && <Header />}
            <Routes>
                <Route path="/" element={<AssetMap />} />
                <Route path="/map" element={<AssetMap />} />
                <Route path="/home" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/nodes" element={<AllNodes />} />
                <Route path="/status" element={<SystemStatus />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/about" element={<About />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/login" element={<Login />} />
                <Route path="/details" element={<StationDetails />} />
                <Route path="/girls-hostel" element={<GirlsHostel />} />
            </Routes>
        </>
    );
}

function App() {
    return (
        <ErrorBoundary>
            <Router>
                <AppContent />
            </Router>
        </ErrorBoundary>
    );
}

export default App;
