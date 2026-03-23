/* ─────────────────────────────────────────────────────────
   CLASSIC TEMPLATE
   Traditional · Single column · Centered header · Serif
   ATS-friendly — white bg, standard fonts, no graphics
───────────────────────────────────────────────────────── */

const parseBullets = t => (t||"").split("\n").map(l=>l.trim().replace(/^[-•▸◆*]\s*/,"")).filter(Boolean);
const fmtM = m => {
  if (!m) return "";
  const [dd,mo,yyyy] = m.split("-");
  const mon = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+mo-1];
  return mon ? `${dd} ${mon} ${yyyy}` : m;
};

const S = {
  root:     { width:"100%", maxWidth:"680px", background:"#fff", color:"#1a1a1a", padding:"2.4rem 2.6rem", minHeight:"792px", alignSelf:"flex-start", fontFamily:"'Crimson Pro',Georgia,serif", fontSize:".9rem", lineHeight:"1.65", boxShadow:"0 4px 6px rgba(0,0,0,0.04),0 16px 48px rgba(0,0,0,0.10)" },
  name:     { fontFamily:"'Cinzel',serif", fontSize:"1.9rem", fontWeight:700, color:"#0a0a0a", letterSpacing:".08em", textAlign:"center", lineHeight:1.15, marginBottom:".25rem" },
  title:    { fontFamily:"'DM Sans',sans-serif", fontSize:".72rem", fontWeight:500, letterSpacing:".2em", textTransform:"uppercase", color:"#555", textAlign:"center", marginBottom:".5rem" },
  contacts: { display:"flex", flexWrap:"wrap", justifyContent:"center", gap:".1rem .45rem", marginBottom:".1rem", fontFamily:"'DM Sans',sans-serif" },
  contact:  { fontSize:".68rem", color:"#444", textDecoration:"none" },
  hr:       { border:"none", borderTop:"1.5px solid #0a0a0a", margin:".75rem 0 1rem" },
  sec:      { marginBottom:"1.1rem" },
  sh:       { fontFamily:"'Cinzel',serif", fontSize:".58rem", fontWeight:700, letterSpacing:".22em", textTransform:"uppercase", color:"#0a0a0a", borderBottom:"1px solid #ccc", paddingBottom:".2rem", marginBottom:".55rem" },
  summary:  { fontSize:".86rem", color:"#333", lineHeight:1.75, margin:0 },
  entry:    { marginBottom:".75rem" },
  erow:     { display:"flex", justifyContent:"space-between", alignItems:"flex-start", gap:".5rem" },
  etitle:   { fontFamily:"'DM Sans',sans-serif", fontSize:".82rem", fontWeight:700, color:"#0a0a0a" },
  eorg:     { fontFamily:"'DM Sans',sans-serif", fontSize:".74rem", color:"#555", marginTop:".03rem" },
  edate:    { fontFamily:"'DM Sans',sans-serif", fontSize:".65rem", color:"#888", whiteSpace:"nowrap", flexShrink:0, paddingTop:".05rem" },
  esub:     { fontFamily:"'DM Sans',sans-serif", fontSize:".7rem", color:"#666", fontStyle:"italic", marginTop:".03rem" },
  ul:       { listStyle:"none", padding:0, margin:".25rem 0 0" },
  li:       { fontSize:".83rem", color:"#333", lineHeight:1.6, paddingLeft:".9rem", position:"relative", marginBottom:".08rem" },
  dot:      { position:"absolute", left:0, color:"#555", fontSize:".55rem", top:".22rem" },
  skills:   { display:"flex", flexWrap:"wrap", gap:".3rem" },
  skill:    { fontFamily:"'DM Sans',sans-serif", fontSize:".67rem", fontWeight:500, background:"#f5f5f5", border:"1px solid #ddd", color:"#222", borderRadius:"3px", padding:".15rem .5rem" },
  cert:     { display:"flex", justifyContent:"space-between", alignItems:"flex-start", padding:".28rem 0", borderBottom:"1px solid #f0f0f0" },
  cname:    { fontFamily:"'DM Sans',sans-serif", fontSize:".78rem", fontWeight:700, color:"#0a0a0a" },
  corg:     { fontFamily:"'DM Sans',sans-serif", fontSize:".68rem", color:"#666", marginTop:".03rem" },
  cdate:    { fontFamily:"'DM Sans',sans-serif", fontSize:".65rem", color:"#888", flexShrink:0 },
  empty:    { display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", minHeight:"460px", gap:".6rem", textAlign:"center" },
};

export default function ClassicTemplate({ data }) {
  const { personal:p, summary:s, experience=[], education=[], skills=[], projects=[], certifications=[] } = data;
  const hasContent = p.name||s.text||experience.length||education.length||skills.length;

  const contacts = [
    p.email    && { label:p.email,    href:`mailto:${p.email}` },
    p.phone    && { label:p.phone,    href:null },
    p.location && { label:p.location, href:null },
    p.linkedin && { label:p.linkedin, href:`https://${p.linkedin}` },
    p.github   && { label:p.github,   href:`https://${p.github}` },
    p.website  && { label:p.website,  href:`https://${p.website}` },
  ].filter(Boolean);

  if (!hasContent) return (
    <div style={S.root}>
      <div style={S.empty}>
        <div style={{fontSize:"2.5rem"}}>📄</div>
        <h3 style={{fontFamily:"'Cinzel',serif",fontSize:".9rem",color:"#555",fontWeight:600}}>Your Resume Appears Here</h3>
        <p style={{fontSize:".75rem",color:"#999",maxWidth:"200px",lineHeight:1.6}}>Fill in the form and your resume will update live.</p>
      </div>
    </div>
  );

  return (
    <div style={S.root} id="resume-output">
      <div style={S.name}>{p.name||"Your Name"}</div>
      {p.title && <div style={S.title}>{p.title}</div>}
      {contacts.length>0 && (
        <div style={S.contacts}>
          {contacts.map((c,i)=>(
            <span key={i} style={{display:"inline-flex",alignItems:"center"}}>
              {i>0 && <span style={{color:"#bbb",margin:"0 .3rem"}}>·</span>}
              {c.href
                ? <a style={S.contact} href={c.href} target="_blank" rel="noreferrer">{c.label}</a>
                : <span style={S.contact}>{c.label}</span>}
            </span>
          ))}
        </div>
      )}
      <hr style={S.hr}/>

      {s.text && <div style={S.sec}><div style={S.sh}>Professional Summary</div><p style={S.summary}>{s.text}</p></div>}

      {experience.length>0 && <div style={S.sec}><div style={S.sh}>Work Experience</div>
        {experience.map(e=>(
          <div style={S.entry} key={e.id}>
            <div style={S.erow}>
              <div><div style={S.etitle}>{e.role||"Role"}</div><div style={S.eorg}>{e.company}</div></div>
              <div style={S.edate}>{fmtM(e.start)}{e.start?" – ":""}{e.current?"Present":fmtM(e.end)}</div>
            </div>
            {e.bullets&&<ul style={S.ul}>{parseBullets(e.bullets).map((b,i)=><li key={i} style={S.li}><span style={S.dot}>–</span>{b}</li>)}</ul>}
          </div>
        ))}
      </div>}

      {projects.length>0 && <div style={S.sec}><div style={S.sh}>Projects</div>
        {projects.map(pr=>(
          <div style={S.entry} key={pr.id}>
            <div style={S.erow}>
              <div><div style={S.etitle}>{pr.name||"Project"}</div>{pr.tech&&<div style={S.esub}>{pr.tech}</div>}</div>
              {pr.url&&<a style={{...S.edate,color:"#333",textDecoration:"none"}} href={`https://${pr.url}`} target="_blank" rel="noreferrer">{pr.url}</a>}
            </div>
            {pr.bullets&&<ul style={S.ul}>{parseBullets(pr.bullets).map((b,i)=><li key={i} style={S.li}><span style={S.dot}>–</span>{b}</li>)}</ul>}
          </div>
        ))}
      </div>}

      {education.length>0 && <div style={S.sec}><div style={S.sh}>Education</div>
        {education.map(e=>(
          <div style={S.entry} key={e.id}>
            <div style={S.erow}>
              <div><div style={S.etitle}>{[e.degree,e.field].filter(Boolean).join(" in ")||"Degree"}</div><div style={S.eorg}>{e.institution}</div></div>
              <div style={S.edate}>{e.start}{e.start&&e.end?" – ":""}{e.end}</div>
            </div>
            {e.gpa&&<div style={S.esub}>CGPA / Score: {e.gpa}</div>}
          </div>
        ))}
      </div>}

      {skills.length>0 && <div style={S.sec}><div style={S.sh}>Skills</div>
        <div style={S.skills}>{skills.map(sk=><span key={sk} style={S.skill}>{sk}</span>)}</div>
      </div>}

      {certifications.length>0 && <div style={S.sec}><div style={S.sh}>Certifications</div>
        {certifications.map((c,i)=>(
          <div style={{...S.cert,...(i===certifications.length-1?{borderBottom:"none"}:{})}} key={c.id}>
            <div><div style={S.cname}>{c.name}</div>{c.issuer&&<div style={S.corg}>{c.issuer}</div>}</div>
            <div style={S.cdate}>{fmtM(c.date)}</div>
          </div>
        ))}
      </div>}
    </div>
  );
}
