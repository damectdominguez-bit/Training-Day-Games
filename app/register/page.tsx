"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import "./register-v3.css";

type Athlete = { id:number; firstName:string; lastName:string; email:string; gender:string; shirtSize:string; gym:string };
type Captain = { firstName:string; lastName:string; email:string; phone:string; gender:string; birthDate:string; gym:string; shirtSize:string };

const blankAthlete = (id:number): Athlete => ({ id, firstName:"", lastName:"", email:"", gender:"", shirtSize:"M", gym:"" });
const blankCaptain: Captain = { firstName:"", lastName:"", email:"", phone:"", gender:"", birthDate:"", gym:"", shirtSize:"M" };

function RegistrationWizard(){
  const params = useSearchParams();
  const [division,setDivision] = useState(params.get("division") || "Intermediate");
  const [type,setType] = useState<"INDIVIDUAL"|"TEAM">(params.get("type") === "team" ? "TEAM" : "INDIVIDUAL");
  const [teamName,setTeamName] = useState("");
  const [captain,setCaptain] = useState<Captain>(blankCaptain);
  const [teammates,setTeammates] = useState<Athlete[]>([blankAthlete(1)]);
  const [editing,setEditing] = useState(1);
  const [emergencyName,setEmergencyName] = useState("");
  const [emergencyPhone,setEmergencyPhone] = useState("");
  const [waiver,setWaiver] = useState(false);
  const [step,setStep] = useState(0);
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");

  const steps = useMemo(() => type === "TEAM" ? ["Entry","Captain","Roster","Safety","Review"] : ["Entry","Athlete","Safety","Review"], [type]);
  const current = steps[step];
  const last = steps.length - 1;

  const updateCaptain = (field:keyof Captain,value:string) => setCaptain(c => ({...c,[field]:value}));
  const updateMate = (id:number,field:keyof Athlete,value:string) => setTeammates(all => all.map(a => a.id===id ? {...a,[field]:value} : a));
  const go = (n:number) => { setStep(Math.max(0,Math.min(n,last))); setError(""); window.scrollTo({top:0,behavior:"smooth"}); };

  function addMate(){
    if(teammates.length>=4) return;
    const id=Math.max(0,...teammates.map(t=>t.id))+1;
    setTeammates(t=>[...t,blankAthlete(id)]);
    setEditing(id);
  }
  function removeMate(id:number){
    const next=teammates.filter(t=>t.id!==id);
    setTeammates(next);
    if(editing===id && next[0]) setEditing(next[0].id);
  }

  async function checkout(){
    if(!waiver){ setError("Please accept the waiver and event policies before continuing."); return; }
    setLoading(true); setError("");
    try{
      const response=await fetch("/api/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        division,registrationType:type,teamName:type==="TEAM"?teamName:"",...captain,
        emergencyName,emergencyPhone,waiver:"on",teammates:type==="TEAM"?teammates:[]
      })});
      const data=await response.json();
      if(!response.ok) throw new Error(data.error || "Registration could not be started.");
      window.location.href=data.url;
    }catch(e){ setError(e instanceof Error?e.message:"Registration could not be started."); setLoading(false); }
  }

  return <main className="v3-page">
    <div className="v3-shell">
      <div className="v3-topbar">
        <div className="v3-brand">TRAINING DAY <span>GAMES</span></div>
        <div className="v3-status">Registration Open</div>
        <button className="v3-exit" onClick={()=>history.back()}>Exit registration ↗</button>
      </div>

      <section className="v3-hero">
        <div>
          <div className="v3-hero-kicker">Miami · 2027 · Official athlete entry</div>
          <h1>YOUR SPOT.<br/><em>YOUR DAY.</em></h1>
        </div>
        <div className="v3-credential">
          <small>TDG / Entry credential</small>
          <strong>{division}<br/>{type==="TEAM"?"Team":"Individual"}</strong>
          <div className="v3-credential-row"><span>Miami, FL</span><span>{type==="TEAM"?`${teammates.length+1} athletes`:"1 athlete"}</span></div>
        </div>
      </section>

      <div className="v3-progress">{steps.map((_,i)=><div key={i} className={`v3-progress-item ${i<step?"done":i===step?"active":""}`}/>)}</div>
      <div className="v3-progress-labels"><b>{String(step+1).padStart(2,"0")} / {String(steps.length).padStart(2,"0")} · {current}</b><span>{steps.join("  /  ")}</span></div>

      <div className="v3-stage">
        <aside className="v3-step-index">
          <div className="v3-step-number">{String(step+1).padStart(2,"0")}</div>
          <div className="v3-step-name">{current}</div>
          <div className="v3-step-note">{current==="Entry"?"Choose how you want to compete.":current==="Roster"?"Build the lineup before checkout.":current==="Review"?"Make sure everything looks right.":"Only the information we actually need."}</div>
        </aside>

        <section className="v3-card v3-form">
          {current==="Entry" && <>
            <div className="v3-kicker">Start here</div>
            <h2>Pick your division.</h2>
            <p className="v3-lede">Three fields. One competition. Choose the level that fits, then tell us whether you’re coming solo or bringing a team.</p>
            <div className="v3-choice-grid">
              {[["RX","RX","Full standards"],["Intermediate","INT","Competitive"],["Scaled","SCL","Open field"]].map(([name,code,copy])=><button key={name} className={`v3-choice ${division===name?"active":""}`} onClick={()=>setDivision(name)}><span className="v3-choice-check">{division===name?"✓":""}</span><div className="v3-choice-code">{code}</div><small>{copy}</small></button>)}
            </div>
            <div className="v3-format-grid">
              <button className={`v3-format ${type==="INDIVIDUAL"?"active":""}`} onClick={()=>setType("INDIVIDUAL")}><span className="v3-format-icon">01</span><div><strong>Individual</strong><span>One athlete. One entry.</span></div></button>
              <button className={`v3-format ${type==="TEAM"?"active":""}`} onClick={()=>setType("TEAM")}><span className="v3-format-icon">+</span><div><strong>Team</strong><span>Captain builds the roster.</span></div></button>
            </div>
            {type==="TEAM" && <div className="v3-field"><label>Team name</label><input value={teamName} onChange={e=>setTeamName(e.target.value)} placeholder="Give the squad a name"/></div>}
            <div className="v3-actions"><span/><button className="v3-next" onClick={()=>go(1)}>Continue <span>→</span></button></div>
          </>}

          {(current==="Captain"||current==="Athlete") && <>
            <div className="v3-kicker">{type==="TEAM"?"Team captain":"Athlete profile"}</div>
            <h2>{type==="TEAM"?"Who’s leading?":"Tell us who you are."}</h2>
            <p className="v3-lede">This becomes the primary athlete and contact attached to the registration.</p>
            <div className="v3-row"><div><label>First name</label><input value={captain.firstName} onChange={e=>updateCaptain("firstName",e.target.value)}/></div><div><label>Last name</label><input value={captain.lastName} onChange={e=>updateCaptain("lastName",e.target.value)}/></div></div>
            <div className="v3-row"><div><label>Email</label><input type="email" value={captain.email} onChange={e=>updateCaptain("email",e.target.value)}/></div><div><label>Phone</label><input value={captain.phone} onChange={e=>updateCaptain("phone",e.target.value)}/></div></div>
            <div className="v3-row"><div><label>Gender</label><select value={captain.gender} onChange={e=>updateCaptain("gender",e.target.value)}><option value="">Select</option><option>Male</option><option>Female</option></select></div><div><label>Date of birth</label><input type="date" value={captain.birthDate} onChange={e=>updateCaptain("birthDate",e.target.value)}/></div></div>
            <div className="v3-row"><div><label>Gym / Affiliate</label><input value={captain.gym} onChange={e=>updateCaptain("gym",e.target.value)} placeholder="Optional"/></div><div><label>Shirt size</label><select value={captain.shirtSize} onChange={e=>updateCaptain("shirtSize",e.target.value)}><option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>2XL</option></select></div></div>
            <div className="v3-actions"><button className="v3-back" onClick={()=>go(step-1)}>← Back</button><button className="v3-next" onClick={()=>go(step+1)}>{type==="TEAM"?"Build roster":"Continue"}<span>→</span></button></div>
          </>}

          {current==="Roster" && <>
            <div className="v3-roster-top"><div><div className="v3-kicker">Team lineup</div><h2>Build your roster.</h2></div><div className="v3-count">{teammates.length+1} athletes</div></div>
            <div className="v3-captain"><span>01</span><div><strong>{captain.firstName||"Captain"} {captain.lastName}</strong><small>Primary contact · locked</small></div><em>YOU</em></div>
            <div className="v3-roster-list">{teammates.map((a,i)=><div className="v3-athlete" key={a.id}><span>{String(i+2).padStart(2,"0")}</span><div><strong>{a.firstName||`Athlete ${i+2}`} {a.lastName}</strong><small>{a.email||"Details not complete"}</small></div><button onClick={()=>setEditing(a.id)}>Edit</button></div>)}</div>
            {teammates.length<4 && <button className="v3-add" onClick={addMate}><b>+</b><span><strong>Add teammate</strong><small>Open another roster spot</small></span></button>}
            {teammates.filter(a=>a.id===editing).map(a=><div className="v3-edit" key={a.id}><div className="v3-edit-head"><h3>Athlete details</h3>{teammates.length>1&&<button onClick={()=>removeMate(a.id)}>Remove athlete</button>}</div><div className="v3-row"><div><label>First name</label><input value={a.firstName} onChange={e=>updateMate(a.id,"firstName",e.target.value)}/></div><div><label>Last name</label><input value={a.lastName} onChange={e=>updateMate(a.id,"lastName",e.target.value)}/></div></div><div className="v3-row"><div><label>Email</label><input value={a.email} onChange={e=>updateMate(a.id,"email",e.target.value)}/></div><div><label>Gender</label><select value={a.gender} onChange={e=>updateMate(a.id,"gender",e.target.value)}><option value="">Select</option><option>Male</option><option>Female</option></select></div></div><div className="v3-row"><div><label>Gym / Affiliate</label><input value={a.gym} onChange={e=>updateMate(a.id,"gym",e.target.value)} placeholder="Optional"/></div><div><label>Shirt size</label><select value={a.shirtSize} onChange={e=>updateMate(a.id,"shirtSize",e.target.value)}><option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>2XL</option></select></div></div></div>)}
            <div className="v3-actions"><button className="v3-back" onClick={()=>go(step-1)}>← Back</button><button className="v3-next" onClick={()=>go(step+1)}>Continue <span>→</span></button></div>
          </>}

          {current==="Safety" && <>
            <div className="v3-kicker">Safety + waiver</div><h2>Almost there.</h2><p className="v3-lede">Emergency details and the event waiver. Then you’ll get one clean review screen.</p>
            <div className="v3-row"><div><label>Emergency contact</label><input value={emergencyName} onChange={e=>setEmergencyName(e.target.value)}/></div><div><label>Emergency phone</label><input value={emergencyPhone} onChange={e=>setEmergencyPhone(e.target.value)}/></div></div>
            <div className="v3-waiver"><strong>Participant waiver placeholder</strong>The final Training Day Games participation waiver, assumption of risk, media release and event policies will appear here before registration opens.</div>
            <label className="v3-checkrow"><input type="checkbox" checked={waiver} onChange={e=>setWaiver(e.target.checked)}/><span>I have read and agree to the Training Day Games waiver and event policies.</span></label>
            <div className="v3-actions"><button className="v3-back" onClick={()=>go(step-1)}>← Back</button><button className="v3-next" onClick={()=>go(step+1)}>Review entry <span>→</span></button></div>
          </>}

          {current==="Review" && <>
            <div className="v3-kicker">Final review</div><h2>Ready to lock it in?</h2><p className="v3-lede">This is what will be attached to your payment and competition record.</p>
            <div className="v3-review">
              <div className="v3-review-card"><div><span>Competition</span><strong>{division} · {type==="TEAM"?"Team":"Individual"}</strong></div><button onClick={()=>go(0)}>Edit</button></div>
              <div className="v3-review-card"><div><span>{type==="TEAM"?"Captain":"Athlete"}</span><strong>{captain.firstName||"—"} {captain.lastName}</strong></div><button onClick={()=>go(1)}>Edit</button></div>
              {type==="TEAM"&&<div className="v3-review-card"><div><span>Roster</span><strong>{teammates.length+1} athletes · {teamName||"Team name not set"}</strong></div><button onClick={()=>go(2)}>Edit</button></div>}
              <div className="v3-review-card"><div><span>Emergency contact</span><strong>{emergencyName||"—"}</strong></div><button onClick={()=>go(type==="TEAM"?3:2)}>Edit</button></div>
            </div>
            {error&&<div className="v3-error">{error}</div>}
            <button className="v3-pay" onClick={checkout} disabled={loading}>{loading?"Opening secure checkout...":"Lock in the entry"}<span>→</span></button>
            <div className="v3-actions"><button className="v3-back" onClick={()=>go(step-1)}>← Back</button><span/></div>
          </>}
        </section>
      </div>
    </div>
  </main>
}

function Loading(){return <main style={{padding:40}}>Loading registration…</main>}
export default function RegisterPage(){return <Suspense fallback={<Loading/>}><RegistrationWizard/></Suspense>}
