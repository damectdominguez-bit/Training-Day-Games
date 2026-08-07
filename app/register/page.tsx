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
    setTeammates((current) =>
      current.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const form = new FormData(e.currentTarget);
    const payload = {
      division: String(form.get("division") || ""),
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
    <main className="registration-page">
      <div className="container registration-wrap">
        <div className="registration-progress">
          <span className="active">1. Registration</span>
          <span>2. Review</span>
          <span>3. Payment</span>
          <span>4. Confirmed</span>
        </div>

        <div className="registration-layout">
          <div className="registration-main">
            <div className="eyebrow">Training Day Games</div>
            <h1 className="registration-title">REGISTER TO COMPETE</h1>
            <p className="registration-intro">
              Build your athlete or team registration below. The captain completes one checkout for the full roster.
            </p>

            <form onSubmit={submit}>
              <section className="form-section first-section">
                <div className="form-section-heading">
                  <span className="section-number">01</span>
                  <div>
                    <h2>Registration</h2>
                    <p>Choose the division and how you are competing.</p>
                  </div>
                </div>

                <label>Division</label>
                <select name="division" defaultValue={initialDivision}>
                  <option>RX</option>
                  <option>Intermediate</option>
                  <option>Scaled</option>
                </select>

                <label>Registration type</label>
                <div className="segmented-control">
                  <button
                    type="button"
                    className={registrationType === "INDIVIDUAL" ? "selected" : ""}
                    onClick={() => setRegistrationType("INDIVIDUAL")}
                  >
                    Individual
                  </button>
                  <button
                    type="button"
                    className={registrationType === "TEAM" ? "selected" : ""}
                    onClick={() => setRegistrationType("TEAM")}
                  >
                    Team
                  </button>
                </div>

                {registrationType === "TEAM" && (
                  <div className="team-name-block">
                    <label>Team name</label>
                    <input name="teamName" placeholder="Enter your team name" required />
                  </div>
                )}
              </section>

              <section className="form-section">
                <div className="form-section-heading">
                  <span className="section-number">02</span>
                  <div>
                    <h2>{registrationType === "TEAM" ? "Team Captain" : "Athlete Info"}</h2>
                    <p>{registrationType === "TEAM" ? "You will be the primary contact for this team." : "Tell us who is competing."}</p>
                  </div>
                </div>

                <div className="row">
                  <div><label>First name</label><input name="firstName" required /></div>
                  <div><label>Last name</label><input name="lastName" required /></div>
                </div>
                <div className="row">
                  <div><label>Email</label><input name="email" type="email" required /></div>
                  <div><label>Phone</label><input name="phone" type="tel" required /></div>
                </div>
                <div className="row">
                  <div>
                    <label>Gender</label>
                    <select name="gender" defaultValue="" required>
                      <option value="" disabled>Select gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div><label>Date of birth</label><input name="birthDate" type="date" required /></div>
                </div>
                <div className="row">
                  <div><label>Gym / Affiliate</label><input name="gym" placeholder="Optional" /></div>
                  <div>
                    <label>Shirt size</label>
                    <select name="shirtSize" defaultValue="M">
                      <option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>2XL</option>
                    </select>
                  </div>
                </div>
              </section>

              {registrationType === "TEAM" && (
                <section className="form-section">
                  <div className="form-section-heading teammate-heading-row">
                    <div className="heading-copy">
                      <span className="section-number">03</span>
                      <div>
                        <h2>Team Roster</h2>
                        <p>Add every teammate competing under this registration.</p>
                      </div>
                    </div>
                    <div className="roster-count">{teammates.length + 1} athletes</div>
                  </div>

                  <div className="roster-note">
                    The captain is already athlete #1. Add each remaining teammate below using their real email so we can send event updates later.
                  </div>

                  <div className="teammate-list">
                    {teammates.map((teammate, index) => (
                      <div className="teammate-card" key={teammate.id}>
                        <div className="teammate-card-head">
                          <div>
                            <span className="teammate-kicker">Athlete {index + 2}</span>
                            <h3>Teammate {index + 1}</h3>
                          </div>
                          {teammates.length > 1 && (
                            <button type="button" className="remove-teammate" onClick={() => removeTeammate(teammate.id)}>
                              Remove
                            </button>
                          )}
                        </div>

                        <div className="row">
                          <div>
                            <label>First name</label>
                            <input value={teammate.firstName} onChange={(e) => updateTeammate(teammate.id, "firstName", e.target.value)} required />
                          </div>
                          <div>
                            <label>Last name</label>
                            <input value={teammate.lastName} onChange={(e) => updateTeammate(teammate.id, "lastName", e.target.value)} required />
                          </div>
                        </div>
                        <label>Email</label>
                        <input type="email" value={teammate.email} onChange={(e) => updateTeammate(teammate.id, "email", e.target.value)} required />
                        <div className="row">
                          <div>
                            <label>Gender</label>
                            <select value={teammate.gender} onChange={(e) => updateTeammate(teammate.id, "gender", e.target.value)} required>
                              <option value="" disabled>Select gender</option>
                              <option value="Male">Male</option>
                              <option value="Female">Female</option>
                            </select>
                          </div>
                          <div>
                            <label>Shirt size</label>
                            <select value={teammate.shirtSize} onChange={(e) => updateTeammate(teammate.id, "shirtSize", e.target.value)}>
                              <option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>2XL</option>
                            </select>
                          </div>
                        </div>
                        <label>Gym / Affiliate</label>
                        <input value={teammate.gym} onChange={(e) => updateTeammate(teammate.id, "gym", e.target.value)} placeholder="Optional" />
                      </div>
                    ))}
                  </div>

                  {teammates.length < 4 && (
                    <button type="button" className="add-teammate" onClick={addTeammate}>
                      <span>+</span> Add another teammate
                    </button>
                  )}
                </section>
              )}

              <section className="form-section">
                <div className="form-section-heading">
                  <span className="section-number">{registrationType === "TEAM" ? "04" : "03"}</span>
                  <div>
                    <h2>Emergency Contact</h2>
                    <p>Someone we can reach if needed during the event.</p>
                  </div>
                </div>
                <div className="row">
                  <div><label>Contact name</label><input name="emergencyName" required /></div>
                  <div><label>Contact phone</label><input name="emergencyPhone" type="tel" required /></div>
                </div>
              </section>

              <section className="form-section waiver-section">
                <div className="form-section-heading">
                  <span className="section-number">{registrationType === "TEAM" ? "05" : "04"}</span>
                  <div>
                    <h2>Waiver & Policies</h2>
                    <p>Acceptance is recorded with the registration.</p>
                  </div>
                </div>
                <div className="waiver-copy">
                  <strong>Participant waiver placeholder</strong>
                  <p>The final Training Day Games participation waiver, assumption of risk, media release and event policies will appear here before registration opens.</p>
                </div>
                <label className="checkbox-label">
                  <input name="waiver" type="checkbox" required />
                  <span>I have read and agree to the Training Day Games waiver and event policies.</span>
                </label>
              </section>

              {error && <div className="form-error">{error}</div>}
              <button className="checkout-button" disabled={loading}>
                {loading ? "Opening secure checkout..." : "Continue to Payment"}
              </button>
            </form>
          </div>

          <aside className="registration-summary">
            <div className="summary-sticky">
              <div className="summary-label">Your Registration</div>
              <h3>Training Day Games</h3>
              <div className="summary-line"><span>Division</span><strong>{initialDivision}</strong></div>
              <div className="summary-line"><span>Format</span><strong>{registrationType === "TEAM" ? "Team" : "Individual"}</strong></div>
              {registrationType === "TEAM" && <div className="summary-line"><span>Roster</span><strong>{teammates.length + 1} athletes</strong></div>}
              <div className="summary-divider" />
              <p className="summary-help">One secure payment confirms the entire registration. Team captains can manage their roster before registration closes.</p>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function RegistrationLoading() {
  return <main className="container"><div className="form-shell"><p className="muted">Loading registration...</p></div></main>;
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegistrationLoading />}>
      <RegistrationForm />
    </Suspense>
  );
}
