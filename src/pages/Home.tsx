import { useEffect, useMemo, useState } from "react";

type Note = { id: number; title: string; body: string; updated: string };

const steps = ["Create the shell", "Make it installable", "Make it offline", "Test the boundary", "Deploy it"];

const starterNotes: Note[] = [
  { id: 1, title: "What makes a PWA?", body: "A manifest, a service worker, and a reliable user experience.", updated: "Today" },
];

export default function Home() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try { return JSON.parse(localStorage.getItem("notes") || "null") || starterNotes; }
    catch { return starterNotes; }
  });
  const [done, setDone] = useState<number[]>([]);
  const [online, setOnline] = useState(navigator.onLine);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const progress = useMemo(() => Math.round(done.length / steps.length * 100), [done]);

  useEffect(() => { localStorage.setItem("notes", JSON.stringify(notes)); }, [notes]);

  useEffect(() => {
    const on = () => setOnline(true); const off = () => setOnline(false);
    window.addEventListener("online", on); window.addEventListener("offline", off);
    return () => { window.removeEventListener("online", on); window.removeEventListener("offline", off); };
  }, []);

  function addNote() {
    if (!title.trim() || !body.trim()) return;
    setNotes([{ id: Date.now(), title: title.trim(), body: body.trim(), updated: "Just now" }, ...notes]);
    setTitle(""); setBody("");
  }

  return (
    <div className="shell">
      <header><strong>Offline Notes Lab</strong><span>{online ? "Online" : "Offline"}</span></header>
      <aside>
        <p>WORKSHOP MAP</p>
        {steps.map((step, index) => (
          <button key={step} onClick={() => setDone(done.includes(index) ? done.filter((x) => x !== index) : [...done, index])}>
            {done.includes(index) ? "✓ " : `${index + 1}. `}{step}
          </button>
        ))}
        <small>{progress}% complete</small>
      </aside>
      <main>
        <p className="eyebrow">FOUNDATION TRACK</p>
        <h1>Keep learning when the network leaves.</h1>
        <p className="lede">Save a note, refresh the page, then test the same experience with the network turned off.</p>
        <section className="columns">
          <div>
            <h2>Notes from the lab</h2>
            {notes.map((note) => (
              <article key={note.id}>
                <h3>{note.title}</h3>
                <p>{note.body}</p>
                <small>{note.updated}</small>
              </article>
            ))}
          </div>
          <form onSubmit={(event) => { event.preventDefault(); addNote(); }}>
            <h2>Write a note</h2>
            <label>Title<input value={title} onChange={(event) => setTitle(event.target.value)} /></label>
            <label>Observation<textarea value={body} onChange={(event) => setBody(event.target.value)} rows={5} /></label>
            <button type="submit">Save locally</button></form>
            </section>
            </main>
            </div>
  );
}