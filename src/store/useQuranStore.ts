import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface QuranState {
    currentPage: number;
    lastReadPage: number;
    lastReadSurah: string;
    bookmarks: number[];
    lastLoginDate: string | null;
    dailyReadPages: number[];
    lastReadDate: string | null;
    fontSize: number;
    fontFamily: string;
    setCurrentPage: (page: number) => void;
    saveLastRead: (page: number, surahName: string) => void;
    toggleBookmark: (page: number) => void;
    isBookmarked: (page: number) => boolean;
    updateLastLogin: () => void;
    setFontSize: (size: number) => void;
    setFontFamily: (family: string) => void;
}

export const useQuranStore = create<QuranState>()(
    persist(
        (set, get) => ({
            currentPage: 1,
            lastReadPage: 1,
            lastReadSurah: 'الفاتحة',
            bookmarks: [],
            lastLoginDate: null,
            dailyReadPages: [],
            lastReadDate: null,
            fontSize: 28, // Default font size in px
            fontFamily: 'Amiri', // Default font family

            setCurrentPage: (page) => set({ currentPage: page }),

            saveLastRead: (page, surahName) => {
                const state = get();
                const today = new Date().toDateString();
                let newDailyReadPages = state.lastReadDate === today ? [...(state.dailyReadPages || [])] : [];
                if (!newDailyReadPages.includes(page)) {
                    newDailyReadPages.push(page);
                }
                set({
                    lastReadPage: page,
                    lastReadSurah: surahName,
                    currentPage: page,
                    lastReadDate: today,
                    dailyReadPages: newDailyReadPages
                });
            },

            toggleBookmark: (page) => {
                const { bookmarks } = get();
                if (bookmarks.includes(page)) {
                    set({ bookmarks: bookmarks.filter((p) => p !== page) });
                } else {
                    set({ bookmarks: [...bookmarks, page] });
                }
            },

            isBookmarked: (page) => get().bookmarks.includes(page),

            updateLastLogin: () => {
                const now = new Date().toISOString();
                set({ lastLoginDate: now });
            },

            setFontSize: (size) => set({ fontSize: size }),
            setFontFamily: (family) => set({ fontFamily: family }),
        }),
        { name: 'rawq-quran' }
    )
);
