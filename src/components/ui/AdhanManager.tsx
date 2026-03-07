import { useEffect, useRef, useState } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { computePrayerTimes } from '../../utils/prayerTimes';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export function AdhanManager() {
    const { adhanEnabled, adhanAudio } = useSettingsStore();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const lastPlayedPrayer = useRef<string | null>(null);
    const locationRef = useRef<{ lat: number, lon: number } | null>(null);

    // Initialize audio element
    useEffect(() => {
        audioRef.current = new Audio(adhanAudio);
        // Preload but don't play
        audioRef.current.load();

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = '';
                audioRef.current = null;
            }
        };
    }, []);

    // Update audio source when settings change
    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.src = adhanAudio;
            audioRef.current.load();
        }
    }, [adhanAudio]);

    // Fetch location once on mount
    useEffect(() => {
        if (!navigator.geolocation) return;

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                locationRef.current = { lat: pos.coords.latitude, lon: pos.coords.longitude };
            },
            (err) => console.log('AdhanManager location error:', err),
            { enableHighAccuracy: false, maximumAge: 3600000 }
        );
    }, []);

    useEffect(() => {
        if (!adhanEnabled) return;

        let intervalId: NodeJS.Timeout;

        const checkTimeAndPlayAdhan = () => {
            if (!locationRef.current) return;

            const tz = -new Date().getTimezoneOffset() / 60;
            const times = computePrayerTimes(locationRef.current.lat, locationRef.current.lon, new Date(), tz);

            const now = new Date();
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const currentTimeStr = `${hours}:${minutes}`;

            // Check all prayers
            const prayersToCheck = [
                { name: 'fajr', time: times.fajr },
                { name: 'sunrise', time: times.sunrise },
                { name: 'dhuhr', time: times.dhuhr },
                { name: 'asr', time: times.asr },
                { name: 'maghrib', time: times.maghrib },
                { name: 'isha', time: times.isha }
            ];

            let activePrayer = null;

            // Helper function to send notification
            const sendAdhkarNotification = async (title: string, body: string, type: 'morning' | 'evening') => {
                if (Capacitor.isNativePlatform()) {
                    try {
                        await LocalNotifications.schedule({
                            notifications: [
                                {
                                    title,
                                    body,
                                    id: type === 'morning' ? 101 : 102,
                                    schedule: { at: new Date(Date.now() + 1000) }
                                }
                            ]
                        });
                    } catch (e) {
                        console.error('Capacitor Adhkar Notification failed', e);
                    }
                } else if ('Notification' in window && Notification.permission === 'granted') {
                    try {
                        if ('serviceWorker' in navigator) {
                            const reg = await navigator.serviceWorker.ready;
                            if (reg) {
                                reg.showNotification(title, {
                                    body,
                                    icon: '/rawq_logo.jpg',
                                    data: { url: '/azkar' }
                                });
                            } else {
                                const notif = new Notification(title, { body, icon: '/rawq_logo.jpg' });
                                notif.onclick = () => {
                                    window.focus();
                                    window.location.href = '/azkar';
                                };
                            }
                        } else {
                            const notif = new Notification(title, { body, icon: '/rawq_logo.jpg' });
                            notif.onclick = () => {
                                window.focus();
                                window.location.href = '/azkar';
                            };
                        }
                    } catch (e) {
                        console.error('Web Adhkar Notification failed', e);
                    }
                }

                if ('vibrate' in navigator) {
                    navigator.vibrate([200, 100, 200]);
                }
            };

            for (const prayer of prayersToCheck) {
                if (prayer.time === currentTimeStr) {
                    // Send Morning Adhkar notification at sunrise
                    if (prayer.name === 'sunrise' && lastPlayedPrayer.current !== 'sunrise') {
                        lastPlayedPrayer.current = 'sunrise';
                        sendAdhkarNotification('أذكار الصباح', 'حان وقت قراءة أذكار الصباح', 'morning');
                        return; // Sunrise isn't a prayer to play audio for, just notification
                    }

                    if (prayer.name !== 'sunrise') {
                        activePrayer = prayer;

                        // Send Evening Adhkar notification at maghrib
                        if (prayer.name === 'maghrib' && lastPlayedPrayer.current !== 'maghrib') {
                            sendAdhkarNotification('أذكار المساء', 'حان وقت قراءة أذكار المساء', 'evening');
                        }

                        // Ensure we only play once per prayer per minute
                        if (lastPlayedPrayer.current !== prayer.name) {
                            lastPlayedPrayer.current = prayer.name;

                            if (audioRef.current) {
                                audioRef.current.currentTime = 0; // Reset to start

                                // Using a user interaction might be required by browser
                                // We attempt to play, and catch if it's blocked.
                                const playPromise = audioRef.current.play();
                                if (playPromise !== undefined) {
                                    playPromise.catch(e => {
                                        console.error('Failed to play Adhan. Browser blocked autoplay:', e);
                                        // Could show a toast notification here indicating it's time for prayer
                                        // but blocked by browser policy without interaction.
                                    });
                                }
                            }
                        }
                        return; // Found a match, no need to check others
                    }
                }
            }

            // Reset last played if minute changes and no prayer is active
            if (!activePrayer && currentTimeStr !== times.sunrise) {
                lastPlayedPrayer.current = null;
            }
        };

        // Check roughly every minute on the minute mark to be precise
        const now = new Date();
        const delayUntilNextMinute = (60 - now.getSeconds()) * 1000;

        const timeoutId = setTimeout(() => {
            checkTimeAndPlayAdhan();
            intervalId = setInterval(checkTimeAndPlayAdhan, 60000); // every minute
        }, delayUntilNextMinute);

        return () => {
            clearTimeout(timeoutId);
            if (intervalId) clearInterval(intervalId);
        };
    }, [adhanEnabled]);

    return null; // This component doesn't render anything
}
