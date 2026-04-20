import { useState } from "react";

/* ─────────────────────────────────────────────────────────
   ATS ENGINE  — pure JS, no API, no keys
───────────────────────────────────────────────────────── */
const POWER_VERBS = [
  "achieved", "built", "created", "delivered", "designed", "developed",
  "drove", "engineered", "grew", "implemented", "improved", "launched",
  "led", "managed", "optimized", "reduced", "scaled", "shipped", "solved", "spearheaded",
];

const STOPWORDS = new Set([
  "with", "that", "this", "have", "from", "they", "will", "your", "been", "were",
  "their", "what", "when", "which", "about", "would", "there", "these", "those",
  "then", "than", "into", "over", "also", "each", "more", "very", "just", "like",
  "some", "such", "shall", "should", "could", "after", "before", "other", "under",
]);

function computeATS(data, jd) {
  const {
    personal: p = {},
    summary: s = { text: "" },
    experience = [],
    education = [],
    skills = [],
    projects = [],
    certifications = [],
  } = data;

  let earned = 0, total = 0;
  const checks = [];

  const add = (label, pts, passed, tip) => {
    total += pts;
    if (passed) earned += pts;
    checks.push({ label, pts, passed, tip });
  };

  /* ── Completeness ── */
  add("Name & Contact Info", 5, !!(p.name && p.email && p.phone), "Add your full name, email and phone number.");
  add("Professional Title", 3, !!p.title, "Add a job title e.g. 'Full Stack Developer'.");
  add("LinkedIn or GitHub", 3, !!(p.linkedin || p.github), "Include at least one professional profile URL.");
  add("Location", 2, !!p.location, "Add your city/country — ATS often filters by location.");
  add("Summary (80+ chars)", 5, (s.text || "").length >= 80, "Write a summary of at least 80 characters.");
  add("Work Experience", 6, experience.length >= 1, "Add at least one work experience entry.");
  add("Education", 4, education.length >= 1, "Add your highest education qualification.");
  add("5+ Skills Listed", 4, skills.length >= 5, "List at least 5 relevant skills.");
  add("Projects Section", 3, projects.length >= 1, "Add at least one project to show hands-on work.");
  add("Certifications", 3, certifications.length >= 1, "Add certifications to boost credibility.");

  /* ── Content Quality ── */
  const allText = [...experience, ...projects].map(e => e.bullets || "").join(" ").toLowerCase();
  const verbsFound = POWER_VERBS.filter(v => allText.includes(v));
  add("Action Verbs (3+ used)", 8, verbsFound.length >= 3,
    `Use strong verbs like: ${POWER_VERBS.slice(0, 5).join(", ")}. Found ${verbsFound.length} so far.`);

  const hasMetrics = /\d+%|\$[\d,]+|\d+x|\d+\s*(users|clients|team|projects|days|months|years|engineers|members)/i.test(allText);
  add("Quantified Achievements", 10, hasMetrics,
    "Add numbers to bullets — e.g. 'Improved speed by 40%' or 'Led a team of 8'.");

  const avgBullets = experience.length
    ? experience.reduce((a, e) => a + (e.bullets || "").split("\n").filter(b => b.trim()).length, 0) / experience.length
    : 0;
  add("3+ Bullets per Job", 7, avgBullets >= 3, "Each role should have at least 3 bullet points.");

  const summaryHasKW = skills.some(sk => (s.text || "").toLowerCase().includes(sk.toLowerCase()));
  add("Keywords in Summary", 5, summaryHasKW, "Mention at least one of your skills in your summary.");

  /* ── JD Match ── */
  let matchedKW = [], missingKW = [], jdWordCount = 0;
  if (jd && jd.trim().length > 20) {
    const resumeText = [
      p.name, p.title, s.text,
      ...experience.map(e => `${e.role} ${e.company} ${e.bullets}`),
      ...projects.map(pr => `${pr.name} ${pr.tech} ${pr.bullets}`),
      skills.join(" "),
      certifications.map(c => c.name).join(" "),
    ].join(" ").toLowerCase();

    const jdWords = [...new Set(
      (jd.toLowerCase().match(/\b[a-z][a-z0-9+#.]{2,}\b/g) || [])
    )].filter(w => !STOPWORDS.has(w) && w.length >= 3);

    jdWordCount = jdWords.length;
    matchedKW = jdWords.filter(w => resumeText.includes(w));
    missingKW = jdWords.filter(w => !resumeText.includes(w)).slice(0, 18);

    const ratio = jdWordCount ? matchedKW.length / jdWordCount : 0;
    const jdPts = Math.round(Math.min(ratio * 40, 20));
    earned += jdPts;
    total += 20;
    checks.push({
      label: "JD Keyword Match", pts: 20,
      passed: ratio >= 0.5,
      tip: ratio >= 0.5
        ? `Great — ${matchedKW.length}/${jdWordCount} keywords found in your resume.`
        : `Only ${matchedKW.length}/${jdWordCount} JD keywords found. Add missing ones below.`,
      isJD: true,
    });
  } else {
    total += 20; // keep score out of 100
  }

  const score = Math.round((earned / Math.max(total, 1)) * 100);
  return { score, checks, matchedKW, missingKW, jdWordCount };
}

/* ─────────────────────────────────────────────────────────
   SCORE RING
───────────────────────────────────────────────────────── */
function ScoreRing({ score, color }) {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  return (
    <svg width="52" height="52" viewBox="0 0 52 52" style={{ flexShrink: 0 }}>
      <circle cx="26" cy="26" r={r} fill="none" stroke="var(--prog-track)" strokeWidth="5" />
      <circle cx="26" cy="26" r={r} fill="none" stroke={color} strokeWidth="5"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 26 26)"
        style={{ transition: "stroke-dasharray .5s ease" }}
      />
      <text x="26" y="31" textAnchor="middle" fontSize="12" fontWeight="700"
        fill={color} fontFamily="Cinzel,serif">{score}</text>
    </svg>
  );
}

/* ─────────────────────────────────────────────────────────
   TAG
───────────────────────────────────────────────────────── */
function Tag({ word, type }) {
  const isRed = type === "miss";
  const bg = isRed ? "var(--red-lt)" : "var(--green-lt)";
  const bd = isRed ? "var(--red-bd)" : "var(--green-bd)";
  const color = isRed ? "var(--red)" : "var(--green)";
  return (
    <span style={{
      background: bg, border: `1px solid ${bd}`, color,
      borderRadius: "4px", padding: ".1rem .38rem",
      fontSize: ".65rem", fontWeight: 500,
    }}>{word}</span>
  );
}

/* ─────────────────────────────────────────────────────────
   ATS PANEL  — drop this just above .rb-form-foot on the last step
   Props:
     data  — the full resume data object from ResumeBuilder
     dark  — boolean passed from ResumeBuilder's dark state
───────────────────────────────────────────────────────── */
export default function ATSPanel({ data, dark }) {
  const [jd, setJd] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [filter, setFilter] = useState("all");

  const { score, checks, missingKW, matchedKW, jdWordCount } = computeATS(data, jd);

  const color = score >= 80 ? "var(--green)" : score >= 55 ? "#d97706" : "var(--red)";
  const label = score >= 80 ? "Excellent" : score >= 55 ? "Needs Work" : "Poor";
  const failed = checks.filter(c => !c.passed);
  const passed = checks.filter(c => c.passed);

  const visible = checks.filter(c =>
    filter === "fail" ? !c.passed :
      filter === "pass" ? c.passed : true
  );

  return (
    <div style={{
      borderTop: "1px solid var(--bd)",
      background: "var(--bg-form)",
      transition: "background .25s",
    }}>

      {/* ── Collapsed bar — always visible ── */}
      <button
        onClick={() => setExpanded(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", gap: ".75rem",
          padding: ".65rem 1.3rem", background: "transparent", border: "none",
          cursor: "pointer", textAlign: "left",
        }}
      >
        <ScoreRing score={score} color={color} />

        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: ".5rem", flexWrap: "wrap" }}>
            <span style={{
              fontSize: ".82rem", fontWeight: 700, color,
              fontFamily: "Cinzel,serif", letterSpacing: ".03em",
            }}>
              {label}
            </span>
            <span style={{
              fontSize: ".62rem", padding: ".1rem .45rem", borderRadius: "4px", fontWeight: 600,
              background: failed.length === 0 ? "var(--green-lt)" : "var(--red-lt)",
              color: failed.length === 0 ? "var(--green)" : "var(--red)",
              border: `1px solid ${failed.length === 0 ? "var(--green-bd)" : "var(--red-bd)"}`,
            }}>
              {failed.length === 0 ? "✓ All checks passed" : `${failed.length} issue${failed.length !== 1 ? "s" : ""}`}
            </span>
          </div>
          <div style={{ fontSize: ".67rem", color: "var(--tx-muted)", marginTop: ".1rem" }}>
            ATS Score · Click to {expanded ? "collapse" : "view details & improve"}
          </div>
        </div>

        <span style={{
          fontSize: ".7rem", color: "var(--tx-muted)", flexShrink: 0,
          transform: expanded ? "rotate(180deg)" : "none",
          transition: "transform .2s",
        }}>▼</span>
      </button>

      {/* ── Expanded panel ── */}
      {expanded && (
        <div style={{
          padding: "0 1.3rem 1.2rem",
          display: "flex", flexDirection: "column", gap: ".85rem",
          maxHeight: "420px", overflowY: "auto",
          scrollbarWidth: "thin", scrollbarColor: "var(--bd) transparent",
        }}>

          {/* JD textarea */}
          <div>
            <div style={{
              fontSize: ".65rem", fontWeight: 600, color: "var(--tx-muted)",
              textTransform: "uppercase", letterSpacing: ".1em", marginBottom: ".4rem",
            }}>
              📋 Paste Job Description (optional)
            </div>
            <textarea
              className="txa"
              rows={3}
              placeholder="Paste the job description here to see which keywords are missing from your resume..."
              value={jd}
              onChange={e => setJd(e.target.value)}
              style={{ width: "100%", resize: "vertical", fontSize: ".75rem" }}
            />
            {jd.trim().length > 0 && (
              <div style={{ fontSize: ".63rem", color: "var(--tx-muted)", marginTop: ".25rem" }}>
                {jd.trim().split(/\s+/).length} words · {jdWordCount} unique keywords extracted
              </div>
            )}
          </div>

          {/* Missing keywords */}
          {missingKW.length > 0 && (
            <div style={{
              background: "var(--red-lt)", border: "1px solid var(--red-bd)",
              borderRadius: "10px", padding: ".75rem .9rem",
            }}>
              <div style={{
                fontSize: ".65rem", fontWeight: 600, color: "var(--red)",
                textTransform: "uppercase", letterSpacing: ".08em", marginBottom: ".45rem",
              }}>
                ⚠ Missing Keywords
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".3rem" }}>
                {missingKW.map(k => <Tag key={k} word={k} type="miss" />)}
              </div>
              <div style={{ fontSize: ".62rem", color: "var(--tx-muted)", marginTop: ".45rem" }}>
                Weave these naturally into your summary, experience bullets, or skills.
              </div>
            </div>
          )}

          {/* Matched keywords */}
          {matchedKW.length > 0 && (
            <div style={{
              background: "var(--green-lt)", border: "1px solid var(--green-bd)",
              borderRadius: "10px", padding: ".75rem .9rem",
            }}>
              <div style={{
                fontSize: ".65rem", fontWeight: 600, color: "var(--green)",
                textTransform: "uppercase", letterSpacing: ".08em", marginBottom: ".45rem",
              }}>
                ✅ Matched Keywords ({matchedKW.length}/{jdWordCount})
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".3rem" }}>
                {matchedKW.slice(0, 20).map(k => <Tag key={k} word={k} type="match" />)}
                {matchedKW.length > 20 && (
                  <span style={{ fontSize: ".65rem", color: "var(--tx-muted)" }}>
                    +{matchedKW.length - 20} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Filter tabs */}
          <div style={{ display: "flex", gap: ".35rem" }}>
            {[
              { k: "all", l: `All (${checks.length})` },
              { k: "fail", l: `❌ Issues (${failed.length})` },
              { k: "pass", l: `✅ Passed (${passed.length})` },
            ].map(t => (
              <button key={t.k} onClick={() => setFilter(t.k)} style={{
                padding: ".25rem .65rem", borderRadius: "20px",
                fontSize: ".65rem", fontWeight: 600, cursor: "pointer",
                fontFamily: "DM Sans,sans-serif", transition: "all .15s",
                border: filter === t.k ? "1px solid var(--accent)" : "1px solid var(--bd)",
                background: filter === t.k ? "var(--accent)" : "transparent",
                color: filter === t.k ? "#fff" : "var(--tx-muted)",
              }}>{t.l}</button>
            ))}
          </div>

          {/* Checklist */}
          <div style={{ display: "flex", flexDirection: "column", gap: ".32rem" }}>
            {visible.map((c, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "flex-start", gap: ".5rem",
                padding: ".4rem .6rem", borderRadius: "7px",
                background: c.passed ? "var(--green-lt)" : "var(--red-lt)",
                border: `1px solid ${c.passed ? "var(--green-bd)" : "var(--red-bd)"}`,
              }}>
                <span style={{ fontSize: ".8rem", flexShrink: 0 }}>{c.passed ? "✅" : "❌"}</span>
                <div>
                  <div style={{
                    fontSize: ".7rem", fontWeight: 600,
                    color: c.passed ? "var(--green)" : "var(--red)",
                  }}>
                    {c.label}
                    <span style={{
                      fontWeight: 400, color: "var(--tx-muted)",
                      fontSize: ".63rem", marginLeft: ".3rem",
                    }}>({c.pts} pts)</span>
                  </div>
                  {(!c.passed || c.isJD) && (
                    <div style={{
                      fontSize: ".63rem", color: "var(--tx-secondary)", marginTop: ".1rem",
                    }}>{c.tip}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

        </div>
      )}
    </div>
  );
}

