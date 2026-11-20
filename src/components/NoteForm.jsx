import { useState } from "react"

const NoteForm = ({ noteObject }) => {
    const [newNote, setNewNote] = useState('')

    const addNote = (event) => {
      event.preventDefault()//to prevent the default action when clicking submit
      noteObject({
        content: newNote,
        important: true,
        //id: String(notes.length+1) better to let server do it
      })
      setNewNote('')}

  return (
    <div>
      <h2>Create a new note</h2>

      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={event => setNewNote(event.target.value)}
        />
        <button type="submit">save</button>
      </form>
    </div>
  )
}

export default NoteForm