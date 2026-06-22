/** Formate une durée en millisecondes pour l'affichage debug. */
export function fmtDuration(ms) {
  if (ms == null) return null
  return ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${ms}ms`
}
