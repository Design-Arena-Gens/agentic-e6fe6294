"use client";
import { useEffect, useState } from "react";

const KEY = "agentic.wellness.v1";

type Entry = { date: string; mood: number; energy: number; sleep: number; note?: string };

function dayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export default function WellnessCheck() {
  const [mood, setMood] = useState(7);
  const [energy, setEnergy] = useState(7);
  const [sleep, setSleep] = useState(7);
  const [note, setNote] = useState("");
  const [entries, setEntries] = useState<Entry[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setEntries(JSON.parse(raw));
  }, []);
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(entries)); }, [entries]);

  function save() {
    const date = dayKey();
    const rest = entries.filter(e => e.date !== date);
    setEntries([{ date, mood, energy, sleep, note: note.trim() || undefined }, ...rest]);
  }

  const today = entries.find(e => e.date === dayKey());
  const avgMood = Math.round((entries.reduce((a, e) => a + e.mood, 0) / Math.max(1, entries.length)) * 10) / 10;

  return (
    <div>
      <div className="grid-2">
        <div>
          <label className="small">Mood: {mood}/10</label>
          <input type="range" min={1} max={10} value={mood} onChange={(e) => setMood(parseInt(e.target.value))} style={{ width: '100%' }} />
          <label className="small">Energy: {energy}/10</label>
          <input type="range" min={1} max={10} value={energy} onChange={(e) => setEnergy(parseInt(e.target.value))} style={{ width: '100%' }} />
          <label className="small">Sleep: {sleep}/10</label>
          <input type="range" min={1} max={10} value={sleep} onChange={(e) => setSleep(parseInt(e.target.value))} style={{ width: '100%' }} />
        </div>
        <div>
          <textarea className="input" rows={5} placeholder="Notes, stressors, wins..." value={note} onChange={(e) => setNote(e.target.value)} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
        <button className="btn" onClick={save}>Save Today</button>
        <span className="badge">Avg mood: {isNaN(avgMood) ? 0 : avgMood}</span>
        {today && <span className="badge">Saved for today</span>}
      </div>
      <div className="list" style={{ marginTop: 12 }}>
        {entries.slice(0, 7).map(e => (
          <div key={e.date} className="list-item">
            <div><strong>{e.date}</strong> ? Mood {e.mood}, Energy {e.energy}, Sleep {e.sleep}</div>
            {e.note && <div className="small">{e.note}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
