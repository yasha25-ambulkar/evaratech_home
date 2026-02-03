import { Link } from 'react-router-dom';
import Navigation from '@components/layout/Navigation/Navigation';
import Footer from '@components/layout/Footer/Footer';
import styles from './Home.module.css';

function Home() {
    return (
        <div className={styles.homeContainer}>
            <Navigation />

            <section className={styles.hero}>
                <h1>Smart Water Monitoring</h1>
                <p>
                    Real-time analysis of TDS, pH, and water flow across your entire pipeline network.
                    Visualize your data instantly.
                </p>
                <Link to="/map" className={styles.ctaButton}>
                    View Live Map Dashboard
                </Link>
            </section>

            <section className={styles.features}>
                <div className={styles.featureCard}>
                    <h3>Real-Time Tracking</h3>
                    <p>Live updates from sensor nodes deployed in the field.</p>
                </div>
                <div className={styles.featureCard}>
                    <h3>Quality Analysis</h3>
                    <p>Instant alerts for TDS and pH level fluctuations.</p>
                </div>
                <div className={styles.featureCard}>
                    <h3>Geospatial Data</h3>
                    <p>Pinpoint exact locations of maintenance needs.</p>
                </div>
            </section>

            <Footer />
        </div>
    );
}

export default Home;
