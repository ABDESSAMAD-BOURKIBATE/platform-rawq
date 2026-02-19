import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './lib/i18n';
import './index.css';
import App from './App';

// Initialize theme from localStorage before render
const savedTheme = localStorage.getItem('rawq-theme');
if (savedTheme) {
    try {
        const parsed = JSON.parse(savedTheme);
        const mode = parsed?.state?.mode || 'dark';
        if (mode === 'system') {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
        } else {
            document.documentElement.setAttribute('data-theme', mode);
        }
    } catch {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
} else {
    document.documentElement.setAttribute('data-theme', 'dark');
}

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <App />
    </StrictMode>
);
