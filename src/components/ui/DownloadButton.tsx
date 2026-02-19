import { toPng } from 'html-to-image';
import { DownloadSimple, Spinner } from '@phosphor-icons/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface DownloadButtonProps {
    targetId: string;
    fileName?: string;
    label?: string;
    className?: string;
}

export function DownloadButton({ targetId, fileName = 'image.png', label, className }: DownloadButtonProps) {
    const { t } = useTranslation();
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        const element = document.getElementById(targetId);
        if (!element) return;

        setLoading(true);
        try {
            const dataUrl = await toPng(element, { cacheBust: true, pixelRatio: 2 });
            const link = document.createElement('a');
            link.download = fileName;
            link.href = dataUrl;
            link.click();
        } catch (err) {
            console.error('Failed to download image', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            className={`btn btn-secondary ${className || ''}`}
            onClick={handleDownload}
            disabled={loading}
        >
            {loading ? <Spinner className="animate-spin" size={20} /> : <DownloadSimple size={20} />}
            {label || t('common.download')}
        </button>
    );
}
