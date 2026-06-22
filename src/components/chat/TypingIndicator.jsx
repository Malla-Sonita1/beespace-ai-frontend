/**
 * Migré Ant Design 4.15.6 — BeeSpace UI
 * Indicateur de frappe animé (3 points).
 */
export default function TypingIndicator() {
  return (
    <div className="typing-indicator">
      <div className="bee-avatar bee-avatar--sm" aria-hidden>🐝</div>
      <div className="typing-indicator__bubble">
        {[0, 1, 2].map((i) => (
          <span key={i} className="typing-indicator__dot" />
        ))}
      </div>
    </div>
  )
}
