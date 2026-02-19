/* ---- TypeScript Interfaces for RAWQ ---- */

export interface Ayah {
    number: number;
    numberInSurah: number;
    text: string;
    surah: {
        number: number;
        name: string;
        englishName: string;
        englishNameTranslation: string;
        revelationType: string;
    };
    juz: number;
    page: number;
    hizbQuarter: number;
}

export interface MushafPage {
    number: number;
    ayahs: Ayah[];
}

export interface Surah {
    number: number;
    name: string;
    englishName: string;
    englishNameTranslation: string;
    numberOfAyahs: number;
    revelationType: 'Meccan' | 'Medinan';
}

export interface Reciter {
    id: number;
    name: string;
    letter: string;
    moshaf: Moshaf[];
}

export interface Moshaf {
    id: number;
    name: string;
    server: string;
    surah_total: number;
    moshaf_type: number;
    surah_list: string;
}

export interface Riwaya {
    id: number;
    name: string;
}

export interface RadioStation {
    id: number;
    name: string;
    url: string;
    recent_date: string;
}

export interface SearchMatch {
    number: number;
    text: string;
    surah: {
        number: number;
        name: string;
        englishName: string;
    };
    numberInSurah: number;
    edition: {
        identifier: string;
        language: string;
        name: string;
    };
}

export interface SearchResult {
    count: number;
    matches: SearchMatch[];
}

export type ThemeMode = 'dark' | 'light' | 'system';
