import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { translateBatch } from "../../services/translate";
import { speak } from "../../services/textToSpeech";

export default function MCQ({ data, onViewed, sourceLanguage, targetLanguage = "en" }) {
  const { selectedLanguage } = useLanguage();
  const effectiveSourceLanguage = sourceLanguage || selectedLanguage;

  const {
    question,
    options = [],
    correctIndex = 0
  } = data;

  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translatedQuestion, setTranslatedQuestion] = useState(null);
  const [translatedOptions, setTranslatedOptions] = useState([]);
  const [isTranslating, setIsTranslating] = useState(false);

  const hasReportedViewed = useRef(false);
  const isTranslatingRef = useRef(false);

  // 🔊 safely extract text from string OR {text,en}
  const getText = (value) =>
    typeof value === "string" ? value : value?.text || "";

  const handleSpeak = (value) => {
    const text = getText(value);
    if (!text) return;
    speak(text, effectiveSourceLanguage);
  };

  const handleSelect = (index) => {
    if (isAnswered) return;
    setSelectedIndex(index);
    setIsAnswered(true);
  };

  useEffect(() => {
    if (isAnswered && onViewed && !hasReportedViewed.current) {
      hasReportedViewed.current = true;
      onViewed();
    }
  }, [isAnswered, onViewed]);

  const handleToggleTranslation = async () => {
    if (showTranslation) {
      setShowTranslation(false);
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
      const textsToTranslate = [
        getText(question),
        ...options.map(getText)
      ];

      const translations = await translateBatch(
        textsToTranslate,
        effectiveSourceLanguage,
        targetLanguage
      );

      setTranslatedQuestion(translations[0]);
      setTranslatedOptions(translations.slice(1));
      setShowTranslation(true);
    } catch (error) {
      setShowTranslation(false);
    } finally {
      setIsTranslating(false);
      setTimeout(() => {
        isTranslatingRef.current = false;
      }, 500);
    }
  };

  const getButtonClass = (index) => {
  const base =
    "w-full p-4 text-left rounded-lg border-2 transition-all text-gray-900 dark:text-white";

  if (!isAnswered) {
    return `${base}
      border-gray-300
      hover:border-blue-500
      hover:bg-blue-50
      dark:hover:bg-gray-700`;
  }

  if (index === correctIndex) {
    return `${base}
      border-green-500
      bg-green-100
      dark:bg-green-900/40`;
  }

  if (index === selectedIndex) {
    return `${base}
      border-red-500
      bg-red-100
      dark:bg-red-900/40`;
  }

  return `${base}
    border-gray-300
    bg-gray-50
    dark:bg-gray-800`;
};


  const displayQuestion =
    showTranslation && translatedQuestion
      ? translatedQuestion
      : getText(question);

  const displayOptions =
    showTranslation && translatedOptions.length === options.length
      ? translatedOptions
      : options.map(getText);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-100 dark:border-gray-700">
      {/* Question + audio */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3 flex-1">
          <h3 className="text-xl font-semibold text-center flex-1 text-gray-900 dark:text-white">
            {displayQuestion}
          </h3>

          {/* 🔊 Speak question */}
          <button
            onClick={() => handleSpeak(question)}
            className="text-lg hover:scale-110 transition"
            title="Play audio"
          >
            🔊
          </button>
        </div>

        {effectiveSourceLanguage && effectiveSourceLanguage !== targetLanguage && (
          <button
            onClick={handleToggleTranslation}
            disabled={isTranslating || isTranslatingRef.current}
            className="ml-4 px-3 py-1 text-sm bg-gray-100 dark:bg-white text-gray-800 hover:bg-gray-200 dark:hover:bg-gray-100 rounded border border-gray-300 disabled:opacity-50"

          >
            {isTranslating ? "..." : showTranslation ? "Original" : "Translate"}
          </button>
        )}
      </div>

      {/* Options + audio */}
      <div className="space-y-3">
        {displayOptions.map((option, index) => (
          <div key={index} className="flex items-center gap-2">
            <button
              onClick={() => handleSelect(index)}
              disabled={isAnswered}
              className={`${getButtonClass(index)} flex-1`}
            >
              {option}
            </button>

            {/* 🔊 Speak option */}
            <button
              onClick={() => handleSpeak(options[index])}
              className="text-lg px-2 hover:scale-110 transition"
              title="Play audio"
            >
              🔊
            </button>
          </div>
        ))}
      </div>

      {isAnswered && (
        <div
          className={`mt-4 p-3 rounded ${
            selectedIndex === correctIndex
              ? "bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-300"
              : "bg-red-50 text-red-800 dark:bg-red-900/30 dark:text-red-300"
          }`}
        >
          {selectedIndex === correctIndex ? "Correct!" : "Incorrect"}
        </div>
      )}
    </div>
  );
}
