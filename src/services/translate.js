import * as translationCache from './translationCache';

// Read-only translation resolver
// NO Gemini calls

export async function translateText(text, sourceLang, targetLang) {
  if (!text || !sourceLang || !targetLang) return text;
  if (sourceLang === targetLang) return text;

  const cached = translationCache.get(sourceLang, targetLang, text);
  return cached ?? text;
}

export async function translateBatch(textArray, sourceLang, targetLang) {
  if (!Array.isArray(textArray)) return [];

  return textArray.map(text => {
    if (!text || sourceLang === targetLang) return text;
    return translationCache.get(sourceLang, targetLang, text) ?? text;
  });
}
