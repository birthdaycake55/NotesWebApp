import { useState, useEffect, useRef } from 'react'
import './App.css'
import Note from './components/Note'
import noteService from './services/notes'
import Notification from './components/Notification'
import Footer from './components/Footer'
import loginService from './services/login'
import LoginForm from './components/Login'
import Button from './components/Button'
import Togglable from './components/Toggable'
import NoteForm from './components/NoteForm'

//add logout func, move login stuff to components, decide between async/await or .then
//remove notes when not logged in, change login form like noteform

function App(){
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const noteFormRef = useRef()

  useEffect(() => {
    noteService
    .getAll()
    .then(initialNotes => {
        setNotes(initialNotes)
      })
  }, [])

  useEffect(()=>{
    const loggedUserJSON = window.localStorage.getItem('loggedNoteappUser')
    if (loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      noteService.setToken(user.token)
    }
  }, [])
  
//useEffect(function, how often its ran) empty arr = only first render

  const addNote = (noteObject) => {
    noteFormRef.current.toggleVisibility() //when new note is added, toggles visibility of form
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

  const handleLogin = async event => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      setUser(user)
      noteService.setToken(user.token)
      window.localStorage.setItem(
        'loggedNoteappUser', JSON.stringify(user)
      )
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  //input placed in label for accessibility screen readers
  const loginForm = () => (
    <Togglable buttonLabel='login'>
          <LoginForm
            handleSubmit={handleLogin}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            username={username}
            password={password}
          />
    </Togglable>
  )

  const noteForm = () => ( //ref allows visibility to be toggled
    <Togglable buttonLabel='new note' ref={noteFormRef}> 
      <NoteForm noteObject={addNote}/>
    </Togglable>
  )

  const handleLogout = async event => {
    event.preventDefault
    try{
      setUser(null)
      noteService.setToken(null)
      window.localStorage.removeItem('loggedNoteappUser')
    } catch {
      setSetting('error')
      setMessage('Can not log out. Try again later.')
      setTimeout(() => {
        setSetting(null)
        setMessage(null)
      }, 5000)
    }
  }

//key is needed
  return(
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>
      
      {!user && loginForm()}
      {user && (
        <div>
          <p>{user.name} logged in</p>
          {noteForm()}
        </div>
      )}
      
      <div>
        <button onClick={()=>setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {noteToShow.map(note=><Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)}/>)}
      </ul>
      <Button func={handleLogout} text={'Logout'}/>
      <Footer/>
    </div>
  )
}

export default App
