/* ─────────────────────────────────────────────────────────
   STUDENT TEMPLATE  —  Fresh Minimal Redesign
   Coral Accents · Single Column with Grid · ATS-Optimized DOM
───────────────────────────────────────────────────────── */

const parseBullets = t =>
  (t || '').split('\n').map(l => l.trim().replace(/^[-•▸◆*▪]\s*/, '')).filter(Boolean)

const fmtM = m => {
  if (!m) return ''
  const [, mo, yyyy] = m.split('-')
  const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+mo - 1]
  return mon ? `${mon} ${yyyy}` : m
}

const CORAL = '#C85A38'
const WHITE = '#FFFFFF'
const BG_OFF = '#F9F9F9'
const CONTACT_BG = '#F5F5F5'
const TEXT_BODY = '#2D2D2D'
const TEXT_MUTED = '#777777'

const SANS = "'DM Sans', sans-serif"
const SERIF = "'Cinzel', serif"

/* Section heading */
function SH({ children }) {
  return (
    <div style={{ margin: '1.4rem 0 .8rem', pageBreakAfter: 'avoid', breakAfter: 'avoid' }}>
      <div style={{
        fontFamily: SANS, fontSize: '.9rem', fontWeight: 700,
        letterSpacing: '.05em', textTransform: 'uppercase', color: CORAL,
      }}>{children}</div>
      <div style={{ width: '32px', height: '2px', background: CORAL, marginTop: '.25rem' }} />
    </div>
  )
}

function Bullets({ text }) {
  const items = parseBullets(text)
  if (!items.length) return null
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: '.4rem 0 0' }}>
      {items.map((b, i) => (
        <li key={i} style={{
          display: 'flex', gap: '.5rem', alignItems: 'flex-start',
          fontSize: '.74rem', color: TEXT_BODY, lineHeight: 1.6, marginBottom: '.3rem',
          pageBreakInside: 'avoid', breakInside: 'avoid',
        }}>
          <span style={{ color: CORAL, fontSize: '.7rem', marginTop: '.12rem' }}>•</span>
          {b}
        </li>
      ))}
    </ul>
  )
}

export default function StudentTemplate({ data }) {
  const {
    personal: p = {},
    summary: s = { text: '' },
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    awards = [],
  } = data || {}

  const hasContent = p.name || s?.text || experience.length || education.length || skills.length

  if (!hasContent) return (
    <div style={{
      width: '100%', maxWidth: '720px', background: WHITE, minHeight: '792px',
      alignSelf: 'flex-start', display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 6px rgba(0,0,0,0.04),0 16px 48px rgba(0,0,0,0.10)',
    }}>
      <div style={{ textAlign: 'center', color: TEXT_MUTED, fontFamily: SANS }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '.5rem', color: CORAL }}>✦</div>
        <div style={{ fontFamily: SERIF, fontSize: '.85rem', color: CORAL, letterSpacing: '.08em' }}>Fresh Minimal Student</div>
        <div style={{ fontSize: '.72rem', color: TEXT_MUTED, marginTop: '.3rem' }}>Coral & Clean Layout</div>
      </div>
    </div>
  )

  const parts = (p.name || '').trim().split(/\s+/).filter(Boolean)
  const initials = parts.length >= 2
    ? parts[0][0] + parts[parts.length - 1][0]
    : parts[0]?.[0] || '?'

  const contactItems = [
    p.phone,
    p.email,
    p.location,
    p.linkedin,
    p.github,
    p.website,
  ].filter(Boolean)

  return (
    <div id="resume-output" style={{
      width: '100%', maxWidth: '720px', background: WHITE, minHeight: '792px',
      alignSelf: 'flex-start', fontFamily: SANS, fontSize: '.82rem', color: TEXT_BODY,
      display: 'flex', flexDirection: 'column', boxShadow: '0 4px 6px rgba(0,0,0,0.04),0 16px 48px rgba(0,0,0,0.10)',
      overflow: 'hidden'
    }}>
      {/* HEADER */}
      <div style={{ padding: '2rem 2.2rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{
            fontFamily: SERIF, fontSize: '2rem', fontWeight: 700, color: TEXT_BODY,
            lineHeight: 1.1, marginBottom: '.3rem', textTransform: 'uppercase'
          }}>{p.name || 'Your Name'}</div>
          {p.title && (
            <div style={{
              fontSize: '.85rem', fontWeight: 600, textTransform: 'uppercase', 
              color: CORAL, letterSpacing: '.15em'
            }}>{p.title}</div>
          )}
        </div>
        {/* Avatar */}
        <div style={{
          width: '56px', height: '56px', borderRadius: '50%', background: CORAL,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <span style={{ fontFamily: SANS, fontSize: '1.4rem', fontWeight: 500, color: WHITE, letterSpacing: '.05em' }}>
            {initials.toUpperCase()}
          </span>
        </div>
      </div>

      {/* CONTACT BAR */}
      <div style={{ background: CONTACT_BG, padding: '.6rem 2.2rem', display: 'flex', flexWrap: 'wrap', gap: '.8rem', justifyContent: 'center', borderBottom: `2px solid ${CORAL}` }}>
        {contactItems.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.8rem', fontSize: '.7rem', color: TEXT_BODY, fontWeight: 500 }}>
            <span>{c}</span>
            {i < contactItems.length - 1 && <span style={{ color: '#CCC' }}>|</span>}
          </div>
        ))}
      </div>

      {/* BODY (Grid 65/35) */}
      <div style={{ display: 'flex', flex: 1, padding: '1.5rem 2.2rem' }}>
        
        {/* LEFT MAIN (65%) */}
        <div style={{ flex: '0 0 65%', paddingRight: '1.5rem' }}>
          {s?.text && (
            <div style={{ marginBottom: '1.5rem' }}>
              <SH>Summary</SH>
              <p style={{ fontSize: '.8rem', lineHeight: 1.6, margin: 0, color: TEXT_BODY }}>{s.text}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <SH>Experience</SH>
              {experience.map((e, i) => (
                <div key={i} style={{ marginBottom: '1.2rem', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '.5rem' }}>
                    <div style={{ fontWeight: 700, color: TEXT_BODY, fontSize: '.85rem' }}>
                      {e.role || 'Role'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '.1rem', marginBottom: '.4rem' }}>
                    <div style={{ fontSize: '.75rem', color: CORAL, fontWeight: 600 }}>
                      {e.company}
                    </div>
                    <div style={{ fontSize: '.65rem', color: TEXT_MUTED }}>
                      {fmtM(e.start)}{e.start ? ' – ' : ''}{e.current ? 'Present' : fmtM(e.end)}
                    </div>
                  </div>
                  <Bullets text={e.bullets} />
                </div>
              ))}
            </div>
          )}

          {projects.length > 0 && (
            <div>
              <SH>Projects</SH>
              {projects.map((pr, i) => (
                <div key={i} style={{ marginBottom: '1.2rem', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontWeight: 700, color: TEXT_BODY, fontSize: '.85rem' }}>{pr.name}</div>
                    {pr.url && (
                      <a style={{ fontSize: '.62rem', color: TEXT_MUTED, textDecoration: 'none' }}
                        href={`https://${pr.url}`} target="_blank" rel="noreferrer">{pr.url}</a>
                    )}
                  </div>
                  {pr.tech && (
                    <div style={{ fontSize: '.7rem', color: CORAL, fontWeight: 600, marginTop: '.1rem', marginBottom: '.4rem' }}>
                      {pr.tech}
                    </div>
                  )}
                  <Bullets text={pr.bullets} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SIDEBAR (35%) */}
        <div style={{ flex: '0 0 35%', paddingLeft: '1.5rem', borderLeft: `1px solid #EEE` }}>
          
          {skills.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <SH>Skills</SH>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {skills.map((sk, i) => (
                  <li key={i} style={{ display: 'flex', gap: '.4rem', alignItems: 'center', fontSize: '.75rem', color: TEXT_BODY, marginBottom: '.3rem' }}>
                    <span style={{ color: CORAL, fontSize: '.8rem' }}>•</span>
                    {sk}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {education.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <SH>Education</SH>
              {education.map((e, i) => (
                <div key={i} style={{ marginBottom: '.8rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '.75rem', color: TEXT_BODY }}>
                    {[e.degree, e.field].filter(Boolean).join(' in ') || 'Degree'}
                  </div>
                  <div style={{ fontSize: '.7rem', color: CORAL, fontWeight: 600, marginTop: '.1rem' }}>{e.institution}</div>
                  <div style={{ fontSize: '.65rem', color: TEXT_MUTED, marginTop: '.1rem' }}>{e.start} {e.end ? `- ${e.end}` : ''}</div>
                </div>
              ))}
            </div>
          )}

          {certifications.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <SH>Certifications</SH>
              {certifications.map((c, i) => (
                <div key={i} style={{ marginBottom: '.6rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '.75rem', color: TEXT_BODY }}>{c.name}</div>
                  <div style={{ fontSize: '.7rem', color: CORAL, fontWeight: 600, marginTop: '.1rem' }}>{c.issuer}</div>
                </div>
              ))}
            </div>
          )}

          {awards && awards.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <SH>Awards</SH>
              {awards.map((a, i) => (
                <div key={i} style={{ marginBottom: '.6rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '.75rem', color: TEXT_BODY }}>{a.name}</div>
                  <div style={{ fontSize: '.7rem', color: CORAL, fontWeight: 600, marginTop: '.1rem' }}>{a.issuer}</div>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

/* ── PDF Export (Text-Based) ───────────────────────────── */
export async function exportToPDF(data) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const {
    personal: p = {},
    summary: s = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    awards = [],
  } = data || {};

  const pageWidth = doc.internal.pageSize.getWidth();
  // const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 12;
  const contentWidth = pageWidth - margin * 2;
  
  const mainWidth = contentWidth * 0.65;
  const sideWidth = contentWidth * 0.35 - 5;
  const mainX = margin;
  const sideX = margin + mainWidth + 5;

  const CORAL_RGB = [200, 90, 56]; // #C85A38
  const WHITE_RGB = [255, 255, 255];
  const CONTACT_BG_RGB = [245, 245, 245]; // #F5F5F5
  const TEXT_BODY_RGB = [45, 45, 45]; // #2D2D2D
  const TEXT_MUTED_RGB = [119, 119, 119]; // #777777

  let y = 15; 

  const fmtM = m => {
    if (!m) return ''
    const [, mo, yyyy] = m.split('-')
    const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+mo - 1]
    return mon ? `${mon} ${yyyy}` : m
  }

  const parseBullets = t =>
    (t || '').split('\n').map(l => l.trim().replace(/^[-•▸◆*▪]\s*/, '')).filter(Boolean);

  // --- HEADER ---
  
  // Name
  doc.setFont("times", "bold");
  doc.setFontSize(22);
  doc.setTextColor(...TEXT_BODY_RGB);
  doc.text((p.name || "Your Name").toUpperCase(), margin, y);
  y += 6;

  // Title
  if (p.title) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...CORAL_RGB);
    doc.text(p.title.toUpperCase(), margin, y, { charSpace: 1.5 });
  }

  // Avatar Right
  const names = (p.name || "").split(" ");
  const initials = names.length > 1 ? (names[0][0] + names[names.length - 1][0]).toUpperCase() : (names[0]?.[0] || "?").toUpperCase();
  doc.setFillColor(...CORAL_RGB);
  doc.circle(pageWidth - margin - 8, y - 5, 8, 'F');
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(...WHITE_RGB);
  doc.text(initials, pageWidth - margin - 8, y - 3.5, { align: 'center' });
  
  y += 8;

  // Contact Bar
  doc.setFillColor(...CONTACT_BG_RGB);
  doc.rect(0, y, pageWidth, 8, 'F');
  doc.setDrawColor(...CORAL_RGB);
  doc.setLineWidth(0.5);
  doc.line(0, y + 8, pageWidth, y + 8);

  const contactItems = [
    p.phone, p.email, p.location, p.linkedin, p.github, p.website
  ].filter(Boolean);

  if (contactItems.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...TEXT_BODY_RGB);
    
    // We will render them centered
    const contactText = contactItems.join("   |   ");
    doc.text(contactText, pageWidth / 2, y + 5.5, { align: 'center' });
  }

  y += 15;

  let my = y; // Main Y
  let sy = y; // Sidebar Y

  const SectionHeading = (title, x, width, ypos) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...CORAL_RGB);
    doc.text(title.toUpperCase(), x, ypos, { charSpace: 0.5 });
    doc.setDrawColor(...CORAL_RGB);
    doc.setLineWidth(0.5);
    doc.line(x, ypos + 1.5, x + 8, ypos + 1.5);
    return ypos + 8;
  };

  // --- LEFT COLUMN ---
  if (s.text) {
    my = SectionHeading("Summary", mainX, mainWidth, my);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...TEXT_BODY_RGB);
    const sLines = doc.splitTextToSize(s.text, mainWidth - 5);
    doc.text(sLines, mainX, my, { lineHeightFactor: 1.5 });
    my += (sLines.length * 4.5) + 6;
  }

  if (experience.length > 0) {
    my = SectionHeading("Experience", mainX, mainWidth, my);
    experience.forEach(e => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...TEXT_BODY_RGB);
      doc.text(e.role || "Role", mainX, my);
      my += 4.5;
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...CORAL_RGB);
      doc.text(e.company || "", mainX, my);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...TEXT_MUTED_RGB);
      const date = `${fmtM(e.start)}${e.start ? ' - ' : ''}${e.current ? 'Present' : fmtM(e.end)}`;
      doc.text(date, mainX + mainWidth - 5, my, { align: 'right' });
      my += 4;

      const bullets = parseBullets(e.bullets);
      bullets.forEach(b => {
        doc.setFontSize(9);
        doc.setTextColor(...CORAL_RGB);
        doc.text("\u2022", mainX, my); // Bullet
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...TEXT_BODY_RGB);
        const bLines = doc.splitTextToSize(b, mainWidth - 9);
        doc.text(bLines, mainX + 4, my);
        my += (bLines.length * 4.5) + 1;
      });
      my += 4;
    });
  }

  if (projects.length > 0) {
    my = SectionHeading("Projects", mainX, mainWidth, my);
    projects.forEach(pr => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...TEXT_BODY_RGB);
      doc.text(pr.name || "Project", mainX, my);

      if (pr.url) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...TEXT_MUTED_RGB);
        doc.text(pr.url, mainX + mainWidth - 5, my, { align: 'right' });
      }
      my += 4.5;

      if (pr.tech) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(...CORAL_RGB);
        doc.text(pr.tech, mainX, my);
        my += 4;
      }

      const bullets = parseBullets(pr.bullets);
      bullets.forEach(b => {
        doc.setFontSize(9);
        doc.setTextColor(...CORAL_RGB);
        doc.text("\u2022", mainX, my);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...TEXT_BODY_RGB);
        const bLines = doc.splitTextToSize(b, mainWidth - 9);
        doc.text(bLines, mainX + 4, my);
        my += (bLines.length * 4.5) + 1;
      });
      my += 4;
    });
  }

  // --- RIGHT COLUMN ---

  // Draw dividing line
  const maxH = Math.max(my, sy + 50); // Rough estimate of content height
  doc.setDrawColor(238, 238, 238); // #EEEEEE
  doc.setLineWidth(0.3);
  doc.line(sideX - 2.5, y, sideX - 2.5, maxH);

  if (skills.length > 0) {
    sy = SectionHeading("Skills", sideX, sideWidth, sy);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    skills.forEach(sk => {
      doc.setTextColor(...CORAL_RGB);
      doc.text("\u2022", sideX, sy);
      doc.setTextColor(...TEXT_BODY_RGB);
      const skLines = doc.splitTextToSize(sk, sideWidth - 4);
      doc.text(skLines, sideX + 4, sy);
      sy += (skLines.length * 4.5) + 1.2;
    });
    sy += 4;
  }

  if (education.length > 0) {
    sy = SectionHeading("Education", sideX, sideWidth, sy);
    education.forEach(e => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...TEXT_BODY_RGB);
      const degree = [e.degree, e.field].filter(Boolean).join(" in ") || "Degree";
      const dLines = doc.splitTextToSize(degree, sideWidth);
      doc.text(dLines, sideX, sy);
      sy += (dLines.length * 4.2);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...CORAL_RGB);
      const instLines = doc.splitTextToSize(e.institution || "", sideWidth);
      doc.text(instLines, sideX, sy);
      sy += (instLines.length * 4.2);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...TEXT_MUTED_RGB);
      doc.text(`${e.start} - ${e.end}`, sideX, sy);
      sy += 6;
    });
  }

  if (certifications.length > 0) {
    sy = SectionHeading("Certifications", sideX, sideWidth, sy);
    certifications.forEach(c => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...TEXT_BODY_RGB);
      const cLines = doc.splitTextToSize(c.name || "", sideWidth);
      doc.text(cLines, sideX, sy);
      sy += (cLines.length * 4.2);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...CORAL_RGB);
      const issLines = doc.splitTextToSize(c.issuer || "", sideWidth);
      doc.text(issLines, sideX, sy);
      sy += (issLines.length * 4.2) + 2;
    });
  }

  if (awards && awards.length > 0) {
    sy = SectionHeading("Awards", sideX, sideWidth, sy);
    awards.forEach(a => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...TEXT_BODY_RGB);
      const aLines = doc.splitTextToSize(a.name || "", sideWidth);
      doc.text(aLines, sideX, sy);
      sy += (aLines.length * 4.2);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...CORAL_RGB);
      const issLines = doc.splitTextToSize(a.issuer || "", sideWidth);
      doc.text(issLines, sideX, sy);
      sy += (issLines.length * 4.2) + 2;
    });
  }


  doc.save(`${(p.name || "resume").replace(/\s+/g, "_")}_Student.pdf`);
}
