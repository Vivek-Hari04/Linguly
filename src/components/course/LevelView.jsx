import { useProgress } from "../../contexts/ProgressContext";
import { getPassingScore } from "../../utils/unlockRules";
import SublevelView from "./SublevelView";

export default function LevelView({ level, onBack, onSelectSublevel }) {
  const { getLevelScore, isLevelCompleted } = useProgress();

  const levelId = level.levelId;
  const score = getLevelScore(levelId);
  const completed = isLevelCompleted(levelId);
  const passingScore = getPassingScore(levelId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50
                    dark:from-gray-900 dark:to-gray-800 transition-colors">
      <div className="max-w-3xl mx-auto px-4 py-8">

        <button
          onClick={onBack}
          className="mb-6 text-gray-600 hover:text-gray-800
                     dark:text-gray-300 dark:hover:text-white"
        >
          ← Back to Course
        </button>

        <div className="bg-white dark:bg-gray-800
                        rounded-xl shadow-md p-6 mb-6
                        border border-gray-100 dark:border-gray-700">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
            {level.title}
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-4">
            {level.goal}
          </p>

          <div className="flex gap-6 text-sm text-gray-700 dark:text-gray-300">
            <div>Passing Score: {passingScore}%</div>

            {score !== null && (
              <div>
                Your Score:{" "}
                <span
                  className={
                    score >= passingScore
                      ? "text-green-600"
                      : "text-yellow-600"
                  }
                >
                  {score}%
                </span>
              </div>
            )}

            {completed && <span>✅</span>}
          </div>
        </div>

        <SublevelView
          level={level}
          sublevels={level.sublevels || []}
          onSelectSublevel={onSelectSublevel}
        />
      </div>
    </div>
  );
}
