import courseData from "../data/course.json";

/* ---------- COURSE STRUCTURE ---------- */

export const getAllLevels = () => courseData.roadmap.levels;

export const getLevelById = (levelId) =>
  courseData.roadmap.levels.find(l => l.levelId === levelId);

/**
 * Get the required sublevel count for a level from course.json.
 * This is the single source of truth - never hardcode sublevel counts.
 */
export const getRequiredSublevelCount = (levelId) => {
  const level = getLevelById(levelId);
  return level ? level.sublevels.length : 0;
};

export const getPassingScore = () => 80;

/**
 * Get the previous level (level N-1) for a given level.
 * Returns null if level is not found or is the first level.
 */
const getPreviousLevel = (currentLevelId) => {
  const levels = getAllLevels();
  const currentIndex = levels.findIndex(l => l.levelId === currentLevelId);
  
  if (currentIndex <= 0) {
    return null; // First level or not found
  }
  
  return levels[currentIndex - 1];
};

/* ---------- UNLOCK LOGIC ---------- */

/**
 * Determine if a level is unlocked based on its unlock rule.
 * 
 * Rules:
 * - Level 1 (default) is always unlocked
 * - For "previousLevel" type: check the specified previous level
 * - For all other types (skillMastery, conversationMastery, etc.):
 *   ALSO require that level N-1 is completed (strict requirement)
 * 
 * Defensive checks:
 * - Missing progress data returns false (never silently fail)
 * - Invalid level IDs return false
 * - Previous level must be fully completed (all sublevels from course.json)
 */
export const isLevelUnlocked = (level, progress) => {
  // Defensive: ensure level and progress are valid
  if (!level || !progress || !progress.isLevelCompleted) {
    return false;
  }

  // Level 1 (default) is always unlocked
  if (!level.unlockRule || level.unlockRule.type === "default") {
    return true;
  }

  // Handle "previousLevel" type - use the specified levelId
  if (level.unlockRule.type === "previousLevel") {
    const prevLevelId = level.unlockRule.levelId;
    
    // Defensive: verify previous level exists in course.json
    const prevLevel = getLevelById(prevLevelId);
    if (!prevLevel) {
      return false; // Previous level not found - cannot unlock
    }
    
    // Get the required sublevel count from course.json (single source of truth)
    const requiredSublevels = getRequiredSublevelCount(prevLevelId);
    
    // Defensive: ensure we have a valid count
    if (requiredSublevels === 0) {
      return false; // No sublevels defined - cannot verify completion
    }

    // Level is unlocked ONLY if previous level has ALL sublevels completed
    return progress.isLevelCompleted(prevLevelId, requiredSublevels);
  }

  // For all other unlock rule types (skillMastery, conversationMastery, etc.):
  // Level N unlocks ONLY if Level N-1 is completed
  // This enforces the strict rule: "Level N unlocks if and only if Level N-1 is completed"
  const previousLevel = getPreviousLevel(level.levelId);
  
  // Defensive: if no previous level found, cannot unlock (except level-1 which is handled above)
  if (!previousLevel) {
    return false;
  }
  
  // Get the required sublevel count from course.json (single source of truth)
  const requiredSublevels = getRequiredSublevelCount(previousLevel.levelId);
  
  // Defensive: ensure we have a valid count
  if (requiredSublevels === 0) {
    return false; // No sublevels defined - cannot verify completion
  }

  // Level is unlocked ONLY if previous level (N-1) has ALL sublevels completed
  return progress.isLevelCompleted(previousLevel.levelId, requiredSublevels);
};
