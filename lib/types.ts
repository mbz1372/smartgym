export type Exercise = {
  id: string;
  name: string;
  bodyPart: string;
  target: string;
  equipment: string;
  gifUrl: string;
};

export type WorkoutExercise = {
  exerciseId: string;
  sets: number;
  reps: number;
  restSec: number;
};

export type WorkoutDay = {
  dayKey: string;
  title: string;
  exercises: WorkoutExercise[];
};

export type WorkoutPlan = {
  id: string;
  ownerAthleteId: string;
  createdBy: "coach" | "ai";
  sessionsPerWeek: number;
  days: WorkoutDay[];
};

export type User = {
  id: string;
  role: "coach" | "athlete";
  name: string;
  coachId?: string;
};

export type Completion = {
  planId: string;
  dayKey: string;
  exerciseId: string;
  completedAt: string;
};
