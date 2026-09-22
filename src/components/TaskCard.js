import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AnimatePresence, motion } from 'framer-motion';
import { CalendarDays, Check, Circle, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTaskStore } from '../store/useTaskStore';
import { formatDueDate, isOverdue } from '../utils/date';
const priorityLabels = { low: 'Low', medium: 'Medium', high: 'High' };
const statusLabels = { todo: 'To Do', progress: 'In Progress', done: 'Done' };
export default function TaskCard({ task, compact = false }) {
    const [expanded, setExpanded] = useState(false);
    const updateTask = useTaskStore((state) => state.updateTask);
    const deleteTask = useTaskStore((state) => state.deleteTask);
    const setEditingTaskId = useTaskStore((state) => state.setEditingTaskId);
    const overdue = isOverdue(task);
    const completedSubtasks = task.subtasks.filter((subtask) => subtask.completed).length;
    function toggleComplete() {
        const nextStatus = task.status === 'done' ? 'todo' : 'done';
        updateTask(task.id, { status: nextStatus, completedAt: nextStatus === 'done' ? new Date().toISOString() : undefined });
    }
    function toggleSubtask(subtaskId) {
        updateTask(task.id, { subtasks: task.subtasks.map((subtask) => subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask) });
    }
    return (_jsxs(motion.article, { layout: true, initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, className: `task-card ${task.status === 'done' ? 'is-done' : ''} ${overdue ? 'is-overdue' : ''}`, children: [_jsxs("div", { className: "task-card-main", children: [_jsx("button", { className: `complete-button ${task.status === 'done' ? 'checked' : ''}`, onClick: toggleComplete, "aria-label": task.status === 'done' ? 'Mark as not done' : 'Mark as complete', children: task.status === 'done' ? _jsx(Check, { size: 16 }) : _jsx(Circle, { size: 18 }) }), _jsxs("div", { className: "task-card-copy", children: [_jsxs("div", { className: "task-title-row", children: [_jsx("h3", { children: task.title }), _jsx("span", { className: `priority-dot ${task.priority}`, title: `${priorityLabels[task.priority]} priority` })] }), !compact && task.description && _jsx("p", { children: task.description }), _jsxs("div", { className: "task-meta", children: [_jsxs("span", { className: overdue ? 'overdue-text' : '', children: [_jsx(CalendarDays, { size: 14 }), formatDueDate(task.dueDate)] }), _jsx("span", { className: "category-chip", children: task.category }), task.subtasks.length > 0 && _jsxs("span", { children: [completedSubtasks, "/", task.subtasks.length, " checked"] })] })] }), _jsxs("div", { className: "task-card-actions", children: [_jsx("button", { className: "icon-button", onClick: () => setEditingTaskId(task.id), "aria-label": "Edit task", children: _jsx(Pencil, { size: 16 }) }), _jsx("button", { className: "icon-button danger-button", onClick: () => deleteTask(task.id), "aria-label": "Delete task", children: _jsx(Trash2, { size: 16 }) }), _jsx("button", { className: "icon-button", onClick: () => setExpanded(!expanded), "aria-label": "Show task options", children: _jsx(MoreHorizontal, { size: 17 }) })] })] }), _jsx(AnimatePresence, { children: expanded && task.subtasks.length > 0 && _jsx(motion.div, { initial: { height: 0, opacity: 0 }, animate: { height: 'auto', opacity: 1 }, exit: { height: 0, opacity: 0 }, className: "subtask-list", children: task.subtasks.map((subtask) => _jsxs("label", { children: [_jsx("input", { type: "checkbox", checked: subtask.completed, onChange: () => toggleSubtask(subtask.id) }), _jsx("span", { className: subtask.completed ? 'subtask-done' : '', children: subtask.title })] }, subtask.id)) }) }), _jsxs("div", { className: "task-status-row", children: [_jsx("span", { className: `status-label ${task.status}`, children: statusLabels[task.status] }), task.status !== 'done' && _jsxs("select", { value: task.status, onChange: (event) => updateTask(task.id, { status: event.target.value }), "aria-label": "Change task status", children: [_jsx("option", { value: "todo", children: "To Do" }), _jsx("option", { value: "progress", children: "In Progress" }), _jsx("option", { value: "done", children: "Done" })] })] })] }));
}
