import { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Compass, NavigationArrow, ArrowCounterClockwise } from '@phosphor-icons/react';

// Kaaba coordinates
const KAABA_LAT = 21.4225;
const KAABA_LNG = 39.8262;

function toRadians(deg: number) { return deg * (Math.PI / 180); }
function toDegrees(rad: number) { return rad * (180 / Math.PI); }

function calculateQibla(lat: number, lng: number): number {
    const latR = toRadians(lat);
    const lngR = toRadians(lng);
    const kaabaLatR = toRadians(KAABA_LAT);
    const kaabaLngR = toRadians(KAABA_LNG);
    const dLng = kaabaLngR - lngR;
    const x = Math.sin(dLng);
    const y = Math.cos(latR) * Math.tan(kaabaLatR) - Math.sin(latR) * Math.cos(dLng);
    let bearing = toDegrees(Math.atan2(x, y));
    return (bearing + 360) % 360;
}

export function QiblaPage() {
    const { t } = useTranslation();
    const [qiblaAngle, setQiblaAngle] = useState<number | null>(null);
    const [heading, setHeading] = useState(0);
    const [locationError, setLocationError] = useState<string | null>(null);
    const [hasCompass, setHasCompass] = useState(false);
    const [aligned, setAligned] = useState(false);

    // Get user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const angle = calculateQibla(pos.coords.latitude, pos.coords.longitude);
                    setQiblaAngle(angle);
                },
                () => setLocationError('تعذر الوصول إلى موقعك'),
                { enableHighAccuracy: true }
            );
        } else {
            setLocationError('الموقع غير مدعوم في هذا المتصفح');
        }
    }, []);

    // Device orientation (compass)
    useEffect(() => {
        const handler = (e: DeviceOrientationEvent) => {
            const alpha = (e as any).webkitCompassHeading ?? e.alpha;
            if (alpha !== null && alpha !== undefined) {
                setHasCompass(true);
                setHeading(alpha);
                if (qiblaAngle !== null) {
                    const diff = Math.abs(((alpha - qiblaAngle) + 360) % 360);
                    setAligned(diff < 5 || diff > 355);
                }
            }
        };

        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            (DeviceOrientationEvent as any).requestPermission().then((permission: string) => {
                if (permission === 'granted') {
                    window.addEventListener('deviceorientation', handler, true);
                }
            });
        } else {
            window.addEventListener('deviceorientation', handler, true);
        }

        return () => window.removeEventListener('deviceorientation', handler, true);
    }, [qiblaAngle]);

    const needleRotation = qiblaAngle !== null ? qiblaAngle - heading : 0;

    return (
        <div className="flex flex-col items-center gap-xl" style={{ paddingTop: 'var(--space-xl)' }}>
            {/* Header */}
            <div className="text-center animate-fade-in">
                <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-xs)' }}>
                    <Compass size={24} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 8 }} color="var(--accent-gold)" weight="duotone" />
                    {' '}القبلة
                </h1>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                    اتجاه القبلة من موقعك الحالي
                </p>
            </div>

            {/* Compass */}
            <div
                className={`animate-scale-in${aligned ? ' animate-pulse-gold' : ''}`}
                style={{
                    width: 280, height: 280, borderRadius: '50%',
                    background: 'var(--bg-card)', border: `3px solid ${aligned ? 'var(--accent-gold)' : 'var(--border-strong)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    position: 'relative', boxShadow: aligned ? '0 0 40px var(--accent-gold-glow)' : 'var(--shadow-lg)',
                    transition: 'all 0.5s ease',
                }}
            >
                {/* Compass ring markers */}
                {['N', 'E', 'S', 'W'].map((dir, i) => (
                    <span
                        key={dir}
                        style={{
                            position: 'absolute', fontSize: '0.75rem', fontWeight: 700,
                            color: dir === 'N' ? 'var(--accent-gold)' : 'var(--text-muted)',
                            ...(i === 0 ? { top: 12 } : i === 1 ? { right: 12 } : i === 2 ? { bottom: 12 } : { left: 12 }),
                        }}
                    >
                        {dir}
                    </span>
                ))}

                {/* Qibla needle */}
                <div
                    style={{
                        position: 'absolute', width: '100%', height: '100%',
                        transition: 'transform 0.3s ease',
                        transform: `rotate(${needleRotation}deg)`,
                    }}
                >
                    <div style={{
                        position: 'absolute', top: 20, left: '50%', transform: 'translateX(-50%)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                    }}>
                        <NavigationArrow size={28} color="var(--accent-gold)" weight="fill" />
                        <span style={{ fontSize: '0.65rem', color: 'var(--accent-gold)', fontWeight: 700, marginTop: 2 }}>
                            القبلة
                        </span>
                    </div>
                </div>

                {/* Center Kaaba icon */}
                <div style={{
                    width: 48, height: 48, borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-gold-soft)', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem',
                    zIndex: 1,
                }}>
                    🕋
                </div>
            </div>

            {/* Info */}
            {locationError ? (
                <div className="card text-center" style={{ padding: 'var(--space-lg)' }}>
                    <p style={{ color: '#e57373' }}>{locationError}</p>
                    <button
                        className="btn btn-primary"
                        style={{ marginTop: 'var(--space-md)' }}
                        onClick={() => window.location.reload()}
                    >
                        <ArrowCounterClockwise size={16} weight="bold" />
                        إعادة المحاولة
                    </button>
                </div>
            ) : (
                <div className="card-gold text-center animate-slide-up" style={{ padding: 'var(--space-lg)', width: '100%', maxWidth: 320 }}>
                    {qiblaAngle !== null && (
                        <p style={{ fontSize: '0.9rem' }}>
                            الاتجاه: <span className="text-gold" style={{ fontWeight: 700 }}>{Math.round(qiblaAngle)}°</span>
                        </p>
                    )}
                    {!hasCompass && (
                        <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: 'var(--space-xs)' }}>
                            حرّك جهازك لتفعيل البوصلة
                        </p>
                    )}
                    {aligned && (
                        <p className="text-gold glow-text" style={{ fontWeight: 700, marginTop: 'var(--space-sm)', fontSize: '1.1rem' }}>
                            ✓ أنت في اتجاه القبلة
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
