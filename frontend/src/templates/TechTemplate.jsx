/* ─────────────────────────────────────────────────────────
   TECH TEMPLATE  —  Modern IT Professional
   Two-Column · Dark Navy & Gold · ATS Optimized
   Layout: Left (35%) #1A2B3C | Right (65%) #FFFFFF
───────────────────────────────────────────────────────── */

import React from 'react';

/* ── Helpers ───────────────────────────────────────────── */
const parseBullets = t =>
  (t || '').split('\n').map(l => l.trim().replace(/^[-•▸◆*]\s*/, '')).filter(Boolean);

const fmtDate = m => {
  if (!m) return '';
  const parts = m.split('-');
  if (parts.length === 3) {
    const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][+parts[1] - 1];
    return mon ? `${mon} ${parts[0]}` : m;
  }
  return m;
};

const GOLD = '#C9A84C';
const DARK_NAVY = '#1A2B3C';
const DEEP_NAVY = '#0D2137';
const WHITE = '#FFFFFF';
const TEXT_RIGHT = '#222222';
const SANS = "'Inter', 'DM Sans', sans-serif";
const SERIF = "'Cinzel', serif";

export default function TechTemplate({ data }) {
  const {
    personal: p = {},
    summary: s = { text: '' },
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    awards = [],
    languages = [],
  } = data || {};

  const hasContent = p.name || s?.text || experience.length || education.length || skills.length;

  if (!hasContent) return (
    <div style={{
      width: '100%', maxWidth: '720px', background: '#fff', minHeight: '800px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)', borderRadius: '8px'
    }}>
      <div style={{ textAlign: 'center', color: '#ccc', fontFamily: SANS }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💻</div>
        <p>Tech Resume Preview</p>
      </div>
    </div>
  );

  const initials = (p.name || '')
    .split(' ')
    .filter(Boolean)
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  /* Section Header - Left Column (Muted) */
  const LSH = ({ children }) => (
    <div style={{
      fontFamily: SANS, fontSize: '0.7rem', fontWeight: 700,
      textTransform: 'uppercase', letterSpacing: '0.15em',
      color: GOLD, marginBottom: '0.8rem', marginTop: '1.5rem',
      borderBottom: `1px solid rgba(201, 168, 76, 0.3)`,
      paddingBottom: '0.3rem'
    }}>
      {children}
    </div>
  );

  /* Section Header - Right Column (Bold) */
  const RSH = ({ title }) => (
    <div style={{ marginBottom: '1.2rem', marginTop: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
        <span style={{
          fontFamily: SANS, fontSize: '0.95rem', fontWeight: 800,
          color: GOLD, textTransform: 'uppercase', letterSpacing: '0.05em'
        }}>{title}</span>
      </div>
      <div style={{ height: '2px', background: `linear-gradient(to right, ${GOLD}, #14b8a6)`, width: '100%' }} />
    </div>
  );

  return (
    <div id="resume-output" style={{
      width: '100%', maxWidth: '800px', background: WHITE,
      minHeight: '1050px', display: 'flex', boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
      overflow: 'hidden', alignSelf: 'flex-start'
    }}>
      {/* Load Fonts */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700&family=Inter:wght@300;400;600;800&display=swap');
      `}} />

      {/* LEFT COLUMN (35%) */}
      <div style={{
        width: '35%', background: DARK_NAVY, color: WHITE,
        padding: '2.5rem 1.5rem', display: 'flex', flexDirection: 'column'
      }}>
        {/* AVATAR */}
        <div style={{
          width: '70px', height: '70px', background: GOLD, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          alignSelf: 'center', marginBottom: '1.2rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.3)', border: `3px solid rgba(255,255,255,0.1)`
        }}>
          <span style={{ fontFamily: SERIF, fontSize: '1.5rem', fontWeight: 700, color: DARK_NAVY }}>
            {initials || '?'}
          </span>
        </div>

        {/* NAME & TITLE */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <h1 style={{
            fontFamily: SERIF, fontSize: '18pt', fontWeight: 700,
            margin: 0, lineHeight: 1.2, color: WHITE
          }}>
            {p.name || 'Your Name'}
          </h1>
          {p.title && (
            <p style={{
              fontFamily: SANS, fontSize: '10pt', fontStyle: 'italic',
              margin: '0.4rem 0 0', color: GOLD, fontWeight: 500
            }}>
              {p.title}
            </p>
          )}
        </div>

        {/* CONTACT INFO */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'EMAIL', val: p.email },
            { label: 'PHONE', val: p.phone },
            { label: 'ADDR', val: p.location },
            { label: 'GIT', val: p.github },
          ].filter(item => item.val).map((c, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.75rem' }}>
              <span style={{ color: GOLD, fontWeight: 700, minWidth: '40px' }}>{c.label}</span>
              <span style={{ opacity: 0.9, wordBreak: 'break-all' }}>{c.val}</span>
            </div>
          ))}
        </div>

        {/* SUMMARY / TAGLINE */}
        {s?.text && (
          <div style={{ marginBottom: '1rem' }}>
            <LSH>About Me</LSH>
            <p style={{ fontSize: '0.78rem', lineHeight: 1.6, margin: 0, opacity: 0.85 }}>
              {s.text}
            </p>
          </div>
        )}

        {/* SKILLS / EXPERTISE */}
        {skills.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <LSH>Areas of Expertise</LSH>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {skills.map((sk, i) => (
                <span key={i} style={{
                  fontSize: '0.65rem', background: DEEP_NAVY, color: WHITE,
                  border: `1px solid ${GOLD}`, borderRadius: '4px',
                  padding: '0.2rem 0.5rem', fontWeight: 600
                }}>
                  {sk}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* CERTIFICATES */}
        {certifications.length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <LSH>Certificates</LSH>
            {certifications.map((c, i) => (
              <div key={i} style={{ marginBottom: '0.6rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, color: GOLD }}>{c.name}</div>
                <div style={{ fontSize: '0.65rem', opacity: 0.7 }}>{c.issuer}</div>
              </div>
            ))}
          </div>
        )}

        {/* LANGUAGES */}
        {(languages && languages.length > 0) && (
          <div>
            <LSH>Languages</LSH>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
              {languages.map((l, i) => (
                <div key={i} style={{ fontSize: '0.75rem', display: 'flex', justifyContent: 'space-between' }}>
                  <span>{l.name || l}</span>
                  <span style={{ color: GOLD, fontSize: '0.65rem' }}>{l.level}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN (65%) */}
      <div style={{ width: '65%', background: WHITE, padding: '2.5rem 2rem' }}>
        {/* WORK EXPERIENCE */}
        {experience.length > 0 && (
          <section style={{ marginBottom: '2rem' }}>
            <RSH title="Work Experience" />
            {experience.map((e, i) => (
              <div key={i} style={{ marginBottom: '1.5rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: DARK_NAVY }}>
                      {e.role}
                    </h3>
                    <div style={{ color: GOLD, fontWeight: 600, fontSize: '0.9rem', marginTop: '0.1rem' }}>
                      {e.company}
                    </div>
                  </div>
                  <div style={{
                    fontSize: '0.75rem', color: '#666', background: '#f8fafc',
                    padding: '0.15rem 0.6rem', borderRadius: '12px', border: '1px solid #e2e8f0'
                  }}>
                    {fmtDate(e.start)} — {e.current ? 'Present' : fmtDate(e.end)}
                  </div>
                </div>
                <ul style={{ paddingLeft: '1.1rem', margin: '0.6rem 0 0', listStyle: 'none' }}>
                  {parseBullets(e.bullets).map((b, j) => (
                    <li key={j} style={{
                      fontSize: '0.85rem', color: TEXT_RIGHT, lineHeight: 1.5,
                      marginBottom: '0.3rem', position: 'relative'
                    }}>
                      <span style={{ position: 'absolute', left: '-1rem', color: GOLD }}>•</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <section style={{ marginBottom: '2rem' }}>
            <RSH title="Key Projects" />
            {projects.map((pr, i) => (
              <div key={i} style={{ marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: DARK_NAVY }}>{pr.name}</h4>
                  {pr.url && <a href={pr.url} style={{ fontSize: '0.75rem', color: GOLD, textDecoration: 'none' }}>Link</a>}
                </div>
                {pr.tech && <div style={{ fontSize: '0.75rem', color: '#666', fontStyle: 'italic' }}>{pr.tech}</div>}
                <ul style={{ paddingLeft: '1.1rem', margin: '0.4rem 0 0', listStyle: 'none' }}>
                  {parseBullets(pr.bullets).map((b, j) => (
                    <li key={j} style={{
                      fontSize: '0.82rem', color: TEXT_RIGHT, lineHeight: 1.5,
                      marginBottom: '0.2rem', position: 'relative'
                    }}>
                      <span style={{ position: 'absolute', left: '-1rem', color: GOLD }}>•</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* AWARDS */}
        {awards.length > 0 && (
          <section style={{ marginBottom: '2rem' }}>
            <RSH title="Awards & Recognitions" />
            {awards.map((a, i) => (
              <div key={i} style={{ marginBottom: '0.8rem' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: DARK_NAVY }}>{a.name || a.title}</div>
                <div style={{ fontSize: '0.8rem', color: '#666' }}>{a.issuer || a.organization} • {fmtDate(a.date)}</div>
              </div>
            ))}
          </section>
        )}

        {/* EDUCATION */}
        {education.length > 0 && (
          <section>
            <RSH title="Education" />
            {education.map((e, i) => (
              <div key={i} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 700, color: DARK_NAVY, fontSize: '0.95rem' }}>
                    {[e.degree, e.field].filter(Boolean).join(' in ')}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>{e.start} — {e.end}</div>
                </div>
                <div style={{ fontSize: '0.85rem', color: GOLD, fontWeight: 500 }}>{e.institution}</div>
                {e.gpa && <div style={{ fontSize: '0.8rem', color: '#777' }}>GPA: {e.gpa}</div>}
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}

/* ── PDF Export Function ───────────────────────────────── */
export async function exportTechPDF(data) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

  const {
    personal: p = {},
    summary: s = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    awards = [],
    languages = [],
  } = data || {};

  const pageWidth = 210;
  const pageHeight = 297;
  const leftColWidth = pageWidth * 0.35;
  const rightColWidth = pageWidth - leftColWidth;
  const margin = 12;
  const rightMarginLimit = pageWidth - 15; // Strict 15mm right margin

  const GOLD_COLOR = [201, 168, 76]; // #C9A84C
  const NAVY_COLOR = [26, 43, 60];  // #1A2B3C
  const BLACK_COLOR = [34, 34, 34]; // #222222

  let ly = 30; // Left column Y
  let ry = 25; // Right column Y

  // Helper: Draw Left Section Header
  const drawLSH = (text) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...GOLD_COLOR);
    doc.text(text.toUpperCase(), margin, ly, { charSpace: 1 });
    ly += 1;
    doc.setDrawColor(201, 168, 76, 75); // 0.3 opacity approx
    doc.line(margin, ly, leftColWidth - margin, ly);
    ly += 5;
  };

  // Helper: Draw Right Section Header
  const drawRSH = (text) => {
    if (ry > pageHeight - 30) { 
      doc.addPage(); 
      ry = 20; 
      drawSidebarBg(); 
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...GOLD_COLOR);
    doc.text(text.toUpperCase(), leftColWidth + 10, ry, { charSpace: 1 });
    ry += 2;
    doc.setLineWidth(0.5);
    doc.setDrawColor(...GOLD_COLOR);
    doc.line(leftColWidth + 10, ry, rightMarginLimit, ry);
    ry += 7;
  };

  const drawSidebarBg = () => {
    doc.setFillColor(...NAVY_COLOR);
    doc.rect(0, 0, leftColWidth, pageHeight, 'F');
  };

  // 1. Sidebar Background
  drawSidebarBg();

  // Avatar Circle
  doc.setFillColor(...GOLD_COLOR);
  doc.circle(leftColWidth / 2, 20, 10, 'F');
  doc.setFont('times', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(...NAVY_COLOR);
  const initials = (p.name || '').split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  doc.text(initials, leftColWidth / 2, 21, { align: 'center' });

  ly = 40;
  // Name
  doc.setFont('times', 'bold');
  doc.setFontSize(18);
  doc.setTextColor(255, 255, 255);
  const nameLines = doc.splitTextToSize(p.name || 'Your Name', leftColWidth - (margin * 2));
  doc.text(nameLines, leftColWidth / 2, ly, { align: 'center' });
  ly += (nameLines.length * 7);

  // Title
  if (p.title) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(10);
    doc.setTextColor(...GOLD_COLOR);
    doc.text(p.title, leftColWidth / 2, ly, { align: 'center' });
    ly += 10;
  }

  // Contact
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(255, 255, 255);
  const contactsArr = [
    { l: 'EMAIL', v: p.email },
    { l: 'PHONE', v: p.phone },
    { l: 'ADDR', v: p.location },
    { l: 'GIT', v: p.github }
  ].filter(c => c.v);

  contactsArr.forEach(c => {
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...GOLD_COLOR);
    doc.text(c.l, margin, ly);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(255, 255, 255);
    const valLines = doc.splitTextToSize(c.v, leftColWidth - margin - 25);
    doc.text(valLines, margin + 12, ly);
    ly += (valLines.length * 4) + 1;
  });
  ly += 5;

  // About Me
  if (s.text) {
    drawLSH('About Me');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(230, 230, 230);
    const sumLines = doc.splitTextToSize(s.text, leftColWidth - (margin * 2));
    doc.text(sumLines, margin, ly);
    ly += (sumLines.length * 4) + 8;
  }

  // Skills
  if (skills.length > 0) {
    drawLSH('Expertise');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7);
    let sx = margin;
    skills.forEach(sk => {
      const sw = doc.getTextWidth(sk) + 4;
      if (sx + sw > leftColWidth - margin) { sx = margin; ly += 6; }
      doc.setDrawColor(...GOLD_COLOR);
      doc.roundedRect(sx, ly - 3, sw - 1, 4.5, 1, 1, 'D');
      doc.text(sk, sx + 1.5, ly);
      sx += sw;
    });
    ly += 10;
  }

  // Certifications
  if (certifications.length > 0) {
    drawLSH('Certificates');
    certifications.forEach(c => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(...GOLD_COLOR);
      doc.text(c.name || '', margin, ly);
      ly += 4;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(218, 218, 218); // Light grey for issuer
      doc.text(c.issuer || '', margin, ly);
      ly += 5;
    });
    ly += 5;
  }

  // Languages
  if (languages && languages.length > 0) {
    drawLSH('Languages');
    languages.forEach(l => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text(l.name || l, margin, ly);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(...GOLD_COLOR);
      doc.text(l.level || '', leftColWidth - margin, ly, { align: 'right' });
      ly += 4.5;
    });
  }

  // 2. Right Column Content (Experience -> Projects -> Awards -> Education)
  // Experience
  if (experience.length > 0) {
    drawRSH('Work Experience');
    experience.forEach(exp => {
      if (ry > pageHeight - 30) { doc.addPage(); ry = 20; drawSidebarBg(); }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...NAVY_COLOR);
      doc.text(exp.role || '', leftColWidth + 10, ry);
      
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`${fmtDate(exp.start)} - ${exp.current ? 'Present' : fmtDate(exp.end)}`, rightMarginLimit, ry, { align: 'right' });
      ry += 4.5;
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...GOLD_COLOR);
      doc.text(exp.company || '', leftColWidth + 10, ry);
      ry += 5;

      const bullets = parseBullets(exp.bullets);
      bullets.forEach(b => {
        const bl = doc.splitTextToSize(b, rightColWidth - 25);
        if (ry + (bl.length * 4) > pageHeight - 15) { doc.addPage(); ry = 20; drawSidebarBg(); }
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(...BLACK_COLOR);
        doc.text('\u2022', leftColWidth + 10, ry);
        doc.text(bl, leftColWidth + 14, ry);
        ry += (bl.length * 4.5);
      });
      ry += 4;
    });
  }

  // Projects
  if (projects.length > 0) {
    drawRSH('Key Projects');
    projects.forEach(pr => {
      if (ry > pageHeight - 30) { doc.addPage(); ry = 20; drawSidebarBg(); }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...NAVY_COLOR);
      doc.text(pr.name || '', leftColWidth + 10, ry);
      
      if (pr.url) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(...GOLD_COLOR);
        doc.text('Link', rightMarginLimit, ry, { align: 'right' });
      }
      ry += 4.5;

      if (pr.tech) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(100, 100, 100);
        doc.text(pr.tech, leftColWidth + 10, ry);
        ry += 4;
      }

      const bullets = parseBullets(pr.bullets);
      bullets.forEach(b => {
        const bl = doc.splitTextToSize(b, rightColWidth - 25);
        if (ry + (bl.length * 4) > pageHeight - 15) { doc.addPage(); ry = 20; drawSidebarBg(); }
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(...BLACK_COLOR);
        doc.text('\u2022', leftColWidth + 10, ry);
        doc.text(bl, leftColWidth + 14, ry);
        ry += (bl.length * 4.5);
      });
      ry += 4;
    });
  }

  // Awards
  if (awards.length > 0) {
    drawRSH('Awards & Recognitions');
    awards.forEach(a => {
      if (ry > pageHeight - 30) { doc.addPage(); ry = 20; drawSidebarBg(); }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...NAVY_COLOR);
      doc.text(a.name || a.title || '', leftColWidth + 10, ry);
      ry += 4;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text(`${a.issuer || a.organization || ''} • ${fmtDate(a.date)}`, leftColWidth + 10, ry);
      ry += 6;
    });
  }

  // Education
  if (education.length > 0) {
    drawRSH('Education');
    education.forEach(e => {
      if (ry > pageHeight - 30) { doc.addPage(); ry = 20; drawSidebarBg(); }
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.setTextColor(...NAVY_COLOR);
      const degree = [e.degree, e.field].filter(Boolean).join(' in ');
      doc.text(degree, leftColWidth + 10, ry);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(`${e.start} - ${e.end}`, rightMarginLimit, ry, { align: 'right' });
      ry += 4.5;
      
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...GOLD_COLOR);
      doc.text(e.institution || '', leftColWidth + 10, ry);
      ry += 8;
    });
  }

  doc.save(`${(p.name || 'resume').replace(/\s+/g, '_')}_Tech.pdf`);
}

// Keep exportToPDF pointer for backward compatibility if needed, 
// though user asked for exportTechPDF specifically.
export const exportToPDF = exportTechPDF;
