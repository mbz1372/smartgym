import Link from "next/link";

export default function SetupPage() {
  return (
    <div className="card" style={{ maxWidth: 760 }}>
      <h1>Setup guide</h1>
      <ol className="list">
        <li>
          Create a <code>.env.local</code> file in the project root with your ExerciseDB credentials:
          <pre>{`EXERCISEDB_BASE_URL=https://exercisedb.p.rapidapi.com
RAPIDAPI_KEY=your-key
RAPIDAPI_HOST=exercisedb.p.rapidapi.com`}</pre>
        </li>
        <li>Install dependencies with <code>npm install</code>.</li>
        <li>Run the dev server via <code>npm run dev</code> then open http://localhost:3000.</li>
        <li>
          Deploy on Vercel: push this repo and import it in Vercel. Add the env vars in the Vercel dashboard and
          ensure <code>npm run build</code> succeeds.
        </li>
      </ol>
      <p>
        Need a walkthrough? Jump back to the <Link href="/">home</Link> or try the <Link href="/ai-coach">AI Smart
        Coach</Link> to auto-generate a plan.
      </p>
    </div>
  );
}
