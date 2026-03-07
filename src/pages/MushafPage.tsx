import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CaretLeft, CaretRight, BookmarkSimple, List, X, Spinner, Play, Translate, BookOpenText, SpeakerHigh } from '@phosphor-icons/react';
import { fetchPage, fetchAllSurahs, fetchSurah, fetchAyahTafsirAndTranslation } from '../api/alquran';
import { useQuranStore } from '../store/useQuranStore';
import { useAudioStore } from '../store/useAudioStore';
import { useKhatmaStore } from '../store/useKhatmaStore';
import { audioEngine } from '../lib/audioEngine';
import type { MushafPage, Surah } from '../lib/types';

const TOTAL_PAGES = 604;

import { SURAH_PAGES, SURAH_NAMES } from '../lib/surahData';

export function MushafPage() {
    const { t } = useTranslation();
    const { currentPage, setCurrentPage, saveLastRead, toggleBookmark, isBookmarked, fontSize, fontFamily } = useQuranStore();
    const { currentAyah: playingAyah, currentSurah: playingSurah } = useAudioStore();
    const { targetDays, markPageRead } = useKhatmaStore();

    const [pageData, setPageData] = useState<MushafPage | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAyah, setSelectedAyah] = useState<number | null>(null);
    const [showSurahPicker, setShowSurahPicker] = useState(false);
    const [surahSearch, setSurahSearch] = useState('');
    const [pickerTab, setPickerTab] = useState<'surah' | 'ayah'>('surah');
    const [goToSurahNum, setGoToSurahNum] = useState('');
    const [goToAyahNum, setGoToAyahNum] = useState('');
    const [ayahNavLoading, setAyahNavLoading] = useState(false);
    const [ayahNavError, setAyahNavError] = useState('');
    const containerRef = useRef<HTMLDivElement>(null);

    const [showTafsirModal, setShowTafsirModal] = useState(false);
    const [tafsirData, setTafsirData] = useState<any>(null);
    const [tafsirLoading, setTafsirLoading] = useState(false);
    const [activeTafsirAyah, setActiveTafsirAyah] = useState<{ surah: number, ayah: number } | null>(null);
    const [activeTafsirTab, setActiveTafsirTab] = useState<string>('');
    const [isTTSPlaying, setIsTTSPlaying] = useState<boolean>(false);
    const pressTimer = useRef<NodeJS.Timeout | null>(null);
    const isLongPressing = useRef(false);
    const hasScrolled = useRef(false);

    // Auto-scroll sync with audio
    useEffect(() => {
        let isMounted = true;
        const syncPageWithAudio = async () => {
            if (playingSurah && playingAyah && pageData) {
                const isAyahOnPage = pageData.ayahs.some(
                    a => a.surah.number === playingSurah && a.numberInSurah === playingAyah
                );

                if (!isAyahOnPage) {
                    try {
                        const edition = fontFamily === 'KFGQPC' ? 'quran-simple-clean' : 'quran-uthmani';
                        const surahData = await fetchSurah(playingSurah, edition);
                        const ayah = surahData.ayahs.find((a: any) => a.numberInSurah === playingAyah);
                        if (ayah && ayah.page !== currentPage && isMounted) {
                            goToPage(ayah.page);
                        }
                    } catch (e) {
                        console.error("Failed to sync page", e);
                    }
                } else {
                    setTimeout(() => {
                        const activeEl = document.querySelector('.ayah.active');
                        if (activeEl) {
                            activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }, 100);
                }
            }
        };
        syncPageWithAudio();
        return () => { isMounted = false; };
    }, [playingSurah, playingAyah, pageData, currentPage]);

    // Touch swipe state
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const loadPage = useCallback(async (page: number) => {
        setLoading(true);
        setError(null);
        try {
            const edition = fontFamily === 'KFGQPC' ? 'quran-simple-clean' : 'quran-uthmani';
            const data = await fetchPage(page, edition);
            setPageData(data);
            if (data.ayahs.length > 0) {
                saveLastRead(page, data.ayahs[0].surah.name);
                // If a Khatma is active, mark the page as read
                if (targetDays !== null) {
                    markPageRead(page);
                }
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
            // Reversed swipe direction
            if (diff > 0) goToPage(currentPage - 1);
            else goToPage(currentPage + 1);
        }
    };

    const handleAyahPressStart = (surahNum: number, ayahNum: number) => {
        isLongPressing.current = false;
        hasScrolled.current = false;
        pressTimer.current = setTimeout(() => {
            if (!hasScrolled.current) {
                isLongPressing.current = true;
                openTafsirModal(surahNum, ayahNum);
            }
        }, 2000); // 2 seconds wait for TTS / Tafsir
    };

    const handleAyahPressEnd = (surahNum: number, ayahNum: number) => {
        if (pressTimer.current) {
            clearTimeout(pressTimer.current);
        }
        if (hasScrolled.current) {
            return;
        }
        if (!isLongPressing.current) {
            // Short click
            setSelectedAyah(ayahNum);
            audioEngine.playAyah(surahNum, ayahNum);
        }
        isLongPressing.current = false;
    };

    const openTafsirModal = async (surahNum: number, ayahNum: number) => {
        setSelectedAyah(ayahNum);
        setActiveTafsirAyah({ surah: surahNum, ayah: ayahNum });
        useQuranStore.getState().setIsModalOpen(true);
        setShowTafsirModal(true);
        setTafsirLoading(true);
        setTafsirData(null);
        setActiveTafsirTab('');
        setIsTTSPlaying(false);
        try {
            const data = await fetchAyahTafsirAndTranslation(surahNum, ayahNum);
            // Filter to only include quran text (ar.quran-uthmani), muyassar, en, fr
            const filteredData = data.filter((e: any) => e.edition.identifier !== 'quran-uthmani');
            setTafsirData(filteredData);
            if (filteredData.length > 0) {
                setActiveTafsirTab(filteredData[0].edition.identifier);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setTafsirLoading(false);
        }
    };

    const closeTafsirModal = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
        setIsTTSPlaying(false);
        setShowTafsirModal(false);
        useQuranStore.getState().setIsModalOpen(false);
    };

    const handleSpeakText = (text: string, lang: string) => {
        if ('speechSynthesis' in window) {
            if (isTTSPlaying) {
                window.speechSynthesis.cancel();
                setIsTTSPlaying(false);
                return;
            }

            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            let ttsLang = lang;
            if (lang === 'ar') ttsLang = 'ar-SA';
            else if (lang === 'en') ttsLang = 'en-US';
            else if (lang === 'fr') ttsLang = 'fr-FR';
            utterance.lang = ttsLang;

            utterance.onend = () => setIsTTSPlaying(false);
            utterance.onerror = () => setIsTTSPlaying(false);

            window.speechSynthesis.speak(utterance);
            setIsTTSPlaying(true);
        }
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
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                >
                    <CaretLeft size={22} />
                </button>
                <span className="text-muted">
                    {t('mushaf.pageOf', { current: currentPage, total: TOTAL_PAGES })}
                </span>
                <button
                    className="btn btn-ghost"
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= TOTAL_PAGES}
                >
                    <CaretRight size={22} />
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
                    <div className="mushaf-page" style={{ fontSize: `${fontSize}px`, fontFamily: fontFamily, lineHeight: 2.2 }}>
                        {Object.values(surahGroups).map((group) => (
                            <div key={group.surah.number}>
                                {group.ayahs[0].numberInSurah === 1 && (
                                    <div className="surah-header">
                                        <h3 className="text-gold glow-text" style={{ fontSize: '1.3rem' }}>
                                            {group.surah.name}
                                        </h3>
                                        {group.surah.number !== 1 && group.surah.number !== 9 && (
                                            <div className="bismillah" style={{ fontFamily: fontFamily }}>بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ</div>
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
                                            onTouchStart={() => handleAyahPressStart(ayah.surah.number, ayah.numberInSurah)}
                                            onTouchEnd={() => handleAyahPressEnd(ayah.surah.number, ayah.numberInSurah)}
                                            onTouchMove={() => {
                                                hasScrolled.current = true;
                                                if (pressTimer.current) clearTimeout(pressTimer.current);
                                            }}
                                            onMouseDown={() => handleAyahPressStart(ayah.surah.number, ayah.numberInSurah)}
                                            onMouseUp={() => handleAyahPressEnd(ayah.surah.number, ayah.numberInSurah)}
                                            onMouseLeave={() => {
                                                if (pressTimer.current) clearTimeout(pressTimer.current);
                                            }}
                                            style={{ cursor: 'pointer', userSelect: 'none' }}
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
            <p className="text-muted text-center" style={{ fontSize: '0.75rem', paddingBottom: 'var(--bottom-nav-height)' }}>
                {t('mushaf.tapToPlay')} - اضغط مطولاً للتفسير
            </p>

            {/* ===== Tafsir Modal ===== */}
            {showTafsirModal && activeTafsirAyah && (
                <div
                    style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)',
                        zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
                    }}
                    onClick={(e) => { if (e.target === e.currentTarget) closeTafsirModal(); }}
                >
                    <div
                        className="animate-slide-up"
                        style={{
                            width: '100%', maxWidth: 480, maxHeight: '80vh',
                            background: 'var(--bg)', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
                            display: 'flex', flexDirection: 'column', overflow: 'hidden',
                        }}
                    >
                        <div className="flex items-center justify-between" style={{ padding: 'var(--space-lg)', borderBottom: '1px solid var(--border)' }}>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>
                                سورة {SURAH_NAMES[activeTafsirAyah.surah]} - آية {activeTafsirAyah.ayah}
                            </h3>
                            <button
                                className="btn btn-icon btn-ghost"
                                onClick={closeTafsirModal}
                            >
                                <X size={20} />
                            </button>
                        </div>

                        {/* Tafsir/Translation Tabs */}
                        {tafsirData && tafsirData.length > 0 && (
                            <div className="flex hide-scrollbar" style={{ overflowX: 'auto', borderBottom: '1px solid var(--border)', padding: '0 var(--space-md)' }}>
                                {tafsirData.map((item: any) => (
                                    <button
                                        key={item.edition.identifier}
                                        style={{
                                            padding: 'var(--space-md)',
                                            whiteSpace: 'nowrap',
                                            fontWeight: activeTafsirTab === item.edition.identifier ? 700 : 400,
                                            color: activeTafsirTab === item.edition.identifier ? 'var(--accent-gold)' : 'var(--text-muted)',
                                            borderBottom: activeTafsirTab === item.edition.identifier ? '2px solid var(--accent-gold)' : '2px solid transparent',
                                            transition: 'all 0.2s ease',
                                        }}
                                        onClick={() => {
                                            setActiveTafsirTab(item.edition.identifier);
                                            if ('speechSynthesis' in window) {
                                                window.speechSynthesis.cancel();
                                                setIsTTSPlaying(false);
                                            }
                                        }}
                                    >
                                        {item.edition.name}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Tafsir Content */}
                        <div style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-lg)', maxHeight: 'calc(80vh - 140px)' }}>
                            {tafsirLoading ? (
                                <div className="flex flex-col items-center justify-center gap-md" style={{ padding: '2rem' }}>
                                    <Spinner size={32} className="animate-spin text-gold" />
                                    <p className="text-muted">جاري تحميل التفسير...</p>
                                </div>
                            ) : tafsirData ? (
                                <div className="flex flex-col gap-lg">
                                    {tafsirData.filter((e: any) => e.edition.identifier === activeTafsirTab).map((edition: any) => (
                                        <div key={edition.edition.identifier} className="card" style={{ padding: 'var(--space-md)' }}>
                                            <div className="flex items-center justify-between mb-sm">
                                                <div className="flex items-center gap-sm">
                                                    {edition.edition.type === 'tafsir' ? (
                                                        <BookOpenText size={20} className="text-gold" />
                                                    ) : (
                                                        <Translate size={20} className="text-gold" />
                                                    )}
                                                    <h4 style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                                                        {edition.edition.name}
                                                    </h4>
                                                </div>
                                                <button
                                                    className="btn btn-icon btn-ghost"
                                                    style={{ color: isTTSPlaying ? 'var(--error)' : 'var(--accent-gold)' }}
                                                    onClick={() => handleSpeakText(edition.text, edition.edition.language)}
                                                    title={isTTSPlaying ? "إيقاف الصوت" : "استمع للنص"}
                                                >
                                                    <SpeakerHigh size={22} weight={isTTSPlaying ? "fill" : "duotone"} className={isTTSPlaying ? "animate-pulse" : ""} />
                                                </button>
                                            </div>
                                            <p style={{
                                                fontSize: edition.edition.language === 'ar' ? '1.05rem' : '0.9rem',
                                                lineHeight: 1.8,
                                                color: 'var(--text-secondary)',
                                                direction: edition.edition.language === 'ar' ? 'rtl' : 'ltr',
                                                textAlign: edition.edition.language === 'ar' ? 'right' : 'left'
                                            }}>
                                                {edition.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted">عذراً، لم نتمكن من جلب التفسير</p>
                            )}
                        </div>
                    </div>
                </div>
            )}

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
                                        onChange={(e) => { setGoToSurahNum(e.target.value); setAyahNavError(''); }}
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
                                        رقم الآية (اختياري)
                                    </label>
                                    <input
                                        className="input"
                                        type="number"
                                        min={1}
                                        placeholder="مثال: 255"
                                        value={goToAyahNum}
                                        onChange={(e) => { setGoToAyahNum(e.target.value); setAyahNavError(''); }}
                                    />
                                </div>

                                {/* Error Message */}
                                {ayahNavError && (
                                    <p style={{ fontSize: '0.82rem', color: '#EF4444', textAlign: 'center' }}>
                                        {ayahNavError}
                                    </p>
                                )}

                                {/* Go Button */}
                                <button
                                    className="btn btn-primary w-full"
                                    style={{ padding: 'var(--space-md)', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                                    disabled={!goToSurahNum || Number(goToSurahNum) < 1 || Number(goToSurahNum) > 114 || ayahNavLoading}
                                    onClick={async () => {
                                        const sNum = Number(goToSurahNum);
                                        const aNum = Number(goToAyahNum);
                                        if (sNum < 1 || sNum > 114) return;

                                        // If no ayah specified, just go to surah start
                                        if (!goToAyahNum || aNum < 1) {
                                            goToSurah(sNum);
                                            setGoToSurahNum('');
                                            setGoToAyahNum('');
                                            setAyahNavError('');
                                            return;
                                        }

                                        // Fetch surah to find exact ayah page
                                        try {
                                            setAyahNavLoading(true);
                                            setAyahNavError('');
                                            const edition = fontFamily === 'KFGQPC' ? 'quran-simple-clean' : 'quran-uthmani';
                                            const surahData = await fetchSurah(sNum, edition);
                                            const ayah = surahData.ayahs.find((a: any) => a.numberInSurah === aNum);
                                            if (ayah) {
                                                goToPage(ayah.page);
                                                setShowSurahPicker(false);
                                                setGoToSurahNum('');
                                                setGoToAyahNum('');
                                            } else {
                                                setAyahNavError(`الآية ${aNum} غير موجودة في هذه السورة`);
                                            }
                                        } catch (err) {
                                            // Fallback: go to surah start page
                                            goToSurah(sNum);
                                            setGoToSurahNum('');
                                            setGoToAyahNum('');
                                        } finally {
                                            setAyahNavLoading(false);
                                        }
                                    }}
                                >
                                    {ayahNavLoading ? (
                                        <><Spinner size={18} className="animate-spin" /> جاري البحث...</>
                                    ) : (
                                        'انتقل'
                                    )}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
