
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowCounterClockwise, List, HandTap, CheckCircle } from '@phosphor-icons/react';
import { useNavigate } from 'react-router-dom';
import { azkarData, Dhikr } from '../data/azkarData';
import { CircularCounter } from '../components/azkar/CircularCounter';

export function AzkarPage() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [selectedDhikr, setSelectedDhikr] = useState<Dhikr>(azkarData[0]);
    const [counts, setCounts] = useState<Record<string, number>>({});
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const currentCount = counts[selectedDhikr.id] || 0;
    const isCompleted = currentCount >= selectedDhikr.target;

    const handleIncrement = () => {
        setCounts(prev => ({
            ...prev,
            [selectedDhikr.id]: (prev[selectedDhikr.id] || 0) + 1
        }));

        // Haptic feedback simulation if supported (mostly for mobile)
        if ('vibrate' in navigator) {
            navigator.vibrate(10);
        }
    };

    const handleReset = (e: React.MouseEvent) => {
        e.stopPropagation();
        setCounts(prev => ({
            ...prev,
            [selectedDhikr.id]: 0
        }));
    };

    const selectDhikr = (dhikr: Dhikr) => {
        setSelectedDhikr(dhikr);
        setIsMenuOpen(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-[#05110F] text-white overflow-hidden">
            {/* Header */}
            <header className="px-xl py-lg flex items-center justify-between z-50 bg-[#05110F]/80 backdrop-blur-md sticky top-0 border-b border-white/5">
                <div className="flex items-center w-12">
                    <button
                        onClick={() => navigate('/')}
                        className="p-sm rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                        <ArrowLeft size={24} className="rtl:rotate-180" />
                    </button>
                </div>

                <div className="flex-1" />

                <div className="flex items-center justify-end w-12">
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="p-sm rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                    >
                        <List size={24} />
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex flex-col items-center justify-start p-xl relative">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-accent-gold/5 blur-[100px] rounded-full pointer-events-none" />

                <AnimatePresence mode="wait">
                    <motion.div
                        key={selectedDhikr.id}
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 1.05, y: -20 }}
                        className="w-full max-w-md flex flex-col items-center z-20"
                    >
                        {/* Space between header and dhikr */}
                        <div className="h-20 md:h-28" />

                        {/* Dhikr Text Area */}
                        <div className="text-center px-xl min-h-[220px] flex items-center justify-center">
                            <h2
                                className="text-3xl md:text-5xl text-center leading-relaxed font-quran"
                                style={{
                                    textShadow: '0 0 30px rgba(212, 175, 55, 0.4)',
                                    color: isCompleted ? 'var(--accent-gold)' : 'white',
                                    transition: 'all 0.5s ease'
                                }}
                            >
                                {selectedDhikr.text}
                            </h2>
                        </div>

                        {/* Space between dhikr and counter */}
                        <div className="h-8 md:h-12" />

                        {/* Counter Area */}
                        <div className="relative group">
                            <CircularCounter
                                count={currentCount}
                                target={selectedDhikr.target}
                                onClick={handleIncrement}
                            />

                            {/* Reset Button */}
                            <motion.button
                                whileHover={{ scale: 1.1, rotate: 180 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleReset}
                                className="absolute -bottom-4 -right-4 p-md rounded-full bg-white/5 border border-white/10 backdrop-blur-md opacity-40 group-hover:opacity-100 transition-opacity z-30"
                            >
                                <ArrowCounterClockwise size={20} />
                            </motion.button>
                        </div>

                        <div className="h-12" />

                        {/* Completion Badge */}
                        <div className="h-12 flex items-center justify-center">
                            <AnimatePresence>
                                {isCompleted && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-center gap-sm bg-accent-gold/20 border border-accent-gold/50 px-lg py-sm rounded-full"
                                    >
                                        <CheckCircle size={20} weight="fill" className="text-accent-gold" />
                                        <span className="text-sm font-bold text-accent-gold">
                                            {t('adhkar.reached')}
                                        </span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Instructions */}
                        <div className="flex items-center gap-xs text-white/30 text-sm mt-4">
                            <HandTap size={18} />
                            <span>{t('adhkar.clickToCount')}</span>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </main>

            {/* Selection Menu (BottomSheet/Drawer) */}
            <AnimatePresence>
                {isMenuOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsMenuOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
                        />
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                            className="fixed bottom-0 left-0 right-0 bg-[#0F2B27] rounded-t-[32px] border-t border-white/10 p-xl z-[101] max-h-[80vh] overflow-y-auto"
                        >
                            <div className="w-12 h-1.5 bg-white/10 rounded-full mx-auto mb-xl" />
                            <h3 className="text-xl font-bold mb-xl text-center">{t('adhkar.title')}</h3>
                            <div className="grid grid-cols-1 gap-md">
                                {azkarData.map((dhikr) => (
                                    <button
                                        key={dhikr.id}
                                        onClick={() => selectDhikr(dhikr)}
                                        className={`w-full p-xl rounded-2xl text-right transition-all border ${selectedDhikr.id === dhikr.id
                                            ? 'bg-accent-gold/10 border-accent-gold/50 text-accent-gold'
                                            : 'bg-white/5 border-white/5 hover:bg-white/10'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="text-xs opacity-50 font-bold">{dhikr.target}</span>
                                            <span className="text-lg font-quran">{dhikr.text}</span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
