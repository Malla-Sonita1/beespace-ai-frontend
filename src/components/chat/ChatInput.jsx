/**
 * Migré Ant Design 4.15.6 — BeeSpace UI
 * Zone de saisie — Input.TextArea + Button, Enter / Shift+Enter.
 */
import { useCallback, useRef, useState } from 'react'
import { Input, Button, Typography } from 'antd'
import './ChatInput.css'

const { TextArea } = Input
const { Text } = Typography

const MAX_HEIGHT = 120

function SendIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M22 2L11 13"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default function ChatInput({ onSend, loading }) {
  const [value, setValue] = useState('')
  const textareaRef = useRef(null)

  const getNativeTextarea = () =>
    textareaRef.current?.resizableTextArea?.textArea ?? textareaRef.current

  const adjustHeight = useCallback(() => {
    const el = getNativeTextarea()
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, MAX_HEIGHT)}px`
  }, [])

  const resetHeight = useCallback(() => {
    const el = getNativeTextarea()
    if (el) el.style.height = 'auto'
  }, [])

  const handleSend = useCallback(() => {
    const trimmed = value.trim()
    if (!trimmed || loading) return
    onSend(trimmed)
    setValue('')
    resetHeight()
    getNativeTextarea()?.focus()
  }, [value, loading, onSend, resetHeight])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e) => {
    setValue(e.target.value)
    requestAnimationFrame(adjustHeight)
  }

  const canSend = Boolean(value.trim()) && !loading

  return (
    <footer className="chat-input">
      <div
        className="chat-input__composer"
        onClick={() => getNativeTextarea()?.focus()}
        role="presentation"
      >
        <TextArea
          ref={textareaRef}
          className="chat-input__textarea"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Posez votre question à Beebot..."
          rows={1}
          autoSize={false}
          disabled={loading}
          aria-label="Message à envoyer à Beebot"
        />
        <Button
          type="primary"
          className={`chat-input__send${canSend ? ' chat-input__send--active' : ' chat-input__send--idle'}`}
          onClick={handleSend}
          disabled={!canSend}
          loading={loading}
          icon={!loading ? <SendIcon /> : undefined}
          aria-label="Envoyer le message"
        />
      </div>
      <Text type="secondary" className="chat-input__hint">
        Entrée pour envoyer · Maj+Entrée pour un saut de ligne
      </Text>
    </footer>
  )
}
