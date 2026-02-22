import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BookOpenText, MicrophoneStage, MagnifyingGlass, Radio, List, Compass, Clock, Globe, CalendarCheck, ClockClockwise, HandHeart, Brain } from '@phosphor-icons/react';
import { useQuranStore } from '../store/useQuranStore';
import { WaqfBanner } from '../components/layout/WaqfBanner';
import { DynamicCard } from '../components/ui/DynamicCard';
import { Sun, MoonStars, Info } from '@phosphor-icons/react';
import { AboutModal } from '../components/layout/AboutModal';
import { useState } from 'react';
import rawqLogo from '../assets/rawq_logo.jpg';

function getTimeOfDay(): { key: string; gradient: string; emoji: string } {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 7) return {
        key: 'home.greeting.morning',
        gradient: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #e94560 100%)',
        emoji: '🌅'
    };
    if (hour >= 7 && hour < 12) return {
        key: 'home.greeting.morning',
        gradient: 'linear-gradient(135deg, #89CFF0 0%, #A7D8FF 40%, #FFF4CC 100%)',
        emoji: '☀️'
    };
    if (hour >= 12 && hour < 15) return {
        key: 'home.greeting.afternoon',
        gradient: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 50%, #F6D365 100%)',
        emoji: '🌤️'
    };
    if (hour >= 15 && hour < 17) return {
        key: 'home.greeting.afternoon',
        gradient: 'linear-gradient(135deg, #E6984A 0%, #E87D3E 40%, #C66B3D 100%)',
        emoji: '🌇'
    };
    if (hour >= 17 && hour < 20) return {
        key: 'home.greeting.evening',
        gradient: 'linear-gradient(135deg, #141E30 0%, #243B55 40%, #E8724A 80%, #FFB03B 100%)',
        emoji: '🌆'
    };
    return {
        key: 'home.greeting.night',
        gradient: 'linear-gradient(135deg, #0B1C1A 0%, #0D2137 40%, #1a1a3e 80%, #2d1b54 100%)',
        emoji: '🌙'
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
];

export function HomePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { lastReadPage, lastReadSurah, dailyReadPages, lastLoginDate } = useQuranStore();
    const timeInfo = getTimeOfDay();

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

    return (
        <div className="flex flex-col gap-xl">
            {/* Dynamic Time-of-Day Hero */}
            <div
                className="animate-fade-in"
                style={{
                    background: timeInfo.gradient,
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-3xl) var(--space-xl)',
                    position: 'relative',
                    overflow: 'hidden',
                    marginTop: 'var(--space-sm)',
                    boxShadow: 'var(--shadow-lg)',
                    textAlign: 'center'
                }}
            >
                {/* Refined subtle overlay */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.4))',
                    pointerEvents: 'none',
                }} />

                <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    {/* Dynamic Greeting Capsule */}
                    <div style={{
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(8px)',
                        padding: '4px 16px',
                        borderRadius: 'var(--radius-full)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        marginBottom: 'var(--space-lg)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                    }}>
                        <span style={{ fontSize: '0.85rem', color: '#fff', fontWeight: 500 }}>
                            {t(timeInfo.key)}
                        </span>
                        <span>{timeInfo.emoji}</span>
                    </div>

                    {/* Official Logo Integration */}
                    <div style={{
                        width: '90px',
                        height: '90px',
                        marginBottom: 'var(--space-xl)',
                        borderRadius: 'var(--radius-lg)',
                        background: '#fff',
                        border: '1px solid rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                        overflow: 'hidden'
                    }}>
                        <img
                            src={rawqLogo}
                            alt="RAWQ Logo"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'contain'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: 'var(--space-md)', width: '100%' }}>
                        <span style={{
                            color: '#fff',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            display: 'block',
                            marginBottom: '4px',
                            textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                            whiteSpace: 'nowrap'
                        }}>
                            الْمَجْمَعُ الْقُرْآنِيُّ لِلشَّيْخِ
                        </span>

                        <h1 style={{
                            fontSize: '1.4rem',
                            fontFamily: 'var(--font-heading)',
                            fontWeight: 800,
                            color: '#fff',
                            lineHeight: 1.2,
                            letterSpacing: '0.5px',
                            textShadow: '0 2px 10px rgba(0,0,0,0.5)',
                            whiteSpace: 'nowrap'
                        }}>
                            عَبْدِ الْحَفِيظِ بُورْكِيبَات
                        </h1>
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        margin: 'var(--space-md) 0 var(--space-xl)'
                    }}>
                        <div style={{ width: '50px', height: '2px', background: 'linear-gradient(to left, transparent, #D4AF37)' }} />
                        <span style={{
                            fontSize: '3.5rem',
                            color: '#D4AF37',
                            fontWeight: 900,
                            fontFamily: 'var(--font-quran)',
                            lineHeight: 1,
                            textShadow: '0 0 25px rgba(212, 175, 55, 0.6)'
                        }}>
                            رَوْقٌ
                        </span>
                        <div style={{ width: '50px', height: '2px', background: 'linear-gradient(to right, transparent, #D4AF37)' }} />
                    </div>

                    <p style={{
                        color: '#fff',
                        fontSize: '1rem',
                        fontWeight: 500,
                        lineHeight: 1.6,
                        maxWidth: '350px',
                        fontFamily: 'var(--font-ui)',
                        letterSpacing: '0.2px',
                        textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                    }}>
                        {t('app.tagline')}
                    </p>
                </div>
            </div>

            {/* Continue Reading Card */}
            <div
                className="card-gold animate-slide-up"
                style={{
                    cursor: 'pointer',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 'var(--space-md)'
                }}
                onClick={() => navigate('/mushaf')}
            >
                <div style={{
                    position: 'absolute', top: 0, right: 0, width: '150px', height: '150px',
                    background: 'radial-gradient(circle at top right, var(--accent-gold-soft), transparent 70%)',
                    borderRadius: '0 var(--radius-lg) 0 0',
                    pointerEvents: 'none'
                }} />

                {/* Top Section: Where stopped */}
                <div className="flex items-center justify-between" style={{ position: 'relative', zIndex: 1 }}>
                    <div className="flex items-center gap-sm">
                        <div style={{
                            width: '48px', height: '48px', borderRadius: 'var(--radius-lg)',
                            background: 'var(--accent-gold-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <BookOpenText size={24} color="var(--accent-gold)" weight="duotone" />
                        </div>
                        <div>
                            {/* Removed text */}
                            <p style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
                                {lastReadSurah}
                            </p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--accent-gold)', marginTop: '4px' }}>
                                {t('home.page')} {lastReadPage}
                            </p>
                        </div>
                    </div>
                    {/* Badge */}
                    <div style={{
                        padding: 'var(--space-xs) var(--space-sm)',
                        borderRadius: 'var(--radius-full)',
                        background: 'rgba(212, 175, 55, 0.1)',
                        color: 'var(--accent-gold)',
                        fontSize: '0.75rem',
                        fontWeight: 600
                    }}>
                        {t('home.continueReading')}
                    </div>
                </div>

                {/* Middle Section: Khatmah Progress */}
                <div style={{ padding: 'var(--space-sm) 0', position: 'relative', zIndex: 1 }}>
                    <div className="flex items-center justify-between mb-xs">
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{t('home.khatmahProgress')}</span>
                        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-gold)' }}>{khatmahProgress}%</span>
                    </div>
                    <div style={{
                        height: '6px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: 'var(--radius-full)',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${khatmahProgress}%`,
                            background: 'var(--accent-gold)',
                            borderRadius: 'var(--radius-full)',
                            transition: 'width 0.5s ease'
                        }} />
                    </div>
                </div>

                {/* Bottom Section: Stats */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: 'var(--space-sm)',
                    paddingTop: 'var(--space-md)',
                    borderTop: '1px solid rgba(255,255,255,0.05)',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div className="flex items-center gap-sm">
                        <CalendarCheck size={20} color="var(--accent-gold)" weight="duotone" />
                        <div>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('home.dailyWird')}</p>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>{t('home.pagesCount', { count: dailyWirdCount })}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-sm">
                        <ClockClockwise size={20} color="var(--accent-gold)" weight="duotone" />
                        <div>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('home.lastLogin')}</p>
                            <p style={{ fontSize: '0.9rem', fontWeight: 600 }} dir="ltr">{formatLastLogin()}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Daily Adhkar Card */}
            <div
                className="animate-slide-up stagger-1"
                style={{
                    background: adhkarGradient,
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-md) var(--space-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: '1px solid rgba(255,255,255,0.05)',
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
                                className={`animate-scale-in stagger-${Math.min(i + 1, 6)}`}
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
