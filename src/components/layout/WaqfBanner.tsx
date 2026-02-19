import { useTranslation } from 'react-i18next';

export function WaqfBanner() {
    const { t } = useTranslation();

    return (
        <div className="waqf-banner animate-fade-in">
            <p>{t('waqf.text')}</p>
        </div>
    );
}
