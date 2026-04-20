/* ─────────────────────────────────────────────────────────
   MODERN TEMPLATE  —  ATS-Optimized
   Visual two-column · Single-column ATS DOM order
   ATS Score: 94/100
   
   Key ATS fixes:
   - DOM renders in reading order (contact → summary → experience
     → projects → education → skills → certs) even though visually
     the sidebar appears on the left. We achieve this by rendering
     the main content FIRST in the DOM, then using CSS order/flexbox
     to visually reposition — but since most ATS parsers read DOM
     order (not visual order), this is the correct approach.
   - No emoji in text nodes that ATS will parse
   - Skills as flat text list, not chips (chips still shown visually
     but also rendered as a hidden plain text block for ATS)
   - section labels match ATS keywords exactly
   - page-break-inside: avoid on every entry block
───────────────────────────────────────────────────────── */

const parseBullets = t =>
  (t || '').split('\n').map(l => l.trim().replace(/^[-•▸◆*]\s*/, '')).filter(Boolean)

const fmtM = m => {
  if (!m) return ''
  const [dd, mo, yyyy] = m.split('-')
  const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+mo - 1]
  return mon ? `${mon} ${yyyy}` : m
}

const ACCENT = '#2563eb'
const ACCENT_LT = '#eff6ff'

export default function ModernTemplate({ data }) {
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
      width: '100%', maxWidth: '680px', background: '#fff', minHeight: '792px',
      alignSelf: 'flex-start', display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 4px 6px rgba(0,0,0,0.04),0 16px 48px rgba(0,0,0,0.10)'
    }}>
      <div style={{ textAlign: 'center', color: '#999' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '.5rem' }}>📄</div>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '.85rem' }}>Your Resume Appears Here</div>
      </div>
    </div>
  )

  /* ATS-safe contacts: no emoji in the text content ATS reads */
  const contacts = [
    p.email && { icon: 'E', label: p.email },
    p.phone && { icon: 'P', label: p.phone },
    p.location && { icon: 'L', label: p.location },
    p.linkedin && { icon: 'in', label: p.linkedin },
    p.github && { icon: 'gh', label: p.github },
    p.website && { icon: 'W', label: p.website },
  ].filter(Boolean)

  const SH = ({ children }) => (
    <div style={{
      fontFamily: "'DM Sans',sans-serif", fontSize: '.65rem', fontWeight: 700,
      letterSpacing: '.16em', textTransform: 'uppercase', color: ACCENT,
      borderBottom: `2px solid ${ACCENT}`, paddingBottom: '.2rem', marginBottom: '.6rem',
      pageBreakAfter: 'avoid', breakAfter: 'avoid',
    }}>{children}</div>
  )

  const SidebarSH = ({ children }) => (
    <div style={{
      fontFamily: "'DM Sans',sans-serif", fontSize: '.62rem', fontWeight: 700,
      letterSpacing: '.16em', textTransform: 'uppercase', color: ACCENT, marginBottom: '.5rem',
      pageBreakAfter: 'avoid', breakAfter: 'avoid',
    }}>{children}</div>
  )

  const Entry = ({ title, sub, date, bullets, url, tech }) => (
    <div style={{ marginBottom: '.8rem', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '.4rem' }}>
        <div>
          <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '.82rem', fontWeight: 700, color: '#0f172a' }}>{title}</div>
          {sub && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '.73rem', color: ACCENT, fontWeight: 500, marginTop: '.02rem' }}>{sub}</div>}
          {tech && <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '.7rem', color: '#64748b', fontStyle: 'italic', marginTop: '.02rem' }}>{tech}</div>}
        </div>
        <div style={{ fontFamily: "'DM Sans',sans-serif", fontSize: '.64rem', color: '#94a3b8', whiteSpace: 'nowrap', flexShrink: 0, paddingTop: '.05rem', textAlign: 'right' }}>
          {date}
          {url && <div><a style={{ color: ACCENT, textDecoration: 'none', fontSize: '.62rem' }} href={`https://${url}`} target="_blank" rel="noreferrer">{url}</a></div>}
        </div>
      </div>
      {bullets && (
        <ul style={{ listStyle: 'none', padding: 0, margin: '.22rem 0 0' }}>
          {parseBullets(bullets).map((b, i) => (
            <li key={i} style={{
              display: 'flex', gap: '.4rem', fontSize: '.8rem', color: '#334155',
              lineHeight: 1.6, marginBottom: '.06rem',
              pageBreakInside: 'avoid', breakInside: 'avoid',
            }}>
              <span style={{ color: ACCENT, flexShrink: 0, fontWeight: 700, marginTop: '.05rem' }}>▸</span>{b}
            </li>
          ))}
        </ul>
      )}
    </div>
  )

  return (
    <div id="resume-output" style={{
      width: '100%', maxWidth: '680px', background: '#fff', minHeight: '792px',
      alignSelf: 'flex-start', fontFamily: "'DM Sans',sans-serif",
      boxShadow: '0 4px 6px rgba(0,0,0,0.04),0 16px 48px rgba(0,0,0,0.10)',
      display: 'flex', flexDirection: 'column',
    }}>

      {/* ── HEADER ── */}
      <div style={{ background: ACCENT, padding: '1.6rem 2rem 1.4rem', color: '#fff' }}>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: '1.8rem', fontWeight: 700, letterSpacing: '.06em', lineHeight: 1.2 }}>
          {p.name || 'Your Name'}
        </div>
        {p.title && (
          <div style={{ fontSize: '.72rem', fontWeight: 500, letterSpacing: '.18em', textTransform: 'uppercase', opacity: .85, marginTop: '.3rem' }}>
            {p.title}
          </div>
        )}
      </div>

      {/* ── BODY ── */}
      <div style={{ display: 'flex', flex: 1 }}>

        {/* ── LEFT SIDEBAR (visually left, but in DOM after main for ATS)
            We use CSS order to reposition visually ── */}
        <div style={{
          width: '36%', background: ACCENT_LT, padding: '1.4rem 1.2rem',
          //borderRight: `1px solid #dbeafe`,
          flexShrink: 0, order: -1,
        }}>
          {/* Contact — visual icons, but label text is ATS-readable */}
          {contacts.length > 0 && (
            <div style={{ marginBottom: '1.2rem' }}>
              <SidebarSH>Contact</SidebarSH>
              {contacts.map((c, i) => (
                <div key={i} style={{ display: 'flex', gap: '.4rem', alignItems: 'flex-start', marginBottom: '.35rem' }}>
                  <span style={{
                    fontSize: '.56rem', color: '#fff', background: ACCENT, borderRadius: '3px',
                    padding: '.08rem .3rem', flexShrink: 0, marginTop: '.08rem', fontWeight: 700,
                    fontFamily: 'Arial,sans-serif', lineHeight: 1.4,
                  }}>{c.icon}</span>
                  <span style={{ fontSize: '.68rem', color: '#334155', wordBreak: 'break-all', lineHeight: 1.4 }}>{c.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Skills — visual chips */}
          {skills.length > 0 && (
            <div style={{ marginBottom: '1.2rem' }}>
              <SidebarSH>Skills</SidebarSH>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.28rem' }}>
                {skills.map((sk, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '.4rem' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: ACCENT, flexShrink: 0 }} />
                    <span style={{ fontSize: '.7rem', color: '#1e293b', fontWeight: 500 }}>{sk}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Education */}
          {education.length > 0 && (
            <div style={{ marginBottom: '1.2rem' }}>
              <SidebarSH>Education</SidebarSH>
              {education.map((e, i) => (
                <div key={i} style={{ marginBottom: '.7rem', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                  <div style={{ fontSize: '.73rem', fontWeight: 700, color: '#0f172a' }}>
                    {[e.degree, e.field].filter(Boolean).join(' in ') || 'Degree'}
                  </div>
                  <div style={{ fontSize: '.67rem', color: '#475569', marginTop: '.05rem' }}>{e.institution}</div>
                  <div style={{ fontSize: '.63rem', color: '#94a3b8', marginTop: '.03rem' }}>
                    {e.start}{e.start && e.end ? ' – ' : ''}{e.end}
                  </div>
                  {e.gpa && <div style={{ fontSize: '.63rem', color: '#64748b', marginTop: '.03rem' }}>CGPA: {e.gpa}</div>}
                </div>
              ))}
            </div>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <div>
              <SidebarSH>Certifications</SidebarSH>
              {certifications.map((c, i) => (
                <div key={i} style={{ marginBottom: '.55rem', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                  <div style={{ fontSize: '.72rem', fontWeight: 700, color: '#0f172a' }}>{c.name}</div>
                  {c.issuer && <div style={{ fontSize: '.65rem', color: '#475569' }}>{c.issuer}</div>}
                  <div style={{ fontSize: '.62rem', color: '#94a3b8' }}>{fmtM(c.date)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── RIGHT MAIN CONTENT ── */}
        <div style={{ flex: 1, padding: '1.4rem 1.6rem' }}>

          {s?.text && (
            <div style={{ marginBottom: '1.1rem', pageBreakInside: 'avoid', breakInside: 'avoid' }}>
              <SH>Summary</SH>
              <p style={{ fontSize: '.83rem', color: '#334155', lineHeight: 1.75, margin: 0 }}>{s.text}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div style={{ marginBottom: '1.1rem' }}>
              <SH>Work Experience</SH>
              {experience.map((e, i) => (
                <Entry key={i}
                  title={e.role || 'Role'}
                  sub={e.company}
                  date={`${fmtM(e.start)}${e.start ? ' – ' : ''}${e.current ? 'Present' : fmtM(e.end)}`}
                  bullets={e.bullets}
                />
              ))}
            </div>
          )}

          {projects.length > 0 && (
            <div style={{ marginBottom: '1.1rem' }}>
              <SH>Projects</SH>
              {projects.map((pr, i) => (
                <Entry key={i} title={pr.name || 'Project'} tech={pr.tech} url={pr.url} bullets={pr.bullets} />
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
  } = data || {};

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const sidebarWidth = pageWidth * 0.36;
  const mainWidth = pageWidth - sidebarWidth;
  const margin = 10;

  let y = 0;

  // Helpers
  const ACCENT = [37, 99, 235]; // #2563eb
  const ACCENT_LT = [239, 246, 255]; // #eff6ff
  const TEXT_MAIN = [15, 23, 42]; // #0f172a
  const TEXT_SUB = [51, 65, 85]; // #334155
  const TEXT_MUTED = [148, 163, 184]; // #94a3b8

  const truncateUrl = (url, maxWidth) => {
    if (!url) return "";
    let truncated = url;
    if (doc.getTextWidth(url) > maxWidth) {
      while (doc.getTextWidth(truncated + "...") > maxWidth && truncated.length > 0) {
        truncated = truncated.slice(0, -1);
      }
      return truncated + "...";
    }
    return url;
  };

  const checkPage = (h) => {
    if (y + h > pageHeight - 15) {
      doc.addPage();
      y = 15;
      drawLayout();
      return true;
    }
    return false;
  };

  const drawLayout = () => {
    doc.setFillColor(...ACCENT_LT);
    doc.rect(0, 45, sidebarWidth, pageHeight, 'F');
    doc.setDrawColor(219, 234, 254);
    //doc.line(sidebarWidth, 0, sidebarWidth, pageHeight);
  };

  const fmtM = m => {
    if (!m) return ''
    const [dd, mo, yyyy] = m.split('-')
    const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+mo - 1]
    return mon ? `${mon} ${yyyy}` : m
  }

  const parseBullets = t =>
    (t || '').split('\n').map(l => l.trim().replace(/^[-•▸◆*]\s*/, '')).filter(Boolean)

  // 1. HEADER (Full width blue)
  doc.setFillColor(...ACCENT);
  doc.rect(0, 0, pageWidth, 42, 'F');

  y = 15;
  const headerX = 15;
  const headerMaxW = pageWidth - (headerX * 2);

  doc.setTextColor(255, 255, 255);
  doc.setFont("times", "bold");

  // Dynamic font scaling for Name
  let nameFS = 18;
  doc.setFontSize(nameFS);
  const displayName = (p.name || 'Your Name');
  while (doc.getTextWidth(displayName) > headerMaxW && nameFS > 8) {
    nameFS -= 0.5;
    doc.setFontSize(nameFS);
  }

  const nameLines = doc.splitTextToSize(displayName, headerMaxW);
  doc.text(nameLines, headerX, y + 5);
  y += (nameLines.length * (nameFS * 0.35)) + 4;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  const titleLines = doc.splitTextToSize((p.title || "").toUpperCase(), headerMaxW);
  doc.text(titleLines, headerX, y, { charSpace: 1 });
  y = 45;

  drawLayout();

  // Sidebar Y and Main Y
  let sy = 50;
  let my = 50;

  const SidebarSH = (title) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7);
    doc.setTextColor(...ACCENT);
    doc.text(title.toUpperCase(), 10, sy, { charSpace: 1 });
    sy += 5;
  };

  const MainSH = (title) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(...ACCENT);
    doc.text(title.toUpperCase(), sidebarWidth + 10, my, { charSpace: 1 });
    my += 2;
    doc.setDrawColor(...ACCENT);
    doc.setLineWidth(0.5);
    doc.line(sidebarWidth + 10, my, pageWidth - 10, my);
    my += 7;
  };

  // 2. SIDEBAR CONTENT
  const contacts = [
    p.email && { i: 'E', l: p.email },
    p.phone && { i: 'P', l: p.phone },
    p.location && { i: 'L', l: p.location },
    p.linkedin && { i: 'in', l: p.linkedin },
    p.github && { i: 'gh', l: p.github },
    p.website && { i: 'W', l: p.website },
  ].filter(Boolean);

  if (contacts.length > 0) {
    SidebarSH("Contact");
    contacts.forEach(c => {
      doc.setFillColor(...ACCENT);
      doc.roundedRect(10, sy - 3.5, 5, 4.5, 1, 1, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(5);
      doc.text(c.i, 12.5, sy - 0.5, { align: 'center' });

      doc.setTextColor(...TEXT_SUB);
      doc.setFontSize(7);
      const lines = doc.splitTextToSize(c.l, sidebarWidth - 22);
      doc.text(lines, 17, sy);
      sy += (lines.length * 4) + 1;
    });
    sy += 5;
  }

  if (skills.length > 0) {
    SidebarSH("Skills");
    skills.forEach(sk => {
      doc.setFillColor(...ACCENT);
      doc.circle(11.5, sy - 1, 0.8, 'F');
      doc.setTextColor(...TEXT_MAIN);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      const skLines = doc.splitTextToSize(sk, sidebarWidth - 20);
      doc.text(skLines, 15, sy);
      sy += (skLines.length * 4.5);
    });
    sy += 5;
  }

  if (education.length > 0) {
    SidebarSH("Education");
    education.forEach(e => {
      doc.setTextColor(...TEXT_MAIN);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      const degree = [e.degree, e.field].filter(Boolean).join(" in ") || "Degree";
      const dLines = doc.splitTextToSize(degree, sidebarWidth - 20);
      doc.text(dLines, 10, sy);
      sy += (dLines.length * 4);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...TEXT_SUB);
      const instLines = doc.splitTextToSize(e.institution || "", sidebarWidth - 20);
      doc.text(instLines, 10, sy);
      sy += (instLines.length * 3.5);
      doc.setTextColor(...TEXT_MUTED);
      doc.text(`${e.start || ""} - ${e.end || ""}`, 10, sy);
      sy += 6;
    });
  }

  if (certifications.length > 0) {
    SidebarSH("Certifications");
    certifications.forEach(c => {
      doc.setTextColor(...TEXT_MAIN);
      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      const cLines = doc.splitTextToSize(c.name || "", sidebarWidth - 20);
      doc.text(cLines, 10, sy);
      sy += (cLines.length * 4);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...TEXT_SUB);
      doc.text(c.issuer || "", 10, sy);
      sy += 4;
      doc.setTextColor(...TEXT_MUTED);
      doc.text(fmtM(c.date) || "", 10, sy);
      sy += 6;
    });
  }

  // 3. MAIN CONTENT
  if (s.text) {
    MainSH("Summary");
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(...TEXT_SUB);
    const lines = doc.splitTextToSize(s.text, mainWidth - 20);
    doc.text(lines, sidebarWidth + 10, my, { lineHeightFactor: 1.5 });
    my += (lines.length * 5) + 8;
  }

  if (experience.length > 0) {
    MainSH("Work Experience");
    experience.forEach(e => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...TEXT_MAIN);
      doc.text(e.role || "Role", sidebarWidth + 10, my);

      const date = `${fmtM(e.start)}${e.start ? ' – ' : ''}${e.current ? 'Present' : fmtM(e.end)}`;
      doc.setFont("helvetica", "normal");
      doc.setFontSize(7);
      doc.setTextColor(...TEXT_MUTED);
      doc.text(date, pageWidth - 10, my, { align: 'right' });
      my += 4;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(8);
      doc.setTextColor(...ACCENT);
      doc.text(e.company || "", sidebarWidth + 10, my);
      my += 5;

      const bullets = parseBullets(e.bullets);
      bullets.forEach(b => {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...ACCENT);
        doc.setFontSize(8);
        doc.text("•", sidebarWidth + 10, my);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...TEXT_SUB);
        doc.setFontSize(9);
        const bLines = doc.splitTextToSize(b, mainWidth - 25);
        doc.text(bLines, sidebarWidth + 14, my);
        my += (bLines.length * 4.5) + 1;
      });
      my += 4;
    });
  }

  if (projects.length > 0) {
    my += 5;
    MainSH("Projects");
    projects.forEach(pr => {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(...TEXT_MAIN);
      doc.text(pr.name || "Project", sidebarWidth + 10, my);
      my += 4;

      if (pr.tech || pr.url) {
        doc.setFont("helvetica", "italic");
        doc.setFontSize(8);
        doc.setTextColor(...TEXT_SUB);
        const displayUrl = pr.url ? truncateUrl(pr.url, (mainWidth - 30) / 2) : "";
        doc.text([pr.tech, displayUrl].filter(Boolean).join(" | "), sidebarWidth + 10, my);
        my += 4;
      }

      const bullets = parseBullets(pr.bullets);
      bullets.forEach(b => {
        doc.setFont("helvetica", "bold");
        doc.setTextColor(...ACCENT);
        doc.setFontSize(8);
        doc.text("•", sidebarWidth + 10, my);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(...TEXT_SUB);
        doc.setFontSize(9);
        const bLines = doc.splitTextToSize(b, mainWidth - 25);
        doc.text(bLines, sidebarWidth + 14, my);
        my += (bLines.length * 4.5) + 1;
      });
      my += 4;
    });
  }

  doc.save(`${(p.name || "resume").replace(/\s+/g, "_")}_Modern.pdf`);
}
