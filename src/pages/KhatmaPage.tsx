import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Target, PlayCircle, BookOpenText, CheckCircle, ClockCountdown, CalendarCheck, XCircle } from '@phosphor-icons/react';
import { useKhatmaStore } from '../store/useKhatmaStore';
import { useQuranStore } from '../store/useQuranStore';

const TOTAL_QURAN_PAGES = 604;

export function KhatmaPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { targetDays, startDate, readPages, dailyWirdPages, setupKhatma, resetKhatma } = useKhatmaStore();

    const [isSetupOpen, setIsSetupOpen] = useState(false);
    const [inputDays, setInputDays] = useState(30);

    const isKhatmaActive = targetDays !== null;

    // Progress Calculations
    const readCount = readPages.length;
    const progressPercent = Math.round((readCount / TOTAL_QURAN_PAGES) * 100);

    const daysElapsed = useMemo(() => {
        if (!startDate) return 0;
        const start = new Date(startDate);
        const now = new Date();
        const diff = now.getTime() - start.getTime();
        return Math.floor(diff / (1000 * 60 * 60 * 24));
    }, [startDate]);

    const remainingPages = Math.max(0, TOTAL_QURAN_PAGES - readCount);
    const remainingDays = targetDays ? Math.max(0, targetDays - daysElapsed) : 0;

    // Calculate expected pages by today
    const expectedPagesByToday = daysElapsed * dailyWirdPages;
    const isBehind = readCount < expectedPagesByToday;

    const handleStartKhatma = () => {
        if (inputDays > 0) {
            setupKhatma(inputDays);
            setIsSetupOpen(false);
        }
    };

    const handleContinueReading = () => {
        // Find the first unread page
        let nextPage = 1;
        for (let i = 1; i <= TOTAL_QURAN_PAGES; i++) {
            if (!readPages.includes(i)) {
                nextPage = i;
                break;
            }
        }

        // Update Quran store current page
        useQuranStore.getState().setCurrentPage(nextPage);
        navigate('/mushaf');
    };

    return (
        <div className="flex flex-col gap-xl">
            {/* Header */}
            <header className="animate-fade-in" style={{
                background: 'linear-gradient(135deg, #16213e 0%, #0f3460 100%)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-xl) var(--space-lg)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div className="flex items-center gap-sm mb-sm">
                        <div style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)' }}>
                            <Target size={28} weight="duotone" color="#D4AF37" />
                        </div>
                        <h1 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
                            {t('khatma.title', 'ختمة القرآن')}
                        </h1>
                    </div>
                    <p style={{ color: '#A7D8FF', fontSize: '1rem', maxWidth: '80%' }}>
                        {t('khatma.subtitle', 'حدد هدفك، تتبع وردك اليومي، واختم القرآن في الوقت المحدد.')}
                    </p>
                </div>
            </header>

            {!isKhatmaActive ? (
                /* No Active Khatma State */
                <div className="animate-slide-up" style={{
                    background: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-2xl) var(--space-lg)',
                    textAlign: 'center',
                    border: '1px dashed var(--border)'
                }}>
                    <div style={{
                        width: '80px', height: '80px', margin: '0 auto var(--space-lg)',
                        background: 'rgba(88, 168, 155, 0.1)', borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Target size={40} color="#58A89B" weight="duotone" />
                    </div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 'var(--space-sm)' }}>
                        {t('khatma.notStarted', 'لم تبدأ ختمة بعد')}
                    </h2>
                    <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-xl)' }}>
                        {t('khatma.setTargetPrompt', 'حدد عدد الأيام التي تريد أن تختم القرآن فيها.')}
                    </p>
                    <button
                        onClick={() => setIsSetupOpen(true)}
                        style={{
                            background: 'var(--accent)',
                            color: 'white',
                            padding: '12px 24px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '1rem',
                            fontWeight: 600,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            boxShadow: 'var(--shadow-md)'
                        }}
                    >
                        <PlayCircle size={20} weight="fill" />
                        {t('khatma.startNew', 'ابدأ ختمة جديدة')}
                    </button>
                </div>
            ) : (
                /* Active Khatma Dashboard */
                <div className="flex flex-col gap-lg animate-slide-up">

                    {/* Progress Card */}
                    <div style={{
                        background: 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-xl)',
                        padding: 'var(--space-xl)',
                        border: '1px solid var(--border)',
                        textAlign: 'center',
                        position: 'relative'
                    }}>
                        <button
                            onClick={resetKhatma}
                            style={{ position: 'absolute', top: 'var(--space-md)', left: 'var(--space-md)', color: 'var(--text-muted)' }}
                            title={t('khatma.reset', 'إلغاء الختمة')}
                        >
                            <XCircle size={24} weight="duotone" />
                        </button>

                        <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 'var(--space-lg)' }}>
                            {t('khatma.overallProgress', 'التقدم الكلي')}
                        </h3>

                        {/* Circular Progress Simulator (Simplified as a big number and bar) */}
                        <div style={{ display: 'inline-block', position: 'relative', marginBottom: 'var(--space-lg)' }}>
                            <div style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--accent)' }}>
                                {progressPercent}%
                            </div>
                            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                {readCount} / {TOTAL_QURAN_PAGES} {t('khatma.pages', 'صفحة')}
                            </div>
                        </div>

                        {/* Progress Bar */}
                        <div style={{ height: '8px', background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                            <div style={{
                                width: `${progressPercent}%`, height: '100%',
                                background: 'linear-gradient(90deg, var(--accent), var(--accent-gold))',
                                borderRadius: 'var(--radius-full)'
                            }} />
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-2 gap-md">
                        <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                            <div className="flex items-center gap-xs text-muted mb-xs">
                                <CalendarCheck size={18} /> {t('khatma.dailyWird', 'الورد اليومي')}
                            </div>
                            <p style={{ fontSize: '1.4rem', fontWeight: 700 }}>
                                {dailyWirdPages} <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>{t('khatma.pages', 'صفحة')}</span>
                            </p>
                        </div>
                        <div style={{ background: 'var(--bg-secondary)', padding: 'var(--space-md)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border)' }}>
                            <div className="flex items-center gap-xs text-muted mb-xs">
                                <ClockCountdown size={18} /> {t('khatma.remainingDays', 'الأيام المتبقية')}
                            </div>
                            <p style={{ fontSize: '1.4rem', fontWeight: 700, color: remainingDays < 5 ? '#e94560' : 'inherit' }}>
                                {remainingDays} <span style={{ fontSize: '0.9rem', fontWeight: 400 }}>{t('khatma.days', 'يوم')}</span>
                            </p>
                        </div>
                    </div>

                    {/* Status Alert */}
                    {isBehind && (
                        <div style={{
                            background: 'rgba(233,69,96,0.1)', border: '1px solid rgba(233,69,96,0.3)',
                            padding: 'var(--space-md)', borderRadius: 'var(--radius-lg)',
                            color: '#e94560', display: 'flex', alignItems: 'center', gap: 'var(--space-sm)'
                        }}>
                            <ClockCountdown size={20} weight="fill" />
                            <span style={{ fontWeight: 600 }}>{t('khatma.behindSchedule', 'أنت متأخر عن الورد المحدد. حاول تعويض ما فاتك.')}</span>
                        </div>
                    )}

                    {/* Action Button */}
                    <button
                        onClick={handleContinueReading}
                        style={{
                            background: 'var(--accent)', color: 'white',
                            padding: '16px', borderRadius: 'var(--radius-lg)',
                            fontSize: '1.1rem', fontWeight: 700, display: 'flex',
                            alignItems: 'center', justifyContent: 'center', gap: '8px',
                            boxShadow: 'var(--shadow-md)', marginTop: 'var(--space-sm)'
                        }}
                    >
                        <BookOpenText size={24} weight="fill" />
                        {t('khatma.continueReading', 'مواصلة القراءة')}
                    </button>
                </div>
            )}

            {/* Setup Modal */}
            {isSetupOpen && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 9999,
                    background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: 'var(--space-md)'
                }}>
                    <div className="animate-scale-in" style={{
                        background: 'var(--bg-primary)',
                        padding: 'var(--space-xl)',
                        borderRadius: 'var(--radius-xl)',
                        width: '100%', maxWidth: '400px',
                        boxShadow: 'var(--shadow-xl)',
                        border: '1px solid var(--border)'
                    }}>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: 'var(--space-md)' }}>
                            {t('khatma.setupTitle', 'إعداد الختمة')}
                        </h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-lg)' }}>
                            {t('khatma.setupDesc', 'كم يوماً تريد أن تستغرق في ختم القرآن الكريم؟')}
                        </p>

                        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-md)', marginBottom: 'var(--space-xl)' }}>
                            <input
                                type="range"
                                min="3" max="365"
                                value={inputDays}
                                onChange={(e) => setInputDays(Number(e.target.value))}
                                style={{ flex: 1, accentColor: 'var(--accent)' }}
                            />
                            <div style={{
                                minWidth: '60px', textAlign: 'center',
                                padding: '8px', background: 'var(--bg-secondary)',
                                borderRadius: 'var(--radius-md)', fontWeight: 700
                            }}>
                                {inputDays} {t('khatma.days', 'يوم')}
                            </div>
                        </div>

                        <div className="flex items-center" style={{ padding: '12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-xl)' }}>
                            <div style={{ flex: 1 }}>
                                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{t('khatma.estimatedWird', 'الورد اليومي المقدر:')}</span>
                                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                                    {Math.ceil(TOTAL_QURAN_PAGES / inputDays)} {t('khatma.pages', 'صفحة')}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-2 gap-md">
                            <button
                                onClick={() => setIsSetupOpen(false)}
                                style={{
                                    padding: '12px', borderRadius: 'var(--radius-full)', background: 'transparent',
                                    border: '1px solid var(--border)', fontWeight: 600, color: 'var(--text-secondary)'
                                }}
                            >
                                {t('app.cancel', 'إلغاء')}
                            </button>
                            <button
                                onClick={handleStartKhatma}
                                style={{
                                    padding: '12px', borderRadius: 'var(--radius-full)', background: 'var(--accent)',
                                    color: 'white', fontWeight: 600, boxShadow: 'var(--shadow-md)'
                                }}
                            >
                                {t('khatma.start', 'بدء')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
