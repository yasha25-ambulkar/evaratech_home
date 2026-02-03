import { Link, useLocation } from 'react-router-dom';
import styles from './Breadcrumb.module.css';

interface BreadcrumbItem {
    label: string;
    path: string;
}

const routeMap: Record<string, string> = {
    '/': 'Home',
    '/dashboard': 'Dashboard',
    '/map': 'Map',
    '/about': 'About Us',
    '/status': 'System Status',
    '/nodes': 'All Nodes',
    '/details': 'Details',
    '/notifications': 'Notifications',
    '/settings': 'Settings',
    '/reports': 'Reports',
};

function Breadcrumb() {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    const breadcrumbs: BreadcrumbItem[] = [
        { label: 'Home', path: '/' },
    ];

    let currentPath = '';
    pathnames.forEach((segment) => {
        currentPath += `/${segment}`;
        const label = routeMap[currentPath] || segment.charAt(0).toUpperCase() + segment.slice(1);
        breadcrumbs.push({ label, path: currentPath });
    });

    // Don't show breadcrumb on home page, dashboard, all nodes, status, or reports page
    if (['/', '/dashboard', '/nodes', '/status', '/reports'].includes(location.pathname)) {
        return null;
    }

    return (
        <nav className={styles.breadcrumb}>
            <div className={styles.container}>
                {breadcrumbs.map((crumb, index) => (
                    <span key={crumb.path} className={styles.item}>
                        {index > 0 && <span className={styles.separator}>/</span>}
                        {index === breadcrumbs.length - 1 ? (
                            <span className={styles.current}>{crumb.label}</span>
                        ) : (
                            <Link to={crumb.path} className={styles.link}>
                                {crumb.label}
                            </Link>
                        )}
                    </span>
                ))}
            </div>
        </nav>
    );
}

export default Breadcrumb;
