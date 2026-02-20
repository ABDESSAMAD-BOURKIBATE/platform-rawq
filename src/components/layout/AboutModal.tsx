import { useTranslation } from 'react-i18next';
import { X, Heart, ShieldCheck, HandHeart, Info } from '@phosphor-icons/react';

interface AboutModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
    const { t } = useTranslation();

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose} style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)', backdropFilter: 'blur(4px)',
            zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: 'var(--space-md)'
        }}>
            <div className="modal-content animate-scale-in" onClick={e => e.stopPropagation()} style={{
                backgroundColor: 'var(--bg)', borderRadius: 'var(--radius-xl)',
                width: '100%', maxWidth: '500px', maxHeight: '90vh', overflowY: 'auto',
                position: 'relative', boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border)'
            }}>
                <button onClick={onClose} style={{
                    position: 'absolute', top: 'var(--space-md)', left: 'var(--space-md)',
                    background: 'var(--bg-tertiary)', border: 'none', borderRadius: '50%',
                    width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', zIndex: 10
                }}>
                    <X size={20} />
                </button>

                <div style={{ padding: 'var(--space-xl) var(--space-lg)' }}>
                    <div className="text-center mb-lg">
                        <div style={{
                            width: '80px', height: '80px', margin: '0 auto var(--space-md)',
                            background: 'var(--accent-gold-soft)', borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Info size={40} color="var(--accent-gold)" weight="duotone" />
                        </div>
                        <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)', color: 'var(--accent-gold)' }}>
                            منصة رَوْقٌ
                        </h2>
                        <p className="text-muted" style={{ fontSize: '0.9rem', marginTop: 'var(--space-xs)' }}>
                            القرآن الكريم بين يديك
                        </p>
                    </div>

                    <div className="flex flex-col gap-md">
                        <div className="card-gold text-center" style={{ padding: 'var(--space-md)', borderRadius: 'var(--radius-lg)' }}>
                            <p style={{ fontSize: '1rem', lineHeight: 1.8, marginBottom: 'var(--space-sm)' }}>
                                هذا العمل هو صدقة جارية، ووقف على روح جدنا <strong>الشيخ عبد الخالق بوركيبات</strong> رحمة الله تعالى عليه، وعلى كافة أسرة آل بوركيبات.
                            </p>
                            <p style={{ fontSize: '0.9rem', lineHeight: 1.7, color: 'var(--text-secondary)' }}>
                                بدأت فكرة هذه المنصة كحلم صغير لرد الجميل لمن زرعوا فينا حب القرآن، ولتكون رحمة ونوراً في صحيفة أجدادنا. بفضل الله، تحولت الفكرة إلى هذا الصرح الرقمي ليكون رفيقاً ودليلاً لكل مسلم يبحث عن السكينة في كلام الله، في أي زمان ومكان. نسأل الله أن يتقبل هذا العمل ويجعله شفيعاً لنا ولكم يوم القيامة.
                            </p>
                            <div className="flex items-center justify-center gap-sm mt-md text-gold">
                                <HandHeart size={24} />
                            </div>
                        </div>

                        <div style={{ padding: 'var(--space-md)', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)' }}>
                            <h3 className="flex items-center gap-sm mb-sm text-gold" style={{ fontSize: '1.1rem' }}>
                                <ShieldCheck size={20} />
                                بطاقة شكر وعن الإصدار
                            </h3>
                            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
                                تم تطوير وبرمجة هذا التطبيق بعناية فائقة، محفوفاً بالدعاء والمحبة، ليجمع بين جمال التصميم وعظمة المحتوى.
                                <br /><br />
                                <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                                    تم التأسيس والتطوير بواسطة: <br />المهندس عبد الصمد بوركيبات (حفيد الشيخ).
                                </span>
                            </p>
                        </div>

                        <div className="text-center mt-md">
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                نسأل الله أن يجعله عملاً خالصاً لوجهه الكريم.
                            </p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                © 2026 جميع الحقوق محفوظة
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
