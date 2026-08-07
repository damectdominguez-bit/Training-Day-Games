"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

type Teammate = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  shirtSize: string;
  gym: string;
};

const emptyTeammate = (id: number): Teammate => ({
  id,
  firstName: "",
  lastName: "",
  email: "",
  gender: "",
  shirtSize: "M",
  gym: "",
});

function RegistrationForm() {
  const params = useSearchParams();
  const initialDivision = params.get("division") || "RX";
  const initialType = params.get("type") === "team" ? "TEAM" : "INDIVIDUAL";

  const [division, setDivision] = useState(initialDivision);
  const [registrationType, setRegistrationType] = useState<"INDIVIDUAL" | "TEAM">(initialType);
  const [teammates, setTeammates] = useState<Teammate[]>([emptyTeammate(1)]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function addTeammate() {
    if (teammates.length >= 4) return;
    const nextId = Math.max(0, ...teammates.map((t) => t.id)) + 1;
    setTeammates((current) => [...current, emptyTeammate(nextId)]);
  }

  function removeTeammate(id: number) {
    setTeammates((current) => current.filter((t) => t.id !== id));
  }

  function updateTeammate(id: number, field: keyof Teammate, value: string) {
    setTeammates((current) => current.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = {
      division,
      registrationType,
      teamName: registrationType === "TEAM" ? String(form.get("teamName") || "") : "",
      firstName: String(form.get("firstName") || ""),
      lastName: String(form.get("lastName") || ""),
      email: String(form.get("email") || ""),
      phone: String(form.get("phone") || ""),
      gender: String(form.get("gender") || ""),
      birthDate: String(form.get("birthDate") || ""),
      gym: String(form.get("gym") || ""),
      shirtSize: String(form.get("shirtSize") || ""),
      emergencyName: String(form.get("emergencyName") || ""),
      emergencyPhone: String(form.get("emergencyPhone") || ""),
      waiver: form.get("waiver") === "on" ? "on" : "",
      teammates: registrationType === "TEAM" ? teammates : [],
    };

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
    <main className="registration-page premium-registration">
      <div className="reg-hero">
        <div className="reg-hero-grid" />
        <div className="reg-hero-wordmark">TDG</div>
        <div className="container reg-hero-inner">
          <div className="reg-hero-copy">
            <div className="reg-kicker"><span /> TRAINING DAY GAMES · MIAMI</div>
            <h1>CLAIM<br/>YOUR LANE.</h1>
            <p>One day. One floor. No hiding. Build your roster and lock in your spot.</p>
          </div>
          <div className="reg-hero-meta">
            <div><small>EVENT</small><strong>TRAINING DAY GAMES</strong></div>
            <div><small>LOCATION</small><strong>MIAMI, FL</strong></div>
            <div><small>STATUS</small><strong className="live-status"><i /> REGISTRATION OPEN</strong></div>
          </div>
        </div>
      </div>

      <div className="container registration-wrap">
        <div className="registration-progress">
          <div className="progress-item active"><b>01</b><span>Build entry</span></div>
          <div className="progress-line" />
          <div className="progress-item"><b>02</b><span>Review</span></div>
          <div className="progress-line" />
          <div className="progress-item"><b>03</b><span>Payment</span></div>
          <div className="progress-line" />
          <div className="progress-item"><b>04</b><span>You're in</span></div>
        </div>

        <div className="registration-layout">
          <div className="registration-main">
            <div className="reg-section-intro">
              <div>
                <div className="eyebrow">Official athlete entry</div>
                <h2>BUILD YOUR ENTRY</h2>
              </div>
              <p>Captain fills this out once. Your full roster stays together under one registration.</p>
            </div>

            <form onSubmit={submit}>
              <section className="form-section first-section reg-panel">
                <div className="form-section-heading">
                  <span className="section-number">01</span>
                  <div><h2>Choose your field</h2><p>Pick your division and registration format.</p></div>
                </div>

                <div className="choice-grid">
                  {[
                    ["RX", "Full standards"],
                    ["Intermediate", "Competitive"],
                    ["Scaled", "Accessible"],
                  ].map(([name, sub]) => (
                    <button key={name} type="button" className={`choice-card ${division === name ? "selected" : ""}`} onClick={() => setDivision(name)}>
                      <span className="choice-check">{division === name ? "✓" : ""}</span>
                      <strong>{name}</strong><small>{sub}</small>
                    </button>
                  ))}
                </div>
                <input type="hidden" name="division" value={division} />

                <div className="field-label">REGISTRATION FORMAT</div>
                <div className="format-grid">
                  <button type="button" className={registrationType === "INDIVIDUAL" ? "selected" : ""} onClick={() => setRegistrationType("INDIVIDUAL")}>
                    <span className="format-icon">01</span><div><strong>Individual</strong><small>Compete under your own name</small></div>
                  </button>
                  <button type="button" className={registrationType === "TEAM" ? "selected" : ""} onClick={() => setRegistrationType("TEAM")}>
                    <span className="format-icon">+</span><div><strong>Team</strong><small>Captain builds the full roster</small></div>
                  </button>
                </div>

                {registrationType === "TEAM" && (
                  <div className="team-name-block">
                    <label>Team name</label>
                    <input name="teamName" placeholder="Give your team a name" required />
                  </div>
                )}
              </section>

              <section className="form-section reg-panel">
                <div className="form-section-heading">
                  <span className="section-number">02</span>
                  <div><h2>{registrationType === "TEAM" ? "Captain" : "Athlete"}</h2><p>{registrationType === "TEAM" ? "You're the point person. Lead the entry." : "Your official competition profile starts here."}</p></div>
                </div>
                <div className="row"><div><label>First name</label><input name="firstName" required /></div><div><label>Last name</label><input name="lastName" required /></div></div>
                <div className="row"><div><label>Email</label><input name="email" type="email" required /></div><div><label>Phone</label><input name="phone" type="tel" required /></div></div>
                <div className="row"><div><label>Gender</label><select name="gender" defaultValue="" required><option value="" disabled>Select</option><option>Male</option><option>Female</option></select></div><div><label>Date of birth</label><input name="birthDate" type="date" required /></div></div>
                <div className="row"><div><label>Gym / Affiliate</label><input name="gym" placeholder="Optional" /></div><div><label>Shirt size</label><select name="shirtSize" defaultValue="M"><option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>2XL</option></select></div></div>
              </section>

              {registrationType === "TEAM" && (
                <section className="form-section reg-panel roster-panel">
                  <div className="form-section-heading teammate-heading-row">
                    <div className="heading-copy"><span className="section-number">03</span><div><h2>Build the roster</h2><p>Every athlete. One team. One checkout.</p></div></div>
                    <div className="roster-count"><b>{teammates.length + 1}</b> ATHLETES</div>
                  </div>

                  <div className="captain-strip"><span>01</span><div><strong>YOU</strong><small>TEAM CAPTAIN · PRIMARY CONTACT</small></div><em>LOCKED</em></div>

                  <div className="teammate-list">
                    {teammates.map((teammate, index) => (
                      <div className="teammate-card" key={teammate.id}>
                        <div className="teammate-card-head">
                          <div className="athlete-index">{String(index + 2).padStart(2, "0")}</div>
                          <div className="athlete-heading"><span>ROSTER SPOT</span><h3>ATHLETE {index + 2}</h3></div>
                          {teammates.length > 1 && <button type="button" className="remove-teammate" onClick={() => removeTeammate(teammate.id)}>REMOVE</button>}
                        </div>
                        <div className="row"><div><label>First name</label><input value={teammate.firstName} onChange={(e) => updateTeammate(teammate.id,"firstName",e.target.value)} required /></div><div><label>Last name</label><input value={teammate.lastName} onChange={(e) => updateTeammate(teammate.id,"lastName",e.target.value)} required /></div></div>
                        <label>Email</label><input type="email" value={teammate.email} onChange={(e) => updateTeammate(teammate.id,"email",e.target.value)} required />
                        <div className="row"><div><label>Gender</label><select value={teammate.gender} onChange={(e) => updateTeammate(teammate.id,"gender",e.target.value)} required><option value="" disabled>Select</option><option>Male</option><option>Female</option></select></div><div><label>Shirt size</label><select value={teammate.shirtSize} onChange={(e) => updateTeammate(teammate.id,"shirtSize",e.target.value)}><option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>2XL</option></select></div></div>
                        <label>Gym / Affiliate</label><input value={teammate.gym} onChange={(e) => updateTeammate(teammate.id,"gym",e.target.value)} placeholder="Optional" />
                      </div>
                    ))}
                  </div>

                  {teammates.length < 4 && <button type="button" className="add-teammate" onClick={addTeammate}><span>+</span><div><strong>ADD TEAMMATE</strong><small>Open another roster spot</small></div></button>}
                </section>
              )}

              <section className="form-section reg-panel">
                <div className="form-section-heading"><span className="section-number">{registrationType === "TEAM" ? "04" : "03"}</span><div><h2>Emergency contact</h2><p>Someone we can reach if it matters.</p></div></div>
                <div className="row"><div><label>Contact name</label><input name="emergencyName" required /></div><div><label>Contact phone</label><input name="emergencyPhone" type="tel" required /></div></div>
              </section>

              <section className="form-section reg-panel waiver-section">
                <div className="form-section-heading"><span className="section-number">{registrationType === "TEAM" ? "05" : "04"}</span><div><h2>Waiver & policies</h2><p>Read it. Own it. Compete.</p></div></div>
                <div className="waiver-copy"><strong>Participant waiver placeholder</strong><p>The final Training Day Games participation waiver, assumption of risk, media release and event policies will appear here before registration opens.</p></div>
                <label className="checkbox-label"><input name="waiver" type="checkbox" required /><span>I have read and agree to the Training Day Games waiver and event policies.</span></label>
              </section>

              {error && <div className="form-error">{error}</div>}
              <button className="checkout-button" disabled={loading}><span>{loading ? "OPENING SECURE CHECKOUT..." : registrationType === "TEAM" ? "LOCK IN YOUR TEAM" : "LOCK IN YOUR SPOT"}</span><b>→</b></button>
            </form>
          </div>

          <aside className="registration-summary">
            <div className="summary-sticky">
              <div className="summary-topline"><span>YOUR ENTRY</span><b>TDG / 2027</b></div>
              <div className="summary-art"><span>TRAIN</span><strong>DAY</strong><em>GAMES</em></div>
              <div className="summary-event"><small>MIAMI · FLORIDA</small><h3>CLAIM YOUR LANE.</h3></div>
              <div className="summary-data">
                <div><span>DIVISION</span><strong>{division.toUpperCase()}</strong></div>
                <div><span>FORMAT</span><strong>{registrationType === "TEAM" ? "TEAM" : "INDIVIDUAL"}</strong></div>
                {registrationType === "TEAM" && <div><span>ROSTER</span><strong>{teammates.length + 1} ATHLETES</strong></div>}
              </div>
              <div className="summary-callout"><i /> YOUR SPOT ISN'T YOURS UNTIL PAYMENT IS COMPLETE.</div>
              <div className="summary-footer"><span>TRAINING DAY GAMES</span><span>2027</span></div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function RegistrationLoading() {
  return <main className="registration-page"><div className="container"><p className="muted">Loading registration...</p></div></main>;
}

export default function RegisterPage() {
  return <Suspense fallback={<RegistrationLoading />}><RegistrationForm /></Suspense>;
}
