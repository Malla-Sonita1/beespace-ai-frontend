/** Formate la date d'une session (aujourd'hui → heure, sinon jour + mois). */
export function formatSessionDate(ts) {
  if (!ts) return ''
  const date = new Date(ts.replace(' ', 'T'))
  const now = new Date()
  const isToday = date.toDateString() === now.toDateString()
  if (isToday) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  }
  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

/** Tronque le titre affiché dans la sidebar. */
export function truncateSessionTitle(text, max = 34) {
  if (!text) return 'Conversation'
  return text.length > max ? `${text.slice(0, max)}…` : text
}

/** Libellé du nombre d'échanges (msg_count / 2). */
export function formatExchangeCount(msgCount) {
  if (!msgCount || msgCount <= 0) return ''
  const exchanges = Math.floor(msgCount / 2)
  return ` · ${exchanges} échange${msgCount > 2 ? 's' : ''}`
}
