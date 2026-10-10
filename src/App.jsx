import { useState, useEffect } from 'react'
import './App.css'
import Note from './components/Note'
import noteService from './services/notes'
import Notification from './components/Notification'
import Footer from './components/Footer'

function App(){
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState('some error happened...')

  useEffect(() => {
    noteService
    .getAll()
    .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])
  
//useEffect(function, how often its ran) empty arr = only first render

  function addNote(event){
      event.preventDefault()//to prevent the default action when clicking submit
      const noteObject = {
        content: newNote,
        important: Math.random() < 0.5,
        //id: String(notes.length+1) better to let server do it
      }

      noteService
      .create(noteObject)
      .then(returnedNote=>{
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })
  }

  function handleNoteChange(event){
    console.log(event.target.value)
    setNewNote(event.target.value)
  }

  const noteToShow = showAll ? notes : notes.filter(note=>note.important)

  function toggleImportanceOf(id){
    const note = notes.find((n) => n.id === id)
    const changedNote = { ...note, important: !note.important }

    noteService
    .update(id, changedNote)
    .then(returnedNote=>{
      setNotes(notes.map((note) => note.id !== id ? note : returnedNote))
    })
    .catch(error=> {
      setErrorMessage(
        `Note '${note.content}' was already removed from server`
      )
      setTimeout(()=>{
        setErrorMessage(null)
      },5000)
      setNotes(notes.filter(n => n.id !== id))
    })
  }

//key is needed
  return(
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      <div>
        <button onClick={()=>setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {noteToShow.map(note=><Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)}/>)}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange}/>
        <button type="submit">save</button>
      </form>
      <Footer/>
    </div>
  )
}

export default App
