export default function Cancel() {
  return (
    <main className="container confirmation-page">
      <div className="micro-label">Checkout canceled</div>
      <h1>SPOT NOT<br/>LOCKED.</h1>
      <p>No completed payment was recorded. Your registration is still open if you want to finish it.</p>
      <a className="primary-cta" href="/register">Return to registration <span>→</span></a>
    </main>
  );
}
