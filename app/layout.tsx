import type { Metadata } from "next";
import "./globals.css";
import { NavBar } from "@/components/NavBar";
import { PWARegister } from "@/components/PWARegister";

export const metadata: Metadata = {
  title: "Smart Gym Coach",
  description: "Offline-ready Smart Gym Coach for coaches and athletes",
  manifest: "/manifest.json",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PWARegister />
        <NavBar />
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
