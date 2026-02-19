import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Globe, MagnifyingGlass, Sun, Moon, Cloud, SunHorizon } from '@phosphor-icons/react';

interface CountryTime {
    name: string;
    nameAr: string;
    city: string; // Added city for display
    timezone: string;
    flag: string;
    continent: string;
}

const COUNTRIES: CountryTime[] = [
    // Asia
    { name: 'Saudi Arabia', nameAr: 'السعودية', city: 'RIYADH', timezone: 'Asia/Riyadh', flag: '🇸🇦', continent: 'asia' },
    { name: 'UAE', nameAr: 'الإمارات', city: 'DUBAI', timezone: 'Asia/Dubai', flag: '🇦🇪', continent: 'asia' },
    { name: 'Kuwait', nameAr: 'الكويت', city: 'KUWAIT', timezone: 'Asia/Kuwait', flag: '🇰🇼', continent: 'asia' },
    { name: 'Qatar', nameAr: 'قطر', city: 'DOHA', timezone: 'Asia/Qatar', flag: '🇶🇦', continent: 'asia' },
    { name: 'Bahrain', nameAr: 'البحرين', city: 'MANAMA', timezone: 'Asia/Bahrain', flag: '🇧🇭', continent: 'asia' },
    { name: 'Oman', nameAr: 'عمان', city: 'MUSCAT', timezone: 'Asia/Muscat', flag: '🇴🇲', continent: 'asia' },
    { name: 'Yemen', nameAr: 'اليمن', city: 'SANA\'A', timezone: 'Asia/Aden', flag: '🇾🇪', continent: 'asia' },
    { name: 'Iraq', nameAr: 'العراق', city: 'BAGHDAD', timezone: 'Asia/Baghdad', flag: '🇮🇶', continent: 'asia' },
    { name: 'Jordan', nameAr: 'الأردن', city: 'AMMAN', timezone: 'Asia/Amman', flag: '🇯🇴', continent: 'asia' },
    { name: 'Palestine', nameAr: 'فلسطين', city: 'JERUSALEM', timezone: 'Asia/Hebron', flag: '🇵🇸', continent: 'asia' },
    { name: 'Lebanon', nameAr: 'لبنان', city: 'BEIRUT', timezone: 'Asia/Beirut', flag: '🇱🇧', continent: 'asia' },
    { name: 'Syria', nameAr: 'سوريا', city: 'DAMASCUS', timezone: 'Asia/Damascus', flag: '🇸🇾', continent: 'asia' },
    { name: 'Turkey', nameAr: 'تركيا', city: 'ISTANBUL', timezone: 'Europe/Istanbul', flag: '🇹🇷', continent: 'asia' },
    { name: 'Iran', nameAr: 'إيران', city: 'TEHRAN', timezone: 'Asia/Tehran', flag: '🇮🇷', continent: 'asia' },
    { name: 'Indonesia', nameAr: 'إندونيسيا', city: 'JAKARTA', timezone: 'Asia/Jakarta', flag: '🇮🇩', continent: 'asia' },
    { name: 'Malaysia', nameAr: 'ماليزيا', city: 'KUALA LUMPUR', timezone: 'Asia/Kuala_Lumpur', flag: '🇲🇾', continent: 'asia' },
    { name: 'Pakistan', nameAr: 'باكستان', city: 'KARACHI', timezone: 'Asia/Karachi', flag: '🇵🇰', continent: 'asia' },
    { name: 'India', nameAr: 'الهند', city: 'NEW DELHI', timezone: 'Asia/Kolkata', flag: '🇮🇳', continent: 'asia' },

    // Africa
    { name: 'Egypt', nameAr: 'مصر', city: 'CAIRO', timezone: 'Africa/Cairo', flag: '🇪🇬', continent: 'africa' },
    { name: 'Morocco', nameAr: 'المغرب', city: 'RABAT', timezone: 'Africa/Casablanca', flag: '🇲🇦', continent: 'africa' },
    { name: 'Algeria', nameAr: 'الجزائر', city: 'ALGIERS', timezone: 'Africa/Algiers', flag: '🇩🇿', continent: 'africa' },
    { name: 'Tunisia', nameAr: 'تونس', city: 'TUNIS', timezone: 'Africa/Tunis', flag: '🇹🇳', continent: 'africa' },

    // Europe
    { name: 'UK', nameAr: 'بريطانيا', city: 'LONDON', timezone: 'Europe/London', flag: '🇬🇧', continent: 'europe' },
    { name: 'France', nameAr: 'فرنسا', city: 'PARIS', timezone: 'Europe/Paris', flag: '🇫🇷', continent: 'europe' },
    { name: 'Germany', nameAr: 'ألمانيا', city: 'BERLIN', timezone: 'Europe/Berlin', flag: '🇩🇪', continent: 'europe' },
    { name: 'Spain', nameAr: 'إسبانيا', city: 'MADRID', timezone: 'Europe/Madrid', flag: '🇪🇸', continent: 'europe' },
    { name: 'Russia', nameAr: 'روسيا', city: 'MOSCOW', timezone: 'Europe/Moscow', flag: '🇷🇺', continent: 'europe' },

    // Americas
    { name: 'USA', nameAr: 'أمريكا', city: 'NEW YORK', timezone: 'America/New_York', flag: '🇺🇸', continent: 'americas' },
    { name: 'Canada', nameAr: 'كندا', city: 'TORONTO', timezone: 'America/Toronto', flag: '🇨🇦', continent: 'americas' },
    { name: 'Brazil', nameAr: 'البرازيل', city: 'RIO', timezone: 'America/Sao_Paulo', flag: '🇧🇷', continent: 'americas' },

    // Oceania
    { name: 'Australia', nameAr: 'أستراليا', city: 'SYDNEY', timezone: 'Australia/Sydney', flag: '🇦🇺', continent: 'oceania' },
];

const CONTINENTS = [
    { key: 'all', labelAr: 'الكل', emoji: '🌍' },
    { key: 'asia', labelAr: 'آسيا', emoji: '🌏' },
    { key: 'africa', labelAr: 'أفريقيا', emoji: '🌍' },
    { key: 'europe', labelAr: 'أوروبا', emoji: '🌍' },
    { key: 'americas', labelAr: 'الأمريكتان', emoji: '🌎' },
    { key: 'oceania', labelAr: 'أوقيانوسيا', emoji: '🌏' },
];

function getTimeInfo(timezone: string) {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { timeZone: timezone, hour: '2-digit', minute: '2-digit', hour12: false });
    const hour = parseInt(timeStr.split(':')[0]);

    let periodAr: string;
    let periodEn: string;
    let gradient: string;

    // Day/Night logic for styling
    if (hour >= 5 && hour < 7) {
        periodAr = 'شروق'; periodEn = 'Sunrise';
        gradient = 'linear-gradient(135deg, #FF9966 0%, #FF5E62 100%)';
    } else if (hour >= 7 && hour < 16) {
        periodAr = 'النهار'; periodEn = 'Day';
        gradient = 'linear-gradient(135deg, #56CCF2 0%, #2F80ED 100%)';
    } else if (hour >= 16 && hour < 19) {
        periodAr = 'غروب'; periodEn = 'Sunset';
        gradient = 'linear-gradient(135deg, #F2994A 0%, #F2C94C 100%)';
    } else {
        periodAr = 'الليل'; periodEn = 'Night';
        gradient = 'linear-gradient(135deg, #141E30 0%, #243B55 100%)';
    }

    const isDay = hour >= 6 && hour < 18;

    return { timeStr, hour, periodAr, periodEn, gradient, isDay };
}

export function WorldClockPage() {
    const { t } = useTranslation();
    const [currentTick, setCurrentTick] = useState(0);
    const [continent, setContinent] = useState('all');
    const [search, setSearch] = useState('');

    // Tick every second
    useEffect(() => {
        const timer = setInterval(() => setCurrentTick(t => t + 1), 1000);
        return () => clearInterval(timer);
    }, []);

    const filtered = COUNTRIES.filter(c => {
        const matchContinent = continent === 'all' || c.continent === continent;
        const matchSearch = !search || c.nameAr.includes(search) || c.name.toLowerCase().includes(search.toLowerCase());
        return matchContinent && matchSearch;
    });

    return (
        <div className="flex flex-col gap-lg">
            {/* Header */}
            <div className="animate-fade-in">
                <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-xs)' }}>
                    <Globe size={24} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 8 }} color="var(--accent-gold)" weight="duotone" />
                    {' '}ساعات العالم
                </h1>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                    الوقت الحالي في مختلف دول العالم
                </p>
            </div>

            {/* Filters & Search */}
            <div className="flex flex-col gap-md animate-slide-up">
                <div className="relative">
                    <MagnifyingGlass
                        size={18}
                        style={{
                            position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                            right: 'var(--space-md)', color: 'var(--text-muted)',
                        }}
                    />
                    <input
                        className="input"
                        style={{ paddingRight: 'calc(var(--space-md) + 26px)' }}
                        placeholder="ابحث عن دولة..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex flex-wrap gap-sm stagger-1">
                    {CONTINENTS.map((c) => (
                        <button
                            key={c.key}
                            className={`chip${continent === c.key ? ' active' : ''}`}
                            onClick={() => setContinent(c.key)}
                        >
                            <span>{c.emoji}</span> {c.labelAr}
                        </button>
                    ))}
                </div>
            </div>

            {/* Countries Grid */}
            <div className="grid grid-2 gap-md">
                {filtered.map((country, i) => {
                    const info = getTimeInfo(country.timezone);
                    const fullTime = new Date().toLocaleTimeString('en-US', {
                        timeZone: country.timezone, hour: '2-digit', minute: '2-digit', hour12: true,
                    });

                    return (
                        <div
                            key={country.name}
                            className={`animate-scale-in stagger-${Math.min(i % 6 + 1, 6)}`}
                            style={{
                                position: 'relative',
                                height: 160,
                                borderRadius: 'var(--radius-xl)',
                                overflow: 'hidden',
                                background: info.gradient,
                                boxShadow: '0 10px 20px rgba(0,0,0,0.15)',
                                color: '#fff',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: 'var(--space-md)',
                            }}
                        >
                            {/* Decorative Elements */}

                            {/* Sun/Moon */}
                            <div style={{
                                position: 'absolute',
                                top: -20,
                                right: -20,
                                width: 100,
                                height: 100,
                                borderRadius: '50%',
                                background: info.isDay ? '#FDB813' : '#F4F6F0',
                                boxShadow: info.isDay
                                    ? '0 0 20px rgba(253, 184, 19, 0.6)'
                                    : '0 0 20px rgba(244, 246, 240, 0.3)',
                                zIndex: 1,
                                opacity: 0.9,
                            }} />

                            {/* Clouds (Pure CSS) */}
                            <div style={{
                                position: 'absolute',
                                bottom: -10,
                                right: 60,
                                width: 80,
                                height: 40,
                                background: 'rgba(255,255,255,0.3)',
                                borderRadius: '40px',
                                zIndex: 1,
                                filter: 'blur(4px)',
                            }} />
                            <div style={{
                                position: 'absolute',
                                bottom: 20,
                                left: -20,
                                width: 100,
                                height: 50,
                                background: 'rgba(255,255,255,0.2)',
                                borderRadius: '50px',
                                zIndex: 1,
                                filter: 'blur(8px)',
                            }} />

                            {/* Top Badge (Period & Flag) */}
                            <div style={{
                                zIndex: 10,
                                background: 'rgba(255,255,255,0.2)',
                                backdropFilter: 'blur(8px)',
                                borderRadius: 'var(--radius-full)',
                                padding: '4px 12px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 8,
                                alignSelf: 'center',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}>
                                <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{info.periodAr}</span>
                                <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{country.flag}</span>
                            </div>

                            {/* Main Content */}
                            <div className="flex flex-col items-center text-center" style={{ zIndex: 10, marginTop: 'auto', marginBottom: 'auto' }}>
                                <h2 style={{
                                    fontSize: '1.8rem',
                                    fontWeight: 700,
                                    marginBottom: 0,
                                    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    {country.nameAr}
                                </h2>
                                <span style={{
                                    fontSize: '0.75rem',
                                    letterSpacing: 2,
                                    textTransform: 'uppercase',
                                    opacity: 0.9,
                                    fontFamily: 'sans-serif'
                                }}>
                                    {country.city}
                                </span>
                            </div>

                            {/* Time Display (Optional, can be added if needed, user didn't explicitly ask for time digits but usually expected) */}
                            <div style={{
                                zIndex: 10,
                                fontSize: '0.9rem',
                                fontWeight: 500,
                                background: 'rgba(0,0,0,0.2)',
                                padding: '2px 8px',
                                borderRadius: 'var(--radius-sm)'
                            }}>
                                {fullTime}
                            </div>

                        </div>
                    );
                })}
            </div>
        </div>
    );
}
