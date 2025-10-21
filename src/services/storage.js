/**
 * Language-based progress tracking system
 * Each language maintains its own progress data
 */

const STORAGE_KEYS = {
  PROGRESS: "language_learner_progress",
  SELECTED_LANGUAGE: "selectedLanguage",
  LESSONS: "language_learner_lessons",
  TRANSLATIONS: "language_learner_translations",
  STREAK: "language_learner_streak",
};

/**
 * Get progress data for a specific language
 */
export function getProgress(languageCode) {
  try {
    const allProgress = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.PROGRESS) || "{}"
    );
    return (
      allProgress[languageCode] || {
        xp: 0,
        wordsLearned: 0,
        streak: 0,
        completedLevels: [],
        lastActiveDate: new Date().toISOString(),
      }
    );
  } catch (error) {
    console.error("Error loading progress:", error);
    return {
      xp: 0,
      wordsLearned: 0,
      streak: 0,
      completedLevels: [],
      lastActiveDate: new Date().toISOString(),
    };
  }
}

/**
 * Update progress for a specific language
 */
export function updateProgress(languageCode, newProgress) {
  try {
    const allProgress = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.PROGRESS) || "{}"
    );

    // Merge with existing progress
    const currentProgress = allProgress[languageCode] || {};
    const updatedProgress = {
      ...currentProgress,
      ...newProgress,
      lastActiveDate: new Date().toISOString(),
    };

    allProgress[languageCode] = updatedProgress;
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));

    return updatedProgress;
  } catch (error) {
    console.error("Error updating progress:", error);
    return newProgress;
  }
}

/**
 * Get all progress data for all languages
 */
export function getAllProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS) || "{}");
  } catch (error) {
    console.error("Error loading all progress:", error);
    return {};
  }
}

/**
 * Reset progress for a specific language
 */
export function resetProgress(languageCode) {
  try {
    const allProgress = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.PROGRESS) || "{}"
    );
    allProgress[languageCode] = {
      xp: 0,
      wordsLearned: 0,
      streak: 0,
      completedLevels: [],
      lastActiveDate: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));
  } catch (error) {
    console.error("Error resetting progress:", error);
  }
}

/**
 * Get selected language
 */
export function getSelectedLanguage() {
  try {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_LANGUAGE) || null;
  } catch (error) {
    console.error("Error loading selected language:", error);
    return null;
  }
}

/**
 * Set selected language
 */
export function setSelectedLanguage(languageCode) {
  try {
    localStorage.setItem(STORAGE_KEYS.SELECTED_LANGUAGE, languageCode);
  } catch (error) {
    console.error("Error setting selected language:", error);
  }
}

/**
 * Cache lessons for a language
 */
export function cacheLessons(languageCode, lessons) {
  try {
    const allLessons = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.LESSONS) || "{}"
    );
    allLessons[languageCode] = {
      data: lessons,
      timestamp: Date.now(),
    };
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(allLessons));
  } catch (error) {
    console.error("Error caching lessons:", error);
  }
}

/**
 * Get cached lessons for a language
 */
export function getCachedLessons(languageCode) {
  try {
    const allLessons = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.LESSONS) || "{}"
    );
    const languageLessons = allLessons[languageCode];

    if (!languageLessons) return null;

    // Check if cache is still valid (24 hours)
    const isExpired =
      Date.now() - languageLessons.timestamp > 24 * 60 * 60 * 1000;
    if (isExpired) {
      // Remove expired cache
      delete allLessons[languageCode];
      localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(allLessons));
      return null;
    }

    return languageLessons.data;
  } catch (error) {
    console.error("Error loading cached lessons:", error);
    return null;
  }
}

/**
 * Clear cached lessons for a specific language
 */
export function clearLanguageCache(languageCode) {
  try {
    const allLessons = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.LESSONS) || "{}"
    );
    delete allLessons[languageCode];
    localStorage.setItem(STORAGE_KEYS.LESSONS, JSON.stringify(allLessons));

    const allTranslations = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.TRANSLATIONS) || "{}"
    );
    delete allTranslations[languageCode];
    localStorage.setItem(
      STORAGE_KEYS.TRANSLATIONS,
      JSON.stringify(allTranslations)
    );

    console.log(`Cleared cache for ${languageCode}`);
  } catch (error) {
    console.error("Error clearing language cache:", error);
  }
}

/**
 * Cache translations for a language
 */
export function cacheTranslations(languageCode, translations) {
  try {
    const allTranslations = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.TRANSLATIONS) || "{}"
    );
    allTranslations[languageCode] = {
      data: translations,
      timestamp: Date.now(),
    };
    localStorage.setItem(
      STORAGE_KEYS.TRANSLATIONS,
      JSON.stringify(allTranslations)
    );
  } catch (error) {
    console.error("Error caching translations:", error);
  }
}

/**
 * Get cached translations for a language
 */
export function getCachedTranslations(languageCode) {
  try {
    const allTranslations = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.TRANSLATIONS) || "{}"
    );
    const languageTranslations = allTranslations[languageCode];

    if (!languageTranslations) return null;

    // Check if cache is still valid (7 days)
    const isExpired =
      Date.now() - languageTranslations.timestamp > 7 * 24 * 60 * 60 * 1000;
    if (isExpired) {
      // Remove expired cache
      delete allTranslations[languageCode];
      localStorage.setItem(
        STORAGE_KEYS.TRANSLATIONS,
        JSON.stringify(allTranslations)
      );
      return null;
    }

    return languageTranslations.data;
  } catch (error) {
    console.error("Error loading cached translations:", error);
    return null;
  }
}

/**
 * Check and update streak for a language
 */
export function checkStreak(languageCode) {
  try {
    const progress = getProgress(languageCode);
    const lastActiveDate = new Date(progress.lastActiveDate);
    const today = new Date();

    // Reset time to compare only dates
    lastActiveDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const daysDifference = Math.floor(
      (today - lastActiveDate) / (1000 * 60 * 60 * 24)
    );

    if (daysDifference === 1) {
      // Consecutive day - increment streak
      updateProgress(languageCode, { streak: progress.streak + 1 });
    } else if (daysDifference > 1) {
      // Streak broken - reset to 1
      updateProgress(languageCode, { streak: 1 });
    }
    // If daysDifference === 0, it's the same day, no change needed
  } catch (error) {
    console.error("Error checking streak:", error);
  }
}

/**
 * Get total XP across all languages
 */
export function getTotalXP() {
  try {
    const allProgress = getAllProgress();
    return Object.values(allProgress).reduce(
      (total, progress) => total + (progress.xp || 0),
      0
    );
  } catch (error) {
    console.error("Error calculating total XP:", error);
    return 0;
  }
}

/**
 * Get total words learned across all languages
 */
export function getTotalWordsLearned() {
  try {
    const allProgress = getAllProgress();
    return Object.values(allProgress).reduce(
      (total, progress) => total + (progress.wordsLearned || 0),
      0
    );
  } catch (error) {
    console.error("Error calculating total words learned:", error);
    return 0;
  }
}

/**
 * Get longest streak across all languages
 */
export function getLongestStreak() {
  try {
    const allProgress = getAllProgress();
    return Math.max(
      ...Object.values(allProgress).map((progress) => progress.streak || 0),
      0
    );
  } catch (error) {
    console.error("Error calculating longest streak:", error);
    return 0;
  }
}

// Legacy functions for backward compatibility
export function loadProgress() {
  return getProgress(getSelectedLanguage());
}
