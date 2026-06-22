/**
 * Migré Ant Design 4.15.6 — BeeSpace UI
 * Page principale du chat : sidebar, messages, saisie.
 */
import { useState, useCallback, useEffect } from 'react'
import { Button } from 'antd'
import Header from '../components/layout/Header'
import MessageList from '../components/chat/MessageList'
import ChatInput from '../components/chat/ChatInput'
import SessionSidebar from '../components/layout/SessionSidebar'
import { sendMessage, getSessions, getSessionMessages } from '../services/api'
import './ChatPage.css'

function timestamp(ts) {
  if (ts) {
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

  const loadSessions = useCallback(async () => {
    try {
      const data = await getSessions()
      setSessions(data)
    } catch {
      /* silencieux si non connecté ou serveur indispo */
    }
  }, [])

  useEffect(() => { loadSessions() }, [loadSessions])

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
      /* session inaccessible */
    }
  }, [sessionId])

  const handleNewChat = useCallback(() => {
    setMessages([])
    setSessionId(null)
  }, [])

  const appendAssistantMsg = (data) => {
    const dm = data.duration_ms || {}
    const msg = {
      id: newId(),
      role: 'assistant',
      content: data.answer,
      intention: data.intention,
      clarification_needed: data.clarification_needed,
      debug: {
        cached: data.cached || false,
        nlu_ms: dm.nlu,
        api_ms: dm.api,
        analyzer_ms: dm.analyzer,
        gen_ms: dm.generator,
        total_ms: dm.total,
      },
      time: timestamp(),
      has_more: data.has_more || false,
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
    } catch {
      setMessages((prev) => [...prev, {
        id: newId(), role: 'assistant', time: timestamp(),
        content: 'Erreur lors du chargement des éléments suivants.',
      }])
    } finally {
      setLoading(false)
    }
  }, [messages, sessionId])

  return (
    <div className="chat-page">
      <Header />

      <div className="chat-page__body">
        <SessionSidebar
          sessions={sessions}
          currentSessionId={sessionId}
          onNewChat={handleNewChat}
          onSelectSession={handleSelectSession}
          onSessionsChange={setSessions}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen((o) => !o)}
        />

        <div className="chat-page__main">
          {messages.length > 0 && (
            <div className="chat-page__toolbar">
              <Button
                type="link"
                className="chat-page__new-chat"
                onClick={handleNewChat}
              >
                Nouvelle conversation
              </Button>
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
