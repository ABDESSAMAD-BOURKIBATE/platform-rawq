import { useState } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { MushafPage } from './pages/MushafPage';
import { RecitersPage } from './pages/RecitersPage';
import { ReciterDetailPage } from './pages/ReciterDetailPage';
import { SearchPage } from './pages/SearchPage';
import { SurahListPage } from './pages/SurahListPage';
import { SettingsPage } from './pages/SettingsPage';
import { QiblaPage } from './pages/QiblaPage';
import { PrayerTimesPage } from './pages/PrayerTimesPage';
import { RadioPage } from './pages/RadioPage';
import { WorldClockPage } from './pages/WorldClockPage';
import { QuranCulturePage } from './pages/QuranCulturePage';
import { AzkarPage } from './pages/AzkarPage';
import { SchedulePage } from './pages/SchedulePage';
import { KhatmaPage } from './pages/KhatmaPage';
import { HabitTrackerPage } from './pages/HabitTrackerPage';
import { SplashScreen, wasSplashSeen } from './components/ui/SplashScreen';
import { NotificationManager } from './components/ui/NotificationManager';
import { AdhanManager } from './components/ui/AdhanManager';

export default function App() {
    const [showSplash, setShowSplash] = useState(!wasSplashSeen());

    if (showSplash) {
        return <SplashScreen onComplete={() => setShowSplash(false)} />;
    }

    return (
        <HashRouter>
            <NotificationManager />
            <AdhanManager />
            <Routes>
                <Route element={<AppLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/mushaf" element={<MushafPage />} />
                    <Route path="/reciters" element={<RecitersPage />} />
                    <Route path="/reciters/:id" element={<ReciterDetailPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/surah-list" element={<SurahListPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="/qibla" element={<QiblaPage />} />
                    <Route path="/prayer-times" element={<PrayerTimesPage />} />
                    <Route path="/radio" element={<RadioPage />} />
                    <Route path="/world-clock" element={<WorldClockPage />} />
                    <Route path="/quran-culture" element={<QuranCulturePage />} />
                    <Route path="/azkar" element={<AzkarPage />} />
                    <Route path="/schedule" element={<SchedulePage />} />
                    <Route path="/khatma" element={<KhatmaPage />} />
                    <Route path="/tracker" element={<HabitTrackerPage />} />
                </Route>
            </Routes>
        </HashRouter>
    );
}
