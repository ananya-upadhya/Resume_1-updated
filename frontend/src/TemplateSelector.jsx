import { useState } from "react";
import { TEMPLATES } from "./templates/index.jsx";

/* ─────────────────────────────────────────────────────────
   TEMPLATE SELECTOR
   Shown after landing page, before the builder starts.
   Props:
     onSelect(templateId) — called when user picks a template
     onBack()             — called to go back to landing page
───────────────────────────────────────────────────────── */

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html, body, #root { height:auto !important;overflow:auto !important;}

  .ts-wrap {
  min-height:100vh; width:100%;
  background:#080808;
  font-family:'DM Sans',sans-serif;
  padding:0 0 3rem;
  overflow-y:visible;
}

  /* Nav */
  .ts-nav {
    display:flex; align-items:center; justify-content:space-between;
    padding:1.1rem 2.5rem;
    border-bottom:1px solid rgba(201,168,76,0.12);
    background:rgba(8,8,8,0.9);
    backdrop-filter:blur(12px);
    position:sticky; top:0; z-index:100;
  }
  .ts-back {
    display:flex; align-items:center; gap:".5rem";
    background:transparent; border:1px solid rgba(201,168,76,0.25);
    color:#C9A84C; font-family:'DM Sans',sans-serif;
    font-size:.75rem; font-weight:600; padding:.35rem .85rem;
    border-radius:7px; cursor:pointer; transition:all .15s;
    letter-spacing:.04em;
  }
  .ts-back:hover { background:rgba(201,168,76,0.08); }
  .ts-nav-title {
    font-family:'Cinzel',serif; font-size:.85rem; font-weight:700;
    letter-spacing:.1em;
    background:linear-gradient(90deg,#A07830,#F0C040,#C9A84C);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text;
  }
  .ts-step {
    font-size:.65rem; color:rgba(201,168,76,0.5);
    letter-spacing:.1em; text-transform:uppercase;
  }

  /* Hero text */
  .ts-hero {
    text-align:center; padding:2.5rem 1.5rem 1.5rem;
  }
  .ts-hero-title {
    font-family:'Cinzel',serif; font-size:1.6rem; font-weight:700;
    background:linear-gradient(135deg,#F0C040,#C9A84C,#A07830);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text; letter-spacing:.05em; margin-bottom:".5rem";
  }
  .ts-hero-sub {
    font-size:.78rem; color:rgba(201,168,76,0.55); margin-top:.5rem;
    letter-spacing:.04em;
  }

  /* Grid */
  .ts-grid {
  display:grid;
  grid-template-columns:repeat(2, 1fr);
  gap:1rem;
  max-width:900px; margin:0 auto;
  padding:0 2rem;
}

  /* Card */
  .ts-card {
    background:#0e0e0e;
    border:1.5px solid rgba(201,168,76,0.15);
    border-radius:14px;
    overflow:hidden;
    cursor:pointer;
    transition:all .2s ease;
    position:relative;
  }
  .ts-card:hover {
    border-color:rgba(201,168,76,0.5);
    transform:translateY(-3px);
    box-shadow:0 8px 32px rgba(201,168,76,0.12);
  }
  .ts-card.selected {
    border-color:#C9A84C;
    box-shadow:0 0 0 2px rgba(201,168,76,0.3),0 8px 32px rgba(201,168,76,0.15);
  }

  /* Preview thumbnail */
  .ts-thumb {
    height:140px; overflow:hidden;
    background:#fff; position:relative;
  }
  .ts-thumb-inner {
    transform:scale(0.38) translateY(-10%);
    transform-origin:top center;
    pointer-events:none;
    width:264%;
    margin-left:-82%;
  }
  .ts-thumb-overlay {
    position:absolute; inset:0;
    background:linear-gradient(to bottom, transparent 60%, #0e0e0e);
  }

  /* Tag */
  .ts-tag {
    position:absolute; top:.65rem; right:.65rem;
    font-size:.58rem; font-weight:700; letter-spacing:.1em;
    text-transform:uppercase; padding:.18rem .55rem;
    border-radius:4px; z-index:2;
  }

  /* Card body */
  .ts-card-body { padding:.9rem 1.1rem 1rem; }
  .ts-card-name {
    font-family:'DM Sans',sans-serif; font-size:.84rem; font-weight:500;
    color:#E8C96B; letter-spacing:.03em; margin-bottom:".2rem";
  }
  .ts-card-desc {
    font-family:'DM Sans',sans-serif;
    font-size:.68rem; color:rgba(201,168,76,0.5); line-height:1.55;
    margin-top:.3rem; font-weight:400;
  }

  /* Select button */
  .ts-select-btn {
    width:100%; margin-top:.75rem;
    padding:.42rem; border-radius:7px;
    font-family:'DM Sans',sans-serif; font-size:.75rem;
    font-weight:500; letter-spacing:.03em; cursor:pointer;
    transition:all .15s; border:none;
  }
  .ts-select-btn.active {
    background:linear-gradient(135deg,#A07830,#C9A84C);
    color:#080808;
  }
  .ts-select-btn.inactive {
    background:transparent;
    border:1px solid rgba(201,168,76,0.25);
    color:#C9A84C;
  }
  .ts-select-btn.inactive:hover {
    background:rgba(201,168,76,0.08);
  }

  /* CTA */
  .ts-cta-wrap {
    display:flex; justify-content:center; margin-top:2rem; padding:0 2rem;
  }
  .ts-cta {
    padding:.85rem 2.8rem;
    background:linear-gradient(135deg,#A07830,#C9A84C,#F0C040);
    border:none; border-radius:10px;
    font-family:'Cinzel',serif; font-size:.9rem; font-weight:700;
    letter-spacing:.08em; color:#080808; cursor:pointer;
    transition:all .2s ease;
    box-shadow:0 4px 24px rgba(201,168,76,0.3);
  }
  .ts-cta:hover {
    transform:translateY(-2px);
    box-shadow:0 8px 32px rgba(201,168,76,0.45);
  }
  .ts-cta:disabled {
    opacity:.4; cursor:not-allowed; transform:none;
  }
  .ts-cta-hint {
    text-align:center; margin-top:.7rem;
    font-size:.63rem; color:rgba(201,168,76,0.35);
    letter-spacing:.08em;
  }
`;

/* Mini preview components for thumbnails */
function MiniClassic() {
  return (
    <div style={{ padding: "1.5rem 1.8rem", fontFamily: "serif", background: "#fff", minHeight: "400px" }}>
      <div style={{ textAlign: "center", borderBottom: "1.5px solid #0a0a0a", paddingBottom: "1rem", marginBottom: "1rem" }}>
        <div style={{ fontSize: "1.4rem", fontWeight: 700, letterSpacing: ".08em", color: "#0a0a0a" }}>JOHN DOE</div>
        <div style={{ fontSize: ".55rem", letterSpacing: ".18em", textTransform: "uppercase", color: "#555", marginTop: ".2rem" }}>Software Engineer</div>
        <div style={{ fontSize: ".45rem", color: "#888", marginTop: ".3rem" }}>john@email.com · +91 98765 43210 · Bengaluru</div>
      </div>
      {["SUMMARY", "EXPERIENCE", "EDUCATION", "SKILLS"].map(s => (
        <div key={s} style={{ marginBottom: ".7rem" }}>
          <div style={{ fontSize: ".42rem", fontWeight: 700, letterSpacing: ".2em", color: "#0a0a0a", borderBottom: "1px solid #ccc", paddingBottom: ".1rem", marginBottom: ".3rem" }}>{s}</div>
          <div style={{ fontSize: ".4rem", color: "#555", lineHeight: 1.5 }}>{'— '.repeat(s === "SKILLS" ? 8 : 1)}{s !== "SKILLS" && "Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod."}</div>
          {s === "EXPERIENCE" && <><div style={{ fontSize: ".4rem", color: "#333", marginTop: ".2rem", fontWeight: 600 }}>Senior Developer · TechCorp</div><div style={{ fontSize: ".38rem", color: "#666" }}>Jan 2022 – Present</div></>}
        </div>
      ))}
    </div>
  );
}
function MiniModern() {
  return (
    <div style={{ display: "flex", fontFamily: "sans-serif", background: "#fff", minHeight: "400px" }}>
      <div style={{ width: "38%", background: "#eff6ff", padding: "1.2rem .8rem", borderRight: "1px solid #dbeafe" }}>
        <div style={{ fontSize: ".42rem", fontWeight: 700, letterSpacing: ".15em", color: "#2563eb", textTransform: "uppercase", marginBottom: ".4rem" }}>Contact</div>
        {["email", "phone", "location", "linkedin"].map(c => <div key={c} style={{ fontSize: ".38rem", color: "#334155", marginBottom: ".2rem" }}>● {c}@info.com</div>)}
        <div style={{ fontSize: ".42rem", fontWeight: 700, letterSpacing: ".15em", color: "#2563eb", textTransform: "uppercase", margin: ".6rem 0 .3rem" }}>Skills</div>
        {["React", "Python", "Node.js", "AWS", "Docker"].map(s => <div key={s} style={{ fontSize: ".38rem", color: "#1e293b", marginBottom: ".18rem" }}>● {s}</div>)}
      </div>
      <div style={{ flex: 1, padding: "1.2rem 1rem" }}>
        <div style={{ background: "#2563eb", padding: ".8rem", marginBottom: ".8rem", borderRadius: "4px" }}>
          <div style={{ fontSize: ".9rem", fontWeight: 700, color: "#fff", letterSpacing: ".05em" }}>JOHN DOE</div>
          <div style={{ fontSize: ".42rem", color: "rgba(255,255,255,.7)", marginTop: ".15rem", letterSpacing: ".15em" }}>SOFTWARE ENGINEER</div>
        </div>
        {["EXPERIENCE", "PROJECTS"].map(s => (
          <div key={s} style={{ marginBottom: ".6rem" }}>
            <div style={{ fontSize: ".42rem", fontWeight: 700, letterSpacing: ".14em", color: "#2563eb", borderBottom: "2px solid #2563eb", paddingBottom: ".1rem", marginBottom: ".3rem" }}>{s}</div>
            <div style={{ fontSize: ".4rem", color: "#334155", lineHeight: 1.5 }}>Lorem ipsum dolor sit amet consectetur adipiscing elit.</div>
          </div>
        ))}
      </div>
    </div>
  );
}
function MiniTech() {
  return (
    <div style={{ padding: "1.2rem 1.4rem", fontFamily: "monospace", background: "#fff", minHeight: "400px" }}>
      <div style={{ borderLeft: "4px solid #16a34a", paddingLeft: ".8rem", marginBottom: "1rem" }}>
        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#0f172a" }}>john_doe</div>
        <div style={{ fontSize: ".48rem", color: "#16a34a", marginTop: ".1rem" }}>{"> Software Engineer"}</div>
      </div>
      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "4px", padding: ".4rem .6rem", marginBottom: ".8rem" }}>
        <span style={{ fontSize: ".38rem", color: "#16a34a", fontWeight: 700 }}>email:</span><span style={{ fontSize: ".38rem", color: "#334155" }}> john@dev.io </span>
        <span style={{ fontSize: ".38rem", color: "#16a34a", fontWeight: 700 }}>github:</span><span style={{ fontSize: ".38rem", color: "#334155" }}> github.com/john </span>
      </div>
      {["// experience", "// projects", "// skills"].map(s => (
        <div key={s} style={{ marginBottom: ".6rem" }}>
          <div style={{ fontSize: ".42rem", fontWeight: 700, color: "#16a34a", marginBottom: ".25rem" }}>{s}</div>
          <div style={{ fontSize: ".38rem", color: "#334155", lineHeight: 1.5 }}>{"→ "} Lorem ipsum dolor sit amet consectetur.</div>
          {s === "// skills" && <div style={{ display: "flex", flexWrap: "wrap", gap: ".2rem", marginTop: ".2rem" }}>{["React", "Python", "Docker", "AWS"].map(sk => <span key={sk} style={{ fontSize: ".35rem", background: "#f1f5f9", border: "1px solid #cbd5e1", padding: ".08rem .3rem", borderRadius: "3px" }}>{sk}</span>)}</div>}
        </div>
      ))}
    </div>
  );
}
function MiniExecutive() {
  return (
    <div style={{ fontFamily: "sans-serif", background: "#fff", minHeight: "400px" }}>
      <div style={{ background: "#1e3a5f", padding: "1.2rem 1.4rem" }}>
        <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#fff", letterSpacing: ".06em" }}>JOHN DOE</div>
        <div style={{ fontSize: ".45rem", color: "rgba(255,255,255,.65)", letterSpacing: ".18em", textTransform: "uppercase", marginTop: ".2rem" }}>Chief Technology Officer</div>
        <div style={{ fontSize: ".38rem", color: "rgba(255,255,255,.5)", marginTop: ".35rem" }}>john@corp.com · +91 98765 43210 · Mumbai, India</div>
      </div>
      <div style={{ height: "3px", background: "linear-gradient(90deg,#b8860b,#daa520,#b8860b)" }} />
      <div style={{ padding: "1rem 1.4rem" }}>
        {["Executive Summary", "Professional Experience", "Core Competencies"].map(s => (
          <div key={s} style={{ marginBottom: ".7rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".3rem", marginBottom: ".25rem" }}>
              <div style={{ width: "3px", height: "10px", background: "#b8860b", borderRadius: "2px" }} />
              <div style={{ fontSize: ".42rem", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: "#1e3a5f" }}>{s}</div>
            </div>
            <div style={{ fontSize: ".38rem", color: "#4a5568", lineHeight: 1.6, borderLeft: "2px solid #fef3c7", paddingLeft: ".5rem" }}>Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor.</div>
          </div>
        ))}
      </div>
    </div>
  );
}
function MiniEtherX() {
  return (
    <div style={{ fontFamily: "sans-serif", background: "#fff", minHeight: "400px", display: "flex", flexDirection: "column" }}>
      <div style={{ padding: "1rem 1.2rem .8rem", borderBottom: "1px solid #ebebeb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "1rem", fontWeight: 700, fontFamily: "serif", color: "#0a0a0a", letterSpacing: ".06em" }}>JOHN DOE</div>
          <div style={{ fontSize: ".42rem", color: "#A07830", fontWeight: 600, letterSpacing: ".12em", marginTop: ".1rem" }}>SOFTWARE ENGINEER</div>
          <div style={{ fontSize: ".36rem", color: "#666", marginTop: ".2rem" }}>✉ john@email.com · 📞 +91 98765</div>
        </div>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", border: "2px solid #C9A84C", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: ".5rem", fontWeight: 700, color: "#A07830", fontFamily: "serif" }}>JD</span>
        </div>
      </div>
      <div style={{ display: "flex", flex: 1 }}>
        <div style={{ flex: "0 0 62%", padding: ".6rem .8rem", borderRight: "1px solid #ebebeb", borderLeft: "3px solid #C9A84C" }}>
          {["SUMMARY", "EXPERIENCE", "PROJECTS"].map(s => (
            <div key={s} style={{ marginBottom: ".5rem" }}>
              <div style={{ fontSize: ".38rem", fontWeight: 700, letterSpacing: ".18em", color: "#0a0a0a", borderBottom: "1px solid #e8d48a", paddingBottom: ".08rem", marginBottom: ".2rem" }}>{s}</div>
              <div style={{ fontSize: ".35rem", color: "#444", lineHeight: 1.5 }}>Lorem ipsum dolor sit amet consectetur adipiscing elit.</div>
            </div>
          ))}
        </div>
        <div style={{ flex: "0 0 38%", padding: ".6rem .7rem", background: "#fff" }}>
          {["SKILLS", "EDUCATION", "CERTIFICATIONS"].map(s => (
            <div key={s} style={{ marginBottom: ".5rem" }}>
              <div style={{ fontSize: ".38rem", fontWeight: 700, letterSpacing: ".18em", color: "#0a0a0a", borderBottom: "1.5px solid #C9A84C", paddingBottom: ".08rem", marginBottom: ".2rem" }}>{s}</div>
              <div style={{ fontSize: ".35rem", color: "#444", lineHeight: 1.5 }}>
                {s === "SKILLS"
                  ? <div style={{ display: "flex", flexWrap: "wrap", gap: ".15rem" }}>{["React", "Python", "SQL"].map(sk => <span key={sk} style={{ background: "#fdf8ee", border: "1px solid #e8d48a", borderRadius: "3px", padding: ".05rem .2rem", fontSize: ".32rem" }}>{sk}</span>)}</div>
                  : "Lorem ipsum dolor sit."}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const MINI_PREVIEWS = {
  classic: MiniClassic,
  modern: MiniModern,
  tech: MiniTech,
  executive: MiniExecutive,
  etherx: MiniEtherX,
};

const TAG_COLORS = {
  "Most Popular": { bg: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "rgba(201,168,76,0.3)" },
  "Recommended": { bg: "rgba(37,99,235,0.15)", color: "#60a5fa", border: "rgba(37,99,235,0.3)" },
  "For Developers": { bg: "rgba(22,163,74,0.15)", color: "#4ade80", border: "rgba(22,163,74,0.3)" },
  "Senior Level": { bg: "rgba(30,58,95,0.3)", color: "#93c5fd", border: "rgba(30,58,95,0.5)" },
  "EtherX Edition": { bg: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "rgba(201,168,76,0.4)" },
};

export default function TemplateSelector({ onSelect, onBack }) {
  const [selected, setSelected] = useState("classic");

  return (
    <>
      <style>{STYLES}</style>
      <div className="ts-wrap">

        {/* Nav */}
        <nav className="ts-nav">
          <button className="ts-back" onClick={onBack}>← Back</button>
          <div className="ts-nav-title">EtherX Resume Builder</div>
          <div className="ts-step">Step 1 of 2 — Choose Template</div>
        </nav>

        {/* Hero */}
        <div className="ts-hero">
          <div className="ts-hero-title">Choose Your Template</div>
          <div className="ts-hero-sub">All templates are ATS-friendly · Pick the one that fits your role</div>
        </div>

        {/* Template Cards */}
        <div className="ts-grid">
          {TEMPLATES.map(t => {
            const isSelected = selected === t.id;
            const MiniPreview = MINI_PREVIEWS[t.id];
            const tagStyle = TAG_COLORS[t.tag] || TAG_COLORS["Most Popular"];

            return (
              <div
                key={t.id}
                className={`ts-card${isSelected ? " selected" : ""}`}
                onClick={() => setSelected(t.id)}
              >
                {/* Tag */}
                <div className="ts-tag" style={{ background: tagStyle.bg, color: tagStyle.color, border: `1px solid ${tagStyle.border}` }}>
                  {t.tag}
                </div>

                {/* Thumbnail */}
                <div className="ts-thumb">
                  <div className="ts-thumb-inner">
                    <MiniPreview />
                  </div>
                  <div className="ts-thumb-overlay" />
                </div>

                {/* Card body */}
                <div className="ts-card-body">
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div className="ts-card-name">{t.name}</div>
                    {isSelected && (
                      <span style={{ fontSize: ".65rem", background: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "1px solid rgba(201,168,76,0.3)", borderRadius: "4px", padding: ".1rem .4rem", fontWeight: 600 }}>
                        ✓ Selected
                      </span>
                    )}
                  </div>
                  <div className="ts-card-desc">{t.description}</div>

                  <button
                    className={`ts-select-btn ${isSelected ? "active" : "inactive"}`}
                    onClick={e => { e.stopPropagation(); setSelected(t.id); }}
                  >
                    {isSelected ? "✓ Selected" : "Select Template"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="ts-cta-wrap">
          <div>
            <button className="ts-cta" onClick={() => onSelect(selected)}>
              Build with {TEMPLATES.find(t => t.id === selected)?.name} Template →
            </button>
            <div className="ts-cta-hint">You can change this later from the builder</div>
          </div>
        </div>

      </div>
    </>
  );
}
