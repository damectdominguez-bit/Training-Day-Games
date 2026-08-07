const divisions = [
  { name: "RX", price: "$199", description: "For experienced competitors comfortable with advanced functional-fitness movements and heavier loading." },
  { name: "Intermediate", price: "$179", description: "A competitive division for well-rounded athletes who are not yet competing at RX standards." },
  { name: "Scaled", price: "$159", description: "Accessible competition with appropriately scaled gymnastics, loading and skill requirements." },
];

export default function Home() {
  return (
    <main>
      <div className="hero">
        <div className="container">
          <div className="eyebrow">Miami • 2027</div>
          <h1>YOUR TRAINING<br/>HAS A DAY.</h1>
          <p>The Training Day Games bring together athletes, gyms and the South Florida fitness community for a full day of competition.</p>
          <div className="meta">
            <div><strong>Date</strong>2027 date coming soon</div>
            <div><strong>Location</strong>Miami, Florida</div>
            <div><strong>Registration</strong>Opening soon</div>
          </div>
          <a href="/register" className="button">Register to Compete</a>
        </div>
      </div>

      <section id="divisions">
        <div className="container">
          <div className="eyebrow">Choose your division</div>
          <h2 className="section-title">Built for real competition.</h2>
          <p className="muted">Starter pricing and standards can be replaced with final event details from the organizer dashboard.</p>
          <div className="grid">
            {divisions.map((d) => (
              <div className="card" key={d.name}>
                <h3>{d.name}</h3>
                <p className="muted">{d.description}</p>
                <div className="price">{d.price} <small>per registration</small></div>
                <a href={`/register?division=${encodeURIComponent(d.name)}`} className="button">Select {d.name}</a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
