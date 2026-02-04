import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/global.css';
import './styles/glass.css';
import './styles/themes.css';
import './styles/animations.css';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

import { registerSW } from './pwa';
import './i18n';

// Initialize accessibility testing in dev mode
if (process.env.NODE_ENV !== 'production') {
    import('@axe-core/react').then((axe) => {
        axe.default(React, ReactDOM, 1000);
    });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <AuthProvider>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </AuthProvider>
    </React.StrictMode>
);

registerSW();
