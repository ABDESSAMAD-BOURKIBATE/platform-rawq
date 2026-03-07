import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { GameMode, LevelData, Question } from '../../types/culture';
import { useCultureStore } from '../../store/useCultureStore';
import { CheckCircle, XCircle, ArrowRight, Timer, ClockCountdown, Fire, ArrowLeft } from '@phosphor-icons/react';
import { GameResult } from './GameResult';

// Fisher-Yates shuffle
function shuffleArray<T>(array: T[]): T[] {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
}

const TIMER_SECONDS = 30;
const OPTION_LABELS = ['أ', 'ب', 'ج', 'د'];

interface GameEngineProps {
    levelData: LevelData;
    onBack: () => void;
    onNextLevel: () => void;
}

export function GameEngine({ levelData, onBack, onNextLevel }: GameEngineProps) {
    const { t } = useTranslation();
    const { saveScore, unlockLevel, saveAttempt } = useCultureStore();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [shuffledOptions, setShuffledOptions] = useState<{ text: string; isCorrect: boolean }[]>([]);
    const [timerEnabled, setTimerEnabled] = useState(true);

    // Stats
    const [totalTimeSpent, setTotalTimeSpent] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [startTime, setStartTime] = useState<number>(0);

    // Pre-game screen
    const [gameStarted, setGameStarted] = useState(false);

    // Initialize
    useEffect(() => {
        const allQuestions = [...levelData.questions];
        const fullyShuffled = shuffleArray(allQuestions);
        const selectedQuestions = fullyShuffled.slice(0, 80);
        setQuestions(selectedQuestions);
        setCurrentQuestionIndex(0);
        setScore(0);
        setIsGameOver(false);
        setTotalTimeSpent(0);
        setIncorrectCount(0);
        setLongestStreak(0);
        setCurrentStreak(0);
        setGameStarted(false);
    }, [levelData]);

    // Setup current question
    useEffect(() => {
        if (!gameStarted) return;
        if (questions.length > 0 && currentQuestionIndex < questions.length) {
            const currentQ = questions[currentQuestionIndex];
            const optionsWithCorrectness = currentQ.options.map((opt, idx) => ({
                text: opt,
                isCorrect: idx === currentQ.correctAnswerIndex,
            }));
            setShuffledOptions(shuffleArray(optionsWithCorrectness));
            setSelectedAnswer(null);
            setIsAnswered(false);
            setTimeLeft(TIMER_SECONDS);
            setStartTime(Date.now());
        } else if (questions.length > 0 && currentQuestionIndex >= questions.length) {
            handleGameOver();
        }
    }, [currentQuestionIndex, questions, gameStarted]);

    // Timer
    useEffect(() => {
        if (!timerEnabled || isAnswered || isGameOver || questions.length === 0 || !gameStarted) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [isAnswered, isGameOver, questions.length, timerEnabled, gameStarted]);

    const handleTimeUp = () => {
        setIsAnswered(true);
        setIncorrectCount(prev => prev + 1);
        setCurrentStreak(0);
        const timeSpentOnQuestion = Math.round((Date.now() - startTime) / 1000);
        setTotalTimeSpent(prev => prev + timeSpentOnQuestion);
    };

    const handleAnswerSelect = (index: number, isCorrect: boolean) => {
        if (isAnswered) return;
        setSelectedAnswer(index);
        setIsAnswered(true);

        const timeSpentOnQuestion = Math.round((Date.now() - startTime) / 1000);
        setTotalTimeSpent(prev => prev + timeSpentOnQuestion);

        if (isCorrect) {
            setScore((prev) => prev + 1);
            const newStreak = currentStreak + 1;
            setCurrentStreak(newStreak);
            if (newStreak > longestStreak) setLongestStreak(newStreak);
        } else {
            setIncorrectCount(prev => prev + 1);
            setCurrentStreak(0);
        }
    };

    const handleNextQuestion = () => {
        setCurrentQuestionIndex((prev) => prev + 1);
    };

    const handleGameOver = () => {
        setIsGameOver(true);
        const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
        saveScore(levelData.mode as GameMode, levelData.id, percentage);

        const intelligence = isNaN(percentage) ? 0 : percentage;
        const avgTime = questions.length > 0 ? totalTimeSpent / questions.length : 0;
        const insightScale = Math.max(0, Math.min(100, 100 - (avgTime - 5) * 5));
        const insight = isNaN(insightScale) ? 0 : insightScale;
        const streakFactor = questions.length > 0 ? (longestStreak / (questions.length / 4)) * 100 : 0;
        const concentration = isNaN(streakFactor) ? 0 : Math.min(100, streakFactor);
        const memorization = Math.min(100, Math.round(
            (percentage * 0.5) + (Math.min(100, streakFactor) * 0.3) + (insightScale * 0.2)
        ));
        const errorRate = questions.length > 0 ? (incorrectCount / questions.length) : 1;
        const accuracy = Math.round(Math.max(0, (1 - errorRate) * 100));

        saveAttempt({
            mode: levelData.mode as GameMode,
            levelId: levelData.id,
            score,
            totalQuestions: questions.length,
            percentage,
            totalTime: totalTimeSpent,
            incorrectCount,
            longestStreak,
            intelligence,
            insight,
            concentration,
            memorization,
            accuracy,
            passed: percentage >= 50,
            date: new Date().toISOString(),
        });
    };

    if (questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-xl text-center">
                <h3 className="text-xl font-bold mb-md">جارِ تجهيز الأسئلة للمستوى {levelData.id}...</h3>
                <p className="text-muted mb-lg">لا توجد أسئلة كافية في هذا المستوى حالياً.</p>
                <button className="btn-primary" onClick={onBack}>{t('culture.backToModes')}</button>
            </div>
        );
    }

    // Pre-game Settings Screen
    if (!gameStarted) {
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                    maxWidth: '500px', margin: '0 auto', width: '100%',
                    display: 'flex', flexDirection: 'column', gap: 'var(--space-xl)',
                    alignItems: 'center', textAlign: 'center',
                    padding: 'var(--space-2xl) var(--space-lg)',
                }}
            >
                {/* Level badge */}
                <div style={{
                    width: '80px', height: '80px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(212,175,55,0.15), rgba(212,175,55,0.05))',
                    border: '2px solid rgba(212,175,55,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.8rem', fontWeight: 900, color: 'var(--accent-gold)',
                }}>
                    {levelData.id}
                </div>

                <div>
                    <h2 style={{
                        fontSize: '1.4rem', fontWeight: 800,
                        fontFamily: 'var(--font-heading)',
                        marginBottom: '6px',
                    }}>
                        {t('culture.level', { level: levelData.id })}
                    </h2>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {questions.length} سؤال — {t(`culture.modes.${levelData.mode}`)}
                    </p>
                </div>

                {/* Timer Toggle */}
                <div style={{
                    padding: 'var(--space-lg)', borderRadius: 'var(--radius-xl)',
                    background: 'var(--bg-card)', border: '1px solid var(--border)',
                    width: '100%',
                }}>
                    <h3 style={{
                        fontSize: '0.9rem', fontWeight: 700, marginBottom: 'var(--space-md)',
                        color: 'var(--text-secondary)',
                    }}>
                        إعدادات الاختبار
                    </h3>

                    <div
                        onClick={() => setTimerEnabled(!timerEnabled)}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '12px 16px', borderRadius: 'var(--radius-md)',
                            background: timerEnabled
                                ? 'linear-gradient(135deg, rgba(212,175,55,0.08), rgba(212,175,55,0.02))'
                                : 'rgba(255,255,255,0.03)',
                            border: timerEnabled
                                ? '1px solid rgba(212,175,55,0.2)'
                                : '1px solid var(--border)',
                            cursor: 'pointer', transition: 'all 0.2s ease',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            {timerEnabled ? (
                                <Timer size={22} color="var(--accent-gold)" weight="duotone" />
                            ) : (
                                <ClockCountdown size={22} color="var(--text-muted)" weight="duotone" />
                            )}
                            <div style={{ textAlign: 'start' }}>
                                <span style={{
                                    fontSize: '0.85rem', fontWeight: 700, display: 'block',
                                    color: timerEnabled ? 'var(--text)' : 'var(--text-secondary)',
                                }}>
                                    المؤقت
                                </span>
                                <span style={{
                                    fontSize: '0.7rem',
                                    color: 'var(--text-muted)',
                                }}>
                                    {timerEnabled ? `${TIMER_SECONDS} ثانية لكل سؤال` : 'بدون حد زمني'}
                                </span>
                            </div>
                        </div>

                        {/* Toggle pill */}
                        <div style={{
                            width: '44px', height: '24px', borderRadius: '12px',
                            background: timerEnabled ? 'var(--accent-gold)' : 'rgba(255,255,255,0.1)',
                            position: 'relative', transition: 'background 0.2s ease',
                        }}>
                            <div style={{
                                width: '18px', height: '18px', borderRadius: '50%',
                                background: '#fff',
                                position: 'absolute', top: '3px',
                                left: timerEnabled ? '23px' : '3px',
                                transition: 'left 0.2s ease',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                            }} />
                        </div>
                    </div>
                </div>

                {/* Start button */}
                <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setGameStarted(true)}
                    style={{
                        width: '100%', padding: '14px',
                        borderRadius: 'var(--radius-lg)',
                        background: 'linear-gradient(135deg, #D4AF37, #B8961F)',
                        color: '#0B1C1A', fontSize: '1.05rem', fontWeight: 800,
                        border: 'none', cursor: 'pointer',
                        boxShadow: '0 4px 15px rgba(212,175,55,0.3)',
                    }}
                >
                    بدء الاختبار
                </motion.button>

                <button
                    onClick={onBack}
                    style={{
                        fontSize: '0.82rem', color: 'var(--text-muted)',
                        background: 'none', border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: '4px',
                    }}
                >
                    <ArrowLeft size={14} />
                    العودة للمستويات
                </button>
            </motion.div>
        );
    }

    if (isGameOver) {
        const percentage = Math.round((score / questions.length) * 100);
        return (
            <GameResult
                percentage={percentage}
                score={score}
                totalQuestions={questions.length}
                totalTime={totalTimeSpent}
                incorrectCount={incorrectCount}
                longestStreak={longestStreak}
                onRetry={() => {
                    setCurrentQuestionIndex(0);
                    setScore(0);
                    setIsGameOver(false);
                    setTotalTimeSpent(0);
                    setIncorrectCount(0);
                    setLongestStreak(0);
                    setCurrentStreak(0);
                    setGameStarted(false);
                    const shuffledQuestions = shuffleArray(levelData.questions);
                    setQuestions(shuffledQuestions);
                }}
                onNextLevel={levelData.id < 30 ? onNextLevel : undefined}
                onBack={onBack}
            />
        );
    }

    const currentQ = questions[currentQuestionIndex];
    if (!currentQ && !isGameOver) return null;

    const progressPercent = ((currentQuestionIndex) / questions.length) * 100;
    const timerPercent = timerEnabled ? (timeLeft / TIMER_SECONDS) * 100 : 100;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
                maxWidth: '700px', margin: '0 auto', width: '100%',
                display: 'flex', flexDirection: 'column', gap: 'var(--space-md)',
            }}
        >
            {/* Top Bar */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '10px 16px',
                borderRadius: 'var(--radius-lg)',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
            }}>
                {/* Score */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                    }}>
                        <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600 }}>النتيجة</span>
                        <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--accent-gold)' }}>
                            {score}<span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>/{questions.length}</span>
                        </span>
                    </div>
                    {currentStreak >= 3 && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '3px',
                            fontSize: '0.65rem', fontWeight: 800, color: '#f97316',
                            background: 'rgba(249,115,22,0.1)',
                            padding: '2px 8px', borderRadius: '20px',
                        }}>
                            <Fire size={12} weight="fill" />
                            {currentStreak}
                        </div>
                    )}
                </div>

                {/* Timer */}
                {timerEnabled ? (
                    <div style={{ position: 'relative', width: '46px', height: '46px' }}>
                        <svg viewBox="0 0 100 100" style={{
                            width: '100%', height: '100%', transform: 'rotate(-90deg)',
                        }}>
                            <circle cx="50" cy="50" r="42" fill="none"
                                stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
                            <circle
                                cx="50" cy="50" r="42" fill="none"
                                stroke={timeLeft <= 5 ? '#ef4444' : timeLeft <= 10 ? '#f59e0b' : 'var(--accent-gold)'}
                                strokeWidth="6"
                                strokeDasharray="264"
                                strokeDashoffset={264 - (timerPercent / 100) * 264}
                                strokeLinecap="round"
                                style={{
                                    transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease',
                                }}
                            />
                        </svg>
                        <div style={{
                            position: 'absolute', inset: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '0.95rem', fontWeight: 800,
                            color: timeLeft <= 5 ? '#ef4444' : timeLeft <= 10 ? '#f59e0b' : 'var(--text)',
                        }}>
                            {timeLeft}
                        </div>
                    </div>
                ) : (
                    <div style={{
                        fontSize: '0.7rem', color: 'var(--text-muted)',
                        display: 'flex', alignItems: 'center', gap: '4px',
                    }}>
                        <ClockCountdown size={14} />
                        حر
                    </div>
                )}

                {/* Level / Question */}
                <div style={{ textAlign: 'left' }}>
                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: 600, display: 'block' }}>
                        المستوى {levelData.id}
                    </span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800 }}>
                        {currentQuestionIndex + 1}<span style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>/{questions.length}</span>
                    </span>
                </div>
            </div>

            {/* Progress bar */}
            <div style={{
                height: '3px', borderRadius: '2px',
                background: 'rgba(255,255,255,0.06)', overflow: 'hidden',
            }}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    style={{
                        height: '100%',
                        background: 'linear-gradient(to right, var(--accent-gold), #22c55e)',
                        borderRadius: '2px',
                    }}
                    transition={{ duration: 0.3 }}
                />
            </div>

            {/* Question Card */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, x: 30 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -30 }}
                    transition={{ duration: 0.25 }}
                    style={{
                        padding: 'var(--space-xl) var(--space-lg)',
                        borderRadius: 'var(--radius-xl)',
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        textAlign: 'center',
                        minHeight: '140px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                >
                    <h2 style={{
                        fontSize: '1.35rem',
                        fontFamily: 'var(--font-quran)',
                        lineHeight: 2,
                        color: 'var(--text)',
                        fontWeight: 600,
                    }}>
                        {currentQ.text}
                    </h2>
                </motion.div>
            </AnimatePresence>

            {/* Answer Options */}
            <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: '10px',
            }}>
                {shuffledOptions.map((option, idx) => {
                    const isCorrectOption = option.isCorrect;
                    const isSelected = selectedAnswer === idx;
                    const showCorrect = isAnswered && isCorrectOption;
                    const showWrong = isAnswered && isSelected && !isCorrectOption;

                    let bg = 'var(--bg-card)';
                    let borderColor = 'var(--border)';
                    let textColor = 'var(--text)';
                    let labelBg = 'rgba(255,255,255,0.06)';
                    let labelColor = 'var(--text-muted)';

                    if (showCorrect) {
                        bg = 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(34,197,94,0.05))';
                        borderColor = 'rgba(34,197,94,0.5)';
                        textColor = '#22c55e';
                        labelBg = 'rgba(34,197,94,0.2)';
                        labelColor = '#22c55e';
                    } else if (showWrong) {
                        bg = 'linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))';
                        borderColor = 'rgba(239,68,68,0.5)';
                        textColor = '#ef4444';
                        labelBg = 'rgba(239,68,68,0.2)';
                        labelColor = '#ef4444';
                    }

                    return (
                        <motion.button
                            key={idx}
                            whileHover={!isAnswered ? { scale: 1.02, y: -2 } : {}}
                            whileTap={!isAnswered ? { scale: 0.97 } : {}}
                            onClick={() => handleAnswerSelect(idx, isCorrectOption)}
                            disabled={isAnswered}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                padding: '14px 16px',
                                borderRadius: 'var(--radius-lg)',
                                background: bg, border: `1.5px solid ${borderColor}`,
                                cursor: isAnswered ? 'default' : 'pointer',
                                textAlign: 'start', color: textColor,
                                transition: 'all 0.2s ease',
                                position: 'relative', overflow: 'hidden',
                            }}
                        >
                            {/* Label */}
                            <span style={{
                                width: '28px', height: '28px', borderRadius: '50%',
                                background: labelBg, flexShrink: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.75rem', fontWeight: 800, color: labelColor,
                            }}>
                                {showCorrect ? (
                                    <CheckCircle size={18} weight="fill" color="#22c55e" />
                                ) : showWrong ? (
                                    <XCircle size={18} weight="fill" color="#ef4444" />
                                ) : (
                                    OPTION_LABELS[idx]
                                )}
                            </span>

                            {/* Text */}
                            <span style={{
                                fontSize: '1rem', fontWeight: 700,
                                fontFamily: 'var(--font-quran)',
                                lineHeight: 1.6,
                            }}>
                                {option.text}
                            </span>
                        </motion.button>
                    );
                })}
            </div>

            {/* Next Button */}
            <AnimatePresence>
                {isAnswered && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ display: 'flex', justifyContent: 'center', marginTop: '4px' }}
                    >
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={handleNextQuestion}
                            style={{
                                display: 'flex', alignItems: 'center', gap: '8px',
                                padding: '12px 32px', borderRadius: 'var(--radius-lg)',
                                background: 'linear-gradient(135deg, #D4AF37, #B8961F)',
                                color: '#0B1C1A', fontSize: '0.95rem', fontWeight: 800,
                                border: 'none', cursor: 'pointer',
                                boxShadow: '0 4px 15px rgba(212,175,55,0.25)',
                            }}
                        >
                            {currentQuestionIndex === questions.length - 1 ? 'عرض النتائج' : 'السؤال التالي'}
                            <ArrowRight size={18} />
                        </motion.button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
