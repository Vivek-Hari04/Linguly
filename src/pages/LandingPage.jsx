import { useMemo } from "react";
import { useLanguage } from "../contexts/LanguageContext";

export default function LandingPage() {
  const {
    getAllLanguages,
    getLanguageInfo,
    setSelectedLanguage,
    selectedLanguage,
    isLoading,
  } = useLanguage();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-400 dark:bg-gray-900">
        Loading languages...
      </div>
    );
  }

  const languages = getAllLanguages();

  if (!languages.length) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500 dark:text-gray-400 dark:bg-gray-900">
        No languages available
      </div>
    );
  }

  const lastLanguage = getLanguageInfo(selectedLanguage);

  const learnerCounts = useMemo(() => {
    const counts = {};
    languages.forEach((lang) => {
      counts[lang.code] =
        Math.floor(Math.random() * (700000 - 500000 + 1)) + 500000;
    });
    return counts;
  }, [languages]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-gray-800 flex items-center justify-center">
              <span className="text-3xl">🗣️</span>
            </div>
          </div>

          <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
            Choose Your Language
          </h1>

          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-xl mx-auto">
            Start your journey to fluency. Pick a language and learn at your own
            pace with interactive lessons.
          </p>
        </div>

        {/* Last learned language */}
        {lastLanguage && (
          <div className="flex justify-center mb-14">
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full
                         bg-blue-50 text-blue-700 border border-blue-200
                         dark:bg-gray-800 dark:text-blue-300 dark:border-gray-700
                         text-sm font-medium animate-fade-in"
            >
              ✔ Currently learning: {lastLanguage.name}
            </div>
          </div>
        )}

        {/* Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className="bg-white dark:bg-gray-800
                         rounded-2xl border border-gray-200 dark:border-gray-700
                         p-6 shadow-sm hover:shadow-lg
                         transition-all duration-300
                         hover:-translate-y-1 hover:border-blue-300
                         text-left"
            >
              <div className="text-lg font-semibold text-gray-900 dark:text-white">
                {lang.name}
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {lang.nativeName || lang.name}
              </div>

              <div
                className={`inline-block px-3 py-1 rounded-full text-xs font-medium
                  ${
                    lang.difficulty === "Easy"
                      ? "bg-green-100 text-green-700"
                      : lang.difficulty === "Medium"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-red-100 text-red-700"
                  }`}
              >
                Difficulty: {lang.difficulty}
              </div>

              <div className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                {(learnerCounts[lang.code] / 1000).toFixed(0)}k learners
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
