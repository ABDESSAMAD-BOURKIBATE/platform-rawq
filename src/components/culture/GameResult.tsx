import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Trophy, Clock, CheckCircle, XCircle, Brain, Target, Lightning, ArrowRight, ArrowCounterClockwise, List } from '@phosphor-icons/react';

interface GameResultProps {
    percentage: number;
    score: number;
    totalQuestions: number;
    totalTime: number;
    incorrectCount: number;
    longestStreak: number;
    onRetry: () => void;
    onNextLevel?: () => void;
    onBack: () => void;
}

export function GameResult({
    percentage,
    score,
    totalQuestions,
    totalTime,
    incorrectCount,
    longestStreak,
    onRetry,
    onNextLevel,
    onBack
}: GameResultProps) {
    const { t } = useTranslation();
    const isPassed = percentage >= 50;

    // Intelligence: Based on accuracy
    const intelligence = isNaN(percentage) ? 0 : percentage;
    // Insight (Basirah): Based on speed factor (approx 10s per question avg)
    const avgTime = totalQuestions > 0 ? totalTime / totalQuestions : 0;
    const insightScale = Math.max(0, Math.min(100, 100 - (avgTime - 5) * 5));
    const insight = isNaN(insightScale) ? 0 : insightScale;
    // Concentration: Based on longest streak relative to total
    const streakFactor = totalQuestions > 0 ? (longestStreak / (totalQuestions / 4)) * 100 : 0;
    const concentration = isNaN(streakFactor) ? 0 : Math.min(100, streakFactor);

    const metrics = [
        { label: 'الذكاء', value: intelligence, icon: Brain, color: '#facc15' },
        { label: 'الفطنة', value: insight, icon: Lightning, color: '#60a5fa' },
        { label: 'التركيز', value: concentration, icon: Target, color: '#f87171' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-xl p-xl card-glass rounded-3xl w-full max-w-2xl mx-auto border-white/10"
        >
            {/* Header with Icon */}
            <div className="relative">
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
                    className={`w-28 h-28 rounded-full flex items-center justify-center ${isPassed ? 'bg-gold/10' : 'bg-red-500/10'}`}
                >
                    <Trophy size={56} color={isPassed ? "var(--accent-gold)" : "#ef4444"} weight="duotone" />
                </motion.div>
                {isPassed && (
                    <motion.div
                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-2 -right-2 w-32 h-32 bg-gold/5 rounded-full blur-xl"
                    />
                )}
            </div>

            <div className="text-center">
                <h2 className="text-4xl font-bold mb-sm">
                    {isPassed ? t('culture.levelCompleted') : t('culture.levelFailed')}
                </h2>
                <p className="text-xl text-muted">
                    {t('culture.score')}: <span className="text-gold font-bold">{percentage}%</span>
                </p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-3 gap-md w-full">
                <div className="p-md rounded-2xl bg-white/5 flex flex-col items-center gap-xs">
                    <CheckCircle size={24} className="text-emerald-400" />
                    <span className="text-sm text-muted">الصح</span>
                    <span className="text-lg font-bold">{score}</span>
                </div>
                <div className="p-md rounded-2xl bg-white/5 flex flex-col items-center gap-xs">
                    <XCircle size={24} className="text-red-400" />
                    <span className="text-sm text-muted">الخطأ</span>
                    <span className="text-lg font-bold">{incorrectCount}</span>
                </div>
                <div className="p-md rounded-2xl bg-white/5 flex flex-col items-center gap-xs">
                    <Clock size={24} className="text-blue-400" />
                    <span className="text-sm text-muted">الوقت</span>
                    <span className="text-lg font-bold">{Math.floor(totalTime / 60)}:{String(totalTime % 60).padStart(2, '0')}</span>
                </div>
            </div>

            {/* Visual Metrics (Charts) */}
            <div className="flex flex-col gap-lg w-full mt-md">
                <h3 className="text-lg font-bold text-center text-muted">المؤشرات الذهنية</h3>
                <div className="grid grid-cols-3 gap-lg w-full">
                    {metrics.map((m, idx) => (
                        <div key={idx} className="flex flex-col items-center gap-sm">
                            <div className="relative w-20 h-20">
                                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                    <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="8" />
                                    <motion.circle
                                        cx="50" cy="50" r="45" fill="none"
                                        stroke={m.color} strokeWidth="8"
                                        strokeDasharray="283"
                                        initial={{ strokeDashoffset: 283 }}
                                        animate={{ strokeDashoffset: 283 - (m.value / 100) * 283 }}
                                        transition={{ duration: 1.5, ease: 'easeOut', delay: 0.5 + idx * 0.2 }}
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <m.icon size={28} style={{ color: m.color }} weight="duotone" />
                                </div>
                            </div>
                            <span className="font-bold text-sm">{m.label}</span>
                            <span className="text-xs text-muted font-mono">{Math.round(m.value)}%</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-md w-full mt-xl">
                {isPassed && onNextLevel && (
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={onNextLevel}
                        className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 p-lg rounded-2xl font-bold text-xl flex items-center justify-center gap-sm shadow-lg shadow-emerald-500/20 group"
                    >
                        <span>المستوى التالي</span>
                        <ArrowRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                )}

                <div className="grid grid-cols-2 gap-md w-full">
                    <button
                        onClick={onRetry}
                        className="p-lg rounded-2xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-sm font-bold border border-white/5"
                    >
                        <ArrowCounterClockwise size={20} />
                        إعادة المحاولة
                    </button>
                    <button
                        onClick={onBack}
                        className="p-lg rounded-2xl bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-center gap-sm font-bold border border-white/5"
                    >
                        <List size={20} />
                        قائمة المراحل
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
