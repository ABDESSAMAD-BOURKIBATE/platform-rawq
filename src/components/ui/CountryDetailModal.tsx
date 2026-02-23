import { X, MapPin, Users, ShieldCheck, Crown, Clock, Buildings, Globe } from '@phosphor-icons/react';
import { useTranslation } from 'react-i18next';
import { CountryDetail } from '../../data/worldTimesData';

interface CountryDetailModalProps {
    country: any; // The country object from WorldClockPage
    detail: CountryDetail | undefined;
    onClose: () => void;
}

export function CountryDetailModal({ country, detail, onClose }: CountryDetailModalProps) {
    const { t, i18n } = useTranslation();
    const isAr = i18n.language === 'ar';

    if (!country) return null;

    // Calculate time difference
    let diffText = '---';
    try {
        const now = new Date();
        const targetTimeStr = now.toLocaleTimeString('en-US', { timeZone: country.timezone, hour12: false });
        const localHour = now.getHours();
        const targetHour = parseInt(targetTimeStr.split(':')[0]);
        const diff = targetHour - localHour;
        diffText = Number.isNaN(diff) ? '---' : diff === 0 ? t('worldClock.noDiff') : diff > 0 ? `+${diff} ${t('worldClock.hours')}` : `${diff} ${t('worldClock.hours')}`;
    } catch (e) {
        console.error("Timezone error:", e);
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-md animate-fade-in"
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg overflow-hidden animate-scale-in"
                style={{
                    background: 'var(--bg-glass)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: 'var(--radius-2xl)',
                    border: '1px solid var(--glass-border)',
                    boxShadow: 'var(--shadow-lg)',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header with Background */}
                <div style={{
                    height: '140px',
                    background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.8)), url('https://source.unsplash.com/featured/?${country.name},landscape')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    flexShrink: 0
                }}>
                    <button
                        onClick={onClose}
                        className="absolute top-md right-md p-xs rounded-full"
                        style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', cursor: 'pointer' }}
                    >
                        <X size={20} weight="bold" />
                    </button>

                    <div className="absolute bottom-md left-md right-md flex items-end gap-md">
                        <span style={{ fontSize: '3rem', lineHeight: 1 }}>{country.flag}</span>
                        <div>
                            <h2 style={{ color: 'white', margin: 0, fontSize: '1.5rem', fontWeight: 800 }}>
                                {isAr ? country.nameAr : country.name}
                            </h2>
                            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: 1 }}>
                                {isAr ? country.cityAr : country.city}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-lg overflow-y-auto" style={{ flex: 1 }}>
                    <div className="flex flex-col gap-lg">

                        {/* Quick Stats Grid */}
                        <div className="grid grid-2 gap-md">
                            <div className="p-md" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                                <div className="flex items-center gap-sm mb-xs text-muted">
                                    <Clock size={16} weight="duotone" />
                                    <span style={{ fontSize: '0.75rem' }}>{t('worldClock.timeDiff')}</span>
                                </div>
                                <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--accent-gold)' }}>{diffText}</div>
                            </div>
                            <div className="p-md" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                                <div className="flex items-center gap-sm mb-xs text-muted">
                                    <Globe size={16} weight="duotone" />
                                    <span style={{ fontSize: '0.75rem' }}>{t('worldClock.location')}</span>
                                </div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{detail ? (isAr ? detail.locationAr : detail.location) : country.continent}</div>
                            </div>
                        </div>

                        {/* Muslim Population & Safety */}
                        <div className="flex flex-col gap-sm">
                            <h3 className="flex items-center gap-sm" style={{ fontSize: '1rem', fontWeight: 700 }}>
                                <Users size={20} weight="duotone" color="var(--accent-gold)" />
                                {t('worldClock.modal.community')}
                            </h3>
                            <div className="p-md" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--glass-border)' }}>
                                <div className="flex justify-between items-center mb-sm">
                                    <span className="text-muted" style={{ fontSize: '0.85rem' }}>{t('worldClock.modal.approxPopulation')}</span>
                                    <span style={{ fontWeight: 600 }}>{detail ? (isAr ? detail.muslimPopulationAr : detail.muslimPopulation) : '---'}</span>
                                </div>
                                <div className="flex flex-col gap-xs">
                                    <div className="flex justify-between text-muted" style={{ fontSize: '0.8rem' }}>
                                        <div className="flex items-center gap-xs">
                                            <ShieldCheck size={14} weight="fill" color="#10b981" />
                                            <span>{t('worldClock.modal.safetyLevel')}</span>
                                        </div>
                                        <span style={{ color: '#10b981', fontWeight: 600 }}>{detail ? detail.muslimSafetyPercentage : 0}%</span>
                                    </div>
                                    <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 3, overflow: 'hidden' }}>
                                        <div style={{
                                            height: '100%',
                                            width: `${detail ? detail.muslimSafetyPercentage : 0}%`,
                                            background: 'linear-gradient(to right, #059669, #10b981)',
                                            transition: 'width 1s ease-out'
                                        }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Governance & Ruler */}
                        <div className="flex flex-col gap-sm">
                            <h3 className="flex items-center gap-sm" style={{ fontSize: '1rem', fontWeight: 700 }}>
                                <Crown size={20} weight="duotone" color="var(--accent-gold)" />
                                {t('worldClock.modal.governance')}
                            </h3>
                            <div className="flex flex-col gap-md p-md" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--glass-border)' }}>
                                <div className="flex items-start gap-md">
                                    <div className="p-xs" style={{ background: 'rgba(var(--accent-gold-rgb), 0.1)', borderRadius: 'var(--radius-md)' }}>
                                        <Buildings size={24} weight="duotone" color="var(--accent-gold)" />
                                    </div>
                                    <div>
                                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{t('worldClock.modal.governanceType')}</div>
                                        <div style={{ fontWeight: 600 }}>{detail ? (isAr ? detail.governanceAr : detail.governance) : '---'}</div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-md">
                                    <div className="p-xs" style={{ background: 'rgba(var(--accent-gold-rgb), 0.1)', borderRadius: 'var(--radius-md)' }}>
                                        <Globe size={24} weight="duotone" color="var(--accent-gold)" />
                                    </div>
                                    <div>
                                        <div className="text-muted" style={{ fontSize: '0.75rem' }}>{t('worldClock.modal.ruler')}</div>
                                        <div style={{ fontWeight: 600 }}>{detail ? (isAr ? detail.rulerAr : detail.ruler) : '---'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Cities */}
                        <div className="flex flex-col gap-sm">
                            <h3 className="flex items-center gap-sm" style={{ fontSize: '1rem', fontWeight: 700 }}>
                                <MapPin size={20} weight="duotone" color="var(--accent-gold)" />
                                {t('worldClock.modal.majorCities')}
                            </h3>
                            <div className="flex flex-wrap gap-xs">
                                {detail ? (isAr ? detail.citiesAr : detail.cities).map(city => (
                                    <span key={city} className="chip" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
                                        {city}
                                    </span>
                                )) : <span className="text-muted">{t('worldClock.modal.noData')}</span>}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Footer */}
                <div className="p-md text-center" style={{ borderTop: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.02)' }}>
                    <button
                        onClick={onClose}
                        className="btn btn-primary w-full"
                        style={{ borderRadius: 'var(--radius-lg)' }}
                    >
                        {t('worldClock.modal.close')}
                    </button>
                </div>
            </div>
        </div>
    );
}
