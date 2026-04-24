import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login, loginWithToken } = useAuth()
  const [mode, setMode] = useState('credentials')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(username, password)
    } catch {
      setError('Identifiants incorrects ou serveur BeeSpace inaccessible.')
    } finally {
      setLoading(false)
    }
  }

  const handleTokenLogin = (e) => {
    e.preventDefault()
    if (!token.trim()) { setError('Token requis.'); return }
    loginWithToken(token.trim(), { username: 'Utilisateur dev', role: 'DEV' })
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: 'var(--bg)',
      padding: '24px',
    }}>
      {/* Fond décoratif */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0,
        background: 'radial-gradient(ellipse 80% 50% at 50% -10%, rgba(37,99,235,.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      <div style={{
        position: 'relative', zIndex: 1,
        width: '100%', maxWidth: 400,
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-xl)', padding: '40px 36px',
        boxShadow: 'var(--shadow-lg)',
      }}>

        {/* Logo */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 14, background: 'var(--accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 20, fontWeight: 700, color: '#fff', margin: '0 auto 14px',
            boxShadow: '0 4px 16px rgba(37,99,235,.3)',
          }}>B</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: 'var(--text-1)', marginBottom: 4 }}>
            BeeSpace AI
          </h1>
          <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
            Assistant conversationnel ERP — MUNISYS
          </p>
        </div>

        {/* Toggle mode */}
        <div style={{
          display: 'flex', gap: 3, background: 'var(--bg-input)',
          borderRadius: 10, padding: 3, marginBottom: 24,
        }}>
          {['credentials', 'token'].map((m) => (
            <button key={m} onClick={() => { setMode(m); setError('') }} style={{
              flex: 1, padding: '7px 0', borderRadius: 8, border: 'none',
              cursor: 'pointer', fontSize: 12, fontFamily: 'var(--font)',
              fontWeight: 500, transition: 'all .15s',
              background: mode === m ? 'var(--bg-card)' : 'transparent',
              color: mode === m ? 'var(--text-1)' : 'var(--text-3)',
              boxShadow: mode === m ? 'var(--shadow-sm)' : 'none',
            }}>
              {m === 'credentials' ? 'Connexion BeeSpace' : 'Token direct (dev)'}
            </button>
          ))}
        </div>

        {/* Formulaire */}
        {mode === 'credentials' ? (
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field label="Identifiant BeeSpace" value={username} onChange={setUsername} placeholder="nom.prenom" />
            <Field label="Mot de passe" value={password} onChange={setPassword} type="password" placeholder="••••••••" />
            {error && <ErrorMsg text={error} />}
            <SubmitBtn loading={loading} label="Se connecter" />
          </form>
        ) : (
          <form onSubmit={handleTokenLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <Field
              label="JWT Bearer Token"
              value={token} onChange={setToken}
              placeholder="eyJhbGciOiJIUzI1NiJ9..."
              mono
            />
            <p style={{ fontSize: 11, color: 'var(--text-3)', margin: '-4px 0 0', lineHeight: 1.6 }}>
              Récupère le token depuis Postman après authentification BeeSpace.
            </p>
            {error && <ErrorMsg text={error} />}
            <SubmitBtn loading={false} label="Utiliser ce token" />
          </form>
        )}
      </div>
    </div>
  )
}

function Field({ label, value, onChange, type = 'text', placeholder, mono = false }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, color: 'var(--text-2)', fontWeight: 500 }}>
        {label}
      </label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} required
        style={{
          background: 'var(--bg-input)', border: '1px solid var(--border)',
          borderRadius: 9, padding: '10px 13px', color: 'var(--text-1)',
          fontSize: mono ? 12 : 13, fontFamily: mono ? 'var(--mono)' : 'var(--font)',
          outline: 'none', transition: 'border-color .15s, box-shadow .15s',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = 'var(--accent)'
          e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,.1)'
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'var(--border)'
          e.target.style.boxShadow = 'none'
        }}
      />
    </div>
  )
}

function ErrorMsg({ text }) {
  return (
    <div style={{
      fontSize: 12, color: 'var(--red)', padding: '8px 12px',
      background: '#fff5f5', border: '1px solid rgba(220,38,38,.15)',
      borderRadius: 8, lineHeight: 1.5,
    }}>
      {text}
    </div>
  )
}

function SubmitBtn({ loading, label }) {
  return (
    <button type="submit" disabled={loading} style={{
      marginTop: 6, padding: '11px 0', borderRadius: 9, border: 'none',
      background: loading ? 'var(--accent-dim)' : 'var(--accent)',
      color: loading ? 'var(--accent)' : '#fff',
      fontSize: 14, fontWeight: 600, fontFamily: 'var(--font)',
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'background .15s, box-shadow .15s',
      boxShadow: loading ? 'none' : '0 2px 8px rgba(37,99,235,.3)',
    }}>
      {loading ? 'Connexion...' : label}
    </button>
  )
}
