import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BookOpenText, Target, Users } from '@phosphor-icons/react';
import { GameMode, LevelData } from '../types/culture';
import { gameData } from '../data/cultureQuestions';
import { GameLevels } from '../components/culture/GameLevels';
import { GameEngine } from '../components/culture/GameEngine';
import { DynamicCard } from '../components/ui/DynamicCard';

export function QuranCulturePage() {
    const { t } = useTranslation();
    const [selectedMode, setSelectedMode] = useState<GameMode | null>(null);
    const [selectedLevel, setSelectedLevel] = useState<LevelData | null>(null);

    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const modes = [
        {
            id: 'completeVerse' as GameMode,
            icon: <BookOpenText size={48} weight="duotone" color="#D4AF37" />,
            title: t('culture.modes.completeVerse'),
            desc: t('culture.modes.completeVerseDesc'),
            gradient: '#D4AF37'
        },
        {
            id: 'multipleChoice' as GameMode,
            icon: <Target size={48} weight="duotone" color="#58A89B" />,
            title: t('culture.modes.multipleChoice'),
            desc: t('culture.modes.multipleChoiceDesc'),
            gradient: '#58A89B'
        },
        {
            id: 'stories' as GameMode,
            icon: <Users size={48} weight="duotone" color="#E8A55A" />,
            title: t('culture.modes.stories'),
            desc: t('culture.modes.storiesDesc'),
            gradient: '#E8A55A'
        }
    ];

    return (
        <div className="page-container p-xl animate-fade-in flex flex-col gap-2xl">
            {/* Header */}
            {!selectedLevel && (
                <div className="text-center mb-lg">
                    <h1 style={{
                        fontSize: '3rem',
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 900,
                        background: 'linear-gradient(to right, #F6D365, #FFB03B)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        marginBottom: 'var(--space-md)'
                    }}>
                        {t('culture.title')}
                    </h1>
                    <p className="text-xl text-muted" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        {t('culture.description')}
                    </p>
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
                        if (nextLevelData) {
                            setSelectedLevel(nextLevelData);
                        } else {
                            setSelectedLevel(null);
                        }
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
                <div className="grid grid-3 gap-xl md-grid-1">
                    {modes.map((mode, idx) => (
                        <DynamicCard
                            key={mode.id}
                            className={`animate-scale-in flex flex-col items-center text-center p-2xl cursor-pointer stagger-${idx + 1}`}
                            onClick={() => setSelectedMode(mode.id)}
                            gradientColor={mode.gradient}
                            style={{ minHeight: '320px', gap: 'var(--space-lg)' }}
                        >
                            <div style={{
                                width: '100px', height: '100px', borderRadius: '50%',
                                background: `${mode.gradient}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: `1px solid ${mode.gradient}40`,
                                marginBottom: 'var(--space-md)'
                            }}>
                                {mode.icon}
                            </div>
                            <h2 className="text-2xl font-bold">{mode.title}</h2>
                            <p className="text-muted leading-relaxed">{mode.desc}</p>

                            <div className="mt-auto pt-lg border-t border-white/5 w-full">
                                <span className="text-sm font-bold text-gold">30 مستوى متاح</span>
                            </div>
                        </DynamicCard>
                    ))}
                </div>
            )}
        </div>
    );
}
