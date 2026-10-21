import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import LearningEntry from "./components/LearningEntry";
import './App.css'

function App() {
  const studentName: string = "Christian Tiensuu";

  return (
    <main>
      <h1>My Learning</h1>
      <p>Fullstack Project</p>
      <p>Student: {studentName}</p>

      <LearningEntry
    topic="React Components"
    date="21.10.2026"
    learned="Components help divide the UI into reusable parts."
    confidence={5}
    personalthoughts="Seems interesting!"
    />

    <LearningEntry
    topic="Birthday Plans"
    date="21.10.2026"
    learned="Liver will suffer"
    confidence={6}
    personalthoughts="This is where the personal thoughts will go I think to myself, yes"
    />
    </main>

    
    
    
  );
}

export default App;