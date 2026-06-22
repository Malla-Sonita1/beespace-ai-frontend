/**
 * Migré Ant Design 4.15.6 — BeeSpace UI
 * Bouton flottant « descendre en bas » de la conversation.
 */
import { DownOutlined } from '@ant-design/icons'
import './ScrollToBottomButton.css'

export default function ScrollToBottomButton({ visible, onClick }) {
  return (
    <button
      type="button"
      className={`scroll-to-bottom${visible ? ' scroll-to-bottom--visible' : ''}`}
      onClick={onClick}
      aria-label="Descendre en bas de la conversation"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <DownOutlined />
    </button>
  )
}
