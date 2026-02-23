import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { GameMode, LevelData, Question } from '../../types/culture';
import { useCultureStore } from '../../store/useCultureStore';
import { CheckCircle, XCircle, ClockClockwise, ArrowRight, Trophy } from '@phosphor-icons/react';
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

interface GameEngineProps {
    levelData: LevelData;
    onBack: () => void;
    onNextLevel: () => void;
}

export function GameEngine({ levelData, onBack, onNextLevel }: GameEngineProps) {
    const { t } = useTranslation();
    const { saveScore, unlockLevel } = useCultureStore();

    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30); // 30 seconds per question
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [shuffledOptions, setShuffledOptions] = useState<{ text: string; isCorrect: boolean }[]>([]);

    // Stats for final result
    const [totalTimeSpent, setTotalTimeSpent] = useState(0);
    const [incorrectCount, setIncorrectCount] = useState(0);
    const [longestStreak, setLongestStreak] = useState(0);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [startTime, setStartTime] = useState<number>(0);

    // Initialize level logic
    useEffect(() => {
        // We received a bank of 80+ questions in levelData.questions
        // We must ensure exactly 80 questions are picked (or max available)
        // and they are completely randomized.
        const allQuestions = [...levelData.questions];
        const fullyShuffled = shuffleArray(allQuestions);
        // Take 80 questions per level to match the user's "ازيد من 80 سؤال لكل مستوى" 
        // Or if there are exactly 80 or 85, take 80.
        const selectedQuestions = fullyShuffled.slice(0, 80);

        setQuestions(selectedQuestions);
        setCurrentQuestionIndex(0);
        setScore(0);
        setIsGameOver(false);
        setTotalTimeSpent(0);
        setIncorrectCount(0);
        setLongestStreak(0);
        setCurrentStreak(0);
    }, [levelData]);

    // Setup current question
    useEffect(() => {
        if (questions.length > 0 && currentQuestionIndex < questions.length) {
            const currentQ = questions[currentQuestionIndex];
            // Fully randomize answers every time the question appears
            const optionsWithCorrectness = currentQ.options.map((opt, idx) => ({
                text: opt,
                isCorrect: idx === currentQ.correctAnswerIndex,
            }));
            // Shuffle the options so the correct answer isn't in the same place
            setShuffledOptions(shuffleArray(optionsWithCorrectness));
            setSelectedAnswer(null);
            setIsAnswered(false);
            setTimeLeft(30);
            setStartTime(Date.now());
        } else if (questions.length > 0 && currentQuestionIndex >= questions.length) {
            handleGameOver();
        }
    }, [currentQuestionIndex, questions]);

    // Timer logic
    useEffect(() => {
        if (isAnswered || isGameOver || questions.length === 0) return;

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
    }, [isAnswered, isGameOver, questions.length]);

    const handleTimeUp = () => {
        setIsAnswered(true);
        // Maybe play a sound
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
                    const shuffledQuestions = shuffleArray(levelData.questions);
                    setQuestions(shuffledQuestions);
                }}
                onNextLevel={levelData.id < 30 ? onNextLevel : undefined}
                onBack={onBack}
            />
        );
    }

    const currentQ = questions[currentQuestionIndex];

    if (!currentQ && !isGameOver) return null; // Safety guard during transitions
    const timerStrokeOffset = ((30 - timeLeft) / 30) * 100;

    return (
        <div className="animate-fade-in flex flex-col gap-lg" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Header: Score, Timer, Progress */}
            <div className="flex items-center justify-between card-glass p-md rounded-xl">
                <div className="flex flex-col">
                    <span className="text-sm text-muted">{t('culture.score')}</span>
                    <span className="text-xl font-bold text-gold">{score} / {questions.length}</span>
                </div>

                {/* Timer */}
                <div style={{ position: 'relative', width: '60px', height: '60px' }}>
                    <svg width="60" height="60" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
                        <circle
                            cx="50" cy="50" r="45" fill="none"
                            stroke={timeLeft <= 5 ? '#ef4444' : 'var(--accent-gold)'}
                            strokeWidth="8"
                            strokeDasharray="283"
                            strokeDashoffset={(timerStrokeOffset * 283) / 100}
                            style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease', transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
                        />
                    </svg>
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '1.2rem', fontWeight: 700, color: timeLeft <= 5 ? '#ef4444' : 'var(--text-primary)'
                    }}>
                        {timeLeft}
                    </div>
                </div>

                <div className="flex flex-col text-left">
                    <span className="text-sm text-muted" dir="ltr">{t('culture.level', { level: levelData.id })}</span>
                    <span className="text-xl font-bold">{t('culture.question', { current: currentQuestionIndex + 1, total: questions.length })}</span>
                </div>
            </div>

            {/* Question Card */}
            <div className="card-glass p-xl rounded-2xl flex flex-col items-center justify-center text-center" style={{ minHeight: '200px' }}>
                <h2 style={{
                    fontSize: '1.8rem',
                    fontFamily: 'var(--font-heading)',
                    lineHeight: 1.6,
                    color: 'var(--text-primary)'
                }}>
                    {currentQ.text}
                </h2>
            </div>

            {/* Answers Grid */}
            <div className="grid grid-2 gap-md mt-lg">
                {shuffledOptions.map((option, idx) => {
                    let btnStyle: React.CSSProperties = {
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                        border: 'none',
                        boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                        backdropFilter: 'blur(10px)',
                        color: 'var(--text-primary)',
                    };

                    if (isAnswered) {
                        if (option.isCorrect) {
                            btnStyle = {
                                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.5), rgba(21, 128, 61, 0.7))',
                                border: 'none',
                                color: '#fff',
                                boxShadow: '0 8px 25px rgba(34, 197, 94, 0.3)',
                            };
                        } else if (selectedAnswer === idx) {
                            btnStyle = {
                                background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.5), rgba(185, 28, 28, 0.7))',
                                border: 'none',
                                color: '#fff',
                                boxShadow: '0 8px 25px rgba(239, 68, 68, 0.3)',
                            };
                        }
                    }

                    return (
                        <button
                            key={idx}
                            onClick={() => handleAnswerSelect(idx, option.isCorrect)}
                            disabled={isAnswered}
                            className={`p-xl rounded-2xl flex items-center justify-center text-xl md:text-2xl font-bold transition-all duration-300 relative overflow-hidden ${!isAnswered ? 'hover:-translate-y-1 hover:shadow-lg hover:bg-white/10' : ''}`}
                            style={{ ...btnStyle, minHeight: '90px' }}
                        >
                            <span className="z-10">{option.text}</span>
                            {isAnswered && option.isCorrect && (
                                <div className="absolute left-6 z-10 animate-scale-in">
                                    <CheckCircle size={32} color="#fff" weight="fill" />
                                </div>
                            )}
                            {isAnswered && selectedAnswer === idx && !option.isCorrect && (
                                <div className="absolute left-6 z-10 animate-scale-in">
                                    <XCircle size={32} color="#fff" weight="fill" />
                                </div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Next Button */}
            {isAnswered && (
                <div className="flex justify-center mt-md animate-slide-up">
                    <button
                        className="btn-primary flex items-center gap-sm text-lg px-xl py-md"
                        onClick={handleNextQuestion}
                    >
                        {currentQuestionIndex === questions.length - 1 ? t('culture.finishLevel') : t('culture.nextQuestion')}
                        <ArrowRight size={24} />
                    </button>
                </div>
            )}
        </div>
    );
}
