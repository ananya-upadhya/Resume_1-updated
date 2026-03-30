/* ─────────────────────────────────────────────────────────
   CLASSIC TEMPLATE  —  Official Black & White
   Harvard-style single-column professional resume
   Pure #000 / #222 / #444 / #fff only
   ATS-friendly, structured, every edge case handled
───────────────────────────────────────────────────────── */

/* ── Helpers ───────────────────────────────────────────── */
const safe   = v => (typeof v === 'string' ? v.trim() : '')
const hasTxt = v => safe(v).length > 0

const parseBullets = raw =>
  safe(raw)
    .split('\n')
    .map(l => l.replace(/^[\s\-•▸◆*]+/, '').trim())
    .filter(Boolean)

const fmtDate = raw => {
  if (!hasTxt(raw)) return ''
  const parts = raw.split('-')
  if (parts.length === 3) {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const mo = parseInt(parts[1], 10)
    const yr = safe(parts[2])
    return months[mo - 1] ? `${months[mo - 1]} ${yr}` : raw
  }
  return raw
}

const fmtRange = (start, end, current) => {
  const s = fmtDate(start)
  const e = current ? 'Present' : fmtDate(end)
  if (!s && !e) return ''
  if (!s) return e
  if (!e) return s
  return `${s} – ${e}`
}

const ensureHttp = url =>
  hasTxt(url) ? (url.startsWith('http') ? url : `https://${url}`) : ''

/* ── Section Header (title + full-width rule underneath) ── */
function SectionHead({ title }) {
  return (
    <div style={{ marginBottom: '.55rem' }}>
      <div style={{
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: '.78rem',
        fontWeight: 700,
        letterSpacing: '.16em',
        textTransform: 'uppercase',
        color: '#000',
      }}>
        {title}
      </div>
      <div style={{ borderTop: '1.5px solid #000', marginTop: '.18rem' }} />
    </div>
  )
}

/* ── Bullet list ───────────────────────────────────────── */
function BulletList({ raw }) {
  const items = parseBullets(raw)
  if (!items.length) return null
  return (
    <ul style={{ margin: '.2rem 0 0', padding: 0, listStyle: 'none' }}>
      {items.map((b, i) => (
        <li key={i} style={{
          fontFamily: '"Times New Roman", Times, serif',
          fontSize: '.86rem',
          color: '#222',
          lineHeight: 1.6,
          paddingLeft: '1rem',
          position: 'relative',
          marginBottom: '.04rem',
        }}>
          <span style={{ position: 'absolute', left: 0, top: '.1rem', fontSize: '.55rem', color: '#000' }}>●</span>
          {b}
        </li>
      ))}
    </ul>
  )
}

/* ── Main ──────────────────────────────────────────────── */
export default function ClassicTemplate({ data }) {
  const {
    personal       = {},
    summary        = {},
    experience     = [],
    education      = [],
    skills         = [],
    projects       = [],
    certifications = [],
  } = data || {}

  const p   = personal || {}
  const arr = x => (Array.isArray(x) ? x : [])

  /* contact row */
  const contacts = [
    hasTxt(p.email)    && { label: p.email,    href: `mailto:${p.email}` },
    hasTxt(p.phone)    && { label: p.phone,    href: null },
    hasTxt(p.location) && { label: p.location, href: null },
    hasTxt(p.linkedin) && { label: 'LinkedIn', href: ensureHttp(p.linkedin) },
    hasTxt(p.github)   && { label: 'GitHub',   href: ensureHttp(p.github.includes('github') ? p.github : `github.com/${p.github}`) },
    hasTxt(p.website)  && { label: p.website,  href: ensureHttp(p.website) },
  ].filter(Boolean)

  const hasContent =
    hasTxt(p.name) || hasTxt(summary?.text) ||
    arr(experience).length || arr(education).length || arr(skills).length

  /* Empty state */
  if (!hasContent) return (
    <div style={{ width:'100%', maxWidth:'700px', background:'#fff', minHeight:'792px',
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      fontFamily:'"Times New Roman",serif', gap:'.6rem', textAlign:'center', padding:'2rem' }}>
      <div style={{ fontSize:'2.5rem' }}>📄</div>
      <div style={{ fontSize:'.9rem', color:'#555', fontWeight:600 }}>Your Resume Appears Here</div>
      <div style={{ fontSize:'.75rem', color:'#999', maxWidth:'200px', lineHeight:1.6 }}>
        Fill in the form and your resume will update live.
      </div>
    </div>
  )

  /* ── Shared type styles ─────────────────────────────── */
  const jobTitle  = { fontFamily:'Arial, Helvetica, sans-serif', fontSize:'.84rem', fontWeight:700, color:'#000' }
  const orgName   = { fontFamily:'Arial, Helvetica, sans-serif', fontSize:'.78rem', color:'#333', fontStyle:'italic' }
  const dateText  = { fontFamily:'Arial, Helvetica, sans-serif', fontSize:'.68rem', color:'#444', whiteSpace:'nowrap', flexShrink:0 }
  const subText   = { fontFamily:'Arial, Helvetica, sans-serif', fontSize:'.72rem', color:'#444' }
  const bodyText  = { fontFamily:'"Times New Roman", Times, serif', fontSize:'.86rem', color:'#222', lineHeight:1.7 }

  return (
    <div id="resume-output" style={{
      width: '100%',
      maxWidth: '700px',
      background: '#fff',
      color: '#000',
      padding: '2.6rem 2.8rem',
      minHeight: '792px',
      alignSelf: 'flex-start',
      fontFamily: '"Times New Roman", Times, serif',
      fontSize: '.9rem',
      lineHeight: '1.65',
      boxSizing: 'border-box',
    }}>

      {/* ── HEADER ─────────────────────────────────────── */}
      {hasTxt(p.name) && (
        <div style={{
          fontFamily: '"Times New Roman", Times, serif',
          fontSize: '2rem',
          fontWeight: 700,
          color: '#000',
          textAlign: 'center',
          textTransform: 'uppercase',
          letterSpacing: '.06em',
          lineHeight: 1.15,
          marginBottom: '.2rem',
        }}>
          {p.name}
        </div>
      )}

      {hasTxt(p.title) && (
        <div style={{
          fontFamily: 'Arial, Helvetica, sans-serif',
          fontSize: '.68rem',
          fontWeight: 400,
          letterSpacing: '.2em',
          textTransform: 'uppercase',
          color: '#000',
          textAlign: 'center',
          marginBottom: '.35rem',
        }}>
          {p.title}
        </div>
      )}

      {contacts.length > 0 && (
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'center',
          gap: '.05rem .2rem',
          marginBottom: '.5rem',
        }}>
          {contacts.map((c, i) => (
            <span key={i} style={{ display:'inline-flex', alignItems:'center',
              fontFamily:'Arial, Helvetica, sans-serif', fontSize:'.66rem', color:'#000' }}>
              {i > 0 && <span style={{ color:'#555', margin:'0 .25rem' }}>|</span>}
              {c.href
                ? <a href={c.href} target="_blank" rel="noreferrer"
                    style={{ color:'#000', textDecoration:'none' }}>{c.label}</a>
                : <span>{c.label}</span>
              }
            </span>
          ))}
        </div>
      )}

      {/* Single divider under header */}
      <div style={{ borderTop: '2px solid #000', marginBottom: '1rem' }} />

      {/* ── SUMMARY ────────────────────────────────────── */}
      {hasTxt(summary?.text) && (
        <div style={{ marginBottom: '1rem' }}>
          <SectionHead title="Professional Summary" />
          <p style={{ ...bodyText, margin: 0, textAlign: 'justify' }}>{summary.text}</p>
        </div>
      )}

      {/* ── EXPERIENCE ─────────────────────────────────── */}
      {arr(experience).length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <SectionHead title="Work Experience" />
          {arr(experience).map((e, idx) => {
            const org       = [safe(e.company), safe(e.location)].filter(Boolean).join(', ')
            const dateRange = fmtRange(e.start, e.end, e.current)
            return (
              <div key={e.id || idx} style={{ marginBottom: idx < arr(experience).length - 1 ? '.75rem' : 0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'.5rem' }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={jobTitle}>{hasTxt(e.role) ? e.role : 'Role'}</div>
                    {hasTxt(org) && <div style={orgName}>{org}</div>}
                  </div>
                  {hasTxt(dateRange) && <div style={dateText}>{dateRange}</div>}
                </div>
                <BulletList raw={e.bullets} />
              </div>
            )
          })}
        </div>
      )}

      {/* ── PROJECTS ───────────────────────────────────── */}
      {arr(projects).length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <SectionHead title="Projects" />
          {arr(projects).map((pr, idx) => {
            const dateRange = fmtRange(pr.start, pr.end, pr.current)
            return (
              <div key={pr.id || idx} style={{ marginBottom: idx < arr(projects).length - 1 ? '.75rem' : 0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'.5rem' }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={jobTitle}>{hasTxt(pr.name) ? pr.name : 'Project'}</div>
                    {hasTxt(pr.tech) && <div style={subText}>{pr.tech}</div>}
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'.1rem' }}>
                    {hasTxt(dateRange) && <div style={dateText}>{dateRange}</div>}
                    {hasTxt(pr.url) && (
                      <a href={ensureHttp(pr.url)} target="_blank" rel="noreferrer"
                        style={{ ...dateText, textDecoration:'underline', color:'#000' }}>
                        {pr.url}
                      </a>
                    )}
                  </div>
                </div>
                <BulletList raw={pr.bullets} />
              </div>
            )
          })}
        </div>
      )}

      {/* ── EDUCATION ──────────────────────────────────── */}
      {arr(education).length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <SectionHead title="Education" />
          {arr(education).map((e, idx) => {
            const degree    = [safe(e.degree), safe(e.field)].filter(Boolean).join(' in ') || 'Degree'
            const dateRange = [safe(e.start), safe(e.end)].filter(Boolean).join(' – ')
            return (
              <div key={e.id || idx} style={{ marginBottom: idx < arr(education).length - 1 ? '.65rem' : 0 }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', gap:'.5rem' }}>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={jobTitle}>{degree}</div>
                    {hasTxt(e.institution) && <div style={orgName}>{e.institution}</div>}
                    {hasTxt(e.gpa)         && <div style={subText}>CGPA / Score: {e.gpa}</div>}
                  </div>
                  {hasTxt(dateRange) && <div style={dateText}>{dateRange}</div>}
                </div>
                <BulletList raw={e.bullets} />
              </div>
            )
          })}
        </div>
      )}

      {/* ── SKILLS ─────────────────────────────────────── */}
      {arr(skills).filter(Boolean).length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <SectionHead title="Skills" />
          <p style={{ ...bodyText, margin: 0 }}>
            {arr(skills).filter(Boolean).join('  ·  ')}
          </p>
        </div>
      )}

      {/* ── CERTIFICATIONS ─────────────────────────────── */}
      {arr(certifications).length > 0 && (
        <div style={{ marginBottom: '1rem' }}>
          <SectionHead title="Certifications" />
          {arr(certifications).map((c, i) => (
            <div key={c.id || i} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              padding: '.28rem 0',
              borderBottom: i < arr(certifications).length - 1 ? '1px solid #ddd' : 'none',
            }}>
              <div>
                {hasTxt(c.name)   && <div style={jobTitle}>{c.name}</div>}
                {hasTxt(c.issuer) && <div style={orgName}>{c.issuer}</div>}
              </div>
              {hasTxt(c.date) && <div style={dateText}>{fmtDate(c.date)}</div>}
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
