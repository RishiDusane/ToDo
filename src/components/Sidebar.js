import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { BarChart3, CalendarDays, Download, FolderKanban, LayoutList, LogOut, Moon, Plus, Sun, Upload } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';
export default function Sidebar({ tasks, onNewTask, onImport, onExport, onLogout }) {
    const view = useTaskStore((state) => state.view);
    const setView = useTaskStore((state) => state.setView);
    const theme = useTaskStore((state) => state.theme);
    const setTheme = useTaskStore((state) => state.setTheme);
    const completed = tasks.filter((task) => task.status === 'done').length;
    const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;
    const views = [
        { id: 'list', label: 'My tasks', icon: LayoutList },
        { id: 'board', label: 'Kanban board', icon: FolderKanban },
        { id: 'calendar', label: 'Calendar', icon: CalendarDays },
    ];
    return _jsxs("aside", { className: "sidebar", children: [_jsxs("div", { className: "brand-mark", children: [_jsx("span", { children: "TF" }), _jsxs("div", { children: [_jsx("strong", { children: "TaskFlow" }), _jsx("small", { children: "Personal planner" })] })] }), _jsxs("button", { className: "button primary new-task-button", onClick: onNewTask, children: [_jsx(Plus, { size: 18 }), "New task"] }), _jsx("nav", { className: "sidebar-nav", "aria-label": "Views", children: views.map(({ id, label, icon: Icon }) => _jsxs("button", { className: view === id ? 'active' : '', onClick: () => setView(id), children: [_jsx(Icon, { size: 18 }), label] }, id)) }), _jsxs("div", { className: "sidebar-progress", children: [_jsxs("div", { className: "progress-heading", children: [_jsxs("span", { children: [_jsx(BarChart3, { size: 16 }), "Progress"] }), _jsxs("strong", { children: [progress, "%"] })] }), _jsx("div", { className: "progress-track", children: _jsx("span", { style: { width: `${progress}%` } }) }), _jsxs("small", { children: [completed, " of ", tasks.length, " tasks completed"] })] }), _jsxs("div", { className: "sidebar-footer", children: [_jsxs("button", { className: "sidebar-action", onClick: onExport, children: [_jsx(Download, { size: 16 }), "Export data"] }), _jsxs("label", { className: "sidebar-action", children: [_jsx(Upload, { size: 16 }), "Import data", _jsx("input", { type: "file", accept: "application/json", onChange: onImport, hidden: true })] }), _jsx("button", { className: "theme-toggle", onClick: () => setTheme(theme === 'light' ? 'dark' : 'light'), "aria-label": "Toggle theme", children: theme === 'light' ? _jsx(Moon, { size: 17 }) : _jsx(Sun, { size: 17 }) }), _jsxs("button", { className: "sidebar-action", onClick: onLogout, children: [_jsx(LogOut, { size: 16 }), "Log out"] })] })] });
}
