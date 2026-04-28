# Kanban Board (project1)

A React + TailwindCSS kanban app using Context API, dnd-kit, and localStorage.

## Features

- Visual columns: To Do, In Progress, Done
- Create, edit, and delete tasks
- Drag tasks between columns
- Task details modal with inline edits
- Optional metadata: tags and priority
- Local persistence keys:
  - `kanban:tasks`
  - `kanban:ui`

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Notes

- Uses `dnd-kit` for drag-and-drop.
- Global task state is managed via React Context API.
- No backend or external API is required.
