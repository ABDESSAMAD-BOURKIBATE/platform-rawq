import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Scroll, Brain, UsersThree, ChartBar, Play, Star } from '@phosphor-icons/react';
import { motion } from 'framer-motion';
import { GameMode, LevelData } from '../types/culture';
import { gameData } from '../data/cultureQuestions';
import { GameLevels } from '../components/culture/GameLevels';
import { GameEngine } from '../components/culture/GameEngine';
import { QuizStatsDashboard } from '../components/culture/QuizStatsDashboard';
import { useCultureStore } from '../store/useCultureStore';

export function QuranCulturePage() {
    const { t } = useTranslation();
    const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<LevelData | null>(null);
    const [showStats, setShowStats] = useState(false);
    const { history, getPassedLevelIds, getModeStats } = useCultureStore();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const modes = [
        {
            id: 'completeVerse' as GameMode,
            icon: Scroll,
            emoji: '📖',
            title: t('culture.modes.completeVerse'),
            desc: t('culture.modes.completeVerseDesc'),
            color: '#D4AF37',
            bg: 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.02))',
            image: import.meta.env.BASE_URL + 'images/culture/complete-verse.png',
        },
        {
            id: 'multipleChoice' as GameMode,
            icon: Brain,
            emoji: '🧠',
            title: t('culture.modes.multipleChoice'),
            desc: t('culture.modes.multipleChoiceDesc'),
            color: '#58A89B',
            bg: 'linear-gradient(135deg, rgba(88,168,155,0.08), rgba(88,168,155,0.02))',
            image: import.meta.env.BASE_URL + 'images/culture/multiple-choice.png',
        },
        {
            id: 'stories' as GameMode,
            icon: UsersThree,
            emoji: '🕌',
            title: t('culture.modes.stories'),
            desc: t('culture.modes.storiesDesc'),
            color: '#E8A55A',
            bg: 'linear-gradient(135deg, rgba(232,165,90,0.08), rgba(232,165,90,0.02))',
            image: import.meta.env.BASE_URL + 'images/culture/stories.png',
        }
    ];

    if (showStats) {
        return (
            <div className="page-container p-xl animate-fade-in flex flex-col gap-2xl">
                <QuizStatsDashboard onBack={() => setShowStats(false)} />
            </div>
        );
    }

    return (
        <div className="page-container p-xl animate-fade-in flex flex-col gap-2xl">
            {/* Header */}
            {!selectedLevel && (
                <div className="text-center mb-lg">
                    <h1 style={{
                        fontSize: '2.4rem',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 900,
                        background: 'linear-gradient(135deg, #F6D365, #FFB03B)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: 'var(--space-sm)',
                    }}>
                        {t('culture.title')}
                    </h1>
                    <p className="text-muted" style={{ maxWidth: '500px', margin: '0 auto', fontSize: '0.9rem', lineHeight: 1.6 }}>
                        {t('culture.description')}
                    </p>

                    {/* Stats Button */}
                    {!selectedMode && (
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => setShowStats(true)}
                            style={{
                                margin: 'var(--space-lg) auto 0',
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '10px 24px', borderRadius: 'var(--radius-full)',
                                background: 'linear-gradient(135deg, rgba(212,175,55,0.12), rgba(212,175,55,0.04))',
                                border: '1px solid rgba(212,175,55,0.25)',
                                color: 'var(--accent-gold)', fontSize: '0.85rem', fontWeight: 700,
                                cursor: 'pointer',
                            }}
                        >
                            <ChartBar size={18} weight="duotone" />
                            <span>النتائج والإحصائيات</span>
                            {history.length > 0 && (
                                <span style={{
                                    background: 'var(--accent-gold)', color: '#0B1C1A',
                                    fontSize: '0.6rem', fontWeight: 900,
                                    padding: '2px 7px', borderRadius: '20px',
                                }}>
                                    {history.length}
                                </span>
                            )}
                        </motion.button>
                    )}
                </div>
            )}

            {/* Content Area */}
            {selectedLevel ? (
                <GameEngine
                    levelData={selectedLevel}
                    onBack={() => setSelectedLevel(null)}
                    onNextLevel={() => {
                        const nextLevelId = selectedLevel.id + 1;
                        const nextLevelData = gameData[selectedMode!].find(l => l.id === nextLevelId);
                        if (nextLevelData) setSelectedLevel(nextLevelData);
                        else setSelectedLevel(null);
                    }}
                />
            ) : selectedMode ? (
                <GameLevels
                    mode={selectedMode}
                    levels={gameData[selectedMode]}
                    onSelectLevel={(level) => setSelectedLevel(level)}
                    onBack={() => setSelectedMode(null)}
                />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-lg)' }}>
                    {modes.map((mode, idx) => {
                        const passedCount = getPassedLevelIds(mode.id).length;
                        const modeStats = getModeStats(mode.id);
                        const progress = Math.round((passedCount / 30) * 100);
                        const IconComp = mode.icon;

                        return (
                            <motion.div
                                key={mode.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.12, duration: 0.4 }}
                                whileHover={{ scale: 1.01, y: -3 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={() => setSelectedMode(mode.id)}
                                style={{
                                    position: 'relative', overflow: 'hidden',
                                    borderRadius: 'var(--radius-xl)', cursor: 'pointer',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    transition: 'all 0.3s ease',
                                    minHeight: '140px',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                }}
                            >
                                {/* Scaled Background to hide AI letterboxing */}
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    backgroundImage: `url('${mode.image}')`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    transform: 'scale(1.8)',
                                    zIndex: 0,
                                }} />

                                {/* Gradient Overlay */}
                                <div style={{
                                    position: 'absolute', inset: 0,
                                    background: `linear-gradient(135deg, rgba(11,28,26,0.92) 0%, rgba(11,28,26,0.6) 100%)`,
                                    zIndex: 1,
                                }} />
                                {/* Top accent gradient */}
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                                    background: `linear-gradient(to right, ${mode.color}, transparent)`,
                                    zIndex: 3,
                                }} />

                                <div className="culture-card-content" style={{ zIndex: 2 }}>
                                    {/* Icon Circle */}
                                    <div style={{
                                        width: '68px', height: '68px', borderRadius: '50%', flexShrink: 0,
                                        background: mode.bg,
                                        border: `1.5px solid ${mode.color}30`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        position: 'relative',
                                    }}>
                                        <IconComp size={32} weight="duotone" color={mode.color} />

                                        {/* Mini progress ring around icon */}
                                        {passedCount > 0 && (
                                            <svg viewBox="0 0 100 100" style={{
                                                position: 'absolute', inset: '-3px',
                                                width: 'calc(100% + 6px)', height: 'calc(100% + 6px)',
                                                transform: 'rotate(-90deg)',
                                            }}>
                                                <circle cx="50" cy="50" r="48" fill="none"
                                                    stroke={`${mode.color}15`} strokeWidth="3" />
                                                <circle cx="50" cy="50" r="48" fill="none"
                                                    stroke={mode.color} strokeWidth="3"
                                                    strokeDasharray="301.6"
                                                    strokeDashoffset={301.6 - (progress / 100) * 301.6}
                                                    strokeLinecap="round"
                                                    style={{ transition: 'stroke-dashoffset 0.8s ease' }}
                                                />
                                            </svg>
                                        )}
                                    </div>

                                    {/* Text Content */}
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div className="culture-text-header">
                                            <h3 style={{
                                                fontSize: '1.2rem', fontWeight: 800,
                                                fontFamily: 'var(--font-heading)',
                                                color: '#FFFFFF',
                                                textShadow: '0 2px 4px rgba(0,0,0,0.7)',
                                                margin: 0,
                                            }}>
                                                {mode.title}
                                            </h3>
                                        </div>
                                        <p style={{
                                            fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)',
                                            lineHeight: 1.5, margin: 0,
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden',
                                            textShadow: '0 1px 3px rgba(0,0,0,0.7)',
                                        }}>
                                            {mode.desc}
                                        </p>

                                        {/* Progress info */}
                                        <div className="culture-progress-info">
                                            <span style={{
                                                fontSize: '0.68rem', fontWeight: 700,
                                                color: mode.color,
                                                background: `${mode.color}12`,
                                                padding: '2px 10px', borderRadius: '20px',
                                                border: `1px solid ${mode.color}20`,
                                            }}>
                                                30 مستوى
                                            </span>
                                            {passedCount > 0 && (
                                                <span style={{
                                                    fontSize: '0.68rem', fontWeight: 700,
                                                    color: '#22c55e',
                                                    background: 'rgba(34,197,94,0.08)',
                                                    padding: '2px 10px', borderRadius: '20px',
                                                    border: '1px solid rgba(34,197,94,0.2)',
                                                }}>
                                                    ✅ {passedCount} ناجح
                                                </span>
                                            )}
                                            {modeStats.totalAttempts > 0 && (
                                                <span style={{
                                                    fontSize: '0.68rem', fontWeight: 700,
                                                    color: 'var(--text-muted)',
                                                }}>
                                                    المعدل: {modeStats.avgScore}%
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Play Arrow */}
                                    <div style={{
                                        width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                                        background: `${mode.color}15`,
                                        border: `1px solid ${mode.color}25`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    }}>
                                        <Play size={18} weight="fill" color={mode.color} />
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
