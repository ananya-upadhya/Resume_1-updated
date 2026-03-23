/* ─────────────────────────────────────────────────────────
   EXECUTIVE TEMPLATE
   Bold · Strong typography · Navy accent · Senior level
   ATS-friendly — white bg, standard fonts, no graphics
───────────────────────────────────────────────────────── */

const parseBullets = t => (t||"").split("\n").map(l=>l.trim().replace(/^[-•▸◆*]\s*/,"")).filter(Boolean);
const fmtM = m => {
  if (!m) return "";
  const [dd,mo,yyyy] = m.split("-");
  const mon = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+mo-1];
  return mon ? `${dd} ${mon} ${yyyy}` : m;
};

const NAVY   = "#1e3a5f";
const GOLD   = "#b8860b";
const LIGHT  = "#f0f4f8";
const SANS   = "'DM Sans', sans-serif";
const SERIF  = "'Cinzel', serif";

export default function ExecutiveTemplate({ data }) {
  const { personal:p, summary:s, experience=[], education=[], skills=[], projects=[], certifications=[] } = data;
  const hasContent = p.name||s.text||experience.length||education.length||skills.length;

  if (!hasContent) return (
    <div style={{width:"100%",maxWidth:"680px",background:"#fff",minHeight:"792px",alignSelf:"flex-start",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 6px rgba(0,0,0,0.04),0 16px 48px rgba(0,0,0,0.10)"}}>
      <div style={{textAlign:"center",color:"#999",fontFamily:SANS}}>
        <div style={{fontSize:"2.5rem",marginBottom:".5rem"}}>📋</div>
        <div style={{fontSize:".85rem"}}>Your Resume Appears Here</div>
      </div>
    </div>
  );

  const contacts = [
    p.email    && p.email,
    p.phone    && p.phone,
    p.location && p.location,
    p.linkedin && p.linkedin,
    p.github   && p.github,
    p.website  && p.website,
  ].filter(Boolean);

  const SH = ({ children }) => (
    <div style={{display:"flex",alignItems:"center",gap:".6rem",margin:"1rem 0 .6rem"}}>
      <div style={{width:"4px",height:"16px",background:GOLD,borderRadius:"2px",flexShrink:0}}/>
      <div style={{fontFamily:SERIF,fontSize:".62rem",fontWeight:700,letterSpacing:".2em",textTransform:"uppercase",color:NAVY,flex:1}}>{children}</div>
      <div style={{height:"1px",width:"40px",background:GOLD,flexShrink:0}}/>
    </div>
  );

  return (
    <div id="resume-output" style={{width:"100%",maxWidth:"680px",background:"#fff",color:"#1a1a1a",minHeight:"792px",alignSelf:"flex-start",fontFamily:SANS,fontSize:".85rem",lineHeight:1.65,boxShadow:"0 4px 6px rgba(0,0,0,0.04),0 16px 48px rgba(0,0,0,0.10)"}}>

      {/* Bold header */}
      <div style={{background:NAVY,padding:"2rem 2.4rem 1.6rem"}}>
        <div style={{fontFamily:SERIF,fontSize:"2rem",fontWeight:700,color:"#fff",letterSpacing:".06em",lineHeight:1.15,marginBottom:".3rem"}}>{p.name||"Your Name"}</div>
        {p.title && <div style={{fontSize:".75rem",fontWeight:500,letterSpacing:".2em",textTransform:"uppercase",color:"rgba(255,255,255,0.7)",marginBottom:".8rem"}}>{p.title}</div>}
        {contacts.length>0 && (
          <div style={{display:"flex",flexWrap:"wrap",gap:".2rem .75rem"}}>
            {contacts.map((c,i)=>(
              <span key={i} style={{display:"inline-flex",alignItems:"center",fontSize:".65rem",color:"rgba(255,255,255,0.75)"}}>
                {i>0&&<span style={{marginRight:".75rem",color:"rgba(255,255,255,0.3)"}}>|</span>}
                {c}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Gold accent bar */}
      <div style={{height:"4px",background:`linear-gradient(90deg,${GOLD},#daa520,${GOLD})`}}/>

      {/* Body */}
      <div style={{padding:"0 2.4rem 2rem"}}>

        {/* Summary */}
        {s.text && <>
          <SH>Executive Summary</SH>
          <p style={{fontSize:".85rem",color:"#2d3748",lineHeight:1.8,margin:0,fontStyle:"italic",borderLeft:`3px solid ${GOLD}`,paddingLeft:".85rem"}}>{s.text}</p>
        </>}

        {/* Experience */}
        {experience.length>0 && <>
          <SH>Professional Experience</SH>
          {experience.map(e=>(
            <div key={e.id} style={{marginBottom:"1rem"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:".5rem",marginBottom:".12rem"}}>
                <div>
                  <div style={{fontWeight:700,color:NAVY,fontSize:".86rem",fontFamily:SERIF,letterSpacing:".02em"}}>{e.role||"Role"}</div>
                  <div style={{fontSize:".76rem",color:GOLD,fontWeight:600,marginTop:".04rem"}}>{e.company}</div>
                </div>
                <div style={{fontSize:".65rem",color:"#718096",whiteSpace:"nowrap",flexShrink:0,paddingTop:".1rem",fontStyle:"italic"}}>
                  {fmtM(e.start)}{e.start?" – ":""}{e.current?"Present":fmtM(e.end)}
                </div>
              </div>
              {e.bullets&&<ul style={{listStyle:"none",padding:0,margin:".2rem 0 0"}}>
                {parseBullets(e.bullets).map((b,i)=>(
                  <li key={i} style={{display:"flex",gap:".5rem",fontSize:".81rem",color:"#2d3748",lineHeight:1.65,marginBottom:".06rem"}}>
                    <span style={{color:GOLD,flexShrink:0,fontWeight:700,fontSize:".7rem",marginTop:".1rem"}}>◆</span>{b}
                  </li>
                ))}
              </ul>}
            </div>
          ))}
        </>}

        {/* Projects */}
        {projects.length>0 && <>
          <SH>Key Projects</SH>
          {projects.map(pr=>(
            <div key={pr.id} style={{marginBottom:"1rem",background:LIGHT,borderRadius:"6px",padding:".7rem .9rem",borderLeft:`3px solid ${NAVY}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:".5rem",marginBottom:".1rem"}}>
                <div>
                  <div style={{fontWeight:700,color:NAVY,fontSize:".84rem"}}>{pr.name||"Project"}</div>
                  {pr.tech&&<div style={{fontSize:".7rem",color:GOLD,fontWeight:500,marginTop:".03rem"}}>{pr.tech}</div>}
                </div>
                {pr.url&&<a style={{fontSize:".64rem",color:NAVY,textDecoration:"none",fontStyle:"italic"}} href={`https://${pr.url}`} target="_blank" rel="noreferrer">{pr.url}</a>}
              </div>
              {pr.bullets&&<ul style={{listStyle:"none",padding:0,margin:".15rem 0 0"}}>
                {parseBullets(pr.bullets).map((b,i)=>(
                  <li key={i} style={{display:"flex",gap:".5rem",fontSize:".8rem",color:"#2d3748",lineHeight:1.6,marginBottom:".04rem"}}>
                    <span style={{color:GOLD,flexShrink:0,fontWeight:700,fontSize:".65rem",marginTop:".12rem"}}>◆</span>{b}
                  </li>
                ))}
              </ul>}
            </div>
          ))}
        </>}

        {/* Two column lower section */}
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"1.5rem",marginTop:".5rem"}}>

          {/* Education */}
          {education.length>0 && <div>
            <SH>Education</SH>
            {education.map(e=>(
              <div key={e.id} style={{marginBottom:".7rem"}}>
                <div style={{fontWeight:700,color:NAVY,fontSize:".8rem"}}>{[e.degree,e.field].filter(Boolean).join(" in ")||"Degree"}</div>
                <div style={{fontSize:".72rem",color:GOLD,fontWeight:500,marginTop:".03rem"}}>{e.institution}</div>
                <div style={{fontSize:".65rem",color:"#718096",marginTop:".03rem"}}>{e.start}{e.start&&e.end?" – ":""}{e.end}</div>
                {e.gpa&&<div style={{fontSize:".65rem",color:"#4a5568"}}>CGPA: {e.gpa}</div>}
              </div>
            ))}
          </div>}

          {/* Skills */}
          {skills.length>0 && <div>
            <SH>Core Competencies</SH>
            <div style={{display:"flex",flexDirection:"column",gap:".22rem"}}>
              {skills.map(sk=>(
                <div key={sk} style={{display:"flex",alignItems:"center",gap:".45rem"}}>
                  <span style={{width:"5px",height:"5px",background:GOLD,borderRadius:"50%",flexShrink:0}}/>
                  <span style={{fontSize:".72rem",color:"#2d3748",fontWeight:500}}>{sk}</span>
                </div>
              ))}
            </div>
          </div>}
        </div>

        {/* Certifications */}
        {certifications.length>0 && <>
          <SH>Certifications</SH>
          <div style={{display:"flex",flexWrap:"wrap",gap:".45rem"}}>
            {certifications.map(c=>(
              <div key={c.id} style={{border:`1px solid ${NAVY}`,borderRadius:"5px",padding:".3rem .7rem",background:LIGHT}}>
                <div style={{fontSize:".73rem",fontWeight:700,color:NAVY}}>{c.name}</div>
                {c.issuer&&<div style={{fontSize:".63rem",color:GOLD,fontWeight:500}}>{c.issuer}{c.date?` · ${fmtM(c.date)}`:""}</div>}
              </div>
            ))}
          </div>
        </>}

      </div>
    </div>
  );
}
