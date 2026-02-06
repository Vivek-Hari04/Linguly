import { useProgress } from "../../contexts/ProgressContext";

export default function LevelCard({ level, isUnlocked, onClick }) {
  const { getLevelScore, isLevelCompleted } = useProgress();

  const score = getLevelScore(level.levelId);
  const completed = isLevelCompleted(level.levelId);

  return (
    <button
      onClick={() => isUnlocked && onClick(level)}
      disabled={!isUnlocked}
      aria-disabled={!isUnlocked}
      title={!isUnlocked ? "Complete previous levels to unlock" : undefined}
      className={`relative p-6 rounded-xl border-2 w-full text-left transition-all duration-200
        ${
          !isUnlocked
            ? "border-gray-300 bg-gray-100 opacity-50 grayscale cursor-not-allowed dark:border-gray-700 dark:bg-gray-800"
            : completed
            ? "border-green-500 bg-green-50 hover:shadow-md dark:bg-green-900/20 dark:border-green-600"
            : "border-blue-500 bg-white hover:shadow-md dark:bg-gray-800 dark:border-blue-600"
        }
      `}
    >
      {/* 🔒 Lock overlay (visual only) */}
      {!isUnlocked && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-white/80 dark:bg-gray-900/80 rounded-full p-3 shadow-sm">
            <span className="text-2xl">🔒</span>
          </div>
        </div>
      )}

      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
        {level.title}
      </h3>

      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
        {level.goal}
      </p>

      {score !== null && (
        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
          Score: <span>{score}%</span>
        </div>
      )}

      {completed && (
        <div className="text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">
          <span>✔</span>
          <span>Completed</span>
        </div>
      )}
    </button>
  );
}
