import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
    adhanEnabled: boolean;
    setAdhanEnabled: (enabled: boolean) => void;
    adhanAudio: string;
    setAdhanAudio: (audio: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            adhanEnabled: true,
            setAdhanEnabled: (adhanEnabled) => set({ adhanEnabled }),
            adhanAudio: '/audio/019--1.mp3',
            setAdhanAudio: (adhanAudio) => set({ adhanAudio }),
        }),
        {
            name: 'rawq-settings-storage',
        }
    )
);
