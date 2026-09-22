import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarClock, Check, X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useTaskStore } from '../store/useTaskStore';
import { toInputDate } from '../utils/date';
const taskSchema = z.object({
    title: z.string().trim().min(1, 'A task title is required').max(100, 'Keep the title under 100 characters'),
    description: z.string().max(500, 'Keep the description under 500 characters'),
    dueDate: z.string(),
    priority: z.enum(['low', 'medium', 'high']),
    category: z.string().trim().max(30, 'Keep the category short'),
    status: z.enum(['todo', 'progress', 'done']),
    subtasks: z.string(),
});
export default function TaskForm({ task, onClose }) {
    const addTask = useTaskStore((state) => state.addTask);
    const updateTask = useTaskStore((state) => state.updateTask);
    const categories = useTaskStore((state) => state.categories);
    const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            title: task?.title ?? '',
            description: task?.description ?? '',
            dueDate: task ? toInputDate(task.dueDate) : '',
            priority: task?.priority ?? 'medium',
            category: task?.category ?? 'Personal',
            status: task?.status ?? 'todo',
            subtasks: task?.subtasks.map((subtask) => subtask.title).join('\n') ?? '',
        },
    });
    useEffect(() => {
        reset({
            title: task?.title ?? '',
            description: task?.description ?? '',
            dueDate: task ? toInputDate(task.dueDate) : '',
            priority: task?.priority ?? 'medium',
            category: task?.category ?? 'Personal',
            status: task?.status ?? 'todo',
            subtasks: task?.subtasks.map((subtask) => subtask.title).join('\n') ?? '',
        });
    }, [reset, task]);
    function onSubmit(values) {
        const subtasks = values.subtasks.split('\n').map((title) => title.trim()).filter(Boolean).map((title, index) => ({
            id: task?.subtasks[index]?.id ?? crypto.randomUUID(),
            title,
            completed: task?.subtasks[index]?.completed ?? false,
        }));
        const payload = {
            title: values.title,
            description: values.description,
            dueDate: values.dueDate ? new Date(values.dueDate).toISOString() : '',
            priority: values.priority,
            category: values.category || 'Personal',
            status: values.status,
            subtasks,
        };
        if (task)
            updateTask(task.id, payload);
        else
            addTask(payload);
        onClose();
    }
    return (_jsx("div", { className: "drawer-backdrop", onMouseDown: (event) => event.target === event.currentTarget && onClose(), children: _jsxs("section", { className: "drawer", "aria-labelledby": "task-editor-title", children: [_jsxs("div", { className: "drawer-header", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Task details" }), _jsx("h2", { id: "task-editor-title", children: task ? 'Edit task' : 'Plan something new' })] }), _jsx("button", { className: "icon-button", onClick: onClose, "aria-label": "Close editor", children: _jsx(X, { size: 20 }) })] }), _jsxs("form", { className: "task-editor", onSubmit: handleSubmit(onSubmit), children: [_jsxs("label", { children: ["Title", _jsx("input", { ...register('title'), placeholder: "e.g. Finish research notes", autoFocus: true }), errors.title && _jsx("small", { className: "field-error", children: errors.title.message })] }), _jsxs("label", { children: ["Description", _jsx("textarea", { ...register('description'), placeholder: "Add context or a next step...", rows: 4 }), errors.description && _jsx("small", { className: "field-error", children: errors.description.message })] }), _jsxs("div", { className: "form-grid", children: [_jsxs("label", { children: ["Due date and time", _jsxs("div", { className: "input-with-icon", children: [_jsx(CalendarClock, { size: 17 }), _jsx("input", { type: "datetime-local", ...register('dueDate') })] })] }), _jsxs("label", { children: ["Priority", _jsxs("select", { ...register('priority'), children: [_jsx("option", { value: "low", children: "Low" }), _jsx("option", { value: "medium", children: "Medium" }), _jsx("option", { value: "high", children: "High" })] })] })] }), _jsxs("div", { className: "form-grid", children: [_jsxs("label", { children: ["Category", _jsx("input", { list: "category-options", ...register('category'), placeholder: "Study" }), _jsx("datalist", { id: "category-options", children: categories.map((category) => _jsx("option", { value: category }, category)) })] }), _jsxs("label", { children: ["Status", _jsxs("select", { ...register('status'), children: [_jsx("option", { value: "todo", children: "To Do" }), _jsx("option", { value: "progress", children: "In Progress" }), _jsx("option", { value: "done", children: "Done" })] })] })] }), _jsxs("label", { children: ["Checklist ", _jsx("span", { className: "label-hint", children: "one item per line" }), _jsx("textarea", { ...register('subtasks'), placeholder: "Read chapter 4\\nWrite summary", rows: 3 })] }), _jsxs("div", { className: "drawer-actions", children: [_jsx("button", { type: "button", className: "button secondary", onClick: onClose, children: "Cancel" }), _jsxs("button", { className: "button primary", type: "submit", disabled: isSubmitting, children: [_jsx(Check, { size: 17 }), task ? 'Save changes' : 'Create task'] })] })] })] }) }));
}
