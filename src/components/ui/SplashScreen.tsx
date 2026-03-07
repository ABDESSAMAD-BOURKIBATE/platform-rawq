import { useState, useEffect, useCallback } from 'react';
import rawqLogo from '../../assets/rawq_logo.jpg';

const SPLASH_KEY = 'rawq-splash-seen';

export function SplashScreen({ onComplete }: { onComplete: () => void }) {
    const [phase, setPhase] = useState<'enter' | 'show' | 'exit'>('enter');

    const handleFinish = useCallback(() => {
        setPhase('exit');
        setTimeout(() => {
            sessionStorage.setItem(SPLASH_KEY, 'true');
            onComplete();
        }, 900);
    }, [onComplete]);

    useEffect(() => {
        // Phase timeline
        const t1 = setTimeout(() => setPhase('show'), 100);
        const t2 = setTimeout(() => handleFinish(), 5000);
        return () => { clearTimeout(t1); clearTimeout(t2); };
    }, [handleFinish]);

    return (
        <div
            className={`splash-overlay ${phase}`}
            onClick={phase === 'show' ? handleFinish : undefined}
        >
            {/* Animated geometric pattern rings */}
            <div className="splash-ring splash-ring-1" />
            <div className="splash-ring splash-ring-2" />
            <div className="splash-ring splash-ring-3" />

            {/* Particle stars */}
            <div className="splash-particles">
                {Array.from({ length: 12 }).map((_, i) => (
                    <span
                        key={i}
                        className="splash-particle"
                        style={{
                            '--angle': `${i * 30}deg`,
                            '--delay': `${i * 0.15}s`,
                            '--distance': `${100 + Math.random() * 80}px`,
                        } as React.CSSProperties}
                    />
                ))}
            </div>

            {/* Central content */}
            <div className="splash-content">
                {/* Logo with glow */}
                <div className="splash-logo-wrap">
                    <div className="splash-logo-glow" />
                    <div className="splash-logo-ring">
                        <img src={rawqLogo} alt="رَوْقٌ" className="splash-logo-img" />
                    </div>
                </div>

                {/* Bismillah */}
                <p className="splash-bismillah">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>

                {/* App name */}
                <h1 className="splash-title">رَوْقٌ</h1>

                {/* Decorative line */}
                <div className="splash-divider">
                    <span className="splash-divider-ornament">✦</span>
                </div>

                {/* Subtitle */}
                <p className="splash-subtitle">
                    المجمع القرآني للشيخ عبد الحفيظ بوركيبات
                </p>
                <p className="splash-quote">
                    صدقة جارية ومنارة لتلاوة كتاب الله
                </p>

                {/* Skip hint */}
                <p className="splash-skip">اضغط للمتابعة</p>
            </div>
        </div>
    );
}

/** Returns true if splash was already seen this session */
export function wasSplashSeen(): boolean {
    return sessionStorage.getItem(SPLASH_KEY) === 'true';
}
