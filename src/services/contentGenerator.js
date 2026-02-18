function getApiKey() {
  return (
    localStorage.getItem("gemini_key") ||
    import.meta.env.VITE_GEMINI_API_KEY
  );
}

import * as translationCache from './translationCache';

const GEMINI_MODEL = "models/gemini-2.5-flash";
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/${GEMINI_MODEL}:generateContent`;

const languageMap = {
  es: 'Spanish',
  fr: 'French',
  de: 'German',
  it: 'Italian',
  jp: 'Japanese',
  cn: 'Chinese'
};

// 🔒 in-flight lock (prevents duplicate calls)
const inFlight = new Map();

function inferCEFRLevel(levelTitle) {
  const title = (levelTitle || "").toLowerCase();
  if (title.includes('foundation') || title.includes('basic')) return 'A1-A2';
  if (title.includes('builder') || title.includes('core')) return 'B1';
  if (title.includes('conversation') || title.includes('usage')) return 'B2';
  if (title.includes('advanced') || title.includes('real-world')) return 'C1-C2';
  return 'A1-B2';
}

export async function generateContent(language, levelMetadata, sublevelMetadata, hasRetried = false) {
  const apiKey = getApiKey();

  // 🔴 If AI is requested but key is missing → ask App.jsx to show overlay
  if (!apiKey) {
    window.dispatchEvent(new Event("missing-api-key"));
    return [];
  }

  // 🔴 Guard against first-render race conditions
  if (!language || !levelMetadata || !sublevelMetadata) {
    return [];
  }

  if (!sublevelMetadata.id && !sublevelMetadata.title) {
    return [];
  }

  const key = `${language}:${sublevelMetadata.id || sublevelMetadata.title}`;

  if (inFlight.has(key)) {
    return inFlight.get(key);
  }

  const promise = (async () => {
    const languageName = languageMap[language] || 'the target language';
    const cefrLevel = inferCEFRLevel(levelMetadata?.title || '');

    const prompt = `
You are a native ${languageName} language teacher.

Generate ORIGINAL practice content in ${languageName}.
Also generate ACCURATE English translations.

STRICT RULES:
- Original text: ${languageName} ONLY
- Translation: English ONLY
- JSON ONLY

Schemas:

MCQ:
{
  "type": "mcq",
  "question": { "text": "...", "en": "..." },
  "options": [{ "text": "...", "en": "..." }],
  "correctIndex": 0
}

Flashcard:
{
  "type": "flashcard",
  "front": { "text": "...", "en": "..." },
  "back": { "text": "...", "en": "..." }
}

Fill blank:
{
  "type": "fill_blank",
  "sentence": { "text": "... ___ ...", "en": "..." },
  "answer": { "text": "...", "en": "..." }
}

Level: ${levelMetadata?.title}
CEFR: ${cefrLevel}
Sublevel: ${sublevelMetadata?.title}

Return ONLY a valid JSON array.
Do NOT truncate.
Ensure the JSON is complete and properly closed.
`;

    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.6, maxOutputTokens: 2500 }
        })
      });

      if (!response.ok) return [];

      const data = await response.json();
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!raw) return [];

      const match = raw.match(/\[[\s\S]*\]/);
      if (!match) return [];

      let parsed;
      try {
        parsed = JSON.parse(match[0]);
      } catch {
        if (hasRetried) {
          console.warn("Retry failed. Giving up.");
          return [];
        }

        console.warn("Retrying content generation once...");
        inFlight.delete(key);
        return generateContent(language, levelMetadata, sublevelMetadata, true);
      }

      // 🔄 Normalize for UI + extract translations
      return parsed.map(q => {
        if (q.type === 'mcq') {
          translationCache.set(language, 'en', q.question.text, q.question.en);
          q.options.forEach(o =>
            translationCache.set(language, 'en', o.text, o.en)
          );

          return {
            type: 'mcq',
            question: q.question.text,
            options: q.options.map(o => o.text),
            correctIndex: q.correctIndex
          };
        }

        if (q.type === 'flashcard') {
          translationCache.set(language, 'en', q.front.text, q.front.en);
          translationCache.set(language, 'en', q.back.text, q.back.en);

          return {
            type: 'flashcard',
            word: q.front.text,
            translation: q.back.text
          };
        }

        if (q.type === 'fill_blank') {
          translationCache.set(language, 'en', q.sentence.text, q.sentence.en);
          translationCache.set(language, 'en', q.answer.text, q.answer.en);

          return {
            type: 'fill_blank',
            sentence: q.sentence.text,
            answer: q.answer.text
          };
        }

        return null;
      }).filter(Boolean);

    } catch (err) {
      console.error("generateContent error:", err);
      return [];
    } finally {
      inFlight.delete(key);
    }
  })();

  inFlight.set(key, promise);
  return promise;
}
