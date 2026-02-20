import { create } from 'zustand';
import type { Reciter } from '../lib/types';

interface RecitersState {
    reciters: Reciter[];
    loadedLanguage: string | null;
    selectedReciter: Reciter | null;
    riwayahFilter: string;
    searchQuery: string;
    isLoading: boolean;
    error: string | null;
    setReciters: (reciters: Reciter[]) => void;
    setLoadedLanguage: (lang: string) => void;
    setSelectedReciter: (reciter: Reciter) => void;
    setRiwayahFilter: (filter: string) => void;
    setSearchQuery: (query: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    filteredReciters: () => Reciter[];
}

export const useRecitersStore = create<RecitersState>()((set, get) => ({
    reciters: [],
    loadedLanguage: null,
    selectedReciter: null,
    riwayahFilter: '',
    searchQuery: '',
    isLoading: false,
    error: null,

    setReciters: (reciters) => set({ reciters, isLoading: false, error: null }),
    setLoadedLanguage: (lang) => set({ loadedLanguage: lang }),
    setSelectedReciter: (reciter) => set({ selectedReciter: reciter }),
    setRiwayahFilter: (filter) => set({ riwayahFilter: filter }),
    setSearchQuery: (query) => set({ searchQuery: query }),
    setLoading: (loading) => set({ isLoading: loading }),
    setError: (error) => set({ error, isLoading: false }),

    filteredReciters: () => {
        const { reciters, riwayahFilter, searchQuery } = get();
        let filtered = reciters;

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter((r) => r.name.toLowerCase().includes(q));
        }

        if (riwayahFilter) {
            filtered = filtered.filter((r) =>
                r.moshaf.some((m) => m.name.includes(riwayahFilter))
            );
        }

        return filtered;
    },
}));
