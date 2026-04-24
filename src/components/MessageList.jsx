import { useEffect, useRef } from 'react'

function IntentBadge({ intention }) {
  if (!intention || intention === 'UNCLEAR') return null
  return (
    <span style={{
      display: 'inline-block', fontSize: 10, fontFamily: 'var(--mono)',
      padding: '2px 8px', borderRadius: 5, marginBottom: 7,
      background: 'var(--accent-dim)', color: 'var(--accent-text)',
      border: '1px solid rgba(37,99,235,.2)', letterSpacing: '.02em',
    }}>
      {intention}
    </span>
  )
}

function fmt(ms) {
  if (ms == null) return null
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`
}

function DebugInfo({ debug }) {
  if (!debug) return null
  return (
    <div style={{
      marginTop: 8, padding: '6px 10px', borderRadius: 7,
      background: 'var(--bg-input)', border: '1px solid var(--border)',
      fontSize: 10, fontFamily: 'var(--mono)', color: 'var(--text-3)',
      display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center',
    }}>
      {debug.cached && (
        <span style={{ color: 'var(--green)', fontWeight: 600 }}>⚡ cached</span>
      )}
      {debug.nlu_ms   != null && <span>NLU {fmt(debug.nlu_ms)}</span>}
      {debug.api_ms   != null && <span>API {fmt(debug.api_ms)}</span>}
      {debug.analyzer_ms != null && <span>ANA {fmt(debug.analyzer_ms)}</span>}
      {debug.gen_ms   != null && <span>GEN {fmt(debug.gen_ms)}</span>}
      {debug.total_ms != null && (
        <span style={{ color: 'var(--accent)', fontWeight: 500 }}>
          TOTAL {fmt(debug.total_ms)}
        </span>
      )}
    </div>
  )
}

function ShowMoreButton({ msg, onShowMore }) {
  if (!msg.total_items) return null

  // Liste complète affichée → badge de complétion
  if (!msg.has_more) {
    return (
      <div style={{
        marginTop: 6, display: 'flex', alignItems: 'center', gap: 5,
        fontSize: 11, color: 'var(--text-3)',
      }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 6L9 17l-5-5"/>
        </svg>
        <span style={{ color: 'var(--green)', fontWeight: 600 }}>{msg.total_items}/{msg.total_items}</span>
        <span>résultats affichés</span>
      </div>
    )
  }

  // Il reste des éléments → bouton "Voir les suivants"
  const remaining = msg.total_items - msg.next_offset
  return (
    <button
      onClick={() => onShowMore(msg.next_offset)}
      style={{
        marginTop: 8,
        display: 'flex', alignItems: 'center', gap: 7,
        padding: '8px 16px', borderRadius: 20,
        border: '1px solid var(--accent)',
        background: 'var(--accent-dim)',
        color: 'var(--accent-text)',
        fontSize: 13, fontWeight: 500,
        fontFamily: 'var(--font)', cursor: 'pointer',
        transition: 'all .15s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'var(--accent)'
        e.currentTarget.style.color = '#fff'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'var(--accent-dim)'
        e.currentTarget.style.color = 'var(--accent-text)'
      }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 5v14M5 12l7 7 7-7"/>
      </svg>
      Voir les {remaining} suivant{remaining > 1 ? 's' : ''}
      <span style={{
        fontSize: 11, padding: '1px 7px', borderRadius: 10,
        background: 'rgba(37,99,235,.15)', marginLeft: 2,
      }}>
        {msg.next_offset}/{msg.total_items}
      </span>
    </button>
  )
}

function Message({ msg, onShowMore }) {
  const isUser = msg.role === 'user'
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 18,
    }}>
      {!isUser && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 7,
            background: 'var(--accent)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
          }}>B</div>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)' }}>BeeSpace AI</span>
        </div>
      )}
      <div style={{
        maxWidth: '76%',
        background: isUser ? 'var(--accent)' : 'var(--bg-card)',
        border: isUser ? 'none' : '1px solid var(--border)',
        borderRadius: isUser ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
        padding: '11px 16px',
        boxShadow: isUser ? '0 2px 8px rgba(37,99,235,.25)' : 'var(--shadow-xs)',
      }}>
        {!isUser && <IntentBadge intention={msg.intention} />}
        <p style={{
          fontSize: 14, lineHeight: 1.7,
          color: isUser ? '#ffffff' : 'var(--text-1)',
          margin: 0, whiteSpace: 'pre-wrap',
        }}>
          {msg.content}
        </p>
        {!isUser && <DebugInfo debug={msg.debug} />}
      </div>
      {!isUser && <ShowMoreButton msg={msg} onShowMore={onShowMore} />}
      <span style={{
        fontSize: 11, color: 'var(--text-3)',
        marginTop: 4, paddingInline: 6,
      }}>
        {msg.time}
      </span>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 7, marginBottom: 18 }}>
      <div style={{
        width: 24, height: 24, borderRadius: 7,
        background: 'var(--accent)', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        fontSize: 11, fontWeight: 700, color: '#fff', flexShrink: 0,
      }}>B</div>
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: '4px 18px 18px 18px', padding: '14px 18px',
        display: 'flex', gap: 5, alignItems: 'center',
        boxShadow: 'var(--shadow-xs)',
      }}>
        {[0, 1, 2].map((i) => (
          <span key={i} style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--border-mid)', display: 'inline-block',
            animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite`,
          }} />
        ))}
      </div>
      <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-5px)}}`}</style>
    </div>
  )
}

export default function MessageList({ messages, loading, onSend, onShowMore }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  if (messages.length === 0 && !loading) {
    return (
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', gap: 16,
        padding: '0 24px',
      }}>
        <div style={{
          width: 52, height: 52, borderRadius: 15,
          background: 'var(--accent)', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          fontSize: 22, fontWeight: 700, color: '#fff',
          boxShadow: '0 4px 16px rgba(37,99,235,.3)',
        }}>B</div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-1)', marginBottom: 6 }}>
            BeeSpace AI
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-2)' }}>
            Posez une question sur vos projets, facturation ou ressources
          </p>
        </div>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 8,
          justifyContent: 'center', maxWidth: 480, marginTop: 4,
        }}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSend?.(s)}
              style={{
                fontSize: 12, padding: '7px 14px', borderRadius: 20,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                color: 'var(--text-2)', cursor: 'pointer',
                fontFamily: 'var(--font)', fontWeight: 500,
                transition: 'all .15s', boxShadow: 'var(--shadow-xs)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent)'
                e.currentTarget.style.color = 'var(--accent)'
                e.currentTarget.style.background = 'var(--accent-dim)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-2)'
                e.currentTarget.style.background = 'var(--bg-card)'
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px' }}>
      {messages.map((m) => <Message key={m.id} msg={m} onShowMore={onShowMore} />)}
      {loading && <TypingIndicator />}
      <div ref={bottomRef} />
    </div>
  )
}

const SUGGESTIONS = [
  'Quels sont mes projets ouverts ?',
  'Dashboard de facturation',
  'Projets du client Maroc Telecom',
  'Quels projets sont en retard ?',
  'Intervenants sur mon projet',
]
