import { Exercise, WorkoutDay, WorkoutPlan } from "./types";

const DAY_LABELS = [
  { key: "mon", title: "Monday" },
  { key: "tue", title: "Tuesday" },
  { key: "wed", title: "Wednesday" },
  { key: "thu", title: "Thursday" },
  { key: "fri", title: "Friday" },
  { key: "sat", title: "Saturday" },
  { key: "sun", title: "Sunday" },
];

const LEVEL_PRESETS: Record<string, { sets: number; reps: number; restSec: number }> = {
  beginner: { sets: 3, reps: 10, restSec: 90 },
  intermediate: { sets: 4, reps: 12, restSec: 75 },
  advanced: { sets: 5, reps: 15, restSec: 60 },
};

export function buildDays(sessions: number): WorkoutDay[] {
  const days = DAY_LABELS.slice(0, Math.min(sessions, DAY_LABELS.length));
  return days.map((d) => ({ dayKey: d.key, title: d.title, exercises: [] }));
}

export function ruleBasedPlan(
  params: {
    ownerAthleteId: string;
    level: "beginner" | "intermediate" | "advanced";
    goal: string;
    sessionsPerWeek: number;
    injuries?: string;
  },
  library: Exercise[]
): WorkoutPlan {
  const { ownerAthleteId, level, goal, sessionsPerWeek, injuries } = params;
  const preset = LEVEL_PRESETS[level] || LEVEL_PRESETS.beginner;
  const avoidKnee = injuries?.toLowerCase().includes("knee");
  const avoidBack = injuries?.toLowerCase().includes("back");

  const safeExercises = library.filter((ex) => {
    if (avoidKnee && ex.target.toLowerCase().includes("quad")) return false;
    if (avoidBack && ex.target.toLowerCase().includes("lower back")) return false;
    return true;
  });

  const segments = buildDays(sessionsPerWeek);
  const mixByGoal = goal.toLowerCase().includes("strength")
    ? preset
    : { ...preset, reps: preset.reps + 3 };

  let cursor = 0;
  segments.forEach((day) => {
    day.exercises = safeExercises.slice(cursor, cursor + 4).map((ex) => ({
      exerciseId: ex.id,
      sets: mixByGoal.sets,
      reps: mixByGoal.reps,
      restSec: mixByGoal.restSec,
    }));
    cursor += 4;
    if (cursor >= safeExercises.length) cursor = 0;
  });

  return {
    id: `plan-${Date.now()}`,
    ownerAthleteId,
    createdBy: "ai",
    sessionsPerWeek,
    days: segments,
  };
}
