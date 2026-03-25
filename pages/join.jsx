// pages/join.jsx
// ─────────────────────────────────────────────
// Página de aterrizaje para invitaciones
// URL: /join?ref=CODIGO
// ─────────────────────────────────────────────
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { createClient } from '@supabase/supabase-js'

const sb = createClient(
  process.env.NEXT_PUBLIC_SUPA_URL,
  process.env.NEXT_PUBLIC_SUPA_KEY
)

const PAGE_CSS = `
  :root {
    --accent:#C4873A; --accent2:#e0a84f;
    --bg0:#111009; --bg1:#1a1410; --bg2:#22190f; --bg3:#2c2418;
    --ink1:#ffffff; --ink2:#ffffff;
    --ink3:rgba(255,255,255,0.8); --ink4:rgba(255,255,255,0.55);
    --r:8px; --r2:14px; --green:#6ab187;
  }
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:var(--bg0);color:var(--ink2);font-family:'DM Sans',sans-serif;
    font-size:15px;line-height:1.75;min-height:100vh;overflow-x:hidden;cursor:none}
  body::before{content:'';position:fixed;inset:0;
    background:radial-gradient(ellipse 800px 500px at 60% 20%,rgba(196,135,58,0.07) 0%,transparent 70%);
    pointer-events:none;z-index:0}

  .cursor{position:fixed;width:10px;height:10px;background:var(--accent);border-radius:50%;
    pointer-events:none;z-index:9999;transform:translate(-50%,-50%);
    transition:transform 0.1s,width 0.2s,height 0.2s,background 0.2s;mix-blend-mode:difference}
  .cursor-ring{position:fixed;width:36px;height:36px;border:1.5px solid var(--accent);
    border-radius:50%;pointer-events:none;z-index:9998;transform:translate(-50%,-50%);
    transition:all 0.12s ease;opacity:0.6}
  .cursor.hover{width:18px;height:18px}
  .cursor-ring.hover{width:54px;height:54px;opacity:0.3}

  .join-wrap{position:relative;z-index:1;min-height:100vh;display:flex;
    align-items:center;justify-content:center;padding:2rem}

  .join-card{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.12);
    border-radius:20px;padding:2.25rem 2rem;width:100%;max-width:420px;
    box-shadow:0 20px 60px rgba(0,0,0,0.5);text-align:center}

  .join-logo{height:44px;width:auto;object-fit:contain;margin-bottom:1.5rem;
    filter:drop-shadow(0 2px 8px rgba(196,135,58,0.2))}

  .join-org-logo{width:56px;height:56px;border-radius:12px;object-fit:contain;
    background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);
    margin:0 auto 0.5rem;display:flex;align-items:center;justify-content:center;
    font-size:1.6rem;overflow:hidden}
  .join-org-logo img{width:100%;height:100%;object-fit:contain}

  .join-badge{display:inline-block;font-size:10px;font-weight:700;letter-spacing:2px;
    text-transform:uppercase;color:var(--accent);background:rgba(196,135,58,0.1);
    border:1px solid rgba(196,135,58,0.25);padding:4px 14px;border-radius:20px;
    margin-bottom:1rem}

  .join-title{font-family:'Bebas Neue',sans-serif;font-size:2rem;letter-spacing:3px;
    color:#fff;line-height:1.1;margin-bottom:0.4rem}
  .join-title span{color:var(--accent)}

  .join-desc{font-size:13px;color:var(--ink3);margin-bottom:1.25rem;line-height:1.6}
  .join-desc strong{color:var(--ink2)}

  .trial-box{background:rgba(106,177,135,0.1);border:1px solid rgba(106,177,135,0.25);
    border-radius:var(--r2);padding:0.875rem 1rem;margin-bottom:1.25rem;
    display:flex;align-items:center;gap:0.75rem;text-align:left}
  .trial-icon{font-size:1.3rem;flex-shrink:0}
  .trial-text{font-size:13px;color:rgba(150,220,180,0.95);line-height:1.5}
  .trial-text strong{color:#8de0b0}

  .field{margin-bottom:0.75rem;text-align:left}
  .field label{display:block;font-size:10px;font-weight:700;letter-spacing:1px;
    text-transform:uppercase;color:var(--ink3);margin-bottom:5px}
  .field input{width:100%;background:rgba(255,255,255,0.07);
    border:1.5px solid rgba(255,255,255,0.14);border-radius:var(--r);
    color:#fff;font-size:14px;padding:0.6rem 0.875rem;outline:none;
    transition:all 0.15s;font-family:inherit}
  .field input:focus{border-color:var(--accent);background:rgba(255,255,255,0.1);
    box-shadow:0 0 0 3px rgba(196,135,58,0.15)}
  .field input::placeholder{color:rgba(255,255,255,0.3)}

  .btn-join{width:100%;padding:0.875rem;border:none;border-radius:var(--r);
    background:var(--accent);color:#1a1410;font-size:14px;font-weight:700;
    letter-spacing:0.5px;cursor:pointer;transition:all 0.15s;font-family:inherit;
    margin-top:0.5rem}
  .btn-join:hover{background:var(--accent2);transform:translateY(-1px);
    box-shadow:0 4px 20px rgba(196,135,58,0.35)}
  .btn-join:disabled{opacity:0.5;cursor:not-allowed;transform:none}

  .err{font-size:12px;color:#e07070;margin-bottom:0.75rem;font-weight:500;
    background:rgba(184,64,64,0.1);border:1px solid rgba(184,64,64,0.2);
    border-radius:6px;padding:8px 12px}
  .ok-state{display:flex;flex-direction:column;align-items:center;gap:0.75rem}
  .ok-icon{font-size:3rem}
  .ok-title{font-family:'Bebas Neue',sans-serif;font-size:1.8rem;
    letter-spacing:2px;color:var(--green)}
  .ok-desc{font-size:13px;color:var(--ink3);line-height:1.6}

  .login-link{font-size:11px;color:var(--ink4);margin-top:1rem}
  .login-link a{color:var(--accent);text-decoration:none;font-weight:600}
  .login-link a:hover{color:var(--accent2)}

  .loading{display:flex;flex-direction:column;align-items:center;
    gap:1rem;padding:2rem;color:var(--ink3);font-size:14px}
  .spinner{width:32px;height:32px;border:3px solid rgba(196,135,58,0.2);
    border-top-color:var(--accent);border-radius:50%;animation:spin 0.8s linear infinite}
  @keyframes spin{to{transform:rotate(360deg)}}

  .not-found{display:flex;flex-direction:column;align-items:center;
    gap:0.75rem;padding:2rem;color:var(--ink3)}
  .not-found-icon{font-size:2.5rem}
  .not-found-title{font-size:1.1rem;font-weight:700;color:var(--ink2)}

  .org-invited-by{font-size:12px;color:var(--ink3);margin-bottom:0.75rem}
  .org-invited-by strong{color:var(--ink2)}
`

export default function JoinPage() {
  const router = useRouter()
  const { ref: code } = router.query

  const [status,    setStatus]    = useState('loading') // loading | valid | invalid | success
  const [invite,    setInvite]    = useState(null)
  const [username,  setUsername]  = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [err,       setErr]       = useState('')
  const [loading,   setLoading]   = useState(false)

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
  }, [status]) // re-run cuando cambia status para capturar nuevos botones

  // Validar código al cargar
  useEffect(() => {
    if (!code) return
    fetch(`/api/invite?code=${code}`)
      .then(r => r.json())
      .then(data => {
        if (data.valid) { setInvite(data); setStatus('valid') }
        else            setStatus('invalid')
      })
      .catch(() => setStatus('invalid'))
  }, [code])

  async function handleRegister(e) {
    e.preventDefault()
    setErr(''); setLoading(true)

    try {
      // 1. Registrar en Supabase Auth
      const { data: authData, error: authErr } = await sb.auth.signUp({
        email,
        password,
        options: { data: { username } }
      })
      if (authErr) throw new Error(authErr.message)

      const userId = authData.user?.id
      if (!userId) throw new Error('No se pudo crear la cuenta')

      // 2. Crear perfil en users
      await sb.from('users').upsert({
        id:       userId,
        username: username.trim(),
        role:     'player',
      })

      // 3. Canjear invitación
      const redeemRes = await fetch('/api/invite', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'redeem', code, userId }),
      })
      const redeemData = await redeemRes.json()
      if (!redeemData.ok) throw new Error(redeemData.error || 'Error al activar el trial')

      setStatus('success')
    } catch(e) {
      setErr(e.message)
    } finally {
      setLoading(false)
    }
  }

  const org = invite?.organizer

  return (
    <>
      <Head>
        <title>Únete a Novuraxe — Invitación</title>
        <meta name="description" content="Tienes una invitación para unirte a Novuraxe con 14 días Premium gratis." />
        <link rel="icon" href="/dataxe-simple.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&display=swap" rel="stylesheet" />
        <style>{PAGE_CSS}</style>
      </Head>

      <div id="cursor" className="cursor" />
      <div id="cursor-ring" className="cursor-ring" />

      <div className="join-wrap">
        <div className="join-card">
          <img src="/novuraxe-logo.png" alt="Novuraxe" className="join-logo"
            onError={e => e.target.style.display='none'} />

          {/* LOADING */}
          {status === 'loading' && (
            <div className="loading">
              <div className="spinner" />
              Validando invitación...
            </div>
          )}

          {/* CÓDIGO INVÁLIDO */}
          {status === 'invalid' && (
            <div className="not-found">
              <div className="not-found-icon">🔗</div>
              <div className="not-found-title">Invitación no válida</div>
              <p>Este enlace no existe o ya ha sido usado.</p>
              <Link href="/" style={{ color: 'var(--accent)', fontSize: '13px', marginTop: '0.5rem' }}>
                Ir a Novuraxe →
              </Link>
            </div>
          )}

          {/* ÉXITO */}
          {status === 'success' && (
            <div className="ok-state">
              <div className="ok-icon">🎉</div>
              <div className="ok-title">¡Ya eres parte!</div>
              <p className="ok-desc">
                Tu cuenta está activa con <strong style={{ color: 'var(--green)' }}>{invite?.trial_days || 14} días Premium gratis</strong>.
                {org?.club_name && <> Estás vinculado a <strong>{org.club_name}</strong>.</>}
              </p>
              <Link href="/player" style={{
                marginTop: '0.75rem', display: 'inline-block', background: 'var(--accent)',
                color: '#1a1410', padding: '10px 28px', borderRadius: '8px',
                fontWeight: 700, fontSize: '13px', textDecoration: 'none'
              }}>
                Ir a mi perfil →
              </Link>
            </div>
          )}

          {/* FORMULARIO */}
          {status === 'valid' && (
            <>
              {/* Club del organizador */}
              {org && (
                <>
                  <div className="join-org-logo">
                    {org.logo_url
                      ? <img src={org.logo_url} alt={org.club_name} />
                      : '🪓'}
                  </div>
                  <div className="org-invited-by">
                    Invitado por <strong>{org.club_name || org.username}</strong>
                  </div>
                </>
              )}

              <div className="join-badge">Invitación exclusiva</div>
              <h1 className="join-title">Únete a <span>Novuraxe</span></h1>
              <p className="join-desc">
                Gestiona tus stats, sigue torneos en vivo y compite al máximo nivel.
              </p>

              <div className="trial-box">
                <div className="trial-icon">⚡</div>
                <div className="trial-text">
                  <strong>{invite.trial_days} días Premium gratis</strong> — sin tarjeta de crédito.<br />
                  Stats completas, sin anuncios, acceso total.
                </div>
              </div>

              {err && <div className="err">{err}</div>}

              <form onSubmit={handleRegister}>
                <div className="field">
                  <label>Nombre de usuario</label>
                  <input type="text" placeholder="tu_nombre" value={username}
                    onChange={e => setUsername(e.target.value)} required autoComplete="username" />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input type="email" placeholder="tu@email.com" value={email}
                    onChange={e => setEmail(e.target.value)} required autoComplete="email" />
                </div>
                <div className="field">
                  <label>Contraseña</label>
                  <input type="password" placeholder="Mínimo 6 caracteres" value={password}
                    onChange={e => setPassword(e.target.value)} required minLength={6} autoComplete="new-password" />
                </div>
                <button type="submit" className="btn-join" disabled={loading}>
                  {loading ? 'Creando cuenta...' : `Crear cuenta y activar ${invite.trial_days} días Premium`}
                </button>
              </form>

              <p className="login-link" style={{ marginTop: '1.25rem', fontSize: '11px' }}>
                Al registrarte aceptas los{' '}
                <Link href="/terms" style={{ color: 'var(--accent)' }}>términos y condiciones</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  )
}
