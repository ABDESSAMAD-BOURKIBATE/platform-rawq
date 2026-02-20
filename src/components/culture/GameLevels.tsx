import { useTranslation } from 'react-i18next';
import { GameMode, LevelData } from '../../types/culture';
import { useCultureStore } from '../../store/useCultureStore';
import { LockKey, Star, Play } from '@phosphor-icons/react';

interface GameLevelsProps {
    mode: GameMode;
    levels: LevelData[];
    onSelectLevel: (level: LevelData) => void;
    onBack: () => void;
}

export function GameLevels({ mode, levels, onSelectLevel, onBack }: GameLevelsProps) {
    const { t } = useTranslation();
    const { isLevelUnlocked, getHighScore } = useCultureStore();

    return (
        <div className="animate-fade-in flex flex-col gap-xl">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold mb-xs">{t(`culture.modes.${mode}`)}</h2>
                    <p className="text-muted">{t(`culture.modes.${mode}Desc`)}</p>
                </div>
                <button className="btn-outline" onClick={onBack}>
                    {t('culture.backToModes')}
                </button>
            </div>

            <div className="grid grid-4 gap-md md-grid-3 sm-grid-2">
                {levels.map((level, idx) => {
                    const isUnlocked = isLevelUnlocked(mode, level.id);
                    const highScore = getHighScore(mode, level.id);
                    const hasStars = highScore > 0;

                    return (
                        <div
                            key={level.id}
                            className={`animate-scale-in stagger-${Math.min((idx % 10) + 1, 10)} p-lg rounded-xl flex flex-col items-center justify-center text-center transition-all ${isUnlocked
                                    ? 'card-glass hover:scale-105 cursor-pointer border-opacity-30 hover:border-gold'
                                    : 'bg-black/30 border border-white/5 opacity-60'
                                }`}
                            onClick={() => isUnlocked && onSelectLevel(level)}
                            style={{
                                minHeight: '160px',
                                border: isUnlocked ? '1px solid rgba(212, 175, 55, 0.2)' : undefined
                            }}
                        >
                            <span className="text-xl font-bold mb-sm text-gold">
                                {t('culture.level', { level: level.id })}
                            </span>

                            {isUnlocked ? (
                                <>
                                    <div className="flex items-center gap-xs mb-md">
                                        {[1, 2, 3].map((star) => (
                                            <Star
                                                key={star}
                                                size={18}
                                                weight={hasStars && highScore >= (star * 33) ? "fill" : "duotone"}
                                                color={hasStars && highScore >= (star * 33) ? "var(--accent-gold)" : "var(--text-muted)"}
                                            />
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-xs text-sm font-medium bg-gold/10 text-gold px-sm py-xs rounded-full">
                                        <Play size={14} weight="fill" />
                                        <span>بدء اللعب</span>
                                    </div>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-sm mt-sm">
                                    <LockKey size={28} color="var(--text-muted)" weight="duotone" />
                                    <span className="text-sm text-muted">{t('culture.locked')}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
