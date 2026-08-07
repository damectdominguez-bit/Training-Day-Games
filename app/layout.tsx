import "./globals.css";
import "./secondary.css";
import type { Metadata } from "next";
import { tdgLogo } from "./logo-data";

export const metadata: Metadata = {
  title: "The Training Day Games",
  description: "The Training Day Games — Miami functional fitness competition.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="container site-nav">
            <a className="site-mark" href="/" aria-label="The Training Day Games home">
              <span className="site-mark-box"><img src={tdgLogo} alt="TDG" /></span>
              <span className="site-mark-copy">TRAINING DAY<br/>GAMES</span>
            </a>
            <nav className="site-links">
              <a href="/#event">The Event</a>
              <a href="/#divisions">Divisions</a>
              <a href="/leaderboard">Leaderboard</a>
              <a href="/register" className="nav-cta">Register</a>
            </nav>
          </div>
        </header>
        {children}
      </body>
    </html>
  );
}
