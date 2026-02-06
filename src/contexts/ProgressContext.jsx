import { createContext, useContext, useState, useEffect } from "react";
import { useLanguage } from "./LanguageContext";
import courseData from "../data/course.json";
import { loadProgress, saveProgress } from "../services/progressService";

const ProgressContext = createContext(null);

export const useProgress = () => {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error("useProgress must be used inside ProgressProvider");
  }
  return ctx;
};

export function ProgressProvider({ children }) {
  const { selectedLanguage } = useLanguage();

  const [progress, setProgress] = useState({
    xp: 0,
    levels: {}
  });

  /* ---------------- LOAD PER LANGUAGE ---------------- */

  useEffect(() => {
    if (!selectedLanguage) return;

    const saved = loadProgress(selectedLanguage);

    // Convert service format → your UI format
    const levels = {};

    Object.entries(saved.sublevels || {}).forEach(([subId, data]) => {
      const [levelId] = subId.split(":"); // assume id format level:sub
      if (!levels[levelId]) levels[levelId] = { sublevels: {} };

      levels[levelId].sublevels[subId] = {
        completed: data.completed,
        score: data.bestScore || data.score || 0
      };
    });

    setProgress({
      xp: saved.stats?.xp || 0,
      levels
    });
  }, [selectedLanguage]);

  /* ---------------- SAVE ---------------- */

  useEffect(() => {
    if (!selectedLanguage) return;

    const sublevels = {};

    Object.entries(progress.levels).forEach(([levelId, level]) => {
      Object.entries(level.sublevels || {}).forEach(([subId, data]) => {
        sublevels[subId] = {
          completed: data.completed,
          score: data.score
        };
      });
    });

    saveProgress(selectedLanguage, {
      sublevels,
      stats: { xp: progress.xp }
    });
  }, [progress, selectedLanguage]);

  /* ---------- HELPERS ---------- */

  const getLevelProgress = (levelId) =>
    progress.levels[levelId] || { sublevels: {} };

  const getSublevelProgress = (levelId, sublevelId) =>
    getLevelProgress(levelId).sublevels[sublevelId];

  const getRequiredSublevelCount = (levelId) => {
    const level = courseData.roadmap.levels.find(l => l.levelId === levelId);
    return level ? level.sublevels.length : 0;
  };

  /* ---------- READ ---------- */

  const isSublevelCompleted = (levelId, sublevelId) =>
    !!getSublevelProgress(levelId, sublevelId)?.completed;

  const getSublevelScore = (levelId, sublevelId) =>
    getSublevelProgress(levelId, sublevelId)?.score ?? null;

  const getLevelScore = (levelId) => {
    const sublevels = Object.values(
      getLevelProgress(levelId).sublevels
    );

    if (sublevels.length === 0) return null;

    const avg =
      sublevels.reduce((sum, s) => sum + (s.score || 0), 0) /
      sublevels.length;

    return Math.round(avg);
  };

  const isLevelCompleted = (levelId) => {
    const requiredCount = getRequiredSublevelCount(levelId);
    const levelProgress = getLevelProgress(levelId);
    const sublevels = Object.values(levelProgress.sublevels);

    if (sublevels.length !== requiredCount) return false;
    return sublevels.every(s => s.completed === true);
  };

  /* ---------- WRITE ---------- */

  const completeSublevel = (levelId, sublevelId, score = 100) => {
    setProgress(prev => ({
      ...prev,
      levels: {
        ...prev.levels,
        [levelId]: {
          sublevels: {
            ...(prev.levels[levelId]?.sublevels || {}),
            [sublevelId]: {
              completed: true,
              score
            }
          }
        }
      }
    }));
  };

  const addXP = (amount) => {
    setProgress(prev => ({
      ...prev,
      xp: prev.xp + amount
    }));
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        addXP,
        completeSublevel,
        isSublevelCompleted,
        getSublevelScore,
        getLevelScore,
        isLevelCompleted
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}
