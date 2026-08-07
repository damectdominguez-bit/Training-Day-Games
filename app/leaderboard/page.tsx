export default function Leaderboard() {
  return (
    <main className="container">
      <section>
        <div className="eyebrow">Competition</div>
        <h2 className="section-title">Leaderboard</h2>
        <p className="muted">Scoring will be added in phase two after registration is live.</p>
        <table>
          <thead><tr><th>Rank</th><th>Athlete</th><th>Division</th><th>Points</th></tr></thead>
          <tbody><tr><td colSpan={4} className="muted">Leaderboard opens when events are released.</td></tr></tbody>
        </table>
      </section>
    </main>
  );
}
