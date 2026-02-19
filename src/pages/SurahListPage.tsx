import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { fetchAllSurahs } from '../api/alquran';
import { useQuranStore } from '../store/useQuranStore';
import type { Surah } from '../lib/types';

export function SurahListPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { setCurrentPage } = useQuranStore();

    const [surahs, setSurahs] = useState<Surah[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'Meccan' | 'Medinan'>('all');

    useEffect(() => {
        fetchAllSurahs()
            .then(setSurahs)
            .catch(() => { })
            .finally(() => setLoading(false));
    }, []);

    const filteredSurahs = filter === 'all' ? surahs : surahs.filter((s) => s.revelationType === filter);

    const openSurah = (surah: Surah) => {
        // Navigate to Mushaf (simple approach - go to page 1 for now)
        setCurrentPage(1);
        navigate('/mushaf');
    };

    return (
        <div className="flex flex-col gap-lg">
            {/* Header */}
            <div className="animate-fade-in">
                <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>
                    {t('surahList.title')}
                </h1>
            </div>

            {/* Filter Chips */}
            <div className="flex gap-sm animate-slide-up">
                {(['all', 'Meccan', 'Medinan'] as const).map((f) => (
                    <button
                        key={f}
                        className={`chip${filter === f ? ' active' : ''}`}
                        onClick={() => setFilter(f)}
                    >
                        {f === 'all' ? t('reciters.allRiwayat').replace('الروايات', 'السور') :
                            f === 'Meccan' ? t('surahList.meccan') : t('surahList.medinan')}
                    </button>
                ))}
            </div>

            {/* Surah List */}
            {loading ? (
                <div className="flex flex-col gap-sm">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="card flex items-center gap-md" style={{ padding: 'var(--space-md)' }}>
                            <div className="skeleton" style={{ width: 40, height: 40, borderRadius: 'var(--radius-md)' }} />
                            <div style={{ flex: 1 }}>
                                <div className="skeleton skeleton-text" style={{ width: '50%' }} />
                                <div className="skeleton skeleton-text" style={{ width: '70%' }} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-xs">
                    {filteredSurahs.map((surah, i) => (
                        <button
                            key={surah.number}
                            className={`card flex items-center gap-md animate-slide-up stagger-${Math.min(i % 6 + 1, 6)}`}
                            style={{ padding: 'var(--space-sm) var(--space-md)', textAlign: 'start' }}
                            onClick={() => openSurah(surah)}
                        >
                            {/* Number badge */}
                            <div style={{
                                width: 40, height: 40, borderRadius: 'var(--radius-md)',
                                background: 'var(--accent-gold-soft)', display: 'flex',
                                alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                color: 'var(--accent-gold)', fontWeight: 700, fontSize: '0.85rem',
                            }}>
                                {surah.number}
                            </div>

                            {/* Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                                <p style={{ fontWeight: 600, fontSize: '1rem', fontFamily: 'var(--font-quran)' }}>
                                    {surah.name}
                                </p>
                                <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                                    {surah.englishName} · {surah.englishNameTranslation}
                                </p>
                            </div>

                            {/* Meta */}
                            <div style={{ textAlign: 'end', flexShrink: 0 }}>
                                <p className="text-muted" style={{ fontSize: '0.75rem' }}>
                                    {t('surahList.ayahs', { count: surah.numberOfAyahs })}
                                </p>
                                <p style={{
                                    fontSize: '0.7rem',
                                    color: surah.revelationType === 'Meccan' ? 'var(--accent-gold)' : '#58A89B',
                                }}>
                                    {surah.revelationType === 'Meccan' ? t('surahList.meccan') : t('surahList.medinan')}
                                </p>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
