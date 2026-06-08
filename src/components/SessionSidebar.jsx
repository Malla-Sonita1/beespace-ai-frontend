import { useState, useRef, useEffect } from 'react'
import { renameSession, deleteSession } from '../services/api'

function formatDate(ts) {
  if (!ts) return ''
  const date = new Date(ts.replace(' ', 'T'))
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  if (isToday) return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

function truncate(text, max = 34) {
  if (!text) return 'Conversation'
  return text.length > max ? text.slice(0, max) + '…' : text
}

function IconPlus() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14"/>
    </svg>
  )
}
function IconChevronLeft() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6"/>
    </svg>
  )
}
function IconChevronRight() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18l6-6-6-6"/>
    </svg>
  )
}
function IconDots() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
    </svg>
  )
}

function SessionItem({ s, isActive, onSelect, onRenamed, onDeleted }) {
  const [hovered, setHovered] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(s.title)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const inputRef = useRef(null)
  const menuRef = useRef(null)

  useEffect(() => {
    if (!menuOpen) return
    function handler(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
        setConfirmDelete(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [menuOpen])

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const handleRenameClick = () => {
    setMenuOpen(false)
    setEditValue(s.title)
    setEditing(true)
  }

  const handleRenameOk = async () => {
    const val = editValue.trim()
    if (val && val !== s.title) {
      try {
        await renameSession(s.session_id, val)
        onRenamed(s.session_id, val)
      } catch { /* silencieux */ }
    }
    setEditing(false)
  }

  const handleRenameCancel = () => {
    setEditing(false)
    setEditValue(s.title)
  }

  const handleDeleteClick = () => {
    setConfirmDelete(true)
  }

  const handleDeleteConfirm = async () => {
    setMenuOpen(false)
    setConfirmDelete(false)
    try {
      await deleteSession(s.session_id)
      onDeleted(s.session_id)
    } catch { /* silencieux */ }
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: 'relative', marginBottom: 2 }}
    >
      <button
        onClick={() => !editing && onSelect(s.session_id)}
        style={{
          width: '100%', textAlign: 'left',
          display: 'flex', flexDirection: 'column', gap: 3,
          padding: editing ? '6px 10px' : isActive ? '8px 30px 8px 13px' : '8px 30px 8px 13px',
          borderRadius: 8, border: 'none',
          borderLeft: isActive || hovered ? '3px solid #2B6CB0' : '3px solid transparent',
          cursor: editing ? 'default' : 'pointer', fontFamily: 'var(--font)',
          background: isActive
            ? '#EBF5FF'
            : hovered ? '#F1F5F9' : 'transparent',
          transition: 'background .12s, border-color .12s',
        }}
      >
        {editing ? (
          <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            <input
              ref={inputRef}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleRenameOk()
                if (e.key === 'Escape') handleRenameCancel()
              }}
              style={{
                width: '100%', fontSize: 12, fontFamily: 'var(--font)',
                border: '1px solid var(--accent)', borderRadius: 5,
                padding: '3px 7px', outline: 'none',
                background: 'var(--bg-card)', color: 'var(--text-1)',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: 5 }}>
              <ActionBtn label="OK" onClick={handleRenameOk} primary />
              <ActionBtn label="Annuler" onClick={handleRenameCancel} />
            </div>
          </div>
        ) : (
          <span style={{
            fontSize: 12, fontWeight: isActive ? 600 : 400,
            color: isActive ? 'var(--accent)' : 'var(--text-1)',
            lineHeight: 1.4, display: 'block',
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>
            {truncate(s.title)}
          </span>
        )}
        <span style={{ fontSize: 10, color: 'var(--text-3)' }}>
          {formatDate(s.updated_at)}
          {s.msg_count > 0 && ` · ${Math.floor(s.msg_count / 2)} échange${s.msg_count > 2 ? 's' : ''}`}
        </span>
      </button>

      {/* Bouton trois points — visible au hover ou quand le menu est ouvert */}
      {(hovered || menuOpen) && !editing && (
        <button
          onClick={(e) => { e.stopPropagation(); setMenuOpen((o) => !o) }}
          style={{
            position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)',
            width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: 'none', borderRadius: 5, cursor: 'pointer',
            background: menuOpen ? 'var(--border)' : 'transparent',
            color: 'var(--text-3)', transition: 'background .12s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--border)' }}
          onMouseLeave={(e) => { if (!menuOpen) e.currentTarget.style.background = 'transparent' }}
        >
          <IconDots />
        </button>
      )}

      {/* Menu dropdown */}
      {menuOpen && (
        <div
          ref={menuRef}
          style={{
            position: 'absolute', right: 6, top: 'calc(50% + 14px)', zIndex: 100,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            borderRadius: 8, boxShadow: 'var(--shadow)',
            minWidth: 160, overflow: 'hidden',
          }}
        >
          {confirmDelete ? (
            <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <p style={{ fontSize: 12, color: 'var(--text-1)', margin: 0, lineHeight: 1.4 }}>
                Supprimer cette conversation ?
              </p>
              <div style={{ display: 'flex', gap: 6 }}>
                <ActionBtn label="Supprimer" onClick={handleDeleteConfirm} danger />
                <ActionBtn label="Annuler" onClick={() => setConfirmDelete(false)} />
              </div>
            </div>
          ) : (
            <>
              <MenuItem label="Renommer" onClick={handleRenameClick} />
              <MenuItem label="Supprimer" onClick={handleDeleteClick} danger />
            </>
          )}
        </div>
      )}
    </div>
  )
}

function ActionBtn({ label, onClick, primary = false, danger = false }) {
  return (
    <button
      onClick={onClick}
      style={{
        flex: 1, padding: '4px 8px', borderRadius: 5, border: 'none',
        cursor: 'pointer', fontSize: 11, fontWeight: 500,
        fontFamily: 'var(--font)', transition: 'opacity .12s',
        background: danger ? 'var(--red)' : primary ? 'var(--accent)' : 'var(--bg-input)',
        color: (primary || danger) ? '#fff' : 'var(--text-2)',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.opacity = '.85' }}
      onMouseLeave={(e) => { e.currentTarget.style.opacity = '1' }}
    >
      {label}
    </button>
  )
}

function MenuItem({ label, onClick, danger = false }) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '100%', textAlign: 'left', display: 'block',
        padding: '8px 14px', border: 'none', cursor: 'pointer',
        fontSize: 12, fontFamily: 'var(--font)', fontWeight: 500,
        background: hovered ? (danger ? '#fff5f5' : 'var(--bg)') : 'transparent',
        color: danger ? 'var(--red)' : 'var(--text-1)',
        transition: 'background .1s',
      }}
    >
      {label}
    </button>
  )
}

export default function SessionSidebar({ sessions, currentSessionId, onNewChat, onSelectSession, onSessionsChange, isOpen, onToggle }) {
  const handleRenamed = (sid, newTitle) => {
    onSessionsChange(sessions.map((s) => s.session_id === sid ? { ...s, title: newTitle } : s))
  }

  const handleDeleted = (sid) => {
    onSessionsChange(sessions.filter((s) => s.session_id !== sid))
    if (sid === currentSessionId) onNewChat()
  }

  return (
    <div style={{
      width: isOpen ? 228 : 44,
      flexShrink: 0,
      display: 'flex', flexDirection: 'column',
      background: 'var(--bg)', borderRight: '1px solid var(--border)',
      overflow: 'hidden', transition: 'width .2s ease',
    }}>
      {/* Barre supérieure */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 8px 8px', flexShrink: 0 }}>
        <button
          onClick={onToggle}
          title={isOpen ? 'Fermer' : 'Ouvrir'}
          style={{
            flexShrink: 0, width: 28, height: 28,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--border)', borderRadius: 7,
            background: 'transparent', cursor: 'pointer',
            color: 'var(--text-3)', transition: 'all .15s',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-card)'; e.currentTarget.style.color = 'var(--text-1)' }}
          onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-3)' }}
        >
          {isOpen ? <IconChevronLeft /> : <IconChevronRight />}
        </button>

        {isOpen && (
          <button
            onClick={onNewChat}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              padding: '10px 16px', borderRadius: 10,
              border: 'none',
              background: 'linear-gradient(135deg, #2B6CB0, #1a4f8a)',
              cursor: 'pointer',
              fontSize: 12, fontWeight: 600, color: '#fff',
              fontFamily: 'var(--font)', transition: 'opacity .15s, box-shadow .15s',
              whiteSpace: 'nowrap',
              boxShadow: '0 2px 6px rgba(43,108,176,.25)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.opacity = '.92'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(43,108,176,.35)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.opacity = '1'
              e.currentTarget.style.boxShadow = '0 2px 6px rgba(43,108,176,.25)'
            }}
          >
            <IconPlus /> Nouveau chat
          </button>
        )}
      </div>

      {isOpen && (
        <>
          {sessions.length > 0 && (
            <div style={{
              fontSize: 11, fontWeight: 600, color: '#94A3B8',
              letterSpacing: '1px', textTransform: 'uppercase',
              margin: '16px 0 8px 16px',
            }}>
              Historique
            </div>
          )}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 6px 12px' }}>
            {sessions.length === 0 && (
              <p style={{ fontSize: 12, color: 'var(--text-3)', textAlign: 'center', marginTop: 24, padding: '0 12px' }}>
                Aucune conversation
              </p>
            )}
            {sessions.map((s) => (
              <SessionItem
                key={s.session_id}
                s={s}
                isActive={s.session_id === currentSessionId}
                onSelect={onSelectSession}
                onRenamed={handleRenamed}
                onDeleted={handleDeleted}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}
