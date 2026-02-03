import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

import styles from './Login.module.css';

// For this implementation, since we created checking capabilities for dummy users in the store, 
// we just need to wire up the form.

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { login, isAuthenticated, isLoading } = useAuthStore();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard');
        }
    }, [isAuthenticated, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email || !password) {
            setError('Please enter both email and password');
            return;
        }

        const success = await login(email, password);
        if (success) {
            navigate('/dashboard');
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <div className={styles.container}>
            {/* Background elements */}
            <div className={styles.bgOverlay}></div>
            <div className={styles.glow} style={{ top: '10%', left: '10%', animationDelay: '0s' }}></div>
            <div className={styles.glow} style={{ bottom: '20%', right: '10%', animationDelay: '2s' }}></div>

            <div className={styles.card}>
                <div className={styles.logoSection}>
                    {/* Use a placeholder text logo if image is missing, but structure for image is here */}
                    {/* We will try to use the generated logo if placed in public, for now simple img tag */}
                    <div className={styles.logoWrapper}>
                        <img src="/logo.png" alt="EvaraTech" className={styles.logo} onError={(e) => {
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.nextElementSibling?.classList.remove('hidden');
                        }} />
                        <div className={`hidden ${styles.textLogo}`}>
                            <span className={styles.logoIcon}>💧</span>
                            EvaraTech
                        </div>
                    </div>
                    <p className={styles.subtitle}>Smart Water Infrastructure</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <div className={styles.inputGroup}>
                        <label htmlFor="email">Email / User ID</label>
                        <input
                            id="email"
                            type="text"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email"
                            className={styles.input}
                            disabled={isLoading}
                        />
                    </div>

                    <div className={styles.inputGroup}>
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter your password"
                            className={styles.input}
                            disabled={isLoading}
                        />
                    </div>

                    {error && <div className={styles.errorMessage}>{error}</div>}

                    <div className={styles.actions}>
                        <a href="#" className={styles.forgotPassword}>Forgot Password?</a>
                    </div>

                    <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                        {isLoading ? (
                            <span className={styles.loader}></span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className={styles.footer}>
                    <p>Protected by EvaraTech Security Systems</p>
                </div>
            </div>
        </div>
    );
}

export default Login;
