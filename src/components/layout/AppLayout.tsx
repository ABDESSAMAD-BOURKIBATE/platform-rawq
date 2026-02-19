import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { AudioPlayer } from '../audio/AudioPlayer';
import { useAudioStore } from '../../store/useAudioStore';

export function AppLayout() {
    const isPlaying = useAudioStore((s) => s.isPlaying);
    const currentAyah = useAudioStore((s) => s.currentAyah);
    const reciter = useAudioStore((s) => s.reciter);

    // Show player if playing or if we have an active track (even if paused)
    const showPlayer = isPlaying || (currentAyah !== null && reciter !== null);

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
