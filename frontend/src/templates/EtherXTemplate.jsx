/* ─────────────────────────────────────────────────────────
   ETHERX SIGNATURE TEMPLATE
   Two-column · Gold accents · White background · ATS-safe
   Left: thin gold strip + main content
   Right: sidebar with initials, skills, certs, education
   All text is black on white — 100% ATS compatible
───────────────────────────────────────────────────────── */

const parseBullets = t =>
  (t || "").split("\n").map(l => l.trim().replace(/^[-•▸◆*]\s*/, "")).filter(Boolean);

const fmtM = m => {
  if (!m) return "";
  const [dd, mo, yyyy] = m.split("-");
  const mon = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+mo - 1];
  return mon ? `${dd} ${mon} ${yyyy}` : m;
};

/* ── Design tokens ── */
const GOLD      = "#C9A84C";
const GOLD_DARK = "#A07830";
const GOLD_LT   = "#fdf8ee";
const GOLD_BD   = "#e8d48a";
const BLACK     = "#0a0a0a";
const DARK      = "#1a1a1a";
const MID       = "#444444";
const MUTED     = "#777777";
const LIGHT_BD  = "#ebebeb";
const WHITE     = "#ffffff";
const SANS      = "'DM Sans', sans-serif";
const SERIF     = "'Cinzel', serif";

/* ── Initials avatar ── */
function Initials({ name }) {
  const parts  = (name || "").trim().split(/\s+/).filter(Boolean);
  const letters = parts.length >= 2
    ? parts[0][0] + parts[parts.length - 1][0]
    : parts[0]?.[0] || "?";
  return (
    <div style={{
      width: "56px", height: "56px", borderRadius: "50%",
      border: `2.5px solid ${GOLD}`,
      background: WHITE,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      <span style={{
        fontFamily: SERIF, fontSize: "1.1rem", fontWeight: 700,
        color: GOLD_DARK, letterSpacing: ".04em",
      }}>
        {letters.toUpperCase()}
      </span>
    </div>
  );
}

/* ── Section heading — left column ── */
function SH({ children }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: ".55rem",
      margin: ".9rem 0 .5rem",
    }}>
      <div style={{
        fontFamily: SERIF, fontSize: ".58rem", fontWeight: 700,
        letterSpacing: ".2em", textTransform: "uppercase", color: BLACK,
      }}>{children}</div>
      <div style={{ flex: 1, height: "1.5px", background: `linear-gradient(90deg,${GOLD},${GOLD_BD},transparent)` }} />
    </div>
  );
}

/* ── Section heading — right sidebar ── */
function SSH({ children }) {
  return (
    <div style={{
      fontFamily: SERIF, fontSize: ".55rem", fontWeight: 700,
      letterSpacing: ".18em", textTransform: "uppercase", color: BLACK,
      borderBottom: `1.5px solid ${GOLD}`,
      paddingBottom: ".18rem", marginBottom: ".5rem", marginTop: ".9rem",
    }}>{children}</div>
  );
}

/* ── Bullet list ── */
function Bullets({ text }) {
  const items = parseBullets(text);
  if (!items.length) return null;
  return (
    <ul style={{ listStyle: "none", padding: 0, margin: ".2rem 0 0" }}>
      {items.map((b, i) => (
        <li key={i} style={{
          display: "flex", gap: ".4rem", alignItems: "flex-start",
          fontSize: ".76rem", color: DARK, lineHeight: 1.6, marginBottom: ".06rem",
        }}>
          <span style={{ color: GOLD, flexShrink: 0, fontSize: ".55rem", marginTop: ".28rem", fontWeight: 700 }}>◆</span>
          {b}
        </li>
      ))}
    </ul>
  );
}

/* ── Main export ── */
export default function EtherXTemplate({ data }) {
  const {
    personal: p = {},
    summary:  s = { text: "" },
    experience    = [],
    education     = [],
    skills        = [],
    projects      = [],
    certifications = [],
  } = data;

  const hasContent = p.name || s.text || experience.length || education.length || skills.length;

  if (!hasContent) return (
    <div style={{
      width: "100%", maxWidth: "720px", background: WHITE,
      minHeight: "792px", alignSelf: "flex-start",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 4px 6px rgba(0,0,0,0.04),0 16px 48px rgba(0,0,0,0.10)",
    }}>
      <div style={{ textAlign: "center", color: MUTED, fontFamily: SANS }}>
        <div style={{ fontSize: "2.5rem", marginBottom: ".5rem" }}>✦</div>
        <div style={{ fontFamily: SERIF, fontSize: ".85rem", color: GOLD_DARK, letterSpacing: ".08em" }}>
          EtherX Signature
        </div>
        <div style={{ fontSize: ".72rem", color: MUTED, marginTop: ".3rem" }}>
          Fill in the form to see your resume
        </div>
      </div>
    </div>
  );

  const contactItems = [
    p.phone    && { ico: "📞", label: p.phone },
    p.email    && { ico: "✉",  label: p.email },
    p.location && { ico: "📍", label: p.location },
    p.linkedin && { ico: "in", label: p.linkedin },
    p.github   && { ico: "⌥",  label: p.github },
    p.website  && { ico: "🌐", label: p.website },
  ].filter(Boolean);

  return (
    <div id="resume-output" style={{
      width: "100%", maxWidth: "720px", background: WHITE,
      minHeight: "792px", alignSelf: "flex-start",
      fontFamily: SANS, fontSize: ".82rem", color: DARK,
      display: "flex", flexDirection: "column",
      boxShadow: "0 4px 6px rgba(0,0,0,0.04),0 16px 48px rgba(0,0,0,0.10)",
      position: "relative",
    }}>

      {/* ── LEFT GOLD STRIP ── */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: "4px",
        background: `linear-gradient(180deg,${GOLD},${GOLD_DARK},${GOLD})`,
        borderRadius: "2px 0 0 2px",
      }} />

      {/* ── HEADER ── */}
      <div style={{
        padding: "1.6rem 1.8rem 1.2rem 1.8rem",
        borderBottom: `1px solid ${LIGHT_BD}`,
        background: WHITE,
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
          <div style={{ flex: 1 }}>
            {/* Name */}
            <div style={{
              fontFamily: SERIF, fontSize: "1.7rem", fontWeight: 700,
              color: BLACK, letterSpacing: ".06em", lineHeight: 1.15,
              marginBottom: ".2rem",
            }}>{p.name || "Your Name"}</div>

            {/* Title */}
            {p.title && (
              <div style={{
                fontSize: ".72rem", fontWeight: 600, letterSpacing: ".14em",
                textTransform: "uppercase", color: GOLD_DARK, marginBottom: ".55rem",
              }}>{p.title}</div>
            )}

            {/* Contact row */}
            {contactItems.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: ".2rem .7rem" }}>
                {contactItems.map((c, i) => (
                  <span key={i} style={{
                    display: "inline-flex", alignItems: "center", gap: ".25rem",
                    fontSize: ".65rem", color: MID,
                  }}>
                    <span style={{ fontSize: ".6rem", color: GOLD }}>{c.ico}</span>
                    {c.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Initials avatar */}
          <Initials name={p.name} />
        </div>

        {/* Gold rule under header */}
        <div style={{
          height: "1.5px", marginTop: "1rem",
          background: `linear-gradient(90deg,${GOLD},${GOLD_BD},transparent)`,
        }} />
      </div>

      {/* ── BODY: two columns ── */}
      <div style={{ display: "flex", flex: 1 }}>

        {/* LEFT MAIN — 62% */}
        <div style={{ flex: "0 0 62%", padding: "1rem 1.2rem 1.4rem 1.8rem", borderRight: `1px solid ${LIGHT_BD}` }}>

          {/* Summary */}
          {s.text && <>
            <SH>Summary</SH>
            <p style={{ fontSize: ".78rem", color: DARK, lineHeight: 1.75, margin: 0 }}>{s.text}</p>
          </>}

          {/* Experience */}
          {experience.length > 0 && <>
            <SH>Experience</SH>
            {experience.map(e => (
              <div key={e.id} style={{ marginBottom: ".85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: ".5rem" }}>
                  <div>
                    <div style={{ fontWeight: 700, color: BLACK, fontSize: ".8rem" }}>{e.role || "Role"}</div>
                    <div style={{ fontSize: ".72rem", color: GOLD_DARK, fontWeight: 600, marginTop: ".03rem" }}>{e.company}</div>
                  </div>
                  <div style={{
                    fontSize: ".63rem", color: MUTED, whiteSpace: "nowrap",
                    flexShrink: 0, paddingTop: ".06rem",
                    background: GOLD_LT, border: `1px solid ${GOLD_BD}`,
                    borderRadius: "4px", padding: ".1rem .42rem",
                  }}>
                    {fmtM(e.start)}{e.start ? " – " : ""}{e.current ? "Present" : fmtM(e.end)}
                  </div>
                </div>
                <Bullets text={e.bullets} />
              </div>
            ))}
          </>}

          {/* Projects */}
          {projects.length > 0 && <>
            <SH>Projects</SH>
            {projects.map(pr => (
              <div key={pr.id} style={{ marginBottom: ".85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: ".5rem" }}>
                  <div>
                    <div style={{ fontWeight: 700, color: BLACK, fontSize: ".8rem" }}>{pr.name || "Project"}</div>
                    {pr.tech && <div style={{ fontSize: ".68rem", color: GOLD_DARK, marginTop: ".03rem", fontWeight: 500 }}>{pr.tech}</div>}
                  </div>
                  {pr.url && (
                    <a style={{ fontSize: ".62rem", color: GOLD_DARK, textDecoration: "none", flexShrink: 0 }}
                      href={`https://${pr.url}`} target="_blank" rel="noreferrer">{pr.url}</a>
                  )}
                </div>
                <Bullets text={pr.bullets} />
              </div>
            ))}
          </>}

        </div>

        {/* RIGHT SIDEBAR — 38% */}
        <div style={{ flex: "0 0 38%", padding: "1rem 1.4rem 1.4rem 1.2rem", background: WHITE }}>

          {/* Skills */}
          {skills.length > 0 && <>
            <SSH>Skills</SSH>
            <div style={{ display: "flex", flexWrap: "wrap", gap: ".28rem", marginBottom: ".2rem" }}>
              {skills.map(sk => (
                <span key={sk} style={{
                  fontSize: ".65rem", fontWeight: 500, color: BLACK,
                  background: GOLD_LT, border: `1px solid ${GOLD_BD}`,
                  borderRadius: "4px", padding: ".14rem .45rem",
                }}>{sk}</span>
              ))}
            </div>
          </>}

          {/* Education */}
          {education.length > 0 && <>
            <SSH>Education</SSH>
            {education.map(e => (
              <div key={e.id} style={{ marginBottom: ".7rem" }}>
                <div style={{ fontWeight: 700, color: BLACK, fontSize: ".75rem" }}>
                  {[e.degree, e.field].filter(Boolean).join(" in ") || "Degree"}
                </div>
                <div style={{ fontSize: ".68rem", color: GOLD_DARK, fontWeight: 500, marginTop: ".03rem" }}>{e.institution}</div>
                <div style={{ fontSize: ".62rem", color: MUTED, marginTop: ".03rem" }}>
                  {e.start}{e.start && e.end ? " – " : ""}{e.end}
                </div>
                {e.gpa && <div style={{ fontSize: ".62rem", color: MID }}>CGPA: {e.gpa}</div>}
              </div>
            ))}
          </>}

          {/* Certifications */}
          {certifications.length > 0 && <>
            <SSH>Certifications</SSH>
            {certifications.map(c => (
              <div key={c.id} style={{
                marginBottom: ".6rem", padding: ".4rem .55rem",
                background: GOLD_LT, border: `1px solid ${GOLD_BD}`,
                borderRadius: "6px", borderLeft: `3px solid ${GOLD}`,
              }}>
                <div style={{ fontWeight: 700, color: BLACK, fontSize: ".72rem" }}>{c.name}</div>
                {c.issuer && <div style={{ fontSize: ".63rem", color: GOLD_DARK, marginTop: ".03rem" }}>{c.issuer}</div>}
                {c.date   && <div style={{ fontSize: ".6rem",  color: MUTED,     marginTop: ".03rem" }}>{fmtM(c.date)}</div>}
              </div>
            ))}
          </>}

          {/* EtherX watermark */}
          <div style={{
            marginTop: "auto", paddingTop: "1.5rem",
            display: "flex", alignItems: "center", gap: ".35rem",
          }}>
            <div style={{ flex: 1, height: "1px", background: GOLD_BD }} />
            <span style={{
              fontFamily: SERIF, fontSize: ".48rem", letterSpacing: ".18em",
              color: GOLD, textTransform: "uppercase", opacity: .6,
            }}>EtherX</span>
            <div style={{ flex: 1, height: "1px", background: GOLD_BD }} />
          </div>

        </div>
      </div>
    </div>
  );
}
