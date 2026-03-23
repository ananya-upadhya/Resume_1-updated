import { useEffect, useState, useRef } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&family=Crimson+Pro:ital,wght@0,300;0,400;1,400&display=swap');

  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html, body, #root { height:auto !important; overflow:auto !important; }

  .lp {
    min-height:100vh; width:100%;
    background:#080808;
    color:#E8C96B;
    font-family:'DM Sans',sans-serif;
    display:flex; flex-direction:column;
    overflow-x:hidden;
  }

  .lp::before {
    content:''; position:fixed; inset:0; z-index:0;
    background-image:
      linear-gradient(rgba(201,168,76,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(201,168,76,0.04) 1px, transparent 1px);
    background-size:48px 48px;
    pointer-events:none;
  }

  .lp-nav {
    position:relative; z-index:10;
    display:flex; align-items:center; justify-content:space-between;
    padding:1.2rem 3rem;
    border-bottom:1px solid rgba(201,168,76,0.12);
    background:rgba(8,8,8,0.8);
    backdrop-filter:blur(12px);
  }
  .lp-brand {
    display:flex; align-items:center; gap:.75rem;
  }
  .lp-logo-text {
    font-family:'Cinzel',serif; font-size:1.2rem; font-weight:700;
    letter-spacing:.1em;
    background:linear-gradient(90deg,#A07830,#F0C040,#C9A84C);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text;
  }
  .lp-logo-sub {
    font-size:.55rem; letter-spacing:.2em; text-transform:uppercase;
    color:#6B5A3A; margin-top:.1rem;
  }
  .lp-nav-badge {
    font-size:.62rem; font-weight:600; letter-spacing:.1em;
    text-transform:uppercase; color:#C9A84C;
    border:1px solid rgba(201,168,76,0.3);
    border-radius:20px; padding:.22rem .75rem;
  }

  .lp-hero {
    position:relative; z-index:1;
    min-height:calc(100vh - 65px);
    display:flex; flex-direction:column;
    align-items:center; justify-content:center;
    text-align:center; padding:2rem 2rem 2rem;
    gap:1rem;
  }
  .lp-module-tag {
    display:inline-flex; align-items:center; gap:.5rem;
    font-size:.65rem; font-weight:600; letter-spacing:.14em;
    text-transform:uppercase; color:#A07830;
    border:1px solid rgba(160,120,48,0.35);
    border-radius:20px; padding:.3rem .9rem;
    background:rgba(160,120,48,0.08);
    animation: fadeIn .6s ease;
  }
  .lp-module-dot {
    width:6px; height:6px; border-radius:50%;
    background:#C9A84C;
    animation: blink 2s ease infinite;
  }
  .lp-headline {
    font-family:'Cinzel',serif;
    font-size:clamp(2rem, 5vw, 3.5rem);
    font-weight:700; letter-spacing:.05em; line-height:1.15;
    background:linear-gradient(135deg,#F0C040 0%,#C9A84C 40%,#A07830 100%);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text;
    animation: fadeIn .7s ease .1s both;
  }
  .lp-sub {
    font-family:'Crimson Pro',serif;
    font-size:clamp(1rem,2vw,1.25rem);
    color:#C8B090; font-style:italic;
    max-width:540px; line-height:1.7;
    animation: fadeIn .7s ease .2s both;
  }

  .lp-stats {
    display:flex; gap:2.5rem; flex-wrap:wrap; justify-content:center;
    animation: fadeIn .7s ease .3s both;
  }
  .lp-stat { text-align:center; }
  .lp-stat-val {
    font-family:'Cinzel',serif; font-size:1.6rem; font-weight:700;
    background:linear-gradient(135deg,#F0C040,#C9A84C);
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text;
  }
  .lp-stat-lbl {
    font-size:.62rem; color:#6B5A3A;
    text-transform:uppercase; letter-spacing:.12em; margin-top:.1rem;
  }

  .lp-cta-wrap {
    display:flex; flex-direction:column; align-items:center;
    gap:.85rem; animation: fadeIn .7s ease .4s both;
  }
  .lp-cta {
    display:inline-flex; align-items:center; gap:.65rem;
    padding:.85rem 2.2rem;
    background:linear-gradient(135deg,#A07830,#C9A84C,#F0C040);
    border:none; border-radius:10px;
    font-family:'Cinzel',serif; font-size:.92rem;
    font-weight:700; letter-spacing:.08em;
    color:#080808; cursor:pointer;
    transition:all .2s ease;
    box-shadow:0 4px 24px rgba(201,168,76,0.3);
  }
  .lp-cta:hover {
    transform:translateY(-2px);
    box-shadow:0 8px 32px rgba(201,168,76,0.45);
  }
  .lp-cta:active { transform:translateY(0); }
  .lp-cta-hint {
    font-size:.65rem; color:#6B5A3A; letter-spacing:.08em;
  }

  .lp-scroll-hint {
    position:absolute; bottom:1.8rem; left:50%; transform:translateX(-50%);
    display:flex; flex-direction:column; align-items:center; gap:.35rem;
    cursor:pointer; opacity:.45; transition:opacity .2s;
    animation: fadeIn 1s ease 1s both;
  }
  .lp-scroll-hint:hover { opacity:.85; }
  .lp-scroll-hint-lbl {
    font-size:.55rem; letter-spacing:.14em; text-transform:uppercase;
    color:#C9A84C;
  }
  .lp-scroll-arrow {
    width:18px; height:18px; border-right:1.5px solid #C9A84C;
    border-bottom:1.5px solid #C9A84C;
    transform:rotate(45deg);
    animation:scrollBounce 1.4s ease infinite;
  }
  @keyframes scrollBounce {
    0%,100%{transform:rotate(45deg) translateY(0)}
    50%{transform:rotate(45deg) translateY(5px)}
  }

  .lp-features {
  position:relative; z-index:1;
  display:grid; grid-template-columns:repeat(auto-fit,minmax(160px,1fr));
  gap:1px; background:rgba(201,168,76,0.1);
  border-top:1px solid rgba(201,168,76,0.1);
  animation: fadeIn .8s ease .5s both;
  flex-shrink:0;
}
  .lp-feat {
    background:#080808; padding:1.6rem 1.8rem;
    display:flex; flex-direction:column; gap:.5rem;
    transition:background .2s;
  }
  .lp-feat:hover { background:#0e0e0e; }
  .lp-feat-ico { font-size:1.4rem; }
  .lp-feat-title {
    font-family:'Cinzel',serif; font-size:.72rem;
    font-weight:600; letter-spacing:.08em; color:#C9A84C;
  }
  .lp-feat-desc {
    font-size:.7rem; color:#6B5A3A; line-height:1.6;
  }

  @keyframes fadeIn  { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:.3} }

  @media(max-width:600px) {
    .lp-nav { padding:1rem 1.2rem; }
    .lp-stats { gap:1.5rem; }
    .lp-features { grid-template-columns:1fr 1fr; }
  }
`;

const FEATURES = [
  { ico: "📋", title: "7-Step Builder", desc: "Structured sections guide you from personal info to certifications." },
  { ico: "👁", title: "Live Preview", desc: "See your resume update in real time as you type." },
  { ico: "🎯", title: "ATS Checker", desc: "Score your resume and fix issues before applying." },
  { ico: "📄", title: "PDF & Word Export", desc: "Download in both formats with one click." },
];

export default function LandingPage({ onStart }) {
  const [show, setShow] = useState(false);
  const featRef = useRef(null);
  useEffect(() => { setTimeout(() => setShow(true), 80); }, []);
  const scrollToFeatures = () => featRef.current?.scrollIntoView({ behavior: "smooth" });

  return (
    <>
      <style>{STYLES}</style>
      {show && (
        <div className="lp">

          {/* Nav */}
          <nav className="lp-nav">
            <div className="lp-brand">
              <img
                src="/logo_dark.jpg"
                alt="EtherX"
                style={{ width: "32px", height: "32px", objectFit: "contain", display: "block" }}
              />
              <div>
                <div className="lp-logo-text">EtherX</div>
                <div className="lp-logo-sub">Smart Resume Intelligence</div>
              </div>
            </div>
            <div className="lp-nav-badge">Module 1 — Resume Builder</div>
          </nav>

          {/* Hero */}
          <div className="lp-hero">
            <div className="lp-module-tag">
              <span className="lp-module-dot" />
              ATS-Optimised · Role-Ready
            </div>

            <h1 className="lp-headline">
              Build Resumes That<br />Get Shortlisted
            </h1>

            <p className="lp-sub">
              A professional resume builder with live ATS scoring,
              keyword gap analysis, and one-click PDF &amp; Word export.
            </p>

            {/* Stats */}
            <div className="lp-stats">
              {[
                { v: "7", l: "Form Sections" },
                { v: "14+", l: "ATS Checks" },
                { v: "100", l: "Max ATS Score" },
                { v: "2", l: "Export Formats" },
              ].map(s => (
                <div className="lp-stat" key={s.l}>
                  <div className="lp-stat-val">{s.v}</div>
                  <div className="lp-stat-lbl">{s.l}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="lp-cta-wrap">
              <button className="lp-cta" onClick={onStart}>
                Start Building My Resume →
              </button>
              <div className="lp-cta-hint">
                No sign-up · No API keys · 100% free
              </div>
            </div>

            {/* Scroll hint */}
            <div className="lp-scroll-hint" onClick={scrollToFeatures}>
              <div className="lp-scroll-hint-lbl">Explore</div>
              <div className="lp-scroll-arrow" />
            </div>
          </div>

          {/* Features */}
          <div className="lp-features" ref={featRef}>
            {FEATURES.map(f => (
              <div className="lp-feat" key={f.title}>
                <div className="lp-feat-ico">{f.ico}</div>
                <div className="lp-feat-title">{f.title}</div>
                <div className="lp-feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>

        </div>
      )}
    </>
  );
}
