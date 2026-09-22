import { addMonths, eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, startOfMonth, startOfWeek, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import type { Task } from '../types'
import { toDate } from '../utils/date'

export default function CalendarView({ tasks }: { tasks: Task[] }) {
  const [month, setMonth] = useState(new Date())
  const days = eachDayOfInterval({ start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }), end: endOfWeek(endOfMonth(month), { weekStartsOn: 1 }) })
  const weekdayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  return <section className="calendar-view"><div className="calendar-header"><div><p className="eyebrow">Schedule at a glance</p><h2>{format(month, 'MMMM yyyy')}</h2></div><div className="calendar-nav"><button className="icon-button" onClick={() => setMonth(subMonths(month, 1))} aria-label="Previous month"><ChevronLeft size={18} /></button><button className="icon-button" onClick={() => setMonth(new Date())}>Today</button><button className="icon-button" onClick={() => setMonth(addMonths(month, 1))} aria-label="Next month"><ChevronRight size={18} /></button></div></div><div className="calendar-grid weekday-row">{weekdayLabels.map((label) => <span key={label}>{label}</span>)}</div><div className="calendar-grid">{days.map((day) => { const dayTasks = tasks.filter((task) => { const dueDate = toDate(task.dueDate); return dueDate && isSameDay(dueDate, day) }); return <div className={`calendar-day ${isSameMonth(day, month) ? '' : 'outside-month'}`} key={day.toISOString()}><span className="day-number">{format(day, 'd')}</span><div className="day-dots">{dayTasks.slice(0, 4).map((task) => <span key={task.id} className={`calendar-dot ${task.priority}`} title={task.title} />)}</div>{dayTasks.length > 4 && <small>+{dayTasks.length - 4} more</small>}</div> })}</div></section>
}
