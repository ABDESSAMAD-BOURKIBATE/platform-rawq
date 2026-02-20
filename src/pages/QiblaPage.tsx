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
    const [permissionNeeded, setPermissionNeeded] = useState(false);

    // Get user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const angle = calculateQibla(pos.coords.latitude, pos.coords.longitude);
                    setQiblaAngle(angle);
                },
                () => setLocationError(t('qibla.locationError')),
                { enableHighAccuracy: true }
            );
        } else {
            setLocationError(t('qibla.browserNotSupported'));
        }
    }, []);

    const handleOrientation = useCallback((e: DeviceOrientationEvent | any) => {
        let alpha = e.webkitCompassHeading;
        if (alpha === undefined || alpha === null) {
            if (e.alpha !== null) {
                // Approximate heading for Android using alpha (may not be absolute true north without deviceorientationabsolute)
                // e.alpha is usually [0, 360) counter-clockwise from N or arbitrary
                // To display an angle that acts like a compass, we just use 360 - alpha.
                alpha = 360 - e.alpha;
            }
        }

        if (alpha !== undefined && alpha !== null && !isNaN(alpha)) {
            setHasCompass(true);
            setHeading(alpha);
        }
    }, []);

    // Check alignment
    useEffect(() => {
        if (qiblaAngle !== null && hasCompass) {
            const diff = Math.abs(((heading - qiblaAngle) + 360) % 360);
            setAligned(diff < 5 || diff > 355);
        }
    }, [heading, qiblaAngle, hasCompass]);

    const startCompass = useCallback(() => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            (DeviceOrientationEvent as any).requestPermission()
                .then((permissionState: string) => {
                    if (permissionState === 'granted') {
                        setPermissionNeeded(false);
                        window.addEventListener('deviceorientation', handleOrientation, true);
                    } else {
                        setLocationError(t('qibla.compassPermissionDenied'));
                    }
                })
                .catch((err: any) => {
                    console.error('Error requesting orientation permission', err);
                    setLocationError(t('qibla.compassActivationError'));
                });
        } else {
            // Android uses deviceorientationabsolute for actual compass directions if supported
            window.addEventListener('deviceorientationabsolute', handleOrientation, true);
            // Fallback for browsers that don't support absolute
            window.addEventListener('deviceorientation', handleOrientation, true);
        }
    }, [handleOrientation]);

    useEffect(() => {
        if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
            // iOS 13+ requires user interaction to call requestPermission
            setPermissionNeeded(true);
        } else {
            startCompass();
        }

        return () => {
            window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
            window.removeEventListener('deviceorientation', handleOrientation, true);
        };
    }, [startCompass, handleOrientation]);

    // Dial rotates so that true north stays at the top relative to screen?
    // Actually, if heading is N (0), dial rotation is 0.
    // If device points East (90), heading is 90. The top of the device is East.
    // So the dial should rotate -90 degrees, so N is on the left, E is on the top.
    const dialRotation = -heading;

    return (
        <div className="flex flex-col items-center gap-xl" style={{ paddingTop: 'var(--space-xl)' }}>
            {/* Header */}
            <div className="text-center animate-fade-in">
                <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-xs)' }}>
                    <Compass size={24} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 8 }} color="var(--accent-gold)" weight="duotone" />
                    {' '}{t('qibla.title')}
                </h1>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                    {t('qibla.description')}
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
                    transition: 'border 0.5s ease',
                    overflow: 'hidden'
                }}
            >
                {/* Rotating Dial Container */}
                <div style={{
                    position: 'absolute', width: '100%', height: '100%',
                    transition: 'transform 0.1s linear',
                    transform: `rotate(${dialRotation}deg)`,
                }}>
                    {/* Compass ring markers */}
                    {['N', 'E', 'S', 'W'].map((dir, i) => (
                        <span
                            key={dir}
                            style={{
                                position: 'absolute', fontSize: '1rem', fontWeight: 700,
                                color: dir === 'N' ? 'var(--accent-gold)' : 'var(--text-muted)',
                                transform: `rotate(${heading}deg)`, // Keep letters upright
                                transition: 'transform 0.1s linear',
                                ...(i === 0 ? { top: 12, left: '50%', marginLeft: '-0.5rem' }
                                    : i === 1 ? { right: 12, top: '50%', marginTop: '-0.5rem' }
                                        : i === 2 ? { bottom: 12, left: '50%', marginLeft: '-0.5rem' }
                                            : { left: 12, top: '50%', marginTop: '-0.5rem' }),
                            }}
                        >
                            {dir}
                        </span>
                    ))}

                    {/* Qibla needle relative to North on the dial */}
                    {qiblaAngle !== null && (
                        <div
                            style={{
                                position: 'absolute', width: '100%', height: '100%',
                                transform: `rotate(${qiblaAngle}deg)`,
                            }}
                        >
                            <div style={{
                                position: 'absolute', top: 35, left: '50%', transform: 'translateX(-50%)',
                                display: 'flex', flexDirection: 'column', alignItems: 'center',
                            }}>
                                <NavigationArrow size={28} color="var(--accent-gold)" weight="fill" style={{ transform: 'rotate(45deg)' }} />
                                <span style={{
                                    fontSize: '0.65rem', color: 'var(--accent-gold)',
                                    fontWeight: 700, marginTop: 2,
                                    transform: `rotate(${-qiblaAngle - dialRotation}deg)`
                                }}>
                                    {t('qibla.title')}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Center Kaaba icon - Doesn't rotate */}
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
                        {t('common.retry')}
                    </button>
                </div>
            ) : (
                <div className="card-gold text-center animate-slide-up" style={{ padding: 'var(--space-lg)', width: '100%', maxWidth: 320 }}>
                    {qiblaAngle !== null && (
                        <p style={{ fontSize: '0.9rem' }}>
                            {t('qibla.direction')} <span className="text-gold" style={{ fontWeight: 700 }}>{Math.round(qiblaAngle)}°</span>
                        </p>
                    )}

                    {permissionNeeded && !hasCompass && (
                        <button
                            className="btn btn-primary w-full"
                            style={{ marginTop: 'var(--space-sm)' }}
                            onClick={startCompass}
                        >
                            {t('qibla.activateCompass')}
                        </button>
                    )}

                    {!permissionNeeded && !hasCompass && (
                        <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: 'var(--space-xs)' }}>
                            {t('qibla.moveDevice')}
                        </p>
                    )}

                    {aligned && (
                        <p className="text-gold glow-text" style={{ fontWeight: 700, marginTop: 'var(--space-sm)', fontSize: '1.1rem' }}>
                            {t('qibla.aligned')}
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
