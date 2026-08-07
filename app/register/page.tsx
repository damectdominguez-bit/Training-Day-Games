"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";

export default function RegisterPage() {
  const params = useSearchParams();
  const initialDivision = params.get("division") || "RX";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = new FormData(e.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration could not be started.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration could not be started.");
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <div className="form-shell">
        <div className="eyebrow">Athlete Registration</div>
        <h2 className="section-title">Training Day Games</h2>
        <p className="muted">Complete your athlete information, accept the waiver, then pay securely through Stripe.</p>
        <form onSubmit={submit}>
          <label>Division</label>
          <select name="division" defaultValue={initialDivision}>
            <option>RX</option><option>Intermediate</option><option>Scaled</option>
          </select>
          <div className="row">
            <div><label>First name</label><input name="firstName" required /></div>
            <div><label>Last name</label><input name="lastName" required /></div>
          </div>
          <label>Email</label><input name="email" type="email" required />
          <div className="row">
            <div><label>Phone</label><input name="phone" /></div>
            <div><label>Gym / Affiliate</label><input name="gym" /></div>
          </div>
          <div className="row">
            <div><label>Emergency contact</label><input name="emergencyName" required /></div>
            <div><label>Emergency phone</label><input name="emergencyPhone" required /></div>
          </div>
          <label>Shirt size</label>
          <select name="shirtSize" defaultValue="M"><option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>2XL</option></select>
          <div className="notice"><strong>Waiver placeholder.</strong><br/>The final legal waiver will be stored with a version and acceptance timestamp.</div>
          <label style={{display:"flex", gap:10, alignItems:"flex-start", fontWeight:600}}>
            <input name="waiver" type="checkbox" required style={{width:18, marginTop:2}} />
            I have read and agree to the event waiver and participation terms.
          </label>
          {error && <p style={{color:"#ff8d8d"}}>{error}</p>}
          <button disabled={loading}>{loading ? "Opening checkout..." : "Continue to Payment"}</button>
        </form>
      </div>
    </main>
  );
}
