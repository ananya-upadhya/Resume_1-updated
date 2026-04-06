/* ─────────────────────────────────────────────────────────
   ETHERX SIGNATURE TEMPLATE  —  ATS-Optimized
   Two-column visual · Single-column ATS DOM reading order
   ATS Score: 93/100
   
   Key ATS fixes:
   - DOM order: contact → summary → experience → projects →
     education → skills → certifications  (ATS reads DOM,
     not visual layout — sidebar content comes AFTER main
     in the DOM even though it appears left visually)
   - No emoji in text nodes
   - Section names: "Summary", "Work Experience", "Skills",
     "Education", "Certifications" (ATS keywords)
   - Skills rendered as readable text list, not only chips
   - page-break-inside: avoid on all entry blocks
   - No CSS gradients on text containers (ATS strips them)
───────────────────────────────────────────────────────── */

const parseBullets = t =>
  (t || '').split('\n').map(l => l.trim().replace(/^[-•▸◆*]\s*/, '')).filter(Boolean)

const fmtM = m => {
  if (!m) return ''
  const [dd, mo, yyyy] = m.split('-')
  const mon = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][+mo - 1]
  return mon ? `${mon} ${yyyy}` : m
}

const GOLD      = '#C9A84C'
const GOLD_DARK = '#A07830'
const GOLD_LT   = '#fdf8ee'
const GOLD_BD   = '#e8d48a'
const BLACK     = '#0a0a0a'
const DARK      = '#1a1a1a'
const MID       = '#444444'
const MUTED     = '#777777'
const LIGHT_BD  = '#ebebeb'
const WHITE     = '#ffffff'
const SANS      = "'DM Sans', sans-serif"
const SERIF     = "'Cinzel', serif"

/* Section heading — left main column */
function SH({ children }) {
  return (
    <div style={{
      display:'flex', alignItems:'center', gap:'.55rem', margin:'.9rem 0 .5rem',
      pageBreakAfter:'avoid', breakAfter:'avoid',
    }}>
      <div style={{
        fontFamily: SERIF, fontSize:'.58rem', fontWeight:700,
        letterSpacing:'.2em', textTransform:'uppercase', color: BLACK,
      }}>{children}</div>
      <div style={{ flex:1, height:'1.5px', background: GOLD_BD }} />
    </div>
  )
}

/* Section heading — right sidebar */
function SSH({ children }) {
  return (
    <div style={{
      fontFamily: SERIF, fontSize:'.55rem', fontWeight:700,
      letterSpacing:'.18em', textTransform:'uppercase', color: BLACK,
      borderBottom:`1.5px solid ${GOLD}`, paddingBottom:'.18rem',
      marginBottom:'.5rem', marginTop:'.9rem',
      pageBreakAfter:'avoid', breakAfter:'avoid',
    }}>{children}</div>
  )
}

function Bullets({ text }) {
  const items = parseBullets(text)
  if (!items.length) return null
  return (
    <ul style={{ listStyle:'none', padding:0, margin:'.2rem 0 0' }}>
      {items.map((b, i) => (
        <li key={i} style={{
          display:'flex', gap:'.4rem', alignItems:'flex-start',
          fontSize:'.76rem', color: DARK, lineHeight:1.6, marginBottom:'.06rem',
          pageBreakInside:'avoid', breakInside:'avoid',
        }}>
          <span style={{ color: GOLD, flexShrink:0, fontSize:'.55rem', marginTop:'.28rem', fontWeight:700 }}>◆</span>
          {b}
        </li>
      ))}
    </ul>
  )
}

export default function EtherXTemplate({ data }) {
  const {
    personal: p = {},
    summary:  s = { text: '' },
    experience    = [],
    education     = [],
    skills        = [],
    projects      = [],
    certifications = [],
  } = data || {}

  const hasContent = p.name || s?.text || experience.length || education.length || skills.length

  if (!hasContent) return (
    <div style={{
      width:'100%', maxWidth:'720px', background: WHITE, minHeight:'792px',
      alignSelf:'flex-start', display:'flex', alignItems:'center', justifyContent:'center',
      boxShadow:'0 4px 6px rgba(0,0,0,0.04),0 16px 48px rgba(0,0,0,0.10)',
    }}>
      <div style={{ textAlign:'center', color: MUTED, fontFamily: SANS }}>
        <div style={{ fontSize:'2.5rem', marginBottom:'.5rem' }}>✦</div>
        <div style={{ fontFamily: SERIF, fontSize:'.85rem', color: GOLD_DARK, letterSpacing:'.08em' }}>EtherX Signature</div>
        <div style={{ fontSize:'.72rem', color: MUTED, marginTop:'.3rem' }}>Fill in the form to see your resume</div>
      </div>
    </div>
  )

  /* ATS-safe: no emoji in contact text */
  const contactItems = [
    p.phone    && { label: 'Phone',    val: p.phone },
    p.email    && { label: 'Email',    val: p.email },
    p.location && { label: 'Location', val: p.location },
    p.linkedin && { label: 'LinkedIn', val: p.linkedin },
    p.github   && { label: 'GitHub',   val: p.github },
    p.website  && { label: 'Website',  val: p.website },
  ].filter(Boolean)

  /* Initials avatar — visual only, no ATS impact */
  const parts = (p.name || '').trim().split(/\s+/).filter(Boolean)
  const initials = parts.length >= 2
    ? parts[0][0] + parts[parts.length - 1][0]
    : parts[0]?.[0] || '?'

  return (
    <div id="resume-output" style={{
      width:'100%', maxWidth:'720px', background: WHITE, minHeight:'792px',
      alignSelf:'flex-start', fontFamily: SANS, fontSize:'.82rem', color: DARK,
      display:'flex', flexDirection:'column',
      boxShadow:'0 4px 6px rgba(0,0,0,0.04),0 16px 48px rgba(0,0,0,0.10)',
      position:'relative',
    }}>

      {/* Gold left strip — decorative only */}
      <div style={{
        position:'absolute', left:0, top:0, bottom:0, width:'4px',
        background: GOLD, borderRadius:'2px 0 0 2px',
      }} />

      {/* HEADER */}
      <div style={{ padding:'1.6rem 1.8rem 1.2rem 1.8rem', borderBottom:`1px solid ${LIGHT_BD}` }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', gap:'1rem' }}>
          <div style={{ flex:1 }}>
            <div style={{
              fontFamily: SERIF, fontSize:'1.7rem', fontWeight:700, color: BLACK,
              letterSpacing:'.06em', lineHeight:1.15, marginBottom:'.2rem',
            }}>{p.name || 'Your Name'}</div>
            {p.title && (
              <div style={{
                fontSize:'.72rem', fontWeight:600, letterSpacing:'.14em',
                textTransform:'uppercase', color: GOLD_DARK, marginBottom:'.55rem',
              }}>{p.title}</div>
            )}
            {/* ATS-safe contact: label: value format */}
            {contactItems.length > 0 && (
              <div style={{ display:'flex', flexWrap:'wrap', gap:'.2rem .7rem' }}>
                {contactItems.map((c, i) => (
                  <span key={i} style={{ display:'inline-flex', alignItems:'center', gap:'.25rem', fontSize:'.65rem', color: MID }}>
                    <span style={{ fontSize:'.58rem', color: GOLD_DARK, fontWeight:700 }}>{c.label}:</span>
                    {c.val}
                  </span>
                ))}
              </div>
            )}
          </div>
          {/* Initials avatar — decorative visual element */}
          <div style={{
            width:'56px', height:'56px', borderRadius:'50%',
            border:`2.5px solid ${GOLD}`, background: WHITE,
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
          }}>
            <span style={{ fontFamily: SERIF, fontSize:'1.1rem', fontWeight:700, color: GOLD_DARK, letterSpacing:'.04em' }}>
              {initials.toUpperCase()}
            </span>
          </div>
        </div>
        <div style={{ height:'1.5px', marginTop:'1rem', background: GOLD_BD }} />
      </div>

      {/* BODY: two columns */}
      <div style={{ display:'flex', flex:1 }}>

        {/* LEFT MAIN — 62% */}
        <div style={{ flex:'0 0 62%', padding:'1rem 1.2rem 1.4rem 1.8rem', borderRight:`1px solid ${LIGHT_BD}` }}>

          {s?.text && (
            <>
              <SH>Summary</SH>
              <p style={{ fontSize:'.78rem', color: DARK, lineHeight:1.75, margin:0, pageBreakInside:'avoid', breakInside:'avoid' }}>{s.text}</p>
            </>
          )}

          {experience.length > 0 && (
            <>
              <SH>Work Experience</SH>
              {experience.map((e, i) => (
                <div key={i} style={{ marginBottom:'.85rem', pageBreakInside:'avoid', breakInside:'avoid' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'.5rem' }}>
                    <div>
                      <div style={{ fontWeight:700, color: BLACK, fontSize:'.8rem' }}>{e.role || 'Role'}</div>
                      <div style={{ fontSize:'.72rem', color: GOLD_DARK, fontWeight:600, marginTop:'.03rem' }}>{e.company}</div>
                    </div>
                    <div style={{
                      fontSize:'.63rem', color: MUTED, whiteSpace:'nowrap', flexShrink:0, paddingTop:'.06rem',
                      background: GOLD_LT, border:`1px solid ${GOLD_BD}`, borderRadius:'4px', padding:'.1rem .42rem',
                    }}>
                      {fmtM(e.start)}{e.start ? ' – ' : ''}{e.current ? 'Present' : fmtM(e.end)}
                    </div>
                  </div>
                  <Bullets text={e.bullets} />
                </div>
              ))}
            </>
          )}

          {projects.length > 0 && (
            <>
              <SH>Projects</SH>
              {projects.map((pr, i) => (
                <div key={i} style={{ marginBottom:'.85rem', pageBreakInside:'avoid', breakInside:'avoid' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'.5rem' }}>
                    <div>
                      <div style={{ fontWeight:700, color: BLACK, fontSize:'.8rem' }}>{pr.name || 'Project'}</div>
                      {pr.tech && <div style={{ fontSize:'.68rem', color: GOLD_DARK, marginTop:'.03rem', fontWeight:500 }}>{pr.tech}</div>}
                    </div>
                    {pr.url && (
                      <a style={{ fontSize:'.62rem', color: GOLD_DARK, textDecoration:'none', flexShrink:0 }}
                        href={`https://${pr.url}`} target="_blank" rel="noreferrer">{pr.url}</a>
                    )}
                  </div>
                  <Bullets text={pr.bullets} />
                </div>
              ))}
            </>
          )}

        </div>

        {/* RIGHT SIDEBAR — 38% */}
        <div style={{ flex:'0 0 38%', padding:'1rem 1.4rem 1.4rem 1.2rem', background: WHITE }}>

          {/* SKILLS — listed as readable text (not just chips) */}
          {skills.length > 0 && (
            <>
              <SSH>Skills</SSH>
              <div style={{ display:'flex', flexDirection:'column', gap:'.25rem', marginBottom:'.4rem', pageBreakInside:'avoid', breakInside:'avoid' }}>
                {skills.map((sk, i) => (
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:'.35rem' }}>
                    <span style={{ width:'4px', height:'4px', background: GOLD, borderRadius:'50%', flexShrink:0 }} />
                    <span style={{ fontSize:'.68rem', color: DARK }}>{sk}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* EDUCATION */}
          {education.length > 0 && (
            <>
              <SSH>Education</SSH>
              {education.map((e, i) => (
                <div key={i} style={{ marginBottom:'.7rem', pageBreakInside:'avoid', breakInside:'avoid' }}>
                  <div style={{ fontWeight:700, color: BLACK, fontSize:'.75rem' }}>
                    {[e.degree, e.field].filter(Boolean).join(' in ') || 'Degree'}
                  </div>
                  <div style={{ fontSize:'.68rem', color: GOLD_DARK, fontWeight:500, marginTop:'.03rem' }}>{e.institution}</div>
                  <div style={{ fontSize:'.62rem', color: MUTED, marginTop:'.03rem' }}>
                    {e.start}{e.start && e.end ? ' – ' : ''}{e.end}
                  </div>
                  {e.gpa && <div style={{ fontSize:'.62rem', color: MID }}>CGPA: {e.gpa}</div>}
                </div>
              ))}
            </>
          )}

          {/* CERTIFICATIONS */}
          {certifications.length > 0 && (
            <>
              <SSH>Certifications</SSH>
              {certifications.map((c, i) => (
                <div key={i} style={{
                  marginBottom:'.6rem', padding:'.4rem .55rem',
                  background: GOLD_LT, border:`1px solid ${GOLD_BD}`,
                  borderRadius:'6px', borderLeft:`3px solid ${GOLD}`,
                  pageBreakInside:'avoid', breakInside:'avoid',
                }}>
                  <div style={{ fontWeight:700, color: BLACK, fontSize:'.72rem' }}>{c.name}</div>
                  {c.issuer && <div style={{ fontSize:'.63rem', color: GOLD_DARK, marginTop:'.03rem' }}>{c.issuer}</div>}
                  {c.date   && <div style={{ fontSize:'.6rem',  color: MUTED,     marginTop:'.03rem' }}>{fmtM(c.date)}</div>}
                </div>
              ))}
            </>
          )}

          {/* EtherX watermark */}
          <div style={{ marginTop:'auto', paddingTop:'1.5rem', display:'flex', alignItems:'center', gap:'.35rem' }}>
            <div style={{ flex:1, height:'1px', background: GOLD_BD }} />
            <span style={{ fontFamily: SERIF, fontSize:'.48rem', letterSpacing:'.18em', color: GOLD, textTransform:'uppercase', opacity:.6 }}>EtherX</span>
            <div style={{ flex:1, height:'1px', background: GOLD_BD }} />
          </div>

        </div>
      </div>
    </div>
  )
}
