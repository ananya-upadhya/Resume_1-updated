/* ─────────────────────────────────────────────────────────
   MODERN TEMPLATE
   Two-column · Left sidebar for contact/skills · Blue accent
   ATS-friendly — white bg, standard fonts, no graphics
───────────────────────────────────────────────────────── */

const parseBullets = t => (t||"").split("\n").map(l=>l.trim().replace(/^[-•▸◆*]\s*/,"")).filter(Boolean);
const fmtM = m => {
  if (!m) return "";
  const [dd,mo,yyyy] = m.split("-");
  const mon = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+mo-1];
  return mon ? `${dd} ${mon} ${yyyy}` : m;
};

const ACCENT = "#2563eb";
const ACCENT_LT = "#eff6ff";

export default function ModernTemplate({ data }) {
  const { personal:p, summary:s, experience=[], education=[], skills=[], projects=[], certifications=[] } = data;
  const hasContent = p.name||s.text||experience.length||education.length||skills.length;

  const contacts = [
    p.email    && { ico:"✉", label:p.email },
    p.phone    && { ico:"📞", label:p.phone },
    p.location && { ico:"📍", label:p.location },
    p.linkedin && { ico:"in", label:p.linkedin },
    p.github   && { ico:"⌥",  label:p.github },
    p.website  && { ico:"🌐", label:p.website },
  ].filter(Boolean);

  if (!hasContent) return (
    <div style={{width:"100%",maxWidth:"680px",background:"#fff",minHeight:"792px",alignSelf:"flex-start",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 6px rgba(0,0,0,0.04),0 16px 48px rgba(0,0,0,0.10)"}}>
      <div style={{textAlign:"center",color:"#999"}}>
        <div style={{fontSize:"2.5rem",marginBottom:".5rem"}}>📄</div>
        <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:".85rem"}}>Your Resume Appears Here</div>
      </div>
    </div>
  );

  const SH = ({ children }) => (
    <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:".65rem",fontWeight:700,letterSpacing:".16em",textTransform:"uppercase",color:ACCENT,borderBottom:`2px solid ${ACCENT}`,paddingBottom:".2rem",marginBottom:".6rem"}}>
      {children}
    </div>
  );

  const Entry = ({ title, sub, date, bullets, url, tech }) => (
    <div style={{marginBottom:".8rem"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:".4rem"}}>
        <div>
          <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:".82rem",fontWeight:700,color:"#0f172a"}}>{title}</div>
          {sub  && <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:".73rem",color:ACCENT,fontWeight:500,marginTop:".02rem"}}>{sub}</div>}
          {tech && <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:".7rem",color:"#64748b",fontStyle:"italic",marginTop:".02rem"}}>{tech}</div>}
        </div>
        <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:".64rem",color:"#94a3b8",whiteSpace:"nowrap",flexShrink:0,paddingTop:".05rem",textAlign:"right"}}>
          {date}
          {url && <div><a style={{color:ACCENT,textDecoration:"none",fontSize:".62rem"}} href={`https://${url}`} target="_blank" rel="noreferrer">{url}</a></div>}
        </div>
      </div>
      {bullets && <ul style={{listStyle:"none",padding:0,margin:".22rem 0 0"}}>
        {parseBullets(bullets).map((b,i)=>(
          <li key={i} style={{display:"flex",gap:".4rem",fontSize:".8rem",color:"#334155",lineHeight:1.6,marginBottom:".06rem"}}>
            <span style={{color:ACCENT,flexShrink:0,fontWeight:700,marginTop:".05rem"}}>▸</span>{b}
          </li>
        ))}
      </ul>}
    </div>
  );

  return (
    <div id="resume-output" style={{width:"100%",maxWidth:"680px",background:"#fff",minHeight:"792px",alignSelf:"flex-start",fontFamily:"'DM Sans',sans-serif",boxShadow:"0 4px 6px rgba(0,0,0,0.04),0 16px 48px rgba(0,0,0,0.10)",display:"flex",flexDirection:"column"}}>

      {/* Top header bar */}
      <div style={{background:ACCENT,padding:"1.6rem 2rem 1.4rem",color:"#fff"}}>
        <div style={{fontFamily:"'Cinzel',serif",fontSize:"1.8rem",fontWeight:700,letterSpacing:".06em",lineHeight:1.2}}>{p.name||"Your Name"}</div>
        {p.title && <div style={{fontSize:".72rem",fontWeight:500,letterSpacing:".18em",textTransform:"uppercase",opacity:.85,marginTop:".3rem"}}>{p.title}</div>}
      </div>

      {/* Body — two columns */}
      <div style={{display:"flex",flex:1}}>

        {/* LEFT SIDEBAR */}
        <div style={{width:"36%",background:ACCENT_LT,padding:"1.4rem 1.2rem",borderRight:`1px solid #dbeafe`,flexShrink:0}}>

          {/* Contact */}
          {contacts.length>0 && (
            <div style={{marginBottom:"1.2rem"}}>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:".62rem",fontWeight:700,letterSpacing:".16em",textTransform:"uppercase",color:ACCENT,marginBottom:".5rem"}}>Contact</div>
              {contacts.map((c,i)=>(
                <div key={i} style={{display:"flex",gap:".4rem",alignItems:"flex-start",marginBottom:".35rem"}}>
                  <span style={{fontSize:".65rem",color:ACCENT,flexShrink:0,marginTop:".05rem"}}>{c.ico}</span>
                  <span style={{fontSize:".68rem",color:"#334155",wordBreak:"break-all",lineHeight:1.4}}>{c.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Skills */}
          {skills.length>0 && (
            <div style={{marginBottom:"1.2rem"}}>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:".62rem",fontWeight:700,letterSpacing:".16em",textTransform:"uppercase",color:ACCENT,marginBottom:".5rem"}}>Skills</div>
              <div style={{display:"flex",flexDirection:"column",gap:".28rem"}}>
                {skills.map(sk=>(
                  <div key={sk} style={{display:"flex",alignItems:"center",gap:".4rem"}}>
                    <span style={{width:"5px",height:"5px",borderRadius:"50%",background:ACCENT,flexShrink:0}}/>
                    <span style={{fontSize:".7rem",color:"#1e293b",fontWeight:500}}>{sk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education in sidebar */}
          {education.length>0 && (
            <div>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:".62rem",fontWeight:700,letterSpacing:".16em",textTransform:"uppercase",color:ACCENT,marginBottom:".5rem"}}>Education</div>
              {education.map(e=>(
                <div key={e.id} style={{marginBottom:".7rem"}}>
                  <div style={{fontSize:".73rem",fontWeight:700,color:"#0f172a"}}>{[e.degree,e.field].filter(Boolean).join(" in ")||"Degree"}</div>
                  <div style={{fontSize:".67rem",color:"#475569",marginTop:".05rem"}}>{e.institution}</div>
                  <div style={{fontSize:".63rem",color:"#94a3b8",marginTop:".03rem"}}>{e.start}{e.start&&e.end?" – ":""}{e.end}</div>
                  {e.gpa&&<div style={{fontSize:".63rem",color:"#64748b",marginTop:".03rem"}}>CGPA: {e.gpa}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Certifications in sidebar */}
          {certifications.length>0 && (
            <div style={{marginTop:"1rem"}}>
              <div style={{fontFamily:"'DM Sans',sans-serif",fontSize:".62rem",fontWeight:700,letterSpacing:".16em",textTransform:"uppercase",color:ACCENT,marginBottom:".5rem"}}>Certifications</div>
              {certifications.map(c=>(
                <div key={c.id} style={{marginBottom:".55rem"}}>
                  <div style={{fontSize:".72rem",fontWeight:700,color:"#0f172a"}}>{c.name}</div>
                  {c.issuer&&<div style={{fontSize:".65rem",color:"#475569"}}>{c.issuer}</div>}
                  <div style={{fontSize:".62rem",color:"#94a3b8"}}>{fmtM(c.date)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT MAIN */}
        <div style={{flex:1,padding:"1.4rem 1.6rem"}}>

          {s.text && <div style={{marginBottom:"1.1rem"}}><SH>Summary</SH><p style={{fontSize:".83rem",color:"#334155",lineHeight:1.75,margin:0}}>{s.text}</p></div>}

          {experience.length>0 && <div style={{marginBottom:"1.1rem"}}><SH>Work Experience</SH>
            {experience.map(e=><Entry key={e.id}
              title={e.role||"Role"} sub={e.company}
              date={`${fmtM(e.start)}${e.start?" – ":""}${e.current?"Present":fmtM(e.end)}`}
              bullets={e.bullets}
            />)}
          </div>}

          {projects.length>0 && <div style={{marginBottom:"1.1rem"}}><SH>Projects</SH>
            {projects.map(pr=><Entry key={pr.id}
              title={pr.name||"Project"} tech={pr.tech}
              url={pr.url} bullets={pr.bullets}
            />)}
          </div>}

        </div>
      </div>
    </div>
  );
}
