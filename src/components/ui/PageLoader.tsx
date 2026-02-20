import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { CircleNotch } from '@phosphor-icons/react';

export function PageLoader() {
    const [isLoading, setIsLoading] = useState(false);
    const location = useLocation();

    useEffect(() => {
        setIsLoading(true);
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 600); // slightly longer to feel like a real load

        return () => clearTimeout(timer);
    }, [location.pathname, location.search]);

    if (!isLoading) return null;

    return (
        <div
            className="fixed z-[9999] pointer-events-none flex justify-center"
            style={{
                top: '20px',
                left: '50%',
                transform: 'translateX(-50%)',
                animation: 'slideDownFade 0.3s ease-out forwards'
            }}
        >
            <div className="bg-surface/95 backdrop-blur-md px-5 py-2.5 rounded-full shadow-xl shadow-black/20 border border-white/10 flex items-center gap-3">
                <CircleNotch weight="bold" className="w-5 h-5 text-primary animate-spin" />
                <span className="text-sm font-medium text-text-primary px-1">جاري التحميل...</span>
            </div>
            <style>{`
                @keyframes slideDownFade {
                    0% { opacity: 0; transform: translate(-50%, -10px); }
                    100% { opacity: 1; transform: translate(-50%, 0); }
                }
            `}</style>
        </div>
    );
}
