"use client";
import { useEffect, useMemo, useState } from "react";

type Task = { id: string; title: string; done: boolean; due?: string };
const KEY = "agentic.tasks.v1";

export default function TaskManager() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [text, setText] = useState("");

  useEffect(() => {
    const raw = localStorage.getItem(KEY);
    if (raw) setTasks(JSON.parse(raw));
  }, []);
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(tasks));
  }, [tasks]);

  function addTask() {
    if (!text.trim()) return;
    setTasks([{ id: crypto.randomUUID(), title: text.trim(), done: false }, ...tasks]);
    setText("");
  }
  function toggle(id: string) {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t));
  }
  function remove(id: string) {
    setTasks(tasks.filter(t => t.id !== id));
  }

  const percent = useMemo(() => {
    if (!tasks.length) return 0;
    return Math.round(100 * tasks.filter(t => t.done).length / tasks.length);
  }, [tasks]);

  return (
    <div>
      <div className="progress" style={{ marginBottom: 10 }}><div style={{ width: `${percent}%` }} /></div>
      <div className="small" style={{ marginBottom: 10 }}>{percent}% complete</div>
      <div style={{ display: "flex", gap: 8 }}>
        <input className="input" placeholder="Add a task..." value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addTask()} />
        <button className="btn" onClick={addTask}>Add</button>
      </div>
      <div className="list" style={{ marginTop: 12 }}>
        {tasks.map(t => (
          <div key={t.id} className="list-item">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div className={`checkbox ${t.done ? 'checked' : ''}`} onClick={() => toggle(t.id)}>
                {t.done ? '?' : ''}
              </div>
              <div style={{ textDecoration: t.done ? 'line-through' : 'none', color: t.done ? '#9aa3c3' : undefined }}>{t.title}</div>
            </div>
            <button className="btn secondary" onClick={() => remove(t.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
