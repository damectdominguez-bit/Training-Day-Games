export default function Success() {
  return (
    <main className="container confirmation-page">
      <div className="micro-label">Registration received</div>
      <h1>YOU'RE IN.</h1>
      <p>Payment was submitted. Your entry becomes official after Stripe confirms the checkout.</p>
      <a className="primary-cta" href="/">Back to Training Day Games <span>→</span></a>
    </main>
  );
}
