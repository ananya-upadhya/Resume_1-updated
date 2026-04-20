/* ─────────────────────────────────────────────────────────
   EXECUTIVE TEMPLATE  —  Modern Navy & Gold
   Senior Level · Two-Panel Executive Style
   Layout: HeaderBand (Navy) | Two-Column body (30% / 70%)
───────────────────────────────────────────────────────── */

import React from 'react';

/* ── Helpers ───────────────────────────────────────────── */
const parseBullets = t =>
  (t || '').split('\n').map(l => l.trim().replace(/^[-•▸◆*]\s*/, '')).filter(Boolean);

const fmtDate = m => {
  if (!m) return '';
  const parts = m.split('-');
  if (parts.length === 3) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const mo = parseInt(parts[1], 10);
    const yr = parts[0];
    return months[mo - 1] ? `${months[mo - 1]} ${yr}` : m;
  }
  return m;
};

const GOLD = '#C9A84C';
const NAVY = '#1B2A4A';
const WHITE = '#FFFFFF';
const TEXT_BODY = '#333333';
const TEXT_MUTED = '#888888';
const SANS = "'Inter', 'DM Sans', sans-serif";
const BLACK = "#111111";
const SIDEBAR_BG = "#F3F3F3";
const DIVIDER_COLOR = "#D1D5DB";

export default function ExecutiveTemplate({ data }) {
  const {
    personal: p = {},
    summary: s = { text: '' },
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
  } = data || {};

  const hasContent = p.name || s?.text || experience.length || education.length || skills.length;

  if (!hasContent) return (
    <div style={{
      width: '100%', maxWidth: '820px', background: '#fff', minHeight: '800px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
    }}>
      <div style={{ textAlign: 'center', color: '#ccc', fontFamily: SANS }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👔</div>
        <p>Executive Resume Preview</p>
      </div>
    </div>
  );

  const SectionHeading = ({ children }) => (
    <div style={{ marginBottom: '1rem', marginTop: '1.5rem' }}>
      <div style={{
        fontFamily: SANS, fontSize: '11pt', fontWeight: 700,
        color: BLACK, textTransform: 'uppercase', letterSpacing: '0.12em'
      }}>
        {children}
      </div>
      <div style={{ borderBottom: `2.5px solid ${BLACK}`, marginTop: '0.2rem', width: '100%' }} />
    </div>
  );

  const Icon = ({ children }) => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, color: BLACK }}>
      {children}
    </svg>
  );

  return (
    <div id="resume-output" style={{
      width: '100%', maxWidth: '820px', background: '#FFFFFF',
      minHeight: '1100px', alignSelf: 'flex-start',
      boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
      fontFamily: SANS, color: '#333333', overflow: 'hidden',
      display: 'flex'
    }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600;700;800&display=swap');
      `}} />

      {/* SIDEBAR (35%) */}
      <aside style={{ width: '35%', background: SIDEBAR_BG, padding: '2.5rem 2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        {/* SUMMARY / ABOUT ME */}
        {s?.text && (
          <section>
            <SectionHeading>About Me</SectionHeading>
            <p style={{ fontSize: '9pt', lineHeight: 1.6, margin: 0, color: '#444' }}>
              {s.text}
            </p>
          </section>
        )}

        {/* EDUCATION */}
        {education.length > 0 && (
          <section>
            <SectionHeading>Education</SectionHeading>
            {education.map((edu, i) => (
              <div key={i} style={{ marginBottom: '1rem' }}>
                <div style={{ fontWeight: 700, color: BLACK, fontSize: '9.5pt' }}>
                  {[edu.degree, edu.field].filter(Boolean).join(' in ')}
                </div>
                <div style={{ fontSize: '8.5pt', color: '#555', marginTop: '0.1rem' }}>
                  {edu.institution}
                </div>
                <div style={{ fontSize: '8.5pt', color: '#777', marginTop: '0.05rem' }}>
                  {edu.start} — {edu.end}
                </div>
              </div>
            ))}
          </section>
        )}

        {/* SKILLS */}
        {skills.length > 0 && (
          <section>
            <SectionHeading>Skills</SectionHeading>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {skills.map((sk, i) => (
                <div key={i}>
                  <div style={{ fontSize: '9pt', fontWeight: 600, color: '#333', marginBottom: '0.3rem' }}>{sk}</div>
                  <div style={{ height: '6px', background: '#DDD', borderRadius: '3px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ 
                      position: 'absolute', left: 0, top: 0, height: '100%', 
                      background: BLACK, width: `${90 - (i * 10) > 50 ? 90 - (i * 10) : 60}%`,
                      borderRadius: '3px'
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </aside>

      {/* MAIN CONTENT (65%) */}
      <main style={{ width: '65%', padding: '2.5rem 2.5rem' }}>
        {/* HEADER BLOCK */}
        <header style={{
          background: BLACK, padding: '1.8rem 2rem', color: '#FFF',
          marginBottom: '1.5rem', marginLeft: '-2.5rem', width: 'calc(100% + 1rem)'
        }}>
          <h1 style={{
            fontSize: '28pt', fontWeight: 800, margin: 0, 
            letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: 1.1
          }}>
            {p.name || 'Your Name'}
          </h1>
          {p.title && (
            <p style={{
              fontSize: '11pt', fontWeight: 400, opacity: 0.9,
              margin: '0.6rem 0 0', textTransform: 'uppercase', letterSpacing: '0.15em'
            }}>
              {p.title}
            </p>
          )}
        </header>

        {/* CONTACT INFO */}
        <div style={{ 
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem 1.5rem', 
          marginBottom: '2.5rem', padding: '0 0.5rem' 
        }}>
          {[
            { label: p.phone, icon: <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /> },
            { label: p.email, icon: <><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></> },
            { label: p.website, icon: <><circle cx="12" cy="12" r="10" /><line x1="2" y1="12" x2="22" y2="12" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" /></> },
            { label: p.location, icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></> },
          ].filter(c => c.label).map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '8.5pt' }}>
              <div style={{ background: '#EEE', padding: '0.35rem', borderRadius: '4px', display: 'flex' }}>
                <Icon>{item.icon}</Icon>
              </div>
              <span style={{ color: '#444', wordBreak: 'break-all' }}>{item.label}</span>
            </div>
          ))}
        </div>

        {/* EXPERIENCE TIMELINE */}
        {experience.length > 0 && (
          <section>
            <SectionHeading>Experience</SectionHeading>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {experience.map((exp, i) => (
                <div key={i} style={{ display: 'flex', gap: '1.5rem', position: 'relative' }}>
                  {/* Timeline line */}
                  {i < experience.length - 1 && (
                    <div style={{
                      position: 'absolute', left: '4px', top: '15px', bottom: '-15px',
                      width: '2px', background: DIVIDER_COLOR, zIndex: 0
                    }} />
                  )}
                  {/* Circle */}
                  <div style={{
                    width: '10px', height: '10px', borderRadius: '50%',
                    border: `2.5px solid ${BLACK}`, background: '#FFF',
                    marginTop: '0.35rem', flexShrink: 0, zIndex: 1
                  }} />
                  
                  {/* Content */}
                  <div style={{ flex: 1, paddingBottom: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <h3 style={{ margin: 0, fontSize: '11pt', fontWeight: 700, color: BLACK }}>
                        {exp.role}
                      </h3>
                      <div style={{ fontSize: '8.5pt', color: '#777', fontWeight: 600 }}>
                        {fmtDate(exp.start)} — {exp.current ? 'PRESENT' : fmtDate(exp.end)}
                      </div>
                    </div>
                    <div style={{ color: '#555', fontWeight: 600, fontSize: '9.5pt', marginTop: '0.1rem' }}>
                      {exp.company}
                    </div>
                    <ul style={{ paddingLeft: '1.2rem', margin: '0.6rem 0 0', listStyle: 'none' }}>
                      {parseBullets(exp.bullets).map((b, j) => (
                        <li key={j} style={{
                          fontSize: '8.5pt', color: '#555', lineHeight: 1.5,
                          marginBottom: '0.4rem', position: 'relative'
                        }}>
                          <span style={{ position: 'absolute', left: '-1rem', color: BLACK }}>•</span>
                          {b}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* PROJECTS */}
        {projects.length > 0 && (
          <section style={{ marginTop: '0.5rem' }}>
            <SectionHeading>Projects</SectionHeading>
            {projects.map((pr, i) => (
              <div key={i} style={{ marginBottom: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div style={{ fontWeight: 700, color: BLACK, fontSize: '10.5pt' }}>{pr.name}</div>
                  {pr.url && <div style={{ fontSize: '8.5pt', color: '#777' }}>{pr.url}</div>}
                </div>
                {pr.tech && <div style={{ fontSize: '8.5pt', color: '#666', fontStyle: 'italic', marginTop: '0.1rem' }}>{pr.tech}</div>}
                <ul style={{ paddingLeft: '1.2rem', margin: '0.4rem 0 0', listStyle: 'none' }}>
                  {parseBullets(pr.bullets).map((b, j) => (
                    <li key={j} style={{ fontSize: '8.5pt', color: '#555', lineHeight: 1.5, marginBottom: '0.2rem', position: 'relative' }}>
                      <span style={{ position: 'absolute', left: '-1rem', color: BLACK }}>•</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

/* ── PDF Export Function ───────────────────────────────── */
export async function exportExecutivePDF(data) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

  const {
    personal: p = {},
    summary: s = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
  } = data || {};

  const pageWidth = 210;
  const pageHeight = 297;
  const sidebarWidth = pageWidth * 0.35;
  const mainWidth = pageWidth - sidebarWidth;
  const BLACK_RGB = [17, 17, 17];
  const GREY_BG = [243, 243, 243];
  const DIVIDER_RGB = [209, 213, 219];

  let sy = 15; // Sidebar Y
  let my = 60; // Main Column Y (starts below header)

  // 1. Sidebar Background
  doc.setFillColor(...GREY_BG);
  doc.rect(0, 0, sidebarWidth, pageHeight, 'F');

  const checkPage = (h, isMain) => {
    const cy = isMain ? my : sy;
    if (cy + h > 280) {
      doc.addPage();
      doc.setFillColor(...GREY_BG);
      doc.rect(0, 0, sidebarWidth, pageHeight, 'F');
      sy = 15;
      my = 15;
      return true;
    }
    return false;
  };

  const drawSidebarHeading = (text) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...BLACK_RGB);
    doc.text(text.toUpperCase(), 10, sy);
    sy += 2;
    doc.setDrawColor(...BLACK_RGB);
    doc.setLineWidth(0.6);
    doc.line(10, sy, sidebarWidth - 10, sy);
    sy += 6;
  };

  const drawMainHeading = (text) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...BLACK_RGB);
    doc.text(text.toUpperCase(), sidebarWidth + 10, my);
    my += 2;
    doc.setDrawColor(...BLACK_RGB);
    doc.setLineWidth(0.6);
    doc.line(sidebarWidth + 10, my, pageWidth - 10, my);
    my += 8;
  };

  // 2. HEADER BLOCK (Main Column Top)
  doc.setFillColor(...BLACK_RGB);
  doc.rect(sidebarWidth, 0, mainWidth, 50, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  const name = (p.name || 'YOUR NAME').toUpperCase();
  doc.text(name, sidebarWidth + 10, 25);

  if (p.title) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text(p.title.toUpperCase(), sidebarWidth + 10, 35, { charSpace: 1 });
  }

  // 3. SIDEBAR CONTENT
  sy = 15;
  if (s.text) {
    drawSidebarHeading('About Me');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(68, 68, 68);
    const lines = doc.splitTextToSize(s.text, sidebarWidth - 20);
    doc.text(lines, 10, sy, { lineHeightFactor: 1.4 });
    sy += (lines.length * 4) + 10;
  }

  if (education.length > 0) {
    drawSidebarHeading('Education');
    education.forEach(edu => {
      checkPage(15, false);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...BLACK_RGB);
      const degree = [edu.degree, edu.field].filter(Boolean).join(' in ');
      const dLines = doc.splitTextToSize(degree, sidebarWidth - 20);
      doc.text(dLines, 10, sy);
      sy += (dLines.length * 4);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(85, 85, 85);
      doc.text(edu.institution || '', 10, sy);
      sy += 4;
      doc.setTextColor(119, 119, 119);
      doc.text(`${edu.start} - ${edu.end}`, 10, sy);
      sy += 8;
    });
    sy += 5;
  }

  if (skills.length > 0) {
    drawSidebarHeading('Skills');
    skills.forEach((sk, i) => {
      checkPage(10, false);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 51, 51);
      doc.text(sk, 10, sy);
      sy += 2.5;
      
      doc.setFillColor(221, 221, 221);
      doc.rect(10, sy, sidebarWidth - 20, 1.5, 'F');
      doc.setFillColor(...BLACK_RGB);
      const level = Math.max(60, 90 - (i * 10));
      doc.rect(10, sy, (sidebarWidth - 20) * (level / 100), 1.5, 'F');
      sy += 6;
    });
  }

  // 4. MAIN COLUMN CONTENT
  my = 60;
  // Contact Info Row
  doc.setFontSize(8);
  doc.setTextColor(68, 68, 68);
  const contacts = [
    { v: p.phone, l: 'P' },
    { v: p.email, l: 'E' },
    { v: p.website, l: 'W' },
    { v: p.location, l: 'L' }
  ].filter(c => c.v);

  let cx = sidebarWidth + 10;
  let cy = my;
  contacts.forEach((c, i) => {
    if (i % 2 === 0 && i !== 0) { cx = sidebarWidth + 10; cy += 6; }
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...BLACK_RGB);
    doc.text(c.l + ':', cx, cy);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(68, 68, 68);
    doc.text(c.v, cx + 5, cy);
    cx += 45;
  });
  my = cy + 12;

  if (experience.length > 0) {
    drawMainHeading('Experience');
    experience.forEach((exp, i) => {
      const bullets = parseBullets(exp.bullets);
      const neededH = 15 + (bullets.length * 5);
      checkPage(neededH, true);

      // Timeline line
      if (i < experience.length - 1) {
        doc.setDrawColor(...DIVIDER_RGB);
        doc.setLineWidth(0.4);
        doc.line(sidebarWidth + 12, my + 3, sidebarWidth + 12, my + neededH + 5);
      }
      // Circle
      doc.setDrawColor(...BLACK_RGB);
      doc.setLineWidth(0.6);
      doc.setFillColor(255, 255, 255);
      doc.circle(sidebarWidth + 12, my + 1, 1.2, 'FD');

      const contentX = sidebarWidth + 18;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(...BLACK_RGB);
      doc.text(exp.role || '', contentX, my + 1.5);
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(119, 119, 119);
      const date = `${exp.start} - ${exp.current ? 'PRESENT' : exp.end}`;
      doc.text(date, pageWidth - 10, my + 1.5, { align: 'right' });
      my += 5;

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(85, 85, 85);
      doc.text(exp.company || '', contentX, my);
      my += 6;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(85, 85, 85);
      bullets.forEach(b => {
        doc.text('•', contentX, my);
        const bLines = doc.splitTextToSize(b, pageWidth - contentX - 15);
        doc.text(bLines, contentX + 3, my);
        my += (bLines.length * 4.5);
      });
      my += 6;
    });
  }

  if (projects.length > 0) {
    drawMainHeading('Projects');
    projects.forEach(pr => {
      const bullets = parseBullets(pr.bullets);
      const neededH = 15 + (bullets.length * 5);
      checkPage(neededH, true);

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(...BLACK_RGB);
      doc.text(pr.name || '', sidebarWidth + 10, my);
      my += 5;

      if (pr.tech) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(8);
        doc.setTextColor(102, 102, 102);
        doc.text(pr.tech, sidebarWidth + 10, my);
        my += 5;
      }

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(85, 85, 85);
      bullets.forEach(b => {
        doc.text('•', sidebarWidth + 10, my);
        const bLines = doc.splitTextToSize(b, mainWidth - 20);
        doc.text(bLines, sidebarWidth + 13, my);
        my += (bLines.length * 4.5);
      });
      my += 6;
    });
  }

  doc.save(`${(p.name || 'resume').replace(/\s+/g, '_')}_Executive.pdf`);
}

// Alias for common usage
export const exportToPDF = exportExecutivePDF;
