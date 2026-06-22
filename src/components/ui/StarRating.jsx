/**
 * Migré Ant Design 4.15.6 — BeeSpace UI
 * Notation 1–5 étoiles (Rate).
 */
import { useState } from 'react'
import { Rate, Typography } from 'antd'
import { rateMessage } from '../../services/api'

const { Text } = Typography

export default function StarRating({ messageId, sessionId }) {
  const [value, setValue] = useState(0)
  const [showThanks, setShowThanks] = useState(false)

  if (!messageId) return null

  const handleChange = async (star) => {
    if (value !== 0) return
    setValue(star)
    setShowThanks(true)
    setTimeout(() => setShowThanks(false), 2000)

    try {
      await rateMessage(sessionId, messageId, star)
    } catch (e) {
      console.error('Rating error:', e)
    }
  }

  return (
    <div className="star-rating">
      <Rate
        value={value}
        onChange={handleChange}
        disabled={value !== 0}
        className="star-rating__rate"
      />
      {showThanks && (
        <Text type="secondary" className="star-rating__thanks">
          Merci !
        </Text>
      )}
    </div>
  )
}
