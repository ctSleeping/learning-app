import { useState } from 'react'
import LearningEntry from "./components/LearningEntry";
import type { LearningEntryData } from "./types/LearningEntryData";
import './App.css'

const firstEntry: LearningEntryData = {
  id: 1,
  topic: "React Components",
  date: "2026-10-21",
  learned: "Components help divide the UI into reusable parts.",
  confidence: 5,
  personalthoughts: "Seems interesting!",
};

const secondEntry: LearningEntryData = {
  id: 2,
  topic: "Birthday Plans",
  date: "2026-10-21",
  learned: "Liver will suffer",
  confidence: 5,
  personalthoughts: "This is where the personal thoughts will go I think to myself, yes",
};

const initialEntries: LearningEntryData[] = [firstEntry, secondEntry];

function App() {
  const studentName: string = "Christian Tiensuu";
  const [entries, setEntries] = useState<LearningEntryData[]>(initialEntries);
  const [serverEntries, setServerEntries] = useState<LearningEntryData[]>([]);
  const [loadError, setLoadError] = useState("");

  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [learned, setLearned] = useState("");
  const [confidence, setConfidence] = useState(1);
  const [personalthoughts, setPersonalthoughts] = useState("");

  async function loadServerEntries() {
    setLoadError("");
    try {
      const response = await fetch("http://localhost:3001/api/entries");
      if (!response.ok) throw new Error("Could not load entries");
      const data: LearningEntryData[] = await response.json();
      setServerEntries(data);
    } catch {
      setLoadError("Could not connect to the backend.");
    }
  }

  function handleAddEntry() {
    // Validointi
    if (topic.trim() === "" || learned.trim() === "") {
      alert("Topic and What I learned can't be empty.");
      return;
    }
    if (confidence < 1 || confidence > 5) {
      alert("Confidence must be between 1 and 5.");
      return;
    }

    // Uuden entryn luonti
    const newEntry: LearningEntryData = {
      id: Date.now(),
      topic: topic,
      date: date,
      learned: learned,
      confidence: confidence,
      personalthoughts: personalthoughts,
    };

    // Stateen lisäys
    setEntries((currentEntries) => [...currentEntries, newEntry]);

    // Formin resetointi
    setTopic("");
    setDate("");
    setLearned("");
    setConfidence(1);
    setPersonalthoughts("");
  }

  return (
    <main>
      <h1>My Learning</h1>
      <p>Fullstack Project</p>
      <p>Student: {studentName}</p>

      <form>
        <label htmlFor="topic">Topic</label>
        <input
          id="topic"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
        />
        <br></br>

        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
        <br></br>
        <br></br>

        <label htmlFor="learned">What I learned </label>
        <textarea
          id="learned"
          value={learned}
          onChange={(event) => setLearned(event.target.value)}
        />
        <br></br>

        <label htmlFor="confidence">Confidence </label>
        <input
          id="confidence"
          type="number"
          min={1}
          max={5}
          value={confidence}
          onChange={(event) => setConfidence(Number(event.target.value))}
        />
        <br></br>
        <br></br>

        <label htmlFor="personalthoughts">Personal thoughts </label>
        <textarea
          id="personalthoughts"
          value={personalthoughts}
          onChange={(event) => setPersonalthoughts(event.target.value)}
        />
        <br></br>
        <button type="button" onClick={handleAddEntry}>
          Add entry
        </button>
      </form>

      {entries.map((entry) => (
        <LearningEntry key={entry.id} entry={entry} />
      ))}

      <section>
        <h2>Entries from the backend</h2>
        <button type="button" onClick={loadServerEntries}>
          Load from backend
        </button>
        {loadError && <p>{loadError}</p>}
        <ul>
          {serverEntries.map((entry) => (
            <li key={entry.id}>{entry.topic}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}

export default App;