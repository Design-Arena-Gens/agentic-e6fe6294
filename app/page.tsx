import Header from "@/components/Header";
import Link from "next/link";
import "./globals.css";

export default function Page() {
  return (
    <>
      <Header />
      <section className="hero">
        <div className="card">
          <h1 style={{ fontSize: 42, margin: 0 }}>Take Control of Your Time and Health</h1>
          <p className="muted" style={{ marginTop: 8 }}>
            One place to plan your day, build resilient habits, and improve your wellbeing. AI-guided recommendations meet actionable tools.
          </p>
          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <Link href="/dashboard" className="btn">Open Dashboard</Link>
            <a className="btn secondary" href="#features">Explore Features</a>
          </div>
          <div className="grid" style={{ marginTop: 18 }}>
            <div className="card">
              <div className="small">Today Focus</div>
              <div className="kpi">3 Key Tasks</div>
              <div className="progress" style={{ marginTop: 10 }}><div style={{ width: "40%" }} /></div>
            </div>
            <div className="card">
              <div className="small">Habit Consistency</div>
              <div className="kpi">72%</div>
              <div className="progress" style={{ marginTop: 10 }}><div style={{ width: "72%" }} /></div>
            </div>
            <div className="card">
              <div className="small">Wellness Score</div>
              <div className="kpi">7.8 / 10</div>
              <div className="progress" style={{ marginTop: 10 }}><div style={{ width: "78%" }} /></div>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="small">How it works</div>
          <ul className="small" style={{ lineHeight: 1.6 }}>
            <li>Plan your day with AI assistance</li>
            <li>Track habits and daily wellness signals</li>
            <li>Review trends and adapt your routine</li>
          </ul>
        </div>
      </section>

      <section id="features" className="grid" style={{ marginTop: 28 }}>
        <div className="card"><h2>AI Planner</h2><div className="muted">Turn goals into a focused plan with flexible prompts.</div></div>
        <div className="card"><h2>Task Manager</h2><div className="muted">Lightweight, fast, and synced to your device.</div></div>
        <div className="card"><h2>Habit Tracker</h2><div className="muted">Build streaks that stick with clear feedback.</div></div>
      </section>

      <div className="footer">? {new Date().getFullYear()} Agentic. All rights reserved.</div>
    </>
  );
}
