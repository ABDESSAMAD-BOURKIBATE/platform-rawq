import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { GameMode, LevelData } from '../../types/culture';
import { useCultureStore } from '../../store/useCultureStore';
import { Star, Play, ArrowLeft, Trophy, CheckCircle } from '@phosphor-icons/react';

const MODE_COLORS: Record<GameMode, string> = {
    completeVerse: '#D4AF37',
    multipleChoice: '#58A89B',
    stories: '#E8A55A',
};

interface GameLevelsProps {
    mode: GameMode;
    levels: LevelData[];
    onSelectLevel: (level: LevelData) => void;
    onBack: () => void;
}

export function GameLevels({ mode, levels, onSelectLevel, onBack }: GameLevelsProps) {
    const { t } = useTranslation();
    const { isLevelUnlocked, getHighScore } = useCultureStore();
    const color = MODE_COLORS[mode];

    // Calculate overall stats for this mode
    const totalPlayed = levels.filter(l => getHighScore(mode, l.id) > 0).length;
    const totalPassed = levels.filter(l => getHighScore(mode, l.id) >= 50).length;

    return (
        <div className="animate-fade-in flex flex-col gap-lg" style={{ maxWidth: '800px', margin: '0 auto', width: '100%' }}>
            {/* Header */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: 'var(--space-md)',
                padding: 'var(--space-lg)', borderRadius: 'var(--radius-xl)',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                position: 'relative', overflow: 'hidden',
            }}>
                {/* Accent line */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '3px',
                    background: `linear-gradient(to right, ${color}, transparent)`,
                }} />

                <button
                    onClick={onBack}
                    style={{
                        width: '36px', height: '36px', borderRadius: 'var(--radius-full)',
                        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'var(--text-secondary)', flexShrink: 0,
                    }}
                >
                    <ArrowLeft size={18} />
                </button>

                <div style={{ flex: 1 }}>
                    <h2 style={{
                        fontSize: '1.15rem', fontWeight: 800,
                        fontFamily: 'var(--font-heading)',
                        margin: 0, marginBottom: '2px',
                    }}>
                        {t(`culture.modes.${mode}`)}
                    </h2>
                    <p style={{
                        fontSize: '0.75rem', color: 'var(--text-muted)',
                        margin: 0, lineHeight: 1.4,
                    }}>
                        {t(`culture.modes.${mode}Desc`)}
                    </p>
                </div>

                {/* Stats badges */}
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                    {totalPlayed > 0 && (
                        <span style={{
                            fontSize: '0.65rem', fontWeight: 700,
                            color: '#22c55e', background: 'rgba(34,197,94,0.08)',
                            padding: '3px 8px', borderRadius: '20px',
                            border: '1px solid rgba(34,197,94,0.2)',
                        }}>
                            {totalPassed}/{levels.length}
                        </span>
                    )}
                </div>
            </div>

            {/* Levels Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))',
                gap: '10px',
            }}>
                {levels.map((level, idx) => {
                    const isUnlocked = isLevelUnlocked(mode, level.id);
                    const highScore = getHighScore(mode, level.id);
                    const hasPlayed = highScore > 0;
                    const passed = highScore >= 50;

                    // Star count
                    const starCount = highScore >= 99 ? 3 : highScore >= 66 ? 2 : highScore >= 33 ? 1 : 0;

                    // Progress ring (percentage of correct answers)
                    const circumference = 2 * Math.PI * 30;
                    const strokeOffset = circumference - (highScore / 100) * circumference;

                    return (
                        <motion.div
                            key={level.id}
                            initial={{ opacity: 0, scale: 0.85 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: Math.min(idx * 0.03, 0.6), duration: 0.3 }}
                            whileHover={isUnlocked ? { scale: 1.06, y: -3 } : {}}
                            whileTap={isUnlocked ? { scale: 0.95 } : {}}
                            onClick={() => isUnlocked && onSelectLevel(level)}
                            style={{
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center',
                                padding: '14px 8px',
                                borderRadius: 'var(--radius-lg)',
                                background: 'transparent',
                                border: passed
                                    ? '1px solid rgba(34,197,94,0.35)'
                                    : hasPlayed
                                        ? '1px solid rgba(239,68,68,0.3)'
                                        : '1px solid rgba(255,255,255,0.06)',
                                cursor: isUnlocked ? 'pointer' : 'default',
                                opacity: isUnlocked ? 1 : 0.45,
                                transition: 'all 0.3s ease',
                                boxShadow: isUnlocked ? '0 4px 15px rgba(0,0,0,0.4)' : 'none',
                                gap: '6px', position: 'relative',
                                overflow: 'hidden',
                                minHeight: '120px',
                            }}
                        >
                            {/* Scaled Image Background to fix letterboxing and stability */}
                            <div style={{
                                position: 'absolute', inset: 0, zIndex: 0,
                                backgroundImage: `url('${import.meta.env.BASE_URL}images/culture/level-card-bg.png')`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                transform: 'scale(1.2)', // adjust if AI image has borders
                            }} />

                            {/* Status Overlay Gradients */}
                            <div style={{
                                position: 'absolute', inset: 0, zIndex: 1,
                                background: hasPlayed
                                    ? passed
                                        ? 'linear-gradient(135deg, rgba(11,28,26,0.95), rgba(34,197,94,0.15))'
                                        : 'linear-gradient(135deg, rgba(11,28,26,0.95), rgba(239,68,68,0.15))'
                                    : 'linear-gradient(135deg, rgba(5,13,10,0.98), rgba(5,13,10,0.90))',
                            }} />

                            {/* Content Wrapper to raise above backgrounds */}
                            <div style={{
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center',
                                position: 'relative', zIndex: 2,
                                gap: '8px', width: '100%', height: '100%'
                            }}>
                                {/* Passed checkmark */}
                                {passed && (
                                    <div style={{
                                        position: 'absolute', top: '6px', right: '6px',
                                    }}>
                                        <CheckCircle size={14} color="#22c55e" weight="fill" />
                                    </div>
                                )}

                                {/* Level number with ring */}
                                <div style={{ position: 'relative', width: '48px', height: '48px' }}>
                                    {/* Background circle */}
                                    <svg viewBox="0 0 70 70" style={{
                                        width: '100%', height: '100%',
                                        transform: 'rotate(-90deg)',
                                        filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))'
                                    }}>
                                        <circle cx="35" cy="35" r="30" fill="none"
                                            stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
                                        {hasPlayed && (
                                            <circle cx="35" cy="35" r="30" fill="none"
                                                stroke={passed ? '#22c55e' : color}
                                                strokeWidth="4"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={strokeOffset}
                                                strokeLinecap="round"
                                                style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                                            />
                                        )}
                                    </svg>
                                    <div style={{
                                        position: 'absolute', inset: 0,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '1rem', fontWeight: 900,
                                        color: passed ? '#4ade80' : hasPlayed ? color : '#FFFFFF',
                                        textShadow: '0 2px 4px rgba(0,0,0,0.8)',
                                    }}>
                                        {level.id}
                                    </div>
                                </div>

                                {/* Stars */}
                                {isUnlocked && (
                                    <div style={{ display: 'flex', gap: '2px' }}>
                                        {[1, 2, 3].map((s) => (
                                            <Star
                                                key={s}
                                                size={12}
                                                weight={starCount >= s ? "fill" : "regular"}
                                                color={starCount >= s ? "#D4AF37" : "rgba(255,255,255,0.12)"}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Score or Play */}
                                {hasPlayed ? (
                                    <span style={{
                                        fontSize: '0.65rem', fontWeight: 800,
                                        color: passed ? '#22c55e' : '#ef4444',
                                    }}>
                                        {highScore}%
                                    </span>
                                ) : isUnlocked ? (
                                    <div style={{
                                        display: 'flex', alignItems: 'center', gap: '3px',
                                        fontSize: '0.62rem', fontWeight: 700, color,
                                    }}>
                                        <Play size={10} weight="fill" />
                                        <span>ابدأ</span>
                                    </div>
                                ) : null}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}
