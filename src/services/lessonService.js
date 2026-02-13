// src/services/lessonService.js
import courseData from '../data/course.json';

export const getLessonContent = (languageCode, sublevelId) => {
  const content = courseData.content[languageCode];
  
  if (!content) {
    return null;
  }

  return content[sublevelId] || null;
};

export const getAllLevels = () => {
  return courseData.roadmap.levels;
};

export const getLevelById = (levelId) => {
  return courseData.roadmap.levels.find(level => level.levelId === levelId);
};

export const getSublevelById = (levelId, sublevelId) => {
  const level = getLevelById(levelId);
  if (!level) return null;

  return level.sublevels.find(sub => sub.sublevelId === sublevelId);
};

export const getLanguageInfo = (languageCode) => {
  return courseData.languages[languageCode] || null;
};

export const getAllLanguages = () => {
  return Object.entries(courseData.languages).map(([code, info]) => ({
    code,
    ...info
  }));
};

export const getNextSublevel = (currentLevelId, currentSublevelId) => {
  const level = getLevelById(currentLevelId);
  if (!level) return null;

  const currentIndex = level.sublevels.findIndex(
    sub => sub.sublevelId === currentSublevelId
  );

  if (currentIndex === -1 || currentIndex === level.sublevels.length - 1) {
    const allLevels = getAllLevels();
    const currentLevelIndex = allLevels.findIndex(l => l.levelId === currentLevelId);
    
    if (currentLevelIndex < allLevels.length - 1) {
      const nextLevel = allLevels[currentLevelIndex + 1];
      return {
        levelId: nextLevel.levelId,
        sublevelId: nextLevel.sublevels[0].sublevelId
      };
    }
    
    return null;
  }

  return {
    levelId: currentLevelId,
    sublevelId: level.sublevels[currentIndex + 1].sublevelId
  };
};

export const getPreviousSublevel = (currentLevelId, currentSublevelId) => {
  const level = getLevelById(currentLevelId);
  if (!level) return null;

  const currentIndex = level.sublevels.findIndex(
    sub => sub.sublevelId === currentSublevelId
  );

  if (currentIndex <= 0) {
    const allLevels = getAllLevels();
    const currentLevelIndex = allLevels.findIndex(l => l.levelId === currentLevelId);
    
    if (currentLevelIndex > 0) {
      const prevLevel = allLevels[currentLevelIndex - 1];
      const lastSublevel = prevLevel.sublevels[prevLevel.sublevels.length - 1];
      return {
        levelId: prevLevel.levelId,
        sublevelId: lastSublevel.sublevelId
      };
    }
    
    return null;
  }

  return {
    levelId: currentLevelId,
    sublevelId: level.sublevels[currentIndex - 1].sublevelId
  };
};

export const isAssessment = (sublevelId) => {
  const allLevels = getAllLevels();
  
  for (const level of allLevels) {
    const sublevel = level.sublevels.find(s => s.sublevelId === sublevelId);
    if (sublevel) {
      return sublevel.type === 'assessment';
    }
  }
  
  return false;
};

export const getSublevelSkills = (levelId, sublevelId) => {
  const sublevel = getSublevelById(levelId, sublevelId);
  return sublevel?.skills || [];
};

export const getLevelProgress = (levelId, progress) => {
  const level = getLevelById(levelId);
  if (!level) return 0;

  const completedSublevels = level.sublevels.filter(
    sub => progress[sub.sublevelId]?.completed
  ).length;

  return Math.round((completedSublevels / level.sublevels.length) * 100);
};