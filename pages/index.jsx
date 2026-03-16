// pages/index.jsx
// ─────────────────────────────────────────────
// NOVURAXE — Landing Page
// ─────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

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
      if (cursorRingRef.current) { cursorRingRef.current.style.left = e.clientX + 'px'; cursorRingRef.current.style.top = e.clientY + 'px'; }
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
    window.location.href = `mailto:juanmorenocordido0805@gmail.com?subject=${subject}&body=${body}`
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
