import Link from "next/link";

export default function LandingPage() {
  return (
    <section className="grid" style={{ alignItems: "center", minHeight: "60vh" }}>
      <div className="card">
        <p className="badge">Smart Gym Coach</p>
        <h1 style={{ fontSize: 42, margin: "16px 0 8px" }}>Coach smarter. Train confidently.</h1>
        <p style={{ marginBottom: 16 }}>
          A mobile-first PWA that keeps coaches and athletes connected, even offline. Create plans, track
          completion, and explore movements from ExerciseDB.
        </p>
        <div className="flex">
          <Link className="btn" href="/coach">
            I&apos;m a Coach
          </Link>
          <Link className="btn secondary" href="/athlete">
            I&apos;m an Athlete
          </Link>
          <Link className="btn" href="/ai-coach">
            Try AI Smart Coach
          </Link>
        </div>
      </div>
      <div className="card">
        <h3>Why Smart Gym Coach?</h3>
        <ul className="list">
          <li>✅ Offline-ready PWA with install support</li>
          <li>✅ ExerciseDB-powered search with secure proxy</li>
          <li>✅ Simple plan builder for coaches & AI rules for quick starts</li>
          <li>✅ Athlete-friendly day view and completion tracking</li>
        </ul>
      </div>
    </section>
  );
}
