// src/services/progressService.js
const PROGRESS_STORAGE_KEY = 'language_learner_progress';
const VERSION_KEY = 'progress_version';
const CURRENT_VERSION = 1;

export const saveProgress = (languageCode, progressData) => {
  try {
    const allProgress = loadAllProgress();
    
    allProgress[languageCode] = {
      ...progressData,
      lastUpdated: new Date().toISOString(),
      version: CURRENT_VERSION
    };

    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(allProgress));
    localStorage.setItem(VERSION_KEY, CURRENT_VERSION.toString());
    
    return true;
  } catch (error) {
    console.error('Error saving progress:', error);
    return false;
  }
};

export const loadProgress = (languageCode) => {
  try {
    const allProgress = loadAllProgress();
    const languageProgress = allProgress[languageCode];

    if (!languageProgress) {
      return initializeProgress();
    }

    if (languageProgress.version !== CURRENT_VERSION) {
      return migrateProgress(languageProgress);
    }

    return languageProgress;
  } catch (error) {
    console.error('Error loading progress:', error);
    return initializeProgress();
  }
};

export const loadAllProgress = () => {
  try {
    const stored = localStorage.getItem(PROGRESS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading all progress:', error);
    return {};
  }
};

export const initializeProgress = () => {
  return {
    sublevels: {},
    skills: {},
    stats: {
      totalQuestions: 0,
      correctAnswers: 0,
      streak: 0,
      lastStudyDate: null
    },
    achievements: [],
    version: CURRENT_VERSION,
    lastUpdated: new Date().toISOString()
  };
};

export const migrateProgress = (oldProgress) => {
  const migrated = {
    ...initializeProgress(),
    ...oldProgress,
    version: CURRENT_VERSION
  };

  return migrated;
};

export const updateSublevelProgress = (languageCode, sublevelId, data) => {
  const progress = loadProgress(languageCode);

  progress.sublevels[sublevelId] = {
    ...progress.sublevels[sublevelId],
    ...data,
    lastAttempt: new Date().toISOString()
  };

  if (data.score !== undefined) {
    progress.sublevels[sublevelId].bestScore = Math.max(
      progress.sublevels[sublevelId].bestScore || 0,
      data.score
    );
  }

  saveProgress(languageCode, progress);
  
  return progress;
};

export const updateSkillProgress = (languageCode, skill, accuracy) => {
  const progress = loadProgress(languageCode);

  if (!progress.skills[skill]) {
    progress.skills[skill] = {
      attempts: 0,
      totalAccuracy: 0,
      averageAccuracy: 0
    };
  }

  const skillData = progress.skills[skill];
  skillData.attempts += 1;
  skillData.totalAccuracy += accuracy;
  skillData.averageAccuracy = skillData.totalAccuracy / skillData.attempts;

  saveProgress(languageCode, progress);
  
  return skillData;
};

export const getSublevelProgress = (languageCode, sublevelId) => {
  const progress = loadProgress(languageCode);
  return progress.sublevels[sublevelId] || null;
};

export const getSkillProgress = (languageCode, skill) => {
  const progress = loadProgress(languageCode);
  return progress.skills[skill] || null;
};

export const calculateOverallProgress = (languageCode) => {
  const progress = loadProgress(languageCode);
  const completedSublevels = Object.values(progress.sublevels).filter(
    sub => sub.completed
  ).length;

  // TODO: Get total sublevels from course data
  const totalSublevels = 30;

  return Math.round((completedSublevels / totalSublevels) * 100);
};

export const updateStats = (languageCode, correct, total) => {
  const progress = loadProgress(languageCode);

  progress.stats.totalQuestions += total;
  progress.stats.correctAnswers += correct;

  const today = new Date().toDateString();
  const lastStudy = progress.stats.lastStudyDate 
    ? new Date(progress.stats.lastStudyDate).toDateString()
    : null;

  if (lastStudy === today) {
    // Same day, streak continues
  } else if (lastStudy === new Date(Date.now() - 86400000).toDateString()) {
    // Previous day, increment streak
    progress.stats.streak += 1;
  } else {
    // Streak broken
    progress.stats.streak = 1;
  }

  progress.stats.lastStudyDate = new Date().toISOString();

  saveProgress(languageCode, progress);
  
  return progress.stats;
};

export const clearProgress = (languageCode) => {
  const allProgress = loadAllProgress();
  delete allProgress[languageCode];
  
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(allProgress));
  
  return true;
};

export const exportProgress = (languageCode) => {
  const progress = loadProgress(languageCode);
  const dataStr = JSON.stringify(progress, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  return URL.createObjectURL(dataBlob);
};

export const importProgress = (languageCode, jsonData) => {
  try {
    const imported = JSON.parse(jsonData);
    
    if (imported.version !== CURRENT_VERSION) {
      const migrated = migrateProgress(imported);
      saveProgress(languageCode, migrated);
      return { success: true, migrated: true };
    }

    saveProgress(languageCode, imported);
    return { success: true, migrated: false };
  } catch (error) {
    console.error('Error importing progress:', error);
    return { success: false, error: error.message };
  }
};