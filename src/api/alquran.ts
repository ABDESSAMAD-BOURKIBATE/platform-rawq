import type { MushafPage, Surah, SearchResult } from '../lib/types';

const BASE_URL = 'https://api.alquran.cloud/v1';

export async function fetchPage(pageNumber: number, edition: string = 'quran-uthmani'): Promise<MushafPage> {
    const res = await fetch(`${BASE_URL}/page/${pageNumber}/${edition}`);
    if (!res.ok) throw new Error(`Failed to fetch page ${pageNumber}`);
    const data = await res.json();
    return {
        number: pageNumber,
        ayahs: data.data.ayahs,
    };
}

export async function fetchSurah(surahNumber: number, edition: string = 'quran-uthmani'): Promise<{ surah: Surah; ayahs: MushafPage['ayahs'] }> {
    const res = await fetch(`${BASE_URL}/surah/${surahNumber}/${edition}`);
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

// Normalize Arabic text for better search matching
function normalizeArabicSearch(text: string): string {
    return text
        .replace(/[\u064B-\u0652\u0670\u0640]/g, '')  // Remove tashkeel
        .replace(/[إأآٱ]/g, 'ا')                       // Normalize alef
        .replace(/ة/g, 'ه')                             // Taa marbuta → haa
        .replace(/ى/g, 'ي')                             // Alef maqsura → yaa
        .replace(/ـ/g, '')                               // Remove tatweel
        .trim();
}

export async function searchQuran(keyword: string, edition: string = 'quran-uthmani'): Promise<SearchResult> {
    // Try search with original keyword
    const res = await fetch(`${BASE_URL}/search/${encodeURIComponent(keyword)}/all/${edition}`);
    if (!res.ok) {
        // Try normalized version as fallback
        const normalized = normalizeArabicSearch(keyword);
        if (normalized !== keyword) {
            const res2 = await fetch(`${BASE_URL}/search/${encodeURIComponent(normalized)}/all/${edition}`);
            if (!res2.ok) throw new Error('Search failed');
            const data2 = await res2.json();
            if (data2.data && data2.data.count > 0) {
                return { count: data2.data.count, matches: data2.data.matches };
            }
        }
        throw new Error('Search failed');
    }
    const data = await res.json();
    if (!data.data || data.data.count === 0) {
        // No results with original, try normalized
        const normalized = normalizeArabicSearch(keyword);
        if (normalized !== keyword) {
            const res2 = await fetch(`${BASE_URL}/search/${encodeURIComponent(normalized)}/all/${edition}`);
            if (res2.ok) {
                const data2 = await res2.json();
                if (data2.data && data2.data.count > 0) {
                    return { count: data2.data.count, matches: data2.data.matches };
                }
            }
        }
        return { count: 0, matches: [] };
    }
    return {
        count: data.data.count,
        matches: data.data.matches,
    };
}

export async function fetchAyahTafsirAndTranslation(surahNumber: number, ayahNumber: number) {
    // ar.muyassar, en.sahih, fr.hamidullah, ar.saadi (if available, let's just stick to muyassar, english, french)
    // Actually as we saw from node test: ar.muyassar, en.sahih, fr.hamidullah
    const res = await fetch(`${BASE_URL}/ayah/${surahNumber}:${ayahNumber}/editions/quran-uthmani,ar.muyassar,en.sahih,fr.hamidullah`);
    if (!res.ok) throw new Error('Failed to fetch tafsir and translation');
    const data = await res.json();
    return data.data;
}
