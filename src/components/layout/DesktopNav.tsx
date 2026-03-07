import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { House, BookOpenText, MicrophoneStage, MagnifyingGlass, Gear, Radio, HandHeart } from '@phosphor-icons/react';
import rawqLogo from '../../assets/rawq_logo.jpg';

const navItems = [
    { path: '/', icon: House, labelKey: 'nav.home' },
    { path: '/mushaf', icon: BookOpenText, labelKey: 'nav.mushaf' },
    { path: '/reciters', icon: MicrophoneStage, labelKey: 'nav.reciters' },
    { path: '/azkar', icon: HandHeart, labelKey: 'adhkar.title' },
    { path: '/radio', icon: Radio, labelKey: 'home.radios' },
    { path: '/search', icon: MagnifyingGlass, labelKey: 'nav.search' },
    { path: '/settings', icon: Gear, labelKey: 'nav.settings' },
];

export function DesktopNav() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    return (
        <aside className="desktop-nav glass">
            <div className="nav-logo" onClick={() => navigate('/')}>
                <img src={rawqLogo} alt="Logo" />
                <span>رَوْقٌ</span>
            </div>

            <nav className="nav-links">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.path}
                            className={`nav-btn ${isActive ? 'active' : ''}`}
                            onClick={() => navigate(item.path)}
                        >
                            <Icon size={24} weight={isActive ? 'duotone' : 'regular'} />
                            <span>{t(item.labelKey)}</span>
                        </button>
                    );
                })}
            </nav>
        </aside>
    );
}
