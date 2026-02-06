/**
 * Score a single question
 * @param {string} userAnswer - User's answer
 * @param {string} correctAnswer - Correct answer
 * @param {Object} options - Additional scoring options
 * @returns {Object} - { isCorrect, score }
 */
export function scoreQuestion(userAnswer, correctAnswer, options = {}) {
  const { caseSensitive = false, trimWhitespace = true } = options;

  let userAns = userAnswer;
  let correctAns = correctAnswer;

  if (trimWhitespace) {
    userAns = userAns.trim();
    correctAns = correctAns.trim();
  }

  if (!caseSensitive) {
    userAns = userAns.toLowerCase();
    correctAns = correctAns.toLowerCase();
  }

  const isCorrect = userAns === correctAns;

  return {
    isCorrect,
    score: isCorrect ? 100 : 0
  };
}

/**
 * Score multiple choice question
 * @param {string} selectedOption - User's selected option
 * @param {string} correctOption - Correct option
 * @returns {Object} - { isCorrect, score }
 */
export function scoreMCQ(selectedOption, correctOption) {
  const isCorrect = selectedOption === correctOption;
  return {
    isCorrect,
    score: isCorrect ? 100 : 0
  };
}

/**
 * Calculate overall score from multiple questions
 * @param {Array} results - Array of { isCorrect, score } objects
 * @returns {number} - Overall percentage score
 */
export function calculateOverallScore(results) {
  if (!results || results.length === 0) return 0;

  const totalQuestions = results.length;
  const correctAnswers = results.filter(r => r.isCorrect).length;

  return Math.round((correctAnswers / totalQuestions) * 100);
}

/**
 * Track skill performance from question results
 * @param {Array} questions - Array of question objects with skill info
 * @param {Array} results - Array of scoring results
 * @returns {Object} - Skill performance map { skill: { total, correct, accuracy } }
 */
export function trackSkillPerformance(questions, results) {
  const skillMap = {};

  questions.forEach((question, index) => {
    const result = results[index];
    const skills = question.skills || [];

    skills.forEach(skill => {
      if (!skillMap[skill]) {
        skillMap[skill] = { total: 0, correct: 0, accuracy: 0 };
      }

      skillMap[skill].total += 1;
      if (result.isCorrect) {
        skillMap[skill].correct += 1;
      }
    });
  });

  // Calculate accuracy for each skill
  Object.keys(skillMap).forEach(skill => {
    const { total, correct } = skillMap[skill];
    skillMap[skill].accuracy = total > 0 ? Math.round((correct / total) * 100) : 0;
  });

  return skillMap;
}

/**
 * Determine if checkpoint is passed
 * @param {number} score - Overall score
 * @param {number} passingScore - Required passing score
 * @returns {boolean} - Whether checkpoint is passed
 */
export function checkpointPassed(score, passingScore = 80) {
  return score >= passingScore;
}

/**
 * Calculate XP earned based on performance
 * @param {number} score - Overall score
 * @param {boolean} isCheckpoint - Whether this is a checkpoint
 * @param {number} questionsCount - Number of questions
 * @returns {number} - XP earned
 */
export function calculateXP(score, isCheckpoint = false, questionsCount = 0) {
  let baseXP = 10;

  // More XP for checkpoints
  if (isCheckpoint) {
    baseXP = 50;
  }

  // Bonus XP for perfect scores
  let bonus = 0;
  if (score === 100) {
    bonus = isCheckpoint ? 50 : 20;
  } else if (score >= 90) {
    bonus = isCheckpoint ? 25 : 10;
  }

  // Scale by number of questions
  const questionMultiplier = Math.max(1, Math.floor(questionsCount / 5));

  return (baseXP + bonus) * questionMultiplier;
}

/**
 * Validate answer format for different question types
 * @param {string} answer - User's answer
 * @param {string} type - Question type
 * @returns {boolean} - Whether answer is valid
 */
export function validateAnswer(answer, type = 'text') {
  if (!answer || answer.trim().length === 0) {
    return false;
  }

  switch (type) {
    case 'text':
    case 'recall':
      return answer.trim().length > 0;

    case 'mcq':
    case 'audio-word':
    case 'image-word':
      return answer !== null && answer !== undefined;

    default:
      return true;
  }
}

/**
 * Get feedback message based on score
 * @param {number} score - Overall score
 * @returns {string} - Feedback message
 */
export function getFeedbackMessage(score) {
  if (score === 100) {
    return 'Perfect! Outstanding work! 🌟';
  } else if (score >= 90) {
    return 'Excellent! Almost perfect! 🎉';
  } else if (score >= 80) {
    return 'Great job! Well done! 👏';
  } else if (score >= 70) {
    return 'Good effort! Keep practicing! 💪';
  } else if (score >= 60) {
    return 'Not bad! You can improve! 📚';
  } else {
    return 'Keep trying! Practice makes perfect! 🌱';
  }
}

/**
 * Calculate words learned from vocabulary practice
 * @param {Array} results - Array of question results
 * @param {Array} questions - Array of questions
 * @returns {number} - Number of new words learned
 */
export function calculateWordsLearned(results, questions) {
  // Count unique correct vocabulary answers
  const correctVocab = new Set();

  results.forEach((result, index) => {
    if (result.isCorrect) {
      const question = questions[index];
      if (question.skills && question.skills.includes('vocabulary')) {
        // Use question ID or word as unique identifier
        const wordId = question.word || question.id || index;
        correctVocab.add(wordId);
      }
    }
  });

  return correctVocab.size;
}