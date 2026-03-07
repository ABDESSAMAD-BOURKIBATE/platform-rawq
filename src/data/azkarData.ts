
export interface Dhikr {
    id: string;
    text: string;
    target: number;
    category: 'morning' | 'evening' | 'general' | 'after_prayer';
}

// ========================
// أذكار الصباح — 20 ذكر
// ========================
export const morningAzkar: Dhikr[] = [
    {
        id: 'morning_ayat_kursi',
        text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ...',
        target: 1,
        category: 'morning'
    },
    {
        id: 'morning_ikhlas',
        text: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ﴿ قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ ﴾',
        target: 3,
        category: 'morning'
    },
    {
        id: 'morning_falaq',
        text: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ﴿ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ ۝ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴾',
        target: 3,
        category: 'morning'
    },
    {
        id: 'morning_nas',
        text: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ﴿ قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ﴾',
        target: 3,
        category: 'morning'
    },
    {
        id: 'morning_sayyid_istighfar',
        text: 'اللَّهُمَّ أَنْتَ رَبِّي لَا إِلَهَ إِلَّا أَنْتَ، خَلَقْتَنِي وَأَنَا عَبْدُكَ، وَأَنَا عَلَى عَهْدِكَ وَوَعْدِكَ مَا اسْتَطَعْتُ، أَعُوذُ بِكَ مِنْ شَرِّ مَا صَنَعْتُ',
        target: 1,
        category: 'morning'
    },
    {
        id: 'morning_asbahna',
        text: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        target: 1,
        category: 'morning'
    },
    {
        id: 'morning_asbahna_ala_fitra',
        text: 'أَصْبَحْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا',
        target: 1,
        category: 'morning'
    },
    {
        id: 'morning_allahumma_bika_asbahna',
        text: 'اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا، وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ',
        target: 1,
        category: 'morning'
    },
    {
        id: 'morning_allahumma_inni_asbahtu',
        text: 'اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ',
        target: 4,
        category: 'morning'
    },
    {
        id: 'morning_allahumma_ma_asbaha',
        text: 'اللَّهُمَّ مَا أَصْبَحَ بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ',
        target: 1,
        category: 'morning'
    },
    {
        id: 'morning_allahumma_afini',
        text: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ',
        target: 3,
        category: 'morning'
    },
    {
        id: 'morning_allahumma_inni_aoodhu_min_kufr',
        text: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ',
        target: 3,
        category: 'morning'
    },
    {
        id: 'morning_allahumma_inni_asaluka_ilm',
        text: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا، وَرِزْقًا طَيِّبًا، وَعَمَلًا مُتَقَبَّلًا',
        target: 1,
        category: 'morning'
    },
    {
        id: 'morning_subhan_allah',
        text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
        target: 100,
        category: 'morning'
    },
    {
        id: 'morning_la_ilaha',
        text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        target: 10,
        category: 'morning'
    },
    {
        id: 'morning_bismillah',
        text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
        target: 3,
        category: 'morning'
    },
    {
        id: 'morning_raditu',
        text: 'رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ ﷺ نَبِيًّا',
        target: 3,
        category: 'morning'
    },
    {
        id: 'morning_hasbiya',
        text: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
        target: 7,
        category: 'morning'
    },
    {
        id: 'morning_aoodhu_kalimat',
        text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        target: 3,
        category: 'morning'
    },
    {
        id: 'morning_salawat',
        text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
        target: 10,
        category: 'morning'
    },
];

// ========================
// أذكار المساء — 20 ذكر
// ========================
export const eveningAzkar: Dhikr[] = [
    {
        id: 'evening_ayat_kursi',
        text: 'اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا نَوْمٌ ۚ لَهُ مَا فِي السَّمَاوَاتِ وَمَا فِي الْأَرْضِ...',
        target: 1,
        category: 'evening'
    },
    {
        id: 'evening_ikhlas',
        text: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ﴿ قُلْ هُوَ اللَّهُ أَحَدٌ ۝ اللَّهُ الصَّمَدُ ۝ لَمْ يَلِدْ وَلَمْ يُولَدْ ۝ وَلَمْ يَكُنْ لَهُ كُفُوًا أَحَدٌ ﴾',
        target: 3,
        category: 'evening'
    },
    {
        id: 'evening_falaq',
        text: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ﴿ قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ ۝ مِنْ شَرِّ مَا خَلَقَ ۝ وَمِنْ شَرِّ غَاسِقٍ إِذَا وَقَبَ ﴾',
        target: 3,
        category: 'evening'
    },
    {
        id: 'evening_nas',
        text: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ ﴿ قُلْ أَعُوذُ بِرَبِّ النَّاسِ ۝ مَلِكِ النَّاسِ ۝ إِلَٰهِ النَّاسِ ﴾',
        target: 3,
        category: 'evening'
    },
    {
        id: 'evening_amseyna',
        text: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ، وَالْحَمْدُ لِلَّهِ، لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        target: 1,
        category: 'evening'
    },
    {
        id: 'evening_allahumma_bika_amseyna',
        text: 'اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا، وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ',
        target: 1,
        category: 'evening'
    },
    {
        id: 'evening_allahumma_inni_amseitu',
        text: 'اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ أَنَّكَ أَنْتَ اللَّهُ لَا إِلَهَ إِلَّا أَنْتَ',
        target: 4,
        category: 'evening'
    },
    {
        id: 'evening_allahumma_ma_amsa',
        text: 'اللَّهُمَّ مَا أَمْسَى بِي مِنْ نِعْمَةٍ أَوْ بِأَحَدٍ مِنْ خَلْقِكَ فَمِنْكَ وَحْدَكَ لَا شَرِيكَ لَكَ، فَلَكَ الْحَمْدُ وَلَكَ الشُّكْرُ',
        target: 1,
        category: 'evening'
    },
    {
        id: 'evening_allahumma_afini',
        text: 'اللَّهُمَّ عَافِنِي فِي بَدَنِي، اللَّهُمَّ عَافِنِي فِي سَمْعِي، اللَّهُمَّ عَافِنِي فِي بَصَرِي، لَا إِلَهَ إِلَّا أَنْتَ',
        target: 3,
        category: 'evening'
    },
    {
        id: 'evening_allahumma_inni_aoodhu_min_kufr',
        text: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْكُفْرِ وَالْفَقْرِ، وَأَعُوذُ بِكَ مِنْ عَذَابِ الْقَبْرِ، لَا إِلَهَ إِلَّا أَنْتَ',
        target: 3,
        category: 'evening'
    },
    {
        id: 'evening_amseyna_ala_fitra',
        text: 'أَمْسَيْنَا عَلَى فِطْرَةِ الْإِسْلَامِ، وَعَلَى كَلِمَةِ الْإِخْلَاصِ، وَعَلَى دِينِ نَبِيِّنَا مُحَمَّدٍ ﷺ، وَعَلَى مِلَّةِ أَبِينَا إِبْرَاهِيمَ حَنِيفًا مُسْلِمًا',
        target: 1,
        category: 'evening'
    },
    {
        id: 'evening_subhan_allah',
        text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
        target: 100,
        category: 'evening'
    },
    {
        id: 'evening_la_ilaha',
        text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
        target: 10,
        category: 'evening'
    },
    {
        id: 'evening_bismillah',
        text: 'بِسْمِ اللَّهِ الَّذِي لَا يَضُرُّ مَعَ اسْمِهِ شَيْءٌ فِي الْأَرْضِ وَلَا فِي السَّمَاءِ وَهُوَ السَّمِيعُ الْعَلِيمُ',
        target: 3,
        category: 'evening'
    },
    {
        id: 'evening_aoodhu',
        text: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ',
        target: 3,
        category: 'evening'
    },
    {
        id: 'evening_hasbiya',
        text: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
        target: 7,
        category: 'evening'
    },
    {
        id: 'evening_raditu',
        text: 'رَضِيتُ بِاللَّهِ رَبًّا وَبِالْإِسْلَامِ دِينًا وَبِمُحَمَّدٍ ﷺ نَبِيًّا',
        target: 3,
        category: 'evening'
    },
    {
        id: 'evening_salawat',
        text: 'اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ',
        target: 10,
        category: 'evening'
    },
    {
        id: 'evening_allahumma_innaka',
        text: 'اللَّهُمَّ إِنَّكَ عَفُوٌّ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي',
        target: 3,
        category: 'evening'
    },
    {
        id: 'evening_naum',
        text: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
        target: 1,
        category: 'evening'
    },
];

// ========================
// التسبيح العام — 25 ذكر
// ========================
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
    },
    {
        id: 'subhan_allah_malik',
        text: 'سُبْحَانَ الْمَلِكِ الْقُدُّوسِ',
        target: 33,
        category: 'general'
    },
    {
        id: 'la_ilaha_wahdah',
        text: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ، أَنْجَزَ وَعْدَهُ، وَنَصَرَ عَبْدَهُ، وَهَزَمَ الْأَحْزَابَ وَحْدَهُ',
        target: 33,
        category: 'general'
    },
    {
        id: 'allahumma_ajirni',
        text: 'اللَّهُمَّ أَجِرْنِي مِنَ النَّارِ',
        target: 7,
        category: 'general'
    },
    {
        id: 'rabbi_ighfir_li',
        text: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ إِنَّكَ أَنْتَ التَّوَّابُ الرَّحِيمُ',
        target: 100,
        category: 'general'
    },
    {
        id: 'subhan_allah_wabihamdihi_adad',
        text: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ وَرِضَا نَفْسِهِ وَزِنَةَ عَرْشِهِ وَمِدَادَ كَلِمَاتِهِ',
        target: 3,
        category: 'general'
    },
    {
        id: 'allahumma_ainni',
        text: 'اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ',
        target: 3,
        category: 'general'
    },
    {
        id: 'subhanallah_wal_hamdulillah',
        text: 'سُبْحَانَ اللَّهِ وَالْحَمْدُ لِلَّهِ وَلَا إِلَهَ إِلَّا اللَّهُ وَاللَّهُ أَكْبَرُ',
        target: 100,
        category: 'general'
    },
    {
        id: 'la_ilaha_illa_allah_dhikr',
        text: 'لَا إِلَهَ إِلَّا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ',
        target: 33,
        category: 'general'
    },
    {
        id: 'allahumma_salli_ibrahimi',
        text: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ إِنَّكَ حَمِيدٌ مَجِيدٌ',
        target: 10,
        category: 'general'
    },
    {
        id: 'tawakkul',
        text: 'تَوَكَّلْتُ عَلَى اللَّهِ لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
        target: 33,
        category: 'general'
    },
];
