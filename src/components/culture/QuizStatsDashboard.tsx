import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Brain, Lightning, Target, BookOpen, Crosshair,
    Trophy, Clock, Fire, ChartBar, ArrowLeft, Star,
    CheckCircle, XCircle
} from '@phosphor-icons/react';
import { useCultureStore, LevelAttempt } from '../../store/useCultureStore';
import { GameMode } from '../../types/culture';

const MODE_LABELS: Record<GameMode, string> = {
    completeVerse: 'إكمال الآية',
    multipleChoice: 'اختيار متعدد',
    stories: 'قصص قرآنية',
};

const MODE_COLORS: Record<GameMode, string> = {
    completeVerse: '#D4AF37',
    multipleChoice: '#58A89B',
    stories: '#E8A55A',
};

interface QuizStatsDashboardProps {
    onBack: () => void;
}

export function QuizStatsDashboard({ onBack }: QuizStatsDashboardProps) {
    const { getOverallStats, getModeStats, history, getPassedLevelIds, getHighScore } = useCultureStore();
    const [selectedMode, setSelectedMode] = useState<GameMode | 'all'>('all');

    const overall = getOverallStats();
    const modes: GameMode[] = ['completeVerse', 'multipleChoice', 'stories'];

    // Metric ring component
    const MetricRing = ({ value, label, icon: Icon, color, delay = 0 }: {
        value: number; label: string; icon: any; color: string; delay?: number;
    }) => (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
            <div style={{ position: 'relative', width: '72px', height: '72px' }}>
                <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
                    <motion.circle
                        cx="50" cy="50" r="42" fill="none"
                        stroke={color} strokeWidth="7"
                        strokeDasharray="264"
                        initial={{ strokeDashoffset: 264 }}
                        animate={{ strokeDashoffset: 264 - (value / 100) * 264 }}
                        transition={{ duration: 1.2, ease: 'easeOut', delay }}
                        strokeLinecap="round"
                    />
                </svg>
                <div style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                    <Icon size={22} style={{ color }} weight="duotone" />
                </div>
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)' }}>{label}</span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color }}>{value}%</span>
        </div>
    );

    // Bar chart component
    const BarChart = ({ data, maxValue }: { data: { label: string; value: number; color: string }[]; maxValue: number }) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {data.map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{
                        width: '70px', fontSize: '0.72rem', fontWeight: 600,
                        color: 'var(--text-secondary)', textAlign: 'end', flexShrink: 0,
                    }}>
                        {item.label}
                    </span>
                    <div style={{
                        flex: 1, height: '22px', background: 'rgba(255,255,255,0.05)',
                        borderRadius: '11px', overflow: 'hidden', position: 'relative',
                    }}>
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${maxValue > 0 ? (item.value / maxValue) * 100 : 0}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut', delay: i * 0.1 }}
                            style={{
                                height: '100%', background: item.color,
                                borderRadius: '11px', minWidth: item.value > 0 ? '20px' : '0px',
                            }}
                        />
                        <span style={{
                            position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                            fontSize: '0.65rem', fontWeight: 700, color: 'var(--text)',
                        }}>
                            {item.value}%
                        </span>
                    </div>
                </div>
            ))}
        </div>
    );

    // Get filtered stats
    const stats = selectedMode === 'all' ? overall : getModeStats(selectedMode);

    // Recent attempts
    const recentAttempts = [...history]
        .reverse()
        .filter(a => selectedMode === 'all' || a.mode === selectedMode)
        .slice(0, 10);

    // Level breakdown for selected mode
    const levelBreakdown: { level: number; score: number; passed: boolean; attempts: number }[] = [];
    if (selectedMode !== 'all') {
        for (let i = 1; i <= 30; i++) {
            const levelAttempts = history.filter(a => a.mode === selectedMode && a.levelId === i);
            if (levelAttempts.length > 0) {
                const best = Math.max(...levelAttempts.map(a => a.percentage));
                levelBreakdown.push({
                    level: i,
                    score: best,
                    passed: levelAttempts.some(a => a.passed),
                    attempts: levelAttempts.length,
                });
            }
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)', maxWidth: '800px', margin: '0 auto' }}
        >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <ChartBar size={28} weight="duotone" color="var(--accent-gold)" />
                    <div>
                        <h2 style={{
                            fontSize: '1.5rem', fontWeight: 800,
                            fontFamily: 'var(--font-heading)', color: 'var(--text)',
                        }}>
                            الإحصائيات والنتائج
                        </h2>
                        <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                            تقدمك في ثقافة القرآن
                        </p>
                    </div>
                </div>
                <button
                    onClick={onBack}
                    style={{
                        width: '40px', height: '40px', borderRadius: 'var(--radius-full)',
                        background: 'var(--bg-secondary)', border: '1px solid var(--border)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', color: 'var(--text-secondary)',
                    }}
                >
                    <ArrowLeft size={20} />
                </button>
            </div>

            {/* Mode Filter Chips */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <button
                    onClick={() => setSelectedMode('all')}
                    style={{
                        padding: '6px 16px', borderRadius: 'var(--radius-full)',
                        fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                        background: selectedMode === 'all' ? 'var(--accent-gold-soft)' : 'var(--bg-secondary)',
                        color: selectedMode === 'all' ? 'var(--accent-gold)' : 'var(--text-secondary)',
                        border: selectedMode === 'all' ? '1px solid var(--accent-gold)' : '1px solid var(--border)',
                        transition: 'all 0.2s ease',
                    }}
                >
                    الكل
                </button>
                {modes.map(mode => (
                    <button
                        key={mode}
                        onClick={() => setSelectedMode(mode)}
                        style={{
                            padding: '6px 16px', borderRadius: 'var(--radius-full)',
                            fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer',
                            background: selectedMode === mode ? `${MODE_COLORS[mode]}15` : 'var(--bg-secondary)',
                            color: selectedMode === mode ? MODE_COLORS[mode] : 'var(--text-secondary)',
                            border: selectedMode === mode ? `1px solid ${MODE_COLORS[mode]}` : '1px solid var(--border)',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {MODE_LABELS[mode]}
                    </button>
                ))}
            </div>

            {/* Empty State */}
            {overall.totalAttempts === 0 ? (
                <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                    gap: '16px', padding: 'var(--space-2xl)',
                    textAlign: 'center', opacity: 0.6,
                }}>
                    <ChartBar size={64} color="var(--text-muted)" />
                    <p style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>
                        لم تجري أي اختبار بعد
                    </p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        ابدأ اللعب وستظهر إحصائياتك هنا
                    </p>
                </div>
            ) : (
                <>
                    {/* Summary Cards */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                        {[
                            { icon: Trophy, label: 'المحاولات', value: stats.totalAttempts, color: '#D4AF37' },
                            { icon: Star, label: 'مستويات ناجحة', value: stats.passedLevels, color: '#22c55e' },
                            { icon: Target, label: 'متوسط النسبة', value: `${stats.avgScore}%`, color: '#60a5fa' },
                            {
                                icon: Clock, label: 'الوقت الكلي',
                                value: `${Math.floor(stats.totalTime / 60)}د`,
                                color: '#f59e0b'
                            },
                        ].map((card, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                style={{
                                    padding: '14px 10px', borderRadius: 'var(--radius-lg)',
                                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center',
                                    gap: '6px', textAlign: 'center',
                                }}
                            >
                                <card.icon size={22} color={card.color} weight="duotone" />
                                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{card.label}</span>
                                <span style={{ fontSize: '1.2rem', fontWeight: 800, color: card.color }}>{card.value}</span>
                            </motion.div>
                        ))}
                    </div>

                    {/* Mental Metrics - Ring Charts */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        style={{
                            padding: 'var(--space-lg)', borderRadius: 'var(--radius-xl)',
                            background: 'var(--bg-card)', border: '1px solid var(--border)',
                        }}
                    >
                        <h3 style={{
                            fontSize: '0.95rem', fontWeight: 700, marginBottom: 'var(--space-lg)',
                            textAlign: 'center', color: 'var(--text-secondary)',
                        }}>
                            📊 المؤشرات الذهنية
                        </h3>
                        <div style={{
                            display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px',
                        }}>
                            <MetricRing value={stats.avgIntelligence} label="الذكاء" icon={Brain} color="#facc15" delay={0} />
                            <MetricRing value={stats.avgInsight} label="الفطنة" icon={Lightning} color="#60a5fa" delay={0.15} />
                            <MetricRing value={stats.avgConcentration} label="التركيز" icon={Target} color="#f87171" delay={0.3} />
                            <MetricRing value={stats.avgMemorization} label="الحفظ" icon={BookOpen} color="#34d399" delay={0.45} />
                            <MetricRing value={stats.avgAccuracy} label="الدقة" icon={Crosshair} color="#a78bfa" delay={0.6} />
                        </div>
                    </motion.div>

                    {/* Bar Chart - Mode comparison or Level breakdown */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        style={{
                            padding: 'var(--space-lg)', borderRadius: 'var(--radius-xl)',
                            background: 'var(--bg-card)', border: '1px solid var(--border)',
                        }}
                    >
                        <h3 style={{
                            fontSize: '0.95rem', fontWeight: 700, marginBottom: 'var(--space-lg)',
                            textAlign: 'center', color: 'var(--text-secondary)',
                        }}>
                            {selectedMode === 'all' ? '📈 مقارنة الأوضاع' : '📈 المستويات'}
                        </h3>

                        {selectedMode === 'all' ? (
                            <BarChart
                                data={modes.map(mode => {
                                    const ms = getModeStats(mode);
                                    return {
                                        label: MODE_LABELS[mode],
                                        value: ms.avgScore,
                                        color: MODE_COLORS[mode],
                                    };
                                })}
                                maxValue={100}
                            />
                        ) : levelBreakdown.length > 0 ? (
                            <BarChart
                                data={levelBreakdown.map(lb => ({
                                    label: `مستوى ${lb.level}`,
                                    value: lb.score,
                                    color: lb.passed ? '#22c55e' : '#ef4444',
                                }))}
                                maxValue={100}
                            />
                        ) : (
                            <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                لا توجد بيانات بعد
                            </p>
                        )}
                    </motion.div>

                    {/* Level Table (mode-specific) */}
                    {selectedMode !== 'all' && levelBreakdown.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            style={{
                                borderRadius: 'var(--radius-xl)',
                                background: 'var(--bg-card)', border: '1px solid var(--border)',
                                overflow: 'hidden',
                            }}
                        >
                            <h3 style={{
                                fontSize: '0.95rem', fontWeight: 700, padding: 'var(--space-md) var(--space-lg)',
                                borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)',
                            }}>
                                🏆 جدول المستويات
                            </h3>
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{
                                    width: '100%', borderCollapse: 'collapse',
                                    fontSize: '0.82rem',
                                }}>
                                    <thead>
                                        <tr style={{ borderBottom: '1px solid var(--border)' }}>
                                            {['المستوى', 'أعلى نسبة', 'الحالة', 'المحاولات'].map(h => (
                                                <th key={h} style={{
                                                    padding: '10px 14px', fontWeight: 700,
                                                    color: 'var(--text-muted)', textAlign: 'center',
                                                }}>
                                                    {h}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {levelBreakdown.map((lb, i) => (
                                            <tr key={lb.level} style={{
                                                borderBottom: i < levelBreakdown.length - 1 ? '1px solid var(--border)' : undefined,
                                            }}>
                                                <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 700 }}>
                                                    مستوى {lb.level}
                                                </td>
                                                <td style={{
                                                    padding: '10px 14px', textAlign: 'center',
                                                    fontWeight: 800, color: lb.passed ? '#22c55e' : '#ef4444',
                                                }}>
                                                    {lb.score}%
                                                </td>
                                                <td style={{ padding: '10px 14px', textAlign: 'center' }}>
                                                    {lb.passed ? (
                                                        <span style={{
                                                            background: 'rgba(34,197,94,0.1)', color: '#22c55e',
                                                            padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
                                                        }}>
                                                            ✅ ناجح
                                                        </span>
                                                    ) : (
                                                        <span style={{
                                                            background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                                                            padding: '3px 10px', borderRadius: '20px', fontSize: '0.72rem', fontWeight: 700,
                                                        }}>
                                                            ❌ لم يجتز
                                                        </span>
                                                    )}
                                                </td>
                                                <td style={{
                                                    padding: '10px 14px', textAlign: 'center',
                                                    color: 'var(--text-muted)',
                                                }}>
                                                    {lb.attempts}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </motion.div>
                    )}

                    {/* Recent Activity */}
                    {recentAttempts.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            style={{
                                padding: 'var(--space-lg)', borderRadius: 'var(--radius-xl)',
                                background: 'var(--bg-card)', border: '1px solid var(--border)',
                            }}
                        >
                            <h3 style={{
                                fontSize: '0.95rem', fontWeight: 700, marginBottom: 'var(--space-md)',
                                color: 'var(--text-secondary)',
                            }}>
                                🕐 آخر المحاولات
                            </h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {recentAttempts.map((attempt, i) => (
                                    <div
                                        key={i}
                                        style={{
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                            padding: '10px 14px', borderRadius: 'var(--radius-md)',
                                            background: attempt.passed ? 'rgba(34,197,94,0.05)' : 'rgba(239,68,68,0.05)',
                                            border: `1px solid ${attempt.passed ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)'}`,
                                        }}
                                    >
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            {attempt.passed ? (
                                                <CheckCircle size={18} color="#22c55e" weight="fill" />
                                            ) : (
                                                <XCircle size={18} color="#ef4444" weight="fill" />
                                            )}
                                            <div>
                                                <span style={{ fontSize: '0.82rem', fontWeight: 700, display: 'block' }}>
                                                    {MODE_LABELS[attempt.mode]} — مستوى {attempt.levelId}
                                                </span>
                                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                                    {new Date(attempt.date).toLocaleDateString('ar-EG', {
                                                        day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        <span style={{
                                            fontSize: '0.9rem', fontWeight: 800,
                                            color: attempt.passed ? '#22c55e' : '#ef4444',
                                        }}>
                                            {attempt.percentage}%
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </>
            )}
        </motion.div>
    );
}
