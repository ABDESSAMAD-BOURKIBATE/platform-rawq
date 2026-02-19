import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Play, Pause, SkipForward, SkipBack, X, SpeakerHigh, DownloadSimple } from '@phosphor-icons/react';
import { useAudioStore } from '../../store/useAudioStore';
import { toPng } from 'html-to-image';

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
        isPlaying, currentSurah, reciter, moshaf,
        pause, resume, stop, next, prev,
        progress, setProgress, duration, setDuration
    } = useAudioStore();

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [currentTime, setCurrentTime] = useState(0);

    // Audio Playback Logic
    useEffect(() => {
        if (!currentSurah || !moshaf) return;

        const paddedSurah = String(currentSurah).padStart(3, '0');
        const url = `${moshaf.server}${paddedSurah}.mp3`;

        if (audioRef.current) {
            if (audioRef.current.src !== url) {
                audioRef.current.src = url;
                audioRef.current.load();
            }
        } else {
            audioRef.current = new Audio(url);
        }

        const audio = audioRef.current;

        const onTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
            setProgress((audio.currentTime / audio.duration) * 100);
        };

        const onLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        const onEnded = () => {
            next(); // Auto-play next surah
        };

        audio.addEventListener('timeupdate', onTimeUpdate);
        audio.addEventListener('loadedmetadata', onLoadedMetadata);
        audio.addEventListener('ended', onEnded);

        if (isPlaying) {
            audio.play().catch(e => console.error("Playback failed", e));
        } else {
            audio.pause();
        }

        return () => {
            audio.removeEventListener('timeupdate', onTimeUpdate);
            audio.removeEventListener('loadedmetadata', onLoadedMetadata);
            audio.removeEventListener('ended', onEnded);
        };
    }, [currentSurah, moshaf, isPlaying, next, setProgress, setDuration]);


    // Handle Play/Pause toggle
    const togglePlay = () => {
        if (isPlaying) {
            pause();
            audioRef.current?.pause();
        } else {
            resume();
            audioRef.current?.play();
        }
    };

    // Handle Progress Seek
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newProgress = Number(e.target.value);
        if (audioRef.current && duration) {
            const newTime = (newProgress / 100) * duration;
            audioRef.current.currentTime = newTime;
            setProgress(newProgress);
        }
    };

    // Download Feature for Player Card
    const handleDownloadCard = async () => {
        const element = document.getElementById('audio-player-card');
        if (element) {
            try {
                const dataUrl = await toPng(element, { cacheBust: true, pixelRatio: 2 });
                const link = document.createElement('a');
                link.download = `rawq-player-${currentSurah}.png`;
                link.href = dataUrl;
                link.click();
            } catch (e) {
                console.error("Download failed", e);
            }
        }
    };

    if (!currentSurah || !moshaf) return null;

    const surahName = SURAH_NAMES[currentSurah] || `سورة ${currentSurah}`;
    const reciterName = reciter?.name || 'القارئ';

    return (
        <div
            className="fixed bottom-[var(--bottom-nav-height)] left-0 right-0 z-50 p-sm"
            style={{
                bottom: 'calc(var(--bottom-nav-height) + var(--space-xs))',
                padding: '0 var(--space-md)'
            }}
        >
            <div
                id="audio-player-card"
                className="glass relative flex items-center justify-between p-sm md:p-md gap-md shadow-lg"
                style={{
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border)',
                    backdropFilter: 'blur(20px)',
                    background: 'var(--bg-card)'
                }}
            >
                {/* Progress Bar (Top) */}
                <div
                    className="absolute top-0 left-0 right-0 h-1 bg-gray-700/30 overflow-hidden rounded-t-lg"
                    style={{ height: '3px' }}
                >
                    <div
                        className="h-full bg-[var(--accent-gold)] transition-all duration-300 ease-linear"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                {/* Reciter Info */}
                <div className="flex items-center gap-sm flex-1 min-w-0">
                    <div
                        className="w-10 h-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center shrink-0 border border-[var(--border)]"
                        style={{
                            backgroundImage: reciter?.image ? `url(${reciter.image})` : undefined,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center'
                        }}
                    >
                        {!reciter?.image && <SpeakerHigh size={20} weight="fill" className="text-[var(--text-muted)]" />}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-bold truncate text-[var(--accent-gold)] font-quran leading-tight">
                            {surahName}
                        </span>
                        <span className="text-xs text-[var(--text-muted)] truncate font-ui">
                            {reciterName}
                        </span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-xs md:gap-sm shrink-0">
                    {/* Download Button */}
                    <button
                        onClick={handleDownloadCard}
                        className="p-2 text-[var(--text-muted)] hover:text-[var(--text)] transition-colors"
                        title="تحميل بطاقة المشغل"
                    >
                        <DownloadSimple size={20} />
                    </button>

                    <button onClick={prev} className="p-2 text-[var(--text-secondary)] hover:text-[var(--text)]">
                        <SkipBack size={20} weight="fill" />
                    </button>

                    <button
                        onClick={togglePlay}
                        className="w-10 h-10 rounded-full bg-[var(--accent-gold)] text-[#0B1C1A] flex items-center justify-center shadow-gold hover:scale-105 transition-transform"
                    >
                        {isPlaying ? <Pause size={20} weight="fill" /> : <Play size={20} weight="fill" />}
                    </button>

                    <button onClick={next} className="p-2 text-[var(--text-secondary)] hover:text-[var(--text)]">
                        <SkipForward size={20} weight="fill" />
                    </button>

                    <button onClick={stop} className="p-2 text-[var(--text-muted)] hover:text-red-400 ml-sm">
                        <X size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
