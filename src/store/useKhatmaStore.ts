import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface KhatmaState {
    targetDays: number | null;
    startDate: string | null;
    readPages: number[]; // Array of page numbers that have been read in the current Khatma
    dailyWirdPages: number;

    // Actions
    setupKhatma: (days: number) => void;
    markPageRead: (pageNumber: number) => void;
    unmarkPageRead: (pageNumber: number) => void;
    resetKhatma: () => void;
}

const TOTAL_QURAN_PAGES = 604;

export const useKhatmaStore = create<KhatmaState>()(
    persist(
        (set, get) => ({
            targetDays: null,
            startDate: null,
            readPages: [],
            dailyWirdPages: 0,

            setupKhatma: (days) => {
                const dailyWird = Math.ceil(TOTAL_QURAN_PAGES / days);
                set({
                    targetDays: days,
                    startDate: new Date().toISOString(),
                    readPages: [],
                    dailyWirdPages: dailyWird,
                });
            },

            markPageRead: (pageNumber) =>
                set((state) => ({
                    readPages: state.readPages.includes(pageNumber)
                        ? state.readPages
                        : [...state.readPages, pageNumber].sort((a, b) => a - b),
                })),

            unmarkPageRead: (pageNumber) =>
                set((state) => ({
                    readPages: state.readPages.filter((p) => p !== pageNumber),
                })),

            resetKhatma: () =>
                set({
                    targetDays: null,
                    startDate: null,
                    readPages: [],
                    dailyWirdPages: 0,
                }),
        }),
        {
            name: 'rawq-khatma-storage',
            version: 1,
        }
    )
);
