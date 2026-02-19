import { create } from 'zustand';
import type { RadioStation } from '../lib/types';

interface AudioState {
    isPlaying: boolean;
    type: 'quran' | 'radio';

    // Quran State
    currentAyah: number | null;
    currentSurah: number | null;
    reciter: { name: string; id: string; image?: string } | null;
    moshaf: { name: string; server: string } | null;
    playlist: { surah: number; ayah: number }[]; // For continuous play

    // Radio State
    radioStation: RadioStation | null;

    progress: number;
    duration: number;

    play: (surah: number, ayah: number, reciter?: AudioState['reciter'], moshaf?: AudioState['moshaf']) => void;
    playRadio: (station: RadioStation) => void;
    pause: () => void;
    resume: () => void;
    stop: () => void;
    next: () => void;
    prev: () => void;
    setReciter: (reciter: AudioState['reciter']) => void;
    setMoshaf: (moshaf: AudioState['moshaf']) => void;
    setProgress: (progress: number) => void;
    setDuration: (duration: number) => void;
    addToPlaylist: (track: { surah: number; ayah: number }) => void;
    clearPlaylist: () => void;
}

export const useAudioStore = create<AudioState>()((set, get) => ({
    isPlaying: false,
    type: 'quran',
    currentAyah: null,
    currentSurah: null,
    reciter: null,
    moshaf: null,
    playlist: [],
    radioStation: null,
    progress: 0,
    duration: 0,

    play: (surah, ayah, reciter, moshaf) => {
        set((state) => ({
            isPlaying: true,
            type: 'quran',
            currentSurah: surah,
            currentAyah: ayah,
            progress: 0,
            reciter: reciter || state.reciter,
            moshaf: moshaf || state.moshaf,
            radioStation: null, // Clear radio
        }));
    },

    playRadio: (station) => {
        set({
            isPlaying: true,
            type: 'radio',
            radioStation: station,
            currentSurah: null,
            currentAyah: null,
            progress: 0,
            duration: 0,
        });
    },

    pause: () => set({ isPlaying: false }),
    resume: () => set({ isPlaying: true }),

    stop: () =>
        set({ isPlaying: false, currentAyah: null, currentSurah: null, radioStation: null, progress: 0, duration: 0 }),

    next: () => {
        // Implement next logic based on playlist or auto-advance
        // For now, basic placeholder
        const { currentSurah } = get();
        if (currentSurah && currentSurah < 114) {
            set({ currentSurah: currentSurah + 1, progress: 0 });
        }
    },

    prev: () => {
        const { currentSurah } = get();
        if (currentSurah && currentSurah > 1) {
            set({ currentSurah: currentSurah - 1, progress: 0 });
        }
    },

    setReciter: (reciter) => set({ reciter }),
    setMoshaf: (moshaf) => set({ moshaf }),
    setProgress: (progress) => set({ progress }),
    setDuration: (duration) => set({ duration }),
    addToPlaylist: (track) => set((state) => ({ playlist: [...state.playlist, track] })),
    clearPlaylist: () => set({ playlist: [] }),
}));
