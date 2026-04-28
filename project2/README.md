# Notes App (project2)

A React + TailwindCSS notes manager with localStorage persistence.

## Features

- Create, view, edit, and delete notes
- Search notes by title/content
- Tag notes and filter by tag
- Pin notes to keep them on top
- Archive notes instead of deleting
- Trash flow with restore and permanent delete
- Expanded note detail modal
- Persistence keys:
  - `notes:active`
  - `notes:archived`
  - `notes:trash`
  - `notes:ui`

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

- Data is stored fully in browser localStorage.
- No backend or external API is required.
