// pages/live.jsx
// ─────────────────────────────────────────────
// NOVURAXE — Vista espectador en vivo
// Página pública sin login
// ─────────────────────────────────────────────
import { useEffect, useState, useRef } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

const PAGE_CSS = `
/* ─────────────────────────────────────────────
   NOVURAXE — Live Page Styles
   Archivo: styles/live.css
   ───────────────────────────────────────────── */

:root {
  --bg:     #0d0d0f;
  --bg2:    #111114;
  --bg3:    #18181c;
  --border: rgba(255,255,255,0.07);
  --amber:  #c4873a;
  --amber2: #e8a84e;
  --ink:    #f0ece6;
  --ink3:   rgba(240,236,230,0.55);
  --ink4:   rgba(240,236,230,0.3);
  --green:  #4cd98a;
  --red:    #e05555;
  --r:      10px;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

body {
  background: var(--bg);
  color: var(--ink);
  font-family: 'Segoe UI', system-ui, sans-serif;
  min-height: 100vh;
  overflow-x: hidden;
}

/* ── SCANLINE ── */
body::before {
  content: '';
  position: fixed; inset: 0; z-index: 0; pointer-events: none;
  background: repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px);
}

/* ── NAV ── */
.live-nav {
  position: fixed; top: 0; left: 0; right: 0;
  z-index: 100; padding: 0 2.5rem; height: 88px;
  display: flex; align-items: center; justify-content: space-between;
  transition: all 0.3s;
}
.live-nav.scrolled {
  background: rgba(13,13,15,0.95);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(196,135,58,0.15);
}
.logo-img {
  height: 56px; width: auto; object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(196,135,58,0.2));
}
.nav-links { display: flex; align-items: center; gap: 0.25rem; list-style: none; }
.nav-links a {
  font-family: 'DM Mono', monospace;
  font-size: 11px; font-weight: 500; letter-spacing: 1.5px;
  text-transform: uppercase; color: rgba(240,236,230,0.5);
  text-decoration: none; padding: 6px 14px; border-radius: 4px; transition: all 0.2s;
}
.nav-links a:hover { color: #f0ece6; background: rgba(255,255,255,0.06); }
.nav-cta { background: var(--amber) !important; color: #0d0d0f !important; font-weight: 500 !important; padding: 8px 20px !important; }
.nav-cta:hover { background: #e8a84e !important; transform: translateY(-1px); }
.nav-mobile-btn { display: none; background: none; border: none; color: #f0ece6; font-size: 22px; cursor: pointer; }

/* ── LIVE BADGE ── */
.live-badge {
  display: flex; align-items: center; gap: 6px;
  font-family: 'DM Mono', monospace;
  font-size: 10px; font-weight: 500; letter-spacing: 2px;
  text-transform: uppercase; color: var(--green);
  border: 1px solid rgba(76,217,138,0.25);
  padding: 5px 12px; border-radius: 20px;
  background: rgba(76,217,138,0.07);
}
.live-dot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--green); box-shadow: 0 0 6px var(--green);
  animation: pulse-dot 1.4s ease-in-out infinite; flex-shrink: 0;
}
@keyframes pulse-dot {
  0%,100% { opacity: 1; transform: scale(1); }
  50%      { opacity: 0.5; transform: scale(0.7); }
}
.last-updated { font-family: 'DM Mono', monospace; font-size: 10px; color: rgba(240,236,230,0.25); }

/* ── MOBILE MENU ── */
.mobile-menu {
  display: none; position: fixed; inset: 0;
  background: rgba(13,13,15,0.97); z-index: 99;
  flex-direction: column; align-items: center; justify-content: center;
  gap: 2rem; backdrop-filter: blur(20px);
}
.mobile-menu.open { display: flex; }
.mobile-menu a { font-family: 'Bebas Neue', sans-serif; font-size: 2.5rem; letter-spacing: 2px; color: #f0ece6; text-decoration: none; transition: color 0.2s; }
.mobile-menu a:hover { color: var(--amber); }
.mobile-menu-close { position: absolute; top: 1.5rem; right: 1.5rem; background: none; border: none; color: rgba(240,236,230,0.3); font-size: 1.5rem; cursor: pointer; font-family: 'DM Mono', monospace; }

/* ── LAYOUT ── */
.wrap { max-width: 1100px; margin: 0 auto; padding: 7rem 1.5rem 6rem; position: relative; z-index: 1; }

/* ── STATES ── */
.state-center { text-align: center; padding: 8rem 2rem; display: flex; flex-direction: column; align-items: center; gap: 1rem; }
.state-icon { font-size: 3rem; opacity: 0.25; }
.state-title { font-family: 'Bebas Neue', sans-serif; font-size: 2rem; letter-spacing: 2px; color: var(--ink3); }
.state-sub { font-size: 13px; color: var(--ink4); }
.spinner { width: 32px; height: 32px; border-radius: 50%; border: 2px solid rgba(196,135,58,0.15); border-top-color: var(--amber); animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

/* ── ACCORDION LIST ── */
.tournament-list { display: flex; flex-direction: column; gap: 0; }
.t-banner {
  display: flex; align-items: center; gap: 1rem;
  padding: 1.1rem 1.5rem; background: var(--bg2);
  border: 1px solid var(--border); border-radius: var(--r);
  cursor: pointer; transition: all 0.2s;
  position: relative; z-index: 1; margin-bottom: 2px; user-select: none;
}
.t-banner:hover { border-color: rgba(196,135,58,0.3); background: rgba(196,135,58,0.04); }
.t-banner.open { border-color: rgba(196,135,58,0.4); background: rgba(196,135,58,0.06); border-radius: var(--r) var(--r) 0 0; margin-bottom: 0; }
.t-banner-logo { width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0; overflow: hidden; background: rgba(196,135,58,0.1); border: 1px solid rgba(196,135,58,0.2); display: flex; align-items: center; justify-content: center; font-size: 1.2rem; }
.t-banner-logo img { width: 100%; height: 100%; object-fit: cover; }
.t-banner-info { flex: 1; min-width: 0; }
.t-banner-name { font-weight: 700; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.t-banner-meta { font-size: 11px; color: var(--ink4); margin-top: 2px; }
.t-banner-champ { font-size: 11px; color: var(--amber); margin-top: 3px; font-weight: 600; }
.t-banner-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
.org-live-badge { font-size: 9px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; background: rgba(76,217,138,0.1); color: var(--green); border: 1px solid rgba(76,217,138,0.2); display: flex; align-items: center; gap: 5px; }
.org-done-badge { font-size: 9px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; background: rgba(255,255,255,0.04); color: var(--ink4); border: 1px solid rgba(255,255,255,0.08); }
.org-closed-badge { font-size: 9px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; background: rgba(212,99,90,0.12); color: #e05555; border: 1px solid rgba(212,99,90,0.35); }
.org-pending-badge { font-size: 9px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; padding: 3px 10px; border-radius: 20px; background: rgba(196,135,58,0.15); color: var(--amber); border: 1px solid rgba(196,135,58,0.3); display: flex; align-items: center; gap: 5px; }
.t-banner-chevron { font-size: 11px; color: var(--ink4); transition: transform 0.25s; flex-shrink: 0; }
.t-banner-chevron.open { transform: rotate(180deg); }

/* Panel */
.t-panel { overflow: hidden; background: var(--bg); border: 1px solid rgba(196,135,58,0.25); border-top: none; border-radius: 0 0 var(--r) var(--r); margin-bottom: 12px; }
.t-panel-inner { padding: 1.5rem; }

/* Section labels */
.list-section-label { font-family: 'DM Mono', monospace; font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--ink4); margin-bottom: 0.75rem; display: flex; align-items: center; gap: 8px; }
.list-section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }

/* ── TABS ── */
.tabs { display: flex; gap: 4px; margin-bottom: 1.75rem; background: var(--bg2); border: 1px solid var(--border); border-radius: 10px; padding: 4px; width: fit-content; }
.tab-btn { font-size: 12px; font-weight: 700; letter-spacing: 0.5px; padding: 8px 18px; border-radius: 7px; border: none; background: none; color: var(--ink4); cursor: pointer; font-family: inherit; transition: all 0.15s; }
.tab-btn:hover { color: var(--ink); }
.tab-btn.on { background: rgba(196,135,58,0.15); color: var(--amber); }

/* ── TOURNAMENT INFO CARD ── */
.t-info-card { background: var(--bg2); border: 1px solid var(--border); border-radius: var(--r); padding: 1.5rem; margin-bottom: 1.75rem; display: flex; align-items: center; gap: 1.5rem; flex-wrap: wrap; }
.t-info-logo { width: 56px; height: 56px; border-radius: 50%; flex-shrink: 0; overflow: hidden; background: rgba(196,135,58,0.1); border: 2px solid rgba(196,135,58,0.3); display: flex; align-items: center; justify-content: center; font-size: 1.5rem; }
.t-info-logo img { width: 100%; height: 100%; object-fit: cover; }
.t-info-name { font-family: 'Bebas Neue', sans-serif; font-size: 1.6rem; letter-spacing: 2px; }
.t-info-meta { font-size: 12px; color: var(--ink4); margin-top: 3px; }
.t-info-pills { display: flex; gap: 6px; flex-wrap: wrap; margin-left: auto; }
.pill { font-size: 10px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; padding: 4px 12px; border-radius: 20px; }
.pill-phase-qualify { background: rgba(99,179,237,0.1); color: #63b3ed; border: 1px solid rgba(99,179,237,0.2); }
.pill-phase-elim    { background: rgba(196,135,58,0.1); color: var(--amber); border: 1px solid rgba(196,135,58,0.2); }
.pill-phase-done    { background: rgba(76,217,138,0.1); color: var(--green); border: 1px solid rgba(76,217,138,0.2); }
.pill-pro  { background: rgba(196,135,58,0.12); color: var(--amber); border: 1px solid rgba(196,135,58,0.25); }
.pill-semi { background: rgba(99,179,237,0.1); color: #63b3ed; border: 1px solid rgba(99,179,237,0.25); }

/* ── QUALIFY TABLE ── */
.qual-table-wrap { overflow-x: auto; border-radius: var(--r); border: 1px solid var(--border); }
table.qual-table { width: 100%; border-collapse: collapse; font-size: 13px; min-width: 400px; }
.qual-table thead tr { background: var(--bg2); }
.qual-table th { padding: 10px 14px; text-align: left; font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--ink4); border-bottom: 1px solid var(--border); }
.qual-table th.center, .qual-table td.center { text-align: center; }
.qual-table td { padding: 11px 14px; border-bottom: 1px solid rgba(255,255,255,0.04); }
.qual-table tr:last-child td { border-bottom: none; }
.qual-table tr { background: var(--bg); transition: background 0.15s; }
.qual-table tr:hover { background: rgba(255,255,255,0.02); }
.rank-num { font-family: 'DM Mono', monospace; font-size: 11px; color: var(--ink4); font-weight: 500; }
.rank-1 { color: #d4af37; }
.rank-2 { color: #a8a8b8; }
.rank-3 { color: #b06432; }
.player-name { font-weight: 700; font-size: 14px; }
.player-name.dq { opacity: 0.35; text-decoration: line-through; }
.score-pts { font-family: 'DM Mono', monospace; font-size: 15px; font-weight: 500; color: var(--amber); }
.score-ks { font-size: 10px; color: var(--ink4); margin-top: 1px; }
.throws-mini { display: flex; gap: 3px; flex-wrap: wrap; }
.t-cell { width: 20px; height: 20px; border-radius: 4px; font-size: 9px; font-weight: 700; display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.04); color: var(--ink4); }
.t-cell.scored { background: rgba(196,135,58,0.12); color: var(--amber); }
.t-cell.is-ks  { background: rgba(76,217,138,0.15); color: var(--green); font-size: 8px; }
.t-cell.is-zero { background: rgba(224,85,85,0.1); color: var(--red); }

/* ── BRACKET ── */
.bracket-scroll { overflow-x: auto; padding-bottom: 1rem; }
.bracket-wrap { display: flex; gap: 0; align-items: flex-start; min-width: max-content; padding: 1rem; }
.b-round { display: flex; flex-direction: column; }
.b-round-hdr { font-family: 'DM Mono', monospace; font-size: 9px; font-weight: 500; letter-spacing: 2px; text-transform: uppercase; color: var(--ink4); text-align: center; padding: 0 0 1rem; min-width: 180px; }
.b-matches { display: flex; flex-direction: column; gap: 0; align-items: center; }
.b-match-wrap { display: flex; align-items: center; margin-bottom: 0; }
.b-match { width: 170px; background: var(--bg2); border: 1px solid var(--border); border-radius: 8px; overflow: hidden; margin: 8px 0; }
.b-match.final { border-color: rgba(196,135,58,0.35); box-shadow: 0 0 20px rgba(196,135,58,0.08); }
.b-row { display: flex; align-items: center; justify-content: space-between; padding: 9px 12px; gap: 8px; font-size: 13px; font-weight: 600; transition: background 0.15s; }
.b-row.b-winner { background: rgba(76,217,138,0.08); color: var(--green); }
.b-row.b-loser { color: var(--ink4); }
.b-row.b-tbd { color: var(--ink4); font-style: italic; font-weight: 400; }
.b-row-name { flex: 1; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 12px; }
.b-row-score { font-family: 'DM Mono', monospace; font-size: 13px; font-weight: 700; color: var(--amber); flex-shrink: 0; }
.b-divider { height: 1px; background: var(--border); }
.b-connector { width: 24px; height: 2px; background: var(--border); flex-shrink: 0; }
.b-winner-badge { display: flex; align-items: center; gap: 8px; padding: 7px 12px; font-size: 11px; font-weight: 700; color: var(--green); background: rgba(76,217,138,0.06); border-top: 1px solid rgba(76,217,138,0.1); }
.b-sd-badge { display: inline-flex; align-items: center; gap: 4px; font-size: 9px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #e05555; background: rgba(184,64,64,0.12); border: 1px solid rgba(184,64,64,0.3); border-radius: 4px; padding: 2px 6px; margin-left: 4px; }

/* ── CHAMPION CARD ── */
.champion-card { background: linear-gradient(135deg, rgba(196,135,58,0.12), rgba(196,135,58,0.04)); border: 1px solid rgba(196,135,58,0.3); border-radius: 14px; padding: 2rem; text-align: center; margin-bottom: 2rem; position: relative; overflow: hidden; }
.champion-card::before { content: '🏆'; font-size: 80px; opacity: 0.05; position: absolute; top: -10px; right: -10px; }
.champion-label { font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--amber); margin-bottom: 8px; }
.champion-name { font-family: 'Bebas Neue', sans-serif; font-size: 2.5rem; letter-spacing: 3px; color: #f0ece6; }

/* ── GROUP TABS ── */
.group-selector { display: flex; align-items: center; gap: 1rem; margin-bottom: 1.5rem; padding: 1rem 1.25rem; background: rgba(255,255,255,0.02); border: 1px solid var(--border); border-radius: 12px; }
.group-selector-label { font-size: 10px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--ink4); font-family: 'DM Mono', monospace; flex-shrink: 0; }
.group-tabs { display: flex; gap: 6px; }
.group-tab { display: flex; align-items: center; gap: 7px; padding: 9px 20px; border-radius: 8px; font-size: 13px; font-weight: 700; letter-spacing: 1px; border: 1px solid var(--border); background: none; color: var(--ink4); cursor: pointer; font-family: 'Segoe UI', system-ui, sans-serif; transition: all 0.2s; text-transform: uppercase; }
.group-tab:hover { color: var(--ink); border-color: rgba(255,255,255,0.2); }
.group-tab.on { background: rgba(196,135,58,0.12); border-color: rgba(196,135,58,0.4); color: var(--amber); box-shadow: 0 0 12px rgba(196,135,58,0.1); }
.group-tab-dot { width: 7px; height: 7px; border-radius: 50%; flex-shrink: 0; }
.pro-dot  { background: var(--amber); }
.semi-dot { background: #63b3ed; }
.group-tab.on .pro-dot  { box-shadow: 0 0 6px rgba(196,135,58,0.8); }
.group-tab.on .semi-dot { box-shadow: 0 0 6px rgba(99,179,237,0.8); }

/* ── BACK BTN ── */
.back-btn { font-size: 12px; color: var(--ink4); background: none; border: 1px solid var(--border); border-radius: 6px; padding: 6px 14px; cursor: pointer; font-family: inherit; transition: all 0.15s; }
.back-btn:hover { color: var(--ink); border-color: rgba(255,255,255,0.2); }

/* ── FOOTER ── */
.live-footer { text-align: center; padding: 3rem 1rem 2rem; font-size: 11px; color: var(--ink4); font-family: 'DM Mono', monospace; border-top: 1px solid var(--border); position: relative; z-index: 1; }
.live-footer a { color: var(--amber); text-decoration: none; }

/* ── ANIMATIONS ── */
.fade-in { animation: fadeIn 0.4s ease both; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: none; } }

/* ── RESPONSIVE ── */
@media (max-width: 900px) {
  .live-nav { padding: 0 1.5rem; }
  .nav-links { display: none; }
  .nav-mobile-btn { display: block; }
}
@media (max-width: 600px) {
  .live-nav { height: 64px; padding: 0 1rem; }
  .logo-img { height: 40px; }
  .wrap { padding: 5rem 1rem 4rem; }
  .t-info-card { flex-direction: column; align-items: flex-start; gap: 0.75rem; padding: 1rem; }
  .t-info-pills { margin-left: 0; }
  .tabs { width: 100%; }
  .tab-btn { flex: 1; padding: 8px 10px; font-size: 11px; }
  .group-selector { flex-direction: column; align-items: flex-start; gap: 0.5rem; padding: 0.75rem 1rem; }
  .group-tabs { width: 100%; }
  .group-tab { flex: 1; justify-content: center; padding: 9px 12px; }
  .champion-card { padding: 1.25rem; }
  .champion-name { font-size: 2rem; }
}
`


const QUAL_KS_VAL = 8

// ─── Helpers puros (sin DOM, sin estado) ───────
function fmtDate(d) {
  if (!d) return ''
  return new Date(d + 'T12:00:00').toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

function rndName(ri, total) {
  const r = total - ri
  if (r === 1) return 'FINAL'
  if (r === 2) return 'SEMIFINAL'
  if (r === 3) return 'CUARTOS'
  return 'RONDA ' + (ri + 1)
}

function parseState(state_json) {
  if (!state_json) return {}
  if (typeof state_json === 'string') { try { return JSON.parse(state_json) } catch { return {} } }
  return state_json
}

function getChampions(state) {
  const champs = [state?.pro?.champion, state?.semi?.champion].filter(Boolean)
  return champs
}

// ─── Sub-componentes ────────────────────────

// Tabla de clasificación
function QualifyView({ group }) {
  const g = group || { players: [], qualScores: {}, qualCfg: { rounds: 2, throws: 10 } }
  const activePlayers = (g.players || []).filter(p => !p.disqualified)

  if (!activePlayers.length) {
    return (
      <div className="state-center" style={{ padding: '4rem' }}>
        <div className="state-icon">📊</div>
        <div className="state-sub">Sin jugadores en clasificación todavía</div>
      </div>
    )
  }

  const ranked = activePlayers.map(pl => {
    let total = 0, ks = 0
    for (let r = 0; r < (g.qualCfg?.rounds || 2); r++) {
      const throws = (g.qualScores?.[pl.id] || {})['r' + r] || []
      throws.forEach(v => { if (v !== null) { total += v; if (v === QUAL_KS_VAL) ks++ } })
    }
    return { ...pl, total, ks }
  }).sort((a, b) => b.total - a.total)

  const dqPlayers = (g.players || []).filter(p => p.disqualified)
  const rounds = g.qualCfg?.rounds || 2
  const throwsPerRound = g.qualCfg?.throws || 10

  return (
    <div className="qual-table-wrap">
      <table className="qual-table">
        <thead>
          <tr>
            <th style={{ width: '50px' }}>#</th>
            <th>Jugador</th>
            <th className="center">Puntos</th>
            <th>Lanzamientos por ronda</th>
          </tr>
        </thead>
        <tbody>
          {ranked.map((pl, i) => {
            const rankClass = i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : ''
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : null

            // Construir celdas de lanzamientos por ronda
            const throwsContent = []
            for (let r = 0; r < rounds; r++) {
              const sc = (g.qualScores?.[pl.id] || {})['r' + r] || []
              if (!sc.some(v => v !== null)) continue
              const rTotal = sc.reduce((s, v) => s + (v || 0), 0)
              throwsContent.push(
                <div key={r} style={{ display: 'flex', flexDirection: 'column', gap: '3px', ...(r < rounds - 1 ? { marginBottom: '5px', paddingBottom: '5px', borderBottom: '1px solid rgba(255,255,255,0.05)' } : {}) }}>
                  <div style={{ fontSize: '9px', color: 'var(--ink4)', fontFamily: "'DM Mono',monospace", letterSpacing: '1px', marginBottom: '2px' }}>R{r + 1} · {rTotal}pts</div>
                  <div className="throws-mini">
                    {Array.from({ length: throwsPerRound }, (_, t) => {
                      const v = sc[t] ?? null
                      if (v === null) return <div key={t} className="t-cell"></div>
                      if (v === QUAL_KS_VAL) return <div key={t} className="t-cell is-ks">KS</div>
                      if (v === 0) return <div key={t} className="t-cell is-zero">0</div>
                      return <div key={t} className="t-cell scored">{v}</div>
                    })}
                  </div>
                </div>
              )
            }

            return (
              <tr key={pl.id}>
                <td><span className={`rank-num ${rankClass}`}>{medal || '#' + (i + 1)}</span></td>
                <td><div className="player-name">{pl.name}</div></td>
                <td className="center">
                  <div className="score-pts">{pl.total}</div>
                  {pl.ks > 0 && <div className="score-ks">{pl.ks} KS</div>}
                </td>
                <td><div style={{ minWidth: '200px' }}>{throwsContent}</div></td>
              </tr>
            )
          })}
          {dqPlayers.map(pl => (
            <tr key={pl.id}>
              <td colSpan={4}><span className="rank-num">DQ</span> <span className="player-name dq">{pl.name}</span></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// Bracket eliminatorio
function BracketView({ group }) {
  const g = group || {}

  if (!g.rounds?.length) {
    return (
      <div className="state-center" style={{ padding: '4rem' }}>
        <div className="state-icon">🏆</div>
        <div className="state-sub">El bracket aún no ha sido generado</div>
      </div>
    )
  }

  return (
    <>
      {g.champion && (
        <div className="champion-card">
          <div className="champion-label">🏆 Campeón</div>
          <div className="champion-name">{g.champion}</div>
        </div>
      )}
      <div className="bracket-scroll">
        <div className="bracket-wrap">
          {g.rounds.map((round, ri) => (
            <>
              <div className="b-round" key={ri}>
                <div className="b-round-hdr">{rndName(ri, g.rounds.length)}</div>
                <div className="b-matches">
                  {round.map(mid => {
                    const m = (g.matches || []).find(x => x.id === mid)
                    if (!m) return null
                    const isFin = ri === g.rounds.length - 1
                    const p1W = m.winner && m.winner === m.p1
                    const p2W = m.winner && m.winner === m.p2
                    const c1 = p1W ? 'b-winner' : (p2W ? 'b-loser' : (!m.p1 ? 'b-tbd' : ''))
                    const c2 = p2W ? 'b-winner' : (p1W ? 'b-loser' : (!m.p2 ? 'b-tbd' : ''))
                    return (
                      <div className={`b-match${isFin ? ' final' : ''}`} key={mid}>
                        <div className={`b-row ${c1}`}>
                          <span className="b-row-name">{m.p1 || 'Por definir'}</span>
                          {m.score1 != null && <span className="b-row-score">{m.score1}</span>}
                        </div>
                        <div className="b-divider"></div>
                        <div className={`b-row ${c2}`}>
                          <span className="b-row-name">{m.p2 || 'Por definir'}</span>
                          {m.score2 != null && <span className="b-row-score">{m.score2}</span>}
                        </div>
                        {m.winner && (
                          <div className="b-winner-badge">
                            ✓ {m.winner}
                            {m.sdRounds?.length > 0 && <span className="b-sd-badge">💀 MS×{m.sdRounds.length}</span>}
                          </div>
                        )}
                        {!m.winner && m.bye && <div className="b-winner-badge" style={{ color: 'var(--ink4)' }}>BYE</div>}
                      </div>
                    )
                  })}
                </div>
              </div>
              {ri < g.rounds.length - 1 && (
                <div key={`conn-${ri}`} style={{ display: 'flex', alignItems: 'center', paddingTop: '3rem' }}>
                  <div className="b-connector"></div>
                </div>
              )}
            </>
          ))}
        </div>
      </div>
    </>
  )
}

// Panel de un torneo expandido
function TournamentPanel({ tournament, onBack, showBack }) {
  const state = parseState(tournament.state_json)
  const hasPro  = (state?.pro?.players?.length  || 0) > 0
  const hasSemi = (state?.semi?.players?.length || 0) > 0

  const [tab, setTab] = useState('qualify')
  const [group, setGroup] = useState(hasPro ? 'pro' : 'semi')

  const isPending  = tournament.status === 'pending'
  const isFinished = tournament.status === 'archived'
  const isClosed   = tournament.status === 'closed'
  const org        = tournament.organizers
  const s          = state
  const curGroup   = group || (hasPro ? 'pro' : 'semi')
  const g          = s?.[curGroup] || { players: [], qualScores: {}, matches: [], rounds: [], qualCfg: { rounds: 2, throws: 10 } }
  const phase      = g?.phase || 'qualify'

  // Pending — inscripciones abiertas
  if (isPending) {
    return (
      <div style={{ padding: '1.5rem 0', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📋</div>
        <div style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginBottom: '6px' }}>{s?.tName || tournament.name || 'Torneo'}</div>
        {s?.tDate && <div style={{ fontSize: '12px', color: 'var(--ink4)', marginBottom: '1rem' }}>{fmtDate(s.tDate)}{s?.tTime ? ' · ' + s.tTime : ''}{s?.tLocation ? ' · ' + s.tLocation : ''}</div>}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(76,217,138,0.1)', border: '1px solid rgba(76,217,138,0.25)', borderRadius: '20px', padding: '6px 14px', fontSize: '12px', fontWeight: 600, color: '#4cd98a', marginBottom: '1.25rem' }}>
          🟢 Inscripciones abiertas
        </div>
        {s?.tDesc && <div style={{ marginBottom: '1.25rem', fontSize: '13px', color: 'var(--ink3)', maxWidth: '400px', margin: '0 auto 1.25rem' }}>{s.tDesc}</div>}
        <Link href="/player" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#c4873a', color: '#fff', fontSize: '13px', fontWeight: 700, letterSpacing: '0.5px', padding: '10px 22px', borderRadius: '8px', textDecoration: 'none' }}>
          ✍️ Inscribirme
        </Link>
      </div>
    )
  }

  // Phase pill
  const phaseLabel = { qualify: 'Clasificación', elim: 'Eliminatorias', done: 'Finalizado' }
  const phasePill = isClosed
    ? <span className="pill" style={{ background: 'rgba(212,99,90,0.12)', color: '#e05555', border: '1px solid rgba(212,99,90,0.35)' }}>✕ Cerrado</span>
    : isFinished
      ? <span className="pill pill-phase-done">✓ Finalizado</span>
      : <span className={`pill pill-phase-${phase}`}>{phaseLabel[phase] || phase}</span>

  const champions = getChampions(s)

  return (
    <div className="fade-in">
      {/* Back button */}
      {showBack && <button className="back-btn" onClick={onBack} style={{ float: 'right', marginBottom: '1rem' }}>← Todos los torneos</button>}
      {showBack && <div style={{ clear: 'both' }}></div>}

      {/* Info card */}
      <div className="t-info-card">
        <div className="t-info-logo">
          {org?.logo_url ? <img src={org.logo_url} alt="" /> : '🏟'}
        </div>
        <div>
          <div className="t-info-name">{s?.tName || 'Torneo'}</div>
          <div className="t-info-meta">{org?.club_name || org?.username || ''}{s?.tDate ? ' · ' + fmtDate(s.tDate) : ''}</div>
        </div>
        <div className="t-info-pills">
          {phasePill}
          {hasPro  && <span className="pill pill-pro">PRO</span>}
          {hasSemi && <span className="pill pill-semi">SEMI PRO</span>}
        </div>
      </div>

      {/* Champion banner */}
      {(isFinished || isClosed) && champions.length > 0 && (
        <div className="champion-card" style={{ marginBottom: '1.75rem' }}>
          <div className="champion-label">🏆 {[s?.pro?.champion && 'Campeón PRO', s?.semi?.champion && 'Campeón SEMI PRO'].filter(Boolean).join(' · ')}</div>
          <div className="champion-name">{champions.join(' & ')}</div>
        </div>
      )}

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: '1.25rem' }}>
        <button className={`tab-btn ${tab === 'qualify' ? 'on' : ''}`} onClick={() => setTab('qualify')}>📊 Clasificación</button>
        <button className={`tab-btn ${tab === 'bracket' ? 'on' : ''}`} onClick={() => setTab('bracket')}>🏆 Bracket</button>
      </div>

      {/* Group selector */}
      {hasPro && hasSemi && (
        <div className="group-selector">
          <div className="group-selector-label">Categoría</div>
          <div className="group-tabs">
            <button className={`group-tab ${curGroup === 'pro' ? 'on' : ''}`} onClick={() => setGroup('pro')}>
              <span className="group-tab-dot pro-dot"></span> PRO
            </button>
            <button className={`group-tab ${curGroup === 'semi' ? 'on' : ''}`} onClick={() => setGroup('semi')}>
              <span className="group-tab-dot semi-dot"></span> SEMI PRO
            </button>
          </div>
        </div>
      )}

      {/* Tab content */}
      {tab === 'qualify' ? <QualifyView group={g} /> : <BracketView group={g} />}
    </div>
  )
}

// Banner de un torneo en la lista
function TournamentBanner({ tournament, isOpen, onToggle }) {
  const org   = tournament.organizers
  const state = parseState(tournament.state_json)
  const champs = getChampions(state)
  const mode  = tournament.status

  const badge = mode === 'active'
    ? <div className="org-live-badge"><span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--green)', display: 'inline-block', animation: 'pulse-dot 1.4s infinite' }}></span> Live</div>
    : mode === 'pending'
      ? <div className="org-pending-badge">📋 Inscripciones</div>
      : mode === 'closed'
        ? <div className="org-closed-badge">✕ Cerrado</div>
        : <div className="org-done-badge">✓ Finalizado</div>

  return (
    <div className={`t-banner ${isOpen ? 'open' : ''}`} onClick={onToggle}>
      <div className="t-banner-logo">
        {org?.logo_url ? <img src={org.logo_url} alt="" /> : '🏟'}
      </div>
      <div className="t-banner-info">
        <div className="t-banner-name">{tournament.name || org?.club_name || 'Torneo'}</div>
        <div className="t-banner-meta">{org?.club_name || org?.username || ''}{tournament.date ? ' · ' + fmtDate(tournament.date) : ''}</div>
        {champs.length > 0 && <div className="t-banner-champ">🏆 {champs.join(' · ')}</div>}
      </div>
      <div className="t-banner-right">
        {badge}
        <span className={`t-banner-chevron ${isOpen ? 'open' : ''}`}>▼</span>
      </div>
    </div>
  )
}

// ─── Componente principal ───────────────────
export default function Live() {
  const [loading, setLoading]       = useState(true)
  const [tournaments, setTournaments] = useState([])
  const [openId, setOpenId]         = useState(null)
  const [navScrolled, setNavScrolled] = useState(false)
  const [menuOpen, setMenuOpen]     = useState(false)
  const [lastUpdated, setLastUpdated] = useState('')
  const rtChannelRef = useRef(null)
  const pollRef      = useRef(null)

  // Scroll nav
  useEffect(() => {
    const handler = () => setNavScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  // Cursor personalizado
  useEffect(() => {
    const cursor     = document.getElementById('cursor')
    const cursorRing = document.getElementById('cursor-ring')
    if (!cursor || !cursorRing) return
    const onMove = e => {
      cursor.style.left = e.clientX + 'px'
      cursor.style.top  = e.clientY + 'px'
      setTimeout(() => {
        cursorRing.style.left = e.clientX + 'px'
        cursorRing.style.top  = e.clientY + 'px'
      }, 60)
    }
    const addHover = () => { cursor.classList.add('hover'); cursorRing.classList.add('hover') }
    const rmHover  = () => { cursor.classList.remove('hover'); cursorRing.classList.remove('hover') }
    document.addEventListener('mousemove', onMove)
    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', addHover)
      el.addEventListener('mouseleave', rmHover)
    })
    return () => document.removeEventListener('mousemove', onMove)
  }, [])

  // Cargar torneos
   function stopSync() {
    if (rtChannelRef.current) { supabase.removeChannel(rtChannelRef.current); rtChannelRef.current = null }
    if (pollRef.current) { clearInterval(pollRef.current); clearTimeout(pollRef.current); pollRef.current = null }
  }
  async function loadTournaments() {
    setLoading(true)
    try {
      // Activos y pending
      const { data: active } = await supabase
        .from('tournaments')
        .select('id,name,date,updated_at,state_json,user_id,status')
        .in('status', ['active', 'pending'])

      const hayActivos = (active || []).filter(r => r.state_json || r.status === 'pending').length > 0

      if (!hayActivos) {
        setTournaments([])
        setLoading(false)
        // Reintentar en 30s
        pollRef.current = setTimeout(loadTournaments, 30000)
        return
      }

      // También archivados y cerrados
      const [{ data: archived }, { data: closed }] = await Promise.all([
        supabase.from('tournaments').select('id,name,date,updated_at,state_json,user_id,status').eq('status', 'archived').order('updated_at', { ascending: false }).limit(20),
        supabase.from('tournaments').select('id,name,date,updated_at,state_json,user_id,status').eq('status', 'closed').order('updated_at', { ascending: false }).limit(20),
      ])

      const rows = [...(active || []), ...(archived || []), ...(closed || [])].filter(r => r.state_json || r.status === 'pending')

      // Enriquecer con datos del organizador
      const enriched = await Promise.all(rows.map(async t => {
        const { data: orgs } = await supabase.from('organizers').select('id,club_name,logo_url,username').eq('id', t.user_id).limit(1)
        return { ...t, organizers: orgs?.[0] || null }
      }))

      setTournaments(enriched)
      stampTime()

      // Si solo hay 1 activo → abrir directamente
      const activos = enriched.filter(t => t.status === 'active')
      const pendientes = enriched.filter(t => t.status === 'pending')
      const finalizados = enriched.filter(t => t.status === 'archived')
      const cerrados = enriched.filter(t => t.status === 'closed')
      if (activos.length === 1 && pendientes.length === 0 && finalizados.length === 0 && cerrados.length === 0) {
        setOpenId(String(activos[0].id))
        startLiveSync(activos[0].user_id, activos[0].id)
      }

    } catch (e) {
      console.error('[live]', e)
    }
    setLoading(false)
  }

  function stampTime() {
    setLastUpdated('Actualizado ' + new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
  }

  function handleToggle(tid) {
    const tidStr = String(tid)
    if (openId === tidStr) {
      setOpenId(null)
      stopSync()
    } else {
      setOpenId(tidStr)
      const t = tournaments.find(x => String(x.id) === tidStr)
      if (t?.status === 'active') startLiveSync(t.user_id, tid)
    }
  }

  function startLiveSync(userId, tid) {
    stopSync()
    // Realtime
    rtChannelRef.current = supabase
      .channel('live-' + userId)
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'tournaments', filter: `user_id=eq.${userId}` }, payload => {
        const row = payload.new
        if (!row?.state_json) return
        setTournaments(prev => prev.map(t => String(t.id) === String(tid) ? { ...t, state_json: row.state_json, status: row.status } : t))
        stampTime()
      })
      .subscribe()

    // Polling cada 30s
    pollRef.current = setInterval(async () => {
      const { data } = await supabase.from('tournaments').select('state_json,updated_at,status').eq('user_id', userId).eq('status', 'active').order('updated_at', { ascending: false }).limit(1)
      if (!data?.[0]?.state_json) return
      setTournaments(prev => prev.map(t => String(t.id) === String(tid) ? { ...t, state_json: data[0].state_json, status: data[0].status } : t))
      stampTime()
    }, 30000)
  }
    // Cargar torneos — va AL FINAL, después de todas las funciones
    useEffect(() => {
        loadTournaments()
        return () => stopSync()
    }, [])
  function stopSync() {
    if (rtChannelRef.current) { supabase.removeChannel(rtChannelRef.current); rtChannelRef.current = null }
    if (pollRef.current) { clearInterval(pollRef.current); clearTimeout(pollRef.current); pollRef.current = null }
  }

  // Clasificar torneos
  const activos     = tournaments.filter(t => t.status === 'active')
  const pendientes  = tournaments.filter(t => t.status === 'pending')
  const finalizados = tournaments.filter(t => t.status === 'archived')
  const cerrados    = tournaments.filter(t => t.status === 'closed')
  const hasMany     = tournaments.length > 1

  // ─── RENDER ──────────────────────────────
  return (
    <>
      <Head>
        <title>NOVURAXE · Live</title>
        <meta name="description" content="Sigue los torneos de axe throwing en tiempo real." />
        <link rel="icon" href="/dataxe-simple.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />
        <style>{PAGE_CSS}</style>
      </Head>

      {/* CURSOR */}
        <div className="cursor" id="cursor"></div>
        <div className="cursor-ring" id="cursor-ring"></div>

      {/* MOBILE MENU */}
        <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>✕ CERRAR</button>
        <Link href="/" onClick={() => setMenuOpen(false)}>Inicio</Link>
        <Link href="/#features" onClick={() => setMenuOpen(false)}>Funciones</Link>
        <Link href="/#how" onClick={() => setMenuOpen(false)}>Cómo funciona</Link>
        <Link href="/#about" onClick={() => setMenuOpen(false)}>Quiénes somos</Link>
        <Link href="/#gear" onClick={() => setMenuOpen(false)}>Equipamiento</Link>
      </div>

      {/* NAV */}
      <nav className={`live-nav ${navScrolled ? 'scrolled' : ''}`}>
        <Link href="/"><img src="/novuraxe-logo.png" alt="NOVURAXE" className="logo-img" /></Link>
        <ul className="nav-links">
          <li><Link href="/#features">Funciones</Link></li>
          <li><Link href="/#how">Cómo funciona</Link></li>
          <li><Link href="/#about">Quiénes somos</Link></li>
          <li><Link href="/#gear">Equipamiento</Link></li>
          <li>
            <div className="live-badge">
              <div className="live-dot"></div>
              LIVE
            </div>
          </li>
          {lastUpdated && <li><span className="last-updated">{lastUpdated}</span></li>}
        </ul>
        <button className="nav-mobile-btn" onClick={() => setMenuOpen(true)}>☰</button>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <div className="wrap">
        {loading ? (
          <div className="state-center">
            <div className="spinner"></div>
            <div className="state-sub">Cargando torneos activos...</div>
          </div>
        ) : tournaments.length === 0 ? (
          <div className="state-center fade-in">
            <div className="state-icon">⏳</div>
            <div className="state-title">Sin torneos en curso</div>
            <div className="state-sub">No hay ningún torneo activo ahora mismo.<br />Vuelve cuando haya uno en curso.</div>
          </div>
        ) : (
          <div className="fade-in">
            <div className="tournament-list">
              {/* Activos */}
              {activos.length > 0 && (
                <>
                  <div className="list-section-label">En directo</div>
                  {activos.map(t => (
                    <div key={t.id}>
                      <TournamentBanner tournament={t} isOpen={openId === String(t.id)} onToggle={() => handleToggle(t.id)} />
                      {openId === String(t.id) && (
                        <div className="t-panel open">
                          <div className="t-panel-inner">
                            <TournamentPanel tournament={t} onBack={() => setOpenId(null)} showBack={hasMany} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}

              {/* Pendientes */}
              {pendientes.length > 0 && (
                <>
                  <div className="list-section-label" style={{ marginTop: activos.length ? '1.5rem' : '0' }}>Próximamente</div>
                  {pendientes.map(t => (
                    <div key={t.id}>
                      <TournamentBanner tournament={t} isOpen={openId === String(t.id)} onToggle={() => handleToggle(t.id)} />
                      {openId === String(t.id) && (
                        <div className="t-panel open">
                          <div className="t-panel-inner">
                            <TournamentPanel tournament={t} onBack={() => setOpenId(null)} showBack={hasMany} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}

              {/* Finalizados */}
              {finalizados.length > 0 && (
                <>
                  <div className="list-section-label" style={{ marginTop: (activos.length || pendientes.length) ? '1.5rem' : '0' }}>Finalizados</div>
                  {finalizados.map(t => (
                    <div key={t.id}>
                      <TournamentBanner tournament={t} isOpen={openId === String(t.id)} onToggle={() => handleToggle(t.id)} />
                      {openId === String(t.id) && (
                        <div className="t-panel open">
                          <div className="t-panel-inner">
                            <TournamentPanel tournament={t} onBack={() => setOpenId(null)} showBack={hasMany} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}

              {/* Cerrados */}
              {cerrados.length > 0 && (
                <>
                  <div className="list-section-label" style={{ marginTop: '1.5rem', color: '#e05555' }}>Cerrados</div>
                  {cerrados.map(t => (
                    <div key={t.id}>
                      <TournamentBanner tournament={t} isOpen={openId === String(t.id)} onToggle={() => handleToggle(t.id)} />
                      {openId === String(t.id) && (
                        <div className="t-panel open">
                          <div className="t-panel-inner">
                            <TournamentPanel tournament={t} onBack={() => setOpenId(null)} showBack={hasMany} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="live-footer">
        NOVURAXE · Plataforma de gestión de torneos de lanzamiento de hacha ·{' '}
        <Link href="/terms">Privacidad</Link>
      </footer>
    </>
  )
}