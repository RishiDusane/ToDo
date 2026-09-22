import { create } from 'zustand';
import { categoryApi, taskApi } from '../api/client';
const defaultFilters = { search: '', priority: 'all', status: 'all', category: 'all', overdue: false, sort: 'dueDate' };
function errorMessage(error) { return error instanceof Error ? error.message : 'Unable to reach the TaskFlow API'; }
export const useTaskStore = create((set) => ({
    tasks: [], categories: [], filters: defaultFilters, view: 'list', theme: 'light', loading: false, error: null, editingTaskId: null,
    fetchTasks: async () => {
        try {
            set({ loading: true, error: null });
            const [taskResult, categoryResult] = await Promise.all([taskApi.list(), categoryApi.list()]);
            set({ tasks: taskResult.tasks, categories: categoryResult.categories.map((category) => category.name), loading: false });
        }
        catch (error) {
            set({ loading: false, error: errorMessage(error) });
        }
    },
    addTask: async (task) => {
        try {
            set({ error: null });
            const result = await taskApi.create(task);
            set((state) => ({ tasks: [result.task, ...state.tasks], categories: task.category && !state.categories.includes(task.category) ? [...state.categories, task.category] : state.categories }));
        }
        catch (error) {
            set({ error: errorMessage(error) });
            throw error;
        }
    },
    updateTask: async (id, updates) => {
        try {
            set({ error: null });
            const result = await taskApi.update(id, updates);
            set((state) => ({ tasks: state.tasks.map((task) => task.id === id ? result.task : task) }));
        }
        catch (error) {
            set({ error: errorMessage(error) });
            throw error;
        }
    },
    deleteTask: async (id) => {
        try {
            await taskApi.remove(id);
            set((state) => ({ tasks: state.tasks.filter((task) => task.id !== id) }));
        }
        catch (error) {
            set({ error: errorMessage(error) });
            throw error;
        }
    },
    setStatus: async (id, status) => {
        try {
            const result = await taskApi.status(id, status);
            set((state) => ({ tasks: state.tasks.map((task) => task.id === id ? result.task : task) }));
        }
        catch (error) {
            set({ error: errorMessage(error) });
            throw error;
        }
    },
    setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
    setView: (view) => set({ view }),
    setTheme: (theme) => { localStorage.setItem('taskflow-theme', theme); set({ theme }); },
    setEditingTaskId: (editingTaskId) => set({ editingTaskId }),
    importTasks: async (tasks) => {
        try {
            const createdTasks = [];
            for (const task of tasks) {
                const result = await taskApi.create(task);
                createdTasks.push(result.task);
            }
            set({ tasks: createdTasks, error: null });
        }
        catch (error) {
            set({ error: errorMessage(error) });
            throw error;
        }
    },
}));
