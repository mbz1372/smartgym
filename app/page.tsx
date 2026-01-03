export default function HomePage() {
  return (
    <main style={{ display: "grid", gap: "1rem", padding: "2rem" }}>
      <h1>Welcome to SmartGym</h1>
      <p>Select an experience to continue.</p>
      <nav style={{ display: "flex", gap: "1rem" }}>
        <a href="/coach">Coach portal</a>
        <a href="/athlete">Athlete portal</a>
      </nav>
    </main>
  );
}
