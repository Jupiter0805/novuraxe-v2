import Link from 'next/link'

export default function Topbar({ role, navLinks, rightContent, logoStyle = 'dark' }) {
  return (
    <div style={{
      position: 'sticky', top: 0, zIndex: 200,
      height: '72px',
      background: 'rgba(26,20,16,0.92)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(196,135,58,0.15)',
      display: 'flex', alignItems: 'center',
      padding: '0 1.5rem', gap: '1rem',
      boxShadow: '0 1px 20px rgba(0,0,0,0.4)',
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src="/novuraxe-logo.png"
          alt="NOVURAXE"
          style={logoStyle === 'landing'
            ? { height: '56px', filter: 'drop-shadow(0 2px 8px rgba(196,135,58,0.2))' }
            : { height: '30px', filter: 'brightness(0) invert(1)' }
          }
        />
      </Link>

      {role && (
        <>
          <div style={{ width: '1px', height: '22px', background: 'rgba(255,255,255,0.1)' }} />
          <div style={{
            fontSize: '9px', fontWeight: 700, letterSpacing: '1.5px',
            textTransform: 'uppercase', color: 'var(--accent)',
            border: '1px solid rgba(196,135,58,0.3)',
            padding: '3px 10px', borderRadius: '20px'
          }}>{role}</div>
          <div style={{ width: '1px', height: '22px', background: 'rgba(255,255,255,0.1)' }} />
        </>
      )}

      {navLinks && (
        <nav style={{ display: 'flex', gap: '2px' }}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.href} style={{
              fontSize: '12px', fontWeight: 600, color: 'rgba(255,255,255,0.75)',
              textDecoration: 'none', borderRadius: '8px', padding: '6px 12px',
              transition: 'all 0.15s',
            }}>{link.label}</Link>
          ))}
        </nav>
      )}

      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        {rightContent}
      </div>
    </div>
  )
}