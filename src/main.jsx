import { StrictMode } from 'react'
import {createRoot} from 'react-dom/client'
import './index copy.css'
import App from './App.jsx'
import axios, { create } from 'axios'


createRoot(document.getElementById('root')).render(<App/>)


//success
axios.get('http://localhost:3001/notes').then(response=>{
  const notes = response.data
})

const promise2 = axios.get('http://localhost:3001/foobar') //failed
console.log(promise2)