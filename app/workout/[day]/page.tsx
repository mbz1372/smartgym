"use client";

import { useSearchParams, useParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { storage } from "@/lib/storage";
import { Completion, Exercise, WorkoutPlan } from "@/lib/types";

export default function WorkoutDayPage() {
  const params = useParams<{ day: string }>();
  const searchParams = useSearchParams();
  const planId = searchParams.get("planId");
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [library, setLibrary] = useState<Exercise[]>([]);
  const [completions, setCompletions] = useState<Completion[]>([]);

  useEffect(() => {
    setCompletions(storage.getCompletions());
    const plans = storage.getPlans();
    const found = plans.find((p) => p.id === planId) || null;
    setPlan(found);
    const load = async () => {
      const res = await fetch("/api/exercisedb/exercises");
      const data = await res.json();
      setLibrary(Array.isArray(data) ? data : []);
    };
    load();
  }, [planId]);

  const day = useMemo(() => plan?.days.find((d) => d.dayKey === params.day), [plan, params.day]);

  const isCompleted = (exerciseId: string) =>
    completions.some((c) => c.planId === planId && c.dayKey === params.day && c.exerciseId === exerciseId);

  const toggleCompletion = (exerciseId: string) => {
    const existing = storage.getCompletions();
    if (isCompleted(exerciseId)) {
      const filtered = existing.filter(
        (c) => !(c.planId === planId && c.dayKey === params.day && c.exerciseId === exerciseId)
      );
      storage.saveCompletions(filtered);
      setCompletions(filtered);
    } else {
      const updated: Completion[] = [
        ...existing,
        { planId: planId || "", dayKey: params.day, exerciseId, completedAt: new Date().toISOString() },
      ];
      storage.saveCompletions(updated);
      setCompletions(updated);
    }
  };

  const lookupExercise = (id: string) => library.find((ex) => ex.id === id);

  if (!day) return <p>No session found.</p>;

  const completedCount = day.exercises.filter((ex) => isCompleted(ex.exerciseId)).length;

  return (
    <div className="card">
      <h2>
        {day.title} — {completedCount}/{day.exercises.length} done
      </h2>
      <div className="grid">
        {day.exercises.map((item) => {
          const details = lookupExercise(item.exerciseId);
          return (
            <div key={item.exerciseId} className="card">
              {details ? (
                <div style={{ position: "relative", width: "100%", height: 200 }}>
                  <Image
                    src={details.gifUrl}
                    alt={details.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    style={{ objectFit: "cover" }}
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="skeleton" />
              )}
              <h4>{details?.name || item.exerciseId}</h4>
              <p>
                {item.sets} sets × {item.reps} reps — rest {item.restSec}s
              </p>
              <button className="btn" onClick={() => toggleCompletion(item.exerciseId)}>
                {isCompleted(item.exerciseId) ? "Completed" : "I completed this"}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
