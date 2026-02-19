import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { AudioPlayer } from '../audio/AudioPlayer';
import { useAudioStore } from '../../store/useAudioStore';
import { useQuranStore } from '../../store/useQuranStore';
import { useEffect } from 'react';

export function AppLayout() {
    const currentSurah = useAudioStore((s) => s.currentSurah);
    const radioStation = useAudioStore((s) => s.radioStation);
    const updateLastLogin = useQuranStore((s) => s.updateLastLogin);

    useEffect(() => {
        updateLastLogin();
    }, [updateLastLogin]);

    // Show player if we have an active track (even if paused)
    const showPlayer = currentSurah !== null || radioStation !== null;

    return (
        <div className="app-layout">
            <div className="pattern-bg" />
            <main className="page container" style={{ paddingBottom: showPlayer ? 'calc(var(--bottom-nav-height) + 80px)' : undefined }}>
                <Outlet />
            </main>
            {showPlayer && <AudioPlayer />}
            <BottomNav />
        </div>
    );
}
