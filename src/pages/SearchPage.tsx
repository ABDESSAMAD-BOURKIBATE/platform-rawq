import { useState, useCallback, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass, BookOpenText } from '@phosphor-icons/react';
import { searchQuran } from '../api/alquran';
import type { SearchMatch } from '../lib/types';

export function SearchPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchMatch[]>([]);
    const [resultCount, setResultCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
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
            const data = await searchQuran(keyword.trim());
            setResults(data.matches.slice(0, 50));
            setResultCount(data.count);
        } catch {
            setResults([]);
            setResultCount(0);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleInput = (value: string) => {
        setQuery(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => doSearch(value), 600);
    };

    // Highlight keyword in text
    const highlightText = (text: string, keyword: string) => {
        if (!keyword.trim()) return text;
        const parts = text.split(new RegExp(`(${keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
        return parts.map((part, i) =>
            part.toLowerCase() === keyword.toLowerCase() ? (
                <mark
                    key={i}
                    style={{
                        background: 'var(--accent-gold-soft)',
                        color: 'var(--accent-gold)',
                        padding: '0 2px',
                        borderRadius: '3px',
                        fontWeight: 600,
                    }}
                >
                    {part}
                </mark>
            ) : (
                part
            )
        );
    };

    const goToAyah = (match: SearchMatch) => {
        navigate('/mushaf');
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
            <div className="relative animate-slide-up">
                <MagnifyingGlass
                    size={22}
                    style={{
                        position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                        right: 'var(--space-md)', color: 'var(--text-muted)',
                    }}
                />
                <input
                    className="input"
                    style={{
                        paddingRight: 'calc(var(--space-md) + 26px)',
                        fontSize: '1rem',
                        padding: 'var(--space-md)',
                    }}
                    placeholder={t('search.placeholder')}
                    value={query}
                    onChange={(e) => handleInput(e.target.value)}
                    dir="rtl"
                />
            </div>

            {/* Loading */}
            {loading && (
                <div className="flex flex-col gap-sm">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div key={i} className="card" style={{ padding: 'var(--space-md)' }}>
                            <div className="skeleton skeleton-text" style={{ width: '70%' }} />
                            <div className="skeleton skeleton-text" style={{ width: '100%' }} />
                            <div className="skeleton skeleton-text" style={{ width: '50%' }} />
                        </div>
                    ))}
                </div>
            )}

            {/* Results Count */}
            {searched && !loading && (
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                    {t('search.results', { count: resultCount })}
                </p>
            )}

            {/* Results */}
            {!loading && results.length > 0 && (
                <div className="flex flex-col gap-sm">
                    {results.map((match, i) => (
                        <button
                            key={`${match.surah.number}-${match.numberInSurah}-${i}`}
                            className={`card animate-slide-up stagger-${Math.min(i % 6 + 1, 6)}`}
                            style={{ textAlign: 'start', padding: 'var(--space-md)' }}
                            onClick={() => goToAyah(match)}
                        >
                            {/* Surah + Ayah badge */}
                            <div className="flex items-center gap-sm" style={{ marginBottom: 'var(--space-sm)' }}>
                                <BookOpenText size={18} color="var(--accent-gold)" weight="duotone" />
                                <span className="text-gold" style={{ fontSize: '0.8rem', fontWeight: 600 }}>
                                    {match.surah.name} — {match.numberInSurah}
                                </span>
                            </div>
                            {/* Ayah text with highlight */}
                            <p
                                className="font-quran"
                                style={{ fontSize: '1.1rem', lineHeight: 2 }}
                                dir="rtl"
                            >
                                {highlightText(match.text, query)}
                            </p>
                        </button>
                    ))}
                </div>
            )}

            {/* No Results */}
            {searched && !loading && results.length === 0 && (
                <div className="empty-state">
                    <MagnifyingGlass size={48} />
                    <p>{t('search.noResults')}</p>
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
