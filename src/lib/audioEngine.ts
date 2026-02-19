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
            this.audio.addEventListener('error', this.onError.bind(this));

            // Subscribe to store changes for playback rate
            useAudioStore.subscribe((state, prevState) => {
                if (state.playbackRate !== prevState.playbackRate && this.audio) {
                    this.audio.playbackRate = state.playbackRate;
                }
            });
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

        if (state.repeatMode === 'ayah' && state.currentSurah && state.currentAyah) {
            // Replay the same ayah
            this.playAyah(state.currentSurah, state.currentAyah);
            return;
        }

        if (state.currentSurah && state.currentAyah) {
            // Ayah playback mode

            // Note: In a real app we'd need to know how many ayahs are in the surah
            // to stop or wrap around. For now, try playing the next ayah.
            this.playAyah(state.currentSurah, state.currentAyah + 1);
        } else if (state.currentSurah && !state.currentAyah) {
            // Full Surah playback mode
            if (state.repeatMode === 'surah' || state.repeatMode === 'ayah') {
                // If repeat is on, replay the surah (repeat ayah doesn't make sense for full surah but we treat it as repeat)
                this.playSurah(state.currentSurah, state.moshaf, state.reciter);
            } else {
                // Advance to next surah
                if (state.currentSurah < 114) {
                    this.playSurah(state.currentSurah + 1, state.moshaf, state.reciter);
                } else {
                    useAudioStore.getState().stop();
                }
            }
        }
    };

    private onError = (e: Event) => {
        console.error("Audio Engine Error:", e, this.audio?.error);
        // Do not stop immediately so we can debug the UI
        // useAudioStore.getState().stop();
    };



    playAyah(surahNumber: number, ayahNumber: number) {
        if (!this.audio) return;

        const url = getAyahAudioUrl(this.currentReciterFolder, surahNumber, ayahNumber);
        this.audio.src = url;
        this.audio.playbackRate = useAudioStore.getState().playbackRate;
        this.audio.play().catch((e) => {
            console.error("playAyah: Auto-play blocked or audio not found:", e);
            // useAudioStore.getState().stop();
        });
        useAudioStore.getState().play(surahNumber, ayahNumber);
    }

    playSurah(surahNumber: number, moshaf?: { server: string; name: string } | null, reciter?: { name: string; id: string; image?: string } | null) {
        if (!this.audio) return;

        const state = useAudioStore.getState();
        const activeMoshaf = moshaf || state.moshaf;

        if (!activeMoshaf) return;

        const paddedSurah = String(surahNumber).padStart(3, '0');
        const url = `${activeMoshaf.server}${paddedSurah}.mp3`;

        this.audio.src = url;
        this.audio.playbackRate = state.playbackRate;
        this.audio.play().catch((e) => {
            console.error("playSurah: Playback failed", e);
            // useAudioStore.getState().stop();
        });

        // When playing a full surah, currentAyah is null
        // We bypass the standard play method to explicitly set ayah to null
        useAudioStore.setState({
            isPlaying: true,
            type: 'quran',
            currentSurah: surahNumber,
            currentAyah: null,
            progress: 0,
            reciter: reciter || state.reciter,
            moshaf: activeMoshaf,
            radioStation: null
        });
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
        } else if (state.currentSurah) {
            this.resume();
        }
    }

    setPlaybackRate(rate: number) {
        useAudioStore.getState().setPlaybackRate(rate);
    }
}

// Singleton
export const audioEngine = new AudioEngine();
