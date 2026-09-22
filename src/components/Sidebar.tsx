import { BarChart3, CalendarDays, Download, FolderKanban, LayoutList, LogOut, Moon, Plus, Sun, Upload } from 'lucide-react'
import type { ChangeEvent } from 'react'
import { useTaskStore } from '../store/useTaskStore'
import type { Task, ViewMode } from '../types'

interface SidebarProps {
  tasks: Task[]
  onNewTask: () => void
  onImport: (event: ChangeEvent<HTMLInputElement>) => void
  onExport: () => void
  onLogout: () => void
}

export default function Sidebar({ tasks, onNewTask, onImport, onExport, onLogout }: SidebarProps) {
  const view = useTaskStore((state) => state.view)
  const setView = useTaskStore((state) => state.setView)
  const theme = useTaskStore((state) => state.theme)
  const setTheme = useTaskStore((state) => state.setTheme)
  const completed = tasks.filter((task) => task.status === 'done').length
  const progress = tasks.length ? Math.round((completed / tasks.length) * 100) : 0
  const views: { id: ViewMode; label: string; icon: typeof LayoutList }[] = [
    { id: 'list', label: 'My tasks', icon: LayoutList },
    { id: 'board', label: 'Kanban board', icon: FolderKanban },
    { id: 'calendar', label: 'Calendar', icon: CalendarDays },
  ]

  return <aside className="sidebar"><div className="brand-mark"><span>TF</span><div><strong>TaskFlow</strong><small>Personal planner</small></div></div><button className="button primary new-task-button" onClick={onNewTask}><Plus size={18} />New task</button><nav className="sidebar-nav" aria-label="Views">{views.map(({ id, label, icon: Icon }) => <button key={id} className={view === id ? 'active' : ''} onClick={() => setView(id)}><Icon size={18} />{label}</button>)}</nav><div className="sidebar-progress"><div className="progress-heading"><span><BarChart3 size={16} />Progress</span><strong>{progress}%</strong></div><div className="progress-track"><span style={{ width: `${progress}%` }} /></div><small>{completed} of {tasks.length} tasks completed</small></div><div className="sidebar-footer"><button className="sidebar-action" onClick={onExport}><Download size={16} />Export data</button><label className="sidebar-action"><Upload size={16} />Import data<input type="file" accept="application/json" onChange={onImport} hidden /></label><button className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Toggle theme">{theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}</button><button className="sidebar-action" onClick={onLogout}><LogOut size={16} />Log out</button></div></aside>
}
