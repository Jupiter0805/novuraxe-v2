// pages/user/[username].jsx
// ─────────────────────────────────────────────
// NOVURAXE — Perfil público de jugador u organizador
// Ruta: /user/[username]
// ─────────────────────────────────────────────
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import Link from 'next/link'
import { supabase } from '../../lib/supabase'

// ─── Helpers ───────────────────────────────
function fmtDate(d) {
  if (!d) return null
  return new Date(d).toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })
}

function fmtDateShort(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })
}

function renderMd(text) {
  if (!text) return ''
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/\n/g, '<br>')
}

// ─── Sub-componentes ───────────────────────

function Spinner() {
  return (
    <div className="state">
      <div className="spinner"></div>
      <p>Cargando perfil...</p>
    </div>
  )
}

function StateEmpty({ icon, title, sub }) {
  return (
    <div className="state">
      <div className="icon">{icon}</div>
      <h2>{title}</h2>
      {sub && <p>{sub}</p>}
    </div>
  )
}

function StatsGrid({ stats }) {
  return (
    <div className="stats-grid">
      {stats.map(({ value, label, color }) => (
        <div className="stat" key={label}>
          <div className={`stat-n${color ? ' ' + color : ''}`}>{value}</div>
          <div className="stat-l">{label}</div>
        </div>
      ))}
    </div>
  )
}

function PlayerProfile({ player }) {
  const [stats, setStats] = useState({ tournaments: 0, wins: 0, points: 0 })
  const [orgs, setOrgs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      // Stats
      const { data: statsRows } = await supabase
        .from('global_stats')
        .select('tournaments,wins,total_qpts')
        .eq('user_id', player.id)

      let tournaments = 0, wins = 0, points = 0
      ;(statsRows || []).forEach(s => {
        tournaments += s.tournaments || 0
        wins        += s.wins        || 0
        points      += s.total_qpts  || 0
      })
      setStats({ tournaments, wins, points })

      // Follows → orgs
      const { data: followRows } = await supabase
        .from('follows')
        .select('following_id')
        .eq('follower_id', player.id)

      const orgIds = (followRows || []).map(f => f.following_id)
      if (orgIds.length) {
        const { data: orgRows } = await supabase
          .from('organizers')
          .select('id,club_name,username,logo_url')
          .in('id', orgIds)
        setOrgs(orgRows || [])
      }

      setLoading(false)
    }
    load()
  }, [player.id])

  const since = fmtDate(player.created_at)

  if (loading) return <Spinner />

  return (
    <>
      <div className="card">
        <div className="card-cover"></div>
        <div className="card-body">
          <div className="avatar-wrap">
            {player.avatar_url ? <img src={player.avatar_url} alt="" /> : '🎯'}
          </div>
          <div className="player-name">{player.club_name || player.username}</div>
          <div className="player-username">@{player.username}</div>
          {since && <div className="player-since">Miembro desde {since}</div>}
          <StatsGrid stats={[
            { value: stats.tournaments, label: 'Torneos' },
            { value: stats.wins,        label: 'Victorias', color: 'g' },
            { value: stats.points,      label: 'Puntos',    color: 's' },
          ]} />
        </div>
      </div>

      {orgs.length > 0 && (
        <>
          <div className="section-title">Clubs &amp; Organizadores</div>
          {orgs.map(o => (
            <div className="org-row" key={o.id}>
              <div className="org-mini">
                {o.logo_url ? <img src={o.logo_url} alt="" /> : '🏟'}
              </div>
              <div>
                <div className="org-name">{o.club_name || o.username}</div>
                <div className="org-handle">@{o.username}</div>
              </div>
            </div>
          ))}
        </>
      )}
    </>
  )
}

function OrgProfile({ user }) {
  const [org, setOrg]           = useState(null)
  const [followers, setFollowers] = useState(0)
  const [tournCount, setTournCount] = useState(0)
  const [posts, setPosts]       = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    async function load() {
      const { data: orgRows } = await supabase
        .from('organizers')
        .select('id,club_name,username,logo_url')
        .eq('user_id', user.id)
        .limit(1)

      if (!orgRows?.length) { setLoading(false); return }
      const orgData = orgRows[0]
      setOrg(orgData)

      const [
        { data: followRows },
        { data: tournRows },
        { data: postRows },
      ] = await Promise.all([
        supabase.from('follows').select('id').eq('following_id', user.id),
        supabase.from('posts').select('id').eq('user_id', user.id).eq('post_type', 'torneo'),
        supabase.from('posts').select('id,title,description,post_type,created_at,image_url').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      ])

      setFollowers((followRows || []).length)
      setTournCount((tournRows || []).length)
      setPosts(postRows || [])
      setLoading(false)
    }
    load()
  }, [user.id])

  if (loading) return <Spinner />
  if (!org) return <StateEmpty icon="🏟" title="Organizador no encontrado" />

  const since = fmtDate(user.created_at)

  const typeColors = {
    info:   { bg: 'rgba(96,165,250,0.1)',   color: '#60a5fa',      border: 'rgba(96,165,250,0.25)' },
    aviso:  { bg: 'rgba(239,68,68,0.1)',    color: '#f87171',      border: 'rgba(239,68,68,0.25)' },
    torneo: { bg: 'rgba(196,135,58,0.1)',   color: 'var(--accent)', border: 'rgba(196,135,58,0.25)' },
  }
  const typeLabels = { torneo: '🏆 Torneo', aviso: '⚠️ Aviso', info: 'ℹ️ Info' }

  return (
    <>
      <div className="card">
        <div className="card-cover"></div>
        <div className="card-body">
          <div className="avatar-wrap">
            {org.logo_url ? <img src={org.logo_url} alt="" /> : '🏟'}
          </div>
          <div className="player-name">{org.club_name || org.username}</div>
          <div className="player-username">@{org.username}</div>
          {since && <div className="player-since">En Novuraxe desde {since}</div>}
          <StatsGrid stats={[
            { value: tournCount,    label: 'Torneos' },
            { value: followers,     label: 'Seguidores', color: 'g' },
            { value: posts.length,  label: 'Posts',      color: 's' },
          ]} />
        </div>
      </div>

      {posts.length > 0 && (
        <>
          <div className="section-title">Publicaciones</div>
          {posts.map(p => {
            const type = p.post_type || 'torneo'
            const tc = typeColors[type] || typeColors.torneo
            const label = typeLabels[type] || type
            return (
              <div className="card" key={p.id} style={{ marginBottom: '0.75rem' }}>
                <div className="card-body" style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.6rem' }}>
                    <div className="org-mini" style={{ width: '28px', height: '28px', fontSize: '0.8rem' }}>
                      {org.logo_url ? <img src={org.logo_url} alt="" /> : '🏟'}
                    </div>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--ink2)' }}>{org.club_name || org.username}</span>
                    <span style={{ fontSize: '11px', color: 'var(--ink4)', marginLeft: 'auto' }}>{fmtDateShort(p.created_at)}</span>
                  </div>
                  <div style={{ display: 'inline-block', fontSize: '10px', fontWeight: 700, letterSpacing: '0.5px', padding: '3px 8px', borderRadius: '20px', marginBottom: '0.5rem', background: tc.bg, color: tc.color, border: `1px solid ${tc.border}` }}>
                    {label}
                  </div>
                  {p.title && <div style={{ fontSize: '15px', fontWeight: 700, color: '#fff', marginBottom: '0.4rem' }}>{p.title}</div>}
                  {p.description && <div style={{ fontSize: '13px', color: 'var(--ink3)', lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: renderMd(p.description) }} />}
                  {p.image_url && <img src={p.image_url} alt="" style={{ width: '100%', borderRadius: '8px', marginTop: '0.75rem', objectFit: 'cover', maxHeight: '200px' }} />}
                </div>
              </div>
            )
          })}
        </>
      )}
    </>
  )
}

// ─── Página principal ───────────────────────
export default function UserProfile() {
  const router   = useRouter()
  const { username } = router.query

  const [profile, setProfile] = useState(null)   // datos del user
  const [status, setStatus]   = useState('loading') // loading | found | notfound | nouser
  const [pageTitle, setPageTitle] = useState('NOVURAXE — Jugador')

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

  useEffect(() => {
    if (!router.isReady) return
    if (!username) {
      setTimeout(() => setStatus('nouser'), 0)
      return
    }

    async function loadProfile() {
      const { data: rows } = await supabase
        .from('users')
        .select('id,username,club_name,avatar_url,created_at,role')
        .ilike('username', username)
        .limit(1)

      if (!rows?.length) { setStatus('notfound'); return }

      const user = rows[0]
      setProfile(user)
      setPageTitle(`${user.club_name || user.username} — NOVURAXE`)
      setStatus('found')
    }

    loadProfile()
  }, [router.isReady, username])

  // ─── RENDER ────────────────────────────
  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={`Perfil de ${username} en NOVURAXE`} />
        <link rel="icon" href="/dataxe-simple.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap" rel="stylesheet" />
        <style>{`
          :root {
            --bg:#1a1410; --bg2:#2c2418; --bg3:#3e3025;
            --ink:#fdfaf7; --ink2:#f0ebe3; --ink3:#b5a898; --ink4:#6b5d4e;
            --line:rgba(255,255,255,0.08); --line2:rgba(255,255,255,0.14);
            --accent:#c4873a; --accent2:#d4975a;
            --green:#6ab187; --sand:#c4a96a; --red:#d4635a;
            --r:8px; --r2:12px;
            --sh2:0 8px 32px rgba(0,0,0,0.5);
            --f:'Segoe UI',system-ui,sans-serif;
            --f-display:'Bebas Neue',sans-serif;
          }
          *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
          html{scroll-behavior:smooth}
          body{font-family:var(--f);background:var(--bg);color:var(--ink);font-size:14px;line-height:1.5;min-height:100vh;-webkit-font-smoothing:antialiased}

          .topbar{position:sticky;top:0;z-index:200;height:72px;background:rgba(26,20,16,0.92);backdrop-filter:blur(12px);border-bottom:1px solid rgba(196,135,58,0.15);display:flex;align-items:center;padding:0 1.5rem;gap:1rem;box-shadow:0 1px 20px rgba(0,0,0,0.4)}
          .t-logo img{height:30px;width:auto;filter:brightness(0) invert(1)}
          .t-sep{width:1px;height:22px;background:rgba(255,255,255,0.1);flex-shrink:0}
          .t-role-badge{font-size:9px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:var(--accent);border:1px solid rgba(196,135,58,0.3);padding:3px 10px;border-radius:20px}
          .t-nav-link{font-size:12px;font-weight:600;color:rgba(255,255,255,0.6);text-decoration:none;padding:6px 12px;border-radius:8px;transition:all 0.15s}
          .t-nav-link:hover{background:rgba(255,255,255,0.08);color:#fff}
          .t-right{margin-left:auto}
          .t-back-btn{font-size:12px;font-weight:600;color:rgba(255,255,255,0.6);background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:8px;padding:6px 14px;cursor:pointer;text-decoration:none;transition:all 0.15s}
          .t-back-btn:hover{background:rgba(255,255,255,0.1);color:#fff}

          .wrap{width:100%;max-width:720px;margin:0 auto;padding:2rem 1.5rem 4rem}

          .card{background:var(--bg2);border:1px solid var(--line2);border-radius:var(--r2);overflow:hidden;box-shadow:var(--sh2);margin-bottom:1rem}
          .card-cover{height:80px;background:linear-gradient(135deg,var(--bg3) 0%,#2a1f0f 100%)}
          .card-body{padding:0 1.25rem 1.25rem}

          .avatar-wrap{width:72px;height:72px;border-radius:50%;border:3px solid var(--bg2);overflow:hidden;margin-top:-36px;margin-bottom:0.75rem;background:var(--bg3);display:flex;align-items:center;justify-content:center;font-size:2rem}
          .avatar-wrap img{width:100%;height:100%;object-fit:cover}

          .player-name{font-family:var(--f-display);font-size:1.4rem;letter-spacing:0.5px;color:#fff;line-height:1.1}
          .player-username{font-size:12px;color:var(--ink4);margin-top:3px}
          .player-since{font-size:11px;color:var(--ink4);margin-top:6px}

          .stats-grid{display:grid;grid-template-columns:1fr 1fr 1fr;border-top:1px solid var(--line);margin-top:1rem}
          .stat{padding:1rem 0.5rem;text-align:center;border-right:1px solid var(--line)}
          .stat:last-child{border-right:none}
          .stat-n{font-size:1.4rem;font-weight:800;color:var(--accent);line-height:1}
          .stat-n.g{color:var(--green)}
          .stat-n.s{color:var(--sand)}
          .stat-l{font-size:9px;color:rgba(255,255,255,0.35);letter-spacing:1px;text-transform:uppercase;margin-top:4px}

          .section-title{font-size:10px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:var(--ink4);margin-bottom:0.75rem;margin-top:1.5rem}

          .org-row{display:flex;align-items:center;gap:10px;padding:0.7rem 1rem;background:var(--bg2);border:1px solid var(--line);border-radius:var(--r);margin-bottom:6px}
          .org-mini{width:36px;height:36px;border-radius:50%;background:var(--bg3);overflow:hidden;display:flex;align-items:center;justify-content:center;font-size:1.1rem;flex-shrink:0}
          .org-mini img{width:100%;height:100%;object-fit:cover}
          .org-name{font-weight:700;font-size:13px;color:var(--ink)}
          .org-handle{font-size:11px;color:var(--ink4)}

          .state{text-align:center;padding:3rem 2rem;color:var(--ink4)}
          .state .icon{font-size:3rem;margin-bottom:1rem}
          .state h2{font-size:1.1rem;color:var(--ink3);margin-bottom:0.5rem}
          .state p{font-size:13px}

          .spinner{width:28px;height:28px;border:3px solid rgba(196,135,58,0.2);border-top-color:var(--accent);border-radius:50%;animation:spin 0.7s linear infinite;margin:0 auto 1rem}
          @keyframes spin{to{transform:rotate(360deg)}}

          @media(max-width:600px){
            .topbar{padding:0 1rem;gap:0.5rem}
            .t-nav-link{display:none}
            .wrap{padding:1.5rem 1rem 3rem}
          }
        `}</style>
      </Head>

      {/* CURSOR */}
      <div className="cursor" id="cursor"></div>
      <div className="cursor-ring" id="cursor-ring"></div>
      {/* TOPBAR */}
      <div className="topbar">
        <div className="t-logo">
          <Link href="/"><img src="/novuraxe-logo.png" alt="NOVURAXE" /></Link>
        </div>
        <div className="t-sep"></div>
        <div className="t-role-badge">Jugador</div>
        <div className="t-sep"></div>
        <nav style={{ display: 'flex', gap: '2px' }}>
          <Link className="t-nav-link" href="/player">Feed</Link>
          <Link className="t-nav-link" href="/player">Organizadores</Link>
          <Link className="t-nav-link" href="/player">Mis stats</Link>
          <Link className="t-nav-link" href="/player">Historial</Link>
        </nav>
        <div className="t-right">
          <Link className="t-back-btn" href="/player">← Mi portal</Link>
        </div>
      </div>

      {/* CONTENIDO */}
      <div className="wrap">
        {status === 'loading' && <Spinner />}

        {status === 'nouser' && (
          <StateEmpty
            icon="🎯"
            title="Sin jugador especificado"
            sub="Accede a /user/username para ver un perfil."
          />
        )}

        {status === 'notfound' && (
          <StateEmpty
            icon="🎯"
            title="Usuario no encontrado"
            sub={`@${username} no existe en Novuraxe.`}
          />
        )}

        {status === 'found' && profile && (
          profile.role === 'organizer'
            ? <OrgProfile user={profile} />
            : <PlayerProfile player={profile} />
        )}
      </div>
    </>
  )
}