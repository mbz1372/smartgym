import { Completion, User, WorkoutPlan } from "./types";

const USERS_KEY = "smartgym_users";
const PLANS_KEY = "smartgym_plans";
const COMPLETIONS_KEY = "smartgym_completions";

const safeParse = <T>(value: string | null, fallback: T): T => {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch (e) {
    console.warn("Failed to parse localStorage value", e);
    return fallback;
  }
};

const canUseStorage = () => typeof window !== "undefined" && !!window.localStorage;

export const storage = {
  getUsers(): User[] {
    if (!canUseStorage()) return [];
    return safeParse<User[]>(localStorage.getItem(USERS_KEY), []);
  },
  saveUsers(users: User[]) {
    if (!canUseStorage()) return;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },
  getPlans(): WorkoutPlan[] {
    if (!canUseStorage()) return [];
    return safeParse<WorkoutPlan[]>(localStorage.getItem(PLANS_KEY), []);
  },
  savePlans(plans: WorkoutPlan[]) {
    if (!canUseStorage()) return;
    localStorage.setItem(PLANS_KEY, JSON.stringify(plans));
  },
  getCompletions(): Completion[] {
    if (!canUseStorage()) return [];
    return safeParse<Completion[]>(localStorage.getItem(COMPLETIONS_KEY), []);
  },
  saveCompletions(completions: Completion[]) {
    if (!canUseStorage()) return;
    localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(completions));
  },
};
