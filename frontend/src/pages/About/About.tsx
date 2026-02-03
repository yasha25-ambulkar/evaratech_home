import styles from './About.module.css';

function About() {
    return (
        <div className={styles.container}>
            <div className={styles.hero}>
                <h1 className={styles.title}>About EvaraTech</h1>
                <p className={styles.subtitle}>
                    Smart Water Monitoring & Management Solutions
                </p>
            </div>

            <div className={styles.content}>
                {/* Mission Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Our Mission</h2>
                    <p className={styles.text}>
                        EvaraTech is dedicated to revolutionizing water management through cutting-edge IoT technology.
                        We provide real-time monitoring, intelligent analytics, and predictive insights to ensure
                        sustainable water usage and infrastructure management.
                    </p>
                </section>

                {/* Features Grid */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>What We Offer</h2>
                    <div className={styles.grid}>
                        <div className={styles.card}>
                            <div className={styles.icon}>
                                <i className="fas fa-tint"></i>
                            </div>
                            <h3>Real-Time Monitoring</h3>
                            <p>Track water levels, flow rates, and consumption patterns in real-time across all infrastructure.</p>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.icon}>
                                <i className="fas fa-chart-line"></i>
                            </div>
                            <h3>Advanced Analytics</h3>
                            <p>Gain insights from historical data with powerful analytics and predictive modeling.</p>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.icon}>
                                <i className="fas fa-bell"></i>
                            </div>
                            <h3>Smart Alerts</h3>
                            <p>Receive instant notifications for anomalies, leaks, and maintenance requirements.</p>
                        </div>

                        <div className={styles.card}>
                            <div className={styles.icon}>
                                <i className="fas fa-mobile-alt"></i>
                            </div>
                            <h3>Mobile Access</h3>
                            <p>Monitor and manage your water infrastructure from anywhere, on any device.</p>
                        </div>
                    </div>
                </section>

                {/* Technology Stack */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Technology Stack</h2>
                    <div className={styles.techGrid}>
                        <div className={styles.techItem}>
                            <i className="fab fa-react"></i>
                            <span>React</span>
                        </div>
                        <div className={styles.techItem}>
                            <i className="fas fa-database"></i>
                            <span>Supabase</span>
                        </div>
                        <div className={styles.techItem}>
                            <i className="fas fa-map-marked-alt"></i>
                            <span>Leaflet Maps</span>
                        </div>
                        <div className={styles.techItem}>
                            <i className="fas fa-microchip"></i>
                            <span>IoT Sensors</span>
                        </div>
                        <div className={styles.techItem}>
                            <i className="fas fa-cloud"></i>
                            <span>Cloud Computing</span>
                        </div>
                        <div className={styles.techItem}>
                            <i className="fas fa-robot"></i>
                            <span>AI/ML</span>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Get in Touch</h2>
                    <div className={styles.contactGrid}>
                        <div className={styles.contactCard}>
                            <i className="fas fa-map-marker-alt"></i>
                            <h4>Location</h4>
                            <p>IIIT Hyderabad<br />Gachibowli, Telangana 500032</p>
                        </div>
                        <div className={styles.contactCard}>
                            <i className="fas fa-envelope"></i>
                            <h4>Email</h4>
                            <p>info@evaratech.com<br />support@evaratech.com</p>
                        </div>
                        <div className={styles.contactCard}>
                            <i className="fas fa-phone"></i>
                            <h4>Phone</h4>
                            <p>+91 1234567890<br />+91 0987654321</p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
}

export default About;
