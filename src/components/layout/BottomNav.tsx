import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { House, BookOpenText, MicrophoneStage, MagnifyingGlass, Gear } from '@phosphor-icons/react';

const navItems = [
    { path: '/', icon: House, labelKey: 'nav.home' },
    { path: '/mushaf', icon: BookOpenText, labelKey: 'nav.mushaf' },
    { path: '/reciters', icon: MicrophoneStage, labelKey: 'nav.reciters' },
    { path: '/search', icon: MagnifyingGlass, labelKey: 'nav.search' },
    { path: '/settings', icon: Gear, labelKey: 'nav.settings' },
];

export function BottomNav() {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <nav className="bottom-nav glass">
            {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                    <button
                        key={item.path}
                        className={`nav-item${isActive ? ' active' : ''}`}
                        onClick={() => navigate(item.path)}
                        aria-label={t(item.labelKey)}
                    >
                        <Icon size={24} weight={isActive ? 'duotone' : 'regular'} />
                        <span>{t(item.labelKey)}</span>
                    </button>
                );
            })}
        </nav>
    );
}
