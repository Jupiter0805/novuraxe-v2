// pages/terms.jsx
// ─────────────────────────────────────────────
// NOVURAXE — Política de Privacidad y Términos
// Página estática, sin Supabase
// ─────────────────────────────────────────────
import { useEffect, useState } from 'react'
import Head from 'next/head'
import Link from 'next/link'

export default function Terms() {
  const [navScrolled, setNavScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

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
    return () => {
      document.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <>
      <Head>
        <title>Política de Privacidad y Términos de Uso — NOVURAXE</title>
        <meta name="description" content="Política de privacidad y términos de uso de NOVURAXE." />
        <link rel="icon" href="/dataxe-simple.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <style>{`
          :root {
            --accent:#C4873A; --accent2:#e0a84f;
            --bg0:#111009; --bg1:#1a1410; --bg2:#22190f; --bg3:#2c2418;
            --ink1:#ffffff; --ink2:rgba(255,255,255,0.75);
            --ink3:rgba(255,255,255,0.5); --ink4:rgba(255,255,255,0.3);
            --r:8px; --r2:14px;
          }
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          html{scroll-behavior:smooth}
          body{background:var(--bg0);color:var(--ink2);font-family:'DM Sans',sans-serif;font-size:15px;line-height:1.75;min-height:100vh;overflow-x:hidden}body{background:var(--bg0);color:var(--ink2);font-family:'DM Sans',sans-serif;font-size:15px;line-height:1.75;min-height:100vh;overflow-x:hidden;cursor:none;}
          body::before{content:'';position:fixed;inset:0;background:radial-gradient(ellipse 800px 500px at 80% 10%,rgba(196,135,58,0.06) 0%,transparent 70%),radial-gradient(ellipse 600px 400px at 10% 80%,rgba(196,135,58,0.04) 0%,transparent 70%);pointer-events:none;z-index:0}

          /* CURSOR */
          .cursor{position:fixed;width:10px;height:10px;background:var(--accent);border-radius:50%;pointer-events:none;z-index:9999;transform:translate(-50%,-50%);transition:transform 0.1s,width 0.2s,height 0.2s,background 0.2s;mix-blend-mode:difference}
          .cursor-ring{position:fixed;width:36px;height:36px;border:1.5px solid var(--accent);border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);transition:all 0.12s ease;opacity:0.6}
          .cursor.hover{width:18px;height:18px}
          .cursor-ring.hover{width:54px;height:54px;opacity:0.3}

          /* NAV */
          .terms-nav{position:fixed;top:0;left:0;right:0;z-index:100;padding:0 2.5rem;height:88px;display:flex;align-items:center;justify-content:space-between;transition:all 0.3s}
          .terms-nav.scrolled{background:rgba(26,20,16,0.92);backdrop-filter:blur(12px);border-bottom:1px solid rgba(196,135,58,0.15)}
          .logo-img{height:56px;width:auto;object-fit:contain;filter:drop-shadow(0 2px 8px rgba(196,135,58,0.2))}
          .nav-links{display:flex;align-items:center;gap:0.25rem;list-style:none}
          .nav-links a{font-family:'DM Mono',monospace;font-size:11px;font-weight:500;letter-spacing:1.5px;text-transform:uppercase;color:rgba(255,255,255,0.5);text-decoration:none;padding:6px 14px;border-radius:4px;transition:all 0.2s}
          .nav-links a:hover{color:#fff;background:rgba(255,255,255,0.06)}
          .nav-cta{background:var(--accent)!important;color:#1a1410!important;font-weight:500!important;padding:8px 20px!important}
          .nav-cta:hover{background:var(--accent2)!important;transform:translateY(-1px);box-shadow:0 4px 20px rgba(196,135,58,0.35)}
          .nav-mobile-btn{display:none;background:none;border:none;color:#fff;font-size:22px;cursor:pointer}
          .mobile-menu{display:none;position:fixed;inset:0;background:rgba(26,20,16,0.97);z-index:99;flex-direction:column;align-items:center;justify-content:center;gap:2rem;backdrop-filter:blur(20px)}
          .mobile-menu.open{display:flex}
          .mobile-menu a{font-family:'Bebas Neue',sans-serif;font-size:2.5rem;letter-spacing:2px;color:rgba(255,255,255,0.85);text-decoration:none;transition:color 0.2s}
          .mobile-menu a:hover{color:var(--accent)}
          .mobile-menu-close{position:absolute;top:1.5rem;right:1.5rem;background:none;border:none;color:rgba(255,255,255,0.4);font-size:1rem;font-weight:700;letter-spacing:1px;text-transform:uppercase;cursor:pointer;font-family:'DM Mono',monospace}
          @media(max-width:768px){.nav-links{display:none}.nav-mobile-btn{display:block}.terms-nav{padding:0 1.5rem}}

          /* HERO */
          .hero{position:relative;z-index:1;padding:9.5rem 2rem 3rem;text-align:center;border-bottom:1px solid rgba(255,255,255,0.05)}
          .hero-inner{max-width:860px;width:100%;margin:0 auto;box-sizing:border-box}
          .hero-tag{display:inline-block;font-size:10px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--accent);background:rgba(196,135,58,0.1);border:1px solid rgba(196,135,58,0.2);padding:5px 16px;border-radius:20px;margin-bottom:1.5rem}
          .hero h1{font-family:'Bebas Neue',sans-serif;font-size:clamp(2.5rem,6vw,4.5rem);letter-spacing:4px;color:var(--ink1);line-height:1.05;margin-bottom:1rem}
          .hero h1 span{color:var(--accent)}
          .hero-meta{font-size:12px;color:var(--ink4);letter-spacing:1px;text-transform:uppercase}

          /* LAYOUT */
          .page-wrap{position:relative;z-index:1;max-width:860px;width:100%;margin:0 auto;padding:2.5rem 2rem 6rem;box-sizing:border-box}

          /* DISCLAIMER */
          .disclaimer-banner{background:rgba(196,135,58,0.06);border:1px solid rgba(196,135,58,0.25);border-radius:var(--r2);padding:1.25rem 1.75rem;display:flex;gap:1rem;align-items:flex-start;margin-bottom:2rem}
          .disclaimer-icon{font-size:1.4rem;flex-shrink:0;margin-top:2px}
          .disclaimer-text{font-size:13px;color:rgba(196,135,58,0.9);line-height:1.6}
          .disclaimer-text strong{color:var(--accent2)}

          /* TOC */
          .toc{background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:var(--r2);padding:1.5rem 2rem;margin-bottom:3rem}
          .toc-title{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--accent);margin-bottom:1rem}
          .toc ol{padding-left:1.25rem;display:grid;grid-template-columns:1fr 1fr;gap:0.35rem 2rem}
          .toc a{font-size:13px;color:var(--ink3);text-decoration:none;transition:color 0.2s}
          .toc a:hover{color:var(--accent)}

          /* SECTIONS */
          .section{margin-bottom:3rem;scroll-margin-top:80px;overflow-wrap:break-word;word-break:break-word}
          .section-num{font-family:'Bebas Neue',sans-serif;font-size:13px;letter-spacing:3px;color:var(--accent);margin-bottom:6px;display:block}
          .section h2{font-family:'Bebas Neue',sans-serif;font-size:clamp(1.2rem,3vw,1.8rem);letter-spacing:2px;color:var(--ink1);margin-bottom:1rem;padding-bottom:0.75rem;border-bottom:1px solid rgba(255,255,255,0.06);overflow-wrap:break-word}
          .section p{margin-bottom:0.9rem;color:var(--ink2)}
          .section ul,.section ol{padding-left:1.5rem;margin-bottom:0.9rem}
          .section li{margin-bottom:0.4rem;color:var(--ink2)}

          /* BOXES */
          .alert-box{background:rgba(180,40,40,0.08);border:1px solid rgba(200,60,60,0.25);border-radius:var(--r);padding:1.25rem 1.5rem;margin:1.25rem 0}
          .alert-box-title{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#e05555;margin-bottom:0.5rem;display:flex;align-items:center;gap:6px}
          .alert-box p{color:rgba(255,180,180,0.85);font-size:14px;margin-bottom:0.5rem;overflow-wrap:break-word;word-break:break-word}
          .alert-box p:last-child{margin-bottom:0}
          .info-box{background:rgba(196,135,58,0.05);border:1px solid rgba(196,135,58,0.2);border-radius:var(--r);padding:1.25rem 1.5rem;margin:1.25rem 0}
          .info-box-title{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--accent);margin-bottom:0.5rem;display:flex;align-items:center;gap:6px}
          .info-box p{color:var(--ink2);font-size:14px;margin-bottom:0.5rem}
          .info-box p:last-child{margin-bottom:0}

          /* RESPONSIBLE BOX */
          .responsible-box{background:rgba(196,135,58,0.07);border:1px solid rgba(196,135,58,0.3);border-radius:var(--r2);padding:1.5rem 1.75rem;margin:1.25rem 0}
          .responsible-title{font-size:11px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--accent);margin-bottom:1rem;display:flex;align-items:center;gap:6px}
          .responsible-grid{display:flex;flex-direction:column;gap:0}
          .responsible-row{display:flex;gap:1rem;padding:0.5rem 0;border-bottom:1px solid rgba(255,255,255,0.05);align-items:baseline}
          .responsible-row:last-child{border-bottom:none}
          .responsible-label{font-size:11px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:var(--ink4);min-width:160px;flex-shrink:0}
          .responsible-value{font-size:14px;color:var(--ink1)}

          /* RGPD TABLES */
          .rgpd-table-wrap{width:100%;overflow-x:auto;margin:1.25rem 0}
          .rgpd-table{width:100%;border-collapse:collapse;font-size:13px;min-width:480px}
          .rgpd-table thead tr{background:rgba(196,135,58,0.1);border-bottom:2px solid rgba(196,135,58,0.25)}
          .rgpd-table th{padding:10px 14px;text-align:left;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--accent)}
          .rgpd-table td{padding:10px 14px;color:var(--ink2);border-bottom:1px solid rgba(255,255,255,0.05);vertical-align:top;line-height:1.55}
          .rgpd-table tbody tr:hover td{background:rgba(255,255,255,0.02)}
          .rgpd-table tbody tr:last-child td{border-bottom:none}

          /* RIGHTS GRID */
          .rights-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:1px;background:rgba(255,255,255,0.06);border-radius:var(--r2);overflow:hidden;margin:1.5rem 0}
          .right-card{background:rgba(255,255,255,0.02);padding:1.25rem 1.5rem;transition:background 0.2s}
          .right-card:hover{background:rgba(196,135,58,0.06)}
          .right-icon{font-size:1.4rem;margin-bottom:8px}
          .right-title{font-family:'Bebas Neue',sans-serif;font-size:1.1rem;letter-spacing:1px;color:var(--ink1);margin-bottom:6px;display:flex;align-items:center;gap:8px}
          .right-art{font-family:'DM Sans',sans-serif;font-size:10px;font-weight:700;letter-spacing:1px;color:var(--accent);background:rgba(196,135,58,0.1);border:1px solid rgba(196,135,58,0.2);padding:2px 7px;border-radius:20px}
          .right-desc{font-size:13px;color:var(--ink3);line-height:1.6}

          hr.divider{border:none;border-top:1px solid rgba(255,255,255,0.05);margin:2rem 0}
          strong{color:var(--ink1);font-weight:700}
          em{color:var(--accent);font-style:normal}

          .terms-footer{position:relative;z-index:1;text-align:center;padding:2rem;border-top:1px solid rgba(255,255,255,0.05);font-size:12px;color:var(--ink4)}
          .terms-footer span{color:var(--accent)}

          @media(max-width:600px){
            .toc ol{grid-template-columns:1fr}
            .page-wrap{padding:1.5rem 1.25rem 4rem}
            .hero{padding:7rem 1.25rem 2.5rem}
            .rgpd-table th,.rgpd-table td{padding:8px 10px;font-size:12px}
            .section h2{font-size:1.4rem}
            .rights-grid{grid-template-columns:1fr}
          }
        `}</style>
      </Head>

      {/* CURSOR */}
      <div className="cursor" id="cursor"></div>
      <div className="cursor-ring" id="cursor-ring"></div>

      {/* MOBILE MENU */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        <button className="mobile-menu-close" onClick={() => setMenuOpen(false)}>✕ CERRAR</button>
        <Link href="/#features" onClick={() => setMenuOpen(false)}>Funciones</Link>
        <Link href="/#how" onClick={() => setMenuOpen(false)}>Como funciona</Link>
        <Link href="/#about" onClick={() => setMenuOpen(false)}>Quienes somos</Link>
        <Link href="/#gear" onClick={() => setMenuOpen(false)}>Equipamiento</Link>
        <Link href="/orgnaizer" onClick={() => setMenuOpen(false)} style={{ color: 'var(--accent)' }}>Iniciar sesion →</Link>
      </div>

      {/* NAV */}
      <nav className={`terms-nav ${navScrolled ? 'scrolled' : ''}`}>
        <Link href="/" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
          <img src="/novuraxe-logo.png" alt="NOVURAXE" className="logo-img" />
        </Link>
        <ul className="nav-links">
          <li><Link href="/#features">Funciones</Link></li>
          <li><Link href="/#how">Como funciona</Link></li>
          <li><Link href="/#about">Quienes somos</Link></li>
          <li><Link href="/#gear">Equipamiento</Link></li>
          <li><Link href="/organizer" className="nav-cta">Iniciar sesion →</Link></li>
        </ul>
        <button className="nav-mobile-btn" onClick={() => setMenuOpen(true)}>☰</button>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-inner">
          <div className="hero-tag">Documentación Legal</div>
          <h1>Política de Privacidad<br />&amp; <span>Términos de Uso</span></h1>
          <div className="hero-meta">Última actualización: Marzo 2025 &nbsp;·&nbsp; Versión 1.0</div>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="page-wrap">

        <div className="disclaimer-banner">
          <div className="disclaimer-icon">⚠️</div>
          <div className="disclaimer-text">
            <strong>AVISO — Titularidad y marco legal</strong><br />
            Novuraxe es una plataforma web gestionada por <strong>Juan Ignacio Moreno Cordido</strong> como persona física, sin actividad comercial ni ánimo de lucro. El tratamiento de datos se realiza conforme al <strong>RGPD (UE) 2016/679</strong> y la <strong>LOPDGDD 3/2018</strong>. Contacto: <a href="mailto:info@novuraxe.com" style={{ color: 'var(--accent)' }}>info@novuraxe.com</a>
          </div>
        </div>

        <div className="toc">
          <div className="toc-title">Índice de contenidos</div>
          <ol>
            <li><a href="#s1">Identificación y naturaleza del proyecto</a></li>
            <li><a href="#s2">Aceptación de los términos</a></li>
            <li><a href="#s3">Descripción del servicio</a></li>
            <li><a href="#s4">Exención de responsabilidad — Seguridad</a></li>
            <li><a href="#s5">Responsabilidad de los organizadores</a></li>
            <li><a href="#s6">Protección de datos — Base legal y finalidad</a></li>
            <li><a href="#s7">Datos recogidos y plazo de conservación</a></li>
            <li><a href="#s8">Derechos RGPD (ARCO+)</a></li>
            <li><a href="#s9">Seguridad de los datos</a></li>
            <li><a href="#s10">Cookies y almacenamiento local</a></li>
            <li><a href="#s11">Transferencias internacionales</a></li>
            <li><a href="#s12">Menores de edad</a></li>
            <li><a href="#s13">Modificaciones de los términos</a></li>
            <li><a href="#s14">Limitación de responsabilidad general</a></li>
            <li><a href="#s15">Contacto y reclamaciones</a></li>
          </ol>
        </div>

        {/* S1 */}
        <div className="section" id="s1">
          <span className="section-num">01 —</span>
          <h2>Identificación y Naturaleza del Proyecto</h2>
          <p><strong>Novuraxe</strong> es una plataforma web de gestión de torneos de lanzamiento de hacha. El presente documento constituye la Política de Privacidad y los Términos de Uso del servicio, de conformidad con el <strong>Reglamento (UE) 2016/679 (RGPD)</strong> y la <strong>Ley Orgánica 3/2018 de Protección de Datos Personales y garantía de los derechos digitales (LOPDGDD)</strong>.</p>
          <div className="responsible-box">
            <div className="responsible-title">👤 Responsable del Tratamiento</div>
            <div className="responsible-grid">
              {[
                ['Titular', 'Juan Ignacio Moreno Cordido'],
                ['Servicio', 'Novuraxe — Plataforma de gestión de torneos de lanzamiento de hacha'],
                ['Email de contacto', 'info@novuraxe.com'],
                ['País de residencia', 'España'],
                ['Marco legal aplicable', 'RGPD (UE) 2016/679 · LOPDGDD 3/2018'],
              ].map(([label, value]) => (
                <div className="responsible-row" key={label}>
                  <span className="responsible-label">{label}</span>
                  <span className="responsible-value">{value}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="info-box">
            <div className="info-box-title">ℹ️ Sobre el servicio</div>
            <p>El servicio Novuraxe se ofrece como herramienta comunitaria gratuita. No se garantiza disponibilidad continua ni se asume responsabilidad por el uso del servicio.</p>
          </div>
        </div>

        {/* S2 */}
        <div className="section" id="s2">
          <span className="section-num">02 —</span>
          <h2>Aceptación de los Términos</h2>
          <p>Al <strong>crear una cuenta</strong> en Novuraxe — ya sea como jugador o como organizador — se entenderá automáticamente que el usuario <em>ha leído, comprendido y aceptado</em> íntegramente los presentes Términos de Uso y la Política de Privacidad.</p>
          <p>El uso continuado de la plataforma tras cualquier actualización de estos términos implica igualmente la aceptación de dichas modificaciones. Si el usuario no está de acuerdo, deberá abstenerse de utilizar la plataforma y podrá solicitar la eliminación de su cuenta en cualquier momento.</p>
        </div>

        {/* S3 */}
        <div className="section" id="s3">
          <span className="section-num">03 —</span>
          <h2>Descripción del Servicio</h2>
          <p>Novuraxe proporciona a organizadores de torneos las siguientes funcionalidades:</p>
          <ul>
            <li>Creación y gestión de torneos con bracket de clasificación y eliminación directa</li>
            <li>Registro de participantes y estadísticas de lanzamiento</li>
            <li>Rankings individuales y globales por club</li>
            <li>Feed de anuncios y resultados visible para jugadores registrados</li>
            <li>Exportación de datos en formato PDF</li>
          </ul>
          <p>Novuraxe actúa exclusivamente como <strong>plataforma de anuncio y gestión</strong>. No organiza, dirige ni supervisa los torneos físicos. Toda la actividad deportiva y logística real corresponde en exclusiva a los organizadores.</p>
        </div>

        {/* S4 */}
        <div className="section" id="s4">
          <span className="section-num">04 —</span>
          <h2>Exención de Responsabilidad — Seguridad en Torneos</h2>
          <div className="alert-box">
            <div className="alert-box-title">⚠️ Actividad de riesgo — Exención expresa</div>
            <p>El lanzamiento de hacha es una actividad que implica el manejo de <strong>herramientas cortantes y potencialmente peligrosas</strong>. Novuraxe no tiene control alguno sobre la celebración, el desarrollo ni las condiciones de seguridad de los torneos anunciados en la plataforma.</p>
            <p><strong>Novuraxe no se hace responsable, en ningún caso, de los daños físicos, materiales o de cualquier otra naturaleza</strong> que puedan sufrir los participantes, organizadores, espectadores o cualquier tercero con motivo de la práctica del lanzamiento de hacha en torneos anunciados, gestionados o difundidos a través de esta plataforma.</p>
          </div>
          <p>Los organizadores que publiquen torneos en Novuraxe son los <strong>únicos responsables</strong> de garantizar:</p>
          <ul>
            <li>Que el recinto cuenta con las medidas de seguridad adecuadas (zonas de lanzamiento, protecciones, señalización).</li>
            <li>Que los participantes son informados de los riesgos inherentes antes de su participación.</li>
            <li>El cumplimiento de la normativa local, autonómica o nacional aplicable a deportes de lanzamiento.</li>
            <li>La disponibilidad de seguros de responsabilidad civil si así lo requiere la normativa o la prudencia.</li>
            <li>Que los participantes menores de edad cuentan con autorización de sus tutores legales.</li>
          </ul>
          <p>Los jugadores participan en torneos anunciados en Novuraxe <em>bajo su propia responsabilidad</em>, asumiendo voluntariamente los riesgos derivados de la actividad.</p>
          <div className="info-box">
            <div className="info-box-title">🪓 Equipamiento</div>
            <p>Novuraxe no verifica ni avala la calidad, estado ni idoneidad de las hachas u otros materiales. La responsabilidad sobre el equipamiento recae íntegramente en organizadores y participantes.</p>
          </div>
        </div>

        {/* S5 */}
        <div className="section" id="s5">
          <span className="section-num">05 —</span>
          <h2>Responsabilidad de los Organizadores</h2>
          <p>Los usuarios registrados como <strong>organizadores</strong> son responsables exclusivos del contenido que publican: anuncios de torneos, resultados y comunicaciones. Se comprometen a no publicar información fraudulenta, falsa o contraria a la legislación vigente.</p>
          <p>Novuraxe se reserva el derecho de suspender cuentas que hagan un uso abusivo o fraudulento de la plataforma.</p>
        </div>

        {/* S6 */}
        <div className="section" id="s6">
          <span className="section-num">06 —</span>
          <h2>Protección de Datos — Base Legal y Finalidad del Tratamiento</h2>
          <p>Novuraxe trata datos personales de conformidad con el <strong>Reglamento (UE) 2016/679 (RGPD)</strong> y la <strong>Ley Orgánica 3/2018 (LOPDGDD)</strong>. A continuación se detalla la base legal que ampara cada finalidad de tratamiento.</p>
          <p><strong>Responsable del tratamiento:</strong> Juan Ignacio Moreno Cordido — <a href="mailto:info@novuraxe.com" style={{ color: 'var(--accent)' }}>info@novuraxe.com</a></p>
          <div className="rgpd-table-wrap">
            <table className="rgpd-table">
              <thead><tr><th>Finalidad</th><th>Base legal (Art. RGPD)</th><th>Necesidad</th></tr></thead>
              <tbody>
                <tr><td>Gestión de cuenta y autenticación</td><td>Art. 6.1.b — Ejecución de contrato / relación de servicio</td><td>Obligatoria</td></tr>
                <tr><td>Mostrar perfil público (nombre, avatar)</td><td>Art. 6.1.a — Consentimiento del usuario</td><td>Opcional</td></tr>
                <tr><td>Registro y publicación de estadísticas deportivas</td><td>Art. 6.1.b — Ejecución del servicio solicitado</td><td>Inherente al uso</td></tr>
                <tr><td>Envío de emails transaccionales (reset de contraseña)</td><td>Art. 6.1.b — Prestación del servicio</td><td>Obligatoria</td></tr>
                <tr><td>Seguimiento de organizadores (follows)</td><td>Art. 6.1.a — Consentimiento explícito</td><td>Voluntaria</td></tr>
              </tbody>
            </table>
          </div>
          <div className="info-box">
            <div className="info-box-title">✅ Principio de minimización de datos</div>
            <p>Solo se recogen los datos estrictamente necesarios para cada finalidad declarada. No se realizan perfilados comerciales, puntuaciones de crédito, ni ningún tratamiento automatizado con efectos jurídicos o significativos sobre el usuario (Art. 22 RGPD).</p>
          </div>
          <p><strong>No se ceden, venden ni comparten datos con terceros</strong> salvo con el proveedor de infraestructura técnica (Supabase, véase sección 9). No existe ningún acuerdo comercial con terceros que implique el acceso a datos de usuarios.</p>
        </div>

        {/* S7 */}
        <div className="section" id="s7">
          <span className="section-num">07 —</span>
          <h2>Datos Recogidos, Categorías y Plazo de Conservación</h2>
          <div className="rgpd-table-wrap">
            <table className="rgpd-table">
              <thead><tr><th>Dato</th><th>Categoría</th><th>Origen</th><th>Plazo de conservación</th></tr></thead>
              <tbody>
                <tr><td>Dirección de email</td><td>Identificativo</td><td>Registro voluntario</td><td>Hasta eliminación de cuenta</td></tr>
                <tr><td>Nombre y nombre de usuario</td><td>Identificativo</td><td>Registro voluntario</td><td>Hasta eliminación de cuenta</td></tr>
                <tr><td>Foto de perfil (avatar)</td><td>Imagen personal</td><td>Carga voluntaria</td><td>Hasta eliminación o sustitución</td></tr>
                <tr><td>Rol en la plataforma (jugador/organizador)</td><td>Funcional</td><td>Selección en registro</td><td>Hasta eliminación de cuenta</td></tr>
                <tr><td>Estadísticas deportivas (puntos, victorias, KS, bulls)</td><td>Datos de actividad</td><td>Generado por uso de la plataforma</td><td>Hasta eliminación de cuenta</td></tr>
                <tr><td>Historial de torneos creados / participados</td><td>Datos de actividad</td><td>Generado por uso</td><td>Hasta eliminación de cuenta</td></tr>
                <tr><td>Relaciones de seguimiento (follows)</td><td>Asociativo</td><td>Acción voluntaria del usuario</td><td>Hasta eliminación o acción contraria</td></tr>
                <tr><td>Metadatos de sesión (token de autenticación)</td><td>Técnico</td><td>Autogenerado por Supabase Auth</td><td>Duración de la sesión activa</td></tr>
              </tbody>
            </table>
          </div>
          <div className="alert-box">
            <div className="alert-box-title">⚠️ Dato especialmente sensible — Imagen personal</div>
            <p>La fotografía de perfil puede constituir un dato biométrico si permite identificar al titular. Su aportación es <strong>completamente voluntaria</strong>. El usuario puede eliminarla en cualquier momento desde su perfil. No se realiza ningún tratamiento de reconocimiento facial ni análisis biométrico sobre estas imágenes.</p>
          </div>
          <p>Tras la eliminación de la cuenta, los datos serán borrados de los sistemas activos en un plazo máximo de <strong>30 días</strong>. Pueden persistir en copias de seguridad técnicas de la infraestructura durante un período adicional de hasta 90 días, tras el cual se eliminan definitivamente.</p>
        </div>

        {/* S8 */}
        <div className="section" id="s8">
          <span className="section-num">08 —</span>
          <h2>Derechos RGPD — Acceso, Rectificación, Cancelación, Oposición y Portabilidad (ARCO+)</h2>
          <p>De conformidad con el <strong>Capítulo III del RGPD</strong> (Arts. 15 a 22), el usuario tiene los siguientes derechos sobre sus datos personales:</p>
          <div className="rights-grid">
            {[
              { icon: '👁', title: 'Acceso', art: 'Art. 15', desc: 'Obtener confirmación de qué datos tuyos tratamos y una copia completa de los mismos.' },
              { icon: '✏️', title: 'Rectificación', art: 'Art. 16', desc: 'Corregir datos inexactos o completar datos incompletos. Puedes hacerlo directamente desde tu perfil.' },
              { icon: '🗑', title: 'Supresión', art: 'Art. 17', desc: 'Solicitar el borrado definitivo de todos tus datos ("derecho al olvido") cuando ya no sean necesarios.' },
              { icon: '⏸', title: 'Limitación', art: 'Art. 18', desc: 'Solicitar que se suspenda el tratamiento de tus datos mientras se resuelve una reclamación o se verifica su exactitud.' },
              { icon: '📦', title: 'Portabilidad', art: 'Art. 20', desc: 'Recibir tus datos en formato estructurado y legible por máquina (JSON/CSV) para trasladarlos a otro servicio.' },
              { icon: '🚫', title: 'Oposición', art: 'Art. 21', desc: 'Oponerte al tratamiento de tus datos para cualquier finalidad basada en interés legítimo o consentimiento.' },
            ].map(r => (
              <div className="right-card" key={r.title}>
                <div className="right-icon">{r.icon}</div>
                <div className="right-title">{r.title} <span className="right-art">{r.art}</span></div>
                <div className="right-desc">{r.desc}</div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: '1.5rem' }}>Para ejercer cualquiera de estos derechos, contacta por los medios indicados en la sección 15. <strong>Tiempo de respuesta objetivo: 30 días naturales</strong> (plazo máximo legal: 1 mes prorrogable a 3 meses en casos complejos, Art. 12.3 RGPD).</p>
          <div className="info-box">
            <div className="info-box-title">🏛 Derecho de reclamación ante la AEPD</div>
            <p>Si consideras que el tratamiento de tus datos vulnera el RGPD, tienes derecho a presentar una reclamación ante la <strong>Agencia Española de Protección de Datos (AEPD)</strong>: <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>www.aepd.es</a> — C/ Jorge Juan, 6, 28001 Madrid.</p>
          </div>
        </div>

        {/* S9 */}
        <div className="section" id="s9">
          <span className="section-num">09 —</span>
          <h2>Seguridad de los Datos</h2>
          <p>Novuraxe utiliza <strong>Supabase</strong> como proveedor de base de datos e infraestructura de autenticación, que implementa medidas estándar del sector:</p>
          <ul>
            <li>Cifrado en tránsito mediante <strong>TLS/HTTPS</strong>.</li>
            <li>Almacenamiento seguro de contraseñas mediante <strong>hashing bcrypt</strong> — nunca en texto plano.</li>
            <li>Control de acceso a datos mediante <strong>Row Level Security (RLS)</strong>.</li>
            <li>Infraestructura con certificaciones de seguridad reconocidas.</li>
          </ul>
          <div className="alert-box">
            <div className="alert-box-title">⚠️ Limitación de garantías</div>
            <p>No es posible garantizar una seguridad absoluta frente a cualquier incidente técnico. En caso de brecha de seguridad que afecte a datos personales, se notificará a los afectados por email en el menor plazo posible y, cuando proceda, a la Agencia Española de Protección de Datos en el plazo de 72 horas (Art. 33 RGPD).</p>
          </div>
        </div>

        {/* S10 */}
        <div className="section" id="s10">
          <span className="section-num">10 —</span>
          <h2>Cookies y Almacenamiento Local</h2>
          <p>Novuraxe utiliza <strong>almacenamiento local del navegador</strong> (<em>localStorage</em>) para guardar sesión y preferencias del usuario. Este almacenamiento es estrictamente necesario para el funcionamiento y no se usa con fines de seguimiento o publicidad.</p>
          <p>No se emplean cookies de terceros, píxeles de seguimiento ni herramientas de analítica externas.</p>
        </div>

        {/* S11 */}
        <div className="section" id="s11">
          <span className="section-num">11 —</span>
          <h2>Transferencias Internacionales de Datos</h2>
          <p>Novuraxe utiliza <strong>Supabase Inc.</strong> (EE.UU.) como proveedor de base de datos, autenticación y almacenamiento de archivos. Esta relación implica una <strong>transferencia internacional de datos</strong> a un país tercero.</p>
          <p>Supabase actúa como <strong>encargado del tratamiento</strong> (Art. 28 RGPD) y se adhiere a los marcos de adecuación aplicables. La transferencia está amparada por:</p>
          <ul>
            <li><strong>Cláusulas Contractuales Tipo (SCC)</strong> aprobadas por la Comisión Europea — Decisión 2021/914.</li>
            <li>Compromiso contractual de Supabase de no acceder a los datos de usuarios salvo instrucción expresa del responsable.</li>
            <li>Cifrado TLS en tránsito y cifrado en reposo en los servidores de Supabase.</li>
          </ul>
          <div className="info-box">
            <div className="info-box-title">🌍 Localización de los datos</div>
            <p>Los datos se almacenan en la región de la Unión Europea (Frankfurt, AWS eu-central-1) configurada en el proyecto Supabase, minimizando así las transferencias fuera del EEE. Puedes consultar la política de privacidad de Supabase en <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent)' }}>supabase.com/privacy</a>.</p>
          </div>
          <p>No se utilizan otros proveedores externos con acceso a datos de usuarios. No se integran servicios de analítica (Google Analytics, Mixpanel, etc.), publicidad, CDN de terceros con rastreo, ni SDKs de redes sociales.</p>
        </div>

        {/* S12 */}
        <div className="section" id="s12">
          <span className="section-num">12 —</span>
          <h2>Menores de Edad</h2>
          <p>Novuraxe está diseñada para usuarios mayores de <strong>16 años</strong>. Los menores no deben registrarse sin el consentimiento expreso de sus padres o tutores legales. La participación de menores en torneos físicos requiere siempre autorización de sus representantes, responsabilidad que recae sobre el organizador del evento.</p>
        </div>

        {/* S13 */}
        <div className="section" id="s13">
          <span className="section-num">13 —</span>
          <h2>Modificaciones de los Términos</h2>
          <p>Novuraxe puede modificar estos términos en cualquier momento. Los cambios entrarán en vigor desde su publicación en esta página. El uso continuado de la plataforma tras la publicación implica la aceptación de los nuevos términos.</p>
        </div>

        {/* S14 */}
        <div className="section" id="s14">
          <span className="section-num">14 —</span>
          <h2>Limitación de Responsabilidad General</h2>
          <p>En la máxima medida permitida por la legislación, Novuraxe <strong>no será responsable</strong> de:</p>
          <ul>
            <li>Daños físicos, materiales o personales derivados del uso de hachas en torneos anunciados en la plataforma.</li>
            <li>Pérdida de datos por fallos técnicos o incidentes de seguridad.</li>
            <li>Contenidos publicados por organizadores o usuarios que resulten incorrectos, fraudulentos o ilegales.</li>
            <li>Interrupciones del servicio por fallos en infraestructura de terceros.</li>
            <li>Daños indirectos, consecuentes o incidentales de cualquier tipo.</li>
          </ul>
        </div>

        {/* S15 */}
        <div className="section" id="s15">
          <span className="section-num">15 —</span>
          <h2>Contacto, Ejercicio de Derechos y Reclamaciones</h2>
          <p>Para consultas sobre estos términos, ejercicio de derechos RGPD, solicitudes de eliminación de cuenta o comunicación de incidencias de seguridad, puedes contactar a través de los canales disponibles en el perfil del proyecto.</p>
          <p>Nos comprometemos a responder en un plazo máximo de <strong>30 días naturales</strong> a cualquier solicitud relacionada con datos personales, conforme al Art. 12.3 RGPD.</p>
          <div className="info-box">
            <div className="info-box-title">📋 Información a incluir en tu solicitud RGPD</div>
            <p>Para agilizar la gestión, incluye en tu mensaje: (1) tipo de solicitud (acceso, supresión, portabilidad…), (2) nombre de usuario o email con el que estás registrado, (3) descripción breve de lo solicitado.</p>
          </div>
          <hr className="divider" />
          <p style={{ fontSize: '13px', color: 'var(--ink4)' }}>Este documento ha sido redactado conforme al RGPD y la LOPDGDD. Para cualquier consulta sobre privacidad: <a href="mailto:info@novuraxe.com" style={{ color: 'var(--accent)' }}>info@novuraxe.com</a></p>
        </div>

      </div>

      {/* FOOTER */}
      <div className="terms-footer">
        <strong><span>NOVURAXE</span></strong> &nbsp;·&nbsp; Plataforma de Gestión de Torneos de Lanzamiento de Hacha<br />
        Responsable: Juan Ignacio Moreno Cordido · <a href="mailto:info@novuraxe.com" style={{ color: 'var(--accent)' }}>info@novuraxe.com</a>
      </div>
    </>
  )
}