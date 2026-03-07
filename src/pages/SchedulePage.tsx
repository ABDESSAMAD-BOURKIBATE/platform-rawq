import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Plus, PencilSimple, CheckCircle,
    Clock, CaretUp, CaretDown,
    CalendarCheck, ChartBar, Mosque, BookOpen,
    GraduationCap, House, PushPin,
    Warning, Minus, Equals, FloppyDisk, XCircle, Trash, Broom,
    Image, TextAa
} from '@phosphor-icons/react';
import {
    useScheduleStore,
    CATEGORY_META,
    PRIORITY_META,
    type TaskCategory,
    type TaskPriority,
} from '../store/useScheduleStore';

const ALL_CATEGORIES: TaskCategory[] = ['worship', 'quran', 'learning', 'personal', 'other'];
const ALL_PRIORITIES: TaskPriority[] = ['high', 'medium', 'low'];

// Professional icon map for categories
const CATEGORY_ICONS: Record<TaskCategory, typeof Mosque> = {
    worship: Mosque,
    quran: BookOpen,
    learning: GraduationCap,
    personal: House,
    other: PushPin,
};

// Professional icon map for priorities
const PRIORITY_ICONS: Record<TaskPriority, typeof Warning> = {
    high: Warning,
    medium: Minus,
    low: Equals,
};

export function SchedulePage() {
    const { t } = useTranslation();
    const { tasks, addTask, editTask, toggleTaskCompletion, reorderTask, deleteTask, clearCompleted } = useScheduleStore();

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [filterCategory, setFilterCategory] = useState<TaskCategory | 'all'>('all');

    // New task form
    const [newTitle, setNewTitle] = useState('');
    const [newTime, setNewTime] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newAttachment, setNewAttachment] = useState<string | undefined>(undefined);
    const [newCategory, setNewCategory] = useState<TaskCategory>('worship');
    const [newPriority, setNewPriority] = useState<TaskPriority>('medium');

    // Edit task form
    const [editTitle, setEditTitle] = useState('');
    const [editTime, setEditTime] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [editAttachment, setEditAttachment] = useState<string | undefined>(undefined);
    const [editCategory, setEditCategory] = useState<TaskCategory>('worship');
    const [editPriority, setEditPriority] = useState<TaskPriority>('medium');

    const handleAdd = () => {
        if (!newTitle.trim()) return;
        addTask(newTitle.trim(), newTime.trim(), newCategory, newPriority, newDescription.trim(), newAttachment);
        setNewTitle(''); setNewTime(''); setNewCategory('worship'); setNewPriority('medium');
        setNewDescription(''); setNewAttachment(undefined);
        setIsAdding(false);
    };

    const handleSaveEdit = () => {
        if (!editingId || !editTitle.trim()) return;
        editTask(editingId, editTitle.trim(), editTime.trim(), editCategory, editPriority, editDescription.trim(), editAttachment);
        setEditingId(null);
    };

    const startEdit = (task: typeof tasks[0]) => {
        setEditingId(task.id);
        setEditTitle(task.title);
        setEditTime(task.time);
        setEditDescription(task.description || '');
        setEditAttachment(task.attachmentBase64);
        setEditCategory(task.category || 'other');
        setEditPriority(task.priority || 'medium');
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setAttachmentFunc: (val: string) => void) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = () => {
            setAttachmentFunc(reader.result as string);
        };
        reader.readAsDataURL(file);
    };

    // Filtered tasks
    const filteredTasks = useMemo(() => {
        if (filterCategory === 'all') return tasks;
        return tasks.filter(t => (t.category || 'other') === filterCategory);
    }, [tasks, filterCategory]);

    // Statistics
    const completedCount = tasks.filter(t => t.isCompleted).length;
    const totalCount = tasks.length;
    const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

    // Category breakdown
    const categoryStats = useMemo(() => {
        const stats: Record<TaskCategory, { total: number; done: number }> = {
            worship: { total: 0, done: 0 },
            quran: { total: 0, done: 0 },
            learning: { total: 0, done: 0 },
            personal: { total: 0, done: 0 },
            other: { total: 0, done: 0 },
        };
        tasks.forEach(t => {
            const cat = t.category || 'other';
            stats[cat].total++;
            if (t.isCompleted) stats[cat].done++;
        });
        return stats;
    }, [tasks]);

    return (
        <div className="schedule-page">

            {/* ─────── Hero Header ─────── */}
            <header className="schedule-header">
                <div className="schedule-header__top">
                    <div className="schedule-header__icon-ring">
                        <CalendarCheck size={26} weight="duotone" />
                    </div>
                    <div className="schedule-header__text">
                        <h1 className="schedule-header__title">{t('schedule.title')}</h1>
                        <p className="schedule-header__sub">{t('schedule.description')}</p>
                    </div>
                </div>

                {/* ─── Stats Row ─── */}
                {totalCount > 0 && (
                    <div className="schedule-stats-row">
                        <div className="schedule-stat-chip">
                            <CheckCircle size={15} weight="fill" />
                            <span>{completedCount}/{totalCount}</span>
                        </div>
                        <div className="schedule-stat-chip">
                            <ChartBar size={15} weight="fill" />
                            <span>{progressPercent}%</span>
                        </div>
                    </div>
                )}

                {/* ─── Progress Bar ─── */}
                {totalCount > 0 && (
                    <div className="schedule-progress">
                        <div className="schedule-progress__bar">
                            <div
                                className="schedule-progress__fill"
                                style={{ width: `${progressPercent}%` }}
                            >
                                <span className="schedule-progress__shine" />
                            </div>
                        </div>
                        {progressPercent === 100 && (
                            <p className="schedule-progress__celebrate">🎉 ما شاء الله! أتممت جميع مهامك</p>
                        )}
                    </div>
                )}
            </header>

            {/* ─────── Category Filter Chips ─────── */}
            {totalCount > 0 && (
                <div className="schedule-filters">
                    <button
                        className={`schedule-filter-chip ${filterCategory === 'all' ? 'active' : ''}`}
                        onClick={() => setFilterCategory('all')}
                    >
                        الكل ({totalCount})
                    </button>
                    {ALL_CATEGORIES.map(cat => {
                        const meta = CATEGORY_META[cat];
                        const CatIcon = CATEGORY_ICONS[cat];
                        const count = categoryStats[cat].total;
                        if (count === 0) return null;
                        return (
                            <button
                                key={cat}
                                className={`schedule-filter-chip ${filterCategory === cat ? 'active' : ''}`}
                                onClick={() => setFilterCategory(cat)}
                                style={{ '--chip-color': meta.color } as React.CSSProperties}
                            >
                                <CatIcon size={14} weight="duotone" /> {meta.label} ({count})
                            </button>
                        );
                    })}
                </div>
            )}

            {/* ─────── Add Button ─────── */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <button className="schedule-add-btn" style={{ flex: 1 }} onClick={() => setIsAdding(true)}>
                    <span className="schedule-add-btn__shine" />
                    <Plus weight="bold" size={18} />
                    <span>{t('schedule.addTask')}</span>
                </button>
                {completedCount > 0 && (
                    <button
                        className="schedule-add-btn"
                        style={{
                            flex: 'none', padding: '0 16px', background: 'var(--bg-secondary)',
                            border: '1px solid var(--border)', color: 'var(--text-secondary)'
                        }}
                        onClick={clearCompleted}
                    >
                        <Broom size={18} weight="duotone" />
                        <span style={{ marginLeft: '6px', marginRight: '6px' }}>مسح المكتمل (Clear)</span>
                    </button>
                )}
            </div>

            {/* ─────── Add Task Form ─────── */}
            {isAdding && (
                <div className="schedule-form animate-scale-in">
                    <div className="schedule-form__glow" />
                    <div className="schedule-form__inner">
                        <input
                            autoFocus
                            type="text"
                            placeholder={t('schedule.taskTitle')}
                            className="schedule-input"
                            value={newTitle}
                            onChange={e => setNewTitle(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAdd()}
                        />
                        <input
                            type="time"
                            className="schedule-input"
                            value={newTime}
                            onChange={e => setNewTime(e.target.value)}
                        />
                        <textarea
                            placeholder="وصف المهمة (اختياري)"
                            className="schedule-input"
                            rows={3}
                            value={newDescription}
                            onChange={e => setNewDescription(e.target.value)}
                            style={{ resize: 'none' }}
                        />
                        <div className="schedule-form__row">
                            <label className="schedule-form__label">مرفق (صورة)</label>
                            <input
                                type="file"
                                accept="image/*"
                                className="schedule-input"
                                onChange={e => handleFileUpload(e, setNewAttachment)}
                                style={{ padding: '8px' }}
                            />
                            {newAttachment && (
                                <img src={newAttachment} alt="Preview" style={{ height: '50px', borderRadius: '4px', marginTop: '8px', objectFit: 'cover' }} />
                            )}
                        </div>

                        {/* Category Selector */}
                        <div className="schedule-form__row">
                            <label className="schedule-form__label">التصنيف</label>
                            <div className="schedule-form__chips">
                                {ALL_CATEGORIES.map(cat => {
                                    const CatIcon = CATEGORY_ICONS[cat];
                                    return (
                                        <button
                                            key={cat}
                                            type="button"
                                            className={`schedule-cat-chip ${newCategory === cat ? 'selected' : ''}`}
                                            onClick={() => setNewCategory(cat)}
                                            style={{ '--chip-color': CATEGORY_META[cat].color } as React.CSSProperties}
                                        >
                                            <CatIcon size={14} weight="duotone" /> {CATEGORY_META[cat].label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Priority Selector */}
                        <div className="schedule-form__row">
                            <label className="schedule-form__label">الأولوية</label>
                            <div className="schedule-form__chips">
                                {ALL_PRIORITIES.map(p => {
                                    const PriIcon = PRIORITY_ICONS[p];
                                    return (
                                        <button
                                            key={p}
                                            type="button"
                                            className={`schedule-cat-chip ${newPriority === p ? 'selected' : ''}`}
                                            onClick={() => setNewPriority(p)}
                                            style={{ '--chip-color': PRIORITY_META[p].color } as React.CSSProperties}
                                        >
                                            <PriIcon size={14} weight="bold" /> {PRIORITY_META[p].label}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="schedule-form__actions">
                            <button className="schedule-form__cancel" onClick={() => setIsAdding(false)}>
                                <XCircle size={16} weight="duotone" /> {t('schedule.cancel')}
                            </button>
                            <button
                                className="schedule-form__save"
                                disabled={!newTitle.trim()}
                                onClick={handleAdd}
                            >
                                <FloppyDisk size={16} weight="duotone" /> {t('schedule.save')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* ─────── Category Breakdown ─────── */}
            {totalCount > 0 && (
                <div className="schedule-breakdown">
                    <h3 className="schedule-breakdown__title">
                        <ChartBar size={16} weight="duotone" /> توزيع المهام
                    </h3>
                    <div className="schedule-breakdown__bars">
                        {ALL_CATEGORIES.map(cat => {
                            const s = categoryStats[cat];
                            if (s.total === 0) return null;
                            const pct = Math.round((s.done / s.total) * 100);
                            const CatIcon = CATEGORY_ICONS[cat];
                            return (
                                <div key={cat} className="schedule-breakdown__item">
                                    <div className="schedule-breakdown__label">
                                        <span><CatIcon size={13} weight="duotone" /> {CATEGORY_META[cat].label}</span>
                                        <span className="schedule-breakdown__pct">{s.done}/{s.total}</span>
                                    </div>
                                    <div className="schedule-breakdown__track">
                                        <div
                                            className="schedule-breakdown__fill"
                                            style={{
                                                width: `${pct}%`,
                                                backgroundColor: CATEGORY_META[cat].color,
                                            }}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* ─────── Task List ─────── */}
            <div className="schedule-list">
                {filteredTasks.length === 0 ? (
                    <div className="schedule-empty animate-fade-in">
                        <div className="schedule-empty__icon">
                            <CalendarCheck size={36} weight="duotone" />
                        </div>
                        <p>{t('schedule.empty')}</p>
                    </div>
                ) : (
                    filteredTasks.map((task, index) => {
                        const catMeta = CATEGORY_META[task.category || 'other'];
                        const priMeta = PRIORITY_META[task.priority || 'medium'];
                        const CatIcon = CATEGORY_ICONS[task.category || 'other'];
                        return (
                            <div
                                key={task.id}
                                className={`schedule-task animate-slide-up ${task.isCompleted ? 'completed' : ''}`}
                                style={{
                                    animationDelay: `${index * 0.05}s`,
                                    '--task-accent': catMeta.color,
                                } as React.CSSProperties}
                            >
                                {/* Left accent bar */}
                                <div className="schedule-task__accent" />

                                {/* Checkbox */}
                                <button
                                    className="schedule-task__check"
                                    onClick={() => toggleTaskCompletion(task.id)}
                                >
                                    {task.isCompleted ? (
                                        <CheckCircle size={28} weight="fill" className="schedule-task__check-done" />
                                    ) : (
                                        <div className="schedule-task__check-ring" />
                                    )}
                                </button>

                                {/* Content */}
                                {editingId === task.id ? (
                                    <div className="schedule-task__edit-form animate-scale-in">
                                        <input autoFocus type="text" className="schedule-input sm" value={editTitle}
                                            onChange={e => setEditTitle(e.target.value)}
                                            onKeyDown={e => e.key === 'Enter' && handleSaveEdit()} />
                                        <input type="time" className="schedule-input sm" value={editTime}
                                            onChange={e => setEditTime(e.target.value)} />
                                        <textarea
                                            placeholder="وصف المهمة (اختياري)"
                                            className="schedule-input sm"
                                            rows={2}
                                            value={editDescription}
                                            onChange={e => setEditDescription(e.target.value)}
                                            style={{ resize: 'vertical' }}
                                        />
                                        <div className="schedule-form__row">
                                            <label className="schedule-form__label" style={{ fontSize: '0.75rem' }}>تغيير المرفق</label>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="schedule-input sm"
                                                onChange={e => handleFileUpload(e, setEditAttachment)}
                                                style={{ padding: '4px' }}
                                            />
                                            {editAttachment && (
                                                <img src={editAttachment} alt="Preview" style={{ height: '40px', borderRadius: '4px', marginTop: '4px', objectFit: 'cover' }} />
                                            )}
                                        </div>
                                        <div className="schedule-form__chips compact">
                                            {ALL_CATEGORIES.map(cat => {
                                                const CI = CATEGORY_ICONS[cat];
                                                return (
                                                    <button key={cat} type="button"
                                                        className={`schedule-cat-chip sm ${editCategory === cat ? 'selected' : ''}`}
                                                        onClick={() => setEditCategory(cat)}
                                                        style={{ '--chip-color': CATEGORY_META[cat].color } as React.CSSProperties}>
                                                        <CI size={12} weight="duotone" />
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <div className="schedule-form__chips compact">
                                            {ALL_PRIORITIES.map(p => {
                                                const PI = PRIORITY_ICONS[p];
                                                return (
                                                    <button key={p} type="button"
                                                        className={`schedule-cat-chip sm ${editPriority === p ? 'selected' : ''}`}
                                                        onClick={() => setEditPriority(p)}
                                                        style={{ '--chip-color': PRIORITY_META[p].color } as React.CSSProperties}>
                                                        <PI size={12} weight="bold" /> {PRIORITY_META[p].label}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        <div className="schedule-form__actions compact">
                                            <button className="schedule-form__cancel sm" onClick={() => setEditingId(null)}>
                                                {t('schedule.cancel')}
                                            </button>
                                            <button className="schedule-form__save sm" onClick={handleSaveEdit}>
                                                <FloppyDisk size={14} weight="duotone" /> {t('schedule.save')}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="schedule-task__body" onClick={() => toggleTaskCompletion(task.id)}>
                                        <div className="schedule-task__top-row">
                                            <h3 className="schedule-task__title">
                                                <span className={task.isCompleted ? 'line-through' : ''}>{task.title}</span>
                                            </h3>
                                            <span className="schedule-task__pri-dot" style={{ backgroundColor: priMeta.color }} title={priMeta.label} />
                                        </div>
                                        <div className="schedule-task__meta">
                                            <span className="schedule-task__cat-badge" style={{ color: catMeta.color }}>
                                                <CatIcon size={12} weight="duotone" /> {catMeta.label}
                                            </span>
                                            {task.time && (
                                                <span className="schedule-task__time">
                                                    <Clock size={12} weight="bold" /> {task.time}
                                                </span>
                                            )}
                                        </div>
                                        {task.description && (
                                            <p className="schedule-task__desc" style={{ marginTop: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                                <TextAa size={12} weight="duotone" style={{ display: 'inline', marginRight: '4px' }} />
                                                {task.description}
                                            </p>
                                        )}
                                        {task.attachmentBase64 && (
                                            <div style={{ marginTop: '12px' }}>
                                                <a href={task.attachmentBase64} target="_blank" rel="noopener noreferrer">
                                                    <img
                                                        src={task.attachmentBase64}
                                                        alt="مرفق"
                                                        style={{
                                                            maxWidth: '100%',
                                                            maxHeight: '120px',
                                                            borderRadius: '8px',
                                                            objectFit: 'cover',
                                                            border: '1px solid var(--border)'
                                                        }}
                                                    />
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Actions — Edit & Reorder only, NO delete */}
                                {editingId !== task.id && !task.isCompleted && (
                                    <div className="schedule-task__actions">
                                        <button onClick={() => reorderTask(task.id, 'up')} title="تقديم">
                                            <CaretUp size={16} weight="bold" />
                                        </button>
                                        <button onClick={() => reorderTask(task.id, 'down')} title="تأخير">
                                            <CaretDown size={16} weight="bold" />
                                        </button>
                                        <button onClick={() => startEdit(task)} title={t('schedule.edit')}>
                                            <PencilSimple size={16} weight="duotone" />
                                        </button>
                                        <button onClick={() => deleteTask(task.id)} title="مسح (Delete)" style={{ color: '#EF4444' }}>
                                            <Trash size={16} weight="duotone" />
                                        </button>
                                    </div>
                                )}
                                {editingId !== task.id && task.isCompleted && (
                                    <div className="schedule-task__actions">
                                        <button onClick={() => deleteTask(task.id)} title="مسح (Delete)" style={{ color: '#EF4444' }}>
                                            <Trash size={16} weight="duotone" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}
