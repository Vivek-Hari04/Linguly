const STORAGE_KEYS = {
  PROGRESS: 'language_learner_progress',
  SELECTED_LANGUAGE: 'selectedLanguage'
};

/**
 * Initialize default progress structure
 */
export function initializeProgress() {
  return {
    xp: 0,
    wordsLearned: 0,
    streak: 0,
    completedLevels: [],
    completedSublevels: [],
    skillAccuracy: {},
    lastActiveDate: new Date().toISOString()
  };
}

/**
 * Get progress data for a specific language
 */
export function getProgress(languageCode) {
  try {
    const allProgress = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.PROGRESS) || '{}'
    );
    return allProgress[languageCode] || initializeProgress();
  } catch (error) {
    console.error('Error loading progress:', error);
    return initializeProgress();
  }
}

/**
 * Update progress for a specific language
 */
export function updateProgress(languageCode, newProgress) {
  try {
    const allProgress = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.PROGRESS) || '{}'
    );

    const currentProgress = allProgress[languageCode] || initializeProgress();
    const updatedProgress = {
      ...currentProgress,
      ...newProgress,
      lastActiveDate: new Date().toISOString()
    };

    allProgress[languageCode] = updatedProgress;
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));

    return updatedProgress;
  } catch (error) {
    console.error('Error updating progress:', error);
    return newProgress;
  }
}

/**
 * Get all progress data for all languages
 */
export function getAllProgress() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.PROGRESS) || '{}');
  } catch (error) {
    console.error('Error loading all progress:', error);
    return {};
  }
}

/**
 * Reset progress for a specific language
 */
export function resetProgress(languageCode) {
  try {
    const allProgress = JSON.parse(
      localStorage.getItem(STORAGE_KEYS.PROGRESS) || '{}'
    );
    allProgress[languageCode] = initializeProgress();
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(allProgress));
  } catch (error) {
    console.error('Error resetting progress:', error);
  }
}

/**
 * Get selected language
 */
export function getSelectedLanguage() {
  try {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_LANGUAGE) || null;
  } catch (error) {
    console.error('Error loading selected language:', error);
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
    console.error('Error setting selected language:', error);
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

    lastActiveDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const daysDifference = Math.floor(
      (today - lastActiveDate) / (1000 * 60 * 60 * 24)
    );

    if (daysDifference === 1) {
      updateProgress(languageCode, { streak: progress.streak + 1 });
    } else if (daysDifference > 1) {
      updateProgress(languageCode, { streak: 1 });
    }
  } catch (error) {
    console.error('Error checking streak:', error);
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
    console.error('Error calculating total XP:', error);
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
    console.error('Error calculating total words learned:', error);
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
    console.error('Error calculating longest streak:', error);
    return 0;
  }
}