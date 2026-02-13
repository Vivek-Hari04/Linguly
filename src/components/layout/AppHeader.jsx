import ThemeToggle from "./ThemeToggle";
import { useLanguage } from "../../contexts/LanguageContext";

export default function AppHeader() {
  const { getLanguageInfo, selectedLanguage } = useLanguage();
  const language = getLanguageInfo(selectedLanguage);

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

        {/* Right: Theme toggle */}
        <ThemeToggle />
      </div>
    </header>
  );
}
