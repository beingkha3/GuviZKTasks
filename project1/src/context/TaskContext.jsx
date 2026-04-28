import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const TASKS_KEY = 'kanban:tasks'
const UI_KEY = 'kanban:ui'
const VALID_STATUSES = ['todo', 'inprogress', 'done']

const TaskContext = createContext(null)

function readJSON(key, fallback) {
  const raw = localStorage.getItem(key)
  if (!raw) return fallback

  try {
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function normalizeStatus(status) {
  const normalized = String(status || '')
    .trim()
    .toLowerCase()

  if (VALID_STATUSES.includes(normalized)) {
    return normalized
  }

  if (normalized === 'to do' || normalized === 'todo') return 'todo'
  if (normalized === 'in progress' || normalized === 'in-progress' || normalized === 'in_progress') return 'inprogress'
  if (normalized === 'completed' || normalized === 'complete') return 'done'

  return 'todo'
}

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState(() =>
    readJSON(TASKS_KEY, []).map((task) => ({
      ...task,
      status: normalizeStatus(task.status),
      tags: Array.isArray(task.tags) ? task.tags : [],
      priority: task.priority || 'medium',
    })),
  )
  const [uiState, setUiState] = useState(() =>
    readJSON(UI_KEY, {
      selectedColumn: 'todo',
    }),
  )

  useEffect(() => {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem(UI_KEY, JSON.stringify(uiState))
  }, [uiState])

  function addTask({ title, description, status, tags, priority }) {
    const now = new Date().toISOString()

    setTasks((prev) => [
      {
        id: createId(),
        title: title.trim(),
        description: description.trim(),
        status: normalizeStatus(status),
        tags,
        priority,
        createdAt: now,
        updatedAt: now,
      },
      ...prev,
    ])
  }

  function updateTask(taskId, updates) {
    const nextUpdates = { ...updates }
    if (Object.prototype.hasOwnProperty.call(nextUpdates, 'status')) {
      nextUpdates.status = normalizeStatus(nextUpdates.status)
    }

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId
          ? {
              ...task,
              ...nextUpdates,
              updatedAt: new Date().toISOString(),
            }
          : task,
      ),
    )
  }

  function deleteTask(taskId) {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
  }

  function moveTask(taskId, newStatus) {
    updateTask(taskId, { status: normalizeStatus(newStatus) })
  }

  function restoreTask(taskId) {
    moveTask(taskId, 'todo')
  }

  const value = useMemo(
    () => ({
      tasks,
      uiState,
      setUiState,
      addTask,
      updateTask,
      deleteTask,
      moveTask,
      restoreTask,
    }),
    [tasks, uiState],
  )

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>
}

export function useTasks() {
  const context = useContext(TaskContext)
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider')
  }

  return context
}
