"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { storage } from "@/lib/storage";
import { WorkoutPlan } from "@/lib/types";

export default function AthletePage() {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [athleteId, setAthleteId] = useState<string>("");
  const [coachId, setCoachId] = useState<string>("");

  useEffect(() => {
    setPlans(storage.getPlans());
    const savedAthlete = storage.getUsers().find((u) => u.role === "athlete");
    if (savedAthlete) setAthleteId(savedAthlete.id);
  }, []);

  const assignedPlan = useMemo(() => {
    if (!athleteId) return undefined;
    return plans.find((p) => p.ownerAthleteId === athleteId);
  }, [athleteId, plans]);

  const days = assignedPlan?.days || [];

  return (
    <div className="card">
      <h2>Athlete dashboard</h2>
      <p>Pick your coach or AI guide, then jump into today&apos;s session.</p>
      <label>Coach</label>
      <select value={coachId} onChange={(e) => setCoachId(e.target.value)}>
        <option value="">Select coach</option>
        <option value="coach-local">Coach Local</option>
        <option value="ai">AI Smart Coach</option>
      </select>

      {assignedPlan ? (
        <div style={{ marginTop: 16 }}>
          <p className="badge">Plan found — {assignedPlan.sessionsPerWeek} sessions/week</p>
          <ul className="list">
            {days.map((day) => (
              <li key={day.dayKey} className="card">
                <div className="flex" style={{ justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <h4>{day.title}</h4>
                    <p>{day.exercises.length} exercises</p>
                  </div>
                  <Link className="btn" href={`/workout/${day.dayKey}?planId=${assignedPlan.id}`}>
                    Start
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p style={{ marginTop: 16 }}>
          No plan yet. Ask your coach for an invite or try the {" "}
          <Link href="/ai-coach">AI Smart Coach</Link> to generate one.
        </p>
      )}
    </div>
  );
}
