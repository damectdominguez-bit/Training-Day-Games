import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Training Day Games",
  description: "Register for the Training Day Games.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="header">
          <div className="container nav">
            <a className="brand" href="/">TRAINING DAY <span>GAMES</span></a>
            <nav className="navlinks">
              <a href="/#divisions">Divisions</a>
              <a href="/leaderboard">Leaderboard</a>
              <a href="/register" className="button">Register</a>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
