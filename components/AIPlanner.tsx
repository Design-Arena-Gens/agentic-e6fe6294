"use client";
import { useState } from "react";

type Mode = "productivity" | "health" | "both";

type PlanItem = { title: string; details?: string };

export default function AIPlanner() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<Mode>("both");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    focus: string[];
    steps: PlanItem[];
    habits: PlanItem[];
    wellness: PlanItem[];
    note?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: input, mode }),
      });
      if (!res.ok) throw new Error("Failed to fetch plan");
      const data = await res.json();
      setResult(data);
    } catch (e: any) {
      setError(e.message || "Error generating plan");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div style={{ display: "grid", gap: 8 }}>
        <textarea
          className="input"
          rows={4}
          placeholder="Describe your day, goals, constraints, and wellness context..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <select className="input" style={{ maxWidth: 220 }} value={mode} onChange={(e) => setMode(e.target.value as Mode)}>
            <option value="both">Productivity + Health</option>
            <option value="productivity">Productivity</option>
            <option value="health">Health</option>
          </select>
          <button className="btn" onClick={generate} disabled={loading || !input.trim()}>
            {loading ? "Generating..." : "Generate Plan"}
          </button>
        </div>
      </div>

      {error && <div style={{ color: "#ff99aa", marginTop: 10 }}>{error}</div>}

      {result && (
        <div style={{ marginTop: 14, display: "grid", gap: 10 }}>
          <div className="card">
            <div className="small">Focus</div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {result.focus.map((f, i) => <li key={i}>{f}</li>)}
            </ul>
          </div>
          <div className="grid-2">
            <div className="card">
              <div className="small">Steps</div>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {result.steps.map((s, i) => <li key={i}><strong>{s.title}</strong>{s.details ? ` ? ${s.details}` : ""}</li>)}
              </ul>
            </div>
            <div className="card">
              <div className="small">Habits / Wellness</div>
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                {result.habits.map((s, i) => <li key={i}><strong>{s.title}</strong>{s.details ? ` ? ${s.details}` : ""}</li>)}
                {result.wellness.map((s, i) => <li key={`w-${i}`}><strong>{s.title}</strong>{s.details ? ` ? ${s.details}` : ""}</li>)}
              </ul>
            </div>
          </div>
          {result.note && <div className="small">Note: {result.note}</div>}
        </div>
      )}
    </div>
  );
}
