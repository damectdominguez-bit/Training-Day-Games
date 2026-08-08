"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import "./register-v6.css";

type Athlete={id:number;firstName:string;lastName:string;email:string;gender:string;shirtSize:string;gym:string};
type Captain={firstName:string;lastName:string;email:string;phone:string;gender:string;birthDate:string;gym:string;shirtSize:string};
const blankAthlete=(id:number):Athlete=>({id,firstName:"",lastName:"",email:"",gender:"",shirtSize:"M",gym:""});
const blankCaptain:Captain={firstName:"",lastName:"",email:"",phone:"",gender:"",birthDate:"",gym:"",shirtSize:"M"};
const prices:Record<string,number>={RX:199,Intermediate:179,Scaled:159};

function RegistrationWizard(){
  const params=useSearchParams();
  const [division,setDivision]=useState(params.get("division")||"RX");
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

  function addMate(){
    if(teammates.length>=4)return;
    const id=Math.max(0,...teammates.map(t=>t.id))+1;
    setTeammates(t=>[...t,blankAthlete(id)]);
    setEditing(id);
  }
  function removeMate(id:number){
    const next=teammates.filter(t=>t.id!==id);
    setTeammates(next);
    if(editing===id&&next[0])setEditing(next[0].id);
  }

  async function checkout(){
    if(!waiver){setError("Please accept the waiver and event policies before continuing.");return}
    setLoading(true);setError("");
    try{
      const response=await fetch("/api/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({division,registrationType:type,teamName:type==="TEAM"?teamName:"",...captain,emergencyName,emergencyPhone,waiver:"on",teammates:type==="TEAM"?teammates:[]})});
      const data=await response.json();
      if(!response.ok)throw new Error(data.error||"Registration could not be started.");
      window.location.href=data.url;
    }catch(e){
      setError(e instanceof Error?e.message:"Registration could not be started.");
      setLoading(false);
    }
  }

  const heading=current==="Entry"?"Choose your division.":current==="Captain"?"Captain details.":current==="Athlete"?"Athlete details.":current==="Roster"?"Build your team.":current==="Safety"?"Safety + waiver.":"Review your entry.";
  const sub=current==="Entry"?"Pick the field, then choose how you are entering.":current==="Roster"?"Add each teammate under the same registration.":current==="Review"?"Check the details before payment.":"Only the information needed for competition day.";
  const isDark=step>0;

  return <main className="reg6">
    <aside className="reg6-left">
      <div className="reg6-left-top"><span>TDG / 2027</span><span>Miami, FL</span></div>

      <div className="reg6-event-block">
        <div className="reg6-event-kicker">Official athlete registration</div>
        <h1>TRAINING<br/>DAY GAMES</h1>
        <p>One entry, one payment, and the full competition roster in one place.</p>
      </div>

      <div className="reg6-event-data">
        <div><span>Date</span><strong>Aug 17, 2027</strong></div>
        <div><span>Location</span><strong>Miami Fairgrounds & Expo Center</strong></div>
        <div><span>Division</span><strong>{division}</strong></div>
        <div><span>Format</span><strong>{type==="TEAM"?"Team":"Individual"}</strong></div>
        <div><span>Registration fee</span><strong>${total}</strong></div>
        <div className="price"><span>Total</span><strong>${total}</strong></div>
      </div>
    </aside>

    <section className="reg6-right">
      <div className="reg6-top">
        <button className="reg6-exit" onClick={()=>history.back()}>← Exit</button>
        <div className="reg6-progress">{steps.map((_,i)=><i key={i} className={i<step?"done":i===step?"active":""}/>)}</div>
        <div className="reg6-stepmeta">Step {String(step+1).padStart(2,"0")} of {String(steps.length).padStart(2,"0")}</div>
      </div>

      <div className="reg6-stage">
        <section className={`reg6-card reg6-form ${isDark?"dark":""}`}>
          <div className="reg6-head">
            <div><div className="reg6-kicker">{current}</div><h2>{heading}</h2><p>{sub}</p></div>
            <div className="reg6-stepnum">{String(step+1).padStart(2,"0")}</div>
          </div>

          {current==="Entry"&&<>
            <div className="reg6-choice-grid">
              {[["RX","RX","Advanced"],["Intermediate","INT","Competitive"],["Scaled","SCL","Open"]].map(([name,code,label])=><button key={name} className={`reg6-choice ${division===name?"active":""}`} onClick={()=>setDivision(name)}><span className="reg6-check">{division===name?"✓":""}</span><div className="reg6-choice-code">{code}</div><small>{label}</small></button>)}
            </div>
            <div className="reg6-format-grid">
              <button className={`reg6-format ${type==="INDIVIDUAL"?"active":""}`} onClick={()=>setType("INDIVIDUAL")}><span>01</span><div><strong>Individual</strong><small>One athlete. One entry.</small></div></button>
              <button className={`reg6-format ${type==="TEAM"?"active":""}`} onClick={()=>setType("TEAM")}><span>02</span><div><strong>Team</strong><small>Captain controls the roster.</small></div></button>
            </div>
            {type==="TEAM"&&<div className="reg6-teamname"><label>Team name</label><input value={teamName} onChange={e=>setTeamName(e.target.value)} placeholder="Give the squad a name"/></div>}
          </>}

          {(current==="Captain"||current==="Athlete")&&<>
            <div className="reg6-row"><div><label>First name</label><input value={captain.firstName} onChange={e=>updateCaptain("firstName",e.target.value)}/></div><div><label>Last name</label><input value={captain.lastName} onChange={e=>updateCaptain("lastName",e.target.value)}/></div></div>
            <div className="reg6-row"><div><label>Email</label><input type="email" value={captain.email} onChange={e=>updateCaptain("email",e.target.value)}/></div><div><label>Phone</label><input value={captain.phone} onChange={e=>updateCaptain("phone",e.target.value)}/></div></div>
            <div className="reg6-row"><div><label>Gender</label><select value={captain.gender} onChange={e=>updateCaptain("gender",e.target.value)}><option value="">Select</option><option>Male</option><option>Female</option></select></div><div><label>Date of birth</label><input type="date" value={captain.birthDate} onChange={e=>updateCaptain("birthDate",e.target.value)}/></div></div>
            <div className="reg6-row"><div><label>Gym / Affiliate</label><input value={captain.gym} onChange={e=>updateCaptain("gym",e.target.value)} placeholder="Optional"/></div><div><label>Shirt size</label><select value={captain.shirtSize} onChange={e=>updateCaptain("shirtSize",e.target.value)}><option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>2XL</option></select></div></div>
          </>}

          {current==="Roster"&&<div className="reg6-roster">
            <div className="reg6-list">
              <div className="reg6-captain"><span>01</span><div><strong>{captain.firstName||"Captain"} {captain.lastName}</strong><small>Primary contact</small></div><em>YOU</em></div>
              {teammates.map((a,i)=><div className="reg6-athlete" key={a.id}><span>{String(i+2).padStart(2,"0")}</span><div><strong>{a.firstName||`Athlete ${i+2}`} {a.lastName}</strong><small>{a.email||"Details not complete"}</small></div><button onClick={()=>setEditing(a.id)}>Edit</button></div>)}
              {teammates.length<4&&<button className="reg6-add" onClick={addMate}><b>+</b><span><strong>Add teammate</strong><small>Open another roster spot</small></span></button>}
            </div>
            {teammates.filter(a=>a.id===editing).map(a=><div className="reg6-edit" key={a.id}><div className="reg6-edit-head"><h3>Athlete {teammates.findIndex(t=>t.id===a.id)+2}</h3>{teammates.length>1&&<button onClick={()=>removeMate(a.id)}>Remove athlete</button>}</div><div className="reg6-row"><div><label>First name</label><input value={a.firstName} onChange={e=>updateMate(a.id,"firstName",e.target.value)}/></div><div><label>Last name</label><input value={a.lastName} onChange={e=>updateMate(a.id,"lastName",e.target.value)}/></div></div><div className="reg6-row"><div><label>Email</label><input value={a.email} onChange={e=>updateMate(a.id,"email",e.target.value)}/></div><div><label>Gender</label><select value={a.gender} onChange={e=>updateMate(a.id,"gender",e.target.value)}><option value="">Select</option><option>Male</option><option>Female</option></select></div></div><div className="reg6-row"><div><label>Gym / Affiliate</label><input value={a.gym} onChange={e=>updateMate(a.id,"gym",e.target.value)} placeholder="Optional"/></div><div><label>Shirt size</label><select value={a.shirtSize} onChange={e=>updateMate(a.id,"shirtSize",e.target.value)}><option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>2XL</option></select></div></div></div>)}
          </div>}

          {current==="Safety"&&<>
            <div className="reg6-row"><div><label>Emergency contact</label><input value={emergencyName} onChange={e=>setEmergencyName(e.target.value)}/></div><div><label>Emergency phone</label><input value={emergencyPhone} onChange={e=>setEmergencyPhone(e.target.value)}/></div></div>
            <div className="reg6-waiver"><strong>Participant waiver placeholder</strong>The final Training Day Games participation waiver, assumption of risk, media release and event policies will appear here before registration opens.</div>
            <label className="reg6-checkrow"><input type="checkbox" checked={waiver} onChange={e=>setWaiver(e.target.checked)}/><span>I have read and agree to the Training Day Games waiver and event policies.</span></label>
          </>}

          {current==="Review"&&<>
            <div className="reg6-review">
              <div className="reg6-review-card"><div><span>Competition</span><strong>{division} · {type==="TEAM"?"Team":"Individual"}</strong></div><button onClick={()=>go(0)}>Edit</button></div>
              <div className="reg6-review-card"><div><span>{type==="TEAM"?"Captain":"Athlete"}</span><strong>{captain.firstName||"—"} {captain.lastName}</strong></div><button onClick={()=>go(1)}>Edit</button></div>
              {type==="TEAM"&&<div className="reg6-review-card"><div><span>Roster</span><strong>{teammates.length+1} athletes · {teamName||"Team name not set"}</strong></div><button onClick={()=>go(2)}>Edit</button></div>}
              <div className="reg6-review-card"><div><span>Emergency contact</span><strong>{emergencyName||"—"}</strong></div><button onClick={()=>go(type==="TEAM"?3:2)}>Edit</button></div>
            </div>
            {error&&<div className="reg6-error">{error}</div>}
          </>}

          <div className="reg6-actions">
            {step>0?<button className="reg6-back" onClick={()=>go(step-1)}>← Back</button>:<span/>}
            {current!=="Review"?<button className="reg6-next" onClick={()=>go(step+1)}>Continue <span>→</span></button>:<button className="reg6-pay" onClick={checkout} disabled={loading}>{loading?"Opening checkout...":"Continue to payment"}<span>→</span></button>}
          </div>
        </section>
      </div>
    </section>
  </main>
}

function Loading(){return <main style={{padding:40}}>Loading registration…</main>}
export default function RegisterPage(){return <Suspense fallback={<Loading/>}><RegistrationWizard/></Suspense>}
