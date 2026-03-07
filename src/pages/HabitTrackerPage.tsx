import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Circle, ArrowRight, ArrowLeft, BookOpenText, Moon, Mosque, Sun, CloudMoon, HandHeart, Heart, DownloadSimple } from '@phosphor-icons/react';
import { useHabitsStore, PrayerChoice } from '../store/useHabitsStore';
import { toPng } from 'html-to-image';

const PRAYERS: { key: PrayerChoice; labelKey: string }[] = [
    { key: 'fajr', labelKey: 'prayer.fajr' },
    { key: 'dhuhr', labelKey: 'prayer.dhuhr' },
    { key: 'asr', labelKey: 'prayer.asr' },
    { key: 'maghrib', labelKey: 'prayer.maghrib' },
    { key: 'isha', labelKey: 'prayer.isha' },
];

function formatDateKey(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function HabitTrackerPage() {
    const { t, i18n } = useTranslation();
    const { getOrCreateDay, togglePrayer, toggleWird, toggleFasting, toggleMorningAdhkar, toggleEveningAdhkar, toggleCharity, toggleGoodDeed, setNote } = useHabitsStore();

    const dashboardRef = useRef<HTMLDivElement>(null);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isExporting, setIsExporting] = useState(false);

    const dateStr = formatDateKey(currentDate);
    const todayData = getOrCreateDay(dateStr);

    const isRTL = i18n.dir() === 'rtl';

    // Navigation handlers
    const goToPreviousDay = () => {
        const prev = new Date(currentDate);
        prev.setDate(prev.getDate() - 1);
        setCurrentDate(prev);
    };

    const goToNextDay = () => {
        const next = new Date(currentDate);
        next.setDate(next.getDate() + 1);
        // Prevent going into the future
        if (next <= new Date()) {
            setCurrentDate(next);
        }
    };

    const isToday = formatDateKey(currentDate) === formatDateKey(new Date());

    const formattedDateLabel = new Intl.DateTimeFormat(i18n.language, {
        weekday: 'long',
        month: 'long',
        day: 'numeric'
    }).format(currentDate);

    // Calculate score
    const prayersDone = Object.values(todayData.prayers).filter(Boolean).length;
    let score = Math.round((
        (prayersDone * 100 / PRAYERS.length) +
        (todayData.wird ? 100 : 0) +
        (todayData.fasting ? 100 : 0) +
        (todayData.morningAdhkar ? 100 : 0) +
        (todayData.eveningAdhkar ? 100 : 0) +
        (todayData.charity ? 100 : 0) +
        (todayData.goodDeed ? 100 : 0)
    ) / 7); // Divide by total number of tracked habits

    const downloadImage = async () => {
        if (!dashboardRef.current) return;
        try {
            setIsExporting(true);
            // Wait for a small delay so UI updates if needed
            await new Promise(r => setTimeout(r, 100));

            const dataUrl = await toPng(dashboardRef.current, {
                cacheBust: true,
                style: { background: '#1c1c1c', padding: '20px' }
            });
            const link = document.createElement('a');
            link.download = `rawq-habits-${dateStr}.png`;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to export image', err);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="flex flex-col gap-xl" ref={dashboardRef} style={isExporting ? { padding: 'var(--space-md)' } : {}}>
            {/* Header */}
            <header className="animate-fade-in" style={{
                background: 'linear-gradient(135deg, #141E30 0%, #243B55 100%)',
                borderRadius: 'var(--radius-xl)',
                padding: 'var(--space-xl) var(--space-lg)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)'
            }}>
                <div style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div className="flex items-center gap-sm mb-sm">
                            <div style={{ padding: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)' }}>
                                <CheckCircle size={28} weight="duotone" color="#58A89B" />
                            </div>
                            <h1 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', fontWeight: 800 }}>
                                {t('habits.title', 'متعقب العادات')}
                            </h1>
                        </div>
                        <p style={{ color: '#A7D8FF', fontSize: '1rem', maxWidth: '80%' }}>
                            {t('habits.subtitle', 'حافظ على صلاتك، وردك، وصيامك، لتنل رضى الرحمن.')}
                        </p>
                    </div>

                    {!isExporting && (
                        <button
                            onClick={downloadImage}
                            title={t('habits.download', 'تنزيل')}
                            style={{
                                background: 'rgba(255,255,255,0.2)', padding: 'var(--space-sm) var(--space-md)',
                                borderRadius: 'var(--radius-full)', color: 'white', display: 'flex', alignItems: 'center', gap: '8px',
                                fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'all 0.2s'
                            }}
                        >
                            <DownloadSimple size={20} />
                            <span className="hidden sm:inline">{t('habits.download', 'حفظ كصورة')}</span>
                        </button>
                    )}
                </div>
            </header>

            {/* Date Navigation */}
            <div className="flex items-center justify-between animate-slide-up" style={{
                background: 'var(--bg-secondary)', padding: 'var(--space-md)',
                borderRadius: 'var(--radius-full)', border: '1px solid var(--border)',
                boxShadow: 'var(--shadow-sm)'
            }}>
                <button
                    onClick={isRTL ? goToNextDay : goToPreviousDay}
                    disabled={isRTL ? isToday : false}
                    style={{
                        padding: '8px', borderRadius: '50%', background: 'transparent',
                        opacity: (isRTL && isToday) ? 0.3 : 1, cursor: (isRTL && isToday) ? 'not-allowed' : 'pointer'
                    }}
                >
                    <ArrowRight size={24} color="var(--text-primary)" />
                </button>

                <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                    {isToday ? t('habits.today', 'اليوم') + ' - ' : ''}{formattedDateLabel}
                </div>

                <button
                    onClick={isRTL ? goToPreviousDay : goToNextDay}
                    disabled={!isRTL && isToday}
                    style={{
                        padding: '8px', borderRadius: '50%', background: 'transparent',
                        opacity: (!isRTL && isToday) ? 0.3 : 1, cursor: (!isRTL && isToday) ? 'not-allowed' : 'pointer'
                    }}
                >
                    <ArrowLeft size={24} color="var(--text-primary)" />
                </button>
            </div>

            {/* Dashboard grid */}
            <div className="grid gap-lg">

                {/* Score */}
                <div className="animate-slide-up stagger-1" style={{
                    background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-lg)', border: '1px solid var(--border)',
                    textAlign: 'center'
                }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 'var(--space-xs)' }}>{t('habits.dailyScore', 'إنجاز اليوم')}</h3>
                    <div style={{ fontSize: '3.5rem', fontWeight: 900, color: 'var(--accent)', lineHeight: 1 }}>
                        {score}%
                    </div>
                    <div style={{
                        width: '100%', height: '8px', background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-full)', marginTop: 'var(--space-md)', overflow: 'hidden'
                    }}>
                        <div style={{
                            height: '100%', width: `${score}%`,
                            background: 'linear-gradient(90deg, #58A89B, #A7D8FF)',
                            borderRadius: 'var(--radius-full)', transition: 'width 0.5s ease'
                        }} />
                    </div>
                </div>

                {/* Prayers Checklist */}
                <div className="animate-slide-up stagger-2" style={{
                    background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-lg)', border: '1px solid var(--border)'
                }}>
                    <div className="flex items-center gap-sm mb-md">
                        <Mosque size={24} color="#58A89B" weight="duotone" />
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 700 }}>{t('habits.prayers', 'الصلوات الخمس')}</h3>
                    </div>
                    <div style={{ display: 'grid', gap: 'var(--space-sm)' }}>
                        {PRAYERS.map((prayer) => {
                            const isDone = todayData.prayers[prayer.key];
                            return (
                                <div
                                    key={prayer.key}
                                    onClick={() => togglePrayer(dateStr, prayer.key)}
                                    style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: 'var(--space-md)', borderRadius: 'var(--radius-lg)',
                                        background: isDone ? 'rgba(88, 168, 155, 0.1)' : 'var(--bg-tertiary)',
                                        border: `1px solid ${isDone ? 'rgba(88, 168, 155, 0.3)' : 'transparent'}`,
                                        cursor: 'pointer', transition: 'all 0.2s ease'
                                    }}
                                >
                                    <span style={{ fontSize: '1.1rem', fontWeight: isDone ? 700 : 500, color: isDone ? 'var(--accent)' : 'var(--text-primary)' }}>
                                        {t(prayer.labelKey)}
                                    </span>
                                    {isDone
                                        ? <CheckCircle size={28} weight="fill" color="#58A89B" />
                                        : <Circle size={28} weight="regular" color="var(--text-muted)" />
                                    }
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Other Habits: Grid of smaller cards */}
                <div className="grid gap-md animate-slide-up stagger-3" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))' }}>

                    {/* Wird */}
                    <div onClick={() => toggleWird(dateStr)} style={{
                        background: todayData.wird ? 'rgba(212, 175, 55, 0.1)' : 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-lg) var(--space-sm)', border: `1px solid ${todayData.wird ? 'rgba(212, 175, 55, 0.3)' : 'var(--border)'}`, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s ease'
                    }}>
                        <div style={{ width: '48px', height: '48px', margin: '0 auto var(--space-md)', background: todayData.wird ? 'rgba(212, 175, 55, 0.2)' : 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <BookOpenText size={24} color={todayData.wird ? '#D4AF37' : 'var(--text-muted)'} weight={todayData.wird ? "duotone" : "regular"} />
                        </div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: todayData.wird ? '#D4AF37' : 'var(--text-primary)' }}>{t('habits.wird', 'الورد القرآني')}</h4>
                        {todayData.wird ? <CheckCircle size={24} weight="fill" color="#D4AF37" style={{ margin: '0 auto' }} /> : <Circle size={24} weight="regular" color="var(--text-muted)" style={{ margin: '0 auto' }} />}
                    </div>

                    {/* Fasting */}
                    <div onClick={() => toggleFasting(dateStr)} style={{
                        background: todayData.fasting ? 'rgba(123, 158, 189, 0.1)' : 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-lg) var(--space-sm)', border: `1px solid ${todayData.fasting ? 'rgba(123, 158, 189, 0.3)' : 'var(--border)'}`, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s ease'
                    }}>
                        <div style={{ width: '48px', height: '48px', margin: '0 auto var(--space-md)', background: todayData.fasting ? 'rgba(123, 158, 189, 0.2)' : 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Moon size={24} color={todayData.fasting ? '#7B9EBD' : 'var(--text-muted)'} weight={todayData.fasting ? "duotone" : "regular"} />
                        </div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: todayData.fasting ? '#7B9EBD' : 'var(--text-primary)' }}>{t('habits.fasting', 'الصيام')}</h4>
                        {todayData.fasting ? <CheckCircle size={24} weight="fill" color="#7B9EBD" style={{ margin: '0 auto' }} /> : <Circle size={24} weight="regular" color="var(--text-muted)" style={{ margin: '0 auto' }} />}
                    </div>

                    {/* Morning Adhkar */}
                    <div onClick={() => toggleMorningAdhkar(dateStr)} style={{
                        background: todayData.morningAdhkar ? 'rgba(246, 173, 85, 0.1)' : 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-lg) var(--space-sm)', border: `1px solid ${todayData.morningAdhkar ? 'rgba(246, 173, 85, 0.3)' : 'var(--border)'}`, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s ease'
                    }}>
                        <div style={{ width: '48px', height: '48px', margin: '0 auto var(--space-md)', background: todayData.morningAdhkar ? 'rgba(246, 173, 85, 0.2)' : 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Sun size={24} color={todayData.morningAdhkar ? '#F6AD55' : 'var(--text-muted)'} weight={todayData.morningAdhkar ? "duotone" : "regular"} />
                        </div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: todayData.morningAdhkar ? '#F6AD55' : 'var(--text-primary)' }}>{t('habits.morningAdhkar', 'أذكار الصباح')}</h4>
                        {todayData.morningAdhkar ? <CheckCircle size={24} weight="fill" color="#F6AD55" style={{ margin: '0 auto' }} /> : <Circle size={24} weight="regular" color="var(--text-muted)" style={{ margin: '0 auto' }} />}
                    </div>

                    {/* Evening Adhkar */}
                    <div onClick={() => toggleEveningAdhkar(dateStr)} style={{
                        background: todayData.eveningAdhkar ? 'rgba(102, 126, 234, 0.1)' : 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-lg) var(--space-sm)', border: `1px solid ${todayData.eveningAdhkar ? 'rgba(102, 126, 234, 0.3)' : 'var(--border)'}`, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s ease'
                    }}>
                        <div style={{ width: '48px', height: '48px', margin: '0 auto var(--space-md)', background: todayData.eveningAdhkar ? 'rgba(102, 126, 234, 0.2)' : 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <CloudMoon size={24} color={todayData.eveningAdhkar ? '#667EEA' : 'var(--text-muted)'} weight={todayData.eveningAdhkar ? "duotone" : "regular"} />
                        </div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: todayData.eveningAdhkar ? '#667EEA' : 'var(--text-primary)' }}>{t('habits.eveningAdhkar', 'أذكار المساء')}</h4>
                        {todayData.eveningAdhkar ? <CheckCircle size={24} weight="fill" color="#667EEA" style={{ margin: '0 auto' }} /> : <Circle size={24} weight="regular" color="var(--text-muted)" style={{ margin: '0 auto' }} />}
                    </div>

                    {/* Charity */}
                    <div onClick={() => toggleCharity(dateStr)} style={{
                        background: todayData.charity ? 'rgba(72, 187, 120, 0.1)' : 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-lg) var(--space-sm)', border: `1px solid ${todayData.charity ? 'rgba(72, 187, 120, 0.3)' : 'var(--border)'}`, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s ease'
                    }}>
                        <div style={{ width: '48px', height: '48px', margin: '0 auto var(--space-md)', background: todayData.charity ? 'rgba(72, 187, 120, 0.2)' : 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <HandHeart size={24} color={todayData.charity ? '#48BB78' : 'var(--text-muted)'} weight={todayData.charity ? "duotone" : "regular"} />
                        </div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: todayData.charity ? '#48BB78' : 'var(--text-primary)' }}>{t('habits.charity', 'صدقة اليوم')}</h4>
                        {todayData.charity ? <CheckCircle size={24} weight="fill" color="#48BB78" style={{ margin: '0 auto' }} /> : <Circle size={24} weight="regular" color="var(--text-muted)" style={{ margin: '0 auto' }} />}
                    </div>

                    {/* Good Deed */}
                    <div onClick={() => toggleGoodDeed(dateStr)} style={{
                        background: todayData.goodDeed ? 'rgba(237, 100, 166, 0.1)' : 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)', padding: 'var(--space-lg) var(--space-sm)', border: `1px solid ${todayData.goodDeed ? 'rgba(237, 100, 166, 0.3)' : 'var(--border)'}`, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s ease'
                    }}>
                        <div style={{ width: '48px', height: '48px', margin: '0 auto var(--space-md)', background: todayData.goodDeed ? 'rgba(237, 100, 166, 0.2)' : 'var(--bg-tertiary)', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Heart size={24} color={todayData.goodDeed ? '#ED64A6' : 'var(--text-muted)'} weight={todayData.goodDeed ? "duotone" : "regular"} />
                        </div>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '8px', color: todayData.goodDeed ? '#ED64A6' : 'var(--text-primary)' }}>{t('habits.goodDeed', 'فعل الخير')}</h4>
                        {todayData.goodDeed ? <CheckCircle size={24} weight="fill" color="#ED64A6" style={{ margin: '0 auto' }} /> : <Circle size={24} weight="regular" color="var(--text-muted)" style={{ margin: '0 auto' }} />}
                    </div>

                </div>

                {/* Daily Note Area */}
                <div className="animate-slide-up stagger-4" style={{
                    background: 'var(--bg-secondary)', borderRadius: 'var(--radius-xl)',
                    padding: 'var(--space-lg)', border: '1px solid var(--border)'
                }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 'var(--space-md)', color: 'var(--text-primary)' }}>
                        {t('habits.dailyNote', 'ملاحظة اليوم / حدث مميز')}
                    </h3>
                    <textarea
                        value={todayData.note || ''}
                        onChange={(e) => setNote(dateStr, e.target.value)}
                        placeholder={t('habits.notePlaceholder', 'اكتب هنا ما تود تذكره من أحداث هذا اليوم...')}
                        style={{
                            width: '100%', minHeight: '100px', padding: 'var(--space-md)',
                            borderRadius: 'var(--radius-md)', border: '1px solid var(--border)',
                            background: 'var(--bg-primary)', color: 'var(--text-primary)',
                            resize: 'vertical', fontFamily: 'inherit'
                        }}
                    />
                </div>

            </div>
        </div>
    );
}
