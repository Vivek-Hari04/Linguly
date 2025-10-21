export const speak = (text, language = "en-US") => {
  if ("speechSynthesis" in window) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.8; // Slightly slower for better clarity
    utterance.pitch = 1.1; // Slightly higher pitch for female voice
    utterance.volume = 0.9; // Comfortable volume

    const applyBestVoice = () => {
      const best = getBestVoice(language);
      if (best) {
        utterance.voice = best;
        console.log(`Using voice: ${best.name} (${best.lang}) for ${language}`);
      } else {
        console.log(
          `No matching voice found for ${language}, using engine default`
        );
      }
    };

    const voicesNow = window.speechSynthesis.getVoices();
    if (voicesNow && voicesNow.length > 0) {
      applyBestVoice();
      window.speechSynthesis.cancel(); // Clear any queued utterances
      window.speechSynthesis.speak(utterance);
      return;
    }

    // Fallback: wait for voices or timeout
    let spoke = false;
    const onVoices = () => {
      if (spoke) return;
      applyBestVoice();
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      spoke = true;
      window.speechSynthesis.onvoiceschanged = null;
    };
    window.speechSynthesis.onvoiceschanged = onVoices;
    setTimeout(onVoices, 1500);
  }
};

export const getVoices = () => {
  return window.speechSynthesis.getVoices();
};

export const getFemaleVoices = (language = "en-US") => {
  const voices = window.speechSynthesis.getVoices();
  const langCode = language.split("-")[0];

  return voices.filter(
    (voice) =>
      voice.lang.startsWith(langCode) &&
      (voice.name.toLowerCase().includes("female") ||
        voice.name.toLowerCase().includes("woman") ||
        voice.name.toLowerCase().includes("zira") ||
        voice.name.toLowerCase().includes("hazel") ||
        voice.name.toLowerCase().includes("susan") ||
        voice.name.toLowerCase().includes("karen") ||
        voice.name.toLowerCase().includes("samantha") ||
        voice.name.toLowerCase().includes("victoria") ||
        voice.name.toLowerCase().includes("monica") ||
        voice.name.toLowerCase().includes("maria") ||
        voice.name.toLowerCase().includes("eva") ||
        voice.name.toLowerCase().includes("anna") ||
        voice.name.toLowerCase().includes("carmen") ||
        voice.name.toLowerCase().includes("helena") ||
        voice.name.toLowerCase().includes("ines") ||
        voice.name.toLowerCase().includes("laura") ||
        voice.name.toLowerCase().includes("marisol") ||
        voice.name.toLowerCase().includes("soledad") ||
        voice.name.toLowerCase().includes("amelie") ||
        voice.name.toLowerCase().includes("audrey") ||
        voice.name.toLowerCase().includes("chantal") ||
        voice.name.toLowerCase().includes("julie") ||
        voice.name.toLowerCase().includes("pauline"))
  );
};

// General language-matching voice selection with Japanese-friendly heuristics
export const getBestVoice = (language = "en-US") => {
  const voices = window.speechSynthesis.getVoices();
  if (!voices || voices.length === 0) return null;

  const [langCode, region] = language.split("-");

  const byExactLang = voices.filter(
    (v) => v.lang.toLowerCase() === language.toLowerCase()
  );
  const byLangPrefix = voices.filter((v) =>
    v.lang.toLowerCase().startsWith(langCode.toLowerCase())
  );

  // Global hints for female and male-coded voice names across engines
  const femaleHintsGlobal = [
    // Generic
    "female",
    "woman",
    // Common English macOS/iOS
    "samantha",
    "victoria",
    "karen",
    "susan",
    "zira",
    "hazel",
    // French
    "amelie",
    "audrey",
    "chantal",
    "julie",
    "pauline",
    // Spanish/Portuguese/Italian
    "monica",
    "maria",
    "eva",
    "anna",
    "ines",
    "laura",
    "carmen",
    "marisol",
    "soledad",
    // Japanese (also handled specially below)
    "kyoko",
    "mizuki",
    "haruka",
    "ayumi",
    "hikari",
    "nanami",
    "sayaka",
  ];
  const maleHintsGlobal = [
    "male",
    "man",
    // Common names across locales
    "daniel",
    "alex",
    "fred",
    "george",
    "thomas",
    "paul",
    "xander",
    "hans",
    // Japanese
    "naoki",
    "ichiro",
  ];

  const includesAny = (name, hints) =>
    hints.some((h) => name.toLowerCase().includes(h));

  const pickByHeuristics = (candidates) => {
    if (!candidates || candidates.length === 0) return null;

    // Prefer names that hint female first
    const female = candidates.find((v) =>
      includesAny(v.name, femaleHintsGlobal)
    );
    if (female) return female;

    // If none, prefer a voice that does NOT look male-coded
    const nonMale = candidates.find(
      (v) => !includesAny(v.name, maleHintsGlobal)
    );
    if (nonMale) return nonMale;

    // Fallback: first available
    return candidates[0];
  };

  // Japanese specific prioritization
  if (langCode.toLowerCase() === "ja") {
    const jaCandidates = (
      byExactLang.length ? byExactLang : byLangPrefix
    ).slice();
    // Strong female-first selection for Japanese
    const femaleJa = jaCandidates.find((v) =>
      includesAny(v.name, [
        "kyoko",
        "mizuki",
        "haruka",
        "ayumi",
        "hikari",
        "nanami",
        "sayaka",
      ])
    );
    if (femaleJa) return femaleJa;
    const genericJa = jaCandidates.find((v) =>
      includesAny(v.name, ["日本", "japanese"])
    );
    if (genericJa && !includesAny(genericJa.name, ["naoki", "ichiro"]))
      return genericJa;
    const anyJa = pickByHeuristics(jaCandidates);
    if (anyJa) return anyJa;
  }

  // Non-Japanese: prefer exact lang, then prefix
  const exact = pickByHeuristics(byExactLang);
  if (exact) return exact;
  const prefix = pickByHeuristics(byLangPrefix);
  if (prefix) return prefix;

  return null;
};

export const debugVoices = () => {
  const voices = window.speechSynthesis.getVoices();
  console.log(
    "Available voices:",
    voices.map((v) => ({
      name: v.name,
      lang: v.lang,
      gender:
        v.name.toLowerCase().includes("female") ||
        v.name.toLowerCase().includes("woman")
          ? "female"
          : "unknown",
    }))
  );
  return voices;
};

export const testFemaleVoice = (language = "en-US") => {
  const testText = language.startsWith("es")
    ? "Hola, soy una voz femenina"
    : language.startsWith("fr")
    ? "Bonjour, je suis une voix féminine"
    : "Hello, I am a female voice";

  console.log(`Testing female voice for ${language}`);
  speak(testText, language);
};

export const LANGUAGE_CODES = {
  spanish: "es-ES",
  french: "fr-FR",
  german: "de-DE",
  italian: "it-IT",
  japanese: "ja-JP",
  korean: "ko-KR",
  chinese: "zh-CN",
  portuguese: "pt-PT",
  russian: "ru-RU",
  arabic: "ar-SA",
};
