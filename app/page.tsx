import "./home-v3.css";

const divisions = [
  { code: "RX", name: "RX", note: "Advanced standards" },
  { code: "INT", name: "Intermediate", note: "Competitive field" },
  { code: "SCL", name: "Scaled", note: "Open field" },
];

export default function Home() {
  return (
    <main className="event-home">
      <section className="event-hero" id="event">
        <div className="container event-hero-grid">
          <div>
            <div className="event-kicker">Miami · Functional Fitness Competition</div>
            <h1 className="event-title">TRAINING DAY<br/><span>GAMES.</span></h1>
            <p className="event-intro">
              One day of serious competition, strong fields and a crowd that came to watch people race.
            </p>
            <div className="event-actions">
              <a className="event-primary" href="/register">Register now <span>→</span></a>
              <a className="event-secondary" href="#divisions">View divisions <span>↓</span></a>
            </div>
          </div>

          <aside className="event-info-card">
            <div className="event-info-top"><span>Official event details</span><span>TDG / 2027</span></div>
            <div className="event-date-block">
              <small>Date</small>
              <strong>AUG 17<br/>2027</strong>
            </div>
            <div className="event-location">
              <span>Venue</span>
              <strong>Miami Fairgrounds &amp; Expo Center</strong>
            </div>
            <div className="event-info-bottom">
              <div><span>City</span><strong>Miami, FL</strong></div>
              <div><span>Format</span><strong>Individual + Team</strong></div>
            </div>
          </aside>
        </div>
      </section>

      <section className="event-strip">
        <div className="container event-strip-grid">
          <div className="event-strip-item"><span>01</span><strong>One-day competition</strong></div>
          <div className="event-strip-item"><span>02</span><strong>RX · Intermediate · Scaled</strong></div>
          <div className="event-strip-item"><span>03</span><strong>Individual + Team</strong></div>
          <div className="event-strip-item"><span>04</span><strong>Miami, Florida</strong></div>
        </div>
      </section>

      <section className="event-about">
        <div className="container event-about-grid">
          <div className="event-label">The event</div>
          <div>
            <h2>BUILT TO FEEL<br/><span>LIKE IT MATTERS.</span></h2>
            <div className="event-about-copy">
              <p>
                Training Day Games is a functional fitness competition built around good programming, clean event flow and athletes who actually want to race.
              </p>
              <p>
                The goal is simple: create a competition athletes want to train for, spectators want to stay for and gyms want to come back to.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="event-pillars">
        <div className="container">
          <div className="event-section-head">
            <h2>WHAT TO EXPECT.</h2>
            <p>No overcomplicated pitch. Just the things that should make a competition worth doing.</p>
          </div>
          <div className="event-pillar-grid">
            <article className="event-pillar">
              <div className="num">01</div>
              <h3>GOOD TESTS.</h3>
              <p>Programming that rewards fitness, execution, pacing and the ability to perform under pressure.</p>
            </article>
            <article className="event-pillar">
              <div className="num">02</div>
              <h3>REAL ENERGY.</h3>
              <p>A floor that feels alive, with athletes, gyms and spectators all part of the same event.</p>
            </article>
            <article className="event-pillar">
              <div className="num">03</div>
              <h3>CLEAN FLOW.</h3>
              <p>Clear heats, organized lanes and an event day that respects the athlete experience.</p>
            </article>
          </div>
        </div>
      </section>

      <section className="event-divisions" id="divisions">
        <div className="container">
          <div className="event-section-head">
            <h2>CHOOSE YOUR FIELD.</h2>
            <p>Different standards. Same event. Pick the division that gives you the best race.</p>
          </div>
          <div className="event-division-list">
            {divisions.map((division) => (
              <a className="event-division-row" href={`/register?division=${encodeURIComponent(division.name)}`} key={division.name}>
                <span className="code">{division.code}</span>
                <div><strong>{division.name}</strong><small>{division.note}</small></div>
                <span className="arrow">↗</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="event-cta">
        <div className="container event-cta-grid">
          <div>
            <h2>SEE YOU<br/>ON THE FLOOR.</h2>
            <p>August 17, 2027 · Miami Fairgrounds &amp; Expo Center</p>
          </div>
          <a className="event-secondary" href="/register">Start registration <span>→</span></a>
        </div>
      </section>
    </main>
  );
}
