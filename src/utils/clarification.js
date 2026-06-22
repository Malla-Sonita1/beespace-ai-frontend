/** Extrait les options numérotées (ex: "1. SARA OMAYR — CHEF_PROJET"). */
export function extractNumberedOptions(text) {
  if (!text) return []
  const options = []

  for (const line of text.split('\n')) {
    const match = line.match(/^\s*(\d+)\.\s+(.+)$/)
    if (match) {
      options.push({ number: match[1], text: match[2].trim() })
    }
  }

  return options.length > 0 ? options : []
}

/** Texte d'intro avant la première option numérotée. */
export function extractClarificationIntro(text) {
  if (!text) return ''
  const introLines = []

  for (const line of text.split('\n')) {
    if (/^\s*\d+\.\s+.+$/.test(line)) break
    introLines.push(line)
  }

  return introLines.join('\n').trim()
}
