import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GameMode, GameState } from '../types/culture';

// Detailed record for each level attempt
export interface LevelAttempt {
    mode: GameMode;
    levelId: number;
    score: number;           // correct answers
    totalQuestions: number;
    percentage: number;
    totalTime: number;       // seconds
    incorrectCount: number;
    longestStreak: number;
    intelligence: number;    // accuracy-based
    insight: number;         // speed-based
    concentration: number;   // streak-based
    memorization: number;    // recall-based
    accuracy: number;        // precision
    passed: boolean;
    date: string;            // ISO date
}

interface CultureStore extends GameState {
    // History of all attempts
    history: LevelAttempt[];

    // Actions
    unlockLevel: (mode: GameMode, levelId: number) => void;
    saveScore: (mode: GameMode, levelId: number, score: number) => void;
    saveAttempt: (attempt: LevelAttempt) => void;
    isLevelUnlocked: (mode: GameMode, levelId: number) => boolean;
    getHighScore: (mode: GameMode, levelId: number) => number;
    getLevelAttempts: (mode: GameMode, levelId: number) => LevelAttempt[];
    getModeStats: (mode: GameMode) => {
        totalAttempts: number;
        passedLevels: number;
        avgScore: number;
        avgIntelligence: number;
        avgInsight: number;
        avgConcentration: number;
        avgMemorization: number;
        avgAccuracy: number;
        totalTime: number;
    };
    getOverallStats: () => {
        totalAttempts: number;
        passedLevels: number;
        avgScore: number;
        avgIntelligence: number;
        avgInsight: number;
        avgConcentration: number;
        avgMemorization: number;
        avgAccuracy: number;
        totalTime: number;
        bestStreak: number;
    };
    getPassedLevelIds: (mode: GameMode) => number[];
}

export const useCultureStore = create<CultureStore>()(
    persist(
        (set, get) => ({
            unlockedLevels: {
                completeVerse: [1],
                multipleChoice: [1],
                stories: [1],
            },
            scores: {
                completeVerse: {},
                multipleChoice: {},
                stories: {},
            },
            history: [],

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
            saveAttempt: (attempt) =>
                set((state) => ({
                    history: [...state.history, attempt],
                })),
            isLevelUnlocked: (mode, levelId) => {
                return true; // All levels unlocked
            },
            getHighScore: (mode, levelId) => {
                return get().scores[mode][levelId] || 0;
            },
            getLevelAttempts: (mode, levelId) => {
                return get().history.filter(
                    (a) => a.mode === mode && a.levelId === levelId
                );
            },
            getPassedLevelIds: (mode) => {
                const attempts = get().history.filter((a) => a.mode === mode && a.passed);
                return [...new Set(attempts.map((a) => a.levelId))];
            },
            getModeStats: (mode) => {
                const attempts = get().history.filter((a) => a.mode === mode);
                if (attempts.length === 0) {
                    return {
                        totalAttempts: 0, passedLevels: 0, avgScore: 0,
                        avgIntelligence: 0, avgInsight: 0, avgConcentration: 0,
                        avgMemorization: 0, avgAccuracy: 0, totalTime: 0,
                    };
                }
                const passedIds = new Set(attempts.filter((a) => a.passed).map((a) => a.levelId));
                return {
                    totalAttempts: attempts.length,
                    passedLevels: passedIds.size,
                    avgScore: Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length),
                    avgIntelligence: Math.round(attempts.reduce((s, a) => s + a.intelligence, 0) / attempts.length),
                    avgInsight: Math.round(attempts.reduce((s, a) => s + a.insight, 0) / attempts.length),
                    avgConcentration: Math.round(attempts.reduce((s, a) => s + a.concentration, 0) / attempts.length),
                    avgMemorization: Math.round(attempts.reduce((s, a) => s + a.memorization, 0) / attempts.length),
                    avgAccuracy: Math.round(attempts.reduce((s, a) => s + a.accuracy, 0) / attempts.length),
                    totalTime: attempts.reduce((s, a) => s + a.totalTime, 0),
                };
            },
            getOverallStats: () => {
                const attempts = get().history;
                if (attempts.length === 0) {
                    return {
                        totalAttempts: 0, passedLevels: 0, avgScore: 0,
                        avgIntelligence: 0, avgInsight: 0, avgConcentration: 0,
                        avgMemorization: 0, avgAccuracy: 0, totalTime: 0, bestStreak: 0,
                    };
                }
                const passedIds = new Set(
                    attempts.filter((a) => a.passed).map((a) => `${a.mode}-${a.levelId}`)
                );
                return {
                    totalAttempts: attempts.length,
                    passedLevels: passedIds.size,
                    avgScore: Math.round(attempts.reduce((s, a) => s + a.percentage, 0) / attempts.length),
                    avgIntelligence: Math.round(attempts.reduce((s, a) => s + a.intelligence, 0) / attempts.length),
                    avgInsight: Math.round(attempts.reduce((s, a) => s + a.insight, 0) / attempts.length),
                    avgConcentration: Math.round(attempts.reduce((s, a) => s + a.concentration, 0) / attempts.length),
                    avgMemorization: Math.round(attempts.reduce((s, a) => s + a.memorization, 0) / attempts.length),
                    avgAccuracy: Math.round(attempts.reduce((s, a) => s + a.accuracy, 0) / attempts.length),
                    totalTime: attempts.reduce((s, a) => s + a.totalTime, 0),
                    bestStreak: Math.max(0, ...attempts.map((a) => a.longestStreak)),
                };
            },
        }),
        {
            name: 'quran-culture-storage',
            version: 2,
        }
    )
);
