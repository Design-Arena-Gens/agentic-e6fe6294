"use client";
import { useEffect, useMemo, useState } from "react";

type Habit = { id: string; name: string; days: Record<string, boolean> };
const KEY = "agentic.habits.v1";

function dayKey(d = new Date()) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${dd}`;
}

export default function HabitTracker() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [name, setName] = useState("");
  const today = dayKey();

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setHabits(JSON.parse(raw));
  }, []);
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(habits));
  }, [habits]);

  function addHabit() {
    if (!name.trim()) return;
    setHabits([{ id: crypto.randomUUID(), name: name.trim(), days: {} }, ...habits]);
    setName("");
  }
  function toggle(habitId: string, key: string) {
    setHabits(habits.map(h => h.id === habitId ? { ...h, days: { ...h.days, [key]: !h.days[key] } } : h));
  }
  function remove(habitId: string) {
    setHabits(habits.filter(h => h.id !== habitId));
  }

  const streaks = useMemo(() => habits.map(h => {
    // compute simple recent streak up to today
    let streak = 0;
    const date = new Date();
    for (let i = 0; i < 30; i++) {
      const k = dayKey(new Date(date.getFullYear(), date.getMonth(), date.getDate() - i));
      if (h.days[k]) streak++; else break;
    }
    return [h.id, streak] as const;
  }), [habits]);

  return (
    <div>
      <div style={{ display: "flex", gap: 8 }}>
        <input className="input" placeholder="Add a habit..." value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addHabit()} />
        <button className="btn" onClick={addHabit}>Add</button>
      </div>
      <div className="list" style={{ marginTop: 12 }}>
        {habits.map(h => (
          <div key={h.id} className="list-item" style={{ alignItems: 'stretch' }}>
            <div style={{ display: 'grid', gap: 6, flex: 1 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <strong>{h.name}</strong>
                <span className="badge">Streak: {streaks.find(s => s[0] === h.id)?.[1] ?? 0}</span>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
                {Array.from({ length: 7 }).map((_, i) => {
                  const k = dayKey(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() - i));
                  const checked = !!h.days[k];
                  return (
                    <div key={k} className={`checkbox ${checked ? 'checked' : ''}`} onClick={() => toggle(h.id, k)} />
                  );
                })}
              </div>
            </div>
            <button className="btn secondary" onClick={() => remove(h.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
