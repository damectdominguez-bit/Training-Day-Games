export default function Success() {
  return (
    <main className="container">
      <div className="form-shell">
        <div className="eyebrow">Registration received</div>
        <h2 className="section-title">You're in.</h2>
        <p className="muted">Payment was submitted. Your registration becomes official after Stripe confirms the checkout.</p>
        <a className="button" href="/">Back to Training Day Games</a>
      </div>
    </main>
  );
}
