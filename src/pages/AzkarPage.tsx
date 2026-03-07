
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ArrowLeft, ArrowCounterClockwise, HandTap, CheckCircle,
    Sun, MoonStars, HandsPraying, CaretRight, ArrowUUpLeft, TextAa
} from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { azkarData, morningAzkar, eveningAzkar, Dhikr } from '../data/azkarData';
import { CircularCounter } from '../components/azkar/CircularCounter';

const FONT_OPTIONS = [
    { id: 'amiri', name: 'الأميري', family: "'Amiri', serif" },
    { id: 'cairo', name: 'القاهرة', family: "'Cairo', sans-serif" },
    { id: 'ibm', name: 'آي بي إم', family: "'IBM Plex Sans Arabic', sans-serif" },
    { id: 'naskh', name: 'النسخ', family: "'Noto Naskh Arabic', serif" },
];

type SectionType = 'menu' | 'morning' | 'evening' | 'tasbih';

export function AzkarPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [activeSection, setActiveSection] = useState<SectionType>('menu');
    const [selectedDhikr, setSelectedDhikr] = useState<Dhikr>(azkarData[0]);
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [selectedFont, setSelectedFont] = useState(FONT_OPTIONS[0]);

    const currentCount = counts[selectedDhikr.id] || 0;
    const isCompleted = currentCount >= selectedDhikr.target;

    const handleIncrement = () => {
        const nextCount = (counts[selectedDhikr.id] || 0) + 1;

        setCounts(prev => ({
            ...prev,
            [selectedDhikr.id]: nextCount
        }));

        if ('vibrate' in navigator) {
            // Strong vibration pattern when cycle is completed
            if (nextCount === selectedDhikr.target) {
                navigator.vibrate([100, 50, 100]);
            } else {
                navigator.vibrate(10);
            }
        }
    };

    const handleReset = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCounts(prev => ({ ...prev, [selectedDhikr.id]: 0 }));
    };

    const selectDhikr = (dhikr: Dhikr) => {
        setSelectedDhikr(dhikr);
    };

    const getActiveList = (): Dhikr[] => {
        if (activeSection === 'morning') return morningAzkar;
        if (activeSection === 'evening') return eveningAzkar;
        return azkarData;
    };

    const isMorning = new Date().getHours() < 12;

    // ========================
    // Landing Menu View
    // ========================
    if (activeSection === 'menu') {
        return (
            <div className="page container" style={{ paddingTop: 'var(--space-xl)' }}>
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 'var(--space-2xl)'
                }}>
                    <div />
                    <h1 style={{
                        fontFamily: 'var(--font-heading)', fontSize: '1.4rem', fontWeight: 800,
                        color: 'var(--text)', textAlign: 'center'
                    }}>
                        {t('adhkar.title')}
                    </h1>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            width: '40px', height: '40px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--text-secondary)', cursor: 'pointer'
                        }}
                    >
                        <ArrowLeft size={20} className="rtl:rotate-180" />
                    </button>
                </div>

                {/* Section Cards */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>

                    {/* Morning Azkar Card */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0 }}
                        onClick={() => setActiveSection('morning')}
                        style={{
                            width: '100%',
                            background: isMorning
                                ? 'linear-gradient(135deg, rgba(246,211,101,0.15) 0%, rgba(253,160,133,0.1) 100%)'
                                : 'var(--bg-card)',
                            border: isMorning ? '1px solid rgba(246,211,101,0.3)' : '1px solid var(--border)',
                            borderRadius: 'var(--radius-xl)',
                            padding: 'var(--space-lg) var(--space-xl)',
                            cursor: 'pointer',
                            textAlign: 'right',
                            display: 'flex', alignItems: 'center', gap: 'var(--space-lg)',
                            position: 'relative', overflow: 'hidden',
                            boxShadow: isMorning ? '0 0 30px rgba(246,211,101,0.1)' : 'var(--shadow)',
                        }}
                    >
                        <div style={{
                            width: '56px', height: '56px', minWidth: '56px',
                            borderRadius: 'var(--radius-lg)',
                            background: 'rgba(246,211,101,0.12)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <Sun size={28} weight="duotone" color="#F6D365" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{
                                fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-heading)',
                                color: isMorning ? '#F6D365' : 'var(--text)'
                            }}>
                                {t('adhkar.morningAzkar')}
                            </h3>
                            <p style={{
                                fontSize: '0.82rem', color: 'var(--text-muted)',
                                marginTop: '2px'
                            }}>
                                {t('adhkar.morningDesc')} · {t('adhkar.itemsCount', { count: morningAzkar.length })}
                            </p>
                        </div>
                        <CaretRight size={20} color="var(--text-muted)" className="rtl:rotate-180" />
                    </motion.button>

                    {/* Evening Azkar Card */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.08 }}
                        onClick={() => setActiveSection('evening')}
                        style={{
                            width: '100%',
                            background: !isMorning
                                ? 'linear-gradient(135deg, rgba(167,216,255,0.12) 0%, rgba(137,207,240,0.08) 100%)'
                                : 'var(--bg-card)',
                            border: !isMorning ? '1px solid rgba(167,216,255,0.25)' : '1px solid var(--border)',
                            borderRadius: 'var(--radius-xl)',
                            padding: 'var(--space-lg) var(--space-xl)',
                            cursor: 'pointer',
                            textAlign: 'right',
                            display: 'flex', alignItems: 'center', gap: 'var(--space-lg)',
                            position: 'relative', overflow: 'hidden',
                            boxShadow: !isMorning ? '0 0 30px rgba(167,216,255,0.08)' : 'var(--shadow)',
                        }}
                    >
                        <div style={{
                            width: '56px', height: '56px', minWidth: '56px',
                            borderRadius: 'var(--radius-lg)',
                            background: 'rgba(167,216,255,0.1)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <MoonStars size={28} weight="duotone" color="#A7D8FF" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{
                                fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-heading)',
                                color: !isMorning ? '#A7D8FF' : 'var(--text)'
                            }}>
                                {t('adhkar.eveningAzkar')}
                            </h3>
                            <p style={{
                                fontSize: '0.82rem', color: 'var(--text-muted)',
                                marginTop: '2px'
                            }}>
                                {t('adhkar.eveningDesc')} · {t('adhkar.itemsCount', { count: eveningAzkar.length })}
                            </p>
                        </div>
                        <CaretRight size={20} color="var(--text-muted)" className="rtl:rotate-180" />
                    </motion.button>

                    {/* Tasbih Counter Card */}
                    <motion.button
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.16 }}
                        onClick={() => setActiveSection('tasbih')}
                        style={{
                            width: '100%',
                            background: 'linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.04) 100%)',
                            border: '1px solid var(--accent-gold-soft)',
                            borderRadius: 'var(--radius-xl)',
                            padding: 'var(--space-lg) var(--space-xl)',
                            cursor: 'pointer',
                            textAlign: 'right',
                            display: 'flex', alignItems: 'center', gap: 'var(--space-lg)',
                            position: 'relative', overflow: 'hidden',
                            boxShadow: 'var(--shadow-gold)',
                        }}
                    >
                        <div style={{
                            width: '56px', height: '56px', minWidth: '56px',
                            borderRadius: 'var(--radius-lg)',
                            background: 'var(--accent-gold-soft)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <HandsPraying size={28} weight="duotone" color="var(--accent-gold)" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <h3 style={{
                                fontSize: '1.15rem', fontWeight: 700, fontFamily: 'var(--font-heading)',
                                color: 'var(--accent-gold)'
                            }}>
                                {t('adhkar.tasbih')}
                            </h3>
                            <p style={{
                                fontSize: '0.82rem', color: 'var(--text-muted)',
                                marginTop: '2px'
                            }}>
                                {t('adhkar.tasbihDesc')} · {t('adhkar.itemsCount', { count: azkarData.length })}
                            </p>
                        </div>
                        <CaretRight size={20} color="var(--text-muted)" className="rtl:rotate-180" />
                    </motion.button>
                </div>

                {/* Motivational Quote */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{
                        textAlign: 'center',
                        marginTop: 'var(--space-2xl)',
                        padding: 'var(--space-lg)',
                    }}
                >
                    <p style={{
                        fontFamily: selectedFont.family,
                        fontSize: '1.2rem',
                        color: 'var(--accent-gold)',
                        lineHeight: 2,
                        textShadow: '0 0 20px var(--accent-gold-glow)',
                    }}>
                        ﴿ أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ ﴾
                    </p>
                    <p style={{
                        fontSize: '0.78rem', color: 'var(--text-muted)',
                        marginTop: '4px'
                    }}>
                        — سورة الرعد، الآية 28
                    </p>
                </motion.div>
            </div>
        );
    }

    // ========================
    // Adhkar List View (Morning / Evening)
    // ========================
    if (activeSection === 'morning' || activeSection === 'evening') {
        const list = getActiveList();
        const sectionTitle = activeSection === 'morning' ? t('adhkar.morningAzkar') : t('adhkar.eveningAzkar');
        const sectionColor = activeSection === 'morning' ? '#F6D365' : '#A7D8FF';
        const SectionIcon = activeSection === 'morning' ? Sun : MoonStars;

        return (
            <div className="page container" style={{ paddingTop: 'var(--space-xl)' }}>
                {/* Header */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    marginBottom: 'var(--space-xl)'
                }}>
                    <div />
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <SectionIcon size={22} weight="duotone" color={sectionColor} />
                        <h2 style={{
                            fontFamily: 'var(--font-heading)', fontSize: '1.2rem', fontWeight: 700,
                            color: sectionColor,
                        }}>
                            {sectionTitle}
                        </h2>
                    </div>
                    <button
                        onClick={() => setActiveSection('menu')}
                        style={{
                            width: '40px', height: '40px',
                            borderRadius: 'var(--radius-full)',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--text-secondary)', cursor: 'pointer'
                        }}
                    >
                        <ArrowUUpLeft size={20} />
                    </button>
                </div>

                {/* Font Selector */}
                <div style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    marginBottom: 'var(--space-md)', flexWrap: 'wrap',
                }}>
                    <TextAa size={16} color="var(--text-muted)" />
                    {FONT_OPTIONS.map((font) => (
                        <button
                            key={font.id}
                            onClick={() => setSelectedFont(font)}
                            style={{
                                padding: '4px 12px',
                                borderRadius: 'var(--radius-full)',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                fontFamily: font.family,
                                border: selectedFont.id === font.id
                                    ? `1px solid ${sectionColor}`
                                    : '1px solid var(--border)',
                                background: selectedFont.id === font.id
                                    ? `${sectionColor}15`
                                    : 'var(--bg-secondary)',
                                color: selectedFont.id === font.id
                                    ? sectionColor
                                    : 'var(--text-secondary)',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                            }}
                        >
                            {font.name}
                        </button>
                    ))}
                </div>

                {/* Adhkar List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
                    {list.map((dhikr, index) => {
                        const dhikrCount = counts[dhikr.id] || 0;
                        const dhikrDone = dhikrCount >= dhikr.target;
                        return (
                            <motion.div
                                key={dhikr.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => {
                                    if (!dhikrDone) {
                                        const nextCount = dhikrCount + 1;
                                        setCounts(prev => ({
                                            ...prev,
                                            [dhikr.id]: nextCount
                                        }));

                                        if ('vibrate' in navigator) {
                                            if (nextCount === dhikr.target) {
                                                navigator.vibrate([100, 50, 100]);
                                            } else {
                                                navigator.vibrate(10);
                                            }
                                        }
                                    }
                                }}
                                style={{
                                    background: dhikrDone ? `${sectionColor}10` : 'var(--bg-card)',
                                    border: dhikrDone ? `1px solid ${sectionColor}40` : '1px solid var(--border)',
                                    borderRadius: 'var(--radius-lg)',
                                    padding: 'var(--space-md) var(--space-lg)',
                                    cursor: dhikrDone ? 'default' : 'pointer',
                                    opacity: dhikrDone ? 0.7 : 1,
                                    transition: 'all 0.3s ease',
                                }}
                            >
                                <p style={{
                                    fontFamily: selectedFont.family,
                                    fontSize: '1.1rem',
                                    lineHeight: 2,
                                    color: dhikrDone ? sectionColor : 'var(--text)',
                                    textAlign: 'right',
                                    textDecoration: dhikrDone ? 'line-through' : 'none',
                                }}>
                                    {dhikr.text}
                                </p>
                                <div style={{
                                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                    marginTop: 'var(--space-xs)',
                                }}>
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '6px',
                                    }}>
                                        {dhikrDone && <CheckCircle size={16} weight="fill" color={sectionColor} />}
                                        <span dir="ltr" style={{
                                            fontSize: '0.78rem', fontWeight: 600,
                                            color: dhikrDone ? sectionColor : 'var(--text-muted)'
                                        }}>
                                            {dhikrCount} / {dhikr.target}
                                        </span>
                                    </div>
                                    {!dhikrDone && (
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setCounts(prev => ({ ...prev, [dhikr.id]: 0 }));
                                            }}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                color: 'var(--text-muted)', fontSize: '0.72rem', padding: '2px 8px',
                                            }}
                                        >
                                            <ArrowCounterClockwise size={14} />
                                        </button>
                                    )}
                                </div>
                                {/* Mini Progress Bar */}
                                {dhikr.target > 1 && (
                                    <div style={{
                                        height: '3px', borderRadius: 'var(--radius-full)',
                                        background: 'var(--bg-secondary)',
                                        marginTop: '6px', overflow: 'hidden'
                                    }}>
                                        <motion.div
                                            style={{
                                                height: '100%', borderRadius: 'var(--radius-full)',
                                                background: sectionColor,
                                            }}
                                            animate={{ width: `${Math.min((dhikrCount / dhikr.target) * 100, 100)}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        );
    }

    // ========================
    // Tasbih Counter View (Enhanced)
    // ========================
    return (
        <div style={{
            minHeight: '100dvh', display: 'flex', flexDirection: 'column',
            background: 'var(--bg)', color: 'var(--text)', overflow: 'hidden'
        }}>
            {/* Header */}
            <header style={{
                padding: 'var(--space-lg) var(--space-xl)',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                position: 'sticky', top: 0, zIndex: 50,
                background: 'var(--bg)', borderBottom: '1px solid var(--border)',
            }}>
                <div style={{ width: '48px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <HandsPraying size={18} weight="duotone" color="var(--accent-gold)" />
                    <h2 style={{
                        fontFamily: 'var(--font-heading)', fontSize: '1.1rem', fontWeight: 700,
                        color: 'var(--accent-gold)'
                    }}>
                        {t('adhkar.tasbih')}
                    </h2>
                </div>
                <button
                    onClick={() => setActiveSection('menu')}
                    style={{
                        width: '40px', height: '40px',
                        borderRadius: 'var(--radius-full)',
                        background: 'var(--bg-secondary)',
                        border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--text-secondary)', cursor: 'pointer'
                    }}
                >
                    <ArrowUUpLeft size={20} />
                </button>
            </header>

            {/* Font Selector Bar */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: 'var(--space-sm) var(--space-xl)',
                borderBottom: '1px solid var(--border)',
                overflowX: 'auto',
            }}>
                <TextAa size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
                {FONT_OPTIONS.map((font) => (
                    <button
                        key={font.id}
                        onClick={() => setSelectedFont(font)}
                        style={{
                            padding: '4px 12px',
                            borderRadius: 'var(--radius-full)',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            fontFamily: font.family,
                            border: selectedFont.id === font.id
                                ? '1px solid var(--accent-gold)'
                                : '1px solid var(--border)',
                            background: selectedFont.id === font.id
                                ? 'var(--accent-gold-soft)'
                                : 'var(--bg-secondary)',
                            color: selectedFont.id === font.id
                                ? 'var(--accent-gold)'
                                : 'var(--text-secondary)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            whiteSpace: 'nowrap',
                            flexShrink: 0,
                        }}
                    >
                        {font.name}
                    </button>
                ))}
            </div>

            {/* Main Counter */}
            <main style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                padding: 'var(--space-xl)', position: 'relative',
            }}>
                {/* Background Glow */}
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '400px', height: '400px',
                    background: 'radial-gradient(circle, var(--accent-gold-glow) 0%, transparent 70%)',
                    opacity: 0.15, borderRadius: '50%', pointerEvents: 'none',
                }} />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedDhikr.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 1.05 }}
                        style={{
                            width: '100%', maxWidth: '400px',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            zIndex: 20,
                        }}
                    >
                        {/* Dhikr Text */}
                        <div style={{
                            textAlign: 'center', paddingInline: 'var(--space-lg)',
                            minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: 'var(--space-xl)'
                        }}>
                            <h2 style={{
                                fontSize: '1.6rem',
                                fontFamily: selectedFont.family,
                                lineHeight: 2,
                                color: isCompleted ? 'var(--accent-gold)' : 'var(--text)',
                                textShadow: '0 0 25px var(--accent-gold-glow)',
                                transition: 'all 0.4s ease',
                            }}>
                                {selectedDhikr.text}
                            </h2>
                        </div>

                        {/* Counter */}
                        <div style={{ position: 'relative' }}>
                            <CircularCounter
                                count={currentCount}
                                target={selectedDhikr.target}
                                onClick={handleIncrement}
                            />
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 180 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleReset}
                                style={{
                                    position: 'absolute', bottom: '-4px', right: '-4px',
                                    width: '36px', height: '36px',
                                    borderRadius: 'var(--radius-full)',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'var(--text-muted)', cursor: 'pointer', zIndex: 30,
                                }}
                            >
                                <ArrowCounterClockwise size={16} />
                            </motion.button>
                        </div>

                        {/* Completion Badge */}
                        <div style={{ height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 'var(--space-md)' }}>
                            <AnimatePresence>
                                {isCompleted && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '6px',
                                            background: 'var(--accent-gold-soft)',
                                            border: '1px solid var(--accent-gold)',
                                            padding: '6px 16px',
                                            borderRadius: 'var(--radius-full)',
                                        }}
                                    >
                                        <CheckCircle size={18} weight="fill" color="var(--accent-gold)" />
                                        <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--accent-gold)' }}>
                                            {t('adhkar.reached')}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Tap Instruction */}
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            color: 'var(--text-muted)', fontSize: '0.78rem',
                            marginTop: 'var(--space-sm)', opacity: 0.5,
                        }}>
                            <HandTap size={16} />
                            <span>{t('adhkar.clickToCount')}</span>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Bottom Dhikr Selector */}
            <div style={{
                padding: 'var(--space-md) var(--space-lg)',
                paddingBottom: 'calc(var(--bottom-nav-height) + env(safe-area-inset-bottom, 0px) + var(--space-md))',
                borderTop: '1px solid var(--border)',
                background: 'var(--bg)',
            }}>
                <div style={{
                    display: 'flex', gap: 'var(--space-sm)',
                    overflowX: 'auto',
                    paddingBottom: '4px',
                }}>
                    {azkarData.map((dhikr) => {
                        const isActive = selectedDhikr.id === dhikr.id;
                        const dhikrCount = counts[dhikr.id] || 0;
                        const dhikrDone = dhikrCount >= dhikr.target;
                        return (
                            <button
                                key={dhikr.id}
                                onClick={() => selectDhikr(dhikr)}
                                style={{
                                    whiteSpace: 'nowrap',
                                    padding: '8px 16px',
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: '0.85rem',
                                    fontWeight: 600,
                                    fontFamily: selectedFont.family,
                                    border: isActive
                                        ? '1px solid var(--accent-gold)'
                                        : '1px solid var(--border)',
                                    background: isActive
                                        ? 'var(--accent-gold-soft)'
                                        : dhikrDone ? 'rgba(34,197,94,0.08)' : 'var(--bg-secondary)',
                                    color: isActive
                                        ? 'var(--accent-gold)'
                                        : dhikrDone ? '#22C55E' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s ease',
                                    flexShrink: 0,
                                }}
                            >
                                {dhikr.text.length > 20 ? dhikr.text.substring(0, 18) + '...' : dhikr.text}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
