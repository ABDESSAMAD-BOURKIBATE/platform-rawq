import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuranState {
    currentPage: number;
    lastReadPage: number;
    lastReadSurah: string;
    bookmarks: number[];
    setCurrentPage: (page: number) => void;
    saveLastRead: (page: number, surahName: string) => void;
    toggleBookmark: (page: number) => void;
    isBookmarked: (page: number) => boolean;
}

export const useQuranStore = create<QuranState>()(
    persist(
        (set, get) => ({
            currentPage: 1,
            lastReadPage: 1,
            lastReadSurah: 'الفاتحة',
            bookmarks: [],

            setCurrentPage: (page) => set({ currentPage: page }),

            saveLastRead: (page, surahName) =>
                set({ lastReadPage: page, lastReadSurah: surahName, currentPage: page }),

            toggleBookmark: (page) => {
                const { bookmarks } = get();
                if (bookmarks.includes(page)) {
                    set({ bookmarks: bookmarks.filter((p) => p !== page) });
                } else {
                    set({ bookmarks: [...bookmarks, page] });
                }
            },

            isBookmarked: (page) => get().bookmarks.includes(page),
        }),
        { name: 'rawq-quran' }
    )
);
