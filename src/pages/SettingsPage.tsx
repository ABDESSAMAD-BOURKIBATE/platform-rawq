import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Moon, Sun, Monitor, Globe, Info, Heart, TextAa, Plus, Minus, Bell, BellSlash, SpeakerHigh, SpeakerSlash } from '@phosphor-icons/react';
import { useThemeStore } from '../store/useThemeStore';
import { useQuranStore } from '../store/useQuranStore';
import { useSettingsStore } from '../store/useSettingsStore';
import { WaqfBanner } from '../components/layout/WaqfBanner';
import type { ThemeMode } from '../lib/types';

const languages = [
    { code: 'ar', name: 'العربية', dir: 'rtl' },
    { code: 'en', name: 'English', dir: 'rtl' },
    { code: 'fr', name: 'Français', dir: 'rtl' },
];

const themeOptions: { mode: ThemeMode; icon: typeof Moon; labelKey: string }[] = [
    { mode: 'dark', icon: Moon, labelKey: 'settings.dark' },
    { mode: 'light', icon: Sun, labelKey: 'settings.light' },
    { mode: 'system', icon: Monitor, labelKey: 'settings.system' },
];

const fontFamilies = [
    { id: 'Amiri', nameKey: 'settings.fonts.amiri', style: 'Amiri, serif' },
    { id: 'Katibeh', nameKey: 'settings.fonts.katibeh', style: 'Katibeh, serif' },
    { id: 'Cairo', nameKey: 'settings.fonts.cairo', style: 'Cairo, sans-serif' },
    { id: 'Tajawal', nameKey: 'settings.fonts.tajawal', style: 'Tajawal, sans-serif' },
    { id: 'KFGQPC', nameKey: 'settings.fonts.kfgqpc', style: 'Amiri, serif' }, // fallback styling, logic will handle text
];

export function SettingsPage() {
    const { t, i18n } = useTranslation();
    const { mode, setMode } = useThemeStore();
    const { fontSize, fontFamily, setFontSize, setFontFamily } = useQuranStore();
    const { adhanEnabled, setAdhanEnabled, adhanAudio, setAdhanAudio } = useSettingsStore();

    const [isPlayingPreview, setIsPlayingPreview] = useState(false);
    const previewAudioRef = useRef<HTMLAudioElement | null>(null);

    const togglePreview = () => {
        if (isPlayingPreview && previewAudioRef.current) {
            previewAudioRef.current.pause();
            previewAudioRef.current.currentTime = 0;
            setIsPlayingPreview(false);
        } else {
            if (!previewAudioRef.current) {
                previewAudioRef.current = new Audio(adhanAudio);
                previewAudioRef.current.onended = () => setIsPlayingPreview(false);
            } else {
                previewAudioRef.current.src = adhanAudio;
            }
            previewAudioRef.current.play().catch(e => console.error(e));
            setIsPlayingPreview(true);
        }
    };

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang);
        const dir = languages.find((l) => l.code === lang)?.dir || 'rtl';
        document.documentElement.setAttribute('dir', dir);
        document.documentElement.setAttribute('lang', lang);
    };

    return (
        <div className="flex flex-col gap-xl">
            {/* Header */}
            <div className="animate-fade-in">
                <h1 style={{ fontSize: '1.5rem' }}>{t('settings.title')}</h1>
            </div>

            {/* Theme */}
            <section className="animate-slide-up">
                <h3 className="flex items-center gap-sm" style={{ fontSize: '0.95rem', marginBottom: 'var(--space-md)' }}>
                    <Moon size={24} color="var(--accent-gold)" weight="duotone" />
                    {t('settings.theme')}
                </h3>
                <div className="flex gap-sm">
                    {themeOptions.map(({ mode: m, icon: Icon, labelKey }) => (
                        <button
                            key={m}
                            className={`card flex flex-col items-center gap-sm${mode === m ? '' : ''}`}
                            style={{
                                flex: 1,
                                padding: 'var(--space-md)',
                                border: mode === m ? '1.5px solid var(--accent-gold)' : undefined,
                                background: mode === m ? 'var(--accent-gold-soft)' : undefined,
                            }}
                            onClick={() => setMode(m)}
                        >
                            <Icon size={28} color={mode === m ? 'var(--accent-gold)' : 'var(--text-muted)'} weight={mode === m ? 'fill' : 'regular'} />
                            <span style={{
                                fontSize: '0.8rem',
                                fontWeight: mode === m ? 600 : 400,
                                color: mode === m ? 'var(--accent-gold)' : 'var(--text-secondary)',
                            }}>
                                {t(labelKey)}
                            </span>
                        </button>
                    ))}
                </div>
            </section>

            {/* Language */}
            <section className="animate-slide-up stagger-1">
                <h3 className="flex items-center gap-sm" style={{ fontSize: '0.95rem', marginBottom: 'var(--space-md)' }}>
                    <Globe size={24} color="var(--accent-gold)" weight="duotone" />
                    {t('settings.language')}
                </h3>
                <div className="flex flex-col gap-xs">
                    {languages.map((lang) => (
                        <button
                            key={lang.code}
                            className="card flex items-center justify-between"
                            style={{
                                padding: 'var(--space-sm) var(--space-md)',
                                border: i18n.language === lang.code ? '1.5px solid var(--accent-gold)' : undefined,
                                background: i18n.language === lang.code ? 'var(--accent-gold-soft)' : undefined,
                            }}
                            onClick={() => changeLanguage(lang.code)}
                        >
                            <span style={{
                                fontWeight: i18n.language === lang.code ? 600 : 400,
                                color: i18n.language === lang.code ? 'var(--accent-gold)' : 'var(--text)',
                            }}>
                                {lang.name}
                            </span>
                            {i18n.language === lang.code && (
                                <div style={{
                                    width: 8, height: 8, borderRadius: 'var(--radius-full)',
                                    background: 'var(--accent-gold)',
                                }} />
                            )}
                        </button>
                    ))}
                </div>
            </section>

            {/* Notifications / Adhan */}
            <section className="animate-slide-up stagger-1">
                <h3 className="flex items-center gap-sm" style={{ fontSize: '0.95rem', marginBottom: 'var(--space-md)' }}>
                    <Bell size={24} color="var(--accent-gold)" weight="duotone" />
                    {t('settings.notifications')}
                </h3>
                <div className="card flex flex-col gap-md" style={{ padding: 'var(--space-md)' }}>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-sm">
                            {adhanEnabled ? (
                                <Bell size={24} color="var(--accent-gold)" />
                            ) : (
                                <BellSlash size={24} color="var(--text-muted)" />
                            )}
                            <div>
                                <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{t('settings.adhanAlerts')}</p>
                                <p className="text-muted" style={{ fontSize: '0.75rem' }}>{t('settings.adhanDesc')}</p>
                            </div>
                        </div>
                        {/* Toggle Switch styling */}
                        <button
                            onClick={() => setAdhanEnabled(!adhanEnabled)}
                            style={{
                                width: '48px',
                                height: '24px',
                                borderRadius: '12px',
                                background: adhanEnabled ? 'var(--accent-gold)' : 'var(--bg-tertiary)',
                                position: 'relative',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            <div style={{
                                width: '20px',
                                height: '20px',
                                borderRadius: '50%',
                                background: '#fff',
                                position: 'absolute',
                                top: '2px',
                                left: adhanEnabled ? '26px' : '2px',
                                transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }} />
                        </button>
                    </div>

                    {adhanEnabled && (
                        <>
                            <div style={{ height: '1px', background: 'var(--border)' }} />
                            <div className="flex flex-wrap items-center justify-between gap-md">
                                <div style={{ flex: '1 1 auto', minWidth: '150px' }}>
                                    <p style={{ fontSize: '0.85rem', fontWeight: 500 }}>{t('settings.adhanAudio')}</p>
                                    <p className="text-muted" style={{ fontSize: '0.75rem' }}>{t('settings.adhanAudioDesc')}</p>
                                </div>
                                <div className="flex items-center gap-sm shrink-0">
                                    <select
                                        value={adhanAudio}
                                        onChange={(e) => {
                                            const newAudio = e.target.value;
                                            setAdhanAudio(newAudio);
                                            if (previewAudioRef.current) {
                                                previewAudioRef.current.pause();
                                                previewAudioRef.current.currentTime = 0;
                                            }
                                            previewAudioRef.current = new Audio(newAudio);
                                            previewAudioRef.current.onended = () => setIsPlayingPreview(false);
                                            previewAudioRef.current.play().catch(err => console.error(err));
                                            setIsPlayingPreview(true);
                                        }}
                                        className="card"
                                        style={{ padding: 'var(--space-xs) var(--space-sm)', fontSize: '0.8rem', background: 'var(--bg-secondary)', border: '1px solid var(--border)' }}
                                    >
                                        <option value="/audio/019--1.mp3">{t('settings.adhanDefault')}</option>
                                    </select>
                                    <button
                                        className="btn btn-secondary btn-icon"
                                        onClick={togglePreview}
                                        style={{ width: '36px', height: '36px' }}
                                    >
                                        {isPlayingPreview ? <SpeakerSlash size={20} /> : <SpeakerHigh size={20} />}
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </section>

            {/* Reading Preferences */}
            <section className="animate-slide-up stagger-2">
                <h3 className="flex items-center gap-sm" style={{ fontSize: '0.95rem', marginBottom: 'var(--space-md)' }}>
                    <TextAa size={24} color="var(--accent-gold)" weight="duotone" />
                    {t('settings.readingPrefs')}
                </h3>

                <div className="card flex flex-col gap-lg" style={{ padding: 'var(--space-md)' }}>
                    {/* Font Size */}
                    <div>
                        <p style={{ fontSize: '0.85rem', marginBottom: 'var(--space-sm)' }}>{t('settings.fontSize')} ({fontSize}px)</p>
                        <div className="flex items-center gap-md">
                            <button
                                className="btn btn-secondary btn-icon"
                                onClick={() => setFontSize(Math.min(fontSize + 2, 60))}
                                disabled={fontSize >= 60}
                            >
                                <Plus size={20} />
                            </button>
                            <div style={{ flex: 1, height: '4px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', position: 'relative' }}>
                                <div style={{
                                    position: 'absolute', top: 0, bottom: 0, left: 0,
                                    width: `${((fontSize - 16) / (60 - 16)) * 100}%`,
                                    background: 'var(--accent-gold)', borderRadius: 'var(--radius-full)'
                                }} />
                            </div>
                            <button
                                className="btn btn-secondary btn-icon"
                                onClick={() => setFontSize(Math.max(fontSize - 2, 16))}
                                disabled={fontSize <= 16}
                            >
                                <Minus size={20} />
                            </button>
                        </div>
                        <p className="text-center mt-md" style={{
                            fontSize: `${fontSize}px`,
                            fontFamily,
                            lineHeight: 1.8,
                            marginTop: 'var(--space-md)',
                            color: 'var(--accent-gold)'
                        }}>
                            {t('settings.bismillah')}
                        </p>
                    </div>

                    <div style={{ height: '1px', background: 'var(--border)' }} />

                    {/* Font Family */}
                    <div>
                        <p style={{ fontSize: '0.85rem', marginBottom: 'var(--space-sm)' }}>{t('settings.fontFamily')}</p>
                        <div className="flex flex-col gap-xs">
                            {fontFamilies.map((font) => (
                                <button
                                    key={font.id}
                                    className="card flex items-center justify-between"
                                    style={{
                                        padding: 'var(--space-sm) var(--space-md)',
                                        border: fontFamily === font.id ? '1.5px solid var(--accent-gold)' : undefined,
                                        background: fontFamily === font.id ? 'var(--accent-gold-soft)' : undefined,
                                    }}
                                    onClick={() => setFontFamily(font.id)}
                                >
                                    <span style={{
                                        fontFamily: font.style,
                                        fontSize: '1.2rem',
                                        color: fontFamily === font.id ? 'var(--accent-gold)' : 'var(--text)',
                                    }}>
                                        {t(font.nameKey)}
                                    </span>
                                    {fontFamily === font.id && (
                                        <div style={{
                                            width: 8, height: 8, borderRadius: 'var(--radius-full)',
                                            background: 'var(--accent-gold)',
                                        }} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* About */}
            <section className="animate-slide-up stagger-3">
                <h3 className="flex items-center gap-sm" style={{ fontSize: '0.95rem', marginBottom: 'var(--space-md)' }}>
                    <Info size={24} color="var(--accent-gold)" weight="duotone" />
                    {t('settings.about')}
                </h3>
                <div className="card" style={{ padding: 'var(--space-lg)' }}>
                    <div className="text-center" style={{ marginBottom: 'var(--space-lg)' }}>
                        <h2 className="text-gold glow-text" style={{
                            fontFamily: 'var(--font-quran)', fontSize: '2rem', marginBottom: 'var(--space-xs)'
                        }}>
                            {t('app.name')}
                        </h2>
                        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                            {t('app.tagline')}
                        </p>
                        <p className="text-muted" style={{ fontSize: '0.75rem', marginTop: 'var(--space-xs)' }}>
                            {t('settings.version')} 1.0.0
                        </p>
                    </div>
                </div>
            </section>

            {/* Waqf */}
            <section className="animate-slide-up stagger-4">
                <h3 className="flex items-center gap-sm" style={{ fontSize: '0.95rem', marginBottom: 'var(--space-md)' }}>
                    <Heart size={24} color="var(--accent-gold)" weight="duotone" />
                    {t('settings.waqf')}
                </h3>
                <div className="card-gold" style={{ padding: 'var(--space-xl)' }}>
                    <WaqfBanner />
                </div>
            </section>
        </div>
    );
}
