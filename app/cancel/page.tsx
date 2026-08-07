export default function Cancel() {
  return (
    <main className="container">
      <div className="form-shell">
        <div className="eyebrow">Checkout canceled</div>
        <h2 className="section-title">Your spot is not confirmed.</h2>
        <p className="muted">No completed payment was recorded. You can return to registration and try again.</p>
        <a className="button" href="/register">Return to Registration</a>
      </div>
    </main>
  );
}
