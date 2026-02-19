import { useTranslation } from 'react-i18next';
import { Moon, Sun, Monitor, Globe, Info, Heart } from '@phosphor-icons/react';
import { useThemeStore } from '../store/useThemeStore';
import { WaqfBanner } from '../components/layout/WaqfBanner';
import type { ThemeMode } from '../lib/types';

const languages = [
    { code: 'ar', name: 'العربية', dir: 'rtl' },
    { code: 'en', name: 'English', dir: 'ltr' },
    { code: 'fr', name: 'Français', dir: 'ltr' },
];

const themeOptions: { mode: ThemeMode; icon: typeof Moon; labelKey: string }[] = [
    { mode: 'dark', icon: Moon, labelKey: 'settings.dark' },
    { mode: 'light', icon: Sun, labelKey: 'settings.light' },
    { mode: 'system', icon: Monitor, labelKey: 'settings.system' },
];

export function SettingsPage() {
    const { t, i18n } = useTranslation();
    const { mode, setMode } = useThemeStore();

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

            {/* About */}
            <section className="animate-slide-up stagger-2">
                <h3 className="flex items-center gap-sm" style={{ fontSize: '0.95rem', marginBottom: 'var(--space-md)' }}>
                    <Info size={24} color="var(--accent-gold)" weight="duotone" />
                    {t('settings.about')}
                </h3>
                <div className="card" style={{ padding: 'var(--space-lg)' }}>
                    <div className="text-center" style={{ marginBottom: 'var(--space-lg)' }}>
                        <h2 className="text-gold glow-text" style={{
                            fontFamily: 'var(--font-quran)', fontSize: '2rem', marginBottom: 'var(--space-xs)',
                        }}>
                            رَوْقٌ
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
            <section className="animate-slide-up stagger-3">
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
