import React, { useEffect, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'

function IntentBadge({ intention }) {
  if (!intention || intention === 'UNCLEAR') return null
  return (
    <span style={{
      display: 'inline-block', fontSize: 10, fontFamily: 'var(--mono)',
      padding: '2px 8px', borderRadius: 5, marginBottom: 7,
      background: 'var(--accent-sec-dim)', color: 'var(--accent-secondary)',
      border: '1px solid rgba(139,34,82,.2)', letterSpacing: '.02em',
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

// BUG #5 fix: dépend uniquement de has_more (le backend ne retourne pas total_items)
function ShowMoreButton({ msg, onShowMore }) {
  if (!msg.has_more) return null

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
      Voir la suite
      <span style={{
        fontSize: 11, padding: '1px 7px', borderRadius: 10,
        background: 'rgba(43,108,176,.15)', marginLeft: 2,
      }}>
        +{msg.next_offset}
      </span>
    </button>
  )
}

function CopyIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6L9 17l-5-5"/>
    </svg>
  )
}

function StarRating({ messageId, sessionId }) {
  const [hovered, setHovered] = useState(0)
  const [selected, setSelected] = useState(0)
  const [showThanks, setShowThanks] = useState(false)

  if (!messageId) return null

  const handleClick = async (star) => {
    if (selected !== 0) return
    setSelected(star)
    setShowThanks(true)
    setTimeout(() => setShowThanks(false), 2000)
    try {
      await fetch('http://localhost:8000/chat/rate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message_id: messageId,
          rating: star,
        }),
      })
    } catch (e) {
      console.error('Rating error:', e)
    }
  }

  const display = selected !== 0 ? selected : hovered

  return (
    <div style={{ display: 'flex', gap: 2, marginTop: 8, alignItems: 'center' }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleClick(star)}
          onMouseEnter={() => selected === 0 && setHovered(star)}
          onMouseLeave={() => selected === 0 && setHovered(0)}
          style={{
            fontSize: 20,
            lineHeight: 1,
            userSelect: 'none',
            color: star <= display ? '#FFB800' : '#D1D5DB',
            cursor: selected !== 0 ? 'default' : 'pointer',
          }}
        >
          {star <= display ? '★' : '☆'}
        </span>
      ))}
      {showThanks && (
        <span style={{ fontSize: 12, color: 'var(--text-2, #888)', marginLeft: 6 }}>
          Merci !
        </span>
      )}
    </div>
  )
}

// Détecte les options numérotées dans le texte (ex: "1. SARA OMAYR — CHEF_PROJET")
function extractNumberedOptions(text) {
  if (!text) return []
  const lines = text.split('\n')
  const options = []
  
  for (const line of lines) {
    const match = line.match(/^\s*(\d+)\.\s+(.+)$/)
    if (match) {
      options.push({
        number: match[1],
        text: match[2].trim(),
      })
    }
  }
  
  return options.length > 0 ? options : []
}

function ClarificationOptions({ options, onSelectOption }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      marginTop: 12,
    }}>
      {options.map((opt) => (
        <button
          key={opt.number}
          onClick={() => onSelectOption(opt.text)}
          style={{
            padding: '10px 14px',
            borderRadius: 8,
            border: '1px solid var(--accent)',
            background: 'var(--accent-dim)',
            color: 'var(--accent-text)',
            fontSize: 13,
            fontWeight: 500,
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.15s',
            fontFamily: 'var(--font)',
            whiteSpace: 'normal',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'var(--accent)'
            e.currentTarget.style.color = '#fff'
            e.currentTarget.style.boxShadow = '0 2px 8px rgba(43,108,176,.25)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'var(--accent-dim)'
            e.currentTarget.style.color = 'var(--accent-text)'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          <strong>{opt.number}.</strong> {opt.text}
        </button>
      ))}
    </div>
  )
}

function extractClarificationIntro(text) {
  if (!text) return ''
  const lines = text.split('\n')
  const introLines = []

  for (const line of lines) {
    if (/^\s*\d+\.\s+.+$/.test(line)) {
      break
    }
    introLines.push(line)
  }

  return introLines.join('\n').trim()
}

function Message({ msg, onShowMore, onSend }) {
  const isUser = msg.role === 'user'
  const [hovered, setHovered] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(msg.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch { /* clipboard non disponible */ }
  }

  // Détecte les options numérotées si c'est une clarification
  const numberedOptions = msg.clarification_needed ? extractNumberedOptions(msg.content) : []
  const clarificationIntro = numberedOptions.length > 0
    ? extractClarificationIntro(msg.content)
    : msg.content

  const handleSelectOption = (selection) => {
    onSend?.(selection)
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: isUser ? 'flex-end' : 'flex-start',
        marginBottom: 18,
        animation: 'fadeInUp .25s ease forwards',
      }}
    >
      {!isUser && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
          <div style={{
            width: 24, height: 24, borderRadius: 7,
            background: 'linear-gradient(135deg, #2B6CB0, #1a4f8a)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 13, flexShrink: 0,
          }}>🐝</div>
          <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-2)' }}>Beebot</span>
        </div>
      )}

      <div style={{
        maxWidth: '76%',
        position: 'relative',
        background: isUser ? 'var(--accent)' : 'var(--bg-card)',
        border: isUser ? 'none' : '1px solid var(--border)',
        borderRadius: isUser ? '18px 18px 4px 18px' : '4px 18px 18px 18px',
        padding: '11px 16px',
        boxShadow: isUser ? '0 2px 8px rgba(43,108,176,.25)' : 'var(--shadow-xs)',
      }}>
        {!isUser && <IntentBadge intention={msg.intention} />}
        {isUser ? (
          <p style={{
            fontSize: 14, lineHeight: 1.7,
            color: '#ffffff',
            margin: 0, whiteSpace: 'pre-wrap',
          }}>
            {msg.content}
          </p>
        ) : (
          <div className="bot-message-content">
            <ReactMarkdown
              components={{
                p: ({children}) => (
                  <p style={{
                    fontSize: 14, lineHeight: 1.7,
                    color: 'var(--text-1)',
                    margin: '0 0 8px 0',
                  }}>{children}</p>
                ),
                strong: ({children}) => (
                  <strong style={{
                    fontWeight: 600,
                    color: 'var(--text-1)',
                  }}>{children}</strong>
                ),
                ul: ({children}) => (
                  <ul style={{
                    fontSize: 14, lineHeight: 1.7,
                    color: 'var(--text-1)',
                    margin: '4px 0', paddingLeft: 20,
                  }}>{children}</ul>
                ),
                li: ({children}) => (
                  <li style={{ marginBottom: 4 }}>{children}</li>
                ),
                code: ({children}) => (
                  <code style={{
                    background: 'var(--bg-card)',
                    padding: '2px 6px',
                    borderRadius: 4,
                    fontSize: 13,
                    fontFamily: 'monospace',
                  }}>{children}</code>
                ),
                hr: () => (
                  <hr style={{
                    border: 'none',
                    borderTop: '1px solid var(--border)',
                    margin: '8px 0',
                  }} />
                ),
              }}
            >
              {clarificationIntro}
            </ReactMarkdown>
            {/* Afficher les boutons d'options si c'est une clarification */}
            {msg.clarification_needed && numberedOptions.length > 0 && (
              <ClarificationOptions
                options={numberedOptions}
                onSelectOption={handleSelectOption}
              />
            )}
          </div>
        )}
        {!isUser && (
          <StarRating messageId={msg.message_id} sessionId={msg.session_id} />
        )}
        {!isUser && <DebugInfo debug={msg.debug} />}

        {/* Bouton copie — visible au hover uniquement */}
        <button
          onClick={handleCopy}
          title="Copier"
          style={{
            position: 'absolute', top: 8, right: 8,
            width: 26, height: 26, borderRadius: 7,
            background: copied ? 'var(--green-bg)' : 'var(--bg-input)',
            border: `1px solid ${copied ? 'var(--green)' : 'var(--border)'}`,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            opacity: hovered ? 1 : 0,
            transition: 'opacity .15s, background .15s, border-color .15s',
            color: copied ? 'var(--green)' : 'var(--text-3)',
          }}
        >
          {copied ? <CheckIcon /> : <CopyIcon />}
        </button>
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
        background: 'linear-gradient(135deg, #2B6CB0, #1a4f8a)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, flexShrink: 0,
      }}>🐝</div>
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
          background: 'linear-gradient(135deg, #2B6CB0, #1a4f8a)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 26, boxShadow: '0 4px 16px rgba(43,108,176,.3)',
        }}>🐝</div>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-1)', marginBottom: 6 }}>
            Beebot
          </p>
          <p style={{ fontSize: 14, color: '#64748B', margin: 0 }}>
            Votre assistant ERP — posez une question sur vos projets, facturation ou ressources
          </p>
        </div>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 10,
          justifyContent: 'center', maxWidth: 480, marginTop: 4,
        }}>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              onClick={() => onSend?.(s)}
              style={{
                fontSize: 13, padding: '8px 16px', borderRadius: 20,
                background: '#fff', border: '1px solid #E2E8F0',
                color: 'var(--text-2)', cursor: 'pointer',
                fontFamily: 'var(--font)', fontWeight: 500,
                transition: 'all .15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#2B6CB0'
                e.currentTarget.style.color = '#2B6CB0'
                e.currentTarget.style.background = 'linear-gradient(135deg, #EBF5FF, #fff)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(43,108,176,.12)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#E2E8F0'
                e.currentTarget.style.color = 'var(--text-2)'
                e.currentTarget.style.background = '#fff'
                e.currentTarget.style.boxShadow = 'none'
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
      {messages.map((m) => <Message key={m.id} msg={m} onShowMore={onShowMore} onSend={onSend} />)}
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
