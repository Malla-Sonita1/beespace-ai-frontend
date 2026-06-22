/**
 * Migré Ant Design 4.15.6 — BeeSpace UI
 * Pagination « Voir la suite » (has_more).
 */
import { Button } from 'antd'
import { DownOutlined } from '@ant-design/icons'

export default function ShowMoreButton({ msg, onShowMore }) {
  if (!msg.has_more) return null

  return (
    <Button
      className="show-more-btn"
      icon={<DownOutlined />}
      onClick={() => onShowMore(msg.next_offset)}
    >
      Voir la suite
      <span className="show-more-btn__badge">+{msg.next_offset}</span>
    </Button>
  )
}
