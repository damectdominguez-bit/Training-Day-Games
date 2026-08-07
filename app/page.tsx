import "./home-v2.css";

// Deployment refresh: simplified TDG event homepage.
const divisions = [
  { code: "RX", name: "RX", note: "Advanced standards" },
  { code: "INT", name: "Intermediate", note: "Competitive field" },
  { code: "SCL", name: "Scaled", note: "Open field" },
];

export default function Home() {
  return (
    <main className="home2">
      <section className="home2-hero" id="event">
        <div className="container home2-hero-grid">
          <div>
            <div className="home2-kicker">Miami · 2027 · Training Day Games</div>
            <h1>YOUR TRAINING<br/><span>HAS A DAY.</span></h1>
            <p className="home2-copy">
              A competition built for athletes who want a real test, a real crowd and a day that feels worth training for.
            </p>
            <div className="home2-actions">
              <a className="home2-primary" href="/register">Register now <span>→</span></a>
              <a className="home2-secondary" href="#divisions">View divisions <span>↓</span></a>
            </div>
          </div>

          <aside className="home2-pass">
            <div className="home2-pass-top"><span>TDG / Event card</span><span>2027</span></div>
            <div className="home2-pass-main">
              <small>The event</small>
              <h2>TRAIN.<br/>SHOW UP.<br/>COMPETE.</h2>
            </div>
            <div className="home2-pass-facts">
              <div><span>Location</span><strong>Miami, FL</strong></div>
              <div><span>Date</span><strong>Summer 2027</strong></div>
              <div><span>Format</span><strong>Individual + Team</strong></div>
              <div><span>Status</span><strong>Registration open</strong></div>
            </div>
          </aside>
        </div>
      </section>

      <section className="home2-intro">
        <div className="container home2-intro-grid">
          <div className="home2-intro-label">What this is</div>
          <div>
            <h2>MORE THAN A LOCAL COMP.<br/><span>WITHOUT TRYING TOO HARD.</span></h2>
            <div className="home2-intro-text">
              <p>
                Training Day Games is designed to feel polished, competitive and fun without turning the day into a circus. Good programming. Good flow. Good energy.
              </p>
              <p>
                Athletes should leave feeling tested. Spectators should want to stay. Teams should already be talking about coming back.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="home2-why">
        <div className="container">
          <div className="home2-section-head">
            <h2>WHY SHOW UP?</h2>
            <p>Keep it simple: a better competition experience for athletes, teams and the people who come to watch them.</p>
          </div>

          <div className="home2-why-grid">
            <article className="home2-why-card">
              <div className="num">01</div>
              <h3>A REAL TEST.</h3>
              <p>Programming that rewards fitness, pacing, skill and the ability to compete under pressure.</p>
            </article>
            <article className="home2-why-card">
              <div className="num">02</div>
              <h3>A BETTER DAY.</h3>
              <p>Clean event flow, loud energy and an atmosphere that feels bigger than a normal weekend competition.</p>
            </article>
            <article className="home2-why-card">
              <div className="num">03</div>
              <h3>YOUR PEOPLE.</h3>
              <p>Athletes, gyms, teams and spectators all in the same place for the same reason: compete and enjoy it.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="home2-divisions" id="divisions">
        <div className="container">
          <div className="home2-section-head">
            <h2>CHOOSE YOUR FIELD.</h2>
            <p>Different standards. Same floor. Pick the division that gives you the best race.</p>
          </div>

          <div className="home2-division-list">
            {divisions.map((division) => (
              <a className="home2-division-row" href={`/register?division=${encodeURIComponent(division.name)}`} key={division.name}>
                <span className="code">{division.code}</span>
                <div><strong>{division.name}</strong><small>{division.note}</small></div>
                <span className="arrow">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="home2-cta">
        <div className="container home2-cta-grid">
          <div>
            <h2>READY<br/>WHEN YOU ARE.</h2>
            <p>Pick your division, build your entry and lock in your spot for Training Day Games.</p>
          </div>
          <a className="home2-secondary" href="/register">Start registration <span>→</span></a>
        </div>
      </section>
    </main>
  );
}
