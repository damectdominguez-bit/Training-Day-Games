"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import "./register-v5.css";

type Athlete={id:number;firstName:string;lastName:string;email:string;gender:string;shirtSize:string;gym:string};
type Captain={firstName:string;lastName:string;email:string;phone:string;gender:string;birthDate:string;gym:string;shirtSize:string};
const blankAthlete=(id:number):Athlete=>({id,firstName:"",lastName:"",email:"",gender:"",shirtSize:"M",gym:""});
const blankCaptain:Captain={firstName:"",lastName:"",email:"",phone:"",gender:"",birthDate:"",gym:"",shirtSize:"M"};
const prices:Record<string,number>={RX:199,Intermediate:179,Scaled:159};

function RegistrationWizard(){
  const params=useSearchParams();
  const [division,setDivision]=useState(params.get("division")||"Intermediate");
  const [type,setType]=useState<"INDIVIDUAL"|"TEAM">(params.get("type")==="team"?"TEAM":"INDIVIDUAL");
  const [teamName,setTeamName]=useState("");
  const [captain,setCaptain]=useState<Captain>(blankCaptain);
  const [teammates,setTeammates]=useState<Athlete[]>([blankAthlete(1)]);
  const [editing,setEditing]=useState(1);
  const [emergencyName,setEmergencyName]=useState("");
  const [emergencyPhone,setEmergencyPhone]=useState("");
  const [waiver,setWaiver]=useState(false);
  const [step,setStep]=useState(0);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState("");
  const steps=useMemo(()=>type==="TEAM"?["Entry","Captain","Roster","Safety","Review"]:["Entry","Athlete","Safety","Review"],[type]);
  const current=steps[step];
  const last=steps.length-1;
  const total=prices[division]??0;
  const updateCaptain=(field:keyof Captain,value:string)=>setCaptain(c=>({...c,[field]:value}));
  const updateMate=(id:number,field:keyof Athlete,value:string)=>setTeammates(all=>all.map(a=>a.id===id?{...a,[field]:value}:a));
  const go=(n:number)=>{setError("");setStep(Math.max(0,Math.min(n,last)));};
  function addMate(){if(teammates.length>=4)return;const id=Math.max(0,...teammates.map(t=>t.id))+1;setTeammates(t=>[...t,blankAthlete(id)]);setEditing(id)}
  function removeMate(id:number){const next=teammates.filter(t=>t.id!==id);setTeammates(next);if(editing===id&&next[0])setEditing(next[0].id)}
  async function checkout(){
    if(!waiver){setError("Please accept the waiver and event policies before continuing.");return}
    setLoading(true);setError("");
    try{
      const response=await fetch("/api/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({division,registrationType:type,teamName:type==="TEAM"?teamName:"",...captain,emergencyName,emergencyPhone,waiver:"on",teammates:type==="TEAM"?teammates:[]})});
      const data=await response.json();if(!response.ok)throw new Error(data.error||"Registration could not be started.");window.location.href=data.url;
    }catch(e){setError(e instanceof Error?e.message:"Registration could not be started.");setLoading(false)}
  }
  const heading=current==="Entry"?"Pick your division.":current==="Captain"?"Who’s leading?":current==="Athlete"?"Tell us who you are.":current==="Roster"?"Build your roster.":current==="Safety"?"Almost there.":"Ready to lock it in?";
  const sub=current==="Entry"?"Choose the level, then choose how you’re competing.":current==="Roster"?"Your full team stays together under one entry.":current==="Review"?"Check the essentials before secure payment.":"Only the information we actually need.";

  return <main className="v5-page"><div className="v5-shell">
    <header className="v5-topbar">
      <div className="v5-brand">TRAINING DAY <span>GAMES</span></div>
      <div className="v5-progress">{steps.map((_,i)=><i key={i} className={i<step?"done":i===step?"active":""}/>)}</div>
      <div className="v5-meta"><span>{String(step+1).padStart(2,"0")} / {String(steps.length).padStart(2,"0")} · {current}</span><button className="v5-exit" onClick={()=>history.back()}>Exit ↗</button></div>
    </header>

    <section className="v5-banner">
      <div className="v5-banner-copy"><div><div className="v5-banner-kicker">Miami · 2027 · Official athlete entry</div><h1>YOUR SPOT. <em>YOUR DAY.</em></h1></div><p className="v5-banner-note">The version you liked — just compressed so the active step stays on one screen.</p></div>
      <div className="v5-mini-pass"><small>TDG / Entry credential</small><strong>{division}<br/>{type==="TEAM"?"Team":"Individual"}</strong><div><span>Miami, FL</span><span>{type==="TEAM"?`${teammates.length+1} athletes`:"1 athlete"}</span></div></div>
    </section>

    <div className="v5-main">
      <section className="v5-panel v5-form">
        <div className="v5-head"><div><div className="v5-kicker">{current}</div><h2>{heading}</h2><p>{sub}</p></div><div className="v5-step">{String(step+1).padStart(2,"0")}</div></div>
        <div className="v5-content">
          {current==="Entry"&&<>
            <div className="v5-choice-grid">{[["RX","RX","Full standards"],["Intermediate","INT","Competitive"],["Scaled","SCL","Open field"]].map(([name,code,label])=><button key={name} className={`v5-choice ${division===name?"active":""}`} onClick={()=>setDivision(name)}><span className="v5-check">{division===name?"✓":""}</span><div className="v5-choice-code">{code}</div><small>{label}</small></button>)}</div>
            <div className="v5-format-grid"><button className={`v5-format ${type==="INDIVIDUAL"?"active":""}`} onClick={()=>setType("INDIVIDUAL")}><span>01</span><div><strong>Individual</strong><small>One athlete. One entry.</small></div></button><button className={`v5-format ${type==="TEAM"?"active":""}`} onClick={()=>setType("TEAM")}><span>02</span><div><strong>Team</strong><small>Captain controls the roster.</small></div></button></div>
            {type==="TEAM"&&<div className="v5-teamname"><label>Team name</label><input value={teamName} onChange={e=>setTeamName(e.target.value)} placeholder="Give the squad a name"/></div>}
          </>}
          {(current==="Captain"||current==="Athlete")&&<><div className="v5-row"><div><label>First name</label><input value={captain.firstName} onChange={e=>updateCaptain("firstName",e.target.value)}/></div><div><label>Last name</label><input value={captain.lastName} onChange={e=>updateCaptain("lastName",e.target.value)}/></div></div><div className="v5-row"><div><label>Email</label><input type="email" value={captain.email} onChange={e=>updateCaptain("email",e.target.value)}/></div><div><label>Phone</label><input value={captain.phone} onChange={e=>updateCaptain("phone",e.target.value)}/></div></div><div className="v5-row"><div><label>Gender</label><select value={captain.gender} onChange={e=>updateCaptain("gender",e.target.value)}><option value="">Select</option><option>Male</option><option>Female</option></select></div><div><label>Date of birth</label><input type="date" value={captain.birthDate} onChange={e=>updateCaptain("birthDate",e.target.value)}/></div></div><div className="v5-row"><div><label>Gym / Affiliate</label><input value={captain.gym} onChange={e=>updateCaptain("gym",e.target.value)} placeholder="Optional"/></div><div><label>Shirt size</label><select value={captain.shirtSize} onChange={e=>updateCaptain("shirtSize",e.target.value)}><option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>2XL</option></select></div></div></>}
          {current==="Roster"&&<div className="v5-roster-wrap"><div className="v5-roster-list"><div className="v5-captain"><span>01</span><div><strong>{captain.firstName||"Captain"} {captain.lastName}</strong><small>Primary contact</small></div><em>YOU</em></div>{teammates.map((a,i)=><div className="v5-athlete" key={a.id}><span>{String(i+2).padStart(2,"0")}</span><div><strong>{a.firstName||`Athlete ${i+2}`} {a.lastName}</strong><small>{a.email||"Details not complete"}</small></div><button onClick={()=>setEditing(a.id)}>Edit</button></div>)}{teammates.length<4&&<button className="v5-add" onClick={addMate}><b>+</b><span><strong>Add teammate</strong><small>Open another roster spot</small></span></button>}</div>{teammates.filter(a=>a.id===editing).map(a=><div className="v5-edit" key={a.id}><div className="v5-edit-head"><h3>Athlete {teammates.findIndex(t=>t.id===a.id)+2}</h3>{teammates.length>1&&<button onClick={()=>removeMate(a.id)}>Remove athlete</button>}</div><div className="v5-row"><div><label>First name</label><input value={a.firstName} onChange={e=>updateMate(a.id,"firstName",e.target.value)}/></div><div><label>Last name</label><input value={a.lastName} onChange={e=>updateMate(a.id,"lastName",e.target.value)}/></div></div><div className="v5-row"><div><label>Email</label><input value={a.email} onChange={e=>updateMate(a.id,"email",e.target.value)}/></div><div><label>Gender</label><select value={a.gender} onChange={e=>updateMate(a.id,"gender",e.target.value)}><option value="">Select</option><option>Male</option><option>Female</option></select></div></div><div className="v5-row"><div><label>Gym / Affiliate</label><input value={a.gym} onChange={e=>updateMate(a.id,"gym",e.target.value)} placeholder="Optional"/></div><div><label>Shirt size</label><select value={a.shirtSize} onChange={e=>updateMate(a.id,"shirtSize",e.target.value)}><option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>2XL</option></select></div></div></div>)}</div>}
          {current==="Safety"&&<><div className="v5-row"><div><label>Emergency contact</label><input value={emergencyName} onChange={e=>setEmergencyName(e.target.value)}/></div><div><label>Emergency phone</label><input value={emergencyPhone} onChange={e=>setEmergencyPhone(e.target.value)}/></div></div><div className="v5-waiver"><strong>Participant waiver placeholder</strong>The final Training Day Games participation waiver, assumption of risk, media release and event policies will appear here before registration opens.</div><label className="v5-checkrow"><input type="checkbox" checked={waiver} onChange={e=>setWaiver(e.target.checked)}/><span>I have read and agree to the Training Day Games waiver and event policies.</span></label></>}
          {current==="Review"&&<><div className="v5-review"><div className="v5-review-card"><div><span>Competition</span><strong>{division} · {type==="TEAM"?"Team":"Individual"}</strong></div><button onClick={()=>go(0)}>Edit</button></div><div className="v5-review-card"><div><span>{type==="TEAM"?"Captain":"Athlete"}</span><strong>{captain.firstName||"—"} {captain.lastName}</strong></div><button onClick={()=>go(1)}>Edit</button></div>{type==="TEAM"&&<div className="v5-review-card"><div><span>Roster</span><strong>{teammates.length+1} athletes · {teamName||"Team name not set"}</strong></div><button onClick={()=>go(2)}>Edit</button></div>}<div className="v5-review-card"><div><span>Emergency contact</span><strong>{emergencyName||"—"}</strong></div><button onClick={()=>go(type==="TEAM"?3:2)}>Edit</button></div></div>{error&&<div className="v5-error">{error}</div>}</>}
        </div>
        <div className="v5-actions">{step>0?<button className="v5-back" onClick={()=>go(step-1)}>← Back</button>:<span/>}{current!=="Review"?<button className="v5-next" onClick={()=>go(step+1)}>Continue <span>→</span></button>:<button className="v5-pay" onClick={checkout} disabled={loading}>{loading?"Opening checkout...":"Lock in entry"}<span>→</span></button>}</div>
      </section>

      <aside className="v5-side"><div className="v5-event-card"><div className="v5-event-top"><span>Official entry card</span><span>TDG / 2027</span></div><div className="v5-event-main"><small>Training Day Games</small><h3>CLAIM<br/>YOUR DAY.</h3><p>Your event details stay visible while you register. No receipt-copy layout — this is your TDG credential.</p></div><div className="v5-event-data"><div><span>Location</span><strong>Miami, FL</strong></div><div><span>Date</span><strong>Summer 2027</strong></div><div><span>Division</span><strong>{division}</strong></div><div><span>Format</span><strong>{type==="TEAM"?"Team":"Individual"}</strong></div>{type==="TEAM"&&<div><span>Roster</span><strong>{teammates.length+1} athletes</strong></div>}</div><div className="v5-total"><span>Total due</span><strong>${total}</strong></div></div></aside>
    </div>
  </div></main>
}
function Loading(){return <main style={{padding:40}}>Loading registration…</main>}
export default function RegisterPage(){return <Suspense fallback={<Loading/>}><RegistrationWizard/></Suspense>}
