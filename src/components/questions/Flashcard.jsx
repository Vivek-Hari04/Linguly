import { useState, useRef } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { translateBatch } from "../../services/translate";
import { speak } from "../../services/textToSpeech";

export default function Flashcard({ data, onViewed, sourceLanguage, targetLanguage = "en" }) {
  const { selectedLanguage } = useLanguage();
  const effectiveSourceLanguage = sourceLanguage || selectedLanguage;

  const { word, translation, example } = data;

  const [showTranslation, setShowTranslation] = useState(false);
  const [showEnglishTranslation, setShowEnglishTranslation] = useState(false);
  const [translatedWord, setTranslatedWord] = useState(null);
  const [translatedExample, setTranslatedExample] = useState(null);
  const [isTranslating, setIsTranslating] = useState(false);

  const hasReportedViewed = useRef(false);
  const isTranslatingRef = useRef(false);

  // Handles string OR {text,en}
  const getText = (value) =>
    typeof value === "string" ? value : value?.text || "";

  const handleSpeak = (value) => {
    const text = getText(value);
    if (!text) return;
    speak(text, effectiveSourceLanguage);
  };

  const handleFlip = () => {
    const nextState = !showTranslation;
    setShowTranslation(nextState);

    if (nextState && onViewed && !hasReportedViewed.current) {
      hasReportedViewed.current = true;
      onViewed();
    }
  };

  const handleToggleEnglishTranslation = async () => {
    if (showEnglishTranslation) {
      setShowEnglishTranslation(false);
      return;
    }

    if (!effectiveSourceLanguage || effectiveSourceLanguage === targetLanguage) {
      return;
    }

    if (isTranslating || isTranslatingRef.current) {
      return;
    }

    isTranslatingRef.current = true;
    setIsTranslating(true);

    try {
      const textsToTranslate = example
        ? [getText(word), getText(example)]
        : [getText(word)];

      const translations = await translateBatch(
        textsToTranslate,
        effectiveSourceLanguage,
        targetLanguage
      );

      setTranslatedWord(translations[0]);
      if (example) setTranslatedExample(translations[1]);

      setShowEnglishTranslation(true);
    } catch {
      setShowEnglishTranslation(false);
    } finally {
      setIsTranslating(false);
      setTimeout(() => {
        isTranslatingRef.current = false;
      }, 500);
    }
  };

  const displayWord =
    showEnglishTranslation && translatedWord
      ? translatedWord
      : getText(word);

  const displayExample =
    showEnglishTranslation && translatedExample
      ? translatedExample
      : getText(example);

  const displayTranslation = getText(translation);

  return (
    <div className="flex flex-col items-center gap-6 p-6">
      <div className="w-full max-w-md flex justify-end mb-2">
        {effectiveSourceLanguage && effectiveSourceLanguage !== targetLanguage && (
          <button
            onClick={handleToggleEnglishTranslation}
            disabled={isTranslating || isTranslatingRef.current}
            className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 disabled:opacity-50"
          >
            {isTranslating ? "..." : showEnglishTranslation ? "Original" : "Translate"}
          </button>
        )}
      </div>

      <div
        onClick={handleFlip}
        className="w-full max-w-md h-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg cursor-pointer transition-all hover:scale-105 border border-gray-100 dark:border-gray-700"
      >
        <div className="w-full h-full flex items-center justify-center p-8">
          {!showTranslation ? (
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <p className="text-4xl font-bold text-gray-800 dark:text-white">
                  {displayWord}
                </p>

                {/* 🔊 Word audio */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(word);
                  }}
                  className="text-xl hover:scale-110 transition"
                >
                  🔊
                </button>
              </div>

              <p className="text-sm text-gray-500 dark:text-gray-300">
                Click to reveal translation
              </p>
            </div>
          ) : (
            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-4">
                <p className="text-3xl font-semibold text-blue-600">
                  {displayTranslation}
                </p>

                {/* 🔊 Translation audio */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(translation);
                  }}
                  className="text-xl hover:scale-110 transition"
                >
                  🔊
                </button>
              </div>

              {displayExample && (
                <div className="flex items-center justify-center gap-2 mt-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                    "{displayExample}"
                  </p>

                  {/* 🔊 Example audio */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSpeak(example);
                    }}
                    className="text-lg hover:scale-110 transition"
                  >
                    🔊
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
