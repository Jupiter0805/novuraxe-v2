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
    --ink1:#ffffff; --ink2:rgba(255,255,255,0.75);
    --ink3:rgba(255,255,255,0.5); --ink4:rgba(255,255,255,0.3);
    --r:8px; --r2:14px; --green:#6ab187;
  }
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{background:var(--bg0);color:var(--ink2);font-family:'DM Sans',sans-serif;
    font-size:15px;line-height:1.75;min-height:100vh;overflow-x:hidden}
  body::before{content:'';position:fixed;inset:0;
    background:radial-gradient(ellipse 800px 500px at 60% 20%,rgba(196,135,58,0.07) 0%,transparent 70%);
    pointer-events:none;z-index:0}

  .join-wrap{position:relative;z-index:1;min-height:100vh;display:flex;
    align-items:center;justify-content:center;padding:2rem}

  .join-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.09);
    border-radius:20px;padding:2.5rem 2.25rem;width:100%;max-width:440px;
    box-shadow:0 20px 60px rgba(0,0,0,0.5);text-align:center}

  .join-logo{height:52px;width:auto;object-fit:contain;margin-bottom:1.75rem;
    filter:drop-shadow(0 2px 8px rgba(196,135,58,0.2))}

  .join-org-logo{width:64px;height:64px;border-radius:12px;object-fit:contain;
    background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);
    margin:0 auto 0.75rem;display:flex;align-items:center;justify-content:center;
    font-size:1.8rem;overflow:hidden}
  .join-org-logo img{width:100%;height:100%;object-fit:contain}

  .join-badge{display:inline-block;font-size:10px;font-weight:700;letter-spacing:2px;
    text-transform:uppercase;color:var(--accent);background:rgba(196,135,58,0.1);
    border:1px solid rgba(196,135,58,0.25);padding:4px 14px;border-radius:20px;
    margin-bottom:1.25rem}

  .join-title{font-family:'Bebas Neue',sans-serif;font-size:2.2rem;letter-spacing:3px;
    color:var(--ink1);line-height:1.1;margin-bottom:0.5rem}
  .join-title span{color:var(--accent)}

  .join-desc{font-size:14px;color:var(--ink3);margin-bottom:1.75rem;line-height:1.6}
  .join-desc strong{color:var(--ink2)}

  .trial-box{background:rgba(106,177,135,0.08);border:1px solid rgba(106,177,135,0.2);
    border-radius:var(--r2);padding:1rem 1.25rem;margin-bottom:1.75rem;
    display:flex;align-items:center;gap:0.75rem;text-align:left}
  .trial-icon{font-size:1.5rem;flex-shrink:0}
  .trial-text{font-size:13px;color:rgba(106,177,135,0.9);line-height:1.5}
  .trial-text strong{color:var(--green)}

  .field{margin-bottom:0.875rem;text-align:left}
  .field label{display:block;font-size:10px;font-weight:700;letter-spacing:1px;
    text-transform:uppercase;color:var(--ink3);margin-bottom:6px}
  .field input{width:100%;background:rgba(255,255,255,0.05);
    border:1.5px solid rgba(255,255,255,0.1);border-radius:var(--r);
    color:var(--ink1);font-size:14px;padding:0.6rem 0.875rem;outline:none;
    transition:all 0.15s;font-family:inherit}
  .field input:focus{border-color:var(--accent);background:rgba(255,255,255,0.08);
    box-shadow:0 0 0 3px rgba(196,135,58,0.15)}
  .field input::placeholder{color:var(--ink4)}

  .btn-join{width:100%;padding:0.875rem;border:none;border-radius:var(--r);
    background:var(--accent);color:#1a1410;font-size:14px;font-weight:700;
    letter-spacing:0.5px;cursor:pointer;transition:all 0.15s;font-family:inherit;
    margin-top:0.25rem}
  .btn-join:hover{background:var(--accent2);transform:translateY(-1px);
    box-shadow:0 4px 20px rgba(196,135,58,0.35)}
  .btn-join:disabled{opacity:0.5;cursor:not-allowed;transform:none}

  .err{font-size:12px;color:#d4635a;margin-bottom:0.75rem;font-weight:500}
  .ok-state{display:flex;flex-direction:column;align-items:center;gap:0.75rem}
  .ok-icon{font-size:3rem}
  .ok-title{font-family:'Bebas Neue',sans-serif;font-size:1.8rem;
    letter-spacing:2px;color:var(--green)}
  .ok-desc{font-size:13px;color:var(--ink3);line-height:1.6}

  .divider{display:flex;align-items:center;gap:10px;margin:1rem 0;
    color:var(--ink4);font-size:11px}
  .divider::before,.divider::after{content:'';flex:1;height:1px;
    background:rgba(255,255,255,0.08)}

  .login-link{font-size:12px;color:var(--ink4);margin-top:1rem}
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
`

export default function JoinPage() {
  const router = useRouter()
  const { ref: code } = router.query

  const [status,    setStatus]    = useState('loading') // loading | valid | invalid | success
  const [invite,    setInvite]    = useState(null)
  const [tab,       setTab]       = useState('register') // register | login
  const [username,  setUsername]  = useState('')
  const [email,     setEmail]     = useState('')
  const [password,  setPassword]  = useState('')
  const [err,       setErr]       = useState('')
  const [loading,   setLoading]   = useState(false)

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

  async function handleLogin(e) {
    e.preventDefault()
    setErr(''); setLoading(true)
    try {
      const { data: authData, error } = await sb.auth.signInWithPassword({ email, password })
      if (error) throw new Error(error.message)

      const userId = authData.user?.id
      // Canjear invitación en cuenta existente
      const res = await fetch('/api/invite', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ action: 'redeem', code, userId }),
      })
      const data = await res.json()
      if (!data.ok) throw new Error(data.error || 'Error al activar el trial')
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
                  <div style={{ fontSize: '12px', color: 'var(--ink3)', marginBottom: '0.5rem' }}>
                    Invitado por <strong style={{ color: 'var(--ink2)' }}>{org.club_name || org.username}</strong>
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

              {/* Tabs registro / login */}
              <div style={{ display: 'flex', gap: '4px', background: 'rgba(255,255,255,0.05)',
                borderRadius: '8px', padding: '3px', marginBottom: '1.25rem' }}>
                {['register', 'login'].map(t => (
                  <button key={t} onClick={() => { setTab(t); setErr('') }} style={{
                    flex: 1, background: tab === t ? 'rgba(255,255,255,0.1)' : 'transparent',
                    border: 'none', borderRadius: '6px', color: tab === t ? '#fff' : 'var(--ink3)',
                    fontWeight: 700, fontSize: '12px', padding: '7px', cursor: 'pointer',
                    letterSpacing: '0.5px', fontFamily: 'inherit'
                  }}>
                    {t === 'register' ? 'Crear cuenta' : 'Ya tengo cuenta'}
                  </button>
                ))}
              </div>

              {err && <div className="err">{err}</div>}

              {tab === 'register' ? (
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
              ) : (
                <form onSubmit={handleLogin}>
                  <div className="field">
                    <label>Email</label>
                    <input type="email" placeholder="tu@email.com" value={email}
                      onChange={e => setEmail(e.target.value)} required autoComplete="email" />
                  </div>
                  <div className="field">
                    <label>Contraseña</label>
                    <input type="password" placeholder="Tu contraseña" value={password}
                      onChange={e => setPassword(e.target.value)} required autoComplete="current-password" />
                  </div>
                  <button type="submit" className="btn-join" disabled={loading}>
                    {loading ? 'Iniciando sesión...' : `Iniciar sesión y activar trial`}
                  </button>
                </form>
              )}

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
