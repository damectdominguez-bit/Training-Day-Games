"use client";

import { useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

type Teammate = { id:number; firstName:string; lastName:string; email:string; gender:string; shirtSize:string; gym:string };
const emptyTeammate = (id:number):Teammate => ({ id, firstName:"", lastName:"", email:"", gender:"", shirtSize:"M", gym:"" });

const divisions = [
  { name:"RX", code:"RX", line:"FULL SEND", sub:"Advanced standards" },
  { name:"Intermediate", code:"INT", line:"COMPETE HARD", sub:"Most popular" },
  { name:"Scaled", code:"SCL", line:"STEP IN", sub:"Open division" },
];

function RegistrationForm() {
  const params = useSearchParams();
  const [division, setDivision] = useState(params.get("division") || "Intermediate");
  const [registrationType, setRegistrationType] = useState<"INDIVIDUAL"|"TEAM">(params.get("type") === "team" ? "TEAM" : "INDIVIDUAL");
  const [teammates, setTeammates] = useState<Teammate[]>([emptyTeammate(1)]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const selected = divisions.find(d => d.name === division) || divisions[1];

  function addTeammate(){
    if(teammates.length >= 4) return;
    const next = Math.max(0,...teammates.map(t=>t.id))+1;
    setTeammates(c=>[...c,emptyTeammate(next)]);
  }
  function removeTeammate(id:number){ setTeammates(c=>c.filter(t=>t.id!==id)); }
  function updateTeammate(id:number, field:keyof Teammate, value:string){ setTeammates(c=>c.map(t=>t.id===id?{...t,[field]:value}:t)); }

  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); setLoading(true); setError("");
    const form = new FormData(e.currentTarget);
    const payload = {
      division, registrationType,
      teamName: registrationType === "TEAM" ? String(form.get("teamName")||"") : "",
      firstName:String(form.get("firstName")||""), lastName:String(form.get("lastName")||""),
      email:String(form.get("email")||""), phone:String(form.get("phone")||""),
      gender:String(form.get("gender")||""), birthDate:String(form.get("birthDate")||""),
      gym:String(form.get("gym")||""), shirtSize:String(form.get("shirtSize")||""),
      emergencyName:String(form.get("emergencyName")||""), emergencyPhone:String(form.get("emergencyPhone")||""),
      waiver:form.get("waiver") === "on" ? "on" : "",
      teammates:registrationType === "TEAM" ? teammates : [],
    };
    try{
      const response = await fetch("/api/checkout",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});
      const data = await response.json();
      if(!response.ok) throw new Error(data.error || "Registration could not be started.");
      window.location.href = data.url;
    }catch(err){ setError(err instanceof Error ? err.message : "Registration could not be started."); setLoading(false); }
  }

  return (
    <main className="tdg-reg">
      <style jsx global>{`
        .tdg-reg{background:#050505;min-height:100vh;color:#f5f5ef;padding-bottom:100px;overflow:hidden}.tdg-reg *{box-sizing:border-box}
        .tdg-campaign{position:relative;min-height:610px;border-bottom:1px solid #242424;background:radial-gradient(circle at 74% 28%,rgba(239,255,0,.18),transparent 20%),linear-gradient(115deg,#050505 0%,#090909 60%,#111400 100%);overflow:hidden}
        .tdg-campaign:before{content:"";position:absolute;inset:0;background-image:linear-gradient(rgba(255,255,255,.045) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.045) 1px,transparent 1px);background-size:58px 58px;opacity:.42;mask-image:linear-gradient(90deg,#000,transparent 78%)}
        .tdg-lane{position:absolute;right:8%;top:-10%;width:190px;height:125%;background:#efff00;transform:skewX(-13deg);opacity:.96;box-shadow:0 0 90px rgba(239,255,0,.16)}
        .tdg-lane:after{content:"TDG";position:absolute;left:-178px;top:150px;color:#080808;font-size:250px;line-height:.8;font-weight:950;letter-spacing:-.12em;transform:skewX(13deg);opacity:.9}
        .tdg-campaign-inner{position:relative;z-index:2;width:min(1180px,calc(100% - 40px));margin:0 auto;min-height:610px;display:grid;grid-template-columns:1fr 320px;gap:50px;align-items:end;padding:70px 0 46px}
        .tdg-kicker{display:flex;align-items:center;gap:12px;font-size:10px;letter-spacing:.19em;font-weight:900;color:#c5c5bd;text-transform:uppercase}.tdg-kicker i{width:38px;height:3px;background:#efff00;display:block}
        .tdg-title{font-size:clamp(86px,11vw,152px)!important;line-height:.75!important;letter-spacing:-.09em!important;margin:18px 0 24px!important;font-weight:950!important;max-width:760px!important;text-transform:uppercase}.tdg-title span{color:#efff00}
        .tdg-sub{font-size:18px;line-height:1.55;color:#a8a89f;max-width:530px;margin:0 0 34px}.tdg-tags{display:flex;flex-wrap:wrap;gap:8px}.tdg-tags span{border:1px solid #303030;background:#090909;padding:10px 12px;font-size:9px;letter-spacing:.15em;text-transform:uppercase;font-weight:900}
        .tdg-pass{position:relative;align-self:center;background:#0b0b0b;border:1px solid rgba(255,255,255,.15);padding:20px;min-height:390px;box-shadow:0 22px 60px rgba(0,0,0,.45);transform:rotate(2deg)}
        .tdg-pass:before{content:"OFFICIAL ENTRY";display:block;color:#6d6d66;font-size:8px;letter-spacing:.18em;font-weight:900;margin-bottom:18px}.tdg-pass-code{font-size:112px;line-height:.8;font-weight:950;letter-spacing:-.1em;margin-bottom:20px}.tdg-pass-rule{height:1px;background:#292929;margin:18px 0}.tdg-pass small{display:block;color:#6c6c65;font-size:8px;letter-spacing:.14em;margin-bottom:4px}.tdg-pass strong{display:block;font-size:13px;letter-spacing:.04em}.tdg-pass-status{margin-top:28px;background:#efff00;color:#050505;padding:13px;font-size:9px;letter-spacing:.12em;font-weight:950;text-transform:uppercase}.tdg-pass-number{position:absolute;bottom:12px;right:14px;font-size:42px;font-weight:950;color:#1a1a1a}
        .tdg-ticker{position:relative;z-index:3;background:#efff00;color:#050505;white-space:nowrap;overflow:hidden;font-size:10px;font-weight:950;letter-spacing:.14em;text-transform:uppercase;padding:12px 0}.tdg-ticker div{width:max-content;display:flex;gap:48px;padding-left:10px}.tdg-ticker b:after{content:"✦";margin-left:48px}
        .tdg-shell{width:min(1180px,calc(100% - 40px));margin:0 auto}.tdg-steps{display:flex;align-items:center;gap:12px;padding:26px 0 36px;border-bottom:1px solid #202020}.tdg-steps span{font-size:9px;letter-spacing:.14em;color:#545454;font-weight:900;text-transform:uppercase}.tdg-steps span.active{color:#efff00}.tdg-steps i{height:1px;background:#242424;flex:1}
        .tdg-layout{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:38px;padding-top:42px;align-items:start}.tdg-form-head{display:flex;justify-content:space-between;gap:30px;align-items:end;margin-bottom:24px}.tdg-form-head h2{margin:0;font-size:54px;line-height:.88;letter-spacing:-.07em;text-transform:uppercase}.tdg-form-head p{margin:0;max-width:280px;color:#707068;font-size:12px;line-height:1.5}
        .tdg-panel{border:1px solid #242424;background:linear-gradient(180deg,#0d0d0d,#090909);padding:28px;margin-bottom:14px;position:relative}.tdg-panel:before{content:"";position:absolute;left:-1px;top:-1px;width:82px;height:3px;background:#efff00}.tdg-panel-head{display:flex;gap:15px;margin-bottom:24px}.tdg-num{color:#efff00;font-size:11px;font-weight:950;letter-spacing:.12em;padding-top:5px}.tdg-panel h3{font-size:27px;letter-spacing:-.05em;text-transform:uppercase;margin:0 0 5px}.tdg-panel-head p{margin:0;color:#686860;font-size:11px}
        .division-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}.division-card{position:relative;min-height:190px;padding:18px;text-align:left;background:#0c0c0c;border:1px solid #292929;color:white;overflow:hidden}.division-card:after{content:attr(data-code);position:absolute;right:-7px;bottom:-20px;font-size:84px;font-weight:950;letter-spacing:-.1em;color:#141414;z-index:0}.division-card>*{position:relative;z-index:1}.division-card.selected{border-color:#efff00;background:linear-gradient(145deg,#151800,#0b0b0b 62%)}.division-card .tag{display:inline-block;background:#efff00;color:#060606;padding:6px 7px;font-size:7px;letter-spacing:.14em;font-weight:950;text-transform:uppercase;margin-bottom:42px}.division-card strong{display:block;font-size:25px;text-transform:uppercase;letter-spacing:-.04em}.division-card small{display:block;color:#efff00;font-size:8px;letter-spacing:.13em;font-weight:900;margin-top:5px}.division-card p{color:#6b6b64;font-size:10px;margin:6px 0 0}
        .format-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:22px}.format-grid button{display:grid;grid-template-columns:52px 1fr;gap:14px;align-items:center;text-align:left;min-height:88px;background:#0b0b0b;border:1px solid #2b2b2b;color:#b8b8b0;padding:15px}.format-grid button.selected{background:#f1f1e9;color:#070707;border-color:#f1f1e9}.format-grid .icon{width:42px;height:42px;border:1px solid currentColor;display:grid;place-items:center;font-size:10px;font-weight:950}.format-grid strong{display:block;text-transform:uppercase;font-size:14px}.format-grid small{display:block;margin-top:4px;color:#666;font-size:9px}
        .tdg-reg label{font-size:9px!important;letter-spacing:.13em!important;text-transform:uppercase!important;font-weight:900!important;margin-bottom:8px!important}.tdg-reg input,.tdg-reg select{border-radius:0!important;min-height:54px!important;background:#080808!important;border:1px solid #303030!important}.tdg-reg input:focus,.tdg-reg select:focus{border-color:#efff00!important;box-shadow:0 0 0 1px #efff00!important}.tdg-row{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        .captain-card{display:grid;grid-template-columns:52px 1fr auto;align-items:center;border:1px solid #2a2a2a;padding:14px;margin-bottom:10px;background:#080808}.captain-card b{font-size:25px;color:#efff00}.captain-card strong{font-size:11px;letter-spacing:.1em}.captain-card small{display:block;color:#5e5e58;font-size:8px;letter-spacing:.11em;margin-top:2px}.captain-card em{font-style:normal;color:#64645e;font-size:8px;letter-spacing:.13em}
        .roster-card{border:1px solid #292929;background:#080808;padding:20px;margin-bottom:10px}.roster-top{display:grid;grid-template-columns:50px 1fr auto;align-items:center;border-bottom:1px solid #202020;padding-bottom:14px;margin-bottom:17px}.roster-top b{font-size:25px;color:#efff00}.roster-top span{font-size:8px;letter-spacing:.15em;color:#62625c}.roster-top h4{margin:3px 0 0;font-size:17px}.remove{background:transparent!important;color:#666!important;padding:7px!important;font-size:8px!important;letter-spacing:.12em!important}.add-athlete{width:100%;background:transparent!important;border:1px dashed #404040!important;color:white!important;display:flex;align-items:center;gap:13px;text-align:left;padding:16px!important}.add-athlete b{color:#efff00;font-size:25px}.add-athlete strong{display:block;font-size:10px;letter-spacing:.1em}.add-athlete small{display:block;color:#5f5f59;font-size:8px;margin-top:3px}
        .waiver-box{border:1px solid #282828;background:#070707;padding:16px;color:#77776f;font-size:11px;line-height:1.6;max-height:150px;overflow:auto;margin-bottom:16px}.waiver-check{display:flex!important;gap:10px;align-items:flex-start;text-transform:none!important;letter-spacing:0!important;color:#aaa!important;font-size:11px!important}.waiver-check input{width:17px!important;height:17px!important;min-height:0!important;margin:0!important;flex:0 0 17px!important;accent-color:#efff00}.tdg-submit{width:100%;min-height:68px;background:#efff00!important;color:#050505!important;display:flex;justify-content:space-between;align-items:center;padding:0 24px!important;letter-spacing:.08em!important;font-size:11px!important}.tdg-submit b{font-size:27px}
        .entry-card{position:sticky;top:94px;border:1px solid #2b2b2b;background:#0a0a0a;overflow:hidden}.entry-art{height:250px;position:relative;background:radial-gradient(circle at 72% 20%,rgba(239,255,0,.22),transparent 33%),linear-gradient(145deg,#151800,#080808 58%);padding:18px}.entry-art:after{content:"TDG";position:absolute;right:-28px;bottom:-30px;font-size:124px;font-weight:950;letter-spacing:-.12em;color:#171717}.entry-art small{font-size:8px;color:#74746c;letter-spacing:.16em}.entry-art strong{display:block;font-size:80px;line-height:.83;letter-spacing:-.09em;margin-top:18px}.entry-art span{display:inline-block;background:#efff00;color:#060606;padding:6px 7px;font-size:7px;letter-spacing:.13em;font-weight:950;margin-top:13px}.entry-body{padding:18px}.entry-body h3{font-size:26px;line-height:.95;letter-spacing:-.05em;text-transform:uppercase;margin:5px 0 18px}.entry-line{display:flex;justify-content:space-between;border-top:1px solid #202020;padding:11px 0;font-size:9px;letter-spacing:.1em}.entry-line span{color:#62625c}.entry-line b{color:#eee}.entry-alert{margin-top:14px;border-left:3px solid #efff00;background:#0e0e0e;padding:12px;color:#8a8a82;font-size:8px;line-height:1.5;letter-spacing:.08em}.entry-alert i{display:inline-block;width:6px;height:6px;background:#efff00;border-radius:50%;margin-right:7px}
        .tdg-error{background:#250e0e;border:1px solid #5d2525;color:#ffb0b0;padding:12px;margin-bottom:12px;font-size:11px}
        @media(max-width:980px){.tdg-campaign-inner{grid-template-columns:1fr}.tdg-pass{display:none}.tdg-lane{right:-80px;opacity:.55}.tdg-layout{grid-template-columns:1fr}.entry-card{position:static}.tdg-form-head{align-items:flex-start;flex-direction:column}.tdg-form-head p{max-width:none}.division-grid{grid-template-columns:1fr}.format-grid{grid-template-columns:1fr}}
        @media(max-width:720px){.tdg-title{font-size:72px!important}.tdg-campaign{min-height:500px}.tdg-campaign-inner{min-height:500px;padding-top:48px}.tdg-row{grid-template-columns:1fr}.tdg-panel{padding:20px}.tdg-shell,.tdg-campaign-inner{width:min(100% - 24px,1180px)}.tdg-steps{overflow:auto}.tdg-steps i{min-width:30px}.tdg-lane{width:120px}.tdg-lane:after{font-size:150px;left:-110px}}
      `}</style>

      <section className="tdg-campaign">
        <div className="tdg-lane" />
        <div className="tdg-campaign-inner">
          <div>
            <div className="tdg-kicker"><i/>Training Day Games · Miami</div>
            <h1 className="tdg-title">CLAIM<br/><span>YOUR</span> LANE.</h1>
            <p className="tdg-sub">Build the entry. Bring the team. Earn the floor.</p>
            <div className="tdg-tags"><span>Summer 2027</span><span>Miami, Florida</span><span>Limited Field</span></div>
          </div>
          <div className="tdg-pass">
            <div className="tdg-pass-code">{selected.code}</div>
            <small>DIVISION</small><strong>{division.toUpperCase()}</strong>
            <div className="tdg-pass-rule"/>
            <small>FORMAT</small><strong>{registrationType === "TEAM" ? "TEAM ENTRY" : "INDIVIDUAL"}</strong>
            <div className="tdg-pass-rule"/>
            <small>ROSTER</small><strong>{registrationType === "TEAM" ? teammates.length + 1 : 1} ATHLETE{registrationType === "TEAM" ? "S" : ""}</strong>
            <div className="tdg-pass-status">REGISTRATION OPEN</div>
            <div className="tdg-pass-number">27</div>
          </div>
        </div>
      </section>

      <div className="tdg-ticker"><div><b>TRAINING DAY GAMES</b><b>MIAMI 2027</b><b>BUILD YOUR TEAM</b><b>CLAIM YOUR LANE</b><b>TRAINING DAY GAMES</b></div></div>

      <div className="tdg-shell">
        <div className="tdg-steps"><span className="active">01 Build Entry</span><i/><span>02 Review</span><i/><span>03 Payment</span><i/><span>04 You're In</span></div>

        <div className="tdg-layout">
          <div>
            <div className="tdg-form-head"><h2>BUILD<br/>YOUR ENTRY</h2><p>One registration. One payment. Your entire team stays together.</p></div>
            <form onSubmit={submit}>
              <section className="tdg-panel">
                <div className="tdg-panel-head"><div className="tdg-num">01</div><div><h3>Choose your field</h3><p>Pick the division. Pick the format.</p></div></div>
                <div className="division-grid">
                  {divisions.map(d=><button key={d.name} type="button" data-code={d.code} className={`division-card ${division===d.name?"selected":""}`} onClick={()=>setDivision(d.name)}><span className="tag">{d.sub}</span><strong>{d.name}</strong><small>{d.line}</small><p>{d.sub}</p></button>)}
                </div>
                <input type="hidden" name="division" value={division}/>
                <div className="format-grid">
                  <button type="button" className={registrationType==="INDIVIDUAL"?"selected":""} onClick={()=>setRegistrationType("INDIVIDUAL")}><span className="icon">01</span><div><strong>Individual</strong><small>One athlete. One lane.</small></div></button>
                  <button type="button" className={registrationType==="TEAM"?"selected":""} onClick={()=>setRegistrationType("TEAM")}><span className="icon">+</span><div><strong>Team</strong><small>Captain builds the roster.</small></div></button>
                </div>
                {registrationType==="TEAM" && <div style={{marginTop:22}}><label>Team name</label><input name="teamName" placeholder="Name your squad" required/></div>}
              </section>

              <section className="tdg-panel">
                <div className="tdg-panel-head"><div className="tdg-num">02</div><div><h3>{registrationType==="TEAM"?"Captain":"Athlete"}</h3><p>{registrationType==="TEAM"?"Lead the entry.":"Your competition profile."}</p></div></div>
                <div className="tdg-row"><div><label>First name</label><input name="firstName" required/></div><div><label>Last name</label><input name="lastName" required/></div></div>
                <div className="tdg-row"><div><label>Email</label><input name="email" type="email" required/></div><div><label>Phone</label><input name="phone" type="tel" required/></div></div>
                <div className="tdg-row"><div><label>Gender</label><select name="gender" defaultValue="" required><option value="" disabled>Select</option><option>Male</option><option>Female</option></select></div><div><label>Date of birth</label><input name="birthDate" type="date" required/></div></div>
                <div className="tdg-row"><div><label>Gym / Affiliate</label><input name="gym" placeholder="Optional"/></div><div><label>Shirt size</label><select name="shirtSize" defaultValue="M"><option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>2XL</option></select></div></div>
              </section>

              {registrationType==="TEAM" && <section className="tdg-panel">
                <div className="tdg-panel-head"><div className="tdg-num">03</div><div><h3>Build the roster</h3><p>You are athlete #1. Add the rest.</p></div></div>
                <div className="captain-card"><b>01</b><div><strong>YOU</strong><small>TEAM CAPTAIN · PRIMARY CONTACT</small></div><em>LOCKED</em></div>
                {teammates.map((t,index)=><div className="roster-card" key={t.id}>
                  <div className="roster-top"><b>{String(index+2).padStart(2,"0")}</b><div><span>ROSTER SPOT</span><h4>ATHLETE {index+2}</h4></div>{teammates.length>1&&<button type="button" className="remove" onClick={()=>removeTeammate(t.id)}>REMOVE</button>}</div>
                  <div className="tdg-row"><div><label>First name</label><input value={t.firstName} onChange={e=>updateTeammate(t.id,"firstName",e.target.value)} required/></div><div><label>Last name</label><input value={t.lastName} onChange={e=>updateTeammate(t.id,"lastName",e.target.value)} required/></div></div>
                  <label>Email</label><input type="email" value={t.email} onChange={e=>updateTeammate(t.id,"email",e.target.value)} required/>
                  <div className="tdg-row"><div><label>Gender</label><select value={t.gender} onChange={e=>updateTeammate(t.id,"gender",e.target.value)} required><option value="" disabled>Select</option><option>Male</option><option>Female</option></select></div><div><label>Shirt size</label><select value={t.shirtSize} onChange={e=>updateTeammate(t.id,"shirtSize",e.target.value)}><option>XS</option><option>S</option><option>M</option><option>L</option><option>XL</option><option>2XL</option></select></div></div>
                  <label>Gym / Affiliate</label><input value={t.gym} onChange={e=>updateTeammate(t.id,"gym",e.target.value)} placeholder="Optional"/>
                </div>)}
                {teammates.length<4&&<button type="button" className="add-athlete" onClick={addTeammate}><b>+</b><div><strong>ADD TEAMMATE</strong><small>Open another roster spot</small></div></button>}
              </section>}

              <section className="tdg-panel">
                <div className="tdg-panel-head"><div className="tdg-num">{registrationType==="TEAM"?"04":"03"}</div><div><h3>Emergency contact</h3><p>Someone we can reach when it matters.</p></div></div>
                <div className="tdg-row"><div><label>Contact name</label><input name="emergencyName" required/></div><div><label>Contact phone</label><input name="emergencyPhone" type="tel" required/></div></div>
              </section>

              <section className="tdg-panel">
                <div className="tdg-panel-head"><div className="tdg-num">{registrationType==="TEAM"?"05":"04"}</div><div><h3>Waiver & policies</h3><p>Read it. Own it. Compete.</p></div></div>
                <div className="waiver-box"><strong>Participant waiver placeholder</strong><br/><br/>The final Training Day Games participation waiver, assumption of risk, media release and event policies will appear here before registration opens.</div>
                <label className="waiver-check"><input name="waiver" type="checkbox" required/><span>I have read and agree to the Training Day Games waiver and event policies.</span></label>
              </section>

              {error&&<div className="tdg-error">{error}</div>}
              <button className="tdg-submit" disabled={loading}><span>{loading?"OPENING SECURE CHECKOUT...":registrationType==="TEAM"?"LOCK IN YOUR TEAM":"LOCK IN YOUR SPOT"}</span><b>→</b></button>
            </form>
          </div>

          <aside>
            <div className="entry-card">
              <div className="entry-art"><small>OFFICIAL ENTRY / 2027</small><strong>{selected.code}</strong><span>{selected.line}</span></div>
              <div className="entry-body"><small style={{color:'#efff00',letterSpacing:'.14em',fontSize:8}}>TRAINING DAY GAMES</small><h3>CLAIM YOUR LANE.</h3>
                <div className="entry-line"><span>DIVISION</span><b>{division.toUpperCase()}</b></div>
                <div className="entry-line"><span>FORMAT</span><b>{registrationType==="TEAM"?"TEAM":"INDIVIDUAL"}</b></div>
                {registrationType==="TEAM"&&<div className="entry-line"><span>ROSTER</span><b>{teammates.length+1} ATHLETES</b></div>}
                <div className="entry-line"><span>LOCATION</span><b>MIAMI, FL</b></div>
                <div className="entry-alert"><i/>YOUR SPOT ISN'T YOURS UNTIL PAYMENT IS COMPLETE.</div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function RegistrationLoading(){ return <main className="tdg-reg"><div className="tdg-shell" style={{paddingTop:60}}>Loading registration...</div></main>; }
export default function RegisterPage(){ return <Suspense fallback={<RegistrationLoading/>}><RegistrationForm/></Suspense>; }
