/* ─────────────────────────────────────────────────────────
   CLASSIC TEMPLATE  —  Modern Two-Column Academic Style
   Inspired by clean, high-end professional resumes.
   Pure #111 / #333 / #888 / #fff only
   ATS-friendly, structured, every edge case handled
───────────────────────────────────────────────────────── */

import React from 'react'

/* ── Helpers ───────────────────────────────────────────── */
const safe = v => (typeof v === 'string' ? v.trim() : '')
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
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
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

const arr = x => (Array.isArray(x) ? x : [])

/* ── Section Header (title + horizontal rule) ── */
function SectionHead({ title }) {
  return (
    <div style={{ marginBottom: '0.8rem', marginTop: '1.2rem' }}>
      <div style={{
        fontSize: '10pt',
        fontWeight: 700,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        color: '#111',
        marginBottom: '0.2rem'
      }}>
        {title}
      </div>
      <div style={{ borderTop: '0.5px solid #CCC', width: '100%' }} />
    </div>
  )
}

/* ── Bullet list ───────────────────────────────────────── */
function BulletList({ raw }) {
  const items = parseBullets(raw)
  if (!items.length) return null
  return (
    <ul style={{ margin: '0.4rem 0 0', padding: 0, listStyle: 'none' }}>
      {items.map((b, i) => (
        <li key={i} style={{
          fontSize: '9pt',
          color: '#333',
          lineHeight: 1.5,
          paddingLeft: '1.2rem',
          position: 'relative',
          marginBottom: '0.3rem',
        }}>
          <span style={{ position: 'absolute', left: 0, top: '0.1rem', fontSize: '7pt', color: '#111' }}>•</span>
          {b}
        </li>
      ))}
    </ul>
  )
}

/* ── Main Component ────────────────────────────────────── */
export default function ClassicTemplate({ data }) {
  const {
    personal = {},
    summary = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    awards = [],
  } = data || {}

  const p = personal || {}

  const hasContent =
    hasTxt(p.name) || hasTxt(summary?.text) ||
    arr(experience).length || arr(education).length

  if (!hasContent) return (
    <div style={{
      width: '100%', maxWidth: '800px', background: '#fff', minHeight: '1000px',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, system-ui, sans-serif', gap: '1rem', color: '#999'
    }}>
      <div style={{ fontSize: '3rem' }}>📄</div>
      <p>Your Academic Classic Resume will update live here.</p>
    </div>
  )

  return (
    <div id="resume-output" style={{
      width: '100%',
      maxWidth: '850px',
      background: '#fff',
      color: '#333',
      padding: '40px',
      minHeight: '1100px',
      alignSelf: 'flex-start',
      display: 'flex',
      flexDirection: 'column',
      fontFamily: '"DM Sans", "Inter", sans-serif',
      boxSizing: 'border-box',
      position: 'relative',
      margin: '0 auto',
      boxShadow: '0 4px 6px rgba(0,0,0,0.04),0 16px 48px rgba(0,0,0,0.10)',
    }}>
      {/* Google Font Import */}
      <style dangerouslySetInnerHTML={{
        __html: `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap');
      `}} />

      {/* ── HEADER ─────────────────────────────────────── */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        borderBottom: '1px solid #111',
        paddingBottom: '20px',
        marginBottom: '30px'
      }}>
        <div style={{ flex: 1 }}>
          <h1 style={{
            fontSize: '22pt',
            fontWeight: 700,
            color: '#111',
            margin: 0,
            lineHeight: 1.1,
            letterSpacing: '-0.02em'
          }}>{p.name || 'Your Name'}</h1>
          <p style={{
            fontSize: '11pt',
            color: '#888',
            margin: '4px 0 0 0',
            fontWeight: 500
          }}>{p.title || 'Professional Title'}</p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'min-content 1fr',
          gap: '4px 12px',
          fontSize: '8.5pt',
          color: '#333',
          textAlign: 'right'
        }}>
          {hasTxt(p.phone) && (
            <>
              <span style={{ color: '#111', fontWeight: 600 }}>Phone</span>
              <span>{p.phone}</span>
            </>
          )}
          {hasTxt(p.email) && (
            <>
              <span style={{ color: '#111', fontWeight: 600 }}>Email</span>
              <span>{p.email}</span>
            </>
          )}
          {hasTxt(p.location) && (
            <>
              <span style={{ color: '#111', fontWeight: 600 }}>Location</span>
              <span>{p.location}</span>
            </>
          )}
          {hasTxt(p.linkedin) && (
            <>
              <span style={{ color: '#111', fontWeight: 600 }}>LinkedIn</span>
              <span>{p.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}</span>
            </>
          )}
        </div>
      </header>

      {/* ── TWO COLUMN LAYOUT ──────────────────────────── */}
      <div style={{ display: 'flex', gap: '40px' }}>

        {/* LEFT COLUMN (30%) */}
        <aside style={{ width: '30%', flexShrink: 0 }}>

          {/* EDUCATION */}
          {arr(education).length > 0 && (
            <section>
              <SectionHead title="Education" />
              {education.map((edu, i) => (
                <div key={i} style={{ marginBottom: '1.2rem' }}>
                  <div style={{ fontSize: '8pt', color: '#888', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>
                    {edu.degree || 'Degree'}
                  </div>
                  <div style={{ fontSize: '10pt', fontWeight: 700, color: '#111', marginTop: '2px' }}>
                    {edu.institution || 'University'}
                  </div>
                  <div style={{ fontSize: '8.5pt', color: '#555', marginTop: '2px' }}>
                    {fmtDate(edu.start)} — {fmtDate(edu.end) || 'Present'}
                  </div>
                  {hasTxt(edu.gpa) && <div style={{ fontSize: '8.5pt', fontStyle: 'italic', color: '#333' }}>GPA: {edu.gpa}</div>}
                </div>
              ))}
            </section>
          )}

          {/* SKILLS */}
          {arr(skills).length > 0 && (
            <section>
              <SectionHead title="Skills" />
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {skills.filter(Boolean).map((s, i) => (
                  <span key={i} style={{
                    fontSize: '8.5pt',
                    color: '#333',
                    background: '#F5F5F5',
                    padding: '2px 8px',
                    borderRadius: '2px'
                  }}>{s}</span>
                ))}
              </div>
            </section>
          )}

          {/* AWARDS / CERTIFICATIONS */}
          {(arr(awards).length > 0 || arr(certifications).length > 0) && (
            <section>
              <SectionHead title="Honors" />
              {[...arr(awards), ...arr(certifications)].map((aw, i) => (
                <div key={i} style={{ marginBottom: '0.8rem' }}>
                  <div style={{ fontSize: '9pt', fontWeight: 600, color: '#111' }}>{aw.title || aw.name}</div>
                  <div style={{ fontSize: '8pt', color: '#888' }}>{aw.issuer || aw.organization} • {fmtDate(aw.date)}</div>
                </div>
              ))}
            </section>
          )}
        </aside>

        {/* THIN VERTICAL DIVIDER */}
        <div style={{ width: '1px', background: '#EEE', alignSelf: 'stretch' }} />

        {/* RIGHT COLUMN (70%) */}
        <main style={{ width: '70%' }}>

          {/* SUMMARY */}
          {hasTxt(summary?.text) && (
            <section style={{ marginBottom: '1.5rem' }}>
              <SectionHead title="Career Profile" />
              <p style={{ fontSize: '9.5pt', lineHeight: 1.6, margin: 0, color: '#333' }}>
                {summary.text}
              </p>
            </section>
          )}

          {/* EXPERIENCE */}
          {arr(experience).length > 0 && (
            <section>
              <SectionHead title="Experience" />
              {experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontSize: '11pt', fontWeight: 700, color: '#111' }}>{exp.role || 'Role'}</div>
                    <div style={{ fontSize: '8.5pt', color: '#888', fontWeight: 500 }}>
                      {fmtRange(exp.start, exp.end, exp.current)}
                    </div>
                  </div>
                  <div style={{ fontSize: '10pt', color: '#111', fontWeight: 500, fontStyle: 'italic', marginBottom: '4px' }}>
                    {exp.company}{exp.location ? `, ${exp.location}` : ''}
                  </div>
                  <BulletList raw={exp.bullets} />
                </div>
              ))}
            </section>
          )}

          {/* PROJECTS */}
          {arr(projects).length > 0 && (
            <section>
              <SectionHead title="Key Projects" />
              {projects.map((proj, i) => (
                <div key={i} style={{ marginBottom: '1.2rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <div style={{ fontSize: '10.5pt', fontWeight: 700, color: '#111' }}>{proj.name || 'Project'}</div>
                    <div style={{ fontSize: '8.5pt', color: '#888' }}>{fmtRange(proj.start, proj.end, proj.current)}</div>
                  </div>
                  {hasTxt(proj.tech) && (
                    <div style={{ fontSize: '8.5pt', color: '#666', fontStyle: 'italic', marginBottom: '4px' }}>
                      Tech Stack: {proj.tech}
                    </div>
                  )}
                  <BulletList raw={proj.bullets} />
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

/* ── PDF EXPORT (jsPDF Text Only) ────────────────────── */
export async function exportClassicPDF(data) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' })

  const {
    personal: p = {},
    summary: s = {},
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
    awards = [],
  } = data || {}

  const margin = 15
  const pageWidth = 210
  const colGap = 8
  const leftColWidth = 55
  const rightColWidth = pageWidth - (margin * 2) - leftColWidth - colGap
  const leftX = margin
  const rightX = margin + leftColWidth + colGap
  const dividerX = margin + leftColWidth + (colGap / 2)

  let y = margin

  // Helpers
  const checkPage = (h) => {
    if (y + h > 280) {
      doc.addPage()
      y = margin
      // Draw vertical divider on next page if it's long? 
      // Simplified: Divider is drawn per item or as needed
      return true
    }
    return false
  }

  const drawDivider = () => {
    doc.setDrawColor(238)
    doc.setLineWidth(0.2)
    doc.line(dividerX, margin + 25, dividerX, 280)
  }

  const sectionLine = (tx, ty, tw) => {
    doc.setDrawColor(204)
    doc.setLineWidth(0.1)
    doc.line(tx, ty + 1, tx + tw, ty + 1)
  }

  // 1. HEADER
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.setTextColor(17, 17, 17)
  doc.text(p.name || 'YOUR NAME', margin, y + 5)

  // Contact Info (Right Aligned)
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  let contactY = y + 2
  const contactLines = [
    p.phone && `Phone: ${p.phone}`,
    p.email && `Email: ${p.email}`,
    p.location && `Location: ${p.location}`,
    p.linkedin && `LinkedIn: ${p.linkedin.replace(/^https?:\/\/(www\.)?linkedin\.com\/in\//, '')}`
  ].filter(Boolean)

  contactLines.forEach(line => {
    doc.text(line, pageWidth - margin, contactY, { align: 'right' })
    contactY += 4
  })

  y += 7
  doc.setFontSize(11)
  doc.setTextColor(136, 136, 136)
  doc.text(p.title || 'PROFESSIONAL TITLE', margin, y + 4)

  y += 12
  doc.setDrawColor(17)
  doc.setLineWidth(0.5)
  doc.line(margin, y, pageWidth - margin, y)
  y += 8

  // Store start Y for columns
  const contentStartY = y

  // LEFT COLUMN
  let leftY = contentStartY

  // Education
  if (education.length > 0) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(17, 17, 17)
    doc.text('EDUCATION', leftX, leftY)
    sectionLine(leftX, leftY, leftColWidth)
    leftY += 6

    education.forEach(edu => {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(8)
      doc.setTextColor(136, 136, 136)
      doc.text((edu.degree || 'Degree').toUpperCase(), leftX, leftY, { maxWidth: leftColWidth })
      leftY += 4

      doc.setFontSize(9)
      doc.setTextColor(17, 17, 17)
      const instLines = doc.splitTextToSize(edu.institution || 'University', leftColWidth)
      doc.text(instLines, leftX, leftY)
      leftY += (instLines.length * 4)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(85, 85, 85)
      doc.text(`${fmtDate(edu.start)} — ${fmtDate(edu.end) || 'Present'}`, leftX, leftY)
      leftY += 4

      if (edu.gpa) {
        doc.setFont('helvetica', 'italic')
        doc.text(`GPA: ${edu.gpa}`, leftX, leftY)
        leftY += 4
      }
      leftY += 4
    })
  }

  // Skills
  if (skills.length > 0) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(17, 17, 17)
    doc.text('SKILLS', leftX, leftY)
    sectionLine(leftX, leftY, leftColWidth)
    leftY += 6

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8.5)
    doc.setTextColor(51, 51, 51)
    const skillsText = skills.filter(Boolean).join(', ')
    const skillLines = doc.splitTextToSize(skillsText, leftColWidth)
    doc.text(skillLines, leftX, leftY)
    leftY += (skillLines.length * 4.5) + 6
  }

  // Honors
  const honors = [...arr(awards), ...arr(certifications)]
  if (honors.length > 0) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(17, 17, 17)
    doc.text('HONORS', leftX, leftY)
    sectionLine(leftX, leftY, leftColWidth)
    leftY += 6

    honors.forEach(aw => {
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(9)
      const awLines = doc.splitTextToSize(aw.title || aw.name, leftColWidth)
      doc.text(awLines, leftX, leftY)
      leftY += (awLines.length * 4)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8)
      doc.setTextColor(136, 136, 136)
      doc.text(`${aw.issuer || aw.organization} • ${fmtDate(aw.date)}`, leftX, leftY, { maxWidth: leftColWidth })
      leftY += 6
    })
  }

  // RIGHT COLUMN
  let rightY = contentStartY

  // Summary
  if (s.text) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(17, 17, 17)
    doc.text('CAREER PROFILE', rightX, rightY)
    sectionLine(rightX, rightY, rightColWidth)
    rightY += 6

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    doc.setTextColor(51, 51, 51)
    const sumLines = doc.splitTextToSize(s.text, rightColWidth)
    doc.text(sumLines, rightX, rightY)
    rightY += (sumLines.length * 5) + 8
  }

  // Experience
  if (experience.length > 0) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(17, 17, 17)
    doc.text('EXPERIENCE', rightX, rightY)
    sectionLine(rightX, rightY, rightColWidth)
    rightY += 6

    experience.forEach(exp => {
      checkPage(20) // estimate
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(11)
      doc.text(exp.role || 'Role', rightX, rightY)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(136, 136, 136)
      doc.text(fmtRange(exp.start, exp.end, exp.current), pageWidth - margin, rightY, { align: 'right' })
      rightY += 5

      doc.setFont('helvetica', 'italic')
      doc.setFontSize(10)
      doc.setTextColor(17, 17, 17)
      doc.text(`${exp.company}${exp.location ? `, ${exp.location}` : ''}`, rightX, rightY)
      rightY += 5

      // Bullets
      const bullets = parseBullets(exp.bullets)
      bullets.forEach(b => {
        const bLines = doc.splitTextToSize(b, rightColWidth - 5)
        checkPage(bLines.length * 4.5)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        doc.setTextColor(51, 51, 51)
        doc.text('\u2022', rightX, rightY)
        doc.text(bLines, rightX + 4, rightY)
        rightY += (bLines.length * 4.5) + 1
      })
      rightY += 4
    })
  }

  // Projects
  if (projects.length > 0) {
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.setTextColor(17, 17, 17)
    doc.text('KEY PROJECTS', rightX, rightY)
    sectionLine(rightX, rightY, rightColWidth)
    rightY += 6

    projects.forEach(proj => {
      checkPage(15)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(10.5)
      doc.text(proj.name || 'Project', rightX, rightY)

      doc.setFont('helvetica', 'normal')
      doc.setFontSize(8.5)
      doc.setTextColor(136, 136, 136)
      doc.text(fmtRange(proj.start, proj.end, proj.current), pageWidth - margin, rightY, { align: 'right' })
      rightY += 4

      if (proj.tech) {
        doc.setFont('helvetica', 'italic')
        doc.setFontSize(8.5)
        doc.setTextColor(102, 102, 102)
        doc.text(`Tech Stack: ${proj.tech}`, rightX, rightY)
        rightY += 4
      }

      const bullets = parseBullets(proj.bullets)
      bullets.forEach(b => {
        const bLines = doc.splitTextToSize(b, rightColWidth - 5)
        checkPage(bLines.length * 4.5)
        doc.setFontSize(9)
        doc.setTextColor(51, 51, 51)
        doc.text('\u2022', rightX, rightY)
        doc.text(bLines, rightX + 4, rightY)
        rightY += (bLines.length * 4.5) + 1
      })
      rightY += 4
    })
  }

  // Draw Vertical Divider Line
  const finalY = Math.max(leftY, rightY)
  doc.setDrawColor(238)
  doc.setLineWidth(0.2)
  doc.line(dividerX, contentStartY, dividerX, finalY)

  doc.save(`${(p.name || 'resume').replace(/\s+/g, '_')}_Classic.pdf`)
}

// Alias for backward compatibility
export const exportToPDF = exportClassicPDF
