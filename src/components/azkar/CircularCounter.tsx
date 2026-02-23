
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';

interface CircularCounterProps {
    count: number;
    target: number;
    onClick: () => void;
}

export function CircularCounter({ count, target, onClick }: CircularCounterProps) {
    const progress = Math.min((count / target) * 100, 100);
    const radius = 80;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (progress / 100) * circumference;

    return (
        <div
            className="relative flex items-center justify-center cursor-pointer select-none"
            onClick={onClick}
            style={{ width: 240, height: 240 }} // Slightly larger to accommodate stroke without clipping
        >
            {/* Background Circle */}
            <svg
                viewBox="0 0 220 220"
                className="absolute w-full h-full transform -rotate-90 overflow-visible"
            >
                <circle
                    cx="110"
                    cy="110"
                    r={radius}
                    stroke="rgba(212, 175, 55, 0.1)"
                    strokeWidth="12"
                    fill="transparent"
                />
                {/* Progress Circle */}
                <motion.circle
                    cx="110"
                    cy="110"
                    r={radius}
                    stroke="var(--accent-gold)"
                    strokeWidth="12"
                    strokeLinecap="round"
                    fill="transparent"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{
                        strokeDasharray: circumference,
                    }}
                />
            </svg>

            {/* Inner Content */}
            <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
                whileTap={{ scale: 0.95 }}
            >
                <div className="flex flex-col items-center justify-center bg-[#0F2B27]/80 backdrop-blur-xl rounded-full border border-white/10 shadow-2xl" style={{ width: 150, height: 150 }}>
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={count}
                            initial={{ opacity: 0, scale: 0.5, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.2, y: -10 }}
                            className="text-4xl md:text-5xl font-bold text-white shadow-glow"
                            style={{ fontFamily: 'var(--font-ui)' }}
                        >
                            {count}
                        </motion.span>
                    </AnimatePresence>
                    <span className="text-sm text-white/40 mt-1 uppercase tracking-widest font-bold" dir="ltr">
                        {count} / {target}
                    </span>
                </div>
            </motion.div>

            {/* Outer Glow */}
            <div
                className="absolute inset-0 rounded-full opacity-20 pointer-events-none"
                style={{
                    background: `radial-gradient(circle, var(--accent-gold) 0%, transparent 70%)`,
                    transform: `scale(${1 + (progress / 100) * 0.2})`,
                }}
            />
        </div>
    );
}
