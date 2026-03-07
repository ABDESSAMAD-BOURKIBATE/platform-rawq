import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type TaskCategory = 'worship' | 'quran' | 'learning' | 'personal' | 'other';
export type TaskPriority = 'high' | 'medium' | 'low';

export interface ScheduleTask {
    id: string;
    title: string;
    time: string;
    description?: string;
    attachmentBase64?: string;
    isCompleted: boolean;
    category: TaskCategory;
    priority: TaskPriority;
    createdAt: number;
    completedAt?: number;
}

interface ScheduleState {
    tasks: ScheduleTask[];
    addTask: (title: string, time: string, category: TaskCategory, priority: TaskPriority, description?: string, attachmentBase64?: string) => void;
    editTask: (id: string, title: string, time: string, category: TaskCategory, priority: TaskPriority, description?: string, attachmentBase64?: string) => void;
    deleteTask: (id: string) => void;
    toggleTaskCompletion: (id: string) => void;
    clearCompleted: () => void;
    reorderTask: (id: string, direction: 'up' | 'down') => void;
}

export const CATEGORY_META: Record<TaskCategory, { label: string; emoji: string; color: string }> = {
    worship: { label: 'عبادة', emoji: '🕌', color: '#D4AF37' },
    quran: { label: 'قرآن', emoji: '📖', color: '#38A169' },
    learning: { label: 'تعلّم', emoji: '📚', color: '#3B82F6' },
    personal: { label: 'شخصي', emoji: '🏠', color: '#A855F7' },
    other: { label: 'أخرى', emoji: '📌', color: '#6B7280' },
};

export const PRIORITY_META: Record<TaskPriority, { label: string; color: string }> = {
    high: { label: 'مهم', color: '#EF4444' },
    medium: { label: 'متوسط', color: '#F59E0B' },
    low: { label: 'عادي', color: '#6B7280' },
};

export const useScheduleStore = create<ScheduleState>()(
    persist(
        (set) => ({
            tasks: [],
            addTask: (title, time, category, priority, description, attachmentBase64) => set((state) => ({
                tasks: [...state.tasks, {
                    id: Date.now().toString(),
                    title,
                    time,
                    description,
                    attachmentBase64,
                    isCompleted: false,
                    category,
                    priority,
                    createdAt: Date.now(),
                }]
            })),
            editTask: (id, title, time, category, priority, description, attachmentBase64) => set((state) => ({
                tasks: state.tasks.map(task =>
                    task.id === id ? { ...task, title, time, category, priority, description, attachmentBase64 } : task
                )
            })),
            deleteTask: (id) => set((state) => ({
                tasks: state.tasks.filter(task => task.id !== id)
            })),
            toggleTaskCompletion: (id) => set((state) => ({
                tasks: state.tasks.map(task =>
                    task.id === id
                        ? { ...task, isCompleted: !task.isCompleted, completedAt: !task.isCompleted ? Date.now() : undefined }
                        : task
                )
            })),
            clearCompleted: () => set((state) => ({
                tasks: state.tasks.filter(task => !task.isCompleted)
            })),
            reorderTask: (id, direction) => set((state) => {
                const idx = state.tasks.findIndex(t => t.id === id);
                if (idx < 0) return state;
                const newIdx = direction === 'up' ? idx - 1 : idx + 1;
                if (newIdx < 0 || newIdx >= state.tasks.length) return state;
                const newTasks = [...state.tasks];
                [newTasks[idx], newTasks[newIdx]] = [newTasks[newIdx], newTasks[idx]];
                return { tasks: newTasks };
            }),
        }),
        {
            name: 'rawq-schedule-storage',
        }
    )
);
