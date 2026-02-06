export function get(sourceLang, targetLang, text) {
  const key = `translation:${sourceLang}:${targetLang}:${text}`;
  const stored = localStorage.getItem(key);
  if (stored === null) return null;
  return JSON.parse(stored);
}

export function set(sourceLang, targetLang, text, translation) {
  const key = `translation:${sourceLang}:${targetLang}:${text}`;
  localStorage.setItem(key, JSON.stringify(translation));
  // console.log(`💾 Cached translation [${sourceLang} -> ${targetLang}]: "${text}" -> "${translation}"`);
}
