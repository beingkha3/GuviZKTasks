import { useMemo, useState } from 'react'
import {
  DndContext,
  PointerSensor,
  closestCenter,
  useDroppable,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useTasks } from './context/TaskContext'

const STATUS_META = {
  todo: { title: 'To Do', badge: 'bg-slate-200 text-slate-700' },
  inprogress: { title: 'In Progress', badge: 'bg-amber-100 text-amber-700' },
  done: { title: 'Done', badge: 'bg-emerald-100 text-emerald-700' },
}

const STATUS_ORDER = ['todo', 'inprogress', 'done']

const EMPTY_FORM = {
  title: '',
  description: '',
  status: 'todo',
  tags: '',
  priority: 'medium',
}

function normalizeTags(rawTags) {
  return rawTags
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .filter((tag, index, arr) => arr.indexOf(tag) === index)
}

function priorityClasses(priority) {
  if (priority === 'high') return 'bg-rose-100 text-rose-700'
  if (priority === 'low') return 'bg-emerald-100 text-emerald-700'
  return 'bg-slate-200 text-slate-700'
}

function formatDate(value) {
  return new Date(value).toLocaleString()
}

function TaskCard({ task, onOpen, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <article
      ref={setNodeRef}
      style={style}
      className={`rounded-xl border border-slate-200 bg-white p-3 shadow-sm transition ${
        isDragging ? 'opacity-50' : 'hover:border-slate-300'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => onOpen(task.id)}
          className="text-left"
        >
          <h4 className="line-clamp-1 text-sm font-semibold text-slate-800">{task.title}</h4>
        </button>
        <button
          type="button"
          className="rounded border border-slate-300 px-2 py-1 text-xs text-slate-600 hover:bg-slate-100"
          {...attributes}
          {...listeners}
        >
          Drag
        </button>
      </div>

      <p className="mt-2 line-clamp-3 text-sm text-slate-600">{task.description || 'No description'}</p>

      <div className="mt-3 flex flex-wrap gap-2">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${priorityClasses(task.priority)}`}>
          {task.priority}
        </span>
        {task.tags.length ? (
          task.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
              {tag}
            </span>
          ))
        ) : (
          <span className="text-xs text-slate-400">No tags</span>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onOpen(task.id)}
          className="rounded bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(task.id)}
          className="rounded bg-rose-100 px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-200"
        >
          Delete
        </button>
      </div>
    </article>
  )
}

function KanbanColumn({ status, tasks, onOpen, onDelete }) {
  const { setNodeRef, isOver } = useDroppable({ id: `column-${status}` })

  return (
    <section
      ref={setNodeRef}
      className={`min-h-80 rounded-2xl border p-4 transition ${
        isOver ? 'border-blue-400 bg-blue-50/40' : 'border-slate-200 bg-slate-50'
      }`}
    >
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-800">{STATUS_META[status].title}</h3>
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_META[status].badge}`}>
          {tasks.length}
        </span>
      </div>

      <SortableContext items={tasks.map((task) => task.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} onOpen={onOpen} onDelete={onDelete} />
          ))}
        </div>
      </SortableContext>

      {!tasks.length ? (
        <div className="mt-3 rounded-lg border border-dashed border-slate-300 p-4 text-center text-xs text-slate-400">
          Drop tasks here
        </div>
      ) : null}
    </section>
  )
}

function TaskModal({ task, onClose }) {
  const { setUiState, updateTask, deleteTask, restoreTask } = useTasks()

  const [draft, setDraft] = useState({
    title: task.title,
    description: task.description,
    status: task.status,
    tags: task.tags.join(', '),
    priority: task.priority,
  })

  function save() {
    if (!draft.title.trim()) return

    const nextStatus = STATUS_ORDER.includes(draft.status) ? draft.status : 'todo'

    updateTask(task.id, {
      title: draft.title.trim(),
      description: draft.description.trim(),
      status: nextStatus,
      tags: normalizeTags(draft.tags),
      priority: draft.priority,
    })

    setUiState((prev) => ({ ...prev, selectedColumn: nextStatus }))
    onClose()
  }

  function remove() {
    deleteTask(task.id)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold text-slate-900">Task Details</h3>
          <button onClick={onClose} className="text-sm text-slate-500 hover:text-slate-800" type="button">
            Close
          </button>
        </div>

        <div className="mt-4 grid gap-3">
          <input
            value={draft.title}
            onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
            placeholder="Task title"
          />
          <textarea
            value={draft.description}
            onChange={(event) => setDraft((prev) => ({ ...prev, description: event.target.value }))}
            className="min-h-28 rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
            placeholder="Description"
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <select
              value={draft.status}
              onChange={(event) => setDraft((prev) => ({ ...prev, status: event.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
            >
              {STATUS_ORDER.map((status) => (
                <option key={status} value={status}>
                  {STATUS_META[status].title}
                </option>
              ))}
            </select>

            <select
              value={draft.priority}
              onChange={(event) => setDraft((prev) => ({ ...prev, priority: event.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
            >
              <option value="low">Low priority</option>
              <option value="medium">Medium priority</option>
              <option value="high">High priority</option>
            </select>
          </div>

          <input
            value={draft.tags}
            onChange={(event) => setDraft((prev) => ({ ...prev, tags: event.target.value }))}
            className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
            placeholder="Tags (comma separated)"
          />

          <p className="text-xs text-slate-500">Created {formatDate(task.createdAt)}</p>
          <p className="text-xs text-slate-500">Updated {formatDate(task.updatedAt)}</p>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button
            onClick={save}
            type="button"
            className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
          >
            Save Changes
          </button>
          <button
            onClick={() => {
              restoreTask(task.id)
              setUiState((prev) => ({ ...prev, selectedColumn: 'todo' }))
              onClose()
            }}
            type="button"
            className="rounded-lg bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200"
          >
            Move to To Do
          </button>
          <button
            onClick={remove}
            type="button"
            className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700"
          >
            Delete Task
          </button>
        </div>
      </div>
    </div>
  )
}

function Board() {
  const { tasks, addTask, deleteTask, moveTask, uiState, setUiState } = useTasks()

  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')
  const [activeTaskId, setActiveTaskId] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 6,
      },
    }),
  )

  const tasksByStatus = useMemo(
    () =>
      STATUS_ORDER.reduce((acc, status) => {
        acc[status] = tasks
          .filter((task) => task.status === status)
          .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        return acc
      }, {}),
    [tasks],
  )

  const activeTask = tasks.find((task) => task.id === activeTaskId) || null

  function createTask(event) {
    event.preventDefault()

    if (!form.title.trim()) {
      setError('Task title is required.')
      return
    }

    addTask({
      title: form.title,
      description: form.description,
      status: form.status,
      tags: normalizeTags(form.tags),
      priority: form.priority,
    })

    setForm(EMPTY_FORM)
    setError('')
  }

  function handleDragEnd(event) {
    const { active, over } = event
    if (!over) return

    const activeId = String(active.id)
    const overId = String(over.id)
    const sourceTask = tasks.find((task) => task.id === activeId)
    if (!sourceTask) return

    let nextStatus = null

    if (overId.startsWith('column-')) {
      nextStatus = overId.replace('column-', '')
    } else {
      const targetTask = tasks.find((task) => task.id === overId)
      nextStatus = targetTask?.status ?? null
    }

    if (!nextStatus || sourceTask.status === nextStatus) {
      return
    }

    moveTask(activeId, nextStatus)
    setUiState((prev) => ({ ...prev, selectedColumn: nextStatus }))
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900 sm:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <header className="rounded-2xl bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-bold sm:text-3xl">Kanban Board</h1>
          <p className="mt-2 text-sm text-slate-600">
            Manage tasks with drag-and-drop workflow and local persistence.
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Last active column: {STATUS_META[uiState.selectedColumn]?.title ?? STATUS_META.todo.title}
          </p>
        </header>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Create Task</h2>
          <form onSubmit={createTask} className="grid gap-3">
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
              placeholder="Task title *"
            />
            <textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              className="min-h-24 rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
              placeholder="Task description"
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <select
                value={form.status}
                onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value }))}
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
              >
                {STATUS_ORDER.map((status) => (
                  <option key={status} value={status}>
                    {STATUS_META[status].title}
                  </option>
                ))}
              </select>

              <select
                value={form.priority}
                onChange={(event) => setForm((prev) => ({ ...prev, priority: event.target.value }))}
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
              >
                <option value="low">Low priority</option>
                <option value="medium">Medium priority</option>
                <option value="high">High priority</option>
              </select>

              <input
                value={form.tags}
                onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
                className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
                placeholder="Tags (comma separated)"
              />
            </div>

            {error ? <p className="text-sm text-rose-600">{error}</p> : null}

            <div>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700" type="submit">
                Add Task
              </button>
            </div>
          </form>
        </section>

        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <section className="grid gap-4 md:grid-cols-3">
            {STATUS_ORDER.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                tasks={tasksByStatus[status]}
                onOpen={setActiveTaskId}
                onDelete={deleteTask}
              />
            ))}
          </section>
        </DndContext>
      </div>

      {activeTask ? <TaskModal key={activeTask.id} task={activeTask} onClose={() => setActiveTaskId(null)} /> : null}
    </div>
  )
}

export default Board
