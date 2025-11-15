import { NextResponse } from "next/server";

type Mode = "productivity" | "health" | "both";

export const dynamic = "force-dynamic";

function fallbackPlan(prompt: string, mode: Mode) {
  const now = new Date();
  const hour = now.getHours();
  const timeHint = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
  const wantsFocus = /focus|deadline|deliver|write|code|study/i.test(prompt);
  const lowEnergy = /tired|fatigue|exhaust|sleepy|hangover|burnout|overwhelmed/i.test(prompt);
  const stressed = /stress|anxiety|panic|worry|overload/i.test(prompt);

  const focus = [
    wantsFocus ? "One deep-work block (50-80m) on the most important task" : "Identify and choose the single most impactful task",
    "Batch shallow tasks into a 30-minute block",
    "Schedule a strict stop-time and short review",
  ];

  const steps = [
    { title: "Define success for today", details: "Write 1-3 outcomes you will achieve" },
    { title: "Timebox work", details: `Protect a ${wantsFocus ? "80" : "50"}m focus block this ${timeHint}` },
    { title: "Reduce friction", details: "Close distractions, prepare needed resources" },
  ];

  const habits = [
    { title: "Movement snack", details: "5?10 min walk or mobility between blocks" },
    { title: "Hydration", details: "Drink water at the start of each block" },
  ];

  const wellness = [
    { title: lowEnergy ? "Light exposure" : "Posture check", details: lowEnergy ? "2?5 min bright light or outdoor view" : "Relax shoulders, breathe slow" },
    { title: stressed ? "Physiological sigh" : "Box breathing", details: stressed ? "2?3 rounds to downshift stress" : "4?4?4?4 for 1?2 min" },
  ];

  const note = !process.env.OPENAI_API_KEY
    ? "AI key not set. Using heuristics for suggestions."
    : undefined;

  if (mode === "productivity") return { focus, steps, habits: [], wellness: [], note };
  if (mode === "health") return { focus: [], steps: [], habits, wellness, note };
  return { focus, steps, habits, wellness, note };
}

async function openAIPlan(prompt: string, mode: Mode) {
  const system = `You are an expert planner that blends productivity and health. Respond in concise JSON with keys: focus (string[]), steps (array of {title, details}), habits (array of {title, details}), wellness (array of {title, details}). Keep it practical for a single day. Avoid extra commentary.`;
  const content = `Mode: ${mode}. Context: ${prompt}`;

  const r = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content },
      ],
      temperature: 0.7,
      max_tokens: 600,
    }),
  });

  if (!r.ok) {
    const t = await r.text();
    throw new Error(`OpenAI error: ${r.status} ${t}`);
  }
  const json = await r.json();
  const text = json.choices?.[0]?.message?.content || "{}";
  try {
    const parsed = JSON.parse(text);
    return parsed;
  } catch {
    // Try to extract JSON substring
    const match = text.match(/\{[\s\S]*\}/);
    if (match) return JSON.parse(match[0]);
    throw new Error("Failed to parse AI response");
  }
}

export async function POST(req: Request) {
  try {
    const { prompt, mode } = await req.json();
    const m: Mode = ["productivity", "health", "both"].includes(mode) ? mode : "both";
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Invalid prompt" }, { status: 400 });
    }

    if (process.env.OPENAI_API_KEY) {
      try {
        const plan = await openAIPlan(prompt, m);
        return NextResponse.json(plan);
      } catch (e) {
        // fall through to heuristic
        const plan = fallbackPlan(prompt, m);
        return NextResponse.json(plan);
      }
    }

    const plan = fallbackPlan(prompt, m);
    return NextResponse.json(plan);
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || "Server error" }, { status: 500 });
  }
}
