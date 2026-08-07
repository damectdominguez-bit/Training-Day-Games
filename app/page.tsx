import { tdgLogo } from "./logo-data";

const divisions = [
  { name: "RX", tag: "Advanced", description: "Full standards. Heavy loads. High-skill gymnastics. Built for experienced competitors." },
  { name: "Intermediate", tag: "Competitive", description: "Serious fitness, real pace and a complete test without the top-end RX barrier." },
  { name: "Scaled", tag: "Open", description: "A true competition experience with accessible movement standards and the same event energy." },
];

export default function Home() {
  return (
    <main>
      <section className="home-hero" id="event">
        <div className="container home-hero-grid">
          <div className="home-hero-copy">
            <div className="micro-label">Miami · 2027 · Functional Fitness</div>
            <h1>SHOW UP<br/>FOR YOUR<br/><em>TRAINING.</em></h1>
            <p>The Training Day Games is built to feel bigger than a local comp — sharp programming, a premium floor, loud energy and athletes who came to compete.</p>
            <div className="hero-actions">
              <a className="primary-cta" href="/register">Register to compete <span>→</span></a>
              <a className="text-link" href="#divisions">Explore divisions</a>
            </div>
            <div className="hero-facts">
              <div><span>01</span><strong>Miami, FL</strong><small>South Florida</small></div>
              <div><span>02</span><strong>Summer 2027</strong><small>Final date coming</small></div>
              <div><span>03</span><strong>Individual + Team</strong><small>Multiple divisions</small></div>
            </div>
          </div>

          <div className="home-hero-art">
            <div className="art-noise" />
            <div className="art-label">OFFICIAL EVENT MARK</div>
            <img src={tdgLogo} alt="The Training Day Games logo" />
            <div className="art-footer"><span>TRAINING DAY GAMES</span><span>MIAMI / 2027</span></div>
          </div>
        </div>
      </section>

      <div className="runline" aria-hidden="true">
        <span>TRAIN HARD · SHOW UP · COMPETE WELL · TRAIN HARD · SHOW UP · COMPETE WELL ·</span>
      </div>

      <section className="statement-section">
        <div className="container statement-grid">
          <div className="micro-label">The idea</div>
          <h2>NOT ANOTHER<br/>GENERIC FITNESS<br/>COMPETITION.</h2>
          <div className="statement-copy">
            <p>Every touchpoint should feel intentional — athlete check-in, lane setup, warm-up, scoring, vendors, spectators and the competition floor itself.</p>
            <p>Come for the test. Leave feeling like you were part of something worth doing again.</p>
          </div>
        </div>
      </section>

      <section className="division-section" id="divisions">
        <div className="container">
          <div className="section-head">
            <div><div className="micro-label">Choose your field</div><h2>FIND YOUR DIVISION.</h2></div>
            <p>Same event. Different standards. Pick the level that lets you compete hard.</p>
          </div>
          <div className="division-grid">
            {divisions.map((d, index) => (
              <a className="division-tile" href={`/register?division=${encodeURIComponent(d.name)}`} key={d.name}>
                <div className="division-top"><span>{String(index + 1).padStart(2, "0")}</span><small>{d.tag}</small></div>
                <h3>{d.name}</h3>
                <p>{d.description}</p>
                <div className="division-arrow">REGISTER <span>↗</span></div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="black-band">
        <div className="container black-band-grid">
          <div><div className="gold-rule"/><h2>YOUR TRAINING<br/>HAS A DAY.</h2></div>
          <div className="black-band-copy"><p>You do the work when nobody is watching. This is where you get to put it on the floor.</p><a href="/register">CLAIM YOUR SPOT →</a></div>
        </div>
      </section>
    </main>
  );
}
