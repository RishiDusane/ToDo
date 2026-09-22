import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { ListFilter, Plus, Search, SlidersHorizontal } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useTaskStore } from './store/useTaskStore';
import CalendarView from './components/CalendarView';
import KanbanBoard from './components/KanbanBoard';
import Sidebar from './components/Sidebar';
import TaskCard from './components/TaskCard';
import TaskForm from './components/TaskForm';
import AuthPage from './components/AuthPage';
import LoadingState from './components/LoadingState';
import { dueGroup, isOverdue, toDate } from './utils/date';
import { useAuthStore } from './store/useAuthStore';
const priorityRank = { high: 0, medium: 1, low: 2 };
const groupOrder = ['Today', 'Tomorrow', 'This Week', 'Later', 'No Date'];
function getVisibleTasks(tasks, filters) {
    const search = filters.search.toLowerCase().trim();
    return tasks.filter((task) => {
        const matchesSearch = !search || `${task.title} ${task.description} ${task.category}`.toLowerCase().includes(search);
        const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
        const matchesStatus = filters.status === 'all' || task.status === filters.status;
        const matchesCategory = filters.category === 'all' || task.category === filters.category;
        const matchesOverdue = !filters.overdue || isOverdue(task);
        return matchesSearch && matchesPriority && matchesStatus && matchesCategory && matchesOverdue;
    }).sort((first, second) => {
        if (filters.sort === 'priority')
            return priorityRank[first.priority] - priorityRank[second.priority];
        if (filters.sort === 'createdAt')
            return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime();
        const firstDate = toDate(first.dueDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        const secondDate = toDate(second.dueDate)?.getTime() ?? Number.MAX_SAFE_INTEGER;
        return firstDate - secondDate;
    });
}
function PlannerApp() {
    const logout = useAuthStore((state) => state.logout);
    const tasks = useTaskStore((state) => state.tasks);
    const categories = useTaskStore((state) => state.categories);
    const filters = useTaskStore((state) => state.filters);
    const view = useTaskStore((state) => state.view);
    const theme = useTaskStore((state) => state.theme);
    const editingTaskId = useTaskStore((state) => state.editingTaskId);
    const setFilters = useTaskStore((state) => state.setFilters);
    const setEditingTaskId = useTaskStore((state) => state.setEditingTaskId);
    const fetchTasks = useTaskStore((state) => state.fetchTasks);
    const importTasksFromApi = useTaskStore((state) => state.importTasks);
    const loading = useTaskStore((state) => state.loading);
    const error = useTaskStore((state) => state.error);
    const [showFilters, setShowFilters] = useState(false);
    const visibleTasks = useMemo(() => getVisibleTasks(tasks, filters), [tasks, filters]);
    const editingTask = tasks.find((task) => task.id === editingTaskId);
    const activeTasks = tasks.filter((task) => task.status !== 'done').length;
    const overdueTasks = tasks.filter(isOverdue).length;
    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);
    useEffect(() => { void fetchTasks(); }, [fetchTasks]);
    function exportTasks() {
        const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = `taskflow-export-${new Date().toISOString().slice(0, 10)}.json`;
        anchor.click();
        URL.revokeObjectURL(url);
    }
    function importTasks(event) {
        const file = event.target.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                const parsed = JSON.parse(String(reader.result));
                if (!Array.isArray(parsed) || !parsed.every((task) => typeof task === 'object' && task !== null && 'id' in task && 'title' in task))
                    throw new Error('Invalid task file');
                void importTasksFromApi(parsed);
            }
            catch {
                window.alert('That file does not contain a valid TaskFlow export.');
            }
        };
        reader.readAsText(file);
        event.target.value = '';
    }
    function renderList() {
        if (visibleTasks.length === 0)
            return _jsxs("div", { className: "empty-state", children: [_jsx("span", { className: "empty-icon", children: _jsx(ListFilter, { size: 23 }) }), _jsx("h3", { children: tasks.length === 0 ? 'A clear desk is a good start.' : 'Nothing matches these filters.' }), _jsx("p", { children: tasks.length === 0 ? 'Create your first task and give your day some shape.' : 'Try widening your search or clearing a filter.' })] });
        const groups = groupOrder.map((group) => ({ group, tasks: visibleTasks.filter((task) => dueGroup(task) === group) })).filter(({ tasks: groupedTasks }) => groupedTasks.length > 0);
        return _jsx("div", { className: "task-groups", children: groups.map(({ group, tasks: groupedTasks }) => _jsxs("section", { className: "task-group", children: [_jsxs("div", { className: "group-heading", children: [_jsx("h3", { children: group }), _jsx("span", { children: groupedTasks.length })] }), groupedTasks.map((task) => _jsx(TaskCard, { task: task }, task.id))] }, group)) });
    }
    return _jsxs("div", { className: "app-layout", children: [_jsx(Sidebar, { tasks: tasks, onNewTask: () => setEditingTaskId('new'), onExport: exportTasks, onImport: importTasks, onLogout: logout }), _jsxs("main", { className: "main-content", children: [_jsxs("header", { className: "topbar", children: [_jsxs("div", { children: [_jsx("p", { className: "eyebrow", children: "Tuesday, September 22" }), _jsx("h1", { children: "Good morning, Rishi." }), _jsx("p", { className: "page-subtitle", children: "A little focus goes a long way." })] }), _jsxs("div", { className: "header-actions", children: [_jsxs("span", { className: "active-count", children: [_jsx("strong", { children: activeTasks }), " active"] }), _jsxs("button", { className: "button primary mobile-new", onClick: () => setEditingTaskId('new'), children: [_jsx(Plus, { size: 17 }), "New task"] })] })] }), error && _jsx("div", { className: "api-error", role: "alert", children: error }), _jsxs("section", { className: "stats-row", children: [_jsxs("div", { children: [_jsx("span", { className: "stat-label", children: "All tasks" }), _jsx("strong", { children: tasks.length })] }), _jsxs("div", { children: [_jsx("span", { className: "stat-label", children: "Due today" }), _jsx("strong", { children: tasks.filter((task) => dueGroup(task) === 'Today').length })] }), _jsxs("div", { className: overdueTasks ? 'stat-alert' : '', children: [_jsx("span", { className: "stat-label", children: "Overdue" }), _jsx("strong", { children: overdueTasks })] }), _jsxs("div", { children: [_jsx("span", { className: "stat-label", children: "Completed" }), _jsx("strong", { children: tasks.filter((task) => task.status === 'done').length })] })] }), _jsxs("section", { className: "workspace", children: [_jsxs("div", { className: "workspace-toolbar", children: [_jsxs("div", { className: "view-title", children: [_jsx("h2", { children: view === 'list' ? 'Your tasks' : view === 'board' ? 'Kanban board' : 'Calendar' }), _jsxs("span", { children: [visibleTasks.length, " showing"] })] }), view !== 'calendar' && _jsxs("div", { className: "toolbar-actions", children: [_jsxs("label", { className: "search-box", children: [_jsx(Search, { size: 17 }), _jsx("input", { value: filters.search, onChange: (event) => setFilters({ search: event.target.value }), placeholder: "Search tasks..." })] }), _jsxs("button", { className: `toolbar-button ${showFilters ? 'selected' : ''}`, onClick: () => setShowFilters(!showFilters), children: [_jsx(SlidersHorizontal, { size: 17 }), "Filters"] })] })] }), showFilters && _jsxs("div", { className: "filter-panel", children: [_jsxs("label", { children: ["Priority", _jsxs("select", { value: filters.priority, onChange: (event) => setFilters({ priority: event.target.value }), children: [_jsx("option", { value: "all", children: "Any priority" }), _jsx("option", { value: "high", children: "High" }), _jsx("option", { value: "medium", children: "Medium" }), _jsx("option", { value: "low", children: "Low" })] })] }), _jsxs("label", { children: ["Status", _jsxs("select", { value: filters.status, onChange: (event) => setFilters({ status: event.target.value }), children: [_jsx("option", { value: "all", children: "Any status" }), _jsx("option", { value: "todo", children: "To Do" }), _jsx("option", { value: "progress", children: "In Progress" }), _jsx("option", { value: "done", children: "Done" })] })] }), _jsxs("label", { children: ["Category", _jsxs("select", { value: filters.category, onChange: (event) => setFilters({ category: event.target.value }), children: [_jsx("option", { value: "all", children: "Any category" }), categories.map((category) => _jsx("option", { value: category, children: category }, category))] })] }), _jsxs("label", { children: ["Sort", _jsxs("select", { value: filters.sort, onChange: (event) => setFilters({ sort: event.target.value }), children: [_jsx("option", { value: "dueDate", children: "Due date" }), _jsx("option", { value: "priority", children: "Priority" }), _jsx("option", { value: "createdAt", children: "Recently created" })] })] }), _jsxs("label", { className: "checkbox-filter", children: [_jsx("input", { type: "checkbox", checked: filters.overdue, onChange: (event) => setFilters({ overdue: event.target.checked }) }), "Overdue only"] })] }), loading ? _jsx(LoadingState, {}) : view === 'list' ? renderList() : view === 'board' ? _jsx(KanbanBoard, { tasks: visibleTasks }) : _jsx(CalendarView, { tasks: visibleTasks })] })] }), editingTaskId && _jsx(TaskForm, { task: editingTaskId === 'new' ? undefined : editingTask, onClose: () => setEditingTaskId(null) })] });
}
function App() {
    const user = useAuthStore((state) => state.user);
    const authLoading = useAuthStore((state) => state.loading);
    const restoreSession = useAuthStore((state) => state.restoreSession);
    useEffect(() => { void restoreSession(); }, [restoreSession]);
    if (authLoading && !user)
        return _jsx(LoadingState, { message: "Restoring your session..." });
    if (!user)
        return _jsx(AuthPage, {});
    return _jsx(PlannerApp, {});
}
export default App;
