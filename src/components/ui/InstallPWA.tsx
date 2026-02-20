import { useState, useEffect } from 'react';
import { DownloadSimple, X } from '@phosphor-icons/react';

interface BeforeInstallPromptEvent extends Event {
    readonly platforms: Array<string>;
    readonly userChoice: Promise<{
        outcome: 'accepted' | 'dismissed';
        platform: string;
    }>;
    prompt(): Promise<void>;
}

export function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [isInstallable, setIsInstallable] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return;
        }

        const handleBeforeInstallPrompt = (e: Event) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e as BeforeInstallPromptEvent);
            // Update UI notify the user they can install the PWA
            setIsInstallable(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        // Cleanup
        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        await deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            setIsInstallable(false);
        }

        // Clear the deferredPrompt
        setDeferredPrompt(null);
    };

    if (!isInstallable || isDismissed) return null;

    return (
        <div className="fixed bottom-[calc(var(--bottom-nav-height)+16px)] left-4 right-4 z-50 animate-in slide-in-from-bottom-5">
            <div className="bg-surface/95 backdrop-blur-md border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center shrink-0 text-primary">
                        <DownloadSimple weight="bold" className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-text-primary font-semibold text-sm">تثبيت التطبيق</h3>
                        <p className="text-text-secondary text-xs mt-0.5">ثبّت منصة رَوْقٌ للوصول السريع</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={handleInstallClick}
                        className="bg-primary hover:bg-primary-hover text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
                    >
                        تثبيت
                    </button>
                    <button
                        onClick={() => setIsDismissed(true)}
                        className="w-8 h-8 flex items-center justify-center rounded-xl bg-surface-hover text-text-secondary hover:text-text-primary transition-colors shrink-0"
                    >
                        <X weight="bold" className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
