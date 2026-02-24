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
                className="relative w-[92%] max-w-[380px] overflow-hidden animate-scale-in"
                style={{
                    background: 'var(--bg-glass)',
                    backdropFilter: 'blur(16px)',
                    borderRadius: 'var(--radius-xl)',
                    border: '1px solid var(--glass-border)',
                    boxShadow: 'var(--shadow-lg)',
                    maxHeight: '85vh',
                    display: 'flex',
                    flexDirection: 'column'
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header with Background */}
                <div style={{
                    height: '110px',
                    background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.9)), url('https://source.unsplash.com/featured/?${country.name},landscape')`,
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

                    <div className="absolute bottom-sm left-sm right-sm flex items-end justify-between gap-sm">
                        <div style={{ flex: 1 }}>
                            <h2 style={{ color: 'white', margin: 0, fontSize: '1.25rem', fontWeight: 800, lineHeight: 1.2 }}>
                                {isAr ? country.nameAr : country.name}
                            </h2>
                            <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                {isAr ? country.cityAr : country.city}
                            </span>
                        </div>
                        <span style={{ fontSize: '2.5rem', lineHeight: 1, filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }}>{country.flag}</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-md overflow-y-auto" style={{ flex: 1 }}>
                    <div className="flex flex-col gap-md">

                        {/* Quick Stats Grid */}
                        <div className="grid grid-2 gap-xs">
                            <div className="p-sm flex flex-col justify-center text-center" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)', minHeight: '70px' }}>
                                <div className="flex items-center justify-center gap-xs mb-xs text-muted">
                                    <Clock size={14} weight="duotone" />
                                    <span style={{ fontSize: '0.7rem' }}>{t('worldClock.timeDiff')}</span>
                                </div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--accent-gold)' }}>{diffText}</div>
                            </div>
                            <div className="p-sm flex flex-col justify-center text-center" style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)', minHeight: '70px' }}>
                                <div className="flex items-center justify-center gap-xs mb-xs text-muted">
                                    <Globe size={14} weight="duotone" />
                                    <span style={{ fontSize: '0.7rem' }}>{t('worldClock.location')}</span>
                                </div>
                                <div style={{ fontSize: '0.85rem', fontWeight: 600, lineHeight: 1.2 }}>{detail ? (isAr ? detail.locationAr : detail.location) : country.continent}</div>
                            </div>
                        </div>

                        {/* Muslim Population & Safety */}
                        <div className="flex flex-col gap-xs">
                            <h3 className="flex items-center gap-sm" style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                                <Users size={18} weight="duotone" color="var(--accent-gold)" />
                                {t('worldClock.modal.community')}
                            </h3>
                            <div className="p-sm" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                                <div className="flex justify-between items-start mb-sm mt-xs">
                                    <span className="text-muted" style={{ fontSize: '0.75rem', lineHeight: 1.2 }}>{t('worldClock.modal.approxPopulation')}</span>
                                    <span style={{ fontWeight: 600, fontSize: '0.85rem', textAlign: isAr ? 'left' : 'right' }}>{detail ? (isAr ? detail.muslimPopulationAr : detail.muslimPopulation) : '---'}</span>
                                </div>
                                <div className="flex flex-col gap-xs">
                                    <div className="flex justify-between text-muted" style={{ fontSize: '0.75rem' }}>
                                        <div className="flex items-center gap-xs">
                                            <ShieldCheck size={14} weight="fill" color="#10b981" />
                                            <span>{t('worldClock.modal.safetyLevel')}</span>
                                        </div>
                                        <span style={{ color: '#10b981', fontWeight: 600 }}>{detail ? detail.muslimSafetyPercentage : 0}%</span>
                                    </div>
                                    <div style={{ height: 4, background: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' }}>
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
                        <div className="flex flex-col gap-xs">
                            <h3 className="flex items-center gap-sm" style={{ fontSize: '0.9rem', fontWeight: 700 }}>
                                <Crown size={18} weight="duotone" color="var(--accent-gold)" />
                                {t('worldClock.modal.governance')}
                            </h3>
                            <div className="flex flex-col gap-sm p-sm" style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--glass-border)' }}>
                                <div className="flex items-center gap-sm">
                                    <div className="p-xs" style={{ background: 'rgba(var(--accent-gold-rgb), 0.1)', borderRadius: 'var(--radius-md)' }}>
                                        <Buildings size={20} weight="duotone" color="var(--accent-gold)" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>{t('worldClock.modal.governanceType')}</div>
                                        <div style={{ fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.3 }}>{detail ? (isAr ? detail.governanceAr : detail.governance) : '---'}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-sm">
                                    <div className="p-xs" style={{ background: 'rgba(var(--accent-gold-rgb), 0.1)', borderRadius: 'var(--radius-md)' }}>
                                        <Crown size={20} weight="duotone" color="var(--accent-gold)" />
                                    </div>
                                    <div className="flex-1">
                                        <div className="text-muted" style={{ fontSize: '0.7rem' }}>{t('worldClock.modal.ruler')}</div>
                                        <div style={{ fontWeight: 600, fontSize: '0.85rem', lineHeight: 1.3 }}>{detail ? (isAr ? detail.rulerAr : detail.ruler) : '---'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-xs">
                            {detail ? (isAr ? detail.citiesAr : detail.cities).map(city => (
                                <span key={city} className="chip" style={{ fontSize: '0.75rem', padding: '4px 12px' }}>
                                    {city}
                                </span>
                            )) : <span className="text-muted">{t('worldClock.modal.noData')}</span>}
                        </div>
                    </div>

                    {/* Notable Features */}
                    <div className="flex flex-col gap-sm">
                        <h3 className="flex items-center gap-sm" style={{ fontSize: '1rem', fontWeight: 700 }}>
                            <Globe size={20} weight="duotone" color="var(--accent-gold)" />
                            {isAr ? 'بماذا تتميز هذه الدولة؟' : 'Notable Features'}
                        </h3>
                        <div className="flex flex-wrap gap-xs">
                            {detail?.features ? (isAr ? detail.featuresAr : detail.features).map(feature => (
                                <span key={feature} className="chip" style={{
                                    fontSize: '0.75rem',
                                    padding: '4px 10px',
                                    background: 'rgba(var(--accent-gold-rgb), 0.1)',
                                    borderColor: 'var(--accent-gold-soft)',
                                    color: 'var(--accent-gold)',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {feature}
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
    );
}
