import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { translateBatch } from "../../services/translate";
import { speak } from "../../services/textToSpeech";

export default function FillInBlank({
  data,
  onViewed,
  sourceLanguage,
  targetLanguage = "en",
}) {
  const { selectedLanguage } = useLanguage();
  const effectiveSourceLanguage = sourceLanguage || selectedLanguage;

  const { sentence, answer } = data;

  const [userInput, setUserInput] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [translatedSentence, setTranslatedSentence] = useState(null);
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

  const handleSubmit = () => {
    if (!userInput.trim()) return;

    const correct =
      userInput.trim().toLowerCase() === getText(answer).toLowerCase();

    setIsCorrect(correct);
    setIsSubmitted(true);
  };

  useEffect(() => {
    if (isSubmitted && onViewed && !hasReportedViewed.current) {
      hasReportedViewed.current = true;
      onViewed();
    }
  }, [isSubmitted, onViewed]);

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
      const translations = await translateBatch(
        [getText(sentence)],
        effectiveSourceLanguage,
        targetLanguage
      );

      setTranslatedSentence(translations[0]);
      setShowTranslation(true);
    } catch {
      setShowTranslation(false);
    } finally {
      setIsTranslating(false);
      setTimeout(() => {
        isTranslatingRef.current = false;
      }, 500);
    }
  };

  const displaySentence =
    showTranslation && translatedSentence
      ? translatedSentence
      : getText(sentence);

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8 border border-gray-100 dark:border-gray-700">
        {/* Sentence + audio */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-3 flex-1">
            <p className="text-2xl text-gray-800 dark:text-white text-center flex-1">
              {displaySentence}
            </p>

            {/* 🔊 Sentence audio */}
            <button
              onClick={() => handleSpeak(sentence)}
              className="text-xl hover:scale-110 transition"
            >
              🔊
            </button>
          </div>

          {effectiveSourceLanguage &&
            effectiveSourceLanguage !== targetLanguage && (
              <button
                onClick={handleToggleTranslation}
                disabled={isTranslating || isTranslatingRef.current}
                className="ml-4 px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded border border-gray-300 disabled:opacity-50"
              >
                {isTranslating ? "..." : showTranslation ? "Original" : "Translate"}
              </button>
            )}
        </div>

        {/* Input */}
        <div className="mb-6">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            disabled={isSubmitted}
            placeholder="Type your answer..."
            className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 disabled:bg-gray-100"
          />
        </div>

        {/* Result */}
        {isSubmitted && (
          <div
            className={`mb-4 p-4 rounded-lg ${
              isCorrect
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            <p className="font-semibold">
              {isCorrect ? "✓ Correct!" : "✗ Incorrect"}
            </p>

            {!isCorrect && (
              <div className="text-sm mt-1 flex items-center gap-2">
                <span>
                  Correct answer: <strong>{getText(answer)}</strong>
                </span>

                {/* 🔊 Answer audio */}
                <button
                  onClick={() => handleSpeak(answer)}
                  className="text-lg hover:scale-110 transition"
                >
                  🔊
                </button>
              </div>
            )}
          </div>
        )}

        {/* Submit */}
        {!isSubmitted && (
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              disabled={!userInput.trim()}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300"
            >
              Check Answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
