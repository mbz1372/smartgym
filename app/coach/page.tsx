"use client";

import { useEffect, useMemo, useState } from "react";
import { Exercise, User, WorkoutDay, WorkoutPlan } from "@/lib/types";
import { storage } from "@/lib/storage";
import { buildDays } from "@/lib/plan";
import { ExerciseCard } from "@/components/ExerciseCard";

const defaultDays = buildDays(3);

export default function CoachPage() {
  const [athletes, setAthletes] = useState<User[]>([]);
  const [selectedAthlete, setSelectedAthlete] = useState<string>("");
  const [sessionsPerWeek, setSessionsPerWeek] = useState(3);
  const [days, setDays] = useState<WorkoutDay[]>(defaultDays);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [query, setQuery] = useState("");
  const [bodyPart, setBodyPart] = useState("");
  const [equipment, setEquipment] = useState("");
  const [inviteToken, setInviteToken] = useState<string>("");

  useEffect(() => {
    setAthletes(storage.getUsers().filter((u) => u.role === "athlete"));
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const loadExercises = async () => {
      try {
        const params = new URLSearchParams();
        if (bodyPart) params.append("bodyPart", bodyPart);
        if (equipment) params.append("equipment", equipment);
        const res = await fetch(`/api/exercisedb/exercises?${params.toString()}`, { signal: controller.signal });
        const json = await res.json();
        setExercises(Array.isArray(json) ? json : []);
      } catch (e) {
        console.error(e);
      }
    };
    loadExercises();
    return () => controller.abort();
  }, [bodyPart, equipment]);

  const filtered = useMemo(() => {
    return exercises.filter((ex) => ex.name.toLowerCase().includes(query.toLowerCase()));
  }, [exercises, query]);

  const handleAddExercise = (exercise: Exercise, dayKey: string) => {
    setDays((prev) =>
      prev.map((day) =>
        day.dayKey === dayKey
          ? {
              ...day,
              exercises: [
                ...day.exercises,
                { exerciseId: exercise.id, sets: 3, reps: 10, restSec: 90 },
              ],
            }
          : day
      )
    );
  };

  const handleSavePlan = () => {
    if (!selectedAthlete) return alert("Select an athlete first");
    const plan: WorkoutPlan = {
      id: `plan-${Date.now()}`,
      ownerAthleteId: selectedAthlete,
      createdBy: "coach",
      sessionsPerWeek,
      days,
    };
    const existing = storage.getPlans();
    storage.savePlans([...existing, plan]);
    alert("Plan saved locally and assigned to athlete.");
  };

  const handleInvite = () => {
    const token = Math.random().toString(36).slice(2, 8);
    setInviteToken(token);
  };

  const handleCreateAthlete = () => {
    const name = prompt("Athlete name?");
    if (!name) return;
    const newAthlete: User = { id: `ath-${Date.now()}`, role: "athlete", name };
    const updated = [...athletes, newAthlete];
    setAthletes(updated);
    storage.saveUsers([...storage.getUsers(), newAthlete]);
  };

  return (
    <div className="grid">
      <div className="card">
        <h2>Coach dashboard</h2>
        <p>Create invites and assign workout plans.</p>
        <div className="flex">
          <button className="btn" onClick={handleInvite}>Create athlete invite</button>
          <button className="btn secondary" onClick={handleCreateAthlete}>Add athlete</button>
        </div>
        {inviteToken && <p className="badge">Invite token: {inviteToken}</p>}

        <h3>Select athlete</h3>
        <select value={selectedAthlete} onChange={(e) => setSelectedAthlete(e.target.value)}>
          <option value="">Choose athlete</option>
          {athletes.map((a) => (
            <option key={a.id} value={a.id}>
              {a.name}
            </option>
          ))}
        </select>

        <h3 style={{ marginTop: 16 }}>Plan builder</h3>
        <label>Sessions per week</label>
        <input
          type="number"
          min={1}
          max={7}
          value={sessionsPerWeek}
          onChange={(e) => {
            const val = Number(e.target.value);
            setSessionsPerWeek(val);
            setDays(buildDays(val));
          }}
        />
        <div className="grid" style={{ marginTop: 12 }}>
          {days.map((day) => (
            <div key={day.dayKey} className="card">
              <h4>{day.title}</h4>
              <ul className="list">
                {day.exercises.map((ex, idx) => (
                  <li key={`${ex.exerciseId}-${idx}`} className="badge">
                    {ex.exerciseId} — {ex.sets}x{ex.reps} rest {ex.restSec}s
                  </li>
                ))}
              </ul>
              <div className="flex">
                {filtered.slice(0, 3).map((ex) => (
                  <button
                    key={ex.id}
                    className="btn secondary"
                    onClick={() => handleAddExercise(ex, day.dayKey)}
                  >
                    Quick add {ex.name}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button className="btn" style={{ marginTop: 12 }} onClick={handleSavePlan}>
          Save and assign plan
        </button>
      </div>

      <div className="card">
        <h3>Search ExerciseDB</h3>
        <div className="flex">
          <input placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
          <select value={bodyPart} onChange={(e) => setBodyPart(e.target.value)}>
            <option value="">Body part</option>
            <option value="back">Back</option>
            <option value="chest">Chest</option>
            <option value="legs">Legs</option>
            <option value="upper arms">Upper arms</option>
          </select>
          <select value={equipment} onChange={(e) => setEquipment(e.target.value)}>
            <option value="">Equipment</option>
            <option value="barbell">Barbell</option>
            <option value="dumbbell">Dumbbell</option>
            <option value="body weight">Body weight</option>
          </select>
        </div>
        <div className="grid" style={{ marginTop: 12 }}>
          {filtered.length === 0 && <div className="skeleton" aria-label="Loading" />}
          {filtered.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} onSelect={(exercise) => handleAddExercise(exercise, days[0].dayKey)} />
          ))}
        </div>
      </div>
    </div>
  );
}
