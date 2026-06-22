/**
 * Migré Ant Design 4.15.6 — BeeSpace UI
 * Bulle de message — markdown GFM, copie, rating, clarification.
 */
import { memo, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button, Tooltip, Typography } from 'antd'
import { CopyOutlined, CheckOutlined } from '@ant-design/icons'
import IntentBadge from '../ui/IntentBadge'
import DebugInfo from '../ui/DebugInfo'
import StarRating from '../ui/StarRating'
import ClarificationOptions from './ClarificationOptions'
import ShowMoreButton from './ShowMoreButton'
import { extractNumberedOptions, extractClarificationIntro } from '../../utils/clarification'

const { Text } = Typography

const markdownComponents = {
  p: ({ children }) => <p className="bot-md-p">{children}</p>,
  strong: ({ children }) => <strong className="bot-md-strong">{children}</strong>,
  ul: ({ children }) => <ul className="bot-md-ul">{children}</ul>,
  li: ({ children }) => <li className="bot-md-li">{children}</li>,
  code: ({ children }) => <code className="bot-md-code">{children}</code>,
  hr: () => <hr className="bot-md-hr" />,
  table: ({ children }) => (
    <div className="bot-md-table-wrap">
      <table className="bot-md-table">{children}</table>
    </div>
  ),
  thead: ({ children }) => <thead className="bot-md-thead">{children}</thead>,
  tbody: ({ children }) => <tbody>{children}</tbody>,
  tr: ({ children }) => <tr className="bot-md-tr">{children}</tr>,
  th: ({ children }) => <th className="bot-md-th">{children}</th>,
  td: ({ children }) => <td className="bot-md-td">{children}</td>,
}

const Message = memo(function Message({ msg, onShowMore, onSend }) {
  const isUser = msg.role === 'user'
  const [hovered, setHovered] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(msg.content)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* clipboard non disponible */
    }
  }

  const numberedOptions = msg.clarification_needed
    ? extractNumberedOptions(msg.content)
    : []
  const clarificationIntro = numberedOptions.length > 0
    ? extractClarificationIntro(msg.content)
    : msg.content

  return (
    <article
      className={`message-row message-row--${isUser ? 'user' : 'bot'}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {!isUser && (
        <header className="message-row__header">
          <div className="bee-avatar bee-avatar--sm" aria-hidden>🐝</div>
          <Text type="secondary" className="message-row__author">Beebot</Text>
        </header>
      )}

      <div className={`message-bubble message-bubble--${isUser ? 'user' : 'bot'}`}>
        {!isUser && <IntentBadge intention={msg.intention} />}

        {isUser ? (
          <p className="message-bubble__user-text">{msg.content}</p>
        ) : (
          <div className="bot-message-content">
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {clarificationIntro}
            </ReactMarkdown>
            {msg.clarification_needed && numberedOptions.length > 0 && (
              <ClarificationOptions
                options={numberedOptions}
                onSelectOption={(selection) => onSend?.(selection)}
              />
            )}
          </div>
        )}

        {!isUser && (
          <StarRating messageId={msg.message_id} sessionId={msg.session_id} />
        )}
        {!isUser && <DebugInfo debug={msg.debug} />}

        <Tooltip title={copied ? 'Copié !' : 'Copier'}>
          <Button
            type="text"
            size="small"
            className={`message-bubble__copy${hovered ? ' message-bubble__copy--visible' : ''}${copied ? ' message-bubble__copy--copied' : ''}`}
            icon={copied ? <CheckOutlined /> : <CopyOutlined />}
            onClick={handleCopy}
            aria-label="Copier le message"
          />
        </Tooltip>
      </div>

      {!isUser && <ShowMoreButton msg={msg} onShowMore={onShowMore} />}

      <time className="message-row__time">{msg.time}</time>
    </article>
  )
})

export default Message
