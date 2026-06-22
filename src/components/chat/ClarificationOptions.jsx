/**
 * Migré Ant Design 4.15.6 — BeeSpace UI
 * Boutons numérotés pour les clarifications d'entités.
 */
import { Button } from 'antd'

export default function ClarificationOptions({ options, onSelectOption }) {
  return (
    <div className="clarification-options">
      {options.map((opt) => (
        <Button
          key={opt.number}
          block
          className="clarification-options__btn"
          onClick={() => onSelectOption(opt.text)}
        >
          <strong>{opt.number}.</strong> {opt.text}
        </Button>
      ))}
    </div>
  )
}
