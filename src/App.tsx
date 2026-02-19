import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

export default function App() {
    return (
        <BrowserRouter>
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
                </Route>
            </Routes>
        </BrowserRouter>
    );
}
