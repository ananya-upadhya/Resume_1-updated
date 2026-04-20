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
    <div style={{ display: "flex", fontFamily: "serif", background: "#fff", minHeight: "400px" }}>
      {/* Sidebar (Left 30%) */}
      <div style={{ width: "30%", background: "#f9f9f9", padding: "1.2rem .8rem", borderRight: "1px solid #eee" }}>
        <div style={{ fontSize: ".42rem", fontWeight: 700, letterSpacing: ".1em", color: "#111", textTransform: "uppercase", borderBottom: "1px solid #ccc", paddingBottom: "2px", marginBottom: "6px" }}>Education</div>
        <div style={{ fontSize: ".38rem", fontWeight: 700, color: "#111" }}>B.Tech CS</div>
        <div style={{ fontSize: ".32rem", color: "#666", marginBottom: "12px" }}>2018 - 2022</div>
        <div style={{ fontSize: ".42rem", fontWeight: 700, letterSpacing: ".1em", color: "#111", textTransform: "uppercase", borderBottom: "1px solid #ccc", paddingBottom: "2px", marginBottom: "6px" }}>Skills</div>
        {["React", "Python", "SQL", "Docker"].map(s => <div key={s} style={{ fontSize: ".35rem", color: "#333", marginBottom: "3px" }}>• {s}</div>)}
      </div>
      {/* Main Column */}
      <div style={{ flex: 1, padding: "1.2rem 1rem" }}>
        <div style={{ borderBottom: "1.5px solid #111", paddingBottom: "8px", marginBottom: "15px" }}>
          <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#111", letterSpacing: "-0.02em" }}>JOHN DOE</div>
          <div style={{ fontSize: ".55rem", color: "#888", fontWeight: 500, marginTop: "2px" }}>Software Engineer</div>
        </div>
        <div style={{ fontSize: ".42rem", fontWeight: 700, letterSpacing: ".05em", color: "#111", textTransform: "uppercase", borderBottom: "1px solid #ccc", paddingBottom: "2px", marginBottom: "8px" }}>Experience</div>
        <div style={{ marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
            <div style={{ fontSize: ".45rem", fontWeight: 700, color: "#111" }}>Senior Developer</div>
            <div style={{ fontSize: ".35rem", color: "#888" }}>2022 - Present</div>
          </div>
          <div style={{ fontSize: ".4rem", color: "#111", fontStyle: "italic" }}>TechCorp</div>
          <div style={{ fontSize: ".38rem", color: "#444", marginTop: "4px", lineHeight: 1.4 }}>Participated in full-cycle software development and system architecture design.</div>
        </div>
      </div>
    </div>
  );
}
function MiniModern() {
  return (
    <div style={{ display: "flex", flexDirection: "column", fontFamily: "sans-serif", background: "#fff", minHeight: "400px" }}>
      <div style={{ background: "#2563eb", padding: "1.2rem 1.4rem", color: "#fff" }}>
        <div style={{ fontSize: "1.1rem", fontWeight: 700, letterSpacing: ".06em" }}>JOHN DOE</div>
        <div style={{ fontSize: ".42rem", fontWeight: 500, letterSpacing: ".15em", textTransform: "uppercase", opacity: 0.85, marginTop: "2px" }}>SOFTWARE ENGINEER</div>
      </div>
      <div style={{ display: "flex", flex: 1 }}>
        <div style={{ width: "36%", background: "#eff6ff", padding: "1rem .8rem" }}>
          <div style={{ fontSize: ".38rem", fontWeight: 700, letterSpacing: ".1em", color: "#2563eb", textTransform: "uppercase", marginBottom: "6px" }}>Contact</div>
          {["email", "phone", "location"].map(c => <div key={c} style={{ fontSize: ".34rem", color: "#334155", marginBottom: "3px" }}>● {c}</div>)}
          <div style={{ fontSize: ".38rem", fontWeight: 700, letterSpacing: ".1em", color: "#2563eb", textTransform: "uppercase", margin: "10px 0 6px" }}>Skills</div>
          {["React", "Node.js", "Python"].map(s => <div key={s} style={{ display: "flex", alignItems: "center", gap: "3px", marginBottom: "2px" }}>
            <div style={{ width: "3px", height: "3px", borderRadius: "50%", background: "#2563eb" }} />
            <span style={{ fontSize: ".35rem", color: "#1e293b" }}>{s}</span>
          </div>)}
        </div>
        <div style={{ flex: 1, padding: "1rem" }}>
          <div style={{ borderBottom: "2px solid #2563eb", paddingBottom: "2px", marginBottom: "8px" }}>
            <div style={{ fontSize: ".42rem", fontWeight: 700, letterSpacing: ".1em", color: "#2563eb", textTransform: "uppercase" }}>Work Experience</div>
          </div>
          <div style={{ marginBottom: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontSize: ".45rem", fontWeight: 700, color: "#0f172a" }}>Senior Role</div>
              <div style={{ fontSize: ".32rem", color: "#94a3b8" }}>Present</div>
            </div>
            <div style={{ fontSize: ".38rem", color: "#2563eb", fontWeight: 500 }}>Company Name</div>
            <div style={{ fontSize: ".35rem", color: "#475569", marginTop: "3px" }}>▸ Led cross-functional teams to deliver scaleable solutions.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
function MiniTech() {
  return (
    <div style={{ display: "flex", fontFamily: "sans-serif", background: "#fff", minHeight: "400px" }}>
      {/* Navy Sidebar (35%) */}
      <div style={{ width: "35%", background: "#1A2B3C", color: "#fff", padding: "1.5rem 1rem", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ width: "40px", height: "40px", background: "#C9A84C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "15px" }}>
          <span style={{ fontSize: ".8rem", fontWeight: 700, color: "#1A2B3C" }}>JD</span>
        </div>
        <div style={{ textAlign: "center", marginBottom: "15px" }}>
          <div style={{ fontSize: ".8rem", fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>JOHN DOE</div>
          <div style={{ fontSize: ".38rem", color: "#C9A84C", fontWeight: 500, marginTop: "3px" }}>Tech Expert</div>
        </div>
        <div style={{ width: "100%", fontSize: ".32rem", display: "flex", flexDirection: "column", gap: "4px" }}>
          <div style={{ display: "flex", gap: "5px" }}><span style={{ color: "#C9A84C" }}>EM</span><span>john@dev.io</span></div>
          <div style={{ display: "flex", gap: "5px" }}><span style={{ color: "#C9A84C" }}>GIT</span><span>github.com/jd</span></div>
        </div>
        <div style={{ width: "100%", marginTop: "15px" }}>
          <div style={{ fontSize: ".35rem", color: "#C9A84C", fontWeight: 700, textTransform: "uppercase", borderBottom: "1px solid rgba(201,168,76,0.3)", paddingBottom: "2px", marginBottom: "5px" }}>Expertise</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "3px" }}>
            {["React", "AWS", "Python"].map(sk => <span key={sk} style={{ fontSize: ".28rem", background: "#0D2137", border: "1px solid #C9A84C", padding: "1px 3px", borderRadius: "2px" }}>{sk}</span>)}
          </div>
        </div>
      </div>
      {/* Main Column */}
      <div style={{ width: "65%", padding: "1.5rem 1.2rem" }}>
        <div style={{ marginBottom: "15px" }}>
          <div style={{ fontSize: ".5rem", fontWeight: 800, color: "#C9A84C", textTransform: "uppercase", letterSpacing: ".05em" }}>Work Experience</div>
          <div style={{ height: "1.5px", background: "linear-gradient(to right, #C9A84C, #14b8a6)", marginTop: "3px" }} />
        </div>
        <div style={{ marginBottom: "12px" }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ fontSize: ".48rem", fontWeight: 700, color: "#1A2B3C" }}>Senior Developer</div>
            <div style={{ fontSize: ".32rem", color: "#666" }}>2022 - 2024</div>
          </div>
          <div style={{ fontSize: ".42rem", color: "#C9A84C", fontWeight: 600 }}>Google Cloud</div>
          <div style={{ fontSize: ".38rem", color: "#333", marginTop: "4px", lineHeight: 1.4 }}>• Developed cloud-native infrastructure using Kubernetes.</div>
        </div>
      </div>
    </div>
  );
}
function MiniExecutive() {
  return (
    <div style={{ display: "flex", fontFamily: "sans-serif", background: "#fff", minHeight: "400px" }}>
      {/* Sidebar (35%) */}
      <div style={{ width: "35%", background: "#F3F3F3", padding: "1.2rem 1rem", borderRight: "1px solid #D1D5DB" }}>
        <div style={{ fontSize: ".38rem", fontWeight: 700, letterSpacing: ".1em", color: "#111", textTransform: "uppercase", borderBottom: "1.5px solid #111", paddingBottom: "2px", marginBottom: "8px" }}>About Me</div>
        <div style={{ fontSize: ".34rem", color: "#444", lineHeight: 1.5, marginBottom: "15px" }}>Senior strategist with a track record of driving corporate growth.</div>
        <div style={{ fontSize: ".38rem", fontWeight: 700, letterSpacing: ".1em", color: "#111", textTransform: "uppercase", borderBottom: "1.5px solid #111", paddingBottom: "2px", marginBottom: "8px" }}>Skills</div>
        {["Strategy", "Leadership", "Finance"].map((s, i) => <div key={s} style={{ marginBottom: "5px" }}>
          <div style={{ fontSize: ".34rem", fontWeight: 600, color: "#333", marginBottom: "2px" }}>{s}</div>
          <div style={{ height: "3px", background: "#DDD", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ background: "#111", height: "100%", width: i === 0 ? "90%" : i === 1 ? "80%" : "70%" }} />
          </div>
        </div>)}
      </div>
      {/* Main Content (65%) */}
      <div style={{ flex: 1, padding: "0" }}>
        <div style={{ background: "#111", padding: "1.2rem", color: "#fff", marginBottom: "10px" }}>
          <div style={{ fontSize: "1.2rem", fontWeight: 800, letterSpacing: ".05em", textTransform: "uppercase" }}>JOHN DOE</div>
          <div style={{ fontSize: ".42rem", textTransform: "uppercase", letterSpacing: ".15em", opacity: 0.9, marginTop: "2px" }}>Chief Officer</div>
        </div>
        <div style={{ padding: "0.8rem 1.2rem" }}>
          <div style={{ fontSize: ".42rem", fontWeight: 700, letterSpacing: ".1em", color: "#111", textTransform: "uppercase", borderBottom: "1.5px solid #111", paddingBottom: "2px", marginBottom: "10px" }}>Experience</div>
          <div style={{ display: "flex", gap: "8px", position: "relative" }}>
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", border: "1.2px solid #111", background: "#fff", flexShrink: 0, marginTop: "3px" }} />
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ fontSize: ".42rem", fontWeight: 700, color: "#111" }}>Executive Director</div>
                <div style={{ fontSize: ".32rem", color: "#777" }}>2018 - PRESENT</div>
              </div>
              <div style={{ fontSize: ".38rem", color: "#555", fontWeight: 600 }}>Global Corp</div>
              <div style={{ fontSize: ".35rem", color: "#555", marginTop: "3px" }}>• Optimized operational efficiency by 25%.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
function MiniEtherX() {
  return (
    <div style={{ display: "flex", fontFamily: "sans-serif", background: "#fff", minHeight: "400px" }}>
      {/* Green Sidebar (32%) */}
      <div style={{ width: "32%", background: "#1A3C34", color: "#fff", padding: "1.2rem .8rem", display: "flex", flexDirection: "column" }}>
        <div style={{ width: "32px", height: "32px", background: "#C9A84C", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "10px" }}>
          <span style={{ fontSize: ".6rem", fontWeight: 700, color: "#fff" }}>JD</span>
        </div>
        <div style={{ fontSize: ".75rem", fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>JOHN DOE</div>
        <div style={{ fontSize: ".34rem", color: "#C9A84C", fontWeight: 500, fontStyle: "italic", marginTop: "2px", marginBottom: "12px" }}>Signature Pro</div>
        <div style={{ fontSize: ".38rem", fontWeight: 700, letterSpacing: ".1em", color: "#C9A84C", textTransform: "uppercase", borderBottom: ".5px solid #C9A84C", paddingBottom: "2px", marginBottom: "5px" }}>Skills</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "3px", marginBottom: "10px" }}>
          {["AI", "Data", "Cloud"].map(s => <span key={s} style={{ fontSize: ".28rem", background: "#2A5C4A", padding: "1px 3px", borderRadius: "2px" }}>{s}</span>)}
        </div>
        <div style={{ marginTop: "auto", borderTop: "1px solid rgba(201,168,76,0.3)", paddingTop: "5px", textAlign: "center" }}>
          <span style={{ fontSize: ".25rem", color: "#C9A84C", letterSpacing: ".2em" }}>ETHERX</span>
        </div>
      </div>
      {/* Main Column */}
      <div style={{ flex: 1, padding: "1.2rem 1.4rem" }}>
        <div style={{ fontSize: ".45rem", fontWeight: 700, color: "#1A3C34", textTransform: "uppercase", borderBottom: "1px solid #C9A84C", paddingBottom: "2px", marginBottom: "10px" }}>Summary</div>
        <div style={{ fontSize: ".38rem", lineHeight: 1.6, color: "#333", marginBottom: "15px" }}>Expert in delivering high-value technical architecture and strategy.</div>
        <div style={{ fontSize: ".45rem", fontWeight: 700, color: "#1A3C34", textTransform: "uppercase", borderBottom: "1px solid #C9A84C", paddingBottom: "2px", marginBottom: "8px" }}>Experience</div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
          <div style={{ fontSize: ".4rem", fontWeight: 700, color: "#1A3C34" }}>Senior Lead</div>
          <div style={{ fontSize: ".32rem", color: "#777" }}>2020 - Present</div>
        </div>
        <div style={{ fontSize: ".34rem", color: "#C9A84C", fontWeight: 600 }}>EtherX Solutions</div>
      </div>
    </div>
  );
}

function MiniStudent() {
  return (
    <div style={{ display: "flex", flexDirection: "column", fontFamily: "sans-serif", background: "#fff", minHeight: "400px" }}>
      {/* Header */}
      <div style={{ padding: "1.2rem 1.4rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#2d2d2d", textTransform: "uppercase" }}>JOHN DOE</div>
          <div style={{ fontSize: ".45rem", color: "#C85A38", fontWeight: 600, letterSpacing: ".1em", marginTop: "2px" }}>SOFTWARE INTERN</div>
        </div>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "#C85A38", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: ".6rem", fontWeight: 500, color: "#fff" }}>JD</span>
        </div>
      </div>
      {/* Contact Bar */}
      <div style={{ background: "#F5F5F5", padding: "4px 0", borderBottom: "1.5px solid #C85A38", textAlign: "center", fontSize: ".32rem", color: "#2d2d2d", fontWeight: 500 }}>
        john@edu.com  |  NY, USA  |  github.com/jd
      </div>
      {/* Body Grid */}
      <div style={{ display: "flex", flex: 1, padding: "1rem 1.4rem" }}>
        <div style={{ width: "65%", paddingRight: "10px" }}>
          <div style={{ fontSize: ".42rem", fontWeight: 700, color: "#C85A38", textTransform: "uppercase", marginBottom: "5px" }}>Experience</div>
          <div style={{ borderBottom: "1px solid #C85A38", width: "15px", marginBottom: "8px" }} />
          <div style={{ fontSize: ".38rem", fontWeight: 700, color: "#2d2d2d" }}>Tech Intern</div>
          <div style={{ fontSize: ".34rem", color: "#C85A38", fontWeight: 600 }}>StartUp Inc</div>
          <div style={{ fontSize: ".33rem", color: "#444", marginTop: "3px" }}>• Developed modular UI components using React.</div>
        </div>
        <div style={{ width: "35%", paddingLeft: "10px", borderLeft: "1px solid #eee" }}>
          <div style={{ fontSize: ".42rem", fontWeight: 700, color: "#C85A38", textTransform: "uppercase", marginBottom: "5px" }}>Skills</div>
          <div style={{ borderBottom: "1px solid #C85A38", width: "15px", marginBottom: "8px" }} />
          {["React", "JS", "CSS"].map(sk => <div key={sk} style={{ fontSize: ".35rem", marginBottom: "3px", color: "#2d2d2d" }}>• {sk}</div>)}
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
  student: MiniStudent,
};

const TAG_COLORS = {
  "Most Popular": { bg: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "rgba(201,168,76,0.3)" },
  "Recommended": { bg: "rgba(37,99,235,0.15)", color: "#60a5fa", border: "rgba(37,99,235,0.3)" },
  "For Developers": { bg: "rgba(22,163,74,0.15)", color: "#4ade80", border: "rgba(22,163,74,0.3)" },
  "Senior Level": { bg: "rgba(30,58,95,0.3)", color: "#93c5fd", border: "rgba(30,58,95,0.5)" },
  "EtherX Edition": { bg: "rgba(201,168,76,0.15)", color: "#C9A84C", border: "rgba(201,168,76,0.4)" },
  "For Students": { bg: "rgba(200,90,56,0.15)", color: "#C85A38", border: "rgba(200,90,56,0.4)" },
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
