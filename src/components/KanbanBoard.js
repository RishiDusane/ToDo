import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { DndContext, useDraggable, useDroppable } from '@dnd-kit/core';
import { motion } from 'framer-motion';
import { GripVertical } from 'lucide-react';
import { useTaskStore } from '../store/useTaskStore';
import TaskCard from './TaskCard';
const columns = [
    { id: 'todo', label: 'To Do', hint: 'Up next' },
    { id: 'progress', label: 'In Progress', hint: 'In motion' },
    { id: 'done', label: 'Done', hint: 'Complete' },
];
function DraggableTask({ task }) {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({ id: task.id });
    return _jsxs(motion.div, { ref: setNodeRef, style: transform ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` } : undefined, className: isDragging ? 'dragging' : '', children: [_jsx("div", { className: "drag-handle", ...listeners, ...attributes, children: _jsx(GripVertical, { size: 16 }) }), _jsx(TaskCard, { task: task, compact: true })] });
}
function BoardColumn({ column, tasks }) {
    const { isOver, setNodeRef } = useDroppable({ id: column.id });
    return _jsxs("section", { ref: setNodeRef, className: `board-column ${isOver ? 'drop-target' : ''}`, children: [_jsxs("div", { className: "column-heading", children: [_jsxs("div", { children: [_jsx("h3", { children: column.label }), _jsx("small", { children: column.hint })] }), _jsx("span", { children: tasks.length })] }), _jsxs("div", { className: "column-tasks", children: [tasks.map((task) => _jsx(DraggableTask, { task: task }, task.id)), tasks.length === 0 && _jsx("div", { className: "column-empty", children: "Drop a task here" })] })] });
}
export default function KanbanBoard({ tasks }) {
    const setStatus = useTaskStore((state) => state.setStatus);
    function handleDragEnd(event) {
        if (event.over && columns.some((column) => column.id === event.over?.id))
            setStatus(String(event.active.id), event.over.id);
    }
    return _jsx(DndContext, { onDragEnd: handleDragEnd, children: _jsx("div", { className: "board-grid", children: columns.map((column) => _jsx(BoardColumn, { column: column, tasks: tasks.filter((task) => task.status === column.id) }, column.id)) }) });
}
