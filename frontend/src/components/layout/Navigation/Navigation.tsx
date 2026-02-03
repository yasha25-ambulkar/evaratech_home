import { Link } from 'react-router-dom';
import styles from './Navigation.module.css';

interface NavigationProps {
    transparent?: boolean;
}

function Navigation({ transparent = false }: NavigationProps) {
    return (
        <nav className={`${styles.nav} ${transparent ? styles.transparent : ''}`}>
            <div className={styles.logo}>EvaraTech</div>
            <div className={styles.navLinks}>
                <Link to="/">Home</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/map">Map</Link>
                <Link to="/pipelines">Pipelines</Link>
            </div>
        </nav>
    );
}

export default Navigation;
