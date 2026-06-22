/**
 * Migré Ant Design 4.15.6 — BeeSpace UI
 * Liste scrollable des messages + état vide avec suggestions.
 */
import { useCallback, useEffect, useRef, useState } from 'react'
import { Button, Typography } from 'antd'
import Message from './Message'
import TypingIndicator from './TypingIndicator'
import ScrollToBottomButton from './ScrollToBottomButton'
import './MessageList.css'

const { Title, Paragraph } = Typography

const SUGGESTIONS = [
  'Quels sont mes projets ouverts ?',
  'Dashboard de facturation',
  'Projets du client Maroc Telecom',
  'Quels projets sont en retard ?',
  'Intervenants sur mon projet',
]

/** Distance minimale au bas (px) avant d'afficher le bouton. */
const SCROLL_BOTTOM_THRESHOLD = 300

export default function MessageList({ messages, loading, onSend, onShowMore }) {
  const listRef = useRef(null)
  const bottomRef = useRef(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

  const updateScrollButtonVisibility = useCallback(() => {
    const el = listRef.current
    if (!el) return
    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight
    setShowScrollButton(distanceFromBottom > SCROLL_BOTTOM_THRESHOLD)
  }, [])

  const scrollToBottom = useCallback((behavior = 'smooth') => {
    bottomRef.current?.scrollIntoView({ behavior })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading, scrollToBottom])

  useEffect(() => {
    const el = listRef.current
    if (!el) return undefined

    updateScrollButtonVisibility()
    el.addEventListener('scroll', updateScrollButtonVisibility, { passive: true })
    window.addEventListener('resize', updateScrollButtonVisibility)

    return () => {
      el.removeEventListener('scroll', updateScrollButtonVisibility)
      window.removeEventListener('resize', updateScrollButtonVisibility)
    }
  }, [messages.length, loading, updateScrollButtonVisibility])

  if (messages.length === 0 && !loading) {
    return (
      <div className="message-list-empty" role="region" aria-label="Accueil Beebot">
        <div className="message-list-empty__avatar" aria-hidden>🐝</div>
        <div className="message-list-empty__intro">
          <Title level={4} className="message-list-empty__title">
            Beebot
          </Title>
          <Paragraph className="message-list-empty__subtitle">
            Votre assistant ERP — posez une question sur vos projets, facturation ou ressources
          </Paragraph>
        </div>
        <div className="message-list-empty__suggestions">
          {SUGGESTIONS.map((s) => (
            <Button
              key={s}
              className="suggestion-chip"
              onClick={() => onSend?.(s)}
            >
              {s}
            </Button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="message-list-wrapper">
      <div
        ref={listRef}
        className="message-list"
        role="log"
        aria-live="polite"
        aria-relevant="additions"
      >
        {messages.map((m) => (
          <Message key={m.id} msg={m} onShowMore={onShowMore} onSend={onSend} />
        ))}
        {loading && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      <ScrollToBottomButton
        visible={showScrollButton}
        onClick={() => scrollToBottom('smooth')}
      />
    </div>
  )
}
