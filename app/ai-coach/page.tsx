"use client";

import { useEffect, useMemo, useState } from "react";
import { Exercise, WorkoutPlan } from "@/lib/types";
import { storage } from "@/lib/storage";
import { buildDays, ruleBasedPlan } from "@/lib/plan";
import Link from "next/link";

const QUESTIONS = ["age", "gender", "height", "weight", "level", "goal", "sessionsPerWeek", "injuries", "equipment"] as const;
type AnswerKey = (typeof QUESTIONS)[number];
type Answers = Record<AnswerKey, string>;

export default function AiCoachPage() {
  const [answers, setAnswers] = useState<Answers>({
    age: "",
    gender: "",
    height: "",
    weight: "",
    level: "beginner",
    goal: "strength",
    sessionsPerWeek: "3",
    injuries: "",
    equipment: "body weight",
  });
  const [step, setStep] = useState(0);
  const [library, setLibrary] = useState<Exercise[]>([]);
  const [generated, setGenerated] = useState<WorkoutPlan | null>(null);

  useEffect(() => {
    const fetchLibrary = async () => {
      const res = await fetch("/api/exercisedb/exercises");
      const data = await res.json();
      const items = Array.isArray(data) ? data : [];
      setLibrary(items.slice(0, 40));
    };
    fetchLibrary();
  }, []);

  const currentKey = QUESTIONS[step];
  const isLast = step === QUESTIONS.length - 1;

  const filteredLibrary = useMemo(() => {
    return library.filter((ex) => ex.equipment.toLowerCase().includes(answers.equipment.toLowerCase()));
  }, [answers.equipment, library]);

  const handleGenerate = () => {
    const athlete = storage.getUsers().find((u) => u.role === "athlete") || {
      id: `ath-${Date.now()}`,
      role: "athlete" as const,
      name: "AI Athlete",
    };
    if (!storage.getUsers().find((u) => u.id === athlete.id)) {
      storage.saveUsers([...storage.getUsers(), athlete]);
    }
    const plan = ruleBasedPlan(
      {
        ownerAthleteId: athlete.id,
        level: (answers.level as any) || "beginner",
        goal: answers.goal,
        sessionsPerWeek: Number(answers.sessionsPerWeek || 3),
        injuries: answers.injuries,
      },
      filteredLibrary.length ? filteredLibrary : library
    );
    storage.savePlans([...storage.getPlans(), plan]);
    setGenerated(plan);
  };

  return (
    <div className="card">
      <p className="badge">AI Smart Coach</p>
      <h2>Answer a few questions</h2>
      <p>We will create a balanced split using ExerciseDB, no external AI required.</p>

      <div className="card" style={{ marginTop: 12 }}>
        <p>
          Step {step + 1} of {QUESTIONS.length}
        </p>
        <label style={{ textTransform: "capitalize" }}>{currentKey}</label>
        {currentKey === "level" ? (
          <select value={answers.level} onChange={(e) => setAnswers({ ...answers, level: e.target.value })}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        ) : currentKey === "goal" ? (
          <select value={answers.goal} onChange={(e) => setAnswers({ ...answers, goal: e.target.value })}>
            <option value="strength">Strength</option>
            <option value="hypertrophy">Hypertrophy</option>
            <option value="endurance">Endurance</option>
          </select>
        ) : currentKey === "equipment" ? (
          <select value={answers.equipment} onChange={(e) => setAnswers({ ...answers, equipment: e.target.value })}>
            <option value="body weight">Body weight</option>
            <option value="dumbbell">Dumbbell</option>
            <option value="barbell">Barbell</option>
            <option value="band">Band</option>
          </select>
        ) : currentKey === "sessionsPerWeek" ? (
          <input
            type="number"
            min={1}
            max={7}
            value={answers.sessionsPerWeek}
            onChange={(e) => setAnswers({ ...answers, sessionsPerWeek: e.target.value })}
          />
        ) : (
          <input
            value={answers[currentKey]}
            onChange={(e) => setAnswers({ ...answers, [currentKey]: e.target.value })}
          />
        )}
        <div className="flex" style={{ marginTop: 12 }}>
          <button className="btn secondary" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
            Back
          </button>
          {!isLast ? (
            <button className="btn" onClick={() => setStep((s) => Math.min(QUESTIONS.length - 1, s + 1))}>
              Next
            </button>
          ) : (
            <button className="btn" onClick={handleGenerate}>
              Generate plan
            </button>
          )}
        </div>
      </div>

      {generated && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3>Plan ready</h3>
          <p>
            {generated.sessionsPerWeek} sessions/week for athlete {generated.ownerAthleteId}. Days: {" "}
            {generated.days.map((d) => d.title).join(", ")}
          </p>
          <Link className="btn" href="/athlete">
            View in dashboard
          </Link>
        </div>
      )}

      <div className="card" style={{ marginTop: 16 }}>
        <h4>Sample week preview</h4>
        <div className="grid">
          {buildDays(Number(answers.sessionsPerWeek || 3)).map((day) => (
            <div key={day.dayKey} className="badge">
              {day.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
