export default function Home() {
  return (
    <main className="main">
      <h1>Welcome to SmartGym</h1>
      <p>
        Choose your path below to access the tailored experience for coaches and
        athletes.
      </p>
      <div className="links">
        <a className="card" href="/coach">
          <strong>Coach</strong>
          <br />
          Manage programs and track progress.
        </a>
        <a className="card" href="/athlete">
          <strong>Athlete</strong>
          <br />
          Follow your plan and log workouts.
        </a>
      </div>
      <footer>Built with Next.js 14 for reliable deployments.</footer>
    </main>
  );
}
