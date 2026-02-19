import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CaretLeft, CaretRight, BookmarkSimple, List, X } from '@phosphor-icons/react';
import { fetchPage, fetchAllSurahs } from '../api/alquran';
import { useQuranStore } from '../store/useQuranStore';
import { useAudioStore } from '../store/useAudioStore';
import { audioEngine } from '../lib/audioEngine';
import type { MushafPage, Surah } from '../lib/types';

const TOTAL_PAGES = 604;

// Surah starting pages (1-indexed, standard Uthmani Mushaf)
const SURAH_PAGES: Record<number, number> = {
    1: 1, 2: 2, 3: 50, 4: 77, 5: 106, 6: 128, 7: 151, 8: 177, 9: 187, 10: 208,
    11: 221, 12: 235, 13: 249, 14: 255, 15: 262, 16: 267, 17: 282, 18: 293, 19: 305, 20: 312,
    21: 322, 22: 332, 23: 342, 24: 350, 25: 359, 26: 367, 27: 377, 28: 385, 29: 396, 30: 404,
    31: 411, 32: 415, 33: 418, 34: 428, 35: 434, 36: 440, 37: 446, 38: 453, 39: 458, 40: 467,
    41: 477, 42: 483, 43: 489, 44: 496, 45: 499, 46: 502, 47: 507, 48: 511, 49: 515, 50: 518,
    51: 520, 52: 523, 53: 526, 54: 528, 55: 531, 56: 534, 57: 537, 58: 542, 59: 545, 60: 549,
    61: 551, 62: 553, 63: 554, 64: 556, 65: 558, 66: 560, 67: 562, 68: 564, 69: 566, 70: 568,
    71: 570, 72: 572, 73: 574, 74: 575, 75: 577, 76: 578, 77: 580, 78: 582, 79: 583, 80: 585,
    81: 586, 82: 587, 83: 587, 84: 589, 85: 590, 86: 591, 87: 591, 88: 592, 89: 593, 90: 594,
    91: 595, 92: 595, 93: 596, 94: 596, 95: 597, 96: 597, 97: 598, 98: 598, 99: 599, 100: 599,
    101: 600, 102: 600, 103: 601, 104: 601, 105: 601, 106: 602, 107: 602, 108: 602, 109: 603,
    110: 603, 111: 603, 112: 604, 113: 604, 114: 604,
};

// Surah names for the selector
const SURAH_NAMES: Record<number, string> = {
    1: 'الفاتحة', 2: 'البقرة', 3: 'آل عمران', 4: 'النساء', 5: 'المائدة', 6: 'الأنعام', 7: 'الأعراف',
    8: 'الأنفال', 9: 'التوبة', 10: 'يونس', 11: 'هود', 12: 'يوسف', 13: 'الرعد', 14: 'إبراهيم',
    15: 'الحجر', 16: 'النحل', 17: 'الإسراء', 18: 'الكهف', 19: 'مريم', 20: 'طه', 21: 'الأنبياء',
    22: 'الحج', 23: 'المؤمنون', 24: 'النور', 25: 'الفرقان', 26: 'الشعراء', 27: 'النمل', 28: 'القصص',
    29: 'العنكبوت', 30: 'الروم', 31: 'لقمان', 32: 'السجدة', 33: 'الأحزاب', 34: 'سبأ', 35: 'فاطر',
    36: 'يس', 37: 'الصافات', 38: 'ص', 39: 'الزمر', 40: 'غافر', 41: 'فصلت', 42: 'الشورى', 43: 'الزخرف',
    44: 'الدخان', 45: 'الجاثية', 46: 'الأحقاف', 47: 'محمد', 48: 'الفتح', 49: 'الحجرات', 50: 'ق',
    51: 'الذاريات', 52: 'الطور', 53: 'النجم', 54: 'القمر', 55: 'الرحمن', 56: 'الواقعة', 57: 'الحديد',
    58: 'المجادلة', 59: 'الحشر', 60: 'الممتحنة', 61: 'الصف', 62: 'الجمعة', 63: 'المنافقون', 64: 'التغابن',
    65: 'الطلاق', 66: 'التحريم', 67: 'الملك', 68: 'القلم', 69: 'الحاقة', 70: 'المعارج', 71: 'نوح',
    72: 'الجن', 73: 'المزمل', 74: 'المدثر', 75: 'القيامة', 76: 'الإنسان', 77: 'المرسلات', 78: 'النبأ',
    79: 'النازعات', 80: 'عبس', 81: 'التكوير', 82: 'الانفطار', 83: 'المطففين', 84: 'الانشقاق',
    85: 'البروج', 86: 'الطارق', 87: 'الأعلى', 88: 'الغاشية', 89: 'الفجر', 90: 'البلد', 91: 'الشمس',
    92: 'الليل', 93: 'الضحى', 94: 'الشرح', 95: 'التين', 96: 'العلق', 97: 'القدر', 98: 'البينة',
    99: 'الزلزلة', 100: 'العاديات', 101: 'القارعة', 102: 'التكاثر', 103: 'العصر', 104: 'الهمزة',
    105: 'الفيل', 106: 'قريش', 107: 'الماعون', 108: 'الكوثر', 109: 'الكافرون', 110: 'النصر',
    111: 'المسد', 112: 'الإخلاص', 113: 'الفلق', 114: 'الناس',
};

export function MushafPage() {
    const { t } = useTranslation();
    const { currentPage, setCurrentPage, saveLastRead, toggleBookmark, isBookmarked } = useQuranStore();
    const { currentAyah: playingAyah, currentSurah: playingSurah } = useAudioStore();

    const [pageData, setPageData] = useState<MushafPage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAyah, setSelectedAyah] = useState<number | null>(null);
    const [showSurahPicker, setShowSurahPicker] = useState(false);
    const [surahSearch, setSurahSearch] = useState('');
    const [pickerTab, setPickerTab] = useState<'surah' | 'ayah'>('surah');
    const [goToSurahNum, setGoToSurahNum] = useState('');
    const [goToAyahNum, setGoToAyahNum] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    // Touch swipe state
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const loadPage = useCallback(async (page: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchPage(page);
            setPageData(data);
            if (data.ayahs.length > 0) {
                saveLastRead(page, data.ayahs[0].surah.name);
            }
        } catch (err) {
            setError(t('mushaf.error'));
        } finally {
            setLoading(false);
        }
    }, [saveLastRead, t]);

    useEffect(() => {
        loadPage(currentPage);
    }, [currentPage, loadPage]);

    const goToPage = (page: number) => {
        if (page >= 1 && page <= TOTAL_PAGES) {
            setCurrentPage(page);
            setSelectedAyah(null);
        }
    };

    const goToSurah = (surahNum: number) => {
        const page = SURAH_PAGES[surahNum];
        if (page) {
            goToPage(page);
            setShowSurahPicker(false);
            setSurahSearch('');
        }
    };

    // Swipe handlers
    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: React.TouchEvent) => {
        touchEndX.current = e.changedTouches[0].clientX;
        const diff = touchStartX.current - touchEndX.current;
        if (Math.abs(diff) > 60) {
            if (diff > 0) goToPage(currentPage - 1);
            else goToPage(currentPage + 1);
        }
    };

    const handleAyahClick = (surahNum: number, ayahNum: number) => {
        setSelectedAyah(ayahNum);
        audioEngine.playAyah(surahNum, ayahNum);
    };

    // Group ayahs by surah for headers
    const surahGroups = pageData?.ayahs.reduce((acc, ayah) => {
        const key = ayah.surah.number;
        if (!acc[key]) acc[key] = { surah: ayah.surah, ayahs: [] };
        acc[key].ayahs.push(ayah);
        return acc;
    }, {} as Record<number, { surah: typeof pageData.ayahs[0]['surah']; ayahs: typeof pageData.ayahs }>) || {};

    const bookmarked = isBookmarked(currentPage);

    // Filtered surahs for search
    const allSurahs = Array.from({ length: 114 }, (_, i) => i + 1);
    const filteredSurahs = surahSearch
        ? allSurahs.filter(n => {
            const name = SURAH_NAMES[n] || '';
            return name.includes(surahSearch) || String(n).includes(surahSearch);
        })
        : allSurahs;

    // Determine current surah name from page data
    const currentSurahName = pageData?.ayahs[0]?.surah?.name || '';

    return (
        <div className="flex flex-col gap-md">
            {/* Header */}
            <div className="flex items-center justify-between animate-fade-in">
                <h2 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{t('mushaf.title')}</h2>
                <div className="flex items-center gap-sm">
                    {/* Surah Picker Button */}
                    <button
                        className="btn btn-ghost"
                        onClick={() => setShowSurahPicker(true)}
                        style={{ fontSize: '0.8rem', gap: 4 }}
                    >
                        <List size={22} color="var(--accent-gold)" weight="duotone" />
                        <span className="text-gold" style={{ fontWeight: 600, maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {currentSurahName || 'اختر سورة'}
                        </span>
                    </button>
                    <button
                        className="btn btn-icon btn-ghost"
                        onClick={() => toggleBookmark(currentPage)}
                        aria-label="Bookmark"
                    >
                        {bookmarked ? (
                            <BookmarkSimple size={24} color="var(--accent-gold)" weight="fill" />
                        ) : (
                            <BookmarkSimple size={24} />
                        )}
                    </button>
                </div>
            </div>

            {/* Page Navigation */}
            <div className="flex items-center justify-between" style={{ fontSize: '0.85rem' }}>
                <button
                    className="btn btn-ghost"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= TOTAL_PAGES}
                >
                    <CaretRight size={22} />
                </button>
                <span className="text-muted">
                    {t('mushaf.pageOf', { current: currentPage, total: TOTAL_PAGES })}
                </span>
                <button
                    className="btn btn-ghost"
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    <CaretLeft size={22} />
                </button>
            </div>

            {/* Mushaf Content */}
            <div
                ref={containerRef}
                className="parchment animate-scale-in"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                style={{ minHeight: '60vh' }}
            >
                {loading ? (
                    <div className="mushaf-page">
                        <div className="skeleton skeleton-text" style={{ width: '100%', height: '1.4em' }} />
                        <div className="skeleton skeleton-text" style={{ width: '90%', height: '1.4em' }} />
                        <div className="skeleton skeleton-text" style={{ width: '95%', height: '1.4em' }} />
                        <div className="skeleton skeleton-text" style={{ width: '80%', height: '1.4em' }} />
                        <div className="skeleton skeleton-text" style={{ width: '100%', height: '1.4em' }} />
                        <div className="skeleton skeleton-text" style={{ width: '85%', height: '1.4em' }} />
                        <div className="skeleton skeleton-text" style={{ width: '92%', height: '1.4em' }} />
                        <div className="skeleton skeleton-text" style={{ width: '88%', height: '1.4em' }} />
                    </div>
                ) : error ? (
                    <div className="empty-state">
                        <p>{error}</p>
                        <button className="btn btn-primary" onClick={() => loadPage(currentPage)}>
                            {t('mushaf.retry')}
                        </button>
                    </div>
                ) : (
                    <div className="mushaf-page">
                        {Object.values(surahGroups).map((group) => (
                            <div key={group.surah.number}>
                                {group.ayahs[0].numberInSurah === 1 && (
                                    <div className="surah-header">
                                        <h3 className="text-gold glow-text" style={{ fontSize: '1.3rem' }}>
                                            {group.surah.name}
                                        </h3>
                                        {group.surah.number !== 1 && group.surah.number !== 9 && (
                                            <div className="bismillah">بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>
                                        )}
                                    </div>
                                )}
                                {group.ayahs.map((ayah) => {
                                    const isActive =
                                        selectedAyah === ayah.numberInSurah ||
                                        (playingAyah === ayah.numberInSurah && playingSurah === ayah.surah.number);
                                    return (
                                        <span
                                            key={`${ayah.surah.number}-${ayah.numberInSurah}`}
                                            className={`ayah${isActive ? ' active' : ''}`}
                                            onClick={() => handleAyahClick(ayah.surah.number, ayah.numberInSurah)}
                                        >
                                            {ayah.text}
                                            <span className="ayah-number">{ayah.numberInSurah}</span>
                                        </span>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Tip */}
            <p className="text-muted text-center" style={{ fontSize: '0.75rem' }}>
                {t('mushaf.tapToPlay')}
            </p>

            {/* ===== Surah Picker Modal ===== */}
            {showSurahPicker && (
                <div
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                        zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                    }}
                    onClick={(e) => { if (e.target === e.currentTarget) { setShowSurahPicker(false); setSurahSearch(''); } }}
                >
                    <div
                        className="animate-slide-up"
                        style={{
                            width: '100%', maxWidth: 480, maxHeight: '80vh',
                            background: 'var(--bg)', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
                            display: 'flex', flexDirection: 'column', overflow: 'hidden',
                        }}
                    >
                        {/* Modal Header */}
                        <div className="flex items-center justify-between" style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--border)' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>اختر سورة أو آية</h3>
                            <button
                                className="btn btn-icon btn-ghost"
                                onClick={() => { setShowSurahPicker(false); setSurahSearch(''); }}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tabs: سورة | آية */}
                        <div className="flex" style={{ borderBottom: '1px solid var(--border)' }}>
                            <button
                                style={{
                                    flex: 1, padding: 'var(--space-sm)', textAlign: 'center',
                                    fontWeight: pickerTab === 'surah' ? 700 : 400,
                                    color: pickerTab === 'surah' ? 'var(--accent-gold)' : 'var(--text-muted)',
                                    borderBottom: pickerTab === 'surah' ? '2px solid var(--accent-gold)' : '2px solid transparent',
                                    transition: 'all 0.2s ease', fontSize: '0.9rem',
                                }}
                                onClick={() => setPickerTab('surah')}
                            >
                                بحث بالسورة
                            </button>
                            <button
                                style={{
                                    flex: 1, padding: 'var(--space-sm)', textAlign: 'center',
                                    fontWeight: pickerTab === 'ayah' ? 700 : 400,
                                    color: pickerTab === 'ayah' ? 'var(--accent-gold)' : 'var(--text-muted)',
                                    borderBottom: pickerTab === 'ayah' ? '2px solid var(--accent-gold)' : '2px solid transparent',
                                    transition: 'all 0.2s ease', fontSize: '0.9rem',
                                }}
                                onClick={() => setPickerTab('ayah')}
                            >
                                الذهاب لآية
                            </button>
                        </div>

                        {/* Tab Content */}
                        {pickerTab === 'surah' ? (
                            <>
                                {/* Search */}
                                <div style={{ padding: 'var(--space-md) var(--space-lg)' }}>
                                    <input
                                        className="input"
                                        placeholder="ابحث بالاسم أو الرقم..."
                                        value={surahSearch}
                                        onChange={(e) => setSurahSearch(e.target.value)}
                                        autoFocus
                                    />
                                </div>

                                {/* Surah List */}
                                <div style={{ flex: 1, overflowY: 'auto', padding: '0 var(--space-lg) var(--space-lg)' }}>
                                    <div className="flex flex-col gap-xs">
                                        {filteredSurahs.map((num) => {
                                            const isCurrentSurah = pageData?.ayahs.some(a => a.surah.number === num);
                                            return (
                                                <button
                                                    key={num}
                                                    className="card flex items-center gap-md"
                                                    style={{
                                                        padding: 'var(--space-sm) var(--space-md)',
                                                        border: isCurrentSurah ? '1.5px solid var(--accent-gold)' : undefined,
                                                        background: isCurrentSurah ? 'var(--accent-gold-soft)' : undefined,
                                                    }}
                                                    onClick={() => goToSurah(num)}
                                                >
                                                    <div style={{
                                                        width: 36, height: 36, borderRadius: 'var(--radius-md)',
                                                        background: isCurrentSurah ? 'var(--accent-gold)' : 'var(--bg-secondary)',
                                                        color: isCurrentSurah ? '#0B1C1A' : 'var(--text-muted)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontWeight: 700, fontSize: '0.8rem', flexShrink: 0,
                                                    }}>
                                                        {num}
                                                    </div>
                                                    <span style={{
                                                        flex: 1, textAlign: 'start',
                                                        fontFamily: 'var(--font-quran)', fontSize: '1.05rem',
                                                        fontWeight: isCurrentSurah ? 700 : 500,
                                                        color: isCurrentSurah ? 'var(--accent-gold)' : 'var(--text)',
                                                    }}>
                                                        {SURAH_NAMES[num]}
                                                    </span>
                                                    <span className="text-muted" style={{ fontSize: '0.75rem' }}>
                                                        ص {SURAH_PAGES[num]}
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* Ayah navigation tab */
                            <div style={{ padding: 'var(--space-lg)', display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                                <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                                    أدخل رقم السورة ورقم الآية للانتقال إليها مباشرة
                                </p>

                                {/* Surah Number */}
                                <div>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 'var(--space-xs)', display: 'block' }}>
                                        رقم السورة (1 - 114)
                                    </label>
                                    <input
                                        className="input"
                                        type="number"
                                        min={1}
                                        max={114}
                                        placeholder="مثال: 2"
                                        value={goToSurahNum}
                                        onChange={(e) => setGoToSurahNum(e.target.value)}
                                        autoFocus
                                    />
                                    {goToSurahNum && Number(goToSurahNum) >= 1 && Number(goToSurahNum) <= 114 && (
                                        <p className="text-gold" style={{ fontSize: '0.85rem', marginTop: 'var(--space-xs)', fontFamily: 'var(--font-quran)' }}>
                                            سورة {SURAH_NAMES[Number(goToSurahNum)]}
                                        </p>
                                    )}
                                </div>

                                {/* Ayah Number */}
                                <div>
                                    <label style={{ fontSize: '0.85rem', fontWeight: 600, marginBottom: 'var(--space-xs)', display: 'block' }}>
                                        رقم الآية
                                    </label>
                                    <input
                                        className="input"
                                        type="number"
                                        min={1}
                                        placeholder="مثال: 255"
                                        value={goToAyahNum}
                                        onChange={(e) => setGoToAyahNum(e.target.value)}
                                    />
                                </div>

                                {/* Go Button */}
                                <button
                                    className="btn btn-primary w-full"
                                    style={{ padding: 'var(--space-md)', fontSize: '1rem' }}
                                    disabled={!goToSurahNum || Number(goToSurahNum) < 1 || Number(goToSurahNum) > 114}
                                    onClick={() => {
                                        const sNum = Number(goToSurahNum);
                                        if (sNum >= 1 && sNum <= 114) {
                                            goToSurah(sNum);
                                            setGoToSurahNum('');
                                            setGoToAyahNum('');
                                        }
                                    }}
                                >
                                    انتقل
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
