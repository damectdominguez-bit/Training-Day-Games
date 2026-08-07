export default function Leaderboard() {
  return (
    <main className="container simple-page">
      <div className="micro-label">Competition</div>
      <h1>LEADERBOARD.</h1>
      <p className="simple-page-copy">Scoring goes live once workouts and heats are released. Registration comes first.</p>
      <table>
        <thead><tr><th>Rank</th><th>Athlete</th><th>Division</th><th>Points</th></tr></thead>
        <tbody><tr><td colSpan={4}>Leaderboard opens when events are released.</td></tr></tbody>
      </table>
    </main>
  );
}
