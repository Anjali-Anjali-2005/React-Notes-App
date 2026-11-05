
import { useEffect, useState } from 'react'
import './App.css'
import SearchBar from './components/SearchBar';
import ThemeToggle from './components/ThemeToggle';

function App() {
  // Store all notes
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('notes')
    return savedNotes ? JSON.parse(savedNotes) : []
  })

  // Store title and content entered by the user
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [searchQuery, setSearchQuery] = useState('');
  const [theme, setTheme] = useState(() => {
  return localStorage.getItem('theme') || 'light'
    })

  // Track which note is being edited
  const [editingId, setEditingId] = useState(null)

  // Save notes whenever the notes list changes
  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(notes))
  }, [notes])

  useEffect(() => {
  localStorage.setItem('theme', theme)
}, [theme])

  // Add a new note or update an existing one
  function handleSubmit(event) {
    event.preventDefault()

    if (!title.trim() || !content.trim()) {
      return
    }

    if (editingId !== null) {
      setNotes(notes.map(note =>
        note.id === editingId
          ? { ...note, title, content }
          : note
      ))
      setEditingId(null)
    } else {
      const newNote = {
        id: crypto.randomUUID(),
        title,
        content
      }

      setNotes([...notes, newNote])
    }

    setTitle('')
    setContent('')
  }

  // Load a note into the form for editing
  function handleEdit(note) {
    setTitle(note.title)
    setContent(note.content)
    setEditingId(note.id)
  }

  // Delete a note
  function handleDelete(id) {
    setNotes(notes.filter(note => note.id !== id))

    if (editingId === id) {
      setEditingId(null)
      setTitle('')
      setContent('')
    }
  }
  const filteredNotes = notes.filter(note =>
  note.title.toLowerCase().includes(searchQuery.toLowerCase())
 )

  return (
    <div className={`app ${theme}`}>
      <header>
         <h1>My Notes</h1>
        <p>Write down your thoughts and ideas.</p>
         <div className="header-actions">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />

          <ThemeToggle
            theme={theme}
            setTheme={setTheme}
          />
        </div>
      </header>

      <main>
        <section className="note-form">
          <h2>{editingId !== null ? 'Edit Note' : 'Create a Note'}</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Enter note title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <textarea
              placeholder="Write your note here..."
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows="4"
            />

            <button type="submit">
              {editingId !== null ? 'Update Note' : 'Add Note'}
            </button>
          </form>
        </section>

        <section className="notes-section">
          <h2>Your Notes ({filteredNotes.length})</h2>

          {filteredNotes.length === 0 ? (
              <p className="empty-message">
                {searchQuery
                  ? 'No matching notes found!'
                  : 'No notes yet. Create your first note!'}
              </p>
            ) : (
            <div className="notes-grid">
              {filteredNotes.map(note => (
                <article className="note-card" key={note.id}>
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>

                  <div className="note-actions">
                    <button onClick={() => handleEdit(note)}>
                      Edit
                    </button>

                    <button onClick={() => handleDelete(note.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default App
