/* ─────────────────────────────────────────────────────────
   TECH TEMPLATE
   Developer-focused · Compact · Green accent · Code style
   ATS-friendly — white bg, standard fonts, no graphics
───────────────────────────────────────────────────────── */

const parseBullets = t => (t||"").split("\n").map(l=>l.trim().replace(/^[-•▸◆*]\s*/,"")).filter(Boolean);
const fmtM = m => {
  if (!m) return "";
  const [dd,mo,yyyy] = m.split("-");
  const mon = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+mo-1];
  return mon ? `${dd} ${mon} ${yyyy}` : m;
};

const GREEN  = "#16a34a";
const GREEN2 = "#dcfce7";
const MONO   = "'Courier New', Courier, monospace";
const SANS   = "'DM Sans', sans-serif";

export default function TechTemplate({ data }) {
  const { personal:p, summary:s, experience=[], education=[], skills=[], projects=[], certifications=[] } = data;
  const hasContent = p.name||s.text||experience.length||education.length||skills.length;

  if (!hasContent) return (
    <div style={{width:"100%",maxWidth:"680px",background:"#fff",minHeight:"792px",alignSelf:"flex-start",display:"flex",alignItems:"center",justifyContent:"center",boxShadow:"0 4px 6px rgba(0,0,0,0.04),0 16px 48px rgba(0,0,0,0.10)"}}>
      <div style={{textAlign:"center",color:"#999",fontFamily:SANS}}>
        <div style={{fontSize:"2.5rem",marginBottom:".5rem"}}>💻</div>
        <div style={{fontSize:".85rem"}}>Your Resume Appears Here</div>
      </div>
    </div>
  );

  const contacts = [
    p.email    && { prefix:"email:",  label:p.email },
    p.phone    && { prefix:"phone:",  label:p.phone },
    p.location && { prefix:"loc:",    label:p.location },
    p.linkedin && { prefix:"linkedin:",label:p.linkedin },
    p.github   && { prefix:"github:", label:p.github },
    p.website  && { prefix:"web:",    label:p.website },
  ].filter(Boolean);

  const SH = ({ children }) => (
    <div style={{display:"flex",alignItems:"center",gap:".5rem",marginBottom:".55rem"}}>
      <span style={{fontFamily:MONO,fontSize:".65rem",color:GREEN,fontWeight:700}}>//</span>
      <span style={{fontFamily:SANS,fontSize:".65rem",fontWeight:700,letterSpacing:".14em",textTransform:"uppercase",color:"#0f172a"}}>{children}</span>
      <div style={{flex:1,height:"1px",background:"#e2e8f0"}}/>
    </div>
  );

  return (
    <div id="resume-output" style={{width:"100%",maxWidth:"680px",background:"#fff",color:"#1a1a1a",padding:"2rem 2.2rem",minHeight:"792px",alignSelf:"flex-start",fontFamily:SANS,fontSize:".85rem",lineHeight:1.6,boxShadow:"0 4px 6px rgba(0,0,0,0.04),0 16px 48px rgba(0,0,0,0.10)"}}>

      {/* Header */}
      <div style={{borderLeft:`4px solid ${GREEN}`,paddingLeft:"1rem",marginBottom:"1.2rem"}}>
        <div style={{fontFamily:MONO,fontSize:"1.6rem",fontWeight:700,color:"#0f172a",letterSpacing:"-.01em",lineHeight:1.2}}>{p.name||"Your Name"}</div>
        {p.title && <div style={{fontFamily:MONO,fontSize:".75rem",color:GREEN,marginTop:".2rem"}}>{">"} {p.title}</div>}
      </div>

      {/* Contact row */}
      {contacts.length>0 && (
        <div style={{background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:"6px",padding:".55rem .75rem",marginBottom:"1.2rem",display:"flex",flexWrap:"wrap",gap:".25rem .9rem"}}>
          {contacts.map((c,i)=>(
            <span key={i} style={{fontFamily:MONO,fontSize:".63rem",color:"#334155"}}>
              <span style={{color:GREEN,fontWeight:700}}>{c.prefix}</span>{c.label}
            </span>
          ))}
        </div>
      )}

      {/* Summary */}
      {s.text && <div style={{marginBottom:"1.1rem"}}><SH>Summary</SH>
        <p style={{fontSize:".82rem",color:"#334155",lineHeight:1.75,margin:0,borderLeft:`2px solid ${GREEN2}`,paddingLeft:".65rem"}}>{s.text}</p>
      </div>}

      {/* Experience */}
      {experience.length>0 && <div style={{marginBottom:"1.1rem"}}><SH>Experience</SH>
        {experience.map(e=>(
          <div key={e.id} style={{marginBottom:".85rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:".5rem"}}>
              <div>
                <span style={{fontWeight:700,color:"#0f172a",fontSize:".82rem"}}>{e.role||"Role"}</span>
                <span style={{color:"#64748b",fontSize:".78rem"}}> @ {e.company}</span>
              </div>
              <div style={{fontFamily:MONO,fontSize:".62rem",color:"#94a3b8",whiteSpace:"nowrap",flexShrink:0,background:"#f1f5f9",padding:".1rem .4rem",borderRadius:"4px"}}>
                {fmtM(e.start)}{e.start?" – ":""}{e.current?"present":fmtM(e.end)}
              </div>
            </div>
            {e.bullets&&<ul style={{listStyle:"none",padding:0,margin:".2rem 0 0"}}>
              {parseBullets(e.bullets).map((b,i)=>(
                <li key={i} style={{display:"flex",gap:".45rem",fontSize:".79rem",color:"#334155",lineHeight:1.6,marginBottom:".05rem"}}>
                  <span style={{color:GREEN,fontFamily:MONO,flexShrink:0,fontSize:".7rem",marginTop:".06rem"}}>{"→"}</span>{b}
                </li>
              ))}
            </ul>}
          </div>
        ))}
      </div>}

      {/* Projects */}
      {projects.length>0 && <div style={{marginBottom:"1.1rem"}}><SH>Projects</SH>
        {projects.map(pr=>(
          <div key={pr.id} style={{marginBottom:".85rem",background:"#f8fafc",border:"1px solid #e2e8f0",borderRadius:"6px",padding:".6rem .8rem"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:".5rem",marginBottom:".2rem"}}>
              <div>
                <span style={{fontWeight:700,color:"#0f172a",fontSize:".82rem"}}>{pr.name||"Project"}</span>
                {pr.tech&&<span style={{fontFamily:MONO,fontSize:".62rem",color:GREEN,background:GREEN2,padding:".08rem .4rem",borderRadius:"4px",marginLeft:".5rem"}}>{pr.tech}</span>}
              </div>
              {pr.url&&<a style={{fontFamily:MONO,fontSize:".62rem",color:GREEN,textDecoration:"none"}} href={`https://${pr.url}`} target="_blank" rel="noreferrer">{pr.url}</a>}
            </div>
            {pr.bullets&&<ul style={{listStyle:"none",padding:0,margin:".15rem 0 0"}}>
              {parseBullets(pr.bullets).map((b,i)=>(
                <li key={i} style={{display:"flex",gap:".45rem",fontSize:".79rem",color:"#334155",lineHeight:1.6,marginBottom:".04rem"}}>
                  <span style={{color:GREEN,fontFamily:MONO,flexShrink:0,fontSize:".7rem",marginTop:".06rem"}}>{"→"}</span>{b}
                </li>
              ))}
            </ul>}
          </div>
        ))}
      </div>}

      {/* Skills */}
      {skills.length>0 && <div style={{marginBottom:"1.1rem"}}><SH>Skills</SH>
        <div style={{display:"flex",flexWrap:"wrap",gap:".3rem"}}>
          {skills.map(sk=>(
            <span key={sk} style={{fontFamily:MONO,fontSize:".67rem",background:"#f1f5f9",border:"1px solid #cbd5e1",color:"#1e293b",borderRadius:"4px",padding:".15rem .5rem"}}>{sk}</span>
          ))}
        </div>
      </div>}

      {/* Education */}
      {education.length>0 && <div style={{marginBottom:"1.1rem"}}><SH>Education</SH>
        {education.map(e=>(
          <div key={e.id} style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:".5rem",marginBottom:".55rem"}}>
            <div>
              <div style={{fontWeight:700,color:"#0f172a",fontSize:".82rem"}}>{[e.degree,e.field].filter(Boolean).join(" in ")||"Degree"}</div>
              <div style={{fontSize:".72rem",color:"#475569",marginTop:".03rem"}}>{e.institution}</div>
              {e.gpa&&<div style={{fontSize:".67rem",color:"#64748b"}}>CGPA: {e.gpa}</div>}
            </div>
            <div style={{fontFamily:MONO,fontSize:".62rem",color:"#94a3b8",whiteSpace:"nowrap",flexShrink:0,background:"#f1f5f9",padding:".1rem .4rem",borderRadius:"4px"}}>
              {e.start}{e.start&&e.end?" – ":""}{e.end}
            </div>
          </div>
        ))}
      </div>}

      {/* Certifications */}
      {certifications.length>0 && <div><SH>Certifications</SH>
        <div style={{display:"flex",flexWrap:"wrap",gap:".4rem"}}>
          {certifications.map(c=>(
            <div key={c.id} style={{background:GREEN2,border:`1px solid #bbf7d0`,borderRadius:"6px",padding:".3rem .65rem"}}>
              <div style={{fontSize:".72rem",fontWeight:700,color:"#14532d"}}>{c.name}</div>
              {c.issuer&&<div style={{fontSize:".63rem",color:"#16a34a"}}>{c.issuer}{c.date?` · ${fmtM(c.date)}`:""}</div>}
            </div>
          ))}
        </div>
      </div>}

    </div>
  );
}
