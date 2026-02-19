import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Pause, SkipForward, SkipBack, X, SpeakerHigh, DownloadSimple, Clock, Repeat, RepeatOnce } from '@phosphor-icons/react';
import { useAudioStore } from '../../store/useAudioStore';
import { audioEngine } from '../../lib/audioEngine';
import { getAyahAudioUrl, DEFAULT_RECITER_FOLDER } from '../../api/everyayah';

// Surah names in Arabic (Duplicate from ReciterDetailPage - should be in a shared constant file)
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

export function AudioPlayer() {
    const { t } = useTranslation();
    const {
        isPlaying, type, currentSurah, currentAyah, reciter, moshaf, radioStation,
        pause, resume, stop, next, prev,
        progress, duration, playbackRate, repeatMode,
        setPlaybackRate, setRepeatMode
    } = useAudioStore();

    // Handle Play/Pause toggle
    const togglePlay = () => {
        audioEngine.togglePlayPause();
    };

    // Handle Progress Seek
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newProgress = Number(e.target.value);
        if (duration) {
            const newTime = (newProgress / 100) * duration;
            audioEngine.seek(newTime);
        }
    };

    const cyclePlaybackRate = () => {
        const rates = [1, 1.25, 1.5, 2];
        const currentIndex = rates.indexOf(playbackRate);
        const nextIndex = (currentIndex + 1) % rates.length;
        audioEngine.setPlaybackRate(rates[nextIndex]);
    };

    const cycleRepeatMode = () => {
        const modes: ('none' | 'ayah' | 'surah')[] = ['none', 'ayah', 'surah'];
        const currentIndex = modes.indexOf(repeatMode);
        const nextIndex = (currentIndex + 1) % modes.length;
        setRepeatMode(modes[nextIndex]);
    };

    // Download Feature for Audio File
    const handleDownloadAudio = async () => {
        if (!currentSurah || isRadio) return;

        let url = '';
        let filename = '';

        if (currentAyah) {
            const reciterFolder = reciter?.id || DEFAULT_RECITER_FOLDER;
            url = getAyahAudioUrl(reciterFolder, currentSurah, currentAyah);
            filename = `rawq-surah-${currentSurah}-ayah-${currentAyah}.mp3`;
        } else if (moshaf) {
            const paddedSurah = String(currentSurah).padStart(3, '0');
            url = `${moshaf.server}${paddedSurah}.mp3`;
            filename = `rawq-surah-${currentSurah}.mp3`;
        }

        if (url) {
            try {
                const response = await fetch(url);
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
            } catch (error) {
                console.error("Download failed, opening in new tab:", error);
                window.open(url, '_blank');
            }
        }
    };

    // Show if there is a surah playing OR a radio station playing
    if (!currentSurah && !radioStation) return null;

    const isRadio = type === 'radio' && !!radioStation;

    let title = '';
    let subtitle = '';
    let image = '';

    if (isRadio) {
        title = radioStation.name;
        subtitle = 'إذاعة راديو';
        image = ''; // Radios don't have images in current schema, use default icon
    } else if (currentSurah) {
        title = `${SURAH_NAMES[currentSurah] || `سورة ${currentSurah}`} ${currentAyah ? ` - آية ${currentAyah}` : ''}`;
        subtitle = reciter?.name || 'القارئ';
        image = reciter?.image || '';
    }

    const progressPercent = duration && duration > 0 ? (progress / duration) * 100 : 0;

    return (
        <div
            style={{
                position: 'fixed',
                left: 0,
                right: 0,
                zIndex: 100,
                bottom: 0,
                padding: '0',
                animation: 'slideUp var(--transition-base) ease'
            }}
        >
            <style>{`
                .player-container {
                    display: grid;
                    grid-template-columns: 1fr auto 1fr;
                    align-items: center;
                    gap: var(--space-md);
                    width: 100%;
                }
                .player-info {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                    min-width: 0;
                }
                .player-controls-main {
                    display: flex;
                    align-items: center;
                    gap: var(--space-md);
                    justify-content: center;
                }
                .player-controls-secondary {
                    display: flex;
                    align-items: center;
                    gap: var(--space-sm);
                    justify-content: flex-end;
                }
                @media (max-width: 768px) {
                    .player-container {
                        display: flex;
                        justify-content: space-between;
                    }
                    .player-controls-secondary .hide-mobile {
                        display: none !important;
                    }
                    .player-controls-main {
                        gap: var(--space-sm);
                    }
                }
            `}</style>
            <div
                id="audio-player-card"
                className="glass"
                style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 'var(--space-md) var(--space-lg)',
                    paddingBottom: 'calc(var(--space-md) + env(safe-area-inset-bottom, 0px))',
                    border: 'none',
                    borderTop: '1px solid var(--border)',
                    borderRadius: 0,
                    backdropFilter: 'blur(20px)',
                    background: 'var(--bg)',
                    boxShadow: 'var(--shadow-lg)',
                    minHeight: 'calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px))'
                }}
            >
                {/* Progress Bar (Top) */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '3px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            height: '100%',
                            backgroundColor: 'var(--accent-gold)',
                            width: `${progressPercent}%`,
                            transition: 'width 300ms linear'
                        }}
                    />
                </div>

                <div className="player-container">
                    {/* 1. Reciter Info */}
                    <div className="player-info">
                        <div
                            style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--bg-tertiary)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0,
                                border: '1px solid var(--border)',
                                backgroundImage: image ? `url(${image})` : undefined,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }}
                        >
                            {!image && <SpeakerHigh size={20} weight="fill" style={{ color: 'var(--text-muted)' }} />}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                            <span
                                className="font-quran"
                                style={{
                                    fontSize: '0.9rem',
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    color: 'var(--accent-gold)',
                                    lineHeight: 1.2
                                }}
                            >
                                {title}
                            </span>
                            <span
                                className="font-ui"
                                style={{
                                    fontSize: '0.75rem',
                                    color: 'var(--text-muted)',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis'
                                }}
                            >
                                {subtitle}
                            </span>
                        </div>
                    </div>

                    {/* 2. Main Controls - LTR enforced for Next/Prev buttons */}
                    <div className="player-controls-main" dir="ltr">
                        {!isRadio && (
                            <button onClick={prev} style={{ padding: '8px', color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                                <SkipBack size={24} weight="fill" />
                            </button>
                        )}

                        <button
                            onClick={togglePlay}
                            style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--accent-gold)',
                                color: '#0B1C1A',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: 'var(--shadow-gold)',
                                flexShrink: 0,
                                margin: '0 4px',
                                border: 'none',
                                cursor: 'pointer',
                                transition: 'transform 0.2s'
                            }}
                        >
                            {isPlaying ? <Pause size={22} weight="fill" /> : <Play size={22} weight="fill" />}
                        </button>

                        {!isRadio && (
                            <button onClick={next} style={{ padding: '8px', color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                                <SkipForward size={24} weight="fill" />
                            </button>
                        )}
                    </div>

                    {/* 3. Secondary Controls */}
                    <div className="player-controls-secondary">
                        {!isRadio && (
                            <button
                                onClick={cyclePlaybackRate}
                                className="hide-mobile"
                                title="سرعة التشغيل"
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.8rem',
                                    fontWeight: 600,
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: playbackRate !== 1 ? 'var(--accent-gold)' : 'var(--text-muted)',
                                    backgroundColor: playbackRate !== 1 ? 'var(--accent-gold-soft)' : 'transparent'
                                }}
                            >
                                <Clock size={16} />
                                {playbackRate}x
                            </button>
                        )}

                        {!isRadio && (
                            <button
                                onClick={cycleRepeatMode}
                                className="hide-mobile"
                                title={repeatMode === 'none' ? 'بدون تكرار' : repeatMode === 'ayah' ? 'تكرار الآية' : 'تكرار السورة'}
                                style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: repeatMode !== 'none' ? 'var(--accent-gold)' : 'var(--text-muted)',
                                    backgroundColor: repeatMode !== 'none' ? 'var(--accent-gold-soft)' : 'transparent'
                                }}
                            >
                                {repeatMode === 'ayah' ? <RepeatOnce size={20} /> : <Repeat size={20} />}
                            </button>
                        )}

                        {!isRadio && (
                            <button
                                onClick={handleDownloadAudio}
                                title="تحميل الصوت"
                                style={{ padding: '8px', color: 'var(--text-muted)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                            >
                                <DownloadSimple size={22} />
                            </button>
                        )}

                        <button
                            onClick={() => audioEngine.stop()}
                            style={{ padding: '8px', color: 'var(--text-muted)', marginRight: 'var(--space-sm)', background: 'transparent', border: 'none', cursor: 'pointer' }}
                        >
                            <X size={20} weight="bold" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
