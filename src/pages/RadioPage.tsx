import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Radio, Play, Pause, SpeakerHigh, Spinner } from '@phosphor-icons/react';
import { fetchRadios } from '../api/mp3quran';
import type { RadioStation } from '../lib/types';
import { useAudioStore } from '../store/useAudioStore';
import { audioEngine } from '../lib/audioEngine';

export function RadioPage() {
    const { t, i18n } = useTranslation();
    const [stations, setStations] = useState<RadioStation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const {
        playRadio, pause, resume, stop,
        isPlaying, radioStation, type
    } = useAudioStore();

    useEffect(() => {
        fetchRadios(i18n.language)
            .then((data) => {
                setStations(data);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message);
                setLoading(false);
            });
    }, [i18n.language]);

    const handlePlay = (station: RadioStation) => {
        console.log("Playing station:", station.name, station.url);
        if (radioStation?.id === station.id && type === 'radio') {
            if (isPlaying) audioEngine.pause();
            else audioEngine.resume();
        } else {
            audioEngine.playRadio(station);
        }
    };

    // Random colors for station cards
    const stationColors = ['#D4AF37', '#58A89B', '#7B9EBD', '#E8A55A', '#B07D3A', '#6B7DB3', '#C66B3D', '#8B5E83'];

    return (
        <div className="flex flex-col gap-lg">
            {/* Header */}
            <div className="animate-fade-in">
                <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-xs)' }}>
                    <Radio size={24} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 8 }} color="var(--accent-gold)" weight="duotone" />
                    {' '}إذاعات القرآن الكريم
                </h1>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                    استمع مباشرة لإذاعات القرآن من جميع أنحاء العالم
                </p>
            </div>

            {/* Now Playing Banner */}
            {radioStation && isPlaying && type === 'radio' && (
                <div className="card-gold animate-scale-in flex items-center gap-md" style={{ padding: 'var(--space-md)' }}>
                    <div className="animate-pulse-gold" style={{
                        width: 40, height: 40, borderRadius: 'var(--radius-full)',
                        background: 'var(--accent-gold)', display: 'flex',
                        alignItems: 'center', justifyContent: 'center',
                    }}>
                        <SpeakerHigh size={20} color="#0B1C1A" weight="fill" />
                    </div>
                    <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>يُبث الآن</p>
                        <p style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--accent-gold)' }}>
                            {radioStation.name}
                        </p>
                    </div>
                    <button
                        className="btn btn-icon"
                        style={{ background: 'var(--accent-gold)', color: '#0B1C1A' }}
                        onClick={() => audioEngine.pause()}
                    >
                        <Pause size={18} weight="fill" />
                    </button>
                </div>
            )}

            {/* Loading */}
            {loading ? (
                <div className="flex flex-col gap-sm">
                    {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="card flex items-center gap-md" style={{ padding: 'var(--space-md)' }}>
                            <div className="skeleton skeleton-circle" style={{ width: 48, height: 48 }} />
                            <div style={{ flex: 1 }}>
                                <div className="skeleton skeleton-text" style={{ width: '70%' }} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="empty-state">
                    <p>{error}</p>
                    <button className="btn btn-primary" onClick={() => {
                        setLoading(true);
                        setError(null);
                        fetchRadios(i18n.language)
                            .then(d => { setStations(d); setLoading(false); })
                            .catch(e => { setError(e.message); setLoading(false); });
                    }}>
                        {t('common.retry')}
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-sm">
                    <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                        {stations.length} إذاعة متاحة
                    </p>
                    {stations.map((station, i) => {
                        const isCurrent = radioStation?.id === station.id && type === 'radio';
                        const color = stationColors[i % stationColors.length];
                        return (
                            <button
                                key={station.id}
                                className={`card flex items-center gap-md animate-slide-up stagger-${Math.min(i % 6 + 1, 6)}`}
                                style={{
                                    padding: 'var(--space-md)',
                                    textAlign: 'start',
                                    border: isCurrent ? '1.5px solid var(--accent-gold)' : undefined,
                                    background: isCurrent ? 'var(--accent-gold-soft)' : undefined,
                                }}
                                onClick={() => handlePlay(station)}
                            >
                                {/* Icon */}
                                <div style={{
                                    width: 48, height: 48, borderRadius: 'var(--radius-full)',
                                    background: isCurrent ? 'var(--accent-gold)' : `${color}20`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    transition: 'all 0.3s ease',
                                }}>
                                    {isCurrent && isPlaying ? (
                                        <Pause size={20} color="#0B1C1A" weight="fill" />
                                    ) : (
                                        <Play size={20} color={isCurrent ? '#0B1C1A' : color} weight="fill" />
                                    )}
                                </div>

                                {/* Station Name */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{
                                        fontWeight: 600, fontSize: '0.95rem',
                                        color: isCurrent ? 'var(--accent-gold)' : 'var(--text)',
                                    }}>
                                        {station.name}
                                    </p>
                                </div>

                                {/* Live indicator */}
                                {isCurrent && isPlaying && (
                                    <div className="flex items-center gap-xs">
                                        <div style={{
                                            width: 8, height: 8, borderRadius: '50%',
                                            background: '#4CAF50', animation: 'pulse-gold 1.5s infinite',
                                        }} />
                                        <span style={{ fontSize: '0.7rem', color: '#4CAF50', fontWeight: 600 }}>LIVE</span>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
