import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { BookOpenText, MicrophoneStage, MagnifyingGlass, Radio, List, Compass, Clock, Globe } from '@phosphor-icons/react';
import { useQuranStore } from '../store/useQuranStore';
import { WaqfBanner } from '../components/layout/WaqfBanner';
import { DynamicCard } from '../components/ui/DynamicCard';

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

const quickAccessItems = [
    { path: '/mushaf', icon: BookOpenText, labelKey: 'home.mushaf', color: '#D4AF37' },
    { path: '/reciters', icon: MicrophoneStage, labelKey: 'home.reciters', color: '#58A89B' },
    { path: '/search', icon: MagnifyingGlass, labelKey: 'home.search', color: '#7B9EBD' },
    { path: '/surah-list', icon: List, labelKey: 'home.surahIndex', color: '#B07D3A' },
    { path: '/prayer-times', icon: Clock, labelKey: 'مواقيت الصلاة', color: '#E8A55A', isRaw: true },
    { path: '/qibla', icon: Compass, labelKey: 'القبلة', color: '#6B7DB3', isRaw: true },
    { path: '/radio', icon: Radio, labelKey: 'الراديو', color: '#C66B3D', isRaw: true },
    { path: '/world-clock', icon: Globe, labelKey: 'ساعات العالم', color: '#58A89B', isRaw: true },
];

export function HomePage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { lastReadPage, lastReadSurah } = useQuranStore();
    const timeInfo = getTimeOfDay();

    return (
        <div className="flex flex-col gap-xl">
            {/* Dynamic Time-of-Day Hero */}
            <div
                className="animate-fade-in"
                style={{
                    background: timeInfo.gradient,
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-2xl) var(--space-xl)',
                    position: 'relative',
                    overflow: 'hidden',
                    marginTop: 'var(--space-sm)',
                }}
            >
                {/* Decorative overlay */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.15)',
                    pointerEvents: 'none',
                }} />
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <span style={{ fontSize: '2.5rem' }}>{timeInfo.emoji}</span>
                    <h2 style={{
                        color: '#fff', fontSize: '1.3rem', fontWeight: 400,
                        marginTop: 'var(--space-sm)', textShadow: '0 2px 8px rgba(0,0,0,0.3)',
                    }}>
                        {t(timeInfo.key)}
                    </h2>
                    <h1 style={{
                        color: '#fff', fontSize: '2.4rem', fontFamily: 'var(--font-heading)',
                        fontWeight: 800, textShadow: '0 2px 12px rgba(0,0,0,0.4)',
                    }}>
                        {t('app.name')}
                    </h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.8)', fontSize: '0.85rem',
                        marginTop: 'var(--space-xs)',
                    }}>
                        {t('app.tagline')}
                    </p>
                </div>
            </div>

            {/* Continue Reading Card */}
            <div
                className="card-gold animate-slide-up"
                style={{ cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                onClick={() => navigate('/mushaf')}
            >
                <div style={{
                    position: 'absolute', top: 0, right: 0, width: '120px', height: '120px',
                    background: 'radial-gradient(circle at top right, var(--accent-gold-soft), transparent 70%)',
                    borderRadius: '0 var(--radius-lg) 0 0',
                }} />
                <div className="flex items-center justify-between" style={{ position: 'relative' }}>
                    <div>
                        <h3 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 'var(--space-xs)' }}>
                            {t('home.continueReading')}
                        </h3>
                        <p style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '4px' }}>
                            {lastReadSurah}
                        </p>
                        <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                            {t('home.page')} {lastReadPage}
                        </p>
                    </div>
                    <div style={{
                        width: '56px', height: '56px', borderRadius: 'var(--radius-full)',
                        background: 'var(--accent-gold-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                        <BookOpenText size={24} color="var(--accent-gold)" weight="duotone" />
                    </div>
                </div>
            </div>

            {/* Quick Access Grid */}
            <section className="animate-slide-up stagger-2">
                <h3 style={{ fontSize: '0.95rem', marginBottom: 'var(--space-md)', fontWeight: 600 }}>
                    {t('home.quickAccess')}
                </h3>
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
                                <span style={{ fontSize: '0.78rem', fontWeight: 500, lineHeight: 1.3, display: 'block' }}>
                                    {'isRaw' in item ? item.labelKey : t(item.labelKey)}
                                </span>
                            </DynamicCard>
                        );
                    })}
                </div>
            </section>

            {/* Waqf Banner */}
            <WaqfBanner />
        </div>
    );
}
