'use client';
import { useState, useEffect, useRef, useCallback } from "react";
import ATSPanel from "./ATSPanel";
import { ENHANCERS } from "../groqHelper";
import SelectedTemplate from "../templates/index.jsx";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API = API_BASE.replace(/\/api$/, "").replace(/\/$/, "");

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&display=swap');

  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html, body, #root { width:100%; height:auto !important; overflow:hidden; }
  body { font-family:'DM Sans',sans-serif; }

  @keyframes shimmer     { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes spin        { to{transform:rotate(360deg)} }
  @keyframes blink       { 0%,100%{opacity:1} 50%{opacity:.15} }
  @keyframes pulse-gold  { 0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,0.5)} 60%{box-shadow:0 0 0 7px rgba(201,168,76,0)} }
  @keyframes fadeIn      { from{opacity:0} to{opacity:1} }
  @keyframes slideDown   { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes slideUp     { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
  @keyframes stepIn      { from{opacity:0;transform:translateX(14px)} to{opacity:1;transform:translateX(0)} }
  @keyframes glow        { 0%,100%{opacity:.6} 50%{opacity:1} }
  @keyframes modalIn     { from{opacity:0;transform:translateY(18px) scale(.97)} to{opacity:1;transform:translateY(0) scale(1)} }
  @keyframes checkPop    { 0%{transform:translateY(-50%) scale(0)} 70%{transform:translateY(-50%) scale(1.2)} 100%{transform:translateY(-50%) scale(1)} }
  @keyframes stepFade    { from{opacity:0;transform:translateX(16px)} to{opacity:1;transform:translateX(0)} }

  /* ── Smooth step transition ── */
  .rb-form-body { animation:stepFade .24s cubic-bezier(.4,0,.2,1); }

  /* ── Char counter ── */
  .char-counter-wrap { display:flex;justify-content:flex-end;margin-top:.22rem; }
  .char-counter { font-size:.58rem;font-weight:500;color:var(--tx-muted);font-variant-numeric:tabular-nums;letter-spacing:.02em; }
  .char-counter.warn { color:#BA7517; }
  .char-counter.over { color:var(--red); }

  /* ── Inline validation check ── */
  .field-valid-wrap { position:relative; }
  .field-valid-wrap .inp { padding-right:2.4rem; }
  .field-valid-icon { position:absolute;right:.72rem;top:50%;transform:translateY(-50%);width:16px;height:16px;border-radius:50%;background:var(--green);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .2s;pointer-events:none; }
  .field-valid-icon.show { opacity:1;animation:checkPop .25s cubic-bezier(.34,1.56,.64,1) forwards; }

  /* ── Collapsible cards ── */
  .card-header { display:flex;align-items:center;gap:.6rem;cursor:pointer;padding-bottom:.55rem;user-select:none; }
  .card-header-title { font-size:.82rem;font-weight:600;color:var(--tx-primary);flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap; }
  .card-header-sub   { font-size:.7rem;color:var(--tx-muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:130px;flex-shrink:0; }
  .card-collapse-btn { width:22px;height:22px;border-radius:5px;border:1px solid var(--bd);background:transparent;color:var(--tx-muted);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all .15s; }
  .card-collapse-btn:hover { background:var(--accent-lt);border-color:var(--accent);color:var(--accent); }
  .card-collapse-btn svg { transition:transform .22s cubic-bezier(.4,0,.2,1); }
  .card-collapse-btn.open svg { transform:rotate(180deg); }
  .card-collapsible { overflow:hidden;transition:max-height .3s cubic-bezier(.4,0,.2,1),opacity .25s ease; }
  .card-collapsible.closed { max-height:0;opacity:0;pointer-events:none; }
  .card-collapsible.open   { max-height:9999px;opacity:1; }

  /* ── Empty states ── */
  .empty-state { display:flex;flex-direction:column;align-items:center;justify-content:center;padding:1.75rem 1rem;gap:.65rem;text-align:center; }
  .empty-state-icon { width:44px;height:44px;border-radius:12px;background:var(--accent-lt);border:1px solid rgba(201,168,76,0.22);display:flex;align-items:center;justify-content:center; }
  .empty-state h4 { font-family:'Cinzel',serif;font-size:.8rem;font-weight:600;color:var(--tx-secondary);letter-spacing:.06em;margin:0; }
  .empty-state p  { font-size:.72rem;color:var(--tx-muted);max-width:220px;line-height:1.6;margin:0; }

  /* ── Zoom controls ── */
  .rb-zoom-grp { display:flex;align-items:center;gap:.28rem; }
  .rb-zoom-btn { width:24px;height:24px;border-radius:5px;border:1px solid var(--bd);background:transparent;color:var(--tx-secondary);cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:.78rem;font-weight:700;transition:all .14s;flex-shrink:0; }
  .rb-zoom-btn:hover { background:var(--accent-lt);border-color:var(--accent);color:var(--accent); }
  .rb-zoom-val { font-size:.6rem;font-weight:600;color:var(--tx-muted);min-width:28px;text-align:center;letter-spacing:.04em; }

  /* ── Save state indicator ── */
  .rb-save-state { display:flex;align-items:center;gap:.32rem;font-size:.58rem;color:var(--tx-muted);letter-spacing:.04em; }
  .rb-save-dot { width:5px;height:5px;border-radius:50%;background:var(--green);flex-shrink:0;animation:blink 2.5s infinite; }
  .rb-save-dot.saving { background:var(--accent); }

  /* ── Template chip ── */
  .rb-tmpl-chip { display:flex;align-items:center;font-size:.62rem;font-weight:600;letter-spacing:.05em;color:var(--gold-dim);background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.18);border-radius:4px;padding:.1rem .45rem;text-transform:capitalize;white-space:nowrap; }

  /* ── Required dot on sidebar ── */
  .rb-ni-req { width:5px;height:5px;border-radius:50%;background:var(--accent);flex-shrink:0;opacity:.45; }

  /* ── Keyboard shortcut hint ── */
  .rb-kbd-hint { font-size:.55rem;color:var(--tx-muted);display:flex;align-items:center;gap:.28rem;margin-top:.4rem; }
  .rb-kbd { font-family:monospace;font-size:.6rem;background:rgba(201,168,76,0.06);border:1px solid rgba(201,168,76,0.18);border-radius:3px;padding:.05rem .3rem;color:var(--gold-dim);white-space:nowrap; }

  /* ── Step counter chip ── */
  .rb-step-counter {
    display:flex; align-items:center; gap:.32rem;
    font-family:'DM Sans',sans-serif; font-size:.62rem; font-weight:600;
    color:var(--tx-muted); letter-spacing:.04em; white-space:nowrap;
  }
  .rb-step-counter strong { color:var(--accent); font-weight:700; font-size:.68rem; }
  .rb-step-dots { display:flex; align-items:center; gap:3px; }
  .rb-step-dot {
    width:5px; height:5px; border-radius:50%;
    background:rgba(201,168,76,0.2); transition:all .3s;
  }
  .rb-step-dot.done    { background:var(--gold-dim); }
  .rb-step-dot.active  { background:var(--accent); width:14px; border-radius:3px; }

  /* ── Sidebar completion ring ── */
  .rb-ni-ring {
    position:relative; width:20px; height:20px; flex-shrink:0;
  }
  .rb-ni-ring svg { position:absolute; top:0; left:0; width:20px; height:20px; transform:rotate(-90deg); }
  .rb-ni-ring-bg   { fill:none; stroke:rgba(201,168,76,0.14); stroke-width:2; }
  .rb-ni-ring-fill { fill:none; stroke:var(--accent); stroke-width:2; stroke-linecap:round; transition:stroke-dashoffset .5s cubic-bezier(.4,0,.2,1); }
  .rb-ni-ring-num {
    position:absolute; inset:0;
    display:flex; align-items:center; justify-content:center;
    font-size:.56rem; font-weight:700; color:var(--tx-muted);
    transition:color .2s;
  }
  .rb-ni.active .rb-ni-ring-num { color:var(--ni-act-num-tx); }
  .rb-ni.active .rb-ni-ring svg { display:none; }
  .rb-ni.active .rb-ni-ring {
    background:var(--ni-act-num-bg); border-radius:50%;
    animation:pulse-gold 2.2s infinite;
  }
  .rb-ni.active .rb-ni-ring-num { font-size:.58rem; color:var(--ni-act-num-tx); }
  .rb-ni-count {
    margin-left:auto; font-size:.58rem; color:var(--tx-muted);
    background:rgba(201,168,76,0.08); border:1px solid rgba(201,168,76,0.14);
    border-radius:3px; padding:.02rem .3rem; white-space:nowrap;
    transition:all .2s; flex-shrink:0;
  }
  .rb-ni.active .rb-ni-count { color:var(--accent); background:rgba(201,168,76,0.12); border-color:rgba(201,168,76,0.28); }
  .rb-ni.done   .rb-ni-count { color:var(--gold-dim); }

  /* ── Export modal ── */
  .rb-modal-overlay {
    position:fixed; inset:0; z-index:500;
    background:rgba(0,0,0,0.78);
    display:flex; align-items:center; justify-content:center;
    animation:fadeIn .18s ease;
    padding:1rem;
  }
  .rb-modal {
    background:#0E0E0E; border:1px solid rgba(201,168,76,0.22);
    border-radius:14px; width:100%; max-width:420px;
    box-shadow:0 0 0 1px rgba(201,168,76,0.08),0 24px 80px rgba(0,0,0,0.9);
    animation:modalIn .22s cubic-bezier(.34,1.3,.64,1);
    overflow:hidden;
  }
  .rb-modal-hdr {
    padding:1.1rem 1.35rem .8rem;
    border-bottom:1px solid rgba(201,168,76,0.1);
    display:flex; align-items:center; justify-content:space-between;
  }
  .rb-modal-title {
    font-family:'Cinzel',serif; font-size:.82rem; font-weight:600;
    letter-spacing:.08em; color:#F0E4C0;
    display:flex; align-items:center; gap:.5rem;
  }
  .rb-modal-title-dot { width:6px; height:6px; border-radius:50%; background:var(--accent); box-shadow:0 0 6px var(--accent); }
  .rb-modal-close {
    width:26px; height:26px; border-radius:6px; border:1px solid rgba(201,168,76,0.18);
    background:transparent; color:#5C4E34; cursor:pointer;
    display:flex; align-items:center; justify-content:center; transition:all .15s;
  }
  .rb-modal-close:hover { background:rgba(201,168,76,0.08); color:#C9A84C; border-color:rgba(201,168,76,0.35); }
  .rb-modal-body { padding:1.1rem 1.35rem; display:flex; flex-direction:column; gap:.75rem; }
  .rb-modal-meta {
    background:rgba(201,168,76,0.04); border:1px solid rgba(201,168,76,0.1);
    border-radius:8px; padding:.75rem 1rem;
    display:flex; flex-direction:column; gap:.45rem;
  }
  .rb-modal-meta-row {
    display:flex; align-items:center; justify-content:space-between;
    font-size:.74rem;
  }
  .rb-modal-meta-label { color:#5C4E34; font-weight:500; }
  .rb-modal-meta-value { color:#BEA878; font-weight:600; }
  .rb-modal-filename {
    background:#161616; border:1px solid rgba(201,168,76,0.16); border-radius:7px;
    padding:.55rem .85rem; display:flex; align-items:center; gap:.55rem;
  }
  .rb-modal-filename-icon { color:#C9A84C; flex-shrink:0; }
  .rb-modal-filename-text {
    font-family:'DM Sans',sans-serif; font-size:.74rem; color:#D4B86A;
    font-weight:500; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;
  }
  .rb-modal-actions { display:flex; gap:.6rem; padding:.85rem 1.35rem 1.1rem; border-top:1px solid rgba(201,168,76,0.1); }
  .rb-modal-btn-pdf {
    flex:1; padding:.62rem; border:none; border-radius:8px;
    background:linear-gradient(135deg,#8A6520,#C9A84C);
    color:#060606; font-family:'DM Sans',sans-serif;
    font-size:.8rem; font-weight:700; letter-spacing:.04em;
    cursor:pointer; display:flex; align-items:center; justify-content:center; gap:.4rem;
    transition:all .2s;
  }
  .rb-modal-btn-pdf:hover { background:linear-gradient(135deg,#C9A84C,#F5D980); box-shadow:0 4px 18px rgba(201,168,76,0.28); transform:translateY(-1px); }
  .rb-modal-btn-pdf:disabled { opacity:.38; cursor:not-allowed; transform:none; box-shadow:none; }
  .rb-modal-btn-doc {
    flex:1; padding:.62rem; border:1px solid rgba(201,168,76,0.25); border-radius:8px;
    background:transparent; color:var(--accent); font-family:'DM Sans',sans-serif;
    font-size:.8rem; font-weight:600; letter-spacing:.04em;
    cursor:pointer; display:flex; align-items:center; justify-content:center; gap:.4rem;
    transition:all .18s;
  }
  .rb-modal-btn-doc:hover { background:rgba(201,168,76,0.08); border-color:var(--accent); }
  .rb-modal-btn-doc:disabled { opacity:.38; cursor:not-allowed; }
  .rb-modal-generating {
    display:flex; flex-direction:column; align-items:center; gap:.75rem;
    padding:1.5rem 1.35rem;
  }
  .rb-modal-gen-spinner {
    width:36px; height:36px; border-radius:50%;
    border:3px solid rgba(201,168,76,0.15);
    border-top-color:#C9A84C;
    animation:spin .8s linear infinite;
  }
  .rb-modal-gen-label { font-family:'Cinzel',serif; font-size:.72rem; letter-spacing:.1em; color:#BEA878; }
  .rb-modal-gen-sub   { font-size:.68rem; color:#5C4E34; text-align:center; line-height:1.6; }

  /* ═══════════════════════════════════════════════
     DARK MODE — EtherX Black & Gold (default)
  ═══════════════════════════════════════════════ */
  .rb {
    --bg-shell:    #060606;
    --bg-header:   #0A0A0A;
    --bg-sidebar:  #0A0A0A;
    --bg-form:     #0F0F0F;
    --bg-input:    #161616;
    --bg-card:     #141414;
    --bg-preview:  #060606;
    --bg-foot:     #0A0A0A;

    --tx-primary:   #F0E4C0;
    --tx-secondary: #BEA878;
    --tx-muted:     #5C4E34;
    --tx-input:     #E0D0A8;
    --tx-ph:        #2E2616;

    --bd:           rgba(201,168,76,0.14);
    --bd-input:     rgba(201,168,76,0.18);
    --bd-focus:     #C9A84C;
    --bd-card:      rgba(201,168,76,0.12);

    --accent:       #C9A84C;
    --accent-h:     #E8C060;
    --accent-lt:    rgba(201,168,76,0.08);
    --accent-tx:    #F0E4C0;
    --accent-deep:  #A07830;

    --gold-1: #C9A84C;
    --gold-2: #E8C060;
    --gold-3: #F5D980;
    --gold-dim: #7A5C24;

    --green:    #6DBF7E;
    --green-lt: rgba(109,191,126,0.08);
    --green-bd: rgba(109,191,126,0.25);
    --red:      #D96B5A;
    --red-lt:   rgba(217,107,90,0.08);
    --red-bd:   rgba(217,107,90,0.25);

    --sh-card:   0 1px 0 rgba(201,168,76,0.07),0 4px 20px rgba(0,0,0,0.55);
    --sh-resume: 0 0 0 1px rgba(201,168,76,0.2),0 12px 60px rgba(0,0,0,0.8);
    --sh-glow:   0 0 30px rgba(201,168,76,0.08);

    --prog-track:  rgba(201,168,76,0.12);
    --lbl-color:   #7A6040;
    --req-color:   #C9A84C;

    --ni-active-bg:  rgba(201,168,76,0.09);
    --ni-active-bd:  rgba(201,168,76,0.22);
    --ni-done-num-bg:  #2A1F0A;
    --ni-done-num-bd:  rgba(201,168,76,0.4);
    --ni-done-num-tx:  #C9A84C;
    --ni-act-num-bg:  #C9A84C;
    --ni-act-num-bd:  #E8C060;
    --ni-act-num-tx:  #060606;

    --tip-bl:      #C9A84C;
    --tip-bg:      rgba(201,168,76,0.04);
    --tip-bd:      rgba(201,168,76,0.15);
    --tip-tx:      #8A7050;
    --tip-b:       #D4B86A;

    --tag-bg:    rgba(201,168,76,0.09);
    --tag-bd:    rgba(201,168,76,0.28);
    --tag-tx:    #D4B86A;
    --tag-x:     #C9A84C;

    --banner-load-bg: rgba(201,168,76,0.07); --banner-load-tx: #D4B86A; --banner-load-bd: rgba(201,168,76,0.22);
    --banner-ok-bg:   rgba(109,191,126,0.07); --banner-ok-tx:   #6DBF7E; --banner-ok-bd:   rgba(109,191,126,0.22);
    --banner-err-bg:  rgba(217,107,90,0.07);  --banner-err-tx:  #D96B5A; --banner-err-bd:  rgba(217,107,90,0.22);

    --prev-bar-bg:  #0A0A0A;
    --prev-ttl:     #4A3C28;
    --live-color:   #C9A84C;
    --live-dot:     #E8C060;

    --ep-pdf-bg:  linear-gradient(135deg,#8A6520,#C9A84C);
    --ep-pdf-tx:  #060606;
    --ep-doc-bg:  transparent;
    --ep-doc-tx:  #C9A84C;

    --overlay-bg: rgba(0,0,0,0.82);
    --sidebar-open-sh: 6px 0 40px rgba(0,0,0,0.9),1px 0 0 rgba(201,168,76,0.16);
    --tab-active: #C9A84C;
    --tab-hover-bg: rgba(201,168,76,0.06);
  }

  /* ══════════════════════════════════
     SHELL
  ══════════════════════════════════ */
  .rb {
    width:100vw; height:100vh;
    display:flex; flex-direction:column;
    overflow:hidden;
    background:var(--bg-shell);
    color:var(--tx-primary);
    transition:background .25s,color .25s;
  }

  /* ══════════════════════════════════
     HEADER — premium slim bar
  ══════════════════════════════════ */
  .rb-hdr {
    flex-shrink:0; height:52px; min-height:52px;
    background:var(--bg-header);
    border-bottom:1px solid var(--bd);
    display:flex; align-items:center;
    padding:0 1.25rem; gap:.75rem; z-index:100;
    position:relative;
  }
  /* subtle gold line along bottom */
  .rb-hdr::after {
    content:''; position:absolute; bottom:0; left:0; right:0; height:1px;
    background:linear-gradient(90deg,transparent,rgba(201,168,76,0.35) 30%,rgba(201,168,76,0.35) 70%,transparent);
  }

  .rb-hamburger {
    display:none; width:30px; height:30px;
    border:1px solid var(--bd); border-radius:6px;
    background:transparent; color:var(--tx-secondary); font-size:.95rem;
    cursor:pointer; align-items:center; justify-content:center; flex-shrink:0;
    transition:all .15s;
  }
  .rb-hamburger:hover { background:var(--accent-lt); border-color:var(--accent); color:var(--accent); }

  .rb-logomark { width:28px; height:28px; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
  .rb-logomark img { width:28px; height:28px; object-fit:contain; }

  .rb-logo {
    font-family:'Cinzel',serif; font-size:1rem; font-weight:700;
    letter-spacing:.1em; white-space:nowrap;
    background:linear-gradient(90deg,#8A6520 0%,#C9A84C 30%,#F5D980 55%,#C9A84C 75%,#8A6520 100%);
    background-size:250% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text;
    animation:shimmer 5s linear infinite;
  }
  .rb-logo-sub {
    font-family:'DM Sans',sans-serif; font-size:.52rem; font-weight:400;
    letter-spacing:.2em; text-transform:uppercase; color:var(--tx-muted);
    margin-top:1px;
  }
  .rb-logo-wrap { display:flex; flex-direction:column; line-height:1.2; }

  .rb-pipe { width:1px; height:14px; background:var(--bd); flex-shrink:0; }
  .rb-badge {
    font-size:.56rem; font-weight:700; letter-spacing:.1em; text-transform:uppercase;
    color:var(--accent); border:1px solid rgba(201,168,76,0.3); border-radius:3px;
    padding:.1rem .42rem; background:rgba(201,168,76,0.06);
  }

  .rb-hright { margin-left:auto; display:flex; align-items:center; gap:.65rem; }

  /* progress */
  .rb-prog { display:flex; align-items:center; gap:.45rem; }
  .rb-prog-lbl { font-size:.58rem; font-weight:500; color:var(--tx-muted); letter-spacing:.06em; text-transform:uppercase; }
  .rb-prog-track { width:70px; height:2px; background:var(--prog-track); border-radius:2px; overflow:hidden; }
  .rb-prog-fill  {
    height:100%; border-radius:2px; transition:width .5s cubic-bezier(.4,0,.2,1);
    background:linear-gradient(90deg,#8A6520,#C9A84C,#F5D980);
  }
  .rb-prog-pct { font-size:.62rem; font-weight:700; color:var(--accent); min-width:26px; font-variant-numeric:tabular-nums; }

  .rb-icon-btn {
    width:30px; height:30px; border:1px solid var(--bd); border-radius:6px;
    background:transparent; color:var(--tx-secondary); font-size:.82rem;
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    transition:all .15s; flex-shrink:0;
  }
  .rb-icon-btn:hover { background:var(--accent-lt); border-color:var(--accent); color:var(--accent); }

  /* back button */
  .rb-back-btn {
    display:flex; align-items:center; gap:5px;
    background:transparent; border:1px solid rgba(201,168,76,0.25);
    color:var(--tx-secondary); font-family:'DM Sans',sans-serif;
    font-size:.68rem; font-weight:600; letter-spacing:.06em;
    padding:.25rem .7rem; border-radius:6px; cursor:pointer;
    transition:all .15s; white-space:nowrap; flex-shrink:0;
  }
  .rb-back-btn:hover { background:rgba(201,168,76,0.08); border-color:var(--accent); color:var(--accent); }
  .rb-back-btn svg { width:12px; height:12px; }

  /* ══════════════════════════════════
     STATUS BANNER
  ══════════════════════════════════ */
  .rb-banner {
    flex-shrink:0; display:flex; align-items:center; gap:.65rem;
    padding:.32rem 1.25rem; font-size:.72rem; font-weight:500;
    border-bottom:1px solid; animation:slideDown .2s ease;
    letter-spacing:.01em;
  }
  .rb-banner.loading { background:var(--banner-load-bg); color:var(--banner-load-tx); border-color:var(--banner-load-bd); }
  .rb-banner.success { background:var(--banner-ok-bg);   color:var(--banner-ok-tx);   border-color:var(--banner-ok-bd); }
  .rb-banner.error   { background:var(--banner-err-bg);  color:var(--banner-err-tx);  border-color:var(--banner-err-bd); }
  .rb-spin { width:11px; height:11px; border-radius:50%; border:2px solid currentColor; border-top-color:transparent; animation:spin .7s linear infinite; flex-shrink:0; }

  /* ══════════════════════════════════
     BODY GRID
  ══════════════════════════════════ */
  .rb-body {
    flex:1; display:grid;
    grid-template-columns:200px 400px 1fr;
    overflow:hidden; min-height:0; position:relative;
  }

  /* ══════════════════════════════════
     SIDEBAR
  ══════════════════════════════════ */
  .rb-sidebar {
    background:var(--bg-sidebar);
    border-right:1px solid var(--bd);
    display:flex; flex-direction:column;
    overflow:hidden; z-index:50;
  }

  .rb-sidebar-ttl {
    padding:.9rem 1rem .5rem;
    font-family:'Cinzel',serif; font-size:.5rem; font-weight:600;
    letter-spacing:.2em; text-transform:uppercase; color:var(--tx-muted);
    display:flex; align-items:center; gap:.5rem;
  }
  .rb-sidebar-ttl::after { content:''; flex:1; height:1px; background:var(--bd); }

  .rb-nav { list-style:none; padding:.25rem .5rem; flex:1; overflow-y:auto; scrollbar-width:thin; scrollbar-color:var(--bd) transparent; }
  .rb-nav::-webkit-scrollbar { width:2px; }
  .rb-nav::-webkit-scrollbar-thumb { background:var(--bd); border-radius:2px; }

  .rb-ni {
    display:flex; align-items:center; gap:.55rem;
    padding:.46rem .62rem; border-radius:8px; cursor:pointer;
    margin-bottom:1px; transition:all .15s; user-select:none;
    border:1px solid transparent;
  }
  .rb-ni:hover  { background:var(--accent-lt); }
  .rb-ni.active { background:var(--ni-active-bg); border-color:var(--ni-active-bd); }

  .rb-ni-num {
    width:20px; height:20px; border-radius:50%;
    font-size:.58rem; font-weight:700;
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
    border:1.5px solid var(--bd-input); color:var(--tx-muted); transition:all .2s;
  }
  .rb-ni.active .rb-ni-num {
    background:var(--ni-act-num-bg); border-color:var(--ni-act-num-bd);
    color:var(--ni-act-num-tx); animation:pulse-gold 2.2s infinite;
  }
  .rb-ni.done .rb-ni-num {
    background:var(--ni-done-num-bg); border-color:var(--ni-done-num-bd);
    color:var(--ni-done-num-tx); font-size:.6rem;
  }
  .rb-ni-lbl { font-size:.74rem; font-weight:400; color:var(--tx-secondary); }
  .rb-ni.active .rb-ni-lbl { color:var(--accent-tx); font-weight:600; }
  .rb-ni.done   .rb-ni-lbl { color:var(--gold-dim); }

  /* sidebar export */
  .rb-sidebar-export {
    padding:.75rem; border-top:1px solid var(--bd);
    display:flex; flex-direction:column; gap:.45rem;
  }
  .rb-exp-label {
    font-size:.5rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase;
    color:var(--tx-muted); padding:0 .2rem .3rem;
  }
  .rb-exp-pdf {
    width:100%; padding:.52rem;
    background:linear-gradient(135deg,#8A6520,#C9A84C);
    border:none; border-radius:7px;
    color:#060606; font-family:'DM Sans',sans-serif;
    font-size:.74rem; font-weight:700; letter-spacing:.04em;
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    gap:.38rem; transition:all .2s;
  }
  .rb-exp-pdf:hover { background:linear-gradient(135deg,#C9A84C,#F5D980); box-shadow:0 4px 18px rgba(201,168,76,0.25); transform:translateY(-1px); }
  .rb-exp-pdf:disabled { opacity:.35; cursor:not-allowed; transform:none; box-shadow:none; }
  .rb-exp-doc {
    width:100%; padding:.52rem;
    background:transparent; border:1px solid rgba(201,168,76,0.25); border-radius:7px;
    color:var(--accent); font-family:'DM Sans',sans-serif;
    font-size:.74rem; font-weight:600; letter-spacing:.04em;
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    gap:.38rem; transition:all .18s;
  }
  .rb-exp-doc:hover { background:var(--accent-lt); border-color:var(--accent); }
  .rb-exp-doc:disabled { opacity:.35; cursor:not-allowed; }

  /* ══════════════════════════════════
     FORM PANEL
  ══════════════════════════════════ */
  .rb-form-wrap {
    background:var(--bg-form); border-right:1px solid var(--bd);
    display:flex; flex-direction:column; overflow:hidden;
  }
  .rb-form-top  { flex-shrink:0; padding:1.3rem 1.5rem 0; }

  /* section title — no emoji characters */
  .rb-sec-ttl {
    font-family:'Cinzel',serif; font-size:1.05rem; font-weight:600;
    letter-spacing:.05em; color:var(--tx-primary); margin-bottom:.12rem;
    display:flex; align-items:center; gap:.5rem;
  }
  .rb-sec-ttl em {
    color:var(--accent); font-style:italic;
    font-family:'Crimson Pro',serif; font-size:1.12em;
  }
  .rb-sec-ttl-icon {
    width:6px; height:6px; border-radius:50%;
    background:var(--accent); flex-shrink:0;
    box-shadow:0 0 6px var(--accent);
  }
  .rb-sec-sub { font-size:.7rem; color:var(--tx-muted); margin-bottom:1rem; letter-spacing:.01em; }
  .rb-rule { height:1px; background:linear-gradient(90deg,var(--bd),transparent); margin:0 -1.5rem; }

  .rb-form-body {
    flex:1; overflow-y:auto; padding:1.3rem 1.5rem .8rem;
    display:flex; flex-direction:column; gap:1rem;
    scrollbar-width:thin; scrollbar-color:var(--bd) transparent;
    animation:stepIn .22s ease;
  }
  .rb-form-body::-webkit-scrollbar { width:2px; }
  .rb-form-body::-webkit-scrollbar-thumb { background:var(--bd); border-radius:2px; }

  /* ── field primitives ── */
  .f { margin-bottom:.75rem; min-width:0; }
  .f:last-child { margin-bottom:0; }
  .g2 .f,.g3 .f { margin-bottom:0; }
  .g2 { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:.75rem; margin-bottom:.75rem; }
  .g3 { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:.75rem; margin-bottom:.75rem; }

  .lbl {
    display:block; font-size:.62rem; font-weight:600;
    letter-spacing:.12em; text-transform:uppercase;
    color:var(--lbl-color); margin-bottom:.38rem;
  }
  .req { color:var(--req-color); }

  .inp, .txa {
    width:100%; min-width:0;
    background:var(--bg-input);
    border:1px solid var(--bd-input); border-radius:8px;
    color:var(--tx-input); font-family:'DM Sans',sans-serif;
    font-size:.86rem; font-weight:400; padding:.6rem .88rem; min-height:44px;
    outline:none; transition:border-color .18s,box-shadow .18s; line-height:1.5;
  }
  .inp::placeholder,.txa::placeholder { color:var(--tx-ph); }
  .inp:focus,.txa:focus {
    border-color:var(--bd-focus);
    box-shadow:0 0 0 3px rgba(201,168,76,0.12);
  }
  .txa { resize:vertical; min-height:84px; }

  .ck { display:flex; align-items:center; gap:.4rem; margin-bottom:.75rem; padding:.4rem 0; }
  .ck input { accent-color:var(--accent); cursor:pointer; width:15px; height:15px; }
  .ck label  { font-size:.78rem; color:var(--tx-secondary); cursor:pointer; }

  /* tags */
  .tags {
    min-height:46px; background:var(--bg-input); border:1px solid var(--bd-input);
    border-radius:8px; padding:.42rem .65rem;
    display:flex; flex-wrap:wrap; gap:.3rem; cursor:text;
    transition:border-color .18s,box-shadow .18s;
  }
  .tags:focus-within { border-color:var(--bd-focus); box-shadow:0 0 0 3px rgba(201,168,76,0.12); }
  .tag {
    display:inline-flex; align-items:center; gap:.25rem;
    background:var(--tag-bg); border:1px solid var(--tag-bd);
    color:var(--tag-tx); font-size:.72rem; font-weight:600;
    padding:.22rem .5rem; border-radius:5px;
  }
  .tag-x { cursor:pointer; font-size:.85rem; line-height:1; color:var(--tag-x); opacity:.55; }
  .tag-x:hover { opacity:1; }
  .tag-inp {
    background:transparent; border:none; color:var(--tx-input);
    font-family:'DM Sans',sans-serif; font-size:.82rem;
    outline:none; flex:1; min-width:90px; padding:.1rem .12rem;
  }
  .tag-inp::placeholder { color:var(--tx-ph); }

  /* tip box */
  .tip {
    background:var(--tip-bg); border:1px solid var(--tip-bd);
    border-left:3px solid var(--tip-bl);
    border-radius:0 8px 8px 0; padding:.62rem .88rem;
    font-size:.72rem; color:var(--tip-tx); line-height:1.6; margin-bottom:.8rem;
  }
  .tip b { color:var(--tip-b); }

  /* card */
  .card {
    background:var(--bg-card); border:1px solid var(--bd-card);
    border-radius:12px; padding:1.25rem; margin-bottom:1rem;
    position:relative; box-shadow:var(--sh-card);
    transition:border-color .2s;
  }
  .card:hover { border-color:rgba(201,168,76,0.3); }
  .card-badge {
    position:absolute; top:-1px; left:.75rem;
    font-family:'Cinzel',serif; font-size:.5rem; font-weight:700;
    letter-spacing:.1em; text-transform:uppercase;
    background:var(--accent); color:#060606;
    padding:.04rem .4rem; border-radius:0 0 5px 5px; line-height:1.7;
  }
  .card-del {
    position:absolute; top:.62rem; right:.62rem; min-height:30px;
    background:transparent; border:1px solid var(--bd); border-radius:6px;
    color:var(--tx-muted); font-size:.7rem; font-weight:500;
    padding:.2rem .52rem; cursor:pointer; font-family:'DM Sans',sans-serif;
    transition:all .15s; white-space:nowrap;
  }
  .card-del:hover { color:var(--red); border-color:var(--red); background:var(--red-lt); }
  .card-body { display:flex; flex-direction:column; padding-top:.55rem; }

  .add-btn {
    width:100%; min-height:46px; padding:.5rem;
    background:transparent; border:1.5px dashed rgba(201,168,76,0.28); border-radius:9px;
    color:var(--tx-muted); font-family:'DM Sans',sans-serif; font-size:.78rem; font-weight:500;
    cursor:pointer; transition:all .2s;
    display:flex; align-items:center; justify-content:center; gap:.4rem;
  }
  .add-btn:hover { border-color:var(--accent); color:var(--accent); background:var(--accent-lt); }

  /* ── AI enhancer components ── */
  .ai-field { position:relative; }
  .ai-field .inp, .ai-field .txa { padding-right:5.5rem; }

  .ai-btn {
    position:absolute; top:.38rem; right:.38rem;
    padding:.2rem .5rem;
    background:linear-gradient(135deg,#8A6520,#C9A84C);
    border:none; border-radius:5px;
    color:#060606; font-size:.58rem; font-weight:700;
    letter-spacing:.04em; cursor:pointer;
    display:flex; align-items:center; gap:.22rem;
    transition:all .15s; white-space:nowrap; z-index:2;
  }
  .ai-btn:hover { background:linear-gradient(135deg,#C9A84C,#F5D980); }
  .ai-btn:disabled { opacity:.3; cursor:not-allowed; }
  .ai-btn-spin {
    width:8px; height:8px; border-radius:50%;
    border:1.5px solid rgba(0,0,0,0.25); border-top-color:#060606;
    animation:spin .7s linear infinite;
  }

  .ai-suggestion-box {
    margin-top:.3rem;
    background:var(--bg-card);
    border:1px solid rgba(201,168,76,0.2);
    border-left:3px solid var(--accent);
    border-radius:0 8px 8px 0;
    padding:.55rem .7rem;
    animation:slideDown .18s ease;
  }
  .ai-sugg-label {
    font-size:.52rem; font-weight:700; letter-spacing:.12em;
    text-transform:uppercase; color:var(--accent); margin-bottom:.3rem;
  }
  .ai-sugg-text {
    font-size:.74rem; color:var(--tx-secondary);
    line-height:1.62; white-space:pre-wrap; margin-bottom:.4rem;
  }
  .ai-sugg-actions { display:flex; gap:.35rem; }
  .ai-accept {
    padding:.22rem .55rem;
    background:linear-gradient(135deg,#8A6520,#C9A84C);
    border:none; border-radius:5px;
    color:#060606; font-size:.62rem; font-weight:700;
    cursor:pointer; transition:opacity .15s;
  }
  .ai-accept:hover { opacity:.85; }
  .ai-dismiss {
    padding:.22rem .55rem; background:transparent;
    border:1px solid var(--bd); border-radius:5px;
    color:var(--tx-muted); font-size:.62rem; font-weight:600;
    cursor:pointer; transition:all .15s;
  }
  .ai-dismiss:hover { border-color:var(--tx-muted); color:var(--tx-primary); }
  .ai-auto-badge {
    font-size:.54rem; color:var(--tx-muted);
    text-align:right; margin-top:.14rem; letter-spacing:.04em;
    animation:glow 1.5s infinite;
  }

  /* ── form footer ── */
  .rb-form-foot {
    flex-shrink:0; padding:1rem 1.5rem; border-top:1px solid var(--bd);
    background:var(--bg-foot); display:flex; gap:.6rem;
  }
  .btn-back {
    padding:.5rem .9rem; background:transparent; min-height:44px;
    border:1px solid var(--bd); border-radius:8px;
    color:var(--tx-secondary); font-family:'DM Sans',sans-serif;
    font-size:.84rem; font-weight:600; cursor:pointer; transition:all .15s;
  }
  .btn-back:hover { border-color:var(--accent); color:var(--accent); background:var(--accent-lt); }
  .btn-next {
    flex:1; padding:.5rem; min-height:44px;
    background:linear-gradient(135deg,#8A6520,#C9A84C);
    border:none; border-radius:8px;
    color:#060606; font-family:'DM Sans',sans-serif;
    font-size:.84rem; font-weight:700; cursor:pointer; transition:all .2s;
    letter-spacing:.03em;
  }
  .btn-next:hover { background:linear-gradient(135deg,#C9A84C,#F5D980); box-shadow:0 4px 20px rgba(201,168,76,0.2); transform:translateY(-1px); }
  .btn-next:active { transform:none; }
  .btn-pdf {
    flex:1; padding:.5rem; min-height:44px;
    background:linear-gradient(135deg,#8A6520,#C9A84C);
    border:none; border-radius:8px;
    color:#060606; font-family:'DM Sans',sans-serif;
    font-size:.84rem; font-weight:700; cursor:pointer; transition:all .2s;
    letter-spacing:.03em;
  }
  .btn-pdf:hover { background:linear-gradient(135deg,#C9A84C,#F5D980); box-shadow:0 4px 20px rgba(201,168,76,0.2); transform:translateY(-1px); }
  .btn-pdf:disabled { opacity:.38; cursor:not-allowed; transform:none; box-shadow:none; }

  /* ══════════════════════════════════
     PREVIEW PANEL
  ══════════════════════════════════ */
  .rb-preview {
    background:radial-gradient(ellipse at 50% 0%, rgba(201,168,76,0.04) 0%, transparent 65%) #060606;
    display:flex; flex-direction:column; overflow:hidden;
  }
  .rb-prev-bar {
    flex-shrink:0; background:var(--prev-bar-bg);
    border-bottom:1px solid var(--bd);
    padding:.5rem 1.1rem; display:flex; align-items:center; gap:.65rem;
  }
  .rb-prev-ttl {
    font-family:'Cinzel',serif; font-size:.55rem; font-weight:600;
    letter-spacing:.15em; text-transform:uppercase; color:var(--prev-ttl);
  }
  .rb-live {
    display:inline-flex; align-items:center; gap:.22rem;
    font-size:.58rem; font-weight:700; color:var(--live-color);
    letter-spacing:.08em; text-transform:uppercase;
  }
  .rb-live-dot {
    width:5px; height:5px; background:var(--live-dot); border-radius:50%;
    animation:blink 1.8s infinite; box-shadow:0 0 5px var(--live-dot);
  }
  .rb-exp-grp { margin-left:auto; display:flex; gap:.38rem; }
  .exp-btn {
    padding:.28rem .7rem; border-radius:6px;
    font-family:'DM Sans',sans-serif; font-size:.66rem; font-weight:700;
    cursor:pointer; transition:all .16s;
    display:flex; align-items:center; gap:.22rem; letter-spacing:.03em;
  }
  .exp-btn:hover { transform:translateY(-1px); }
  .exp-btn:disabled { opacity:.3; cursor:not-allowed; transform:none; }
  .ep-pdf { background:var(--ep-pdf-bg); color:var(--ep-pdf-tx); border:none; }
  .ep-pdf:hover { box-shadow:0 3px 12px rgba(201,168,76,0.3); }
  .ep-doc { background:var(--ep-doc-bg); color:var(--ep-doc-tx); border:1px solid rgba(201,168,76,0.25); }
  .ep-doc:hover { border-color:var(--accent); background:var(--accent-lt); }

  .rb-prev-scroll {
    flex:1; overflow-y:auto; padding:1.5rem;
    display:flex; justify-content:center;
    scrollbar-width:thin; scrollbar-color:var(--bd) transparent;
  }
  .rb-prev-scroll::-webkit-scrollbar { width:3px; }
  .rb-prev-scroll::-webkit-scrollbar-thumb { background:var(--bd); border-radius:3px; }

  /* ══════════════════════════════════
     RESUME DOCUMENT (white — ATS safe)
  ══════════════════════════════════ */
  .rv {
    width:100%; max-width:620px; background:#ffffff; color:#1a1a1a;
    padding:2.2rem 2.5rem; min-height:800px; align-self:flex-start;
    font-family:'Crimson Pro',Georgia,serif; font-size:.88rem; line-height:1.65;
    box-shadow:var(--sh-resume);
  }
  .rv-name {
    font-family:'Cinzel',serif; font-size:1.8rem; font-weight:700;
    color:#0A0A0A; letter-spacing:.06em; line-height:1.15;
    text-align:center; margin-bottom:.2rem;
  }
  .rv-job {
    font-family:'DM Sans',sans-serif; font-size:.72rem; font-weight:500;
    letter-spacing:.22em; text-transform:uppercase;
    color:#8A7050; text-align:center; margin-bottom:.5rem;
  }
  .rv-contacts {
    margin-top:.3rem; display:flex; flex-wrap:wrap;
    justify-content:center; gap:.1rem .45rem;
  }
  .rv-c {
    display:inline-flex; align-items:center;
    font-family:'DM Sans',sans-serif; font-size:.66rem;
    color:#5A5A5A; text-decoration:none;
  }
  .rv-c:not(:last-child)::after { content:'·'; margin:0 .38rem; color:#D0C8B8; }
  .rv-hr {
    height:1.5px; margin:.9rem 0 1rem; border:none; border-radius:2px;
    background:linear-gradient(90deg,transparent,#C9A84C 20%,#C9A84C 80%,transparent);
    opacity:.6;
  }
  .rv-sec { margin-bottom:1.1rem; }
  .rv-sh {
    font-family:'DM Sans',sans-serif; font-size:.58rem; font-weight:700;
    letter-spacing:.2em; text-transform:uppercase; color:#2A1F0A;
    padding-bottom:.22rem; margin-bottom:.55rem;
    border-bottom:1.5px solid #E8D9B0;
    display:flex; align-items:center; gap:.5rem;
  }
  .rv-sh::before { content:''; width:14px; height:1.5px; background:#C9A84C; flex-shrink:0; }
  .rv-summary { font-size:.85rem; color:#2A2A2A; line-height:1.78; margin:0; }
  .rv-entry { margin-bottom:.88rem; }
  .rv-erow { display:flex; justify-content:space-between; align-items:flex-start; gap:.5rem; margin-bottom:.15rem; }
  .rv-etitle { font-family:'DM Sans',sans-serif; font-size:.82rem; font-weight:700; color:#0A0A0A; letter-spacing:.01em; }
  .rv-eorg   { font-family:'DM Sans',sans-serif; font-size:.74rem; color:#A07830; font-weight:500; margin-top:.04rem; }
  .rv-edate  { font-family:'DM Sans',sans-serif; font-size:.64rem; color:#999; white-space:nowrap; padding-top:.06rem; flex-shrink:0; }
  .rv-esub   { font-family:'DM Sans',sans-serif; font-size:.7rem; color:#6A6A6A; font-style:italic; margin-top:.04rem; }
  .rv-bul { list-style:none; padding:0; margin-top:.3rem; display:flex; flex-direction:column; gap:.1rem; }
  .rv-bul li {
    font-size:.82rem; color:#2A2A2A; line-height:1.65;
    padding-left:.95rem; position:relative;
  }
  .rv-bul li::before { content:'▸'; position:absolute; left:0; color:#C9A84C; font-size:.52rem; top:.22rem; }
  .rv-skills { display:flex; flex-wrap:wrap; gap:.3rem; }
  .rv-sk {
    font-family:'DM Sans',sans-serif; font-size:.68rem; font-weight:500;
    background:#FBF7EE; color:#3A2A0A;
    border:1px solid #E8D9B0; border-radius:4px; padding:.18rem .55rem;
  }
  .rv-cert { display:flex; justify-content:space-between; align-items:flex-start; padding:.32rem 0; border-bottom:1px solid #F5F0E8; }
  .rv-cert:last-child { border:none; }
  .rv-cname { font-family:'DM Sans',sans-serif; font-size:.78rem; font-weight:700; color:#0A0A0A; }
  .rv-corg  { font-family:'DM Sans',sans-serif; font-size:.7rem; color:#6A6A6A; margin-top:.04rem; }
  .rv-cdate { font-family:'DM Sans',sans-serif; font-size:.64rem; color:#999; flex-shrink:0; }
  .rv-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:480px; gap:.6rem; text-align:center; }
  .rv-empty-ico { font-size:2.2rem; opacity:.4; }
  .rv-empty h3 { font-family:'Cinzel',serif; font-size:.88rem; font-weight:600; color:#999; letter-spacing:.08em; }
  .rv-empty p  { font-size:.73rem; color:#BBB; max-width:200px; line-height:1.65; }

  /* ══════════════════════════════════
     MOBILE TAB BAR
  ══════════════════════════════════ */
  .rb-tabbar { display:none; }

  /* ══════════════════════════════════
     RESPONSIVE
  ══════════════════════════════════ */
  @media (max-width:960px) {
    .rb-hamburger { display:flex; }
    .rb-badge, .rb-pipe { display:none; }
    .rb-prog-lbl { display:none; }
    .rb-body { grid-template-columns:1fr; grid-template-rows:1fr auto; position:relative; }
    .rb-sidebar { position:absolute; top:0; left:0; width:220px; height:100%; transform:translateX(-100%); transition:transform .25s ease,box-shadow .25s; z-index:200; }
    .rb-sidebar.open { transform:translateX(0); box-shadow:var(--sidebar-open-sh); }
    .rb-overlay { display:block; position:absolute; inset:0; background:var(--overlay-bg); z-index:199; animation:fadeIn .2s; }
    .rb-form-wrap { grid-column:1; grid-row:1; border-right:none; }
    .rb-preview { grid-column:1; grid-row:2; height:300px; min-height:300px; border-top:1px solid var(--bd); }
    .rv { box-shadow:none; padding:1.4rem; min-height:unset; }
  }
  @media (max-width:640px) { .g2, .g3 { grid-template-columns:1fr; } }
  @media (max-width:600px) {
    .rb-hdr { padding:0 .75rem; gap:.45rem; height:48px; min-height:48px; }
    .rb-logo { font-size:.92rem; }
    .rb-prog-track { width:44px; }
    .rb-prog-pct { display:none; }
    .rb-body { display:flex; flex-direction:column; }
    .rb-form-wrap { flex:1; min-height:0; border-bottom:none; }
    .rb-preview { display:none; }
    .rb-preview.mob-show { display:flex; position:fixed; inset:48px 0 56px 0; z-index:300; }
    .rb-tabbar {
      display:flex; flex-shrink:0; height:56px;
      background:var(--bg-header); border-top:1px solid var(--bd); z-index:150;
    }
    .rb-tab {
      flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center;
      gap:.15rem; border:none; background:transparent; cursor:pointer;
      color:var(--tx-muted); font-family:'DM Sans',sans-serif; transition:all .15s;
    }
    .rb-tab:hover { background:var(--tab-hover-bg); }
    .rb-tab.active { color:var(--tab-active); }
    .rb-tab-ico { font-size:1rem; line-height:1; }
    .rb-tab-lbl { font-size:.52rem; font-weight:600; letter-spacing:.06em; text-transform:uppercase; }
    .rb-form-top { padding:.85rem 1rem 0; }
    .rb-rule { margin:0 -1rem; }
    .rb-form-body { padding:.9rem 1rem .65rem; }
    .rb-form-foot { padding:.65rem 1rem; }
    .rv { padding:1.2rem 1.4rem; }
  }
  @media (max-width:480px) {
    .rb { font-size:110%; }
    .ck label { font-size:.85rem; }
  }
  @media (max-width:380px) {
    .rb-logo { font-size:.82rem; }
    .rb-prog { display:none; }
  }
`;

/* ─── Logo ──────────────────────────────────────── */
const LogoMark = () => (
  <img
    src="/logo_dark.jpg"
    alt="EtherX"
    style={{ width:"30px", height:"30px", objectFit:"contain" }}
  />
);

/* ─── Data init ─────────────────────────────────── */
const INIT = {
  personal: { name:"", title:"", email:"", phone:"", location:"", linkedin:"", github:"", website:"" },
  summary: { text:"" },
  experience: [], education: [], skills: [], projects: [], certifications: [],
};
const uid = () => String(Date.now()) + String(Math.random()).slice(2,7);
const newExp  = () => ({ id:uid(), company:"", role:"", start:"", end:"", current:false, bullets:"" });
const newEdu  = () => ({ id:uid(), institution:"", degree:"", field:"", start:"", end:"", gpa:"" });
const newProj = () => ({ id:uid(), name:"", tech:"", url:"", bullets:"" });
const newCert = () => ({ id:uid(), name:"", issuer:"", date:"" });

const STEPS = [
  { key:"personal",       label:"Personal Info"   },
  { key:"summary",        label:"Summary"         },
  { key:"experience",     label:"Experience"      },
  { key:"education",      label:"Education"       },
  { key:"skills",         label:"Skills"          },
  { key:"projects",       label:"Projects"        },
  { key:"certifications", label:"Certifications"  },
];
const SUBS = [
  "Name, contact details & links",
  "Brief professional overview",
  "Roles, companies & achievements",
  "Degrees & institutions",
  "Technical & soft skills",
  "Personal or professional projects",
  "Licenses & credentials",
];
/* Step icons — SVG-based, no emoji */
const StepIcon = ({ i }) => {
  const icons = [
    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>,
    <path d="M4 4h16v2H4zm0 6h16v2H4zm0 6h10v2H4z"/>,
    <path d="M20 6H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5 9H7v-2h8v2zm3-4H7V9h11v2z"/>,
    <path d="M12 3L1 9l11 6 9-4.9V17h2V9L12 3zm-1 12.99L5 13l6 3.49 6-3.49-6 3.49z"/>,
    <path d="M9 11.24V7.5C9 6.12 10.12 5 11.5 5S14 6.12 14 7.5v3.74c1.21-.81 2-2.18 2-3.74C16 5.01 13.99 3 11.5 3S7 5.01 7 7.5c0 1.56.79 2.93 2 3.74zm9.84 4.63l-4.54-2.26c-.17-.07-.35-.11-.54-.11H13v-6c0-.83-.67-1.5-1.5-1.5S10 6.67 10 7.5v10.74l-3.43-.72c-.08-.01-.15-.03-.24-.03-.31 0-.59.13-.79.33l-.79.8 4.94 4.94c.27.27.65.44 1.06.44h6.79c.75 0 1.33-.55 1.44-1.28l.75-5.27c.01-.07.02-.14.02-.2 0-.62-.38-1.16-.91-1.38z"/>,
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/>,
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 14l-3-3 1.41-1.41L11 12.17l4.59-4.58L17 9l-6 6z"/>,
  ];
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" style={{width:"12px",height:"12px",opacity:.7}}>
      {icons[i]}
    </svg>
  );
};

const parseBullets = t => (t||"").split("\n").map(l=>l.trim().replace(/^[-•▸◆*]\s*/,"")).filter(Boolean);
const fmtM = m => {
  if (!m) return "";
  const [dd,mo,yyyy] = m.split("-");
  const mon = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"][+mo-1];
  return mon ? `${dd} ${mon} ${yyyy}` : m;
};

/* ─── Collapsible Card ──────────────────────────── */
function CollapsibleCard({ badge, title, sub, onRemove, children, defaultOpen=true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="card" style={{paddingTop:"1.55rem"}}>
      <div className="card-badge">{badge}</div>
      <div className="card-header" onClick={()=>setOpen(o=>!o)}>
        <span className="card-header-title">{title||"Untitled"}</span>
        {sub && <span className="card-header-sub">{sub}</span>}
        <button className="card-del" onClick={e=>{e.stopPropagation();onRemove();}}>Remove</button>
        <button className={`card-collapse-btn${open?" open":""}`} onClick={e=>{e.stopPropagation();setOpen(o=>!o);}}>
          <svg viewBox="0 0 12 12" fill="none" width="10" height="10">
            <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <div className={`card-collapsible${open?" open":" closed"}`}>
        <div className="card-body">{children}</div>
      </div>
    </div>
  );
}

/* ─── Tag Input ─────────────────────────────────── */
function TagInput({ value, onChange }) {
  const [v, setV] = useState("");
  const add = () => { const t=v.trim(); if(t && !value.includes(t)) onChange([...value,t]); setV(""); };
  return (
    <div className="tags" onClick={e=>e.currentTarget.querySelector("input").focus()}>
      {value.map(t=>(
        <span key={t} className="tag">{t}
          <span className="tag-x" onClick={()=>onChange(value.filter(x=>x!==t))}>×</span>
        </span>
      ))}
      <input className="tag-inp" value={v}
        placeholder={value.length===0 ? "Type a skill, press Enter" : "+ add more"}
        onChange={e=>setV(e.target.value)}
        onKeyDown={e=>{if(e.key==="Enter"||e.key===","){e.preventDefault();add();}}}
        onBlur={add}
      />
    </div>
  );
}

/* ─── AI Field ──────────────────────────────────── */
function AiField({ label, value, onChange, placeholder, type="text", enhanceFn, required, validate }) {
  const [loading, setLoading] = useState(false);
  const [sugg, setSugg] = useState("");
  const [isValid, setIsValid] = useState(false);
  const timerRef = useRef(null);

  const handleChange = e => {
    const v = e.target.value; onChange(v); setSugg("");
    if (validate) setIsValid(validate(v));
    clearTimeout(timerRef.current);
    if (v.trim().length > 10) timerRef.current = setTimeout(()=>triggerEnhance(v), 2500);
  };
  const triggerEnhance = async v => {
    setLoading(true);
    try { setSugg(await enhanceFn(v)); } catch {}
    finally { setLoading(false); }
  };
  useEffect(()=>()=>clearTimeout(timerRef.current), []);

  const showCheck = validate && isValid;
  return (
    <div className="f">
      {label && <label className="lbl">{label}{required && <span className="req"> *</span>}</label>}
      <div className={`ai-field${showCheck?" field-valid-wrap":""}`}>
        <input className="inp" type={type} placeholder={placeholder} value={value} onChange={handleChange}
          style={showCheck?{paddingRight:"5.5rem"}:{}}
        />
        {showCheck && (
          <div className="field-valid-icon show">
            <svg viewBox="0 0 10 10" fill="none" width="8" height="8">
              <path d="M2 5l2 2 4-4" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
        <button className="ai-btn" disabled={loading||!value.trim()} onClick={()=>triggerEnhance(value)} title="Enhance with AI">
          {loading ? <span className="ai-btn-spin"/> : "✦ AI"}
        </button>
      </div>
      {sugg && (
        <div className="ai-suggestion-box">
          <div className="ai-sugg-label">✦ AI Suggestion</div>
          <div className="ai-sugg-text">{sugg}</div>
          <div className="ai-sugg-actions">
            <button className="ai-accept" onClick={()=>{onChange(sugg);setSugg("");}}>✓ Apply</button>
            <button className="ai-dismiss" onClick={()=>setSugg("")}>✕ Dismiss</button>
          </div>
        </div>
      )}
      {loading && <div className="ai-auto-badge">✦ AI thinking…</div>}
    </div>
  );
}

/* ─── AI TextArea ───────────────────────────────── */
function AiTextArea({ label, value, onChange, placeholder, rows=4, enhanceFn, maxChars }) {
  const [loading, setLoading] = useState(false);
  const [sugg, setSugg] = useState("");
  const timerRef = useRef(null);

  const handleChange = e => {
    const v = e.target.value; onChange(v); setSugg("");
    clearTimeout(timerRef.current);
    if (v.trim().length > 20) timerRef.current = setTimeout(()=>triggerEnhance(v), 2500);
  };
  const triggerEnhance = async v => {
    setLoading(true);
    try { setSugg(await enhanceFn(v)); } catch {}
    finally { setLoading(false); }
  };
  useEffect(()=>()=>clearTimeout(timerRef.current), []);

  const len = value.length;
  const charClass = maxChars ? (len > maxChars ? "over" : len > maxChars * 0.85 ? "warn" : "") : "";

  return (
    <div className="f">
      {label && <label className="lbl">{label}</label>}
      <div className="ai-field">
        <textarea className="txa" rows={rows} style={{paddingRight:"5.5rem"}}
          placeholder={placeholder} value={value} onChange={handleChange}
        />
        <button className="ai-btn" disabled={loading||!value.trim()} onClick={()=>triggerEnhance(value)} title="Enhance with AI">
          {loading ? <span className="ai-btn-spin"/> : "✦ AI"}
        </button>
      </div>
      {maxChars && (
        <div className="char-counter-wrap">
          <span className={`char-counter${charClass?" "+charClass:""}`}>{len} / {maxChars}</span>
        </div>
      )}
      {sugg && (
        <div className="ai-suggestion-box">
          <div className="ai-sugg-label">✦ AI Suggestion</div>
          <div className="ai-sugg-text">{sugg}</div>
          <div className="ai-sugg-actions">
            <button className="ai-accept" onClick={()=>{onChange(sugg);setSugg("");}}>✓ Apply</button>
            <button className="ai-dismiss" onClick={()=>setSugg("")}>✕ Dismiss</button>
          </div>
        </div>
      )}
      {loading && <div className="ai-auto-badge">✦ AI thinking…</div>}
    </div>
  );
}

/* ─── Month/Year Picker ─────────────────────────── */
const MONTHS = [
  {v:"01",l:"Jan",d:31},{v:"02",l:"Feb",d:28},{v:"03",l:"Mar",d:31},
  {v:"04",l:"Apr",d:30},{v:"05",l:"May",d:31},{v:"06",l:"Jun",d:30},
  {v:"07",l:"Jul",d:31},{v:"08",l:"Aug",d:31},{v:"09",l:"Sep",d:30},
  {v:"10",l:"Oct",d:31},{v:"11",l:"Nov",d:30},{v:"12",l:"Dec",d:31},
];
const YEARS = Array.from({length:new Date().getFullYear()-1999},(_,i)=>String(new Date().getFullYear()-i));

function MonthYearPicker({ value, onChange, disabled=false }) {
  const parts = value ? value.split("-") : ["","",""];
  const [dd, setDd] = useState(parts[0]||"");
  const [mm, setMm] = useState(parts[1]||"");
  const [yyyy, setYyyy] = useState(parts[2]||"");

  const daysInMonth = (month,year) => {
    if(!month) return 31;
    const found = MONTHS.find(m=>m.v===month);
    if(!found) return 31;
    if(month==="02"&&year){const y=parseInt(year);return(y%4===0&&(y%100!==0||y%400===0))?29:28;}
    return found.d;
  };
  const days = Array.from({length:daysInMonth(mm,yyyy)},(_,i)=>String(i+1).padStart(2,"0"));
  const emit = (ndd,nmm,nyyyy) => { if(ndd&&nmm&&nyyyy) onChange(`${ndd}-${nmm}-${nyyyy}`); };

  const sel = w => ({
    width:w, background:"var(--bg-input)", border:"1px solid var(--bd-input)", borderRadius:"6px",
    color:"var(--tx-input)", fontSize:".7rem", padding:".3rem .25rem",
    fontFamily:"DM Sans,sans-serif", cursor:disabled?"not-allowed":"pointer",
    opacity:disabled?.35:1, outline:"none", appearance:"auto",
  });

  return (
    <div style={{display:"flex",gap:".3rem",alignItems:"center"}}>
      <select style={sel("54px")} value={dd} disabled={disabled} onChange={e=>{setDd(e.target.value);emit(e.target.value,mm,yyyy);}}>
        <option value="">DD</option>{days.map(d=><option key={d} value={d}>{d}</option>)}
      </select>
      <select style={sel("60px")} value={mm} disabled={disabled} onChange={e=>{const nm=e.target.value;const mx=daysInMonth(nm,yyyy);const sd=dd&&parseInt(dd)>mx?"":dd;if(sd!==dd)setDd(sd);setMm(nm);emit(sd,nm,yyyy);}}>
        <option value="">MM</option>{MONTHS.map(m=><option key={m.v} value={m.v}>{m.l}</option>)}
      </select>
      <select style={sel("70px")} value={yyyy} disabled={disabled} onChange={e=>{setYyyy(e.target.value);emit(dd,mm,e.target.value);}}>
        <option value="">YYYY</option>{YEARS.map(y=><option key={y} value={y}>{y}</option>)}
      </select>
    </div>
  );
}

/* ─── Form Sections ─────────────────────────────── */
function PersonalForm({ d, set }) {
  const f = k => v => set({...d,[k]:v});
  return (<>
    <div className="g2">
      <AiField label="Full Name" required value={d.name} onChange={f("name")} placeholder="e.g. Priya Sharma" enhanceFn={v=>ENHANCERS.name(v)}
        validate={v=>v.trim().length>1}
      />
      <AiField label="Job Title" value={d.title} onChange={f("title")} placeholder="e.g. Full Stack Developer" enhanceFn={v=>ENHANCERS.title(v)} />
    </div>
    <AiField label="Email" required value={d.email} onChange={f("email")} placeholder="you@gmail.com" type="email"
      enhanceFn={v=>Promise.resolve(v)}
      validate={v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)&&!/^[^@]+@(test|dummy|fake|example|mail|abc|xyz|temp)\./i.test(v)}
    />
    <AiField label="Phone" value={d.phone} onChange={v=>set({...d,phone:v.replace(/[^\d\s\+\-]/g,"")})} placeholder="+91 98765 43210"
      enhanceFn={v=>Promise.resolve(v)}
      validate={v=>v.replace(/\D/g,"").length>=10}
    />
    <AiField label="Location" value={d.location} onChange={f("location")} placeholder="Bengaluru, Karnataka" enhanceFn={v=>ENHANCERS.location(v)} />
    <div className="g2">
      <AiField label="LinkedIn" value={d.linkedin} onChange={f("linkedin")} placeholder="linkedin.com/in/username" enhanceFn={v=>ENHANCERS.linkedin(v)} />
      <AiField label="GitHub"   value={d.github}   onChange={f("github")}   placeholder="github.com/username"   enhanceFn={v=>ENHANCERS.github(v)} />
    </div>
    <div className="f">
      <label className="lbl">Portfolio / Website</label>
      <input className="inp" placeholder="yoursite.dev" value={d.website} onChange={e=>set({...d,website:e.target.value})} />
    </div>
  </>);
}

function SummaryForm({ d, set, personalData }) {
  return (<>
    <div className="tip"><b>Tip —</b> Write a rough summary. AI will refine it automatically after you stop typing.</div>
    <AiTextArea
      label="Professional Summary"
      value={d.text} onChange={v=>set({text:v})} rows={7}
      placeholder="e.g. Full-stack developer with 2 years in React and Node.js..."
      enhanceFn={v=>ENHANCERS.summary(v, personalData)}
      maxChars={600}
    />
  </>);
}

function ExperienceForm({ d, set }) {
  const upd = (id,k,v) => set(d.map(e=>e.id===id?{...e,[k]:v}:e));
  if (!d.length) return (
    <>
      <div className="empty-state">
        <div className="empty-state-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" style={{color:"var(--accent)"}}>
            <path d="M20 6H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-5 9H7v-2h8v2zm3-4H7V9h11v2z"/>
          </svg>
        </div>
        <h4>No experience added yet</h4>
        <p>Add internships, part-time roles, or full-time positions.</p>
      </div>
      <button className="add-btn" onClick={()=>set([...d,newExp()])}>＋ Add Experience</button>
    </>
  );
  return (<>
    <div className="tip"><b>Tip —</b> AI auto-suggests stronger bullet points as you type. Click a card header to collapse it.</div>
    {d.map((e,i)=>(
      <CollapsibleCard key={e.id} badge={`#${i+1}`}
        title={e.role||e.company||"New Experience"}
        sub={e.company&&e.role ? e.company : null}
        onRemove={()=>set(d.filter(x=>x.id!==e.id))}
        defaultOpen={i===d.length-1}
      >
        <div className="g2">
          <AiField label="Company" value={e.company} onChange={v=>upd(e.id,"company",v)} placeholder="e.g. Infosys" enhanceFn={v=>ENHANCERS.company(v)} />
          <AiField label="Role / Title" value={e.role} onChange={v=>upd(e.id,"role",v)} placeholder="e.g. Backend Developer" enhanceFn={v=>ENHANCERS.role(v,{company:e.company})} />
        </div>
        <div className="g2">
          <div className="f"><label className="lbl">Start Date</label><MonthYearPicker value={e.start} onChange={v=>upd(e.id,"start",v)} /></div>
          <div className="f"><label className="lbl">End Date</label><MonthYearPicker value={e.end} onChange={v=>upd(e.id,"end",v)} disabled={e.current} /></div>
        </div>
        <div className="ck">
          <input type="checkbox" id={`cur-${e.id}`} checked={e.current} onChange={x=>upd(e.id,"current",x.target.checked)} />
          <label htmlFor={`cur-${e.id}`}>Currently working here</label>
        </div>
        <AiTextArea label="Responsibilities & Achievements" value={e.bullets} onChange={v=>upd(e.id,"bullets",v)} rows={4}
          placeholder={"- Built REST APIs in Node.js\n- Led a team of 4 developers\n- Reduced page load time by 40%"}
          enhanceFn={v=>ENHANCERS.bullets(v,{role:e.role,company:e.company})}
        />
      </CollapsibleCard>
    ))}
    <button className="add-btn" onClick={()=>set([...d,newExp()])}>＋ Add Experience</button>
  </>);
}

function EducationForm({ d, set }) {
  const upd = (id,k,v) => set(d.map(e=>e.id===id?{...e,[k]:v}:e));
  if (!d.length) return (
    <>
      <div className="empty-state">
        <div className="empty-state-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" style={{color:"var(--accent)"}}>
            <path d="M12 3L1 9l11 6 9-4.9V17h2V9L12 3zm-1 12.99L5 13l6 3.49 6-3.49-6 3.49z"/>
          </svg>
        </div>
        <h4>No education added yet</h4>
        <p>Add your degrees, diplomas, or academic qualifications.</p>
      </div>
      <button className="add-btn" onClick={()=>set([...d,newEdu()])}>＋ Add Education</button>
    </>
  );
  return (<>
    {d.map((e,i)=>(
      <CollapsibleCard key={e.id} badge={`#${i+1}`}
        title={e.degree ? `${e.degree}${e.field?` in ${e.field}`:""}` : (e.institution||"New Education")}
        sub={e.institution||null}
        onRemove={()=>set(d.filter(x=>x.id!==e.id))}
        defaultOpen={i===d.length-1}
      >
        <AiField label="Institution" value={e.institution} onChange={v=>upd(e.id,"institution",v)} placeholder="e.g. VTU / BITS Pilani" enhanceFn={v=>ENHANCERS.institution(v)} />
        <div className="g2">
          <AiField label="Degree" value={e.degree} onChange={v=>upd(e.id,"degree",v)} placeholder="B.E. / B.Tech / MCA" enhanceFn={v=>ENHANCERS.degree(v)} />
          <AiField label="Field of Study" value={e.field} onChange={v=>upd(e.id,"field",v)} placeholder="Computer Science" enhanceFn={v=>ENHANCERS.field(v)} />
        </div>
        <div className="g3">
          <div className="f"><label className="lbl">Start Year</label><input className="inp" placeholder="2020" value={e.start} onChange={x=>upd(e.id,"start",x.target.value)} /></div>
          <div className="f"><label className="lbl">End Year</label><input className="inp" placeholder="2024" value={e.end} onChange={x=>upd(e.id,"end",x.target.value)} /></div>
          <div className="f"><label className="lbl">CGPA / %</label><input className="inp" placeholder="8.5 / 85%" value={e.gpa} onChange={x=>upd(e.id,"gpa",x.target.value)} /></div>
        </div>
      </CollapsibleCard>
    ))}
    <button className="add-btn" onClick={()=>set([...d,newEdu()])}>＋ Add Education</button>
  </>);
}

function SkillsForm({ d, set, personalData }) {
  const [loading, setLoading] = useState(false);
  const [sugg, setSugg] = useState([]);
  const enhance = async () => {
    if(!d.length) return; setLoading(true);
    try { const res=await ENHANCERS.skills(d,personalData); setSugg(res.split(",").map(s=>s.trim()).filter(Boolean)); }
    catch {} finally { setLoading(false); }
  };
  return (<>
    <div className="tip"><b>ATS Tip —</b> Use exact keywords from job descriptions to pass automated screening.</div>
    <div className="f">
      <label className="lbl">Skills <span style={{fontSize:".6rem",fontWeight:400,textTransform:"none",letterSpacing:0,color:"var(--tx-muted)"}}>— press Enter after each</span></label>
      <TagInput value={d} onChange={v=>{set(v);setSugg([]);}} />
    </div>
    {d.length===0 && (
      <div className="empty-state" style={{padding:"1rem 0 0"}}>
        <p>Type a skill like React, Python, Figma and press Enter to add it.</p>
      </div>
    )}
    <button className="ai-btn" style={{position:"static",width:"100%",justifyContent:"center",padding:".42rem",marginBottom:".4rem",borderRadius:"7px"}}
      onClick={enhance} disabled={loading||!d.length}>
      {loading ? <><span className="ai-btn-spin"/>Enhancing…</> : "✦ Enhance Skills with AI"}
    </button>
    {sugg.length>0&&(
      <div className="ai-suggestion-box">
        <div className="ai-sugg-label">✦ AI Suggestion</div>
        <div className="ai-sugg-text">{sugg.join(", ")}</div>
        <div className="ai-sugg-actions">
          <button className="ai-accept" onClick={()=>{set(sugg);setSugg([]);}}>✓ Apply All</button>
          <button className="ai-dismiss" onClick={()=>setSugg([])}>✕ Dismiss</button>
        </div>
      </div>
    )}
    <div className="tip" style={{marginTop:".4rem"}}><b>Cover:</b> Languages · Frameworks · Databases · DevOps · Cloud · Tools · Soft Skills</div>
  </>);
}

function ProjectsForm({ d, set }) {
  const upd = (id,k,v) => set(d.map(p=>p.id===id?{...p,[k]:v}:p));
  if (!d.length) return (
    <>
      <div className="empty-state">
        <div className="empty-state-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" style={{color:"var(--accent)"}}>
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14l-5-5 1.41-1.41L12 14.17l7.59-7.59L21 8l-9 9z"/>
          </svg>
        </div>
        <h4>No projects added yet</h4>
        <p>Showcase personal projects, open source work, or academic builds.</p>
      </div>
      <button className="add-btn" onClick={()=>set([...d,newProj()])}>＋ Add Project</button>
    </>
  );
  return (<>
    <div className="tip"><b>Tip —</b> AI improves your project descriptions automatically as you type.</div>
    {d.map((p,i)=>(
      <CollapsibleCard key={p.id} badge={`#${i+1}`}
        title={p.name||"New Project"}
        sub={p.tech||null}
        onRemove={()=>set(d.filter(x=>x.id!==p.id))}
        defaultOpen={i===d.length-1}
      >
        <AiField label="Project Name" value={p.name} onChange={v=>upd(p.id,"name",v)} placeholder="e.g. Smart Resume Platform" enhanceFn={v=>ENHANCERS.projectName(v)} />
        <div className="g2">
          <AiField label="Tech Stack" value={p.tech} onChange={v=>upd(p.id,"tech",v)} placeholder="React, Node.js, MongoDB" enhanceFn={v=>ENHANCERS.tech(v)} />
          <div className="f"><label className="lbl">GitHub / Live URL</label><input className="inp" placeholder="github.com/user/repo" value={p.url} onChange={e=>upd(p.id,"url",e.target.value)} /></div>
        </div>
        <AiTextArea label="Description" value={p.bullets} onChange={v=>upd(p.id,"bullets",v)} rows={3}
          placeholder={"- What problem did it solve?\n- How did you build it?\n- What was the outcome?"}
          enhanceFn={v=>ENHANCERS.projectBullets(v,{name:p.name,tech:p.tech})}
        />
      </CollapsibleCard>
    ))}
    <button className="add-btn" onClick={()=>set([...d,newProj()])}>＋ Add Project</button>
  </>);
}

function CertificationsForm({ d, set }) {
  const upd = (id,k,v) => set(d.map(c=>c.id===id?{...c,[k]:v}:c));
  if (!d.length) return (
    <>
      <div className="empty-state">
        <div className="empty-state-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" style={{color:"var(--accent)"}}>
            <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 14l-3-3 1.41-1.41L11 12.17l4.59-4.58L17 9l-6 6z"/>
          </svg>
        </div>
        <h4>No certifications yet</h4>
        <p>Add AWS, Google Cloud, or any professional certifications you hold.</p>
      </div>
      <button className="add-btn" onClick={()=>set([...d,newCert()])}>＋ Add Certification</button>
    </>
  );
  return (<>
    {d.map((c,i)=>(
      <CollapsibleCard key={c.id} badge={`#${i+1}`}
        title={c.name||"New Certification"}
        sub={c.issuer||null}
        onRemove={()=>set(d.filter(x=>x.id!==c.id))}
        defaultOpen={i===d.length-1}
      >
        <AiField label="Certification Name" value={c.name} onChange={v=>upd(c.id,"name",v)} placeholder="e.g. AWS Solutions Architect" enhanceFn={v=>ENHANCERS.certName(v)} />
        <div className="g2">
          <AiField label="Issued By" value={c.issuer} onChange={v=>upd(c.id,"issuer",v)} placeholder="e.g. Amazon Web Services" enhanceFn={v=>ENHANCERS.certIssuer(v)} />
          <div className="f"><label className="lbl">Date</label><MonthYearPicker value={c.date} onChange={v=>upd(c.id,"date",v)} /></div>
        </div>
      </CollapsibleCard>
    ))}
    <button className="add-btn" onClick={()=>set([...d,newCert()])}>＋ Add Certification</button>
  </>);
}

/* ─── Resume Preview ────────────────────────────── */
function ResumePreview({ data }) {
  const { personal:p, summary:s, experience, education, skills, projects, certifications } = data;
  const hasContent = p.name||s.text||experience.length||education.length||skills.length;
  const contacts = [
    p.email    && { label:p.email,    href:`mailto:${p.email}` },
    p.phone    && { label:p.phone,    href:null },
    p.location && { label:p.location, href:null },
    p.linkedin && { label:p.linkedin, href:`https://${p.linkedin}` },
    p.github   && { label:p.github,   href:`https://${p.github}` },
    p.website  && { label:p.website,  href:`https://${p.website}` },
  ].filter(Boolean);

  if (!hasContent) return (
    <div className="rv">
      <div className="rv-empty">
        <div className="rv-empty-ico">◈</div>
        <h3>Your Resume Preview</h3>
        <p>Fill in the form and your resume will appear here in real time.</p>
      </div>
    </div>
  );

  return (
    <div className="rv" id="resume-output">
      <div className="rv-name">{p.name || "Your Name"}</div>
      {p.title && <div className="rv-job">{p.title}</div>}
      {contacts.length>0 && (
        <div className="rv-contacts">
          {contacts.map((c,i)=>c.href
            ? <a key={i} className="rv-c" href={c.href} target="_blank" rel="noreferrer">{c.label}</a>
            : <span key={i} className="rv-c">{c.label}</span>
          )}
        </div>
      )}
      <div className="rv-hr"/>
      {s.text && <div className="rv-sec"><div className="rv-sh">Professional Summary</div><p className="rv-summary">{s.text}</p></div>}
      {experience.length>0 && <div className="rv-sec"><div className="rv-sh">Work Experience</div>
        {experience.map(e=>(
          <div className="rv-entry" key={e.id}>
            <div className="rv-erow">
              <div><div className="rv-etitle">{e.role||"Role"}</div><div className="rv-eorg">{e.company}</div></div>
              <div className="rv-edate">{fmtM(e.start)}{e.start?" — ":""}{e.current?"Present":fmtM(e.end)}</div>
            </div>
            {e.bullets && <ul className="rv-bul">{parseBullets(e.bullets).map((b,i)=><li key={i}>{b}</li>)}</ul>}
          </div>
        ))}
      </div>}
      {projects.length>0 && <div className="rv-sec"><div className="rv-sh">Projects</div>
        {projects.map(proj=>(
          <div className="rv-entry" key={proj.id}>
            <div className="rv-erow">
              <div><div className="rv-etitle">{proj.name||"Project"}</div>{proj.tech&&<div className="rv-esub">{proj.tech}</div>}</div>
              {proj.url && <a className="rv-edate" style={{color:"#A07830",textDecoration:"none"}} href={`https://${proj.url}`} target="_blank" rel="noreferrer">{proj.url}</a>}
            </div>
            {proj.bullets && <ul className="rv-bul">{parseBullets(proj.bullets).map((b,i)=><li key={i}>{b}</li>)}</ul>}
          </div>
        ))}
      </div>}
      {education.length>0 && <div className="rv-sec"><div className="rv-sh">Education</div>
        {education.map(e=>(
          <div className="rv-entry" key={e.id}>
            <div className="rv-erow">
              <div><div className="rv-etitle">{[e.degree,e.field].filter(Boolean).join(" in ")||"Degree"}</div><div className="rv-eorg">{e.institution}</div></div>
              <div className="rv-edate">{e.start}{e.start&&e.end?" – ":""}{e.end}</div>
            </div>
            {e.gpa && <div className="rv-esub" style={{marginTop:".06rem"}}>CGPA / Score: {e.gpa}</div>}
          </div>
        ))}
      </div>}
      {skills.length>0 && <div className="rv-sec"><div className="rv-sh">Skills</div>
        <div className="rv-skills">{skills.map(sk=><span key={sk} className="rv-sk">{sk}</span>)}</div>
      </div>}
      {certifications.length>0 && <div className="rv-sec"><div className="rv-sh">Certifications</div>
        {certifications.map(c=>(
          <div className="rv-cert" key={c.id}>
            <div><div className="rv-cname">{c.name}</div>{c.issuer&&<div className="rv-corg">{c.issuer}</div>}</div>
            <div className="rv-cdate">{fmtM(c.date)}</div>
          </div>
        ))}
      </div>}
    </div>
  );
}

/* ─── Section completion helpers ────────────────── */
const sectionTotal = (stepIdx) => {
  // returns the "full" count for each section — used to compute ring fill
  return [6, 1, 3, 2, 5, 2, 2][stepIdx] ?? 1;
};
const sectionCount = (stepIdx, data) => {
  const p = data.personal;
  switch(stepIdx) {
    case 0: return [p.name,p.email,p.phone,p.location,p.linkedin||p.github,p.title].filter(Boolean).length;
    case 1: return data.summary.text.trim().length > 20 ? 1 : 0;
    case 2: return Math.min(data.experience.length, 3);
    case 3: return Math.min(data.education.length, 2);
    case 4: return Math.min(data.skills.length, 5);
    case 5: return Math.min(data.projects.length, 2);
    case 6: return Math.min(data.certifications.length, 2);
    default: return 0;
  }
};

/* ─── Main App ──────────────────────────────────── */
export default function ResumeBuilder({ templateId="classic", onBack }) {
  const dark = true;
  const [step, setStep] = useState(0);
  const [visited, setVisited] = useState(new Set([0]));
  const [data, setData] = useState(()=>{
    try { const s=localStorage.getItem("etherx_resume"); return s?JSON.parse(s):INIT; }
    catch { return INIT; }
  });
  const [sideOpen, setSideOpen] = useState(false);
  const [mobTab, setMobTab] = useState("form");
  const [exporting, setExporting] = useState(false);
  const [banner, setBanner] = useState({show:false,type:"",msg:""});
  const [exportModal, setExportModal] = useState({open:false,type:null});
  const [zoom, setZoom] = useState(100);
  const [saveState, setSaveState] = useState("saved");
  const formBodyRef = useRef(null);

  // Auto-save with visual "Saving…" feedback
  useEffect(()=>{
    setSaveState("saving");
    const t = setTimeout(()=>{
      localStorage.setItem("etherx_resume",JSON.stringify(data));
      setSaveState("saved");
    }, 600);
    return ()=>clearTimeout(t);
  }, [data]);

  // Keyboard shortcuts: Ctrl/Cmd+→ next, Ctrl/Cmd+← back, Ctrl/Cmd+S open export
  useEffect(()=>{
    const handler = e => {
      if((e.ctrlKey||e.metaKey)&&e.key==="ArrowRight"){ e.preventDefault(); setStep(s=>{ const n=Math.min(s+1,STEPS.length-1); setVisited(p=>new Set([...p,n])); setSideOpen(false); return n; }); }
      if((e.ctrlKey||e.metaKey)&&e.key==="ArrowLeft"){  e.preventDefault(); setStep(s=>{ const n=Math.max(s-1,0); setVisited(p=>new Set([...p,n])); setSideOpen(false); return n; }); }
      if((e.ctrlKey||e.metaKey)&&e.key==="s"){ e.preventDefault(); openExportModal("pdf"); }
    };
    window.addEventListener("keydown",handler);
    return ()=>window.removeEventListener("keydown",handler);
  }, []);

  // Scroll form back to top on step change
  useEffect(()=>{ if(formBodyRef.current) formBodyRef.current.scrollTop=0; }, [step]);

  const go = n => { setStep(n); setVisited(p=>new Set([...p,n])); setSideOpen(false); };
  const setter = k => v => setData(p=>({...p,[k]:v}));

  const showBanner = (type,msg,ms=4000) => {
    setBanner({show:true,type,msg});
    setTimeout(()=>setBanner({show:false,type:"",msg:""}), ms);
  };

  // Opens modal — actual export fires from modal buttons
  const openExportModal = (type) => {
    if(!data.personal.name.trim()){ showBanner("error","Please fill in your name before exporting."); return; }
    setExportModal({open:true,type});
  };

  const handleExport = async type => {
    if(typeof window==="undefined"||typeof document==="undefined") return;
    if(!data.personal.name.trim()){ showBanner("error","Please fill in your name before exporting."); return; }
    setExporting(true);

    if(type==="pdf"){
      try {
        let exportFn;
        if(templateId==="classic")        { const m=await import("../templates/ClassicTemplate");   exportFn=m.exportClassicPDF; }
        else if(templateId==="modern")    { const m=await import("../templates/ModernTemplate");    exportFn=m.exportToPDF; }
        else if(templateId==="tech")      { const m=await import("../templates/TechTemplate");      exportFn=m.exportToPDF; }
        else if(templateId==="executive") { const m=await import("../templates/ExecutiveTemplate"); exportFn=m.exportToPDF; }
        else if(templateId==="etherx")    { const m=await import("../templates/EtherXTemplate");   exportFn=m.exportToPDF; }
        else if(templateId==="student")   { const m=await import("../templates/StudentTemplate");   exportFn=m.exportToPDF; }
        if(exportFn){ await exportFn(data); }
        else throw new Error("Export function not found for this template.");
        setExportModal({open:false,type:null});
        showBanner("success","Download started! Check your Downloads folder.");
      } catch(err) {
        showBanner("error",err.message||"PDF export failed.");
      } finally { setExporting(false); }
    } else {
      try {
        const res = await fetch(`${API}/api/export/docx`,{
          method:"POST", headers:{"Content-Type":"application/json"},
          body:JSON.stringify({...data,templateId}),
        });
        if(!res.ok) throw new Error("Export failed — the export service is temporarily unavailable.");
        const blob=await res.blob();
        const url=URL.createObjectURL(blob);
        const a=document.createElement("a"); a.href=url;
        a.download=`${(data.personal.name||"resume").replace(/\s+/g,"_")}_${templateId}_resume.docx`;
        a.click(); URL.revokeObjectURL(url);
        setExportModal({open:false,type:null});
        showBanner("success","Download started! Check your Downloads folder.");
      } catch(err) {
        showBanner("error",err.message||"Export failed. Please try again later.");
      } finally { setExporting(false); }
    }
  };

  const forms = [
    <PersonalForm       d={data.personal}       set={setter("personal")} />,
    <SummaryForm        d={data.summary}         set={setter("summary")} personalData={data.personal} />,
    <ExperienceForm     d={data.experience}      set={setter("experience")} />,
    <EducationForm      d={data.education}       set={setter("education")} />,
    <SkillsForm         d={data.skills}          set={setter("skills")} personalData={data.personal} />,
    <ProjectsForm       d={data.projects}        set={setter("projects")} />,
    <CertificationsForm d={data.certifications}  set={setter("certifications")} />,
  ];

  const [t1,...rest] = STEPS[step].label.split(" ");
  const t2 = rest.join(" ");

  return (
    <>
      <style>{STYLES}</style>
      <div className={`rb${dark ? " dark" : ""}`}>

        {/* ── HEADER ── */}
        <header className="rb-hdr">
          <button className="rb-hamburger" onClick={()=>setSideOpen(o=>!o)} aria-label="Menu">
            <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
              <rect x="2" y="4" width="16" height="1.8" rx="1"/><rect x="2" y="9.1" width="16" height="1.8" rx="1"/><rect x="2" y="14.2" width="16" height="1.8" rx="1"/>
            </svg>
          </button>

          {onBack && (
            <button className="rb-back-btn" onClick={onBack} title="Back to Templates">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M19 12H5M11 6l-6 6 6 6"/>
              </svg>
              Templates
            </button>
          )}

          <div className="rb-logomark"><LogoMark /></div>
          <div className="rb-logo-wrap">
            <div className="rb-logo">EtherX</div>
            <div className="rb-logo-sub">Resume Intelligence</div>
          </div>

          <div className="rb-pipe"/>
          <span className="rb-badge">ATS-Optimized</span>
          <span className="rb-tmpl-chip">{templateId}</span>

          <div className="rb-hright">
            <div className="rb-save-state">
              <span className={`rb-save-dot${saveState==="saving"?" saving":""}`}/>
              {saveState==="saving" ? "Saving…" : "Saved"}
            </div>
            <div className="rb-step-counter">
              <strong>Step {step+1}</strong>
              <span>of {STEPS.length}</span>
              <div className="rb-step-dots">
                {STEPS.map((_,i)=>(
                  <span key={i} className={`rb-step-dot${i===step?" active":i<step?" done":""}`}/>
                ))}
              </div>
            </div>
            <button className="rb-icon-btn"
              onClick={()=>{if(window.confirm("Clear all data and start fresh?")){ localStorage.removeItem("etherx_resume"); setData(INIT); setStep(0); setVisited(new Set([0])); }}}
              title="Start Fresh"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
              </svg>
            </button>
          </div>
        </header>

        {/* ── BANNER ── */}
        {banner.show && (
          <div className={`rb-banner ${banner.type}`}>
            {banner.type==="loading" && <span className="rb-spin"/>}
            <span>{banner.msg}</span>
          </div>
        )}

        {/* ── BODY ── */}
        <div className="rb-body">
          {sideOpen && <div className="rb-overlay" onClick={()=>setSideOpen(false)}/>}

          {/* SIDEBAR */}
          <aside className={`rb-sidebar${sideOpen?" open":""}`}>
            <div className="rb-sidebar-ttl">Sections</div>
            <ul className="rb-nav">
              {STEPS.map((s,i)=>{
                const count = sectionCount(i, data);
                const total = sectionTotal(i);
                const pct   = total > 0 ? Math.round((count/total)*100) : 0;
                const circ  = 2 * Math.PI * 8;
                const offset = circ - (circ * pct / 100);
                const isActive = i===step;
                const isDone   = visited.has(i) && !isActive;
                return (
                  <li key={s.key}
                    className={`rb-ni${isActive?" active":""}${isDone?" done":""}`}
                    onClick={()=>go(i)}
                  >
                    <div className="rb-ni-ring">
                      {!isActive && (
                        <svg viewBox="0 0 20 20">
                          <circle className="rb-ni-ring-bg" cx="10" cy="10" r="8"/>
                          <circle className="rb-ni-ring-fill" cx="10" cy="10" r="8"
                            strokeDasharray={circ}
                            strokeDashoffset={offset}
                          />
                        </svg>
                      )}
                      <div className="rb-ni-ring-num">
                        {isDone && count===total ? (
                          <svg viewBox="0 0 12 12" fill="none" width="10" height="10">
                            <path d="M2 6l3 3 5-5" stroke="#C9A84C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        ) : (i+1)}
                      </div>
                    </div>
                    <span className="rb-ni-lbl">{s.label}</span>
                    {[0,1].includes(i) && !isDone && !isActive && <span className="rb-ni-req" title="Required"/>}
                    {count > 0 && !isActive && (
                      <span className="rb-ni-count">{count}/{total}</span>
                    )}
                  </li>
                );
              })}
            </ul>
            <div className="rb-sidebar-export">
              <div className="rb-exp-label">Export Resume</div>
              <button className="rb-exp-pdf" onClick={()=>openExportModal("pdf")} disabled={exporting}>
                {exporting ? "Generating…" : "↓ Download PDF"}
              </button>
              <button className="rb-exp-doc" onClick={()=>openExportModal("docx")} disabled={exporting}>
                {exporting ? "Generating…" : "↓ Download Word"}
              </button>
            </div>
          </aside>

          {/* FORM */}
          <div className="rb-form-wrap">
            <div className="rb-form-top">
              <div className="rb-sec-ttl">
                <span className="rb-sec-ttl-icon"/>
                {t1}{t2 && <> <em>{t2}</em></>}
              </div>
              <div className="rb-sec-sub">{SUBS[step]}</div>
              <div className="rb-rule"/>
            </div>
            <div className="rb-form-body" ref={formBodyRef} key={step}>{forms[step]}</div>
            {step===STEPS.length-1 && <ATSPanel data={data} dark={dark}/>}
            <div className="rb-form-foot">
              <div style={{display:"flex",flexDirection:"column",flex:1,gap:".35rem"}}>
                <div style={{display:"flex",gap:".6rem"}}>
                  {step>0 && <button className="btn-back" onClick={()=>go(step-1)}>← Back</button>}
                  {step<STEPS.length-1
                    ? <button className="btn-next" onClick={()=>go(step+1)}>Save &amp; Continue →</button>
                    : <button className="btn-pdf" onClick={()=>openExportModal("pdf")} disabled={exporting}>
                        {exporting ? "Generating…" : "↓ Download PDF"}
                      </button>
                  }
                </div>
                <div className="rb-kbd-hint">
                  <span className="rb-kbd">⌘→</span> next
                  <span style={{opacity:.35,margin:"0 .15rem"}}>·</span>
                  <span className="rb-kbd">⌘←</span> back
                  <span style={{opacity:.35,margin:"0 .15rem"}}>·</span>
                  <span className="rb-kbd">⌘S</span> export
                </div>
              </div>
            </div>
          </div>

          {/* PREVIEW */}
          <div className={`rb-preview${mobTab==="preview"?" mob-show":""}`}>
            <div className="rb-prev-bar">
              <span className="rb-prev-ttl">Live Preview</span>
              <span className="rb-live"><span className="rb-live-dot"/>Live</span>
              <div className="rb-exp-grp">
                <div className="rb-zoom-grp">
                  <button className="rb-zoom-btn" onClick={()=>setZoom(z=>Math.max(60,z-10))} title="Zoom out">−</button>
                  <span className="rb-zoom-val">{zoom}%</span>
                  <button className="rb-zoom-btn" onClick={()=>setZoom(z=>Math.min(130,z+10))} title="Zoom in">+</button>
                </div>
                <button className="exp-btn ep-pdf" onClick={()=>openExportModal("pdf")} disabled={exporting}>↓ PDF</button>
                <button className="exp-btn ep-doc" onClick={()=>openExportModal("docx")} disabled={exporting}>↓ Word</button>
              </div>
            </div>
            <div className="rb-prev-scroll">
              <div style={{transform:`scale(${zoom/100})`,transformOrigin:"top center",width:"100%",display:"flex",justifyContent:"center"}}>
                <SelectedTemplate data={data} templateId={templateId}/>
              </div>
            </div>
          </div>
        </div>

        {/* MOBILE TAB BAR */}
        <div className="rb-tabbar">
          <button className={`rb-tab${mobTab==="form"?" active":""}`} onClick={()=>setMobTab("form")}>
            <span className="rb-tab-ico">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13z"/></svg>
            </span>
            <span className="rb-tab-lbl">Form</span>
          </button>
          <button className={`rb-tab${mobTab==="preview"?" active":""}`} onClick={()=>setMobTab("preview")}>
            <span className="rb-tab-ico">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
            </span>
            <span className="rb-tab-lbl">Preview</span>
          </button>
          <button className="rb-tab" onClick={()=>openExportModal("pdf")} disabled={exporting}>
            <span className="rb-tab-ico">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/></svg>
            </span>
            <span className="rb-tab-lbl">PDF</span>
          </button>
          <button className="rb-tab" onClick={()=>openExportModal("docx")} disabled={exporting}>
            <span className="rb-tab-ico">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm-1 7V3.5L18.5 9H13zM8 16h8v2H8zm0-4h8v2H8zm0-4h4v2H8z"/></svg>
            </span>
            <span className="rb-tab-lbl">Word</span>
          </button>
        </div>

        {/* ── EXPORT MODAL ── */}
        {exportModal.open && (
          <div className="rb-modal-overlay" onClick={e=>{if(e.target===e.currentTarget)setExportModal({open:false,type:null});}}>
            <div className="rb-modal">
              <div className="rb-modal-hdr">
                <div className="rb-modal-title">
                  <span className="rb-modal-title-dot"/>
                  Export Resume
                </div>
                <button className="rb-modal-close" onClick={()=>setExportModal({open:false,type:null})}>
                  <svg viewBox="0 0 16 16" fill="currentColor" width="12" height="12"><path d="M12 4L4 12M4 4l8 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" fill="none"/></svg>
                </button>
              </div>
              {exporting ? (
                <div className="rb-modal-generating">
                  <div className="rb-modal-gen-spinner"/>
                  <div className="rb-modal-gen-label">Generating {exportModal.type==="pdf"?"PDF":"Word Doc"}…</div>
                  <div className="rb-modal-gen-sub">Building your resume with the {templateId} template.<br/>This takes a few seconds.</div>
                </div>
              ) : (
                <>
                  <div className="rb-modal-body">
                    <div className="rb-modal-meta">
                      <div className="rb-modal-meta-row">
                        <span className="rb-modal-meta-label">Name</span>
                        <span className="rb-modal-meta-value">{data.personal.name||"—"}</span>
                      </div>
                      <div className="rb-modal-meta-row">
                        <span className="rb-modal-meta-label">Template</span>
                        <span className="rb-modal-meta-value" style={{textTransform:"capitalize"}}>{templateId}</span>
                      </div>
                      <div className="rb-modal-meta-row">
                        <span className="rb-modal-meta-label">Sections filled</span>
                        <span className="rb-modal-meta-value">{visited.size} of {STEPS.length}</span>
                      </div>
                    </div>
                    <div className="rb-modal-filename">
                      <span className="rb-modal-filename-icon">
                        <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14"><path d="M4 4a2 2 0 012-2h5l5 5v9a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm7 0v4h4"/></svg>
                      </span>
                      <span className="rb-modal-filename-text">
                        {(data.personal.name||"resume").replace(/\s+/g,"_")}_{templateId}_resume.{exportModal.type==="pdf"?"pdf":"docx"}
                      </span>
                    </div>
                  </div>
                  <div className="rb-modal-actions">
                    <button className="rb-modal-btn-pdf" onClick={()=>handleExport("pdf")} disabled={exporting}>
                      <svg viewBox="0 0 18 18" fill="currentColor" width="13" height="13"><path d="M3 13.5h12v1.5H3zm6.75-2.56l3.5-3.5-1.06-1.06-1.69 1.69V3h-1.5v5.07L8.31 6.38 7.25 7.44l3.5 3.5z"/></svg>
                      Download PDF
                    </button>
                    <button className="rb-modal-btn-doc" onClick={()=>handleExport("docx")} disabled={exporting}>
                      <svg viewBox="0 0 18 18" fill="currentColor" width="13" height="13"><path d="M3 13.5h12v1.5H3zm6.75-2.56l3.5-3.5-1.06-1.06-1.69 1.69V3h-1.5v5.07L8.31 6.38 7.25 7.44l3.5 3.5z"/></svg>
                      Download Word
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

      </div>
    </>
  );
}
