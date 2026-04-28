import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEYS = {
  active: 'notes:active',
  archived: 'notes:archived',
  trash: 'notes:trash',
  ui: 'notes:ui',
}

const SECTIONS = {
  active: 'active',
  archived: 'archived',
  trash: 'trash',
}

const EMPTY_FORM = {
  title: '',
  description: '',
  tags: '',
}

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

function normalizeTags(rawTags) {
  return rawTags
    .split(',')
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean)
    .filter((tag, index, arr) => arr.indexOf(tag) === index)
}

function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

function formatDate(value) {
  return new Date(value).toLocaleString()
}

function sortNotes(notes) {
  return [...notes].sort((a, b) => {
    if (a.isPinned !== b.isPinned) {
      return a.isPinned ? -1 : 1
    }

    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  })
}

function NotesApp() {
  const savedUi = readJSON(STORAGE_KEYS.ui, {
    searchTerm: '',
    selectedTag: 'all',
    section: SECTIONS.active,
  })

  const [activeNotes, setActiveNotes] = useState(() => readJSON(STORAGE_KEYS.active, []))
  const [archivedNotes, setArchivedNotes] = useState(() => readJSON(STORAGE_KEYS.archived, []))
  const [trashNotes, setTrashNotes] = useState(() => readJSON(STORAGE_KEYS.trash, []))

  const [searchTerm, setSearchTerm] = useState(savedUi.searchTerm)
  const [selectedTag, setSelectedTag] = useState(savedUi.selectedTag)
  const [section, setSection] = useState(savedUi.section)

  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  const [selectedNote, setSelectedNote] = useState(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [modalDraft, setModalDraft] = useState(EMPTY_FORM)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.active, JSON.stringify(activeNotes))
  }, [activeNotes])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.archived, JSON.stringify(archivedNotes))
  }, [archivedNotes])

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.trash, JSON.stringify(trashNotes))
  }, [trashNotes])

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.ui,
      JSON.stringify({
        searchTerm,
        selectedTag,
        section,
      }),
    )
  }, [searchTerm, selectedTag, section])

  const notesBySection = {
    [SECTIONS.active]: sortNotes(activeNotes),
    [SECTIONS.archived]: sortNotes(archivedNotes),
    [SECTIONS.trash]: sortNotes(trashNotes),
  }

  const allTags = useMemo(() => {
    const source = notesBySection[section]
    const tags = new Set(source.flatMap((note) => note.tags))
    return ['all', ...Array.from(tags)]
  }, [section, notesBySection])

  const filteredNotes = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    return notesBySection[section].filter((note) => {
      const textMatch =
        query.length === 0 ||
        note.title.toLowerCase().includes(query) ||
        note.description.toLowerCase().includes(query)

      const tagMatch = selectedTag === 'all' || note.tags.includes(selectedTag)

      return textMatch && tagMatch
    })
  }, [notesBySection, searchTerm, selectedTag, section])

  function closeModal() {
    setSelectedNote(null)
    setIsEditMode(false)
    setModalDraft(EMPTY_FORM)
  }

  function updateNoteInList(setter, noteId, updateFn) {
    setter((notes) => notes.map((note) => (note.id === noteId ? updateFn(note) : note)))
  }

  function removeNoteFromList(setter, noteId) {
    setter((notes) => notes.filter((note) => note.id !== noteId))
  }

  function openNote(note) {
    setSelectedNote(note)
    setIsEditMode(false)
    setModalDraft({
      title: note.title,
      description: note.description,
      tags: note.tags.join(', '),
    })
  }

  function createNote(event) {
    event.preventDefault()

    if (!form.title.trim()) {
      setError('Title is required.')
      return
    }

    const now = new Date().toISOString()

    const newNote = {
      id: createId(),
      title: form.title.trim(),
      description: form.description.trim(),
      tags: normalizeTags(form.tags),
      isPinned: false,
      createdAt: now,
      updatedAt: now,
      section: SECTIONS.active,
    }

    setActiveNotes((prev) => [newNote, ...prev])
    setForm(EMPTY_FORM)
    setError('')
    setSection(SECTIONS.active)
  }

  function saveModalEdits() {
    if (!selectedNote || !modalDraft.title.trim()) {
      return
    }

    const updatedPayload = {
      title: modalDraft.title.trim(),
      description: modalDraft.description.trim(),
      tags: normalizeTags(modalDraft.tags),
      updatedAt: new Date().toISOString(),
    }

    const applyUpdate = (note) => ({ ...note, ...updatedPayload })

    if (selectedNote.section === SECTIONS.active) {
      updateNoteInList(setActiveNotes, selectedNote.id, applyUpdate)
    }

    if (selectedNote.section === SECTIONS.archived) {
      updateNoteInList(setArchivedNotes, selectedNote.id, applyUpdate)
    }

    if (selectedNote.section === SECTIONS.trash) {
      updateNoteInList(setTrashNotes, selectedNote.id, applyUpdate)
    }

    const updated = { ...selectedNote, ...updatedPayload }
    setSelectedNote(updated)
    setIsEditMode(false)
  }

  function togglePin(noteId) {
    const updatedAt = new Date().toISOString()

    updateNoteInList(setActiveNotes, noteId, (note) => ({
      ...note,
      isPinned: !note.isPinned,
      updatedAt,
    }))

    setSelectedNote((prev) =>
      prev && prev.id === noteId
        ? {
            ...prev,
            isPinned: !prev.isPinned,
            updatedAt,
          }
        : prev,
    )
  }

  function moveToArchive(noteId) {
    const target = activeNotes.find((note) => note.id === noteId)
    if (!target) return

    const movedNote = {
      ...target,
      section: SECTIONS.archived,
      isPinned: false,
      updatedAt: new Date().toISOString(),
    }

    setActiveNotes((notes) => notes.filter((note) => note.id !== noteId))
    setArchivedNotes((notes) => [movedNote, ...notes])
    if (selectedNote?.id === noteId) closeModal()
  }

  function moveToTrashFromSection(noteId, fromSection) {
    const source = fromSection === SECTIONS.active ? activeNotes : archivedNotes
    const target = source.find((note) => note.id === noteId)
    if (!target) return

    const movedNote = {
      ...target,
      section: SECTIONS.trash,
      isPinned: false,
      updatedAt: new Date().toISOString(),
    }

    if (fromSection === SECTIONS.active) {
      setActiveNotes((notes) => notes.filter((note) => note.id !== noteId))
    }

    if (fromSection === SECTIONS.archived) {
      setArchivedNotes((notes) => notes.filter((note) => note.id !== noteId))
    }

    setTrashNotes((notes) => [movedNote, ...notes])
    if (selectedNote?.id === noteId) closeModal()
  }

  function restoreFromArchive(noteId) {
    const target = archivedNotes.find((note) => note.id === noteId)
    if (!target) return

    const movedNote = {
      ...target,
      section: SECTIONS.active,
      updatedAt: new Date().toISOString(),
    }

    setArchivedNotes((notes) => notes.filter((note) => note.id !== noteId))
    setActiveNotes((notes) => [movedNote, ...notes])
    if (selectedNote?.id === noteId) closeModal()
  }

  function restoreFromTrash(noteId) {
    const target = trashNotes.find((note) => note.id === noteId)
    if (!target) return

    const movedNote = {
      ...target,
      section: SECTIONS.active,
      updatedAt: new Date().toISOString(),
    }

    setTrashNotes((notes) => notes.filter((note) => note.id !== noteId))
    setActiveNotes((notes) => [movedNote, ...notes])
    if (selectedNote?.id === noteId) closeModal()
  }

  function deleteForever(noteId) {
    removeNoteFromList(setTrashNotes, noteId)
    closeModal()
  }

  function handleCardAction(event, action) {
    event.stopPropagation()
    action()
  }

  const sectionCounts = {
    active: activeNotes.length,
    archived: archivedNotes.length,
    trash: trashNotes.length,
  }

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-6 text-slate-900 sm:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <header className="rounded-2xl bg-white p-5 shadow-sm">
          <h1 className="text-2xl font-bold sm:text-3xl">Notes App</h1>
          <p className="mt-2 text-sm text-slate-600">Create, organize, and manage your notes locally.</p>
        </header>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold">Create a Note</h2>
          <form onSubmit={createNote} className="grid gap-3">
            <input
              value={form.title}
              onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
              placeholder="Title *"
            />
            <textarea
              value={form.description}
              onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
              className="min-h-24 rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
              placeholder="Description"
            />
            <input
              value={form.tags}
              onChange={(event) => setForm((prev) => ({ ...prev, tags: event.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
              placeholder="Tags (comma separated)"
            />
            {error ? <p className="text-sm text-rose-600">{error}</p> : null}
            <div>
              <button className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700" type="submit">
                Add Note
              </button>
            </div>
          </form>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            {[SECTIONS.active, SECTIONS.archived, SECTIONS.trash].map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSection(item)}
                className={`rounded-full px-3 py-1 text-sm font-medium transition ${
                  section === item ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                }`}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)} ({sectionCounts[item]})
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search by title or content"
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
            />
            <select
              value={selectedTag}
              onChange={(event) => setSelectedTag(event.target.value)}
              className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
            >
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag === 'all' ? 'All tags' : tag}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {filteredNotes.map((note) => (
              <article
                key={note.id}
                className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300"
                onClick={() => openNote(note)}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="line-clamp-1 text-base font-semibold">{note.title}</h3>
                  {note.isPinned ? <span className="rounded bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">Pinned</span> : null}
                </div>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">{note.description || 'No description'}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {note.tags.length ? (
                    note.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No tags</span>
                  )}
                </div>
                <p className="mt-3 text-xs text-slate-400">Updated {formatDate(note.updatedAt)}</p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={(event) => handleCardAction(event, () => openNote(note))}
                    className="rounded bg-slate-200 px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-300"
                  >
                    View
                  </button>

                  {note.section === SECTIONS.active ? (
                    <>
                      <button
                        type="button"
                        onClick={(event) => handleCardAction(event, () => togglePin(note.id))}
                        className="rounded bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 hover:bg-amber-200"
                      >
                        {note.isPinned ? 'Unpin' : 'Pin'}
                      </button>
                      <button
                        type="button"
                        onClick={(event) => handleCardAction(event, () => moveToArchive(note.id))}
                        className="rounded bg-indigo-100 px-2 py-1 text-xs font-medium text-indigo-700 hover:bg-indigo-200"
                      >
                        Archive
                      </button>
                      <button
                        type="button"
                        onClick={(event) => handleCardAction(event, () => moveToTrashFromSection(note.id, SECTIONS.active))}
                        className="rounded bg-rose-100 px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-200"
                      >
                        Delete
                      </button>
                    </>
                  ) : null}

                  {note.section === SECTIONS.archived ? (
                    <>
                      <button
                        type="button"
                        onClick={(event) => handleCardAction(event, () => restoreFromArchive(note.id))}
                        className="rounded bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-200"
                      >
                        Restore
                      </button>
                      <button
                        type="button"
                        onClick={(event) => handleCardAction(event, () => moveToTrashFromSection(note.id, SECTIONS.archived))}
                        className="rounded bg-rose-100 px-2 py-1 text-xs font-medium text-rose-700 hover:bg-rose-200"
                      >
                        Delete
                      </button>
                    </>
                  ) : null}

                  {note.section === SECTIONS.trash ? (
                    <>
                      <button
                        type="button"
                        onClick={(event) => handleCardAction(event, () => restoreFromTrash(note.id))}
                        className="rounded bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-700 hover:bg-emerald-200"
                      >
                        Restore
                      </button>
                      <button
                        type="button"
                        onClick={(event) => handleCardAction(event, () => deleteForever(note.id))}
                        className="rounded bg-rose-600 px-2 py-1 text-xs font-medium text-white hover:bg-rose-700"
                      >
                        Delete Forever
                      </button>
                    </>
                  ) : null}
                </div>
              </article>
            ))}
          </div>

          {!filteredNotes.length ? (
            <div className="mt-5 rounded-lg border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">
              No notes found for this filter.
            </div>
          ) : null}
        </section>
      </div>

      {selectedNote ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-xl font-semibold">Note Details</h2>
              <button onClick={closeModal} className="text-slate-500 hover:text-slate-800" type="button">
                Close
              </button>
            </div>

            {!isEditMode ? (
              <>
                <h3 className="mt-4 text-lg font-semibold">{selectedNote.title}</h3>
                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{selectedNote.description || 'No description'}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {selectedNote.tags.length ? (
                    selectedNote.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                        {tag}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-slate-400">No tags</span>
                  )}
                </div>
                <p className="mt-4 text-xs text-slate-500">Created {formatDate(selectedNote.createdAt)}</p>
                <p className="text-xs text-slate-500">Updated {formatDate(selectedNote.updatedAt)}</p>
              </>
            ) : (
              <div className="mt-4 grid gap-3">
                <input
                  value={modalDraft.title}
                  onChange={(event) => setModalDraft((prev) => ({ ...prev, title: event.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
                />
                <textarea
                  value={modalDraft.description}
                  onChange={(event) => setModalDraft((prev) => ({ ...prev, description: event.target.value }))}
                  className="min-h-28 rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
                />
                <input
                  value={modalDraft.tags}
                  onChange={(event) => setModalDraft((prev) => ({ ...prev, tags: event.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2 outline-none transition focus:border-blue-500"
                />
              </div>
            )}

            <div className="mt-5 flex flex-wrap gap-2">
              {!isEditMode ? (
                <button
                  onClick={() => setIsEditMode(true)}
                  type="button"
                  className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-medium text-white hover:bg-slate-800"
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={saveModalEdits}
                    type="button"
                    className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setIsEditMode(false)}
                    type="button"
                    className="rounded-lg bg-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300"
                  >
                    Cancel
                  </button>
                </>
              )}

              {selectedNote.section === SECTIONS.active ? (
                <>
                  <button
                    onClick={() => togglePin(selectedNote.id)}
                    type="button"
                    className="rounded-lg bg-amber-100 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-200"
                  >
                    {selectedNote.isPinned ? 'Unpin' : 'Pin'}
                  </button>
                  <button
                    onClick={() => moveToArchive(selectedNote.id)}
                    type="button"
                    className="rounded-lg bg-indigo-100 px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-200"
                  >
                    Archive
                  </button>
                  <button
                    onClick={() => moveToTrashFromSection(selectedNote.id, SECTIONS.active)}
                    type="button"
                    className="rounded-lg bg-rose-100 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-200"
                  >
                    Delete
                  </button>
                </>
              ) : null}

              {selectedNote.section === SECTIONS.archived ? (
                <>
                  <button
                    onClick={() => restoreFromArchive(selectedNote.id)}
                    type="button"
                    className="rounded-lg bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-200"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => moveToTrashFromSection(selectedNote.id, SECTIONS.archived)}
                    type="button"
                    className="rounded-lg bg-rose-100 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-200"
                  >
                    Delete
                  </button>
                </>
              ) : null}

              {selectedNote.section === SECTIONS.trash ? (
                <>
                  <button
                    onClick={() => restoreFromTrash(selectedNote.id)}
                    type="button"
                    className="rounded-lg bg-emerald-100 px-3 py-2 text-sm font-medium text-emerald-700 hover:bg-emerald-200"
                  >
                    Restore
                  </button>
                  <button
                    onClick={() => deleteForever(selectedNote.id)}
                    type="button"
                    className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-medium text-white hover:bg-rose-700"
                  >
                    Delete Forever
                  </button>
                </>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}

export default NotesApp
