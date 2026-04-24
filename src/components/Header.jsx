import { useAuth } from '../context/AuthContext'

export default function Header() {
  const { user, logout } = useAuth()
  const initials = user?.prenom && user?.nom
    ? `${user.prenom[0]}${user.nom[0]}`.toUpperCase()
    : (user?.username || 'U')[0].toUpperCase()

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', height: 56,
      borderBottom: '1px solid var(--border)',
      background: 'var(--bg-card)',
      boxShadow: 'var(--shadow-xs)',
      flexShrink: 0, zIndex: 10,
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 9,
          background: 'var(--accent)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: 13, fontWeight: 700, color: '#fff',
          boxShadow: '0 2px 6px rgba(37,99,235,.3)',
        }}>B</div>
        <span style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-1)' }}>
          BeeSpace AI
        </span>
        <span style={{
          fontSize: 10, padding: '2px 7px', borderRadius: 5,
          background: 'var(--accent-dim)', color: 'var(--accent-text)',
          border: '1px solid rgba(37,99,235,.2)',
          fontFamily: 'var(--mono)', fontWeight: 500,
        }}>POC</span>
      </div>

      {/* User */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'var(--accent-dim)', border: '1px solid rgba(37,99,235,.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 12, fontWeight: 600, color: 'var(--accent)',
        }}>
          {initials}
        </div>
        <span style={{ fontSize: 13, color: 'var(--text-2)', fontWeight: 500 }}>
          {user?.prenom ? `${user.prenom} ${user.nom}` : user?.username || 'Utilisateur'}
        </span>
        <button
          onClick={logout}
          style={{
            background: 'transparent', border: '1px solid var(--border)',
            borderRadius: 8, padding: '5px 12px', cursor: 'pointer',
            fontSize: 12, color: 'var(--text-2)', fontFamily: 'var(--font)',
            fontWeight: 500, transition: 'all .15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = 'var(--red)'
            e.currentTarget.style.borderColor = 'var(--red)'
            e.currentTarget.style.background = '#fff5f5'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'var(--text-2)'
            e.currentTarget.style.borderColor = 'var(--border)'
            e.currentTarget.style.background = 'transparent'
          }}
        >
          Déconnexion
        </button>
      </div>
    </div>
  )
}
