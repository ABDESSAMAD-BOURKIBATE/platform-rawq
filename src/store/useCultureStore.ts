import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameMode, GameState } from '../types/culture';

interface CultureStore extends GameState {
    unlockLevel: (mode: GameMode, levelId: number) => void;
    saveScore: (mode: GameMode, levelId: number, score: number) => void;
    isLevelUnlocked: (mode: GameMode, levelId: number) => boolean;
    getHighScore: (mode: GameMode, levelId: number) => number;
}

export const useCultureStore = create<CultureStore>()(
    persist(
        (set, get) => ({
            unlockedLevels: {
                completeVerse: [1], // Level 1 unlocked by default
                multipleChoice: [1],
                stories: [1],
            },
            scores: {
                completeVerse: {},
                multipleChoice: {},
                stories: {},
            },
            unlockLevel: (mode, levelId) =>
                set((state) => {
                    const modeLevels = state.unlockedLevels[mode];
                    if (!modeLevels.includes(levelId)) {
                        return {
                            unlockedLevels: {
                                ...state.unlockedLevels,
                                [mode]: [...modeLevels, levelId],
                            },
                        };
                    }
                    return state;
                }),
            saveScore: (mode, levelId, score) =>
                set((state) => {
                    const currentScore = state.scores[mode][levelId] || 0;
                    if (score > currentScore) {
                        return {
                            scores: {
                                ...state.scores,
                                [mode]: {
                                    ...state.scores[mode],
                                    [levelId]: score,
                                },
                            },
                        };
                    }
                    return state;
                }),
            isLevelUnlocked: (mode, levelId) => {
                return get().unlockedLevels[mode].includes(levelId);
            },
            getHighScore: (mode, levelId) => {
                return get().scores[mode][levelId] || 0;
            },
        }),
        {
            name: 'quran-culture-storage',
            version: 1,
        }
    )
);
