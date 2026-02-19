import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowRight, Play, Pause, MusicNote, User } from '@phosphor-icons/react';
import { fetchReciters } from '../api/mp3quran';
import type { Reciter, Moshaf } from '../lib/types';
import { useAudioStore } from '../store/useAudioStore';

// Surah names in Arabic
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

export function ReciterDetailPage() {
    const { t, i18n } = useTranslation();
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [reciter, setReciter] = useState<Reciter | null>(null);
    const [selectedMoshaf, setSelectedMoshaf] = useState<Moshaf | null>(null);
    const [loading, setLoading] = useState(true);

    const {
        play, pause, resume,
        isPlaying, currentSurah,
        reciter: currentReciter,
    } = useAudioStore();

    useEffect(() => {
        fetchReciters(i18n.language).then((reciters) => {
            const found = reciters.find((r) => r.id === Number(id));
            if (found) {
                setReciter(found);
                // If we are already playing this reciter, sync the selected moshaf
                if (currentReciter?.id === String(found.id) && useAudioStore.getState().moshaf) {
                    const activeMoshaf = useAudioStore.getState().moshaf;
                    const matchingMoshaf = found.moshaf.find(m => m.server === activeMoshaf?.server);
                    if (matchingMoshaf) setSelectedMoshaf(matchingMoshaf);
                    else if (found.moshaf.length > 0) setSelectedMoshaf(found.moshaf[0]);
                } else {
                    if (found.moshaf.length > 0) setSelectedMoshaf(found.moshaf[0]);
                }
            }
            setLoading(false);
        }).catch(() => setLoading(false));
    }, [id, i18n.language, currentReciter]);

    const surahList = selectedMoshaf
        ? selectedMoshaf.surah_list.split(',').map(Number).filter(Boolean)
        : [];

    const handlePlay = (surahNum: number) => {
        if (!reciter || !selectedMoshaf) return;

        // Note: The Reciter type from API doesn't have an image field, but our store expects one.
        // We'll pass a placeholder or try to construct one if available later.
        // For now, passing name and id.
        const reciterInfo = {
            name: reciter.name,
            id: String(reciter.id),
        };

        const moshafInfo = {
            name: selectedMoshaf.name,
            server: selectedMoshaf.server
        };

        // If same surah is clicked, toggle play/pause
        if (currentSurah === surahNum && currentReciter?.id === String(reciter.id)) {
            if (isPlaying) pause();
            else resume();
        } else {
            play(surahNum, 1, reciterInfo, moshafInfo);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col gap-md">
                <div className="skeleton" style={{ height: 80, borderRadius: 'var(--radius-lg)' }} />
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="skeleton" style={{ height: 56, borderRadius: 'var(--radius-md)' }} />
                ))}
            </div>
        );
    }

    if (!reciter) {
        return (
            <div className="empty-state">
                <User size={48} />
                <p>القارئ غير موجود</p>
                <button className="btn btn-primary" onClick={() => navigate('/reciters')}>
                    العودة للقرّاء
                </button>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-lg">
            {/* Back + Header */}
            <button
                className="btn btn-ghost animate-fade-in"
                onClick={() => navigate('/reciters')}
                style={{ alignSelf: 'flex-start' }}
            >
                <ArrowRight size={24} weight="bold" />
                {t('common.back')}
            </button>

            {/* Reciter Info Card */}
            <div className="card-gold animate-scale-in" style={{ padding: 'var(--space-xl)', textAlign: 'center' }}>
                <div style={{
                    width: 72, height: 72, borderRadius: 'var(--radius-full)',
                    background: 'var(--accent-gold-soft)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', margin: '0 auto var(--space-md)',
                    border: '2px solid var(--accent-gold)',
                }}>
                    <User size={32} color="var(--accent-gold)" weight="duotone" />
                </div>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 'var(--space-xs)' }}>
                    {reciter.name}
                </h1>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                    {reciter.moshaf.length} رواية متاحة
                </p>
            </div>

            {/* Moshaf Selector (if multiple) */}
            {reciter.moshaf.length > 1 && (
                <div
                    className="flex items-center gap-sm animate-slide-up no-scrollbar"
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
                    {reciter.moshaf.map((m) => (
                        <button
                            key={m.id}
                            className={`chip${selectedMoshaf?.id === m.id ? ' active' : ''}`}
                            onClick={() => setSelectedMoshaf(m)}
                            style={{ flexShrink: 0 }}
                        >
                            {m.name}
                        </button>
                    ))}
                </div>
            )}

            {/* Surah Count */}
            {selectedMoshaf && (
                <p className="text-muted animate-fade-in" style={{ fontSize: '0.85rem' }}>
                    <MusicNote size={18} style={{ display: 'inline', verticalAlign: 'middle' }} weight="duotone" />
                    {' '}{selectedMoshaf.name} — {surahList.length} سورة
                </p>
            )}

            {/* Surah List */}
            <div className="flex flex-col gap-xs">
                {surahList.map((surahNum, i) => {
                    const isCurrentPlaying = currentSurah === surahNum && currentReciter?.id === String(reciter.id);
                    return (
                        <div
                            key={surahNum}
                            className={`card flex items-center gap-md animate-slide-up stagger-${Math.min(i % 6 + 1, 6)}`}
                            style={{
                                padding: 'var(--space-sm) var(--space-md)',
                                border: isCurrentPlaying ? '1.5px solid var(--accent-gold)' : undefined,
                                background: isCurrentPlaying ? 'var(--accent-gold-soft)' : undefined,
                            }}
                        >
                            {/* Number */}
                            <div style={{
                                width: 36, height: 36, borderRadius: 'var(--radius-md)',
                                background: isCurrentPlaying ? 'var(--accent-gold)' : 'var(--bg-secondary)',
                                color: isCurrentPlaying ? '#0B1C1A' : 'var(--text-muted)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontWeight: 700, fontSize: '0.8rem', flexShrink: 0,
                            }}>
                                {surahNum}
                            </div>

                            {/* Surah Name */}
                            <div style={{ flex: 1 }}>
                                <p style={{
                                    fontFamily: 'var(--font-quran)', fontSize: '1rem', fontWeight: 600,
                                    color: isCurrentPlaying ? 'var(--accent-gold)' : 'var(--text)',
                                }}>
                                    {SURAH_NAMES[surahNum] || `سورة ${surahNum}`}
                                </p>
                            </div>

                            {/* Play Button */}
                            <button
                                className={`btn btn-icon${isCurrentPlaying ? ' animate-pulse-gold' : ''}`}
                                style={{
                                    background: isCurrentPlaying ? 'var(--accent-gold)' : 'var(--bg-secondary)',
                                    color: isCurrentPlaying ? '#0B1C1A' : 'var(--text)',
                                }}
                                onClick={() => handlePlay(surahNum)}
                            >
                                {isCurrentPlaying && isPlaying ? <Pause size={20} weight="fill" /> : <Play size={20} weight="fill" />}
                            </button>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
