import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { motion, AnimatePresence } from 'framer-motion';
import FuturisticBackground from './components/FuturisticBackground/FuturisticBackground';
import styles from './Login.module.css';

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
            setError('Invalid credentials. Access Denied.');
        }
    };

    return (
        <div className={styles.container}>
            <FuturisticBackground />

            <motion.div
                className={styles.card}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
                {/* Decorative scanning line */}
                <motion.div
                    className={styles.scanner}
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                />

                <div className={styles.header}>
                    <motion.div
                        className={styles.logoContainer}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5, duration: 1 }}
                    >
                        <img src="/evaratech-logo-new.png" alt="EvaraTech Logo" className={styles.logoImg} />
                    </motion.div>
                    <p className={styles.subtitle}>Unified Intelligence Terminal</p>
                </div>

                <form onSubmit={handleSubmit} className={styles.form}>
                    <motion.div
                        className={styles.inputWrapper}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.7 }}
                    >
                        <div className={styles.inputContainer}>
                            <i className="fas fa-user-shield"></i>
                            <input
                                type="text"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="ACCESS ID"
                                className={styles.input}
                                disabled={isLoading}
                            />
                        </div>
                    </motion.div>

                    <motion.div
                        className={styles.inputWrapper}
                        initial={{ x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <div className={styles.inputContainer}>
                            <i className="fas fa-key"></i>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="SECURITY CODE"
                                className={styles.input}
                                disabled={isLoading}
                            />
                        </div>
                    </motion.div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                className={styles.error}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                            >
                                <span className={styles.errorText}>
                                    <i className="fas fa-triangle-exclamation"></i>
                                    {error}
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <motion.button
                        type="submit"
                        className={styles.submitBtn}
                        whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)' }}
                        whileTap={{ scale: 0.98 }}
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className={styles.loader}></div>
                        ) : (
                            <span className={styles.btnContent}>
                                AUTHORIZE <i className="fas fa-arrow-right"></i>
                            </span>
                        )}
                    </motion.button>
                </form>

                <div className={styles.footer}>
                    <div className={styles.systemStatus}>
                        <span className={styles.statusDot}></span>
                        SYSTEM ONLINE v3.0-py
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Login;
