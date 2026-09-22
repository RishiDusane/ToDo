import { FileDown, ListFilter, Plus, Search, SlidersHorizontal } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useTaskStore } from './store/useTaskStore'
import CalendarView from './components/CalendarView'
import KanbanBoard from './components/KanbanBoard'
import Sidebar from './components/Sidebar'
import TaskCard from './components/TaskCard'
import TaskForm from './components/TaskForm'
import { dueGroup, isOverdue, toDate } from './utils/date'
import type { Status, Task } from './types'

const priorityRank = { high: 0, medium: 1, low: 2 }
const groupOrder = ['Today', 'Tomorrow', 'This Week', 'Later', 'No Date']

function getVisibleTasks(tasks: Task[], filters: ReturnType<typeof useTaskStore.getState>['filters']) {
  const search = filters.search.toLowerCase().trim()
  return tasks.filter((task) => {
    const matchesSearch = !search || `${task.title} ${task.description} ${task.category}`.toLowerCase().includes(search)
    const matchesPriority = filters.priority === 'all' || task.priority === filters.priority
    const matchesStatus = filters.status === 'all' || task.status === filters.status
    const matchesCategory = filters.category === 'all' || task.category === filters.category
    const matchesOverdue = !filters.overdue || isOverdue(task)
    return matchesSearch && matchesPriority && matchesStatus && matchesCategory && matchesOverdue
  }).sort((first, second) => {
    if (filters.sort === 'priority') return priorityRank[first.priority] - priorityRank[second.priority]
    if (filters.sort === 'createdAt') return new Date(second.createdAt).getTime() - new Date(first.createdAt).getTime()
    const firstDate = toDate(first.dueDate)?.getTime() ?? Number.MAX_SAFE_INTEGER
    const secondDate = toDate(second.dueDate)?.getTime() ?? Number.MAX_SAFE_INTEGER
    return firstDate - secondDate
  })
}

function App() {
  const tasks = useTaskStore((state) => state.tasks)
  const categories = useTaskStore((state) => state.categories)
  const filters = useTaskStore((state) => state.filters)
  const view = useTaskStore((state) => state.view)
  const theme = useTaskStore((state) => state.theme)
  const editingTaskId = useTaskStore((state) => state.editingTaskId)
  const setFilters = useTaskStore((state) => state.setFilters)
  const setEditingTaskId = useTaskStore((state) => state.setEditingTaskId)
  const replaceTasks = useTaskStore((state) => state.replaceTasks)
  const [showFilters, setShowFilters] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const visibleTasks = useMemo(() => getVisibleTasks(tasks, filters), [tasks, filters])
  const editingTask = tasks.find((task) => task.id === editingTaskId)
  const activeTasks = tasks.filter((task) => task.status !== 'done').length
  const overdueTasks = tasks.filter(isOverdue).length

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  function exportTasks() {
    const blob = new Blob([JSON.stringify(tasks, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = `taskflow-export-${new Date().toISOString().slice(0, 10)}.json`
    anchor.click()
    URL.revokeObjectURL(url)
  }

  function importTasks(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed: unknown = JSON.parse(String(reader.result))
        if (!Array.isArray(parsed) || !parsed.every((task) => typeof task === 'object' && task !== null && 'id' in task && 'title' in task)) throw new Error('Invalid task file')
        replaceTasks(parsed as Task[])
      } catch {
        window.alert('That file does not contain a valid TaskFlow export.')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  function renderList() {
    if (visibleTasks.length === 0) return <div className="empty-state"><span className="empty-icon"><ListFilter size={23} /></span><h3>{tasks.length === 0 ? 'A clear desk is a good start.' : 'Nothing matches these filters.'}</h3><p>{tasks.length === 0 ? 'Create your first task and give your day some shape.' : 'Try widening your search or clearing a filter.'}</p></div>
    const groups = groupOrder.map((group) => ({ group, tasks: visibleTasks.filter((task) => dueGroup(task) === group) })).filter(({ tasks: groupedTasks }) => groupedTasks.length > 0)
    return <div className="task-groups">{groups.map(({ group, tasks: groupedTasks }) => <section key={group} className="task-group"><div className="group-heading"><h3>{group}</h3><span>{groupedTasks.length}</span></div>{groupedTasks.map((task) => <TaskCard key={task.id} task={task} />)}</section>)}</div>
  }

  return <div className="app-layout"><Sidebar tasks={tasks} onNewTask={() => setEditingTaskId('new')} onExport={exportTasks} onImport={importTasks} /><main className="main-content"><header className="topbar"><div><p className="eyebrow">Tuesday, September 22</p><h1>Good morning, Rishi.</h1><p className="page-subtitle">A little focus goes a long way.</p></div><div className="header-actions"><span className="active-count"><strong>{activeTasks}</strong> active</span><button className="button primary mobile-new" onClick={() => setEditingTaskId('new')}><Plus size={17} />New task</button></div></header><section className="stats-row"><div><span className="stat-label">All tasks</span><strong>{tasks.length}</strong></div><div><span className="stat-label">Due today</span><strong>{tasks.filter((task) => dueGroup(task) === 'Today').length}</strong></div><div className={overdueTasks ? 'stat-alert' : ''}><span className="stat-label">Overdue</span><strong>{overdueTasks}</strong></div><div><span className="stat-label">Completed</span><strong>{tasks.filter((task) => task.status === 'done').length}</strong></div></section><section className="workspace"><div className="workspace-toolbar"><div className="view-title"><h2>{view === 'list' ? 'Your tasks' : view === 'board' ? 'Kanban board' : 'Calendar'}</h2><span>{visibleTasks.length} showing</span></div>{view !== 'calendar' && <div className="toolbar-actions"><label className="search-box"><Search size={17} /><input value={filters.search} onChange={(event) => setFilters({ search: event.target.value })} placeholder="Search tasks..." /></label><button className={`toolbar-button ${showFilters ? 'selected' : ''}`} onClick={() => setShowFilters(!showFilters)}><SlidersHorizontal size={17} />Filters</button></div>}</div>{showFilters && <div className="filter-panel"><label>Priority<select value={filters.priority} onChange={(event) => setFilters({ priority: event.target.value as typeof filters.priority })}><option value="all">Any priority</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label><label>Status<select value={filters.status} onChange={(event) => setFilters({ status: event.target.value as Status | 'all' })}><option value="all">Any status</option><option value="todo">To Do</option><option value="progress">In Progress</option><option value="done">Done</option></select></label><label>Category<select value={filters.category} onChange={(event) => setFilters({ category: event.target.value })}><option value="all">Any category</option>{categories.map((category) => <option key={category} value={category}>{category}</option>)}</select></label><label>Sort<select value={filters.sort} onChange={(event) => setFilters({ sort: event.target.value as typeof filters.sort })}><option value="dueDate">Due date</option><option value="priority">Priority</option><option value="createdAt">Recently created</option></select></label><label className="checkbox-filter"><input type="checkbox" checked={filters.overdue} onChange={(event) => setFilters({ overdue: event.target.checked })} />Overdue only</label></div>}{view === 'list' && renderList()}{view === 'board' && <KanbanBoard tasks={visibleTasks} />}{view === 'calendar' && <CalendarView tasks={visibleTasks} />}</section></main>{editingTaskId && <TaskForm task={editingTaskId === 'new' ? undefined : editingTask} onClose={() => setEditingTaskId(null)} />}<input ref={fileInputRef} type="file" hidden /></div>
}

export default App
