import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, MapPin, Sun, SunHorizon, Moon, CloudSun } from '@phosphor-icons/react';

// Prayer time calculation (simplified but accurate)
function toRadians(d: number) { return d * Math.PI / 180; }
function toDegrees(r: number) { return r * 180 / Math.PI; }

function sunPosition(jd: number) {
    const D = jd - 2451545.0;
    const g = (357.529 + 0.98560028 * D) % 360;
    const q = (280.459 + 0.98564736 * D) % 360;
    const L = (q + 1.915 * Math.sin(toRadians(g)) + 0.020 * Math.sin(toRadians(2 * g))) % 360;
    const e = 23.439 - 0.00000036 * D;
    const RA = toDegrees(Math.atan2(Math.cos(toRadians(e)) * Math.sin(toRadians(L)), Math.cos(toRadians(L))));
    const d = toDegrees(Math.asin(Math.sin(toRadians(e)) * Math.sin(toRadians(L))));
    return { RA, d };
}

function julianDate(year: number, month: number, day: number) {
    if (month <= 2) { year--; month += 12; }
    const A = Math.floor(year / 100);
    const B = 2 - A + Math.floor(A / 4);
    return Math.floor(365.25 * (year + 4716)) + Math.floor(30.6001 * (month + 1)) + day + B - 1524.5;
}

function computePrayerTimes(lat: number, lng: number, date: Date, tz: number) {
    const y = date.getFullYear(), m = date.getMonth() + 1, d = date.getDate();
    const jd = julianDate(y, m, d);
    const { d: decl } = sunPosition(jd);

    const dtr = toRadians(decl);
    const lr = toRadians(lat);

    // Equation of time (approximate)
    const D = jd - 2451545.0;
    const g = toRadians((357.529 + 0.98560028 * D) % 360);
    const q = (280.459 + 0.98564736 * D) % 360;
    const L = (q + 1.915 * Math.sin(g) + 0.020 * Math.sin(2 * g)) % 360;
    const e = toRadians(23.439 - 0.00000036 * D);
    const RA = toDegrees(Math.atan2(Math.cos(e) * Math.sin(toRadians(L)), Math.cos(toRadians(L))));
    const EqT = (q - RA) / 15;

    const Dhuhr = 12 + tz - lng / 15 - EqT;

    function hourAngle(angle: number) {
        const cosH = (Math.sin(toRadians(angle)) - Math.sin(lr) * Math.sin(dtr)) / (Math.cos(lr) * Math.cos(dtr));
        return toDegrees(Math.acos(Math.max(-1, Math.min(1, cosH)))) / 15;
    }

    const fajrHA = hourAngle(-18);
    const sunriseHA = hourAngle(-0.833);
    const asrFactor = 1; // Shafi'i / Standard
    const asrAltitude = toDegrees(Math.atan(1 / (asrFactor + Math.tan(Math.abs(lr - dtr)))));
    const asrHA = hourAngle(asrAltitude);
    const maghribHA = hourAngle(-0.833);
    const ishaHA = hourAngle(-17);

    const normalize24 = (h: number) => {
        let result = h % 24;
        if (result < 0) result += 24;
        return result;
    };

    const toTime = (h: number) => {
        const hNorm = normalize24(h);
        const hh = Math.floor(hNorm);
        const mm = Math.floor((hNorm - hh) * 60);
        return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
    };

    return {
        fajr: toTime(Dhuhr - fajrHA),
        sunrise: toTime(Dhuhr - sunriseHA),
        dhuhr: toTime(Dhuhr),
        asr: toTime(Dhuhr + asrHA),
        maghrib: toTime(Dhuhr + maghribHA),
        isha: toTime(Dhuhr + ishaHA),
    };
}

interface PrayerTime {
    name: string;
    nameAr: string;
    time: string;
    icon: typeof Sun;
    color: string;
}

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
                        { name: 'Fajr', nameAr: 'الفجر', time: times.fajr, icon: Moon, color: '#6B7DB3' },
                        { name: 'Sunrise', nameAr: 'الشروق', time: times.sunrise, icon: SunHorizon, color: '#E8A55A' },
                        { name: 'Dhuhr', nameAr: 'الظهر', time: times.dhuhr, icon: Sun, color: '#D4AF37' },
                        { name: 'Asr', nameAr: 'العصر', time: times.asr, icon: CloudSun, color: '#E88B5A' },
                        { name: 'Maghrib', nameAr: 'المغرب', time: times.maghrib, icon: SunHorizon, color: '#C66B3D' },
                        { name: 'Isha', nameAr: 'العشاء', time: times.isha, icon: Moon, color: '#4A5A8A' },
                    ];

                    setPrayers(prayerList);
                    setLoading(false);

                    // Determine next prayer
                    const now = `${String(new Date().getHours()).padStart(2, '0')}:${String(new Date().getMinutes()).padStart(2, '0')}`;
                    const next = prayerList.find(p => p.time > now && p.name !== 'Sunrise');
                    setNextPrayer(next?.nameAr || prayerList[0].nameAr);

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
        return currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
            .replace('AM', 'ص')
            .replace('PM', 'م');
    };

    return (
        <div className="flex flex-col gap-lg">
            {/* Header */}
            <div className="animate-fade-in">
                <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-xs)' }}>
                    <Clock size={24} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 8 }} color="var(--accent-gold)" weight="duotone" />
                    {' '}مواقيت الصلاة
                </h1>
            </div>

            {/* Current Time */}
            <div className="card-gold text-center animate-scale-in" style={{ padding: 'var(--space-lg)' }}>
                <div className="text-muted flex items-center justify-center gap-xs" style={{ fontSize: '0.85rem', marginBottom: 4 }}>
                    <p>الوقت الحالي</p>
                    {city && (
                        <>
                            <span>في</span>
                            <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{city}</span>
                            <MapPin size={14} weight="fill" color="var(--accent-gold)" />
                        </>
                    )}
                </div>
                <p className="text-gold glow-text" style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'var(--font-heading)', letterSpacing: 2 }}>
                    {formatCurrentTime()}
                </p>
                {nextPrayer && (
                    <p style={{ fontSize: '0.85rem', marginTop: 'var(--space-sm)' }}>
                        الصلاة القادمة: <span className="text-gold" style={{ fontWeight: 600 }}>{nextPrayer}</span>
                    </p>
                )}
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
                        const isNext = prayer.nameAr === nextPrayer;
                        return (
                            <div
                                key={prayer.name}
                                className={`card flex items-center gap-md animate-slide-up stagger-${i + 1}`}
                                style={{
                                    padding: 'var(--space-md)',
                                    border: isNext ? '1.5px solid var(--accent-gold)' : undefined,
                                    background: isNext ? 'var(--accent-gold-soft)' : undefined,
                                }}
                            >
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
                                    <p style={{ fontWeight: 600, fontSize: '1rem' }}>{prayer.nameAr}</p>
                                    <p className="text-muted" style={{ fontSize: '0.75rem' }}>{prayer.name}</p>
                                </div>

                                {/* Time */}
                                <span style={{
                                    fontSize: '1.1rem', fontWeight: 700, fontFamily: 'var(--font-heading)',
                                    color: isNext ? 'var(--accent-gold)' : 'var(--text)',
                                }}>
                                    {prayer.time}
                                </span>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
