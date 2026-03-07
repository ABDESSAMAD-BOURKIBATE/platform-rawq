
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
            style={{ width: 220, height: 220 }}
        >
            {/* Subtle Outer Glow — very faint, only visible with progress */}
            <div
                className="absolute rounded-full pointer-events-none"
                style={{
                    width: '200px', height: '200px',
                    top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    boxShadow: `0 0 ${30 + progress * 0.4}px rgba(212, 175, 55, ${0.05 + progress * 0.002})`,
                    borderRadius: '50%',
                    transition: 'box-shadow 0.4s ease',
                }}
            />

            {/* SVG Ring */}
            <svg
                viewBox="0 0 220 220"
                className="absolute w-full h-full"
                style={{ transform: 'rotate(-90deg)' }}
            >
                {/* Track Ring */}
                <circle
                    cx="110"
                    cy="110"
                    r={radius}
                    stroke="var(--border)"
                    strokeWidth="6"
                    fill="transparent"
                />
                {/* Progress Ring */}
                <motion.circle
                    cx="110"
                    cy="110"
                    r={radius}
                    stroke="var(--accent-gold)"
                    strokeWidth="6"
                    strokeLinecap="round"
                    fill="transparent"
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{
                        strokeDasharray: circumference,
                        filter: 'drop-shadow(0 0 4px var(--accent-gold-glow))',
                    }}
                />
            </svg>

            {/* Inner Content */}
            <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none"
                whileTap={{ scale: 0.95 }}
            >
                <div
                    className="flex flex-col items-center justify-center rounded-full"
                    style={{
                        width: 140, height: 140,
                        background: 'var(--bg-card)',
                        border: '1px solid var(--border)',
                        boxShadow: 'inset 0 2px 12px rgba(0,0,0,0.2)',
                    }}
                >
                    <AnimatePresence mode="wait">
                        <motion.span
                            key={count}
                            initial={{ opacity: 0, scale: 0.5, y: 8 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 1.2, y: -8 }}
                            style={{
                                fontSize: '2.5rem',
                                fontWeight: 700,
                                fontFamily: 'var(--font-ui)',
                                color: progress >= 100 ? 'var(--accent-gold)' : 'var(--text)',
                                transition: 'color 0.3s ease',
                            }}
                        >
                            {count}
                        </motion.span>
                    </AnimatePresence>
                    <span style={{
                        fontSize: '0.72rem',
                        fontWeight: 600,
                        color: 'var(--text-muted)',
                        letterSpacing: '1px',
                        marginTop: '2px',
                    }} dir="ltr">
                        {count} / {target}
                    </span>
                </div>
            </motion.div>
        </div>
    );
}
