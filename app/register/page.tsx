"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { tdgLogo } from "../logo-data";

type Teammate = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  shirtSize: string;
  gym: string;
};

const emptyTeammate = (id: number): Teammate => ({ id, firstName: "", lastName: "", email: "", gender: "", shirtSize: "M", gym: "" });

function RegistrationForm() {
  const params = useSearchParams();
  const initialDivision = params.get("division") || "Intermediate";
  const initialType = params.get("type") === "team" ? "TEAM" : "INDIVIDUAL";
  const [division, setDivision] = useState(initialDivision);
  const [registrationType, setRegistrationType] = useState<"INDIVIDUAL" | "TEAM">(initialType);
  const [teammates, setTeammates] = useState<Teammate[]>([emptyTeammate(1)]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function addTeammate() {
    if (teammates.length >= 4) return;
    setTeammates((current) => [...current, emptyTeammate(Math.max(0, ...current.map((t) => t.id)) + 1)]);
  }

  function removeTeammate(id: number) {
    setTeammates((current) => current.filter((t) => t.id !== id));
  }

  function updateTeammate(id: number, field: keyof Teammate, value: string) {
    setTeammates((current) => current.map((t) => t.id === id ? { ...t, [field]: value } : t));
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
      const response = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration could not be started.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration could not be started.");
      setLoading(false);
    }
  }

  return (
    <main className="register-page">
      <div className="container register-heading">
        <div>
          <div className="micro-label">Official athlete registration</div>
          <h1>ENTER THE<br/>TRAINING DAY<br/>GAMES.</h1>
        </div>
        <p>Build your entry, add your roster and complete one secure checkout. Clean, simple, competition-ready.</p>
      </div>

      <div className="container register-progress">
        <span className="current">01 <b>Entry</b></span><i/><span>02 <b>Review</b></span><i/><span>03 <b>Payment</b></span><i/><span>04 <b>Confirmed</b></span>
      </div>

      <div className="container register-layout">
        <form className="register-form" onSubmit={submit}>
          <section className="reg-section">
            <div className="reg-section-title"><span>01</span><div><h2>Choose your entry</h2><p>Your division and format define the registration.</p></div></div>
            <div className="division-picker">
              {["RX", "Intermediate", "Scaled"].map((name) => (
                <button type="button" key={name} className={division === name ? "active" : ""} onClick={() => setDivision(name)}>
                  <span>{name === "Intermediate" ? "INT" : name === "Scaled" ? "SCL" : "RX"}</span>
                  <strong>{name}</strong>
                </button>
              ))}
            </div>
            <input type="hidden" name="division" value={division} />

            <div className="format-picker">
              <button type="button" className={registrationType === "INDIVIDUAL" ? "active" : ""} onClick={() => setRegistrationType("INDIVIDUAL")}>
                <small>01</small><strong>Individual</strong><span>One athlete. One entry.</span>
              </button>
              <button type="button" className={registrationType === "TEAM" ? "active" : ""} onClick={() => setRegistrationType("TEAM")}>
                <small>02</small><strong>Team</strong><span>Captain builds the roster.</span>
              </button>
            </div>

            {registrationType === "TEAM" && <div className="single-field"><label>Team name</label><input name="teamName" placeholder="Team name" required /></div>}
          </section>

          <section className="reg-section">
            <div className="reg-section-title"><span>02</span><div><h2>{registrationType === "TEAM" ? "Captain" : "Athlete"}</h2><p>{registrationType === "TEAM" ? "Primary contact for the full team." : "Your competition profile."}</p></div></div>
            <div className="form-row"><div><label>First name</label><input name="firstName" required /></div><div><label>Last name</label><input name="lastName" required /></div></div>
            <div className="form-row"><div><label>Email</label><input name="email" type="email" required /></div><div><label>Phone</label><input name="phone" type="tel" required /></div></div>
            <div className="form-row"><div><label>Gender</label><select name="gender" defaultValue="" required><option value="" disabled>Select</option><option>Male</option><option>Female</option></select></div><div><label>Date of birth</label><input name="birthDate" type="date" required /></div></div>
            <div className="form-row"><div><label>Gym / Affiliate</label><input name="gym" placeholder="Optional" /></div><div><label>Shirt size</label><select name="shirtSize" defaultValue="M"><option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>2XL</option></select></div></div>
          </section>

          {registrationType === "TEAM" && (
            <section className="reg-section roster-section">
              <div className="reg-section-title roster-title"><span>03</span><div><h2>Build your roster</h2><p>You are athlete #1. Add each teammate below.</p></div><b>{teammates.length + 1} athletes</b></div>
              <div className="captain-card"><span>01</span><div><strong>Captain</strong><small>Primary contact · included</small></div><em>YOU</em></div>
              {teammates.map((teammate, index) => (
                <div className="athlete-card" key={teammate.id}>
                  <div className="athlete-card-head"><span>{String(index + 2).padStart(2, "0")}</span><div><small>Roster spot</small><h3>Athlete {index + 2}</h3></div>{teammates.length > 1 && <button type="button" onClick={() => removeTeammate(teammate.id)}>Remove</button>}</div>
                  <div className="form-row"><div><label>First name</label><input value={teammate.firstName} onChange={(e) => updateTeammate(teammate.id, "firstName", e.target.value)} required /></div><div><label>Last name</label><input value={teammate.lastName} onChange={(e) => updateTeammate(teammate.id, "lastName", e.target.value)} required /></div></div>
                  <div><label>Email</label><input type="email" value={teammate.email} onChange={(e) => updateTeammate(teammate.id, "email", e.target.value)} required /></div>
                  <div className="form-row"><div><label>Gender</label><select value={teammate.gender} onChange={(e) => updateTeammate(teammate.id, "gender", e.target.value)} required><option value="" disabled>Select</option><option>Male</option><option>Female</option></select></div><div><label>Shirt size</label><select value={teammate.shirtSize} onChange={(e) => updateTeammate(teammate.id, "shirtSize", e.target.value)}><option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>2XL</option></select></div></div>
                  <div><label>Gym / Affiliate</label><input value={teammate.gym} onChange={(e) => updateTeammate(teammate.id, "gym", e.target.value)} placeholder="Optional" /></div>
                </div>
              ))}
              {teammates.length < 4 && <button type="button" className="add-athlete" onClick={addTeammate}><b>+</b><span><strong>Add teammate</strong><small>Open another roster spot</small></span></button>}
            </section>
          )}

          <section className="reg-section">
            <div className="reg-section-title"><span>{registrationType === "TEAM" ? "04" : "03"}</span><div><h2>Emergency contact</h2><p>Someone we can reach on competition day.</p></div></div>
            <div className="form-row"><div><label>Contact name</label><input name="emergencyName" required /></div><div><label>Contact phone</label><input name="emergencyPhone" type="tel" required /></div></div>
          </section>

          <section className="reg-section">
            <div className="reg-section-title"><span>{registrationType === "TEAM" ? "05" : "04"}</span><div><h2>Waiver & policies</h2><p>Final legal copy will live here before launch.</p></div></div>
            <div className="waiver-box"><strong>Participant waiver placeholder</strong><p>The final Training Day Games participation waiver, assumption of risk, media release and event policies will appear here before registration opens.</p></div>
            <label className="check-row"><input name="waiver" type="checkbox" required /><span>I have read and agree to the Training Day Games waiver and event policies.</span></label>
          </section>

          {error && <div className="form-error">{error}</div>}
          <button className="submit-registration" disabled={loading}>{loading ? "Opening checkout..." : registrationType === "TEAM" ? "Lock in your team" : "Lock in your spot"}<span>→</span></button>
        </form>

        <aside className="entry-pass">
          <div className="entry-pass-image"><img src={tdgLogo} alt="Training Day Games" /></div>
          <div className="entry-pass-body">
            <div className="micro-label">Your entry</div>
            <h2>{division}</h2>
            <div className="pass-row"><span>Format</span><strong>{registrationType === "TEAM" ? "Team" : "Individual"}</strong></div>
            {registrationType === "TEAM" && <div className="pass-row"><span>Roster</span><strong>{teammates.length + 1} athletes</strong></div>}
            <div className="pass-row"><span>Location</span><strong>Miami, FL</strong></div>
            <div className="pass-note">Your registration is confirmed only after payment is completed.</div>
          </div>
        </aside>
      </div>
    </main>
  );
}

function RegistrationLoading() {
  return <main className="register-page"><div className="container"><p>Loading registration…</p></div></main>;
}

export default function RegisterPage() {
  return <Suspense fallback={<RegistrationLoading />}><RegistrationForm /></Suspense>;
}
