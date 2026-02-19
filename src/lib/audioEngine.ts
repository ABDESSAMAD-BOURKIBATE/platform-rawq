import { getAyahAudioUrl, DEFAULT_RECITER_FOLDER } from '../api/everyayah';
import { useAudioStore } from '../store/useAudioStore';

class AudioEngine {
    private audio: HTMLAudioElement | null = null;
    private currentReciterFolder: string = DEFAULT_RECITER_FOLDER;

    constructor() {
        if (typeof window !== 'undefined') {
            this.audio = new Audio();
            this.audio.addEventListener('timeupdate', this.onTimeUpdate);
            this.audio.addEventListener('loadedmetadata', this.onLoadedMetadata);
            this.audio.addEventListener('ended', this.onEnded);
            this.audio.addEventListener('error', this.onError);
        }
    }

    private onTimeUpdate = () => {
        if (this.audio) {
            useAudioStore.getState().setProgress(this.audio.currentTime);
        }
    };

    private onLoadedMetadata = () => {
        if (this.audio) {
            useAudioStore.getState().setDuration(this.audio.duration);
        }
    };

    private onEnded = () => {
        const state = useAudioStore.getState();
        if (state.currentSurah && state.currentAyah) {
            // Auto-advance to next ayah
            this.playAyah(state.currentSurah, state.currentAyah + 1);
        }
    };

    private onError = () => {
        useAudioStore.getState().stop();
    };



    playAyah(surahNumber: number, ayahNumber: number) {
        if (!this.audio) return;

        const url = getAyahAudioUrl(this.currentReciterFolder, surahNumber, ayahNumber);
        this.audio.src = url;
        this.audio.play().catch(() => {
            // Auto-play may be blocked, or audio file doesn't exist
            useAudioStore.getState().stop();
        });
        useAudioStore.getState().play(surahNumber, ayahNumber);
    }

    pause() {
        this.audio?.pause();
        useAudioStore.getState().pause();
    }

    resume() {
        this.audio?.play();
        const state = useAudioStore.getState();
        if (state.currentSurah && state.currentAyah) {
            useAudioStore.setState({ isPlaying: true });
        }
    }

    stop() {
        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.audio.src = '';
        }
        useAudioStore.getState().stop();
    }

    seek(time: number) {
        if (this.audio) {
            this.audio.currentTime = time;
        }
    }

    togglePlayPause() {
        const state = useAudioStore.getState();
        if (state.isPlaying) {
            this.pause();
        } else if (state.currentSurah && state.currentAyah) {
            this.resume();
        }
    }
}

// Singleton
export const audioEngine = new AudioEngine();
