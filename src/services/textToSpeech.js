// Native browser Text-to-Speech (no API, no Gemini)

export function speak(text, langCode = "en") {
  if (!text || typeof window === "undefined") return;

  const utterance = new SpeechSynthesisUtterance(text);

  // Map app language codes → speech engine codes
  const langMap = {
    es: "es-ES",
    fr: "fr-FR",
    de: "de-DE",
    it: "it-IT",
    jp: "ja-JP",
    cn: "zh-CN",
    en: "en-US"
  };

  utterance.lang = langMap[langCode] || "en-US";
  utterance.rate = 0.9;
  utterance.pitch = 1;

  window.speechSynthesis.cancel(); // stop previous audio
  window.speechSynthesis.speak(utterance);
}
