/**
 * Migré Ant Design 4.15.6 — BeeSpace UI
 * Badge d'intention NLU (Tag).
 */
import { Tag } from 'antd'

export default function IntentBadge({ intention }) {
  if (!intention || intention === 'UNCLEAR') return null

  return (
    <Tag className="intent-badge" color="magenta">
      {intention}
    </Tag>
  )
}
