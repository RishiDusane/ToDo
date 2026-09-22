import { DndContext, DragEndEvent, useDraggable, useDroppable } from '@dnd-kit/core'
import { motion } from 'framer-motion'
import { GripVertical } from 'lucide-react'
import { useTaskStore } from '../store/useTaskStore'
import type { Status, Task } from '../types'
import TaskCard from './TaskCard'

const columns: { id: Status; label: string; hint: string }[] = [
  { id: 'todo', label: 'To Do', hint: 'Up next' },
  { id: 'progress', label: 'In Progress', hint: 'In motion' },
  { id: 'done', label: 'Done', hint: 'Complete' },
]

function DraggableTask({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id })
  return <motion.div ref={setNodeRef} style={transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined} className={isDragging ? 'dragging' : ''}><div className="drag-handle" {...listeners} {...attributes}><GripVertical size={16} /></div><TaskCard task={task} compact /></motion.div>
}

function BoardColumn({ column, tasks }: { column: typeof columns[number]; tasks: Task[] }) {
  const { isOver, setNodeRef } = useDroppable({ id: column.id })
  return <section ref={setNodeRef} className={`board-column ${isOver ? 'drop-target' : ''}`}><div className="column-heading"><div><h3>{column.label}</h3><small>{column.hint}</small></div><span>{tasks.length}</span></div><div className="column-tasks">{tasks.map((task) => <DraggableTask key={task.id} task={task} />)}{tasks.length === 0 && <div className="column-empty">Drop a task here</div>}</div></section>
}

export default function KanbanBoard({ tasks }: { tasks: Task[] }) {
  const setStatus = useTaskStore((state) => state.setStatus)
  function handleDragEnd(event: DragEndEvent) {
    if (event.over && columns.some((column) => column.id === event.over?.id)) setStatus(String(event.active.id), event.over.id as Status)
  }
  return <DndContext onDragEnd={handleDragEnd}><div className="board-grid">{columns.map((column) => <BoardColumn key={column.id} column={column} tasks={tasks.filter((task) => task.status === column.id)} />)}</div></DndContext>
}
