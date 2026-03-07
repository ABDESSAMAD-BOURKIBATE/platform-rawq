import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PrayerChoice = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface DailyHabits {
    prayers: Record<PrayerChoice, boolean>;
    wird: boolean;
    fasting: boolean;
    morningAdhkar: boolean;
    eveningAdhkar: boolean;
    charity: boolean;
    goodDeed: boolean;
    note: string;
}

export interface HabitsState {
    history: Record<string, DailyHabits>; // Key is YYYY-MM-DD

    // Actions
    togglePrayer: (dateStr: string, prayer: PrayerChoice) => void;
    toggleWird: (dateStr: string) => void;
    toggleFasting: (dateStr: string) => void;
    toggleMorningAdhkar: (dateStr: string) => void;
    toggleEveningAdhkar: (dateStr: string) => void;
    toggleCharity: (dateStr: string) => void;
    toggleGoodDeed: (dateStr: string) => void;
    setNote: (dateStr: string, note: string) => void;
    getOrCreateDay: (dateStr: string) => DailyHabits;
}

const defaultDay: DailyHabits = {
    prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
    wird: false,
    fasting: false,
    morningAdhkar: false,
    eveningAdhkar: false,
    charity: false,
    goodDeed: false,
    note: '',
};

export const useHabitsStore = create<HabitsState>()(
    persist(
        (set, get) => ({
            history: {},

            getOrCreateDay: (dateStr) => {
                const state = get();
                if (state.history[dateStr]) {
                    return state.history[dateStr];
                }
                return { ...defaultDay, prayers: { ...defaultDay.prayers } };
            },

            togglePrayer: (dateStr, prayer) => set((state) => {
                const day = state.history[dateStr] || { ...defaultDay, prayers: { ...defaultDay.prayers } };
                return {
                    history: {
                        ...state.history,
                        [dateStr]: {
                            ...day,
                            prayers: {
                                ...day.prayers,
                                [prayer]: !day.prayers[prayer]
                            }
                        }
                    }
                };
            }),

            toggleWird: (dateStr) => set((state) => {
                const day = state.history[dateStr] || { ...defaultDay, prayers: { ...defaultDay.prayers } };
                return {
                    history: {
                        ...state.history,
                        [dateStr]: { ...day, wird: !day.wird }
                    }
                };
            }),

            toggleFasting: (dateStr) => set((state) => {
                const day = state.history[dateStr] || { ...defaultDay, prayers: { ...defaultDay.prayers } };
                return {
                    history: {
                        ...state.history,
                        [dateStr]: { ...day, fasting: !day.fasting }
                    }
                };
            }),

            toggleMorningAdhkar: (dateStr) => set((state) => {
                const day = state.history[dateStr] || { ...defaultDay, prayers: { ...defaultDay.prayers } };
                return { history: { ...state.history, [dateStr]: { ...day, morningAdhkar: !day.morningAdhkar } } };
            }),

            toggleEveningAdhkar: (dateStr) => set((state) => {
                const day = state.history[dateStr] || { ...defaultDay, prayers: { ...defaultDay.prayers } };
                return { history: { ...state.history, [dateStr]: { ...day, eveningAdhkar: !day.eveningAdhkar } } };
            }),

            toggleCharity: (dateStr) => set((state) => {
                const day = state.history[dateStr] || { ...defaultDay, prayers: { ...defaultDay.prayers } };
                return { history: { ...state.history, [dateStr]: { ...day, charity: !day.charity } } };
            }),

            toggleGoodDeed: (dateStr) => set((state) => {
                const day = state.history[dateStr] || { ...defaultDay, prayers: { ...defaultDay.prayers } };
                return { history: { ...state.history, [dateStr]: { ...day, goodDeed: !day.goodDeed } } };
            }),

            setNote: (dateStr, note) => set((state) => {
                const day = state.history[dateStr] || { ...defaultDay, prayers: { ...defaultDay.prayers } };
                return { history: { ...state.history, [dateStr]: { ...day, note } } };
            }),
        }),
        {
            name: 'rawq-habits-storage',
            version: 1,
        }
    )
);
