import { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass, BookOpenText, ArrowLeft, Spinner } from '@phosphor-icons/react';
import { searchQuran, fetchSurah } from '../api/alquran';
import { useQuranStore } from '../store/useQuranStore';
import { SURAH_PAGES } from '../lib/surahData';
import type { SearchMatch } from '../lib/types';

// ========================
// Arabic Text Normalization
// ========================
function normalizeArabic(text: string): string {
    return text
        // Remove tashkeel (diacritics)
        .replace(/[\u064B-\u0652\u0670\u0640]/g, '')
        // Normalize alef variants to plain alef
        .replace(/[إأآٱ]/g, 'ا')
        // Normalize taa marbuta to haa
        .replace(/ة/g, 'ه')
        // Normalize alef maqsura to yaa
        .replace(/ى/g, 'ي')
        // Remove tatweel (kashida)
        .replace(/ـ/g, '')
        .trim();
}

export function SearchPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { setCurrentPage, fontFamily } = useQuranStore();

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchMatch[]>([]);
    const [resultCount, setResultCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [navigating, setNavigating] = useState<string | null>(null);
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const doSearch = useCallback(async (keyword: string) => {
        if (!keyword.trim()) {
            setResults([]);
            setResultCount(0);
            setSearched(false);
            return;
        }

        setLoading(true);
        setSearched(true);

        try {
            // Normalize the query for better Arabic matching
            const normalized = normalizeArabic(keyword.trim());
            const edition = fontFamily === 'KFGQPC' ? 'quran-simple-clean' : 'quran-uthmani';

            // Try the original query first
            let data = await searchQuran(keyword.trim(), edition);

            // If no results, try with normalized text
            if (data.count === 0 && normalized !== keyword.trim()) {
                data = await searchQuran(normalized, edition);
            }

            // Sort results: exact matches first, then by surah order
            const sorted = [...data.matches].sort((a, b) => {
                const aText = normalizeArabic(a.text);
                const bText = normalizeArabic(b.text);
                const normQuery = normalizeArabic(keyword.trim());

                // Exact word match gets priority
                const aExact = aText.includes(normQuery);
                const bExact = bText.includes(normQuery);
                if (aExact && !bExact) return -1;
                if (!aExact && bExact) return 1;

                // Then sort by surah order
                if (a.surah.number !== b.surah.number) return a.surah.number - b.surah.number;
                return a.numberInSurah - b.numberInSurah;
            });

            setResults(sorted.slice(0, 80));
            setResultCount(data.count);
        } catch {
            setResults([]);
            setResultCount(0);
        } finally {
            setLoading(false);
        }
    }, [fontFamily]);

    const handleInput = (value: string) => {
        setQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => doSearch(value), 500);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (debounceRef.current) clearTimeout(debounceRef.current);
        doSearch(query);
    };

    // Highlight keyword in text — handles diacritics
    const highlightText = (text: string, keyword: string) => {
        if (!keyword.trim()) return text;

        const normKeyword = normalizeArabic(keyword.trim());
        const normText = normalizeArabic(text);

        // Find the position in normalized text
        const idx = normText.indexOf(normKeyword);
        if (idx === -1) return text;

        // Map normalized index back to original text
        let origStart = 0;
        let normCount = 0;
        for (let i = 0; i < text.length; i++) {
            if (normCount === idx) { origStart = i; break; }
            if (normalizeArabic(text[i]) !== '') normCount++;
        }

        let origEnd = origStart;
        let matchCount = 0;
        for (let i = origStart; i < text.length; i++) {
            if (normalizeArabic(text[i]) !== '') matchCount++;
            if (matchCount >= normKeyword.length) { origEnd = i + 1; break; }
        }

        const before = text.slice(0, origStart);
        const match = text.slice(origStart, origEnd);
        const after = text.slice(origEnd);

        return (
            <>
                {before}
                <mark
                    style={{
                        background: 'var(--accent-gold-soft)',
                        color: 'var(--accent-gold)',
                        padding: '1px 3px',
                        borderRadius: '4px',
                        fontWeight: 700,
                        borderBottom: '2px solid var(--accent-gold)',
                    }}
                >
                    {match}
                </mark>
                {after}
            </>
        );
    };

    // Navigate to the EXACT page of the ayah
    const goToAyah = async (match: SearchMatch) => {
        const matchId = `${match.surah.number}-${match.numberInSurah}`;
        setNavigating(matchId);

        try {
            // Fetch surah data to get exact page
            const edition = fontFamily === 'KFGQPC' ? 'quran-simple-clean' : 'quran-uthmani';
            const surahData = await fetchSurah(match.surah.number, edition);
            const ayah = surahData.ayahs.find((a: any) => a.numberInSurah === match.numberInSurah);

            if (ayah?.page) {
                setCurrentPage(ayah.page);
            } else {
                // Fallback to surah start
                setCurrentPage(SURAH_PAGES[match.surah.number] || 1);
            }
            navigate('/mushaf');
        } catch {
            // Fallback
            setCurrentPage(SURAH_PAGES[match.surah.number] || 1);
            navigate('/mushaf');
        } finally {
            setNavigating(null);
        }
    };

    return (
        <div className="flex flex-col gap-lg">
            {/* Header */}
            <div className="animate-fade-in">
                <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-xs)' }}>
                    {t('search.title')}
                </h1>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                    {t('search.hint')}
                </p>
            </div>

            {/* Search Input */}
            <form onSubmit={handleSubmit} className="relative animate-slide-up">
                <MagnifyingGlass
                    size={20}
                    style={{
                        position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                        right: '14px', color: 'var(--text-muted)', pointerEvents: 'none',
                    }}
                />
                <input
                    className="input"
                    style={{
                        width: '100%',
                        fontSize: '1rem',
                        padding: 'var(--space-md)',
                        paddingRight: '44px',
                    }}
                    placeholder={t('search.placeholder')}
                    value={query}
                    onChange={(e) => handleInput(e.target.value)}
                    dir="rtl"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck={false}
                />
            </form>

            {/* Loading */}
            {loading && (
                <div className="flex flex-col gap-sm">
                    <div style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '8px', padding: 'var(--space-lg)',
                        color: 'var(--text-muted)', fontSize: '0.9rem',
                    }}>
                        <Spinner size={20} className="animate-spin" />
                        <span>{t('search.searching')}</span>
                    </div>
                    {Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="card" style={{ padding: 'var(--space-md)' }}>
                            <div className="skeleton skeleton-text" style={{ width: '60%' }} />
                            <div className="skeleton skeleton-text" style={{ width: '100%' }} />
                            <div className="skeleton skeleton-text" style={{ width: '40%' }} />
                        </div>
                    ))}
                </div>
            )}

            {/* Results Count */}
            {searched && !loading && (
                <div className="flex items-center justify-between">
                    <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                        {t('search.results', { count: resultCount })}
                    </p>
                    {resultCount > 80 && (
                        <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                            عرض أول 80 نتيجة
                        </p>
                    )}
                </div>
            )}

            {/* Results */}
            {!loading && results.length > 0 && (
                <div className="flex flex-col gap-sm">
                    {results.map((match, i) => {
                        const matchId = `${match.surah.number}-${match.numberInSurah}`;
                        const isNavigating = navigating === matchId;
                        return (
                            <button
                                key={`${matchId}-${i}`}
                                className={`card animate-slide-up stagger-${Math.min(i % 6 + 1, 6)}`}
                                style={{
                                    textAlign: 'start', padding: 'var(--space-md)',
                                    opacity: isNavigating ? 0.6 : 1,
                                    transition: 'opacity 0.2s ease',
                                }}
                                onClick={() => goToAyah(match)}
                                disabled={isNavigating}
                            >
                                {/* Surah + Ayah badge */}
                                <div className="flex items-center justify-between" style={{ marginBottom: 'var(--space-sm)' }}>
                                    <div className="flex items-center gap-sm">
                                        <BookOpenText size={18} color="var(--accent-gold)" weight="duotone" />
                                        <span className="text-gold" style={{ fontSize: '0.82rem', fontWeight: 600 }}>
                                            {match.surah.name}
                                        </span>
                                    </div>
                                    <span style={{
                                        fontSize: '0.72rem', fontWeight: 700,
                                        color: 'var(--accent-gold)',
                                        background: 'var(--accent-gold-soft)',
                                        padding: '2px 8px',
                                        borderRadius: 'var(--radius-full)',
                                    }}>
                                        الآية {match.numberInSurah}
                                    </span>
                                </div>
                                {/* Ayah text with highlight */}
                                <p
                                    style={{
                                        fontSize: '1.05rem', lineHeight: 2.2,
                                        fontFamily: 'var(--font-quran)',
                                    }}
                                    dir="rtl"
                                >
                                    {highlightText(match.text, query)}
                                </p>
                                {/* Navigation indicator */}
                                {isNavigating && (
                                    <div style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        gap: '6px', marginTop: '6px',
                                        fontSize: '0.75rem', color: 'var(--accent-gold)',
                                    }}>
                                        <Spinner size={14} className="animate-spin" />
                                        <span>جاري الانتقال...</span>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}

            {/* No Results */}
            {searched && !loading && results.length === 0 && (
                <div className="empty-state">
                    <MagnifyingGlass size={48} />
                    <p>{t('search.noResults')}</p>
                    <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '4px' }}>
                        جرّب البحث بكلمة مختلفة أو بدون تشكيل
                    </p>
                </div>
            )}

            {/* Initial State */}
            {!searched && !loading && (
                <div className="empty-state" style={{ opacity: 0.5 }}>
                    <MagnifyingGlass size={64} />
                    <p>{t('search.hint')}</p>
                </div>
            )}
        </div>
    );
}
