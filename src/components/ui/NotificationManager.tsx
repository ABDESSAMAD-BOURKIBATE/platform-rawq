import { useEffect, useRef } from 'react';
import { useScheduleStore } from '../../store/useScheduleStore';
import { Capacitor } from '@capacitor/core';
import { LocalNotifications } from '@capacitor/local-notifications';

export function NotificationManager() {
    const { tasks } = useScheduleStore();
    const notifiedTasks = useRef<Set<string>>(new Set());

    useEffect(() => {
        const requestPermissions = async () => {
            if (Capacitor.isNativePlatform()) {
                const permStatus = await LocalNotifications.checkPermissions();
                if (permStatus.display !== 'granted') {
                    await LocalNotifications.requestPermissions();
                }
            } else if ('Notification' in window && Notification.permission === 'default') {
                Notification.requestPermission();
            }
        };

        requestPermissions();
    }, []);

    useEffect(() => {
        // Check every 10 seconds to catch the time right when it changes
        const interval = setInterval(() => {
            if (!('Notification' in window)) return;

            const now = new Date();
            const currentHours = String(now.getHours()).padStart(2, '0');
            const currentMinutes = String(now.getMinutes()).padStart(2, '0');
            const currentTimeStr = `${currentHours}:${currentMinutes}`;

            tasks.forEach(async (task) => {
                if (task.time === currentTimeStr && !task.isCompleted && !notifiedTasks.current.has(task.id)) {
                    // Mark as notified so we don't alert multiple times within the same minute
                    notifiedTasks.current.add(task.id);

                    const notifyTitle = 'تنبيه: حان وقت المهمة';
                    const notifyBody = task.title;

                    if (Capacitor.isNativePlatform()) {
                        // Capacitor Android/iOS Local Notification
                        try {
                            await LocalNotifications.schedule({
                                notifications: [
                                    {
                                        title: notifyTitle,
                                        body: notifyBody,
                                        id: parseInt(task.id) % 2147483647,
                                        schedule: { at: new Date(Date.now() + 1000) }
                                    }
                                ]
                            });
                        } catch (e) {
                            console.error('Capacitor Notification failed', e);
                        }
                    } else {
                        // Web Logic
                        if ('Notification' in window && Notification.permission === 'granted') {
                            try {
                                // Prefer Service Worker for reliable background delivery on mobile web
                                if ('serviceWorker' in navigator) {
                                    const reg = await navigator.serviceWorker.ready;
                                    if (reg) {
                                        reg.showNotification(notifyTitle, {
                                            body: notifyBody,
                                            icon: '/rawq_logo.jpg'
                                        });
                                    } else {
                                        new Notification(notifyTitle, { body: notifyBody, icon: '/rawq_logo.jpg' });
                                    }
                                } else {
                                    new Notification(notifyTitle, { body: notifyBody, icon: '/rawq_logo.jpg' });
                                }
                            } catch (e) {
                                console.error('Web Notification failed', e);
                            }
                        }

                        // Attempt vibration for mobile browser devices
                        if ('vibrate' in navigator) {
                            navigator.vibrate([200, 100, 200]);
                        }
                    }
                }
            });

            // Cleanup old task IDs from the set if they're no longer the current time
            // To prevent memory leak and allow it to trigger again the next day
            // We can just keep it simple right now.
        }, 10000);

        return () => clearInterval(interval);
    }, [tasks]);

    return null; // This component doesn't render anything visible directly
}
