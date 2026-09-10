import { useEffect, useMemo, useState } from "react";

type Note = {
  id: number;
  title: string;
  body: string;
  updated: string;
};

const steps = [
  "Create the shell",
  "Make it installable",
  "Make it offline",
  "Test the boundary",
  "Deploy it",
];

const starterNotes: Note[] = [
  {
    id: 1,
    title: "What makes a PWA?",
    body: "A manifest, a service worker, and a reliable user experience.",
    updated: "Today",
  },
];

export default function Home() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const saved = localStorage.getItem("offline-notes");

    if (!saved) {
      return starterNotes;
    }

    try {
      return JSON.parse(saved);
    } catch {
      return starterNotes;
    }
  });

  const [done, setDone] = useState<boolean[]>(
    new Array(steps.length).fill(false)
  );

  const [online, setOnline] = useState(navigator.onLine);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const progress = useMemo(() => {
    const completed = done.filter(Boolean).length;
    return Math.round((completed / steps.length) * 100);
  }, [done]);

  useEffect(() => {
    localStorage.setItem("offline-notes", JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    const handleOnline = () => setOnline(true);
    const handleOffline = () => setOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  function toggleStep(index: number) {
    setDone((current) =>
      current.map((value, stepIndex) =>
        stepIndex === index ? !value : value
      )
    );
  }

  function addNote() {
    if (!title.trim() || !body.trim()) {
      return;
    }

    const newNote: Note = {
      id: Date.now(),
      title: title.trim(),
      body: body.trim(),
      updated: "Just now",
    };

    setNotes((current) => [newNote, ...current]);

    setTitle("");
    setBody("");
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">PWA WORKSHOP</p>
          <h1>Offline Notes Lab</h1>
          <p className="sidebar-copy">
            Build a small app that keeps working when the network disappears.
            Project By: Otunubi Abraham Afolabi 
            Matric Number: 2024/1/95584CP
            Department: Computer Engineering 
          </p>
        </div>

        <div className="progress-card">
          <div className="progress-row">
            <span>Progress</span>
            <strong>{progress}%</strong>
          </div>

          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="steps">
          {steps.map((step, index) => (
            <button
              key={step}
              className={`step ${done[index] ? "done" : ""}`}
              onClick={() => toggleStep(index)}
            >
              <span className="step-number">{index + 1}</span>
              <span>{step}</span>
            </button>
          ))}
        </div>
      </aside>

      <section className="content">
        <header className="topbar">
          <span className={`status ${online ? "online" : "offline"}`}>
            <span className="status-dot" />
            {online ? "Online" : "Offline"}
          </span>
        </header>

        <div className="hero">
          <p className="eyebrow">YOUR LOCAL-FIRST WORKSPACE</p>
          <h2>Write it down. Keep it available.</h2>
          <p>
            Create notes, refresh the page, then test what happens when the
            network disappears.
          </p>
        </div>

        <div className="notes-layout">
          <section className="notes-list">
            <div className="section-heading">
              <div>
                <p className="eyebrow">YOUR NOTES</p>
                <h3>Saved locally</h3>
              </div>

              <span>{notes.length} notes</span>
            </div>

            {notes.map((note) => (
              <article className="note-card" key={note.id}>
                <div className="note-meta">
                  <span>{note.updated}</span>
                </div>

                <h4>{note.title}</h4>
                <p>{note.body}</p>
              </article>
            ))}
          </section>

          <section className="write-card">
            <p className="eyebrow">NEW NOTE</p>
            <h3>Write something</h3>

            <label htmlFor="title">Title</label>
            <input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="A quick thought"
            />

            <label htmlFor="body">Note</label>
            <textarea
              id="body"
              value={body}
              onChange={(event) => setBody(event.target.value)}
              placeholder="Write your note here..."
              rows={7}
            />

            <button className="save-button" onClick={addNote}>
              Save note
            </button>
          </section>
        </div>
      </section>
    </main>
  );
}
