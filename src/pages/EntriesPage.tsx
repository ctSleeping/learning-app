import { useEffect, useState } from "react";
import LearningEntry from "../components/LearningEntry";
import type { LearningEntryData } from "../types/LearningEntryData";

const API_URL = "http://localhost:3001/api/entries";

export default function EntriesPage() {
  const [serverEntries, setServerEntries] = useState<LearningEntryData[]>([]);
  const [loadError, setLoadError] = useState("");

  const [topic, setTopic] = useState("");
  const [date, setDate] = useState("");
  const [learned, setLearned] = useState("");
  const [confidence, setConfidence] = useState(1);
  const [personalthoughts, setPersonalthoughts] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadInitialEntries() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error("Could not load entries");
        const data: LearningEntryData[] = await response.json();
        if (!ignore) setServerEntries(data);
      } catch {
        if (!ignore) setLoadError("Could not load entries from the backend.");
      }
    }

    void loadInitialEntries();
    return () => { ignore = true; };
  }, []);

  async function loadServerEntries() {
    setLoadError("");
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Could not load entries");
      const data: LearningEntryData[] = await response.json();
      setServerEntries(data);
    } catch (error) {
      setLoadError("Could not load entries from the backend.");
      throw error;
    }
  }

  async function handleAddEntry() {
    setMessage("");

    // Validointi
    if (topic.trim() === "" || learned.trim() === "") {
      alert("Topic and What I learned can't be empty.");
      return;
    }
    if (date === "") {
      alert("Please choose a date.");
      return;
    }
    if (confidence < 1 || confidence > 5) {
      alert("Confidence must be between 1 and 5.");
      return;
    }

    const newEntry = {
      topic,
      date,
      learned,
      confidence: Number(confidence),
      personalthoughts,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newEntry),
      });
      if (!response.ok) throw new Error("Could not save entry");
    } catch {
      setMessage("Saving failed. Please try again.");
      return;
    }

    // Formin resetointi
    setTopic("");
    setDate("");
    setLearned("");
    setConfidence(1);
    setPersonalthoughts("");

    try {
      await loadServerEntries();
      setMessage("Entry saved successfully.");
    } catch {
      setMessage("Entry was saved, but the list could not be refreshed.");
    }
  }

  return (
    <main>
      <h1>Learning Entries</h1>

      <form>
        <label htmlFor="topic">Topic</label>
        <input
          id="topic"
          value={topic}
          onChange={(event) => setTopic(event.target.value)}
        />
        <br />

        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          value={date}
          onChange={(event) => setDate(event.target.value)}
        />
        <br />
        <br />

        <label htmlFor="learned">What I learned </label>
        <textarea
          id="learned"
          value={learned}
          onChange={(event) => setLearned(event.target.value)}
        />
        <br />

        <label htmlFor="confidence">Confidence </label>
        <input
          id="confidence"
          type="number"
          min={1}
          max={5}
          value={confidence}
          onChange={(event) => setConfidence(Number(event.target.value))}
        />
        <br />
        <br />

        <label htmlFor="personalthoughts">Personal thoughts </label>
        <textarea
          id="personalthoughts"
          value={personalthoughts}
          onChange={(event) => setPersonalthoughts(event.target.value)}
        />
        <br />
        <button type="button" onClick={handleAddEntry}>
          Add entry
        </button>
        {message && <p>{message}</p>}
      </form>

      <section>
        <h2>Entries from the backend</h2>
        <button
          type="button"
          onClick={() => { void loadServerEntries().catch(() => {}); }}
        >
          Load from backend
        </button>
        {loadError && <p>{loadError}</p>}

        {serverEntries.map((entry) => (
          <LearningEntry key={entry.id} entry={entry} />
        ))}
      </section>
    </main>
  );
}