import { useState, useCallback, useEffect } from 'react'
import Header from '../components/Header'
import MessageList from '../components/MessageList'
import ChatInput from '../components/ChatInput'
import SessionSidebar from '../components/SessionSidebar'
import { sendMessage, getSessions, getSessionMessages } from '../services/api'

function timestamp(ts) {
  if (ts) {
    // Format SQLite "2026-04-23 15:25:00" → "15:25"
    const match = ts.match(/(\d{2}:\d{2})/)
    return match ? match[1] : ts
  }
  return new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

let msgId = 0
const newId = () => ++msgId

export default function ChatPage() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const [sessions, setSessions] = useState([])
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Charge la liste des sessions au montage et après chaque message
  const loadSessions = useCallback(async () => {
    try {
      const data = await getSessions()
      setSessions(data)
    } catch {
      // silencieux si non connecté ou serveur indispo
    }
  }, [])

  useEffect(() => { loadSessions() }, [loadSessions])

  // Charge les messages d'une session existante
  const handleSelectSession = useCallback(async (sid) => {
    if (sid === sessionId) return
    try {
      const raw = await getSessionMessages(sid)
      const loaded = raw.map((m) => ({
        id: newId(),
        role: m.role,
        content: m.content,
        intention: m.intention,
        time: timestamp(m.time),
        has_more: false,
        next_offset: 0,
        total_items: 0,
      }))
      setMessages(loaded)
      setSessionId(sid)
    } catch {
      // session inaccessible
    }
  }, [sessionId])

  const handleNewChat = useCallback(() => {
    setMessages([])
    setSessionId(null)
  }, [])

  const appendAssistantMsg = (data) => {
    // BUG #3 fix: mapper duration_ms → debug avec les noms attendus par DebugInfo
    const dm = data.duration_ms || {}
    const msg = {
      id: newId(),
      role: 'assistant',
      content: data.answer,
      intention: data.intention,
      clarification_needed: data.clarification_needed,
      debug: {
        cached:       data.cached || false,
        nlu_ms:       dm.nlu,
        api_ms:       dm.api,
        analyzer_ms:  dm.analyzer,
        gen_ms:       dm.generator,
        total_ms:     dm.total,
      },
      time: timestamp(),
      has_more:    data.has_more || false,
      message_id: data.message_id || null,
      session_id: data.session_id || sessionId,
      next_offset: data.next_offset || 0,
    }
    setMessages((prev) => [...prev, msg])
    return msg
  }

  const handleSend = useCallback(async (text) => {
    const userMsg = { id: newId(), role: 'user', content: text, time: timestamp() }
    setMessages((prev) => [...prev, userMsg])
    setLoading(true)

    const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }))

    try {
      const data = await sendMessage(text, history, 0, sessionId)
      if (data.session_id && !sessionId) setSessionId(data.session_id)
      appendAssistantMsg(data)
      // Rafraîchit le sidebar (en arrière-plan, pas d'await)
      loadSessions()
    } catch (err) {
      setMessages((prev) => [...prev, {
        id: newId(), role: 'assistant', time: timestamp(),
        content: err.response?.data?.detail ||
          'Erreur de connexion au backend. Vérifiez que le serveur FastAPI est démarré sur le port 8000.',
      }])
    } finally {
      setLoading(false)
    }
  }, [messages, sessionId, loadSessions])

  const handleShowMore = useCallback(async (nextOffset) => {
    let lastUserMsg = null
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role === 'user') {
        const prevMsg = i > 0 ? messages[i - 1] : null
        if (prevMsg && prevMsg.role === 'assistant' && prevMsg.clarification_needed) {
          continue
        }
        lastUserMsg = messages[i]
        break
      }
    }
    if (!lastUserMsg) return

    setLoading(true)
    const history = messages.slice(-6).map((m) => ({ role: m.role, content: m.content }))

    try {
      const data = await sendMessage(lastUserMsg.content, history, nextOffset, sessionId)
      appendAssistantMsg(data)
    } catch (err) {
      setMessages((prev) => [...prev, {
        id: newId(), role: 'assistant', time: timestamp(),
        content: 'Erreur lors du chargement des éléments suivants.',
      }])
    } finally {
      setLoading(false)
    }
  }, [messages, sessionId])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <SessionSidebar
          sessions={sessions}
          currentSessionId={sessionId}
          onNewChat={handleNewChat}
          onSelectSession={handleSelectSession}
          onSessionsChange={setSessions}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((o) => !o)}
        />

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          {messages.length > 0 && (
            <div style={{
              padding: '6px 24px', borderBottom: '1px solid var(--border)',
              display: 'flex', justifyContent: 'flex-end',
              background: 'var(--bg-card)',
            }}>
              <button onClick={handleNewChat} style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                fontSize: 12, color: 'var(--text-3)', fontFamily: 'var(--font)',
                transition: 'color .15s',
              }}
                onMouseEnter={(e) => e.target.style.color = 'var(--text-2)'}
                onMouseLeave={(e) => e.target.style.color = 'var(--text-3)'}
              >
                Nouvelle conversation
              </button>
            </div>
          )}

          <MessageList
            messages={messages}
            loading={loading}
            onSend={handleSend}
            onShowMore={handleShowMore}
          />
          <ChatInput onSend={handleSend} loading={loading} />
        </div>
      </div>
    </div>
  )
}
