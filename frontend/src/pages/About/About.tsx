import styles from './About.module.css';

function About() {
    return (
        <div className={styles.container} style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '80vh'
        }}>
            <a
                href="http://evaratech.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: 'var(--color-primary)',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                }}
            >
                evaratech.com
            </a>
        </div>
    );
}

export default About;
