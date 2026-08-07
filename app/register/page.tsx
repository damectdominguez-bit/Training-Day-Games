"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import "./register-v2.css";

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
  const last = steps.length - 1;
  const progress = ((step + 1) / steps.length) * 100;
  const updateCaptain = (field:keyof Captain,value:string) => setCaptain(c => ({...c,[field]:value}));
  const updateMate = (id:number,field:keyof Athlete,value:string) => setTeammates(all => all.map(a => a.id===id ? {...a,[field]:value} : a));

  function addMate(){
    if(teammates.length>=4) return;
    const id = Math.max(0,...teammates.map(t=>t.id))+1;
    setTeammates(t=>[...t,blankAthlete(id)]); setEditing(id);
  }
  function removeMate(id:number){
    const next=teammates.filter(t=>t.id!==id); setTeammates(next); if(editing===id && next[0]) setEditing(next[0].id);
  }
  function next(){ setError(""); setStep(s=>Math.min(s+1,last)); window.scrollTo({top:0,behavior:"smooth"}); }
  function back(){ setError(""); setStep(s=>Math.max(s-1,0)); window.scrollTo({top:0,behavior:"smooth"}); }

  async function checkout(){
    if(!waiver){ setError("Please accept the waiver and event policies before continuing."); return; }
    setLoading(true); setError("");
    try{
      const response=await fetch("/api/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        division, registrationType:type, teamName:type==="TEAM"?teamName:"", ...captain,
        emergencyName, emergencyPhone, waiver:"on", teammates:type==="TEAM"?teammates:[]
      })});
      const data=await response.json();
      if(!response.ok) throw new Error(data.error || "Registration could not be started.");
      window.location.href=data.url;
    }catch(e){ setError(e instanceof Error?e.message:"Registration could not be started."); setLoading(false); }
  }

  const stageTitle = step===0 ? "PICK YOUR FIGHT." : step===1 ? (type==="TEAM"?"LEAD THE TEAM.":"THIS IS YOU.") : steps[step]==="Roster" ? "BUILD THE SQUAD." : steps[step]==="Safety" ? "READY IS READY." : "ONE LAST LOOK.";
  const stageCopy = step===0 ? "Choose the field. Choose how you enter. Everything after this is built around that decision." : step===1 ? "No profile page. No account setup maze. Just the athlete information we actually need." : steps[step]==="Roster" ? "Every teammate lives inside the same entry. One captain. One roster. One checkout." : steps[step]==="Safety" ? "Emergency details and the event waiver live together in one final responsibility step." : "Review the entry, then lock it in with one secure payment.";

  return <main className="v2-page">
    <aside className="v2-stage">
      <div className="v2-stage-top"><span>Training Day Games / 2027</span><span>Miami, FL</span></div>
      <div className="v2-stage-main"><small>{String(step+1).padStart(2,"0")} / {String(steps.length).padStart(2,"0")} · {steps[step]}</small><h1>{stageTitle}</h1><p>{stageCopy}</p></div>
      <div className="v2-stage-bottom">
        <div><span>Division</span><strong>{division}</strong></div>
        <div><span>Format</span><strong>{type==="TEAM"?"Team":"Individual"}</strong></div>
        <div><span>Entry</span><strong>{type==="TEAM"?`${teammates.length+1} athletes`:"1 athlete"}</strong></div>
      </div>
    </aside>

    <section className="v2-work">
      <div className="v2-topbar"><button className="v2-back" onClick={step?back:()=>history.back()}>{step?"← Back":"← Exit"}</button><div className="v2-step-meta"><span>Step</span><b>{String(step+1).padStart(2,"0")}</b><span>of {String(steps.length).padStart(2,"0")}</span></div></div>
      <div className="v2-progress"><i style={{width:`${progress}%`}}/></div>
      <div className="v2-content v2-form">
        {step===0 && <>
          <div className="v2-kicker">Start here</div><h2>Choose your entry.</h2><p className="v2-lede">No long form yet. First, tell us where you belong.</p>
          <div className="v2-choice-grid">{[["RX","RX","Advanced","Full standards. Full test."],["Intermediate","INT","Competitive","Built for experienced competitors."],["Scaled","SCL","Open","Big-event feel with accessible standards."]].map(([name,code,tag,copy])=><button key={name} className={`v2-choice ${division===name?"active":""}`} onClick={()=>setDivision(name)}><span className="v2-check">{division===name?"✓":""}</span><span className="v2-choice-code">{code}</span><span className="v2-choice-tag">{tag}</span><strong>{name}</strong><p>{copy}</p></button>)}</div>
          <div className="v2-format-grid">
            <button className={`v2-format ${type==="INDIVIDUAL"?"active":""}`} onClick={()=>{setType("INDIVIDUAL"); if(step>3)setStep(0)}}><span className="v2-format-num">01</span><div><strong>Individual</strong><p>One athlete. One result. One entry.</p></div></button>
            <button className={`v2-format ${type==="TEAM"?"active":""}`} onClick={()=>setType("TEAM")}><span className="v2-format-num">02</span><div><strong>Team</strong><p>Captain controls the roster and payment.</p></div></button>
          </div>
          {type==="TEAM" && <div className="v2-teamname"><label>Team name</label><input value={teamName} onChange={e=>setTeamName(e.target.value)} placeholder="Give the squad a name"/></div>}
          <div className="v2-actions"><span/><button className="v2-next" onClick={next}>Build entry <span>→</span></button></div>
        </>}

        {step===1 && <>
          <div className="v2-kicker">{type==="TEAM"?"Captain":"Athlete"}</div><h2>{type==="TEAM"?"Lead the entry.":"Your details."}</h2><p className="v2-lede">Just the essentials. This information becomes the primary athlete profile for the registration.</p>
          <div className="v2-row"><div><label>First name</label><input value={captain.firstName} onChange={e=>updateCaptain("firstName",e.target.value)}/></div><div><label>Last name</label><input value={captain.lastName} onChange={e=>updateCaptain("lastName",e.target.value)}/></div></div>
          <div className="v2-row"><div><label>Email</label><input type="email" value={captain.email} onChange={e=>updateCaptain("email",e.target.value)}/></div><div><label>Phone</label><input value={captain.phone} onChange={e=>updateCaptain("phone",e.target.value)}/></div></div>
          <div className="v2-row"><div><label>Gender</label><select value={captain.gender} onChange={e=>updateCaptain("gender",e.target.value)}><option value="">Select</option><option>Male</option><option>Female</option></select></div><div><label>Date of birth</label><input type="date" value={captain.birthDate} onChange={e=>updateCaptain("birthDate",e.target.value)}/></div></div>
          <div className="v2-row"><div><label>Gym / Affiliate</label><input value={captain.gym} onChange={e=>updateCaptain("gym",e.target.value)} placeholder="Optional"/></div><div><label>Shirt size</label><select value={captain.shirtSize} onChange={e=>updateCaptain("shirtSize",e.target.value)}><option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>2XL</option></select></div></div>
          <div className="v2-actions"><button className="v2-secondary" onClick={back}>Back</button><button className="v2-next" onClick={next}>{type==="TEAM"?"Build roster":"Continue"}<span>→</span></button></div>
        </>}

        {type==="TEAM" && steps[step]==="Roster" && <>
          <div className="v2-roster-head"><div><div className="v2-kicker">Team roster</div><h2>Build the squad.</h2></div><div className="v2-roster-count">{teammates.length+1} athletes</div></div>
          <div className="v2-captain-banner"><span>01</span><div><strong>{captain.firstName||"Captain"} {captain.lastName}</strong><small>Primary contact · locked roster spot</small></div><em>YOU</em></div>
          <div className="v2-roster-list">{teammates.map((a,i)=><div className="v2-athlete-row" key={a.id}><span>{String(i+2).padStart(2,"0")}</span><div><strong>{a.firstName||`Athlete ${i+2}`} {a.lastName}</strong><small>{a.email||"Details not complete"}</small></div><button onClick={()=>setEditing(a.id)}>Edit</button></div>)}</div>
          {teammates.length<4 && <button className="v2-add" onClick={addMate}><b>+</b><span><strong>Add teammate</strong><small>Open another roster spot</small></span></button>}
          {teammates.filter(a=>a.id===editing).map(a=><div className="v2-edit-card" key={a.id}><div className="v2-edit-head"><h3>Edit athlete</h3>{teammates.length>1&&<button onClick={()=>removeMate(a.id)}>Remove athlete</button>}</div><div className="v2-row"><div><label>First name</label><input value={a.firstName} onChange={e=>updateMate(a.id,"firstName",e.target.value)}/></div><div><label>Last name</label><input value={a.lastName} onChange={e=>updateMate(a.id,"lastName",e.target.value)}/></div></div><div className="v2-row"><div><label>Email</label><input value={a.email} onChange={e=>updateMate(a.id,"email",e.target.value)}/></div><div><label>Gender</label><select value={a.gender} onChange={e=>updateMate(a.id,"gender",e.target.value)}><option value="">Select</option><option>Male</option><option>Female</option></select></div></div><div className="v2-row"><div><label>Gym / Affiliate</label><input value={a.gym} onChange={e=>updateMate(a.id,"gym",e.target.value)} placeholder="Optional"/></div><div><label>Shirt size</label><select value={a.shirtSize} onChange={e=>updateMate(a.id,"shirtSize",e.target.value)}><option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>2XL</option></select></div></div></div>)}
          <div className="v2-actions"><button className="v2-secondary" onClick={back}>Back</button><button className="v2-next" onClick={next}>Continue <span>→</span></button></div>
        </>}

        {steps[step]==="Safety" && <>
          <div className="v2-kicker">Safety + waiver</div><h2>Ready is ready.</h2><p className="v2-lede">One final responsibility step before review.</p>
          <div className="v2-row"><div><label>Emergency contact</label><input value={emergencyName} onChange={e=>setEmergencyName(e.target.value)}/></div><div><label>Emergency phone</label><input value={emergencyPhone} onChange={e=>setEmergencyPhone(e.target.value)}/></div></div>
          <div className="v2-waiver"><strong>Participant waiver placeholder</strong>The final Training Day Games participation waiver, assumption of risk, media release and event policies will appear here before registration opens.</div>
          <label className="v2-checkrow"><input type="checkbox" checked={waiver} onChange={e=>setWaiver(e.target.checked)}/><span>I have read and agree to the Training Day Games waiver and event policies.</span></label>
          <div className="v2-actions"><button className="v2-secondary" onClick={back}>Back</button><button className="v2-next" onClick={next}>Review entry <span>→</span></button></div>
        </>}

        {steps[step]==="Review" && <>
          <div className="v2-kicker">Final review</div><h2>One last look.</h2><p className="v2-lede">This is the entry that will be attached to your payment and competition record.</p>
          <div className="v2-review">
            <div className="v2-review-card"><div><span>Competition</span><strong>{division} · {type==="TEAM"?"Team":"Individual"}</strong></div><button onClick={()=>setStep(0)}>Edit</button></div>
            <div className="v2-review-card"><div><span>{type==="TEAM"?"Captain":"Athlete"}</span><strong>{captain.firstName||"—"} {captain.lastName}</strong></div><button onClick={()=>setStep(1)}>Edit</button></div>
            {type==="TEAM"&&<div className="v2-review-card"><div><span>Roster</span><strong>{teammates.length+1} athletes · {teamName||"Team name not set"}</strong></div><button onClick={()=>setStep(2)}>Edit</button></div>}
            <div className="v2-review-card"><div><span>Emergency contact</span><strong>{emergencyName||"—"}</strong></div><button onClick={()=>setStep(type==="TEAM"?3:2)}>Edit</button></div>
          </div>
          {error&&<div className="v2-error">{error}</div>}
          <button className="v2-pay" onClick={checkout} disabled={loading}>{loading?"Opening secure checkout...":"Lock in the entry"}<span>→</span></button>
          <div className="v2-actions"><button className="v2-secondary" onClick={back}>Back</button><span/></div>
        </>}
      </div>
    </section>
  </main>
}

function Loading(){return <main style={{padding:40}}>Loading registration…</main>}
export default function RegisterPage(){return <Suspense fallback={<Loading/>}><RegistrationWizard/></Suspense>}
