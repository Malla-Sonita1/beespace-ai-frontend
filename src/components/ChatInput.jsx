import { useState, useRef } from 'react'

export default function ChatInput({ onSend, loading }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  const handleSend = () => {
    const trimmed = value.trim()
    if (!trimmed || loading) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const canSend = value.trim() && !loading

  return (
    <div style={{
      padding: '12px 24px 18px',
      borderTop: '1px solid var(--border)',
      background: 'var(--bg-card)',
    }}>
      <div style={{
        display: 'flex', gap: 10, alignItems: 'flex-end',
        background: 'var(--bg-input)', border: '1px solid var(--border)',
        borderRadius: 14, padding: '10px 12px 10px 16px',
        transition: 'border-color .15s, box-shadow .15s',
        boxShadow: 'var(--shadow-xs)',
      }}
        onClick={() => textareaRef.current?.focus()}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Posez votre question à Beebot..."
          rows={1}
          style={{
            flex: 1, background: 'transparent', border: 'none',
            outline: 'none', resize: 'none',
            color: 'var(--text-1)', fontSize: 14,
            fontFamily: 'var(--font)', lineHeight: 1.6,
            maxHeight: 120, overflowY: 'auto',
          }}
          onInput={(e) => {
            e.target.style.height = 'auto'
            e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px'
          }}
          onFocus={(e) => {
            e.target.closest('div').style.borderColor = 'var(--accent)'
            e.target.closest('div').style.boxShadow = '0 0 0 3px rgba(43,108,176,.1)'
          }}
          onBlur={(e) => {
            e.target.closest('div').style.borderColor = 'var(--border)'
            e.target.closest('div').style.boxShadow = 'var(--shadow-xs)'
          }}
        />
        <button
          onClick={handleSend}
          disabled={!canSend}
          style={{
            width: 36, height: 36, borderRadius: 10, border: 'none',
            background: canSend
              ? 'linear-gradient(135deg, #2B6CB0, #1a4f8a)'
              : 'var(--bg-hover)',
            cursor: canSend ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'background .15s, transform .1s, box-shadow .15s',
            boxShadow: canSend ? '0 2px 8px rgba(43,108,176,.35)' : 'none',
          }}
          onMouseEnter={(e) => {
            if (canSend) {
              e.currentTarget.style.transform = 'scale(1.07)'
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(43,108,176,.45)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)'
            if (canSend) e.currentTarget.style.boxShadow = '0 2px 8px rgba(43,108,176,.35)'
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
            <path d="M22 2L11 13" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <p style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 7, textAlign: 'center' }}>
        Entrée pour envoyer · Maj+Entrée pour un saut de ligne
      </p>
    </div>
  )
}
