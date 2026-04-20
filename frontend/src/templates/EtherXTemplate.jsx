/* ─────────────────────────────────────────────────────────
   ETHERX SIGNATURE TEMPLATE  —  Elegant Split Redesign
   Forest Green Sidebar · Gold Accents · ATS-Optimized DOM
───────────────────────────────────────────────────────── */

const parseBullets = t =>
  (t || '').split('\n').map(l => l.trim().replace(/^[-•▸◆*▪]\s*/, '')).filter(Boolean)

const fmtM = m => {
  if (!m) return ''
  const [, mo, yyyy] = m.split('-')
  const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+mo - 1]
  return mon ? `${mon} ${yyyy}` : m
}

const GREEN_DEEP = '#1A3C34'
const GREEN_PILL = '#2A5C4A'
const GOLD = '#C9A84C'
const WHITE = '#FFFFFF'
const OFF_WHITE = '#F9F6EF'
const BONE = '#F5F0E8'
const TEXT_BODY = '#333333'
const TEXT_MUTED = '#777777'

const SANS = "'DM Sans', sans-serif"
const SERIF = "'Cinzel', serif"

/* Section heading — Content Area */
function SH({ children }) {
  return (
    <div style={{ margin: '1.4rem 0 .8rem', pageBreakAfter: 'avoid', breakAfter: 'avoid' }}>
      <div style={{
        fontFamily: SERIF, fontSize: '.9rem', fontWeight: 700,
        letterSpacing: '.12em', textTransform: 'uppercase', color: GREEN_DEEP,
      }}>{children}</div>
      <div style={{ height: '1px', background: GOLD, marginTop: '.2rem' }} />
    </div>
  )
}

/* Section heading — Sidebar */
function SSH({ children }) {
  return (
    <div style={{ margin: '1.4rem 0 .7rem', pageBreakAfter: 'avoid', breakAfter: 'avoid' }}>
      <div style={{
        fontFamily: SERIF, fontSize: '.75rem', fontWeight: 700,
        letterSpacing: '.15em', textTransform: 'uppercase', color: GOLD,
      }}>{children}</div>
      <div style={{ width: '24px', height: '2px', background: GOLD, marginTop: '.25rem' }} />
    </div>
  )
}

function Bullets({ text, color = TEXT_BODY }) {
  const items = parseBullets(text)
  if (!items.length) return null
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: '.4rem 0 0' }}>
      {items.map((b, i) => (
        <li key={i} style={{
          display: 'flex', gap: '.5rem', alignItems: 'flex-start',
          fontSize: '.74rem', color: color, lineHeight: 1.6, marginBottom: '.3rem',
          pageBreakInside: 'avoid', breakInside: 'avoid',
        }}>
          <span style={{ color: GOLD, fontSize: '.7rem', marginTop: '.12rem' }}>▪</span>
          {b}
        </li>
      ))}
    </ul>
  )
}

export default function EtherXTemplate({ data }) {
  const {
    personal: p = {},
    summary: s = { text: '' },
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
  } = data || {}

  const hasContent = p.name || s?.text || experience.length || education.length || skills.length

  if (!hasContent) return (
    <div style={{
      width: '100%', maxWidth: '720px', background: WHITE, minHeight: '792px',
      alignSelf: 'flex-start', display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 6px rgba(0,0,0,0.04),0 16px 48px rgba(0,0,0,0.10)',
    }}>
      <div style={{ textAlign: 'center', color: TEXT_MUTED, fontFamily: SANS }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '.5rem', color: GOLD }}>✦</div>
        <div style={{ fontFamily: SERIF, fontSize: '.85rem', color: GREEN_DEEP, letterSpacing: '.08em' }}>EtherX Signature</div>
        <div style={{ fontSize: '.72rem', color: TEXT_MUTED, marginTop: '.3rem' }}>Elegant Split Redesign</div>
      </div>
    </div>
  )

  const parts = (p.name || '').trim().split(/\s+/).filter(Boolean)
  const initials = parts.length >= 2
    ? parts[0][0] + parts[parts.length - 1][0]
    : parts[0]?.[0] || '?'

  const contactItems = [
    p.phone && { label: 'Phone', val: p.phone },
    p.email && { label: 'Email', val: p.email },
    p.location && { label: 'Location', val: p.location },
    p.linkedin && { label: 'LinkedIn', val: p.linkedin },
    p.github && { label: 'GitHub', val: p.github },
    p.website && { label: 'Website', val: p.website },
  ].filter(Boolean)

  return (
    <div id="resume-output" style={{
      width: '100%', maxWidth: '720px', background: WHITE, minHeight: '792px',
      alignSelf: 'flex-start', fontFamily: SANS, fontSize: '.82rem', color: TEXT_BODY,
      display: 'flex', boxShadow: '0 4px 6px rgba(0,0,0,0.04),0 16px 48px rgba(0,0,0,0.10)',
      overflow: 'hidden'
    }}>
      {/* SIDEBAR (Left) — ~32% */}
      <div style={{
        flex: '0 0 32%', background: GREEN_DEEP, padding: '2rem 1.4rem', 
        color: WHITE, display: 'flex', flexDirection: 'column'
      }}>
        {/* Avatar */}
        <div style={{
          width: '64px', height: '64px', borderRadius: '50%', background: GOLD,
          display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.2rem',
          boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
        }}>
          <span style={{ fontFamily: SERIF, fontSize: '1.4rem', fontWeight: 700, color: WHITE }}>
            {initials.toUpperCase()}
          </span>
        </div>

        {/* Name & Title */}
        <div style={{ marginBottom: '1.6rem' }}>
          <div style={{
            fontFamily: SERIF, fontSize: '1.4rem', fontWeight: 700, color: WHITE,
            letterSpacing: '.04em', lineHeight: 1.1, marginBottom: '.3rem'
          }}>{p.name || 'Your Name'}</div>
          {p.title && (
            <div style={{
              fontSize: '.75rem', fontWeight: 500, fontStyle: 'italic', 
              color: GOLD, letterSpacing: '.02em'
            }}>{p.title}</div>
          )}
        </div>

        {/* Contact Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem', marginBottom: '1rem' }}>
          {contactItems.map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.4rem', fontSize: '.68rem' }}>
              <span style={{ color: GOLD, fontSize: '1rem', lineHeight: 1 }}>•</span>
              <span style={{ opacity: 0.9 }}>{c.val}</span>
            </div>
          ))}
        </div>

        {/* Sidebar Sections */}
        {skills.length > 0 && (
          <>
            <SSH>Skills</SSH>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.4rem', marginBottom: '.5rem' }}>
              {skills.map((sk, i) => (
                <span key={i} style={{
                  fontSize: '.62rem', background: GREEN_PILL, color: WHITE,
                  padding: '.2rem .6rem', borderRadius: '4px', border: `1px solid rgba(255,255,255,0.1)`
                }}>{sk}</span>
              ))}
            </div>
          </>
        )}

        {education.length > 0 && (
          <>
            <SSH>Education</SSH>
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '.8rem' }}>
                <div style={{ fontWeight: 600, fontSize: '.7rem', color: WHITE }}>
                  {[e.degree, e.field].filter(Boolean).join(' in ') || 'Degree'}
                </div>
                <div style={{ fontSize: '.64rem', color: GOLD, marginTop: '.1rem' }}>{e.institution}</div>
                <div style={{ fontSize: '.6rem', opacity: 0.7, marginTop: '.1rem' }}>{e.start} - {e.end}</div>
              </div>
            ))}
          </>
        )}

        {certifications.length > 0 && (
          <>
            <SSH>Certifications</SSH>
            {certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: '.6rem' }}>
                <div style={{ fontWeight: 600, fontSize: '.7rem', color: WHITE }}>{c.name}</div>
                <div style={{ fontSize: '.62rem', color: GOLD, marginTop: '.1rem' }}>{c.issuer}</div>
              </div>
            ))}
          </>
        )}

        {/* Watermark */}
        <div style={{ marginTop: 'auto', paddingTop: '2rem', textAlign: 'center' }}>
          <div style={{ height: '1px', background: GOLD, opacity: 0.3, marginBottom: '.5rem' }} />
          <span style={{ fontFamily: SERIF, fontSize: '.5rem', letterSpacing: '.3em', color: GOLD, textTransform: 'uppercase' }}>EtherX</span>
        </div>
      </div>

      {/* MAIN CONTENT (Right) — ~68% */}
      <div style={{ flex: '0 0 68%', padding: '2rem 2.2rem', background: WHITE }}>
        
        {s?.text && (
          <div style={{ marginBottom: '1.5rem' }}>
            <SH>Professional Summary</SH>
            <p style={{ fontSize: '.78rem', lineHeight: 1.7, margin: 0 }}>{s.text}</p>
          </div>
        )}

        {experience.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            <SH>Work Experience</SH>
            {experience.map((e, i) => (
              <div key={i} style={{ marginBottom: '1.2rem', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '.5rem' }}>
                  <div style={{ fontWeight: 700, color: GREEN_DEEP, fontSize: '.85rem', textTransform: 'uppercase', letterSpacing: '.03em' }}>
                    {e.role || 'Role'}
                  </div>
                  <div style={{ fontSize: '.65rem', color: TEXT_MUTED, fontWeight: 500 }}>
                    {fmtM(e.start)}{e.start ? ' – ' : ''}{e.current ? 'Present' : fmtM(e.end)}
                  </div>
                </div>
                <div style={{ fontSize: '.75rem', color: GOLD, fontWeight: 600, marginTop: '.05rem', marginBottom: '.4rem' }}>
                  {e.company}
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
                  <div style={{ fontWeight: 700, color: GREEN_DEEP, fontSize: '.82rem' }}>{pr.name}</div>
                  {pr.url && (
                    <a style={{ fontSize: '.62rem', color: GOLD, textDecoration: 'none', fontWeight: 500 }}
                      href={`https://${pr.url}`} target="_blank" rel="noreferrer">{pr.url}</a>
                  )}
                </div>
                {pr.tech && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.3rem', marginTop: '.3rem', marginBottom: '.4rem' }}>
                    {pr.tech.split(',').map((t, ti) => (
                      <span key={ti} style={{
                        fontSize: '.6rem', color: GREEN_DEEP, border: `1px solid ${GREEN_DEEP}`,
                        padding: '.1rem .4rem', borderRadius: '3px', fontWeight: 500
                      }}>{t.trim()}</span>
                    ))}
                  </div>
                )}
                <Bullets text={pr.bullets} />
              </div>
            ))}
          </div>
        )}

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
  } = data || {};

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const sidebarWidth = pageWidth * 0.32;
  const mainWidth = pageWidth - sidebarWidth;
  const margin = 10;

  const GREEN_DEEP_RGB = [26, 60, 52]; // #1A3C34
  const GOLD_RGB = [201, 168, 76]; // #C9A84C
  const WHITE_RGB = [255, 255, 255];
  const TEXT_BODY_RGB = [51, 51, 51]; // #333333
  const TEXT_MUTED_RGB = [119, 119, 119];

  let my = 20; // Main Y (Right side)
  let sy = 20; // Sidebar Y (Left side)

  const checkMainPage = (h) => {
    if (my + h > 280) {
      doc.addPage();
      my = 20;
      sy = 20;
      drawSidebarBg();
      return true;
    }
    return false;
  };

  const drawSidebarBg = () => {
    doc.setFillColor(...GREEN_DEEP_RGB);
    doc.rect(0, 0, sidebarWidth, pageHeight, 'F');
  };

  const fmtM = m => {
    if (!m) return ''
    const [, mo, yyyy] = m.split('-')
    const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+mo - 1]
    return mon ? `${mon} ${yyyy}` : m
  }

  const parseBullets = t =>
    (t || '').split('\n').map(l => l.trim().replace(/^[-•▸◆*▪]\s*/, '')).filter(Boolean);

  drawSidebarBg();

  // --- SIDEBAR CONTENT (Left) ---
  
  // Initials Avatar
  const names = (p.name || "").split(" ");
  const initials = names.length > 1 ? (names[0][0] + names[names.length - 1][0]).toUpperCase() : (names[0]?.[0] || "?").toUpperCase();
  doc.setFillColor(...GOLD_RGB);
  doc.circle(sidebarWidth / 2, sy + 10, 10, 'F');
  doc.setFont("times", "bold");
  doc.setFontSize(12);
  doc.setTextColor(...WHITE_RGB);
  doc.text(initials, sidebarWidth / 2, sy + 11.5, { align: 'center' });
  sy += 30;

  // Name & Title in Sidebar
  doc.setFont("times", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...WHITE_RGB);
  const nameLines = doc.splitTextToSize(p.name || "Your Name", sidebarWidth - 15);
  doc.text(nameLines, margin, sy);
  sy += (nameLines.length * 7);

  if (p.title) {
    doc.setFont("times", "italic");
    doc.setFontSize(9);
    doc.setTextColor(...GOLD_RGB);
    const titleLines = doc.splitTextToSize(p.title, sidebarWidth - 15);
    doc.text(titleLines, margin, sy);
    sy += (titleLines.length * 5) + 5;
  }

  // Contact Info in Sidebar
  const contactLines = [
    p.email, p.phone, p.location, p.linkedin, p.github, p.website
  ].filter(Boolean);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  contactLines.forEach(line => {
    doc.setTextColor(...GOLD_RGB);
    doc.text("\u2022", margin, sy);
    doc.setTextColor(...WHITE_RGB);
    doc.text(line, margin + 4, sy);
    sy += 4.5;
  });
  sy += 5;

  const SidebarSSH = (title) => {
    doc.setFont("times", "bold");
    doc.setFontSize(9);
    doc.setTextColor(...GOLD_RGB);
    doc.text(title.toUpperCase(), margin, sy, { charSpace: 1 });
    doc.setDrawColor(...GOLD_RGB);
    doc.setLineWidth(0.4);
    doc.line(margin, sy + 1.5, margin + 8, sy + 1.5);
    sy += 8;
  };

  if (skills.length > 0) {
    SidebarSSH("Skills");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(...WHITE_RGB);
    const skillsText = skills.join(", ");
    const skLines = doc.splitTextToSize(skillsText, sidebarWidth - 15);
    doc.text(skLines, margin, sy);
    sy += (skLines.length * 4.5) + 5;
  }

  if (education.length > 0) {
    SidebarSSH("Education");
    education.forEach(e => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...WHITE_RGB);
      const degree = [e.degree, e.field].filter(Boolean).join(" in ") || "Degree";
      const dLines = doc.splitTextToSize(degree, sidebarWidth - 15);
      doc.text(dLines, margin, sy);
      sy += (dLines.length * 4);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(7.5);
      doc.setTextColor(...GOLD_RGB);
      doc.text(e.institution || "", margin, sy);
      sy += 4;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...WHITE_RGB);
      doc.text(`${e.start} - ${e.end}`, margin, sy);
      sy += 6;
    });
  }

  if (certifications.length > 0) {
    SidebarSSH("Certifications");
    certifications.forEach(c => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...WHITE_RGB);
      const cLines = doc.splitTextToSize(c.name || "", sidebarWidth - 15);
      doc.text(cLines, margin, sy);
      sy += (cLines.length * 4);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7.5);
      doc.setTextColor(...GOLD_RGB);
      doc.text(c.issuer || "", margin, sy);
      sy += 6;
    });
  }

  // --- MAIN CONTENT (Right) ---
  const startX = sidebarWidth + margin;
  const contentWidth = mainWidth - (margin * 2);

  const MainSH = (title) => {
    checkMainPage(15);
    doc.setFont("times", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...GREEN_DEEP_RGB);
    doc.text(title.toUpperCase(), startX, my, { charSpace: 1 });
    doc.setDrawColor(...GOLD_RGB);
    doc.setLineWidth(0.3);
    doc.line(startX, my + 1.5, startX + contentWidth, my + 1.5);
    my += 10;
  };

  if (s.text) {
    MainSH("Professional Summary");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...TEXT_BODY_RGB);
    const sLines = doc.splitTextToSize(s.text, contentWidth);
    doc.text(sLines, startX, my, { lineHeightFactor: 1.5 });
    my += (sLines.length * 5) + 8;
  }

  if (experience.length > 0) {
    MainSH("Work Experience");
    experience.forEach(e => {
      checkMainPage(25);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...GREEN_DEEP_RGB);
      doc.text((e.role || "Role").toUpperCase(), startX, my);
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(...TEXT_MUTED_RGB);
      const date = `${fmtM(e.start)}${e.start ? ' - ' : ''}${e.current ? 'Present' : fmtM(e.end)}`;
      doc.text(date, startX + contentWidth, my, { align: 'right' });
      my += 5;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(9);
      doc.setTextColor(...GOLD_RGB);
      doc.text(e.company || "", startX, my);
      my += 6;

      const bullets = parseBullets(e.bullets);
      bullets.forEach(b => {
        checkMainPage(6);
        doc.setFontSize(9);
        doc.setTextColor(...GOLD_RGB);
        doc.text("\u25AA", startX, my); // Gold Square
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...TEXT_BODY_RGB);
        const bLines = doc.splitTextToSize(b, contentWidth - 5);
        doc.text(bLines, startX + 4, my);
        my += (bLines.length * 4.5) + 1.5;
      });
      my += 4;
    });
  }

  if (projects.length > 0) {
    MainSH("Projects");
    projects.forEach(pr => {
      checkMainPage(20);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...GREEN_DEEP_RGB);
      doc.text(pr.name || "Project", startX, my);

      if (pr.url) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(...GOLD_RGB);
        doc.text(pr.url, startX + contentWidth, my, { align: 'right' });
      }
      my += 5;

      if (pr.tech) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(...GREEN_DEEP_RGB);
        doc.text(pr.tech, startX, my);
        my += 5;
      }

      const bullets = parseBullets(pr.bullets);
      bullets.forEach(b => {
        checkMainPage(6);
        doc.setFontSize(9);
        doc.setTextColor(...GOLD_RGB);
        doc.text("\u25AA", startX, my); // Gold Square
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...TEXT_BODY_RGB);
        const bLines = doc.splitTextToSize(b, contentWidth - 5);
        doc.text(bLines, startX + 4, my);
        my += (bLines.length * 4.5) + 1.5;
      });
      my += 4;
    });
  }

  doc.save(`${(p.name || "resume").replace(/\s+/g, "_")}_EtherX.pdf`);
}
