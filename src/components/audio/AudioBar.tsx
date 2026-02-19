import { Play, Pause, Stop } from '@phosphor-icons/react';
import { useAudioStore } from '../../store/useAudioStore';
import { audioEngine } from '../../lib/audioEngine';

export function AudioBar() {
    const { isPlaying, currentSurah, currentAyah, progress, duration } = useAudioStore();
    const progressPercent = duration > 0 ? (progress / duration) * 100 : 0;

    if (!currentSurah && !currentAyah) return null;

    return (
        <div className="audio-bar glass">
            <div className="progress-track">
                <div className="progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>

            <button
                className="btn btn-icon"
                onClick={() => audioEngine.togglePlayPause()}
                aria-label={isPlaying ? 'Pause' : 'Play'}
            >
                {isPlaying ? <Pause size={24} weight="fill" /> : <Play size={24} weight="fill" />}
            </button>

            <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                    {currentSurah && `سورة ${currentSurah}`}
                </div>
                <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                    {currentAyah && `آية ${currentAyah}`}
                </div>
            </div>

            <button
                className="btn btn-icon"
                onClick={() => audioEngine.stop()}
                aria-label="Stop"
            >
                <Stop size={24} weight="fill" />
            </button>
        </div>
    );
}
