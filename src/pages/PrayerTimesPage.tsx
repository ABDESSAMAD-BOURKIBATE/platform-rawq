import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, MapPin, Sun, SunHorizon, Moon, CloudSun, MoonStars } from '@phosphor-icons/react';

import { computePrayerTimes } from '../utils/prayerTimes';

interface PrayerTime {
    name: string;
    nameKey: string;
    time: string;
    icon: typeof Sun;
    color: string;
}

const THRESHOLDS: Record<string, number> = {
    'prayer.fajr': 20,
    'prayer.dhuhr': 15,
    'prayer.asr': 15,
    'prayer.maghrib': 10,
    'prayer.isha': 15,
};

export function PrayerTimesPage() {
    const { t } = useTranslation();
    const [prayers, setPrayers] = useState<PrayerTime[]>([]);
    const [loading, setLoading] = useState(true);
    const [city, setCity] = useState('');
    const [currentTime, setCurrentTime] = useState(new Date());
    const [nextPrayer, setNextPrayer] = useState<string>('');

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const tz = -new Date().getTimezoneOffset() / 60;
                    const times = computePrayerTimes(pos.coords.latitude, pos.coords.longitude, new Date(), tz);

                    const prayerList: PrayerTime[] = [
                        { name: 'Fajr', nameKey: 'prayer.fajr', time: times.fajr, icon: Moon, color: '#6B7DB3' },
                        { name: 'Sunrise', nameKey: 'prayer.sunrise', time: times.sunrise, icon: SunHorizon, color: '#E8A55A' },
                        { name: 'Dhuhr', nameKey: 'prayer.dhuhr', time: times.dhuhr, icon: Sun, color: '#D4AF37' },
                        { name: 'Asr', nameKey: 'prayer.asr', time: times.asr, icon: CloudSun, color: '#E88B5A' },
                        { name: 'Maghrib', nameKey: 'prayer.maghrib', time: times.maghrib, icon: SunHorizon, color: '#C66B3D' },
                        { name: 'Isha', nameKey: 'prayer.isha', time: times.isha, icon: Moon, color: '#4A5A8A' },
                    ];

                    setPrayers(prayerList);
                    setLoading(false);

                    // Determine next prayer
                    const now = `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
                    const next = prayerList.find(p => p.time > now && p.name !== 'Sunrise');
                    setNextPrayer(next?.nameKey || prayerList[0].nameKey);

                    // Reverse geocode city name
                    fetch(`https://nominatim.openstreetmap.org/reverse?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&format=json&accept-language=ar`)
                        .then(r => r.json())
                        .then(d => setCity(d.address?.city || d.address?.town || d.address?.state || ''))
                        .catch(() => { });
                },
                () => {
                    setLoading(false);
                },
                { enableHighAccuracy: true }
            );
        } else {
            setLoading(false);
        }
    }, []);

    const formatCurrentTime = () => {
        return currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    };

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

    // --- Stay Active Logic ---
    // Prayer remains "active" for its threshold window (e.g., 15m) after it starts
    const activeNextPrayer = prayers.find(p => {
        const [h, m] = p.time.split(':').map(Number);
        const prayerDate = new Date(currentTime);
        prayerDate.setHours(h, m, 0, 0);

        const threshold = THRESHOLDS[p.nameKey] || 0;
        const expiryDate = new Date(prayerDate.getTime() + threshold * 60000);

        return expiryDate > currentTime && p.name !== 'Sunrise';
    }) || prayers[0];

    const getTimeRemaining = (targetTimeStr: string, nameKey: string) => {
        if (!targetTimeStr) return '';
        const [hours, minutes] = targetTimeStr.split(':').map(Number);
        const target = new Date(currentTime);
        target.setHours(hours, minutes, 0, 0);

        let diff = target.getTime() - currentTime.getTime();
        const threshold = THRESHOLDS[nameKey] || 0;
        if (diff < -threshold * 60000) {
            target.setDate(target.getDate() + 1);
            diff = target.getTime() - currentTime.getTime();
        }

        const absDiff = Math.abs(diff);
        const h = Math.floor(absDiff / (1000 * 60 * 60));
        const m = Math.floor((absDiff % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((absDiff % (1000 * 60)) / 1000);

        const timeStr = h > 0
            ? `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
            : `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

        if (diff > 0) {
            const totalMinutes = Math.floor(diff / (1000 * 60));
            // Show minus if outside the "imminent" threshold
            return totalMinutes >= threshold ? `-${timeStr}` : timeStr;
        } else {
            // Always show minus for elapsed time
            return `-${timeStr}`;
        }
    };

    return (
        <div className="flex flex-col gap-lg">
            {/* Header */}
            <div className="animate-fade-in">
                <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-xs)' }}>
                    <Clock size={24} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 8 }} color="var(--accent-gold)" weight="duotone" />
                    {' '}{t('prayer.title')}
                </h1>
            </div>

            {/* Current Time */}
            <div className="card-gold text-center animate-scale-in relative overflow-hidden" style={{ padding: 'var(--space-lg)', position: 'relative' }}>
                <div className="mosque-bg-container"></div>

                <div style={{ position: 'relative', zIndex: 2 }}>
                    <div className="text-muted flex items-center justify-center gap-xs" style={{ fontSize: '0.85rem', marginBottom: 4 }}>
                        <p>{t('prayer.currentTime')}</p>
                        {city && (
                            <>
                                <span>{t('prayer.in')}</span>
                                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{city}</span>
                                <MapPin size={14} weight="fill" color="var(--accent-gold)" />
                            </>
                        )}
                    </div>


                    <p className="text-gold glow-text" style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-heading)', letterSpacing: 2 }}>
                        {formatCurrentTime()}
                    </p>
                    {activeNextPrayer && (
                        <div style={{ marginTop: 'var(--space-xs)' }}>
                            <p style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 0, lineHeight: 1.2 }}>
                                <span style={{ color: 'white', opacity: 0.9 }}>{t('prayer.nextPrayerLabel')} : </span>
                                <span className="text-gold" style={{ fontSize: '1.3rem', fontWeight: 800 }}>{t(activeNextPrayer.nameKey)}</span>
                            </p>
                            <div style={{
                                display: 'inline-block',
                                padding: '0px 12px',
                                background: 'rgba(212, 175, 55, 0.1)',
                                borderRadius: 'var(--radius-md)',
                                border: '1px solid rgba(212, 175, 55, 0.1)',
                                marginTop: 0
                            }}>
                                <p className="text-gold" style={{ fontSize: '1.5rem', fontWeight: 800, fontFamily: 'monospace', lineHeight: 1.3 }}>
                                    {getTimeRemaining(activeNextPrayer.time, activeNextPrayer.nameKey)}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Prayer Times List */}
            {loading ? (
                <div className="flex flex-col gap-sm">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="card flex items-center gap-md" style={{ padding: 'var(--space-md)' }}>
                            <div className="skeleton skeleton-circle" style={{ width: 44, height: 44 }} />
                            <div style={{ flex: 1 }}>
                                <div className="skeleton skeleton-text" style={{ width: '40%' }} />
                            </div>
                            <div className="skeleton skeleton-text" style={{ width: 60 }} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col gap-sm">
                    {prayers.map((prayer, i) => {
                        const Icon = prayer.icon;
                        const isNext = activeNextPrayer && prayer.nameKey === activeNextPrayer.nameKey;
                        return (
                            <div
                                key={prayer.name}
                                className={`card animate-slide-up stagger-${i + 1} prayer-card-bg prayer-bg-${prayer.name.toLowerCase()}`}
                                style={{
                                    padding: 'var(--space-md)',
                                    border: isNext ? '1px solid var(--accent-gold)' : undefined,
                                    background: isNext ? 'var(--accent-gold-soft)' : undefined,
                                    boxShadow: isNext ? '0 0 15px rgba(212, 175, 55, 0.2)' : undefined
                                }}
                            >
                                <div className="flex items-center gap-md w-full relative z-10">
                                    {/* Icon */}
                                    <div style={{
                                        width: 44, height: 44, borderRadius: 'var(--radius-full)',
                                        background: `${prayer.color}20`, display: 'flex',
                                        alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    }}>
                                        <Icon size={20} color={prayer.color} />
                                    </div>

                                    {/* Name */}
                                    <div style={{ flex: 1 }}>
                                        <p style={{ fontWeight: 600, fontSize: '1.15rem' }}>{t(prayer.nameKey)}</p>
                                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>{prayer.name}</p>
                                    </div>

                                    {/* Time */}
                                    <div style={{ textAlign: 'end' }}>
                                        <span style={{
                                            fontSize: '1.25rem', fontWeight: 700, fontFamily: 'var(--font-heading)',
                                            color: isNext ? 'var(--accent-gold)' : 'var(--text)',
                                            display: 'block'
                                        }}>
                                            {prayer.time}
                                        </span>
                                        {isNext && (
                                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--accent-gold)', fontFamily: 'monospace' }}>
                                                {getTimeRemaining(prayer.time, prayer.nameKey)}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
