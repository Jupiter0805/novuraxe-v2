// pages/jugador.jsx
// ─────────────────────────────────────────────
// NOVURAXE — Portal del Jugador
// Login · Feed · Organizadores · Stats · Historial · Ajustes
// ─────────────────────────────────────────────
import { useEffect, useState, useRef, useCallback } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

// ─── CSS inyectado (específico de esta página) ─
const PAGE_CSS = `
:root {
  --bg:#1a1410; --bg2:#2c2418; --bg3:#3e3025;
  --ink:#fdfaf7; --ink2:#f0ebe3; --ink3:#b5a898; --ink4:#6b5d4e;
  --line:rgba(255,255,255,0.08); --line2:rgba(255,255,255,0.14);
  --accent:#c4873a; --accent2:#d4975a;
  --accent-bg:rgba(196,135,58,0.12); --accent-ln:rgba(196,135,58,0.3);
  --sand:#c4a96a; --sand-bg:rgba(196,169,106,0.12);
  --green:#6ab187; --green-bg:rgba(74,124,89,0.15);
  --red:#d4635a; --red-bg:rgba(184,64,64,0.15); --red-ln:rgba(184,64,64,0.3);
  --r:8px; --r2:12px;
  --sh:0 2px 12px rgba(0,0,0,0.35); --sh2:0 8px 32px rgba(0,0,0,0.5);
  --f:'Segoe UI',system-ui,sans-serif; --f-display:'Bebas Neue',sans-serif;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:var(--f);background:var(--bg);color:var(--ink);font-size:14px;line-height:1.5;min-height:100vh;-webkit-font-smoothing:antialiased}
body::before{content:'';position:fixed;inset:0;background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");pointer-events:none;z-index:0;opacity:0.3}
::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:#1a1410}::-webkit-scrollbar-thumb{background:rgba(196,135,58,0.3);border-radius:10px}::-webkit-scrollbar-thumb:hover{background:var(--accent)}
button{cursor:pointer;font-family:inherit}
input,textarea,select{font-family:inherit}

/* LOGIN */
.login-screen{display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:100vh;padding:2rem;background:linear-gradient(160deg,#2c2418 0%,#1a1410 60%);position:relative;overflow:hidden}
.login-screen::before{content:'';position:absolute;width:600px;height:600px;background:radial-gradient(ellipse,rgba(196,135,58,0.07) 0%,transparent 70%);top:-200px;right:-200px;pointer-events:none}
.login-logo{display:flex;flex-direction:column;align-items:center;margin-bottom:2rem;position:relative;z-index:1}
.login-logo img{height:52px;width:auto;filter:brightness(0) invert(1)}
.login-logo-sub{font-size:9px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-top:8px}
.login-role-tag{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--ink4);border:1px solid rgba(255,255,255,0.1);padding:4px 12px;border-radius:20px;margin-top:6px}
.login-box{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:var(--r2);padding:2rem;width:100%;max-width:400px;position:relative;z-index:1;backdrop-filter:blur(8px)}
.l-tabs{display:flex;gap:4px;background:rgba(255,255,255,0.05);border-radius:var(--r);padding:4px;margin-bottom:1.5rem}
.l-tab{flex:1;font-size:12px;font-weight:700;letter-spacing:0.5px;text-transform:uppercase;background:transparent;border:none;color:var(--ink4);padding:8px;border-radius:calc(var(--r) - 2px);transition:all 0.2s}
.l-tab.on{background:var(--accent);color:#fff}
.field{margin-bottom:1rem}
.f-label{display:block;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--ink4);margin-bottom:6px}
.f-input{width:100%;background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,255,255,0.1);border-radius:var(--r);color:var(--ink);font-size:14px;padding:0.65rem 0.875rem;outline:none;transition:all 0.15s}
.f-input:focus{border-color:var(--accent);background:rgba(255,255,255,0.08);box-shadow:0 0 0 3px rgba(196,135,58,0.15)}
.f-input::placeholder{color:var(--ink4)}
.pass-wrap{position:relative;display:flex;align-items:center}
.pass-wrap .f-input{padding-right:2.5rem}
.pass-eye{position:absolute;right:0;width:36px;height:100%;background:none;border:none;cursor:pointer;font-size:14px;color:var(--ink3);opacity:0.6;display:flex;align-items:center;justify-content:center}
.pass-eye:hover{opacity:1}
.err-msg{font-size:12px;color:var(--red);margin-bottom:0.75rem;font-weight:500}
.btn-full{width:100%;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;background:var(--accent);color:#1a1410;border:none;border-radius:var(--r);padding:12px;transition:all 0.2s}
.btn-full:hover{background:var(--accent2);transform:translateY(-1px);box-shadow:0 6px 20px rgba(196,135,58,0.35)}
.link-small{font-size:11px;color:var(--ink4);cursor:pointer;text-decoration:underline;text-underline-offset:3px;background:none;border:none;transition:color 0.2s}
.link-small:hover{color:var(--ink3)}

/* APP SHELL */
.app-shell{display:flex;flex-direction:column;min-height:100vh;background:transparent;position:relative;z-index:1}

/* TOPBAR */
.topbar{position:sticky;top:0;z-index:200;height:72px;background:rgba(26,20,16,0.92);backdrop-filter:blur(12px);border-bottom:1px solid rgba(196,135,58,0.15);display:flex;align-items:center;padding:0 1.5rem;gap:1rem;box-shadow:0 1px 20px rgba(0,0,0,0.4)}
.t-logo img{height:30px;width:auto;filter:brightness(0) invert(1)}
.t-sep{width:1px;height:22px;background:rgba(255,255,255,0.1);flex-shrink:0}
.t-role-badge{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--accent);border:1px solid rgba(196,135,58,0.3);padding:3px 10px;border-radius:20px}
.t-nav{display:flex;gap:2px}
.t-nav-btn{font-size:12px;font-weight:600;color:rgba(255,255,255,0.75);background:transparent;border:none;border-radius:var(--r);padding:6px 12px;transition:all 0.15s}
.t-nav-btn:hover{background:rgba(255,255,255,0.08);color:#fff}
.t-nav-btn.on{background:rgba(196,135,58,0.15);color:var(--accent);font-weight:800}
.t-right{margin-left:auto;display:flex;align-items:center;gap:0.75rem}
.t-username{font-size:12px;font-weight:600;color:#fff}
.btn{display:inline-flex;align-items:center;gap:6px;font-size:12px;font-weight:700;letter-spacing:0.3px;padding:8px 16px;border-radius:var(--r);border:none;cursor:pointer;transition:all 0.15s;white-space:nowrap}
.btn:hover{filter:brightness(1.1);transform:translateY(-1px)}
.btn-accent{background:var(--accent);color:#1a1410}
.btn-ghost{background:transparent;color:var(--ink3);border:1.5px solid rgba(255,255,255,0.15)}
.btn-ghost:hover{border-color:rgba(255,255,255,0.3);background:rgba(255,255,255,0.07)}
.btn-sm{font-size:11px;padding:6px 12px}
.btn-danger{background:var(--red);color:#fff}
.btn-link{background:none;border:none;color:var(--accent);font-size:12px;font-weight:600;cursor:pointer;padding:0;text-decoration:underline;text-underline-offset:2px}
.btn-link:hover{color:var(--accent2)}

/* CONTENT */
.content{width:100%;max-width:1100px;margin:0 auto;padding:2rem 1.5rem;box-sizing:border-box}
.pg-eyebrow{font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--accent);display:flex;align-items:center;gap:8px;margin-bottom:6px}
.pg-eyebrow::before{content:'';width:20px;height:1px;background:var(--accent)}
.pg-title{font-size:1.9rem;font-weight:800;letter-spacing:1px;font-family:var(--f-display);text-transform:uppercase;color:var(--ink);line-height:1.1;margin-bottom:4px}
.pg-title em{color:var(--accent);font-style:normal}
.pg-sub{font-size:11px;color:var(--ink4);letter-spacing:0.5px;margin-bottom:2rem}
.card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:var(--r2);padding:1.375rem;box-shadow:var(--sh);transition:all 0.2s}
.card:hover{border-color:rgba(196,135,58,0.2)}
.card-title{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--ink4);margin-bottom:1rem}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.g3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:1rem}
.g4{display:grid;grid-template-columns:repeat(4,1fr);gap:0.875rem}
.stat-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:var(--r2);padding:1.25rem 1.375rem;transition:all 0.2s}
.stat-card:hover{border-color:rgba(196,135,58,0.3);background:rgba(196,135,58,0.06)}
.stat-n{font-size:2rem;font-weight:800;color:var(--accent);font-family:var(--f-display);line-height:1;letter-spacing:0}
.stat-n.green{color:var(--green)}
.stat-n.sand{color:var(--sand)}
.stat-l{font-size:10px;font-weight:600;color:var(--ink4);letter-spacing:1px;text-transform:uppercase;margin-top:4px}

/* FEED LAYOUT */
.feed-layout{display:grid;grid-template-columns:240px minmax(0,1fr);gap:1.75rem;align-items:start;width:100%}
.feed-sidebar{position:sticky;top:72px;grid-column:1;overflow:hidden}
.feed-main{grid-column:2;min-width:0;width:100%}
.feed-stream{display:flex;flex-direction:column;gap:1rem;max-width:620px}

/* SIDEBAR */
.sidebar-profile{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:var(--r2);overflow:visible;margin-bottom:1rem;width:100%;box-sizing:border-box}
.sidebar-cover{height:68px;border-radius:var(--r2) var(--r2) 0 0;background:linear-gradient(135deg,rgba(196,135,58,0.3) 0%,rgba(120,80,20,0.1) 100%);overflow:hidden}
.sidebar-avatar-wrap{padding:0 1.25rem;margin-top:-34px;margin-bottom:0.5rem;position:relative;z-index:1}
.sidebar-avatar{width:68px;height:68px;border-radius:50%;background:#2a2018;border:3px solid #2a2018;box-shadow:0 0 0 2px rgba(196,135,58,0.5);display:flex;align-items:center;justify-content:center;font-size:1.8rem;overflow:hidden;flex-shrink:0}
.sidebar-info{padding:0 1.25rem 1rem}
.sidebar-name{font-size:17px;font-weight:800;color:#fff;font-family:var(--f-display);letter-spacing:0.5px;line-height:1.2}
.sidebar-username{font-size:12px;color:rgba(255,255,255,0.4);margin-top:3px}
.sidebar-divider{height:1px;background:rgba(255,255,255,0.06);margin:0}
.sidebar-stats{display:grid;grid-template-columns:1fr 1fr}
.sidebar-stat{padding:0.875rem 0.5rem;text-align:center;border-right:1px solid rgba(255,255,255,0.05);border-bottom:1px solid rgba(255,255,255,0.05);cursor:pointer;transition:background 0.15s}
.sidebar-stat:hover{background:rgba(255,255,255,0.04)}
.sidebar-stat:nth-child(even){border-right:none}
.sidebar-stat-n{font-size:1.4rem;font-weight:800;color:var(--accent);line-height:1}
.sidebar-stat-n.g{color:var(--green)}
.sidebar-stat-n.s{color:var(--sand)}
.sidebar-stat-n.w{color:#fff}
.sidebar-stat-l{font-size:9px;color:rgba(255,255,255,0.35);letter-spacing:1px;text-transform:uppercase;margin-top:3px}
.sidebar-following{padding:1rem 1.25rem}
.sidebar-section-title{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-bottom:0.75rem}
.sidebar-org-row{display:flex;align-items:center;gap:10px;padding:8px 0;cursor:pointer;transition:all 0.15s}
.sidebar-org-mini{width:34px;height:34px;border-radius:50%;flex-shrink:0;background:var(--bg3);border:1px solid rgba(255,255,255,0.08);display:flex;align-items:center;justify-content:center;font-size:0.7rem;overflow:hidden}
.sidebar-org-mini img{width:100%;height:100%;object-fit:contain}
.sidebar-org-name{font-size:14px;font-weight:600;color:rgba(255,255,255,0.7);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}

/* FILTER BUTTONS */
.feed-filters{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:1.25rem}
.filter-btn{font-size:11px;font-weight:700;letter-spacing:0.5px;padding:6px 14px;border-radius:20px;border:1.5px solid rgba(255,255,255,0.12);background:transparent;color:var(--ink3);transition:all 0.15s}
.filter-btn:hover{border-color:var(--accent);color:var(--accent)}
.filter-btn.on{background:var(--accent);border-color:var(--accent);color:#1a1410}

/* EVENT CARDS */
.event-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:var(--r2);overflow:hidden;transition:all 0.2s;cursor:pointer;display:flex;flex-direction:column}
.event-card:hover{border-color:rgba(196,135,58,0.3);background:rgba(255,255,255,0.06);transform:translateY(-2px)}
.event-card-accent{height:3px}
.event-card-body{padding:1.125rem 1.25rem 0.75rem;flex:1}
.event-card-top{display:flex;align-items:flex-start;justify-content:space-between;gap:10px;margin-bottom:0.75rem}
.event-card-title{font-size:14px;font-weight:800;color:#fff;line-height:1.3}
.event-card-club{font-size:11px;color:var(--ink4);margin-top:4px}
.event-meta{display:flex;flex-direction:column;gap:4px}
.event-meta-item{display:flex;align-items:center;gap:6px;font-size:12px;color:var(--ink3)}
.event-card-footer{padding:0.75rem 1.25rem;border-top:1px solid rgba(255,255,255,0.06);display:flex;align-items:center;justify-content:space-between}
.event-spots{font-size:12px;color:var(--ink4)}

/* BADGES */
.badge{display:inline-flex;align-items:center;font-size:10px;font-weight:700;letter-spacing:0.5px;padding:3px 8px;border-radius:20px;flex-shrink:0}
.badge-open{background:rgba(106,177,135,0.12);color:var(--green);border:1px solid rgba(106,177,135,0.25)}
.badge-soon{background:rgba(196,135,58,0.12);color:var(--accent);border:1px solid rgba(196,135,58,0.25)}
.badge-full{background:rgba(212,99,90,0.1);color:var(--red);border:1px solid rgba(212,99,90,0.25)}
.badge-done{background:rgba(255,255,255,0.07);color:var(--ink4);border:1px solid rgba(255,255,255,0.1)}
.badge-cancel{background:rgba(212,99,90,0.1);color:var(--red);border:1px solid rgba(212,99,90,0.25)}

/* POST CARDS */
.post-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;overflow:hidden;transition:border-color 0.2s,background 0.2s;cursor:pointer}
.post-card:hover{border-color:rgba(196,135,58,0.25);background:rgba(255,255,255,0.055)}
.post-header{display:flex;align-items:center;gap:10px;padding:14px 16px 0}
.post-avatar{width:40px;height:40px;border-radius:50%;flex-shrink:0;background:var(--bg3);border:1.5px solid rgba(196,135,58,0.25);display:flex;align-items:center;justify-content:center;font-size:1rem;overflow:hidden}
.post-avatar img{width:100%;height:100%;object-fit:contain}
.post-author-name{font-size:13px;font-weight:700;color:#fff;line-height:1}
.post-author-date{font-size:11px;color:rgba(255,255,255,0.35);margin-top:3px}
.post-kebab{margin-left:auto;background:none;border:none;color:rgba(255,255,255,0.3);font-size:18px;line-height:1;padding:4px 8px;border-radius:6px;cursor:pointer;transition:all 0.15s}
.post-kebab:hover{background:rgba(255,255,255,0.08);color:#fff}
.post-body{padding:10px 16px 4px}
.post-title{font-size:14px;font-weight:700;color:#fff;margin-bottom:5px;line-height:1.35}
.post-desc{font-size:13px;color:rgba(255,255,255,0.55);line-height:1.65}
.post-img-wrap{margin:10px 16px;border-radius:10px;overflow:hidden;border:1px solid rgba(255,255,255,0.07);background:var(--bg3)}
.post-img-wrap img{width:100%;height:auto;max-height:600px;object-fit:contain;display:block}
.post-tags{display:flex;flex-wrap:wrap;gap:6px;padding:6px 16px 10px}
.post-tag{font-size:11px;color:var(--accent);background:rgba(196,135,58,0.1);border:1px solid rgba(196,135,58,0.2);padding:3px 10px;border-radius:20px;display:flex;align-items:center;gap:4px}
.post-type-badge{display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:3px 10px;border-radius:20px;margin-bottom:6px}
.badge-torneo{background:rgba(196,135,58,0.12);color:var(--accent);border:1px solid rgba(196,135,58,0.25)}
.badge-aviso{background:rgba(239,68,68,0.1);color:#f87171;border:1px solid rgba(239,68,68,0.25)}
.badge-info{background:rgba(99,179,237,0.1);color:#63b3ed;border:1px solid rgba(99,179,237,0.25)}
.post-prizes{margin-top:0.75rem;padding-top:0.75rem;border-top:1px solid rgba(255,255,255,0.07);display:flex;flex-direction:column;gap:5px}
.post-prizes-title{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.35);margin-bottom:4px}
.post-prize-row{display:flex;align-items:center;gap:8px;font-size:13px;color:rgba(255,255,255,0.7)}
.feed-reg-pill{display:inline-flex;align-items:center;gap:4px;font-size:11px;font-weight:700;padding:4px 10px;border-radius:20px;border:1px solid transparent}
.pill-open{background:rgba(76,217,138,0.12);color:#4cd98a;border-color:rgba(76,217,138,0.25)}
.pill-closed{background:rgba(255,255,255,0.06);color:var(--ink3);border-color:rgba(255,255,255,0.1)}
.pill-full{background:rgba(239,68,68,0.1);color:#e05555;border-color:rgba(239,68,68,0.2)}
.pill-registered{background:rgba(196,135,58,0.12);color:var(--accent);border-color:rgba(196,135,58,0.25)}
.pill-started{background:rgba(59,130,246,0.1);color:#60a5fa;border-color:rgba(59,130,246,0.2)}
.reg-action-box{display:flex;align-items:center;gap:12px;margin-top:14px;padding:12px 14px;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:10px}

/* ORGS */
.orgs-search-bar{display:flex;align-items:center;gap:10px;background:rgba(255,255,255,0.05);border:1.5px solid rgba(255,255,255,0.1);border-radius:var(--r);padding:0 14px;margin-bottom:1.5rem;transition:border-color 0.15s}
.orgs-search-bar:focus-within{border-color:var(--accent)}
.orgs-search-icon{font-size:14px;color:var(--ink4)}
.orgs-search-input{flex:1;background:transparent;border:none;outline:none;color:var(--ink);font-size:14px;padding:0.75rem 0}
.orgs-search-input::placeholder{color:var(--ink4)}
.org-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1rem}
.org-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:var(--r2);overflow:hidden;transition:all 0.2s}
.org-card:hover{border-color:rgba(196,135,58,0.25);transform:translateY(-2px)}
.org-card-cover{height:64px;background:linear-gradient(135deg,rgba(196,135,58,0.2) 0%,rgba(196,135,58,0.04) 100%);display:flex;align-items:flex-end;padding:0 1.25rem}
.org-card-avatar-wrap{margin-bottom:-22px}
.org-avatar{width:52px;height:52px;border-radius:50%;background:var(--bg3);border:2px solid var(--bg2);display:flex;align-items:center;justify-content:center;font-size:1.3rem;overflow:hidden}
.org-avatar img{width:100%;height:100%;object-fit:contain}
.org-card-info{padding:1.5rem 1.25rem 0.75rem}
.org-name{font-size:15px;font-weight:800;color:#fff;margin-bottom:2px}
.org-username{font-size:12px;color:var(--ink4)}
.org-location{font-size:12px;color:var(--ink3);margin-top:5px;display:flex;align-items:center;gap:4px}
.org-description{font-size:12px;color:var(--ink3);margin-top:5px;line-height:1.5}
.org-stats{display:flex;gap:0;border-top:1px solid rgba(255,255,255,0.07);margin-top:0.75rem}
.org-stat{flex:1;text-align:center;padding:0.875rem 0.5rem;border-right:1px solid rgba(255,255,255,0.06)}
.org-stat:last-child{border-right:none}
.org-stat-n{font-size:1.4rem;font-weight:800;color:var(--accent);line-height:1}
.org-stat-l{font-size:10px;color:rgba(255,255,255,0.35);letter-spacing:1px;text-transform:uppercase;margin-top:3px}
.follow-btn{width:100%;font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:8px;border-radius:var(--r);border:none;transition:all 0.2s}
.follow-btn.following{background:rgba(255,255,255,0.06);border:1.5px solid rgba(255,255,255,0.12);color:var(--ink3)}
.follow-btn.following:hover{background:var(--red-bg);border-color:var(--red);color:var(--red)}
.follow-btn.not-following{background:var(--accent);color:#1a1410}
.follow-btn.not-following:hover{background:var(--accent2)}

/* STATS */
.stats-layout{display:grid;grid-template-columns:300px 1fr;gap:1.5rem}
.profile-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:var(--r2);overflow:hidden}
.profile-cover{height:80px;background:linear-gradient(135deg,rgba(196,135,58,0.3) 0%,rgba(196,135,58,0.05) 100%)}
.profile-avatar-wrap{padding:0 1.25rem;margin-top:-36px;margin-bottom:0.75rem;display:flex;align-items:flex-end;justify-content:space-between}
.profile-avatar{width:72px;height:72px;border-radius:50%;background:var(--bg2);border:3px solid var(--bg2);display:flex;align-items:center;justify-content:center;font-size:2rem;overflow:hidden;flex-shrink:0;position:relative;cursor:pointer}
.profile-avatar img{width:100%;height:100%;object-fit:cover}
.profile-avatar-overlay{position:absolute;inset:0;border-radius:50%;background:rgba(0,0,0,0.55);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity 0.2s;font-size:1.2rem}
.profile-avatar:hover .profile-avatar-overlay{opacity:1}
.profile-info{padding:0 1.25rem 1.25rem}
.profile-name{font-size:20px;font-weight:800;color:#fff;font-family:var(--f-display);letter-spacing:0.5px;line-height:1.2}
.profile-username{font-size:13px;color:var(--accent);margin-top:4px;letter-spacing:0.5px}
.profile-since{font-size:12px;color:rgba(255,255,255,0.4);margin-top:6px}
.profile-upload-hint{font-size:11px;color:rgba(255,255,255,0.3);margin-top:8px;display:flex;align-items:center;gap:5px}
.profile-stats{display:grid;grid-template-columns:1fr 1fr;border-top:1px solid rgba(255,255,255,0.07)}
.profile-stat{padding:1rem 0.5rem;text-align:center;border-right:1px solid rgba(255,255,255,0.06);border-bottom:1px solid rgba(255,255,255,0.06);cursor:pointer;transition:background 0.15s}
.profile-stat:hover{background:rgba(255,255,255,0.04)}
.profile-stat:nth-child(even){border-right:none}
.profile-stat-n{font-size:1.5rem;font-weight:800;color:var(--accent);line-height:1}
.profile-stat-n.g{color:var(--green)}
.profile-stat-n.s{color:var(--sand)}
.profile-stat-l{font-size:10px;color:rgba(255,255,255,0.4);letter-spacing:1px;text-transform:uppercase;margin-top:4px}
.stats-table{width:100%;border-collapse:collapse}
.stats-table th{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:rgba(255,255,255,0.4);text-align:left;padding:10px 14px;border-bottom:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.03)}
.stats-table td{padding:13px 14px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:14px;color:#fff}
.stats-table tr:last-child td{border-bottom:none}
.stats-table tr:hover td{background:rgba(196,135,58,0.04)}
.stats-table .name-cell{font-weight:700;color:#fff;font-size:15px}
.stats-table .pts-cell{font-weight:800;color:var(--accent);font-size:15px}
.stats-table .win-cell{color:var(--green);font-weight:700}

/* HISTORIAL */
.hist-table{width:100%;border-collapse:collapse}
.hist-table th{font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--ink4);text-align:left;padding:9px 14px;border-bottom:2px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.04)}
.hist-table td{padding:12px 14px;border-bottom:1px solid rgba(255,255,255,0.06);font-size:13px;color:var(--ink3)}
.hist-table tr:last-child td{border-bottom:none}
.hist-table tr:hover td{background:rgba(196,135,58,0.04)}
.hist-name{font-weight:700;color:var(--ink)}

/* SETTINGS */
.settings-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:var(--r2);padding:1.375rem}
.settings-card-danger{border-color:rgba(212,99,90,0.2);background:rgba(212,99,90,0.04)}
.settings-card-title{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--ink3);margin-bottom:1rem}
.settings-field{margin-bottom:0.875rem}
.settings-avatar-wrap{position:relative;width:72px;height:72px;cursor:pointer;flex-shrink:0}
.settings-avatar{width:72px;height:72px;border-radius:50%;background:var(--bg3);border:2px solid var(--accent-ln);display:flex;align-items:center;justify-content:center;font-size:1.5rem;font-weight:800;color:var(--accent);overflow:hidden}
.settings-avatar-overlay{position:absolute;inset:0;border-radius:50%;background:rgba(0,0,0,0.55);display:flex;align-items:center;justify-content:center;font-size:1.3rem;opacity:0;transition:opacity 0.15s}
.settings-avatar-wrap:hover .settings-avatar-overlay{opacity:1}

/* MODAL */
.modal-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:500;align-items:center;justify-content:center;padding:1rem;backdrop-filter:blur(4px)}
.modal-overlay.on{display:flex}
.modal{background:#2a2018;border:1px solid rgba(255,255,255,0.1);border-radius:calc(var(--r2) + 4px);padding:1.75rem;width:100%;max-width:560px;max-height:90vh;overflow-y:auto;box-shadow:var(--sh2)}
.modal-title{font-size:1.2rem;font-weight:800;letter-spacing:1px;font-family:var(--f-display);text-transform:uppercase;color:var(--ink);margin-bottom:1.25rem}
.modal-footer{display:flex;gap:0.75rem;justify-content:flex-end;margin-top:1.25rem;padding-top:1.25rem;border-top:1px solid rgba(255,255,255,0.07)}

/* TOAST */
.toast-wrap{position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%) translateY(80px);background:#2a2018;border:1px solid rgba(196,135,58,0.3);color:var(--ink);padding:10px 20px;border-radius:20px;font-size:12px;font-weight:600;z-index:1000;transition:transform 0.3s;pointer-events:none;white-space:nowrap}
.toast-wrap.show{transform:translateX(-50%) translateY(0)}

/* LOADING / EMPTY */
.loading{display:flex;align-items:center;justify-content:center;padding:3rem;color:var(--ink4);gap:10px}
.spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,0.1);border-top-color:var(--accent);border-radius:50%;animation:spin 0.7s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.empty{text-align:center;padding:3rem 2rem;color:var(--ink4)}
.empty-icon{font-size:2.5rem;margin-bottom:0.75rem}
.empty-title{font-size:1rem;color:var(--ink3);font-weight:700;margin-bottom:0.5rem}

/* MOBILE NAV */
.mob-nav{display:none;position:fixed;bottom:0;left:0;right:0;background:rgba(26,20,16,0.96);backdrop-filter:blur(12px);border-top:1px solid rgba(255,255,255,0.08);padding:0.5rem;z-index:200;justify-content:space-around}
.mob-btn{display:flex;flex-direction:column;align-items:center;gap:3px;background:none;border:none;color:var(--ink4);font-size:9px;font-weight:700;letter-spacing:1px;text-transform:uppercase;padding:6px 12px;border-radius:var(--r);transition:all 0.15s}
.mob-btn .mob-icon{font-size:1.1rem}
.mob-btn.on{color:var(--accent)}

@media(max-width:768px){
  .topbar .t-nav{display:none}
  .mob-nav{display:flex}
  .content{padding:1.5rem 1rem 5rem}
  .stats-layout{grid-template-columns:1fr}
  .g4{grid-template-columns:repeat(2,1fr)}
  .g3{grid-template-columns:1fr 1fr}
  .g2{grid-template-columns:1fr}
  .feed-layout{grid-template-columns:1fr}
  .feed-sidebar{display:none}
}
`

// ─── Helpers ───────────────────────────────
function fmtDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}
function fmtDateLong(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
}
function daysUntil(d) {
  if (!d) return null
  return Math.ceil((new Date(d) - new Date()) / 86400000)
}

// ─── Toast ─────────────────────────────────
function useToast() {
  const [msg, setMsg] = useState('')
  const [visible, setVisible] = useState(false)
  const timer = useRef(null)
  const show = useCallback((m) => {
    setMsg(m)
    setVisible(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setVisible(false), 2500)
  }, [])
  return { msg, visible, show }
}

// ─── Modal ─────────────────────────────────
function Modal({ id, open, onClose, title, children, footer }) {
  if (!open) return null
  return (
    <div className="modal-overlay on" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="modal">
        {title && <div className="modal-title">{title}</div>}
        {children}
        {footer && <div className="modal-footer">{footer}</div>}
      </div>
    </div>
  )
}

// ─── RegBox ────────────────────────────────
function RegBox({ post, myRegs, onRegister, onUnregister }) {
  if ((post.post_type || 'torneo') !== 'torneo') return null
  const cap       = post.capacity || 40
  const count     = post.registration_count || 0
  const status    = post.inscription_status || (post.registration_open ? 'open' : 'closed')
  const isReg     = myRegs.has(post.id)
  const isFull    = count >= cap
  const spotsLeft = Math.max(0, cap - count)

  if (status === 'finished') return (
    <div className="reg-action-box" style={{ background: 'rgba(148,163,184,0.06)', borderColor: 'rgba(148,163,184,0.15)' }}>
      <span style={{ fontSize: '1.2rem' }}>🏁</span>
      <div><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink2)' }}>Torneo finalizado</div>
      <div style={{ fontSize: 11, color: 'var(--ink4)', marginTop: 2 }}>{count} participantes</div></div>
    </div>
  )
  if (status === 'started') return (
    <div className="reg-action-box" style={{ background: 'rgba(59,130,246,0.07)', borderColor: 'rgba(59,130,246,0.2)' }}>
      <span style={{ fontSize: '1.2rem' }}>🏆</span>
      <div><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink2)' }}>El torneo ya ha comenzado</div>
      <div style={{ fontSize: 11, color: 'var(--ink4)', marginTop: 2 }}>{count} participantes</div></div>
    </div>
  )
  if (status === 'closed' && !isReg) return (
    <div className="reg-action-box">
      <span style={{ fontSize: '1.2rem' }}>🔒</span>
      <div><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink2)' }}>Inscripción cerrada</div>
      <div style={{ fontSize: 11, color: 'var(--ink4)', marginTop: 2 }}>{count} / {cap} inscritos</div></div>
    </div>
  )
  if (isFull && !isReg) return (
    <div className="reg-action-box" style={{ background: 'rgba(239,68,68,0.06)', borderColor: 'rgba(239,68,68,0.2)' }}>
      <span style={{ fontSize: '1.2rem' }}>🔴</span>
      <div><div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink2)' }}>Aforo completo</div>
      <div style={{ fontSize: 11, color: 'var(--ink4)', marginTop: 2 }}>{cap} / {cap} plazas ocupadas</div></div>
    </div>
  )
  if (isReg) return (
    <div className="reg-action-box" style={{ background: 'rgba(76,217,138,0.06)', borderColor: 'rgba(76,217,138,0.2)' }}>
      <span style={{ fontSize: '1.2rem' }}>✅</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink2)' }}>Estás inscrito</div>
        <div style={{ fontSize: 11, color: 'var(--ink4)', marginTop: 2 }}>{count} inscritos · {spotsLeft} plazas libres</div>
      </div>
      {status !== 'started' && (
        <button className="btn btn-sm" style={{ background: 'rgba(184,64,64,0.1)', color: '#e05555', border: '1px solid rgba(184,64,64,0.2)' }}
          onClick={e => { e.stopPropagation(); onUnregister(post) }}>Darme de baja</button>
      )}
    </div>
  )
  return (
    <div className="reg-action-box" style={{ background: 'rgba(196,135,58,0.06)', borderColor: 'rgba(196,135,58,0.2)' }}>
      <span style={{ fontSize: '1.2rem' }}>🎯</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ink2)' }}>¿Quieres participar?</div>
        <div style={{ fontSize: 11, color: 'var(--ink4)', marginTop: 2 }}>{spotsLeft} plazas disponibles de {cap}</div>
      </div>
      <button className="btn btn-accent btn-sm" onClick={e => { e.stopPropagation(); onRegister(post) }}>Inscribirme</button>
    </div>
  )
}

// ─── FeedPostCard ───────────────────────────
function FeedPostCard({ post, myRegs, onOpen }) {
  const org = post.organizers || {}
  const club = org.club_name || org.username || 'Organizador'
  const logoUrl = org.logo_url || ''
  const t = post.post_type || 'torneo'
  const typeLabels = { torneo: '🏆 TORNEO', aviso: '⚠️ AVISO', info: 'ℹ️ INFORMACIÓN' }
  const dateLabel = post.date ? new Date(post.date).toLocaleDateString('es-ES', { day:'numeric', month:'short', year:'numeric' }) : null
  const createdLabel = new Date(post.created_at).toLocaleDateString('es-ES', { day:'numeric', month:'short', year:'numeric' })
  const medals = ['🥇','🥈','🥉']
  const prizes = (() => {
    if (t !== 'torneo') return []
    try { return post.prizes ? (typeof post.prizes === 'string' ? JSON.parse(post.prizes) : post.prizes) : [] } catch { return [] }
  })()

  const cap = post.capacity || 40
  const count = post.registration_count || 0
  const status = post.inscription_status || (post.registration_open ? 'open' : 'closed')
  const isReg = myRegs.has(post.id)
  const isFull = count >= cap
  const pct = Math.min(100, Math.round(count / cap * 100))
  const spotsLeft = Math.max(0, cap - count)
  const barColor = pct >= 100 ? '#e05555' : pct >= 75 ? '#d4975a' : '#4cd98a'

  let statusHtml = null
  if (t === 'torneo') {
    if (status === 'started') statusHtml = <span className="feed-reg-pill pill-started">🏆 Torneo iniciado</span>
    else if (isFull)          statusHtml = <span className="feed-reg-pill pill-full">🔴 Aforo completo</span>
    else if (status === 'closed') statusHtml = <span className="feed-reg-pill pill-closed">🔒 Inscripción cerrada</span>
    else if (isReg)           statusHtml = <span className="feed-reg-pill pill-registered">✅ Estás inscrito</span>
    else                      statusHtml = <span className="feed-reg-pill pill-open">🟢 Inscripción abierta</span>
  }

  return (
    <div className="post-card" onClick={() => onOpen(post)}>
      <div className="post-header">
        <div className="post-avatar">{logoUrl ? <img src={logoUrl} alt="" /> : <span>🏟</span>}</div>
        <div>
          <div className="post-author-name">{club}</div>
          <div className="post-author-date">{createdLabel}</div>
        </div>
        <button className="post-kebab" onClick={e => { e.stopPropagation(); onOpen(post) }}>⋯</button>
      </div>
      <div className="post-body">
        <div className={`post-type-badge badge-${t}`}>{typeLabels[t] || t}</div>
        <div className="post-title">{post.title}</div>
        {post.description && <div className="post-desc">{post.description}</div>}
        {prizes.length > 0 && (
          <div className="post-prizes">
            <div className="post-prizes-title">Premios</div>
            {prizes.slice(0,3).map((pr, i) => (
              <div className="post-prize-row" key={i}><span>{medals[i]||'🏅'}</span>{pr}</div>
            ))}
          </div>
        )}
        {t === 'torneo' && (
          <div style={{ marginTop: 12, padding: '10px 12px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              {statusHtml}
              <span style={{ fontSize: 11, color: 'var(--ink4)' }}>
                {!(count >= cap) ? `${spotsLeft} plaza${spotsLeft !== 1 ? 's' : ''} disponible${spotsLeft !== 1 ? 's' : ''}` : `${count} / ${cap} inscritos`}
              </span>
            </div>
            <div style={{ height: 5, background: 'rgba(255,255,255,0.07)', borderRadius: 3, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: 3 }}></div>
            </div>
          </div>
        )}
      </div>
      {post.image_url && <div className="post-img-wrap"><img src={post.image_url} alt={post.title} loading="lazy" /></div>}
      {(dateLabel || post.location) && (
        <div className="post-tags">
          {dateLabel && <span className="post-tag">📅 {dateLabel}{post.time ? ' · ' + post.time.slice(0,5) : ''}</span>}
          {post.location && <span className="post-tag">📍 {post.location}</span>}
        </div>
      )}
    </div>
  )
}

// ─── Sidebar ───────────────────────────────
function FeedSidebar({ profile, follows, stats, onNav }) {
  const followedOrgsRef = useRef([])
  const [followedOrgs, setFollowedOrgs] = useState([])

  useEffect(() => {
    if (!follows || follows.size === 0) return
    const ids = [...follows]
    supabase.from('organizers').select('user_id,username,club_name,logo_url').in('user_id', ids).limit(6)
      .then(({ data }) => setFollowedOrgs(data || []))
  }, [follows])

  if (!profile) return null
  const totT   = stats.tournaments
  const totW   = stats.wins
  const totPts = stats.points

  return (
    <div className="sidebar-profile">
      <div className="sidebar-cover"></div>
      <div className="sidebar-avatar-wrap">
        <div className="sidebar-avatar">
          {profile.avatar_url ? <img src={profile.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : '🎯'}
        </div>
      </div>
      <div className="sidebar-info">
        <div className="sidebar-name">{profile.club_name || profile.username || '—'}</div>
        <div className="sidebar-username">@{profile.username || '—'}</div>
      </div>
      <div className="sidebar-divider"></div>
      <div className="sidebar-stats">
        <div className="sidebar-stat" onClick={() => onNav('stats')}><div className="sidebar-stat-n">{totT}</div><div className="sidebar-stat-l">Torneos</div></div>
        <div className="sidebar-stat" onClick={() => onNav('stats')}><div className="sidebar-stat-n g">{totW}</div><div className="sidebar-stat-l">Victorias</div></div>
        <div className="sidebar-stat" onClick={() => onNav('stats')}><div className="sidebar-stat-n s">{totPts}</div><div className="sidebar-stat-l">Puntos</div></div>
        <div className="sidebar-stat" onClick={() => onNav('orgs')}><div className="sidebar-stat-n w">{follows ? follows.size : 0}</div><div className="sidebar-stat-l">Clubs</div></div>
      </div>
      {followedOrgs.length > 0 && (
        <>
          <div className="sidebar-divider"></div>
          <div className="sidebar-following">
            <div className="sidebar-section-title">Siguiendo</div>
            {followedOrgs.map(o => (
              <div className="sidebar-org-row" key={o.user_id} onClick={() => onNav('orgs')}>
                <div className="sidebar-org-mini">{o.logo_url ? <img src={o.logo_url} alt="" /> : '🏟'}</div>
                <span className="sidebar-org-name">{o.club_name || o.username}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

// ─── PAGE: FEED ────────────────────────────
function PageFeed({ user, profile, follows, myRegs, setMyRegs, onNav, toast }) {
  const [events, setEvents]   = useState([])
  const [posts, setPosts]     = useState([])
  const [filter, setFilter]   = useState('all')
  const [loading, setLoading] = useState(true)
  const [stats, setStats]     = useState({ tournaments: 0, wins: 0, points: 0 })
  const [activePost, setActivePost] = useState(null)
  const rtRef = useRef(null)

  useEffect(() => {
    load()
    return () => { if (rtRef.current) supabase.removeChannel(rtRef.current) }
  }, [])

  async function load() {
    setLoading(true)
    const [evRes, postRes, statsRes] = await Promise.all([
      supabase.from('tournament_events').select('*,organizers(username,club_name,logo_url)').order('date', { ascending: true }),
      supabase.from('posts').select('*,organizers(username,club_name,logo_url)').order('created_at', { ascending: false }).limit(50),
      supabase.from('global_stats').select('tournaments,wins,total_qpts').eq('user_id', user.id),
    ])
    setEvents(evRes.data || [])

    // Enrich posts with registration counts
    const rawPosts = postRes.data || []
    const tIds = rawPosts.filter(p => (p.post_type||'torneo') === 'torneo').map(p => p.id)
    if (tIds.length) {
      const { data: allRegs } = await supabase.from('event_registrations').select('id,event_id,user_id').in('event_id', tIds)
      const countMap = {}
      ;(allRegs || []).forEach(r => { countMap[r.event_id] = (countMap[r.event_id] || 0) + 1 })
      const newMyRegs = new Map((allRegs || []).filter(r => r.user_id === user.id).map(r => [r.event_id, r.id]))
      setMyRegs(newMyRegs)
      setPosts(rawPosts.map(p => ({ ...p, registration_count: countMap[p.id] || 0 })))
    } else {
      setPosts(rawPosts)
    }

    const s = statsRes.data || []
    setStats({
      tournaments: s.reduce((a, x) => a + (x.tournaments || 0), 0),
      wins:        s.reduce((a, x) => a + (x.wins || 0), 0),
      points:      s.reduce((a, x) => a + (x.total_qpts || 0), 0),
    })
    setLoading(false)
    initRealtime()
  }

  function initRealtime() {
    if (rtRef.current) supabase.removeChannel(rtRef.current)
    rtRef.current = supabase.channel('feed-posts')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'posts' }, async payload => {
        const { eventType, new: nr, old: or } = payload
        if (eventType === 'DELETE') { setPosts(prev => prev.filter(p => p.id !== or.id)); return }
        if (eventType === 'INSERT') {
          const { data: rows } = await supabase.from('posts').select('*,organizers(username,club_name,logo_url)').eq('id', nr.id).limit(1)
          if (rows?.[0]) setPosts(prev => [rows[0], ...prev])
          return
        }
        if (eventType === 'UPDATE') {
          setPosts(prev => prev.map(p => p.id === nr.id ? { ...p, ...nr, organizers: p.organizers, registration_count: p.registration_count } : p))
        }
      }).subscribe()
  }

  async function handleRegister(post) {
    if (!user) return
    try {
      let playerTag = null
      try {
        const { data: fw } = await supabase.from('follows').select('player_tag').eq('follower_id', user.id).eq('following_id', post.user_id).limit(1)
        playerTag = fw?.[0]?.player_tag || null
      } catch {}
      const { data: profile } = await supabase.from('users').select('username,club_name').eq('id', user.id).limit(1)
      const payload = { event_id: post.id, user_id: user.id, name: profile?.[0]?.username || '', email: user.email, status: 'confirmed' }
      if (playerTag) payload.player_level = playerTag
      const { error } = await supabase.from('event_registrations').insert(payload)
      if (error && error.code !== '23505') throw error
      setMyRegs(prev => new Map([...prev, [post.id, true]]))
      setPosts(prev => prev.map(p => p.id === post.id ? { ...p, registration_count: (p.registration_count || 0) + 1 } : p))
      if (activePost?.id === post.id) setActivePost(prev => ({ ...prev, registration_count: (prev.registration_count || 0) + 1 }))
      toast('✅ Inscripción confirmada' + (playerTag ? ` · ${playerTag.toUpperCase()}` : ''))
    } catch(e) {
      toast('Error: ' + e.message)
    }
  }

  async function handleUnregister(post) {
    if (!confirm('¿Confirmas que quieres darte de baja de este torneo?')) return
    await supabase.from('event_registrations').delete().eq('event_id', post.id).eq('user_id', user.id)
    setMyRegs(prev => { const m = new Map(prev); m.delete(post.id); return m })
    setPosts(prev => prev.map(p => p.id === post.id ? { ...p, registration_count: Math.max(0, (p.registration_count || 1) - 1) } : p))
    if (activePost?.id === post.id) setActivePost(prev => ({ ...prev, registration_count: Math.max(0, (prev.registration_count || 1) - 1) }))
    toast('✓ Baja confirmada')
  }

  // Merge & filter
  const today = new Date(); today.setHours(0,0,0,0)
  let filtEvents = events.filter(e => !e.date || new Date(e.date) >= today)
  let filtPosts  = [...posts]
  if (filter === 'torneos') {
    filtEvents = [...events]; filtPosts = posts.filter(p => (p.post_type||'torneo') === 'torneo')
  } else if (filter === 'soon') {
    const nw = new Date(today); nw.setDate(nw.getDate() + 7)
    filtEvents = filtEvents.filter(e => { const d = new Date(e.date); return d >= today && d <= nw })
    filtPosts  = filtPosts.filter(p => { if (!p.date) return false; const d = new Date(p.date); return d >= today && d <= nw })
  } else if (filter === 'following') {
    filtEvents = filtEvents.filter(e => follows?.has(e.user_id))
    filtPosts  = filtPosts.filter(p => follows?.has(p.user_id))
  }
  const merged = [
    ...filtEvents.map(e => ({ ...e, _type: 'event', _sort: e.created_at || e.date || '0' })),
    ...filtPosts.map(p  => ({ ...p,  _type: 'post',  _sort: p.created_at || p.date  || '0' })),
  ].sort((a, b) => a._sort > b._sort ? -1 : 1)

  return (
    <div className="feed-layout">
      <aside className="feed-sidebar">
        <FeedSidebar profile={profile} follows={follows} stats={stats} onNav={onNav} />
      </aside>
      <div className="feed-main">
        <div className="pg-eyebrow">Próximos torneos</div>
        <h1 className="pg-title">Tu <em>feed.</em></h1>
        <p className="pg-sub">Torneos de los organizadores que sigues</p>
        <div className="feed-filters">
          {['all','torneos','soon','following'].map(f => (
            <button key={f} className={`filter-btn${filter === f ? ' on' : ''}`} onClick={() => setFilter(f)}>
              {{ all:'Todos', torneos:'🏆 Torneos', soon:'Esta semana', following:'Solo mis clubs' }[f]}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="loading"><div className="spinner"></div></div>
        ) : merged.length === 0 ? (
          <div className="empty"><div className="empty-icon">📭</div><div className="empty-title">Sin resultados</div><p>No hay contenido para este filtro</p></div>
        ) : (
          <div className="feed-stream">
            {merged.map(item => item._type === 'post'
              ? <FeedPostCard key={item.id} post={item} myRegs={myRegs} onOpen={setActivePost} />
              : <div key={item.id} className="event-card" onClick={() => {}}>
                  <div className="event-card-accent" style={{ background: follows?.has(item.user_id) ? 'var(--accent)' : 'rgba(255,255,255,0.1)' }}></div>
                  <div className="event-card-body">
                    <div className="event-card-top">
                      <div><div className="event-card-title">{item.title}</div><div className="event-card-club">🏟 {item.organizers?.club_name || item.organizers?.username || 'Organizador'}</div></div>
                    </div>
                    <div className="event-meta">
                      {item.date && <div className="event-meta-item">📅 <span>{fmtDate(item.date)}</span></div>}
                      {item.location && <div className="event-meta-item">📍 <span>{item.location}</span></div>}
                    </div>
                  </div>
                </div>
            )}
          </div>
        )}
      </div>

      {/* Modal post detail */}
      {activePost && (
        <Modal open={!!activePost} onClose={() => setActivePost(null)} footer={
          <button className="btn btn-ghost" onClick={() => setActivePost(null)}>Cerrar</button>
        }>
          <div className="post-header" style={{ padding: '14px 0 0' }}>
            <div className="post-avatar">{activePost.organizers?.logo_url ? <img src={activePost.organizers.logo_url} alt="" /> : <span>🏟</span>}</div>
            <div>
              <div className="post-author-name">{activePost.organizers?.club_name || activePost.organizers?.username || 'Organizador'}</div>
              <div className="post-author-date">{new Date(activePost.created_at).toLocaleDateString('es-ES', { day:'numeric', month:'short', year:'numeric' })}</div>
            </div>
          </div>
          <div className="post-body" style={{ padding: '10px 0 4px' }}>
            <div className={`post-type-badge badge-${activePost.post_type || 'torneo'}`}>
              {{ torneo: '🏆 TORNEO', aviso: '⚠️ AVISO', info: 'ℹ️ INFORMACIÓN' }[activePost.post_type] || activePost.post_type}
            </div>
            <div className="post-title">{activePost.title}</div>
            {activePost.description && <div className="post-desc">{activePost.description}</div>}
            <RegBox post={activePost} myRegs={myRegs} onRegister={handleRegister} onUnregister={handleUnregister} />
          </div>
          {activePost.image_url && <div className="post-img-wrap" style={{ margin: '10px 0' }}><img src={activePost.image_url} alt={activePost.title} loading="lazy" style={{ width:'100%', maxHeight:400, objectFit:'contain' }} /></div>}
          {(activePost.date || activePost.location) && (
            <div className="post-tags" style={{ padding: '6px 0 0' }}>
              {activePost.date && <span className="post-tag">📅 {fmtDate(activePost.date)}{activePost.time ? ' · ' + activePost.time.slice(0,5) : ''}</span>}
              {activePost.location && <span className="post-tag">📍 {activePost.location}</span>}
            </div>
          )}
        </Modal>
      )}
    </div>
  )
}

// ─── PAGE: ORGANIZADORES ───────────────────
function PageOrgs({ user, follows, setFollows, toast }) {
  const [allOrgs, setAllOrgs] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')

  useEffect(() => {
    async function load() {
      setLoading(true)
      const [{ data: orgs }, { data: evs }, { data: fws }] = await Promise.all([
        supabase.from('organizers').select('id,user_id,username,club_name,logo_url,description,location,created_at').order('club_name', { ascending: true }),
        supabase.from('tournament_events').select('user_id'),
        supabase.from('follows').select('following_id'),
      ])
      const eventCounts = {}; (evs || []).forEach(e => { eventCounts[e.user_id] = (eventCounts[e.user_id] || 0) + 1 })
      const followerCounts = {}; (fws || []).forEach(f => { followerCounts[f.following_id] = (followerCounts[f.following_id] || 0) + 1 })
      const enriched = (orgs || [])
        .filter(o => o.user_id !== user?.id)
        .map(o => ({ ...o, event_count: eventCounts[o.user_id] || 0, follower_count: followerCounts[o.user_id] || 0 }))
      setAllOrgs(enriched)
      setFiltered(enriched)
      setLoading(false)
    }
    load()
  }, [])

  function handleSearch(q) {
    setSearch(q)
    if (!q) { setFiltered(allOrgs); return }
    const lq = q.toLowerCase()
    setFiltered(allOrgs.filter(o =>
      (o.club_name||'').toLowerCase().includes(lq) ||
      (o.username||'').toLowerCase().includes(lq) ||
      (o.location||'').toLowerCase().includes(lq) ||
      (o.description||'').toLowerCase().includes(lq)
    ))
  }

  async function toggleFollow(orgUserId) {
    if (!user) return
    const isF = follows?.has(orgUserId)
    if (isF) {
      await supabase.from('follows').delete().eq('follower_id', user.id).eq('following_id', orgUserId)
      setFollows(prev => { const s = new Set(prev); s.delete(orgUserId); return s })
      toast('Dejaste de seguir al organizador')
    } else {
      await supabase.from('follows').insert({ follower_id: user.id, following_id: orgUserId })
      setFollows(prev => new Set([...prev, orgUserId]))
      toast('✓ Ahora sigues a este organizador')
    }
  }

  return (
    <>
      <div className="pg-eyebrow">Descubrir</div>
      <h1 className="pg-title">Clubs &amp; <em>Organizadores.</em></h1>
      <p className="pg-sub">Sigue a los organizadores para ver sus torneos en tu feed</p>
      <div className="orgs-search-bar">
        <span className="orgs-search-icon">🔍</span>
        <input className="orgs-search-input" type="text" placeholder="Buscar por nombre de club, ciudad..." value={search} onChange={e => handleSearch(e.target.value)} />
      </div>
      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : (
        <div className="org-grid">
          {filtered.map(o => {
            const fid = o.user_id || o.id
            const isF = follows?.has(fid)
            return (
              <div className="org-card" key={fid}>
                <div className="org-card-cover">
                  <div className="org-card-avatar-wrap">
                    <div className="org-avatar">{o.logo_url ? <img src={o.logo_url} alt="" /> : '🏟'}</div>
                  </div>
                </div>
                <div className="org-card-info">
                  <div className="org-name">{o.club_name || o.username}</div>
                  <div className="org-username">@{o.username}</div>
                  {o.location && <div className="org-location">📍 {o.location}</div>}
                  {o.description && <div className="org-description">{o.description}</div>}
                </div>
                <div className="org-stats">
                  <div className="org-stat"><div className="org-stat-n">{o.event_count}</div><div className="org-stat-l">Torneos</div></div>
                  <div className="org-stat"><div className="org-stat-n" style={{ color: 'var(--sand)' }}>{o.follower_count}</div><div className="org-stat-l">Seguidores</div></div>
                  <div className="org-stat"><div className="org-stat-n" style={{ color: isF ? 'var(--green)' : 'rgba(255,255,255,0.2)' }}>{isF ? '✓' : '—'}</div><div className="org-stat-l">Siguiendo</div></div>
                </div>
                <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <button className={`follow-btn ${isF ? 'following' : 'not-following'}`} onClick={() => toggleFollow(fid)}>
                    {isF ? '✓ Siguiendo' : '+ Seguir'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

// ─── PAGE: STATS ───────────────────────────
function PageStats({ user, profile, toast }) {
  const [stats, setStats]   = useState([])
  const [loading, setLoading] = useState(true)
  const avatarInputRef = useRef(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase.from('global_stats').select('*').eq('user_id', user.id).order('total_qpts', { ascending: false })
      setStats(data || [])
      setLoading(false)
    }
    load()
  }, [])

  async function uploadAvatar(file) {
    if (!file) return
    if (file.size > 1024 * 1024) { toast('La imagen supera 1MB'); return }
    const compressed = await new Promise(resolve => {
      const reader = new FileReader()
      reader.onload = e => {
        const img = new Image()
        img.onload = () => {
          const canvas = document.createElement('canvas')
          const MAX = 400
          let w = img.width, h = img.height
          if (w > MAX) { h = Math.round(h * MAX / w); w = MAX }
          if (h > MAX) { w = Math.round(w * MAX / h); h = MAX }
          canvas.width = w; canvas.height = h
          canvas.getContext('2d').drawImage(img, 0, 0, w, h)
          canvas.toBlob(blob => resolve(new File([blob], 'avatar.jpg', { type: 'image/jpeg' })), 'image/jpeg', 0.85)
        }
        img.src = e.target.result
      }
      reader.readAsDataURL(file)
    })
    toast('Subiendo foto...')
    const path = `${user.id}/avatar.jpg`
    await supabase.storage.from('avatars').remove([path])
    const { error } = await supabase.storage.from('avatars').upload(path, compressed, { contentType: 'image/jpeg', upsert: true })
    if (error) { toast('Error: ' + error.message); return }
    const { data } = supabase.storage.from('avatars').getPublicUrl(path)
    await supabase.from('users').update({ avatar_url: data.publicUrl }).eq('id', user.id)
    toast('✓ Foto actualizada')
  }

  if (loading) return <div className="loading"><div className="spinner"></div></div>

  const totT   = stats.reduce((a,s) => a + (s.tournaments    || 0), 0)
  const totW   = stats.reduce((a,s) => a + (s.wins           || 0), 0)
  const totL   = stats.reduce((a,s) => a + (s.losses         || 0), 0)
  const totPts = stats.reduce((a,s) => a + (s.total_qpts     || 0), 0)
  const totKS  = stats.reduce((a,s) => a + (s.total_ks       || 0), 0)
  const totBS  = stats.reduce((a,s) => a + (s.total_bs       || 0), 0)
  const totQTh = stats.reduce((a,s) => a + (s.qualify_throws || 0), 0)
  const totQ6  = stats.reduce((a,s) => a + (s.qualify_sixes  || 0), 0)
  const totETh = stats.reduce((a,s) => a + (s.elim_throws    || 0), 0)
  const totEB  = stats.reduce((a,s) => a + (s.elim_bulls     || 0), 0)
  const wlPct    = (totW + totL) > 0 ? Math.round(totW / (totW + totL) * 100) : 0
  const qPrecPct = totQTh > 0 ? Math.round(totQ6 / totQTh * 100) : 0
  const bullPct  = totETh > 0 ? Math.round(totEB / totETh * 100) : 0
  const since    = profile?.created_at ? fmtDateLong(profile.created_at) : '—'

  return (
    <>
      <div className="pg-eyebrow">Mi perfil</div>
      <h1 className="pg-title">Mis <em>estadísticas.</em></h1>
      <p className="pg-sub">Tu historial en torneos registrados en NOVURAXE</p>
      <div className="stats-layout">
        <div>
          <div className="profile-card">
            <div className="profile-cover"></div>
            <div className="profile-avatar-wrap">
              <div className="profile-avatar" onClick={() => avatarInputRef.current?.click()}>
                {profile?.avatar_url ? <img src={profile.avatar_url} alt="" /> : <span>🎯</span>}
                <div className="profile-avatar-overlay">📷</div>
                <input ref={avatarInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display:'none' }} onChange={e => uploadAvatar(e.target.files[0])} />
              </div>
            </div>
            <div className="profile-info">
              <div className="profile-name">{profile?.club_name || profile?.username || '—'}</div>
              <div className="profile-username">@{profile?.username || '—'}</div>
              <div className="profile-since">Miembro desde {since}</div>
              <div className="profile-upload-hint">📷 Haz clic en la foto para cambiarla</div>
            </div>
            <div className="profile-stats">
              {[
                [totT, 'Torneos', ''],
                [totW, 'Victorias', 'g'],
                [totL, 'Derrotas', '', '#d4635a'],
                [wlPct + '%', 'Win rate', 's'],
                [totKS, 'Killshots', '', '#c084fc'],
                [totBS, "Bull's eye", '', '#60a5fa'],
                [qPrecPct + '%', 'Prec. centros', ''],
                [bullPct + '%', '% Bull duelo', '', '#60a5fa'],
              ].map(([val, lbl, cls, col]) => (
                <div className="profile-stat" key={lbl}>
                  <div className={`profile-stat-n${cls ? ' ' + cls : ''}`} style={col ? { color: col } : {}}>{val}</div>
                  <div className="profile-stat-l">{lbl}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div>
          {stats.length > 0 ? (
            <>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'0.875rem', marginBottom:'1.25rem' }}>
                {[
                  ['🪓', totKS, '#c084fc', 'Total Killshots', `${totQTh > 0 ? Math.round(totKS/totQTh*100) : 0}% de tiros en clasif.`],
                  ['🎯', qPrecPct + '%', 'var(--accent)', 'Precisión 6 (clasif.)', `${totQ6} de ${totQTh} tiros`],
                  ['🔵', bullPct + '%', '#60a5fa', "Bull's eye (duelo)", `${totEB} de ${totETh} tiros`],
                ].map(([icon, val, color, label, sub]) => (
                  <div className="stat-card" style={{ textAlign: 'center' }} key={label}>
                    <div style={{ fontSize: '2rem', marginBottom: 4 }}>{icon}</div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 800, color, lineHeight: 1 }}>{val}</div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: 1, marginTop: 4 }}>{label}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{sub}</div>
                  </div>
                ))}
              </div>
              <div className="card">
                <div className="card-title" style={{ color: '#fff', fontSize: 13, marginBottom: '1rem' }}>Detalle por torneo</div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="stats-table" style={{ minWidth: 600 }}>
                    <thead><tr>
                      <th>Torneo</th><th>T</th><th style={{ color:'var(--green)' }}>V</th>
                      <th style={{ color:'var(--red)' }}>D</th><th>Pts</th>
                      <th style={{ color:'#c084fc' }}>🪓 KS</th><th style={{ color:'#60a5fa' }}>🔵 BS</th>
                      <th>% 6s</th><th>% Bull</th>
                    </tr></thead>
                    <tbody>
                      {stats.map(s => {
                        const qp = (s.qualify_throws||0) > 0 ? Math.round(((s.qualify_sixes||0)/(s.qualify_throws||1))*100) : 0
                        const bp = (s.elim_throws||0) > 0 ? Math.round(((s.elim_bulls||0)/(s.elim_throws||1))*100) : 0
                        return (
                          <tr key={s.id}>
                            <td className="name-cell">{s.tournament_name || '—'}</td>
                            <td>{s.tournaments||0}</td>
                            <td className="win-cell">{s.wins||0}</td>
                            <td style={{ color:'var(--red)' }}>{s.losses||0}</td>
                            <td className="pts-cell">{s.total_qpts||0}</td>
                            <td style={{ color:'#c084fc', fontWeight:700 }}>{s.total_ks||0}</td>
                            <td style={{ color:'#60a5fa', fontWeight:700 }}>{s.total_bs||0}</td>
                            <td style={{ color:'var(--accent)' }}>{qp}%</td>
                            <td style={{ color:'#60a5fa' }}>{bp}%</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="empty" style={{ padding: '3rem' }}>
              <div className="empty-icon">🎯</div>
              <div className="empty-title" style={{ color:'#fff', fontSize:15 }}>Sin estadísticas aún</div>
              <p style={{ fontSize:13, marginTop:6, color:'rgba(255,255,255,0.5)' }}>Tus stats aparecerán aquí cuando los organizadores vinculen tu nombre</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ─── PAGE: HISTORIAL ──────────────────────
function PageHistory({ user }) {
  const [regs, setRegs]       = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('event_registrations')
      .select('*,tournament_events(title,date,location,users(club_name,username))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data }) => { setRegs(data || []); setLoading(false) })
  }, [])

  const statusMap = {
    pending:   <span className="badge badge-soon">Pendiente</span>,
    confirmed: <span className="badge badge-open">Confirmado</span>,
    cancelled: <span className="badge badge-cancel">Cancelado</span>,
  }

  return (
    <>
      <div className="pg-eyebrow">Historial</div>
      <h1 className="pg-title">Torneos <em>jugados.</em></h1>
      <p className="pg-sub">Torneos en los que apareces registrado</p>
      {loading ? (
        <div className="loading"><div className="spinner"></div></div>
      ) : regs.length === 0 ? (
        <div className="empty"><div className="empty-icon">📁</div><div className="empty-title">Sin torneos registrados</div><p>Inscríbete en torneos desde tu feed para verlos aquí</p></div>
      ) : (
        <div className="card">
          <table className="hist-table">
            <thead><tr><th>Torneo</th><th>Club</th><th>Fecha</th><th>Estado</th></tr></thead>
            <tbody>
              {regs.map(r => {
                const ev = r.tournament_events
                const club = ev?.users?.club_name || ev?.users?.username || '—'
                return (
                  <tr key={r.id}>
                    <td className="hist-name">{ev?.title || '—'}</td>
                    <td style={{ color:'var(--ink4)' }}>{club}</td>
                    <td style={{ color:'var(--ink4)' }}>{fmtDate(ev?.date)}</td>
                    <td>{statusMap[r.status] || r.status}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

// ─── PAGE: AJUSTES ─────────────────────────
function PageSettings({ user, profile, setProfile, follows, onLogout, toast }) {
  const [fullname, setFullname]   = useState(profile?.club_name || '')
  const [username, setUsername]   = useState(profile?.username  || '')
  const [pass1, setPass1]         = useState('')
  const [pass2, setPass2]         = useState('')
  const [profErr, setProfErr]     = useState('')
  const [passErr, setPassErr]     = useState('')
  const [passOk, setPassOk]       = useState(false)
  const [avatarStatus, setAvatarStatus] = useState('')
  const avatarInputRef = useRef(null)

  async function saveProfile() {
    setProfErr('')
    const uname = username.trim().toLowerCase().replace(/\s+/g,'')
    if (!uname) { setProfErr('El nombre de usuario es obligatorio'); return }
    if (uname.length < 3) { setProfErr('El usuario debe tener al menos 3 caracteres'); return }
    const { data: ex } = await supabase.from('users').select('id').ilike('username', uname).neq('id', user.id)
    if (ex?.length) { setProfErr('Ese nombre de usuario ya está en uso'); return }
    await supabase.from('users').update({ username: uname, club_name: fullname }).eq('id', user.id)
    setProfile(prev => ({ ...prev, username: uname, club_name: fullname }))
    toast('✓ Perfil actualizado')
  }

  async function savePassword() {
    setPassErr(''); setPassOk(false)
    if (!pass1) { setPassErr('Escribe una contraseña nueva'); return }
    if (pass1.length < 8) { setPassErr('La contraseña debe tener al menos 8 caracteres'); return }
    if (pass1 !== pass2) { setPassErr('Las contraseñas no coinciden'); return }
    const { error } = await supabase.auth.updateUser({ password: pass1 })
    if (error) { setPassErr(error.message); return }
    setPass1(''); setPass2(''); setPassOk(true)
    toast('✓ Contraseña actualizada')
  }

  async function handleAvatar(file) {
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { toast('La imagen no puede superar 2MB'); return }
    setAvatarStatus('Subiendo foto...')
    try {
      const path = `${user.id}/avatar.jpg`
      await supabase.storage.from('avatars').remove([path])
      const { error } = await supabase.storage.from('avatars').upload(path, file, { contentType: file.type, upsert: true })
      if (error) throw error
      const { data } = supabase.storage.from('avatars').getPublicUrl(path)
      await supabase.from('users').update({ avatar_url: data.publicUrl }).eq('id', user.id)
      setProfile(prev => ({ ...prev, avatar_url: data.publicUrl + '?t=' + Date.now() }))
      setAvatarStatus('✓ Foto actualizada')
      toast('✓ Foto de perfil actualizada')
      setTimeout(() => setAvatarStatus(''), 3000)
    } catch(e) {
      setAvatarStatus('Error: ' + e.message)
    }
  }

  async function deleteAccount() {
    if (!confirm('¿Seguro que quieres eliminar tu cuenta? Esta acción es PERMANENTE e irreversible.')) return
    if (!confirm('Última confirmación: ¿eliminar la cuenta definitivamente?')) return
    await supabase.from('follows').delete().eq('follower_id', user.id)
    await supabase.from('users').delete().eq('id', user.id)
    await supabase.auth.signOut()
    onLogout()
    toast('Cuenta eliminada')
  }

  return (
    <>
      <div className="pg-eyebrow">Cuenta</div>
      <h1 className="pg-title">Ajus<em>tes.</em></h1>
      <p className="pg-sub">Gestiona tu perfil y preferencias</p>
      <div style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

        {/* Foto de perfil */}
        <div className="settings-card">
          <div className="settings-card-title">Foto de perfil</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div className="settings-avatar-wrap" onClick={() => avatarInputRef.current?.click()}>
              <div className="settings-avatar">
                {profile?.avatar_url
                  ? <img src={profile.avatar_url} style={{ width:'100%', height:'100%', objectFit:'cover', borderRadius:'50%' }} alt="" />
                  : <span>{(profile?.username || '?')[0].toUpperCase()}</span>
                }
              </div>
              <div className="settings-avatar-overlay">📷</div>
              <input ref={avatarInputRef} type="file" accept="image/jpeg,image/png,image/webp" style={{ display:'none' }} onChange={e => handleAvatar(e.target.files[0])} />
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:'var(--ink2)' }}>{profile?.club_name || profile?.username || '—'}</div>
              <div style={{ fontSize:12, color:'var(--ink4)', marginTop:2 }}>@{profile?.username || '—'}</div>
              <button className="btn-link" style={{ marginTop:6 }} onClick={() => avatarInputRef.current?.click()}>Cambiar foto</button>
            </div>
          </div>
          {avatarStatus && <div style={{ fontSize:12, marginTop:10, color: avatarStatus.startsWith('✓') ? 'var(--green)' : 'var(--ink3)' }}>{avatarStatus}</div>}
        </div>

        {/* Info personal */}
        <div className="settings-card">
          <div className="settings-card-title">Información personal</div>
          <div className="settings-field">
            <label className="f-label">Nombre completo</label>
            <input className="f-input" type="text" value={fullname} onChange={e => setFullname(e.target.value)} placeholder="Tu nombre" />
          </div>
          <div className="settings-field">
            <label className="f-label">Nombre de usuario</label>
            <div style={{ position:'relative' }}>
              <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:'var(--ink4)', fontSize:14 }}>@</span>
              <input className="f-input" type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="usuario" style={{ paddingLeft:26 }} />
            </div>
          </div>
          {profErr && <div style={{ fontSize:12, color:'var(--red)', marginBottom:8 }}>{profErr}</div>}
          <button className="btn btn-accent btn-sm" onClick={saveProfile}>Guardar cambios</button>
        </div>

        {/* Contraseña */}
        <div className="settings-card">
          <div className="settings-card-title">Contraseña</div>
          <div className="settings-field">
            <label className="f-label">Nueva contraseña</label>
            <div className="pass-wrap">
              <input className="f-input" type="password" value={pass1} onChange={e => setPass1(e.target.value)} placeholder="Mínimo 8 caracteres" />
            </div>
          </div>
          <div className="settings-field">
            <label className="f-label">Confirmar contraseña</label>
            <div className="pass-wrap">
              <input className="f-input" type="password" value={pass2} onChange={e => setPass2(e.target.value)} placeholder="Repite la contraseña" />
            </div>
          </div>
          {passErr && <div style={{ fontSize:12, color:'var(--red)', marginBottom:8 }}>{passErr}</div>}
          {passOk  && <div style={{ fontSize:12, color:'var(--green)', marginBottom:8 }}>✓ Contraseña actualizada</div>}
          <button className="btn btn-accent btn-sm" onClick={savePassword}>Cambiar contraseña</button>
        </div>

        {/* Sesión */}
        <div className="settings-card">
          <div className="settings-card-title">Sesión</div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:'var(--ink2)' }}>Cerrar sesión</div>
              <div style={{ fontSize:12, color:'var(--ink4)', marginTop:2 }}>Salir de tu cuenta en este dispositivo</div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={onLogout}>Cerrar sesión</button>
          </div>
        </div>

        {/* Legal */}
        <div className="settings-card">
          <div className="settings-card-title">Legal</div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:'var(--ink2)' }}>Términos y condiciones</div>
              <div style={{ fontSize:12, color:'var(--ink4)', marginTop:2 }}>Consulta los términos de uso de la plataforma</div>
            </div>
            <Link href="/terms" target="_blank" className="btn btn-ghost btn-sm" style={{ textDecoration:'none' }}>Leer →</Link>
          </div>
        </div>

        {/* Zona peligrosa */}
        <div className="settings-card settings-card-danger">
          <div className="settings-card-title" style={{ color:'var(--red)' }}>Zona peligrosa</div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', flexWrap:'wrap', gap:10 }}>
            <div>
              <div style={{ fontSize:13, fontWeight:600, color:'var(--ink2)' }}>Eliminar cuenta</div>
              <div style={{ fontSize:12, color:'var(--ink4)', marginTop:2 }}>Esta acción es permanente e irreversible</div>
            </div>
            <button className="btn btn-sm" style={{ background:'var(--red-bg)', color:'var(--red)', border:'1px solid var(--red-ln)' }} onClick={deleteAccount}>Eliminar cuenta</button>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Login Screen ──────────────────────────
function LoginScreen({ onLogin }) {
  const [tab, setTab]       = useState('login')
  const [email, setEmail]   = useState('')
  const [pass, setPass]     = useState('')
  const [name, setName]     = useState('')
  const [uname, setUname]   = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPass, setRegPass]   = useState('')
  const [fEmail, setFEmail]     = useState('')
  const [showPass, setShowPass] = useState(false)
  const [err, setErr]           = useState('')
  const [loading, setLoading]   = useState(false)
  const [forgotOk, setForgotOk] = useState(false)
  const [resetOpen, setResetOpen] = useState(false)
  const [newPass, setNewPass]     = useState('')

  // Check for password reset hash
  useEffect(() => {
    const params = new URLSearchParams(window.location.hash.replace('#','?'))
    if (params.get('type') === 'recovery') setTimeout(() => setResetOpen(true), 0)
  }, [])

  async function doLogin() {
    setErr(''); setLoading(true)
    if (!email || !pass) { setErr('Rellena todos los campos'); setLoading(false); return }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password: pass })
    if (error) { setErr('Email o contraseña incorrectos'); setLoading(false); return }
    const { data: rows } = await supabase.from('users').select('role').eq('id', data.user.id).limit(1)
    if (rows?.[0]?.role && rows[0].role !== 'player') {
      await supabase.auth.signOut()
      setErr('Esta app es solo para jugadores. Los organizadores deben acceder desde su plataforma.')
      setLoading(false); return
    }
    onLogin(data.user)
  }

  async function doRegister() {
    setErr(''); setLoading(true)
    if (!name || !uname || !regEmail || !regPass) { setErr('Rellena todos los campos'); setLoading(false); return }
    if (regPass.length < 8) { setErr('La contraseña debe tener al menos 8 caracteres'); setLoading(false); return }
    if (!/^[a-z0-9_]+$/i.test(uname)) { setErr('Usuario solo puede contener letras, números y _'); setLoading(false); return }
    const { data, error } = await supabase.auth.signUp({ email: regEmail, password: regPass, options: { data: { username: uname, full_name: name, role: 'player' } } })
    if (error) { setErr(error.message); setLoading(false); return }
    await supabase.from('users').insert({ id: data.user.id, username: uname, club_name: name, role: 'player' })
    onLogin(data.user)
  }

  async function doForgot() {
    setErr('')
    if (!fEmail) { setErr('Introduce tu email'); return }
    await supabase.auth.resetPasswordForEmail(fEmail, { redirectTo: window.location.origin + '/jugador' })
    setForgotOk(true)
  }

  async function confirmReset() {
    if (newPass.length < 8) return
    await supabase.auth.updateUser({ password: newPass })
    setResetOpen(false)
    window.history.replaceState(null, '', '/jugador')
  }

  return (
    <div className="login-screen">
      <div className="login-logo">
        <img src="/novuraxe-logo.png" alt="NOVURAXE" />
        <div className="login-logo-sub">Gestión de Torneos</div>
        <div className="login-role-tag">Portal del Jugador</div>
      </div>

      <div className="login-box">
        <div className="l-tabs">
          <button className={`l-tab${tab === 'login' ? ' on' : ''}`} onClick={() => { setTab('login'); setErr('') }}>Iniciar sesión</button>
          <button className={`l-tab${tab === 'reg' ? ' on' : ''}`} onClick={() => { setTab('reg'); setErr('') }}>Registrarse</button>
        </div>

        {tab === 'login' && (
          <>
            {err && <div className="err-msg">{err}</div>}
            <div className="field">
              <label className="f-label">Email</label>
              <input className="f-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" />
            </div>
            <div className="field">
              <label className="f-label">Contraseña</label>
              <div className="pass-wrap">
                <input className="f-input" type={showPass ? 'text' : 'password'} value={pass} onChange={e => setPass(e.target.value)} onKeyDown={e => e.key === 'Enter' && doLogin()} placeholder="••••••••" />
                <button className="pass-eye" onClick={() => setShowPass(p => !p)}>{showPass ? '🙈' : '👁'}</button>
              </div>
            </div>
            <button className="btn-full" onClick={doLogin} disabled={loading} style={{ marginBottom:'0.75rem' }}>{loading ? 'Entrando...' : 'Entrar'}</button>
            <div style={{ textAlign:'center' }}>
              <button className="link-small" onClick={() => setTab('forgot')}>¿Olvidaste tu contraseña?</button>
            </div>
          </>
        )}

        {tab === 'forgot' && (
          <>
            {err && <div className="err-msg">{err}</div>}
            {forgotOk && <div style={{ fontSize:12, color:'var(--green)', marginBottom:'0.75rem' }}>✓ Enlace enviado, revisa tu email</div>}
            <div className="field">
              <label className="f-label">Email</label>
              <input className="f-input" type="email" value={fEmail} onChange={e => setFEmail(e.target.value)} placeholder="tu@email.com" />
            </div>
            <button className="btn-full" onClick={doForgot} style={{ marginBottom:'0.75rem' }}>Enviar enlace</button>
            <div style={{ textAlign:'center' }}><button className="link-small" onClick={() => setTab('login')}>← Volver al login</button></div>
          </>
        )}

        {tab === 'reg' && (
          <>
            {err && <div className="err-msg">{err}</div>}
            <div className="field"><label className="f-label">Nombre</label><input className="f-input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Tu nombre completo" /></div>
            <div className="field"><label className="f-label">Usuario</label><input className="f-input" type="text" value={uname} onChange={e => setUname(e.target.value)} placeholder="@usuario" /></div>
            <div className="field"><label className="f-label">Email</label><input className="f-input" type="email" value={regEmail} onChange={e => setRegEmail(e.target.value)} placeholder="tu@email.com" /></div>
            <div className="field">
              <label className="f-label">Contraseña</label>
              <div className="pass-wrap">
                <input className="f-input" type="password" value={regPass} onChange={e => setRegPass(e.target.value)} placeholder="Mínimo 8 caracteres" />
              </div>
              <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'0.875rem 1rem', marginTop:'0.75rem', marginBottom:'1rem', fontSize:12, color:'rgba(255,255,255,0.45)', lineHeight:1.6, textAlign:'center' }}>
                Al crear una cuenta aceptas nuestros{' '}
                <Link href="/terms" target="_blank" style={{ color:'#C4873A', textDecoration:'underline', textUnderlineOffset:3 }}>Términos de Uso y Política de Privacidad</Link>.
              </div>
            </div>
            <button className="btn-full" onClick={doRegister} disabled={loading}>{loading ? 'Creando cuenta...' : 'Crear cuenta de jugador'}</button>
          </>
        )}
      </div>

      {/* Modal reset password */}
      {resetOpen && (
        <div className="modal-overlay on">
          <div className="modal" style={{ maxWidth:360 }}>
            <div className="modal-title">Nueva contraseña</div>
            <div className="field">
              <label className="f-label">Contraseña nueva</label>
              <input className="f-input" type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Mínimo 8 caracteres" />
            </div>
            <button className="btn-full" onClick={confirmReset}>Guardar contraseña</button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Componente principal ──────────────────
export default function Jugador() {
  const [authUser, setAuthUser]   = useState(null)
  const [profile, setProfile]     = useState(null)
  const [follows, setFollows]     = useState(new Set())
  const [myRegs, setMyRegs]       = useState(new Map())
  const [page, setPage]           = useState('feed')
  const [ready, setReady]         = useState(false)
  const { msg: toastMsg, visible: toastVisible, show: showToast } = useToast()

  // Cursor
  useEffect(() => {
    const cursor     = document.getElementById('cursor')
    const cursorRing = document.getElementById('cursor-ring')
    if (!cursor || !cursorRing) return
    const onMove = e => {
      cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'
      setTimeout(() => { cursorRing.style.left = e.clientX + 'px'; cursorRing.style.top = e.clientY + 'px' }, 60)
    }
    const addH = () => { cursor.classList.add('hover'); cursorRing.classList.add('hover') }
    const rmH  = () => { cursor.classList.remove('hover'); cursorRing.classList.remove('hover') }
    document.addEventListener('mousemove', onMove)
    document.querySelectorAll('a,button').forEach(el => { el.addEventListener('mouseenter', addH); el.addEventListener('mouseleave', rmH) })
    return () => document.removeEventListener('mousemove', onMove)
  }, [ready])

  const launchApp = async (user) => {
    setAuthUser(user)
    const { data: rows } = await supabase.from('users').select('id,username,club_name,avatar_url,created_at').eq('id', user.id).limit(1)
    let prof
    if (rows?.length) {
      prof = rows[0]
    } else {
      const newProf = { id: user.id, username: user.user_metadata?.username || user.email.split('@')[0], club_name: user.user_metadata?.full_name || '', role: 'player' }
      await supabase.from('users').insert(newProf)
      prof = newProf
    }
    setProfile(prof)
    const { data: fws } = await supabase.from('follows').select('following_id').eq('follower_id', user.id)
    setFollows(new Set((fws || []).map(f => f.following_id)))
    setReady(true)
  }

  // Restore session
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { setReady(true); return }
      const { data: rows } = await supabase.from('users').select('role').eq('id', session.user.id).limit(1)
      if (rows?.[0]?.role && rows[0].role !== 'player') {
        await supabase.auth.signOut(); setReady(true); return
      }
      await launchApp(session.user)
    })
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    setAuthUser(null); setProfile(null); setFollows(new Set()); setMyRegs(new Map()); setPage('feed')
  }

  const pages = ['feed', 'orgs', 'stats', 'history', 'settings']
  const pageLabels = { feed: 'Feed', orgs: 'Organizadores', stats: 'Mis stats', history: 'Historial', settings: '⚙️' }
  const mobLabels  = { feed: ['🏆', 'Feed'], orgs: ['🏟', 'Clubs'], stats: ['📊', 'Stats'], history: ['📁', 'Historial'], settings: ['⚙️', 'Ajustes'] }

  return (
    <>
      <Head>
        <title>NOVURAXE — Portal del Jugador</title>
        <meta name="description" content="Portal del jugador de NOVURAXE. Feed, organizadores, estadísticas e historial." />
        <link rel="icon" href="/dataxe-simple.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
        <style>{PAGE_CSS}</style>
      </Head>

      <div className="cursor" id="cursor"></div>
      <div className="cursor-ring" id="cursor-ring"></div>

      <div className={`toast-wrap${toastVisible ? ' show' : ''}`}>{toastMsg}</div>

      {!ready ? (
        <div style={{ display:'flex', alignItems:'center', justifyContent:'center', minHeight:'100vh' }}>
          <div className="spinner" style={{ width:28, height:28, borderWidth:3 }}></div>
        </div>
      ) : !authUser ? (
        <LoginScreen onLogin={launchApp} />
      ) : (
        <div className="app-shell">
          <div className="topbar">
            <div className="t-logo"><Link href="/"><img src="/novuraxe-logo.png" alt="NOVURAXE" /></Link></div>
            <div className="t-sep"></div>
            <div className="t-role-badge">Jugador</div>
            <div className="t-sep"></div>
            <nav className="t-nav">
              {['feed','orgs','stats','history'].map(p => (
                <button key={p} className={`t-nav-btn${page === p ? ' on' : ''}`} onClick={() => setPage(p)}>{pageLabels[p]}</button>
              ))}
            </nav>
            <div className="t-right">
              <span className="t-username">{profile?.username || authUser.email}</span>
              <button className="btn btn-ghost btn-sm" onClick={() => setPage('settings')}>⚙️</button>
              <button className="btn btn-ghost btn-sm" onClick={handleLogout}>Salir</button>
            </div>
          </div>

          <nav className="mob-nav">
            {pages.map(p => (
              <button key={p} className={`mob-btn${page === p ? ' on' : ''}`} onClick={() => setPage(p)}>
                <span className="mob-icon">{mobLabels[p][0]}</span>
                {mobLabels[p][1]}
              </button>
            ))}
          </nav>

          <div className="content">
            {page === 'feed'     && <PageFeed     user={authUser} profile={profile} follows={follows} myRegs={myRegs} setMyRegs={setMyRegs} onNav={setPage} toast={showToast} />}
            {page === 'orgs'     && <PageOrgs     user={authUser} follows={follows} setFollows={setFollows} toast={showToast} />}
            {page === 'stats'    && <PageStats    user={authUser} profile={profile} toast={showToast} />}
            {page === 'history'  && <PageHistory  user={authUser} />}
            {page === 'settings' && <PageSettings user={authUser} profile={profile} setProfile={setProfile} follows={follows} onLogout={handleLogout} toast={showToast} />}
          </div>
        </div>
      )}
    </>
  )
}