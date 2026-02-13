import { useLanguage } from "../../contexts/LanguageContext";
import { useProgress } from "../../contexts/ProgressContext";
import { getAllLevels, isLevelUnlocked } from "../../utils/unlockRules";
import ProgressOverview from "./ProgressOverview";
import LevelCard from "./LevelCard";

export default function CourseView({ onSelectLevel }) {
  const { getLanguageInfo, setSelectedLanguage } = useLanguage();
  const progressHelpers = useProgress();

  const languageInfo = getLanguageInfo();
  const levels = getAllLevels();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50
                    dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 py-8">

        <button
          onClick={() => setSelectedLanguage(null)}
          className="mb-6 text-gray-600 hover:text-gray-800
                     dark:text-gray-300 dark:hover:text-white"
        >
          ← Change Language
        </button>

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-2">
            Learning {languageInfo.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Follow the roadmap to master the language
          </p>
        </div>

        <ProgressOverview />

        <div className="space-y-4">
          {levels.map((level) => {
            const unlocked = isLevelUnlocked(level, progressHelpers);
            return (
              <LevelCard
                key={level.levelId}
                level={level}
                isUnlocked={unlocked}
                onClick={() => onSelectLevel(level)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
