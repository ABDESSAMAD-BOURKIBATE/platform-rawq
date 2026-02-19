
import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';

interface DynamicCardProps {
    children: ReactNode;
    onClick?: () => void;
    className?: string;
    style?: React.CSSProperties;
    gradientColor?: string;
}

export function DynamicCard({ children, onClick, className = '', style = {}, gradientColor = '#D4AF37' }: DynamicCardProps) {
    return (
        <motion.div
            layout
            className={`relative rounded-2xl overflow-hidden cursor-pointer ${className}`}
            style={style}
            onClick={onClick}
            initial={{ opacity: 0, y: 20 }}
            animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.5 }
            }}
            whileHover={{
                scale: 1.02,
                y: -5,
                transition: { duration: 0.2 }
            }}
            whileTap={{ scale: 0.98 }}
        >
            {/* Animated Gradient Border Layer */}
            <motion.div
                className="absolute inset-[-50%]"
                style={{
                    background: `conic-gradient(from 0deg, transparent 0deg, ${gradientColor} 90deg, transparent 180deg)`,
                    opacity: 0.5,
                }}
                animate={{ rotate: 360 }}
                transition={{
                    duration: 4,
                    ease: "linear",
                    repeat: Infinity
                }}
            />

            {/* Content Container (Glassmorphism) */}
            <div className="absolute inset-[1px] rounded-2xl bg-[#0F2B27]/90 backdrop-blur-md z-10" />

            {/* Content */}
            <div className="relative z-20 h-full">
                {children}
            </div>
        </motion.div>
    );
}
