import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass, MusicNote, User, CaretLeft, GlobeHemisphereWest } from '@phosphor-icons/react';
import { fetchReciters } from '../api/mp3quran';
import { useRecitersStore } from '../store/useRecitersStore';

// Country code to flag emoji
const COUNTRY_FLAGS: Record<string, string> = {
    'السعودية': '🇸🇦', 'مصر': '🇪🇬', 'الجزائر': '🇩🇿', 'المغرب': '🇲🇦',
    'تونس': '🇹🇳', 'العراق': '🇮🇶', 'الكويت': '🇰🇼', 'الإمارات': '🇦🇪',
    'قطر': '🇶🇦', 'البحرين': '🇧🇭', 'عمان': '🇴🇲', 'اليمن': '🇾🇪',
    'سوريا': '🇸🇾', 'الأردن': '🇯🇴', 'فلسطين': '🇵🇸', 'لبنان': '🇱🇧',
    'ليبيا': '🇱🇾', 'السودان': '🇸🇩', 'موريتانيا': '🇲🇷', 'الصومال': '🇸🇴',
    'تركيا': '🇹🇷', 'إيران': '🇮🇷', 'ماليزيا': '🇲🇾', 'إندونيسيا': '🇮🇩',
    'باكستان': '🇵🇰', 'الهند': '🇮🇳', 'نيجيريا': '🇳🇬', 'جيبوتي': '🇩🇯',
    'Saudi Arabia': '🇸🇦', 'Egypt': '🇪🇬', 'Algeria': '🇩🇿', 'Morocco': '🇲🇦',
    'Tunisia': '🇹🇳', 'Iraq': '🇮🇶', 'Kuwait': '🇰🇼', 'UAE': '🇦🇪',
    'Qatar': '🇶🇦', 'Bahrain': '🇧🇭', 'Oman': '🇴🇲', 'Yemen': '🇾🇪',
    'Syria': '🇸🇾', 'Jordan': '🇯🇴', 'Palestine': '🇵🇸', 'Lebanon': '🇱🇧',
    'Libya': '🇱🇾', 'Sudan': '🇸🇩', 'Turkey': '🇹🇷', 'Iran': '🇮🇷',
    'Malaysia': '🇲🇾', 'Indonesia': '🇮🇩', 'Pakistan': '🇵🇰', 'India': '🇮🇳',
};

function getFlag(name: string): string | JSX.Element {
    for (const [key, flag] of Object.entries(COUNTRY_FLAGS)) {
        if (name.includes(key)) return flag;
    }
    return <GlobeHemisphereWest size={14} weight="fill" />;
}

// Generate avatar color from name
function avatarColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const colors = ['#D4AF37', '#58A89B', '#7B9EBD', '#E8A55A', '#B07D3A', '#6B7DB3', '#C66B3D'];
    return colors[Math.abs(hash) % colors.length];
}

export function RecitersPage() {
    const { t, i18n } = useTranslation();
    const {
        reciters, setReciters, searchQuery, setSearchQuery,
        riwayahFilter, setRiwayahFilter, isLoading, setLoading, error, setError,
        filteredReciters, loadedLanguage, setLoadedLanguage,
    } = useRecitersStore();

    const navigate = useNavigate();

    useEffect(() => {
        if (reciters.length === 0 || loadedLanguage !== i18n.language) {
            setLoading(true);
            fetchReciters(i18n.language)
                .then((data) => {
                    setReciters(data);
                    setLoadedLanguage(i18n.language);
                })
                .catch((err) => setError(err.message));
        }
    }, [i18n.language, loadedLanguage]);

    const displayedReciters = filteredReciters();

    // Extract unique riwayat for filter chips
    const riwayatNames = Array.from(
        new Set(
            reciters.flatMap((r) => r.moshaf.map((m) => m.name.split('-')[0]?.trim() || m.name))
        )
    ).slice(0, 8);

    return (
        <div className="flex flex-col gap-lg">
            {/* Header */}
            <div className="animate-fade-in">
                <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>
                    {t('reciters.title')}
                </h1>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                    {reciters.length > 0 && `${reciters.length}+ قارئ من مختلف الدول`}
                </p>
            </div>

            {/* Search */}
            <div className="relative animate-slide-up">
                <MagnifyingGlass
                    size={20}
                    style={{
                        position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                        right: 'var(--space-md)', color: 'var(--text-muted)',
                    }}
                />
                <input
                    className="input"
                    style={{ paddingRight: 'calc(var(--space-md) + 26px)' }}
                    placeholder={t('reciters.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Riwayah Filter Chips */}
            <div
                className="flex items-center gap-sm animate-slide-up stagger-1 no-scrollbar"
                style={{
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    paddingBottom: 'var(--space-xs)',
                    marginRight: 'calc(var(--space-md) * -1)',
                    marginLeft: 'calc(var(--space-md) * -1)',
                    paddingRight: 'var(--space-md)',
                    paddingLeft: 'var(--space-md)',
                }}
            >
                <button
                    className={`chip${!riwayahFilter ? ' active' : ''}`}
                    onClick={() => setRiwayahFilter('')}
                    style={{ flexShrink: 0 }}
                >
                    {t('reciters.allRiwayat')}
                </button>
                {riwayatNames.map((name) => (
                    <button
                        key={name}
                        className={`chip${riwayahFilter === name ? ' active' : ''}`}
                        onClick={() => setRiwayahFilter(riwayahFilter === name ? '' : name)}
                        style={{ flexShrink: 0 }}
                    >
                        {name}
                    </button>
                ))}
            </div>

            {/* Reciters List */}
            {isLoading ? (
                <div className="flex flex-col gap-md">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="card flex items-center gap-md" style={{ padding: 'var(--space-md)' }}>
                            <div className="skeleton skeleton-circle" style={{ width: 52, height: 52, flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                                <div className="skeleton skeleton-text" style={{ width: '60%' }} />
                                <div className="skeleton skeleton-text" style={{ width: '40%' }} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="empty-state">
                    <p>{error}</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setLoading(true);
                            fetchReciters(i18n.language)
                                .then((data) => {
                                    setReciters(data);
                                    setLoadedLanguage(i18n.language);
                                })
                                .catch((err) => setError(err.message));
                        }}
                    >
                        {t('common.retry')}
                    </button>
                </div>
            ) : displayedReciters.length === 0 ? (
                <div className="empty-state">
                    <User size={48} />
                    <p>{t('reciters.noResults')}</p>
                </div>
            ) : (
                <div className="flex flex-col gap-sm">
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                        {displayedReciters.length} {t('reciters.title')}
                    </span>
                    {displayedReciters.map((reciter, index) => {
                        const color = avatarColor(reciter.name);
                        const initials = reciter.name.slice(0, 2);
                        const flag = getFlag(reciter.name);

                        return (
                            <button
                                key={reciter.id}
                                className={`card flex items-center gap-md animate-slide-up stagger-${Math.min(index % 6 + 1, 6)}`}
                                style={{
                                    padding: 'var(--space-md)',
                                    textAlign: 'start',
                                }}
                                onClick={() => navigate(`/reciters/${reciter.id}`)}
                            >
                                {/* Avatar with initials */}
                                <div style={{
                                    width: 52, height: 52, borderRadius: 'var(--radius-full)',
                                    background: `${color}20`, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    position: 'relative', border: `2px solid ${color}40`,
                                }}>
                                    <span style={{ fontWeight: 700, fontSize: '1rem', color }}>{initials}</span>
                                    <span style={{
                                        position: 'absolute', bottom: -2, right: -2,
                                        fontSize: '1rem', lineHeight: 1,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: 'var(--bg-card)', borderRadius: '50%', padding: 2,
                                    }}>
                                        {flag}
                                    </span>
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{reciter.name}</p>
                                    {reciter.moshaf.length > 0 && (
                                        <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                                            {reciter.moshaf[0].name} · {t('reciters.surahCount', { count: reciter.moshaf[0].surah_total })}
                                        </p>
                                    )}
                                </div>

                                <CaretLeft size={20} color="var(--text-muted)" />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
