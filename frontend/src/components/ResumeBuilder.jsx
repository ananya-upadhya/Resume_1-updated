'use client';
import { useState, useEffect, useRef } from "react";
import ATSPanel from "./ATSPanel";
import { ENHANCERS } from "../groqHelper";
import SelectedTemplate from "../templates/index.jsx";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";
const API = API_BASE.replace(/\/api$/, "").replace(/\/$/, "");

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,500;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing:border-box; margin:0; padding:0; }
  html, body, #root { width:100%; height:auto !important; overflow:hidden; }
  body { font-family:'DM Sans',sans-serif; }

  @keyframes shimmer { 0%{background-position:-200% center} 100%{background-position:200% center} }
  @keyframes spin    { to{transform:rotate(360deg)} }
  @keyframes blink   { 0%,100%{opacity:1} 50%{opacity:.2} }
  @keyframes pulse-gold { 0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,0.45)} 50%{box-shadow:0 0 0 6px rgba(201,168,76,0)} }
  @keyframes pulse-blue { 0%,100%{box-shadow:0 0 0 0 rgba(59,130,246,0.4)}  50%{box-shadow:0 0 0 6px rgba(59,130,246,0)} }
  @keyframes fadeIn  { from{opacity:0} to{opacity:1} }
  @keyframes slideIn { from{transform:translateY(-6px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes stepIn  { from{opacity:0;transform:translateX(18px)} to{opacity:1;transform:translateX(0)} }
  /* ═══════════════════════════════════════════════════
     LIGHT MODE  (default — blue & white)
  ═══════════════════════════════════════════════════ */
  .rb {
    --bg-shell:   #f4f5f7;
    --bg-header:  #ffffff;
    --bg-sidebar: #ffffff;
    --bg-form:    #f4f5f7;
    --bg-input:   #ffffff;
    --bg-card:    #ffffff;
    --bg-preview: #dde1e7;
    --bg-tip:     #eff6ff;
    --bg-foot:    #ffffff;

    --tx-primary:   #111827;
    --tx-secondary: #4b5563;
    --tx-muted:     #9ca3af;
    --tx-input:     #111827;
    --tx-ph:        #b0b7c3;

    --bd:       #e5e7eb;
    --bd-input: #d1d5db;
    --bd-focus: #3b82f6;

    --accent:    #3b82f6;
    --accent-h:  #2563eb;
    --accent-lt: #eff6ff;
    --accent-tx: #1d4ed8;

    --green:    #16a34a;
    --green-lt: #f0fdf4;
    --green-bd: #bbf7d0;
    --red:      #dc2626;
    --red-lt:   #fef2f2;
    --red-bd:   #fecaca;

    --sh-card:   0 1px 3px rgba(0,0,0,0.08),0 1px 2px rgba(0,0,0,0.04);
    --sh-resume: 0 4px 6px rgba(0,0,0,0.04),0 16px 48px rgba(0,0,0,0.10);

    --logo-color:    #111827;
    --logo-em:       #3b82f6;
    --logo-sub:      #9ca3af;
    --badge-color:   #9ca3af;
    --badge-border:  #e5e7eb;
    --prog-track:    #e5e7eb;
    --prog-fill-a:   #3b82f6;
    --prog-fill-b:   #3b82f6;
    --prog-pct:      #3b82f6;
    --lbl-color:     #4b5563;
    --req-color:     #3b82f6;
    --ni-active-bg:  #eff6ff;
    --ni-active-bd:  #eff6ff;
    --ni-num-active-bg: #3b82f6;
    --ni-num-active-bd: #3b82f6;
    --ni-num-active-tx: #fff;
    --ni-num-done-bg:   #16a34a;
    --ni-num-done-bd:   #16a34a;
    --ni-num-done-tx:   #fff;
    --ni-lbl-active: #1d4ed8;
    --ni-lbl-done:   #16a34a;
    --pulse-anim: pulse-blue;
    --tip-border-l: #3b82f6;
    --tip-bg:       #eff6ff;
    --tip-bd:       rgba(59,130,246,0.16);
    --tip-tx:       #4b5563;
    --tip-b:        #1d4ed8;
    --tag-bg:       #eff6ff;
    --tag-bd:       rgba(59,130,246,0.26);
    --tag-tx:       #1d4ed8;
    --tag-x:        #3b82f6;
    --card-badge-bg: #3b82f6;
    --card-badge-tx: #fff;
    --btn-next-bg:   #3b82f6;
    --btn-next-h:    #2563eb;
    --btn-next-tx:   #fff;
    --btn-pdf-bg:    #111827;
    --btn-pdf-tx:    #fff;
    --sidebar-exp-pdf-bg: #111827;
    --sidebar-exp-pdf-tx: #fff;
    --sidebar-exp-doc-bg: #16a34a;
    --sidebar-exp-doc-tx: #fff;
    --sidebar-exp-pdf-h:  #1f2937;
    --sidebar-exp-doc-h:  #15803d;
    --prev-bar-bg:   #ffffff;
    --prev-ttl:      #9ca3af;
    --live-color:    #16a34a;
    --live-dot:      #16a34a;
    --ep-pdf-bg:     #111827;
    --ep-pdf-tx:     #ffffff;
    --ep-doc-bg:     #16a34a;
    --ep-doc-tx:     #ffffff;
    --preview-bg:    #dde1e7;
    --banner-load-bg: #eff6ff;
    --banner-load-tx: #3b82f6;
    --banner-load-bd: #3b82f6;
    --banner-ok-bg:   #f0fdf4;
    --banner-ok-tx:   #16a34a;
    --banner-ok-bd:   #bbf7d0;
    --banner-err-bg:  #fef2f2;
    --banner-err-tx:  #dc2626;
    --banner-err-bd:  #fecaca;
    --tab-active:    #3b82f6;
    --tab-hover-bg:  #f3f4f6;
    --overlay-bg:    rgba(0,0,0,0.38);
    --sidebar-open-sh: 4px 0 24px rgba(0,0,0,0.16);
  }

  /* ═══════════════════════════════════════════════════
     DARK MODE  (gold & black)
  ═══════════════════════════════════════════════════ */
  .rb.dark {
    --bg-shell:   #080808;
    --bg-header:  #0e0e0e;
    --bg-sidebar: #0e0e0e;
    --bg-form:    #141414;
    --bg-input:   #1a1a1a;
    --bg-card:    #1a1a1a;
    --bg-preview: #080808;
    --bg-tip:     rgba(201,168,76,0.04);
    --bg-foot:    #0e0e0e;

    --tx-primary:   #E8C96B;
    --tx-secondary: #C8B090;
    --tx-muted:     #6B5A3A;
    --tx-input:     #C8B090;
    --tx-ph:        #3A3020;

    --bd:       rgba(201,168,76,0.20);
    --bd-input: #2C2C2C;
    --bd-focus: #C9A84C;

    --accent:    #C9A84C;
    --accent-h:  #F0C040;
    --accent-lt: rgba(201,168,76,0.10);
    --accent-tx: #E8C96B;

    --green:    #7EC882;
    --green-lt: rgba(126,200,130,0.10);
    --green-bd: rgba(126,200,130,0.30);
    --red:      #E07060;
    --red-lt:   rgba(192,57,43,0.12);
    --red-bd:   rgba(192,57,43,0.35);

    --sh-card:   0 1px 0 rgba(201,168,76,0.08),0 2px 12px rgba(0,0,0,0.5);
    --sh-resume: 0 0 0 1px rgba(201,168,76,0.25),0 8px 40px rgba(0,0,0,0.7);

    --logo-color:    transparent;
    --logo-em:       transparent;
    --logo-sub:      #6B5A3A;
    --badge-color:   #7A5C24;
    --badge-border:  #7A5C24;
    --prog-track:    #2C2C2C;
    --prog-fill-a:   #A07830;
    --prog-fill-b:   #F0C040;
    --prog-pct:      #C9A84C;
    --lbl-color:     #6B5A3A;
    --req-color:     #C9A84C;
    --ni-active-bg:  rgba(201,168,76,0.12);
    --ni-active-bd:  rgba(201,168,76,0.25);
    --ni-num-active-bg: #C9A84C;
    --ni-num-active-bd: #F0C040;
    --ni-num-active-tx: #080808;
    --ni-num-done-bg:   #A07830;
    --ni-num-done-bd:   #C9A84C;
    --ni-num-done-tx:   #080808;
    --ni-lbl-active: #E8C96B;
    --ni-lbl-done:   #D4B86A;
    --pulse-anim: pulse-gold;
    --tip-border-l: #C9A84C;
    --tip-bg:       rgba(201,168,76,0.04);
    --tip-bd:       rgba(201,168,76,0.20);
    --tip-tx:       #6B5A3A;
    --tip-b:        #D4B86A;
    --tag-bg:       rgba(201,168,76,0.10);
    --tag-bd:       rgba(201,168,76,0.35);
    --tag-tx:       #D4B86A;
    --tag-x:        #C9A84C;
    --card-badge-bg: #C9A84C;
    --card-badge-tx: #080808;
    --btn-next-bg:   linear-gradient(135deg,#A07830,#C9A84C);
    --btn-next-h:    linear-gradient(135deg,#C9A84C,#F0C040);
    --btn-next-tx:   #080808;
    --btn-pdf-bg:    linear-gradient(135deg,#A07830,#C9A84C);
    --btn-pdf-tx:    #080808;
    --sidebar-exp-pdf-bg: linear-gradient(135deg,#A07830,#C9A84C);
    --sidebar-exp-pdf-tx: #080808;
    --sidebar-exp-doc-bg: transparent;
    --sidebar-exp-doc-tx: #D4B86A;
    --sidebar-exp-pdf-h:  linear-gradient(135deg,#C9A84C,#F0C040);
    --sidebar-exp-doc-h:  rgba(201,168,76,0.10);
    --prev-bar-bg:   #0e0e0e;
    --prev-ttl:      #6B5A3A;
    --live-color:    #C9A84C;
    --live-dot:      #C9A84C;
    --ep-pdf-bg:     linear-gradient(135deg,#A07830,#C9A84C);
    --ep-pdf-tx:     #080808;
    --ep-doc-bg:     transparent;
    --ep-doc-tx:     #D4B86A;
    --preview-bg:    radial-gradient(ellipse at 50% 0%,rgba(201,168,76,0.05) 0%,transparent 60%) #080808;
    --banner-load-bg: rgba(201,168,76,0.08);
    --banner-load-tx: #E8C96B;
    --banner-load-bd: rgba(201,168,76,0.25);
    --banner-ok-bg:   rgba(126,200,130,0.08);
    --banner-ok-tx:   #7EC882;
    --banner-ok-bd:   rgba(126,200,130,0.25);
    --banner-err-bg:  rgba(192,57,43,0.10);
    --banner-err-tx:  #E07060;
    --banner-err-bd:  rgba(192,57,43,0.30);
    --tab-active:    #C9A84C;
    --tab-hover-bg:  rgba(201,168,76,0.08);
    --overlay-bg:    rgba(0,0,0,0.72);
    --sidebar-open-sh: 4px 0 32px rgba(0,0,0,0.8),1px 0 0 rgba(201,168,76,0.20);
  }

  /* ═══════════════════════════════════════════════════
     SHELL
  ═══════════════════════════════════════════════════ */
  .rb {
    width:100vw; height:100vh; display:flex; flex-direction:column;
    overflow:hidden; background:var(--bg-shell); color:var(--tx-primary);
    transition:background .25s,color .25s;
  }

  /* ═══════════════════════════════════════════════════
     HEADER
  ═══════════════════════════════════════════════════ */
  .rb-hdr {
    flex-shrink:0; height:54px; min-height:54px;
    background:var(--bg-header); border-bottom:1px solid var(--bd);
    display:flex; align-items:center; padding:0 1.15rem; gap:.7rem; z-index:100;
    transition:background .25s,border-color .25s;
  }
  .rb-hamburger {
    display:none; width:32px; height:32px;
    border:1px solid var(--bd); border-radius:7px;
    background:transparent; color:var(--tx-secondary); font-size:1rem;
    cursor:pointer; align-items:center; justify-content:center; flex-shrink:0;
    transition:all .15s;
  }
  .rb-hamburger:hover { background:var(--bd); }

  /* Logo mark SVG */
  .rb-logomark { width:26px; height:26px; flex-shrink:0; display:flex; align-items:center; justify-content:center; }
  .rb-logomark svg { width:26px; height:26px; }

  /* Light mode: plain text logo */
  .rb-logo {
    font-family:'Cinzel',serif; font-size:1.05rem; font-weight:700;
    letter-spacing:.06em; white-space:nowrap; color:var(--logo-color);
  }
  /* Dark mode: shimmer gradient */
  .rb.dark .rb-logo {
    background:linear-gradient(90deg,#A07830 0%,#F0C040 40%,#C9A84C 60%,#F0C040 100%);
    background-size:200% auto;
    -webkit-background-clip:text; -webkit-text-fill-color:transparent;
    background-clip:text;
    animation:shimmer 4s linear infinite;
  }
  .rb-logo em { color:var(--logo-em); font-style:italic; font-family:'Cinzel',serif; }
  .rb.dark .rb-logo em { -webkit-text-fill-color:transparent; }
  .rb-logo-sub {
    font-family:'DM Sans',sans-serif; font-size:.58rem; font-weight:400;
    letter-spacing:.16em; text-transform:uppercase; color:var(--logo-sub);
  }
  .rb-logo-wrap { display:flex; flex-direction:column; line-height:1.2; }

  .rb-pipe { width:1px; height:16px; background:var(--bd); flex-shrink:0; }
  .rb-badge {
    font-size:.6rem; font-weight:600; color:var(--badge-color);
    letter-spacing:.08em; text-transform:uppercase;
    border:1px solid var(--badge-border); border-radius:3px; padding:.1rem .38rem;
  }
  .rb-hright { margin-left:auto; display:flex; align-items:center; gap:.6rem; }
  .rb-prog { display:flex; align-items:center; gap:.4rem; }
  .rb-prog-lbl { font-size:.62rem; font-weight:500; color:var(--tx-muted); letter-spacing:.04em; }
  .rb-prog-track { width:62px; height:3px; background:var(--prog-track); border-radius:3px; overflow:hidden; }
  .rb-prog-fill  {
    height:100%; border-radius:3px; transition:width .4s ease;
    background:linear-gradient(90deg,var(--prog-fill-a),var(--prog-fill-b));
  }
  .rb-prog-pct { font-size:.65rem; font-weight:700; color:var(--prog-pct); min-width:24px; }
  .rb-icon-btn {
    width:32px; height:32px; border:1px solid var(--bd); border-radius:7px;
    background:transparent; color:var(--tx-secondary); font-size:.88rem;
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    transition:all .15s; flex-shrink:0;
  }
  .rb-icon-btn:hover { background:var(--bd); }

  /* ═══════════════════════════════════════════════════
     BANNER
  ═══════════════════════════════════════════════════ */
  .rb-banner {
    flex-shrink:0; display:flex; align-items:center; gap:.6rem;
    padding:.38rem 1.15rem; font-size:.73rem; font-weight:500;
    border-bottom:1px solid; animation:slideIn .2s ease;
  }
  .rb-banner.loading { background:var(--banner-load-bg); color:var(--banner-load-tx); border-color:var(--banner-load-bd); }
  .rb-banner.success { background:var(--banner-ok-bg);   color:var(--banner-ok-tx);   border-color:var(--banner-ok-bd); }
  .rb-banner.error   { background:var(--banner-err-bg);  color:var(--banner-err-tx);  border-color:var(--banner-err-bd); }
  .rb-spin { width:12px; height:12px; border-radius:50%; border:2px solid currentColor; border-top-color:transparent; animation:spin .7s linear infinite; flex-shrink:0; }

  /* ═══════════════════════════════════════════════════
     BODY GRID
  ═══════════════════════════════════════════════════ */
  .rb-body { flex:1; display:grid; grid-template-columns:190px 396px 1fr; overflow:hidden; min-height:0; position:relative; }

  /* ═══════════════════════════════════════════════════
     SIDEBAR
  ═══════════════════════════════════════════════════ */
  .rb-sidebar {
    background:var(--bg-sidebar); border-right:1px solid var(--bd);
    display:flex; flex-direction:column; overflow:hidden; z-index:50;
    transition:background .25s,border-color .25s;
  }
  .rb-sidebar-ttl {
    padding:.85rem 1rem .45rem;
    font-family:'Cinzel',serif; font-size:.56rem; font-weight:600;
    letter-spacing:.15em; text-transform:uppercase; color:var(--tx-muted);
  }
  .rb-nav { list-style:none; padding:0 .42rem; flex:1; overflow-y:auto; scrollbar-width:thin; scrollbar-color:var(--bd) transparent; }
  .rb-nav::-webkit-scrollbar { width:3px; }
  .rb-nav::-webkit-scrollbar-thumb { background:var(--bd); border-radius:3px; }

  .rb-ni {
    display:flex; align-items:center; gap:.52rem;
    padding:.44rem .60rem; border-radius:7px; cursor:pointer;
    margin-bottom:2px; transition:all .15s; user-select:none;
    border:1px solid transparent;
  }
  .rb-ni:hover  { background:var(--bd); }
  .rb-ni.active { background:var(--ni-active-bg); border-color:var(--ni-active-bd); }
  .rb-ni-num {
    width:20px; height:20px; border-radius:50%;
    font-size:.6rem; font-weight:700;
    display:flex; align-items:center; justify-content:center; flex-shrink:0;
    border:1.5px solid var(--bd-input); color:var(--tx-muted); transition:all .2s;
  }
  .rb-ni.active .rb-ni-num {
    background:var(--ni-num-active-bg); border-color:var(--ni-num-active-bd);
    color:var(--ni-num-active-tx); animation:var(--pulse-anim) 2s infinite;
  }
  .rb-ni.done .rb-ni-num {
    background:var(--ni-num-done-bg); border-color:var(--ni-num-done-bd);
    color:var(--ni-num-done-tx); font-size:.66rem;
  }
  .rb-ni-lbl { font-size:.76rem; font-weight:400; color:var(--tx-secondary); }
  .rb-ni.active .rb-ni-lbl { color:var(--ni-lbl-active); font-weight:600; }
  .rb-ni.done   .rb-ni-lbl { color:var(--ni-lbl-done); }

  /* Sidebar export buttons */
  .rb-sidebar-export { padding:.7rem; border-top:1px solid var(--bd); display:flex; flex-direction:column; gap:.42rem; }
  .rb-exp-pdf {
    width:100%; padding:.55rem .5rem;
    background:var(--sidebar-exp-pdf-bg);
    border:1px solid var(--accent); border-radius:7px;
    color:var(--sidebar-exp-pdf-tx); font-family:'DM Sans',sans-serif;
    font-size:.76rem; font-weight:700; letter-spacing:.03em;
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    gap:.35rem; transition:all .18s;
  }
  .rb-exp-pdf:hover { background:var(--sidebar-exp-pdf-h); box-shadow:0 0 10px var(--accent-lt); }
  .rb-exp-pdf:disabled { opacity:.38; cursor:not-allowed; box-shadow:none; }
  .rb-exp-doc {
    width:100%; padding:.55rem .5rem;
    background:var(--sidebar-exp-doc-bg);
    border:1px solid var(--bd); border-radius:7px;
    color:var(--sidebar-exp-doc-tx); font-family:'DM Sans',sans-serif;
    font-size:.76rem; font-weight:600; letter-spacing:.03em;
    cursor:pointer; display:flex; align-items:center; justify-content:center;
    gap:.35rem; transition:all .18s;
  }
  .rb-exp-doc:hover { background:var(--sidebar-exp-doc-h); border-color:var(--accent); color:var(--accent-tx); }
  .rb-exp-doc:disabled { opacity:.38; cursor:not-allowed; }

  /* ═══════════════════════════════════════════════════
     FORM PANEL
  ═══════════════════════════════════════════════════ */
  .rb-form-wrap { background:var(--bg-form); border-right:1px solid var(--bd); display:flex; flex-direction:column; overflow:hidden; transition:background .25s,border-color .25s; }
  .rb-form-top  { flex-shrink:0; padding:1.2rem 1.4rem 0; }
  .rb-sec-ttl   { font-family:'Cinzel',serif; font-size:1.1rem; font-weight:600; letter-spacing:.04em; color:var(--tx-primary); margin-bottom:.14rem; }
  .rb-sec-ttl em { color:var(--accent); font-style:italic; font-family:'Crimson Pro',serif; font-size:1.1em; }
  .rb-sec-sub { font-size:.71rem; color:var(--tx-muted); margin-bottom:1rem; }
  .rb-rule { height:1px; background:var(--bd); margin:0 -1.4rem; }
  .rb-form-body { flex:1; overflow-y:auto; padding:1.2rem 1.4rem .75rem; display:flex; flex-direction:column; gap:1rem; scrollbar-width:thin; scrollbar-color:var(--bd) transparent; animation:stepIn .22s ease; }
  .rb-form-body::-webkit-scrollbar { width:3px; }
  .rb-form-body::-webkit-scrollbar-thumb { background:var(--bd); border-radius:3px; }

  /* Fields */
  .f { margin-bottom:.72rem; min-width:0; }
  .f:last-child { margin-bottom:0; }
  .g2 .f,.g3 .f { margin-bottom:0; }
  .g2 { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:.75rem; margin-bottom:.72rem; }
  .g3 { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:.75rem; margin-bottom:.72rem; }

  .lbl { display:block; font-size:.68rem; font-weight:600; letter-spacing:.1em; text-transform:uppercase; color:var(--lbl-color); margin-bottom:.35rem; }
  .req { color:var(--req-color); }

  .inp, .txa {
    width:100%; min-width:0; background:var(--bg-input);
    border:1px solid var(--bd-input); border-radius:8px;
    color:var(--tx-input); font-family:'DM Sans',sans-serif;
    font-size:.88rem; font-weight:400; padding:.62rem .85rem; min-height:44px;
    outline:none; transition:border-color .18s,box-shadow .18s,background .25s; line-height:1.5;
  }
  .inp::placeholder,.txa::placeholder { color:var(--tx-ph); }
  .inp:focus,.txa:focus {
    border-color:var(--bd-focus);
    box-shadow:0 0 0 3px color-mix(in srgb,var(--bd-focus) 14%,transparent);
  }
  .txa { resize:vertical; min-height:82px; }

  .ck { display:flex; align-items:center; gap:.38rem; margin-bottom:.72rem; padding:.5rem 0; }
  .ck input { accent-color:var(--accent); cursor:pointer; width:16px; height:16px; }
  .ck label  { font-size:.8rem; color:var(--tx-secondary); cursor:pointer; }

  /* Tags */
  .tags {
    min-height:48px; background:var(--bg-input); border:1px solid var(--bd-input);
    border-radius:7px; padding:.45rem .6rem;
    display:flex; flex-wrap:wrap; gap:.3rem; cursor:text;
    transition:border-color .18s,box-shadow .18s;
  }
  .tags:focus-within { border-color:var(--bd-focus); box-shadow:0 0 0 3px color-mix(in srgb,var(--bd-focus) 14%,transparent); }
  .tag {
    display:inline-flex; align-items:center; gap:.25rem;
    background:var(--tag-bg); border:1px solid var(--tag-bd);
    color:var(--tag-tx); font-size:.75rem; font-weight:600; padding:.25rem .5rem; border-radius:5px;
  }
  .tag-x { cursor:pointer; font-size:.9rem; line-height:1; color:var(--tag-x); opacity:.6; }
  .tag-x:hover { opacity:1; }
  .tag-inp { background:transparent; border:none; color:var(--tx-input); font-family:'DM Sans',sans-serif; font-size:.83rem; outline:none; flex:1; min-width:90px; padding:.1rem .15rem; }
  .tag-inp::placeholder { color:var(--tx-ph); }

  /* Tip */
  .tip {
    background:color-mix(in srgb,var(--tip-bg) 75%,rgba(201,168,76,0.15) 25%); border:1px solid var(--tip-bd);
    border-left:4px solid var(--tip-border-l);
    border-radius:0 7px 7px 0; padding:.65rem .85rem;
    font-size:.74rem; color:var(--tip-tx); line-height:1.58; margin-bottom:.76rem;
  }
  .tip b { color:var(--tip-b); }

  /* Card */
  .card {
    background:var(--bg-card); border:1px solid var(--bd);
    border-radius:12px; padding:1.2rem; margin-bottom:1rem;
    position:relative; box-shadow:var(--sh-card);
    transition:border-color .18s,background .25s;
  }
  .card:hover { border-color:rgba(201,168,76,0.45); }
  .card-badge {
    position:absolute; top:-1px; left:.72rem;
    font-family:'Cinzel',serif; font-size:.52rem; font-weight:700;
    letter-spacing:.1em; text-transform:uppercase;
    background:var(--card-badge-bg); color:var(--card-badge-tx);
    padding:.05rem .38rem; border-radius:0 0 5px 5px; line-height:1.65;
  }
  .card-del {
    position:absolute; top:.6rem; right:.6rem; min-height:32px;
    background:transparent; border:1px solid var(--bd); border-radius:6px;
    color:var(--tx-muted); font-size:.75rem; font-weight:500;
    padding:.25rem .55rem; cursor:pointer; font-family:'DM Sans',sans-serif;
    transition:all .15s; white-space:nowrap;
  }
  .card-del:hover { color:var(--red); border-color:var(--red); background:var(--red-lt); }
  .card-body { display:flex; flex-direction:column; padding-top:.5rem; }

  .add-btn {
    width:100%; min-height:48px; padding:.5rem;
    background:transparent; border:1.5px dashed var(--accent); border-radius:8px;
    color:var(--tx-muted); font-family:'DM Sans',sans-serif; font-size:.8rem; font-weight:500;
    cursor:pointer; transition:all .18s;
    display:flex; align-items:center; justify-content:center; gap:.4rem;
  }
   /* ── AI Inline Enhancer ── */
  .ai-field { position:relative; }
  .ai-field .inp, .ai-field .txa {
    padding-right: 5.5rem;
  }
  .ai-btn {
    position:absolute; top:.38rem; right:.38rem;
    padding:.18rem .45rem;
    background:linear-gradient(135deg,#6366f1,#8b5cf6);
    border:none; border-radius:4px;
    color:#fff; font-size:.58rem; font-weight:700;
    letter-spacing:.03em; cursor:pointer;
    display:flex; align-items:center; gap:.25rem;
    transition:all .15s; white-space:nowrap; z-index:2;
  }
  .ai-btn:hover  { opacity:.85; }
  .ai-btn:disabled { opacity:.35; cursor:not-allowed; }
  .rb.dark .ai-btn {
    background:linear-gradient(135deg,#A07830,#C9A84C);
    color:#080808;
  }
  .ai-btn-spin {
    width:8px; height:8px; border-radius:50%;
    border:1.5px solid rgba(255,255,255,0.3);
    border-top-color:#fff;
    animation:spin .7s linear infinite;
  }
  .rb.dark .ai-btn-spin { border-color:rgba(0,0,0,0.2); border-top-color:#080808; }
  .ai-suggestion-box {
    margin-top:.3rem;
    background:var(--bg-card);
    border:1px solid rgba(99,102,241,0.3);
    border-left:3px solid #6366f1;
    border-radius:0 7px 7px 0;
    padding:.5rem .65rem;
    animation:slideIn .18s ease;
  }
  .rb.dark .ai-suggestion-box {
    border-color:rgba(201,168,76,0.25);
    border-left-color:#C9A84C;
  }
  .ai-sugg-label {
    font-size:.55rem; font-weight:700; letter-spacing:.1em;
    text-transform:uppercase; color:#6366f1; margin-bottom:.28rem;
  }
  .rb.dark .ai-sugg-label { color:#C9A84C; }
  .ai-sugg-text {
    font-size:.74rem; color:var(--tx-secondary);
    line-height:1.6; white-space:pre-wrap; margin-bottom:.4rem;
  }
  .ai-sugg-actions { display:flex; gap:.35rem; }
  .ai-accept {
    padding:.22rem .55rem;
    background:linear-gradient(135deg,#6366f1,#8b5cf6);
    border:none; border-radius:5px;
    color:#fff; font-size:.64rem; font-weight:700;
    cursor:pointer; transition:opacity .15s;
  }
  .ai-accept:hover { opacity:.85; }
  .rb.dark .ai-accept {
    background:linear-gradient(135deg,#A07830,#C9A84C);
    color:#080808;
  }
  .ai-dismiss {
    padding:.22rem .55rem; background:transparent;
    border:1px solid var(--bd); border-radius:5px;
    color:var(--tx-muted); font-size:.64rem; font-weight:600;
    cursor:pointer; transition:all .15s;
  }
  .ai-dismiss:hover { border-color:var(--tx-muted); color:var(--tx-primary); }
  .ai-auto-badge {
    font-size:.55rem; color:var(--tx-muted);
    text-align:right; margin-top:.15rem; letter-spacing:.04em;
  }
  .ai-enhance-btn:hover { opacity:.85; transform:translateY(-1px); }
  .ai-enhance-btn:disabled { opacity:.4; cursor:not-allowed; transform:none; }
  .rb.dark .ai-enhance-btn {
    background:linear-gradient(135deg,#A07830,#C9A84C);
    color:#080808;
  }
  .ai-spin {
    width:9px; height:9px; border-radius:50%;
    border:1.5px solid rgba(255,255,255,0.35);
    border-top-color:#fff;
    animation:spin .7s linear infinite; flex-shrink:0;
  }
  .rb.dark .ai-spin { border-color:rgba(0,0,0,0.25); border-top-color:#080808; }
  .ai-suggestion {
    margin-top:.4rem;
    background:var(--bg-card);
    border:1px solid rgba(99,102,241,0.35);
    border-left:3px solid #6366f1;
    border-radius:0 7px 7px 0;
    padding:.6rem .75rem; font-size:.75rem;
    color:var(--tx-secondary); line-height:1.6;
    animation:slideIn .2s ease;
  }
  .rb.dark .ai-suggestion {
    border-color:rgba(201,168,76,0.3);
    border-left-color:#C9A84C;
  }
  .ai-suggestion-label {
    font-size:.58rem; font-weight:700; letter-spacing:.1em;
    text-transform:uppercase; color:#6366f1;
    margin-bottom:.35rem;
  }
  .rb.dark .ai-suggestion-label { color:#C9A84C; }
  .ai-suggestion-text {
    white-space:pre-wrap; margin-bottom:.5rem;
  }
  .ai-suggestion-actions {
    display:flex; gap:.4rem; margin-top:.45rem;
  }
  .ai-accept-btn {
    padding:.26rem .65rem;
    background:linear-gradient(135deg,#6366f1,#8b5cf6);
    border:none; border-radius:5px;
    color:#fff; font-size:.66rem; font-weight:700;
    cursor:pointer; transition:all .15s;
  }
  .ai-accept-btn:hover { opacity:.85; }
  .rb.dark .ai-accept-btn {
    background:linear-gradient(135deg,#A07830,#C9A84C);
    color:#080808;
  }
  .ai-dismiss-btn {
    padding:.26rem .65rem;
    background:transparent;
    border:1px solid var(--bd); border-radius:5px;
    color:var(--tx-muted); font-size:.66rem; font-weight:600;
    cursor:pointer; transition:all .15s;
  }
  .ai-dismiss-btn:hover { border-color:var(--tx-muted); color:var(--tx-primary); }
  .ai-hint {
    font-size:.58rem; color:var(--tx-muted);
    text-align:right; margin-top:.18rem;
    letter-spacing:.04em;
  }
  .add-btn:hover { border-color:var(--accent); color:var(--accent); background:var(--accent-lt); }

  /* Form footer */
  .rb-form-foot {
    flex-shrink:0; padding:1rem 1.4rem; border-top:1px solid var(--bd);
    background:var(--bg-foot); display:flex; gap:.58rem;
    transition:background .25s,border-color .25s;
  }
  .btn-back {
    padding:.52rem .85rem; background:transparent; min-height:48px;
    border:1px solid var(--bd); border-radius:7px;
    color:var(--tx-secondary); font-family:'DM Sans',sans-serif;
    font-size:.86rem; font-weight:600; cursor:pointer; transition:all .15s;
  }
  .btn-back:hover { border-color:var(--tx-secondary); color:var(--tx-primary); }
  .btn-next {
    flex:1; padding:.52rem; min-height:48px;
    background:var(--btn-next-bg); border:none; border-radius:7px;
    color:var(--btn-next-tx); font-family:'DM Sans',sans-serif;
    font-size:.86rem; font-weight:700; cursor:pointer; transition:all .15s;
  }
  .btn-next:hover { background:var(--btn-next-h); }
  .btn-next:active { transform:scale(.99); }
  .btn-pdf {
    flex:1; padding:.52rem; min-height:48px;
    background:var(--btn-pdf-bg); border:none; border-radius:7px;
    color:var(--btn-pdf-tx); font-family:'DM Sans',sans-serif;
    font-size:.86rem; font-weight:700; cursor:pointer; transition:all .15s;
  }
  .btn-pdf:hover { opacity:.88; }
  .btn-pdf:disabled { opacity:.45; cursor:not-allowed; }

  /* ═══════════════════════════════════════════════════
     PREVIEW PANEL
  ═══════════════════════════════════════════════════ */
  .rb-preview { background:var(--preview-bg); display:flex; flex-direction:column; overflow:hidden; transition:background .25s; }
  .rb-prev-bar {
    flex-shrink:0; background:var(--prev-bar-bg); border-bottom:1px solid var(--bd);
    padding:.52rem 1.1rem; display:flex; align-items:center; gap:.62rem;
    transition:background .25s,border-color .25s;
  }
  .rb-prev-ttl { font-family:'Cinzel',serif; font-size:.58rem; font-weight:600; letter-spacing:.13em; text-transform:uppercase; color:var(--prev-ttl); }
  .rb-live { display:inline-flex; align-items:center; gap:.22rem; font-size:.6rem; font-weight:700; color:var(--live-color); letter-spacing:.07em; text-transform:uppercase; }
  .rb-live-dot { width:5px; height:5px; background:var(--live-dot); border-radius:50%; animation:blink 1.6s infinite; }
  .rb-exp-grp { margin-left:auto; display:flex; gap:.35rem; }
  .exp-btn {
    padding:.3rem .68rem; border-radius:6px;
    font-family:'DM Sans',sans-serif; font-size:.69rem; font-weight:700;
    cursor:pointer; transition:all .15s; display:flex; align-items:center; gap:.22rem;
  }
  .exp-btn:hover { opacity:.84; }
  .exp-btn:disabled { opacity:.35; cursor:not-allowed; }
  .ep-pdf { background:var(--ep-pdf-bg); color:var(--ep-pdf-tx); border:1px solid var(--accent); }
  .ep-doc { background:var(--ep-doc-bg); color:var(--ep-doc-tx); border:1px solid var(--bd); }
  .ep-doc:hover { border-color:var(--accent); }
  .rb-prev-scroll {
    flex:1; overflow-y:auto; padding:1.4rem;
    display:flex; justify-content:center;
    scrollbar-width:thin; scrollbar-color:var(--bd) transparent;
  }

/* ═══════════════════════════════════════════════════
     RESUME DOCUMENT  (white for ATS — always)
  ═══════════════════════════════════════════════════ */
  .rv {
    width:100%; max-width:610px; background:#ffffff; color:#1a1a1a;
    padding:2.2rem 2.4rem; min-height:792px; align-self:flex-start;
    font-family:'Crimson Pro',Georgia,serif;
    font-size:.88rem; line-height:1.6;
    box-shadow:var(--sh-resume);
  }
  .rv-name {
    font-family:'Cinzel',serif; font-size:1.75rem; font-weight:700;
    color:#0f172a; letter-spacing:.06em; line-height:1.2;
    text-align:center; margin-bottom:.2rem;
  }
  .rv-job {
    font-family:'DM Sans',sans-serif; font-size:.76rem; font-weight:500;
    letter-spacing:.18em; text-transform:uppercase;
    color:#64748b; text-align:center; margin-bottom:.5rem;
  }
  .rb.dark .rv-job { color:#8B6914; }
  .rv-contacts {
    margin-top:.3rem; display:flex; flex-wrap:wrap;
    justify-content:center; gap:.1rem .5rem;
  }
  .rv-c {
    display:inline-flex; align-items:center;
    font-family:'DM Sans',sans-serif;
    font-size:.68rem; color:#475569; text-decoration:none;
  }
  .rv-c:not(:last-child)::after { content:'·'; margin:0 .4rem; color:#cbd5e1; }
  .rv-hr {
    height:2px; margin:.85rem 0 1rem; border:none; border-radius:2px;
    background:linear-gradient(90deg,#0f172a,#475569 60%,transparent);
  }
  .rb.dark .rv-hr { background:linear-gradient(90deg,#B8860B,#DAA520 50%,transparent); }
  .rv-sec { margin-bottom:1.1rem; }
  .rv-sh {
    font-family:'Cinzel',serif; font-size:.56rem; font-weight:700;
    letter-spacing:.2em; text-transform:uppercase; color:#0f172a;
    border-bottom:1.5px solid #e2e8f0; padding-bottom:.22rem; margin-bottom:.55rem;
  }
  .rb.dark .rv-sh { color:#8B6914; border-bottom-color:#F0E0A0; }
  .rv-summary { font-size:.85rem; color:#334155; line-height:1.75; margin:0; }
  .rv-entry { margin-bottom:.8rem; }
  .rv-erow { display:flex; justify-content:space-between; align-items:flex-start; gap:.5rem; margin-bottom:.15rem; }
  .rv-etitle {
    font-family:'DM Sans',sans-serif; font-size:.82rem;
    font-weight:700; color:#0f172a; letter-spacing:.01em;
  }
  .rv-eorg {
    font-family:'DM Sans',sans-serif; font-size:.74rem;
    color:#3b82f6; font-weight:500; margin-top:.04rem;
  }
  .rb.dark .rv-eorg { color:#8B6914; }
  .rv-edate {
    font-family:'DM Sans',sans-serif; font-size:.66rem;
    color:#94a3b8; white-space:nowrap; padding-top:.06rem; flex-shrink:0;
  }
  .rv-esub { font-family:'DM Sans',sans-serif; font-size:.72rem; color:#64748b; font-style:italic; margin-top:.04rem; }
  .rv-bul { list-style:none; padding:0; margin-top:.28rem; display:flex; flex-direction:column; gap:.1rem; }
  .rv-bul li {
    font-size:.82rem; color:#334155; line-height:1.6;
    padding-left:.9rem; position:relative;
  }
  .rv-bul li::before { content:'▸'; position:absolute; left:0; color:#3b82f6; font-size:.55rem; top:.2rem; }
  .rb.dark .rv-bul li::before { content:'◆'; color:#B8860B; font-size:.42rem; top:.22rem; }
  .rv-skills { display:flex; flex-wrap:wrap; gap:.3rem; }
  .rv-sk {
    font-family:'DM Sans',sans-serif; font-size:.68rem; font-weight:500;
    background:#f1f5f9; color:#1e293b;
    border:1px solid #e2e8f0; border-radius:4px; padding:.18rem .55rem;
  }
  .rb.dark .rv-sk { background:#FAFAF7; border-color:#E8D88A; color:#5C4A0A; }
  .rv-cert { display:flex; justify-content:space-between; align-items:flex-start; padding:.32rem 0; border-bottom:1px solid #f1f5f9; }
  .rv-cert:last-child { border:none; }
  .rv-cname { font-family:'DM Sans',sans-serif; font-size:.78rem; font-weight:700; color:#0f172a; }
  .rv-corg  { font-family:'DM Sans',sans-serif; font-size:.7rem; color:#64748b; margin-top:.04rem; }
  .rv-cdate { font-family:'DM Sans',sans-serif; font-size:.66rem; color:#94a3b8; flex-shrink:0; }
  .rv-empty { display:flex; flex-direction:column; align-items:center; justify-content:center; min-height:460px; gap:.55rem; text-align:center; }
  .rv-empty-ico { font-size:2.5rem; }
  .rv-empty h3 { font-family:'Cinzel',serif; font-size:.9rem; font-weight:600; color:#475569; letter-spacing:.06em; }
  .rv-empty p  { font-size:.75rem; color:#94a3b8; max-width:220px; line-height:1.6; }
  
  /* ═══════════════════════════════════════════════════
     MOBILE TAB BAR
  ═══════════════════════════════════════════════════ */
  .rb-tabbar { display:none; }

  /* ═══════════════════════════════════════════════════
     RESPONSIVE
  ═══════════════════════════════════════════════════ */
  @media (max-width:960px) {
    .rb-hamburger { display:flex; }
    .rb-badge, .rb-pipe { display:none; }
    .rb-prog-lbl { display:none; }
    .rb-body { grid-template-columns:1fr; grid-template-rows:1fr auto; position:relative; }
    .rb-sidebar { position:absolute; top:0; left:0; width:222px; height:100%; transform:translateX(-100%); transition:transform .25s ease,box-shadow .25s; z-index:200; }
    .rb-sidebar.open { transform:translateX(0); box-shadow:var(--sidebar-open-sh); }
    .rb-overlay { display:block; position:absolute; inset:0; background:var(--overlay-bg); z-index:199; animation:fadeIn .2s; }
    .rb-form-wrap { grid-column:1; grid-row:1; border-right:none; }
    .rb-preview { grid-column:1; grid-row:2; height:320px; min-height:320px; border-top:1px solid var(--bd); }
    .rv { box-shadow:none; padding:1.4rem; min-height:unset; }
  }
  
  @media (max-width:640px) {
    .g2, .g3 { grid-template-columns:1fr; }
  }

  @media (max-width:600px) {
    .rb-hdr { padding:0 .75rem; gap:.45rem; height:48px; min-height:48px; }
    .rb-logo { font-size:.95rem; }
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
    .rb-tab-ico { font-size:1.05rem; line-height:1; }
    .rb-tab-lbl { font-size:.55rem; font-weight:600; letter-spacing:.06em; text-transform:uppercase; }
    .rb-form-top { padding:.8rem .95rem 0; }
    .rb-rule { margin:0 -.95rem; }
    .rb-form-body { padding:.85rem .95rem .6rem; }
    .rb-form-foot { padding:.62rem .95rem; }
    .rv { padding:1.2rem 1.4rem; }
  }
  
  @media (max-width:480px) {
    .rb { font-size: 110%; }
    .ck label { font-size:.88rem; }
    .f > div[style*="align-items: center"] { flex-direction: column; width: 100%; align-items: stretch !important; gap: .4rem !important; }
    .f select { width: 100% !important; min-height: 38px; font-size: .78rem !important; }
  }
  
  @media (max-width:380px) {
    .rb-logo { font-size:.85rem; }
    .rb-prog { display:none; }
  }
`;

/* EtherX geometric logo mark */
const LogoMark = ({ dark }) => (
  <img
    src={dark ? "/logo_dark.jpg" : "/logo_light.jpeg"}
    alt="EtherX Logo"
    style={{
      width: "36px",
      height: "36px",
      objectFit: "contain",
      filter: "none",
      transition: "opacity 0.25s",
    }}
  />
);

/* DATA */
const INIT = {
  personal: { name: "", title: "", email: "", phone: "", location: "", linkedin: "", github: "", website: "" },
  summary: { text: "" },
  experience: [], education: [], skills: [], projects: [], certifications: [],
};
const uid = () => String(Date.now()) + String(Math.random()).slice(2, 7);
const newExp = () => ({ id: uid(), company: "", role: "", start: "", end: "", current: false, bullets: "" });
const newEdu = () => ({ id: uid(), institution: "", degree: "", field: "", start: "", end: "", gpa: "" });
const newProj = () => ({ id: uid(), name: "", tech: "", url: "", bullets: "" });
const newCert = () => ({ id: uid(), name: "", issuer: "", date: "" });

const STEPS = [
  { key: "personal", label: "Personal Info" },
  { key: "summary", label: "Summary" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "skills", label: "Skills" },
  { key: "projects", label: "Projects" },
  { key: "certifications", label: "Certifications" },
];
const SUBS = ["Name, contact details & links", "Brief professional overview", "Roles, companies & achievements", "Degrees & institutions", "Technical & soft skills", "Personal or professional projects", "Licenses & credentials"];
const ICONS = ["👤", "✍️", "💼", "🎓", "⚡", "🚀", "🏅"];
const parseBullets = t => (t || "").split("\n").map(l => l.trim().replace(/^[-•▸◆*]\s*/, "")).filter(Boolean);
const fmtM = m => {
  if (!m) return "";
  const [dd, mo, yyyy] = m.split("-");
  const mon = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][+mo - 1];
  return mon ? `${dd} ${mon} ${yyyy}` : m;
};
/* TAG INPUT */
function TagInput({ value, onChange }) {
  const [v, setV] = useState("");
  const add = () => { const t = v.trim(); if (t && !value.includes(t)) onChange([...value, t]); setV(""); };
  return (
    <div className="tags" onClick={e => e.currentTarget.querySelector("input").focus()}>
      {value.map(t => (
        <span key={t} className="tag">{t}
          <span className="tag-x" onClick={() => onChange(value.filter(x => x !== t))}>×</span>
        </span>
      ))}
      <input className="tag-inp" value={v}
        placeholder={value.length === 0 ? "Type a skill, press Enter" : "+ add more"}
        onChange={e => setV(e.target.value)}
        onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); add(); } }}
        onBlur={add}
      />
    </div>
  );
}
/* ── AI-enhanced single-line input ── */
function AiField({ label, value, onChange, placeholder, type = "text", enhanceFn, required }) {
  const [loading, setLoading] = useState(false);
  const [sugg, setSugg] = useState("");
  const timerRef = useRef(null);

  // auto-trigger after 1.8s of no typing
  const handleChange = (e) => {
    const v = e.target.value;
    onChange(v);
    setSugg("");
    clearTimeout(timerRef.current);
    if (v.trim().length > 10) {
      timerRef.current = setTimeout(() => triggerEnhance(v), 2500);
    }
  };

  const triggerEnhance = async (v) => {
    setLoading(true);
    try { setSugg(await enhanceFn(v)); }
    catch { /* silent fail on auto */ }
    finally { setLoading(false); }
  };

  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div className="f">
      {label && <label className="lbl">{label}{required && <span className="req"> *</span>}</label>}
      <div className="ai-field">
        <input
          className="inp" type={type}
          placeholder={placeholder} value={value}
          onChange={handleChange}
        />
        <button
          className="ai-btn"
          disabled={loading || !value.trim()}
          onClick={() => triggerEnhance(value)}
          title="Enhance with AI"
        >
          {loading ? <span className="ai-btn-spin" /> : "✦ AI"}
        </button>
      </div>
      {sugg && (
        <div className="ai-suggestion-box">
          <div className="ai-sugg-label">✦ AI Suggestion</div>
          <div className="ai-sugg-text">{sugg}</div>
          <div className="ai-sugg-actions">
            <button className="ai-accept" onClick={() => { onChange(sugg); setSugg(""); }}>✓ Replace</button>
            <button className="ai-dismiss" onClick={() => setSugg("")}>✕ Dismiss</button>
          </div>
        </div>
      )}
      {loading && <div className="ai-auto-badge">✦ AI thinking…</div>}
    </div>
  );
}

/* ── AI-enhanced textarea ── */
function AiTextArea({ label, value, onChange, placeholder, rows = 4, enhanceFn }) {
  const [loading, setLoading] = useState(false);
  const [sugg, setSugg] = useState("");
  const timerRef = useRef(null);

  const handleChange = (e) => {
    const v = e.target.value;
    onChange(v);
    setSugg("");
    clearTimeout(timerRef.current);
    if (v.trim().length > 20) {
      timerRef.current = setTimeout(() => triggerEnhance(v), 2500);
    }
  };

  const triggerEnhance = async (v) => {
    setLoading(true);
    try { setSugg(await enhanceFn(v)); }
    catch { /* silent */ }
    finally { setLoading(false); }
  };
  useEffect(() => () => clearTimeout(timerRef.current), []);

  return (
    <div className="f">
      {label && <label className="lbl">{label}</label>}
      <div className="ai-field">
        <textarea
          className="txa" rows={rows}
          style={{ paddingRight: "5.5rem" }}
          placeholder={placeholder} value={value}
          onChange={handleChange}
        />
        <button
          className="ai-btn"
          disabled={loading || !value.trim()}
          onClick={() => triggerEnhance(value)}
          title="Enhance with AI"
        >
          {loading ? <span className="ai-btn-spin" /> : "✦ AI"}
        </button>
      </div>
      {sugg && (
        <div className="ai-suggestion-box">
          <div className="ai-sugg-label">✦ AI Suggestion</div>
          <div className="ai-sugg-text">{sugg}</div>
          <div className="ai-sugg-actions">
            <button className="ai-accept" onClick={() => { onChange(sugg); setSugg(""); }}>✓ Replace with this</button>
            <button className="ai-dismiss" onClick={() => setSugg("")}>✕ Dismiss</button>
          </div>
        </div>
      )}
      {loading && <div className="ai-auto-badge">✦ AI thinking…</div>}
    </div>
  );
}
function PersonalForm({ d, set }) {
  const f = k => v => set({ ...d, [k]: v });
  return (<>
    <div className="g2">
      <AiField label="Full Name" required value={d.name} onChange={f("name")}
        placeholder="e.g. Priya Sharma"
        enhanceFn={v => ENHANCERS.name(v)} />
      <AiField label="Job Title" value={d.title} onChange={f("title")}
        placeholder="e.g. Full Stack Developer"
        enhanceFn={v => ENHANCERS.title(v)} />
    </div>
    <div className="f">
      <label className="lbl">Email <span className="req">*</span></label>
      <input
        className="inp"
        type="email"
        placeholder="you@gmail.com / you@company.com"
        value={d.email}
        onChange={e => set({ ...d, email: e.target.value })}
        onBlur={e => {
          const val = e.target.value.trim();
          const valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);
          const blocked = /^[^@]+@(test|dummy|fake|example|mail|abc|xyz|temp|foo|bar)\./i.test(val);
          if (val && (!valid || blocked)) {
            e.target.setCustomValidity("Please enter a real email address");
            e.target.reportValidity();
          } else {
            e.target.setCustomValidity("");
          }
        }}
      />
    </div>
    <div className="f">
      <label className="lbl">Phone</label>
      <input
        className="inp"
        placeholder="+91 98765 43210"
        value={d.phone}
        maxLength={15}
        onChange={e => {
          // only allow +, digits, spaces, dashes
          const val = e.target.value.replace(/[^\d\s\+\-]/g, "");
          set({ ...d, phone: val });
        }}
        onBlur={e => {
          const digits = e.target.value.replace(/\D/g, "");
          if (e.target.value && digits.length < 10) {
            e.target.setCustomValidity("Phone number must have at least 10 digits");
            e.target.reportValidity();
          } else {
            e.target.setCustomValidity("");
          }
        }}
      />
    </div>
    <AiField label="Location" value={d.location} onChange={f("location")}
      placeholder="Bengaluru, Karnataka"
      enhanceFn={v => ENHANCERS.location(v)} />
    <div className="g2">
      <AiField label="LinkedIn" value={d.linkedin} onChange={f("linkedin")}
        placeholder="linkedin.com/in/username"
        enhanceFn={v => ENHANCERS.linkedin(v)} />
      <AiField label="GitHub" value={d.github} onChange={f("github")}
        placeholder="github.com/username"
        enhanceFn={v => ENHANCERS.github(v)} />
    </div>
    <div className="f"><label className="lbl">Portfolio / Website</label>
      <input className="inp" placeholder="yoursite.dev"
        value={d.website} onChange={e => set({ ...d, website: e.target.value })} />
    </div>
  </>);
}

function SummaryForm({ d, set, personalData }) {
  return (<>
    <div className="tip"><b>💡 Tip —</b> Write a rough summary first — AI will polish it automatically after you stop typing.</div>
    <AiTextArea
      label="Professional Summary"
      value={d.text} onChange={v => set({ text: v })}
      rows={7}
      placeholder="e.g. Full-stack developer with 2 years in React and Node.js..."
      enhanceFn={v => ENHANCERS.summary(v, personalData)}
    />
  </>);
}
/* ── Month/Year picker — 2000 to present, no browser chrome ── */
const MONTHS = [
  { v: "01", l: "Jan", d: 31 }, { v: "02", l: "Feb", d: 28 }, { v: "03", l: "Mar", d: 31 },
  { v: "04", l: "Apr", d: 30 }, { v: "05", l: "May", d: 31 }, { v: "06", l: "Jun", d: 30 },
  { v: "07", l: "Jul", d: 31 }, { v: "08", l: "Aug", d: 31 }, { v: "09", l: "Sep", d: 30 },
  { v: "10", l: "Oct", d: 31 }, { v: "11", l: "Nov", d: 30 }, { v: "12", l: "Dec", d: 31 },
];
const YEARS = Array.from(
  { length: new Date().getFullYear() - 1999 },
  (_, i) => String(new Date().getFullYear() - i)
);

function MonthYearPicker({ value, onChange, disabled = false }) {
  // parse incoming value OR keep local state for partial selections
  const parts = value ? value.split("-") : ["", "", ""];

  const [dd, setDd] = useState(parts[0] || "");
  const [mm, setMm] = useState(parts[1] || "");
  const [yyyy, setYyyy] = useState(parts[2] || "");

  const daysInMonth = (month, year) => {
    if (!month) return 31;
    const found = MONTHS.find(m => m.v === month);
    if (!found) return 31;
    if (month === "02" && year) {
      const y = parseInt(year);
      return (y % 4 === 0 && (y % 100 !== 0 || y % 400 === 0)) ? 29 : 28;
    }
    return found.d;
  };

  const days = Array.from(
    { length: daysInMonth(mm, yyyy) },
    (_, i) => String(i + 1).padStart(2, "0")
  );

  const emit = (ndd, nmm, nyyyy) => {
    // always save whatever is selected so far — full date only when all 3 picked
    if (ndd && nmm && nyyyy) onChange(`${ndd}-${nmm}-${nyyyy}`);
    // don't call onChange("") on partial — keeps previous value intact
  };

  const handleDD = e => {
    setDd(e.target.value);
    emit(e.target.value, mm, yyyy);
  };

  const handleMM = e => {
    const newMm = e.target.value;
    const newMax = daysInMonth(newMm, yyyy);
    const safeDd = dd && parseInt(dd) > newMax ? "" : dd;
    if (safeDd !== dd) setDd(safeDd);
    setMm(newMm);
    emit(safeDd, newMm, yyyy);
  };

  const handleYYYY = e => {
    setYyyy(e.target.value);
    emit(dd, mm, e.target.value);
  };

  const sel = (width) => ({
    width,
    background: "var(--bg-input)",
    border: "1px solid var(--bd-input)",
    borderRadius: "5px",
    color: "var(--tx-input)",
    fontSize: ".7rem",
    padding: ".3rem .25rem",
    fontFamily: "DM Sans,sans-serif",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.35 : 1,
    outline: "none",
    appearance: "auto",
  });

  return (
    <div style={{ display: "flex", gap: ".3rem", alignItems: "center" }}>
      <select style={sel("54px")} value={dd} disabled={disabled} onChange={handleDD}>
        <option value="">DD</option>
        {days.map(d => <option key={d} value={d}>{d}</option>)}
      </select>

      <select style={sel("60px")} value={mm} disabled={disabled} onChange={handleMM}>
        <option value="">MM</option>
        {MONTHS.map(m => <option key={m.v} value={m.v}>{m.l}</option>)}
      </select>

      <select style={sel("70px")} value={yyyy} disabled={disabled} onChange={handleYYYY}>
        <option value="">YYYY</option>
        {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
      </select>
    </div>
  );
}
function ExperienceForm({ d, set }) {
  const upd = (id, k, v) => set(d.map(e => e.id === id ? { ...e, [k]: v } : e));
  return (<>
    <div className="tip"><b>💡 Tip —</b> AI will auto-suggest stronger bullets after you stop typing.</div>
    {d.map((e, i) => (
      <div className="card" key={e.id}>
        <div className="card-badge">#{i + 1}</div>
        <button className="card-del" onClick={() => set(d.filter(x => x.id !== e.id))}>✕ Remove</button>
        <div className="card-body">
          <div className="g2">
            <AiField label="Company" value={e.company} onChange={v => upd(e.id, "company", v)}
              placeholder="e.g. Infosys"
              enhanceFn={v => ENHANCERS.company(v)} />
            <AiField label="Role / Title" value={e.role} onChange={v => upd(e.id, "role", v)}
              placeholder="e.g. Backend Developer"
              enhanceFn={v => ENHANCERS.role(v, { company: e.company })} />
          </div>
          <div className="g2">
            <div className="f"><label className="lbl">Start Date</label>
              <MonthYearPicker value={e.start} onChange={v => upd(e.id, "start", v)} />
            </div>
            <div className="f"><label className="lbl">End Date</label>
              <MonthYearPicker value={e.end} onChange={v => upd(e.id, "end", v)} disabled={e.current} />
            </div>
          </div>
          <div className="ck">
            <input type="checkbox" id={`cur-${e.id}`} checked={e.current}
              onChange={x => upd(e.id, "current", x.target.checked)} />
            <label htmlFor={`cur-${e.id}`}>Currently working here</label>
          </div>
          <AiTextArea
            label="Responsibilities & Achievements"
            value={e.bullets} onChange={v => upd(e.id, "bullets", v)}
            rows={4}
            placeholder={"- Built REST APIs in Node.js\n- Led a team of 4 developers\n- Reduced page load time by 40%"}
            enhanceFn={v => ENHANCERS.bullets(v, { role: e.role, company: e.company })}
          />
        </div>
      </div>
    ))}
    <button className="add-btn" onClick={() => set([...d, newExp()])}>＋ Add Experience</button>
  </>);
}

function EducationForm({ d, set }) {
  const upd = (id, k, v) => set(d.map(e => e.id === id ? { ...e, [k]: v } : e));
  return (<>
    {d.map((e, i) => (
      <div className="card" key={e.id}>
        <div className="card-badge">#{i + 1}</div>
        <button className="card-del" onClick={() => set(d.filter(x => x.id !== e.id))}>✕ Remove</button>
        <div className="card-body">
          <AiField label="Institution" value={e.institution} onChange={v => upd(e.id, "institution", v)}
            placeholder="e.g. VTU / BITS Pilani"
            enhanceFn={v => ENHANCERS.institution(v)} />
          <div className="g2">
            <AiField label="Degree" value={e.degree} onChange={v => upd(e.id, "degree", v)}
              placeholder="B.E. / B.Tech / MCA"
              enhanceFn={v => ENHANCERS.degree(v)} />
            <AiField label="Field of Study" value={e.field} onChange={v => upd(e.id, "field", v)}
              placeholder="Computer Science"
              enhanceFn={v => ENHANCERS.field(v)} />
          </div>
          <div className="g3">
            <div className="f"><label className="lbl">Start Year</label>
              <input className="inp" placeholder="2020" value={e.start}
                onChange={x => upd(e.id, "start", x.target.value)} />
            </div>
            <div className="f"><label className="lbl">End Year</label>
              <input className="inp" placeholder="2024" value={e.end}
                onChange={x => upd(e.id, "end", x.target.value)} />
            </div>
            <div className="f"><label className="lbl">CGPA / %</label>
              <input className="inp" placeholder="8.5 / 85%" value={e.gpa}
                onChange={x => upd(e.id, "gpa", x.target.value)} />
            </div>
          </div>
        </div>
      </div>
    ))}
    <button className="add-btn" onClick={() => set([...d, newEdu()])}>＋ Add Education</button>
  </>);
}

function SkillsForm({ d, set, personalData }) {
  const [loading, setLoading] = useState(false);
  const [sugg, setSugg] = useState([]);

  const enhance = async () => {
    if (!d.length) return;
    setLoading(true);
    try {
      const res = await ENHANCERS.skills(d, personalData);
      const list = res.split(",").map(s => s.trim()).filter(Boolean);
      setSugg(list);
    } catch { /* silent */ }
    finally { setLoading(false); }
  };

  return (<>
    <div className="tip"><b>💡 ATS Tip —</b> Use exact keywords from job descriptions.</div>
    <div className="f">
      <label className="lbl">Skills <span style={{ fontSize: ".6rem", fontWeight: 400, textTransform: "none", letterSpacing: 0, color: "var(--tx-muted)" }}>— press Enter after each</span></label>
      <TagInput value={d} onChange={v => { set(v); setSugg([]); }} />
    </div>
    <button className="ai-btn" style={{ position: "static", width: "100%", justifyContent: "center", padding: ".38rem", marginBottom: ".4rem", borderRadius: "7px" }}
      onClick={enhance} disabled={loading || !d.length}>
      {loading ? <><span className="ai-btn-spin" />Enhancing Skills…</> : "✦ Enhance Skills with AI"}
    </button>
    {sugg.length > 0 && (
      <div className="ai-suggestion-box">
        <div className="ai-sugg-label">✦ AI Suggestion</div>
        <div className="ai-sugg-text">{sugg.join(", ")}</div>
        <div className="ai-sugg-actions">
          <button className="ai-accept" onClick={() => { set(sugg); setSugg([]); }}>✓ Replace with this</button>
          <button className="ai-dismiss" onClick={() => setSugg([])}>✕ Dismiss</button>
        </div>
      </div>
    )}
    <div className="tip" style={{ marginTop: ".4rem" }}><b>Cover:</b> Languages · Frameworks · Databases · DevOps · Cloud · Tools · Soft Skills</div>
  </>);
}

function ProjectsForm({ d, set }) {
  const upd = (id, k, v) => set(d.map(p => p.id === id ? { ...p, [k]: v } : p));
  return (<>
    <div className="tip"><b>💡 Tip —</b> AI will auto-suggest improvements as you type.</div>
    {d.map((p, i) => (
      <div className="card" key={p.id}>
        <div className="card-badge">#{i + 1}</div>
        <button className="card-del" onClick={() => set(d.filter(x => x.id !== p.id))}>✕ Remove</button>
        <div className="card-body">
          <AiField label="Project Name" value={p.name} onChange={v => upd(p.id, "name", v)}
            placeholder="e.g. Smart Resume Platform"
            enhanceFn={v => ENHANCERS.projectName(v)} />
          <div className="g2">
            <AiField label="Tech Stack" value={p.tech} onChange={v => upd(p.id, "tech", v)}
              placeholder="React, Node.js, MongoDB"
              enhanceFn={v => ENHANCERS.tech(v)} />
            <div className="f"><label className="lbl">GitHub / Live URL</label>
              <input className="inp" placeholder="github.com/user/repo"
                value={p.url} onChange={e => upd(p.id, "url", e.target.value)} />
            </div>
          </div>
          <AiTextArea
            label="Description"
            value={p.bullets} onChange={v => upd(p.id, "bullets", v)}
            rows={3}
            placeholder={"- What problem did it solve?\n- How did you build it?\n- What was the outcome?"}
            enhanceFn={v => ENHANCERS.projectBullets(v, { name: p.name, tech: p.tech })}
          />
        </div>
      </div>
    ))}
    <button className="add-btn" onClick={() => set([...d, newProj()])}>＋ Add Project</button>
  </>);
}

function CertificationsForm({ d, set }) {
  const upd = (id, k, v) => set(d.map(c => c.id === id ? { ...c, [k]: v } : c));
  return (<>
    <div className="tip"><b>💡 Tip —</b> Include AWS, Google Cloud, Coursera, NPTEL and other recognised certifications.</div>
    {d.map((c, i) => (
      <div className="card" key={c.id}>
        <div className="card-badge">#{i + 1}</div>
        <button className="card-del" onClick={() => set(d.filter(x => x.id !== c.id))}>✕ Remove</button>
        <div className="card-body">
          <AiField label="Certification Name" value={c.name} onChange={v => upd(c.id, "name", v)}
            placeholder="e.g. AWS Solutions Architect"
            enhanceFn={v => ENHANCERS.certName(v)} />
          <div className="g2">
            <AiField label="Issued By" value={c.issuer} onChange={v => upd(c.id, "issuer", v)}
              placeholder="e.g. Amazon Web Services"
              enhanceFn={v => ENHANCERS.certIssuer(v)} />
            <div className="f"><label className="lbl">Date</label>
              <MonthYearPicker value={c.date} onChange={v => upd(c.id, "date", v)} />
            </div>
          </div>
        </div>
      </div>
    ))}
    <button className="add-btn" onClick={() => set([...d, newCert()])}>＋ Add Certification</button>
  </>);
}
/* RESUME PREVIEW */
function ResumePreview({ data }) {
  const { personal: p, summary: s, experience, education, skills, projects, certifications } = data;
  const hasContent = p.name || s.text || experience.length || education.length || skills.length;
  const contacts = [
    p.email && { label: p.email, href: `mailto:${p.email}` },
    p.phone && { label: p.phone, href: null },
    p.location && { label: p.location, href: null },
    p.linkedin && { label: p.linkedin, href: `https://${p.linkedin}` },
    p.github && { label: p.github, href: `https://${p.github}` },
    p.website && { label: p.website, href: `https://${p.website}` },
  ].filter(Boolean);

  if (!hasContent) return (
    <div className="rv">
      <div className="rv-empty">
        <div className="rv-empty-ico">📄</div>
        <h3>Your Resume Appears Here</h3>
        <p>Fill in the form on the left and your resume will update live.</p>
      </div>
    </div>
  );
  return (
    <div className="rv" id="resume-output">
      <div className="rv-name">{p.name || "Your Name"}</div>
      {p.title && <div className="rv-job">{p.title}</div>}
      {contacts.length > 0 && (
        <div className="rv-contacts">
          {contacts.map((c, i) => c.href
            ? <a key={i} className="rv-c" href={c.href} target="_blank" rel="noreferrer">{c.label}</a>
            : <span key={i} className="rv-c">{c.label}</span>
          )}
        </div>
      )}
      <div className="rv-hr" />
      {s.text && <div className="rv-sec"><div className="rv-sh">Professional Summary</div><p className="rv-summary">{s.text}</p></div>}
      {experience.length > 0 && <div className="rv-sec"><div className="rv-sh">Work Experience</div>
        {experience.map(e => (
          <div className="rv-entry" key={e.id}>
            <div className="rv-erow">
              <div><div className="rv-etitle">{e.role || "Role"}</div><div className="rv-eorg">{e.company}</div></div>
              <div className="rv-edate">{fmtM(e.start)}{e.start ? " – " : ""}{e.current ? "Present" : fmtM(e.end)}</div>
            </div>
            {e.bullets && <ul className="rv-bul">{parseBullets(e.bullets).map((b, i) => <li key={i}>{b}</li>)}</ul>}
          </div>
        ))}
      </div>}
      {projects.length > 0 && <div className="rv-sec"><div className="rv-sh">Projects</div>
        {projects.map(p => (
          <div className="rv-entry" key={p.id}>
            <div className="rv-erow">
              <div><div className="rv-etitle">{p.name || "Project"}</div>{p.tech && <div className="rv-esub">{p.tech}</div>}</div>
              {p.url && <a className="rv-edate" style={{ color: "#3b82f6", textDecoration: "none" }} href={`https://${p.url}`} target="_blank" rel="noreferrer">{p.url}</a>}
            </div>
            {p.bullets && <ul className="rv-bul">{parseBullets(p.bullets).map((b, i) => <li key={i}>{b}</li>)}</ul>}
          </div>
        ))}
      </div>}
      {education.length > 0 && <div className="rv-sec"><div className="rv-sh">Education</div>
        {education.map(e => (
          <div className="rv-entry" key={e.id}>
            <div className="rv-erow">
              <div><div className="rv-etitle">{[e.degree, e.field].filter(Boolean).join(" in ") || "Degree"}</div><div className="rv-eorg">{e.institution}</div></div>
              <div className="rv-edate">{e.start}{e.start && e.end ? " – " : ""}{e.end}</div>
            </div>
            {e.gpa && <div className="rv-esub" style={{ marginTop: ".06rem" }}>CGPA / Score: {e.gpa}</div>}
          </div>
        ))}
      </div>}
      {skills.length > 0 && <div className="rv-sec"><div className="rv-sh">Skills</div>
        <div className="rv-skills">{skills.map(s => <span key={s} className="rv-sk">{s}</span>)}</div>
      </div>}
      {certifications.length > 0 && <div className="rv-sec"><div className="rv-sh">Certifications</div>
        {certifications.map(c => (
          <div className="rv-cert" key={c.id}>
            <div><div className="rv-cname">{c.name}</div>{c.issuer && <div className="rv-corg">{c.issuer}</div>}</div>
            <div className="rv-cdate">{fmtM(c.date)}</div>
          </div>
        ))}
      </div>}
    </div>
  );
}

/* MAIN APP */
export default function ResumeBuilder({ templateId = "classic", onBack }) {
  const dark = true;
  const [step, setStep] = useState(0);
  const [visited, setVisited] = useState(new Set([0]));
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem("etherx_resume");
      return saved ? JSON.parse(saved) : INIT;
    } catch { return INIT; }
  });
  const [sideOpen, setSideOpen] = useState(false);
  const [mobTab, setMobTab] = useState("form");
  const [exporting, setExporting] = useState(false);
  const [banner, setBanner] = useState({ show: false, type: "", msg: "" });
  useEffect(() => { localStorage.setItem("etherx_resume", JSON.stringify(data)); }, [data]);
  const go = n => { setStep(n); setVisited(p => new Set([...p, n])); setSideOpen(false); };
  const setter = k => v => setData(p => ({ ...p, [k]: v }));
  const pct = Math.round((visited.size / STEPS.length) * 100);

  const showBanner = (type, msg, ms = 4000) => {
    setBanner({ show: true, type, msg });
    setTimeout(() => setBanner({ show: false, type: "", msg: "" }), ms);
  };

  const handleExport = async type => {
    if (typeof window === "undefined" || typeof document === "undefined") return;
    
    if (!data.personal.name.trim()) {
      showBanner("error", "Please fill in your name before exporting.");
      return;
    }
    setExporting(true);

    if (type === "pdf") {
      showBanner("loading", "Generating PDF…", 30000);
      const isMobileHidden = window.innerWidth <= 600 && mobTab !== "preview";
      const originalTab = mobTab;

      try {
        if (isMobileHidden) {
          setMobTab("preview");
          await new Promise(resolve => setTimeout(resolve, 300));
        }

        const el = document.getElementById("resume-output");
        if (!el) throw new Error("Resume preview not found.");

        const html2canvasModule = await import("html2canvas");
        const html2canvas = html2canvasModule.default ? html2canvasModule.default : html2canvasModule;
        const jsPDFModule = await import("jspdf");
        const jsPDF = jsPDFModule.jsPDF ? jsPDFModule.jsPDF : jsPDFModule.default;

        const canvas = await html2canvas(el, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
          removeContainer: true,
          foreignObjectRendering: false,
          ignoreElements: (el) =>
            el.classList?.contains("rb-prev-bar") ||
            el.classList?.contains("rb-tabbar"),

        });

        const imgData = canvas.toDataURL("image/jpeg", 0.82);
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();
        const imgW = pageW;
        const imgH = (canvas.height * pageW) / canvas.width;

        let y = 0;
        while (y < imgH) {
          if (y > 0) pdf.addPage();
          pdf.addImage(imgData, "JPEG", 0, -y, imgW, imgH);
          y += pageH;
        }

        pdf.save(`${(data.personal.name || "resume").replace(/\s+/g, "_")}_${templateId}_resume.pdf`);
        showBanner("success", "Download started! Check your Downloads folder.");
      } catch (err) {
        showBanner("error", err.message || "PDF export failed.");
      } finally {
        if (isMobileHidden) {
          setMobTab(originalTab);
        }
        setExporting(false);
      }

    } else {
      // Word still goes to FastAPI backend — keeps template styling via palette
      showBanner("loading", "Generating Word document…", 30000);
      try {
        const res = await fetch(`${API}/api/export/docx`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...data, templateId }),
        });
        if (!res.ok) throw new Error("Export failed — the export service is temporarily unavailable.");
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${(data.personal.name || "resume").replace(/\s+/g, "_")}_${templateId}_resume.docx`;
        a.click();
        URL.revokeObjectURL(url);
        showBanner("success", "Download started! Check your Downloads folder.");
      } catch (err) {
        showBanner("error", err.message || "Export failed. Please try again later.");
      } finally {
        setExporting(false);
      }
    }
  };

  const forms = [
    <PersonalForm d={data.personal} set={setter("personal")} />,
    <SummaryForm d={data.summary} set={setter("summary")} personalData={data.personal} />,
    <ExperienceForm d={data.experience} set={setter("experience")} />,
    <EducationForm d={data.education} set={setter("education")} />,
    <SkillsForm d={data.skills} set={setter("skills")} personalData={data.personal} />,
    <ProjectsForm d={data.projects} set={setter("projects")} />,
    <CertificationsForm d={data.certifications} set={setter("certifications")} />,
  ];

  const [t1, ...rest] = STEPS[step].label.split(" ");
  const t2 = rest.join(" ");

  return (
    <>
      <style>{STYLES}</style>
      <div className={`rb${dark ? " dark" : ""}`}>

        {/* HEADER */}
        <header className="rb-hdr">
          <button className="rb-hamburger" onClick={() => setSideOpen(o => !o)} aria-label="Menu">☰</button>
          {onBack && (
            <button
              onClick={onBack}
              title="Back to Templates"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "5px",
                background: "transparent",
                border: "1px solid rgba(201,168,76,0.35)",
                color: "#C9A84C",
                fontFamily: "'DM Sans', sans-serif",
                fontSize: ".72rem",
                fontWeight: 600,
                letterSpacing: ".04em",
                padding: ".28rem .75rem",
                borderRadius: "7px",
                cursor: "pointer",
                marginRight: "6px",
                transition: "all .15s",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(201,168,76,0.1)"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              ← Templates
            </button>
          )}

          <div className="rb-logomark"><LogoMark dark={dark} /></div>

          <div className="rb-logo-wrap">
            <div className="rb-logo">EtherX</div>
            <div className="rb-logo-sub">Resume Builder</div>
          </div>

          <div className="rb-pipe" />
          <span className="rb-badge">ATS-Friendly</span>

          <div className="rb-hright">
            <div className="rb-prog">
              <span className="rb-prog-lbl">Progress</span>
              <div className="rb-prog-track"><div className="rb-prog-fill" style={{ width: `${pct}%` }} /></div>
              <span className="rb-prog-pct">{pct}%</span>
            </div>
            {/* THEME TOGGLE */}
            {/* RESET */}
            <button
              className="rb-icon-btn"
              onClick={() => {
                if (window.confirm("Clear all data and start fresh?")) {
                  localStorage.removeItem("etherx_resume");
                  setData(INIT);
                  setStep(0);
                  setVisited(new Set([0]));
                }
              }}
              title="Start Fresh"
            >🗑</button>
            {/* THEME TOGGLE (Removed) */}
          </div>
        </header>

        {/* STATUS BANNER */}
        {banner.show && (
          <div className={`rb-banner ${banner.type}`}>
            {banner.type === "loading" && <span className="rb-spin" />}
            <span>{banner.msg}</span>
          </div>
        )}

        {/* BODY */}
        <div className="rb-body">
          {sideOpen && <div className="rb-overlay" onClick={() => setSideOpen(false)} />}

          {/* SIDEBAR */}
          <aside className={`rb-sidebar${sideOpen ? " open" : ""}`}>
            <div className="rb-sidebar-ttl">Sections</div>
            <ul className="rb-nav">
              {STEPS.map((s, i) => (
                <li key={s.key}
                  className={`rb-ni ${i === step ? "active" : ""} ${visited.has(i) && i !== step ? "done" : ""}`}
                  onClick={() => go(i)}
                >
                  <span className="rb-ni-num">{visited.has(i) && i !== step ? "✓" : i + 1}</span>
                  <span className="rb-ni-lbl">{ICONS[i]} {s.label}</span>
                </li>
              ))}
            </ul>
            <div className="rb-sidebar-export">
              <button className="rb-exp-pdf" onClick={() => handleExport("pdf")} disabled={exporting}>
                {exporting ? "Generating…" : "⬇ Download PDF"}
              </button>
              <button className="rb-exp-doc" onClick={() => handleExport("docx")} disabled={exporting}>
                {exporting ? "Generating…" : "⬇ Download Word"}
              </button>
            </div>
          </aside>

          {/* FORM */}
          <div className="rb-form-wrap">
            <div className="rb-form-top">
              <div className="rb-sec-ttl">{t1}{t2 && <> <em>{t2}</em></>}</div>
              <div className="rb-sec-sub">{SUBS[step]}</div>
              <div className="rb-rule" />
            </div>
            <div className="rb-form-body">{forms[step]}</div>
            {step === STEPS.length - 1 && <ATSPanel data={data} dark={dark} />}
            <div className="rb-form-foot">
              {step > 0 && <button className="btn-back" onClick={() => go(step - 1)}>← Back</button>}
              {step < STEPS.length - 1
                ? <button className="btn-next" onClick={() => go(step + 1)}>Save &amp; Continue →</button>
                : <button className="btn-pdf" onClick={() => handleExport("pdf")} disabled={exporting}>
                  {exporting ? "Generating…" : "⬇ Download PDF"}
                </button>
              }
            </div>
          </div>

          {/* PREVIEW */}
          <div className={`rb-preview${mobTab === "preview" ? " mob-show" : ""}`}>
            <div className="rb-prev-bar">
              <span className="rb-prev-ttl">Live Preview</span>
              <span className="rb-live"><span className="rb-live-dot" />Live</span>
              <div className="rb-exp-grp">
                <button className="exp-btn ep-pdf" onClick={() => handleExport("pdf")} disabled={exporting}>⬇ PDF</button>
                <button className="exp-btn ep-doc" onClick={() => handleExport("docx")} disabled={exporting}>⬇ Word</button>
              </div>
            </div>
            <div className="rb-prev-scroll">
              <SelectedTemplate data={data} templateId={templateId} />
            </div>
          </div>
        </div>

        {/* MOBILE TAB BAR */}
        <div className="rb-tabbar">
          <button className={`rb-tab${mobTab === "form" ? " active" : ""}`} onClick={() => setMobTab("form")}>
            <span className="rb-tab-ico">📝</span><span className="rb-tab-lbl">Form</span>
          </button>
          <button className={`rb-tab${mobTab === "preview" ? " active" : ""}`} onClick={() => setMobTab("preview")}>
            <span className="rb-tab-ico">👁</span><span className="rb-tab-lbl">Preview</span>
          </button>
          <button className="rb-tab" onClick={() => handleExport("pdf")} disabled={exporting}>
            <span className="rb-tab-ico">⬇</span><span className="rb-tab-lbl">PDF</span>
          </button>
          <button className="rb-tab" onClick={() => handleExport("docx")} disabled={exporting}>
            <span className="rb-tab-ico">📄</span><span className="rb-tab-lbl">Word</span>
          </button>
        </div>

      </div>
    </>
  );
}
