import type { MushafPage, Surah, SearchResult } from '../lib/types';

const BASE_URL = 'https://api.alquran.cloud/v1';

export async function fetchPage(pageNumber: number): Promise<MushafPage> {
    const res = await fetch(`${BASE_URL}/page/${pageNumber}/quran-uthmani`);
    if (!res.ok) throw new Error(`Failed to fetch page ${pageNumber}`);
    const data = await res.json();
    return {
        number: pageNumber,
        ayahs: data.data.ayahs,
    };
}

export async function fetchSurah(surahNumber: number): Promise<{ surah: Surah; ayahs: MushafPage['ayahs'] }> {
    const res = await fetch(`${BASE_URL}/surah/${surahNumber}/quran-uthmani`);
    if (!res.ok) throw new Error(`Failed to fetch surah ${surahNumber}`);
    const data = await res.json();
    return {
        surah: {
            number: data.data.number,
            name: data.data.name,
            englishName: data.data.englishName,
            englishNameTranslation: data.data.englishNameTranslation,
            numberOfAyahs: data.data.numberOfAyahs,
            revelationType: data.data.revelationType,
        },
        ayahs: data.data.ayahs,
    };
}

export async function fetchAllSurahs(): Promise<Surah[]> {
    const res = await fetch(`${BASE_URL}/surah`);
    if (!res.ok) throw new Error('Failed to fetch surahs');
    const data = await res.json();
    return data.data.map((s: any) => ({
        number: s.number,
        name: s.name,
        englishName: s.englishName,
        englishNameTranslation: s.englishNameTranslation,
        numberOfAyahs: s.numberOfAyahs,
        revelationType: s.revelationType,
    }));
}

export async function searchQuran(keyword: string): Promise<SearchResult> {
    const res = await fetch(`${BASE_URL}/search/${encodeURIComponent(keyword)}/all/quran-uthmani`);
    if (!res.ok) throw new Error('Search failed');
    const data = await res.json();
    return {
        count: data.data.count,
        matches: data.data.matches,
    };
}
