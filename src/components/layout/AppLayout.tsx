import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { DesktopNav } from './DesktopNav';
import { PageLoader } from '../ui/PageLoader';
import { InstallPWA } from '../ui/InstallPWA';
import { AudioPlayer } from '../audio/AudioPlayer';
import { useAudioStore } from '../../store/useAudioStore';
import { useQuranStore } from '../../store/useQuranStore';
import { useEffect } from 'react';

export function AppLayout() {
    const currentSurah = useAudioStore((s) => s.currentSurah);
    const radioStation = useAudioStore((s) => s.radioStation);
    const isPlayerMinimized = useAudioStore((s) => s.isPlayerMinimized);
    const setIsPlayerMinimized = useAudioStore((s) => s.setIsPlayerMinimized);
    const updateLastLogin = useQuranStore((s) => s.updateLastLogin);

    useEffect(() => {
        updateLastLogin();
    }, [updateLastLogin]);

    // Logic for showing components
    const hasActiveAudio = currentSurah !== null || radioStation !== null;
    const showPlayer = hasActiveAudio && !isPlayerMinimized;
    const showNav = !hasActiveAudio || isPlayerMinimized;

    return (
        <div className="app-layout">
            <InstallPWA />
            <PageLoader />
            <DesktopNav />
            <div className="pattern-bg" />
            <main className="page container" style={{ paddingBottom: hasActiveAudio ? 'calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px))' : undefined }}>
                <Outlet />
            </main>

            {/* Floating Restore Button when minimized */}
            {hasActiveAudio && isPlayerMinimized && (
                <button
                    onClick={() => setIsPlayerMinimized(false)}
                    className="glass"
                    style={{
                        position: 'fixed',
                        bottom: 'calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px) + 16px)',
                        left: '16px',
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 150,
                        backgroundColor: 'var(--accent-gold)',
                        color: 'var(--bg)',
                        boxShadow: 'var(--shadow-gold)',
                        border: 'none',
                        animation: 'bounceIn 0.5s ease'
                    }}
                    title="إظهار المشغل"
                >
                    <div className="animate-pulse" style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: 'currentColor' }} />
                </button>
            )}

            {showPlayer && <AudioPlayer />}
            {showNav && <BottomNav />}
        </div>
    );
}
