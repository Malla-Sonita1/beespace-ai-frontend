import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()
  const initials = user?.prenom && user?.nom
    ? `${user.prenom[0]}${user.nom[0]}`.toUpperCase()
    : (user?.username || 'U')[0].toUpperCase()

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', height: 58,
      borderBottom: '1px solid transparent',
      borderImage: 'linear-gradient(90deg, var(--accent) 0%, var(--border) 40%) 1',
      background: 'var(--bg-card)',
      boxShadow: 'var(--shadow-xs)',
      flexShrink: 0, zIndex: 10,
    }}>

      {/* Logo group — Beebot + séparateur + MUNISYS */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 9,
          background: 'linear-gradient(135deg, #2B6CB0, #1a4f8a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 16, boxShadow: '0 2px 6px rgba(43,108,176,.3)',
        }}>🐝</div>
        <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-1)' }}>
          Beebot
        </span>
        <span style={{
          fontSize: 10, padding: '2px 8px', borderRadius: 12,
          background: '#E8F4FD', color: '#2B6CB0',
          fontFamily: 'var(--mono)', fontWeight: 500,
        }}>beta</span>

        {/* Séparateur vertical */}
        <span style={{
          color: '#CBD5E1', fontSize: 16, fontWeight: 300,
          marginLeft: 4, marginRight: 4, userSelect: 'none',
        }}>|</span>

        {/* MUNISYS */}
        <span style={{
          fontSize: 16, fontWeight: 700, color: '#1E3A5F',
          letterSpacing: '.02em',
        }}>
          MUNISYS
        </span>
      </div>

      {/* User + déconnexion */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, #2B6CB0, #1a4f8a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 600, color: '#fff',
          boxShadow: '0 2px 6px rgba(43,108,176,.3)',
        }}>
          {initials}
        </div>
        <span style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>
          {user?.prenom ? `${user.prenom} ${user.nom}` : user?.username || 'Utilisateur'}
        </span>
        <button
          onClick={logout}
          style={{
            background: 'transparent', border: 'none',
            padding: '5px 0', cursor: 'pointer',
            fontSize: 12, color: '#94A3B8', fontFamily: 'var(--font)',
            fontWeight: 400, transition: 'color .15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#64748B' }}
          onMouseLeave={(e) => { e.currentTarget.style.color = '#94A3B8' }}
        >
          Déconnexion
        </button>
      </div>
    </div>
  )
}
