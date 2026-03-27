// pages/players.jsx
// ─────────────────────────────────────────────
// NOVURAXE — Landing B2C para jugadores
// ─────────────────────────────────────────────
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

const PAGE_CSS = `
:root {
  --accent:#c4873a; --accent2:#d4975a;
  --bg:#111009; --bg2:#1a1410; --bg3:#2c2418;
  --ink:#ffffff; --ink2:rgba(255,255,255,0.82);
  --ink3:rgba(255,255,255,0.55); --ink4:rgba(255,255,255,0.32);
  --green:#6ab187; --purple:#c084fc; --blue:#60a5fa;
  --r:8px; --r2:14px;
  --sh:0 2px 12px rgba(0,0,0,0.4);
  --sh2:0 8px 32px rgba(0,0,0,0.55);
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth}
body{font-family:'DM Sans','Segoe UI',system-ui,sans-serif;background:var(--bg);
  color:var(--ink2);font-size:15px;line-height:1.6;min-height:100vh;
  overflow-x:hidden;cursor:none;-webkit-font-smoothing:antialiased}
body::before{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;
  background:
    radial-gradient(ellipse 1100px 700px at 75% -5%,rgba(196,135,58,0.13) 0%,transparent 60%),
    radial-gradient(ellipse 800px 600px at -5% 85%,rgba(196,135,58,0.09) 0%,transparent 60%),
    radial-gradient(ellipse 600px 400px at 50% 50%,rgba(196,135,58,0.03) 0%,transparent 70%)}
body::after{content:'';position:fixed;inset:0;pointer-events:none;z-index:0;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
  opacity:0.25}

/* CURSOR */
.cursor{position:fixed;width:10px;height:10px;background:var(--accent);border-radius:50%;
  pointer-events:none;z-index:9999;transform:translate(-50%,-50%);
  transition:transform .1s,width .2s,height .2s;mix-blend-mode:difference}
.cursor-ring{position:fixed;width:36px;height:36px;border:1.5px solid var(--accent);
  border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);
  transition:all .12s ease;opacity:.6}
.cursor.hover{width:18px;height:18px}
.cursor-ring.hover{width:52px;height:52px;opacity:.25}

/* NAV */
.nav{position:fixed;top:0;left:0;right:0;z-index:100;height:72px;
  display:flex;align-items:center;padding:0 2.5rem;gap:1rem;transition:all .3s}
.nav.scrolled{background:rgba(17,16,9,0.95);backdrop-filter:blur(14px);
  border-bottom:1px solid rgba(196,135,58,0.15);box-shadow:0 1px 20px rgba(0,0,0,0.4)}
.nav-logo-img{height:38px;width:auto;object-fit:contain;display:block}
.nav-links{display:flex;align-items:center;gap:.25rem;list-style:none;margin:0 auto}
.nav-links a{font-family:'DM Mono',monospace;font-size:11px;font-weight:500;
  letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.5);
  text-decoration:none;padding:6px 14px;border-radius:4px;transition:all .2s}
.nav-links a:hover{color:#fff;background:rgba(255,255,255,0.06)}
.nav-live{display:flex;align-items:center;gap:6px;color:rgba(255,255,255,0.5);
  font-family:'DM Mono',monospace;font-size:11px;font-weight:500;
  letter-spacing:1.5px;text-transform:uppercase;text-decoration:none;
  padding:6px 14px;border-radius:4px;transition:all .2s}
.nav-live:hover{color:#4cd98a}
.nav-live-dot{width:6px;height:6px;border-radius:50%;background:#4cd98a;
  box-shadow:0 0 6px #4cd98a;display:inline-block;flex-shrink:0}
.nav-cta{background:var(--accent);color:#1a1410;
  font-weight:700;padding:8px 20px;border-radius:var(--r);
  border:none;cursor:pointer;font-family:'DM Mono',monospace;font-size:11px;
  letter-spacing:1.5px;text-transform:uppercase;transition:all .15s;white-space:nowrap}
.nav-cta:hover{background:var(--accent2);transform:translateY(-1px);
  box-shadow:0 4px 20px rgba(196,135,58,0.35)}
.nav-mobile-btn{display:none;background:none;border:none;color:#fff;
  font-size:22px;cursor:pointer;padding:4px}

/* MOBILE MENU */
.mobile-menu{display:none;position:fixed;inset:0;background:rgba(17,16,9,0.97);
  z-index:99;flex-direction:column;align-items:center;justify-content:center;
  gap:2rem;backdrop-filter:blur(20px)}
.mobile-menu.open{display:flex}
.mobile-menu a,.mobile-menu button{font-family:'Bebas Neue',sans-serif;font-size:2.5rem;
  letter-spacing:2px;color:rgba(255,255,255,0.85);text-decoration:none;
  background:none;border:none;cursor:pointer;transition:color .2s}
.mobile-menu a:hover,.mobile-menu button:hover{color:var(--accent)}
.mobile-menu-close{position:absolute;top:1.5rem;right:1.5rem;background:none;
  border:none;color:rgba(255,255,255,0.4);font-size:1rem;font-weight:700;
  letter-spacing:1px;text-transform:uppercase;cursor:pointer;
  font-family:'DM Mono',monospace}

/* HERO */
.hero{position:relative;z-index:1;min-height:100vh;display:grid;
  grid-template-columns:1fr 1fr;overflow:hidden}
.hero-left{display:flex;flex-direction:column;align-items:flex-start;
  justify-content:center;padding:9rem 3rem 4rem 4rem;
  background:linear-gradient(105deg,#111009 60%,rgba(196,135,58,0.08) 100%)}
.hero h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(3.5rem,5vw,5.5rem);
  letter-spacing:3px;color:#fff;line-height:1;margin-bottom:1rem;text-align:left}
.hero h1 em{color:var(--accent);font-style:normal;display:block}
.hero-trial{font-size:13px;color:var(--ink2);margin-bottom:1.25rem;font-weight:500}
.hero-trial strong{color:var(--accent)}
.hero-email-row{display:flex;gap:0;width:100%;max-width:420px;margin-bottom:1.25rem}
.hero-email-input{flex:1;background:rgba(255,255,255,0.07);
  border:1.5px solid rgba(255,255,255,0.18);border-right:none;
  border-radius:var(--r) 0 0 var(--r);color:#fff;font-size:14px;
  padding:.75rem 1rem;outline:none;font-family:inherit;transition:all .15s}
.hero-email-input:focus{border-color:var(--accent);background:rgba(255,255,255,0.1)}
.hero-email-input::placeholder{color:rgba(255,255,255,0.3)}
.hero-email-btn{background:var(--accent);color:#1a1410;font-weight:800;font-size:14px;
  letter-spacing:.5px;padding:.75rem 1.5rem;border:none;cursor:pointer;
  border-radius:0 var(--r) var(--r) 0;transition:all .15s;font-family:inherit;
  white-space:nowrap}
.hero-email-btn:hover{background:var(--accent2)}
.hero-desc{font-size:13px;color:var(--ink3);max-width:420px;line-height:1.75}
.hero-right{position:relative;overflow:hidden}
.hero-img{width:100%;height:100%;object-fit:cover;object-position:center top;
  display:block;min-height:100vh}

/* SECTIONS */
.section{position:relative;z-index:1;padding:5rem 2rem}
.section-inner{max-width:1100px;margin:0 auto}
.section-tag{font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;
  color:var(--accent);display:flex;align-items:center;gap:8px;margin-bottom:.75rem}
.section-tag::before{content:'';width:24px;height:1px;background:var(--accent)}
.section-title{font-family:'Bebas Neue',sans-serif;font-size:clamp(2rem,4vw,2.8rem);
  letter-spacing:2px;color:#fff;line-height:1.1;margin-bottom:.75rem}
.section-title em{color:var(--accent);font-style:normal}
.section-sub{font-size:14px;color:var(--ink3);max-width:520px;margin-bottom:3rem;line-height:1.7}

/* STATS DEMO */
.stats-demo-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem}
.stat-demo-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);
  border-radius:var(--r2);padding:1.5rem 1.25rem;text-align:center;transition:all .2s}
.stat-demo-card:hover{border-color:rgba(196,135,58,0.3);background:rgba(196,135,58,0.05);
  transform:translateY(-3px);box-shadow:var(--sh2)}
.stat-demo-icon{font-size:1.75rem;margin-bottom:.5rem}
.stat-demo-n{font-family:'Bebas Neue',sans-serif;font-size:2.2rem;line-height:1;margin-bottom:4px}
.stat-demo-l{font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;
  color:var(--ink4)}

/* RANKING */
.ranking-wrap{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);
  border-radius:var(--r2);overflow:hidden}
.ranking-header{display:grid;grid-template-columns:48px 1fr 80px 80px 80px;
  gap:.5rem;align-items:center;padding:.75rem 1.25rem;
  border-bottom:1px solid rgba(255,255,255,0.07);
  font-size:9px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--ink4)}
.ranking-row{display:grid;grid-template-columns:48px 1fr 80px 80px 80px;
  gap:.5rem;align-items:center;padding:.875rem 1.25rem;
  border-bottom:1px solid rgba(255,255,255,0.05);transition:background .15s}
.ranking-row:last-child{border-bottom:none}
.ranking-row:hover{background:rgba(196,135,58,0.05)}
.rank-pos{font-family:'Bebas Neue',sans-serif;font-size:1.4rem;color:var(--ink4);
  text-align:center;line-height:1}
.rank-pos.top1{color:#c4873a}
.rank-pos.top2{color:#9ca3af}
.rank-pos.top3{color:#92400e}
.rank-player{display:flex;align-items:center;gap:10px}
.rank-avatar{width:36px;height:36px;border-radius:50%;background:var(--bg3);
  border:1.5px solid rgba(255,255,255,0.1);display:flex;align-items:center;
  justify-content:center;font-size:.9rem;flex-shrink:0;overflow:hidden}
.rank-avatar img{width:100%;height:100%;object-fit:cover}
.rank-name{font-size:14px;font-weight:700;color:#fff}
.rank-name a{color:#fff;text-decoration:none;transition:color .15s}
.rank-name a:hover{color:var(--accent)}
.rank-username{font-size:11px;color:var(--ink4);margin-top:1px}
.rank-val{font-size:14px;font-weight:700;color:var(--ink2);text-align:center}
.rank-val.accent{color:var(--accent)}
.rank-val.purple{color:var(--purple)}
.rank-badge{display:inline-flex;font-size:9px;font-weight:700;letter-spacing:1px;
  text-transform:uppercase;padding:2px 8px;border-radius:20px}
.badge-pro{background:rgba(196,135,58,0.15);color:var(--accent);border:1px solid rgba(196,135,58,0.3)}
.badge-semi{background:rgba(96,165,250,0.12);color:var(--blue);border:1px solid rgba(96,165,250,0.25)}
.rank-blur{filter:blur(5px);user-select:none;pointer-events:none}
.rank-cta-row{padding:1.25rem;text-align:center;border-top:1px solid rgba(255,255,255,0.07);
  background:rgba(196,135,58,0.04)}

/* HOW IT WORKS */
.steps-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2rem;
  counter-reset:steps}
.step-card{position:relative;counter-increment:steps}
.step-num{font-family:'Bebas Neue',sans-serif;font-size:4rem;color:rgba(196,135,58,0.15);
  line-height:1;margin-bottom:.5rem}
.step-icon{font-size:2rem;margin-bottom:.75rem}
.step-title{font-size:1.05rem;font-weight:800;color:#fff;margin-bottom:.5rem}
.step-desc{font-size:13px;color:var(--ink3);line-height:1.7}
.step-arrow{display:flex;align-items:center;justify-content:center;
  font-size:1.5rem;color:rgba(255,255,255,0.15);padding-top:2rem}

/* CTA FINAL */
.cta-section{position:relative;z-index:1;padding:6rem 2rem;text-align:center}
.cta-card{max-width:680px;margin:0 auto;
  background:linear-gradient(135deg,rgba(196,135,58,0.12) 0%,rgba(196,135,58,0.04) 100%);
  border:1px solid rgba(196,135,58,0.25);border-radius:24px;padding:4rem 3rem}
.cta-card h2{font-family:'Bebas Neue',sans-serif;font-size:clamp(2rem,4vw,3rem);
  letter-spacing:2px;color:#fff;margin-bottom:1rem}
.cta-card h2 em{color:var(--accent);font-style:normal}
.cta-card p{font-size:15px;color:var(--ink3);margin-bottom:2.5rem;line-height:1.7}

/* FOOTER */
.footer{position:relative;z-index:1;padding:2.5rem 2rem;
  border-top:1px solid rgba(255,255,255,0.06);text-align:center}
.footer-inner{max-width:1100px;margin:0 auto;display:flex;align-items:center;
  justify-content:space-between;flex-wrap:wrap;gap:1rem}
.footer-logo img{height:28px;opacity:.5}
.footer-links{display:flex;gap:1.5rem}
.footer-links a{font-size:12px;color:var(--ink4);text-decoration:none;transition:color .15s}
.footer-links a:hover{color:var(--ink2)}

/* MODAL REGISTRO */
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.75);z-index:500;
  display:flex;align-items:center;justify-content:center;padding:2rem;
  backdrop-filter:blur(6px)}
.modal-box{background:#1a1410;border:1px solid rgba(196,135,58,0.2);border-radius:20px;
  padding:2.5rem 2.25rem;width:100%;max-width:420px;box-shadow:0 24px 80px rgba(0,0,0,0.6)}
.modal-title{font-family:'Bebas Neue',sans-serif;font-size:1.6rem;letter-spacing:2px;
  color:#fff;margin-bottom:.25rem}
.modal-sub{font-size:13px;color:var(--ink3);margin-bottom:1.75rem}
.modal-tabs{display:flex;background:rgba(255,255,255,0.05);border-radius:var(--r);
  padding:3px;margin-bottom:1.5rem;gap:3px}
.modal-tab{flex:1;background:transparent;border:none;font-family:inherit;
  font-size:12px;font-weight:700;letter-spacing:.5px;color:var(--ink4);
  padding:8px;border-radius:calc(var(--r) - 2px);cursor:pointer;transition:all .15s}
.modal-tab.on{background:var(--accent);color:#1a1410}
.field{margin-bottom:.875rem}
.field label{display:block;font-size:10px;font-weight:700;letter-spacing:1px;
  text-transform:uppercase;color:var(--ink3);margin-bottom:5px}
.field input{width:100%;background:rgba(255,255,255,0.06);
  border:1.5px solid rgba(255,255,255,0.12);border-radius:var(--r);
  color:#fff;font-size:14px;padding:.65rem .875rem;outline:none;
  transition:all .15s;font-family:inherit}
.field input:focus{border-color:var(--accent);background:rgba(255,255,255,0.09);
  box-shadow:0 0 0 3px rgba(196,135,58,0.15)}
.field input::placeholder{color:var(--ink4)}
.btn-submit{width:100%;padding:.9rem;background:var(--accent);color:#1a1410;
  font-weight:800;font-size:14px;letter-spacing:.5px;border:none;
  border-radius:var(--r);cursor:pointer;font-family:inherit;transition:all .15s;margin-top:.25rem}
.btn-submit:hover{background:var(--accent2)}
.btn-submit:disabled{opacity:.5;cursor:not-allowed}
.modal-err{font-size:12px;color:#e07070;margin-bottom:.75rem;font-weight:500;
  background:rgba(184,64,64,0.1);border:1px solid rgba(184,64,64,0.2);
  border-radius:6px;padding:8px 12px}
.modal-close{position:absolute;top:1rem;right:1rem;background:none;border:none;
  color:var(--ink4);font-size:1.2rem;cursor:pointer;padding:6px;border-radius:6px;
  transition:all .15s}
.modal-close:hover{color:#fff;background:rgba(255,255,255,0.08)}

@media(max-width:768px){
  .nav{padding:0 1.25rem}
  .nav-links{display:none}
  .nav-mobile-btn{display:block}
  .hero{padding:6rem 1.5rem 3rem;background:var(--bg)}
  .hero-inner{grid-template-columns:1fr;gap:2rem}
  .hero-right{display:none}
  .hero h1{font-size:3rem}
  .hero-email-row{max-width:100%}
  .stats-demo-grid{grid-template-columns:1fr 1fr}
  .steps-grid{grid-template-columns:1fr}
  .step-arrow{display:none}
  .ranking-header,.ranking-row{grid-template-columns:40px 1fr 70px 70px}
  .ranking-header :last-child,.ranking-row :last-child{display:none}
  .cta-card{padding:2.5rem 1.5rem}
  .footer-inner{flex-direction:column;align-items:center}
}
`

// ── Datos mock para ranking hasta tener reales ──────────────────
const MOCK_RANKING = [
  { pos:1, username:'jupiter',   name:'Jupiter',        avatar:null, level:'pro',  pts:187, ks:24 },
  { pos:2, username:'axe_king',  name:'Axe King',       avatar:null, level:'pro',  pts:164, ks:19 },
  { pos:3, username:'hawkeye',   name:'Hawkeye',        avatar:null, level:'pro',  pts:158, ks:17 },
  { pos:4, username:'blade_mx',  name:'Blade MX',       avatar:null, level:'semi', pts:143, ks:14 },
  { pos:5, username:'ironwrist', name:'Iron Wrist',     avatar:null, level:'semi', pts:131, ks:11 },
]

const DEMO_STATS = [
  { icon:'🪓', val:'847', color:'#c084fc', label:'Killshots totales' },
  { icon:'🎯', val:'68%', color:'var(--accent)', label:'Precisión centros' },
  { icon:'🔵', val:'23%', color:'#60a5fa', label:"Bull's eye duelo" },
  { icon:'🏆', val:'34',  color:'var(--green)', label:'Torneos jugados' },
]

export default function PlayersLanding() {
  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [ranking,   setRanking]   = useState(MOCK_RANKING)

  // Scroll nav
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', h)
    return () => window.removeEventListener('scroll', h)
  }, [])

  // Cursor
  useEffect(() => {
    const cursor = document.getElementById('cursor')
    const ring   = document.getElementById('cursor-ring')
    if (!cursor || !ring) return
    const mv = e => {
      cursor.style.left = e.clientX + 'px'; cursor.style.top = e.clientY + 'px'
      setTimeout(() => { ring.style.left = e.clientX + 'px'; ring.style.top = e.clientY + 'px' }, 60)
    }
    const on  = () => { cursor.classList.add('hover'); ring.classList.add('hover') }
    const off = () => { cursor.classList.remove('hover'); ring.classList.remove('hover') }
    document.addEventListener('mousemove', mv)
    document.querySelectorAll('a,button').forEach(el => {
      el.addEventListener('mouseenter', on); el.addEventListener('mouseleave', off)
    })
    return () => document.removeEventListener('mousemove', mv)
  }, [])

  // Cargar ranking real desde global_stats
  useEffect(() => {
    supabase
      .from('global_stats')
      .select('player_name,wins,total_qpts,total_ks,user_id,users!user_id(username,avatar_url)')
      .order('total_qpts', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data?.length) {
          setRanking(data.map((r, i) => ({
            pos:      i + 1,
            username: r.users?.username || 'jugador',
            name:     r.player_name,
            avatar:   r.users?.avatar_url || null,
            level:    'pro',
            pts:      r.total_qpts || 0,
            ks:       r.total_ks   || 0,
          })))
        }
      })
  }, [])

  const goToPlayer = () => { window.location.href = '/player' }

  return (
    <>
      <Head>
        <title>NOVURAXE — Compite. Mejora. Sube en el ranking.</title>
        <meta name="description" content="Crea tu perfil de lanzador, sigue tu ranking, consulta tus stats y descubre torneos de axe throwing cerca de ti." />
        <link rel="icon" href="/dataxe-simple.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700;800&display=swap" rel="stylesheet" />
        <style>{PAGE_CSS}</style>
      </Head>

      <div id="cursor" className="cursor" />
      <div id="cursor-ring" className="cursor-ring" />

      {/* MOBILE MENU */}
      <div className={`mobile-menu${menuOpen ? ' open' : ''}`}>
        <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>✕ Cerrar</button>
        <a href="#ranking" onClick={() => setMenuOpen(false)}>Ranking</a>
        <a href="#stats"   onClick={() => setMenuOpen(false)}>Stats</a>
        <a href="#how"     onClick={() => setMenuOpen(false)}>Cómo funciona</a>
        <Link href="/live" onClick={() => setMenuOpen(false)} style={{ color:'#4cd98a' }}>● Live</Link>
        <button onClick={() => { setMenuOpen(false); goToPlayer() }} style={{ color:'var(--accent)' }}>
          Crear perfil →
        </button>
      </div>

      {/* NAV */}
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <Link href="/" style={{ textDecoration:'none', display:'flex', alignItems:'center' }}>
          <img src="/novuraxe-logo.png" alt="NOVURAXE" className="nav-logo-img" onError={e => e.target.style.display='none'} />
        </Link>
        <ul className="nav-links">
          <li><a href="#ranking">Ranking</a></li>
          <li><a href="#stats">Estadísticas</a></li>
          <li><a href="#how">Cómo funciona</a></li>
          <li>
            <Link href="/live" className="nav-live">
              <span className="nav-live-dot" />Live
            </Link>
          </li>
          <li>
            <Link href="/" style={{ color:'rgba(255,255,255,0.5)', fontFamily:'DM Mono,monospace',
              fontSize:'11px', letterSpacing:'1.5px', textTransform:'uppercase',
              textDecoration:'none', padding:'6px 14px' }}>
              Para organizadores →
            </Link>
          </li>
        </ul>
        <button className="nav-cta" onClick={goToPlayer}>Crear perfil gratis</button>
        <button className="nav-mobile-btn" onClick={() => setMenuOpen(true)}>☰</button>
      </nav>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left">
          <h1>
            Compite.<br />
            <em>Mejora.</em>
            Sube en el ranking.
          </h1>
          <p className="hero-trial">
            Si es tu primera vez recibe una experiencia completa durante <strong>14 días</strong>
          </p>
          <div className="hero-email-row">
            <input
              className="hero-email-input"
              type="email"
              placeholder="Introduce tu email"
              onKeyDown={e => { if (e.key === 'Enter') goToPlayer() }}
            />
            <button className="hero-email-btn" onClick={goToPlayer}>Recibir</button>
          </div>
          <p className="hero-desc">
            Tu perfil competitivo de axe throwing. Registra tus stats, sigue tu evolución torneo a torneo y encuentra competiciones cerca de ti.
          </p>
        </div>
        <div className="hero-right">
          <img src="/axethrower.png" alt="Axe thrower" className="hero-img" />
        </div>
      </section>

      {/* STATS DEMO */}
      <section className="section" id="stats">
        <div className="section-inner">
          <div className="section-tag">Tus estadísticas</div>
          <h2 className="section-title">Cada lanzamiento <em>cuenta.</em></h2>
          <p className="section-sub">Consulta tus killshots, precisión, bull eyes y evolución en cada torneo. Todo en un solo lugar.</p>
          <div className="stats-demo-grid">
            {DEMO_STATS.map(s => (
              <div className="stat-demo-card" key={s.label}>
                <div className="stat-demo-icon">{s.icon}</div>
                <div className="stat-demo-n" style={{ color: s.color }}>{s.val}</div>
                <div className="stat-demo-l">{s.label}</div>
              </div>
            ))}
          </div>
          <div style={{ marginTop:'1.5rem', textAlign:'center' }}>
            <button className="btn-secondary" onClick={goToPlayer} style={{ display:'inline-flex' }}>
              Ver mis stats →
            </button>
          </div>
        </div>
      </section>

      {/* RANKING */}
      <section className="section" id="ranking" style={{ paddingTop:'3rem' }}>
        <div className="section-inner">
          <div className="section-tag">Ranking público</div>
          <h2 className="section-title">¿Dónde estás <em>tú?</em></h2>
          <p className="section-sub">El ranking se actualiza tras cada torneo. Registra tu perfil para aparecer en él.</p>

          <div className="ranking-wrap">
            <div className="ranking-header">
              <div style={{ textAlign:'center' }}>#</div>
              <div>Jugador</div>
              <div style={{ textAlign:'center' }}>Pts</div>
              <div style={{ textAlign:'center' }}>KS</div>
              <div style={{ textAlign:'center' }}>Nivel</div>
            </div>

            {ranking.slice(0, 5).map((p, i) => (
              <div className="ranking-row" key={p.username}>
                <div className={`rank-pos${i === 0 ? ' top1' : i === 1 ? ' top2' : i === 2 ? ' top3' : ''}`}>
                  {i < 3 ? ['🥇','🥈','🥉'][i] : p.pos}
                </div>
                <div className="rank-player">
                  <div className="rank-avatar">
                    {p.avatar ? <img src={p.avatar} alt={p.name} /> : '🎯'}
                  </div>
                  <div>
                    <div className="rank-name">
                      <Link href={`/user/${p.username}`}>{p.name}</Link>
                    </div>
                    <div className="rank-username">@{p.username}</div>
                  </div>
                </div>
                <div className="rank-val accent">{p.pts}</div>
                <div className="rank-val purple">{p.ks} 🪓</div>
                <div>
                  <span className={`rank-badge ${p.level === 'pro' ? 'badge-pro' : 'badge-semi'}`}>
                    {p.level === 'pro' ? 'PRO' : 'SEMI'}
                  </span>
                </div>
              </div>
            ))}

            {/* Filas borrosas — motivar registro */}
            {[6,7,8].map(n => (
              <div className="ranking-row rank-blur" key={n} aria-hidden>
                <div className="rank-pos">{n}</div>
                <div className="rank-player">
                  <div className="rank-avatar">🎯</div>
                  <div>
                    <div className="rank-name">Jugador #{n}</div>
                    <div className="rank-username">@username</div>
                  </div>
                </div>
                <div className="rank-val accent">{130 - n * 8}</div>
                <div className="rank-val purple">{12 - n} 🪓</div>
                <div><span className="rank-badge badge-pro">PRO</span></div>
              </div>
            ))}

            <div className="rank-cta-row">
              <p style={{ fontSize:13, color:'var(--ink3)', marginBottom:'.75rem' }}>
                Regístrate para ver el ranking completo y aparecer en él
              </p>
              <button className="btn-primary" onClick={goToPlayer} style={{ padding:'10px 28px', fontSize:13 }}>
                Crear perfil gratis →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* CÓMO FUNCIONA */}
      <section className="section" id="how">
        <div className="section-inner">
          <div className="section-tag">Cómo funciona</div>
          <h2 className="section-title">En <em>3 pasos.</em></h2>
          <p className="section-sub">Sin complicaciones. Empieza a competir hoy.</p>

          <div className="steps-grid">
            {[
              { n:'01', icon:'🎯', title:'Crea tu perfil', desc:'Regístrate gratis en menos de un minuto. Sin tarjeta de crédito. Tu perfil público estará disponible en novuraxe.com/user/tuusuario.' },
              { n:'02', icon:'🏆', title:'Compite en torneos', desc:'Sigue a los organizadores de tu ciudad para ver sus torneos. Inscríbete directamente desde la app y aparece en el ranking tras cada torneo.' },
              { n:'03', icon:'📊', title:'Sube en el ranking', desc:'Cada lanzamiento cuenta. Tus killshots, precisión y victorias se actualizan en tiempo real. Comparte tu perfil y demuestra tu nivel.' },
            ].map((s, i) => (
              <div key={s.n} style={{ display:'flex', gap:'2rem', alignItems:'flex-start' }}>
                <div className="step-card" style={{ flex:1 }}>
                  <div className="step-num">{s.n}</div>
                  <div className="step-icon">{s.icon}</div>
                  <div className="step-title">{s.title}</div>
                  <div className="step-desc">{s.desc}</div>
                </div>
                {i < 2 && <div className="step-arrow">→</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="cta-section">
        <div className="cta-card">
          <h2>¿Listo para <em>competir?</em></h2>
          <p>Crea tu perfil gratis, sigue tu ranking y demuestra que eres el mejor lanzador de tu ciudad.</p>
          <button className="btn-primary" onClick={goToPlayer} style={{ fontSize:15, padding:'16px 40px' }}>
            🪓 Crear perfil gratis
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-logo">
            <img src="/novuraxe-logo.png" alt="NOVURAXE" onError={e => e.target.style.display='none'} />
          </div>
          <div className="footer-links">
            <Link href="/">Para organizadores</Link>
            <Link href="/terms">Términos</Link>
            <Link href="/player">Iniciar sesión</Link>
          </div>
        </div>
      </footer>
    </>
  )
}