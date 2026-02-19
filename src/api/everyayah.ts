const BASE_URL = 'https://everyayah.com/data/';

/**
 * Get the audio URL for a specific ayah from EveryAyah CDN.
 * Format: {ReciterFolder}/{SurahPadded}{AyahPadded}.mp3
 * Example: Alafasy_128kbps/001001.mp3
 */
export function getAyahAudioUrl(
    reciterFolder: string,
    surahNumber: number,
    ayahNumber: number
): string {
    const surah = String(surahNumber).padStart(3, '0');
    const ayah = String(ayahNumber).padStart(3, '0');
    return `${BASE_URL}${reciterFolder}/${surah}${ayah}.mp3`;
}

// Map of commonly used reciters to their EveryAyah folder names
export const RECITER_FOLDERS: Record<string, string> = {
    'Alafasy': 'Alafasy_128kbps',
    'Husary': 'Husary_128kbps',
    'Minshawy_Murattal': 'Minshawy_Murattal_128kbps',
    'AbdulBaset_Murattal': 'Abdul_Basit_Murattal_128kbps',
    'Sudais': 'Sudais_128kbps',
    'Shuraym': 'Shuraym_128kbps',
    'Saood_ash-Shuraym': 'Shuraym_128kbps',
    'Maher_AlMuaiqly': 'MauroAl-Muaiqly128kbps',
    'Hani_Rifai': 'Hani_Rifai_192kbps',
    'Ahmed_ibn_Ali_al-Ajamy': 'ahmed_ibn_ali_al-ajamy_128kbps',
};

export const DEFAULT_RECITER_FOLDER = 'Alafasy_128kbps';
