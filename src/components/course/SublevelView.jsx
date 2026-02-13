import { useEffect, useRef, useState } from "react";
import { useProgress } from "../../contexts/ProgressContext";
import { useLanguage } from "../../contexts/LanguageContext";

export default function SublevelView({
  level,
  sublevels,
  onSelectSublevel,
}) {
  const { isSublevelCompleted, getSublevelScore } = useProgress();
  const { selectedLanguage } = useLanguage();

  const prevCompletedMap = useRef({});
  const [showCompletionAnim, setShowCompletionAnim] = useState(false);
  const [completedTitle, setCompletedTitle] = useState("");

  useEffect(() => {
    if (!level || !selectedLanguage) return;

    sublevels.forEach((sublevel) => {
      const key = `${selectedLanguage}:${level.levelId}:${sublevel.sublevelId}`;

      const completed = isSublevelCompleted(
        level.levelId,
        sublevel.sublevelId
      );

      const prev = prevCompletedMap.current[key];

      // ✅ Trigger when it becomes completed for the first time
      if (prev !== true && completed === true) {
        setCompletedTitle(sublevel.title);
        setShowCompletionAnim(true);
      }

      // Store current state
      prevCompletedMap.current[key] = completed;
    });
  }, [level, sublevels, isSublevelCompleted, selectedLanguage]);

  useEffect(() => {
    if (!showCompletionAnim) return;
    const t = setTimeout(() => setShowCompletionAnim(false), 1200);
    return () => clearTimeout(t);
  }, [showCompletionAnim]);

  if (!level) return null;

  return (
    <>
      {showCompletionAnim && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-white dark:bg-gray-800 rounded-2xl px-8 py-6 shadow-lg animate-bounce-in border border-gray-100 dark:border-gray-700">
            <div className="text-4xl text-center mb-2">🎉</div>
            <div className="text-lg font-bold text-green-600 dark:text-green-400 text-center">
              Sublevel Completed!
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-300 text-center mt-1">
              {completedTitle}
            </div>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {sublevels.map((sublevel, index) => {
          const completed = isSublevelCompleted(
            level.levelId,
            sublevel.sublevelId
          );
          const score = getSublevelScore(
            level.levelId,
            sublevel.sublevelId
          );
          const isCheckpoint = sublevel.type === "assessment";

          return (
            <button
              key={sublevel.sublevelId}
              onClick={() => onSelectSublevel?.(sublevel)}
              className={`w-full p-4 rounded-lg border-2 transition-all text-left
                ${
                  isCheckpoint
                    ? "border-purple-500 bg-purple-50 hover:shadow-md dark:bg-purple-900/20 dark:border-purple-600"
                    : completed
                    ? "border-green-500 bg-green-50 hover:shadow-md dark:bg-green-900/20 dark:border-green-600"
                    : "border-gray-300 bg-white hover:border-gray-400 hover:shadow-md dark:bg-gray-800 dark:border-gray-700"
                }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                      ${
                        completed
                          ? "bg-green-500 text-white"
                          : "bg-gray-300 text-gray-700 dark:bg-gray-700 dark:text-gray-200"
                      }`}
                  >
                    {completed ? "✓" : index + 1}
                  </div>

                  <div>
                    <div className="font-medium text-gray-800 dark:text-white flex items-center gap-2">
                      {sublevel.title}
                      {isCheckpoint && <span className="text-lg">🎯</span>}
                    </div>

                    {sublevel.skills && (
                      <div className="text-xs text-gray-500 dark:text-gray-300 mt-1">
                        {sublevel.skills.join(", ")}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {score !== null && (
                    <div
                      className={`px-2 py-1 rounded text-xs font-medium
                        ${
                          score >= 80
                            ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300"
                        }`}
                    >
                      {score}%
                    </div>
                  )}
                  <span className="text-gray-400 dark:text-gray-500">→</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}
