import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

export function NavBar() {
  return (
    <nav className="navbar">
      <div className="flex" style={{ alignItems: "center" }}>
        <Link href="/" style={{ fontWeight: 800, fontSize: 18 }}>
          Smart Gym Coach
        </Link>
        <span className="badge">PWA</span>
      </div>
      <div className="flex" style={{ alignItems: "center" }}>
        <Link href="/coach">Coach</Link>
        <Link href="/athlete">Athlete</Link>
        <Link href="/ai-coach">AI Coach</Link>
        <ThemeToggle />
      </div>
    </nav>
  );
}
