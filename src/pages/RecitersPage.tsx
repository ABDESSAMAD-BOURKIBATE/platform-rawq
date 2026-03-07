import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { MagnifyingGlass, MusicNote, User, CaretLeft, GlobeHemisphereWest, Heart } from '@phosphor-icons/react';
import { fetchReciters } from '../api/mp3quran';
import { useRecitersStore } from '../store/useRecitersStore';

// Country code to flag emoji
const RECITER_COUNTRIES: Record<string, string[]> = {
    '🇸🇦': [
        'ماهر المعيقلي', 'عبد الرحمن السديس', 'عبدالرحمن السديس', 'سعود الشريم', 'بندر بليلة', 'عبدالله عواد الجهني',
        'علي بن عبدالرحمن الحذيفي', 'علي الحذيفي', 'صلاح البدير', 'أحمد طالب بن حميد', 'عبدالله البعيجان',
        'خالد الغامدي', 'صالح آل طالب', 'إبراهيم الأخضر', 'محمد أيوب', 'محمد المحيسني', 'ناصر القطامي',
        'ياسر الدوسري', 'إدريس أبكر', 'خالد الجليل', 'محمد اللحيدان', 'عادل الكلباني', 'هاني الرفاعي',
        'إبراهيم الجبرين', 'عبدالعزيز الزهراني', 'فهد العتيبي', 'عبدالله خياط', 'علي جابر', 'سهل ياسين',
        'عماد زهير حافظ', 'يوسف الشويعي', 'محمد خليل القارئ', 'أحمد الحذيفي', 'أحمد الحواشي', 'ماجد العنزي',
        'ماجد الزامل', 'خالد المهنا', 'حمد الدغريري', 'حسن الدغريري', 'فواز الكعبي', 'لافي العوني',
        'عبدالله المطرود', 'عبدالله بصفر', 'ناصر الماجد', 'ناصر العبيد', 'نايف الفيصل', 'بدر التركي',
        'هيثم الجدعاني', 'سعد المقرن', 'عمر الدريويز', 'عبدالعزيز العسيري', 'عبدالله بخاري', 'صالح القريشي',
        'إبراهيم العسيري', 'سعد الغامدي', 'صالح الشمراني', 'صالح الهبدان', 'عبدالعزيز التركي', 'خالد القحطاني',
        'خالد الوهيبي', 'خالد الشارخ', 'خالد الشريمي', 'خالد الزيادي', 'الوليد الشمسان', 'إبراهيم الشهري',
        'عبدالرحمن بن عبدالرزاق البدر', 'عثمان الأنصاري', 'جمعان العصيمي', 'إبراهيم السعدان', 'معيض الحارثي',
        'واصل المذن', 'سامي الدوسري', 'عبدالمحسن القاسم', 'عبدالمحسن العسكر', 'عبدالمحسن العبيكان', 'عبدالمحسن الحارثي'
    ],
    '🇪🇬': [
        'محمود خليل الحصري', 'الحصري', 'محمد صديق المنشاوي', 'المنشاوي', 'عبد الباسط عبد الصمد', 'عبدالباسط عبدالصمد',
        'مصطفى إسماعيل', 'محمود علي البنا', 'محمد رفعت', 'محمد الطبلاوي', 'الطبلاوي', 'أحمد نعينع',
        'محمد جبريل', 'أحمد عامر', 'محمود عبدالحكم', 'حسن صالح', 'الحسيني العزازي', 'أكرم العلاقمي',
        'حاتم فريد الواعر', 'أحمد عيسى المعصراوي', 'ياسر سلامة', 'عبد البارئ محمد', 'عبدالبارئ محمد', 'سيد رمضان',
        'شعبان الصياد', 'صابر عبدالحكم', 'أحمد خليل شاهين', 'عبدالله كامل', 'عبد الرحمن الشحات', 'عبدالرحمن الشحات', 'زكريا حمامة'
    ],
    '🇰🇼': [
        'مشاري العفاسي', 'فهد الكندري', 'صلاح الهاشم', 'عبدالله الكندري', 'أحمد النفيس', 'ياسر الفيلكاوي',
        'فيصل الهاجري', 'محمد البراك'
    ],
    '🇾🇪': [
        'وديع اليمني', 'فارس عباد', 'أبو بكر الشاطري', 'أبوبكر الشاطري', 'هاني الرفاعي', 'هيثم الدخين',
        'رامي الدعيس', 'فؤاد الخامري', 'عبدالبديع غيلان', 'محمد الفقيه'
    ],
    '🇲🇦': [
        'عمر القزابري', 'العيون الكوشي', 'يونس اسويلص', 'رشيد إفراد', 'هشام الهراز', 'يوسف الدغوش', 'محمد الأيراوي'
    ],
    '🇸🇩': [
        'نورين محمد صديق', 'الزين محمد أحمد', 'الفاتح محمد الزبير'
    ],
    '🇩🇿': [
        'عبدالعزيز سحيم', 'محمد سايد', 'رشيد بلعالية'
    ],
    '🇱🇾': [
        'الدوكالي محمد العالم', 'محمود الشيمي', 'طارق عبدالغني دعوب', 'محمد أبو سنينة', 'محمد الأمين قنيوة',
        'إبراهيم كشيدان', 'مفتاح السلطني'
    ],
    '🇮🇶': [
        'رعد محمد الكردي', 'مصطفى رعد العزاوي', 'وليد الدليمي', 'وشيار حيدر اربيلي', 'بيشه وا قادر الكردي'
    ],
    '🇸🇾': [
        'ماهر شخاشيرو', 'محمد عبدالحكيم سعيد العبدالله', 'عبدالهادي أحمد كناكري', 'يحيى حوا'
    ],
    '🇦🇪': [
        'خليفة الطنيجي', 'هزاع البلوشي'
    ],
    '🇯🇴': [
        'إبراهيم الجرمي', 'هاشم أبو دلال'
    ],
    '🇶🇦': [
        'مال الله عبدالرحمن الجابر'
    ],
    '🇧🇭': [
        'أنس العمادي'
    ],
    '🇮🇩': [
        'معمر الأندونيسي'
    ],
    '🇲🇾': [
        'أستاذ زامري', 'عبدالله فهمي', 'محمد حفص علي'
    ],
    '🇹🇿': [
        'عيسى عمر سناكو'
    ],
    '🇳🇬': [
        'جنيد آدم عبدالله'
    ],
    '🇵🇭': [
        'محمد خير النور'
    ],
    '🇹🇭': [
        'رقية سولونق'
    ],
    '🇹🇬': [
        'هارون بقائي'
    ],
    '🇬🇭': [
        'عكاشة كميني'
    ],
    '🇹🇩': [
        'محمد عثمان خان', 'يوسف بن نوح أحمد'
    ]
};

const COUNTRY_FLAGS: Record<string, string> = {
    'السعودية': '🇸🇦', 'مصر': '🇪🇬', 'الجزائر': '🇩🇿', 'المغرب': '🇲🇦',
    'تونس': '🇹🇳', 'العراق': '🇮🇶', 'الكويت': '🇰🇼', 'الإمارات': '🇦🇪',
    'قطر': '🇶🇦', 'البحرين': '🇧🇭', 'عمان': '🇴🇲', 'اليمن': '🇾🇪',
    'سوريا': '🇸🇾', 'الأردن': '🇯🇴', 'فلسطين': '🇵🇸', 'لبنان': '🇱🇧',
    'ليبيا': '🇱🇾', 'السودان': '🇸🇩', 'موريتانيا': '🇲🇷', 'الصومال': '🇸🇴',
    'تركيا': '🇹🇷', 'إيران': '🇮🇷', 'ماليزيا': '🇲🇾', 'إندونيسيا': '🇮🇩',
    'باكستان': '🇵🇰', 'الهند': '🇮🇳', 'نيجيريا': '🇳🇬', 'جيبوتي': '🇩🇯',
};

function getFlag(name: string): string | JSX.Element {
    for (const [flag, reciters] of Object.entries(RECITER_COUNTRIES)) {
        if (reciters.some(r => name.includes(r))) {
            return flag;
        }
    }
    for (const [key, flag] of Object.entries(COUNTRY_FLAGS)) {
        if (name.includes(key)) return flag;
    }
    return <GlobeHemisphereWest size={14} weight="fill" />;
}

// Generate avatar color from name
function avatarColor(name: string): string {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
    const colors = ['#D4AF37', '#58A89B', '#7B9EBD', '#E8A55A', '#B07D3A', '#6B7DB3', '#C66B3D'];
    return colors[Math.abs(hash) % colors.length];
}

export function RecitersPage() {
    const { t, i18n } = useTranslation();
    const {
        reciters, setReciters, searchQuery, setSearchQuery,
        riwayahFilter, setRiwayahFilter, isLoading, setLoading, error, setError,
        filteredReciters, loadedLanguage, setLoadedLanguage,
        toggleFavoriteReciter, isFavoriteReciter
    } = useRecitersStore();

    const navigate = useNavigate();

    useEffect(() => {
        if (reciters.length === 0 || loadedLanguage !== i18n.language) {
            setLoading(true);
            fetchReciters(i18n.language)
                .then((data) => {
                    setReciters(data);
                    setLoadedLanguage(i18n.language);
                })
                .catch((err) => setError(err.message));
        }
    }, [i18n.language, loadedLanguage]);

    const displayedReciters = filteredReciters();

    // Extract unique riwayat for filter chips
    const riwayatNames = Array.from(
        new Set(
            reciters.flatMap((r) => r.moshaf.map((m) => m.name.split('-')[0]?.trim() || m.name))
        )
    ).slice(0, 8);

    return (
        <div className="flex flex-col gap-lg">
            {/* Header */}
            <div className="animate-fade-in">
                <h1 style={{ fontSize: '1.5rem', marginBottom: 'var(--space-sm)' }}>
                    {t('reciters.title')}
                </h1>
                <p className="text-muted" style={{ fontSize: '0.85rem' }}>
                    {reciters.length > 0 && `${reciters.length}+ قارئ من مختلف الدول`}
                </p>
            </div>

            {/* Search */}
            <div className="relative animate-slide-up">
                <MagnifyingGlass
                    size={20}
                    style={{
                        position: 'absolute', top: '50%', transform: 'translateY(-50%)',
                        right: 'var(--space-md)', color: 'var(--text-muted)',
                    }}
                />
                <input
                    className="input"
                    style={{ paddingRight: 'calc(var(--space-md) + 26px)' }}
                    placeholder={t('reciters.searchPlaceholder')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Riwayah Filter Chips */}
            <div
                className="flex items-center gap-sm animate-slide-up stagger-1 no-scrollbar"
                style={{
                    overflowX: 'auto',
                    whiteSpace: 'nowrap',
                    paddingBottom: 'var(--space-xs)',
                    marginRight: 'calc(var(--space-md) * -1)',
                    marginLeft: 'calc(var(--space-md) * -1)',
                    paddingRight: 'var(--space-md)',
                    paddingLeft: 'var(--space-md)',
                }}
            >
                <button
                    className={`chip${!riwayahFilter ? ' active' : ''}`}
                    onClick={() => setRiwayahFilter('')}
                    style={{ flexShrink: 0 }}
                >
                    {t('reciters.allRiwayat')}
                </button>
                <button
                    className={`chip${riwayahFilter === 'favorites' ? ' active' : ''}`}
                    onClick={() => setRiwayahFilter(riwayahFilter === 'favorites' ? '' : 'favorites')}
                    style={{ flexShrink: 0 }}
                >
                    <Heart size={16} weight={riwayahFilter === 'favorites' ? 'fill' : 'regular'} style={{ display: 'inline', verticalAlign: 'text-bottom', margin: '0 2px' }} />
                    {t('reciters.favorites')}
                </button>
                {riwayatNames.map((name) => (
                    <button
                        key={name}
                        className={`chip${riwayahFilter === name ? ' active' : ''}`}
                        onClick={() => setRiwayahFilter(riwayahFilter === name ? '' : name)}
                        style={{ flexShrink: 0 }}
                    >
                        {name}
                    </button>
                ))}
            </div>

            {/* Reciters List */}
            {isLoading ? (
                <div className="flex flex-col gap-md">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="card flex items-center gap-md" style={{ padding: 'var(--space-md)' }}>
                            <div className="skeleton skeleton-circle" style={{ width: 52, height: 52, flexShrink: 0 }} />
                            <div style={{ flex: 1 }}>
                                <div className="skeleton skeleton-text" style={{ width: '60%' }} />
                                <div className="skeleton skeleton-text" style={{ width: '40%' }} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : error ? (
                <div className="empty-state">
                    <p>{error}</p>
                    <button
                        className="btn btn-primary"
                        onClick={() => {
                            setLoading(true);
                            fetchReciters(i18n.language)
                                .then((data) => {
                                    setReciters(data);
                                    setLoadedLanguage(i18n.language);
                                })
                                .catch((err) => setError(err.message));
                        }}
                    >
                        {t('common.retry')}
                    </button>
                </div>
            ) : displayedReciters.length === 0 ? (
                <div className="empty-state">
                    <User size={48} />
                    <p>{t('reciters.noResults')}</p>
                </div>
            ) : (
                <div className="flex flex-col gap-sm">
                    <span className="text-muted" style={{ fontSize: '0.8rem' }}>
                        {displayedReciters.length} {t('reciters.title')}
                    </span>
                    {displayedReciters.map((reciter, index) => {
                        const color = avatarColor(reciter.name);
                        const initials = reciter.name.slice(0, 2);
                        const flag = getFlag(reciter.name);

                        return (
                            <button
                                key={reciter.id}
                                className={`card flex items-center gap-md animate-slide-up stagger-${Math.min(index % 6 + 1, 6)}`}
                                style={{
                                    padding: 'var(--space-md)',
                                    textAlign: 'start',
                                }}
                                onClick={() => navigate(`/reciters/${reciter.id}`)}
                            >
                                {/* Avatar with initials */}
                                <div style={{
                                    width: 52, height: 52, borderRadius: 'var(--radius-full)',
                                    background: `${color}20`, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    position: 'relative', border: `2px solid ${color}40`,
                                }}>
                                    <span style={{ fontWeight: 700, fontSize: '1rem', color }}>{initials}</span>
                                    <span style={{
                                        position: 'absolute', bottom: -2, right: -2,
                                        fontSize: '1rem', lineHeight: 1,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: 'var(--bg-card)', borderRadius: '50%', padding: 2,
                                    }}>
                                        {flag}
                                    </span>
                                </div>

                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{ fontWeight: 600, fontSize: '0.95rem' }}>{reciter.name}</p>
                                    {reciter.moshaf.length > 0 && (
                                        <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                                            {reciter.moshaf[0].name} · {t('reciters.surahCount', { count: reciter.moshaf[0].surah_total })}
                                        </p>
                                    )}
                                </div>

                                <button
                                    className="btn btn-icon btn-ghost"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavoriteReciter(reciter.id);
                                    }}
                                    style={{ color: isFavoriteReciter(reciter.id) ? '#EF4444' : 'var(--text-muted)' }}
                                >
                                    <Heart size={22} weight={isFavoriteReciter(reciter.id) ? 'fill' : 'regular'} />
                                </button>
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
