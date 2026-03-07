import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BookOpenText, MicrophoneStage, MagnifyingGlass, Radio, List, Compass, Clock, Globe, CalendarCheck, ClockClockwise, HandHeart, Brain, Sun, MoonStars, Info, SunHorizon, CloudSun, SunDim, Moon, PlayCircle, Target, Checks } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';
import { useQuranStore } from '../store/useQuranStore';
import { useThemeStore } from '../store/useThemeStore';
import { WaqfBanner } from '../components/layout/WaqfBanner';
import { DynamicCard } from '../components/ui/DynamicCard';
import { AboutModal } from '../components/layout/AboutModal';
import { useState } from 'react';
import rawqLogo from '../assets/rawq_logo.png';
import { SURAH_NAMES } from '../lib/surahData';
import { audioEngine } from '../lib/audioEngine';

function getTimeOfDay(): { key: string; darkGradient: string; lightGradient: string; icon: Icon; iconColor: string } {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 7) return {
        key: 'home.greeting.morning',
        darkGradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #e94560 100%)',
        lightGradient: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 50%, #ff9a9e 100%)',
        icon: SunHorizon,
        iconColor: '#FF8C42'
    };
    if (hour >= 7 && hour < 12) return {
        key: 'home.greeting.morning',
        darkGradient: 'linear-gradient(135deg, #89CFF0 0%, #A7D8FF 40%, #FFF4CC 100%)',
        lightGradient: 'linear-gradient(135deg, #a8edea 0%, #b8f0e8 40%, #fed6e3 100%)',
        icon: Sun,
        iconColor: '#F6A623'
    };
    if (hour >= 12 && hour < 15) return {
        key: 'home.greeting.afternoon',
        darkGradient: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 50%, #F6D365 100%)',
        lightGradient: 'linear-gradient(135deg, #c3f0dc 0%, #d4fc79 40%, #96e6a1 100%)',
        icon: CloudSun,
        iconColor: '#E8A55A'
    };
    if (hour >= 15 && hour < 17) return {
        key: 'home.greeting.afternoon',
        darkGradient: 'linear-gradient(135deg, #E6984A 0%, #E87D3E 40%, #C66B3D 100%)',
        lightGradient: 'linear-gradient(135deg, #fbc2eb 0%, #e8b4d0 40%, #a6c1ee 100%)',
        icon: SunDim,
        iconColor: '#E87D3E'
    };
    if (hour >= 17 && hour < 20) return {
        key: 'home.greeting.evening',
        darkGradient: 'linear-gradient(135deg, #141E30 0%, #243B55 40%, #E8724A 80%, #FFB03B 100%)',
        lightGradient: 'linear-gradient(135deg, #fad0c4 0%, #ffd1ff 50%, #e8b4d0 100%)',
        icon: MoonStars,
        iconColor: '#FFB03B'
    };
    return {
        key: 'home.greeting.night',
        darkGradient: 'linear-gradient(135deg, #0B1C1A 0%, #0D2137 40%, #1a1a3e 80%, #2d1b54 100%)',
        lightGradient: 'linear-gradient(135deg, #667eea 0%, #9b8ec4 40%, #764ba2 100%)',
        icon: Moon,
        iconColor: '#A7D8FF'
    };
}

const dailyAdhkar = [
    "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ ، سُبْحَانَ اللَّهِ الْعَظِيمِ",
    "لا حَوْلَ وَلا قُوَّةَ إِلا بِاللَّهِ",
    "اللَّهُمَّ صَلِّ وَسَلِّمْ عَلَى نَبِيِّنَا مُحَمَّدٍ",
    "أَسْتَغْفِرُ اللَّهَ الْعَظِيمَ الَّذِي لا إِلَهَ إِلا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ",
    "لا إِلَهَ إِلا أَنْتَ سُبْحَانَكَ إِنِّي كُنْتُ مِنَ الظَّالِمِينَ",
    "رَضِيتُ بِاللَّهِ رَبًّا ، وَبِالْإِسْلَامِ دِينًا ، وَبِمُحَمَّدٍ رَسُولًا",
    "حَسْبِيَ اللَّهُ لا إِلَهَ إِلا هُوَ عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ",
    "يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ ، أَصْلِحْ لِي شَأْنِي كُلَّهُ",
    "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا ، وَرِزْقًا طَيِّبًا ، وَعَمَلًا مُتَقَبَّلًا",
    "اللَّهُمَّ أَعِنِّي عَلَى ذِكْرِكَ وَشُكْرِكَ وَحُسْنِ عِبَادَتِكَ"
];

function getDailyDhikr(): string {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 0);
    const diff = now.getTime() - start.getTime();
    const oneDay = 1000 * 60 * 60 * 24;
    const dayOfYear = Math.floor(diff / oneDay);
    return dailyAdhkar[dayOfYear % dailyAdhkar.length];
}

const quickAccessItems = [
    { path: '/mushaf', icon: BookOpenText, labelKey: 'home.mushaf', color: '#D4AF37' },
    { path: '/quran-culture', icon: Brain, labelKey: 'culture.title', color: '#8A2BE2' },
    { path: '/reciters', icon: MicrophoneStage, labelKey: 'home.reciters', color: '#58A89B' },
    { path: '/search', icon: MagnifyingGlass, labelKey: 'home.search', color: '#7B9EBD' },
    { path: '/surah-list', icon: List, labelKey: 'home.surahIndex', color: '#B07D3A' },
    { path: '/prayer-times', icon: Clock, labelKey: 'home.prayerTimes', color: '#E8A55A' },
    { path: '/qibla', icon: Compass, labelKey: 'home.qibla', color: '#6B7DB3' },
    { path: '/radio', icon: Radio, labelKey: 'home.radios', color: '#C66B3D' },
    { path: '/world-clock', icon: Globe, labelKey: 'home.worldClocks', color: '#58A89B' },
    { path: '/azkar', icon: HandHeart, labelKey: 'adhkar.title', color: '#E94560' },
    { path: '/schedule', icon: CalendarCheck, labelKey: 'schedule.title', color: '#38A169' },
    { path: '/khatma', icon: Target, labelKey: 'khatma.title', color: '#D4AF37' },
    { path: '/tracker', icon: Checks, labelKey: 'habits.title', color: '#58A89B' },
];

export function HomePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { lastReadPage, lastReadSurah, dailyReadPages, lastLoginDate, lastPlayedSurahNum, lastPlayedAyahNum } = useQuranStore();
    const { mode } = useThemeStore();
    const timeInfo = getTimeOfDay();

    // Determine effective theme and select gradient
    const isDark = mode === 'dark' || (mode === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    const heroGradient = isDark ? timeInfo.darkGradient : timeInfo.lightGradient;

    const formatLastLogin = () => {
        if (!lastLoginDate) return t('home.never') || 'الآن';
        const date = new Date(lastLoginDate);
        return new Intl.DateTimeFormat('ar-SA-u-nu-latn', {
            hour: 'numeric', minute: '2-digit', day: 'numeric', month: 'short'
        }).format(date);
    };

    const dailyWirdCount = dailyReadPages?.length || 0;

    const totalPages = 604;
    const khatmahProgress = Math.round((lastReadPage / totalPages) * 100);

    const isMorning = new Date().getHours() < 12;
    const adhkarTitle = isMorning ? t('home.adhkarMorning') : t('home.adhkarEvening');
    const adhkarIcon = isMorning ? <Sun size={24} weight="duotone" color="#F6D365" /> : <MoonStars size={24} weight="duotone" color="#A7D8FF" />;
    const adhkarGradient = isMorning
        ? 'linear-gradient(135deg, rgba(246, 211, 101, 0.1) 0%, rgba(253, 160, 133, 0.1) 100%)'
        : 'linear-gradient(135deg, rgba(167, 216, 255, 0.1) 0%, rgba(137, 207, 240, 0.1) 100%)';

    const currentDhikr = getDailyDhikr();
    const [isAboutOpen, setIsAboutOpen] = useState(false);

    const getRamadanData = () => {
        try {
            const date = new Date();
            const mStr = date.toLocaleDateString('en-u-ca-islamic-nu-latn', { month: 'numeric' });
            const dStr = date.toLocaleDateString('en-u-ca-islamic-nu-latn', { day: 'numeric' });

            let dayNum = parseInt(dStr, 10);
            if (!isNaN(dayNum)) {
                dayNum -= 1;
                if (dayNum <= 0) dayNum = 30; // Basic underflow protection
            }

            return {
                isRamadan: mStr === '9',
                hijriDay: dayNum.toString()
            };
        } catch (e) {
            return { isRamadan: false, hijriDay: '' };
        }
    };
    const { isRamadan, hijriDay } = getRamadanData();

    return (
        <div className="flex flex-col gap-xl">
            {/* Dynamic Time-of-Day Hero — Compact */}
            <div
                className="animate-fade-in"
                style={{
                    background: heroGradient,
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-lg) var(--space-lg)',
                    position: 'relative',
                    overflow: 'hidden',
                    marginTop: 'var(--space-sm)',
                    boxShadow: 'var(--shadow-lg)',
                    border: '1px solid var(--hero-border)',
                    transition: 'background 0.6s ease, border-color 0.6s ease'
                }}
            >
                {/* Overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'var(--hero-overlay)',
                    pointerEvents: 'none',
                }} />

                {/* Greeting & Ramadan Capsules — Top Right */}
                <div style={{
                    position: 'relative', zIndex: 1,
                    display: 'flex', justifyContent: 'space-between',
                    marginBottom: 'var(--space-md)',
                    flexWrap: 'nowrap',
                    overflow: 'hidden'
                }}>
                    {/* Time Greeting */}
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.35)',
                        backdropFilter: 'blur(12px)',
                        WebkitBackdropFilter: 'blur(12px)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid var(--hero-capsule-border)',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '5px',
                        fontSize: '0.72rem',
                        whiteSpace: 'nowrap',
                    }}>
                        <div style={{
                            width: '24px', height: '24px',
                            borderRadius: '50%',
                            background: `${timeInfo.iconColor}30`,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            animation: 'iconFloat 3s ease-in-out infinite, iconGlow 2s ease-in-out infinite alternate',
                        }}>
                            <timeInfo.icon size={14} weight="fill" color={timeInfo.iconColor} />
                        </div>
                        <span style={{
                            color: 'white',
                            fontWeight: 800,
                        }}>
                            {t(timeInfo.key)}
                        </span>
                    </div>

                    {/* Ramadan Badge */}
                    {isRamadan && (
                        <div style={{
                            background: 'rgba(0, 0, 0, 0.45)',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            padding: '4px 10px',
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid var(--accent-gold)',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '0.72rem',
                            animation: 'iconGlow 2s ease-in-out infinite alternate',
                            whiteSpace: 'nowrap',
                        }}>
                            <div style={{
                                width: '24px', height: '24px',
                                borderRadius: '50%',
                                background: 'rgba(212, 175, 55, 0.3)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <MoonStars size={14} weight="fill" color="var(--accent-gold)" />
                            </div>
                            <span style={{
                                color: 'var(--accent-gold)',
                                fontWeight: 800,
                            }}>
                                {t('ramadan.title')} : {t('ramadan.day', { day: hijriDay })}
                            </span>
                        </div>
                    )}
                </div>

                {/* Main Content — Horizontal */}
                <div style={{
                    position: 'relative', zIndex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-lg)',
                    direction: 'rtl'
                }}>
                    {/* Logo */}
                    <div style={{
                        width: '68px', height: '68px',
                        minWidth: '68px',
                        borderRadius: '50%',
                        background: 'var(--hero-logo-bg)',
                        border: '2px solid var(--accent-gold)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `var(--hero-logo-shadow), 0 0 18px var(--accent-gold-glow)`,
                        overflow: 'hidden',
                        animation: 'logoPulse 4s ease-in-out infinite',
                    }}>
                        <img src={rawqLogo} alt="RAWQ" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                    </div>

                    {/* Text Block */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                            color: 'var(--hero-text-sub)',
                            fontSize: '0.68rem',
                            fontWeight: 600,
                            letterSpacing: '1.5px',
                            marginBottom: '2px',
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}>
                            الْمَجْمَعُ الْقُرْآنِيُّ لِلشَّيْخِ
                        </p>
                        <h1 style={{
                            fontSize: '1.15rem',
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 800,
                            color: 'var(--hero-text)',
                            lineHeight: 1.3,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            margin: 0,
                        }}>
                            عَبْدِ الْحَفِيظِ بُورْكِيبَات
                        </h1>
                    </div>
                </div>

                {/* Brand Name + Tagline — Bottom */}
                <div style={{
                    position: 'relative', zIndex: 1,
                    marginTop: 'var(--space-md)',
                    textAlign: 'center'
                }}>
                    {/* Gold Divider + Brand */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        marginBottom: '6px'
                    }}>
                        <div style={{ flex: 1, maxWidth: '60px', height: '1px', background: 'linear-gradient(to left, var(--accent-gold), transparent)' }} />
                        <span style={{
                            fontSize: '1.8rem',
                            color: 'var(--accent-gold)',
                            fontWeight: 900,
                            fontFamily: 'var(--font-quran)',
                            lineHeight: 1,
                            textShadow: '0 0 20px var(--accent-gold-glow)',
                        }}>
                            رَوْقٌ
                        </span>
                        <div style={{ flex: 1, maxWidth: '60px', height: '1px', background: 'linear-gradient(to right, var(--accent-gold), transparent)' }} />
                    </div>

                    <p style={{
                        color: 'var(--hero-text-sub)',
                        fontSize: '0.82rem',
                        fontWeight: 500,
                        lineHeight: 1.5,
                        fontFamily: 'var(--font-ui)',
                        margin: 0,
                    }}>
                        {t('app.tagline')}
                    </p>
                </div>
            </div>

            {/* Continue Listening Card (if available) */}
            {lastPlayedSurahNum && lastPlayedAyahNum && (
                <div
                    className="animate-slide-up"
                    style={{
                        cursor: 'pointer',
                        position: 'relative',
                        overflow: 'hidden',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 'var(--space-md)',
                        borderRadius: 'var(--radius-xl)',
                        padding: 'var(--space-lg)',
                        background: 'linear-gradient(135deg, #16213e 0%, #0f3460 100%)',
                        boxShadow: 'var(--shadow-md)',
                        border: '1px solid rgba(88, 168, 155, 0.3)',
                        color: '#ffffff',
                    }}
                    onClick={() => audioEngine.playAyah(lastPlayedSurahNum, lastPlayedAyahNum)}
                >
                    <div className="flex items-center justify-between" style={{ position: 'relative', zIndex: 1 }}>
                        <div className="flex items-center gap-sm">
                            <div style={{
                                width: '48px', height: '48px', borderRadius: 'var(--radius-lg)',
                                background: 'rgba(88, 168, 155, 0.2)',
                                backdropFilter: 'blur(5px)',
                                WebkitBackdropFilter: 'blur(5px)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '1px solid rgba(88, 168, 155, 0.3)',
                            }}>
                                <PlayCircle size={24} color="#58A89B" weight="duotone" />
                            </div>
                            <div>
                                <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', lineHeight: 1, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                    سورة {SURAH_NAMES[lastPlayedSurahNum]}
                                </p>
                                <p style={{ fontSize: '0.85rem', color: '#a7d8ff', marginTop: '6px', fontWeight: 500 }}>
                                    الآية {lastPlayedAyahNum}
                                </p>
                            </div>
                        </div>
                        {/* Badge */}
                        <div style={{
                            padding: 'var(--space-xs) var(--space-sm)',
                            borderRadius: 'var(--radius-full)',
                            background: 'rgba(88, 168, 155, 0.2)',
                            backdropFilter: 'blur(4px)',
                            WebkitBackdropFilter: 'blur(4px)',
                            color: '#a7d8ff',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            border: '1px solid rgba(88, 168, 155, 0.3)',
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                        }}>
                            مواصلة الاستماع
                        </div>
                    </div>
                </div>
            )}

            {/* Continue Reading Card */}
            <div
                className="animate-slide-up"
                style={{
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-md)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-lg)',
                    backgroundImage: `linear-gradient(rgba(10, 25, 15, 0.5), rgba(10, 25, 15, 0.7)), url('/images/quran_tracker_bg.png')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    boxShadow: 'var(--shadow-md)',
                    border: '1px solid rgba(212, 175, 55, 0.3)',
                    color: '#ffffff',
                }}
                onClick={() => navigate('/mushaf')}
            >
                {/* Top Section: Where stopped */}
                <div className="flex items-center justify-between" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="flex items-center gap-sm">
                        <div style={{
                            width: '48px', height: '48px', borderRadius: 'var(--radius-lg)',
                            background: 'rgba(212, 175, 55, 0.2)',
                            backdropFilter: 'blur(5px)',
                            WebkitBackdropFilter: 'blur(5px)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            border: '1px solid rgba(212, 175, 55, 0.3)',
                        }}>
                            <BookOpenText size={24} color="#D4AF37" weight="duotone" />
                        </div>
                        <div>
                            <p style={{ fontSize: '1.2rem', fontWeight: 800, color: '#ffffff', lineHeight: 1, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
                                {lastReadSurah}
                            </p>
                            <p style={{ fontSize: '0.85rem', color: '#e8d595', marginTop: '6px', fontWeight: 500 }}>
                                {t('home.page')} {lastReadPage}
                            </p>
                        </div>
                    </div>
                    {/* Badge */}
                    <div style={{
                        padding: 'var(--space-xs) var(--space-sm)',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(212, 175, 55, 0.2)',
                        backdropFilter: 'blur(4px)',
                        WebkitBackdropFilter: 'blur(4px)',
                        color: '#D4AF37',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        border: '1px solid rgba(212, 175, 55, 0.3)',
                        textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                    }}>
                        {t('home.continueReading')}
                    </div>
                </div>

                {/* Middle Section: Khatmah Progress */}
                <div style={{ padding: 'var(--space-sm) 0', position: 'relative', zIndex: 1, marginTop: 'var(--space-sm)' }}>
                    <div className="flex items-center justify-between mb-xs">
                        <span style={{ fontSize: '0.8rem', color: '#e8d595', fontWeight: 500 }}>{t('home.khatmahProgress')}</span>
                        <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff' }}>{khatmahProgress}%</span>
                    </div>
                    <div style={{
                        height: '6px',
                        background: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: 'var(--radius-full)',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${khatmahProgress}%`,
                            background: 'linear-gradient(90deg, #D4AF37, #F3E5AB)',
                            borderRadius: 'var(--radius-full)',
                            transition: 'width 0.5s ease',
                            boxShadow: '0 0 10px rgba(212, 175, 55, 0.5)'
                        }} />
                    </div>
                </div>

                {/* Bottom Section: Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'var(--space-sm)',
                    paddingTop: 'var(--space-md)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                    zIndex: 1,
                    marginTop: 'var(--space-xs)'
                }}>
                    <div className="flex items-center gap-sm">
                        <CalendarCheck size={20} color="#D4AF37" weight="duotone" />
                        <div>
                            <p style={{ fontSize: '0.75rem', color: '#e8d595', marginBottom: '2px' }}>{t('home.dailyWird')}</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }}>{t('home.pagesCount', { count: dailyWirdCount })}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-sm">
                        <ClockClockwise size={20} color="#D4AF37" weight="duotone" />
                        <div>
                            <p style={{ fontSize: '0.75rem', color: '#e8d595', marginBottom: '2px' }}>{t('home.lastLogin')}</p>
                            <p style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff' }} dir="ltr">{formatLastLogin()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Adhkar Card */}
            <div
                className="animate-slide-up stagger-1"
                onClick={() => navigate('/azkar')}
                style={{
                    background: adhkarGradient,
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-md) var(--space-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid var(--border)',
                    cursor: 'pointer'
                }}
            >
                <div className="flex items-center gap-md">
                    <div style={{
                        width: '48px', height: '48px', borderRadius: 'var(--radius-lg)',
                        background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        {adhkarIcon}
                    </div>
                    <div>
                        <div className="flex items-center gap-xs">
                            <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>{adhkarTitle}</h3>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>• {t('home.dhikrToday')}</span>
                        </div>
                        <p style={{
                            fontSize: '1.2rem',
                            fontFamily: 'var(--font-quran)',
                            color: 'var(--accent-gold)',
                            marginTop: 'var(--space-sm)',
                            lineHeight: 1.8
                        }}>
                            {currentDhikr}
                        </p>
                    </div>
                </div>
            </div>

            {/* Quick Access Grid */}
            <section className="animate-slide-up stagger-2">
                <div className="grid grid-3 gap-md">
                    {quickAccessItems.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <DynamicCard
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                gradientColor={item.color}
                                style={{ textAlign: 'center', padding: 'var(--space-md) var(--space-sm)' }}
                            >
                                <div style={{
                                    width: '44px', height: '44px', borderRadius: 'var(--radius-lg)',
                                    background: `${item.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    margin: '0 auto var(--space-sm)',
                                }}>
                                    <Icon size={24} color={item.color} weight="duotone" />
                                </div>
                                {t(item.labelKey)}
                            </DynamicCard>
                        );
                    })}
                </div>
            </section>

            {/* Footer with Copyright and About */}
            <div style={{
                textAlign: 'center',
                padding: 'var(--space-lg) 0',
                marginTop: 'var(--space-sm)',
                borderTop: '1px solid rgba(255,255,255,0.05)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 'var(--space-sm)'
            }}>
                <button
                    onClick={() => setIsAboutOpen(true)}
                    className="flex items-center justify-center gap-xs"
                    style={{
                        background: 'rgba(212, 175, 55, 0.1)',
                        color: 'var(--accent-gold)',
                        border: '1px solid rgba(212, 175, 55, 0.2)',
                        padding: '6px 16px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                    }}
                >
                    <Info size={16} weight="bold" />
                    {t('settings.about')}
                </button>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '4px' }}>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {t('app.developer')}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }} dir="ltr">
                        © 2026 RAWQ Platform.
                    </p>
                </div>
            </div>

            <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
        </div>
    );
}
