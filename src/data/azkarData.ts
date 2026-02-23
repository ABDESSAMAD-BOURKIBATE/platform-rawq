
export interface Dhikr {
    id: string;
    text: string;
    target: number;
    category: 'morning' | 'evening' | 'general' | 'after_prayer';
}

export const azkarData: Dhikr[] = [
    {
        id: 'tasbih',
        text: 'سُبْحَانَ اللَّهِ',
        target: 33,
        category: 'general'
    },
    {
        id: 'tahmid',
        text: 'الْحَمْدُ لِلَّهِ',
        target: 33,
        category: 'general'
    },
    {
        id: 'takbir',
        text: 'اللَّهُ أَكْبَرُ',
        target: 34,
        category: 'general'
    },
    {
        id: 'istighfar',
        text: 'أَسْتَغْفِرُ اللَّهَ',
        target: 100,
        category: 'general'
    },
    {
        id: 'tahlil_simple',
        text: 'لَا إِلَهَ إِلَّا اللَّهُ',
        target: 100,
        category: 'general'
    },
    {
        id: 'hawqala',
        text: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
        target: 100,
        category: 'general'
    },
    {
        id: 'salawat',
        text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
        target: 100,
        category: 'general'
    },
    {
        id: 'subhan_allah_wa_bihamdihi_short',
        text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
        target: 100,
        category: 'general'
    },
    {
        id: 'subhan_allah_wa_bihamdihi',
        text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
        target: 100,
        category: 'general'
    },
    {
        id: 'tahlil_long',
        text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        target: 100,
        category: 'general'
    },
    {
        id: 'subbuhun_quddusun',
        text: 'سُبُّوحٌ قُدُّوسٌ رَبُّ الْمَلَائِكَةِ وَالرُّوحِ',
        target: 33,
        category: 'general'
    },
    {
        id: 'hasbiya_allah',
        text: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
        target: 7,
        category: 'general'
    },
    {
        id: 'ya_hayyu_ya_qayyum',
        text: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ',
        target: 33,
        category: 'general'
    },
    {
        id: 'istighfar_long',
        text: 'أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
        target: 33,
        category: 'general'
    },
    {
        id: 'raditu_billah',
        text: 'رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ نَبِيًّا',
        target: 3,
        category: 'general'
    }
];
