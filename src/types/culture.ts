export type GameMode = 'completeVerse' | 'multipleChoice' | 'stories';

export interface Question {
    id: string;
    text: string;
    options: string[]; // 4 options
    correctAnswerIndex: number; // 0-3
}

export interface LevelData {
    id: number;
    mode: GameMode;
    questions: Question[]; // More than 80 in final version
}

export interface GameState {
    unlockedLevels: Record<GameMode, number[]>; // Mode -> list of unlocked level IDs
    scores: Record<GameMode, Record<number, number>>; // Mode -> Level ID -> Best Score (percentage)
}
