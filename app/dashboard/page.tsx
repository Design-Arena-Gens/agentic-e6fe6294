"use client";
import Header from "@/components/Header";
import AIPlanner from "@/components/AIPlanner";
import TaskManager from "@/components/TaskManager";
import HabitTracker from "@/components/HabitTracker";
import WellnessCheck from "@/components/WellnessCheck";

export default function DashboardPage() {
  return (
    <>
      <Header />
      <div className="grid-2" style={{ marginTop: 12 }}>
        <div className="card">
          <div className="section-title"><h2 style={{ margin: 0 }}>AI Planner</h2><span className="badge">Ideas + Focus</span></div>
          <AIPlanner />
        </div>
        <div className="card">
          <div className="section-title"><h2 style={{ margin: 0 }}>Wellness Check</h2><span className="badge">Daily</span></div>
          <WellnessCheck />
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 20 }}>
        <div className="card">
          <div className="section-title"><h2 style={{ margin: 0 }}>Tasks</h2><span className="badge">Local</span></div>
          <TaskManager />
        </div>
        <div className="card">
          <div className="section-title"><h2 style={{ margin: 0 }}>Habits</h2><span className="badge">Streaks</span></div>
          <HabitTracker />
        </div>
      </div>
    </>
  );
}
