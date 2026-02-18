import ThemeToggle from "./ThemeToggle";
import { useLanguage } from "../../contexts/LanguageContext";
import { useState, useEffect } from "react";

export default function AppHeader() {
  const { getLanguageInfo, selectedLanguage } = useLanguage();
  const language = getLanguageInfo(selectedLanguage);

  const [hasApiKey, setHasApiKey] = useState(false);

  const checkKey = () => {
    setHasApiKey(!!localStorage.getItem("gemini_key"));
  };

  useEffect(() => {
    checkKey();

    // When key saved manually
    window.addEventListener("api-key-updated", checkKey);

    // When key cleared manually
    window.addEventListener("api-key-cleared", checkKey);

    return () => {
      window.removeEventListener("api-key-updated", checkKey);
      window.removeEventListener("api-key-cleared", checkKey);
    };
  }, []);

  const handleClearKey = () => {
    localStorage.removeItem("gemini_key");
    setHasApiKey(false);

    // 🔔 notify app
    window.dispatchEvent(new Event("api-key-cleared"));
  };

  return (
    <header className="
      sticky top-0 z-40
      w-full border-b
      bg-white/80 backdrop-blur
      dark:bg-gray-900/80 dark:border-gray-700
    ">
      <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
        
        {/* Left: App Name */}
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-gray-900 dark:text-white">
            Linguly
          </span>

          {language && (
            <span className="text-sm text-gray-500 dark:text-gray-300">
              • {language.name}
            </span>
          )}
        </div>

        {/* Right: Clear Key + Theme toggle */}
        <div className="flex items-center gap-3">
          {hasApiKey && (
            <button
              onClick={handleClearKey}
              className="text-xs px-3 py-1 rounded-md border text-red-600 border-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              Clear API Key
            </button>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
