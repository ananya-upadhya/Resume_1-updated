"""
ATS-Compliant PDF Generator — ReportLab
Matches exact data shape from ResumeBuilder.jsx
ATS rules: selectable text, linear single-column, standard fonts,
           proper metadata, no images/backgrounds
"""

from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.colors import HexColor
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable, Table, TableStyle
from reportlab.lib import colors

NAVY  = HexColor("#1F4E79")
BLACK = HexColor("#111827")
GREY  = HexColor("#4B5563")
BLUE  = HexColor("#3B82F6")
LGREY = HexColor("#6B7280")


def _parse_bullets(text: str) -> list:
    return [l.strip().lstrip("-•▸* ") for l in (text or "").split("\n") if l.strip()]

def _fmt_month(m: str) -> str:
    if not m: return ""
    parts = m.split("-")
    if len(parts) == 2:
        months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"]
        try: return f"{months[int(parts[1])-1]} {parts[0]}"
        except: pass
    return m

def _styles():
    return {
        "name": ParagraphStyle("name",
            fontName="Helvetica-Bold", fontSize=20, textColor=NAVY,
            alignment=TA_CENTER, spaceAfter=3, leading=24),
        "job_title": ParagraphStyle("job_title",
            fontName="Helvetica-Bold", fontSize=11, textColor=BLUE,
            alignment=TA_CENTER, spaceAfter=3, leading=14),
        "contact": ParagraphStyle("contact",
            fontName="Helvetica", fontSize=8.5, textColor=GREY,
            alignment=TA_CENTER, spaceAfter=5, leading=12),
        "section": ParagraphStyle("section",
            fontName="Helvetica-Bold", fontSize=10.5, textColor=NAVY,
            spaceBefore=8, spaceAfter=3, leading=14),
        "summary": ParagraphStyle("summary",
            fontName="Helvetica", fontSize=9.5, textColor=GREY,
            spaceAfter=4, leading=14),
        "entry_title": ParagraphStyle("entry_title",
            fontName="Helvetica-Bold", fontSize=10, textColor=BLACK,
            spaceBefore=3, spaceAfter=1, leading=14),
        "entry_sub": ParagraphStyle("entry_sub",
            fontName="Helvetica-Oblique", fontSize=9, textColor=LGREY,
            spaceAfter=1, leading=12),
        "bullet": ParagraphStyle("bullet",
            fontName="Helvetica", fontSize=9.5, textColor=BLACK,
            leftIndent=12, firstLineIndent=-10,
            spaceBefore=1, spaceAfter=1, leading=13),
        "skill_row": ParagraphStyle("skill_row",
            fontName="Helvetica", fontSize=9.5, textColor=BLACK,
            spaceAfter=3, leading=13),
        "url": ParagraphStyle("url",
            fontName="Helvetica", fontSize=8.5, textColor=BLUE,
            spaceAfter=1, leading=12),
    }

def _section_hr(story):
    story.append(HRFlowable(width="100%", thickness=1.5, color=BLUE,
                             spaceAfter=3, spaceBefore=0))

def _two_col_row(story, left_html, right_text, left_style, right_style):
    row = [[Paragraph(left_html, left_style), Paragraph(right_text, right_style)]]
    t = Table(row, colWidths=["70%", "30%"])
    t.setStyle(TableStyle([
        ("ALIGN",        (0,0),(0,0), "LEFT"),
        ("ALIGN",        (1,0),(1,0), "RIGHT"),
        ("VALIGN",       (0,0),(-1,-1), "TOP"),
        ("LEFTPADDING",  (0,0),(-1,-1), 0),
        ("RIGHTPADDING", (0,0),(-1,-1), 0),
        ("TOPPADDING",   (0,0),(-1,-1), 0),
        ("BOTTOMPADDING",(0,0),(-1,-1), 2),
    ]))
    story.append(t)


def build_pdf(data: dict, output_path: str):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        leftMargin=0.75*inch, rightMargin=0.75*inch,
        topMargin=0.75*inch,  bottomMargin=0.75*inch,
        title=f'{data.get("personal",{}).get("name","")} — Resume',
        author=data.get("personal",{}).get("name",""),
        subject="Resume",
        creator="ResumeAI",
    )

    st = _styles()
    story = []

    p   = data.get("personal", {})
    s   = data.get("summary", {}).get("text", "")
    exp = data.get("experience", [])
    edu = data.get("education", [])
    sk  = data.get("skills", [])
    prj = data.get("projects", [])
    cer = data.get("certifications", [])

    # ── NAME ─────────────────────────────────────────────────────────────────
    story.append(Paragraph((p.get("name") or "Your Name").upper(), st["name"]))

    if p.get("title"):
        story.append(Paragraph(p["title"], st["job_title"]))

    # ── CONTACT ───────────────────────────────────────────────────────────────
    contacts = [x for x in [
        p.get("email"), p.get("phone"), p.get("location"),
        p.get("linkedin"), p.get("github"), p.get("website")
    ] if x and x.strip()]
    if contacts:
        story.append(Paragraph("  |  ".join(contacts), st["contact"]))

    # Divider
    story.append(HRFlowable(width="100%", thickness=2, color=BLUE,
                             spaceAfter=5, spaceBefore=2))

    # ── SUMMARY ──────────────────────────────────────────────────────────────
    if s.strip():
        story.append(Paragraph("PROFESSIONAL SUMMARY", st["section"]))
        _section_hr(story)
        story.append(Paragraph(s.strip(), st["summary"]))

    # ── EXPERIENCE ───────────────────────────────────────────────────────────
    valid_exp = [e for e in exp if e.get("company") or e.get("role")]
    if valid_exp:
        story.append(Paragraph("WORK EXPERIENCE", st["section"]))
        _section_hr(story)
        for e in valid_exp:
            start = _fmt_month(e.get("start",""))
            end   = "Present" if e.get("current") else _fmt_month(e.get("end",""))
            date  = f"{start} – {end}" if start else end
            left  = f'<b>{e.get("role","")}</b>  —  {e.get("company","")}'
            right_style = ParagraphStyle("rd", fontName="Helvetica", fontSize=8.5,
                                         textColor=LGREY, alignment=1, leading=12)
            _two_col_row(story, left, date, st["entry_title"], right_style)
            for b in _parse_bullets(e.get("bullets","")):
                story.append(Paragraph(f"• {b}", st["bullet"]))
            story.append(Spacer(1, 3))

    # ── PROJECTS ─────────────────────────────────────────────────────────────
    valid_prj = [pr for pr in prj if pr.get("name")]
    if valid_prj:
        story.append(Paragraph("PROJECTS", st["section"]))
        _section_hr(story)
        for pr in valid_prj:
            tech_part = f'  <font color="#6B7280" size="9">| {pr["tech"]}</font>' if pr.get("tech") else ""
            story.append(Paragraph(f'<b>{pr["name"]}</b>{tech_part}', st["entry_title"]))
            if pr.get("url"):
                story.append(Paragraph(pr["url"], st["url"]))
            for b in _parse_bullets(pr.get("bullets","")):
                story.append(Paragraph(f"• {b}", st["bullet"]))
            story.append(Spacer(1, 3))

    # ── EDUCATION ────────────────────────────────────────────────────────────
    valid_edu = [e for e in edu if e.get("institution") or e.get("degree")]
    if valid_edu:
        story.append(Paragraph("EDUCATION", st["section"]))
        _section_hr(story)
        for e in valid_edu:
            deg  = " in ".join(filter(None, [e.get("degree"), e.get("field")]))
            date = f'{e.get("start","")}{"–" if e.get("start") and e.get("end") else ""}{e.get("end","")}'
            right_style = ParagraphStyle("rd2", fontName="Helvetica", fontSize=8.5,
                                          textColor=LGREY, alignment=1, leading=12)
            _two_col_row(story, f"<b>{deg or 'Degree'}</b>", date, st["entry_title"], right_style)
            if e.get("institution"):
                story.append(Paragraph(e["institution"], st["entry_sub"]))
            if e.get("gpa"):
                story.append(Paragraph(f'CGPA / Score: {e["gpa"]}', st["entry_sub"]))
            story.append(Spacer(1, 2))

    # ── SKILLS ───────────────────────────────────────────────────────────────
    if sk:
        story.append(Paragraph("SKILLS", st["section"]))
        _section_hr(story)
        story.append(Paragraph("  •  ".join(sk), st["skill_row"]))

    # ── CERTIFICATIONS ────────────────────────────────────────────────────────
    valid_cer = [c for c in cer if c.get("name")]
    if valid_cer:
        story.append(Paragraph("CERTIFICATIONS", st["section"]))
        _section_hr(story)
        for c in valid_cer:
            date = _fmt_month(c.get("date",""))
            right_style = ParagraphStyle("rd3", fontName="Helvetica", fontSize=8.5,
                                          textColor=LGREY, alignment=1, leading=12)
            _two_col_row(story, f"<b>{c['name']}</b>", date, st["entry_title"], right_style)
            if c.get("issuer"):
                story.append(Paragraph(c["issuer"], st["entry_sub"]))
            story.append(Spacer(1, 2))

    doc.build(story)
    return output_path
