import { useState, useEffect, useCallback } from "react";
import { useProgress } from "../contexts/ProgressContext";
import { useLanguage } from "../contexts/LanguageContext";
import QuestionRenderer from "../components/shared/QuestionRenderer";
import AIConversation from "../components/ai/AIConversation";
import * as contentCache from "../services/contentCache";
import { generateContent } from "../services/contentGenerator";

export default function PracticePage({ level, sublevel, onExit }) {
  const { completeSublevel, addXP } = useProgress();
  const { selectedLanguage } = useLanguage();

  // ---------- AI SHORT-CIRCUIT ----------
  if (sublevel?.aiEnabled) {
    return (
      <AIConversation
        sublevel={sublevel}
        languageCode={selectedLanguage}
        languageName={selectedLanguage}
        onComplete={({ completed, score }) => {
          if (completed) {
            completeSublevel(level.levelId, sublevel.sublevelId, score ?? 100);
            addXP(20);
            onExit();
          }
        }}
      />
    );
  }

  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [contentUnavailable, setContentUnavailable] = useState(false);

  // ---------- STABLE LOAD FUNCTION ----------
  const loadQuestions = useCallback(async () => {
    setIsLoading(true);
    setContentUnavailable(false);

    if (!selectedLanguage || !sublevel?.sublevelId) {
      setQuestions([]);
      setIsLoading(false);
      return;
    }

    const cached = contentCache.get(selectedLanguage, sublevel.sublevelId);

    if (Array.isArray(cached) && cached.length > 0) {
      setQuestions(cached);
      setIsLoading(false);
      return;
    }

    const generated = await generateContent(
      selectedLanguage,
      level,
      sublevel
    );

    if (Array.isArray(generated) && generated.length > 0) {
      contentCache.set(selectedLanguage, sublevel.sublevelId, generated);
      setQuestions(generated);
      setContentUnavailable(false);
    } else {
      setQuestions([]);
      setContentUnavailable(true);
    }

    setIsLoading(false);
  }, [selectedLanguage, sublevel?.sublevelId, level]);

  // ---------- INITIAL LOAD ----------
  useEffect(() => {
    loadQuestions();
  }, [loadQuestions]);

  // ---------- RETRY AFTER KEY IS ADDED ----------
  useEffect(() => {
    const handler = () => {
      loadQuestions();
    };

    window.addEventListener("api-key-added", handler);
    return () => window.removeEventListener("api-key-added", handler);
  }, [loadQuestions]);

  const totalQuestions = questions.length;
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [viewedQuestions, setViewedQuestions] = useState(new Set());

  useEffect(() => {
    setCurrentQuestionIndex(0);
    setViewedQuestions(new Set());
  }, [sublevel?.sublevelId]);

  const handleQuestionViewed = () => {
    setViewedQuestions(prev => {
      if (prev.has(currentQuestionIndex)) return prev;
      const next = new Set(prev);
      next.add(currentQuestionIndex);
      return next;
    });
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(i => i - 1);
    }
  };

  const handleNext = () => {
    const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

    if (isLastQuestion) {
      completeSublevel(level.levelId, sublevel.sublevelId, 100);
      addXP(10);
      setTimeout(onExit, 800);
    } else {
      setCurrentQuestionIndex(i => i + 1);
    }
  };

  // ---------- 🔄 RELOAD QUESTIONS ----------
  const handleReloadQuestions = async () => {
        const apiKey =
          localStorage.getItem("gemini_key") ||
          import.meta.env.VITE_GEMINI_API_KEY;

        // No key → don't delete existing content
        if (!apiKey) {
          window.dispatchEvent(new Event("missing-api-key"));
          return;
        }

        //  Key exists → safe to regenerate
        contentCache.remove(selectedLanguage, sublevel.sublevelId);

        setCurrentQuestionIndex(0);
        setViewedQuestions(new Set());

        await loadQuestions();
};


  // ---------- LOADING ----------
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50
                      dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <button onClick={onExit} className="mb-6 text-gray-600 dark:text-gray-300">
            ← Back to Level
          </button>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <p className="text-gray-500 dark:text-gray-300">
              Loading practice content...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ---------- EMPTY ----------
  if (contentUnavailable || totalQuestions === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50
                      dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <button onClick={onExit} className="mb-6 text-gray-600 dark:text-gray-300">
            ← Back to Level
          </button>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <p className="text-gray-500 dark:text-gray-300">
              Content unavailable for this sublevel.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isCurrentViewed = viewedQuestions.has(currentQuestionIndex);
  const progress =
    totalQuestions > 0
      ? ((currentQuestionIndex + 1) / totalQuestions) * 100
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50
                    dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <button onClick={onExit} className="mb-6 text-gray-600 dark:text-gray-300">
          ← Back to Level
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6
                        border border-gray-100 dark:border-gray-700">
          <h1 className="text-2xl font-bold mb-1 text-gray-900 dark:text-white">
            {level.title}
          </h1>

          <h2 className="text-lg text-gray-600 dark:text-gray-300 mb-4">
            {sublevel.title}
          </h2>

          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
              <span>
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </span>
              <span>{Math.round(progress)}%</span>
            </div>

            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <QuestionRenderer
            question={currentQuestion}
            questionIndex={currentQuestionIndex}
            onQuestionViewed={handleQuestionViewed}
          />

          <div className="mt-6 flex justify-between gap-4">
            {!isFirstQuestion ? (
              <button
                onClick={handlePrevious}
                className="px-6 py-2 bg-gray-200 dark:bg-gray-700
                           text-gray-800 dark:text-gray-200
                           rounded-lg"
              >
                ← Previous
              </button>
            ) : (
              <div />
            )}

            <button
              onClick={handleNext}
              disabled={!isCurrentViewed}
              className={`px-6 py-2 rounded-lg ${
                isCurrentViewed
                  ? "bg-blue-600 text-white"
                  : "bg-gray-300 dark:bg-gray-600 text-gray-500 dark:text-gray-300 cursor-not-allowed"
              }`}
            >
              {isLastQuestion ? "Finish" : "Next →"}
            </button>
          </div>

          {/* 🔄 Show only after completing last question */}
          {isLastQuestion && isCurrentViewed && (
            <button
              onClick={handleReloadQuestions}
              className="mt-4 w-full px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              🔄 Generate New Questions
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
