// pages/index.jsx
// ─────────────────────────────────────────────
// NOVURAXE — Landing Page
// ─────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

const PAGE_CSS = `
/* ─────────────────────────────────────────────
   NOVURAXE — Landing Page Styles
   Archivo: styles/landing.css
   ───────────────────────────────────────────── */

/* ─── TOKENS ─── */
:root {
  --ink:     #1a1410;
  --ink2:    #2c2418;
  --ink3:    #4a3e30;
  --ink4:    #8c7d6a;
  --ink5:    #b5a898;
  --cream:   #fdfaf7;
  --cream2:  #f7f3ee;
  --cream3:  #f0ebe3;
  --line:    #ddd5c8;
  --accent:  #c4873a;
  --accent2: #d4975a;
  --accent3: #e8b87a;
  --accent-d:#a06828;
  --red:     #b84040;
  --green:   #4a7c59;
  --f-display: 'Bebas Neue', sans-serif;
  --f-body:    'Segoe UI', system-ui, sans-serif;
  --f-mono:    'DM Mono', monospace;
  --font-display: 'Bebas Neue', sans-serif;
  --font-body:    'Segoe UI', system-ui, sans-serif;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; }

body {
  font-family: var(--f-body);
  background: var(--ink);
  color: var(--cream);
  overflow-x: hidden;
  cursor: none;
}

/* ─── CURSOR ─── */
.cursor {
  position: fixed;
  width: 10px; height: 10px;
  background: var(--accent);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  transform: translate(-50%, -50%);
  transition: transform 0.1s, width 0.2s, height 0.2s, background 0.2s;
  mix-blend-mode: difference;
}
.cursor-ring {
  position: fixed;
  width: 36px; height: 36px;
  border: 1.5px solid var(--accent);
  border-radius: 50%;
  pointer-events: none;
  z-index: 9998;
  transform: translate(-50%, -50%);
  transition: all 0.12s ease;
  opacity: 0.6;
}
.cursor.hover { width: 18px; height: 18px; }
.cursor-ring.hover { width: 54px; height: 54px; opacity: 0.3; }

/* ─── NOISE OVERLAY ─── */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 1;
  opacity: 0.4;
}

/* ─── NAV ─── */
.landing-nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  padding: 0 2.5rem;
  height: 88px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s;
}
.landing-nav.scrolled {
  background: rgba(26, 20, 16, 0.92);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(196,135,58,0.15);
}
.logo-img {
  height: 56px;
  width: auto;
  object-fit: contain;
  filter: drop-shadow(0 2px 8px rgba(196,135,58,0.2));
}
.nav-links {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  list-style: none;
}
.nav-links a {
  font-family: var(--f-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--ink5);
  text-decoration: none;
  padding: 6px 14px;
  border-radius: 4px;
  transition: all 0.2s;
}
.nav-links a:hover { color: var(--cream); background: rgba(255,255,255,0.06); }
.nav-cta {
  background: var(--accent) !important;
  color: var(--ink) !important;
  font-weight: 500 !important;
  padding: 8px 20px !important;
}
.nav-cta:hover { background: var(--accent2) !important; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(196,135,58,0.35); }
.nav-mobile-btn {
  display: none;
  background: none;
  border: none;
  color: var(--cream);
  font-size: 22px;
  cursor: pointer;
}

/* ─── HERO ─── */
#hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  overflow: hidden;
  padding: 120px 2.5rem 80px;
}
.hero-bg {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 80% 60% at 70% 50%, rgba(196,135,58,0.08) 0%, transparent 60%),
    radial-gradient(ellipse 40% 40% at 15% 80%, rgba(184,64,64,0.06) 0%, transparent 50%),
    linear-gradient(180deg, #1a1410 0%, #2c2418 50%, #1a1410 100%);
}
.hero-axe-bg {
  position: absolute;
  right: -8%;
  top: 50%;
  transform: translateY(-50%);
  width: 52vw;
  max-width: 680px;
  opacity: 0.12;
  pointer-events: none;
  filter: drop-shadow(0 0 60px rgba(196,135,58,0.3));
}
.hero-eyebrow {
  font-family: var(--f-mono);
  font-size: 11px;
  letter-spacing: 4px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 12px;
  opacity: 0;
  animation: fadeUp 0.8s 0.2s forwards;
}
.hero-eyebrow::before {
  content: '';
  width: 32px; height: 1px;
  background: var(--accent);
}
.hero-title {
  font-family: var(--f-display);
  font-size: clamp(4rem, 10vw, 9rem);
  line-height: 0.88;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--cream);
  max-width: 720px;
  position: relative;
  z-index: 1;
  opacity: 0;
  animation: fadeUp 0.8s 0.4s forwards;
}
.hero-title em {
  font-style: normal;
  color: var(--accent);
  display: block;
}
.hero-title .stroke {
  -webkit-text-stroke: 2px var(--cream);
  color: transparent;
}
.hero-sub {
  font-size: 1.25rem;
  font-weight: 300;
  color: var(--ink5);
  line-height: 1.6;
  max-width: 480px;
  margin-top: 2rem;
  position: relative;
  z-index: 1;
  opacity: 0;
  animation: fadeUp 0.8s 0.6s forwards;
}
.hero-sub strong { color: var(--cream); font-weight: 400; }
.hero-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2.5rem;
  flex-wrap: wrap;
  position: relative;
  z-index: 1;
  opacity: 0;
  animation: fadeUp 0.8s 0.8s forwards;
}
.btn-primary {
  font-family: var(--f-mono);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  background: var(--accent);
  color: var(--ink);
  padding: 14px 32px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;
}
.btn-primary:hover { background: var(--accent2); transform: translateY(-2px); box-shadow: 0 8px 32px rgba(196,135,58,0.4); }
.btn-secondary {
  font-family: var(--f-mono);
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  background: transparent;
  color: var(--cream);
  padding: 13px 32px;
  border: 1px solid rgba(255,255,255,0.2);
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  transition: all 0.2s;
}
.btn-secondary:hover { border-color: var(--accent); color: var(--accent); transform: translateY(-2px); }
.hero-stats {
  display: flex;
  gap: 3rem;
  margin-top: 4rem;
  padding-top: 2.5rem;
  border-top: 1px solid rgba(255,255,255,0.07);
  position: relative;
  z-index: 1;
  opacity: 0;
  animation: fadeUp 0.8s 1s forwards;
}
.hero-stat-n {
  font-family: var(--f-display);
  font-size: 2.5rem;
  color: var(--accent);
  letter-spacing: 1px;
  line-height: 1;
}
.hero-stat-l {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--ink4);
  margin-top: 4px;
}

/* ─── SCROLL INDICATOR ─── */
.scroll-indicator {
  position: absolute;
  bottom: 2.5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0;
  animation: fadeIn 1s 1.5s forwards;
}
.scroll-line {
  width: 1px; height: 48px;
  background: linear-gradient(to bottom, transparent, var(--accent));
  animation: scrollPulse 2s infinite;
}
.scroll-label {
  font-family: var(--f-mono);
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--ink4);
  text-transform: uppercase;
}

/* ─── SECTIONS ─── */
section { position: relative; z-index: 2; }
.section-inner { max-width: 1200px; margin: 0 auto; padding: 0 2.5rem; }

/* ─── METRICS ─── */
#metrics {
  padding: 80px 0 60px;
  background: var(--ink);
  border-bottom: 1px solid rgba(255,255,255,0.05);
  position: relative;
  overflow: hidden;
}
#metrics::before {
  content: '';
  position: absolute;
  top: -120px; left: 50%;
  transform: translateX(-50%);
  width: 600px; height: 600px;
  background: radial-gradient(circle, rgba(196,135,58,0.06) 0%, transparent 70%);
  pointer-events: none;
}
.metrics-label {
  text-align: center;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 3rem;
  opacity: 0.8;
}
.metrics-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 16px;
  overflow: hidden;
  max-width: 900px;
  margin: 0 auto;
}
.metric-card {
  background: var(--ink);
  padding: 2.5rem 1.5rem;
  text-align: center;
  position: relative;
  transition: background 0.3s;
}
.metric-card:hover { background: var(--ink2); }
.metric-card::after {
  content: '';
  position: absolute;
  bottom: 0; left: 50%;
  transform: translateX(-50%);
  width: 0; height: 2px;
  background: var(--accent);
  transition: width 0.4s ease;
}
.metric-card:hover::after { width: 60%; }
.metric-icon { font-size: 1.5rem; margin-bottom: 0.75rem; display: block; opacity: 0.7; }
.metric-value {
  font-family: var(--font-display);
  font-size: 2.8rem;
  font-weight: 800;
  color: var(--cream);
  line-height: 1;
  margin-bottom: 0.4rem;
  letter-spacing: -1px;
}
.metric-name {
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.35);
}
@keyframes countUp {
  from { opacity: 0; transform: translateY(12px); }
  to   { opacity: 1; transform: translateY(0); }
}
.metric-value.animate { animation: countUp 0.6s ease forwards; }

/* ─── FEATURES ─── */
#features { padding: 120px 0; background: var(--ink2); }
.features-header {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: end;
  margin-bottom: 5rem;
}
.section-eyebrow {
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 10px;
}
.section-eyebrow::before { content: ''; width: 24px; height: 1px; background: var(--accent); }
.section-title {
  font-family: var(--f-display);
  font-size: clamp(2.5rem, 5vw, 4.5rem);
  line-height: 0.92;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--cream);
}
.section-title em { font-style: normal; color: var(--accent); }
.section-desc {
  font-size: 1.1rem;
  font-weight: 300;
  color: var(--ink5);
  line-height: 1.7;
  max-width: 380px;
  align-self: end;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1px;
  background: rgba(255,255,255,0.06);
  border: 1px solid rgba(255,255,255,0.06);
}
.feature-card {
  background: var(--ink2);
  padding: 2.5rem 2rem;
  position: relative;
  overflow: hidden;
  transition: background 0.3s;
}
.feature-card::before {
  content: '';
  position: absolute;
  bottom: 0; left: 0; right: 0;
  height: 2px;
  background: var(--accent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.4s;
}
.feature-card:hover { background: rgba(196,135,58,0.05); }
.feature-card:hover::before { transform: scaleX(1); }
.feature-icon { font-size: 1.8rem; margin-bottom: 1.25rem; display: block; }
.feature-num {
  position: absolute;
  top: 1.5rem; right: 1.5rem;
  font-family: var(--f-display);
  font-size: 4rem;
  color: rgba(255,255,255,0.04);
  line-height: 1;
  pointer-events: none;
}
.feature-name {
  font-family: var(--f-display);
  font-size: 1.4rem;
  letter-spacing: 1px;
  color: var(--cream);
  margin-bottom: 0.75rem;
}
.feature-desc { font-size: 0.95rem; font-weight: 300; color: var(--ink4); line-height: 1.65; }

/* ─── HOW IT WORKS ─── */
#how { padding: 120px 0; background: var(--ink); }
.steps-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 6rem;
  align-items: center;
  margin-top: 5rem;
}
.steps-list { display: flex; flex-direction: column; gap: 0; }
.step {
  display: flex;
  gap: 1.5rem;
  padding: 1.75rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  position: relative;
  cursor: default;
  transition: all 0.3s;
}
.step:last-child { border-bottom: none; }
.step:hover .step-content { transform: translateX(4px); }
.step-num {
  font-family: var(--f-display);
  font-size: 2.8rem;
  color: rgba(255,255,255,0.08);
  line-height: 1;
  flex-shrink: 0;
  width: 52px;
  transition: color 0.3s;
}
.step:hover .step-num { color: var(--accent); }
.step-content { transition: transform 0.3s; }
.step-title { font-family: var(--f-display); font-size: 1.25rem; letter-spacing: 0.5px; color: var(--cream); margin-bottom: 6px; }
.step-desc { font-size: 0.95rem; font-weight: 300; color: var(--ink4); line-height: 1.6; }
.steps-visual { position: relative; }
.tournament-card {
  background: var(--ink2);
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 32px 80px rgba(0,0,0,0.5);
}
.tc-header {
  background: #3e3025;
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255,255,255,0.06);
}
.tc-title { font-family: var(--f-display); font-size: 1rem; letter-spacing: 1px; color: var(--cream); }
.tc-badge {
  font-family: var(--f-mono);
  font-size: 9px;
  letter-spacing: 1px;
  background: rgba(196,135,58,0.2);
  color: var(--accent);
  padding: 3px 10px;
  border-radius: 20px;
  border: 1px solid rgba(196,135,58,0.3);
}
.tc-body { padding: 1.25rem 1.5rem; }
.tc-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.6rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.04);
}
.tc-row:last-child { border-bottom: none; }
.tc-rank { font-family: var(--f-display); font-size: 1.2rem; color: var(--ink4); width: 32px; }
.tc-rank.gold { color: #b45309; }
.tc-rank.silver { color: #6b7280; }
.tc-rank.bronze { color: #92400e; }
.tc-name { flex: 1; font-size: 0.95rem; font-weight: 400; color: var(--cream); padding: 0 1rem; }
.tc-pts { font-family: var(--f-display); font-size: 1.3rem; color: var(--accent); letter-spacing: 0.5px; }
.tc-ks { font-family: var(--f-mono); font-size: 9px; color: var(--ink4); padding: 2px 7px; background: rgba(196,135,58,0.1); border-radius: 3px; margin-left: 8px; }

/* ─── QUIENES SOMOS ─── */
#about { padding: 120px 0; background: var(--ink2); }
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6rem; align-items: center; margin-top: 4rem; }
.about-text p { font-size: 1.1rem; font-weight: 300; color: var(--ink5); line-height: 1.8; margin-bottom: 1.25rem; }
.about-text p strong { color: var(--cream); font-weight: 400; }
.about-text p em { color: var(--accent); font-style: normal; }
.about-values { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: rgba(255,255,255,0.06); margin-top: 2rem; }
.about-value { background: var(--ink2); padding: 1.25rem; transition: background 0.2s; }
.about-value:hover { background: rgba(196,135,58,0.06); }
.about-value-icon { font-size: 1.4rem; margin-bottom: 8px; }
.about-value-title { font-family: var(--f-display); font-size: 1rem; letter-spacing: 0.5px; color: var(--cream); margin-bottom: 4px; }
.about-value-desc { font-size: 0.88rem; color: var(--ink4); line-height: 1.5; font-weight: 300; }
.about-visual { position: relative; }
.about-big-text {
  font-family: var(--f-display);
  font-size: clamp(5rem, 12vw, 10rem);
  line-height: 0.85;
  letter-spacing: 2px;
  color: rgba(255,255,255,0.03);
  text-transform: uppercase;
  pointer-events: none;
  user-select: none;
  position: absolute;
  right: -1rem;
  top: 50%;
  transform: translateY(-50%);
}
.about-card { background: var(--ink); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; padding: 2rem; position: relative; z-index: 1; }
.about-card-title { font-family: var(--f-display); font-size: 1.8rem; letter-spacing: 1px; color: var(--accent); margin-bottom: 1rem; }
.about-quote { font-size: 1.15rem; font-style: italic; font-weight: 300; color: var(--ink5); line-height: 1.7; border-left: 2px solid var(--accent); padding-left: 1.25rem; margin: 1.25rem 0; }
.about-author { font-family: var(--f-mono); font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: var(--ink4); }

/* ─── GEAR ─── */
#gear { padding: 100px 0; background: var(--ink); border-top: 1px solid rgba(255,255,255,0.04); }
.gear-inner { display: grid; grid-template-columns: 1fr 1.2fr; gap: 5rem; align-items: center; }
.gear-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--f-mono);
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--ink4);
  border: 1px solid rgba(255,255,255,0.1);
  padding: 6px 14px;
  border-radius: 2px;
  margin-bottom: 1.5rem;
}
.gear-badge span:first-child { width: 6px; height: 6px; background: var(--accent); border-radius: 50%; animation: pulse 2s infinite; flex-shrink: 0; }
.gear-title { font-family: var(--f-display); font-size: clamp(2rem, 5vw, 4rem); line-height: 0.92; letter-spacing: 1px; text-transform: uppercase; color: var(--cream); margin-bottom: 1.25rem; }
.gear-title em { font-style: normal; color: var(--accent); }
.gear-desc { font-size: 1.05rem; font-weight: 300; color: var(--ink4); line-height: 1.7; margin-bottom: 2rem; }
.gear-notify { display: flex; gap: 0; max-width: 380px; }
.gear-input {
  flex: 1;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.12);
  border-right: none;
  border-radius: 4px 0 0 4px;
  padding: 12px 16px;
  font-family: var(--f-body);
  font-size: 0.95rem;
  color: var(--cream);
  outline: none;
  transition: border-color 0.2s;
}
.gear-input:focus { border-color: var(--accent); }
.gear-input::placeholder { color: var(--ink4); }
.gear-submit {
  font-family: var(--f-mono);
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 1px;
  text-transform: uppercase;
  background: var(--accent);
  color: var(--ink);
  border: none;
  padding: 12px 20px;
  border-radius: 0 4px 4px 0;
  cursor: pointer;
  transition: background 0.2s;
}
.gear-submit:hover { background: var(--accent2); }
.gear-categories { display: grid; grid-template-columns: 1fr 1fr; gap: 1px; background: rgba(255,255,255,0.06); border-radius: 8px; overflow: hidden; }
.gear-cat { background: var(--ink2); padding: 1.5rem; position: relative; overflow: hidden; transition: background 0.3s; }
.gear-cat:hover { background: rgba(196,135,58,0.07); }
.gear-cat-coming { position: absolute; top: 10px; right: 10px; font-family: var(--f-mono); font-size: 8px; letter-spacing: 1px; text-transform: uppercase; background: rgba(196,135,58,0.15); color: var(--accent); padding: 2px 8px; border-radius: 2px; }
.gear-cat-icon { font-size: 1.6rem; margin-bottom: 10px; }
.gear-cat-name { font-family: var(--f-display); font-size: 1.1rem; letter-spacing: 0.5px; color: var(--cream); margin-bottom: 4px; }
.gear-cat-desc { font-size: 0.85rem; color: var(--ink4); font-weight: 300; line-height: 1.5; }

/* ─── CONTACT ─── */
#contact { padding: 100px 0; background: var(--ink2); border-top: 1px solid rgba(255,255,255,0.05); position: relative; }
.contact-inner { max-width: 580px; margin: 0 auto; text-align: center; padding: 0 2rem; }
.contact-eyebrow { font-size: 10px; font-weight: 700; letter-spacing: 3px; text-transform: uppercase; color: var(--accent); margin-bottom: 1rem; }
.contact-title { font-family: var(--font-display); font-size: clamp(2rem, 5vw, 3rem); font-weight: 800; color: var(--cream); line-height: 1.1; margin-bottom: 0.75rem; }
.contact-title em { color: var(--accent); font-style: normal; }
.contact-sub { font-size: 15px; color: rgba(255,255,255,0.4); margin-bottom: 2.5rem; line-height: 1.6; }
.contact-form { display: flex; flex-direction: column; gap: 14px; text-align: left; }
.contact-row { display: flex; gap: 14px; }
.contact-row .cf-field { flex: 1; }
.cf-field { display: flex; flex-direction: column; gap: 6px; }
.cf-label { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255,255,255,0.35); }
.cf-input, .cf-textarea {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 10px;
  padding: 13px 16px;
  color: var(--cream);
  font-size: 14px;
  font-family: var(--font-body);
  outline: none;
  transition: border-color 0.2s, background 0.2s;
  width: 100%;
  box-sizing: border-box;
}
.cf-input:focus, .cf-textarea:focus { border-color: var(--accent); background: rgba(196,135,58,0.05); }
.cf-input::placeholder, .cf-textarea::placeholder { color: rgba(255,255,255,0.2); }
.cf-textarea { resize: vertical; min-height: 120px; }
.cf-submit {
  background: var(--accent);
  color: var(--ink);
  border: none;
  border-radius: 10px;
  padding: 14px 28px;
  font-size: 14px;
  font-weight: 700;
  font-family: var(--font-body);
  cursor: pointer;
  letter-spacing: 0.5px;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  align-self: flex-end;
}
.cf-submit:hover { background: var(--accent2); transform: translateY(-1px); box-shadow: 0 6px 24px rgba(196,135,58,0.35); }
.cf-success { display: none; background: rgba(76,217,138,0.08); border: 1px solid rgba(76,217,138,0.2); border-radius: 10px; padding: 16px; color: #4cd98a; font-size: 14px; text-align: center; margin-top: 8px; }

/* ─── CTA ─── */
#cta {
  padding: 120px 0;
  background: linear-gradient(160deg, #2c2418 0%, #3e3025 50%, #2c2418 100%);
  position: relative;
  overflow: hidden;
  text-align: center;
}
#cta::before {
  content: 'NOVURAXE';
  position: absolute;
  font-family: var(--f-display);
  font-size: 22vw;
  color: rgba(255,255,255,0.02);
  top: 50%; left: 50%;
  transform: translate(-50%, -50%);
  letter-spacing: 4px;
  pointer-events: none;
  white-space: nowrap;
}
.cta-eyebrow { font-family: var(--f-mono); font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: var(--accent); margin-bottom: 1.5rem; position: relative; z-index: 1; }
.cta-title { font-family: var(--f-display); font-size: clamp(3rem, 7vw, 6rem); line-height: 0.92; letter-spacing: 2px; text-transform: uppercase; color: var(--cream); margin-bottom: 1.5rem; position: relative; z-index: 1; }
.cta-title em { font-style: normal; color: var(--accent); display: block; }
.cta-sub { font-size: 1.1rem; font-weight: 300; color: var(--ink5); margin-bottom: 2.5rem; position: relative; z-index: 1; }
.cta-actions { display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap; position: relative; z-index: 1; }

/* ─── FOOTER ─── */
footer { background: #110e0a; border-top: 1px solid rgba(255,255,255,0.05); padding: 3rem 2.5rem; }
.footer-inner { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 1.5rem; }
.footer-logo { font-family: var(--f-display); font-size: 1.4rem; letter-spacing: 3px; color: var(--cream); }
.footer-logo span { color: var(--accent); }
.footer-links { display: flex; gap: 2rem; list-style: none; flex-wrap: wrap; }
.footer-links a { font-family: var(--f-mono); font-size: 10px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--ink4); text-decoration: none; transition: color 0.2s; }
.footer-links a:hover { color: var(--accent); }
.footer-copy { font-family: var(--f-mono); font-size: 10px; color: var(--ink3); letter-spacing: 0.5px; }

/* ─── MOBILE MENU ─── */
.mobile-menu {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(26,20,16,0.97);
  z-index: 99;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  backdrop-filter: blur(20px);
}
.mobile-menu.open { display: flex; }
.mobile-menu a { font-family: var(--f-display); font-size: 2.5rem; letter-spacing: 2px; color: var(--cream); text-decoration: none; transition: color 0.2s; }
.mobile-menu a:hover { color: var(--accent); }
.mobile-menu-close { position: absolute; top: 1.5rem; right: 1.5rem; background: none; border: none; color: var(--ink4); font-size: 1.5rem; cursor: pointer; font-family: var(--f-mono); }

/* ─── ROLE MODAL ─── */
.role-modal {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 9000;
  background: rgba(0,0,0,0.8);
  backdrop-filter: blur(8px);
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}
.role-modal.open { display: flex; }
.role-modal-inner {
  background: #2c2418;
  border: 1px solid rgba(196,135,58,0.2);
  border-radius: 16px;
  padding: 2.5rem 2rem;
  width: 100%;
  max-width: 480px;
  position: relative;
  box-shadow: 0 32px 80px rgba(0,0,0,0.6);
}
.role-card {
  background: rgba(255,255,255,0.04);
  border: 1.5px solid rgba(255,255,255,0.08);
  border-radius: 12px;
  padding: 1.75rem 1.25rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: block;
}
.role-card:hover { border-color: rgba(196,135,58,0.5); background: rgba(196,135,58,0.08); transform: translateY(-2px); }

/* ─── ANIMATIONS ─── */
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}
@keyframes scrollPulse {
  0%, 100% { opacity: 0.3; }
  50%       { opacity: 1; }
}
@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.5; transform: scale(0.8); }
}
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
}
.reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.7s ease, transform 0.7s ease; }
.reveal.visible { opacity: 1; transform: none; }
.reveal-delay-1 { transition-delay: 0.1s; }
.reveal-delay-2 { transition-delay: 0.2s; }
.reveal-delay-3 { transition-delay: 0.3s; }
.reveal-delay-4 { transition-delay: 0.4s; }

/* ─── RESPONSIVE ─── */
@media (max-width: 900px) {
  .landing-nav { padding: 0 1.5rem; }
  .nav-links { display: none; }
  .nav-mobile-btn { display: block; }
  .hero-title { font-size: clamp(3rem, 14vw, 6rem); }
  .hero-stats { gap: 2rem; }
  .features-header { grid-template-columns: 1fr; gap: 1.5rem; }
  .metrics-grid { grid-template-columns: 1fr 1fr; }
  .features-grid { grid-template-columns: 1fr 1fr; }
  .steps-container { grid-template-columns: 1fr; gap: 3rem; }
  .about-grid { grid-template-columns: 1fr; gap: 3rem; }
  .gear-inner { grid-template-columns: 1fr; gap: 3rem; }
  .section-inner { padding: 0 1.5rem; }
  #hero { padding: 100px 1.5rem 60px; }
  #live > .section-inner > div { grid-template-columns: 1fr !important; gap: 3rem !important; }
}
@media (max-width: 600px) {
  .metrics-grid { grid-template-columns: 1fr 1fr; }
  .contact-row { flex-direction: column; gap: 14px; }
  .features-grid { grid-template-columns: 1fr; }
  .hero-stats { flex-direction: column; gap: 1.5rem; }
  .gear-categories { grid-template-columns: 1fr; }
  .about-values { grid-template-columns: 1fr; }
}
`

export default function Home() {

  // ─── Estado del componente ───
  const [menuOpen, setMenuOpen]     = useState(false)   // menú móvil
  const [modalOpen, setModalOpen]   = useState(false)   // modal login/rol
  const [navScrolled, setNavScrolled] = useState(false) // nav con fondo al hacer scroll
  const [metrics, setMetrics]       = useState({ players: '—', tournaments: '—', orgs: '—', matches: '—' })
  const [contactForm, setContactForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [contactSent, setContactSent] = useState(false)
  const [gearEmail, setGearEmail]   = useState('')
  const [gearSent, setGearSent]     = useState(false)

  // ─── Refs para el cursor personalizado ───
  const cursorRef     = useRef(null)
  const cursorRingRef = useRef(null)
  const metricsRef    = useRef(null)

  // ─── useEffect: se ejecuta cuando el componente se monta ───
  // Equivalente a document.addEventListener('DOMContentLoaded', ...)
  useEffect(() => {

    // 1. CURSOR PERSONALIZADO
    const handleMouseMove = (e) => {
      if (cursorRef.current)     { cursorRef.current.style.left = e.clientX + 'px'; cursorRef.current.style.top = e.clientY + 'px'; }
      if (cursorRingRef.current) { setTimeout(() => { cursorRingRef.current.style.left = e.clientX + 'px'; cursorRingRef.current.style.top = e.clientY + 'px'; }, 60); }
    }
    document.addEventListener('mousemove', handleMouseMove)

    const addHover = (el) => {
      el.addEventListener('mouseenter', () => { cursorRef.current?.classList.add('hover'); cursorRingRef.current?.classList.add('hover'); })
      el.addEventListener('mouseleave', () => { cursorRef.current?.classList.remove('hover'); cursorRingRef.current?.classList.remove('hover'); })
    }
    document.querySelectorAll('a, button, input').forEach(addHover)

    // 2. STICKY NAV — cambia estilo al scrollear
    const handleScroll = () => setNavScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll)

    // 3. SCROLL REVEAL — anima elementos cuando entran en pantalla
    const reveals  = document.querySelectorAll('.reveal')
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } }),
      { threshold: 0.12 }
    )
    reveals.forEach(el => observer.observe(el))

    // 4. MÉTRICAS desde Supabase — con animación al entrar en pantalla
    const loadMetrics = async () => {
  try {
    const [
      { count: players },
      { count: tournaments },
      { count: orgs },
      { count: matches },
    ] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact', head: true }).eq('role', 'player'),
      supabase.from('tournaments').select('*', { count: 'exact', head: true }),
      supabase.from('organizers').select('*', { count: 'exact', head: true }),
      supabase.from('matches').select('*', { count: 'exact', head: true }),
    ])
    const counts = { players: players ?? 0, tournaments: tournaments ?? 0, orgs: orgs ?? 0, matches: matches ?? 0 }

        // Animar los números cuando el usuario llega a la sección
        const metricObs = new IntersectionObserver(entries => {
          if (!entries[0].isIntersecting) return
          metricObs.disconnect()
          const animateCount = (key, target) => {
            const el = document.getElementById('m-' + key)
            if (!el) return
            el.classList.add('animate')
            const dur = 1200, step = 16, steps = dur / step
            let cur = 0
            const inc = target / steps
            const t = setInterval(() => {
              cur = Math.min(cur + inc, target)
              el.textContent = Math.round(cur).toLocaleString('es-ES')
              if (cur >= target) clearInterval(t)
            }, step)
          }
          animateCount('players', counts.players)
          animateCount('tournaments', counts.tournaments)
          animateCount('orgs', counts.orgs)
          animateCount('matches', counts.matches)
        }, { threshold: 0.3 })
        if (metricsRef.current) metricObs.observe(metricsRef.current)
      } catch (e) {
        // Silencioso — los '—' ya están por defecto
      }
    }
    loadMetrics()

    // 5. SMOOTH SCROLL para links ancla (#hero, #features, etc.)
    const handleAnchor = (e) => {
      const href = e.currentTarget.getAttribute('href')
      if (href && href.startsWith('#') && href.length > 1) {
        const target = document.querySelector(href)
        if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }) }
      }
    }
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', handleAnchor))

    // Cleanup — elimina listeners cuando el componente se desmonta
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('scroll', handleScroll)
      reveals.forEach(el => observer.unobserve(el))
    }
  }, []) // [] = solo se ejecuta una vez al montar

  // ─── Función: enviar formulario de contacto ───
  const sendContact = () => {
    if (!contactForm.email || !contactForm.message) { alert('Por favor rellena al menos el email y el mensaje.'); return; }
    const body    = encodeURIComponent(`Nombre: ${contactForm.name || '—'}\nEmail: ${contactForm.email}\n\n${contactForm.message}`)
    const subject = encodeURIComponent(contactForm.subject || 'Consulta desde novuraxe.com')
    window.location.href = `mailto:support@novuraxe.com?subject=${subject}&body=${body}`
    setContactSent(true)
    setContactForm({ name: '', email: '', subject: '', message: '' })
  }

  // ─── Función: formulario gear notify ───
  const sendGearNotify = () => {
    if (gearEmail && gearEmail.includes('@')) { setGearSent(true); setTimeout(() => setGearSent(false), 3000) }
  }

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <>
      {/* HEAD — metadatos SEO (Next.js los inyecta en el <head> del HTML) */}
      <Head>
        <title>NOVURAXE — Gestión de Torneos de Axe Throwing</title>
        <meta name="description" content="La plataforma definitiva para organizar torneos de lanzamiento de hacha. Clasificaciones, brackets, estadísticas y más." />
        <link rel="icon" type="image/png" href="/dataxe-simple.png" />
        <style>{PAGE_CSS}</style>
      </Head>

      {/* CURSOR PERSONALIZADO */}
      <div className="cursor" ref={cursorRef} id="cursor"></div>
      <div className="cursor-ring" ref={cursorRingRef} id="cursor-ring"></div>

      {/* MENÚ MÓVIL */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`} id="mobile-menu">
        <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>✕ CERRAR</button>
        <a href="#metrics"  onClick={() => setMenuOpen(false)}>Estadísticas</a>
        <a href="#features" onClick={() => setMenuOpen(false)}>Funciones</a>
        <a href="#how"      onClick={() => setMenuOpen(false)}>Cómo funciona</a>
        <a href="#about"    onClick={() => setMenuOpen(false)}>Quiénes somos</a>
        <a href="#gear"     onClick={() => setMenuOpen(false)}>Equipamiento</a>
        <Link href="/live"  onClick={() => setMenuOpen(false)} style={{ color: '#4cd98a' }}>● Live</Link>
        <a href="#" onClick={(e) => { e.preventDefault(); setMenuOpen(false); setModalOpen(true); }} style={{ color: 'var(--accent)' }}>Iniciar sesión →</a>
      </div>

      {/* NAV — className cambia al scrollear para añadir fondo */}
      <nav className={`landing-nav ${navScrolled ? 'scrolled' : ''}`} id="nav">
        <a href="#hero" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
          <img src="/novuraxe-logo.png" alt="NOVURAXE" className="logo-img" />
        </a>
        <ul className="nav-links">
          <li><a href="#metrics">Estadísticas</a></li>
          <li><a href="#features">Funciones</a></li>
          <li><a href="#how">Cómo funciona</a></li>
          <li><a href="#about">Quiénes somos</a></li>
          <li><a href="#gear">Equipamiento</a></li>
          <li><a href="#contact">Contacto</a></li>
          <li>
            <Link href="/live" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4cd98a', boxShadow: '0 0 6px #4cd98a', display: 'inline-block' }}></span>
              Live
            </Link>
          </li>
          <li>
            <a href="#" className="nav-cta" onClick={(e) => { e.preventDefault(); setModalOpen(true); }}>
              Iniciar sesión →
            </a>
          </li>
        </ul>
        <button className="nav-mobile-btn" onClick={() => setMenuOpen(true)}>☰</button>
      </nav>

      {/* ══ HERO ══ */}
      <section id="hero">
        <div className="hero-bg"></div>
        <img src="/dataxe-simple.png" className="hero-axe-bg" alt="" />
        <div className="hero-eyebrow">Gestión profesional de torneos</div>
        <h1 className="hero-title">
          Domina<br />
          <em>el torneo.</em><br />
          <span className="stroke">Cada lanzamiento.</span>
        </h1>
        <p className="hero-sub">
          La plataforma definitiva para organizar torneos de <strong>axe throwing</strong>.
          Clasificaciones en tiempo real, brackets automáticos y <strong>estadísticas detalladas</strong> — desde cualquier dispositivo.
        </p>
        <div className="hero-actions">
          <a href="#" className="btn-primary" onClick={(e) => { e.preventDefault(); setModalOpen(true); }}>Empezar gratis →</a>
          <a href="#how" className="btn-secondary">Ver cómo funciona</a>
        </div>
        <div className="hero-stats">
          <div><div className="hero-stat-n">2</div><div className="hero-stat-l">Grupos por torneo</div></div>
          <div><div className="hero-stat-n">100%</div><div className="hero-stat-l">Tiempo real</div></div>
          <div><div className="hero-stat-n">∞</div><div className="hero-stat-l">Torneos guardados</div></div>
          <div><div className="hero-stat-n">PDF</div><div className="hero-stat-l">Exportación pro</div></div>
        </div>
        <div className="scroll-indicator">
          <div className="scroll-line"></div>
          <div className="scroll-label">Scroll</div>
        </div>
      </section>

      {/* ══ MÉTRICAS ══ */}
      <section id="metrics" ref={metricsRef}>
        <div className="section-inner">
          <div className="metrics-label reveal">La comunidad en números</div>
          <div className="metrics-grid">
            <div className="metric-card reveal"><span className="metric-icon">🪓</span><div className="metric-value" id="m-players">—</div><div className="metric-name">Jugadores</div></div>
            <div className="metric-card reveal reveal-delay-1"><span className="metric-icon">🏆</span><div className="metric-value" id="m-tournaments">—</div><div className="metric-name">Torneos</div></div>
            <div className="metric-card reveal reveal-delay-2"><span className="metric-icon">🏟</span><div className="metric-value" id="m-orgs">—</div><div className="metric-name">Organizadores</div></div>
            <div className="metric-card reveal reveal-delay-3"><span className="metric-icon">⚔️</span><div className="metric-value" id="m-matches">—</div><div className="metric-name">Partidas jugadas</div></div>
          </div>
        </div>
      </section>

      {/* ══ FEATURES ══ */}
      <section id="features">
        <div className="section-inner">
          <div className="features-header">
            <div>
              <div className="section-eyebrow reveal">Todo lo que necesitas</div>
              <h2 className="section-title reveal reveal-delay-1">Funciones<br /><em>completas.</em></h2>
            </div>
            <p className="section-desc reveal reveal-delay-2">
              Desde la clasificación hasta el campeón, NOVURAXE gestiona cada fase del torneo con precisión profesional.
            </p>
          </div>
          <div className="features-grid">
            {[
              { n: '01', icon: '📊', title: 'Dashboard',        desc: 'Vista general del torneo en tiempo real. Clasificación, últimos duelos y estadísticas de grupo de un vistazo.' },
              { n: '02', icon: '🪓', title: 'Clasificación',    desc: 'Registro tiro a tiro. Killshots, configuración de rondas (1-2) y lanzamientos (10-12). Valores de diana configurables.' },
              { n: '03', icon: '⚡', title: 'Bracket',          desc: 'Generación automática del bracket eliminatorio. Duelos 2×5 lanzamientos con límites de KS y Bulls Eye.' },
              { n: '04', icon: '🏆', title: 'Ranking',          desc: 'Estadísticas completas por jugador: puntos, killshots, bulls eye, victorias y derrotas. Perfil detallado al instante.' },
              { n: '05', icon: '📁', title: 'Historial',        desc: 'Guarda torneos anteriores y acumula un ranking global del club entre eventos. Toda la historia en un lugar.' },
              { n: '06', icon: '📄', title: 'Exportación PDF',  desc: 'Informes profesionales con el logo de tu club. Clasificación, bracket, ranking global e informe completo.' },
            ].map(f => (
              <div className="feature-card reveal" key={f.n}>
                <span className="feature-num">{f.n}</span>
                <span className="feature-icon">{f.icon}</span>
                <div className="feature-name">{f.title}</div>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
            <div className="feature-card reveal" style={{ gridColumn: '1 / -1', background: 'rgba(76,217,138,0.03)', borderTop: '2px solid rgba(76,217,138,0.15)' }}>
              <span className="feature-num" style={{ color: 'rgba(76,217,138,0.12)' }}>07</span>
              <span className="feature-icon">📡</span>
              <div className="feature-name" style={{ color: '#4cd98a' }}>Vista Espectador en Vivo</div>
              <p className="feature-desc">
                Página pública sin login donde cualquiera puede seguir el torneo en tiempo real — clasificación, bracket y resultados actualizados al instante desde{' '}
                <Link href="/live" style={{ color: '#4cd98a', textDecoration: 'none', fontWeight: 600 }}>novuraxe.com/live →</Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ LIVE SPECTATOR ══ */}
      <section id="live" style={{ padding: '120px 0', background: 'var(--ink)', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div className="section-inner">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', alignItems: 'center' }}>
            <div>
              <div className="section-eyebrow reveal" style={{ color: '#4cd98a' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4cd98a', boxShadow: '0 0 8px #4cd98a', display: 'inline-block', animation: 'pulse 1.4s infinite', marginRight: '4px' }}></span>
                En directo
              </div>
              <h2 className="section-title reveal reveal-delay-1">Vista<br /><span style={{ color: '#4cd98a' }}>espectador.</span></h2>
              <p className="section-desc reveal reveal-delay-2" style={{ marginTop: '1.25rem', maxWidth: '100%' }}>
                Cualquier persona puede seguir el torneo desde su móvil <strong style={{ color: 'var(--cream)' }}>sin necesidad de cuenta</strong>.
                La página pública <code style={{ fontFamily: 'var(--f-mono)', fontSize: '0.85em', color: '#4cd98a', background: 'rgba(76,217,138,0.08)', padding: '2px 8px', borderRadius: '3px' }}>novuraxe.com/live</code> muestra en tiempo real:
              </p>
              <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }} className="reveal reveal-delay-3">
                {['Clasificación en vivo con puntos y lanzamientos', 'Bracket eliminatorio con resultados de cada duelo', 'Campeón destacado al finalizar', 'Solo lectura — sin login, sin edición', 'Sincronización automática cada vez que el organizador guarda'].map(t => (
                  <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.95rem', color: 'var(--ink5)' }}>
                    <span style={{ color: '#4cd98a', fontSize: '1rem' }}>✓</span> {t}
                  </div>
                ))}
              </div>
              <div style={{ marginTop: '2rem' }} className="reveal reveal-delay-4">
                <Link href="/live" className="btn-primary" style={{ background: 'rgba(76,217,138,0.15)', color: '#4cd98a', border: '1px solid rgba(76,217,138,0.3)' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4cd98a', boxShadow: '0 0 6px #4cd98a', display: 'inline-block', animation: 'pulse 1.4s infinite' }}></span>
                  Ver vista espectador →
                </Link>
              </div>
            </div>
            {/* Mockup pantalla live */}
            <div className="reveal reveal-delay-2">
              <div style={{ background: 'var(--ink2)', border: '1px solid rgba(76,217,138,0.15)', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
                <div style={{ background: '#1a1a1f', padding: '10px 16px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {[0,1,2].map(i => <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>)}
                  </div>
                  <div style={{ flex: 1, background: 'rgba(255,255,255,0.06)', borderRadius: '4px', padding: '4px 10px', fontFamily: 'var(--f-mono)', fontSize: '9px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.5px' }}>novuraxe.com/live</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontFamily: 'var(--f-mono)', fontSize: '9px', color: '#4cd98a', letterSpacing: '1px' }}>
                    <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#4cd98a', animation: 'pulse 1.4s infinite' }}></div>
                    LIVE
                  </div>
                </div>
                <div style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '2px', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>Clasificación · PRO</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {[
                      { medal: '🥇', name: 'Carlos Ruiz',  pts: 187, gold: true },
                      { medal: '🥈', name: 'María López',  pts: 164 },
                      { medal: '🥉', name: 'Juan García',  pts: 158 },
                      { medal: '#4', name: 'Ana Torres',   pts: 142, dim: true },
                    ].map(r => (
                      <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', background: r.gold ? 'rgba(212,175,55,0.06)' : 'rgba(255,255,255,0.02)', borderRadius: '6px', border: r.gold ? '1px solid rgba(212,175,55,0.12)' : 'none' }}>
                        <span style={{ fontFamily: 'var(--f-display)', fontSize: '1rem', color: r.gold ? '#d4af37' : r.dim ? 'rgba(255,255,255,0.2)' : '#a0a0aa', width: '24px' }}>{r.medal}</span>
                        <span style={{ flex: 1, fontSize: '0.88rem', fontWeight: r.dim ? 400 : 600, color: r.dim ? 'var(--ink5)' : 'var(--cream)' }}>{r.name}</span>
                        <span style={{ fontFamily: 'var(--f-display)', fontSize: '1.1rem', color: '#c4873a' }}>{r.pts}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <p style={{ fontFamily: 'var(--f-mono)', fontSize: '10px', letterSpacing: '1px', color: 'var(--ink4)', textAlign: 'center', marginTop: '1rem', textTransform: 'uppercase' }}>Solo lectura · Sin login · Actualización automática</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ CÓMO FUNCIONA ══ */}
      <section id="how">
        <div className="section-inner">
          <div className="section-eyebrow reveal">Proceso</div>
          <h2 className="section-title reveal reveal-delay-1">Así de <em>simple.</em></h2>
          <div className="steps-container">
            <div className="steps-list">
              {[
                { n: '01', t: 'Crea tu cuenta',           d: 'Regístrate con el nombre de tu club, usuario y email. En segundos tienes acceso completo.' },
                { n: '02', t: 'Importa jugadores',         d: 'Pega la lista de participantes en bloque o agrégalos uno a uno. Grupos PRO y Semi Pro separados.' },
                { n: '03', t: 'Registra puntuaciones',     d: 'Toca cada lanzamiento en la pantalla para asignar su valor. Killshots y Bulls Eye con un clic.' },
                { n: '04', t: 'Genera el bracket',         d: 'Un botón genera el bracket completo desde la clasificación. Los duelos avanzan solos al confirmar.' },
                { n: '05', t: 'Exporta y guarda',          d: 'Descarga PDFs profesionales y guarda el torneo en el historial para acumular estadísticas del club.' },
              ].map(s => (
                <div className="step reveal" key={s.n}>
                  <div className="step-num">{s.n}</div>
                  <div className="step-content">
                    <div className="step-title">{s.t}</div>
                    <p className="step-desc">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="steps-visual reveal" style={{ animation: 'float 4s ease-in-out infinite' }}>
              <div className="tournament-card">
                <div className="tc-header">
                  <div className="tc-title">Torneo Marzo 2026</div>
                  <div className="tc-badge">EN VIVO</div>
                </div>
                <div className="tc-body">
                  {[
                    { r: '1', n: 'Carlos Ruiz', p: 187, ks: '4 KS', cls: 'gold' },
                    { r: '2', n: 'María López', p: 164, ks: '2 KS', cls: 'silver' },
                    { r: '3', n: 'Juan García', p: 158, ks: '3 KS', cls: 'bronze' },
                    { r: '4', n: 'Ana Torres',  p: 142, ks: '1 KS', cls: '' },
                    { r: '5', n: 'Pedro Sanz',  p: 135, ks: '—',    cls: '' },
                  ].map(row => (
                    <div className="tc-row" key={row.r}>
                      <div className={`tc-rank ${row.cls}`}>{row.r}</div>
                      <div className="tc-name">{row.n}</div>
                      <div className="tc-pts">{row.p}</div>
                      <div className="tc-ks">{row.ks}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ QUIÉNES SOMOS ══ */}
      <section id="about">
        <div className="section-inner">
          <div className="section-eyebrow reveal">Quiénes somos</div>
          <h2 className="section-title reveal reveal-delay-1">Hechos por<br /><em>la comunidad.</em></h2>
          <div className="about-grid">
            <div className="about-text reveal">
              <p>NOVURAXE nació de la <strong>necesidad real</strong> de los organizadores de torneos de axe throwing. Cansados de hojas de cálculo, papeles y errores de cálculo en medio de un evento, creamos la herramienta que nos hubiera gustado tener desde el principio.</p>
              <p>Somos <em>practicantes del deporte</em>, no solo desarrolladores. Cada función ha sido diseñada pensando en lo que ocurre en la pista: rapidez para registrar lanzamientos, claridad para ver el bracket y profesionalidad para presentar los resultados.</p>
              <p>Nuestro objetivo es llevar el <strong>axe throwing</strong> al siguiente nivel como deporte organizado, con las herramientas digitales que merece.</p>
              <div className="about-values">
                {[
                  { icon: '⚡', t: 'Velocidad',   d: 'Registro de puntuaciones en segundos, sin interrumpir el flujo del torneo.' },
                  { icon: '🎯', t: 'Precisión',   d: 'Cero errores de cálculo. El sistema lo computa todo automáticamente.' },
                  { icon: '🔒', t: 'Seguridad',   d: 'Cada club con sus datos aislados. Autenticación profesional con Supabase.' },
                  { icon: '📱', t: 'Movilidad',   d: 'Funciona en cualquier dispositivo. Diseñado para usarse en pista.' },
                ].map(v => (
                  <div className="about-value" key={v.t}>
                    <div className="about-value-icon">{v.icon}</div>
                    <div className="about-value-title">{v.t}</div>
                    <div className="about-value-desc">{v.d}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="about-visual reveal reveal-delay-2">
              <div className="about-big-text">AXE</div>
              <div className="about-card">
                <div className="about-card-title">Nuestra misión</div>
                <div className="about-quote">&quot;El lanzamiento de hacha merece las mismas herramientas de organización que cualquier deporte profesional. NOVURAXE es nuestra respuesta a eso.&quot;</div>
                <div className="about-author">— Equipo NOVURAXE</div>
                <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ fontFamily: 'var(--f-mono)', fontSize: '9px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--ink4)', marginBottom: '0.75rem' }}>En desarrollo activo</div>
                  {[
                    { icon: '✓', color: 'var(--green)', t: 'App web multiplataforma' },
                    { icon: '✓', color: 'var(--green)', t: 'Seguridad con RLS + JWT' },
                    { icon: '→', color: 'var(--accent)', t: 'App móvil nativa (próximamente)' },
                    { icon: '→', color: 'var(--accent)', t: 'Torneos multijornada (próximamente)' },
                  ].map(item => (
                    <div key={item.t} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', color: 'var(--ink5)', marginBottom: '0.5rem' }}>
                      <span style={{ color: item.color }}>{item.icon}</span> {item.t}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ GEAR ══ */}
      <section id="gear">
        <div className="section-inner">
          <div className="gear-inner">
            <div className="reveal">
              <div className="gear-badge"><span></span>Próximamente</div>
              <h2 className="gear-title">El mejor<br /><em>equipamiento.</em><br />Seleccionado.</h2>
              <p className="gear-desc">Estamos preparando una selección curada de hachas, dianas, equipamiento de protección y accesorios recomendados por la comunidad.</p>
              <p style={{ fontSize: '0.9rem', color: 'var(--ink4)', fontWeight: 300, lineHeight: 1.6, marginBottom: '1.5rem' }}>Sé el primero en saber cuándo esté disponible.</p>
              <div className="gear-notify">
                <input
                  type="email"
                  className="gear-input"
                  placeholder={gearSent ? '✓ ¡Te avisaremos!' : 'tu@email.com'}
                  value={gearEmail}
                  onChange={e => setGearEmail(e.target.value)}
                  style={gearSent ? { color: '#4a7c59' } : {}}
                />
                <button className="gear-submit" onClick={sendGearNotify}>Avisar</button>
              </div>
            </div>
            <div className="gear-categories reveal reveal-delay-2">
              {[
                { icon: '🪓', t: 'Hachas',       d: 'Selección de hachas de competición para todos los niveles.' },
                { icon: '🎯', t: 'Dianas',        d: 'Dianas de madera homologadas para entrenar en casa o en club.' },
                { icon: '🛡️', t: 'Protección',   d: 'Guantes y equipamiento de seguridad para lanzar con confianza.' },
                { icon: '🎽', t: 'Indumentaria',  d: 'Ropa técnica y merch de la comunidad axe throwing.' },
              ].map(cat => (
                <div className="gear-cat" key={cat.t}>
                  <div className="gear-cat-coming">Próximo</div>
                  <div className="gear-cat-icon">{cat.icon}</div>
                  <div className="gear-cat-name">{cat.t}</div>
                  <div className="gear-cat-desc">{cat.d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══ CONTACTO ══ */}
      <section id="contact">
        <div className="contact-inner">
          <div className="contact-eyebrow reveal">¿Tienes alguna duda?</div>
          <h2 className="contact-title reveal reveal-delay-1">Escríbenos,<br /><em>respondemos.</em></h2>
          <p className="contact-sub reveal reveal-delay-2">Estamos aquí para ayudarte con cualquier consulta sobre torneos, cuentas o funcionamiento de la plataforma.</p>
          <div className="contact-form reveal reveal-delay-3">
            <div className="contact-row">
              <div className="cf-field"><label className="cf-label">Nombre</label><input className="cf-input" type="text" placeholder="Tu nombre" value={contactForm.name} onChange={e => setContactForm({ ...contactForm, name: e.target.value })} /></div>
              <div className="cf-field"><label className="cf-label">Email</label><input className="cf-input" type="email" placeholder="tu@email.com" value={contactForm.email} onChange={e => setContactForm({ ...contactForm, email: e.target.value })} /></div>
            </div>
            <div className="cf-field"><label className="cf-label">Asunto</label><input className="cf-input" type="text" placeholder="¿En qué podemos ayudarte?" value={contactForm.subject} onChange={e => setContactForm({ ...contactForm, subject: e.target.value })} /></div>
            <div className="cf-field"><label className="cf-label">Mensaje</label><textarea className="cf-textarea" placeholder="Cuéntanos tu consulta..." value={contactForm.message} onChange={e => setContactForm({ ...contactForm, message: e.target.value })}></textarea></div>
            <button className="cf-submit" onClick={sendContact}>Enviar mensaje →</button>
            {contactSent && <div className="cf-success" style={{ display: 'block' }}>✓ Mensaje enviado — te responderemos en support@novuraxe.com</div>}
          </div>
        </div>
      </section>

      {/* ══ CTA ══ */}
      <section id="cta">
        <div className="section-inner">
          <div className="cta-eyebrow reveal">Empieza hoy</div>
          <h2 className="cta-title reveal reveal-delay-1">Tu próximo torneo,<br /><em>sin papel.</em></h2>
          <p className="cta-sub reveal reveal-delay-2">Gratis. Sin instalación. Desde cualquier dispositivo.</p>
          <div className="cta-actions reveal reveal-delay-3">
            <a href="#" className="btn-primary" onClick={(e) => { e.preventDefault(); setModalOpen(true); }}>Crear cuenta gratis →</a>
            <a href="#" className="btn-secondary" onClick={(e) => { e.preventDefault(); setModalOpen(true); }}>Ya tengo cuenta</a>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer>
        <div className="footer-inner">
          <div className="footer-logo">NOVUR<span>AXE</span></div>
          <ul className="footer-links">
            <li><a href="#features">Funciones</a></li>
            <li><a href="#about">Quiénes somos</a></li>
            <li><a href="#gear">Equipamiento</a></li>
            <li><Link href="/live">Live</Link></li>
            <li><a href="#contact">Contacto</a></li>
            <li><Link href="/organizer.html">Acceder</Link></li>
          </ul>
          <div className="footer-copy">© 2026 NOVURAXE — novuraxe.com</div>
        </div>
      </footer>

      {/* ══ MODAL ROL ══ */}
      {modalOpen && (
        <div className="role-modal open" onClick={(e) => { if (e.target === e.currentTarget) setModalOpen(false); }}>
          <div className="role-modal-inner">
            <button onClick={() => setModalOpen(false)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '3px', textTransform: 'uppercase', color: '#c4873a', marginBottom: '0.75rem' }}>Acceder como</div>
              <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '2.2rem', letterSpacing: '2px', color: '#fdfaf7' }}>¿Quién eres?</div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Link href="/organizer.html" className="role-card" onClick={() => setModalOpen(false)}>
                <div style={{ fontSize: '2.2rem', marginBottom: '0.875rem' }}>🏟</div>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', letterSpacing: '1.5px', color: '#fdfaf7', marginBottom: '0.5rem' }}>Organizador</div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#8c7d6a', lineHeight: 1.5 }}>Gestiona torneos,<br />jugadores y brackets</div>
                <div style={{ marginTop: '1.25rem', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#c4873a' }}>Entrar →</div>
              </Link>
              <Link href="/player" className="role-card" onClick={() => setModalOpen(false)}>
                <div style={{ fontSize: '2.2rem', marginBottom: '0.875rem' }}>🪓</div>
                <div style={{ fontFamily: 'Bebas Neue, sans-serif', fontSize: '1.3rem', letterSpacing: '1.5px', color: '#fdfaf7', marginBottom: '0.5rem' }}>Jugador</div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#8c7d6a', lineHeight: 1.5 }}>Sigue torneos,<br />ve tus estadísticas</div>
                <div style={{ marginTop: '1.25rem', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#c4873a' }}>Entrar →</div>
              </Link>
            </div>
            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontFamily: 'DM Mono, monospace', fontSize: '10px', color: 'rgba(255,255,255,0.2)' }}>Selecciona tu rol para continuar</div>
          </div>
        </div>
      )}
    </>
  )
}