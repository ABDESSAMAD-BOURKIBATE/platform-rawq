import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ThemeMode } from '../lib/types';

interface ThemeState {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
}

const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;
    if (mode === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
        root.setAttribute('data-theme', mode);
    }
};

export const useThemeStore = create<ThemeState>()(
    persist(
        (set) => ({
            mode: 'dark',
            setMode: (mode) => {
                applyTheme(mode);
                set({ mode });
            },
        }),
        {
            name: 'rawq-theme',
            onRehydrateStorage: () => (state) => {
                if (state) applyTheme(state.mode);
            },
        }
    )
);

// Listen for system theme changes
if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
        const { mode } = useThemeStore.getState();
        if (mode === 'system') applyTheme('system');
    });
}
