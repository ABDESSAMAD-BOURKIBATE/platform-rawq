import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Reciter } from '../lib/types';

interface RecitersState {
    reciters: Reciter[];
    loadedLanguage: string | null;
    selectedReciter: Reciter | null;
    riwayahFilter: string;
    searchQuery: string;
    isLoading: boolean;
    error: string | null;

    // Favorites
    favoriteReciters: number[];
    favoriteSurahs: Record<number, number[]>; // reciterId -> array of surah numbers

    setReciters: (reciters: Reciter[]) => void;
    setLoadedLanguage: (lang: string) => void;
    setSelectedReciter: (reciter: Reciter) => void;
    setRiwayahFilter: (filter: string) => void;
    setSearchQuery: (query: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
    filteredReciters: () => Reciter[];

    // Favorite actions
    toggleFavoriteReciter: (id: number) => void;
    isFavoriteReciter: (id: number) => boolean;
    toggleFavoriteSurah: (reciterId: number, surah: number) => void;
    isFavoriteSurah: (reciterId: number, surah: number) => boolean;
}

export const useRecitersStore = create<RecitersState>()(
    persist(
        (set, get) => ({
            reciters: [],
            loadedLanguage: null,
            selectedReciter: null,
            riwayahFilter: '',
            searchQuery: '',
            isLoading: false,
            error: null,
            favoriteReciters: [],
            favoriteSurahs: {},

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
                    if (riwayahFilter === 'favorites') {
                        filtered = filtered.filter(r => get().favoriteReciters.includes(r.id));
                    } else {
                        filtered = filtered.filter((r) =>
                            r.moshaf.some((m) => m.name.includes(riwayahFilter))
                        );
                    }
                }

                return filtered;
            },

            toggleFavoriteReciter: (id) => set(state => {
                const favorites = state.favoriteReciters;
                if (favorites.includes(id)) {
                    return { favoriteReciters: favorites.filter(fid => fid !== id) };
                } else {
                    return { favoriteReciters: [...favorites, id] };
                }
            }),

            isFavoriteReciter: (id) => get().favoriteReciters.includes(id),

            toggleFavoriteSurah: (reciterId, surah) => set(state => {
                const favSurahs = { ...state.favoriteSurahs };
                const reciterSurahs = favSurahs[reciterId] || [];

                if (reciterSurahs.includes(surah)) {
                    favSurahs[reciterId] = reciterSurahs.filter(s => s !== surah);
                } else {
                    favSurahs[reciterId] = [...reciterSurahs, surah];
                }

                return { favoriteSurahs: favSurahs };
            }),

            isFavoriteSurah: (reciterId, surah) => {
                return (get().favoriteSurahs[reciterId] || []).includes(surah);
            }
        }),
        {
            name: 'rawq-reciters-storage',
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                favoriteReciters: state.favoriteReciters,
                favoriteSurahs: state.favoriteSurahs
            }),
        }
    )
);
